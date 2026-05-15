/**
 * GET /api/v1/daily-brief
 * Returns the latest persisted daily brief.
 * Requires: x-smo-api-key header with an active API key.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireApiKey } from "@/lib/apiKeys/apiAccessControl";
import { recordUsageEvent } from "@/lib/apiKeys/apiUsage";
import { fetchLatestBrief } from "@/lib/dailyBriefs/briefPersistence";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const start    = Date.now();
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const auth = await requireApiKey(supabase, request);
  if (!auth.ok) return auth.response;

  const brief = await fetchLatestBrief(supabase);

  void recordUsageEvent(supabase, {
    userId:     auth.userId,
    apiKeyId:   auth.keyId,
    endpoint:   "/api/v1/daily-brief",
    method:     "GET",
    statusCode: brief ? 200 : 404,
    latencyMs:  Date.now() - start,
  });

  if (!brief) {
    return NextResponse.json({ error: "No brief available yet" }, { status: 404 });
  }

  return NextResponse.json({ brief, _v: 1 });
}
