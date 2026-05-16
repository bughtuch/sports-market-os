import Link from "next/link";
import PublicNavBar from "@/components/PublicNavBar";
import type { Metadata } from "next";


import Footer from "@/components/Footer";
import PartnerMetricsPanel from "@/components/PartnerMetricsPanel";
import PartnerTerminalEmbed from "@/components/PartnerTerminalEmbed";
import SportHubExchangePulse from "@/components/SportHubExchangePulse";
import { PARTNER_EMAIL } from "@/lib/constants/contact";
import {
  rotateNarrative,
  EXCHANGE_NARRATIVES,
  CREATOR_NARRATIVES,
  LIQUIDITY_NARRATIVES,
} from "@/lib/partnerNarratives";

export const metadata: Metadata = {
  title: "ProphetX Exchange Intelligence Demo | Sports Market OS",
  description:
    "ProphetX + Sports Market OS — live exchange microstructure intelligence for NFL, NBA, and prediction markets. Read-only order book depth, flow analysis, and AI narrative layer.",
};

const AI_NARRATIVES = [
  rotateNarrative(EXCHANGE_NARRATIVES, 0),
  rotateNarrative(LIQUIDITY_NARRATIVES, 2),
  rotateNarrative(CREATOR_NARRATIVES, 4),
];

const CAPABILITY_ROWS = [
  { label: "Order Book Depth",     status: "Demo",    statusColor: "text-amber-400", detail: "Simulated bid/ask depth · ProphetX normalised format" },
  { label: "Flow Analysis",        status: "Demo",    statusColor: "text-amber-400", detail: "Cross-exchange rotation detection · sharp vs retail classification" },
  { label: "Implied Probability",  status: "Active",  statusColor: "text-emerald-400", detail: "Real-time decimal conversion · no overround adjustment" },
  { label: "Queue Health",         status: "Demo",    statusColor: "text-amber-400", detail: "Back/lay depth balance score · 0–100 calibrated" },
  { label: "Spread Intelligence",  status: "Demo",    statusColor: "text-amber-400", detail: "Spread quality scoring · tight/wide classification" },
  { label: "AI Narrative Layer",   status: "Active",  statusColor: "text-emerald-400", detail: "Rotating intelligence copy · compliance-safe language" },
  { label: "Creator Export",       status: "Active",  statusColor: "text-emerald-400", detail: "X post · Telegram · YouTube Shorts hooks from live data" },
  { label: "Live WebSocket Feed",  status: "Planned", statusColor: "text-blue-400", detail: "PROPHETX_API_KEY required · pending commercial agreement" },
];

const SPORT_TARGETS = [
  { sport: "NFL",               color: "text-red-400",    note: "Game markets + futures — sharp flow detection" },
  { sport: "NBA",               color: "text-blue-400",   note: "In-play + ante-post — depth imbalance tracking" },
  { sport: "Prediction Markets",color: "text-purple-400", note: "Election / economic event contracts — vol monitoring" },
];

