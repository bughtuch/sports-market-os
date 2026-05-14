import Link from "next/link";
import type { Metadata } from "next";
import MarketTicker from "@/components/MarketTicker";
import TerminalHeader from "@/components/TerminalHeader";
import Footer from "@/components/Footer";
import PartnerTerminalEmbed from "@/components/PartnerTerminalEmbed";
import { PARTNER_EMAIL } from "@/lib/constants/contact";

export const metadata: Metadata = {
  title: "Exchange Partnership Programme | Sports Market OS",
  description:
    "Sports Market OS exchange partnership programme — read-only market data integration for Betfair, ProphetX, Smarkets, Kalshi, and Polymarket. Order book intelligence, no execution.",
};

const EXCHANGES = [
  {
    name: "Betfair",
    status: "Planned",
    statusColor: "text-amber-400 border-amber-400/30",
    sports: ["Horse Racing", "Tennis", "Football"],
    method: "Exchange Streaming API (ESA) WebSocket",
    note: "Set BETFAIR_APP_KEY + BETFAIR_SESSION_TOKEN + BETFAIR_READONLY_MODE=true",
  },
  {
    name: "ProphetX",
    status: "Planned",
    statusColor: "text-amber-400 border-amber-400/30",
    sports: ["NFL", "NBA", "Prediction Markets"],
    method: "REST + WebSocket feed",
    note: "Pending commercial API agreement — PROPHETX_API_KEY + PROPHETX_READONLY_MODE=true",
  },
  {
    name: "Smarkets",
    status: "Planned",
    statusColor: "text-blue-400 border-blue-400/30",
    sports: ["Horse Racing", "Tennis", "Football"],
    method: "REST + WebSocket (similar to Betfair)",
    note: "Adapter stub ready — API access required",
  },
  {
    name: "Polymarket",
    status: "Planned",
    statusColor: "text-blue-400 border-blue-400/30",
    sports: ["Prediction Markets"],
    method: "CLOB API",
    note: "Decentralised order book — no custody interaction required",
  },
  {
    name: "Kalshi",
    status: "Planned",
    statusColor: "text-blue-400 border-blue-400/30",
    sports: ["Prediction Markets"],
    method: "REST API",
    note: "US regulated prediction markets — read-only price feed",
  },
  {
    name: "Pinnacle",
    status: "Planned",
    statusColor: "text-purple-400 border-purple-400/30",
    sports: ["All major sports"],
    method: "Read-only price feed",
    note: "Sharp market reference — closing line intelligence",
  },
];

const WHAT_WE_READ = [
  "Best available back / lay prices per runner or selection",
  "Available-to-back / available-to-lay order book depth (3–5 levels)",
  "Total matched volume (market liquidity reference)",
  "Runner / market status (Active, Suspended, Closed)",
  "In-play flag and event metadata",
  "Implied probability from decimal prices",
];

const WHAT_WE_NEVER_DO = [
  "Place bets, wagers, or orders (placeOrders never called)",
  "Cancel or modify existing orders",
  "Read account balance or transaction history",
  "Store or relay customer session tokens",
  "Route orders between exchanges",
  "Provide execution advice or guaranteed profit signals",
];

