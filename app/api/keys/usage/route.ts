/**
 * GET /api/keys/usage — Usage stats for the authenticated user's API keys.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchUsageStats } from "@/lib/apiKeys/apiUsage";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const stats = await fetchUsageStats(supabase, user.id);
  return NextResponse.json({ stats });
}
