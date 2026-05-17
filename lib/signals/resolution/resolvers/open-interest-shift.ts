/**
 * Open Interest Shift resolver stub — Sprint 3L.1.
 * Full implementation in Sprint 3L.2.
 */

import type { GeneratedSignal } from '../../engine';
import type { SignalResolver, ResolutionResult } from '../types';

export const openInterestShiftResolver: SignalResolver = {
  name: 'open_interest_shift',

  canResolve(signal: GeneratedSignal): boolean {
    return signal.signal_type === 'open_interest_shift';
  },

  async resolve(_signal: GeneratedSignal): Promise<ResolutionResult | null> {
    throw new Error('open_interest_shift resolver not yet implemented (Sprint 3L.2)');
  },
};
