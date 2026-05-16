/**
 * Line Move detector — fires when prices have moved materially in the last
 * 60 minutes, on either Polymarket (0-1 probability) or Odds API (decimal odds).
 *
 * Sprint 3A note: Relies on price_history from the CLOB adapter. Odds API
 * events won't have price_history until the history endpoint is wired; only
 * Polymarket events with CLOB history available will trigger this detector.
 *
 * Multi-book consensus bonus: +5 confidence when 3+ bookmakers on Odds API
 * move in the same direction. Not applicable to Polymarket (single CLOB).
 */

import { randomUUID } from 'crypto';
import type { NormalizedMarketEvent, GeneratedSignal } from '../../providers/types';

const DECAY_WINDOW_MINUTES = 90;
const WINDOW_MS = 60 * 60 * 1000; // 60 minutes

function movePctToConfidence(pct: number): number | null {
  if (pct > 10) return 90;
  if (pct > 7)  return 80;
  if (pct >= 5) return 70;
  return null;
}

export async function detectLineMove(
  events: NormalizedMarketEvent[]
): Promise<GeneratedSignal[]> {
  const signals: GeneratedSignal[] = [];
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  for (const event of events) {
    if (!event.price_history || event.price_history.length < 2) continue;

    // Filter to within the last 60 minutes
    const recent = event.price_history.filter(
      h => new Date(h.timestamp).getTime() >= windowStart
    );
    if (recent.length < 2) continue;

    // Sort ascending by time
    const sorted = [...recent].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const oldest = sorted[0];
    const newest = sorted[sorted.length - 1];

    if (oldest.selection !== newest.selection) continue;
    if (oldest.price <= 0) continue;

    const priceDelta = newest.price - oldest.price;
    const priceMoveAbsPct = Math.abs((priceDelta / oldest.price) * 100);

    let confidence = movePctToConfidence(priceMoveAbsPct);
    if (confidence === null) continue;

    // Multi-book bonus for Odds API: check if other events for same market title move same direction
    if (event.source === 'the_odds_api') {
      const sameMarketEvents = events.filter(
        e =>
          e.source === 'the_odds_api' &&
          e.event_title === event.event_title &&
          e.event_id !== event.event_id &&
          e.price_history && e.price_history.length >= 2
      );
      const consensusCount = sameMarketEvents.filter(e => {
        const h = e.price_history!;
        const s = [...h].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        if (s.length < 2) return false;
        const delta = s[s.length - 1].price - s[0].price;
        return Math.sign(delta) === Math.sign(priceDelta);
      }).length;

      if (consensusCount >= 2) confidence = Math.min(95, confidence + 5); // 3+ books total
    }

    const predicted_direction = priceDelta > 0 ? 'up' : 'down';

    signals.push({
      id: randomUUID(),
      generated_at: new Date().toISOString(),
      sport: event.sport,
      market_type: event.market_type,
      source: event.source,
      event_id: event.event_id,
      event_title: event.event_title,
      signal_type: 'line_move',
      predicted_direction,
      predicted_magnitude: Math.round(priceMoveAbsPct * 10) / 10,
      confidence,
      decay_window_minutes: DECAY_WINDOW_MINUTES,
      narrative: null,
      historical_analog: null,
      raw_inputs: {
        oldest_price: oldest.price,
        newest_price: newest.price,
        move_pct: Math.round(priceMoveAbsPct * 100) / 100,
        selection: oldest.selection,
        window_minutes: 60,
      },
      is_published: true,
    });
  }

  return signals;
}
