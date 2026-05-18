/**
 * hotMarkets — returns the top N "hottest" events for a given sport,
 * scored by a composite heat formula.
 *
 * Heat score = (signal_count_24h × 10) + (avg_confidence × 0.5)
 *
 * (volume_24h is not stored in signals; omitted from formula.)
 * Groups by event_id, scores each group, returns top N sorted descending.
 */

import { createClient } from "@supabase/supabase-js";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export interface HotMarket {
  event_id: string;
  event_title: string;
  sport: string;
  signal_count: number;
  avg_confidence: number;
  latest_signal_type: string;
  latest_generated_at: string;
  heat_score: number;
}

export async function getHotMarkets(
  sport: string,
  limit = 5,
  windowHours = 48
): Promise<HotMarket[]> {
  const db = adminClient();
  const since = new Date(Date.now() - windowHours * 60 * 60 * 1000).toISOString();

  const { data, error } = await db
    .from("signals")
    .select("event_id, event_title, sport, signal_type, confidence, generated_at")
    .eq("sport", sport)
    .eq("is_published", true)
    .gte("generated_at", since)
    .order("generated_at", { ascending: false });

  if (error || !data) return [];

  // Group by event_id
  const groups = new Map<string, {
    event_id: string;
    event_title: string;
    sport: string;
    signals: Array<{ signal_type: string; confidence: number; generated_at: string }>;
  }>();

  for (const row of data) {
    const existing = groups.get(row.event_id);
    if (existing) {
      existing.signals.push({
        signal_type: row.signal_type,
        confidence: row.confidence,
        generated_at: row.generated_at,
      });
    } else {
      groups.set(row.event_id, {
        event_id: row.event_id,
        event_title: row.event_title,
        sport: row.sport,
        signals: [{
          signal_type: row.signal_type,
          confidence: row.confidence,
          generated_at: row.generated_at,
        }],
      });
    }
  }

  const markets: HotMarket[] = [];

  for (const group of groups.values()) {
    const signal_count = group.signals.length;
    const avg_confidence =
      group.signals.reduce((sum, s) => sum + (s.confidence ?? 0), 0) / signal_count;
    const heat_score = signal_count * 10 + avg_confidence * 0.5;
    const latest = group.signals[0]; // already sorted desc by generated_at

    markets.push({
      event_id: group.event_id,
      event_title: group.event_title,
      sport: group.sport,
      signal_count,
      avg_confidence: Math.round(avg_confidence),
      latest_signal_type: latest.signal_type,
      latest_generated_at: latest.generated_at,
      heat_score: Math.round(heat_score),
    });
  }

  return markets
    .sort((a, b) => b.heat_score - a.heat_score)
    .slice(0, limit);
}
