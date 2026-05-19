import Link from "next/link";
import PublicNavBar from "@/components/PublicNavBar";
import type { Metadata } from "next";


import Footer from "@/components/Footer";
import PartnerMetricsPanel from "@/components/PartnerMetricsPanel";
import PartnerTerminalEmbed from "@/components/PartnerTerminalEmbed";
import { PARTNER_EMAIL } from "@/lib/constants/contact";

export const metadata: Metadata = {
  title: "Partner Ecosystem — Exchange + Creator Infrastructure | Sports Market OS",
  description:
    "Sports Market OS partner ecosystem. Exchange data partnerships, creator distribution network, and market intelligence infrastructure for serious sports analytics operators.",
};

const PARTNER_TRACKS = [
  {
    href: "/partners/exchanges",
    label: "Exchange Partners",
    tag: "Infrastructure",
    tagColor: "text-blue-400 border-blue-400/30",
    dotColor: "bg-blue-400",
    description:
      "Polymarket, Smarkets — read-only prediction market exchange adapter programme for intelligence infrastructure.",
    cta: "Exchange Partnership →",
  },
  {
    href: "/partners/creators",
    label: "Creator Partners",
    tag: "Distribution",
    tagColor: "text-emerald-400 border-emerald-400/30",
    dotColor: "bg-emerald-400",
    description:
      "Creator distribution network — branded intelligence exports, broadcast analytics, and audience intelligence for sports content operators.",
    cta: "Creator Partnership →",
  },
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <PublicNavBar />

      <main className="flex-1">
        {/* Hero */}
        <section className="px-6 py-12 md:py-20 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                Sports Market OS · Partner Ecosystem
              </span>
            </div>
            <div className="max-w-2xl">
              <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-4">
                Exchange data +<br />
                <span className="text-emerald-400">creator distribution.</span>
              </h1>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8">
                Sports Market OS partners with exchanges for read-only market intelligence
                data and with serious creators for structured distribution infrastructure.
                No execution, no custody — pure intelligence infrastructure.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`mailto:${PARTNER_EMAIL}`}
                  className="inline-block text-sm font-medium text-black bg-emerald-400 px-5 py-2.5 rounded-sm hover:bg-emerald-300 transition-colors"
                >
                  Apply to Partner →
                </Link>
                <Link
                  href="/partner-program"
                  className="inline-block text-sm font-mono text-zinc-400 border border-zinc-700 px-5 py-2.5 rounded-sm hover:border-zinc-500 hover:text-white transition-colors"
                >
                  Creator Program
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Partner metrics */}
        <section className="px-6 py-10 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                Network Metrics
              </span>
              <div className="flex-1 h-px bg-zinc-900" />
              <span className="text-zinc-700 text-[8px] font-mono">Live intelligence · Read-only</span>
            </div>
            <PartnerMetricsPanel />
          </div>
        </section>

        {/* Partner tracks */}
        <section className="px-6 py-10 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-6">
              Partnership Tracks
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PARTNER_TRACKS.map((track) => (
                <Link
                  key={track.href}
                  href={track.href}
                  className="group block p-5 bg-zinc-950 border border-zinc-800/60 rounded-sm hover:border-zinc-600 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${track.dotColor}`} />
                    <span className={`text-[8px] font-mono uppercase tracking-wider border px-1.5 py-0.5 rounded-sm ${track.tagColor}`}>
                      {track.tag}
                    </span>
                  </div>
                  <h2 className="text-white text-sm font-semibold mb-2 group-hover:text-zinc-200 transition-colors">
                    {track.label}
                  </h2>
                  <p className="text-zinc-500 text-[11px] leading-relaxed mb-4">
                    {track.description}
                  </p>
                  <span className="text-zinc-400 text-[10px] font-mono group-hover:text-zinc-300 transition-colors">
                    {track.cta}
                  </span>
                </Link>
              ))}
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
              <span className="text-zinc-700 text-[8px] font-mono">What partners access</span>
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
              Ready to partner?
            </p>
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              Apply to the partner ecosystem
            </h2>
            <p className="text-zinc-400 text-sm mb-8 max-w-xl mx-auto">
              Exchange data partnerships and creator distribution opportunities reviewed on application.
              Contact us with your use case and we will respond within 2 business days.
            </p>
            <Link
              href={`mailto:${PARTNER_EMAIL}`}
              className="inline-block text-sm font-medium text-black bg-emerald-400 px-8 py-3 rounded-sm hover:bg-emerald-300 transition-colors"
            >
              Contact Partner Team →
            </Link>
          </div>
        </section>

        {/* Compliance */}
        <div className="px-6 py-3 border-t border-zinc-900/60">
          <p className="text-zinc-800 text-[9px] font-mono leading-relaxed max-w-4xl mx-auto">
            Sports Market OS provides market intelligence and analytics only. It does not accept wagers, custody funds, or execute trades. All exchange data is read-only intelligence.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
