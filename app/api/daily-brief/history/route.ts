import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchBriefHistory, fetchBriefStats } from "@/lib/dailyBriefs/briefPersistence";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ history: [], stats: null });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit       = Math.min(parseInt(searchParams.get("limit") ?? "20"), 50);
  const sessionType = searchParams.get("session") ?? undefined;

  const [history, stats] = await Promise.all([
    fetchBriefHistory(supabase, limit, sessionType),
    fetchBriefStats(supabase),
  ]);

  return NextResponse.json({ history, stats });
}
