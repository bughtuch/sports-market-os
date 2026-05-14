import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/adminAuth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// ─── Mock fallback ────────────────────────────────────────────────────────────

const MOCK_OVERVIEW = {
  totalUsers:          0,
  totalPartnerProfiles: 0,
  pendingApplications: 0,
  referralEventsToday: 0,
  savedMarkets:        0,
  creatorProfiles:     0,
  estimatedReach:      820000,
  latestSignups:       [] as { email: string; created_at: string }[],
};

/**
 * GET /api/admin/overview
 * Returns platform overview metrics for the admin dashboard.
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
        { ...MOCK_OVERVIEW, source: "mock" },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    // Run counts in parallel
    const [
      profilesRes,
      partnerProfilesRes,
      pendingAppsRes,
      referralsTodayRes,
      savedMarketsRes,
      latestSignupsRes,
    ] = await Promise.allSettled([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("partner_profiles").select("id", { count: "exact", head: true }),
      supabase.from("partner_profiles").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase
        .from("referral_events")
        .select("id", { count: "exact", head: true })
        .gte("created_at", new Date(Date.now() - 86_400_000).toISOString()),
      supabase.from("saved_markets").select("id", { count: "exact", head: true }),
      supabase
        .from("profiles")
        .select("email, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    function count(res: PromiseSettledResult<{ count: number | null }>): number {
      return res.status === "fulfilled" ? (res.value?.count ?? 0) : 0;
    }

    const latestSignups =
      latestSignupsRes.status === "fulfilled"
        ? ((latestSignupsRes.value?.data ?? []) as { email: string; created_at: string }[])
        : [];

    return NextResponse.json(
      {
        totalUsers:           count(profilesRes as PromiseSettledResult<{ count: number | null }>),
        totalPartnerProfiles: count(partnerProfilesRes as PromiseSettledResult<{ count: number | null }>),
        pendingApplications:  count(pendingAppsRes as PromiseSettledResult<{ count: number | null }>),
        referralEventsToday:  count(referralsTodayRes as PromiseSettledResult<{ count: number | null }>),
        savedMarkets:         count(savedMarketsRes as PromiseSettledResult<{ count: number | null }>),
        creatorProfiles:      0,  // creator_profiles table added in future sprint
        estimatedReach:       820000,
        latestSignups,
        source: "live",
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch {
    return NextResponse.json(
      { ...MOCK_OVERVIEW, source: "mock" },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
