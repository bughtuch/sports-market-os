import { NextResponse } from "next/server";
import { routeBrief } from "@/lib/ai/aiRouter";

export async function GET() {
  try {
    const data = routeBrief();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json(
      { error: "Brief engine unavailable", brief: null, mode: "simulated" },
      { status: 503 },
    );
  }
}
