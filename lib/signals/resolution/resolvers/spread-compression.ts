/**
 * Spread Compression resolver — Sprint 3L.2.
 *
 * Predicted: spread widens after compression (predicted_direction = 'widen').
 * Resolution: compare current spread ratio to the ratio captured at signal time.
 *
 * raw_inputs fields (from detector):
 *   spread_ratio — spread / midpoint at signal time (dimensionless, e.g. 0.012)
 *   best_bid, best_ask, spread, midpoint — orderbook snapshot
 */

import type { GeneratedSignal } from '../../engine';
import type { SignalResolver, ResolutionResult } from '../types';
import { getCurrentState } from '../polymarket-fetch';

export const spreadCompressionResolver: SignalResolver = {
  name: 'spread_compression',

  canResolve(signal: GeneratedSignal): boolean {
    return signal.signal_type === 'spread_compression';
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
      spread_ratio?: number;
      spread?:       number;
      midpoint?:     number;
    };
    const ratioAtSignal = inputs?.spread_ratio;

    if (!ratioAtSignal || ratioAtSignal <= 0) {
      return {
        outcome: 'unresolved',
        resolution_method: 'missing_input_data',
        resolution_source: { reason: 'no spread_ratio in raw_inputs' },
      };
    }

    const book = current.orderbook;
    if (!book || !book.bids?.length || !book.asks?.length) {
      return {
        outcome: 'unresolved',
        resolution_method: 'no_current_orderbook',
        resolution_source: { spread_ratio_at_signal: ratioAtSignal },
      };
    }

    const bestBid = Math.max(...book.bids.map(b => b.price));
    const bestAsk = Math.min(...book.asks.map(a => a.price));

    if (bestAsk <= bestBid || bestBid <= 0) {
      return {
        outcome: 'unresolved',
        resolution_method: 'invalid_current_spread',
        resolution_source: { best_bid: bestBid, best_ask: bestAsk },
      };
    }

    const currentSpread = bestAsk - bestBid;
    const midpoint = (bestBid + bestAsk) / 2;
    const currentRatio = midpoint > 0 ? currentSpread / midpoint : 0;

    if (currentRatio <= 0) {
      return {
        outcome: 'unresolved',
        resolution_method: 'invalid_current_ratio',
        resolution_source: { current_spread: currentSpread, midpoint },
      };
    }

    const change = currentRatio / ratioAtSignal;

    let outcome: 'correct' | 'incorrect' | 'unresolved';
    if (change >= 1.5) {
      outcome = 'correct';    // spread widened 50%+
    } else if (change <= 0.8) {
      outcome = 'incorrect';  // spread tightened further
    } else {
      outcome = 'unresolved';
    }

    return {
      outcome,
      resolution_method: 'spread_ratio_change',
      actual_magnitude:  Number(currentRatio.toFixed(6)),
      resolution_source: {
        spread_ratio_at_signal:     ratioAtSignal,
        spread_ratio_at_resolution: Number(currentRatio.toFixed(6)),
        change_multiplier:          Number(change.toFixed(3)),
        widened_threshold:          1.5,
        tightened_threshold:        0.8,
      },
    };
  },
};
