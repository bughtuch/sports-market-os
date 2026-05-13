"use client";

import { useState, useEffect } from "react";
import type { OddsSnapshot, SportType } from "@/lib/providers/types";

const SPORT_COLORS: Record<SportType, string> = {
  "Horse Racing": "text-amber-400",
  Tennis:         "text-emerald-400",
  NBA:            "text-blue-400",
  NFL:            "text-red-400",
  UFC:            "text-orange-400",
  Football:       "text-zinc-300",
  "Prediction Markets": "text-purple-400",
};

export default function OddsMovementFeed() {
  const [snapshots, setSnapshots] = useState<OddsSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch("/api/live/odds");
        if (res.ok) {
          const json = await res.json() as { snapshots?: OddsSnapshot[] };
          if (json.snapshots?.length) setSnapshots(json.snapshots);
        }
      } catch {
        // noop
      } finally {
        setLoading(false);
      }
    }
    void fetch_();
    const timer = setInterval(() => void fetch_(), 30_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="border-b border-zinc-900/80">
      <div className="px-4 py-3 flex items-center gap-2">
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
          Odds Movement
        </span>
        <div className="flex-1 h-px bg-zinc-900" />
        <span className="text-zinc-700 text-[9px] font-mono">Intelligence only · No bets placed</span>
      </div>

      {loading ? (
        <div className="px-4 pb-3 space-y-px">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 bg-zinc-900/40 rounded-sm animate-pulse" />
          ))}
        </div>
      ) : snapshots.length === 0 ? (
        <p className="px-4 pb-3 text-zinc-600 text-xs">No odds data available.</p>
      ) : (
        <div className="px-4 pb-3">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_1fr_80px_72px_64px] gap-2 px-2 mb-1">
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
                  className="grid grid-cols-[1fr_1fr_80px_72px_64px] gap-2 items-center bg-zinc-950 border border-zinc-800/40 rounded-sm px-2 py-2 hover:border-zinc-700 transition-colors"
                >
                  {/* Market */}
                  <div className="min-w-0">
                    <p className={`text-[9px] font-mono uppercase truncate ${sportColor}`}>{snap.sport}</p>
                    <p className="text-zinc-400 text-[10px] truncate">{snap.market}</p>
                  </div>

                  {/* Selection */}
                  <p className="text-zinc-300 text-[10px] font-mono truncate">{snap.selection}</p>

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

                  {/* Prob change */}
                  <span className={`text-[10px] font-mono tabular-nums ${movColor}`}>
                    {probSign}{snap.probChange.toFixed(1)}pp
                  </span>

                  {/* Volatility */}
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
