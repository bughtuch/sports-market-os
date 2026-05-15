/**
 * GET /api/keys/quota — Current quota status for the authenticated user.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/db/profile";
import { normalizePlan } from "@/lib/plans/featureAccess";
import { getQuotaStatus } from "@/lib/apiAccess/apiQuotaEngine";
import type { ApiPlan } from "@/lib/apiAccess/apiPlanTypes";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await getProfile(supabase, user.id);
  const plan    = normalizePlan(profile?.plan ?? "free") as ApiPlan;
  const quota   = await getQuotaStatus(supabase, user.id, plan);

  return NextResponse.json({ quota });
}
