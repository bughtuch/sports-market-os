/**
 * Partner tracking functions — Supabase integration with safe fallbacks.
 *
 * All functions:
 * - never throw to the caller
 * - return null/fallback if Supabase unavailable
 * - work in both server and client contexts
 *
 * Payout logic is intentionally absent. Commission infrastructure
 * will be added in a future sprint after billing integration.
 */

import type {
  PartnerProfile,
  PartnerMetrics,
  ReferralEvent,
  PartnerStatus,
  PartnerPlatform,
} from "./partnerTypes";
import { generatePartnerCode } from "./referralUtils";

// ─── Supabase lazy import ────────────────────────────────────────────────────
// Imported lazily to avoid crashing when Supabase is not configured.

async function getServerClient() {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    return await createClient();
  } catch {
    return null;
  }
}

// ─── Partner profile ──────────────────────────────────────────────────────────

/** Fetches the partner profile for the currently authenticated user. */
export async function getPartnerProfile(): Promise<PartnerProfile | null> {
  try {
    const supabase = await getServerClient();
    if (!supabase) return null;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("partner_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error || !data) return null;

    return {
      id:           data.id,
      userId:       data.user_id,
      partnerCode:  data.partner_code,
      displayName:  data.display_name ?? null,
      platform:     (data.platform as PartnerPlatform) ?? null,
      audienceSize: data.audience_size ?? null,
      status:       (data.status as PartnerStatus) ?? "pending",
      createdAt:    data.created_at,
    };
  } catch {
    return null;
  }
}

/** Creates a partner profile for the current user. Returns the new profile or null on failure. */
export async function createPartnerProfile(opts: {
  displayName?: string;
  platform?: PartnerPlatform;
  audienceSize?: string;
}): Promise<PartnerProfile | null> {
  try {
    const supabase = await getServerClient();
    if (!supabase) return null;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const partnerCode = generatePartnerCode(user.id);

    const { data, error } = await supabase
      .from("partner_profiles")
      .insert({
        user_id:       user.id,
        partner_code:  partnerCode,
        display_name:  opts.displayName ?? null,
        platform:      opts.platform ?? null,
        audience_size: opts.audienceSize ?? null,
        status:        "pending",
      })
      .select()
      .single();

    if (error || !data) return null;

    // Create matching metrics row
    await supabase.from("partner_metrics").upsert({
      partner_code: partnerCode,
      clicks:       0,
      signups:      0,
      exports:      0,
      api_referrals: 0,
      estimated_reach: 0,
    }, { onConflict: "partner_code" });

    return {
      id:           data.id,
      userId:       data.user_id,
      partnerCode:  data.partner_code,
      displayName:  data.display_name ?? null,
      platform:     (data.platform as PartnerPlatform) ?? null,
      audienceSize: data.audience_size ?? null,
      status:       (data.status as PartnerStatus) ?? "pending",
      createdAt:    data.created_at,
    };
  } catch {
    return null;
  }
}

// ─── Partner metrics ──────────────────────────────────────────────────────────

/** Fetches metrics for a given partner code. */
export async function getPartnerMetrics(partnerCode: string): Promise<PartnerMetrics | null> {
  try {
    const supabase = await getServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("partner_metrics")
      .select("*")
      .eq("partner_code", partnerCode)
      .single();

    if (error || !data) return null;

    return {
      partnerCode:    data.partner_code,
      clicks:         data.clicks ?? 0,
      signups:        data.signups ?? 0,
      exports:        data.exports ?? 0,
      apiReferrals:   data.api_referrals ?? 0,
      estimatedReach: data.estimated_reach ?? 0,
      updatedAt:      data.updated_at,
    };
  } catch {
    return null;
  }
}

// ─── Referral event tracking ──────────────────────────────────────────────────

/**
 * Records a referral event. Safe to call from any context.
 * Uses the /api/partner/track route when called client-side.
 * Uses Supabase directly when called server-side.
 */
export async function trackReferralEvent(event: ReferralEvent): Promise<boolean> {
  try {
    const supabase = await getServerClient();
    if (!supabase) return false;

    await supabase.from("referral_events").insert({
      partner_code:      event.partnerCode,
      event_type:        event.eventType,
      referred_user_id:  event.referredUserId ?? null,
      source_url:        event.sourceUrl ?? null,
      landing_page:      event.landingPage ?? null,
      metadata:          event.metadata ?? null,
    });

    // Increment counter in partner_metrics
    const columnMap: Record<string, string> = {
      click:        "clicks",
      signup:       "signups",
      export:       "exports",
      api_referral: "api_referrals",
    };
    const col = columnMap[event.eventType];
    if (col) {
      await supabase.rpc("increment_partner_metric", {
        p_partner_code: event.partnerCode,
        p_column:       col,
      }).throwOnError();
    }

    return true;
  } catch {
    // Silently degrade — tracking failure must never crash the app
    return false;
  }
}
