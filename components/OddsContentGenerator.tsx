"use client";

import { useState, useEffect, useCallback } from "react";
import type { OddsSnapshot, DataMode } from "@/lib/providers/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type ContentStyle = "x_post" | "shorts_hook" | "telegram";

// ─── Content generators ───────────────────────────────────────────────────────

function generateXPost(snap: OddsSnapshot): string {
  const arrow = snap.direction === "up" ? "↑" : snap.direction === "down" ? "↓" : "→";
  const probSign = snap.probChange >= 0 ? "+" : "";

  return `📊 PRICING INTELLIGENCE — ${snap.sport.toUpperCase()}

${snap.market}
${snap.selection}: ${snap.openingPrice.toFixed(2)} → ${arrow}${snap.currentPrice.toFixed(2)}

Implied probability: ${snap.impliedProbability.toFixed(1)}% (${probSign}${snap.probChange.toFixed(1)}pp)
Volatility score: ${snap.volatility.toFixed(0)}/100

Structural repricing detected across exchange markets. Implied probability divergence consistent with informed positioning.

Source: ${snap.source} · Market intelligence only.
Not financial advice. Sports Market OS does not place bets.

#${snap.sport.replace(/\s+/g, "")} #PricingIntelligence #MarketMovement`.trim();
}

function generateShortsHook(snap: OddsSnapshot): string {
  const arrow = snap.direction === "up" ? "shortening" : snap.direction === "down" ? "drifting" : "flat";
  const probSign = snap.probChange >= 0 ? "+" : "";

  return `HOOK (0–3s):
"The odds just moved on ${snap.market} — here's what the data shows."

CONTEXT (3–15s):
"${snap.selection} is ${arrow} — from ${snap.openingPrice.toFixed(2)} to ${snap.currentPrice.toFixed(2)}.
The AI terminal detected a ${probSign}${snap.probChange.toFixed(1)}pp implied probability shift.
Volatility score: ${snap.volatility.toFixed(0)}/100. That's structural repricing."

CTA (15–20s):
"Full pricing intelligence on Sports Market OS. Link in bio."

Caption: ${snap.sport} pricing intelligence · ${snap.market} · AI analysis
Tags: #${snap.sport.replace(/\s+/g, "")} #PricingIntelligence #MarketMovement`.trim();
}

function generateTelegram(snap: OddsSnapshot): string {
  const arrow = snap.direction === "up" ? "↑" : snap.direction === "down" ? "↓" : "→";
  const probSign = snap.probChange >= 0 ? "+" : "";
  const emoji = snap.volatility > 70 ? "🔴" : snap.volatility > 40 ? "🟡" : "⚪";

  return `${emoji} *${snap.sport.toUpperCase()} — PRICING INTELLIGENCE*

*${snap.market}*

Selection: ${snap.selection}
Opening: ${snap.openingPrice.toFixed(2)} ${arrow} Current: ${snap.currentPrice.toFixed(2)}
Implied probability: ${snap.impliedProbability.toFixed(1)}% (${probSign}${snap.probChange.toFixed(1)}pp)
Volatility: ${snap.volatility.toFixed(0)}/100
Source: ${snap.source}

Structural repricing detected. Implied probability divergence consistent with informed market positioning.

_Pricing intelligence only. Sports Market OS does not place bets or execute trades. Not financial advice._`.trim();
}

