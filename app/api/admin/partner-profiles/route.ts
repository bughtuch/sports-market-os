import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/adminAuth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/partner-profiles
 * Returns all partner profiles with their metrics summary.
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
        { profiles: [], source: "mock" },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    // Fetch profiles and metrics in parallel
    const [profilesRes, metricsRes] = await Promise.allSettled([
      supabase
        .from("partner_profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100),
      supabase
        .from("partner_metrics")
        .select("partner_code, clicks, signups, exports, api_referrals, estimated_reach"),
    ]);

    const profiles =
      profilesRes.status === "fulfilled" ? (profilesRes.value?.data ?? []) : [];
    const metrics =
      metricsRes.status === "fulfilled" ? (metricsRes.value?.data ?? []) : [];

    // Merge metrics into profiles
    const metricsMap = new Map(
      (metrics as { partner_code: string; [k: string]: unknown }[]).map(
        (m) => [m.partner_code, m]
      )
    );

    const merged = profiles.map((p: Record<string, unknown>) => ({
      ...p,
      metrics: metricsMap.get(p.partner_code as string) ?? null,
    }));

    return NextResponse.json(
      { profiles: merged, source: "live" },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch {
    return NextResponse.json(
      { profiles: [], source: "mock" },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}

/**
 * PATCH /api/admin/partner-profiles
 * Updates partner profile status.
 * Body: { id: string; status: "pending" | "active" | "suspended" }
 */
export async function PATCH(req: NextRequest): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id, status } = await req.json() as { id: string; status: string };

    if (!id || !["pending", "active", "suspended"].includes(status)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    const { error } = await supabase
      .from("partner_profiles")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ updated: true, id, status });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
