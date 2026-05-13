"use client";

import { useState, useEffect } from "react";
import type { AIVolatilityInsight, VolatilityRegime } from "@/lib/ai/types";

const REGIME_CONFIG: Record<VolatilityRegime, { text: string; bg: string; border: string }> = {
  compression:  { text: "text-amber-400",  bg: "bg-amber-400/10",  border: "border-amber-400/20" },
  expansion:    { text: "text-red-400",    bg: "bg-red-400/10",    border: "border-red-400/20" },
  anomaly:      { text: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" },
  acceleration: { text: "text-red-500",    bg: "bg-red-500/10",    border: "border-red-500/20" },
  exhaustion:   { text: "text-blue-400",   bg: "bg-blue-400/10",   border: "border-blue-400/20" },
  stable:       { text: "text-zinc-400",   bg: "bg-zinc-400/10",   border: "border-zinc-400/20" },
};

export default function AIVolatilityPanel() {
  const [data, setData] = useState<AIVolatilityInsight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch("/api/ai/volatility");
        if (res.ok) {
          const json = await res.json() as { insight?: AIVolatilityInsight };
          if (json.insight) setData(json.insight);
        }
      } catch { /* noop */ }
      finally { setLoading(false); }
    }
    void fetch_();
    const timer = setInterval(() => void fetch_(), 12_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="border-b border-zinc-800/40 bg-zinc-950">
      <div className="px-3 py-2.5 flex items-center gap-2">
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
          Volatility Engine
        </span>
        <div className="flex-1 h-px bg-zinc-900" />
        {data && (() => {
          const cfg = REGIME_CONFIG[data.regime];
          return (
            <span className={`text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-sm border ${cfg.text} ${cfg.bg} ${cfg.border}`}>
              {data.regime}
            </span>
          );
        })()}
      </div>

      {loading ? (
        <div className="px-3 pb-3 space-y-1.5">
          {[1, 2, 3].map((i) => <div key={i} className="h-2.5 bg-zinc-900/40 rounded-sm animate-pulse" />)}
        </div>
      ) : !data ? (
        <p className="px-3 pb-3 text-zinc-700 text-[9px] font-mono">Engine unavailable.</p>
      ) : (
        <div className="px-3 pb-3">
          <p className="text-zinc-400 text-[10px] leading-relaxed mb-2.5">{data.summary}</p>

          {/* Metrics row */}
          <div className="flex items-center gap-4 mb-2">
            <div>
              <p className="text-zinc-700 text-[8px] font-mono uppercase">Projected Δ</p>
              <p className="text-zinc-300 text-[11px] font-mono tabular-nums">
                ±{data.projectedMovement.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-zinc-700 text-[8px] font-mono uppercase">AI Confidence</p>
              <p className="text-zinc-300 text-[11px] font-mono tabular-nums">{data.confidence}%</p>
            </div>
          </div>

          {/* Anomaly score bar */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-700 text-[9px] font-mono w-20 shrink-0">Anomaly Score</span>
            <div className="h-1 flex-1 bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500/50 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(data.anomalyScore, 100)}%` }}
              />
            </div>
            <span className="text-zinc-500 text-[9px] font-mono tabular-nums w-6 text-right">{data.anomalyScore}</span>
          </div>

          {/* Affected sports */}
          <div className="flex flex-wrap gap-1 mt-2">
            {data.affectedSports.map((s) => (
              <span key={s} className="text-zinc-700 text-[8px] font-mono border border-zinc-900 px-1 py-0.5 rounded-sm">{s}</span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