export default function ProphetXPartnerPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <PublicNavBar />

      <main className="flex-1">
        {/* Hero */}
        <section className="px-6 py-12 md:py-20 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 pulse-dot" />
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                Sports Market OS · ProphetX Integration · Demo Mode
              </span>
            </div>
            <div className="max-w-2xl">
              <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-4">
                ProphetX exchange<br />
                <span className="text-amber-400">intelligence layer.</span>
              </h1>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-6">
                Sports Market OS reads ProphetX order book data for market microstructure
                intelligence — NFL, NBA, and prediction market depth, flow, and queue
                health analysis. Read-only. No order routing. No execution.
              </p>
              <div className="flex items-center gap-3 flex-wrap mb-8">
                <span className="text-[8px] font-mono uppercase tracking-wider px-2 py-1 border border-amber-400/30 text-amber-400 rounded-sm">
                  Demo Mode Active
                </span>
                <span className="text-[8px] font-mono uppercase tracking-wider px-2 py-1 border border-zinc-700 text-zinc-500 rounded-sm">
                  Live: Pending API Agreement
                </span>
                <span className="text-[8px] font-mono uppercase tracking-wider px-2 py-1 border border-blue-400/30 text-blue-400 rounded-sm">
                  Read-Only Intelligence
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`mailto:${PARTNER_EMAIL}?subject=ProphetX Exchange Partnership Enquiry`}
                  className="inline-block text-sm font-medium text-black bg-amber-400 px-5 py-2.5 rounded-sm hover:bg-amber-300 transition-colors"
                >
                  Enquire About Integration →
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

        {/* Live Exchange Pulse — NBA + NFL + Prediction Markets */}
        <section className="px-6 py-10 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                Live Exchange Pulse · ProphetX Markets
              </span>
              <div className="flex-1 h-px bg-zinc-900" />
              <span className="text-zinc-700 text-[8px] font-mono">Simulation mode · normalised to ProphetX format</span>
            </div>
            <div className="space-y-4">
              {SPORT_TARGETS.map(({ sport, color, note }) => (
                <div key={sport}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[9px] font-mono uppercase tracking-widest ${color}`}>{sport}</span>
                    <span className="text-zinc-700 text-[9px] font-mono">— {note}</span>
                  </div>
                  <SportHubExchangePulse
                    sport={
                      sport === "NFL" ? "NFL"
                      : sport === "NBA" ? "NBA"
                      : "Prediction Markets"
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Intelligence Layer */}
        <section className="px-6 py-10 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                AI Intelligence Layer
              </span>
              <div className="flex-1 h-px bg-zinc-900" />
              <span className="text-zinc-700 text-[8px] font-mono">Rotating narratives · compliance-safe</span>
            </div>
            <div className="space-y-3">
              {AI_NARRATIVES.map((narrative, i) => (
                <div key={i} className="p-4 bg-zinc-950 border border-zinc-800/60 rounded-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400 text-[8px] font-mono uppercase tracking-wider shrink-0 mt-0.5">
                      AI·{String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">{narrative}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Creator Distribution */}
        <section className="px-6 py-10 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                Creator Distribution Layer
              </span>
              <div className="flex-1 h-px bg-zinc-900" />
              <span className="text-zinc-700 text-[8px] font-mono">ProphetX data → creator network</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { format: "X Post", note: "Order book depth hook + implied probability + AI narrative", color: "text-zinc-300" },
                { format: "Telegram", note: "Full microstructure brief — queue health, spread, flow classification", color: "text-blue-400" },
                { format: "YouTube Shorts", note: "15-second hook from live catalyst + ProphetX flow data", color: "text-red-400" },
              ].map(({ format, note, color }) => (
                <div key={format} className="p-4 bg-zinc-950 border border-zinc-800/60 rounded-sm">
                  <p className={`text-[9px] font-mono uppercase tracking-wider mb-2 ${color}`}>{format}</p>
                  <p className="text-zinc-500 text-[10px] leading-relaxed">{note}</p>
                </div>
              ))}
            </div>
            <p className="text-zinc-700 text-[9px] font-mono mt-4">
              All content uses market intelligence language only. No betting advice, no guaranteed profit claims.
            </p>
          </div>
        </section>

        {/* Partnership Metrics */}
        <section className="px-6 py-10 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-6">
              Partnership Network Metrics
            </p>
            <PartnerMetricsPanel />
          </div>
        </section>

        {/* Capability table */}
        <section className="px-6 py-10 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-4">
              Integration Capabilities
            </p>
            <div className="border border-zinc-800/60 rounded-sm overflow-hidden">
              {CAPABILITY_ROWS.map((row, i) => (
                <div
                  key={row.label}
                  className={`flex items-center gap-4 px-4 py-3 text-[11px] ${
                    i < CAPABILITY_ROWS.length - 1 ? "border-b border-zinc-900/60" : ""
                  }`}
                >
                  <span className="text-zinc-400 min-w-[140px]">{row.label}</span>
                  <span className={`text-[8px] font-mono uppercase tracking-wider min-w-[48px] ${row.statusColor}`}>
                    {row.status}
                  </span>
                  <span className="text-zinc-600 text-[10px]">{row.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live terminal embed */}
        <section className="px-6 py-10 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                Live Terminal Preview
              </span>
              <div className="flex-1 h-px bg-zinc-900" />
            </div>
            <div className="max-w-sm">
              <PartnerTerminalEmbed />
            </div>
          </div>
        </section>

        {/* Future Integration */}
        <section className="px-6 py-10 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-6">
              Live Integration Roadmap
            </p>
            <div className="space-y-3">
              {[
                { step: "01", label: "Commercial API Agreement", note: "ProphetX API key + secret via partner agreement" },
                { step: "02", label: "WebSocket Feed Subscription", note: "Order book updates normalised to back/lay internal format" },
                { step: "03", label: "Sport Type Mapping", note: "ProphetX market types → internal SportType (americanfootball, basketball, prediction)" },
                { step: "04", label: "sourceMode: \"live\" Activation", note: "Set PROPHETX_API_KEY + PROPHETX_READONLY_MODE=true in environment" },
                { step: "05", label: "Creator Distribution Sync", note: "ProphetX flow data feeds Content Engine and Creator Studio exports" },
              ].map(({ step, label, note }) => (
                <div key={step} className="flex items-start gap-4 p-4 bg-zinc-950 border border-zinc-800/60 rounded-sm">
                  <span className="text-zinc-700 text-[9px] font-mono shrink-0 mt-0.5">{step}</span>
                  <div>
                    <p className="text-zinc-300 text-[11px] font-medium mb-0.5">{label}</p>
                    <p className="text-zinc-600 text-[10px]">{note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-12 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest mb-4">
              ProphetX partnership
            </p>
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              Interested in live ProphetX integration?
            </h2>
            <p className="text-zinc-400 text-sm mb-8 max-w-xl mx-auto">
              Contact us to discuss the commercial API agreement and integration timeline.
              The adapter infrastructure is built — we are waiting on API access.
            </p>
            <Link
              href={`mailto:${PARTNER_EMAIL}?subject=ProphetX Exchange Partnership Enquiry`}
              className="inline-block text-sm font-medium text-black bg-amber-400 px-8 py-3 rounded-sm hover:bg-amber-300 transition-colors"
            >
              Contact Partner Team →
            </Link>
          </div>
        </section>

        {/* Compliance */}
        <div className="px-6 py-3 border-t border-zinc-900/60">
          <p className="text-zinc-800 text-[9px] font-mono leading-relaxed max-w-4xl mx-auto">
            Exchange data is displayed for market intelligence only. Sports Market OS does not execute trades, place wagers, or custody funds. ProphetX integration is read-only price feed intelligence.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
