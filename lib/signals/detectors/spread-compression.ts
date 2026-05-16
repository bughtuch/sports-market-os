/**
 * Spread Compression detector — fires when the bid-ask spread on a Polymarket
 * order book is tight relative to the midpoint price.
 *
 * Sprint 3A note: Without 60-minute spread history, fires when
 * current_spread / midpoint < 2% (tight spread + good depth = compression signal).
 * Compression typically precedes expansion — predicted_direction: 'widen'.
 *
 * Only fires on Polymarket events with orderbook data.
 */

import { randomUUID } from 'crypto';
import type { NormalizedMarketEvent, GeneratedSignal } from '../../providers/types';

const DECAY_WINDOW_MINUTES = 45;

function spreadRatioToConfidence(ratio: number): number | null {
  if (ratio < 0.01)  return 90;
  if (ratio < 0.015) return 80;
  if (ratio < 0.02)  return 70;
  return null;
}

export async function detectSpreadCompression(
  events: NormalizedMarketEvent[]
): Promise<GeneratedSignal[]> {
  const signals: GeneratedSignal[] = [];

  for (const event of events) {
    if (event.source !== 'polymarket') continue;
    if (!event.orderbook) continue;

    const { bids, asks } = event.orderbook;
    if (bids.length === 0 || asks.length === 0) continue;

    const bestBid = Math.max(...bids.map(b => b.price));
    const bestAsk = Math.min(...asks.map(a => a.price));

    if (bestBid <= 0 || bestAsk <= bestBid) continue;

    const spread = bestAsk - bestBid;
    const midpoint = (bestBid + bestAsk) / 2;
    if (midpoint <= 0) continue;

    const spreadRatio = spread / midpoint;
    const confidence = spreadRatioToConfidence(spreadRatio);
    if (confidence === null) continue;

    signals.push({
      id: randomUUID(),
      generated_at: new Date().toISOString(),
      sport: event.sport,
      market_type: event.market_type,
      source: event.source,
      event_id: event.event_id,
      event_title: event.event_title,
      signal_type: 'spread_compression',
      predicted_direction: 'widen',
      predicted_magnitude: Math.round(spreadRatio * 10_000) / 100, // as basis points
      confidence,
      decay_window_minutes: DECAY_WINDOW_MINUTES,
      narrative: null,
      historical_analog: null,
      raw_inputs: {
        best_bid: bestBid,
        best_ask: bestAsk,
        spread,
        midpoint,
        spread_ratio: Math.round(spreadRatio * 10_000) / 10_000,
        depth_score: event.orderbook.depth_score,
        bid_levels: bids.length,
        ask_levels: asks.length,
      },
      is_published: true,
    });
  }

  return signals;
}
