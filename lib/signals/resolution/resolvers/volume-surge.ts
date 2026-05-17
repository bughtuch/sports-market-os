/**
 * Volume Surge resolver stub — Sprint 3L.1.
 * Full implementation in Sprint 3L.2.
 */

import type { GeneratedSignal } from '../../engine';
import type { SignalResolver, ResolutionResult } from '../types';

export const volumeSurgeResolver: SignalResolver = {
  name: 'volume_surge',

  canResolve(signal: GeneratedSignal): boolean {
    return signal.signal_type === 'volume_surge';
  },

  async resolve(_signal: GeneratedSignal): Promise<ResolutionResult | null> {
    throw new Error('volume_surge resolver not yet implemented (Sprint 3L.2)');
  },
};
