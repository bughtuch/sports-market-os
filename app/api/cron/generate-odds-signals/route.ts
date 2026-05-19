import { NextResponse } from "next/server";
import { runOddsApiSignalGeneration } from "@/lib/signals/odds-engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const start = Date.now();

  try {
    const result = await runOddsApiSignalGeneration();
    return NextResponse.json({
      success: true,
      ...result,
      duration_ms: Date.now() - start,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[cron/generate-odds-signals]", error);
    return NextResponse.json(
      {
        error: "Odds signal generation failed",
        details: error instanceof Error ? error.message : String(error),
        duration_ms: Date.now() - start,
      },
      { status: 500 }
    );
  }
}
