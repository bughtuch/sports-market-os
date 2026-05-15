/**
 * customer.ts — Get or create a Stripe customer for a user.
 */

import type Stripe from "stripe";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Returns the existing Stripe customer ID from profiles, or creates a new
 * customer and stores the ID back to profiles.
 */
export async function getOrCreateCustomer(
  stripe:    Stripe,
  supabase:  SupabaseClient,
  userId:    string,
  email:     string,
): Promise<string | null> {
  // 1. Check existing
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", userId)
    .single();

  if (profile?.stripe_customer_id) {
    return profile.stripe_customer_id;
  }

  // 2. Create new customer
  try {
    const customer = await stripe.customers.create({
      email,
      metadata: { user_id: userId, platform: "sports-market-os" },
    });

    // 3. Persist customer ID
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customer.id })
      .eq("id", userId);

    return customer.id;
  } catch {
    return null;
  }
}
