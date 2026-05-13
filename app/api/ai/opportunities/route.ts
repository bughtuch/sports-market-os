import { NextResponse } from "next/server";
import { routeOpportunities } from "@/lib/ai/aiRouter";

export async function GET() {
  try {
    const data = routeOpportunities();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json(
      { error: "Opportunity engine unavailable", opportunities: [], count: 0, mode: "simulated" },
      { status: 503 },
    );
  }
}
