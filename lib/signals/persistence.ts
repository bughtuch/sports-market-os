/**
 * Signal persistence layer — Supabase service-role writes, public reads.
 *
 * Uses service role key for writes (bypasses RLS).
 * Uses anon key for reads (RLS policy: public SELECT on is_published = true).
 *
 * Migration: supabase/migrations/20260516000000_signals_and_resolutions.sql
 */

import { createClient } from '@supabase/supabase-js';
import type { GeneratedSignal, Sport } from '../providers/types';
import type { ResolutionResult } from './resolution/types';

// Service-role client — writes only. Never expose to client side.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Public client — reads via anon key (RLS applies).
const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── Writes ───────────────────────────────────────────────────────────────────

/**
 * Insert a GeneratedSignal into the signals table.
 * Returns true on success, false on failure.
 * Failed signals are NOT returned to callers — ledger integrity is non-negotiable.
 */
export async function writeSignal(signal: GeneratedSignal): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from('signals').insert({
      id:                  signal.id,
      generated_at:        signal.generated_at,
      sport:               signal.sport,
      market_type:         signal.market_type,
      source:              signal.source,
      event_id:            signal.event_id,
      event_title:         signal.event_title,
      signal_type:         signal.signal_type,
      predicted_direction: signal.predicted_direction,
      predicted_magnitude: signal.predicted_magnitude ?? null,
      confidence:          signal.confidence,
      decay_window_minutes: signal.decay_window_minutes,
      narrative:           signal.narrative ?? null,
      historical_analog:   signal.historical_analog ?? null,
      raw_inputs:          signal.raw_inputs,
      is_published:        signal.is_published,
    });

    if (error) {
      console.error('[signals/persistence] writeSignal failed:', error.message, {
        signal_id: signal.id,
        event_title: signal.event_title,
        signal_type: signal.signal_type,
      });
      return false;
    }
    return true;
  } catch (err) {
    console.error('[signals/persistence] writeSignal exception:', err, {
      signal_id: signal.id,
    });
    return false;
  }
}

// ─── Reads ────────────────────────────────────────────────────────────────────

export async function fetchPublishedSignals(
  limit = 50
): Promise<GeneratedSignal[]> {
  const { data, error } = await supabasePublic
    .from('signals')
    .select('*')
    .eq('is_published', true)
    .order('generated_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[signals/persistence] fetchPublishedSignals error:', error.message);
    return [];
  }
  return (data ?? []) as GeneratedSignal[];
}

export async function fetchSignalsBySport(
  sport: Sport,
  limit = 20
): Promise<GeneratedSignal[]> {
  const { data, error } = await supabasePublic
    .from('signals')
    .select('*')
    .eq('sport', sport)
    .eq('is_published', true)
    .order('generated_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[signals/persistence] fetchSignalsBySport error:', error.message);
    return [];
  }
  return (data ?? []) as GeneratedSignal[];
}

/**
 * Insert a ResolutionResult into the signal_resolutions table.
 * Returns true on success, false on failure.
 */
export async function writeResolution(result: ResolutionResult): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from('signal_resolutions').insert({
      signal_id:        result.signal_id,
      resolved_at:      result.resolved_at,
      outcome:          result.outcome,
      resolver:         result.resolver,
      actual_direction: result.actual_direction ?? null,
      actual_magnitude: result.actual_magnitude ?? null,
      notes:            result.notes ?? null,
    });

    if (error) {
      console.error('[signals/persistence] writeResolution failed:', error.message, {
        signal_id: result.signal_id,
        resolver: result.resolver,
      });
      return false;
    }
    return true;
  } catch (err) {
    console.error('[signals/persistence] writeResolution exception:', err, {
      signal_id: result.signal_id,
    });
    return false;
  }
}

/**
 * Fetch signals whose decay window has elapsed and that have no resolution record yet.
 *
 * Two-query approach (Supabase JS v2 has no LEFT JOIN):
 *   1. Collect all already-resolved signal IDs from signal_resolutions.
 *   2. Fetch published signals, filter in JS to those past their decay window
 *      and not already resolved.
 */
export async function fetchDueSignals(limit = 100): Promise<GeneratedSignal[]> {
  // Step 1 — IDs that already have a resolution
  const { data: resolved, error: resolvedError } = await supabaseAdmin
    .from('signal_resolutions')
    .select('signal_id');

  if (resolvedError) {
    console.error('[signals/persistence] fetchDueSignals (resolved IDs) error:', resolvedError.message);
    return [];
  }

  const resolvedIds = new Set((resolved ?? []).map((r: { signal_id: string }) => r.signal_id));

  // Step 2 — Published signals, newest first; we'll filter decay in JS
  const { data, error } = await supabaseAdmin
    .from('signals')
    .select('*')
    .eq('is_published', true)
    .order('generated_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[signals/persistence] fetchDueSignals (signals) error:', error.message);
    return [];
  }

  const now = Date.now();

  return ((data ?? []) as GeneratedSignal[]).filter(signal => {
    if (resolvedIds.has(signal.id)) return false;
    const generatedMs  = new Date(signal.generated_at).getTime();
    const decayMs      = (signal.decay_window_minutes ?? 0) * 60_000;
    return generatedMs + decayMs < now;
  });
}

export async function getSignalCount(): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from('signals')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('[signals/persistence] getSignalCount error:', error.message);
    return 0;
  }
  return count ?? 0;
}
