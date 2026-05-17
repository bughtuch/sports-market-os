/**
 * Line Move resolver — Sprint 3L.2.
 *
 * Predicted: price continues moving in predicted_direction after signal.
 * Resolution: compare current price to the newest_price captured at signal time.
 *
 * raw_inputs fields (from detector):
 *   oldest_price — price at start of the 60-min detection window
 *   newest_price — price at end of the 60-min detection window (the "signal time" price)
 *   move_pct     — abs % move that triggered the signal
 *   selection    — which outcome (YES/NO/team name) the prices refer to
 *
 * Note: Odds API line-move signals can't be resolved via Polymarket — those
 * return 'expired' (no Odds API historical endpoint in Sprint 3L).
 */

import type { GeneratedSignal } from '../../engine';
import type { SignalResolver, ResolutionResult } from '../types';
import { getCurrentState } from '../polymarket-fetch';

const MOVE_THRESHOLD_PCT = 3; // minimum % to call a confirmed move

export const lineMoveResolver: SignalResolver = {
  name: 'line_move',

  canResolve(signal: GeneratedSignal): boolean {
    return signal.signal_type === 'line_move';
  },

  async resolve(signal: GeneratedSignal): Promise<Omit<ResolutionResult, 'signal_id' | 'resolved_at'> | null> {
    const current = await getCurrentState(signal.event_id);

    if (!current) {
      // Odds API events won't be found in Polymarket — outcome is expired
      return {
        outcome: 'expired',
        resolution_method: 'polymarket_market_not_found',
        resolution_source: {
          event_id: signal.event_id,
          source:   signal.source,
          reason:   signal.source === 'the_odds_api'
            ? 'Odds API events not resolvable via Polymarket in Sprint 3L'
            : 'market unavailable at resolution time',
        },
      };
    }

    const inputs = signal.raw_inputs as {
      oldest_price?: number;
      newest_price?: number;
      move_pct?:     number;
      selection?:    string;
    };

    const priceAtSignal = inputs?.newest_price;

    if (!priceAtSignal || priceAtSignal <= 0) {
      return {
        outcome: 'unresolved',
        resolution_method: 'missing_input_data',
        resolution_source: { reason: 'no newest_price in raw_inputs' },
      };
    }

    // Match the same selection if possible; fall back to first entry
    const selection = (inputs?.selection ?? '').toLowerCase();
    const matchedEntry = current.current_prices.find(
      p => p.selection.toLowerCase() === selection
    ) ?? current.current_prices[0];

    const currentPrice = matchedEntry?.price;

    if (!currentPrice || currentPrice <= 0) {
      return {
        outcome: 'unresolved',
        resolution_method: 'no_current_price',
        resolution_source: { price_at_signal: priceAtSignal },
      };
    }

    const pctChange = ((currentPrice - priceAtSignal) / priceAtSignal) * 100;
    const predicted = signal.predicted_direction;

    let outcome: 'correct' | 'incorrect' | 'unresolved';
    if (predicted === 'up') {
      if (pctChange >= MOVE_THRESHOLD_PCT)  outcome = 'correct';
      else if (pctChange <= -MOVE_THRESHOLD_PCT) outcome = 'incorrect';
      else outcome = 'unresolved';
    } else if (predicted === 'down') {
      if (pctChange <= -MOVE_THRESHOLD_PCT) outcome = 'correct';
      else if (pctChange >= MOVE_THRESHOLD_PCT)  outcome = 'incorrect';
      else outcome = 'unresolved';
    } else {
      outcome = 'unresolved';
    }

    return {
      outcome,
      resolution_method: 'price_direction_check',
      actual_direction:  pctChange > 0 ? 'up' : pctChange < 0 ? 'down' : 'flat',
      actual_magnitude:  Number(pctChange.toFixed(2)),
      resolution_source: {
        price_at_signal:      priceAtSignal,
        price_at_resolution:  currentPrice,
        pct_change:           Number(pctChange.toFixed(3)),
        predicted_direction:  predicted,
        selection:            inputs?.selection,
        move_threshold_pct:   MOVE_THRESHOLD_PCT,
      },
    };
  },
};
