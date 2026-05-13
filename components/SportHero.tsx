import type { SportHub } from "@/lib/markets/types";

export default function SportHero({ hub }: { hub: SportHub }) {
  return (
    <section
      className={`px-6 py-8 border-b border-zinc-900/80 ${hub.accentBg}`}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <span className={`w-2 h-2 rounded-full ${hub.dotColor} pulse-dot`} />
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            Sports Market OS · {hub.sport}
          </span>
        </div>

        <h1 className={`text-2xl font-bold mb-2 ${hub.accentColor}`}>
          {hub.title}
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl mb-6">
          {hub.subtitle}
        </p>

        <div className="flex flex-wrap gap-6">
          <div>
            <p className={`text-2xl font-bold tabular-nums ${hub.accentColor}`}>
              {hub.activeMarkets}
            </p>
            <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest mt-0.5">
              Active Markets
            </p>
          </div>
          <div>
            <p className={`text-2xl font-bold tabular-nums ${hub.accentColor}`}>
              {hub.monitoredExchanges}
            </p>
            <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest mt-0.5">
              Monitored Exchanges
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-1">
          {hub.highlights.map((h) => (
            <div key={h} className="flex items-start gap-2">
              <span className={`text-[9px] font-mono mt-0.5 ${hub.accentColor}`}>
                ›
              </span>
              <p className="text-zinc-400 text-[11px] leading-relaxed">{h}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
