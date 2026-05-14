import { NextResponse } from "next/server";
import { routeExchangeMarkets } from "@/lib/exchanges/exchangeRouter";

export async function GET() {
  try {
    const data = await routeExchangeMarkets();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json(
      { error: "Exchange markets unavailable", markets: [], meta: null },
      { status: 503 }
    );
  }
}
