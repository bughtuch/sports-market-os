/**
 * POST /api/billing/checkout
 * Creates a Stripe Checkout session and returns the redirect URL.
 *
 * Body: { plan: "partner" | "api" }
 * Returns: { url: string } — redirect the browser to this URL.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripeClient } from "@/lib/stripe/stripeClient";
import { createCheckoutSession } from "@/lib/stripe/checkout";
import type { BillablePlan } from "@/lib/stripe/billingPlans";

export const dynamic = "force-dynamic";

const VALID_PLANS: BillablePlan[] = ["partner", "api"];

export async function POST(req: Request) {
  // Auth
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Parse plan
  const body = await req.json().catch(() => ({})) as { plan?: string };
  const plan  = body.plan as BillablePlan;
  if (!plan || !VALID_PLANS.includes(plan)) {
    return NextResponse.json({ error: "Invalid plan. Must be 'partner' or 'api'." }, { status: 400 });
  }

  // Stripe
  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json(
      { error: "Billing not configured. Set STRIPE_SECRET_KEY." },
      { status: 503 },
    );
  }

  const url = await createCheckoutSession(stripe, supabase, user.id, user.email ?? "", plan);
  if (!url) {
    return NextResponse.json(
      { error: "Could not create checkout session. Verify STRIPE_PARTNER_PRICE_ID / STRIPE_API_PRICE_ID." },
      { status: 500 },
    );
  }

  return NextResponse.json({ url });
}
