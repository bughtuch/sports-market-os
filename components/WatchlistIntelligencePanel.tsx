"use client";

import { useState } from "react";

interface WatchlistIntelligenceItem {
  market:            string;
  sport:             string;
  volatilityChange:  string;
  volatilityDir:     "up" | "down" | "flat";
  liquidityShift:    string;
  liquidityDir:      "up" | "down" | "flat";
  queueHealth:       "good" | "warning" | "critical";
  catalystAlert:     string | null;
  aiRegime:          string;
  regimeChanged:     boolean;
}

const MOCK_INTELLIGENCE: WatchlistIntelligenceItem[] = [
  {
    market:           "Ascot 2.40",
    sport:            "Horse Racing",
    volatilityChange: "+2.8σ",
    volatilityDir:    "up",
    liquidityShift:   "−28%",
    liquidityDir:     "down",
    queueHealth:      "critical",
    catalystAlert:    "Sharp money detected — unmatched liability building on lay side",
    aiRegime:         "ALERT",
    regimeChanged:    true,
  },
  {
    market:           "Djokovic vs Alcaraz",
    sport:            "Tennis",
    volatilityChange: "+18.4%",
    volatilityDir:    "up",
    liquidityShift:   "+34%",
    liquidityDir:     "up",
    queueHealth:      "good",
    catalystAlert:    null,
    aiRegime:         "BULLISH",
    regimeChanged:    false,
  },
  {
    market:           "Chiefs vs Bills",
    sport:            "NFL",
    volatilityChange: "−4.1%",
    volatilityDir:    "down",
    liquidityShift:   "+8%",
    liquidityDir:     "up",
    queueHealth:      "warning",
    catalystAlert:    "Volatility compression — 3 consecutive sessions without resolution",
    aiRegime:         "COMPRESSION",
    regimeChanged:    true,
  },
  {
    market:           "Warriors vs Lakers",
    sport:            "NBA",
    volatilityChange: "+6.1%",
    volatilityDir:    "up",
    liquidityShift:   "−5%",
    liquidityDir:     "down",
    queueHealth:      "good",
    catalystAlert:    null,
    aiRegime:         "NEUTRAL",
    regimeChanged:    false,
  },
  {
    market:           "US Election 2024",
    sport:            "Prediction Markets",
    volatilityChange: "+89.2%",
    volatilityDir:    "up",
    liquidityShift:   "+89%",
    liquidityDir:     "up",
    queueHealth:      "good",
    catalystAlert:    "Price diverging +6.8pts from polling consensus",
    aiRegime:         "HIGH ACTIVITY",
    regimeChanged:    true,
  },
];

const QUEUE_COLOR = { good: "text-emerald-400", warning: "text-amber-400", critical: "text-red-400" };
const DIR_COLOR   = { up: "text-emerald-400", down: "text-red-400", flat: "text-zinc-500" };

function mostActiveMarket(): WatchlistIntelligenceItem {
  return MOCK_INTELLIGENCE.reduce((max, item) => {
    const score = (item.queueHealth === "critical" ? 3 : item.queueHealth === "warning" ? 2 : 1) +
                  (item.regimeChanged ? 2 : 0) + (item.catalystAlert ? 2 : 0);
    const maxScore = (max.queueHealth === "critical" ? 3 : max.queueHealth === "warning" ? 2 : 1) +
                     (max.regimeChanged ? 2 : 0) + (max.catalystAlert ? 2 : 0);
    return score > maxScore ? item : max;
  });
}

