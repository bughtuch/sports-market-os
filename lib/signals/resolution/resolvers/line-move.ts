/**
 * Line Move resolver stub — Sprint 3L.1.
 * Full implementation in Sprint 3L.2.
 */

import type { GeneratedSignal } from '../../engine';
import type { SignalResolver, ResolutionResult } from '../types';

export const lineMoveResolver: SignalResolver = {
  name: 'line_move',

  canResolve(signal: GeneratedSignal): boolean {
    return signal.signal_type === 'line_move';
  },

  async resolve(_signal: GeneratedSignal): Promise<ResolutionResult | null> {
    throw new Error('line_move resolver not yet implemented (Sprint 3L.2)');
  },
};
