import Link from "next/link";
import type { SportHub } from "@/lib/markets/types";
import { getMarketsForSport, getAllHubs } from "@/lib/markets/data";
import { hubWebPageLD } from "@/lib/seo/structuredData";
import SportHero from "@/components/SportHero";
import MarketCard from "@/components/MarketCard";
import RelatedMarkets from "@/components/RelatedMarkets";
import SportHubPricingPulse from "@/components/SportHubPricingPulse";
import SportHubExchangePulse from "@/components/SportHubExchangePulse";

function SectionHeader({ label, meta }: { label: string; meta?: string }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest shrink-0">{label}</span>
      <div className="flex-1 h-px bg-zinc-800/60" />
      {meta && <span className="text-zinc-600 text-[10px] font-mono shrink-0">{meta}</span>}
    </div>
  );
}

function EdgeModule({ hub }: { hub: SportHub }) {
  return (
    <section className="px-6 py-14 border-b border-zinc-900/80 bg-zinc-950">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <div className="mb-10">
          <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest mb-2">
            AI Market Intelligence
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">The Edge</h2>
          <p className="text-zinc-400 text-sm mt-2">What the market is missing — and what it means.</p>
        </div>

        {/* Three reading panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-6 border border-zinc-800/60 rounded-sm bg-black/20">
            <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest mb-3">Public Reading</p>
            <p className="text-zinc-300 text-sm leading-relaxed">{hub.edge.publicReading}</p>
          </div>
          <div className="p-6 border border-emerald-400/20 rounded-sm bg-emerald-400/5">
            <p className="text-emerald-500 text-[9px] font-mono uppercase tracking-widest mb-3">Sharp Reading</p>
            <p className="text-zinc-200 text-sm leading-relaxed">{hub.edge.sharpReading}</p>
          </div>
          <div className="p-6 border border-blue-400/20 rounded-sm bg-blue-400/5">
            <p className="text-blue-400 text-[9px] font-mono uppercase tracking-widest mb-3">AI Interpretation</p>
            <p className="text-zinc-200 text-sm leading-relaxed">{hub.edge.aiInterpretation}</p>
          </div>
        </div>

        {/* Risk + Content angle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 border border-amber-400/15 rounded-sm bg-amber-400/5">
            <p className="text-amber-500 text-[9px] font-mono uppercase tracking-widest mb-2">Risk Caveat</p>
            <p className="text-zinc-300 text-sm leading-relaxed">{hub.edge.riskCaveat}</p>
          </div>
          <div className={`p-5 border ${hub.accentBorder} rounded-sm ${hub.accentBg}`}>
            <p className={`text-[9px] font-mono uppercase tracking-widest mb-2 ${hub.accentColor}`}>Content Angle</p>
            <p className="text-white text-sm leading-relaxed font-medium">{hub.edge.contentAngle}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineModule({ hub }: { hub: SportHub }) {
  return (
    <section className="px-6 py-14 border-b border-zinc-900/80">
      <div className="max-w-5xl mx-auto">
        <SectionHeader label="Market Movement Story" meta="Forensic timeline" />

        <div className="space-y-0">
          {hub.timeline.map((item, i) => (
            <div
              key={i}
              className={`flex items-start gap-6 py-4 border-b border-zinc-900/60 last:border-0 ${
                item.highlight ? "bg-zinc-900/40 -mx-4 px-4 rounded-sm" : ""
              }`}
            >
              <div className="shrink-0 w-14 text-right">
                <span className={`text-xs font-mono tabular-nums ${item.highlight ? hub.accentColor : "text-zinc-600"}`}>
                  {item.time}
                </span>
              </div>
              <div className="flex items-start gap-3 flex-1">
                <span className={`text-xs font-mono mt-0.5 shrink-0 ${item.highlight ? hub.accentColor : "text-zinc-700"}`}>—</span>
                <p className={`text-sm leading-relaxed ${item.highlight ? "text-white font-semibold" : "text-zinc-300"}`}>
                  {item.event}
                </p>
              </div>
              {item.highlight && (
                <span className={`text-[9px] font-mono uppercase tracking-wider shrink-0 px-2 py-0.5 rounded-sm border ${hub.accentColor} ${hub.accentBorder} ${hub.accentBg}`}>
                  NOW
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TraderCreatorSplit({ hub }: { hub: SportHub }) {
  return (
    <section className="px-6 py-14 border-b border-zinc-900/80">
      <div className="max-w-5xl mx-auto">
        <SectionHeader label="Trader View · Creator View" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trader */}
          <div className="p-6 border border-zinc-800/60 rounded-sm bg-zinc-950">
            <p className="text-zinc-500 text-[9px] font-mono uppercase tracking-widest mb-5">Trader View</p>
            <ul className="space-y-3">
              {hub.traderView.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-zinc-700 text-xs font-mono mt-0.5 shrink-0">›</span>
                  <p className="text-zinc-200 text-sm leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Creator */}
          <div className={`p-6 border ${hub.accentBorder} rounded-sm ${hub.accentBg}`}>
            <p className={`text-[9px] font-mono uppercase tracking-widest mb-5 ${hub.accentColor}`}>Creator View</p>
            <div className="space-y-5">
              <div>
                <p className="text-zinc-600 text-[9px] font-mono uppercase mb-1.5">Simple Story</p>
                <p className="text-zinc-200 text-sm leading-relaxed">{hub.creatorView.story}</p>
              </div>
              <div>
                <p className="text-zinc-600 text-[9px] font-mono uppercase mb-1.5">Short-Form Hook</p>
                <p className={`text-sm font-semibold italic ${hub.accentColor}`}>&ldquo;{hub.creatorView.hook}&rdquo;</p>
              </div>
              <div>
                <p className="text-zinc-600 text-[9px] font-mono uppercase mb-1.5">Audience Angle</p>
                <p className="text-zinc-300 text-sm leading-relaxed">{hub.creatorView.audienceAngle}</p>
              </div>
              <div>
                <p className="text-zinc-600 text-[9px] font-mono uppercase mb-1.5">Visual Card Idea</p>
                <p className="text-zinc-300 text-sm leading-relaxed">{hub.creatorView.visualIdea}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CreatorAngleModule({ hub }: { hub: SportHub }) {
  return (
    <section className="px-6 py-14 border-b border-zinc-900/80 bg-zinc-950">
      <div className="max-w-5xl mx-auto">
        <SectionHeader label="Creator Content Angle" />

        <div className="text-center mb-10">
          <p className={`text-2xl md:text-3xl font-bold italic mb-4 ${hub.accentColor}`}>
            &ldquo;{hub.creatorAngle}&rdquo;
          </p>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
            {hub.creatorView.story}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/creator-studio"
            className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-sm border transition-colors ${hub.accentColor} ${hub.accentBorder} ${hub.accentBg} hover:opacity-80`}
          >
            Generate X Post
          </Link>
          <Link
            href="/creator-studio"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-zinc-300 border border-zinc-700/60 rounded-sm bg-zinc-900/40 hover:border-zinc-600/60 hover:text-white transition-colors"
          >
            Generate Short
          </Link>
          <Link
            href="/export-studio"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-zinc-300 border border-zinc-700/60 rounded-sm bg-zinc-900/40 hover:border-zinc-600/60 hover:text-white transition-colors"
          >
            Export Signal Card
          </Link>
        </div>
      </div>
    </section>
  );
}

function SportDepthModule({ hub }: { hub: SportHub }) {
  return (
    <section className="px-6 py-14 border-b border-zinc-900/80">
      <div className="max-w-5xl mx-auto">
        <SectionHeader label={`${hub.sport} Intelligence Depth`} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
          {hub.sportDepth.map((item, i) => (
            <div key={i} className="flex items-start gap-3 py-3 border-b border-zinc-900/60 last:border-0 md:last:border-0">
              <span className={`text-xs font-mono mt-0.5 shrink-0 ${hub.accentColor}`}>›</span>
              <p className="text-zinc-300 text-sm leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TennisTraderFeature() {
  return (
    <section className="px-6 py-14 border-b border-zinc-900/80 bg-emerald-400/5">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start gap-3 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot mt-1.5 shrink-0" />
          <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest">Featured Tool</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              Tennis Trader AI
            </h2>
            <p className="text-zinc-300 text-base leading-relaxed mb-8">
              Trade tennis markets from the browser-native AI trading system built for Betfair Exchange.
            </p>
            <ul className="space-y-2.5 mb-10">
              {[
                "Live Betfair ladder",
                "Paper trading free",
                "AI Guardian — automated risk management",
                "One-tap green up",
                "Works on Mac, iPhone, iPad, Windows, Android",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-zinc-300 text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="https://www.tennistraderai.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-black bg-emerald-400 rounded-sm hover:bg-emerald-300 transition-colors"
            >
              Open Tennis Trader AI →
            </a>
          </div>
          <div className="hidden md:block p-6 border border-emerald-400/20 rounded-sm bg-black/30">
            <div className="space-y-3">
              {[
                { label: "Betfair Ladder", value: "Live" },
                { label: "AI Guardian", value: "Active" },
                { label: "Paper Trading", value: "Free" },
                { label: "Platforms", value: "All" },
                { label: "Green Up", value: "1-tap" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-zinc-800/40 last:border-0">
                  <span className="text-zinc-500 text-xs font-mono">{row.label}</span>
                  <span className="text-emerald-400 text-xs font-mono font-semibold">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HorseRacingTraderFeature() {
  return (
    <section className="px-6 py-14 border-b border-zinc-900/80 bg-amber-400/5">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start gap-3 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 pulse-dot mt-1.5 shrink-0" />
          <span className="text-xs font-mono text-amber-500 uppercase tracking-widest">Featured Tool</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              Horse Racing Trader
            </h2>
            <p className="text-zinc-300 text-base leading-relaxed mb-8">
              Professional racing exchange intelligence and execution layer for Betfair traders.
            </p>
            <ul className="space-y-2.5 mb-10">
              {[
                "Live Betfair queue health monitoring",
                "Sharp money and unmatched liability alerts",
                "Pre-race liquidity thinning signals",
                "In-play volatility expansion detection",
                "Race-off countdown with structural scoring",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                  <span className="text-zinc-300 text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/terminal"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-black bg-amber-400 rounded-sm hover:bg-amber-300 transition-colors"
            >
              Open Horse Racing Trader →
            </Link>
          </div>
          <div className="hidden md:block p-6 border border-amber-400/20 rounded-sm bg-black/30">
            <div className="space-y-3">
              {[
                { label: "Queue Health", value: "Live" },
                { label: "Sharp Money", value: "Detected" },
                { label: "Liquidity Alerts", value: "Active" },
                { label: "Betfair", value: "Native" },
                { label: "Race-off", value: "Countdown" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-zinc-800/40 last:border-0">
                  <span className="text-zinc-500 text-xs font-mono">{row.label}</span>
                  <span className="text-amber-400 text-xs font-mono font-semibold">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
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

      {/* THE EDGE */}
      <EdgeModule hub={hub} />

      {/* Market Movement Story */}
      <TimelineModule hub={hub} />

      {/* Monitored Markets */}
      <section className="px-6 py-14 border-b border-zinc-900/80">
        <div className="max-w-5xl mx-auto">
          <SectionHeader label="Monitored Markets" meta={`${markets.length} markets`} />
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

      {/* Live Pricing Pulse */}
      <section className="px-6 py-14 border-b border-zinc-900/80">
        <div className="max-w-5xl mx-auto">
          <SectionHeader label="Live Pricing Pulse" meta="Pricing intelligence · No bets placed" />
          <SportHubPricingPulse sport={hub.sport} />
        </div>
      </section>

      {/* Exchange Pulse */}
      <section className="px-6 py-14 border-b border-zinc-900/80">
        <div className="max-w-5xl mx-auto">
          <SectionHeader label="Exchange Pulse" meta="Read-only microstructure · No trades placed" />
          <SportHubExchangePulse sport={hub.sport} />
        </div>
      </section>

      {/* Trader View / Creator View */}
      <TraderCreatorSplit hub={hub} />

      {/* Creator Content Angle */}
      <CreatorAngleModule hub={hub} />

      {/* Sport-Specific Depth */}
      <SportDepthModule hub={hub} />

      {/* Trader Feature — Tennis */}
      {hub.sport === "Tennis" && <TennisTraderFeature />}

      {/* Trader Feature — Horse Racing */}
      {hub.sport === "Horse Racing" && <HorseRacingTraderFeature />}

      {/* Internal linking */}
      <RelatedMarkets markets={[]} hub={hub} allHubs={allHubs} />

      {/* Compliance */}
      <div className="px-6 py-4 border-t border-zinc-900/60">
        <p className="text-zinc-700 text-[9px] font-mono leading-relaxed max-w-5xl mx-auto">
          Sports Market OS provides market intelligence and analytics only. It does not accept wagers, custody funds, or execute trades. Execution occurs on third-party exchanges.
        </p>
      </div>
    </>
  );
}
