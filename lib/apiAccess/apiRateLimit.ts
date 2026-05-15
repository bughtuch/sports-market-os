/**
 * apiRateLimit.ts — Daily quota check using api_usage_events.
 *
 * No Redis. Uses Supabase COUNT on the indexed (user_id, created_at) column.
 * Graceful fallback: if the query fails, allows the request and marks degraded.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { ApiPlan } from "./apiPlanTypes";
import { DAILY_LIMIT } from "./apiPlanLimits";

export interface RateLimitResult {
  allowed:   boolean;
  used:      number;
  limit:     number;
  remaining: number;
  resetAt:   string;   // ISO — next UTC midnight
  degraded:  boolean;
}

/** Midnight UTC of the next day — when the daily counter resets. */
function nextUtcMidnight(): Date {
  const d = new Date();
  d.setUTCHours(24, 0, 0, 0);
  return d;
}

/** Start of today in UTC. */
function todayUtcStart(): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export async function checkRateLimit(
  supabase: SupabaseClient,
  userId:   string,
  plan:     ApiPlan,
): Promise<RateLimitResult> {
  const limit   = DAILY_LIMIT[plan];
  const resetAt = nextUtcMidnight().toISOString();

  try {
    const { count, error } = await supabase
      .from("api_usage_events")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", todayUtcStart().toISOString());

    if (error || count === null) {
      // Query failed — allow gracefully, mark degraded
      return { allowed: true, used: 0, limit, remaining: limit, resetAt, degraded: true };
    }

    const used      = count;
    const remaining = Math.max(0, limit - used);
    const allowed   = used < limit;

    return { allowed, used, limit, remaining, resetAt, degraded: false };
  } catch {
    return { allowed: true, used: 0, limit, remaining: limit, resetAt, degraded: true };
  }
}
