import { NextResponse } from "next/server";
import { routeVolatility } from "@/lib/ai/aiRouter";

export async function GET() {
  try {
    const data = routeVolatility();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json(
      { error: "Volatility engine unavailable", insight: null, mode: "simulated" },
      { status: 503 },
    );
  }
}