export default function ExchangePartnersPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <MarketTicker />
      <TerminalHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="px-6 py-12 md:py-20 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 pulse-dot" />
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                Sports Market OS · Exchange Partnership Programme
              </span>
            </div>
            <div className="max-w-2xl">
              <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-4">
                Read-only exchange<br />
                <span className="text-blue-400">intelligence infrastructure.</span>
              </h1>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8">
                Sports Market OS integrates with exchanges exclusively for market
                microstructure intelligence — order book depth, liquidity analysis,
                and flow detection. All adapters are read-only. We never place orders,
                route execution, or touch customer funds.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`mailto:${PARTNER_EMAIL}?subject=Exchange Data Partnership Enquiry`}
                  className="inline-block text-sm font-medium text-black bg-blue-400 px-5 py-2.5 rounded-sm hover:bg-blue-300 transition-colors"
                >
                  Discuss Exchange Partnership →
                </Link>
                <Link
                  href="/partners"
                  className="inline-block text-sm font-mono text-zinc-400 border border-zinc-700 px-5 py-2.5 rounded-sm hover:border-zinc-500 hover:text-white transition-colors"
                >
                  ← Partner Ecosystem
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Exchange roster */}
        <section className="px-6 py-10 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-6">
              Exchange Adapter Roster
            </p>
            <div className="space-y-3">
              {EXCHANGES.map((ex) => (
                <div key={ex.name} className="p-4 bg-zinc-950 border border-zinc-800/60 rounded-sm">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-white text-sm font-semibold">{ex.name}</span>
                      <span className={`text-[8px] font-mono uppercase tracking-wider border px-1.5 py-0.5 rounded-sm ${ex.statusColor}`}>
                        {ex.status}
                      </span>
                    </div>
                    <span className="text-zinc-600 text-[9px] font-mono shrink-0">{ex.method}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {ex.sports.map((s) => (
                      <span key={s} className="text-zinc-600 text-[8px] font-mono px-1.5 py-0.5 border border-zinc-800 rounded-sm">
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="text-zinc-700 text-[9px] font-mono">{ex.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What we read / what we never do */}
        <section className="px-6 py-10 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-[9px] font-mono text-emerald-600 uppercase tracking-widest mb-4">
                What We Read (Read-Only Intelligence)
              </p>
              <ul className="space-y-2">
                {WHAT_WE_READ.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-emerald-700 text-[9px] font-mono mt-0.5">✓</span>
                    <span className="text-zinc-400 text-[11px] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[9px] font-mono text-red-600 uppercase tracking-widest mb-4">
                What We Never Do
              </p>
              <ul className="space-y-2">
                {WHAT_WE_NEVER_DO.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-red-700 text-[9px] font-mono mt-0.5">✗</span>
                    <span className="text-zinc-400 text-[11px] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Data flow */}
        <section className="px-6 py-10 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-6">
              Data Architecture (Inbound Only)
            </p>
            <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-6 font-mono text-[10px]">
              <div className="space-y-2 text-zinc-400">
                {[
                  "Exchange API (read-only subscription)",
                  "↓",
                  "ExchangeAdapter (normalise → ExchangeMarket / ExchangeOrderBook)",
                  "↓",
                  "exchangeRouter.ts (merge + mode selection)",
                  "↓",
                  "/api/exchange/* (GET only · no-store · readOnly: true in every response)",
                  "↓",
                  "Client components (ExchangeFlowPanel · OrderBookPreview · LiquiditySnapshotCards)",
                  "↓",
                  "Creator Studio / Content Engine / Partner terminal embeds",
                ].map((line, i) => (
                  <p key={i} className={line === "↓" ? "text-zinc-700 pl-4" : ""}>{line}</p>
                ))}
              </div>
              <p className="text-zinc-700 mt-4 text-[9px]">
                All data flows inbound only. There are no outbound order routes in this codebase.
              </p>
            </div>
          </div>
        </section>

        {/* Live terminal embed */}
        <section className="px-6 py-10 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                Live Intelligence Preview
              </span>
              <div className="flex-1 h-px bg-zinc-900" />
            </div>
            <div className="max-w-sm">
              <PartnerTerminalEmbed />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-12 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest mb-4">
              Exchange data partnership
            </p>
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              Want your exchange data in the intelligence layer?
            </h2>
            <p className="text-zinc-400 text-sm mb-8 max-w-xl mx-auto">
              If you are an exchange or data provider interested in distributing read-only
              market intelligence through Sports Market OS, contact us to discuss the
              adapter integration.
            </p>
            <Link
              href={`mailto:${PARTNER_EMAIL}?subject=Exchange Data Partnership Enquiry`}
              className="inline-block text-sm font-medium text-black bg-blue-400 px-8 py-3 rounded-sm hover:bg-blue-300 transition-colors"
            >
              Contact Partner Team →
            </Link>
          </div>
        </section>

        {/* Compliance */}
        <div className="px-6 py-3 border-t border-zinc-900/60">
          <p className="text-zinc-800 text-[9px] font-mono leading-relaxed max-w-4xl mx-auto">
            Exchange data is displayed for market intelligence only. Sports Market OS does not execute trades, place wagers, or custody funds. All exchange integrations are read-only price feed intelligence.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
