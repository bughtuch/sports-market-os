/**
 * GET /api/activity/retention
 * Returns retention score + component breakdown for the authenticated user.
 * Also returns platform-level stats where accessible (own data only via RLS).
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchActivitySummary } from "@/lib/activity/activitySummary";
import { computeRetentionScore } from "@/lib/activity/retentionScoring";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const summary      = await fetchActivitySummary(supabase, user.id);
  const score        = computeRetentionScore(summary);

  // Platform stats: aggregate today's activity_events count by type
  // (limited to own data via RLS — cross-user analytics requires service role)
  const today = new Date().toISOString().split("T")[0];

  const { data: todayEvents } = await supabase
    .from("user_activity_events")
    .select("event_type")
    .eq("user_id", user.id)
    .gte("created_at", today + "T00:00:00Z");

  const eventTypeCounts: Record<string, number> = {};
  for (const e of (todayEvents ?? []) as { event_type: string }[]) {
    eventTypeCounts[e.event_type] = (eventTypeCounts[e.event_type] ?? 0) + 1;
  }

  return NextResponse.json({
    score,
    summary,
    todayEventCounts: eventTypeCounts,
    totalToday: (todayEvents ?? []).length,
  });
}
