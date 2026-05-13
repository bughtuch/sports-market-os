"use client";

import { useState, useEffect } from "react";

interface AIModule {
  name: string;
  status: string;
  commentary: string[];
  indicator: "active" | "processing" | "idle";
}

const aiModules: AIModule[] = [
  {
    name: "Market Narrator",
    status: "LIVE",
    indicator: "active",
    commentary: [
      "Late liquidity is appearing without matching public movement. Market structure suggests hidden pressure rather than broad consensus.",
      "Institutional flow entering quietly on the lay side. No corresponding retail volume. Pattern consistent with pre-event positioning.",
      "Price drift without volume confirmation. The market is being moved by intent, not reaction.",
    ],
  },
  {
    name: "Liquidity Interpreter",
    status: "SCANNING",
    indicator: "processing",
    commentary: [
      "Queue depth at Ascot deteriorating. Exchange imbalance forming on the 2.40 — institutional positioning detected on the lay side.",
      "Liquidity absorption remains unusually strong despite visible queue deterioration. This is not panic. This is informed.",
      "Matched volume exceeding expectation model by 31%. Divergence from public sentiment index now statistically significant.",
    ],
  },
  {
    name: "Volatility AI",
    status: "ALERT",
    indicator: "active",
    commentary: [
      "Compression event detected in the Djokovic market. Implied volatility contracting ahead of a likely directional move.",
      "Three consecutive compression cycles without a catalyst. The coil is tightening. A volatility expansion event is probable.",
      "IV surface flattening across tennis markets. This behaviour preceded four of the last six major in-play moves.",
    ],
  },
  {
    name: "Behavioural Intelligence",
    status: "LIVE",
    indicator: "active",
    commentary: [
      "Sharp money entering NBA spread markets. Pattern matches three prior high-confidence line movements from the last 90 days.",
      "Public sentiment diverging from sharp consensus by 18 points. Historical precedent: sharp side covered in 74% of analogous situations.",
      "Unusual inactivity on the public side despite significant price movement. Smart money operating without noise cover.",
    ],
  },
  {
    name: "Opportunity Engine",
    status: "READY",
    indicator: "idle",
    commentary: [
      "UFC underdog liquidity thinning — value window forming. Exchange price diverging from sharp consensus model by 4.2 points.",
      "Cross-market inefficiency detected between Betfair and Smarkets. Arbitrage window narrow but structurally present.",
      "AI model confidence threshold exceeded. Conditions for a high-quality signal entry now met in two concurrent markets.",
    ],
  },
];

const indicatorColors = {
  active: "bg-emerald-400 pulse-dot",
  processing: "bg-amber-400 pulse-dot",
  idle: "bg-zinc-600",
};

const statusColors = {
  active: "text-emerald-400",
  processing: "text-amber-400",
  idle: "text-zinc-500",
};

export default function AIPanel() {
  const [activeModule, setActiveModule] = useState(0);
  const [commentaryIdx, setCommentaryIdx] = useState<number[]>(
    aiModules.map(() => 0)
  );

  useEffect(() => {
    const id = setInterval(() => {
      setActiveModule((prev) => {
        const next = (prev + 1) % aiModules.length;
        setCommentaryIdx((ci) => {
          const updated = [...ci];
          updated[next] = (updated[next] + 1) % aiModules[next].commentary.length;
          return updated;
        });
        return next;
      });
    }, 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <aside className="flex-1 min-h-0 flex flex-col overflow-hidden bg-zinc-950">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800/60 shrink-0">
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
            AI Market Desk
          </span>
        </div>
        <p className="text-zinc-600 text-[10px] font-mono">
          5 modules active — rotating analysis
        </p>
      </div>

      {/* Modules */}
      <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/40">
        {aiModules.map((module, idx) => {
          const isActive = idx === activeModule;
          const text = module.commentary[commentaryIdx[idx]];

          return (
            <div
              key={module.name}
              className={`px-4 py-3 transition-colors duration-300 ${
                isActive ? "bg-zinc-900/60" : "hover:bg-zinc-900/30"
              }`}
            >
              {/* Module header */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-semibold transition-colors ${
                    isActive ? "text-white" : "text-zinc-400"
                  }`}
                >
                  {module.name}
                </span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? indicatorColors[module.indicator] : "bg-zinc-700"
                    }`}
                  />
                  <span
                    className={`text-[9px] font-mono uppercase tracking-wider ${
                      isActive ? statusColors[module.indicator] : "text-zinc-700"
                    }`}
                  >
                    {module.status}
                  </span>
                </div>
              </div>

              {/* Commentary */}
              <p
                className={`text-[11px] leading-relaxed transition-colors ${
                  isActive ? "text-zinc-300" : "text-zinc-600"
                }`}
              >
                {text}
                {isActive && (
                  <span
                    className="inline-block w-0.5 h-3 bg-zinc-300 ml-0.5 align-middle"
                    style={{ animation: "pulse-dot 1s step-end infinite" }}
                  />
                )}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-zinc-800/60 bg-black/40 shrink-0">
        <p className="text-zinc-700 text-[9px] font-mono tracking-wider">
          AI MARKET DESK — SPORTS MARKET OS
        </p>
      </div>
    </aside>
  );
}
