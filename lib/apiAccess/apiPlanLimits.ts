/**
 * apiPlanLimits.ts — Daily call quotas per API plan.
 */

import type { ApiPlan } from "./apiPlanTypes";

/** Maximum authenticated API calls per calendar day (UTC). */
export const DAILY_LIMIT: Record<ApiPlan, number> = {
  free:    100,
  partner: 1_000,
  api:     10_000,
};

/** Human-readable limit string. */
export function formatLimit(plan: ApiPlan): string {
  const n = DAILY_LIMIT[plan];
  if (n >= 1000) return `${n / 1000}k`;
  return n.toString();
}
