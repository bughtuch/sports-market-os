import { NextResponse } from "next/server";
import { routeOdds } from "@/lib/providers/providerRouter";

export async function GET() {
  try {
    const data = await routeOdds();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json(
      { error: "Odds feed unavailable", snapshots: [], meta: null },
      { status: 503 }
    );
  }
}
