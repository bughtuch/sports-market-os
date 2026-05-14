import { NextResponse } from "next/server";
import { routeExchangeLiquidity } from "@/lib/exchanges/exchangeRouter";

export async function GET() {
  try {
    const data = await routeExchangeLiquidity();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json(
      { error: "Liquidity feed unavailable", snapshots: [], meta: null },
      { status: 503 }
    );
  }
}
