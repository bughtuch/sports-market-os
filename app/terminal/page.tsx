import MarketTicker from "@/components/MarketTicker";
import TerminalHeader from "@/components/TerminalHeader";
import Sidebar from "@/components/Sidebar";
import AIPanel from "@/components/AIPanel";
import Watchlist from "@/components/Watchlist";
import CreatorFeed from "@/components/CreatorFeed";
import LiveStatusStrip from "@/components/LiveStatusStrip";
import PulseCard, { type PulseCardData } from "@/components/PulseCard";
import TerminalRegimeWrapper from "@/components/TerminalRegimeWrapper";
import AlertRail from "@/components/AlertRail";
import EventStack from "@/components/EventStack";
import LiveActivityStrip from "@/components/LiveActivityStrip";
import MarketHeatPanel from "@/components/MarketHeatPanel";
import MarketDepthWidget from "@/components/MarketDepthWidget";
import DistributionBar from "@/components/DistributionBar";
import MostSharedSignals from "@/components/MostSharedSignals";
import LiveSignalFeed from "@/components/LiveSignalFeed";
import ProviderStatusPanel from "@/components/ProviderStatusPanel";
import NewsCatalystFeed from "@/components/NewsCatalystFeed";
import OddsMovementFeed from "@/components/OddsMovementFeed";
import DataModeIndicator from "@/components/DataModeIndicator";
import AIRegimePanel from "@/components/AIRegimePanel";
import AINarrativePanel from "@/components/AINarrativePanel";
import AIBriefPanel from "@/components/AIBriefPanel";
import AIOpportunityScanner from "@/components/AIOpportunityScanner";
import AILiquidityPanel from "@/components/AILiquidityPanel";
import AIVolatilityPanel from "@/components/AIVolatilityPanel";
import AIBehaviourPanel from "@/components/AIBehaviourPanel";
import AIEngineStatus from "@/components/AIEngineStatus";

// ─── Mock pulse data ──────────────────────────────────────────────────────────

const pulseCards: PulseCardData[] = [
  {
    title: "Hottest Market",
    sport: "Horse Racing",
    value: "Ascot 14:30",
    change: "+34.2% vol",
    direction: "up",
    sparkData: [28, 31, 35, 32, 39, 37, 43, 41, 48, 46, 52, 58],
    timestamp: "14:32",
    accentColor: "text-amber-400",
    accentBg: "bg-amber-400/10",
    accentBorder: "border-amber-400/20",
  },
  {
    title: "Largest Volatility Spike",
    sport: "Tennis",
    value: "IV +2.8σ",
    change: "+18.4% iv",
    direction: "up",
    sparkData: [40, 42, 38, 45, 41, 50, 47, 55, 52, 60, 57, 66],
    timestamp: "14:29",
    accentColor: "text-emerald-400",
    accentBg: "bg-emerald-400/10",
    accentBorder: "border-emerald-400/20",
  },
  {
    title: "Sharpest Movement",
    sport: "NBA",
    value: "−4.2pts",
    change: "−6.1% line",
    direction: "down",
    sparkData: [60, 58, 62, 55, 59, 52, 56, 49, 53, 47, 50, 44],
    timestamp: "14:27",
    accentColor: "text-blue-400",
    accentBg: "bg-blue-400/10",
    accentBorder: "border-blue-400/20",
  },
  {
    title: "Most Active Sport",
    sport: "Football",
    value: "64 markets",
    change: "+12 since open",
    direction: "up",
    sparkData: [30, 33, 36, 34, 38, 37, 41, 39, 44, 42, 47, 50],
    timestamp: "14:24",
    accentColor: "text-zinc-300",
    accentBg: "bg-zinc-300/10",
    accentBorder: "border-zinc-300/20",
  },
  {
    title: "Largest Liquidity Shift",
    sport: "Prediction",
    value: "$2.4M moved",
    change: "+89.2% flow",
    direction: "up",
    sparkData: [15, 18, 22, 19, 26, 23, 30, 27, 35, 32, 40, 46],
    timestamp: "14:21",
    accentColor: "text-purple-400",
    accentBg: "bg-purple-400/10",
    accentBorder: "border-purple-400/20",
  },
  {
    title: "Fastest Rising Market",
    sport: "UFC",
    value: "Poirier ML",
    change: "+22.8% price",
    direction: "up",
    sparkData: [20, 22, 25, 24, 28, 27, 32, 31, 36, 35, 40, 45],
    timestamp: "14:18",
    accentColor: "text-orange-400",
    accentBg: "bg-orange-400/10",
    accentBorder: "border-orange-400/20",
  },
];

