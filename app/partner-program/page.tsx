import Link from "next/link";
import type { Metadata } from "next";
import MarketTicker from "@/components/MarketTicker";
import TerminalHeader from "@/components/TerminalHeader";
import PlanBadge from "@/components/PlanBadge";
import Footer from "@/components/Footer";
import { PARTNER_EMAIL } from "@/lib/constants/contact";

export const metadata: Metadata = {
  title: "Partner Program — Creator Distribution Infrastructure | Sports Market OS",
  description:
    "Sports Market OS Partner Program. Creator distribution network, branded analytics exports, broadcast infrastructure, and partner analytics for market intelligence creators.",
};

export default function PartnerProgramPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <MarketTicker />
      <TerminalHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="px-6 py-12 md:py-20 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 pulse-dot" />
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                Sports Market OS · Partner Program
              </span>
            </div>
            <div className="max-w-2xl">
              <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-4">
                Creator distribution<br />
                <span className="text-amber-400">infrastructure.</span>
              </h1>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8">
                Sports Market OS Partner gives serious market intelligence creators
                the distribution, analytics, and broadcast tooling to build a
                professional audience — without building the infrastructure.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/pricing#partner"
                  className="inline-block text-sm font-medium text-black bg-amber-400 px-5 py-2.5 rounded-sm hover:bg-amber-300 transition-colors"
                >
                  Become a Partner →
                </Link>
                <Link
                  href="/pricing"
                  className="inline-block text-sm font-mono text-zinc-400 border border-zinc-700 px-5 py-2.5 rounded-sm hover:border-zinc-500 hover:text-white transition-colors"
                >
                  View pricing
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="px-6 py-6 border-b border-zinc-900/80 bg-zinc-950/40">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Active creators",   value: "486",   sub: "posts today" },
              { label: "Markets covered",   value: "248",   sub: "live tracked" },
              { label: "Export formats",    value: "4",     sub: "channels" },
              { label: "Network reach",     value: "12K+",  sub: "audience est." },
            ].map((s) => (
              <div key={s.label} className="border border-zinc-800/60 rounded-sm p-4 bg-zinc-950">
                <p className="text-xl font-bold text-amber-400 tabular-nums">{s.value}</p>
                <p className="text-zinc-400 text-[11px] mt-0.5">{s.label}</p>
                <p className="text-zinc-700 text-[9px] font-mono mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="px-6 py-12 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-8">
              How the partner model works
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  step: "01",
                  title: "AI generates the intelligence",
                  body:  "Our AI engine continuously scans market structure, liquidity, volatility, and behavioural signals — surfacing institutional-grade insights automatically.",
                },
                {
                  step: "02",
                  title: "You distribute the signal",
                  body:  "Partner tools turn AI outputs into branded share cards, export batches, and channel-ready content for Telegram, X, Discord, and your own properties.",
                },
                {
                  step: "03",
                  title: "Analytics close the loop",
                  body:  "Partner analytics show reach, engagement, export performance, and audience growth — so you can refine your distribution strategy with real data.",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="border border-zinc-800/60 rounded-sm bg-zinc-950 p-5"
                >
                  <span className="text-amber-400/40 text-xs font-mono">{s.step}</span>
                  <h3 className="text-zinc-200 text-sm font-semibold mt-2 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-zinc-500 text-[11px] leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-12 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-8">
              Partner plan features
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "Creator Distribution Network",
                  desc:  "Publish AI-generated market intelligence directly to your audience channels. Structured export queue, scheduling, and channel management.",
                  badge: null,
                },
                {
                  title: "Branded Export Tooling",
                  desc:  "Customise share cards, add your handle, control the visual identity of AI-generated market insights you distribute.",
                  badge: null,
                },
                {
                  title: "Partner Analytics Dashboard",
                  desc:  "Track export performance, audience reach, signal engagement rates, and distribution effectiveness across all your channels.",
                  badge: null,
                },
                {
                  title: "Priority Signal Routing",
                  desc:  "Partner accounts receive market signals with lower latency — critical in fast-moving markets where timing determines reach.",
                  badge: null,
                },
                {
                  title: "Broadcast Infrastructure",
                  desc:  "Full broadcast pipeline: generate, queue, schedule, and distribute market intelligence at scale without building your own tooling.",
                  badge: null,
                },
                {
                  title: "Advanced Volatility Analytics",
                  desc:  "Deep volatility regime analysis, IV compression/expansion detection, and historical volatility comparisons unavailable on the free tier.",
                  badge: null,
                },
                {
                  title: "Telegram / X / Discord Integrations",
                  desc:  "Native integrations push AI-generated market intelligence to your community channels automatically.",
                  badge: "soon" as const,
                },
                {
                  title: "Referral Commissions",
                  desc:  "Partners earn a revenue share commission for referring new platform users and API subscribers.",
                  badge: "soon" as const,
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="border border-zinc-800/60 rounded-sm bg-zinc-950 p-5"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-zinc-200 text-[11px] font-semibold leading-snug">
                      {f.title}
                    </h3>
                    {f.badge && <PlanBadge plan={f.badge} />}
                  </div>
                  <p className="text-zinc-500 text-[10px] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section className="px-6 py-10 border-b border-zinc-900/80">
          <div className="max-w-4xl mx-auto">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-6">
              Distribution channels
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: "Telegram",  status: "coming soon", color: "text-blue-400" },
                { name: "X / Twitter", status: "coming soon", color: "text-zinc-300" },
                { name: "Discord",   status: "coming soon", color: "text-purple-400" },
                { name: "Web embed", status: "planned",      color: "text-zinc-400" },
              ].map((c) => (
                <div
                  key={c.name}
                  className="border border-zinc-800/60 rounded-sm bg-zinc-950 p-4"
                >
                  <p className={`text-[11px] font-medium ${c.color}`}>{c.name}</p>
                  <p className="text-zinc-700 text-[9px] font-mono mt-1">{c.status}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Positioning */}
        <section className="px-6 py-10 border-b border-zinc-900/80 bg-amber-400/5">
          <div className="max-w-2xl mx-auto">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-6">
              Platform positioning
            </p>
            <div className="space-y-4">
              {[
                "Market intelligence infrastructure — not a tipster service.",
                "Creator-first distribution model — you own your audience.",
                "AI-generated analytics framed as structural market analysis only.",
                "Compliance-first: all outputs framed as intelligence, not betting advice.",
                "Institutional aesthetic designed for serious market followers.",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <span className="text-amber-400 text-[10px] font-mono mt-0.5 shrink-0">›</span>
                  <p className="text-zinc-300 text-[11px] leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-14">
          <div className="max-w-xl mx-auto text-center">
            <PlanBadge plan="partner" size="sm" />
            <h2 className="text-xl font-bold mt-5 mb-3">
              Ready to join the partner network?
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Partner billing activates soon. Create a free account now and
              you&apos;ll be first in line when the Partner tier opens.
              Set up your referral tracking in the partner dashboard.
            </p>

            {/* Attribution explanation */}
            <div className="text-left mb-6 p-4 bg-zinc-950 border border-zinc-800/60 rounded-sm">
              <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-3">
                How Partner Attribution Works
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Clicks",       note: "Tracked when someone visits via your referral link" },
                  { label: "Signups",      note: "Attributed when a referred visitor creates an account" },
                  { label: "Exports",      note: "Tracked when a referred user exports content" },
                  { label: "API Referrals", note: "Recorded when a referred user accesses the API" },
                ].map(({ label, note }) => (
                  <div key={label}>
                    <p className="text-zinc-300 text-[10px] font-medium mb-0.5">{label}</p>
                    <p className="text-zinc-600 text-[9px] leading-relaxed">{note}</p>
                  </div>
                ))}
              </div>
              <p className="text-zinc-700 text-[9px] font-mono mt-4">
                Commission infrastructure activates after billing integration. No earnings guaranteed.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/partner-dashboard"
                className="inline-block text-sm font-medium text-black bg-amber-400 px-6 py-2.5 rounded-sm hover:bg-amber-300 transition-colors"
              >
                Create Partner Dashboard →
              </Link>
              <Link
                href="/signup"
                className="inline-block text-sm font-medium text-zinc-400 border border-zinc-700 px-6 py-2.5 rounded-sm hover:border-zinc-500 hover:text-white transition-colors"
              >
                Create free account →
              </Link>
              <Link
                href="/pricing"
                className="inline-block text-sm font-mono text-zinc-400 border border-zinc-700 px-5 py-2.5 rounded-sm hover:border-zinc-500 hover:text-white transition-colors"
              >
                See Partner pricing
              </Link>
            </div>
          </div>
        </section>

        {/* Enterprise contact CTA */}
        <section className="px-6 py-10 border-t border-zinc-900/60">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-3">
              Enterprise &amp; Institutional
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              Building at scale? We offer custom distribution infrastructure and white-label tooling for institutional creators.
            </p>
            <Link
              href="/contact"
              className="inline-block text-xs font-mono text-zinc-400 border border-zinc-700 px-5 py-2 rounded-sm hover:border-zinc-500 hover:text-white transition-colors"
            >
              Contact us →
            </Link>
            <p className="text-zinc-700 text-[9px] font-mono mt-3">{PARTNER_EMAIL}</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
