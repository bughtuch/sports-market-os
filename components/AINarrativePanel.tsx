"use client";

import { useState, useEffect } from "react";
import type { AIMarketNarrative, AISeverity } from "@/lib/ai/types";

const SEVERITY_CONFIG: Record<AISeverity, { text: string; bg: string; border: string }> = {
  low:      { text: "text-zinc-400",   bg: "bg-zinc-400/10",   border: "border-zinc-400/20" },
  medium:   { text: "text-amber-400",  bg: "bg-amber-400/10",  border: "border-amber-400/20" },
  high:     { text: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" },
  critical: { text: "text-red-400",    bg: "bg-red-400/10",    border: "border-red-400/20" },
};

export default function AINarrativePanel() {
  const [data, setData] = useState<AIMarketNarrative | null>(null);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch("/api/ai/narrative");
        if (res.ok) {
          const json = await res.json() as { narrative?: AIMarketNarrative };
          if (json.narrative) {
            setFade(false);
            setTimeout(() => {
              setData(json.narrative!);
              setFade(true);
            }, 150);
          }
        }
      } catch { /* noop */ }
    }
    void fetch_();
    const timer = setInterval(() => void fetch_(), 15_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="border-b border-zinc-900/80">
      <div className="px-4 py-3 flex items-center gap-2">
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
          AI Market Narrator
        </span>
        <div className="flex-1 h-px bg-zinc-900" />
        <div className="flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-blue-400 pulse-dot" />
          <span className="text-blue-600 text-[9px] font-mono">COGNITION</span>
        </div>
      </div>

      {!data ? (
        <div className="px-4 pb-3 space-y-2">
          <div className="h-3 bg-zinc-900/60 rounded-sm animate-pulse w-32" />
          <div className="h-12 bg-zinc-900/40 rounded-sm animate-pulse" />
        </div>
      ) : (
        <div
          className="px-4 pb-3 transition-opacity duration-150"
          style={{ opacity: fade ? 1 : 0 }}
        >
          {/* Tags row */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[9px] font-mono text-zinc-500 border border-zinc-800 px-1.5 py-0.5 rounded-sm">
              {data.regimeTag}
            </span>
            {(() => {
              const sev = SEVERITY_CONFIG[data.severity];
              return (
                <span
                  className={`text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-sm border ${sev.text} ${sev.bg} ${sev.border}`}
                >
                  {data.severity}
                </span>
              );
            })()}
            <span className="text-zinc-700 text-[9px] font-mono ml-auto">
              {data.confidence}% confidence
            </span>
          </div>

          {/* Confidence bar */}
          <div className="h-0.5 bg-zinc-900 rounded-full overflow-hidden mb-2.5">
            <div
              className="h-full bg-blue-500/60 rounded-full transition-all duration-1000"
              style={{ width: `${data.confidence}%` }}
            />
          </div>

          {/* Narrative text */}
          <p className="text-zinc-300 text-[11px] leading-relaxed font-mono mb-2.5">
            {data.narrative}
          </p>

          {/* Affected markets */}
          <div className="flex flex-wrap gap-1.5">
            {data.affectedMarkets.map((m) => (
              <span key={m} className="text-zinc-600 text-[9px] font-mono border border-zinc-900 px-1 py-0.5 rounded-sm">
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
