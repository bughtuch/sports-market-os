/**
 * Resolution Engine types — Sprint 3L.1 / updated 3L.2.
 *
 * ResolutionResult maps 1-to-1 to the signal_resolutions DB table.
 * signal_id and resolved_at are optional here — the engine fills them in
 * before calling writeResolution(); resolvers only return the analysis fields.
 */

import type { GeneratedSignal } from '../engine';

export type ResolutionOutcome = 'correct' | 'incorrect' | 'unresolved' | 'expired';

export interface ResolutionResult {
  /** Set by engine, not resolver. */
  signal_id?:        string;
  /** Set by engine, not resolver. ISO timestamp. */
  resolved_at?:      string;
  /** Maps to resolution_method column — NOT NULL in DB. */
  resolution_method: string;
  outcome:           ResolutionOutcome;
  actual_direction?: string;
  actual_magnitude?: number;
  /** Maps to resolution_source JSONB column — NOT NULL in DB. */
  resolution_source: Record<string, unknown>;
}

export interface SignalResolver {
  /** Matches signal_type produced by the paired detector. */
  name: string;
  /** Returns true if this resolver handles the given signal. */
  canResolve(signal: GeneratedSignal): boolean;
  /**
   * Attempt resolution. signal_id and resolved_at are NOT required in the
   * return value — the engine stamps those before persisting.
   * Returns null if resolution data is unavailable (outcome not yet determinable).
   */
  resolve(signal: GeneratedSignal): Promise<Omit<ResolutionResult, 'signal_id' | 'resolved_at'> | null>;
}
