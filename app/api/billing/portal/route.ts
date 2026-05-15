/**
 * POST /api/billing/portal
 * Creates a Stripe Billing Portal session for managing subscriptions.
 * Returns: { url: string } — redirect the browser to this URL.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripeClient } from "@/lib/stripe/stripeClient";
import { createPortalSession } from "@/lib/stripe/checkout";

export const dynamic = "force-dynamic";

export async function POST() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json({ error: "Billing not configured." }, { status: 503 });
  }

  const url = await createPortalSession(stripe, supabase, user.id);
  if (!url) {
    return NextResponse.json(
      { error: "No billing account found. Subscribe first." },
      { status: 404 },
    );
  }

  return NextResponse.json({ url });
}
