"use client";

import { useState, useEffect } from "react";
import type { OddsSnapshot, SportType, DataMode } from "@/lib/providers/types";

const SPORT_COLORS: Record<SportType, string> = {
  "Horse Racing":     "text-amber-400",
  Tennis:             "text-emerald-400",
  NBA:                "text-blue-400",
  NFL:                "text-red-400",
  NHL:                "text-cyan-400",
  MLB:                "text-emerald-400",
  UFC:                "text-orange-400",
  Football:           "text-zinc-300",
  Golf:               "text-green-400",
  "Formula 1":        "text-red-400",
  "Prediction Markets": "text-purple-400",
};

const MODE_CONFIG: Record<DataMode, { label: string; dot: string; text: string }> = {
  simulation: { label: "SIMULATED", dot: "bg-amber-400",   text: "text-amber-600" },
  hybrid:     { label: "HYBRID",    dot: "bg-blue-400",    text: "text-blue-500" },
  live:       { label: "LIVE",      dot: "bg-emerald-400", text: "text-emerald-500" },
};

export default function OddsMovementFeed() {
  const [snapshots, setSnapshots] = useState<OddsSnapshot[]>([]);
  const [mode, setMode] = useState<DataMode>("simulation");
  const [provider, setProvider] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [degraded, setDegraded] = useState(false);

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch("/api/live/odds");
        if (res.ok) {
          const json = await res.json() as {
            snapshots?: OddsSnapshot[];
            meta?: { mode?: DataMode; provider?: string; timestamp?: string };
          };
          if (json.snapshots?.length) setSnapshots(json.snapshots);
          if (json.meta?.mode) setMode(json.meta.mode);
          if (json.meta?.provider) setProvider(json.meta.provider);
          if (json.meta?.timestamp) {
            const d = new Date(json.meta.timestamp);
            setLastUpdated(
              `${d.getUTCHours().toString().padStart(2, "0")}:${d.getUTCMinutes().toString().padStart(2, "0")}`
            );
          }
          setDegraded(false);
        } else {
          setDegraded(true);
        }
      } catch {
        setDegraded(true);
      } finally {
        setLoading(false);
      }
    }
    void fetch_();
    const timer = setInterval(() => void fetch_(), 30_000);
    return () => clearInterval(timer);
  }, []);

  const modeCfg = MODE_CONFIG[mode];

  return (
    <section className="border-b border-zinc-900/80">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-2">
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
          Odds Movement
        </span>
        <div className="flex-1 h-px bg-zinc-900" />
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-zinc-700 text-[9px] font-mono">{lastUpdated}</span>
          )}
          {provider && (
            <span className="text-zinc-700 text-[9px] font-mono border border-zinc-800 px-1 rounded-sm">
              {provider}
            </span>
          )}
          <div className="flex items-center gap-1">
            <span className={`w-1 h-1 rounded-full ${degraded ? "bg-red-400" : modeCfg.dot} pulse-dot`} />
            <span className={`text-[9px] font-mono ${degraded ? "text-red-500" : modeCfg.text}`}>
              {degraded ? "DEGRADED" : modeCfg.label}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <div className="px-4 pb-3 space-y-px">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 bg-zinc-900/40 rounded-sm animate-pulse" />
          ))}
        </div>
      ) : degraded ? (
        <div className="px-4 pb-3">
          <p className="text-red-600 text-xs font-mono">Odds feed degraded — retrying…</p>
        </div>
      ) : snapshots.length === 0 ? (
        <p className="px-4 pb-3 text-zinc-600 text-xs">No odds data available.</p>
      ) : (
        <div className="px-4 pb-3">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_1fr_88px_68px_64px] gap-2 px-2 mb-1">
            {["Market", "Selection", "Open → Now", "Prob Δ", "Volatility"].map((h) => (
              <span key={h} className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest truncate">
                {h}
              </span>
            ))}
          </div>

          <div className="space-y-px">
            {snapshots.map((snap) => {
              const sportColor = SPORT_COLORS[snap.sport] ?? "text-zinc-400";
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
                  className="grid grid-cols-[1fr_1fr_88px_68px_64px] gap-2 items-center bg-zinc-950 border border-zinc-800/40 rounded-sm px-2 py-2 hover:border-zinc-700 transition-colors group"
                >
                  {/* Market */}
                  <div className="min-w-0">
                    <p className={`text-[9px] font-mono uppercase truncate ${sportColor}`}>{snap.sport}</p>
                    <div className="flex items-center gap-1 min-w-0">
                      <p className="text-zinc-400 text-[10px] truncate">{snap.market}</p>
                    </div>
                  </div>

                  {/* Selection + source */}
                  <div className="min-w-0">
                    <p className="text-zinc-300 text-[10px] font-mono truncate">{snap.selection}</p>
                    <p className="text-zinc-600 text-[9px] font-mono truncate">{snap.source}</p>
                  </div>

                  {/* Open → Now */}
                  <div className="flex items-center gap-1">
                    <span className="text-zinc-600 text-[10px] font-mono tabular-nums">
                      {snap.openingPrice.toFixed(2)}
                    </span>
                    <span className="text-zinc-700 text-[9px]">→</span>
                    <span className={`text-[10px] font-mono tabular-nums font-medium ${movColor}`}>
                      {arrow}{snap.currentPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Prob change + implied prob */}
                  <div>
                    <span className={`text-[10px] font-mono tabular-nums ${movColor}`}>
                      {probSign}{snap.probChange.toFixed(1)}pp
                    </span>
                    <p className="text-zinc-700 text-[9px] font-mono tabular-nums">
                      {snap.impliedProbability.toFixed(1)}%
                    </p>
                  </div>

                  {/* Volatility bar */}
                  <div className="flex items-center gap-1">
                    <div className="h-1 flex-1 bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-zinc-500 rounded-full"
                        style={{ width: `${Math.min(snap.volatility, 100)}%` }}
                      />
                    </div>
                    <span className="text-zinc-600 text-[9px] font-mono tabular-nums shrink-0">
                      {snap.volatility.toFixed(0)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-2 text-zinc-800 text-[9px] font-mono">
            Market intelligence only — Sports Market OS does not place bets or execute trades.
          </p>
        </div>
      )}
    </section>
  );
}
