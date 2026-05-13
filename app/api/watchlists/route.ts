import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserWatchlists, createWatchlist, deleteWatchlist } from "@/lib/db/watchlists";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const watchlists = await getUserWatchlists(supabase, user.id);
  return NextResponse.json({ watchlists });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json() as { name?: string; description?: string };
  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const { data, error } = await createWatchlist(supabase, user.id, body.name.trim(), body.description);
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ watchlist: data }, { status: 201 });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json() as { id?: string };
  if (!body.id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const { error } = await deleteWatchlist(supabase, user.id, body.id);
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ ok: true });
}
