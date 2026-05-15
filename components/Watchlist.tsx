"use client";

import { useState, useEffect, useCallback } from "react";

interface WatchItem {
  name: string;
  sport: string;
  volatility: number;
  accentColor: string;
}

const baseItems: WatchItem[] = [
  { name: "Ascot 14:30",          sport: "HR",   volatility: 78, accentColor: "#f59e0b" },
  { name: "Djokovic vs Sinner",   sport: "TEN",  volatility: 61, accentColor: "#10b981" },
  { name: "Lakers vs Celtics",    sport: "NBA",  volatility: 55, accentColor: "#3b82f6" },
  { name: "UFC Main Event",       sport: "UFC",  volatility: 84, accentColor: "#f97316" },
  { name: "NFL Spread Watch",     sport: "NFL",  volatility: 42, accentColor: "#ef4444" },
  { name: "Prediction Contract",  sport: "PRED", volatility: 91, accentColor: "#a855f7" },
];

export default function Watchlist() {
  const [items, setItems] = useState<WatchItem[]>(baseItems);

  const nudge = useCallback(() => {
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        volatility: Math.min(
          99,
          Math.max(10, item.volatility + Math.round((Math.random() - 0.5) * 4))
        ),
      }))
    );
  }, []);

  useEffect(() => {
    const id = setInterval(nudge, 3500);
    return () => clearInterval(id);
  }, [nudge]);

  return (
    <div className="border-t border-zinc-800/60 bg-zinc-950">
      {/* Header */}
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot" />
          <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">Active Watchlist</span>
        </div>
        <span className="text-zinc-700 text-[9px] font-mono">{items.length}</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-zinc-900/60">
        {items.map((item) => (
          <div
            key={item.name}
            className="px-4 py-2 flex items-center gap-2 hover:bg-zinc-900/40 transition-colors cursor-pointer"
          >
            {/* Sport code */}
            <span className="text-[8px] font-mono text-zinc-600 uppercase w-8 shrink-0">
              {item.sport}
            </span>

            {/* Market name */}
            <span className="text-zinc-300 text-[10px] flex-1 min-w-0 truncate">
              {item.name}
            </span>

            {/* Confidence score */}
            <span className="text-zinc-500 text-[10px] font-mono tabular-nums shrink-0">
              {item.volatility}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
