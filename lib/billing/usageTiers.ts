/**
 * Usage tiers and metering — Sprint 11 Stripe metering placeholder.
 *
 * When Stripe metering is activated:
 * 1. Create metered prices in Stripe for API calls.
 * 2. Report usage via Stripe.subscriptionItems.createUsageRecord().
 * 3. Replace getMockUsage() in featureAccess.ts with real DB queries.
 */

// ─── Usage limits per plan ────────────────────────────────────────────────────

export const USAGE_LIMITS = {
  free: {
    apiCallsPerMonth:   0,
    exportsPerMonth:    50,
    watchlistsTotal:    10,
    aiScansPerMonth:    500,
    refreshRateSeconds: 30,
  },
  partner: {
    apiCallsPerMonth:   0,       // no API access
    exportsPerMonth:    5_000,
    watchlistsTotal:    100,
    aiScansPerMonth:    10_000,
    refreshRateSeconds: 10,
  },
  api: {
    apiCallsPerMonth:   50_000,
    exportsPerMonth:    null,    // unlimited
    watchlistsTotal:    null,    // unlimited
    aiScansPerMonth:    null,    // unlimited
    refreshRateSeconds: 1,
  },
} as const;

// ─── Metered event types (for Stripe usage records) ──────────────────────────

export type MeteredEvent =
  | "api_call"
  | "ai_scan"
  | "export_generated"
  | "deep_scan";

// ─── Usage reporter (placeholder) ─────────────────────────────────────────────

export async function reportUsage(
  _subscriptionItemId: string,
  _event: MeteredEvent,
  _quantity: number = 1,
): Promise<void> {
  // TODO Sprint 11:
  // await stripe.subscriptionItems.createUsageRecord(subscriptionItemId, {
  //   quantity,
  //   timestamp: Math.floor(Date.now() / 1000),
  //   action: "increment",
  // });
}
