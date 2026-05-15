/**
 * theOddsApiProvider — live odds adapter for The Odds API (v4).
 *
 * Free tier: 500 requests / month.
 * Quota is preserved by:
 *   1. Caching /sports (active season list) for 24 h
 *   2. Caching each sport's odds for pollIntervalMinutes (default 240 min)
 *   3. Skipping sports not currently in-season per the /sports endpoint
 *   4. Capping API calls per invocation at MAX_SPORTS_PER_CALL
 *
 * Activation:
 *   THE_ODDS_API_KEY=your_key  (preferred)
 *   ODDS_API_KEY=your_key      (legacy alias)
 *
 * Compliance:
 *   Sports Market OS reads odds for market intelligence only.
 *   No bet placement, no order routing, no custody of funds.
 */

import { normalizeProviderOdds, formatOddsTimestamp } from "./oddsNormalizer";
import { ODDS_API_CONFIG, TENNIS_FALLBACK_KEYS } from "./config";
import type { OddsSnapshot, SportType, DataMode } from "../types";

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_URL = "https://api.the-odds-api.com/v4";

/** Maximum live API calls per invocation of fetchOddsApiSnapshots(). */
const MAX_SPORTS_PER_CALL = 4;

const MAX_EVENTS_PER_SPORT = 2;
const MAX_OUTCOMES_PER_EVENT = 3;

const SPORTS_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// ─── The Odds API payload types ───────────────────────────────────────────────

interface OddsApiSport {
  key: string;
  active: boolean;
  title: string;
}

interface OddsApiOutcome {
  name: string;
  price: number;
}

interface OddsApiMarket {
  key: string;
  last_update: string;
  outcomes: OddsApiOutcome[];
}

interface OddsApiBookmaker {
  key: string;
  title: string;
  last_update: string;
  markets: OddsApiMarket[];
}

interface OddsApiEvent {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: OddsApiBookmaker[];
}

// ─── Module-level state ───────────────────────────────────────────────────────

interface QuotaState {
  remaining: number | null;
  used: number | null;
  lastSync: string | null; // ISO timestamp
}

let quotaState: QuotaState = { remaining: null, used: null, lastSync: null };

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

/** Per-sport odds cache. Key: `${sportKey}:${markets}:${regions}` */
const oddsCache = new Map<string, CacheEntry<OddsSnapshot[]>>();

/** Active sports list cache (24 h). */
let sportsCache: CacheEntry<Set<string>> | null = null;

// ─── Quota state accessor (used by /api/live/odds-quota route) ────────────────

export function getQuotaState(): QuotaState {
  return { ...quotaState };
}

// ─── Key and mode resolution ──────────────────────────────────────────────────

export function getOddsApiKey(): string | null {
  return process.env.THE_ODDS_API_KEY ?? process.env.ODDS_API_KEY ?? null;
}

export function getOddsMode(): DataMode {
  const key = getOddsApiKey();
  if (!key) return "simulation";
  const modeEnv = process.env.NEXT_PUBLIC_ODDS_MODE;
  if (modeEnv === "live" || modeEnv === "hybrid") return modeEnv;
  return "live"; // default when key present
}

// ─── Core fetch with header capture ──────────────────────────────────────────

interface FetchResult<T> {
  data: T | null;
  error: string | null;
}

async function fetchWithHeaders<T>(url: string): Promise<FetchResult<T>> {
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "fetch failed" };
  }

  // Capture quota headers on every response
  const remaining = res.headers.get("x-requests-remaining");
  const used = res.headers.get("x-requests-used");
  if (remaining !== null || used !== null) {
    quotaState = {
      remaining: remaining !== null ? Number(remaining) : quotaState.remaining,
      used: used !== null ? Number(used) : quotaState.used,
      lastSync: new Date().toISOString(),
    };
  }

  if (res.status === 401) {
    return { data: null, error: "401 Unauthorized — check THE_ODDS_API_KEY" };
  }
  if (res.status === 422) {
    return { data: null, error: `422 Unprocessable — sport may be out of season (${url})` };
  }
  if (res.status === 429) {
    return { data: null, error: "429 Rate limit reached — quota exhausted for this period" };
  }
  if (res.status >= 500) {
    return { data: null, error: `${res.status} Server error from The Odds API` };
  }
  if (!res.ok) {
    return { data: null, error: `${res.status} Unexpected response` };
  }

  try {
    const data = (await res.json()) as T;
    return { data, error: null };
  } catch {
    return { data: null, error: "Failed to parse response JSON" };
  }
}

// ─── Active sports list (24 h cached) ────────────────────────────────────────

async function getActiveSportKeys(apiKey: string): Promise<Set<string>> {
  const now = Date.now();
  if (sportsCache && sportsCache.expiresAt > now) {
    return sportsCache.data;
  }

  const url = `${BASE_URL}/sports?apiKey=${encodeURIComponent(apiKey)}`;
  const { data, error } = await fetchWithHeaders<OddsApiSport[]>(url);

  if (error || !data) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[OddsAPI] /sports fetch failed:", error);
    }
    // On failure, return the full configured set so we still attempt fetches
    return new Set(ODDS_API_CONFIG.sports);
  }

  const activeKeys = new Set(
    data.filter((s) => s.active).map((s) => s.key)
  );

  sportsCache = { data: activeKeys, expiresAt: now + SPORTS_CACHE_TTL_MS };
  return activeKeys;
}

