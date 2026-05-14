import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getUserAlertRules,
  addAlertRule,
  toggleAlertRule,
  removeAlertRule,
} from "@/lib/alerts/persistent/alertRuleEngine";
import { computeAlertRuleStats } from "@/lib/alerts/persistent/alertPersistence";
import type { CreateAlertRulePayload } from "@/lib/alerts/persistent/persistentAlertTypes";

export const dynamic = "force-dynamic";

// ─── GET — list user's alert rules ───────────────────────────────────────────

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ rules: [], stats: null, source: "no-supabase" });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rules = await getUserAlertRules(supabase, user.id);
  const stats = computeAlertRuleStats(rules);
  return NextResponse.json({ rules, stats });
}

// ─── POST — create or update a rule ──────────────────────────────────────────

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { action, ruleId, payload, enabled } = body as {
    action?:  "create" | "toggle" | "delete";
    ruleId?:  string;
    payload?: CreateAlertRulePayload;
    enabled?: boolean;
  };

  if (action === "toggle" && ruleId && enabled !== undefined) {
    const result = await toggleAlertRule(supabase, user.id, ruleId, enabled);
    return NextResponse.json(result);
  }

  if (action === "delete" && ruleId) {
    const result = await removeAlertRule(supabase, user.id, ruleId);
    return NextResponse.json(result);
  }

  if (action === "create" && payload) {
    const result = await addAlertRule(supabase, user.id, payload);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ rule: result.rule });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
