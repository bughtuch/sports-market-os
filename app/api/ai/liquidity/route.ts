import { NextResponse } from "next/server";
import { routeLiquidity } from "@/lib/ai/aiRouter";

export async function GET() {
  try {
    const data = routeLiquidity();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json(
      { error: "Liquidity engine unavailable", insight: null, mode: "simulated" },
      { status: 503 },
    );
  }
}
