"use client";

import { useState, useEffect } from "react";
import type { ExchangeLiquiditySnapshot } from "@/lib/exchanges/types";

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  barValue?: number;  // 0-100 for bar display
  barColor?: string;
  valueColor?: string;
}

function MetricCard({ label, value, sub, barValue, barColor = "bg-zinc-500", valueColor = "text-zinc-300" }: MetricCardProps) {
  return (
    <div className="bg-zinc-950 border border-zinc-800/40 rounded-sm p-2">
      <p className="text-zinc-700 text-[8px] font-mono uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-[12px] font-mono tabular-nums font-medium ${valueColor}`}>{value}</p>
      {sub && <p className="text-zinc-600 text-[8px] font-mono mt-0.5">{sub}</p>}
      {barValue !== undefined && (
        <div className="mt-1.5 h-0.5 bg-zinc-900 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${barColor}`}
            style={{ width: `${Math.min(Math.abs(barValue), 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default function LiquiditySnapshotCards() {
  const [snapshot, setSnapshot] = useState<ExchangeLiquiditySnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/exchange/liquidity");
        if (res.ok) {
          const json = await res.json() as { snapshots?: ExchangeLiquiditySnapshot[] };
          const snaps = json.snapshots ?? [];
          // Pick the highest-volume snapshot for the summary cards
          if (snaps.length > 0) {
            const top = snaps.sort((a, b) => b.matchedVolume - a.matchedVolume)[0];
            setSnapshot(top);
          }
        }
      } catch {
        // noop
      } finally {
        setLoading(false);
      }
    }
    void load();
    const t = setInterval(() => void load(), 30_000);
    return () => clearInterval(t);
  }, []);

  const formatVolume = (v: number, currency: string) => {
    const sym = currency === "GBP" ? "£" : "$";
    if (v >= 1_000_000) return `${sym}${(v / 1_000_000).toFixed(1)}m`;
    if (v >= 1_000)     return `${sym}${Math.round(v / 1000)}k`;
    return `${sym}${v}`;
  };

  return (
    <section className="border-b border-zinc-900/80">
      <div className="px-4 py-3 flex items-center gap-2">
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
          Liquidity Snapshot
        </span>
        <div className="flex-1 h-px bg-zinc-900" />
        {snapshot && (
          <span className="text-zinc-700 text-[9px] font-mono capitalize">{snapshot.exchange}</span>
        )}
      </div>

      <div className="px-4 pb-3">
        {loading ? (
          <div className="grid grid-cols-2 gap-1.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-14 bg-zinc-900/40 rounded-sm animate-pulse" />
            ))}
          </div>
        ) : !snapshot ? (
          <p className="text-zinc-600 text-xs">No liquidity data available.</p>
        ) : (
          <>
            <p className="text-zinc-600 text-[9px] font-mono truncate mb-2">{snapshot.marketName}</p>
            <div className="grid grid-cols-2 gap-1.5">
              <MetricCard
                label="Queue Health"
                value={`${snapshot.queueHealth}/100`}
                barValue={snapshot.queueHealth}
                barColor={snapshot.queueHealth > 75 ? "bg-emerald-500" : snapshot.queueHealth > 50 ? "bg-amber-500" : "bg-red-500"}
                valueColor={snapshot.queueHealth > 75 ? "text-emerald-400" : snapshot.queueHealth > 50 ? "text-amber-400" : "text-red-400"}
              />
              <MetricCard
                label="Spread Quality"
                value={`${snapshot.spreadQuality}/100`}
                barValue={snapshot.spreadQuality}
                barColor="bg-blue-500"
                valueColor="text-blue-400"
              />
              <MetricCard
                label="Depth Imbalance"
                value={`${snapshot.depthImbalance >= 0 ? "+" : ""}${snapshot.depthImbalance}`}
                sub={snapshot.depthImbalance > 10 ? "Lay heavy" : snapshot.depthImbalance < -10 ? "Back heavy" : "Balanced"}
                barValue={Math.abs(snapshot.depthImbalance)}
                barColor={Math.abs(snapshot.depthImbalance) > 30 ? "bg-orange-500" : "bg-zinc-500"}
                valueColor={Math.abs(snapshot.depthImbalance) > 30 ? "text-orange-400" : "text-zinc-300"}
              />
              <MetricCard
                label="Matched Volume"
                value={formatVolume(snapshot.matchedVolume, snapshot.currency)}
                sub={`${snapshot.currency} total`}
                valueColor="text-zinc-300"
              />
              <MetricCard
                label="Flow Pressure"
                value={`${snapshot.flowPressure}/100`}
                barValue={snapshot.flowPressure}
                barColor={snapshot.flowPressure > 60 ? "bg-red-500" : "bg-zinc-500"}
                valueColor={snapshot.flowPressure > 60 ? "text-orange-400" : "text-zinc-400"}
              />
              <MetricCard
                label="Exchange Latency"
                value={`${snapshot.latencyMs}ms`}
                sub={snapshot.latencyMs < 20 ? "Excellent" : snapshot.latencyMs < 50 ? "Good" : "Elevated"}
                valueColor={snapshot.latencyMs < 20 ? "text-emerald-400" : snapshot.latencyMs < 50 ? "text-zinc-300" : "text-amber-400"}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
