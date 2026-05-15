/**
 * GET /api/activity/summary
 * Returns the authenticated user's activity summary + retention score.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchActivitySummary, fetchRecentEvents } from "@/lib/activity/activitySummary";
import { computeRetentionScore } from "@/lib/activity/retentionScoring";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [summary, recentEvents] = await Promise.all([
    fetchActivitySummary(supabase, user.id),
    fetchRecentEvents(supabase, user.id, 5),
  ]);

  const retentionScore = computeRetentionScore(summary);

  return NextResponse.json({ summary, retentionScore, recentEvents });
}
