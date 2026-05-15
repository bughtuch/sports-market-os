"use client";

/**
 * AdminApiMonitoring — Admin view of API key infrastructure + quota pressure.
 * Bounded by owner-only RLS — shows admin account's own data only.
 * Cross-user platform metrics require service-role (future sprint).
 */

import { useEffect, useState } from "react";
import type { ApiKeySafe, ApiUsageStats } from "@/lib/apiKeys/apiKeyTypes";
import { STATUS_COLOR, STATUS_DOT } from "@/lib/apiKeys/apiKeyTypes";
import type { QuotaStatus } from "@/lib/apiAccess/apiPlanTypes";
import { PLAN_LABEL } from "@/lib/apiAccess/apiPlanTypes";

export default function AdminApiMonitoring() {
  const [keys, setKeys]       = useState<ApiKeySafe[]>([]);
  const [stats, setStats]     = useState<ApiUsageStats | null>(null);
  const [quota, setQuota]     = useState<QuotaStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/keys").then((r) => r.json()).catch(() => ({ keys: [] })),
      fetch("/api/keys/usage").then((r) => r.json()).catch(() => ({ stats: null })),
      fetch("/api/keys/quota").then((r) => r.json()).catch(() => ({ quota: null })),
    ]).then(([keysData, usageData, quotaData]) => {
      setKeys((keysData as { keys: ApiKeySafe[] }).keys ?? []);
      setStats((usageData as { stats: ApiUsageStats }).stats ?? null);
      setQuota((quotaData as { quota: QuotaStatus }).quota ?? null);
    }).finally(() => setLoading(false));
  }, []);

  const activeKeys  = keys.filter((k) => k.status === "active").length;
  const revokedKeys = keys.filter((k) => k.status === "revoked").length;

  const rateLimitedToday = stats?.recentCalls.filter((c) => c.status_code === 429).length ?? 0;
  const forbiddenToday   = stats?.recentCalls.filter((c) => c.status_code === 403).length ?? 0;
  const errorRate = (stats?.requestsToday ?? 0) > 0
    ? Math.round(((stats?.errorsToday ?? 0) / stats!.requestsToday) * 100)
    : 0;

  return (
    <div className="space-y-4">

      {/* Metrics row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Active keys",       value: loading ? "…" : activeKeys.toString(),                                    color: "text-emerald-400" },
          { label: "Requests today",    value: loading || !stats ? "…" : stats.requestsToday.toString(),                 color: "text-blue-400"    },
          { label: "Rate-limited",      value: loading ? "…" : rateLimitedToday.toString(),                              color: rateLimitedToday > 0 ? "text-amber-400" : "text-zinc-500" },
          { label: "Error rate",        value: loading || !stats ? "…" : `${errorRate}%`,                                color: errorRate > 5 ? "text-red-400" : "text-zinc-500" },
        ].map((m) => (
          <div key={m.label} className="border border-zinc-800/60 rounded-sm bg-zinc-950 p-3">
            <p className={`text-xl font-bold tabular-nums ${m.color}`}>{m.value}</p>
            <p className="text-zinc-600 text-[9px] font-mono mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Quota pressure */}
      {quota && (
        <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              Quota pressure — admin account
            </p>
            <span className="text-[9px] font-mono text-blue-400">{PLAN_LABEL[quota.plan]} plan</span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all ${
                quota.percentUsed >= 90 ? "bg-red-500" :
                quota.percentUsed >= 70 ? "bg-amber-500" : "bg-blue-500"
              }`}
              style={{ width: `${quota.percentUsed}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[9px] font-mono">
            <span className="text-zinc-500">
              {quota.used.toLocaleString()} / {quota.limit.toLocaleString()} calls today
            </span>
            <span className="text-zinc-600">{quota.percentUsed}% · resets {new Date(quota.resetAt).toLocaleTimeString()}</span>
          </div>
          {quota.degraded && (
            <p className="text-amber-400 text-[9px] font-mono mt-1">⚠ Quota check degraded — enforcement paused</p>
          )}
        </div>
      )}

      {/* Key table */}
      <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-900/60 flex items-center justify-between">
          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            API Keys (admin account)
          </p>
          <p className="text-zinc-700 text-[9px] font-mono">
            {activeKeys} active · {revokedKeys} revoked · owner-only RLS
          </p>
        </div>

        {loading ? (
          <div className="px-4 py-6 text-zinc-700 text-[10px] font-mono">Loading…</div>
        ) : keys.length === 0 ? (
          <div className="px-4 py-6 text-zinc-600 text-[10px] font-mono">No keys on this account.</div>
        ) : (
          <div className="divide-y divide-zinc-900/60">
            {keys.map((k) => (
              <div key={k.id} className="px-4 py-3 flex items-center gap-3">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[k.status]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-300 text-[11px] truncate">{k.name}</p>
                  <p className="text-zinc-600 text-[9px] font-mono">{k.key_prefix}…</p>
                </div>
                <span className={`text-[9px] font-mono ${STATUS_COLOR[k.status]}`}>{k.status}</span>
                <p className="text-zinc-700 text-[9px] font-mono shrink-0">
                  {k.last_used_at ? new Date(k.last_used_at).toLocaleDateString() : "never"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top endpoints */}
      {stats && stats.topEndpoints.length > 0 && (
        <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-900/60 flex items-center justify-between">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Top endpoints — today</p>
            <p className="text-zinc-700 text-[9px] font-mono">
              {forbiddenToday > 0 ? `${forbiddenToday} 403 · ` : ""}{rateLimitedToday > 0 ? `${rateLimitedToday} 429 · ` : ""}avg {stats.avgLatencyMs !== null ? `${stats.avgLatencyMs}ms` : "—"}
            </p>
          </div>
          <div className="divide-y divide-zinc-900/60">
            {stats.topEndpoints.map((ep) => (
              <div key={ep.endpoint} className="px-4 py-2.5 flex items-center justify-between">
                <code className="text-zinc-400 text-[10px] font-mono">{ep.endpoint}</code>
                <span className="text-zinc-600 text-[9px] font-mono tabular-nums">{ep.count} req</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* v1 endpoint registry */}
      <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-900/60">
          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">v1 endpoint registry</p>
        </div>
        <div className="divide-y divide-zinc-900/60">
          {[
            { path: "/api/v1/signals",         plan: "Free",    status: "live"    },
            { path: "/api/v1/market-pulse",    plan: "Free",    status: "live"    },
            { path: "/api/v1/daily-brief",     plan: "Free",    status: "live"    },
            { path: "/api/v1/distribution",    plan: "Partner", status: "planned" },
            { path: "/api/v1/exchange-flow",   plan: "API",     status: "planned" },
            { path: "/api/v1/provider-status", plan: "API",     status: "planned" },
          ].map((ep) => (
            <div key={ep.path} className="px-4 py-2.5 flex items-center gap-3">
              <span className={`w-1 h-1 rounded-full shrink-0 ${ep.status === "live" ? "bg-emerald-500" : "bg-zinc-700"}`} />
              <code className="text-zinc-300 text-[10px] font-mono flex-1">{ep.path}</code>
              <span className="text-zinc-600 text-[9px]">{ep.plan} plan</span>
              <span className={`text-[9px] font-mono ${ep.status === "live" ? "text-emerald-600" : "text-zinc-700"}`}>{ep.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Platform analytics note */}
      <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 p-4">
        <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1">Platform-wide analytics</p>
        <p className="text-zinc-700 text-[10px] leading-relaxed">
          This view is bounded by owner-only RLS. Cross-user metrics (total keys issued, aggregate quota pressure,
          platform-wide rate limit events) require a service-role API route. Planned for a future sprint.
        </p>
      </div>
    </div>
  );
}
