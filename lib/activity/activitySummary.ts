/**
 * activitySummary.ts — Fetch and aggregate user activity from Supabase.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { ActivitySummary, DailyActivity } from "./activityTypes";

export async function fetchActivitySummary(
  supabase: SupabaseClient,
  userId: string,
): Promise<ActivitySummary> {
  const today = new Date().toISOString().split("T")[0];

  const { data: rows } = await supabase
    .from("user_activity_daily")
    .select("*")
    .eq("user_id", userId)
    .order("activity_date", { ascending: false })
    .limit(30);

  const { data: eventCount } = await supabase
    .from("user_activity_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  const daily = (rows ?? []) as DailyActivity[];
  const todayRow = daily.find(r => r.activity_date === today) ?? null;

  // Compute streak: consecutive days ending today with any activity
  const streak = computeStreak(daily);

  return {
    today:       todayRow,
    last7Days:   daily.slice(0, 7),
    streak,
    totalEvents: (eventCount as unknown as { count: number } | null)?.count ?? 0,
  };
}

function computeStreak(daily: DailyActivity[]): number {
  if (!daily.length) return 0;

  // Sort descending by date
  const sorted = [...daily].sort((a, b) =>
    b.activity_date.localeCompare(a.activity_date)
  );

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  let streak = 0;
  let expected = today;

  for (const row of sorted) {
    const rowDate = new Date(row.activity_date + "T00:00:00Z");
    const diff = (expected.getTime() - rowDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diff > 1) break;  // gap in streak

    const hasActivity =
      row.terminal_views +
      row.exports_created +
      row.alerts_created +
      row.briefs_viewed +
      row.watchlists_used +
      row.distribution_actions > 0;

    if (hasActivity) {
      streak++;
      expected = rowDate;
    } else {
      break;
    }
  }

  return streak;
}

export async function fetchRecentEvents(
  supabase: SupabaseClient,
  userId: string,
  limit = 10,
) {
  const { data } = await supabase
    .from("user_activity_events")
    .select("event_type, route, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}
