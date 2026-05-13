import { NextResponse } from "next/server";
import { routeProviderStatus } from "@/lib/providers/providerRouter";

export async function GET() {
  try {
    const data = await routeProviderStatus();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json(
      { error: "Provider status unavailable", providers: [], systemMode: "simulation", timestamp: new Date().toISOString() },
      { status: 503 }
    );
  }
}
