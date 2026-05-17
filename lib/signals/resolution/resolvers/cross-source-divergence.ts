/**
 * Cross-Source Divergence resolver — Sprint 3L.2.
 *
 * Predicted: Polymarket and Odds API probabilities converge (predicted_direction = 'narrow').
 * Resolution: measure current divergence and compare to divergence at signal time.
 *
 * raw_inputs fields (from detector):
 *   divergence_pct        — abs difference in percentage points at signal time
 *   polymarket_prob_pct   — Polymarket implied probability % at signal time
 *   odds_api_prob_pct     — Odds API implied probability % at signal time
 *   odds_api_event_title  — title of the matching Odds API event (for re-matching)
 *
 * If the Odds API fetch fails at resolution time, returns 'unresolved' (not an error).
 */

import type { GeneratedSignal } from '../../engine';
import type { SignalResolver, ResolutionResult } from '../types';
import { getCurrentState } from '../polymarket-fetch';
import { fetchSportsEventsNormalized } from '@/lib/providers/oddsApi/normalize';

export const crossSourceDivergenceResolver: SignalResolver = {
  name: 'cross_source_divergence',

  canResolve(signal: GeneratedSignal): boolean {
    return signal.signal_type === 'cross_source_divergence';
  },

  async resolve(signal: GeneratedSignal): Promise<Omit<ResolutionResult, 'signal_id' | 'resolved_at'> | null> {
    const polyCurrent = getCurrentState(signal.event_id);

    if (!polyCurrent) {
      return {
        outcome: 'expired',
        resolution_method: 'polymarket_market_not_found',
        resolution_source: { event_id: signal.event_id },
      };
    }

    const inputs = signal.raw_inputs as {
      divergence_pct?:       number;
      polymarket_prob_pct?:  number;
      odds_api_prob_pct?:    number;
      odds_api_event_title?: string;
    };

    const divergenceAtSignal = inputs?.divergence_pct;

    if (!divergenceAtSignal || divergenceAtSignal <= 0) {
      return {
        outcome: 'unresolved',
        resolution_method: 'missing_input_data',
        resolution_source: { reason: 'no divergence_pct in raw_inputs' },
      };
    }

    // Current Polymarket probability (0-1 → multiply by 100 for pct points)
    const yesNow = polyCurrent.current_prices.find(
      p => p.selection.toLowerCase() === 'yes'
    ) ?? polyCurrent.current_prices[0];
    const polyProbNow = yesNow?.price;

    if (!polyProbNow || polyProbNow <= 0) {
      return {
        outcome: 'unresolved',
        resolution_method: 'no_current_polymarket_prob',
        resolution_source: { divergence_at_signal: divergenceAtSignal },
      };
    }

    // Try to re-match the Odds API event by stored title, then by fuzzy first-word match
    let oddsApiProbNowPct: number | null = null;
    try {
      const oddsEvents = await fetchSportsEventsNormalized(signal.sport);
      const targetTitle = (inputs?.odds_api_event_title ?? signal.event_title).toLowerCase();

      const matchEvent =
        oddsEvents.find(e => e.event_title.toLowerCase() === targetTitle) ??
        oddsEvents.find(e => {
          const t1 = e.event_title.toLowerCase();
          const firstWord = targetTitle.split(' ')[0];
          return firstWord.length >= 3 && (t1.includes(firstWord) || targetTitle.includes(t1.split(' ')[0]));
        });

      if (matchEvent?.current_prices?.[0]?.price) {
        const decimalOdds = matchEvent.current_prices[0].price;
        // Odds API: decimal odds → implied probability %
        if (decimalOdds > 1) {
          oddsApiProbNowPct = (1 / decimalOdds) * 100;
        }
      }
    } catch (err) {
      console.warn('[resolution/cross-source-divergence] Odds API fetch failed', err);
    }

    if (oddsApiProbNowPct === null) {
      return {
        outcome: 'unresolved',
        resolution_method: 'no_current_odds_api_match',
        resolution_source: {
          polymarket_prob_pct_at_resolution: Number((polyProbNow * 100).toFixed(2)),
          divergence_at_signal_pct:          divergenceAtSignal,
        },
      };
    }

    const polyProbNowPct = polyProbNow * 100;
    const currentDivergencePct = Math.abs(polyProbNowPct - oddsApiProbNowPct);
    const convergenceRatio = currentDivergencePct / divergenceAtSignal;

    let outcome: 'correct' | 'incorrect' | 'unresolved';
    if (convergenceRatio < 0.5) {
      outcome = 'correct';    // converged 50%+
    } else if (convergenceRatio > 1.0) {
      outcome = 'incorrect';  // diverged further
    } else {
      outcome = 'unresolved';
    }

    return {
      outcome,
      resolution_method: 'cross_source_convergence_check',
      actual_magnitude:  Number(currentDivergencePct.toFixed(2)),
      resolution_source: {
        divergence_at_signal_pct:     divergenceAtSignal,
        divergence_at_resolution_pct: Number(currentDivergencePct.toFixed(3)),
        convergence_ratio:            Number(convergenceRatio.toFixed(3)),
        polymarket_prob_pct_at_resolution: Number(polyProbNowPct.toFixed(2)),
        odds_api_prob_pct_at_resolution:   Number(oddsApiProbNowPct.toFixed(2)),
        converged_threshold:  0.5,
        diverged_threshold:   1.0,
      },
    };
  },
};
