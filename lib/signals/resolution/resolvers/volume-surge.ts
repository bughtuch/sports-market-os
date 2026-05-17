/**
 * Volume Surge resolver — Sprint 3L.2.
 *
 * Predicted: volume remains elevated above baseline (predicted_direction = 'up'/'down').
 * Resolution: compare current 24h volume to volume captured at signal time.
 *
 * raw_inputs fields (from detector):
 *   volume_24h         — 24h volume at signal time (USD)
 *   synthetic_baseline — 60% of volume_24h (Sprint 3A baseline)
 *   z_score            — z-score above synthetic baseline
 */

import type { GeneratedSignal } from '../../engine';
import type { SignalResolver, ResolutionResult } from '../types';
import { getCurrentState } from '../polymarket-fetch';

export const volumeSurgeResolver: SignalResolver = {
  name: 'volume_surge',

  canResolve(signal: GeneratedSignal): boolean {
    return signal.signal_type === 'volume_surge';
  },

  async resolve(signal: GeneratedSignal): Promise<Omit<ResolutionResult, 'signal_id' | 'resolved_at'> | null> {
    const current = await getCurrentState(signal.event_id);

    if (!current) {
      return {
        outcome: 'expired',
        resolution_method: 'polymarket_market_not_found',
        resolution_source: { event_id: signal.event_id, reason: 'market unavailable at resolution time' },
      };
    }

    const inputs = signal.raw_inputs as {
      volume_24h?:         number;
      synthetic_baseline?: number;
      z_score?:            number;
    };
    const volumeAtSignal = inputs?.volume_24h;

    if (!volumeAtSignal || volumeAtSignal <= 0) {
      return {
        outcome: 'unresolved',
        resolution_method: 'missing_input_data',
        resolution_source: { reason: 'no volume_24h in raw_inputs' },
      };
    }

    const currentVolume = current.current_prices.find(p => p.volume_24h != null)?.volume_24h;

    if (!currentVolume || currentVolume <= 0) {
      return {
        outcome: 'unresolved',
        resolution_method: 'no_current_volume',
        resolution_source: { volume_at_signal: volumeAtSignal },
      };
    }

    const ratio = currentVolume / volumeAtSignal;

    let outcome: 'correct' | 'incorrect' | 'unresolved';
    if (ratio >= 0.75) {
      outcome = 'correct';   // volume held elevated
    } else if (ratio < 0.5) {
      outcome = 'incorrect'; // volume collapsed
    } else {
      outcome = 'unresolved'; // ambiguous band between thresholds
    }

    return {
      outcome,
      resolution_method:  'volume_ratio_check',
      actual_magnitude:   Math.round(currentVolume),
      resolution_source: {
        volume_at_signal:      volumeAtSignal,
        volume_at_resolution:  currentVolume,
        ratio:                 Number(ratio.toFixed(4)),
        held_threshold:        0.75,
        collapsed_threshold:   0.5,
      },
    };
  },
};
