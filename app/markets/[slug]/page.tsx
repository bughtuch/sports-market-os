import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllMarkets, getMarket, getRelatedMarkets, getAllHubs, getHub } from "@/lib/markets/data";
import { marketMetadata } from "@/lib/seo/metadata";
import { marketArticleLD } from "@/lib/seo/structuredData";
import AIInsightCard from "@/components/AIInsightCard";
import NewsCatalystCard from "@/components/NewsCatalystCard";
import RelatedMarkets from "@/components/RelatedMarkets";
import MarketPricingIntelligence from "@/components/MarketPricingIntelligence";

export async function generateStaticParams() {
  return getAllMarkets().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const market = getMarket(slug);
  if (!market) return {};
  return marketMetadata(market);
}

export default async function MarketPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const market = getMarket(slug);
  if (!market) notFound();

  const related = getRelatedMarkets(slug);
  const allHubs = getAllHubs();
  const hub = getHub(
    allHubs.find((h) => h.sport === market.sport)?.slug ?? ""
  ) ?? allHubs[0];
  const ld = marketArticleLD(market);

  const dirColor =
    market.direction === "down"
      ? "text-red-400"
      : market.direction === "up"
      ? "text-emerald-400"
      : "text-zinc-400";

  const SEVERITY_CONFIG = {
    low:      { text: "text-zinc-400",    bg: "bg-zinc-400/10",    border: "border-zinc-400/20",    label: "LOW"  },
    medium:   { text: "text-amber-400",   bg: "bg-amber-400/10",   border: "border-amber-400/20",   label: "MED"  },
    high:     { text: "text-orange-400",  bg: "bg-orange-400/10",  border: "border-orange-400/20",  label: "HIGH" },
    critical: { text: "text-red-400",     bg: "bg-red-400/10",     border: "border-red-400/20",     label: "CRIT" },
  };
  const sev = SEVERITY_CONFIG[market.aiSeverity];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      {/* Breadcrumb */}
      <div className="px-6 py-3 border-b border-zinc-900/80 bg-zinc-950">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-[9px] font-mono text-zinc-600">
          <Link href="/markets" className="hover:text-zinc-400 transition-colors">
            Markets
          </Link>
          <span>›</span>
          <Link
            href={`/${hub.slug}`}
            className="hover:text-zinc-400 transition-colors"
          >
            {market.sport}
          </Link>
          <span>›</span>
          <span className="text-zinc-500">{market.title}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="px-6 py-8 border-b border-zinc-900/80">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                  {market.exchange} · {market.sport}
                </span>
                <span
                  className={`text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-sm border ${sev.text} ${sev.bg} ${sev.border}`}
                >
                  {sev.label}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white leading-tight">
                {market.title}
              </h1>
            </div>
          </div>

          {/* Price strip */}
          <div className="flex flex-wrap gap-6 mt-6 p-4 bg-zinc-950 border border-zinc-800/60 rounded-sm">
            <div>
              <p className="text-zinc-600 text-[8px] font-mono uppercase">Opening</p>
              <p className="text-zinc-400 text-lg font-bold tabular-nums">
                {market.openingPrice.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-zinc-600 text-[8px] font-mono uppercase">Current</p>
              <p className="text-white text-lg font-bold tabular-nums">
                {market.currentPrice.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-zinc-600 text-[8px] font-mono uppercase">Movement</p>
              <p className={`text-lg font-bold tabular-nums ${dirColor}`}>
                {market.movement}
              </p>
            </div>
            <div>
              <p className="text-zinc-600 text-[8px] font-mono uppercase">Volatility</p>
              <p className="text-zinc-200 text-lg font-bold tabular-nums">
                {market.volatility}
              </p>
            </div>
            <div>
              <p className="text-zinc-600 text-[8px] font-mono uppercase">Liquidity</p>
              <p className="text-zinc-200 text-lg font-bold tabular-nums">
                {market.liquidity}
              </p>
            </div>
            <div>
              <p className="text-zinc-600 text-[8px] font-mono uppercase">AI Confidence</p>
              <p className="text-blue-400 text-lg font-bold tabular-nums">
                {market.confidence}%
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="mt-6 text-zinc-400 text-sm leading-relaxed">
            {market.description}
          </p>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {market.tags.map((tag) => (
              <span
                key={tag}
                className="text-zinc-700 text-[8px] font-mono px-1.5 py-0.5 border border-zinc-800/60 rounded-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Intelligence */}
      <section className="px-6 py-6 border-b border-zinc-900/80">
        <div className="max-w-5xl mx-auto">
          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-4">
            Pricing Intelligence
          </p>
          <MarketPricingIntelligence sport={market.sport} />
        </div>
      </section>

      {/* AI Intelligence */}
      <section className="px-6 py-6 border-b border-zinc-900/80">
        <div className="max-w-5xl mx-auto space-y-3">
          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-4">
            AI Market Intelligence
          </p>
          <AIInsightCard
            label="AI Narrative"
            text={market.aiNarrative}
            confidence={market.confidence}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <AIInsightCard label="Liquidity" text={market.liquidityNote} />
            <AIInsightCard label="Volatility" text={market.volatilityNote} />
            <AIInsightCard label="Behavioural" text={market.behaviouralNote} />
          </div>
        </div>
      </section>

      {/* Key Catalysts */}
      <section className="px-6 py-6 border-b border-zinc-900/80">
        <div className="max-w-5xl mx-auto">
          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-4">
            Key Catalysts
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {market.keyCatalysts.map((c) => (
              <div key={c} className="flex items-start gap-2 py-2 border-b border-zinc-900/60 last:border-0">
                <span className="text-zinc-700 text-[9px] font-mono mt-0.5">›</span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">{c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Catalysts */}
      {market.catalysts.length > 0 && (
        <section className="px-6 py-6 border-b border-zinc-900/80">
          <div className="max-w-5xl mx-auto">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-4">
              Market Catalysts
            </p>
            <div>
              {market.catalysts.map((c) => (
                <NewsCatalystCard key={c.id} catalyst={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related markets + hub nav */}
      <RelatedMarkets markets={related} hub={hub} allHubs={allHubs} />

      {/* Compliance */}
      <div className="px-6 py-3 border-t border-zinc-900/60">
        <p className="text-zinc-800 text-[9px] font-mono leading-relaxed max-w-5xl mx-auto">
          Sports Market OS provides market intelligence and analytics only. It does not accept wagers, custody funds, or execute trades.
        </p>
      </div>
    </>
  );
}
