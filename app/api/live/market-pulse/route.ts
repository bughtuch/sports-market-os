import { NextResponse } from "next/server";
import { routeMarketPulse } from "@/lib/providers/providerRouter";

export async function GET() {
  try {
    const data = await routeMarketPulse();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json(
      { error: "Market pulse unavailable", items: [], meta: null },
      { status: 503 }
    );
  }
}
