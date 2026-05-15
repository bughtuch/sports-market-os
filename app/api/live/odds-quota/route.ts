import { NextResponse } from "next/server";
import { getQuotaState } from "@/lib/providers/odds/theOddsApiProvider";

export async function GET() {
  const quota = getQuotaState();
  return NextResponse.json(quota, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
