/**
 * GET /api/v1/signals
 * Authenticated market intelligence signal feed.
 * Requires: x-smo-api-key header with an active API key.
 * Returns: X-SMO-Plan, X-SMO-RateLimit-* headers.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireApiKey } from "@/lib/apiKeys/apiAccessControl";
import { recordUsageEvent } from "@/lib/apiKeys/apiUsage";
import { routeSignals } from "@/lib/providers/providerRouter";

export const dynamic = "force-dynamic";

const ENDPOINT = "/api/v1/signals";

export async function GET(request: Request) {
  const start    = Date.now();
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const auth = await requireApiKey(supabase, request, ENDPOINT);
  if (!auth.ok) return auth.response;

  try {
    const data = await routeSignals();

    void recordUsageEvent(supabase, {
      userId:     auth.userId,
      apiKeyId:   auth.keyId,
      endpoint:   ENDPOINT,
      method:     "GET",
      statusCode: 200,
      latencyMs:  Date.now() - start,
    });

    return NextResponse.json(
      { ...data, _v: 1 },
      { headers: { "Cache-Control": "no-store, max-age=0", ...auth.headers } },
    );
  } catch {
    void recordUsageEvent(supabase, {
      userId:     auth.userId,
      apiKeyId:   auth.keyId,
      endpoint:   ENDPOINT,
      method:     "GET",
      statusCode: 503,
      latencyMs:  Date.now() - start,
    });

    return NextResponse.json(
      { error: "Signal feed unavailable", signals: [], meta: null },
      { status: 503, headers: auth.headers },
    );
  }
}
