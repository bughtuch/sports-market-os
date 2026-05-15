/**
 * apiPlanTypes.ts — API plan types for the enforcement layer.
 */

export type ApiPlan = "free" | "partner" | "api";

/** Ordinal tier — higher = more access. */
export const PLAN_TIER: Record<ApiPlan, number> = {
  free:    0,
  partner: 1,
  api:     2,
};

export const PLAN_LABEL: Record<ApiPlan, string> = {
  free:    "Free",
  partner: "Partner",
  api:     "API",
};

/** Current quota status for a user. */
export interface QuotaStatus {
  used:        number;
  limit:       number;
  remaining:   number;
  resetAt:     string;   // ISO — midnight UTC (next reset)
  plan:        ApiPlan;
  percentUsed: number;
  degraded:    boolean;  // true when quota check failed gracefully
}