// ─── Sport → SportType mapping ────────────────────────────────────────────────

const SPORT_KEY_TO_TYPE: Record<string, SportType> = {
  tennis_atp_french_open:    "Tennis",
  tennis_atp_wimbledon:      "Tennis",
  tennis_atp:                "Tennis",
  tennis_wta:                "Tennis",
  soccer_epl:                "Football",
  soccer_uefa_champs_league: "Football",
  americanfootball_nfl:      "NFL",
  basketball_nba:            "NBA",
  mma_mixed_martial_arts:    "UFC",
};

// ─── Single-sport fetch with cache ────────────────────────────────────────────

async function fetchSportOdds(
  apiKey: string,
  sportKey: string,
  sport: SportType
): Promise<OddsSnapshot[]> {
  const { markets, regions, oddsFormat, pollIntervalMinutes } = ODDS_API_CONFIG;
  const cacheKey = `${sportKey}:${markets}:${regions}`;
  const now = Date.now();
  const ttlMs = pollIntervalMinutes * 60 * 1000;

  const cached = oddsCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[OddsAPI] cache hit: ${cacheKey}`);
    }
    return cached.data;
  }

  const url = new URL(`${BASE_URL}/sports/${sportKey}/odds/`);
  url.searchParams.set("apiKey", apiKey);
  url.searchParams.set("regions", regions);
  url.searchParams.set("markets", markets);
  url.searchParams.set("oddsFormat", oddsFormat);
  url.searchParams.set("dateFormat", "iso");

  const { data, error } = await fetchWithHeaders<OddsApiEvent[]>(url.toString());

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[OddsAPI] ${sportKey} error:`, error);
    }
    return [];
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    oddsCache.set(cacheKey, { data: [], expiresAt: now + ttlMs });
    return [];
  }

  const snapshots: OddsSnapshot[] = [];

  for (const event of data.slice(0, MAX_EVENTS_PER_SPORT)) {
    const bookmaker = event.bookmakers[0];
    if (!bookmaker) continue;

    const market = bookmaker.markets.find((m) => m.key === "h2h") ?? bookmaker.markets[0];
    if (!market) continue;

    const marketName = `${event.home_team} vs ${event.away_team}`;
    const ts = formatOddsTimestamp(bookmaker.last_update);
    const maxOutcomes = Math.min(market.outcomes.length, MAX_OUTCOMES_PER_EVENT);

    for (let i = 0; i < maxOutcomes; i++) {
      const outcome = market.outcomes[i];
      snapshots.push(
        normalizeProviderOdds(
          {
            id: event.id,
            sport,
            market: marketName,
            selection: outcome.name,
            currentPrice: outcome.price,
            source: bookmaker.title,
            timestamp: ts,
            providerMode: "live",
          },
          snapshots.length
        )
      );
    }
  }

  oddsCache.set(cacheKey, { data: snapshots, expiresAt: now + ttlMs });
  return snapshots;
}

// ─── Tennis fallback resolution ───────────────────────────────────────────────

/**
 * Resolves a configured sport key against the active key set.
 * If the specific tournament key is not active, tries TENNIS_FALLBACK_KEYS.
 * Returns the first active key found, or null.
 */
function resolveActiveKey(
  configuredKey: string,
  activeKeys: Set<string>
): string | null {
  if (activeKeys.has(configuredKey)) return configuredKey;

  // Tennis tournament fallback
  if (configuredKey.startsWith("tennis_")) {
    for (const fallback of TENNIS_FALLBACK_KEYS) {
      if (activeKeys.has(fallback)) return fallback;
    }
  }

  return null;
}

// ─── Multi-sport fetch (exported) ─────────────────────────────────────────────

export async function fetchOddsApiSnapshots(): Promise<OddsSnapshot[] | null> {
  const apiKey = getOddsApiKey();
  if (!apiKey) return null;

  const activeKeys = await getActiveSportKeys(apiKey);

  // Build fetch queue from config, deduplicated (tennis fallbacks may collapse)
  const seen = new Set<string>();
  const queue: Array<{ sportKey: string; sport: SportType }> = [];

  for (const configuredKey of ODDS_API_CONFIG.sports) {
    if (queue.length >= MAX_SPORTS_PER_CALL) break;
    const resolvedKey = resolveActiveKey(configuredKey, activeKeys);
    if (!resolvedKey || seen.has(resolvedKey)) continue;
    seen.add(resolvedKey);
    const sport = SPORT_KEY_TO_TYPE[resolvedKey] ?? "Football";
    queue.push({ sportKey: resolvedKey, sport });
  }

  if (queue.length === 0) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[OddsAPI] No active sports matched — returning null");
    }
    return null;
  }

  const results: OddsSnapshot[] = [];

  for (const { sportKey, sport } of queue) {
    try {
      const items = await fetchSportOdds(apiKey, sportKey, sport);
      results.push(...items);
    } catch {
      // individual sport failure is non-fatal
    }
  }

  return results.length > 0 ? results : null;
}
