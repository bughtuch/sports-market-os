/**
 * Resolution Engine — Sprint 3L.1 / 3L.2 / 3L.3.
 *
 * Fetches signals whose decay window has elapsed, routes each through its
 * paired resolver, stamps signal_id + resolved_at, and persists the outcome.
 *
 * Performance (Sprint 3L.3): refreshSnapshot() loads Polymarket events ONCE
 * per run. Resolvers look up getCurrentState() synchronously from the cache.
 * clearSnapshot() releases the cache in finally to avoid memory retention
 * between cron invocations.
 */

import type { ResolutionResult, SignalResolver } from './types';
import { volumeSurgeResolver }           from './resolvers/volume-surge';
import { lineMoveResolver }              from './resolvers/line-move';
import { crossSourceDivergenceResolver } from './resolvers/cross-source-divergence';
import { spreadCompressionResolver }     from './resolvers/spread-compression';
import { openInterestShiftResolver }     from './resolvers/open-interest-shift';
import { fetchDueSignals, writeResolution } from '../persistence';
import { refreshSnapshot, clearSnapshot } from './polymarket-fetch';

const RESOLVERS: SignalResolver[] = [
  volumeSurgeResolver,
  lineMoveResolver,
  crossSourceDivergenceResolver,
  spreadCompressionResolver,
  openInterestShiftResolver,
];

/**
 * Main entry point. Resolves all signals whose decay window has expired
 * and that have not yet been resolved. Returns the array of persisted results.
 */
export async function resolvePendingSignals(): Promise<ResolutionResult[]> {
  const dueSignals = await fetchDueSignals();

  if (dueSignals.length === 0) {
    console.log('[resolution/engine] No due signals to resolve');
    return [];
  }

  console.log(`[resolution/engine] ${dueSignals.length} signals due for resolution`);

  // Load Polymarket snapshot ONCE for the entire run
  await refreshSnapshot();

  const results: ResolutionResult[] = [];

  try {
    for (const signal of dueSignals) {
      const resolver = RESOLVERS.find(r => r.canResolve(signal));

      if (!resolver) {
        console.warn(
          `[resolution/engine] No resolver for signal_type="${signal.signal_type}" (id=${signal.id})`
        );
        continue;
      }

      let partial: Omit<ResolutionResult, 'signal_id' | 'resolved_at'> | null = null;
      try {
        partial = await resolver.resolve(signal);
      } catch (err) {
        console.error(
          `[resolution/engine] Resolver "${resolver.name}" threw for signal ${signal.id}:`,
          err
        );
        continue;
      }

      if (partial === null) {
        console.log(
          `[resolution/engine] Resolver "${resolver.name}" returned null for ${signal.id} — outcome not yet determinable`
        );
        continue;
      }

      const fullResult: ResolutionResult = {
        ...partial,
        signal_id:   signal.id,
        resolved_at: new Date().toISOString(),
      };

      const ok = await writeResolution(fullResult);
      if (ok) {
        results.push(fullResult);
      } else {
        console.error(
          `[resolution/engine] writeResolution failed for signal ${signal.id} — result DROPPED`
        );
      }
    }
  } finally {
    clearSnapshot();
  }

  console.log(
    `[resolution/engine] Resolved ${results.length} / ${dueSignals.length} due signals`
  );
  return results;
}
