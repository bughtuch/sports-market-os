import { NextRequest, NextResponse } from "next/server";
import { createClient as serverClient } from "@/lib/supabase/server";
import { createClient as adminClient } from "@supabase/supabase-js";

function admin() {
  return adminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  // Auth check via session cookie
  const supabase = await serverClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    event_id?: string;
    event_title?: string;
    sport?: string;
    source?: string;
  };

  const { event_id, event_title, sport, source } = body;

  if (!event_id || !event_title || !sport) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const db = admin();
  const { error } = await db.from("user_watchlists").upsert(
    {
      user_id:     user.id,
      event_id,
      event_title,
      sport,
      source:      source ?? "unknown",
    },
    { onConflict: "user_id,event_id" }
  );

  if (error) {
    console.error("[api/watchlist/add]", error);
    return NextResponse.json({ error: "Failed to add to watchlist" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
