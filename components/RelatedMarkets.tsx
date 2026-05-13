import Link from "next/link";
import type { Market, SportHub } from "@/lib/markets/types";

interface RelatedMarketsProps {
  markets: Market[];
  hub: SportHub;
  allHubs: SportHub[];
}

export default function RelatedMarkets({
  markets,
  hub,
  allHubs,
}: RelatedMarketsProps) {
  return (
    <section className="px-6 py-6 border-t border-zinc-900/80">
      <div className="max-w-5xl mx-auto">
        <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-4">
          Related Markets &amp; Hubs
        </p>

        {markets.length > 0 && (
          <div className="mb-6">
            <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest mb-2">
              Related Markets
            </p>
            <div className="space-y-px">
              {markets.map((m) => {
                const dirColor =
                  m.direction === "down"
                    ? "text-red-400"
                    : m.direction === "up"
                    ? "text-emerald-400"
                    : "text-zinc-400";
                return (
                  <Link
                    key={m.slug}
                    href={`/markets/${m.slug}`}
                    className="flex items-center justify-between py-2.5 border-b border-zinc-900/60 hover:bg-zinc-900/20 px-1 transition-colors group"
                  >
                    <div>
                      <p className="text-zinc-300 text-[11px] group-hover:text-white transition-colors">
                        {m.title}
                      </p>
                      <p className="text-zinc-600 text-[9px] font-mono mt-0.5">
                        {m.exchange}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span
                        className={`text-[11px] font-mono tabular-nums ${dirColor}`}
                      >
                        {m.movement}
                      </span>
                      <span className="text-zinc-500 text-[9px] font-mono">
                        {m.confidence}%
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest mb-2">
            Sport Hubs
          </p>
          <div className="flex flex-wrap gap-2">
            {allHubs.map((h) => (
              <Link
                key={h.slug}
                href={`/${h.slug}`}
                className={`text-[10px] font-mono px-2.5 py-1 rounded-sm border transition-colors ${
                  h.slug === hub.slug
                    ? `${hub.accentColor} ${hub.accentBg} ${hub.accentBorder}`
                    : "text-zinc-600 border-zinc-800/60 hover:text-zinc-400 hover:border-zinc-700/60"
                }`}
              >
                {h.sport}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
