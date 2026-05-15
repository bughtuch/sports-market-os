/**
 * GET /api/billing/status — Current billing state for the authenticated user.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/db/profile";
import { normalizePlan } from "@/lib/plans/featureAccess";
import { isStripeConfigured } from "@/lib/stripe/stripeClient";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await getProfile(supabase, user.id);

  return NextResponse.json({
    billing: {
      plan:                normalizePlan(profile?.plan ?? "free"),
      subscription_status: profile?.subscription_status ?? "free",
      stripe_customer_id:  profile?.stripe_customer_id  ?? null,
      current_period_end:  profile?.current_period_end  ?? null,
      email:               user.email ?? null,
    },
    stripe_configured: isStripeConfigured(),
  });
}
