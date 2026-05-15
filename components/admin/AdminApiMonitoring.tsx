"use client";

/**
 * AdminApiMonitoring — Admin view of API key infrastructure.
 * Shows authenticated admin's own key + usage data (RLS constraint — no cross-user data).
 * Cross-user platform metrics require service-role access (planned future sprint).
 */

import { useEffect, useState } from "react";
import type { ApiKeySafe, ApiUsageStats } from "@/lib/apiKeys/apiKeyTypes";
import { STATUS_COLOR, STATUS_DOT } from "@/lib/apiKeys/apiKeyTypes";

export default function AdminApiMonitoring() {
  const [keys, setKeys]       = useState<ApiKeySafe[]>([]);
  const [stats, setStats]     = useState<ApiUsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/keys").then((r) => r.json()).catch(() => ({ keys: [] })),
      fetch("/api/keys/usage").then((r) => r.json()).catch(() => ({ stats: null })),
    ]).then(([keysData, usageData]) => {
      setKeys((keysData as { keys: ApiKeySafe[] }).keys ?? []);
      setStats((usageData as { stats: ApiUsageStats }).stats ?? null);
    }).finally(() => setLoading(false));
  }, []);

  const activeKeys  = keys.filter((k) => k.status === "active").length;
  const revokedKeys = keys.filter((k) => k.status === "revoked").length;

  return (
    <div className="space-y-4">

      {/* Metrics row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Active keys",     value: loading ? "…" : activeKeys.toString(),                                               color: "text-emerald-400" },
          { label: "Revoked keys",    value: loading ? "…" : revokedKeys.toString(),                                              color: "text-zinc-500" },
          { label: "Requests today",  value: loading || !stats ? "…" : stats.requestsToday.toString(),                           color: "text-blue-400" },
          { label: "Errors today",    value: loading || !stats ? "…" : stats.errorsToday.toString(),                             color: stats?.errorsToday ? "text-red-400" : "text-zinc-500" },
        ].map((m) => (
          <div key={m.label} className="border border-zinc-800/60 rounded-sm bg-zinc-950 p-3">
            <p className={`text-xl font-bold tabular-nums ${m.color}`}>{m.value}</p>
            <p className="text-zinc-600 text-[9px] font-mono mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Key table */}
      <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-900/60 flex items-center justify-between">
          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            API Keys (admin account)
          </p>
          <p className="text-zinc-700 text-[9px] font-mono">owner-only RLS</p>
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
                <p className="text-zinc-800 text-[9px] font-mono shrink-0">
                  {new Date(k.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top endpoints */}
      {stats && stats.topEndpoints.length > 0 && (
        <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-900/60">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              Top endpoints — today
            </p>
          </div>
          <div className="divide-y divide-zinc-900/60">
            {stats.topEndpoints.map((ep) => (
              <div key={ep.endpoint} className="px-4 py-2.5 flex items-center justify-between">
                <code className="text-zinc-400 text-[10px] font-mono">{ep.endpoint}</code>
                <span className="text-zinc-600 text-[9px] font-mono tabular-nums">{ep.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Platform analytics note */}
      <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 p-4">
        <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2">
          Platform-wide analytics
        </p>
        <p className="text-zinc-600 text-[10px] leading-relaxed">
          This view is bounded by owner-only RLS — it shows only the admin account&apos;s own keys and usage.
          Cross-user platform metrics (total keys issued, request volume across all users) require
          a service-role API route. Planned for a future sprint.
        </p>
      </div>

      {/* v1 endpoint registry */}
      <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-900/60">
          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            v1 endpoint registry
          </p>
        </div>
        <div className="divide-y divide-zinc-900/60">
          {[
            { path: "/api/v1/signals",      desc: "Market intelligence signals",   status: "live" },
            { path: "/api/v1/market-pulse", desc: "Market pulse + regime",         status: "live" },
            { path: "/api/v1/daily-brief",  desc: "Latest persisted daily brief",  status: "live" },
          ].map((ep) => (
            <div key={ep.path} className="px-4 py-2.5 flex items-center gap-3">
              <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
              <code className="text-zinc-300 text-[10px] font-mono flex-1">{ep.path}</code>
              <span className="text-zinc-500 text-[9px]">{ep.desc}</span>
              <span className="text-emerald-600 text-[9px] font-mono">{ep.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
