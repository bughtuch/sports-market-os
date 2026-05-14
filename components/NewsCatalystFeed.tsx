"use client";

import { useState, useEffect } from "react";
import type { NewsItem, CatalystSeverity, SportType, DataMode } from "@/lib/providers/types";

const SEVERITY_CONFIG: Record<CatalystSeverity, { text: string; bg: string; border: string; label: string }> = {
  low:      { text: "text-zinc-400",   bg: "bg-zinc-400/10",   border: "border-zinc-400/20",   label: "LOW" },
  medium:   { text: "text-amber-400",  bg: "bg-amber-400/10",  border: "border-amber-400/20",  label: "MED" },
  high:     { text: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20", label: "HIGH" },
  critical: { text: "text-red-400",    bg: "bg-red-400/10",    border: "border-red-400/20",    label: "CRIT" },
};

const SPORT_COLORS: Record<SportType, string> = {
  "Horse Racing": "text-amber-400",
  Tennis:         "text-emerald-400",
  NBA:            "text-blue-400",
  NFL:            "text-red-400",
  UFC:            "text-orange-400",
  Football:       "text-zinc-300",
  "Prediction Markets": "text-purple-400",
};

const MODE_CONFIG: Record<DataMode, { label: string; dot: string; text: string }> = {
  simulation: { label: "SIMULATED", dot: "bg-amber-400",  text: "text-amber-600" },
  hybrid:     { label: "HYBRID",    dot: "bg-blue-400",   text: "text-blue-500" },
  live:       { label: "LIVE",      dot: "bg-emerald-400", text: "text-emerald-500" },
};

export default function NewsCatalystFeed() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [mode, setMode] = useState<DataMode>("simulation");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch("/api/live/news");
        if (res.ok) {
          const json = await res.json() as { items?: NewsItem[]; meta?: { mode?: DataMode } };
          if (json.items?.length) setItems(json.items);
          if (json.meta?.mode) setMode(json.meta.mode);
        }
      } catch {
        // noop — show empty state
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
      <div className="px-4 py-3 flex items-center gap-2">
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
          News Catalysts
        </span>
        <div className="flex-1 h-px bg-zinc-900" />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className={`w-1 h-1 rounded-full ${modeCfg.dot} pulse-dot`} />
            <span className={`${modeCfg.text} text-[9px] font-mono`}>{modeCfg.label}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="px-4 pb-3 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-zinc-900/40 rounded-sm animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="px-4 pb-3 text-zinc-600 text-xs">No catalysts detected.</p>
      ) : (
        <div className="px-4 pb-3 space-y-2">
          {items.map((item) => {
            const sev = SEVERITY_CONFIG[item.severity];
            const sportColor = SPORT_COLORS[item.sport] ?? "text-zinc-400";
            return (
              <div
                key={item.id}
                className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-3 hover:border-zinc-700 transition-colors"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[9px] font-mono font-semibold uppercase tracking-wider ${sportColor}`}>
                      {item.sport}
                    </span>
                    <span className="text-zinc-700 text-[9px] font-mono">{item.catalystType}</span>
                    <span className="text-zinc-700 text-[9px] font-mono border border-zinc-800 px-1 rounded-sm">{item.source}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-sm border ${sev.text} ${sev.bg} ${sev.border}`}
                    >
                      {sev.label}
                    </span>
                    <span className="text-zinc-600 text-[9px] font-mono">{item.timestamp}</span>
                  </div>
                </div>

                {/* Headline */}
                <p className="text-white text-xs font-medium leading-snug mb-1">{item.headline}</p>

                {/* Impact */}
                <p className="text-zinc-500 text-[10px] leading-relaxed mb-1.5">{item.impact}</p>

                {/* Footer row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-zinc-700 text-[9px] font-mono">→</span>
                    <span className="text-zinc-500 text-[9px] font-mono">{item.linkedMarket}</span>
                  </div>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-600 hover:text-zinc-400 text-[9px] font-mono transition-colors"
                    >
                      Source →
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
