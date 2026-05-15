/**
 * checkout.ts — Stripe Checkout and Billing Portal session creation.
 */

import type Stripe from "stripe";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getOrCreateCustomer } from "./customer";
import { getPriceId } from "./billingPlans";
import { getAppUrl } from "./stripeClient";
import type { BillablePlan } from "./billingPlans";

// ─── Checkout session ─────────────────────────────────────────────────────────

export async function createCheckoutSession(
  stripe:   Stripe,
  supabase: SupabaseClient,
  userId:   string,
  email:    string,
  plan:     BillablePlan,
): Promise<string | null> {
  const priceId = getPriceId(plan);
  if (!priceId) return null;

  const customerId = await getOrCreateCustomer(stripe, supabase, userId, email);
  if (!customerId) return null;

  const appUrl = getAppUrl();

  try {
    const session = await stripe.checkout.sessions.create({
      customer:   customerId,
      mode:       "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/account?billing=success`,
      cancel_url:  `${appUrl}/pricing?billing=cancelled`,
      metadata: {
        user_id: userId,
        plan,
      },
      subscription_data: {
        metadata: { user_id: userId, plan },
      },
      allow_promotion_codes: false,
    });

    return session.url ?? null;
  } catch {
    return null;
  }
}

// ─── Billing portal ───────────────────────────────────────────────────────────

export async function createPortalSession(
  stripe:     Stripe,
  supabase:   SupabaseClient,
  userId:     string,
): Promise<string | null> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", userId)
    .single();

  const customerId = profile?.stripe_customer_id;
  if (!customerId) return null;

  const appUrl = getAppUrl();

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer:     customerId,
      return_url:   `${appUrl}/account`,
    });

    return session.url;
  } catch {
    return null;
  }
}
