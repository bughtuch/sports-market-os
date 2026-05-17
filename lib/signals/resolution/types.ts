/**
 * Resolution Engine types — Sprint 3L.1.
 *
 * A ResolutionResult records what actually happened after a signal decayed.
 * A SignalResolver is a detector-paired module that knows how to verify its own signal type.
 */

import type { GeneratedSignal } from '../engine';

export type ResolutionOutcome = 'correct' | 'incorrect' | 'void' | 'expired';

export interface ResolutionResult {
  signal_id:         string;
  resolved_at:       string; // ISO timestamp
  outcome:           ResolutionOutcome;
  resolver:          string; // e.g. "volume-surge"
  actual_direction?: string;
  actual_magnitude?: number;
  notes?:            string;
}

export interface SignalResolver {
  /** Identifier matching the signal_type field produced by the paired detector. */
  name: string;
  /** Returns true if this resolver handles the given signal. */
  canResolve(signal: GeneratedSignal): boolean;
  /**
   * Attempt resolution. Returns null if resolution data is unavailable
   * (e.g. outcome not yet determinable even though decay window passed).
   */
  resolve(signal: GeneratedSignal): Promise<ResolutionResult | null>;
}
