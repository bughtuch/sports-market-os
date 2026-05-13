/**
 * Stripe configuration — Sprint 11 placeholder.
 *
 * Setup checklist for Sprint 11:
 * 1. npm install stripe @stripe/stripe-js
 * 2. Add STRIPE_SECRET_KEY to .env.local (server-only)
 * 3. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to .env.local
 * 4. Add STRIPE_WEBHOOK_SECRET to .env.local
 * 5. Create products + prices in Stripe dashboard
 * 6. Replace STRIPE_PRICE_IDS in billingPlans.ts
 * 7. Implement webhook handler (app/api/billing/webhook/route.ts)
 * 8. Update profiles table: add stripe_customer_id, subscription_id, subscription_status
 */

// ─── Environment variable keys ────────────────────────────────────────────────

export const STRIPE_ENV_KEYS = {
  secretKey:        "STRIPE_SECRET_KEY",
  publishableKey:   "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  webhookSecret:    "STRIPE_WEBHOOK_SECRET",
} as const;

// ─── Webhook event types to handle ───────────────────────────────────────────

export const STRIPE_WEBHOOK_EVENTS = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
] as const;

// ─── Stripe instance factory (placeholder) ────────────────────────────────────

export function getStripeInstance() {
  // TODO Sprint 11:
  // import Stripe from "stripe";
  // const key = process.env.STRIPE_SECRET_KEY;
  // if (!key) throw new Error("STRIPE_SECRET_KEY not set");
  // return new Stripe(key, { apiVersion: "2024-12-18.acacia" });
  throw new Error("Stripe not yet configured — activate in Sprint 11.");
}
