import Link from "next/link";
import type { Metadata } from "next";
import MarketTicker from "@/components/MarketTicker";
import TerminalHeader from "@/components/TerminalHeader";
import Footer from "@/components/Footer";
import PartnerMetricsPanel from "@/components/PartnerMetricsPanel";
import PartnerTerminalEmbed from "@/components/PartnerTerminalEmbed";
import { PARTNER_EMAIL } from "@/lib/constants/contact";
import { rotateNarrative, CREATOR_NARRATIVES, ENGAGEMENT_NARRATIVES } from "@/lib/partnerNarratives";

export const metadata: Metadata = {
  title: "Creator Partner Programme — Market Intelligence Distribution | Sports Market OS",
  description:
    "Sports Market OS Creator Partner Programme. Branded market intelligence exports, exchange microstructure content, AI narrative tools, and audience analytics for serious sports intelligence creators.",
};

const CREATOR_NARRATIVES_DISPLAY = [
  rotateNarrative(CREATOR_NARRATIVES, 0),
  rotateNarrative(ENGAGEMENT_NARRATIVES, 3),
];

const TIERS = [
  {
    name: "Creator",
    price: "Included",
    priceNote: "with Creator Studio",
    dotColor: "bg-zinc-400",
    features: [
      "Content Engine export tools",
      "X post + Telegram + Shorts hooks",
      "Live catalyst feed access",
      "Standard intelligence templates",
    ],
    cta: "Start Creating",
    ctaHref: "/creator-studio",
    ctaStyle: "text-zinc-900 bg-zinc-200 hover:bg-white",
  },
  {
    name: "Partner Creator",
    price: "Application",
    priceNote: "reviewed individually",
    dotColor: "bg-emerald-400",
    features: [
      "Everything in Creator",
      "Branded intelligence exports",
      "Priority exchange data access",
      "Partner analytics dashboard",
      "Co-branded content templates",
      "Creator network cross-promotion",
    ],
    cta: "Apply to Partner →",
    ctaHref: `/mailto:${PARTNER_EMAIL}?subject=Creator Partner Application`,
    ctaStyle: "text-black bg-emerald-400 hover:bg-emerald-300",
    featured: true,
  },
  {
    name: "Broadcast Partner",
    price: "Enterprise",
    priceNote: "contact for pricing",
    dotColor: "bg-amber-400",
    features: [
      "Everything in Partner Creator",
      "White-label intelligence feeds",
      "Custom exchange data integrations",
      "Dedicated account management",
      "API access for automated distribution",
      "Custom AI narrative generation",
    ],
    cta: "Enquire →",
    ctaHref: `mailto:${PARTNER_EMAIL}?subject=Broadcast Partner Enquiry`,
    ctaStyle: "text-black bg-amber-400 hover:bg-amber-300",
  },
];

const CONTENT_TYPES = [
  {
    format: "X Post",
    color: "text-zinc-300",
    description: "Exchange microstructure hook — order book depth + implied probability shift + AI narrative. Optimised for high-engagement intelligence posts.",
    example: "\"Horse Racing order book: lay-side depth 2.3× back-side on [Selection] — implied 41.2% (–3.1 vs open). Queue health 74/100.\"",
  },
  {
    format: "Telegram Brief",
    color: "text-blue-400",
    description: "Full microstructure brief — queue health, spread quality, depth imbalance, flow classification, and catalyst context. Structured for channel subscribers.",
    example: "\"📊 Exchange Intel: [Market] · Back 2.48 / Lay 2.50 (spread 0.02) · Depth imbalance: lay-heavy (–18) · Flow: institutional rotation detected · Vol: 74/100\"",
  },
  {
    format: "YouTube Shorts Hook",
    color: "text-red-400",
    description: "15-second attention hook from live catalyst + exchange flow data. High-engagement opening designed for sports intelligence content format.",
    example: "\"The order book on [Event] just shifted — here is what the exchange microstructure is showing right now…\"",
  },
];

