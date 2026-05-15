"use client";

/**
 * TradeLiveButton — Betfair Exchange outbound routing CTA.
 *
 * Variants:
 *   compact   — icon + short text, fits inline beside other controls
 *   inline    — text link style for use within paragraphs / cards
 *   hero      — large prominent CTA for hero sections
 *   signal    — small footer CTA on signal cards
 *
 * Execution occurs on Betfair Exchange.
 * Sports Market OS provides intelligence only — no wager execution.
 */

import { buildBetfairMarketUrl, buildBetfairSportUrl } from "@/lib/betfair/betfairLinks";
import { getBetfairSportConfig }                       from "@/lib/betfair/betfairMarkets";
import { trackBetfairClick }                           from "@/lib/betfair/betfairTracking";
import type { BetfairClickEvent }                      from "@/lib/betfair/betfairTracking";

export type TradeLiveVariant = "compact" | "inline" | "hero" | "signal";

interface Props {
  sport:      string;
  marketId?:  string;
  eventName?: string;
  variant?:   TradeLiveVariant;
  label?:     string;
  source:     BetfairClickEvent["source"];
  className?: string;
}

const VARIANT_STYLES: Record<TradeLiveVariant, string> = {
  compact: "inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 border border-emerald-400/30 px-2.5 py-1 rounded-sm hover:border-emerald-400/60 hover:bg-emerald-400/5 transition-colors",
  inline:  "inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-emerald-400 transition-colors",
  hero:    "inline-flex items-center gap-2 text-sm font-medium text-black bg-emerald-400 px-5 py-2.5 rounded-sm hover:bg-emerald-300 transition-colors",
  signal:  "inline-flex items-center gap-1 text-[9px] font-mono text-zinc-500 hover:text-emerald-400 transition-colors",
};

function LiveDot({ variant }: { variant: TradeLiveVariant }) {
  if (variant === "hero") {
    return <span className="w-2 h-2 rounded-full bg-emerald-700 pulse-dot shrink-0" />;
  }
  return <span className="w-1 h-1 rounded-full bg-emerald-500 pulse-dot shrink-0" />;
}

export default function TradeLiveButton({
  sport,
  marketId,
  eventName,
  variant = "compact",
  label,
  source,
  className = "",
}: Props) {
  const config = getBetfairSportConfig(sport);

  if (config && !config.supported) return null;

  const url = marketId
    ? buildBetfairMarketUrl({ sport, marketId, eventName })
    : buildBetfairSportUrl(sport);

  const defaultLabels: Record<TradeLiveVariant, string> = {
    compact: "Open Market",
    inline:  "Open on Betfair →",
    hero:    "Live on Betfair Exchange",
    signal:  "Trade Live →",
  };

  const displayLabel = label ?? defaultLabels[variant];

  function handleClick() {
    trackBetfairClick({ sport, marketId, url, source, ts: Date.now() });
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`${VARIANT_STYLES[variant]} ${className}`}
    >
      <LiveDot variant={variant} />
      {displayLabel}
    </a>
  );
}
