/**
 * /api/admin/distribution
 *
 * GET — admin overview of distribution posts and export events.
 * Admin role required.
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/adminAuth";
import { getAdminDistributionOverview } from "@/lib/distribution/distributionDb";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const data = await getAdminDistributionOverview();
  return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}
