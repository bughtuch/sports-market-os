"use client";

import { useState } from "react";
import { useLiveMarketData } from "@/hooks/useLiveMarketData";
import { PROVIDER_STATUSES } from "@/lib/providers/mockProvider";
import type { ProviderStatusType } from "@/lib/providers/types";

const STATUS_CONFIG: Record<ProviderStatusType, { dot: string; text: string; label: string }> = {
  online:    { dot: "bg-emerald-400", text: "text-emerald-500", label: "ONLINE" },
  simulated: { dot: "bg-amber-400",   text: "text-amber-500",   label: "SIMULATED" },
  planned:   { dot: "bg-zinc-600",    text: "text-zinc-600",    label: "PLANNED" },
  degraded:  { dot: "bg-red-400",     text: "text-red-500",     label: "DEGRADED" },
};

export default function ProviderStatusPanel() {
  const { providerStatuses } = useLiveMarketData();
  const [expanded, setExpanded] = useState(false);

  // Use hook data if available, fall back to static list
  const statuses = providerStatuses.length > 0 ? providerStatuses : PROVIDER_STATUSES;

  const onlineCount = statuses.filter((p) => p.status === "online").length;
  const simulatedCount = statuses.filter((p) => p.status === "simulated").length;

  return (
    <section className="px-4 py-3 border-b border-zinc-900/80">
      {/* Header row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between group"
      >
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            Provider Status
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-700 text-[9px] font-mono">
              {onlineCount} online · {simulatedCount} simulated
            </span>
          </div>
        </div>
        <span className="text-zinc-700 text-[9px] font-mono group-hover:text-zinc-500 transition-colors">
          {expanded ? "▲" : "▼"}
        </span>
      </button>

      {/* Compact status row (always visible) */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
        {statuses.map((p) => {
          const cfg = STATUS_CONFIG[p.status];
          return (
            <div key={p.id} className="flex items-center gap-1" title={p.description}>
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot} ${
                  p.status === "online" || p.status === "simulated" ? "pulse-dot" : ""
                }`}
              />
              <span className="text-zinc-500 text-[9px] font-mono">{p.name}</span>
            </div>
          );
        })}
      </div>

      {/* Expanded detail table */}
      {expanded && (
        <div className="mt-3 space-y-px">
          {statuses.map((p) => {
            const cfg = STATUS_CONFIG[p.status];
            return (
              <div
                key={p.id}
                className="flex items-center justify-between py-1.5 border-b border-zinc-900/60 last:border-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot} ${
                      p.status === "online" || p.status === "simulated" ? "pulse-dot" : ""
                    }`}
                  />
                  <div className="min-w-0">
                    <span className="text-zinc-300 text-[10px] font-mono truncate block">{p.name}</span>
                    <span className="text-zinc-600 text-[9px] leading-tight block truncate">{p.description}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  {p.latencyMs !== undefined && (
                    <span className="text-zinc-600 text-[9px] font-mono tabular-nums">{p.latencyMs}ms</span>
                  )}
                  <span className={`text-[8px] font-mono uppercase tracking-wider ${cfg.text}`}>
                    {cfg.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
