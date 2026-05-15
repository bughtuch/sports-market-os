import type { SportHub } from "@/lib/markets/types";

export default function SportHero({ hub }: { hub: SportHub }) {
  return (
    <section className={`relative px-6 py-16 border-b border-zinc-900/80 overflow-hidden ${hub.accentBg}`}>
      <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center gap-2.5 mb-6">
          <span className={`w-2.5 h-2.5 rounded-full ${hub.dotColor} pulse-dot`} />
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
            Sports Market OS · {hub.sport} · Live Intelligence
          </span>
        </div>

        {/* Title */}
        <h1 className={`text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight mb-6 ${hub.accentColor}`}>
          {hub.title}
        </h1>

        {/* Thesis */}
        <p className="text-white text-xl md:text-2xl font-semibold leading-snug max-w-3xl mb-3">
          {hub.mainThesis}
        </p>
        <p className="text-zinc-300 text-base leading-relaxed max-w-2xl mb-10">
          {hub.subThesis}
        </p>

        {/* Intelligence grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10 p-6 border border-zinc-800/60 bg-black/30 rounded-sm">
          <div>
            <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest mb-1.5">Regime</p>
            <p className={`text-base font-bold leading-none ${hub.accentColor}`}>{hub.regime}</p>
          </div>
          <div>
            <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest mb-1.5">AI Confidence</p>
            <p className="text-white text-base font-bold tabular-nums leading-none">{hub.confidence}%</p>
          </div>
          <div>
            <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest mb-1.5">Top Signal</p>
            <p className="text-zinc-200 text-sm font-semibold leading-tight">{hub.topSignal}</p>
          </div>
          <div>
            <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest mb-1.5">Exchange Flow</p>
            <p className="text-zinc-200 text-sm font-semibold leading-tight">{hub.exchangeFlow}</p>
          </div>
          <div>
            <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest mb-1.5">Active Markets</p>
            <p className={`text-base font-bold tabular-nums leading-none ${hub.accentColor}`}>{hub.activeMarkets}</p>
          </div>
          <div>
            <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest mb-1.5">Exchanges</p>
            <p className="text-white text-base font-bold tabular-nums leading-none">{hub.monitoredExchanges}</p>
          </div>
        </div>

        {/* Creator angle */}
        <div className={`border-l-2 ${hub.accentBorder} pl-5`}>
          <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest mb-1.5">Creator Angle</p>
          <p className={`text-lg md:text-xl font-semibold italic ${hub.accentColor}`}>
            &ldquo;{hub.creatorAngle}&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
