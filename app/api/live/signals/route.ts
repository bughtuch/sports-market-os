import { NextResponse } from "next/server";
import { routeSignals } from "@/lib/providers/providerRouter";

export async function GET() {
  try {
    const data = await routeSignals();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json(
      { error: "Signal feed unavailable", signals: [], meta: null },
      { status: 503 }
    );
  }
}