// ─── Mock feed data ───────────────────────────────────────────────────────────

// Retained as fallback reference — live data served by LiveSignalFeed via /api/live/signals
const feedCards = [
  {
    sport: "Horse Racing",
    timestamp: "14:32:08",
    title: "Sharp Money Detected — Ascot 2.40",
    description:
      "Significant unmatched liability appearing on the lay side of the 2.40 at Ascot. Queue structure deteriorating. Pattern consistent with informed positioning ahead of a move.",
    confidence: 87,
    tag: "Premium",
    type: "Sharp Money",
    movement: "+34.2%",
    direction: "up",
    aiScore: 87,
    exchange: "Betfair",
    sparkData: [28, 31, 35, 32, 39, 37, 43, 41, 48, 46, 52, 58],
  },
  {
    sport: "Tennis",
    timestamp: "14:29:51",
    title: "Liquidity Imbalance — Djokovic vs Alcaraz",
    description:
      "Exchange volume diverging from in-play price movement. Matched volume 34% above 20-day average with price compression suggesting imminent volatility expansion.",
    confidence: 74,
    tag: "Free",
    type: "Liquidity Imbalance",
    movement: "+18.4%",
    direction: "up",
    aiScore: 74,
    exchange: "Smarkets",
    sparkData: [40, 42, 38, 45, 41, 50, 47, 55, 52, 60, 57, 66],
  },
  {
    sport: "NBA",
    timestamp: "14:27:14",
    title: "AI Market Thesis — Warriors vs Lakers",
    description:
      "Model detects spread value on the under side based on pace-of-play regression and defensive scheme data. Sharp-side consensus aligning with AI projection.",
    confidence: 81,
    tag: "Premium",
    type: "AI Market Thesis",
    movement: "−6.1%",
    direction: "down",
    aiScore: 81,
    exchange: "FanDuel",
    sparkData: [60, 58, 62, 55, 59, 52, 56, 49, 53, 47, 50, 44],
  },
  {
    sport: "NFL",
    timestamp: "14:24:03",
    title: "Volatility Compression — Chiefs vs Bills",
    description:
      "Implied volatility contracting sharply across the totals market. Three consecutive hours of compression without a triggering event — historically precedes a significant move.",
    confidence: 69,
    tag: "Free",
    type: "Volatility Watch",
    movement: "+4.7%",
    direction: "up",
    aiScore: 69,
    exchange: "DraftKings",
    sparkData: [50, 52, 48, 54, 50, 56, 52, 58, 54, 60, 56, 62],
  },
  {
    sport: "Horse Racing",
    timestamp: "14:21:47",
    title: "Queue Health Warning — Cheltenham 3.15",
    description:
      "Betfair queue depth falling below threshold. Liquidity thinning on both sides simultaneously. Not consistent with normal pre-race withdrawal. Monitor for stewards' decision.",
    confidence: 92,
    tag: "API",
    type: "Queue Health",
    movement: "−12.1%",
    direction: "down",
    aiScore: 92,
    exchange: "Betfair",
    sparkData: [70, 68, 72, 65, 69, 62, 66, 59, 63, 56, 60, 54],
  },
  {
    sport: "Prediction Markets",
    timestamp: "14:18:30",
    title: "Creator Signal Generated — US Election Market",
    description:
      "AI-generated share card ready. Volume surge detected in the US presidential market. Contract pricing diverging from polling consensus by 6.8 points.",
    confidence: 78,
    tag: "Creator",
    type: "Creator Signal",
    movement: "+89.2%",
    direction: "up",
    aiScore: 78,
    exchange: "Polymarket",
    sparkData: [15, 18, 22, 19, 26, 23, 30, 27, 35, 32, 40, 46],
  },
  {
    sport: "UFC",
    timestamp: "14:15:12",
    title: "Market News Catalyst — Poirier vs Gaethje",
    description:
      "Weight-cut rumour entering the market. Underdog price shortening without matching public volume. Consistent with informed money responding to non-public information.",
    confidence: 65,
    tag: "Free",
    type: "News Catalyst",
    movement: "+22.8%",
    direction: "up",
    aiScore: 65,
    exchange: "Betfair",
    sparkData: [20, 22, 25, 24, 28, 27, 32, 31, 36, 35, 40, 45],
  },
  {
    sport: "Football",
    timestamp: "14:11:55",
    title: "Exchange Flow Shift — Premier League Markets",
    description:
      "Cross-market liquidity rotating from Asian handicap into match result markets. Flow pattern matches institutional rebalancing rather than retail activity.",
    confidence: 72,
    tag: "Premium",
    type: "Exchange Flow",
    movement: "+8.3%",
    direction: "up",
    aiScore: 72,
    exchange: "Pinnacle",
    sparkData: [30, 33, 31, 36, 34, 38, 36, 41, 39, 44, 42, 48],
  },
];

