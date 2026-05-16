// SPORTS MARKET OS — POLYMARKET READ-ONLY ADAPTER
// This adapter never imports or calls Polymarket trading endpoints.
// Order placement endpoints are explicitly excluded by design.
// Read-only intelligence layer — see /docs/polymarket-integration.md

import { createHash } from 'crypto';
import type { RawGammaEvent } from './gamma';
import type { RawClobBook, RawClobHistory } from './clob';
import type { RawHolder } from './data';
import type { NormalizedMarketEvent, Sport } from '../types';

// ─── Tag → Sport mapping ──────────────────────────────────────────────────────

export const TAG_TO_SPORT: Record<string, Sport> = {
  'tennis':       'tennis',
  'nfl':          'nfl',
  'nba':          'nba',
  'soccer':       'football',
  'football':     'football',
  'baseball':     'mlb',
  'mlb':          'mlb',
  'mma':          'ufc',
  'ufc':          'ufc',
  'horse-racing': 'horse_racing',
  'horse racing': 'horse_racing',
  'golf':         'golf',
  'f1':           'f1',
  'formula-1':    'f1',
  'nhl':          'nhl',
  'hockey':       'nhl',
  'boxing':       'ufc',
};

function resolveSport(tags: Array<{ label: string }>): Sport | null {
  for (const tag of tags) {
    const sport = TAG_TO_SPORT[tag.label.toLowerCase()];
    if (sport) return sport;
  }
  return null;
}

// ─── Stable event ID ──────────────────────────────────────────────────────────

function stableId(input: string): string {
  return createHash('sha256').update(input).digest('hex').slice(0, 16);
}

// ─── Orderbook depth score ────────────────────────────────────────────────────

function computeDepthScore(book: RawClobBook): number {
  const totalBidSize = book.bids.reduce((s, b) => s + parseFloat(b.size), 0);
  const totalAskSize = book.asks.reduce((s, a) => s + parseFloat(a.size), 0);
  return Math.min(Math.round(((totalBidSize + totalAskSize) / 10_000) * 100), 100);
}

// ─── Supporting types for callers ─────────────────────────────────────────────

export interface ClobMarketData {
  orderbook?: RawClobBook;
  midpoint?: number;
  spread?: number;
  priceHistory?: RawClobHistory[];
}

export interface PolymarketDataApi {
  openInterest?: number;
  volume24h?: number;
  topHolders?: RawHolder[];
}

// ─── Normalizer ───────────────────────────────────────────────────────────────

/**
 * Converts a raw Gamma event + enrichment data into a NormalizedMarketEvent.
 *
 * Polymarket prices are 0-1 probabilities — kept as-is in current_prices.price.
 * Do NOT convert to percentage here; detectors handle the 0-1 scale directly.
 *
 * Returns null if the event cannot be mapped to a known sport.
 */
export async function normalizeGammaEvent(
  raw: RawGammaEvent,
  marketData: ClobMarketData,
  dataApi: PolymarketDataApi
): Promise<NormalizedMarketEvent | null> {
  const sport = resolveSport(raw.tags);
  if (!sport) return null;

  const market = raw.markets[0];
  if (!market) return null;

  let outcomes: string[] = [];
  let prices: string[] = [];
  try {
    outcomes = JSON.parse(market.outcomes) as string[];
    prices = JSON.parse(market.outcomePrices) as string[];
  } catch {
    return null;
  }

  if (outcomes.length === 0) return null;

  const event_id = `polymarket:${stableId(market.conditionId + market.id)}`;

  const current_prices = outcomes.map((sel, i) => ({
    selection: sel,
    // Polymarket probabilities: 0-1 scale, kept as-is
    price: parseFloat(prices[i] ?? '0'),
    volume_24h: market.volume24hr ? parseFloat(market.volume24hr) : undefined,
    open_interest: dataApi.openInterest || undefined,
  }));

  return {
    event_id,
    external_id: market.conditionId,
    source: 'polymarket',
    sport,
    market_type: 'outright',
    event_title: raw.title,
    commence_time: raw.startDate ?? new Date().toISOString(),
    is_live: raw.active && !raw.closed,
    is_resolved: raw.closed,
    current_prices,
    orderbook: marketData.orderbook
      ? {
          bids: marketData.orderbook.bids.map(b => ({
            price: parseFloat(b.price),
            size: parseFloat(b.size),
          })),
          asks: marketData.orderbook.asks.map(a => ({
            price: parseFloat(a.price),
            size: parseFloat(a.size),
          })),
          depth_score: computeDepthScore(marketData.orderbook),
        }
      : undefined,
    price_history: marketData.priceHistory?.map(h => ({
      timestamp: new Date(parseInt(h.t) * 1000).toISOString(),
      selection: outcomes[0] ?? 'Yes',
      price: parseFloat(h.p),
    })),
    raw,
    snapshot_at: new Date().toISOString(),
  };
}