const STYLES: { id: ContentStyle; label: string; color: string }[] = [
  { id: "x_post",      label: "X Post",      color: "text-zinc-300" },
  { id: "shorts_hook", label: "Shorts Hook", color: "text-red-400" },
  { id: "telegram",    label: "Telegram",    color: "text-blue-400" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function OddsContentGenerator() {
  const [snapshots, setSnapshots] = useState<OddsSnapshot[]>([]);
  const [mode, setMode] = useState<DataMode>("simulation");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<OddsSnapshot | null>(null);
  const [activeStyle, setActiveStyle] = useState<ContentStyle>("x_post");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/live/odds");
        if (res.ok) {
          const json = await res.json() as {
            snapshots?: OddsSnapshot[];
            meta?: { mode?: DataMode };
          };
          const items = json.snapshots ?? [];
          setSnapshots(items);
          if (json.meta?.mode) setMode(json.meta.mode);
          if (items.length > 0) setSelected(items[0]);
        }
      } catch {
        // noop
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const generateContent = useCallback((): string => {
    if (!selected) return "";
    if (activeStyle === "x_post") return generateXPost(selected);
    if (activeStyle === "shorts_hook") return generateShortsHook(selected);
    return generateTelegram(selected);
  }, [selected, activeStyle]);

  async function handleCopy() {
    const text = generateContent();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // noop
    }
  }

  const content = generateContent();

  const modeColors: Record<DataMode, string> = {
    simulation: "text-amber-600",
    hybrid:     "text-blue-500",
    live:       "text-emerald-500",
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 bg-zinc-900/40 rounded-sm animate-pulse" />
        ))}
      </div>
    );
  }

  if (snapshots.length === 0) {
    return (
      <p className="text-zinc-600 text-xs">No pricing data available. Configure an odds API key to load live pricing.</p>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Left — snapshot list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
            Select Pricing Movement
          </span>
          <span className={`text-[9px] font-mono uppercase ${modeColors[mode]}`}>
            {mode}
          </span>
        </div>

        <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
          {snapshots.map((snap) => {
            const isSelected = selected?.id === snap.id;
            const movColor =
              snap.direction === "up"
                ? "text-emerald-400"
                : snap.direction === "down"
                ? "text-red-400"
                : "text-zinc-500";
            const arrow = snap.direction === "up" ? "↑" : snap.direction === "down" ? "↓" : "→";

            return (
              <button
                key={snap.id}
                onClick={() => setSelected(snap)}
                className={`w-full text-left px-3 py-2.5 rounded-sm border transition-colors ${
                  isSelected
                    ? "border-zinc-600 bg-zinc-900"
                    : "border-zinc-800/60 bg-zinc-950 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">{snap.sport}</span>
                  <span className={`text-[9px] font-mono tabular-nums ${movColor}`}>
                    {arrow}{snap.currentPrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-white text-[10px] leading-snug truncate">{snap.market}</p>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-zinc-600 text-[9px] font-mono truncate">{snap.selection}</span>
                  <span className={`text-[9px] font-mono tabular-nums ${movColor}`}>
                    {snap.probChange >= 0 ? "+" : ""}{snap.probChange.toFixed(1)}pp
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right — content output */}
      <div>
        {/* Style tabs */}
        <div className="flex items-center gap-1 mb-3">
          {STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStyle(s.id)}
              className={`text-[9px] font-mono px-3 py-1.5 border rounded-sm transition-colors ${
                activeStyle === s.id
                  ? `border-zinc-600 bg-zinc-900 ${s.color}`
                  : "border-zinc-800 text-zinc-600 hover:border-zinc-700"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
          <pre className="text-zinc-300 text-[10px] leading-relaxed whitespace-pre-wrap font-mono mb-4 min-h-[160px]">
            {content || "Select a pricing movement to generate content."}
          </pre>
          {content && (
            <div className="flex items-center justify-between border-t border-zinc-800/60 pt-3">
              <span className="text-zinc-700 text-[9px] font-mono tabular-nums">
                {content.length} chars
              </span>
              <button
                onClick={() => void handleCopy()}
                className="text-[9px] font-mono px-3 py-1.5 border border-zinc-700 rounded-sm hover:border-zinc-500 text-zinc-400 hover:text-white transition-colors"
              >
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>
          )}
        </div>

        <p className="text-zinc-700 text-[9px] font-mono mt-3 leading-relaxed">
          Generated content uses pricing intelligence language only. No financial advice, picks, or gambling language.
        </p>
      </div>
    </div>
  );
}
