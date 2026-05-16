import type { Metadata } from "next";
import Link from "next/link";
import PublicNavBar from "@/components/PublicNavBar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About — Sports Market OS",
  description:
    "Sports Market OS is an AI-powered sports market intelligence platform operated by Bug Hutch Ltd. Learn about our mission, products, and team.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <PublicNavBar />

      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-6 py-16">

          {/* Header */}
          <div className="mb-12">
            <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-3">
              Company
            </p>
            <h1 className="text-2xl font-semibold tracking-tight mb-3">About Sports Market OS</h1>
            <p className="text-zinc-500 text-sm">
              Operated by <span className="text-zinc-300">Bug Hutch Ltd</span>
            </p>
          </div>

          <div className="space-y-10 text-sm leading-relaxed">

            {/* Mission */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                What we build
              </h2>
              <p className="text-zinc-400">
                Sports Market OS is an AI-powered intelligence terminal for sports markets. We
                aggregate odds, liquidity, and market movement data across exchanges and
                sportsbooks, then surface structured narratives, signals, and analytics — all
                in one place.
              </p>
              <p className="text-zinc-400 mt-3">
                Our platform is built for serious market observers: bettors who think in
                probabilities, analysts who track line movement, and creators who want
                institutional-grade data behind their content. We make the infrastructure, they
                make the calls.
              </p>
            </section>

            {/* Bug Hutch */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                Bug Hutch Ltd
              </h2>
              <p className="text-zinc-400">
                Bug Hutch Ltd is a software company registered in England and Wales. We build
                data and intelligence products at the intersection of sport, markets, and AI.
                Sports Market OS is our flagship platform, but not our only product.
              </p>
              <p className="text-zinc-400 mt-3">
                The company was founded by{" "}
                <span className="text-zinc-300">Lee Caston</span>, who leads product and
                engineering. Our team is small, distributed, and focused on shipping software
                that actually works.
              </p>
            </section>

            {/* Stable */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                Our stable of products
              </h2>
              <p className="text-zinc-400 mb-5">
                Bug Hutch builds vertical intelligence tools for specific sports market
                segments. Each product is purpose-built rather than retrofitted.
              </p>
              <div className="space-y-4">
                <div className="border border-zinc-900 rounded-sm p-4">
                  <p className="text-white text-sm font-medium mb-1">Sports Market OS</p>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    The flagship cross-sport intelligence terminal. AI narratives, live market
                    pulse, creator export tooling, and structured data API — covering tennis,
                    football, horse racing, NBA, NFL, UFC, and prediction markets.
                  </p>
                </div>
                <div className="border border-zinc-900 rounded-sm p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white text-sm font-medium">Tennis Trader AI</p>
                    <span className="text-[8px] font-mono text-zinc-600 border border-zinc-800 px-1.5 py-0.5 rounded-sm uppercase tracking-widest">
                      External
                    </span>
                  </div>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    A dedicated intelligence tool for in-play tennis markets. Tracks serve
                    patterns, momentum shifts, and live odds movement with sport-specific
                    depth.
                  </p>
                </div>
                <div className="border border-zinc-900 rounded-sm p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white text-sm font-medium">Horse Racing Trader</p>
                    <span className="text-[8px] font-mono text-zinc-600 border border-zinc-800 px-1.5 py-0.5 rounded-sm uppercase tracking-widest">
                      External
                    </span>
                  </div>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    Market intelligence for horse racing: weight of money, steam moves,
                    Betfair SP trends, and pre-race narrative generation.
                  </p>
                </div>
              </div>
            </section>

            {/* US expansion */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                US market
              </h2>
              <p className="text-zinc-400">
                We are actively expanding coverage of US sports markets. The platform already
                covers NBA, NFL, and prediction markets. Deeper sportsbook data integration,
                state-by-state line comparison, and US-specific creator tools are on the
                roadmap.
              </p>
              <p className="text-zinc-400 mt-3">
                If you are a US-based operator, creator, or data partner interested in early
                access, reach out via our contact form.
              </p>
            </section>

            {/* Contact CTA */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                Get in touch
              </h2>
              <p className="text-zinc-400 mb-5">
                For partnership enquiries, press, API access, or enterprise discussions,
                contact us directly.
              </p>
              <Link
                href="/contact"
                className="inline-block text-xs font-mono text-zinc-400 border border-zinc-700 px-5 py-2 rounded-sm hover:border-zinc-500 hover:text-white transition-colors"
              >
                Contact us →
              </Link>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
