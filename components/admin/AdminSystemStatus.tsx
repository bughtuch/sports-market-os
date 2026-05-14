"use client";

import { useEffect, useState } from "react";
import type { ProviderHealthSummary } from "@/lib/providers/providerHealth";

export default function AdminSystemStatus() {
  const [data,    setData]    = useState<ProviderHealthSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/system-status")
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-8 bg-zinc-900 rounded-sm animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data) {
    return <p className="text-zinc-600 text-[10px] font-mono">Failed to load system status.</p>;
  }

  const scoreColor =
    data.systemHealthScore >= 80 ? "text-emerald-400" :
    data.systemHealthScore >= 50 ? "text-amber-400"   : "text-red-400";

  return (
    <div className="space-y-6">
      {/* Score row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Health Score", value: `${data.systemHealthScore}%`, color: scoreColor },
          { label: "Healthy",      value: data.healthyCount,            color: "text-emerald-400" },
          { label: "Simulated",    value: data.simulatedCount,          color: "text-amber-400" },
          { label: "Planned",      value: data.plannedCount,            color: "text-zinc-500" },
          { label: "Avg Uptime",   value: `${data.avgUptimePct}%`,      color: "text-white" },
        ].map(m => (
          <div key={m.label} className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-3">
            <p className="text-zinc-700 text-[8px] font-mono uppercase tracking-wider mb-1">{m.label}</p>
            <p className={`text-xl font-semibold font-mono tabular-nums ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Provider table */}
      <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm overflow-hidden">
        {data.providers.map(p => (
          <div
            key={p.id}
            className="flex items-center gap-3 px-4 py-2.5 border-b border-zinc-900/60 last:border-0"
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              p.status === "healthy"   ? "bg-emerald-400" :
              p.status === "simulated" ? "bg-amber-400"   :
              p.status === "degraded"  ? "bg-red-400"     : "bg-zinc-700"
            }`} />
            <span className="text-zinc-300 text-[10px] w-40 shrink-0">{p.name}</span>
            <span className={`text-[9px] font-mono w-20 shrink-0 ${
              p.status === "healthy"   ? "text-emerald-400" :
              p.status === "simulated" ? "text-amber-400"   :
              p.status === "degraded"  ? "text-red-400"     : "text-zinc-600"
            }`}>
              {p.status}
            </span>
            <span className="text-zinc-600 text-[9px] flex-1 truncate">{p.description}</span>
            {p.avgLatencyMs > 0 && (
              <span className="text-zinc-500 text-[9px] font-mono shrink-0">{p.avgLatencyMs}ms</span>
            )}
            {p.fallbackCount > 0 && (
              <span className="text-amber-600 text-[9px] font-mono shrink-0">{p.fallbackCount} fb</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
