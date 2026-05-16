import { NextRequest, NextResponse } from "next/server";
import { createClient as serverClient } from "@/lib/supabase/server";
import { createClient as adminClient } from "@supabase/supabase-js";

function admin() {
  return adminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function DELETE(req: NextRequest) {
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

  const body = (await req.json()) as { event_id?: string };
  const { event_id } = body;

  if (!event_id) {
    return NextResponse.json({ error: "Missing event_id" }, { status: 400 });
  }

  const db = admin();
  const { error } = await db
    .from("user_watchlists")
    .delete()
    .eq("user_id", user.id)
    .eq("event_id", event_id);

  if (error) {
    console.error("[api/watchlist/remove]", error);
    return NextResponse.json({ error: "Failed to remove from watchlist" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
