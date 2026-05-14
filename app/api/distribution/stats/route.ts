/**
 * /api/distribution/stats
 *
 * GET — user distribution stats (auth required)
 *       Returns post counts, export counts, platform breakdown, recent exports.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDistributionStats } from "@/lib/distribution/distributionDb";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const stats = await getDistributionStats(user.id);
    return NextResponse.json({ stats }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
