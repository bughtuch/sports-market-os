import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTriggeredAlerts } from "@/lib/alerts/persistent/alertRuleEngine";
import { computeTriggeredAlertStats } from "@/lib/alerts/persistent/alertPersistence";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ alerts: [], stats: null, source: "no-supabase" });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 200);

  const alerts = await getTriggeredAlerts(supabase, user.id, limit);
  const stats  = computeTriggeredAlertStats(alerts);
  return NextResponse.json({ alerts, stats });
}
