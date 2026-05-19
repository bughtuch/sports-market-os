/**
 * Odds API Signal Engine — generates signals from live bookmaker data.
 *
 * Runs independently of the Polymarket engine. Both write to the same
 * signals table with source='the_odds_api'.
 *
 * Two detectors run on every fetch:
 *   1. detectSportsbookDivergence — books disagree on implied prob by ≥5 pp
 *   2. detectSteamMove — strong bookmaker consensus (≥4 books, ≥55% implied)
 *
 * Line-move detection is intentionally absent here — it requires Odds API
 * historical odds endpoint (additional quota). Cross-source divergence remains
 * in the main engine (polymarket vs odds API comparison).
 *
 * Threshold gate: same as main engine, confidence >= 70.
 */

import type { GeneratedSignal } from "../providers/types";
import { fetchMatchesBySportKeys } from "../providers/oddsApi/fetchMatches";
import { SPORT_KEY_MAP } from "../providers/oddsApi/sportKeys";
import { detectSportsbookDivergenceBatch } from "./detectors/odds-divergence";
import { detectSteamMoveBatch } from "./detectors/odds-steam";
import { writeSignal } from "./persistence";
import { generateNarrative, updateSignalNarrative } from "./narrator";

const THRESHOLD_CONFIDENCE = 70;

// Sports to run the Odds API engine over (in priority order per sport)
const ODDS_ENGINE_SPORTS: Array<{ sport: string; keys: string[] }> = [
  { sport: "tennis",   keys: SPORT_KEY_MAP.tennis.slice(0, 4) }, // tournament keys first
  { sport: "nba",      keys: SPORT_KEY_MAP.nba },
  { sport: "nfl",      keys: SPORT_KEY_MAP.nfl },
  { sport: "nhl",      keys: SPORT_KEY_MAP.nhl },
  { sport: "football", keys: SPORT_KEY_MAP.football.slice(0, 3) },
  { sport: "ufc",      keys: SPORT_KEY_MAP.ufc },
  { sport: "mlb",      keys: SPORT_KEY_MAP.mlb },
];

// ── Dedup: avoid re-emitting signals for the same event × type within 2h ─────

async function getRecentEventSignalTypes(
  eventIds: string[]
): Promise<Set<string>> {
  if (eventIds.length === 0) return new Set();

  const { createClient } = await import("@supabase/supabase-js");
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const since2h = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

  const { data } = await db
    .from("signals")
    .select("event_id, signal_type")
    .in("event_id", eventIds.slice(0, 500))
    .gte("generated_at", since2h);

  return new Set((data ?? []).map((r: { event_id: string; signal_type: string }) => `${r.event_id}::${r.signal_type}`));
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function runOddsApiSignalGeneration(): Promise<{
  generated: number;
  errors: number;
  skipped_dedup: number;
  sports_attempted: number;
}> {
  let generated = 0;
  let errors = 0;
  let skipped_dedup = 0;

  console.log("[odds-engine] Starting Odds API signal generation");

  // Collect all sport key batches and fetch in parallel
  const allMatches = await Promise.all(
    ODDS_ENGINE_SPORTS.map(({ keys }) =>
      fetchMatchesBySportKeys(keys).catch((err) => {
        console.error("[odds-engine] fetchMatchesBySportKeys failed:", err);
        return [];
      })
    )
  );

  // Merge and deduplicate by event ID across all sports
  const seenIds = new Set<string>();
  const mergedMatches = allMatches.flat().filter((m) => {
    if (seenIds.has(m.id)) return false;
    seenIds.add(m.id);
    return true;
  });

  console.log(`[odds-engine] ${mergedMatches.length} unique matches fetched`);

  if (mergedMatches.length === 0) {
    return { generated: 0, errors: 0, skipped_dedup: 0, sports_attempted: ODDS_ENGINE_SPORTS.length };
  }

  // ── Run detectors ──────────────────────────────────────────────────────────
  const divergenceSignals = detectSportsbookDivergenceBatch(mergedMatches);
  const steamSignals = detectSteamMoveBatch(mergedMatches);
  const rawSignals: GeneratedSignal[] = [...divergenceSignals, ...steamSignals];

  console.log(`[odds-engine] Detectors: divergence=${divergenceSignals.length}, steam=${steamSignals.length}`);

  // ── Threshold gate ─────────────────────────────────────────────────────────
  const above = rawSignals.filter((s) => s.confidence >= THRESHOLD_CONFIDENCE);
  console.log(`[odds-engine] Above threshold (${THRESHOLD_CONFIDENCE}): ${above.length}/${rawSignals.length}`);

  // ── Dedup check: skip event×type combos already written in last 2h ─────────
  const eventIds = [...new Set(above.map((s) => s.event_id))];
  const recentKeys = await getRecentEventSignalTypes(eventIds).catch(() => new Set<string>());

  const toWrite = above.filter((s) => {
    const key = `${s.event_id}::${s.signal_type}`;
    if (recentKeys.has(key)) {
      skipped_dedup++;
      return false;
    }
    return true;
  });

  console.log(`[odds-engine] After dedup: ${toWrite.length} to write (${skipped_dedup} skipped)`);

  // ── Persist + narrate ─────────────────────────────────────────────────────
  for (const signal of toWrite) {
    const ok = await writeSignal(signal).catch(() => false);
    if (!ok) {
      errors++;
      continue;
    }

    // Generate narrative inline (same pattern as main engine via backfill cron)
    try {
      const narrative = await generateNarrative(signal);
      await updateSignalNarrative(signal.id, narrative);
    } catch (err) {
      console.warn(`[odds-engine] Narrator failed for ${signal.id}:`, err);
      // Non-fatal — signal is written without narrative, backfill cron will catch it
    }

    generated++;
  }

  console.log(`[odds-engine] Done: generated=${generated}, errors=${errors}, skipped_dedup=${skipped_dedup}`);

  return {
    generated,
    errors,
    skipped_dedup,
    sports_attempted: ODDS_ENGINE_SPORTS.length,
  };
}
