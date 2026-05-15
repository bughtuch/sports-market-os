import MarketTicker from "@/components/MarketTicker";
import TerminalHeader from "@/components/TerminalHeader";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import TerminalClientLayer from "@/components/TerminalClientLayer";
import Watchlist from "@/components/Watchlist";
import LiveStatusStrip from "@/components/LiveStatusStrip";
import PulseCard, { type PulseCardData } from "@/components/PulseCard";
import TerminalRegimeWrapper from "@/components/TerminalRegimeWrapper";
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
    timestamp: "14:32",
    title: "Ascot 14:30 · win market",
    description:
      "Bilateral queue thinning, 14th percentile depth. Pattern last observed Cheltenham Gold Cup Trial, March 2024 — resolved within 18 minutes via stewards' review. Decay window 12 minutes.",
    confidence: 87,
    tag: "Premium",
    type: "Sharp Money",
    exchange: "Betfair",
  },
  {
    sport: "Tennis",
    timestamp: "14:29",
    title: "Djokovic vs Alcaraz · in-play",
    description:
      "Matched volume 34% above 20-day baseline while price compresses. Configuration last seen Wimbledon SF 2023 — expansion within 9 minutes. Decay window 14 minutes.",
    confidence: 74,
    tag: "Free",
    type: "Liquidity Imbalance",
    exchange: "Smarkets",
  },
  {
    sport: "NBA",
    timestamp: "14:27",
    title: "Warriors vs Lakers · under 224.5",
    description:
      "Pace regression 2.1σ below model expectation. Defensive scheme alignment historically correlates 78% with totals outcomes. Sharp consensus building on under side. Decay window 4 hours.",
    confidence: 81,
    tag: "Premium",
    type: "AI Market Thesis",
    exchange: "FanDuel",
  },
  {
    sport: "NFL",
    timestamp: "14:24",
    title: "Chiefs vs Bills · total",
    description:
      "Implied volatility compressed for three consecutive hours, no triggering catalyst. Pattern last observed Week 14 2024 KC market — resolved with 6.5-point line move within 90 minutes. Decay window 2 hours.",
    confidence: 69,
    tag: "Free",
    type: "Volatility Watch",
    exchange: "DraftKings",
  },
  {
    sport: "Horse Racing",
    timestamp: "14:21",
    title: "Cheltenham 15:15 · win market",
    description:
      "Queue depth fell below 14th percentile threshold. Bilateral thinning, not single-sided withdrawal. Configuration historically precedes stewards' decision or non-runner declaration within 22 minutes. Decay window 8 minutes.",
    confidence: 92,
    tag: "API",
    type: "Queue Health",
    exchange: "Betfair",
  },
  {
    sport: "Prediction Markets",
    timestamp: "14:18",
    title: "US presidential · YES contract",
    description:
      "Volume surge 89% above 24-hour baseline. Contract pricing diverged from prevailing polling consensus by 6.8 points. Open interest accumulation precedes catalyst window historically by 14–40 minutes. Decay window 35 minutes.",
    confidence: 78,
    tag: "Creator",
    type: "Creator Signal",
    exchange: "Polymarket",
  },
  {
    sport: "UFC",
    timestamp: "14:15",
    title: "Poirier vs Gaethje · moneyline",
    description:
      "Underdog shortening without public catalyst. Volume signature matches informed-flow pattern from UFC 281 main event, October 2022 — non-public weight-cut information confirmed 47 minutes later. Decay window 25 minutes.",
    confidence: 65,
    tag: "Free",
    type: "News Catalyst",
    exchange: "Betfair",
  },
  {
    sport: "Football",
    timestamp: "14:11",
    title: "Man City vs Arsenal · Asian handicap",
    description:
      "Cross-market flow rotating from match result into handicap markets. Institutional signature, not retail. Configuration last observed Liverpool vs City April 2024 — handicap moved 0.25 within 35 minutes. Decay window 22 minutes.",
    confidence: 72,
    tag: "Premium",
    type: "Exchange Flow",
    exchange: "Pinnacle",
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

      {/* Main layout — two columns: nav sidebar + scrolling main canvas */}
      <div className="flex flex-1 min-h-0">
        {/* Left sidebar — nav only; hidden in screenshot mode via CSS */}
        <div className="hidden md:block terminal-sidebar shrink-0">
          <Sidebar />
        </div>

        {/* Main canvas — single scrolling column */}
        <div className="flex flex-1 flex-col min-w-0 overflow-y-auto">
          {/* Filter bar */}
          <div className="sticky top-0 z-10 h-9 shrink-0 border-b border-zinc-800/60 bg-zinc-950 flex items-center justify-between px-4 terminal-filter-bar">
            <div className="flex items-center gap-3">
              <span className="text-white text-[11px] font-semibold">Live Market Intelligence</span>
              <DataModeIndicator />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
                <span className="text-emerald-400 text-[9px] font-mono">LIVE</span>
              </div>
              <MobilePanelsDrawer />
            </div>
          </div>

          <main>
            {/* ── Zone 1: Global Pulse ─────────────────────────────────── */}
            <section className="px-6 py-10 border-b border-zinc-900/80">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse-dot" />
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Global Market Pulse</span>
                <div className="flex-1 h-px bg-zinc-900" />
                <SaveWorkspaceButton />
              </div>

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
            <section className="px-6 py-8 border-b border-zinc-900/80">
              <LiveSignalFeed />
            </section>

            {/* ── Zone 4: Watchlist ────────────────────────────────────── */}
            <section className="border-b border-zinc-900/80">
              <div className="flex items-center gap-3 px-6 pt-8 mb-4">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest shrink-0">Active Watchlist</span>
                <div className="flex-1 h-px bg-zinc-900" />
              </div>
              <Watchlist />
            </section>

            {/* ── Zone 5: Ledger Snapshot ──────────────────────────────── */}
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

              <p className="mt-4 text-zinc-700 text-xs font-mono">
                Accuracy reflects signals where final outcome was determinable. Historical performance does not guarantee future results.
              </p>
            </section>

            <Footer />
          </main>
        </div>
      </div>

      {/* Status strip */}
      <LiveStatusStrip />
    </TerminalRegimeWrapper>
  );
}
