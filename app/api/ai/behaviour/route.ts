import { NextResponse } from "next/server";
import { routeBehaviour } from "@/lib/ai/aiRouter";

export async function GET() {
  try {
    const data = routeBehaviour();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json(
      { error: "Behavioural engine unavailable", signal: null, mode: "simulated" },
      { status: 503 },
    );
  }
}
