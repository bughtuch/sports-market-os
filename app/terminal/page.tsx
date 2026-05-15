import MarketTicker from "@/components/MarketTicker";
import TerminalHeader from "@/components/TerminalHeader";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import TerminalClientLayer from "@/components/TerminalClientLayer";
import AIPanel from "@/components/AIPanel";
import Watchlist from "@/components/Watchlist";
import CreatorFeed from "@/components/CreatorFeed";
import LiveStatusStrip from "@/components/LiveStatusStrip";
import PulseCard, { type PulseCardData } from "@/components/PulseCard";
import TerminalRegimeWrapper from "@/components/TerminalRegimeWrapper";
import AlertRail from "@/components/AlertRail";
import LiveActivityStrip from "@/components/LiveActivityStrip";
import LiveSignalFeed from "@/components/LiveSignalFeed";
import DataModeIndicator from "@/components/DataModeIndicator";
import SaveWorkspaceButton from "@/components/SaveWorkspaceButton";
import DailyBriefWidget from "@/components/DailyBriefWidget";
import MobilePanelsDrawer from "@/components/MobilePanelsDrawer";

// ─── Global pulse data ────────────────────────────────────────────────────────

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

// ─── Signal feed reference data ───────────────────────────────────────────────
// Live data served by LiveSignalFeed via /api/live/signals — this is fallback copy.

