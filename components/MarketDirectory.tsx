"use client";

import { useState } from "react";
import type { Market } from "@/lib/markets/types";
import MarketCard from "@/components/MarketCard";

const SPORTS = ["All", "Horse Racing", "Tennis", "NBA", "NFL", "UFC", "Football", "Prediction Markets"] as const;
type SportFilter = (typeof SPORTS)[number];

const VOL_FILTERS = [
  { label: "All Vol", min: 0,  max: 100 },
  { label: "Low",     min: 0,  max: 40  },
  { label: "Med",     min: 40, max: 70  },
  { label: "High",    min: 70, max: 100 },
] as const;

const CONF_FILTERS = [
  { label: "All Conf", min: 0  },
  { label: "60%+",     min: 60 },
  { label: "75%+",     min: 75 },
  { label: "90%+",     min: 90 },
] as const;

export default function MarketDirectory({ markets }: { markets: Market[] }) {
  const [sport, setSport] = useState<SportFilter>("All");
  const [volIdx, setVolIdx] = useState(0);
  const [confIdx, setConfIdx] = useState(0);

  const vol = VOL_FILTERS[volIdx];
  const conf = CONF_FILTERS[confIdx];

  const filtered = markets.filter((m) => {
    if (sport !== "All" && m.sport !== sport) return false;
    if (m.volatility < vol.min || m.volatility > vol.max) return false;
    if (m.confidence < conf.min) return false;
    return true;
  });

  return (
    <div>
      {/* Filter bar */}
      <div className="px-6 py-3 border-b border-zinc-900/80 bg-zinc-950 flex flex-wrap gap-4 items-center">
        {/* Sport */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {SPORTS.map((s) => (
            <button
              key={s}
              onClick={() => setSport(s)}
              className={`text-[9px] font-mono uppercase tracking-wider px-2 py-1 rounded-sm border transition-colors ${
                sport === s
                  ? "text-white border-zinc-600 bg-zinc-800/40"
                  : "text-zinc-600 border-zinc-800/60 hover:text-zinc-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-zinc-800/60 hidden sm:block" />

        {/* Volatility */}
        <div className="flex items-center gap-1.5">
          {VOL_FILTERS.map((v, i) => (
            <button
              key={v.label}
              onClick={() => setVolIdx(i)}
              className={`text-[9px] font-mono uppercase tracking-wider px-2 py-1 rounded-sm border transition-colors ${
                volIdx === i
                  ? "text-amber-400 border-amber-400/30 bg-amber-400/10"
                  : "text-zinc-600 border-zinc-800/60 hover:text-zinc-400"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-zinc-800/60 hidden sm:block" />

        {/* Confidence */}
        <div className="flex items-center gap-1.5">
          {CONF_FILTERS.map((c, i) => (
            <button
              key={c.label}
              onClick={() => setConfIdx(i)}
              className={`text-[9px] font-mono uppercase tracking-wider px-2 py-1 rounded-sm border transition-colors ${
                confIdx === i
                  ? "text-blue-400 border-blue-400/30 bg-blue-400/10"
                  : "text-zinc-600 border-zinc-800/60 hover:text-zinc-400"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <span className="text-zinc-700 text-[9px] font-mono ml-auto">
          {filtered.length} markets
        </span>
      </div>

      {/* Market grid */}
      <div className="px-6 py-6">
        <div className="max-w-5xl mx-auto">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.map((m) => (
                <MarketCard key={m.slug} market={m} />
              ))}
            </div>
          ) : (
            <p className="text-zinc-600 text-xs py-8 text-center">
              No markets match the selected filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
