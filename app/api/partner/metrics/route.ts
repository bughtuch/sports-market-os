import { NextResponse } from "next/server";
import { getPartnerProfile, getPartnerMetrics } from "@/lib/partners/partnerTracking";

export const dynamic = "force-dynamic";

/**
 * GET /api/partner/metrics
 * Returns partner metrics for the authenticated user.
 * Returns null metrics if not authenticated or no partner profile.
 * Never exposes another user's metrics.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const profile = await getPartnerProfile();

    if (!profile) {
      return NextResponse.json(
        { metrics: null, partnerCode: null },
        { headers: { "Cache-Control": "no-store, max-age=0" } }
      );
    }

    const metrics = await getPartnerMetrics(profile.partnerCode);

    return NextResponse.json(
      { metrics, partnerCode: profile.partnerCode },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch {
    return NextResponse.json(
      { metrics: null, partnerCode: null },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  }
}
