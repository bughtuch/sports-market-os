/**
 * stripeClient.ts — Lazy Stripe SDK singleton.
 *
 * Secret key is read server-side only. Never import this in client components.
 */

import Stripe from "stripe";

let _stripe: Stripe | null = null;

/** Returns a configured Stripe client, or null if STRIPE_SECRET_KEY is not set. */
export function getStripeClient(): Stripe | null {
  if (_stripe) return _stripe;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;

  _stripe = new Stripe(secretKey, {
    apiVersion: "2026-04-22.dahlia",
    typescript: true,
  });

  return _stripe;
}

/** True when Stripe is configured and ready. */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}