export default function CreatorPartnersPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <MarketTicker />
      <TerminalHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="px-6 py-12 md:py-20 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                Sports Market OS · Creator Partner Programme
              </span>
            </div>
            <div className="max-w-2xl">
              <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-4">
                Market intelligence<br />
                <span className="text-emerald-400">distribution infrastructure.</span>
              </h1>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8">
                Serious sports intelligence creators use Sports Market OS to access
                exchange microstructure data, AI narrative tools, and structured
                content exports — then distribute across X, Telegram, and YouTube
                at professional scale.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/creator-studio"
                  className="inline-block text-sm font-medium text-black bg-emerald-400 px-5 py-2.5 rounded-sm hover:bg-emerald-300 transition-colors"
                >
                  Open Creator Studio →
                </Link>
                <Link
                  href={`mailto:${PARTNER_EMAIL}?subject=Creator Partner Application`}
                  className="inline-block text-sm font-mono text-zinc-400 border border-zinc-700 px-5 py-2.5 rounded-sm hover:border-zinc-500 hover:text-white transition-colors"
                >
                  Apply to Partner
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Creator intelligence context */}
        <section className="px-6 py-10 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                Creator Intelligence
              </span>
              <div className="flex-1 h-px bg-zinc-900" />
            </div>
            <div className="space-y-3">
              {CREATOR_NARRATIVES_DISPLAY.map((narrative, i) => (
                <div key={i} className="p-4 bg-zinc-950 border border-zinc-800/60 rounded-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 text-[8px] font-mono uppercase tracking-wider shrink-0 mt-0.5">
                      INTEL·{String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">{narrative}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Network metrics */}
        <section className="px-6 py-10 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-6">
              Creator Network Metrics
            </p>
            <PartnerMetricsPanel />
          </div>
        </section>

        {/* Content types */}
        <section className="px-6 py-10 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-6">
              Content Export Formats
            </p>
            <div className="space-y-4">
              {CONTENT_TYPES.map(({ format, color, description, example }) => (
                <div key={format} className="p-5 bg-zinc-950 border border-zinc-800/60 rounded-sm">
                  <p className={`text-[9px] font-mono uppercase tracking-wider mb-2 ${color}`}>{format}</p>
                  <p className="text-zinc-400 text-[11px] leading-relaxed mb-3">{description}</p>
                  <div className="p-3 bg-black border border-zinc-900 rounded-sm">
                    <p className="text-zinc-600 text-[9px] font-mono leading-relaxed">{example}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-zinc-700 text-[9px] font-mono mt-4">
              All generated content uses market intelligence language only. No betting picks, no guaranteed profit claims.
            </p>
          </div>
        </section>

        {/* Tiers */}
        <section className="px-6 py-10 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-6">
              Creator Tiers
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TIERS.map((tier) => (
                <div
                  key={tier.name}
                  className={`p-5 rounded-sm flex flex-col ${
                    tier.featured
                      ? "bg-zinc-950 border border-emerald-400/20"
                      : "bg-zinc-950 border border-zinc-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${tier.dotColor}`} />
                    <span className="text-white text-sm font-semibold">{tier.name}</span>
                  </div>
                  <p className="text-zinc-300 text-lg font-bold mb-0.5">{tier.price}</p>
                  <p className="text-zinc-600 text-[9px] font-mono mb-4">{tier.priceNote}</p>
                  <ul className="space-y-1.5 flex-1 mb-5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-1.5">
                        <span className="text-zinc-600 text-[9px] font-mono mt-0.5">›</span>
                        <span className="text-zinc-400 text-[10px] leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={tier.ctaHref}
                    className={`block text-center text-sm font-medium px-4 py-2.5 rounded-sm transition-colors ${tier.ctaStyle}`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live terminal */}
        <section className="px-6 py-10 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                What Creators Access
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
              Join the creator network
            </p>
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              Start with Creator Studio
            </h2>
            <p className="text-zinc-400 text-sm mb-8 max-w-xl mx-auto">
              Access exchange microstructure data, AI narrative tools, and content
              export infrastructure immediately. Creator Partner applications reviewed
              individually.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/creator-studio"
                className="inline-block text-sm font-medium text-black bg-emerald-400 px-8 py-3 rounded-sm hover:bg-emerald-300 transition-colors"
              >
                Open Creator Studio →
              </Link>
              <Link
                href={`mailto:${PARTNER_EMAIL}?subject=Creator Partner Application`}
                className="inline-block text-sm font-mono text-zinc-400 border border-zinc-700 px-8 py-3 rounded-sm hover:border-zinc-500 hover:text-white transition-colors"
              >
                Apply to Partner
              </Link>
            </div>
          </div>
        </section>

        {/* Compliance */}
        <div className="px-6 py-3 border-t border-zinc-900/60">
          <p className="text-zinc-800 text-[9px] font-mono leading-relaxed max-w-4xl mx-auto">
            Sports Market OS provides market intelligence and analytics only. Content generated through Creator Studio uses market intelligence language. It does not constitute betting advice, guaranteed profit signals, or execution recommendations.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
