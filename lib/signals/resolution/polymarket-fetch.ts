/**
 * Shared helper — fetch current Polymarket market state for resolution.
 * Wraps fetchEventDetail; returns null on any error so resolvers can handle gracefully.
 */

import { fetchEventDetail } from '@/lib/providers/polymarket';
import type { NormalizedMarketEvent } from '@/lib/providers/types';

export async function getCurrentState(eventId: string): Promise<NormalizedMarketEvent | null> {
  try {
    return await fetchEventDetail(eventId);
  } catch (err) {
    console.error('[resolution/polymarket-fetch] fetchEventDetail failed', { eventId, err });
    return null;
  }
}
