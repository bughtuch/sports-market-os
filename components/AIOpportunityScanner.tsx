"use client";

import { useState, useEffect } from "react";
import type { AIOpportunity, AISeverity, OpportunityCategory } from "@/lib/ai/types";

const SEVERITY_CONFIG: Record<AISeverity, { text: string; bg: string; border: string }> = {
  low:      { text: "text-zinc-400",   bg: "bg-zinc-400/10",   border: "border-zinc-400/20" },
  medium:   { text: "text-amber-400",  bg: "bg-amber-400/10",  border: "border-amber-400/20" },
  high:     { text: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" },
  critical: { text: "text-red-400",    bg: "bg-red-400/10",    border: "border-red-400/20" },
};

const CATEGORY_LABELS: Record<OpportunityCategory, string> = {
  divergence:   "Divergence",
  liquidity:    "Liquidity",
  volatility:   "Volatility",
  cross_market: "Cross-Market",
  structural:   "Structural",
};

export default function AIOpportunityScanner() {
  const [opportunities, setOpportunities] = useState<AIOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch("/api/ai/opportunities");
        if (res.ok) {
          const json = await res.json() as { opportunities?: AIOpportunity[] };
          if (json.opportunities?.length) setOpportunities(json.opportunities);
        }
      } catch { /* noop */ }
      finally { setLoading(false); }
    }
    void fetch_();
    const timer = setInterval(() => void fetch_(), 15_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="border-b border-zinc-900/80">
      <div className="px-4 py-3 flex items-center gap-2">
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
          Opportunity Scanner
        </span>
        <div className="flex-1 h-px bg-zinc-900" />
        <span className="text-zinc-700 text-[9px] font-mono">Intelligence only · No bets placed</span>
      </div>

      {loading ? (
        <div className="px-4 pb-3 space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-zinc-900/40 rounded-sm animate-pulse" />)}
        </div>
      ) : opportunities.length === 0 ? (
        <p className="px-4 pb-3 text-zinc-600 text-xs">No opportunities detected.</p>
      ) : (
        <div className="px-4 pb-3 space-y-1.5">
          {opportunities.map((opp) => {
            const sev = SEVERITY_CONFIG[opp.severity];
            return (
              <div
                key={opp.id}
                className="bg-zinc-950 border border-zinc-800/40 rounded-sm p-2.5 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-zinc-300 text-[11px] font-medium">{opp.title}</span>
                    <span className="text-zinc-700 text-[8px] font-mono border border-zinc-800 px-1 rounded-sm">
                      {CATEGORY_LABELS[opp.category]}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-sm border ${sev.text} ${sev.bg} ${sev.border}`}
                    >
                      {opp.severity}
                    </span>
                    <span className="text-zinc-600 text-[9px] font-mono tabular-nums">{opp.confidence}%</span>
                  </div>
                </div>
                <p className="text-zinc-500 text-[10px] leading-relaxed mb-1.5">{opp.explanation}</p>
                <div className="flex flex-wrap gap-1">
                  {opp.affectedMarkets.map((m) => (
                    <span key={m} className="text-zinc-700 text-[8px] font-mono">→ {m}</span>
                  ))}
                </div>
              </div>
            );
          })}
          <p className="mt-1 text-zinc-800 text-[9px] font-mono">
            Market intelligence only — Sports Market OS does not place bets or execute trades.
          </p>
        </div>
      )}
    </section>
  );
}
