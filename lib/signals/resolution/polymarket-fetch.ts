/**
 * Per-run Polymarket snapshot cache — Sprint 3L.3.
 *
 * Problem: getCurrentState() previously called fetchEventDetail() which
 * crawls all sports via fetchSportsEventsAll(). With N due signals that
 * would be N full crawls per resolution run.
 *
 * Fix: call refreshSnapshot() ONCE at the start of resolvePendingSignals(),
 * then getCurrentState() does a synchronous Map lookup. clearSnapshot()
 * at the end releases the cache so memory is not held between cron runs.
 */

import { fetchSportsEventsAll } from '@/lib/providers/polymarket';
import type { NormalizedMarketEvent } from '@/lib/providers/types';

let cachedSnapshot: Map<string, NormalizedMarketEvent> | null = null;

/** Load all Polymarket events into the run cache. Call once per resolution run. */
export async function refreshSnapshot(): Promise<void> {
  const events = await fetchSportsEventsAll();
  const map = new Map<string, NormalizedMarketEvent>();
  for (const e of events) {
    map.set(e.event_id, e);
  }
  cachedSnapshot = map;
  console.log(`[resolution/cache] Loaded ${map.size} Polymarket events into snapshot`);
}

/** Synchronous cache lookup — call refreshSnapshot() first. */
export function getCurrentState(eventId: string): NormalizedMarketEvent | null {
  if (!cachedSnapshot) {
    console.warn('[resolution/cache] getCurrentState called before refreshSnapshot — returning null');
    return null;
  }
  return cachedSnapshot.get(eventId) ?? null;
}

/** Release the run cache. Call in finally after resolvePendingSignals(). */
export function clearSnapshot(): void {
  cachedSnapshot = null;
}
