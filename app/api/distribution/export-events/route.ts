/**
 * /api/distribution/export-events
 *
 * GET  — list user's export events (auth required)
 * POST — record an export event (auth optional — anon events accepted)
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createExportEvent, getExportEvents } from "@/lib/distribution/distributionDb";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ events: [] });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20", 10) || 20);

    const events = await getExportEvents(user.id, limit);
    return NextResponse.json({ events }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ events: [] });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { exportType, layout, theme, signalTitle, sport, destination, partnerCode, metadata } = body;

    // Resolve user id if signed in — but don't require auth for export tracking
    let userId: string | undefined;
    try {
      const supabase = await createClient();
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id;
      }
    } catch {
      // Best-effort auth resolution
    }

    const ok = await createExportEvent({
      userId,
      partnerCode: partnerCode ?? undefined,
      exportType:  exportType  ?? "download",
      layout,
      theme,
      signalTitle,
      sport,
      destination: destination ?? "download",
      metadata:    metadata    ?? {},
    });

    return NextResponse.json({ tracked: ok }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ tracked: false }, { status: 500 });
  }
}
