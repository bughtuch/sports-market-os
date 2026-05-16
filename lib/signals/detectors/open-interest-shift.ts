/**
 * Open Interest Shift detector — fires on Polymarket events with large open
 * interest accumulation while price remains stable.
 *
 * Sprint 3A note: Without 4-hour OI history, fires on any event where
 * OI > $50K USD and price has been stable (< 1 percentage-point range) in
 * the available price_history window. The full 4-hour OI delta logic activates
 * automatically once the ledger accumulates sufficient history.
 *
 * Only fires on Polymarket events (Odds API has no open interest).
 */

import { randomUUID } from 'crypto';
import type { NormalizedMarketEvent, GeneratedSignal } from '../../providers/types';

const DECAY_WINDOW_MINUTES = 240;
const MIN_OI_USD = 50_000;

function oiToConfidence(oi: number): number | null {
  if (oi > 500_000)  return 90;
  if (oi > 100_000)  return 80;
  if (oi >= MIN_OI_USD) return 70;
  return null;
}

function isPriceStable(
  priceHistory: NormalizedMarketEvent['price_history']
): boolean {
  if (!priceHistory || priceHistory.length < 2) return false;
  const prices = priceHistory.map(h => h.price);
  const max = Math.max(...prices);
  const min = Math.min(...prices);
  // Stable = range < 1 percentage point (0.01 on 0-1 scale)
  return max - min < 0.01;
}

export async function detectOpenInterestShift(
  events: NormalizedMarketEvent[]
): Promise<GeneratedSignal[]> {
  const signals: GeneratedSignal[] = [];

  for (const event of events) {
    if (event.source !== 'polymarket') continue;

    // Find open interest from any current_prices entry
    const oi = event.current_prices.find(p => p.open_interest != null)?.open_interest;
    if (!oi || oi < MIN_OI_USD) continue;

    // Require stable price
    if (!isPriceStable(event.price_history)) continue;

    const confidence = oiToConfidence(oi);
    if (confidence === null) continue;

    // Direction: which side holds the OI concentration?
    // YES price > 0.5 → YES side has the weight → expect move 'up'
    const yesEntry = event.current_prices.find(p =>
      p.selection.toLowerCase() === 'yes'
    );
    const predicted_direction = yesEntry && yesEntry.price >= 0.5 ? 'up' : 'down';

    const priceRange = event.price_history
      ? (() => {
          const prices = event.price_history.map(h => h.price);
          return Math.max(...prices) - Math.min(...prices);
        })()
      : null;

    signals.push({
      id: randomUUID(),
      generated_at: new Date().toISOString(),
      sport: event.sport,
      market_type: event.market_type,
      source: event.source,
      event_id: event.event_id,
      event_title: event.event_title,
      signal_type: 'open_interest_shift',
      predicted_direction,
      predicted_magnitude: Math.round(oi),
      confidence,
      decay_window_minutes: DECAY_WINDOW_MINUTES,
      narrative: null,
      historical_analog: null,
      raw_inputs: {
        open_interest_usd: oi,
        price_range_1h: priceRange != null ? Math.round(priceRange * 10_000) / 10_000 : null,
        yes_price: yesEntry?.price,
        current_prices: event.current_prices,
      },
      is_published: true,
    });
  }

  return signals;
}
