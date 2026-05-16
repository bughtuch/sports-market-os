// SPORTS MARKET OS — POLYMARKET READ-ONLY ADAPTER
// This adapter never imports or calls Polymarket trading endpoints.
// Order placement endpoints are explicitly excluded by design.
// Read-only intelligence layer — see /docs/polymarket-integration.md

import type { NormalizedMarketEvent, Sport } from '../types';
import { SPORTS_TAGS, fetchActiveEvents } from './gamma';
import type { RawGammaEvent } from './gamma';
import { fetchOrderbook, fetchPriceHistory } from './clob';
import { fetchOpenInterest } from './data';
import { normalizeGammaEvent } from './normalize';
import type { ClobMarketData, PolymarketDataApi } from './normalize';

// ─── Sport → Polymarket tag mapping ──────────────────────────────────────────

const SPORT_TO_TAGS: Record<Sport, string[]> = {
  tennis:      ['tennis'],
  nfl:         ['nfl'],
  nba:         ['nba'],
  ufc:         ['ufc', 'mma', 'boxing'],
  football:    ['soccer', 'football'],
  horse_racing: ['horse-racing', 'horse racing'],
  golf:        ['golf'],
  f1:          ['f1', 'formula-1'],
  nhl:         ['nhl', 'hockey'],
  mlb:         ['baseball', 'mlb'],
};

// ─── Enrichment ───────────────────────────────────────────────────────────────

async function enrichAndNormalize(event: RawGammaEvent): Promise<NormalizedMarketEvent | null> {
  const market = event.markets[0];
  if (!market) return null;

  let tokenIds: string[] = [];
  try {
    tokenIds = JSON.parse(market.clobTokenIds) as string[];
  } catch {
    tokenIds = [];
  }

  const firstTokenId = tokenIds[0];

  // Fetch CLOB and Data API in parallel — non-fatal on failure
  const [orderbook, priceHistory, openInterest] = await Promise.all([
    firstTokenId ? fetchOrderbook(firstTokenId).catch(() => null) : Promise.resolve(null),
    market.conditionId
      ? fetchPriceHistory(market.conditionId, '1h').catch(() => [])
      : Promise.resolve([]),
    market.id ? fetchOpenInterest(market.id).catch(() => 0) : Promise.resolve(0),
  ]);

  const clobData: ClobMarketData = {
    orderbook: orderbook ?? undefined,
    priceHistory: priceHistory.length > 0 ? priceHistory : undefined,
  };

  const dataApi: PolymarketDataApi = {
    openInterest: openInterest > 0 ? openInterest : undefined,
    volume24h: market.volume24hr ? parseFloat(market.volume24hr) : undefined,
  };

  return normalizeGammaEvent(event, clobData, dataApi);
}

// ─── Concurrency-limited batch processor ──────────────────────────────────────

async function processBatched(
  events: RawGammaEvent[],
  batchSize: number
): Promise<NormalizedMarketEvent[]> {
  const results: NormalizedMarketEvent[] = [];
  for (let i = 0; i < events.length; i += batchSize) {
    const batch = events.slice(i, i + batchSize);
    const settled = await Promise.allSettled(batch.map(enrichAndNormalize));
    for (const r of settled) {
      if (r.status === 'fulfilled' && r.value) results.push(r.value);
    }
  }
  return results;
}

// ─── Public adapter interface ─────────────────────────────────────────────────

/** Fetch and normalize all active sports events for a specific sport. */
export async function fetchSportsEvents(sport: Sport): Promise<NormalizedMarketEvent[]> {
  const tags = SPORT_TO_TAGS[sport];
  const events = await fetchActiveEvents(tags);
  return processBatched(events, 5);
}

/**
 * Fetch and normalize all active sports events across all sports.
 * Parallel-fetches all sports tags, merges, deduplicates by event_id.
 */
export async function fetchSportsEventsAll(): Promise<NormalizedMarketEvent[]> {
  const allTags = [...SPORTS_TAGS];
  const events = await fetchActiveEvents(allTags);

  const normalized = await processBatched(events, 5);

  // Deduplicate by event_id
  const seen = new Set<string>();
  return normalized.filter(e => {
    if (seen.has(e.event_id)) return false;
    seen.add(e.event_id);
    return true;
  });
}

/**
 * Fetch a single event by its stable event_id.
 * Searches the full sports event set — no direct lookup available from Gamma API.
 */
export async function fetchEventDetail(
  event_id: string
): Promise<NormalizedMarketEvent | null> {
  const all = await fetchSportsEventsAll();
  return all.find(e => e.event_id === event_id) ?? null;
}
