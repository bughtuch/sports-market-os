import type { SportHub } from "@/lib/markets/types";

export default function SportHero({ hub }: { hub: SportHub }) {
  return (
    <section className={`relative px-6 py-14 border-b border-zinc-900/80 overflow-hidden ${hub.accentBg}`}>
      {/* Subtle grid */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center gap-2.5 mb-5">
          <span className={`w-2.5 h-2.5 rounded-full ${hub.dotColor} pulse-dot`} />
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
            Sports Market OS · {hub.sport} · Live Intelligence
          </span>
        </div>

        {/* Title */}
        <h1 className={`text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight mb-4 ${hub.accentColor}`}>
          {hub.title}
        </h1>

        {/* Subtitle */}
        <p className="text-zinc-300 text-base leading-relaxed max-w-2xl mb-10">
          {hub.subtitle}
        </p>

        {/* Metrics */}
        <div className="flex flex-wrap gap-10 mb-10">
          <div>
            <p className={`text-5xl font-bold tabular-nums leading-none ${hub.accentColor}`}>
              {hub.activeMarkets}
            </p>
            <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest mt-2">
              Active Markets
            </p>
          </div>
          <div>
            <p className={`text-5xl font-bold tabular-nums leading-none ${hub.accentColor}`}>
              {hub.monitoredExchanges}
            </p>
            <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest mt-2">
              Monitored Exchanges
            </p>
          </div>
          <div>
            <p className="text-5xl font-bold tabular-nums leading-none text-white">
              Live
            </p>
            <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest mt-2">
              Intelligence Feed
            </p>
          </div>
        </div>

        {/* Highlights */}
        <div className="space-y-2">
          {hub.highlights.map((h) => (
            <div key={h} className="flex items-start gap-3">
              <span className={`text-xs font-mono mt-0.5 shrink-0 ${hub.accentColor}`}>›</span>
              <p className="text-zinc-300 text-sm leading-relaxed">{h}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
