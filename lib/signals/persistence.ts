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
