import type { PlanId, FeatureId, PlanUsage } from "./planTypes";

// ─── Plan tier (higher = more access) ────────────────────────────────────────

const PLAN_TIER: Record<PlanId, number> = {
  free:    0,
  partner: 1,
  api:     2,
};

// ─── Minimum plan required per feature ───────────────────────────────────────

const FEATURE_PLAN: Record<FeatureId, PlanId> = {
  // Free
  live_market_pulse:        "free",
  ai_narratives:            "free",
  creator_exports:          "free",
  watchlists:               "free",
  market_pages:             "free",
  seo_hubs:                 "free",
  news_catalysts:           "free",
  public_terminal:          "free",
  // Partner
  creator_distribution:     "partner",
  partner_analytics:        "partner",
  broadcast_infrastructure: "partner",
  branded_exports:          "partner",
  priority_signal_routing:  "partner",
  partner_profile:          "partner",
  advanced_volatility_analytics: "partner",
  export_queue_history:     "partner",
  creator_analytics:        "partner",
  // API
  api_endpoints:            "api",
  structured_data_feed:     "api",
  ai_feed_access:           "api",
  provider_integrations:    "api",
  higher_refresh_limits:    "api",
  deep_liquidity_scans:     "api",
  ai_confidence_history:    "api",
  // Future
  websocket_access:         "api",
  enterprise_endpoints:     "api",
  referral_commissions:     "partner",
};

// ─── Normalise legacy plan strings ───────────────────────────────────────────

export function normalizePlan(raw: string): PlanId {
  if (raw === "premium") return "partner"; // backward compat
  if (raw === "api") return "api";
  if (raw === "partner") return "partner";
  return "free";
}

// ─── Access helpers ───────────────────────────────────────────────────────────

export function hasFeatureAccess(userPlan: PlanId, requiredPlan: PlanId): boolean {
  return PLAN_TIER[userPlan] >= PLAN_TIER[requiredPlan];
}

export function canAccessFeature(userPlan: PlanId, feature: FeatureId): boolean {
  return hasFeatureAccess(userPlan, FEATURE_PLAN[feature]);
}

export function isPartner(plan: PlanId): boolean {
  return PLAN_TIER[plan] >= PLAN_TIER["partner"];
}

export function isAPI(plan: PlanId): boolean {
  return PLAN_TIER[plan] >= PLAN_TIER["api"];
}

export function getPlanFeatures(plan: PlanId): FeatureId[] {
  return (Object.entries(FEATURE_PLAN) as [FeatureId, PlanId][])
    .filter(([, required]) => hasFeatureAccess(plan, required))
    .map(([feature]) => feature);
}

// ─── Mock usage data (replace with real Stripe metering in Sprint 11) ─────────

const PLAN_LIMITS: Record<PlanId, Partial<PlanUsage>> = {
  free:    { apiCallsLimit: null,   aiScansConsumed: 0 },
  partner: { apiCallsLimit: null,   aiScansConsumed: 0 },
  api:     { apiCallsLimit: 50_000, aiScansConsumed: 0 },
};

export function getMockUsage(plan: PlanId): PlanUsage {
  return {
    apiCallsUsed:     plan === "api" ? 1_847 : 0,
    apiCallsLimit:    PLAN_LIMITS[plan].apiCallsLimit ?? null,
    exportsGenerated: plan === "free" ? 14 : plan === "partner" ? 342 : 89,
    watchlistsSaved:  plan === "free" ? 3  : plan === "partner" ? 12  : 7,
    aiScansConsumed:  842,
  };
}
