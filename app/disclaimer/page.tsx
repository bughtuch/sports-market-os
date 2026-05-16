import type { Metadata } from "next";
import PublicNavBar from "@/components/PublicNavBar";


import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Disclaimer — Sports Market OS",
  description:
    "Full disclaimer for Sports Market OS. Informational analytics platform only. No betting, no financial advice, no execution.",
};

const EFFECTIVE_DATE = "1 January 2026";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <PublicNavBar />

      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-6 py-16">

          {/* Header */}
          <div className="mb-12">
            <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-3">
              Legal
            </p>
            <h1 className="text-2xl font-semibold tracking-tight mb-3">Disclaimer</h1>
            <p className="text-zinc-500 text-sm">
              Effective date: {EFFECTIVE_DATE}
            </p>
            <p className="text-zinc-500 text-sm mt-1">
              Operated by <span className="text-zinc-300">Bug Hutch Ltd</span>
            </p>
          </div>

          {/* Key statement */}
          <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-5 mb-10">
            <p className="text-zinc-300 text-sm leading-relaxed font-medium">
              Sports Market OS is a market intelligence and analytics platform. It is not a
              sportsbook, betting exchange, financial services provider, or investment platform.
              No wagers are accepted. No trades are executed. No funds are held.
            </p>
          </div>

          <div className="space-y-10 text-sm leading-relaxed">

            {/* 1 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                Analytics Platform Only
              </h2>
              <p className="text-zinc-400">
                Sports Market OS provides market intelligence data, AI-generated analytical
                outputs, liquidity signals, volatility metrics, and informational market
                narratives. These outputs are designed for research and informational purposes
                only and are not intended to direct, inform, or facilitate any wagering, trading,
                or investment activity.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                No Sportsbook or Betting Functionality
              </h2>
              <p className="text-zinc-400">
                The Platform contains no mechanism to place, accept, or process any wager or bet.
                Bug Hutch Ltd does not hold, has not applied for, and does not operate under any
                gambling licence in the United Kingdom, Republic of Ireland, or any other
                jurisdiction.
              </p>
              <p className="text-zinc-400 mt-3">
                References to betting exchanges (such as Betfair, Betdaq, or Smarkets),
                odds, or market prices are informational only. The Platform does not connect to,
                interface with, or interact with any betting exchange on a user&apos;s behalf.
              </p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                No Custody of Funds
              </h2>
              <p className="text-zinc-400">
                Bug Hutch Ltd does not hold, process, or custody any user funds. No payment
                or financial transaction takes place through the Platform beyond subscription
                fees for access to analytics features. Subscription payments are processed
                by Stripe and are subject to Stripe&apos;s terms of service.
              </p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                No Guarantees on Data Accuracy
              </h2>
              <p className="text-zinc-400">
                Market data, signals, and AI-generated outputs on the Platform may be:
              </p>
              <ul className="mt-3 space-y-2 text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600 mt-0.5 shrink-0">›</span>
                  <span>Simulated or generated for demonstration purposes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600 mt-0.5 shrink-0">›</span>
                  <span>Delayed relative to live market conditions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600 mt-0.5 shrink-0">›</span>
                  <span>Incomplete, inaccurate, or based on imperfect models</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600 mt-0.5 shrink-0">›</span>
                  <span>Generated by AI systems that may produce errors</span>
                </li>
              </ul>
              <p className="text-zinc-400 mt-3">
                Bug Hutch Ltd makes no representation that any output from the Platform is
                accurate, complete, timely, or suitable for any purpose.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                Simulated and Demo Data
              </h2>
              <p className="text-zinc-400">
                Portions of the Platform may display simulated, demo, or placeholder data where
                live data feeds are not yet connected. Features described as &ldquo;coming soon&rdquo; or
                marked with a &ldquo;simulated&rdquo; indicator are in development or demonstration state.
                These must not be interpreted as live, real-time data.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                AI-Generated Insights
              </h2>
              <p className="text-zinc-400">
                The Platform uses AI systems to generate market narratives, volatility
                assessments, liquidity insights, and opportunity signals. These outputs are
                generated algorithmically and may not reflect actual market conditions.
                AI-generated content should not be treated as expert analysis or professional
                advice of any kind.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                User Responsibility
              </h2>
              <p className="text-zinc-400">
                You are solely responsible for any decisions you make based on data or outputs
                from the Platform. Bug Hutch Ltd accepts no responsibility for losses, damages,
                or consequences of any kind arising from your use of Platform data, including
                but not limited to financial losses, missed trading opportunities, or adverse
                outcomes from wagering activity conducted independently.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                Not Investment Advice
              </h2>
              <p className="text-zinc-400">
                Nothing on the Platform constitutes investment advice, a financial promotion,
                or a recommendation to buy or sell any financial instrument. Bug Hutch Ltd is
                not regulated by the Financial Conduct Authority or any equivalent body.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                Not Gambling Advice
              </h2>
              <p className="text-zinc-400">
                Nothing on the Platform constitutes gambling advice, a tip, a selection, a
                system, or a recommendation to place any wager. The Platform does not endorse,
                encourage, or facilitate gambling of any kind.
              </p>
              <p className="text-zinc-400 mt-3">
                If gambling is causing you harm, contact the National Gambling Helpline on
                0808 8020 133 (free, 24/7) or visit{" "}
                <span className="text-zinc-300">begambleaware.org</span>.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                Jurisdictional Restrictions
              </h2>
              <p className="text-zinc-400">
                Access to the Platform may be restricted in certain jurisdictions. It is your
                responsibility to ensure that your use of the Platform complies with all
                applicable laws and regulations in your jurisdiction. Bug Hutch Ltd makes no
                representation that the Platform is appropriate or lawful for use in all
                locations.
              </p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                Contact
              </h2>
              <p className="text-zinc-400">
                For questions about this Disclaimer, contact Bug Hutch Ltd at:
              </p>
              <p className="text-zinc-300 mt-3 font-mono text-sm">
                support@sportsmarketos.com
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
