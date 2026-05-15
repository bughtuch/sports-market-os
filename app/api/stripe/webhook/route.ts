/**
 * POST /api/stripe/webhook
 * Receives and verifies Stripe webhook events.
 *
 * Requires: STRIPE_WEBHOOK_SECRET env var.
 * Must be registered in Stripe Dashboard → Webhooks.
 */

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getStripeClient } from "@/lib/stripe/stripeClient";
import {
  handleCheckoutCompleted,
  handleSubscriptionUpsert,
  handleSubscriptionDeleted,
  handlePaymentFailed,
} from "@/lib/stripe/webhookHandlers";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

// Stripe sends raw body — Next.js must not parse it
export async function POST(req: Request) {
  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET not set" }, { status: 503 });
  }

  // Read raw body + signature header
  const body      = await req.text();
  const headerMap = await headers();
  const sig       = headerMap.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  // Get a Supabase client — webhook runs server-side, no user session
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
  }

  // Dispatch
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(supabase, event.data.object as Stripe.Checkout.Session);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpsert(supabase, event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(supabase, event.data.object as Stripe.Subscription);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(supabase, event.data.object as Stripe.Invoice);
        break;

      default:
        // Unhandled event type — acknowledge receipt
        break;
    }
  } catch {
    // Return 200 to prevent Stripe from retrying on internal errors;
    // log the failure separately in production.
    return NextResponse.json({ received: true, warning: "Handler error" });
  }

  return NextResponse.json({ received: true });
}
