import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/adminAuth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type EventType = "click" | "signup" | "export" | "api_referral";

/**
 * GET /api/admin/referral-events
 * Returns recent referral events with optional type filter.
 * Query: ?type=click|signup|export|api_referral
 * 403 if caller is not authenticated admin.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const typeFilter = searchParams.get("type") as EventType | null;

  const validTypes: EventType[] = ["click", "signup", "export", "api_referral"];
  const filterValid = typeFilter && validTypes.includes(typeFilter);

  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { events: [], source: "mock" },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    let query = supabase
      .from("referral_events")
      .select("id, partner_code, event_type, landing_page, source_url, created_at, metadata")
      .order("created_at", { ascending: false })
      .limit(200);

    if (filterValid) {
      query = query.eq("event_type", typeFilter);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { events: [], source: "mock", error: error.message },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    return NextResponse.json(
      { events: data ?? [], source: "live", filter: typeFilter ?? "all" },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch {
    return NextResponse.json(
      { events: [], source: "mock" },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
