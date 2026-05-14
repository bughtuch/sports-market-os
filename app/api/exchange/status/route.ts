import { NextResponse } from "next/server";
import { routeExchangeStatus } from "@/lib/exchanges/exchangeRouter";

export async function GET() {
  try {
    const data = await routeExchangeStatus();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json(
      { error: "Exchange status unavailable", providers: [], meta: null },
      { status: 503 }
    );
  }
}
