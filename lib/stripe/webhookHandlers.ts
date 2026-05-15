/**
 * webhookHandlers.ts — Stripe webhook event processors.
 *
 * All profile updates use service-level Supabase writes (no RLS bypass needed —
 * the webhook route uses the server client which runs with the user's row available
 * via the subscription metadata user_id).
 */

import type Stripe from "stripe";
import type { SupabaseClient } from "@supabase/supabase-js";
import { priceIdToPlan } from "./billingPlans";
import type { PlanId } from "@/lib/plans/planTypes";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function updateProfile(
  supabase:   SupabaseClient,
  userId:     string,
  updates:    Record<string, unknown>,
): Promise<void> {
  await supabase.from("profiles").update(updates).eq("id", userId);
}

function getPlanFromSubscription(sub: Stripe.Subscription): PlanId | null {
  const item = sub.items.data[0];
  if (!item) return null;
  const priceId = item.price.id;
  return priceIdToPlan(priceId);
}

function periodEnd(sub: Stripe.Subscription): string | null {
  // In Stripe API dahlia+, current_period_end moved to SubscriptionItem
  const ts = sub.items?.data?.[0]?.current_period_end;
  if (!ts) return null;
  return new Date(ts * 1000).toISOString();
}

// ─── checkout.session.completed ───────────────────────────────────────────────

export async function handleCheckoutCompleted(
  supabase: SupabaseClient,
  session:  Stripe.Checkout.Session,
): Promise<void> {
  const userId = session.metadata?.user_id;
  const plan   = session.metadata?.plan as PlanId | undefined;
  if (!userId || !plan) return;

  await updateProfile(supabase, userId, {
    plan,
    stripe_customer_id:     session.customer as string,
    stripe_subscription_id: session.subscription as string,
    subscription_status:    "active",
  });
}

// ─── customer.subscription.created / updated ──────────────────────────────────

export async function handleSubscriptionUpsert(
  supabase: SupabaseClient,
  sub:      Stripe.Subscription,
): Promise<void> {
  const userId = sub.metadata?.user_id;
  if (!userId) return;

  const plan   = getPlanFromSubscription(sub);
  const status = sub.status;  // active | trialing | past_due | cancelled | unpaid | incomplete

  // Map subscription status → plan
  let effectivePlan: PlanId = "free";
  if ((status === "active" || status === "trialing") && plan) {
    effectivePlan = plan;
  } else if (status === "past_due" && plan) {
    // Keep on paid plan during grace period
    effectivePlan = plan;
  }

  await updateProfile(supabase, userId, {
    plan:                   effectivePlan,
    stripe_subscription_id: sub.id,
    stripe_customer_id:     typeof sub.customer === "string" ? sub.customer : sub.customer?.id,
    subscription_status:    status,
    current_period_end:     periodEnd(sub),
  });
}

// ─── customer.subscription.deleted ───────────────────────────────────────────

export async function handleSubscriptionDeleted(
  supabase: SupabaseClient,
  sub:      Stripe.Subscription,
): Promise<void> {
  const userId = sub.metadata?.user_id;
  if (!userId) return;

  await updateProfile(supabase, userId, {
    plan:                   "free",
    subscription_status:    "cancelled",
    stripe_subscription_id: null,
    current_period_end:     null,
  });
}

// ─── invoice.payment_failed ───────────────────────────────────────────────────

export async function handlePaymentFailed(
  supabase: SupabaseClient,
  invoice:  Stripe.Invoice,
): Promise<void> {
  const customerId = typeof invoice.customer === "string"
    ? invoice.customer
    : invoice.customer?.id;
  if (!customerId) return;

  // Look up user by customer ID
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!data?.id) return;

  await updateProfile(supabase, data.id, {
    subscription_status: "past_due",
  });
}
