"use client";

import { useState, useEffect } from "react";
import type { AIEngineStatus, AIEngineStatusType } from "@/lib/ai/types";

const STATUS_CONFIG: Record<AIEngineStatusType, { dot: string; text: string; label: string }> = {
  active:    { dot: "bg-emerald-400", text: "text-emerald-500", label: "ACTIVE" },
  simulated: { dot: "bg-amber-400",   text: "text-amber-500",   label: "SIMULATED" },
  degraded:  { dot: "bg-red-400",     text: "text-red-500",     label: "DEGRADED" },
  queued:    { dot: "bg-zinc-600",    text: "text-zinc-600",    label: "QUEUED" },
};

export default function AIEngineStatus() {
  const [engines, setEngines] = useState<AIEngineStatus[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Derive engine statuses from the brief endpoint (includes engine data via aiRouter)
    // Fallback: static simulated statuses
    const STATIC: AIEngineStatus[] = [
      { id: "eng-001", name: "Narrator Engine",    status: "simulated", latencyMs: 14, lastRun: new Date().toISOString(), mode: "simulated", description: "Institutional narrative generation — LLM routing ready" },
      { id: "eng-002", name: "Liquidity Engine",   status: "simulated", latencyMs: 22, lastRun: new Date().toISOString(), mode: "simulated", description: "Order book depth and flow analysis engine" },
      { id: "eng-003", name: "Volatility Engine",  status: "simulated", latencyMs: 18, lastRun: new Date().toISOString(), mode: "simulated", description: "IV compression and expansion detection engine" },
      { id: "eng-004", name: "Behavioural Engine", status: "simulated", latencyMs: 26, lastRun: new Date().toISOString(), mode: "simulated", description: "Market psychology and crowd/sharp divergence analysis" },
      { id: "eng-005", name: "Opportunity Engine", status: "simulated", latencyMs: 19, lastRun: new Date().toISOString(), mode: "simulated", description: "Market intelligence opportunity detection — analytics only" },
      { id: "eng-006", name: "Regime Engine",      status: "simulated", latencyMs: 11, lastRun: new Date().toISOString(), mode: "simulated", description: "Global market regime classification engine" },
    ];
    setEngines(STATIC);

    const timer = setInterval(() => {
      setEngines((prev) =>
        prev.map((e) => ({
          ...e,
          latencyMs: Math.max(6, Math.round(e.latencyMs + (Math.random() - 0.5) * 8)),
          lastRun: new Date().toISOString(),
        }))
      );
    }, 15_000);
    return () => clearInterval(timer);
  }, []);

  const simulatedCount = engines.filter((e) => e.status === "simulated").length;
  const activeCount = engines.filter((e) => e.status === "active").length;

  return (
    <section className="px-4 py-3 border-b border-zinc-900/80">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between group"
      >
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            AI Engine Status
          </span>
          <span className="text-zinc-700 text-[9px] font-mono">
            {activeCount} active · {simulatedCount} simulated
          </span>
        </div>
        <span className="text-zinc-700 text-[9px] font-mono group-hover:text-zinc-500 transition-colors">
          {expanded ? "▲" : "▼"}
        </span>
      </button>

      {/* Compact dot row */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
        {engines.map((e) => {
          const cfg = STATUS_CONFIG[e.status];
          return (
            <div key={e.id} className="flex items-center gap-1" title={e.description}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot} ${e.status === "simulated" ? "pulse-dot" : ""}`} />
              <span className="text-zinc-500 text-[9px] font-mono">{e.name}</span>
            </div>
          );
        })}
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="mt-3 space-y-px">
          {engines.map((e) => {
            const cfg = STATUS_CONFIG[e.status];
            return (
              <div
                key={e.id}
                className="flex items-center justify-between py-1.5 border-b border-zinc-900/60 last:border-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot} ${e.status === "simulated" ? "pulse-dot" : ""}`} />
                  <div className="min-w-0">
                    <span className="text-zinc-300 text-[10px] font-mono block">{e.name}</span>
                    <span className="text-zinc-600 text-[9px] block truncate">{e.description}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="text-zinc-600 text-[9px] font-mono tabular-nums">{e.latencyMs}ms</span>
                  <span className={`text-[8px] font-mono uppercase tracking-wider ${cfg.text}`}>{cfg.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
