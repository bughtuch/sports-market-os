/**
 * Open Interest Shift resolver — Sprint 3L.2.
 *
 * Predicted: informed positioning (large OI + stable price) precedes a price move.
 * Resolution: did the price actually move after the decay window?
 *
 * raw_inputs fields (from detector):
 *   yes_price       — YES outcome price at signal time (0-1 Polymarket scale)
 *   current_prices  — full prices snapshot at signal time
 *   open_interest_usd — OI in USD at signal time
 */

import type { GeneratedSignal } from '../../engine';
import type { SignalResolver, ResolutionResult } from '../types';
import { getCurrentState } from '../polymarket-fetch';

export const openInterestShiftResolver: SignalResolver = {
  name: 'open_interest_shift',

  canResolve(signal: GeneratedSignal): boolean {
    return signal.signal_type === 'open_interest_shift';
  },

  async resolve(signal: GeneratedSignal): Promise<Omit<ResolutionResult, 'signal_id' | 'resolved_at'> | null> {
    const current = await getCurrentState(signal.event_id);

    if (!current) {
      return {
        outcome: 'expired',
        resolution_method: 'polymarket_market_not_found',
        resolution_source: { event_id: signal.event_id },
      };
    }

    const inputs = signal.raw_inputs as {
      yes_price?:          number;
      current_prices?:     Array<{ selection: string; price: number }>;
      open_interest_usd?:  number;
    };

    // Prefer yes_price; fall back to first current_prices entry
    const priceAtSignal = inputs?.yes_price ?? inputs?.current_prices?.[0]?.price;

    if (!priceAtSignal || priceAtSignal <= 0) {
      return {
        outcome: 'unresolved',
        resolution_method: 'missing_input_data',
        resolution_source: { reason: 'no yes_price or current_prices in raw_inputs' },
      };
    }

    // Compare to YES outcome at resolution; fall back to first entry
    const yesNow = current.current_prices.find(
      p => p.selection.toLowerCase() === 'yes'
    ) ?? current.current_prices[0];

    const currentPrice = yesNow?.price;

    if (!currentPrice || currentPrice <= 0) {
      return {
        outcome: 'unresolved',
        resolution_method: 'no_current_price',
        resolution_source: { price_at_signal: priceAtSignal },
      };
    }

    const absPctChange = Math.abs((currentPrice - priceAtSignal) / priceAtSignal) * 100;

    let outcome: 'correct' | 'incorrect' | 'unresolved';
    if (absPctChange >= 5) {
      outcome = 'correct';   // significant move materialized
    } else if (absPctChange < 2) {
      outcome = 'incorrect'; // positioning didn't lead to price action
    } else {
      outcome = 'unresolved';
    }

    return {
      outcome,
      resolution_method: 'abs_price_move_check',
      actual_direction:  currentPrice > priceAtSignal ? 'up' : 'down',
      actual_magnitude:  Number(absPctChange.toFixed(2)),
      resolution_source: {
        price_at_signal:      priceAtSignal,
        price_at_resolution:  currentPrice,
        abs_pct_change:       Number(absPctChange.toFixed(3)),
        oi_at_signal_usd:     inputs?.open_interest_usd ?? null,
        moved_threshold_pct:  5,
        stayed_threshold_pct: 2,
      },
    };
  },
};
