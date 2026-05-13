"use client";

import { useState, useEffect } from "react";
import type { AIBrief } from "@/lib/ai/types";

export default function AIBriefPanel() {
  const [brief, setBrief] = useState<AIBrief | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch("/api/ai/brief");
        if (res.ok) {
          const json = await res.json() as { brief?: AIBrief };
          if (json.brief) setBrief(json.brief);
        }
      } catch { /* noop */ }
      finally { setLoading(false); }
    }
    void fetch_();
    const timer = setInterval(() => void fetch_(), 20_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="border-b border-zinc-900/80">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-4 py-3 flex items-center gap-2 group"
      >
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
          AI Intelligence Brief
        </span>
        <div className="flex-1 h-px bg-zinc-900" />
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-blue-400 pulse-dot" />
          <span className="text-blue-700 text-[9px] font-mono">BRIEF</span>
          <span className="text-zinc-700 text-[9px] font-mono group-hover:text-zinc-500 transition-colors ml-1">
            {expanded ? "▲" : "▼"}
          </span>
        </div>
      </button>

      {/* Headline always visible */}
      {loading ? (
        <div className="px-4 pb-3">
          <div className="h-4 bg-zinc-900/60 rounded-sm animate-pulse w-3/4" />
        </div>
      ) : brief ? (
        <div className="px-4 pb-3">
          <p className="text-zinc-200 text-xs font-medium leading-snug mb-1">{brief.headline}</p>

          {expanded && (
            <div className="mt-3 space-y-3">
              {/* Regime summary */}
              <div>
                <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest mb-1">Regime</p>
                <p className="text-zinc-400 text-[10px] leading-relaxed">{brief.regimeSummary}</p>
              </div>

              {/* Key catalysts */}
              <div>
                <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest mb-1">Key Catalysts</p>
                <div className="space-y-0.5">
                  {brief.keyCatalysts.map((c) => (
                    <div key={c} className="flex items-start gap-1.5">
                      <span className="text-zinc-700 text-[9px] font-mono mt-0.5">›</span>
                      <p className="text-zinc-400 text-[10px] leading-relaxed">{c}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Liquidity */}
              <div>
                <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest mb-1">Liquidity Conditions</p>
                <p className="text-zinc-400 text-[10px] leading-relaxed">{brief.liquidityConditions}</p>
              </div>

              {/* Volatility */}
              <div>
                <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest mb-1">Volatility Status</p>
                <p className="text-zinc-400 text-[10px] leading-relaxed">{brief.volatilityStatus}</p>
              </div>

              {/* Outlook */}
              <div>
                <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest mb-1">AI Outlook</p>
                <p className="text-zinc-400 text-[10px] leading-relaxed">{brief.outlook}</p>
              </div>

              {/* Footer */}
              <p className="text-zinc-800 text-[9px] font-mono border-t border-zinc-900/60 pt-2">
                {brief.generatedBy}
              </p>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
