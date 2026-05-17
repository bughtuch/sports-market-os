/**
 * Resolution Engine — Sprint 3L.1.
 *
 * Fetches signals whose decay window has elapsed, routes each through its
 * paired resolver, and persists the outcome.
 *
 * Individual resolvers are stubs until Sprint 3L.2. Errors thrown by resolvers
 * are caught here so a single failing resolver never blocks the others.
 */

import type { ResolutionResult } from './types';
import type { SignalResolver } from './types';
import { volumeSurgeResolver }           from './resolvers/volume-surge';
import { lineMoveResolver }              from './resolvers/line-move';
import { crossSourceDivergenceResolver } from './resolvers/cross-source-divergence';
import { spreadCompressionResolver }     from './resolvers/spread-compression';
import { openInterestShiftResolver }     from './resolvers/open-interest-shift';
import { fetchDueSignals, writeResolution } from '../persistence';

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

  const results: ResolutionResult[] = [];

  for (const signal of dueSignals) {
    const resolver = RESOLVERS.find(r => r.canResolve(signal));

    if (!resolver) {
      console.warn(
        `[resolution/engine] No resolver for signal_type="${signal.signal_type}" (id=${signal.id})`
      );
      continue;
    }

    let result: ResolutionResult | null = null;
    try {
      result = await resolver.resolve(signal);
    } catch (err) {
      console.error(
        `[resolution/engine] Resolver "${resolver.name}" threw for signal ${signal.id}:`,
        err
      );
      continue;
    }

    if (result === null) {
      console.log(
        `[resolution/engine] Resolver "${resolver.name}" returned null for ${signal.id} — outcome not yet determinable`
      );
      continue;
    }

    const ok = await writeResolution(result);
    if (ok) {
      results.push(result);
    } else {
      console.error(
        `[resolution/engine] writeResolution failed for signal ${signal.id} — result DROPPED`
      );
    }
  }

  console.log(
    `[resolution/engine] Resolved ${results.length} / ${dueSignals.length} due signals`
  );
  return results;
}
