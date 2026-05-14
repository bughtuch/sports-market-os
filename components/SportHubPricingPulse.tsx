"use client";

import { useState, useEffect } from "react";
import type { OddsSnapshot, SportType, DataMode } from "@/lib/providers/types";

const MODE_CONFIG: Record<DataMode, { label: string; dot: string; text: string }> = {
  simulation: { label: "SIMULATED", dot: "bg-amber-400",   text: "text-amber-600" },
  hybrid:     { label: "HYBRID",    dot: "bg-blue-400",    text: "text-blue-500" },
  live:       { label: "LIVE",      dot: "bg-emerald-400", text: "text-emerald-500" },
};

interface Props {
  sport: SportType;
}

export default function SportHubPricingPulse({ sport }: Props) {
  const [snapshots, setSnapshots] = useState<OddsSnapshot[]>([]);
  const [mode, setMode] = useState<DataMode>("simulation");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/live/odds");
        if (res.ok) {
          const json = await res.json() as {
            snapshots?: OddsSnapshot[];
            meta?: { mode?: DataMode };
          };
          const filtered = (json.snapshots ?? []).filter((s) => s.sport === sport).slice(0, 5);
          setSnapshots(filtered);
          if (json.meta?.mode) setMode(json.meta.mode);
        }
      } catch {
        // noop
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [sport]);

  const modeCfg = MODE_CONFIG[mode];

  if (loading) {
    return (
      <div className="space-y-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 bg-zinc-900/40 rounded-sm animate-pulse" />
        ))}
      </div>
    );
  }

  if (snapshots.length === 0) {
    return (
      <p className="text-zinc-700 text-[10px] font-mono">
        No live pricing data for {sport}. Horse racing and tennis stay simulated pending provider integration.
      </p>
    );
  }

  return (
    <div>
      {/* Mode badge */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className={`w-1 h-1 rounded-full ${modeCfg.dot} pulse-dot`} />
        <span className={`text-[9px] font-mono ${modeCfg.text}`}>{modeCfg.label}</span>
      </div>

      <div className="space-y-px">
        {snapshots.map((snap) => {
          const movColor =
            snap.direction === "up"
              ? "text-emerald-400"
              : snap.direction === "down"
              ? "text-red-400"
              : "text-zinc-500";
          const arrow = snap.direction === "up" ? "↑" : snap.direction === "down" ? "↓" : "→";
          const probSign = snap.probChange >= 0 ? "+" : "";

          return (
            <div
              key={snap.id}
              className="flex items-center justify-between bg-zinc-950 border border-zinc-800/40 rounded-sm px-3 py-2 hover:border-zinc-700 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="text-zinc-300 text-[10px] font-mono truncate">{snap.selection}</p>
                <p className="text-zinc-600 text-[9px] font-mono truncate">{snap.market}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0 ml-3">
                <div className="text-right">
                  <span className={`text-[10px] font-mono tabular-nums font-medium ${movColor}`}>
                    {arrow}{snap.currentPrice.toFixed(2)}
                  </span>
                  <p className="text-zinc-700 text-[9px] font-mono">{snap.impliedProbability.toFixed(1)}%</p>
                </div>
                <span className={`text-[10px] font-mono tabular-nums w-14 text-right ${movColor}`}>
                  {probSign}{snap.probChange.toFixed(1)}pp
                </span>
                <div className="w-12">
                  <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-500 rounded-full"
                      style={{ width: `${Math.min(snap.volatility, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-2 text-zinc-800 text-[9px] font-mono">
        Pricing intelligence only — implied probability divergence and structural movement.
      </p>
    </div>
  );
}
