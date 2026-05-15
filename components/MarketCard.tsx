import Link from "next/link";
import type { Market } from "@/lib/markets/types";

const SEVERITY_CONFIG = {
  low:      { text: "text-zinc-400",   bg: "bg-zinc-400/10",   border: "border-zinc-400/20",   label: "LOW"  },
  medium:   { text: "text-amber-400",  bg: "bg-amber-400/10",  border: "border-amber-400/20",  label: "MED"  },
  high:     { text: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20", label: "HIGH" },
  critical: { text: "text-red-400",    bg: "bg-red-400/10",    border: "border-red-400/20",    label: "CRIT" },
};

export default function MarketCard({ market }: { market: Market }) {
  const sev = SEVERITY_CONFIG[market.aiSeverity];
  const dirColor =
    market.direction === "down" ? "text-red-400" :
    market.direction === "up"   ? "text-emerald-400" :
                                  "text-zinc-400";

  return (
    <Link
      href={`/markets/${market.slug}`}
      className="block p-5 border border-zinc-800/60 rounded-sm bg-zinc-950 hover:border-zinc-600/60 hover:bg-zinc-900/40 transition-colors group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold leading-snug group-hover:text-zinc-100 transition-colors">
            {market.title}
          </p>
          <p className="text-zinc-500 text-xs font-mono mt-1">
            {market.exchange} · {market.sport}
          </p>
        </div>
        <span
          className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm border shrink-0 ${sev.text} ${sev.bg} ${sev.border}`}
        >
          {sev.label}
        </span>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-4 gap-3">
        <div>
          <p className="text-zinc-600 text-[9px] font-mono uppercase mb-1">Price</p>
          <p className="text-white text-lg font-bold tabular-nums leading-none">
            {market.currentPrice.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-zinc-600 text-[9px] font-mono uppercase mb-1">Move</p>
          <p className={`text-lg font-bold tabular-nums leading-none ${dirColor}`}>
            {market.movement}
          </p>
        </div>
        <div>
          <p className="text-zinc-600 text-[9px] font-mono uppercase mb-1">Vol</p>
          <p className="text-zinc-200 text-lg font-bold tabular-nums leading-none">
            {market.volatility}
          </p>
        </div>
        <div>
          <p className="text-zinc-600 text-[9px] font-mono uppercase mb-1">AI</p>
          <p className="text-blue-400 text-lg font-bold tabular-nums leading-none">
            {market.confidence}%
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {market.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-zinc-500 text-[9px] font-mono px-1.5 py-0.5 border border-zinc-800 rounded-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
