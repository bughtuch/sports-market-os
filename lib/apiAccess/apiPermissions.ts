/**
 * apiPermissions.ts — Per-endpoint access control.
 */

import type { ApiPlan } from "./apiPlanTypes";
import { PLAN_TIER, PLAN_LABEL } from "./apiPlanTypes";

export interface EndpointPermission {
  requiredPlan: ApiPlan;
  description:  string;
  live:         boolean;   // false = planned, not yet live
}

/** Canonical endpoint → permission map. */
export const ENDPOINT_PERMISSIONS: Record<string, EndpointPermission> = {
  // Live — free tier
  "/api/v1/signals":         { requiredPlan: "free",    description: "Market intelligence signals",    live: true  },
  "/api/v1/market-pulse":    { requiredPlan: "free",    description: "Market pulse and regime",        live: true  },
  "/api/v1/daily-brief":     { requiredPlan: "free",    description: "Latest persisted daily brief",   live: true  },
  // Planned — partner tier
  "/api/v1/distribution":    { requiredPlan: "partner", description: "Distribution metrics",           live: false },
  // Planned — API tier
  "/api/v1/exchange-flow":   { requiredPlan: "api",     description: "Exchange flow analytics",        live: false },
  "/api/v1/provider-status": { requiredPlan: "api",     description: "Live provider status",           live: false },
};

// ─── Checks ───────────────────────────────────────────────────────────────────

export function canAccessEndpoint(endpoint: string, plan: ApiPlan): boolean {
  const perm = ENDPOINT_PERMISSIONS[endpoint];
  if (!perm) return false;
  return PLAN_TIER[plan] >= PLAN_TIER[perm.requiredPlan];
}

export function getRequiredPlan(endpoint: string): ApiPlan | null {
  return ENDPOINT_PERMISSIONS[endpoint]?.requiredPlan ?? null;
}

export function getUpgradeMessage(endpoint: string, currentPlan: ApiPlan): string {
  const required = getRequiredPlan(endpoint);
  if (!required) return "Endpoint not available.";
  return (
    `This endpoint requires the ${PLAN_LABEL[required]} plan. ` +
    `You are on the ${PLAN_LABEL[currentPlan]} plan. ` +
    `Upgrade at sportsmarketos.com/pricing to unlock access.`
  );
}

/** All endpoints as a sorted array, for display. */
export function getAllEndpoints(): (EndpointPermission & { path: string })[] {
  return Object.entries(ENDPOINT_PERMISSIONS)
    .map(([path, perm]) => ({ path, ...perm }))
    .sort((a, b) => PLAN_TIER[a.requiredPlan] - PLAN_TIER[b.requiredPlan]);
}
