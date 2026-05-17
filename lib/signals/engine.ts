/**
 * Signal Generation Engine — entry point for Sprint 3A.
 *
 * Fetches normalized events from Polymarket and The Odds API, runs all
 * detectors in parallel, applies the confidence threshold gate, and persists
 * every signal that passes to Supabase before returning it.
 *
 * THRESHOLD GATE: confidence >= THRESHOLD_CONFIDENCE is hard-coded.
 * There is no environment override. This is the trust mechanic — if a signal
 * is not in the ledger, it did not exist.
 *
 * If persistence fails for any signal, that signal is NOT returned and NOT
 * counted. Either it is in the ledger or it did not happen.
 *
 * Migration: supabase/migrations/20260516000000_signals_and_resolutions.sql
 */

import type { NormalizedMarketEvent, GeneratedSignal } from '../providers/types';
export type { GeneratedSignal } from '../providers/types';
import { fetchSportsEventsAll } from '../providers/polymarket';
import { fetchAllSportsEventsNormalized } from '../providers/oddsApi/normalize';
import { detectVolumeSurge } from './detectors/volume-surge';
import { detectLineMove } from './detectors/line-move';
import { detectCrossSourceDivergence } from './detectors/cross-source-divergence';
import { detectSpreadCompression } from './detectors/spread-compression';
import { detectOpenInterestShift } from './detectors/open-interest-shift';
import { writeSignal } from './persistence';

/** Hard-coded confidence threshold. Non-negotiable — no env override. */
export const THRESHOLD_CONFIDENCE = 70;

// ─── Main entry point ─────────────────────────────────────────────────────────

export async function generateSignals(): Promise<GeneratedSignal[]> {
  // ── 1. Fetch events from both sources in parallel ──────────────────────────
  const [polyEvents, oddsEvents] = await Promise.all([
    fetchSportsEventsAll().catch((err: unknown) => {
      console.error('[engine] Polymarket fetch failed:', err);
      return [] as NormalizedMarketEvent[];
    }),
    fetchAllSportsEventsNormalized().catch((err: unknown) => {
      console.error('[engine] Odds API fetch failed:', err);
      return [] as NormalizedMarketEvent[];
    }),
  ]);

  const allEvents: NormalizedMarketEvent[] = [...polyEvents, ...oddsEvents];

  console.log(
    `[engine] Events fetched — polymarket: ${polyEvents.length}, odds_api: ${oddsEvents.length}, total: ${allEvents.length}`
  );

  if (allEvents.length === 0) {
    console.warn('[engine] Zero events fetched — no signals possible');
    return [];
  }

  // ── 2. Run all detectors in parallel ──────────────────────────────────────
  const [
    volumeSurgeSignals,
    lineMoveSignals,
    crossSourceSignals,
    spreadCompressionSignals,
    openInterestSignals,
  ] = await Promise.all([
    detectVolumeSurge(allEvents).catch(() => [] as GeneratedSignal[]),
    detectLineMove(allEvents).catch(() => [] as GeneratedSignal[]),
    detectCrossSourceDivergence(allEvents).catch(() => [] as GeneratedSignal[]),
    detectSpreadCompression(allEvents).catch(() => [] as GeneratedSignal[]),
    detectOpenInterestShift(allEvents).catch(() => [] as GeneratedSignal[]),
  ]);

  const rawSignals: GeneratedSignal[] = [
    ...volumeSurgeSignals,
    ...lineMoveSignals,
    ...crossSourceSignals,
    ...spreadCompressionSignals,
    ...openInterestSignals,
  ];

  console.log(`[engine] Detector output — ${rawSignals.length} raw signals:`, {
    volume_surge: volumeSurgeSignals.length,
    line_move: lineMoveSignals.length,
    cross_source_divergence: crossSourceSignals.length,
    spread_compression: spreadCompressionSignals.length,
    open_interest_shift: openInterestSignals.length,
  });

  // ── 3. Apply hard threshold gate ──────────────────────────────────────────
  const aboveThreshold = rawSignals.filter(s => s.confidence >= THRESHOLD_CONFIDENCE);

  console.log(
    `[engine] After threshold (>= ${THRESHOLD_CONFIDENCE}): ${aboveThreshold.length} signals`
  );

  // ── 4. Persist — signal either lands in ledger or is dropped ──────────────
  const persisted: GeneratedSignal[] = [];

  for (const signal of aboveThreshold) {
    const ok = await writeSignal(signal);
    if (ok) {
      persisted.push(signal);
    } else {
      console.error(
        `[engine] Signal DROPPED — persistence failed for ${signal.id} (${signal.event_title} · ${signal.signal_type})`
      );
    }
  }

  console.log(`[engine] Persisted ${persisted.length} / ${aboveThreshold.length} signals`);
  return persisted;
}
