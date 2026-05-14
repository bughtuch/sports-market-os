/**
 * /api/provider-config — Provider readiness and activation state.
 *
 * Server-side only. Returns sanitised readiness data — no secret values are ever included.
 * Only exposes: configured (yes/no), readiness scores, missing var names, operational modes.
 */

import { NextResponse } from "next/server";
import { getSystemReadiness } from "@/lib/providerConfig/providerReadiness";

export const dynamic = "force-dynamic";

export async function GET() {
  const readiness = getSystemReadiness();
  return NextResponse.json(readiness);
}
