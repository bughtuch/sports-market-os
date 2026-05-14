import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/adminAuth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/partner-applications
 * Returns all partner applications for admin review.
 * 403 if caller is not authenticated admin.
 */
export async function GET(): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { applications: [], source: "mock" },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const { data, error } = await supabase
      .from("partner_applications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json(
        { applications: [], source: "mock", error: error.message },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    return NextResponse.json(
      { applications: data ?? [], source: "live" },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch {
    return NextResponse.json(
      { applications: [], source: "mock" },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}

/**
 * PATCH /api/admin/partner-applications
 * Updates the status of a partner application.
 * Body: { id: string; status: "pending" | "approved" | "rejected" | "in_review" }
 */
export async function PATCH(req: NextRequest): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id, status } = await req.json() as { id: string; status: string };

    if (!id || !["pending", "approved", "rejected", "in_review"].includes(status)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    const { error } = await supabase
      .from("partner_applications")
      .update({ status })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ updated: true, id, status });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
