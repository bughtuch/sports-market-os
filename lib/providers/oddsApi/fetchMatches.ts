/**
 * ⚠️  DISABLED — V1 PURE POLYMARKET RELEASE
 *
 * This file is part of the Odds API integration disabled in Sprint V1.
 * Not imported or called from any active code path.
 * Do not re-enable without a full sprint plan.
 */

/**
 * fetchMatches — dedicated Odds API multi-bookmaker match fetcher.
 *
 * Returns NormalizedOddsMatch[] with full bookmaker depth.
 * Used by the signal engine (no event cap) and /api/odds/games (public route).
 *
 * Separate from theOddsApiProvider.ts which is used by the terminal's live feed
 * (capped at 2 events per sport for quota conservation).
 *
 * Quota conservation here:
 *   - Per-sport-key 60-minute in-memory cache
 *   - Skips keys that return 422 (out of season)
 *   - Never retries on error
 */

import { getOddsApiKey } from "../odds/theOddsApiProvider";
import { oddsKeyToSport } from "./sportKeys";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface OddsMatchOutcome {
  bookmaker_key: string;
  bookmaker_title: string;
  selection: string;
  price: number;         // decimal odds
  implied_prob: number;  // 0-100
}

export interface NormalizedOddsMatch {
  id: string;              // Odds API event ID
  sport: string;           // DB sport key e.g. "tennis"
  sport_key: string;       // Odds API sport key e.g. "tennis_atp_french_open"
  home_team: string;
  away_team: string;
  commence_time: string;   // ISO
  outcomes: OddsMatchOutcome[];
  bookmaker_count: number;
}

// ── Raw API types ─────────────────────────────────────────────────────────────

interface ApiOutcome { name: string; price: number; }
interface ApiMarket  { key: string; outcomes: ApiOutcome[]; }
interface ApiBookmaker { key: string; title: string; markets: ApiMarket[]; }

interface ApiEvent {
  id: string;
  sport_key: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: ApiBookmaker[];
}

// ── Module cache (60 min per sport key) ──────────────────────────────────────

interface CacheEntry {
  data: NormalizedOddsMatch[];
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 60 minutes

// ── Core fetch ────────────────────────────────────────────────────────────────

async function fetchOneSportKey(
  apiKey: string,
  sportKey: string
): Promise<NormalizedOddsMatch[]> {
  const cached = cache.get(sportKey);
  if (cached && cached.expiresAt > Date.now()) return cached.data;

  const sport = oddsKeyToSport(sportKey);
  if (!sport) return [];

  const url = new URL(`https://api.the-odds-api.com/v4/sports/${sportKey}/odds/`);
  url.searchParams.set("apiKey", apiKey);
  url.searchParams.set("regions", "uk,eu");
  url.searchParams.set("markets", "h2h");
  url.searchParams.set("oddsFormat", "decimal");
  url.searchParams.set("dateFormat", "iso");

  console.log(`[fetchMatches] Fetching ${sportKey}…`);

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      signal: AbortSignal.timeout(10_000),
      headers: { Accept: "application/json" },
    });
  } catch (err) {
    console.warn(`[fetchMatches] ${sportKey} fetch error:`, err);
    cache.set(sportKey, { data: [], expiresAt: Date.now() + CACHE_TTL_MS });
    return [];
  }

  console.log(`[fetchMatches] ${sportKey}: HTTP ${res.status} ${res.statusText}`);

  if (res.status === 422 || res.status === 404) {
    // Out of season — cache empty for 60 min to avoid repeat calls
    console.log(`[fetchMatches] ${sportKey}: ${res.status} (out of season or not found)`);
    cache.set(sportKey, { data: [], expiresAt: Date.now() + CACHE_TTL_MS });
    return [];
  }

  if (!res.ok) {
    console.warn(`[fetchMatches] ${sportKey}: ${res.status}`);
    return [];
  }

  let events: ApiEvent[];
  try {
    events = await res.json();
  } catch {
    return [];
  }

  if (!Array.isArray(events)) return [];

  const matches: NormalizedOddsMatch[] = [];

  for (const event of events) {
    if (!event.bookmakers || event.bookmakers.length === 0) continue;

    const outcomes: OddsMatchOutcome[] = [];

    for (const bk of event.bookmakers) {
      const h2h = bk.markets.find((m) => m.key === "h2h");
      if (!h2h) continue;
      for (const outcome of h2h.outcomes) {
        if (outcome.price <= 1) continue;
        outcomes.push({
          bookmaker_key: bk.key,
          bookmaker_title: bk.title,
          selection: outcome.name,
          price: outcome.price,
          implied_prob: Math.round((1 / outcome.price) * 10000) / 100,
        });
      }
    }

    if (outcomes.length === 0) continue;

    const bookmakerCount = new Set(outcomes.map((o) => o.bookmaker_key)).size;

    matches.push({
      id: event.id,
      sport,
      sport_key: sportKey,
      home_team: event.home_team,
      away_team: event.away_team,
      commence_time: event.commence_time,
      outcomes,
      bookmaker_count: bookmakerCount,
    });
  }

  console.log(`[fetchMatches] ${sportKey}: ${matches.length} matches, ${events.length} raw events`);
  cache.set(sportKey, { data: matches, expiresAt: Date.now() + CACHE_TTL_MS });
  return matches;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Fetches matches for a list of Odds API sport keys.
 * Tries each key in order, merges results, deduplicates by event ID.
 * Returns empty array if no API key configured.
 */
export async function fetchMatchesBySportKeys(
  sportKeys: string[]
): Promise<NormalizedOddsMatch[]> {
  const apiKey = getOddsApiKey();
  // Diagnostic: confirm key presence + prefix (safe — never logs full key)
  console.log(`[fetchMatches] API key present: ${!!apiKey}, length: ${apiKey?.length ?? 0}, prefix: ${apiKey?.slice(0, 4) ?? "null"}`);
  if (!apiKey) {
    console.warn("[fetchMatches] No Odds API key configured — checked THE_ODDS_API_KEY and ODDS_API_KEY");
    return [];
  }

  const results = await Promise.all(
    sportKeys.map((k) => fetchOneSportKey(apiKey, k).catch(() => [] as NormalizedOddsMatch[]))
  );

  // Merge and deduplicate by event ID
  const seen = new Set<string>();
  const merged: NormalizedOddsMatch[] = [];
  for (const batch of results) {
    for (const m of batch) {
      if (!seen.has(m.id)) {
        seen.add(m.id);
        merged.push(m);
      }
    }
  }

  console.log(`[fetchMatches] Total after merge+dedup: ${merged.length} matches`);
  return merged;
}

/**
 * Fetch upcoming matches for a DB sport key.
 * Filters to matches that haven't started yet (or started within the last 3h).
 */
export async function fetchMatchesForSport(sport: string): Promise<NormalizedOddsMatch[]> {
  const { getOddsApiKeysForSport } = await import("./sportKeys");
  const keys = getOddsApiKeysForSport(sport);
  if (keys.length === 0) return [];
  const all = await fetchMatchesBySportKeys(keys);
  // Include upcoming + recently started (within 3h)
  const cutoff = Date.now() - 3 * 60 * 60 * 1000;
  return all.filter((m) => new Date(m.commence_time).getTime() > cutoff);
}
