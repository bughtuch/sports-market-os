"use client";

import { useState, useEffect } from "react";
import type { MarketHeatScore, EscalationLevel, VolatilityState } from "@/lib/realtime/feedTypes";
import { getAllMarkets } from "@/lib/markets/data";
import type { Market } from "@/lib/markets/types";

// ─── Heat computation ─────────────────────────────────────────────────────────

const SEV_SCORE: Record<string, number> = {
  low: 20, medium: 50, high: 75, critical: 100,
};

function computeHeatScore(market: Market, nowMs: number): number {
  const phase = nowMs / 18_000 + market.volatility / 20;
  const wave = Math.sin(phase) * 5;
  const sev = SEV_SCORE[market.aiSeverity] ?? 50;
  return Math.round(
    Math.min(100, Math.max(0,
      market.volatility * 0.35 +
      (100 - market.liquidity) * 0.25 +
      market.confidence * 0.20 +
      sev * 0.20 +
      wave,
    )),
  );
}

function heatEscalation(score: number): EscalationLevel {
  if (score >= 85) return "critical";
  if (score >= 70) return "high";
  if (score >= 50) return "medium";
  return "low";
}

function volatilityState(market: Market, nowMs: number): VolatilityState {
  const wave = Math.sin(nowMs / 12_000 + market.volatility / 15);
  if (market.volatility >= 75) return wave > 0 ? "spiking" : "cooling";
  if (market.volatility >= 50) return wave > 0 ? "building" : "stable";
  return "stable";
}

function buildHeatScores(nowMs: number): MarketHeatScore[] {
  return getAllMarkets()
    .map((m): MarketHeatScore => {
      const heatScore = computeHeatScore(m, nowMs);
      return {
        slug: m.slug,
        title: m.title,
        sport: m.sport,
        exchange: m.exchange,
        heatScore,
        escalationLevel: heatEscalation(heatScore),
        volatilityState: volatilityState(m, nowMs),
        aiConviction: m.confidence,
        divergence: Math.round(
          30 + Math.sin(nowMs / 22_000 + m.volatility / 12) * 25,
        ),
      };
    })
    .sort((a, b) => b.heatScore - a.heatScore);
}

// ─── Visual config ────────────────────────────────────────────────────────────

const ESC_CONFIG: Record<EscalationLevel, { label: string; text: string; bg: string; border: string; bar: string }> = {
  critical: { label: "CRIT", text: "text-red-400",    bg: "bg-red-400/10",    border: "border-red-400/20",    bar: "bg-red-400/60"    },
  high:     { label: "HIGH", text: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20", bar: "bg-orange-400/60" },
  medium:   { label: "MED",  text: "text-amber-400",  bg: "bg-amber-400/10",  border: "border-amber-400/20",  bar: "bg-amber-500/40"  },
  low:      { label: "LOW",  text: "text-zinc-500",   bg: "bg-zinc-800/30",   border: "border-zinc-700/20",   bar: "bg-zinc-600/40"   },
};

const VOL_STATE_LABEL: Record<VolatilityState, string> = {
  spiking:  "SPKG",
  cooling:  "COOL",
  building: "BLDG",
  stable:   "STBL",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function MarketHeatPanel() {
  const [scores, setScores] = useState<MarketHeatScore[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Initial
    setScores(buildHeatScores(Date.now()));
    // Update every 12 s
    const id = setInterval(() => setScores(buildHeatScores(Date.now())), 12_000);
    return () => clearInterval(id);
  }, []);

  const shown = expanded ? scores : scores.slice(0, 4);

  return (
    <section className="border-b border-zinc-900/80">
      {/* Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-4 py-3 flex items-center gap-2 group"
      >
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
          Market Heat
        </span>
        <div className="flex-1 h-px bg-zinc-900" />
        {scores[0] && (
          <span
            className={`text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-sm border mr-1
              ${ESC_CONFIG[scores[0].escalationLevel].text}
              ${ESC_CONFIG[scores[0].escalationLevel].bg}
              ${ESC_CONFIG[scores[0].escalationLevel].border}`}
          >
            {scores[0].escalationLevel === "critical" ? "CRITICAL HEAT" : `PEAK ${ESC_CONFIG[scores[0].escalationLevel].label}`}
          </span>
        )}
        <span className="text-zinc-700 text-[9px] font-mono group-hover:text-zinc-500 transition-colors">
          {expanded ? "▲" : "▼"}
        </span>
      </button>

      {/* Heat rows */}
      <div className="px-4 pb-3 space-y-px">
        {shown.map((s) => {
          const cfg = ESC_CONFIG[s.escalationLevel];
          return (
            <div
              key={s.slug}
              className="flex items-center gap-3 py-1.5 border-b border-zinc-900/40 last:border-0"
            >
              {/* Escalation badge */}
              <span
                className={`text-[8px] font-mono w-8 shrink-0 ${cfg.text}`}
              >
                {cfg.label}
              </span>

              {/* Market name */}
              <div className="min-w-0 flex-1">
                <p className="text-zinc-300 text-[10px] truncate">{s.title}</p>
                <p className="text-zinc-700 text-[8px] font-mono">{s.sport}</p>
              </div>

              {/* Heat bar */}
              <div className="w-16 h-1 bg-zinc-900 rounded-full overflow-hidden shrink-0">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${cfg.bar}`}
                  style={{ width: `${s.heatScore}%` }}
                />
              </div>

              {/* Score */}
              <span className={`text-[10px] font-mono tabular-nums w-6 text-right shrink-0 ${cfg.text}`}>
                {s.heatScore}
              </span>

              {/* Volatility state */}
              <span className="text-zinc-700 text-[8px] font-mono w-8 shrink-0">
                {VOL_STATE_LABEL[s.volatilityState]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Toggle row count */}
      {scores.length > 4 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full pb-2 text-zinc-700 text-[8px] font-mono hover:text-zinc-500 transition-colors"
        >
          {expanded ? `▲ show less` : `▼ show all ${scores.length} markets`}
        </button>
      )}
    </section>
  );
}
