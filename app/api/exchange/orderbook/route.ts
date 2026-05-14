import { NextResponse } from "next/server";
import { routeExchangeOrderBook } from "@/lib/exchanges/exchangeRouter";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const marketId = searchParams.get("marketId") ?? undefined;
    const data = await routeExchangeOrderBook(marketId);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json(
      { error: "Order book unavailable", orderBook: null, meta: null },
      { status: 503 }
    );
  }
}
