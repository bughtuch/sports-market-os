import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { saveMarket, deleteSavedMarket, getWatchlistMarkets } from "@/lib/db/watchlists";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const markets = await getWatchlistMarkets(supabase, user.id);
  return NextResponse.json({ markets });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json() as {
    watchlist_id?: string;
    sport?: string;
    market_name?: string;
    market_type?: string;
    source?: string;
    volatility_score?: number;
    movement_percent?: number;
    notes?: string;
  };

  if (!body.sport || !body.market_name) {
    return NextResponse.json({ error: "sport and market_name are required" }, { status: 400 });
  }

  const { data, error } = await saveMarket(supabase, user.id, body as Parameters<typeof saveMarket>[2]);
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ market: data }, { status: 201 });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json() as { id?: string };
  if (!body.id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const { error } = await deleteSavedMarket(supabase, user.id, body.id);
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ ok: true });
}
