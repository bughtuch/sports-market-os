import type { MarketCatalyst } from "@/lib/markets/types";

const SEVERITY_CONFIG = {
  low:      { text: "text-zinc-400",    bg: "bg-zinc-400/10",    border: "border-zinc-400/20",    dot: "bg-zinc-400"    },
  medium:   { text: "text-amber-400",   bg: "bg-amber-400/10",   border: "border-amber-400/20",   dot: "bg-amber-400"   },
  high:     { text: "text-orange-400",  bg: "bg-orange-400/10",  border: "border-orange-400/20",  dot: "bg-orange-400"  },
  critical: { text: "text-red-400",     bg: "bg-red-400/10",     border: "border-red-400/20",     dot: "bg-red-400"     },
};

export default function NewsCatalystCard({ catalyst }: { catalyst: MarketCatalyst }) {
  const cfg = SEVERITY_CONFIG[catalyst.severity];

  return (
    <div className="flex items-start gap-3 py-3 border-b border-zinc-900/60 last:border-0">
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${cfg.dot}`} />
      <div className="min-w-0 flex-1">
        <p className="text-zinc-200 text-[11px] font-medium leading-snug">
          {catalyst.headline}
        </p>
        <p className="text-zinc-500 text-[9px] mt-0.5 leading-relaxed">
          {catalyst.impact}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-zinc-700 text-[8px] font-mono">{catalyst.source}</span>
          <span className="text-zinc-700 text-[8px] font-mono">{catalyst.timestamp}</span>
          <span
            className={`text-[8px] font-mono uppercase tracking-wider px-1 py-0.5 rounded-sm border ${cfg.text} ${cfg.bg} ${cfg.border}`}
          >
            {catalyst.severity}
          </span>
        </div>
      </div>
    </div>
  );
}
