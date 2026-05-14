import { NextRequest, NextResponse } from "next/server";
import { getPartnerProfile, createPartnerProfile } from "@/lib/partners/partnerTracking";
import { buildReferralUrl } from "@/lib/partners/referralUtils";
import type { PartnerPlatform } from "@/lib/partners/partnerTypes";

export const dynamic = "force-dynamic";

/**
 * GET /api/partner/profile
 * Returns the authenticated user's partner profile.
 * Returns { profile: null, isPartner: false } if not authenticated or no profile.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const profile = await getPartnerProfile();

    if (!profile) {
      return NextResponse.json(
        { profile: null, isPartner: false, referralUrl: null },
        { headers: { "Cache-Control": "no-store, max-age=0" } }
      );
    }

    const referralUrl = buildReferralUrl(profile.partnerCode);
    return NextResponse.json(
      { profile, isPartner: true, referralUrl },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch {
    return NextResponse.json(
      { profile: null, isPartner: false, referralUrl: null },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  }
}

/**
 * POST /api/partner/profile
 * Creates a partner profile for the authenticated user.
 * Body: { displayName?, platform?, audienceSize? }
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json() as {
      displayName?: string;
      platform?: PartnerPlatform;
      audienceSize?: string;
    };

    const profile = await createPartnerProfile({
      displayName:  body.displayName,
      platform:     body.platform,
      audienceSize: body.audienceSize,
    });

    if (!profile) {
      return NextResponse.json(
        { profile: null, isPartner: false, referralUrl: null, error: "Could not create profile. Are you signed in?" },
        { status: 400 }
      );
    }

    const referralUrl = buildReferralUrl(profile.partnerCode);
    return NextResponse.json(
      { profile, isPartner: true, referralUrl },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { profile: null, isPartner: false, referralUrl: null, error: "internal error" },
      { status: 500 }
    );
  }
}
