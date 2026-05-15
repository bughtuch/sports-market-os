import TerminalHeader from "@/components/TerminalHeader";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import TerminalClientLayer from "@/components/TerminalClientLayer";
import Watchlist from "@/components/Watchlist";
import TerminalRegimeWrapper from "@/components/TerminalRegimeWrapper";
import LiveSignalFeed from "@/components/LiveSignalFeed";
import DataModeIndicator from "@/components/DataModeIndicator";
import DailyBriefWidget from "@/components/DailyBriefWidget";
import MobilePanelsDrawer from "@/components/MobilePanelsDrawer";

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

      {/* Status bar */}
      <div className="sticky top-0 z-30 md:static md:z-auto shrink-0">
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
            <section className="px-6 py-14 border-b border-zinc-900/80">
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-4">Active Markets</p>
              <p className="text-[96px] font-bold tabular-nums text-white num-breathe leading-none mb-4">142</p>
              <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-6">regime · volatile</p>
              <p className="font-serif text-lg text-white max-w-2xl leading-[1.65]">
                AI reads sharp-side flow accumulating across horse racing and tennis, with compression
                building in tennis and NFL totals. The market is positioning before a catalyst the
                public hasn&apos;t seen yet.
              </p>
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

    </TerminalRegimeWrapper>
  );
}
