"use client";

import { useState, useEffect, useCallback } from "react";
import Sparkline from "@/components/Sparkline";

interface WatchItem {
  name: string;
  sport: string;
  movement: number;
  volatility: number;
  sparkData: number[];
  accentColor: string;
}

const baseItems: WatchItem[] = [
  {
    name: "Ascot 14:30",
    sport: "HR",
    movement: 3.4,
    volatility: 78,
    sparkData: [30, 32, 35, 31, 38, 36, 42, 39, 46, 43, 50, 47],
    accentColor: "#f59e0b",
  },
  {
    name: "Djokovic vs Sinner",
    sport: "TEN",
    movement: -1.8,
    volatility: 61,
    sparkData: [50, 48, 52, 47, 51, 46, 49, 44, 48, 43, 46, 41],
    accentColor: "#10b981",
  },
  {
    name: "Lakers vs Celtics",
    sport: "NBA",
    movement: 2.1,
    volatility: 55,
    sparkData: [40, 42, 38, 44, 41, 46, 43, 48, 45, 50, 47, 52],
    accentColor: "#3b82f6",
  },
  {
    name: "UFC Main Event",
    sport: "UFC",
    movement: 5.7,
    volatility: 84,
    sparkData: [20, 24, 22, 28, 25, 32, 29, 36, 33, 40, 37, 44],
    accentColor: "#f97316",
  },
  {
    name: "NFL Spread Watch",
    sport: "NFL",
    movement: -0.6,
    volatility: 42,
    sparkData: [60, 59, 61, 58, 62, 57, 60, 56, 59, 55, 58, 54],
    accentColor: "#ef4444",
  },
  {
    name: "Prediction Contract",
    sport: "PRED",
    movement: 8.2,
    volatility: 91,
    sparkData: [15, 18, 22, 20, 26, 24, 30, 28, 35, 32, 39, 36],
    accentColor: "#a855f7",
  },
];

function fmt(n: number) {
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}

export default function Watchlist() {
  const [items, setItems] = useState<WatchItem[]>(baseItems);

  const nudge = useCallback(() => {
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        movement: parseFloat(
          (item.movement + (Math.random() - 0.5) * 0.4).toFixed(1)
        ),
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
        <span className="text-zinc-700 text-[9px] font-mono">{items.length} MARKETS</span>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="px-4 py-6 text-center">
          <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest mb-1">
            No markets tracked
          </p>
          <p className="text-zinc-800 text-[8px] font-mono leading-relaxed">
            Add markets from the signal feed to begin tracking
          </p>
        </div>
      )}

      {/* Rows */}
      <div className="divide-y divide-zinc-800/30">
        {items.map((item) => {
          const isUp = item.movement >= 0;
          const movColor = isUp ? "text-emerald-400" : "text-red-400";
          return (
            <div
              key={item.name}
              className="px-4 py-2 flex items-center gap-2 hover:bg-zinc-900/40 transition-colors cursor-pointer"
            >
              {/* Sport badge */}
              <span
                className="text-[8px] font-mono font-semibold w-8 shrink-0"
                style={{ color: item.accentColor }}
              >
                {item.sport}
              </span>

              {/* Name */}
              <span className="text-zinc-300 text-[10px] font-mono flex-1 min-w-0 truncate">
                {item.name}
              </span>

              {/* Sparkline */}
              <Sparkline
                data={item.sparkData}
                width={36}
                height={14}
                colorOverride={item.accentColor}
                className="shrink-0"
              />

              {/* Volatility */}
              <span className="text-zinc-600 text-[9px] font-mono tabular-nums w-6 text-right shrink-0">
                {item.volatility}
              </span>

              {/* Movement */}
              <span className={`text-[10px] font-mono tabular-nums w-12 text-right shrink-0 ${movColor}`}>
                {fmt(item.movement)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
