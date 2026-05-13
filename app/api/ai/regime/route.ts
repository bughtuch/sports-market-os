import { NextResponse } from "next/server";
import { routeRegime } from "@/lib/ai/aiRouter";

export async function GET() {
  try {
    const data = routeRegime();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json(
      { error: "Regime engine unavailable", regime: null, mode: "simulated" },
      { status: 503 },
    );
  }
}
