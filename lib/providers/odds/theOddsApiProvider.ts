/**
 * theOddsApiProvider — live odds adapter for The Odds API (v4).
 *
 * Free tier limits (the-odds-api.com):
 * - 500 requests / month
 * - Supported: soccer, basketball, american football, mma
 * - NOT supported: tennis, horse racing (stays simulated)
 *
 * Activation:
 *   THE_ODDS_API_KEY=your_key  (in .env.local)
 *   or
 *   ODDS_API_KEY=your_key
 *
 * Compliance:
 *   Sports Market OS reads odds for market intelligence only.
 *   No bet placement, no order routing, no custody of funds.
 */

import { safeFetch } from "../safeFetch";
import { normalizeProviderOdds, formatOddsTimestamp } from "./oddsNormalizer";
import type { OddsSnapshot, SportType, DataMode } from "../types";

// ─── Config ───────────────────────────────────────────────────────────────────

const BASE_URL = "https://api.the-odds-api.com/v4/sports";

/**
 * Sports in priority order. Fetch stops once TARGET_SNAPSHOTS is reached
 * or MAX_SPORTS_TO_FETCH sports have been tried — to conserve free-tier quota.
 */
const SPORT_CONFIGS: Array<{ apiKey: string; sport: SportType }> = [
  { apiKey: "soccer_epl",             sport: "Football" },
  { apiKey: "basketball_nba",         sport: "NBA" },
  { apiKey: "americanfootball_nfl",   sport: "NFL" },
  { apiKey: "mma_mixed_martial_arts", sport: "UFC" },
];

const MAX_SPORTS_TO_FETCH = 3;   // API calls per route invocation
const MAX_EVENTS_PER_SPORT = 2;  // events (matches) per sport
const MAX_OUTCOMES_PER_EVENT = 3; // outcomes (selections) per match

// ─── The Odds API payload types ───────────────────────────────────────────────

interface OddsApiOutcome {
  name: string;
  price: number; // decimal odds
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

// ─── Key and mode resolution ──────────────────────────────────────────────────

export function getOddsApiKey(): string | null {
  return process.env.THE_ODDS_API_KEY ?? process.env.ODDS_API_KEY ?? null;
}

export function getOddsMode(): DataMode {
  const key = getOddsApiKey();
  if (!key) return "simulation";
  const modeEnv = process.env.NEXT_PUBLIC_ODDS_MODE;
  if (modeEnv === "live" || modeEnv === "hybrid") return modeEnv;
  return "hybrid"; // default when key present: hybrid (live + simulation pad)
}

// ─── Single-sport fetch ───────────────────────────────────────────────────────

async function fetchSportOdds(
  apiKey: string,
  sportKey: string,
  sport: SportType
): Promise<OddsSnapshot[]> {
  const url = new URL(`${BASE_URL}/${sportKey}/odds/`);
  url.searchParams.set("apiKey", apiKey);
  url.searchParams.set("regions", "eu");
  url.searchParams.set("markets", "h2h");
  url.searchParams.set("oddsFormat", "decimal");
  url.searchParams.set("dateFormat", "iso");

  const result = await safeFetch<OddsApiEvent[]>(url.toString(), {
    timeoutMs: 6000,
    retries: 0, // no retry on odds — conserve quota
  });

  if (result.error || !result.data || !Array.isArray(result.data)) return [];
  if (result.data.length === 0) return [];

  const snapshots: OddsSnapshot[] = [];

  for (const event of result.data.slice(0, MAX_EVENTS_PER_SPORT)) {
    const bookmaker = event.bookmakers[0];
    if (!bookmaker) continue;

    const market = bookmaker.markets.find((m) => m.key === "h2h");
    if (!market) continue;

    const marketName = `${event.home_team} vs ${event.away_team}`;
    const ts = formatOddsTimestamp(bookmaker.last_update);

    const maxOutcomes = Math.min(market.outcomes.length, MAX_OUTCOMES_PER_EVENT);
    for (let i = 0; i < maxOutcomes; i++) {
      const outcome = market.outcomes[i];
      const snap = normalizeProviderOdds(
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
      );
      snapshots.push(snap);
    }
  }

  return snapshots;
}

// ─── Multi-sport fetch ────────────────────────────────────────────────────────

export async function fetchOddsApiSnapshots(): Promise<OddsSnapshot[] | null> {
  const apiKey = getOddsApiKey();
  if (!apiKey) return null;

  const results: OddsSnapshot[] = [];
  let sportsFetched = 0;

  for (const { apiKey: sportKey, sport } of SPORT_CONFIGS) {
    if (sportsFetched >= MAX_SPORTS_TO_FETCH) break;
    try {
      const items = await fetchSportOdds(apiKey, sportKey, sport);
      results.push(...items);
    } catch {
      // individual sport failure is non-fatal — continue to next sport
    }
    sportsFetched++;
  }

  return results.length > 0 ? results : null;
}
