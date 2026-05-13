import Link from "next/link";
import type { Market } from "@/lib/markets/types";

const SEVERITY_CONFIG = {
  low:      { text: "text-zinc-400",    bg: "bg-zinc-400/10",    border: "border-zinc-400/20",    label: "LOW" },
  medium:   { text: "text-amber-400",   bg: "bg-amber-400/10",   border: "border-amber-400/20",   label: "MED" },
  high:     { text: "text-orange-400",  bg: "bg-orange-400/10",  border: "border-orange-400/20",  label: "HIGH" },
  critical: { text: "text-red-400",     bg: "bg-red-400/10",     border: "border-red-400/20",     label: "CRIT" },
};

export default function MarketCard({ market }: { market: Market }) {
  const sev = SEVERITY_CONFIG[market.aiSeverity];
  const isUp = market.direction === "up";
  const dirColor = market.direction === "down" ? "text-red-400" : market.direction === "up" ? "text-emerald-400" : "text-zinc-400";

  return (
    <Link
      href={`/markets/${market.slug}`}
      className="block p-4 border border-zinc-800/60 rounded-sm bg-zinc-950 hover:border-zinc-700/60 hover:bg-zinc-900/40 transition-colors group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="text-zinc-200 text-[11px] font-medium leading-snug truncate group-hover:text-white transition-colors">
            {market.title}
          </p>
          <p className="text-zinc-600 text-[9px] font-mono mt-0.5">
            {market.exchange} · {market.sport}
          </p>
        </div>
        <span
          className={`text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-sm border shrink-0 ${sev.text} ${sev.bg} ${sev.border}`}
        >
          {sev.label}
        </span>
      </div>

      <div className="flex items-center gap-4 mt-3">
        <div>
          <p className="text-zinc-600 text-[8px] font-mono uppercase">Current</p>
          <p className="text-zinc-200 text-sm font-bold tabular-nums">
            {market.currentPrice.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-zinc-600 text-[8px] font-mono uppercase">Move</p>
          <p className={`text-sm font-bold tabular-nums ${dirColor}`}>
            {market.movement}
          </p>
        </div>
        <div>
          <p className="text-zinc-600 text-[8px] font-mono uppercase">Vol</p>
          <p className="text-zinc-300 text-sm font-bold tabular-nums">
            {market.volatility}
          </p>
        </div>
        <div>
          <p className="text-zinc-600 text-[8px] font-mono uppercase">AI Conf</p>
          <p className="text-zinc-300 text-sm font-bold tabular-nums">
            {market.confidence}%
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {market.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-zinc-700 text-[8px] font-mono px-1.5 py-0.5 border border-zinc-800/60 rounded-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
