import { NextResponse } from "next/server";
import { getProviderHealth } from "@/lib/providers/providerHealth";

export const dynamic = "force-dynamic";

export async function GET() {
  const summary = getProviderHealth();
  return NextResponse.json(summary);
}
