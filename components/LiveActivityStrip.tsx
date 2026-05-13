"use client";

// Static pool of machine-like system activity messages.
// Content is duplicated for seamless CSS loop — no JS animation needed.

const ACTIVITY_MESSAGES = [
  "AI market scan complete — 248 markets processed",
  "Betfair feed synced — latency 14ms",
  "Volatility scan updated — 3 anomalies detected",
  "AI intelligence brief generated — regime: volatile",
  "Provider sync — Smarkets nominal",
  "Signal throughput: 142/hr — all engines active",
  "Creator export batch complete — 6 cards generated",
  "Regime engine updated — classification confidence 82%",
  "Odds movement scan — 18 lines with >5% movement",
  "Liquidity engine: queue health nominal across 24 markets",
  "AI opportunity scan — 4 structural signals identified",
  "Provider sync — Polymarket latency elevated 340ms",
  "Anomaly detection cycle complete — 1 critical flagged",
  "Behavioural engine updated — sharp divergence widening",
  "News catalyst feed — 7 items processed last cycle",
  "Betdaq feed synced — latency 22ms",
  "AI brief escalated — critical conditions in horse racing",
  "Market depth analysis complete — Ascot 2:40 flagged",
  "Cross-market correlation scan — 3 rotations detected",
  "DraftKings feed nominal — 14 NFL markets monitored",
];

export default function LiveActivityStrip() {
  const doubled = [...ACTIVITY_MESSAGES, ...ACTIVITY_MESSAGES];

  return (
    <div className="h-6 shrink-0 border-b border-zinc-900/60 bg-zinc-950/80 flex items-center overflow-hidden">
      {/* Label */}
      <div className="shrink-0 flex items-center gap-1.5 pl-3 pr-3 border-r border-zinc-900/60 h-full bg-zinc-950">
        <span className="w-1 h-1 rounded-full bg-zinc-600 shrink-0" />
        <span className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest whitespace-nowrap">
          System
        </span>
      </div>

      {/* Scrolling feed */}
      <div className="flex-1 overflow-hidden relative">
        <div className="activity-animate">
          {doubled.map((msg, i) => (
            <span key={i} className="inline-flex items-center">
              <span className="text-zinc-700 text-[8px] font-mono px-4 whitespace-nowrap">
                {msg}
              </span>
              <span className="text-zinc-800 text-[8px] font-mono">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
