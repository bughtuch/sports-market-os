/**
 * GET /api/v1/signals
 * Authenticated market intelligence signal feed.
 * Requires: x-smo-api-key header with an active API key.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireApiKey } from "@/lib/apiKeys/apiAccessControl";
import { recordUsageEvent } from "@/lib/apiKeys/apiUsage";
import { routeSignals } from "@/lib/providers/providerRouter";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const start     = Date.now();
  const supabase  = await createClient();
  if (!supabase) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const auth = await requireApiKey(supabase, request);
  if (!auth.ok) return auth.response;

  let statusCode = 200;
  try {
    const data = await routeSignals();

    void recordUsageEvent(supabase, {
      userId:     auth.userId,
      apiKeyId:   auth.keyId,
      endpoint:   "/api/v1/signals",
      method:     "GET",
      statusCode: 200,
      latencyMs:  Date.now() - start,
    });

    return NextResponse.json(
      { ...data, _v: 1 },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch {
    statusCode = 503;
    void recordUsageEvent(supabase, {
      userId:     auth.userId,
      apiKeyId:   auth.keyId,
      endpoint:   "/api/v1/signals",
      method:     "GET",
      statusCode,
      latencyMs:  Date.now() - start,
    });

    return NextResponse.json(
      { error: "Signal feed unavailable", signals: [], meta: null },
      { status: 503 },
    );
  }
}
