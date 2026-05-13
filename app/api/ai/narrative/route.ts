import { NextResponse } from "next/server";
import { routeNarrative } from "@/lib/ai/aiRouter";

export async function GET() {
  try {
    const data = routeNarrative();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json(
      { error: "Narrator engine unavailable", narrative: null, mode: "simulated" },
      { status: 503 },
    );
  }
}
