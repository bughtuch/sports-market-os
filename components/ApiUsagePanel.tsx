"use client";

/**
 * ApiUsagePanel — Today's API usage stats for the developer dashboard.
 */

import { useEffect, useState } from "react";
import type { ApiUsageStats } from "@/lib/apiKeys/apiKeyTypes";

export default function ApiUsagePanel() {
  const [stats, setStats]     = useState<ApiUsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/keys/usage")
      .then((r) => r.json())
      .then((json: { stats: ApiUsageStats }) => setStats(json.stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 p-4">
        <p className="text-zinc-700 text-[10px] font-mono">Loading usage data…</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 p-4">
        <p className="text-zinc-600 text-[10px] font-mono">Usage data unavailable.</p>
      </div>
    );
  }

  const errorRate = stats.requestsToday > 0
    ? Math.round((stats.errorsToday / stats.requestsToday) * 100)
    : 0;

  return (
    <div className="space-y-4">

      {/* Metrics row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Requests today",  value: stats.requestsToday.toString(),                           color: "text-blue-400" },
          { label: "Errors today",    value: stats.errorsToday.toString(),                             color: stats.errorsToday > 0 ? "text-red-400" : "text-zinc-500" },
          { label: "Error rate",      value: `${errorRate}%`,                                          color: errorRate > 5 ? "text-amber-400" : "text-zinc-500" },
          { label: "Avg latency",     value: stats.avgLatencyMs !== null ? `${stats.avgLatencyMs}ms` : "—", color: "text-zinc-400" },
        ].map((m) => (
          <div key={m.label} className="border border-zinc-800/60 rounded-sm bg-zinc-950 p-3">
            <p className={`text-lg font-bold tabular-nums ${m.color}`}>{m.value}</p>
            <p className="text-zinc-600 text-[9px] font-mono mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Top endpoints */}
      {stats.topEndpoints.length > 0 && (
        <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-900/60">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              Top endpoints today
            </p>
          </div>
          <div className="divide-y divide-zinc-900/60">
            {stats.topEndpoints.map((ep) => (
              <div key={ep.endpoint} className="px-4 py-2.5 flex items-center justify-between">
                <code className="text-zinc-300 text-[10px] font-mono">{ep.endpoint}</code>
                <span className="text-zinc-500 text-[9px] font-mono tabular-nums">
                  {ep.count} req
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent calls */}
      {stats.recentCalls.length > 0 && (
        <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-900/60">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              Recent calls
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[9px] font-mono">
              <thead>
                <tr className="border-b border-zinc-900/60">
                  <th className="px-4 py-2 text-left text-zinc-600 font-normal">Endpoint</th>
                  <th className="px-4 py-2 text-left text-zinc-600 font-normal">Method</th>
                  <th className="px-4 py-2 text-left text-zinc-600 font-normal">Status</th>
                  <th className="px-4 py-2 text-left text-zinc-600 font-normal">Latency</th>
                  <th className="px-4 py-2 text-left text-zinc-600 font-normal">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/40">
                {stats.recentCalls.map((call) => (
                  <tr key={call.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="px-4 py-2 text-zinc-400">{call.endpoint ?? "—"}</td>
                    <td className="px-4 py-2 text-zinc-500">{call.method ?? "—"}</td>
                    <td className={`px-4 py-2 tabular-nums ${
                      (call.status_code ?? 0) >= 400 ? "text-red-400" : "text-emerald-600"
                    }`}>
                      {call.status_code ?? "—"}
                    </td>
                    <td className="px-4 py-2 text-zinc-500 tabular-nums">
                      {call.latency_ms !== null ? `${call.latency_ms}ms` : "—"}
                    </td>
                    <td className="px-4 py-2 text-zinc-700">
                      {new Date(call.created_at).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {stats.requestsToday === 0 && (
        <p className="text-zinc-700 text-[9px] font-mono px-1">
          No API calls recorded today. Make your first request using a key above.
        </p>
      )}
    </div>
  );
}
