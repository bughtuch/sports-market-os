"use client";

import { useState, useEffect } from "react";
import type { AIRegimeState, MarketRegime } from "@/lib/ai/types";

const REGIME_CONFIG: Record<MarketRegime, { dot: string; text: string; label: string }> = {
  stable:      { dot: "bg-emerald-400", text: "text-emerald-400", label: "STABLE" },
  volatile:    { dot: "bg-red-400",     text: "text-red-400",     label: "VOLATILE" },
  expansion:   { dot: "bg-blue-400",    text: "text-blue-400",    label: "EXPANSION" },
  compression: { dot: "bg-amber-400",   text: "text-amber-400",   label: "COMPRESSION" },
  panic:       { dot: "bg-red-500",     text: "text-red-500",     label: "PANIC" },
  rotational:  { dot: "bg-purple-400",  text: "text-purple-400",  label: "ROTATIONAL" },
  illiquid:    { dot: "bg-orange-400",  text: "text-orange-400",  label: "ILLIQUID" },
};

export default function AIRegimePanel() {
  const [regime, setRegime] = useState<AIRegimeState | null>(null);

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch("/api/ai/regime");
        if (res.ok) {
          const json = await res.json() as { regime?: AIRegimeState };
          if (json.regime) setRegime(json.regime);
        }
      } catch { /* noop */ }
    }
    void fetch_();
    const timer = setInterval(() => void fetch_(), 20_000);
    return () => clearInterval(timer);
  }, []);

  if (!regime) {
    return (
      <div className="px-4 py-2 border-b border-zinc-900/80 flex items-center gap-3">
        <div className="w-24 h-3 bg-zinc-900/60 rounded-sm animate-pulse" />
        <div className="flex-1 h-3 bg-zinc-900/40 rounded-sm animate-pulse" />
      </div>
    );
  }

  const cfg = REGIME_CONFIG[regime.regime] ?? REGIME_CONFIG.stable;

  return (
    <div className="px-4 py-2.5 border-b border-zinc-900/80 flex items-center gap-3 bg-zinc-950/60">
      <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest shrink-0">
        Global Regime
      </span>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} pulse-dot`} />
        <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${cfg.text}`}>
          {cfg.label}
        </span>
      </div>
      <span className="text-zinc-700 text-[9px] font-mono shrink-0">
        {regime.confidence}% confidence
      </span>
      <div className="flex-1 h-px bg-zinc-900/80" />
      <p className="text-zinc-600 text-[9px] font-mono truncate max-w-[320px]">
        {regime.triggerFactors.join(" · ")}
      </p>
    </div>
  );
}
