/**
 * alertPersistence.ts — Supabase CRUD for alert_rules and triggered_alerts.
 *
 * Server-side only. All functions require an authenticated Supabase client.
 * RLS ensures users can only access their own data.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  PersistentAlertRule,
  TriggeredAlert,
  CreateAlertRulePayload,
  AlertRuleStats,
  TriggeredAlertStats,
  PersistentAlertType,
  PersistentSeverity,
} from "./persistentAlertTypes";

// ─── Alert rule CRUD ──────────────────────────────────────────────────────────

export async function fetchAlertRules(
  supabase: SupabaseClient,
  userId: string,
): Promise<PersistentAlertRule[]> {
  const { data, error } = await supabase
    .from("alert_rules")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as PersistentAlertRule[];
}

export async function createAlertRule(
  supabase: SupabaseClient,
  userId: string,
  payload: CreateAlertRulePayload,
): Promise<{ rule?: PersistentAlertRule; error?: string }> {
  const { data, error } = await supabase
    .from("alert_rules")
    .insert({
      user_id:    userId,
      market_slug: payload.market_slug,
      sport:      payload.sport,
      alert_type: payload.alert_type,
      threshold:  payload.threshold,
      severity:   payload.severity,
      enabled:    true,
      metadata:   payload.metadata ?? {},
    })
    .select()
    .single();

  if (error || !data) return { error: error?.message ?? "Insert failed" };
  return { rule: data as PersistentAlertRule };
}

export async function updateAlertRule(
  supabase: SupabaseClient,
  userId: string,
  ruleId: string,
  updates: Partial<Pick<PersistentAlertRule, "enabled" | "threshold" | "severity" | "sport" | "market_slug">>,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("alert_rules")
    .update(updates)
    .eq("id", ruleId)
    .eq("user_id", userId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteAlertRule(
  supabase: SupabaseClient,
  userId: string,
  ruleId: string,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("alert_rules")
    .delete()
    .eq("id", ruleId)
    .eq("user_id", userId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ─── Triggered alerts ─────────────────────────────────────────────────────────

export async function fetchTriggeredAlerts(
  supabase: SupabaseClient,
  userId: string,
  limit = 50,
): Promise<TriggeredAlert[]> {
  const { data, error } = await supabase
    .from("triggered_alerts")
    .select("*")
    .eq("user_id", userId)
    .order("triggered_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data as TriggeredAlert[];
}

export async function insertTriggeredAlert(
  supabase: SupabaseClient,
  alert: Omit<TriggeredAlert, "id" | "triggered_at">,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("triggered_alerts")
    .insert(alert);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ─── Stats aggregations ───────────────────────────────────────────────────────

export function computeAlertRuleStats(rules: PersistentAlertRule[]): AlertRuleStats {
  const byType: Record<string, number>     = {};
  const bySport: Record<string, number>    = {};
  const bySeverity: Record<string, number> = {};

  for (const rule of rules) {
    byType[rule.alert_type]         = (byType[rule.alert_type]         ?? 0) + 1;
    bySeverity[rule.severity]       = (bySeverity[rule.severity]       ?? 0) + 1;
    if (rule.sport) {
      bySport[rule.sport]           = (bySport[rule.sport]             ?? 0) + 1;
    }
  }

  return {
    total:     rules.length,
    enabled:   rules.filter((r) => r.enabled).length,
    disabled:  rules.filter((r) => !r.enabled).length,
    byType:    byType as Record<PersistentAlertType, number>,
    bySport,
    bySeverity: bySeverity as Record<PersistentSeverity, number>,
  };
}

export function computeTriggeredAlertStats(alerts: TriggeredAlert[]): TriggeredAlertStats {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const today    = alerts.filter((a) => new Date(a.triggered_at) >= todayStart);
  const sportMap: Record<string, number>  = {};
  const typeMap:  Record<string, number>  = {};

  for (const a of alerts) {
    if (a.sport)       sportMap[a.sport]              = (sportMap[a.sport]              ?? 0) + 1;
    if (a.metadata?.alert_type) {
      const t = a.metadata.alert_type as string;
      typeMap[t] = (typeMap[t] ?? 0) + 1;
    }
  }

  const mostActiveSport = Object.entries(sportMap).sort((a, b) => b[1] - a[1])[0]?.[0];
  const mostActiveType  = Object.entries(typeMap).sort((a, b) => b[1] - a[1])[0]?.[0] as PersistentAlertType | undefined;

  return {
    total:           alerts.length,
    today:           today.length,
    critical:        alerts.filter((a) => a.severity === "critical").length,
    high:            alerts.filter((a) => a.severity === "high").length,
    mostActiveSport,
    mostActiveType,
  };
}
