/**
 * billingPlans.ts — Stripe price ID → plan mapping.
 *
 * Set these env vars in Vercel / .env.local:
 *   STRIPE_PARTNER_PRICE_ID   — monthly price ID for Partner plan
 *   STRIPE_API_PRICE_ID       — monthly price ID for API plan
 */

import type { PlanId } from "@/lib/plans/planTypes";

export type BillablePlan = "partner" | "api";

/** Map a Stripe price ID to the internal plan. Called in webhook handlers. */
export function priceIdToPlan(priceId: string): PlanId | null {
  const partnerPriceId = process.env.STRIPE_PARTNER_PRICE_ID;
  const apiPriceId     = process.env.STRIPE_API_PRICE_ID;

  if (partnerPriceId && priceId === partnerPriceId) return "partner";
  if (apiPriceId     && priceId === apiPriceId)     return "api";

  return null;
}

/** Get the Stripe price ID for a given plan. Returns null if not configured. */
export function getPriceId(plan: BillablePlan): string | null {
  if (plan === "partner") return process.env.STRIPE_PARTNER_PRICE_ID ?? null;
  if (plan === "api")     return process.env.STRIPE_API_PRICE_ID     ?? null;
  return null;
}

/** Monthly price in dollars — matches plans.ts. Used for display only. */
export const PLAN_PRICE: Record<BillablePlan, number> = {
  partner: 99,
  api:     299,
};
