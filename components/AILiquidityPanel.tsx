"use client";

import { useState, useEffect } from "react";
import type { AILiquidityInsight } from "@/lib/ai/types";

function MetricBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1 flex-1 bg-zinc-900 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

export default function AILiquidityPanel() {
  const [data, setData] = useState<AILiquidityInsight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch("/api/ai/liquidity");
        if (res.ok) {
          const json = await res.json() as { insight?: AILiquidityInsight };
          if (json.insight) setData(json.insight);
        }
      } catch { /* noop */ }
      finally { setLoading(false); }
    }
    void fetch_();
    const timer = setInterval(() => void fetch_(), 12_000);
    return () => clearInterval(timer);
  }, []);

  const pressureColor =
    data?.structuralPressure === "bullish"
      ? "text-emerald-400"
      : data?.structuralPressure === "bearish"
      ? "text-red-400"
      : "text-zinc-400";

  return (
    <section className="border-b border-zinc-800/40 bg-zinc-950">
      <div className="px-3 py-2.5 flex items-center gap-2">
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
          Liquidity Intelligence
        </span>
        <div className="flex-1 h-px bg-zinc-900" />
        <span className={`text-[9px] font-mono uppercase ${pressureColor}`}>
          {data?.structuralPressure ?? "—"}
        </span>
      </div>

      {loading ? (
        <div className="px-3 pb-3 space-y-1.5">
          {[1, 2, 3].map((i) => <div key={i} className="h-2.5 bg-zinc-900/40 rounded-sm animate-pulse" />)}
        </div>
      ) : !data ? (
        <p className="px-3 pb-3 text-zinc-700 text-[9px] font-mono">Engine unavailable.</p>
      ) : (
        <div className="px-3 pb-3">
          <p className="text-zinc-400 text-[10px] leading-relaxed mb-2.5">{data.interpretation}</p>

          {/* Metrics */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-zinc-700 text-[9px] font-mono w-24 shrink-0">Queue Health</span>
              <MetricBar value={data.queueHealth} color="bg-emerald-500/50" />
              <span className="text-zinc-500 text-[9px] font-mono tabular-nums w-6 text-right">{data.queueHealth}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-700 text-[9px] font-mono w-24 shrink-0">Liq. Quality</span>
              <MetricBar value={data.liquidityQuality} color="bg-blue-500/50" />
              <span className="text-zinc-500 text-[9px] font-mono tabular-nums w-6 text-right">{data.liquidityQuality}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-700 text-[9px] font-mono w-24 shrink-0">Spoof Risk</span>
              <MetricBar value={data.spoofRisk} color="bg-red-500/40" />
              <span className="text-zinc-500 text-[9px] font-mono tabular-nums w-6 text-right">{data.spoofRisk}</span>
            </div>
          </div>

          {/* Buy/Sell split */}
          <div className="mt-2 h-1 bg-zinc-900 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-emerald-500/60"
              style={{ width: `${data.buyImbalance}%` }}
            />
            <div className="h-full bg-red-500/40 flex-1" />
          </div>
          <div className="flex justify-between mt-0.5">
            <span className="text-emerald-700 text-[8px] font-mono">BUY {data.buyImbalance}%</span>
            <span className="text-red-700 text-[8px] font-mono">SELL {data.sellImbalance}%</span>
          </div>

          {/* Flags */}
          <div className="flex gap-2 mt-2">
            {data.lateMoney && (
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-sm border border-amber-400/20 bg-amber-400/10 text-amber-400 uppercase">
                Late Money
              </span>
            )}
            {data.flowDivergence && (
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-sm border border-purple-400/20 bg-purple-400/10 text-purple-400 uppercase">
                Flow Divergence
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
