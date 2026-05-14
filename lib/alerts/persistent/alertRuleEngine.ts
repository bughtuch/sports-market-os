/**
 * alertRuleEngine.ts — Orchestrates alert rule creation, evaluation,
 * and triggered alert recording. Composes persistence + evaluation layers.
 *
 * All functions require an authenticated Supabase client.
 * Evaluation runs against simulated market state — no external API calls.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  PersistentAlertRule,
  TriggeredAlert,
  CreateAlertRulePayload,
} from "./persistentAlertTypes";
import {
  fetchAlertRules,
  createAlertRule,
  updateAlertRule,
  deleteAlertRule,
  fetchTriggeredAlerts,
  insertTriggeredAlert,
} from "./alertPersistence";
import {
  evaluateAlertRules,
  buildTriggeredAlertFromResult,
} from "./alertEvaluation";

// ─── Rule management ──────────────────────────────────────────────────────────

export async function getUserAlertRules(
  supabase: SupabaseClient,
  userId: string,
): Promise<PersistentAlertRule[]> {
  return fetchAlertRules(supabase, userId);
}

export async function addAlertRule(
  supabase: SupabaseClient,
  userId: string,
  payload: CreateAlertRulePayload,
): Promise<{ rule?: PersistentAlertRule; error?: string }> {
  return createAlertRule(supabase, userId, payload);
}

export async function toggleAlertRule(
  supabase: SupabaseClient,
  userId: string,
  ruleId: string,
  enabled: boolean,
): Promise<{ success: boolean; error?: string }> {
  return updateAlertRule(supabase, userId, ruleId, { enabled });
}

export async function removeAlertRule(
  supabase: SupabaseClient,
  userId: string,
  ruleId: string,
): Promise<{ success: boolean; error?: string }> {
  return deleteAlertRule(supabase, userId, ruleId);
}

// ─── Triggered alerts ─────────────────────────────────────────────────────────

export async function getTriggeredAlerts(
  supabase: SupabaseClient,
  userId: string,
  limit = 50,
): Promise<TriggeredAlert[]> {
  return fetchTriggeredAlerts(supabase, userId, limit);
}

// ─── Evaluation ───────────────────────────────────────────────────────────────

/**
 * Evaluates all enabled rules for a user and records any that fire.
 * Returns the new triggered alerts. Safe to call repeatedly — evaluation
 * is stateless and writes are append-only.
 */
export async function runAlertEvaluation(
  supabase: SupabaseClient,
  userId: string,
): Promise<TriggeredAlert[]> {
  const rules   = await fetchAlertRules(supabase, userId);
  const results = evaluateAlertRules(rules);
  const created: TriggeredAlert[] = [];

  for (const result of results) {
    if (!result.triggered) continue;
    const rule = rules.find((r) => r.id === result.ruleId);
    if (!rule) continue;

    const payload = buildTriggeredAlertFromResult(rule, result);
    if (!payload) continue;

    const { success } = await insertTriggeredAlert(supabase, payload);
    if (success) {
      // Optimistically add to returned list
      created.push({
        ...payload,
        id:           `${rule.id}-${Date.now()}`,
        triggered_at: new Date().toISOString(),
      });
    }
  }

  return created;
}

// ─── Watchlist automation — suggest rules from preferences ───────────────────

export interface SuggestedRule {
  alert_type:  CreateAlertRulePayload["alert_type"];
  sport?:      string;
  severity:    CreateAlertRulePayload["severity"];
  threshold?:  number;
  reason:      string;
}

export function suggestRulesFromPreferences(
  favoriteSports: string[],
  intelligenceFocus: string[],
): SuggestedRule[] {
  const suggestions: SuggestedRule[] = [];

  if (favoriteSports.includes("Horse Racing")) {
    suggestions.push({ alert_type: "volatility-spike",    sport: "Horse Racing", severity: "high",   threshold: 2.0, reason: "Horse Racing in your favourite sports" });
    suggestions.push({ alert_type: "queue-deterioration", sport: "Horse Racing", severity: "high",   threshold: 0.3, reason: "Betfair queue health is critical pre-race" });
  }
  if (favoriteSports.includes("Tennis")) {
    suggestions.push({ alert_type: "ai-confidence",       sport: "Tennis",       severity: "medium", threshold: 80,  reason: "Tennis in your favourite sports" });
  }
  if (favoriteSports.includes("NFL") || favoriteSports.includes("NBA")) {
    suggestions.push({ alert_type: "market-regime-change",sport: favoriteSports.includes("NFL") ? "NFL" : "NBA", severity: "medium", reason: "US sports regime shifts drive major line moves" });
  }
  if (favoriteSports.includes("UFC")) {
    suggestions.push({ alert_type: "catalyst-detected",   sport: "UFC",          severity: "high",   reason: "UFC weight-cut and injury news drives rapid price moves" });
  }
  if (favoriteSports.includes("Football")) {
    suggestions.push({ alert_type: "exchange-flow-shift", sport: "Football",     severity: "medium", threshold: 80, reason: "Football exchange flow is your primary edge signal" });
  }
  if (favoriteSports.includes("Prediction Markets")) {
    suggestions.push({ alert_type: "liquidity-anomaly",   sport: "Prediction Markets", severity: "low", reason: "Prediction market liquidity anomalies signal consensus breaks" });
  }

  if (intelligenceFocus.includes("volatility") && !favoriteSports.includes("Horse Racing")) {
    suggestions.push({ alert_type: "volatility-spike",    severity: "high", threshold: 2.0, reason: "Volatility is in your intelligence focus" });
  }
  if (intelligenceFocus.includes("exchange-flow") && !favoriteSports.includes("Football")) {
    suggestions.push({ alert_type: "exchange-flow-shift", severity: "medium", threshold: 80, reason: "Exchange flow is in your intelligence focus" });
  }
  if (intelligenceFocus.includes("ai-narratives") || intelligenceFocus.includes("market-regimes")) {
    suggestions.push({ alert_type: "ai-confidence",       severity: "medium", threshold: 85, reason: "AI intelligence is in your focus" });
  }

  // Deduplicate by alert_type + sport
  const seen = new Set<string>();
  return suggestions.filter((s) => {
    const key = `${s.alert_type}:${s.sport ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