// ─── Terminal page ────────────────────────────────────────────────────────────

export default function TerminalPage() {
  return (
    <TerminalRegimeWrapper>
      {/* Fixed top bars */}
      <MarketTicker />
      <TerminalHeader />

      {/* Main layout */}
      <div className="flex flex-1 flex-col md:flex-row md:overflow-hidden">
        {/* Sidebar — hidden on mobile */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Center column */}
        <div className="flex flex-1 flex-col md:overflow-hidden">
          {/* Feed filter bar */}
          <div className="h-9 shrink-0 border-b border-zinc-800/60 bg-zinc-950 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <span className="text-white text-[11px] font-semibold">Live Market Intelligence</span>
              <DataModeIndicator />
            </div>
            <div className="flex items-center gap-3">
              {["All Sports", "Free", "Premium", "API"].map((f, i) => (
                <button
                  key={f}
                  className={`text-[9px] font-mono uppercase tracking-wider transition-colors ${
                    i === 0
                      ? "text-white border border-zinc-700 px-2 py-0.5 rounded-sm"
                      : "text-zinc-600 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
                <span className="text-emerald-400 text-[9px] font-mono">LIVE</span>
              </div>
            </div>
          </div>

          {/* Live system activity strip */}
          <LiveActivityStrip />

          {/* Scrollable center content */}
          <main className="flex-1 md:overflow-y-auto">
            {/* Global Market Pulse */}
            <section className="p-4 border-b border-zinc-900/80">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                  Global Market Pulse
                </span>
                <div className="flex-1 h-px bg-zinc-900" />
                <div className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot" />
                  <span className="text-emerald-600 text-[9px] font-mono">LIVE</span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {pulseCards.map((card) => (
                  <PulseCard key={card.title} {...card} />
                ))}
              </div>
            </section>

            {/* Market Heat */}
            <MarketHeatPanel />

            {/* Market Depth */}
            <section className="pt-4 border-b border-zinc-900/80">
              <MarketDepthWidget />
            </section>

            {/* Distribution Network */}
            <DistributionBar />

            {/* Most Shared Signals */}
            <section className="border-b border-zinc-900/80">
              <MostSharedSignals />
            </section>

            {/* Provider Status */}
            <ProviderStatusPanel />

            {/* ── AI Intelligence Engine ─────────────────────────────────── */}

            {/* Global Market Regime — always-visible strip */}
            <AIRegimePanel />

            {/* AI Market Narrator */}
            <AINarrativePanel />

            {/* AI Intelligence Brief */}
            <AIBriefPanel />

            {/* Opportunity Scanner */}
            <AIOpportunityScanner />

            {/* Liquidity + Volatility — side by side on md+ */}
            <section className="border-b border-zinc-900/80">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800/40">
                <AILiquidityPanel />
                <AIVolatilityPanel />
              </div>
            </section>

            {/* Behavioural Intelligence */}
            <AIBehaviourPanel />

            {/* AI Engine Status */}
            <AIEngineStatus />

            {/* Intelligence Event Stack */}
            <EventStack />

            {/* ── Market data feeds ─────────────────────────────────────── */}

            {/* News Catalysts */}
            <NewsCatalystFeed />

            {/* Odds Movement */}
            <OddsMovementFeed />

            {/* Live Signal Feed */}
            <section className="p-4">
              <LiveSignalFeed />
            </section>

            {/* Compliance note */}
            <div className="px-4 py-3 border-t border-zinc-900/60">
              <p className="text-zinc-800 text-[9px] font-mono leading-relaxed">
                Sports Market OS provides market intelligence and analytics only. It does not accept wagers, custody funds, or execute trades.
              </p>
            </div>
          </main>
        </div>

        {/* Right panel — stacks below on mobile */}
        <div className="flex flex-col md:w-72 shrink-0 border-t md:border-t-0 md:border-l border-zinc-800/60 md:overflow-hidden">
          <AlertRail />
          <AIPanel />
          <Watchlist />
          <CreatorFeed />
        </div>
      </div>

      {/* Status strip */}
      <LiveStatusStrip />
    </TerminalRegimeWrapper>
  );
}
