import { getAllMarkets, getAllHubs } from "@/lib/markets/data";
import { directoryMetadata } from "@/lib/seo/metadata";
import { directoryDatasetLD } from "@/lib/seo/structuredData";
import MarketDirectory from "@/components/MarketDirectory";
import Link from "next/link";

export const metadata = directoryMetadata();

export default function MarketsPage() {
  const markets = getAllMarkets();
  const hubs = getAllHubs();
  const ld = directoryDatasetLD();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      {/* Header */}
      <section className="px-6 py-8 border-b border-zinc-900/80">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-blue-400 pulse-dot" />
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              Sports Market OS · Market Directory
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">All Markets</h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">
            Browse all monitored sports prediction and exchange markets. AI-powered
            intelligence across {markets.length} active markets and {hubs.length} sport categories.
          </p>

          {/* Hub quick links */}
          <div className="flex flex-wrap gap-2 mt-6">
            {hubs.map((h) => (
              <Link
                key={h.slug}
                href={`/${h.slug}`}
                className={`text-[10px] font-mono px-2.5 py-1 rounded-sm border transition-colors ${h.accentColor} ${h.accentBg} ${h.accentBorder} hover:opacity-80`}
              >
                {h.sport}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <MarketDirectory markets={markets} />

      {/* Compliance note */}
      <div className="px-6 py-3 border-t border-zinc-900/60">
        <p className="text-zinc-800 text-[9px] font-mono leading-relaxed max-w-5xl mx-auto">
          Sports Market OS provides market intelligence and analytics only. It does not accept wagers, custody funds, or execute trades.
        </p>
      </div>
    </>
  );
}
