import { NextRequest, NextResponse } from "next/server";
import type { ReferralEvent } from "@/lib/partners/partnerTypes";

export const dynamic = "force-dynamic";

/**
 * POST /api/partner/track
 * Records a referral event. Public endpoint — no auth required for click tracking.
 * Body: { partnerCode, eventType, sourceUrl?, landingPage?, metadata? }
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json() as Partial<ReferralEvent>;

    const { partnerCode, eventType, referredUserId, sourceUrl, landingPage, metadata } = body;

    if (!partnerCode || typeof partnerCode !== "string") {
      return NextResponse.json({ tracked: false, error: "partnerCode required" }, { status: 400 });
    }
    if (!eventType || !["click", "signup", "export", "api_referral"].includes(eventType)) {
      return NextResponse.json({ tracked: false, error: "invalid eventType" }, { status: 400 });
    }

    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();

      if (supabase) {
        await supabase.from("referral_events").insert({
          partner_code:     partnerCode,
          event_type:       eventType,
          referred_user_id: referredUserId ?? null,
          source_url:       sourceUrl ?? null,
          landing_page:     landingPage ?? null,
          metadata:         metadata ?? null,
        });
      }
    } catch {
      // Supabase unavailable — log but don't fail the response
    }

    return NextResponse.json(
      { tracked: true, eventType },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch {
    return NextResponse.json({ tracked: false, error: "internal error" }, { status: 500 });
  }
}
