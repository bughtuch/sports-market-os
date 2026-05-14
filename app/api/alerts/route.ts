import { NextResponse } from "next/server";
import { generateAlerts, getAlertStats } from "@/lib/alerts/alertEngine";
import { DEFAULT_ALERT_RULES } from "@/lib/alerts/alertRules";

export const dynamic = "force-dynamic";

export async function GET() {
  const alerts = generateAlerts();
  const stats  = getAlertStats();

  return NextResponse.json({
    alerts,
    stats,
    rules:       DEFAULT_ALERT_RULES,
    generatedAt: new Date().toISOString(),
  });
}
