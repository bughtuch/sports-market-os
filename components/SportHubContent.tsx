import type { SportHub } from "@/lib/markets/types";
import { getMarketsForSport, getAllHubs } from "@/lib/markets/data";
import { hubWebPageLD } from "@/lib/seo/structuredData";
import SportHero from "@/components/SportHero";
import MarketCard from "@/components/MarketCard";
import AIInsightCard from "@/components/AIInsightCard";
import RelatedMarkets from "@/components/RelatedMarkets";
import SportHubPricingPulse from "@/components/SportHubPricingPulse";
import SportHubExchangePulse from "@/components/SportHubExchangePulse";

function SectionHeader({ label, meta }: { label: string; meta?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest shrink-0">
        {label}
      </span>
      <div className="flex-1 h-px bg-zinc-800/60" />
      {meta && (
        <span className="text-zinc-600 text-[10px] font-mono shrink-0">{meta}</span>
      )}
    </div>
  );
}

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
      <section className="px-6 py-10 border-b border-zinc-900/80">
        <div className="max-w-5xl mx-auto">
          <SectionHeader label="AI Market Summary" />
          <AIInsightCard
            label="AI Market Summary"
            text={hub.aiSummary}
            accentColor={hub.accentColor}
          />
        </div>
      </section>

      {/* Live Pricing Pulse */}
      <section className="px-6 py-10 border-b border-zinc-900/80">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            label="Live Pricing Pulse"
            meta="Pricing intelligence · No bets placed"
          />
          <SportHubPricingPulse sport={hub.sport} />
        </div>
      </section>

      {/* Exchange Pulse */}
      <section className="px-6 py-10 border-b border-zinc-900/80">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            label="Exchange Pulse"
            meta="Read-only microstructure · No trades placed"
          />
          <SportHubExchangePulse sport={hub.sport} />
        </div>
      </section>

      {/* Active Markets */}
      <section className="px-6 py-10 border-b border-zinc-900/80">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            label="Monitored Markets"
            meta={`${markets.length} markets`}
          />
          {markets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {markets.map((m) => (
                <MarketCard key={m.slug} market={m} />
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-sm">No markets currently monitored for this sport.</p>
          )}
        </div>
      </section>

      {/* Internal linking */}
      <RelatedMarkets markets={[]} hub={hub} allHubs={allHubs} />

      {/* Compliance note */}
      <div className="px-6 py-4 border-t border-zinc-900/60">
        <p className="text-zinc-700 text-[9px] font-mono leading-relaxed max-w-5xl mx-auto">
          Sports Market OS provides market intelligence and analytics only. It does not accept wagers, custody funds, or execute trades.
        </p>
      </div>
    </>
  );
}
