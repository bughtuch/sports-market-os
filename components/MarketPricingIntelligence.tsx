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

export default function MarketPricingIntelligence({ sport }: Props) {
  const [snapshots, setSnapshots] = useState<OddsSnapshot[]>([]);
  const [mode, setMode] = useState<DataMode>("simulation");
  const [provider, setProvider] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/live/odds");
        if (res.ok) {
          const json = await res.json() as {
            snapshots?: OddsSnapshot[];
            meta?: { mode?: DataMode; provider?: string };
          };
          const filtered = (json.snapshots ?? []).filter((s) => s.sport === sport).slice(0, 4);
          // If no sport-specific data, show all (often happens when simulated)
          const items = filtered.length > 0 ? filtered : (json.snapshots ?? []).slice(0, 4);
          setSnapshots(items);
          if (json.meta?.mode) setMode(json.meta.mode);
          if (json.meta?.provider) setProvider(json.meta.provider);
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
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-16 bg-zinc-900/40 rounded-sm animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5">
          <span className={`w-1 h-1 rounded-full ${modeCfg.dot} pulse-dot`} />
          <span className={`text-[9px] font-mono ${modeCfg.text}`}>{modeCfg.label}</span>
        </div>
        {provider && (
          <span className="text-zinc-700 text-[9px] font-mono border border-zinc-800 px-1 rounded-sm">
            {provider}
          </span>
        )}
      </div>

      {snapshots.length === 0 ? (
        <p className="text-zinc-600 text-xs">No pricing data available.</p>
      ) : (
        <div className="space-y-2">
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
                className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-3 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <p className="text-zinc-400 text-[9px] font-mono uppercase tracking-wider">{snap.market}</p>
                    <p className="text-white text-sm font-medium mt-0.5">{snap.selection}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-zinc-600 text-[8px] font-mono uppercase">Current</p>
                    <p className={`text-lg font-bold tabular-nums ${movColor}`}>
                      {arrow}{snap.currentPrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-4 gap-3 pt-2 border-t border-zinc-800/60">
                  <div>
                    <p className="text-zinc-700 text-[8px] font-mono uppercase mb-0.5">Open</p>
                    <p className="text-zinc-500 text-[10px] font-mono tabular-nums">
                      {snap.openingPrice.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-700 text-[8px] font-mono uppercase mb-0.5">Impl. Prob</p>
                    <p className="text-zinc-300 text-[10px] font-mono tabular-nums">
                      {snap.impliedProbability.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-700 text-[8px] font-mono uppercase mb-0.5">Prob Δ</p>
                    <p className={`text-[10px] font-mono tabular-nums ${movColor}`}>
                      {probSign}{snap.probChange.toFixed(1)}pp
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-700 text-[8px] font-mono uppercase mb-0.5">Volatility</p>
                    <div className="flex items-center gap-1">
                      <div className="h-1 flex-1 bg-zinc-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-zinc-500 rounded-full"
                          style={{ width: `${Math.min(snap.volatility, 100)}%` }}
                        />
                      </div>
                      <span className="text-zinc-600 text-[9px] font-mono tabular-nums">
                        {snap.volatility.toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <p className="text-zinc-700 text-[9px] font-mono">{snap.source} · {snap.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-3 text-zinc-800 text-[9px] font-mono">
        Pricing intelligence only. Implied probability divergence and structural movement indicators.
      </p>
    </div>
  );
}