const feedCards = [
  {
    sport: "Horse Racing",
    timestamp: "14:32:08",
    title: "ASCOT · SHARP MONEY · BETFAIR",
    description:
      "Unmatched lay liability appearing on the 2.40. Queue structure deteriorating from the top. Historically, this pattern has preceded a 15–25% price contraction in the 10 minutes before race off.",
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
    title: "DJOKOVIC v ALCARAZ · LIQUIDITY IMBALANCE · SMARKETS",
    description:
      "Matched volume 34% above the 20-day mean with price compression intact. Analogous to Wimbledon 2023 R4 where compression resolved in a 2.8σ expansion within 22 minutes.",
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
    title: "WARRIORS v LAKERS · SPREAD · FANDUEL",
    description:
      "Pace-of-play regression and defensive scheme weighting aligns AI projection with sharp-side consensus. Under 218.5 showing consistent pressure across three books.",
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
    title: "CHIEFS v BILLS · TOTALS VOLATILITY · DRAFTKINGS",
    description:
      "Implied volatility contracting on the totals for three consecutive hours without a triggering event. The 2022 divisional round showed identical compression before a 7-point line move.",
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
    title: "CHELTENHAM · QUEUE HEALTH · BETFAIR",
    description:
      "Queue depth on the 3:15 at Cheltenham fell to 38% of the pre-race average 18 minutes out. Not consistent with normal pre-race withdrawal patterns.",
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
    title: "US ELECTION · CONTRACT DIVERGENCE · POLYMARKET",
    description:
      "Democratic nominee contract sitting 6.8 points above the final polling aggregate. Divergence has exceeded the margin where arbitrage historically closes within 48 hours.",
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
    title: "POIRIER v GAETHJE · NEWS CATALYST · BETFAIR",
    description:
      "Underdog shortening 12% without matching public volume. Pattern is consistent with informed positioning responding to weight-cut information not yet in public domain.",
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
    title: "PREMIER LEAGUE · EXCHANGE FLOW · PINNACLE",
    description:
      "Liquidity migrating from Asian handicap into match result markets. Volume and timing pattern matches institutional rebalancing, not retail activity.",
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
      {/* Client-side layer: welcome overlay + keyboard shortcuts */}
      <TerminalClientLayer />

      {/* Top bars — sticky on mobile so they stay visible while scrolling */}
      <div className="sticky top-0 z-30 md:static md:z-auto shrink-0">
        <MarketTicker />
        <TerminalHeader />
      </div>

      {/* Main layout */}
      <div className="flex flex-1 flex-col md:flex-row md:overflow-hidden">
        {/* Sidebar — hidden on mobile; hidden in screenshot mode via CSS */}
        <div className="hidden md:block terminal-sidebar">
          <Sidebar />
        </div>

        {/* Center column */}
        <div className="flex flex-1 flex-col md:overflow-hidden">
          {/* Feed filter bar */}
          <div className="h-9 shrink-0 border-b border-zinc-800/60 bg-zinc-950 flex items-center justify-between px-4 terminal-filter-bar">
            <div className="flex items-center gap-3">
              <span className="text-white text-[11px] font-semibold">Live Market Intelligence</span>
              <DataModeIndicator />
            </div>
            <div className="flex items-center gap-3">
              {["All Sports", "Free", "Premium", "API"].map((f, i) => (
                <button
                  key={f}
                  className={`hidden sm:block text-[9px] font-mono uppercase tracking-wider transition-colors ${
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
              <span className="hidden lg:block text-zinc-800 text-[9px] font-mono" title="Toggle screenshot mode">
                Alt+S
              </span>
              {/* Mobile: open panels drawer */}
              <MobilePanelsDrawer />
            </div>
          </div>

          {/* Live system activity strip */}
          <div className="terminal-activity-strip">
            <LiveActivityStrip />
          </div>

          {/* Scrollable center content */}
          <main className="flex-1 md:overflow-y-auto">

            {/* ── Zone 1: Global Pulse ─────────────────────────────────── */}
            <section className="px-6 py-10 border-b border-zinc-900/80">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse-dot" />
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Global Market Pulse</span>
                <div className="flex-1 h-px bg-zinc-900" />
                <SaveWorkspaceButton />
              </div>

              {/* Hero metric */}
              <div className="mb-8">
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-2">Active Markets</p>
                <p className="text-6xl md:text-7xl font-bold tabular-nums text-white num-breathe leading-none mb-3">142</p>
                <p className="text-zinc-500 text-sm font-mono">
                  Regime:{" "}
                  <span className="font-semibold" style={{ color: "var(--accent)" }}>VOLATILE</span>
                  {" "}· AI reads sharp-side flow accumulating across horse racing and tennis
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {pulseCards.map((card) => (
                  <PulseCard key={card.title} {...card} />
                ))}
              </div>
            </section>

            {/* ── Zone 2: Today's Brief ────────────────────────────────── */}
            <section className="px-6 py-8 border-b border-zinc-900/80">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest shrink-0">Today&apos;s Intelligence Brief</span>
                <div className="flex-1 h-px bg-zinc-900" />
              </div>
              <DailyBriefWidget />
            </section>

            {/* ── Zone 3: Signal Feed ──────────────────────────────────── */}
            <section className="px-4 py-6 border-b border-zinc-900/80">
              <LiveSignalFeed />
            </section>

            {/* ── Zone 4: Ledger Snapshot ──────────────────────────────── */}
            <section className="px-6 py-8 border-b border-zinc-900/80">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest shrink-0">Ledger Snapshot</span>
                <div className="flex-1 h-px bg-zinc-900" />
                <span className="text-[9px] font-mono text-zinc-700">Last 7 days</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Signal Accuracy", value: "76%", sub: "Last 7 days", accent: true },
                  { label: "Signals Issued",  value: "284",  sub: "This week" },
                  { label: "Avg Confidence",  value: "79%",  sub: "Weighted mean" },
                  { label: "High-conf Calls", value: "41",   sub: "≥ 85% confidence" },
                ].map((stat) => (
                  <div key={stat.label} className="border border-zinc-900 rounded-[8px] p-4">
                    <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-2">{stat.label}</p>
                    <p
                      className="text-3xl font-bold tabular-nums leading-none mb-1"
                      style={{ color: stat.accent ? "var(--accent)" : "white" }}
                    >
                      {stat.value}
                    </p>
                    <p className="text-zinc-600 text-[10px] font-mono">{stat.sub}</p>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-zinc-700 text-[9px] font-mono">
                Accuracy reflects signals where final outcome was determinable. Historical performance does not guarantee future results.
              </p>
            </section>

            <Footer />
          </main>
        </div>

        {/* Right panel — desktop only; mobile uses MobilePanelsDrawer */}
        <div className="hidden md:flex flex-col md:w-72 shrink-0 md:border-l border-zinc-800/60 md:overflow-hidden">
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
