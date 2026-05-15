/**
 * apiUsage.ts — Record and aggregate API usage events.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { ApiUsageEvent, ApiUsageStats } from "./apiKeyTypes";

// ─── Record ───────────────────────────────────────────────────────────────────

export async function recordUsageEvent(
  supabase: SupabaseClient,
  opts: {
    userId:     string;
    apiKeyId?:  string | null;
    endpoint?:  string | null;
    method?:    string | null;
    statusCode?: number | null;
    latencyMs?: number | null;
  },
): Promise<void> {
  await supabase.from("api_usage_events").insert({
    user_id:     opts.userId,
    api_key_id:  opts.apiKeyId  ?? null,
    endpoint:    opts.endpoint  ?? null,
    method:      opts.method    ?? null,
    status_code: opts.statusCode ?? null,
    latency_ms:  opts.latencyMs  ?? null,
  });
}

// ─── Fetch stats ──────────────────────────────────────────────────────────────

export async function fetchUsageStats(
  supabase: SupabaseClient,
  userId: string,
): Promise<ApiUsageStats> {
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  // All of today's events
  const { data: todayRows } = await supabase
    .from("api_usage_events")
    .select("id, user_id, api_key_id, endpoint, method, status_code, latency_ms, created_at")
    .eq("user_id", userId)
    .gte("created_at", todayStart.toISOString())
    .order("created_at", { ascending: false });

  const rows: ApiUsageEvent[] = (todayRows ?? []) as ApiUsageEvent[];

  const requestsToday = rows.length;
  const errorsToday   = rows.filter((r) => (r.status_code ?? 0) >= 400).length;

  const latencies = rows
    .map((r) => r.latency_ms)
    .filter((l): l is number => l !== null && l !== undefined);
  const avgLatencyMs = latencies.length > 0
    ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
    : null;

  // Top endpoints by count
  const endpointCounts: Record<string, number> = {};
  for (const r of rows) {
    if (r.endpoint) {
      endpointCounts[r.endpoint] = (endpointCounts[r.endpoint] ?? 0) + 1;
    }
  }
  const topEndpoints = Object.entries(endpointCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([endpoint, count]) => ({ endpoint, count }));

  // Recent 20 calls
  const recentCalls = rows.slice(0, 20);

  return { requestsToday, errorsToday, avgLatencyMs, topEndpoints, recentCalls };
}
