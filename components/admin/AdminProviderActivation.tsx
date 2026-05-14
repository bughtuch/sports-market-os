"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SystemReadinessSummary } from "@/lib/providerConfig/configTypes";
import { OPERATIONAL_STATUS_DOT, OPERATIONAL_STATUS_COLOR } from "@/lib/providerConfig/configTypes";

export default function AdminProviderActivation() {
  const [data,    setData]    = useState<SystemReadinessSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/provider-config")
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 bg-zinc-900 rounded-sm animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data) {
    return <p className="text-zinc-600 text-[10px] font-mono">Failed to load provider config.</p>;
  }

  const overallColor =
    data.overallReadiness >= 80 ? "text-emerald-400" :
    data.overallReadiness >= 50 ? "text-amber-400"   : "text-red-400";

  return (
    <div className="space-y-6">
      {/* Readiness overview */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Readiness",       value: `${data.overallReadiness}%`, color: overallColor },
          { label: "Live",            value: data.liveReadyCount,          color: "text-emerald-400" },
          { label: "Simulated",       value: data.simulatedCount,          color: "text-amber-400" },
          { label: "Planned",         value: data.plannedCount,            color: "text-zinc-500" },
          {
            label: "Missing Config",
            value: data.missingRequirementsCount,
            color: data.missingRequirementsCount > 0 ? "text-red-400" : "text-emerald-400",
          },
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
              OPERATIONAL_STATUS_DOT[p.operationalStatus]
            }`} />
            <span className="text-zinc-300 text-[10px] w-44 shrink-0">{p.name}</span>
            <span className={`text-[9px] font-mono w-20 shrink-0 ${
              OPERATIONAL_STATUS_COLOR[p.operationalStatus]
            }`}>
              {p.operationalStatus}
            </span>
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <div className="flex-1 h-1 bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    p.readinessScore >= 80 ? "bg-emerald-400" :
                    p.readinessScore >= 50 ? "bg-amber-400"   : "bg-red-400"
                  }`}
                  style={{ width: `${p.readinessScore}%` }}
                />
              </div>
              <span className="text-zinc-600 text-[9px] font-mono w-8 shrink-0">
                {p.readinessScore}%
              </span>
            </div>
            {p.missingRequired.length > 0 && (
              <span className="text-red-400 text-[9px] font-mono shrink-0">
                {p.missingRequired.length} missing
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Missing requirements warnings */}
      {data.missingRequirementsCount > 0 && (
        <div>
          <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest mb-2">
            Missing Required Config
          </p>
          <div className="space-y-2">
            {data.providers
              .filter(p => p.missingRequired.length > 0)
              .map(p => (
                <div key={p.id} className="bg-zinc-950 border border-red-400/20 rounded-sm px-4 py-3">
                  <p className="text-zinc-300 text-[10px] font-medium mb-1.5">{p.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.missingRequired.map(varName => (
                      <span
                        key={varName}
                        className="text-red-400 text-[9px] font-mono bg-red-400/5 border border-red-400/20 px-2 py-0.5 rounded-sm"
                      >
                        {varName}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <p className="text-zinc-800 text-[9px] font-mono">
          Generated: {new Date(data.generatedAt).toLocaleTimeString()} · No secrets exposed
        </p>
        <Link
          href="/provider-config"
          className="text-zinc-600 text-[9px] font-mono hover:text-zinc-400 transition-colors"
        >
          Full config →
        </Link>
      </div>
    </div>
  );
}
