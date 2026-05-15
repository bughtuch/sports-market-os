/**
 * apiQuotaEngine.ts — Full quota status for a user/plan pair.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { ApiPlan, QuotaStatus } from "./apiPlanTypes";
import { checkRateLimit } from "./apiRateLimit";

export async function getQuotaStatus(
  supabase: SupabaseClient,
  userId:   string,
  plan:     ApiPlan,
): Promise<QuotaStatus> {
  const rl = await checkRateLimit(supabase, userId, plan);

  const percentUsed = rl.limit > 0
    ? Math.min(100, Math.round((rl.used / rl.limit) * 100))
    : 0;

  return {
    used:        rl.used,
    limit:       rl.limit,
    remaining:   rl.remaining,
    resetAt:     rl.resetAt,
    plan,
    percentUsed,
    degraded:    rl.degraded,
  };
}

/** Build the rate-limit response headers for a request. */
export function buildRateLimitHeaders(quota: QuotaStatus, plan: ApiPlan): Record<string, string> {
  return {
    "X-SMO-Plan":                plan,
    "X-SMO-RateLimit-Limit":     quota.limit.toString(),
    "X-SMO-RateLimit-Remaining": quota.remaining.toString(),
    "X-SMO-RateLimit-Reset":     quota.resetAt,
  };
}
