import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runAlertEvaluation } from "@/lib/alerts/persistent/alertRuleEngine";

export const dynamic = "force-dynamic";

/**
 * POST /api/alerts/evaluate
 * Evaluates all enabled alert rules for the authenticated user against
 * simulated market state and records any that fire as triggered_alerts.
 * In production: trigger this on a cron schedule or on provider data push.
 */
export async function POST() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const triggered = await runAlertEvaluation(supabase, user.id);
  return NextResponse.json({ triggered, count: triggered.length });
}
