/**
 * oddsApi/normalize — wraps theOddsApiProvider's OddsSnapshot output and
 * converts to NormalizedMarketEvent for use by the signal engine.
 *
 * The existing /api/live/odds route continues to return OddsSnapshot (backwards
 * compatible). This layer adds NormalizedMarketEvent on top.
 *
 * Migration note: see supabase/migrations/20260516000000_signals_and_resolutions.sql
 */

import { createHash } from 'crypto';
import { fetchOddsApiSnapshots } from '../odds/theOddsApiProvider';
import type { OddsSnapshot, SportType, NormalizedMarketEvent, Sport } from '../types';

// ─── SportType → Sport mapping ────────────────────────────────────────────────

const SPORT_TYPE_TO_SPORT: Partial<Record<SportType, Sport>> = {
  'Horse Racing': 'horse_racing',
  'Tennis':       'tennis',
  'NBA':          'nba',
  'NFL':          'nfl',
  'UFC':          'ufc',
  'Football':     'football',
  // 'Prediction Markets' intentionally absent — not a Sport enum value
};

// ─── Odds API sport_key prefix → Sport mapping ────────────────────────────────

export const ODDS_SPORT_KEY_TO_SPORT: Record<string, Sport> = {
  'americanfootball_nfl': 'nfl',
  'basketball_nba':       'nba',
  'mma_mixed_martial_arts': 'ufc',
  'icehockey_nhl':        'nhl',
  'baseball_mlb':         'mlb',
};

// Prefix-matched at runtime (soccer_*, tennis_*, golf_*)
function resolveSportFromKey(sportKey: string): Sport | null {
  if (ODDS_SPORT_KEY_TO_SPORT[sportKey]) return ODDS_SPORT_KEY_TO_SPORT[sportKey];
  if (sportKey.startsWith('soccer_')) return 'football';
  if (sportKey.startsWith('tennis_')) return 'tennis';
  if (sportKey.startsWith('golf_')) return 'golf';
  return null;
}

// ─── Stable ID ────────────────────────────────────────────────────────────────

function stableId(input: string): string {
  return createHash('sha256').update(input).digest('hex').slice(0, 16);
}

// ─── Single-snapshot normalizer ───────────────────────────────────────────────

/**
 * Converts one OddsSnapshot (one selection) into a NormalizedMarketEvent.
 * Returns [] if the sport cannot be mapped to the Sport enum.
 *
 * event_id approximates `odds_api:${event.id}:${bookmaker.key}` using a stable
 * hash of market + source, since OddsSnapshot does not retain raw IDs.
 */
export function normalizeOddsApiEvent(snapshot: OddsSnapshot): NormalizedMarketEvent[] {
  const sport = SPORT_TYPE_TO_SPORT[snapshot.sport];
  if (!sport) return [];

  const eventId = `odds_api:${stableId(snapshot.market)}:${stableId(snapshot.source)}`;

  return [
    {
      event_id: eventId,
      external_id: `${snapshot.market}::${snapshot.source}`,
      source: 'the_odds_api',
      sport,
      market_type: 'h2h',
      event_title: snapshot.market,
      commence_time: new Date().toISOString(), // not available from OddsSnapshot
      is_live: false,
      is_resolved: false,
      current_prices: [
        {
          selection: snapshot.selection,
          // Odds API: decimal odds (e.g. 2.5 = 40% implied probability)
          // Implied prob = 1 / price — do NOT convert here, detectors handle it
          price: snapshot.currentPrice,
        },
      ],
      price_history: undefined,
      raw: snapshot,
      snapshot_at: new Date().toISOString(),
    },
  ];
}

// ─── Grouped normalizer ───────────────────────────────────────────────────────

/**
 * Fetches all configured sports from theOddsApiProvider and converts each
 * (event × bookmaker) group into one NormalizedMarketEvent with all selections
 * in current_prices.
 */
export async function fetchAllSportsEventsNormalized(): Promise<NormalizedMarketEvent[]> {
  const snapshots = await fetchOddsApiSnapshots();
  if (!snapshots || snapshots.length === 0) return [];

  // Group snapshots by (market, source) → each group = one event × bookmaker
  const groups = new Map<string, OddsSnapshot[]>();
  for (const snap of snapshots) {
    const key = `${snap.market}::${snap.source}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(snap);
  }

  const results: NormalizedMarketEvent[] = [];

  for (const [, snaps] of groups) {
    const first = snaps[0];
    const sport = SPORT_TYPE_TO_SPORT[first.sport];
    if (!sport) continue;

    const eventId = `odds_api:${stableId(first.market)}:${stableId(first.source)}`;

    results.push({
      event_id: eventId,
      external_id: `${first.market}::${first.source}`,
      source: 'the_odds_api',
      sport,
      market_type: 'h2h',
      event_title: first.market,
      commence_time: new Date().toISOString(),
      is_live: false,
      is_resolved: false,
      current_prices: snaps.map(s => ({
        selection: s.selection,
        price: s.currentPrice, // decimal odds
      })),
      price_history: undefined,
      raw: snaps,
      snapshot_at: new Date().toISOString(),
    });
  }

  return results;
}

/**
 * Fetch normalized events for a specific sport.
 * Calls fetchAllSportsEventsNormalized (cached at provider level) and filters.
 */
export async function fetchSportsEventsNormalized(
  sport: Sport
): Promise<NormalizedMarketEvent[]> {
  const all = await fetchAllSportsEventsNormalized();
  return all.filter(e => e.sport === sport);
}
