import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRecentEvents, getQueueStats } from "@/lib/notifications/notificationQueue";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ events: [], stats: null, source: "no-supabase" });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100);

  const [events, stats] = await Promise.all([
    getRecentEvents(supabase, user.id, limit),
    getQueueStats(supabase, user.id),
  ]);

  return NextResponse.json({ events, stats });
}
