export interface SportsHubData {
  name: string;
  tagline: string;
  metrics: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
  symbol: string;
}

export default function SportsHubCard({
  name,
  tagline,
  metrics,
  accent,
  accentBg,
  accentBorder,
  symbol,
}: SportsHubData) {
  return (
    <div className="group relative bg-zinc-950 border border-zinc-800/80 rounded-sm p-5 hover:border-zinc-700 transition-all duration-200 cursor-pointer">
      {/* Symbol */}
      <div className={`text-2xl font-mono mb-4 ${accent}`}>{symbol}</div>

      {/* Name */}
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-white text-sm font-semibold">{name}</h3>
        <span className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-sm border ${accent} ${accentBg} ${accentBorder}`}>
          LIVE
        </span>
      </div>

      {/* Tagline */}
      <p className="text-zinc-500 text-xs leading-relaxed mb-4">{tagline}</p>

      {/* Metrics */}
      <div className="flex items-center justify-between">
        <span className="text-zinc-600 text-[10px] font-mono">{metrics}</span>
        <svg
          className="w-3 h-3 text-zinc-700 group-hover:text-zinc-500 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
