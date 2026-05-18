/**
 * sportAccuracy — queries signal_resolutions joined to signals
 * to compute per-sport accuracy statistics and calibration buckets.
 */

import { createClient } from "@supabase/supabase-js";
import type { CalibrationBucket } from "@/components/CalibrationChart";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export interface SportAccuracyStats {
  totalResolved: number;
  correctCount: number;
  incorrectCount: number;
  hitRate: number | null;       // null if not enough data
  avgConfidence: number | null;
  calibrationBuckets: CalibrationBucket[];
  hasEnoughData: boolean;       // true if totalResolved >= 20
}

// Confidence buckets: 50-59, 60-69, 70-79, 80-89, 90-100
const BUCKETS = [
  { label: "50-59%", min: 50,  max: 59,  expected: 0.545 },
  { label: "60-69%", min: 60,  max: 69,  expected: 0.645 },
  { label: "70-79%", min: 70,  max: 79,  expected: 0.745 },
  { label: "80-89%", min: 80,  max: 89,  expected: 0.845 },
  { label: "90-100%",min: 90,  max: 100, expected: 0.95  },
];

export async function getSportAccuracy(sport: string): Promise<SportAccuracyStats> {
  const db = adminClient();

  // Fetch resolutions for this sport by joining through signals
  // Supabase JS v2: no native JOIN — two-query approach
  const { data: signals, error: sigError } = await db
    .from("signals")
    .select("id, confidence")
    .eq("sport", sport)
    .eq("is_published", true);

  if (sigError || !signals || signals.length === 0) {
    return emptyStats();
  }

  const signalIds = signals.map((s: { id: string }) => s.id);
  const confMap = new Map<string, number>(
    signals.map((s: { id: string; confidence: number }) => [s.id, s.confidence])
  );

  // Fetch resolutions for these signal IDs
  // In chunks to avoid URL length limits (Supabase .in() can handle ~1000)
  const CHUNK = 500;
  const allResolutions: Array<{ signal_id: string; outcome: string }> = [];

  for (let i = 0; i < signalIds.length; i += CHUNK) {
    const chunk = signalIds.slice(i, i + CHUNK);
    const { data: res, error: resError } = await db
      .from("signal_resolutions")
      .select("signal_id, outcome")
      .in("signal_id", chunk);

    if (!resError && res) {
      allResolutions.push(...(res as Array<{ signal_id: string; outcome: string }>));
    }
  }

  if (allResolutions.length === 0) {
    return emptyStats();
  }

  let correctCount = 0;
  let incorrectCount = 0;
  let confSum = 0;
  let confCount = 0;

  // Bucket accumulators: { total, correct }
  const bucketData = BUCKETS.map(() => ({ total: 0, correct: 0 }));

  for (const res of allResolutions) {
    if (res.outcome === "unresolved" || res.outcome === "expired") continue;

    const conf = confMap.get(res.signal_id);
    if (conf === undefined) continue;

    confSum += conf;
    confCount++;

    if (res.outcome === "correct") {
      correctCount++;
    } else if (res.outcome === "incorrect") {
      incorrectCount++;
    } else {
      continue;
    }

    // Place into bucket
    for (let b = 0; b < BUCKETS.length; b++) {
      const { min, max } = BUCKETS[b];
      if (conf >= min && conf <= max) {
        bucketData[b].total++;
        if (res.outcome === "correct") bucketData[b].correct++;
        break;
      }
    }
  }

  const totalResolved = correctCount + incorrectCount;
  const hitRate = totalResolved > 0 ? correctCount / totalResolved : null;
  const avgConfidence = confCount > 0 ? confSum / confCount : null;

  const calibrationBuckets: CalibrationBucket[] = BUCKETS.map((bkt, i) => ({
    bucket: bkt.label,
    hitRate: bucketData[i].total >= 5
      ? Math.round((bucketData[i].correct / bucketData[i].total) * 1000) / 1000
      : null,
    expected: bkt.expected,
    total: bucketData[i].total,
    resolved: bucketData[i].total,
  }));

  return {
    totalResolved,
    correctCount,
    incorrectCount,
    hitRate,
    avgConfidence: avgConfidence !== null ? Math.round(avgConfidence) : null,
    calibrationBuckets,
    hasEnoughData: totalResolved >= 20,
  };
}

function emptyStats(): SportAccuracyStats {
  return {
    totalResolved: 0,
    correctCount: 0,
    incorrectCount: 0,
    hitRate: null,
    avgConfidence: null,
    calibrationBuckets: BUCKETS.map((b) => ({
      bucket: b.label,
      hitRate: null,
      expected: b.expected,
      total: 0,
      resolved: 0,
    })),
    hasEnoughData: false,
  };
}
