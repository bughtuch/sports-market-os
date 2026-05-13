/**
 * Billing plans — Sprint 11 Stripe integration placeholder.
 *
 * When Stripe is connected:
 * 1. Replace STRIPE_PRICE_IDS with real price IDs from the Stripe dashboard.
 * 2. Wire createCheckoutSession() to POST /api/billing/checkout.
 * 3. Wire createBillingPortalSession() to POST /api/billing/portal.
 * 4. Implement webhook handler at POST /api/billing/webhook.
 */

// ─── Stripe price ID placeholders ────────────────────────────────────────────

export const STRIPE_PRICE_IDS = {
  partner_monthly: "price_PLACEHOLDER_partner_monthly",
  partner_annual:  "price_PLACEHOLDER_partner_annual",
  api_monthly:     "price_PLACEHOLDER_api_monthly",
  api_annual:      "price_PLACEHOLDER_api_annual",
} as const;

// ─── Plan → Stripe price mapping ─────────────────────────────────────────────

export function getStripePriceId(
  plan: "partner" | "api",
  period: "monthly" | "annual",
): string {
  const key = `${plan}_${period}` as keyof typeof STRIPE_PRICE_IDS;
  return STRIPE_PRICE_IDS[key];
}

// ─── Checkout session (placeholder — implement in Sprint 11) ──────────────────

export async function createCheckoutSession(
  _priceId: string,
  _customerId?: string,
): Promise<{ url: string | null; error: string | null }> {
  // TODO Sprint 11: call Stripe.checkout.sessions.create()
  return { url: null, error: "Billing not yet active. Coming in Sprint 11." };
}

// ─── Billing portal (placeholder) ────────────────────────────────────────────

export async function createBillingPortalSession(
  _customerId: string,
): Promise<{ url: string | null; error: string | null }> {
  // TODO Sprint 11: call Stripe.billingPortal.sessions.create()
  return { url: null, error: "Billing portal not yet active." };
}
