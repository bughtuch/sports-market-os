import type { SportHub } from "@/lib/markets/types";
import { getMarketsForSport, getAllHubs } from "@/lib/markets/data";
import { hubWebPageLD } from "@/lib/seo/structuredData";
import SportHero from "@/components/SportHero";
import MarketCard from "@/components/MarketCard";
import AIInsightCard from "@/components/AIInsightCard";
import RelatedMarkets from "@/components/RelatedMarkets";
import SportHubPricingPulse from "@/components/SportHubPricingPulse";

export default function SportHubContent({ hub }: { hub: SportHub }) {
  const markets = getMarketsForSport(hub.sport);
  const allHubs = getAllHubs();
  const ld = hubWebPageLD(hub);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      <SportHero hub={hub} />

      {/* AI Summary */}
      <section className="px-6 py-6 border-b border-zinc-900/80">
        <div className="max-w-5xl mx-auto">
          <AIInsightCard
            label="AI Market Summary"
            text={hub.aiSummary}
            accentColor={hub.accentColor}
          />
        </div>
      </section>

      {/* Live Pricing Pulse */}
      <section className="px-6 py-6 border-b border-zinc-900/80">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              Live Pricing Pulse
            </span>
            <div className="flex-1 h-px bg-zinc-900" />
            <span className="text-zinc-700 text-[9px] font-mono">Pricing intelligence · No bets placed</span>
          </div>
          <SportHubPricingPulse sport={hub.sport} />
        </div>
      </section>

      {/* Active Markets */}
      <section className="px-6 py-6 border-b border-zinc-900/80">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              Monitored Markets
            </span>
            <div className="flex-1 h-px bg-zinc-900" />
            <span className="text-zinc-700 text-[9px] font-mono">
              {markets.length} markets
            </span>
          </div>
          {markets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {markets.map((m) => (
                <MarketCard key={m.slug} market={m} />
              ))}
            </div>
          ) : (
            <p className="text-zinc-600 text-xs">No markets currently monitored for this sport.</p>
          )}
        </div>
      </section>

      {/* Internal linking */}
      <RelatedMarkets markets={[]} hub={hub} allHubs={allHubs} />

      {/* Compliance note */}
      <div className="px-6 py-3 border-t border-zinc-900/60">
        <p className="text-zinc-800 text-[9px] font-mono leading-relaxed max-w-5xl mx-auto">
          Sports Market OS provides market intelligence and analytics only. It does not accept wagers, custody funds, or execute trades.
        </p>
      </div>
    </>
  );
}