export default function WatchlistIntelligencePanel() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const topMarket = mostActiveMarket();

  return (
    <div className="space-y-6">
      {/* Most Active Watchlist Market */}
      <div className="bg-zinc-950 border border-amber-400/20 rounded-sm p-4">
        <p className="text-zinc-700 text-[8px] font-mono uppercase tracking-widest mb-2">
          Most Active Watchlist Market
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-white text-sm font-medium">{topMarket.market}</p>
            <p className="text-zinc-500 text-[10px]">{topMarket.sport}</p>
          </div>
          <div className="text-right">
            <p className={`text-lg font-mono font-bold ${DIR_COLOR[topMarket.volatilityDir]}`}>
              {topMarket.volatilityChange}
            </p>
            <p className="text-zinc-600 text-[9px] font-mono">volatility</p>
          </div>
          <div className="text-right">
            <p className={`text-[10px] font-mono font-semibold ${QUEUE_COLOR[topMarket.queueHealth]}`}>
              {topMarket.queueHealth.toUpperCase()}
            </p>
            <p className="text-zinc-600 text-[9px] font-mono">queue</p>
          </div>
        </div>
        {topMarket.catalystAlert && (
          <p className="text-amber-400/80 text-[10px] mt-2 leading-relaxed border-t border-amber-400/10 pt-2">
            ⚡ {topMarket.catalystAlert}
          </p>
        )}
      </div>

      {/* Intelligence Grid */}
      <div className="space-y-1.5">
        {MOCK_INTELLIGENCE.map(item => {
          const isExpanded = expanded === item.market;
          return (
            <div
              key={item.market}
              className="bg-zinc-950 border border-zinc-800/60 rounded-sm overflow-hidden"
            >
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-900/40 transition-colors"
                onClick={() => setExpanded(isExpanded ? null : item.market)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-[11px] font-medium truncate">{item.market}</span>
                    <span className="text-zinc-700 text-[9px] font-mono shrink-0">{item.sport}</span>
                    {item.regimeChanged && (
                      <span className="text-amber-400 text-[8px] font-mono shrink-0">REGIME ↻</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className={`text-[10px] font-mono ${DIR_COLOR[item.volatilityDir]}`}>
                      {item.volatilityChange}
                    </p>
                    <p className="text-zinc-700 text-[8px]">vol</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] font-mono ${DIR_COLOR[item.liquidityDir]}`}>
                      {item.liquidityShift}
                    </p>
                    <p className="text-zinc-700 text-[8px]">liq</p>
                  </div>
                  <span className={`text-[9px] font-mono w-16 text-right ${QUEUE_COLOR[item.queueHealth]}`}>
                    {item.queueHealth}
                  </span>
                  <span className="text-zinc-700 text-[9px]">{isExpanded ? "▲" : "▼"}</span>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-3 pt-0 border-t border-zinc-900/60 space-y-2">
                  <div className="flex items-center gap-4 pt-2">
                    <div>
                      <p className="text-zinc-600 text-[8px] font-mono uppercase tracking-wider">AI Regime</p>
                      <p className={`text-[11px] font-mono font-semibold ${
                        item.aiRegime === "ALERT" || item.aiRegime === "COMPRESSION"
                          ? "text-amber-400"
                          : item.aiRegime === "BULLISH" || item.aiRegime === "HIGH ACTIVITY"
                          ? "text-emerald-400"
                          : "text-zinc-400"
                      }`}>
                        {item.aiRegime}
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-600 text-[8px] font-mono uppercase tracking-wider">Queue Health</p>
                      <p className={`text-[11px] font-mono font-semibold ${QUEUE_COLOR[item.queueHealth]}`}>
                        {item.queueHealth.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-600 text-[8px] font-mono uppercase tracking-wider">Liquidity</p>
                      <p className={`text-[11px] font-mono font-semibold ${DIR_COLOR[item.liquidityDir]}`}>
                        {item.liquidityShift}
                      </p>
                    </div>
                  </div>
                  {item.catalystAlert && (
                    <p className="text-amber-400/80 text-[10px] leading-relaxed">
                      ⚡ {item.catalystAlert}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-zinc-800 text-[9px] font-mono">
        Market intelligence only · Not financial advice · Watchlist data is indicative
      </p>
    </div>
  );
}
