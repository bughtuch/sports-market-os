/**
 * Spread Compression resolver stub — Sprint 3L.1.
 * Full implementation in Sprint 3L.2.
 */

import type { GeneratedSignal } from '../../engine';
import type { SignalResolver, ResolutionResult } from '../types';

export const spreadCompressionResolver: SignalResolver = {
  name: 'spread_compression',

  canResolve(signal: GeneratedSignal): boolean {
    return signal.signal_type === 'spread_compression';
  },

  async resolve(_signal: GeneratedSignal): Promise<ResolutionResult | null> {
    throw new Error('spread_compression resolver not yet implemented (Sprint 3L.2)');
  },
};
