import { NextResponse } from "next/server";
import { routeExchangeFlow } from "@/lib/exchanges/exchangeRouter";

export async function GET() {
  try {
    const data = await routeExchangeFlow();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json(
      { error: "Exchange flow unavailable", flows: [], meta: null },
      { status: 503 }
    );
  }
}
