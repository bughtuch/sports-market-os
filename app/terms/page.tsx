import type { Metadata } from "next";
import MarketTicker from "@/components/MarketTicker";
import TerminalHeader from "@/components/TerminalHeader";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Use — Sports Market OS",
  description:
    "Terms of use for Sports Market OS, an AI-powered sports market intelligence and analytics platform operated by Bug Hutch Ltd.",
};

const EFFECTIVE_DATE = "1 January 2026";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <MarketTicker />
      <TerminalHeader />

      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-6 py-16">

          {/* Header */}
          <div className="mb-12">
            <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-3">
              Legal
            </p>
            <h1 className="text-2xl font-semibold tracking-tight mb-3">Terms of Use</h1>
            <p className="text-zinc-500 text-sm">
              Effective date: {EFFECTIVE_DATE}
            </p>
            <p className="text-zinc-500 text-sm mt-1">
              Operated by <span className="text-zinc-300">Bug Hutch Ltd</span>
            </p>
          </div>

          <div className="space-y-10 text-sm leading-relaxed">

            {/* 1 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                1. Overview
              </h2>
              <p className="text-zinc-400">
                Sports Market OS (&ldquo;the Platform&rdquo;) is operated by Bug Hutch Ltd, a company
                registered in England and Wales. By accessing or using the Platform, you agree to
                be bound by these Terms of Use. If you do not agree, you must not use the Platform.
              </p>
              <p className="text-zinc-400 mt-3">
                The Platform provides market intelligence data, AI-generated analytics, and
                informational tooling for sports markets. It does not provide gambling services,
                financial services, or execution of any kind.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                2. Informational Purposes Only
              </h2>
              <p className="text-zinc-400">
                All content, data, signals, analytics, narratives, and AI-generated outputs on
                the Platform are provided for informational and research purposes only. No content
                constitutes advice of any kind, including but not limited to financial, investment,
                trading, betting, or gambling advice.
              </p>
              <p className="text-zinc-400 mt-3">
                You acknowledge that market data may be simulated, delayed, incomplete, or
                inaccurate. You must not rely on any Platform output as the sole basis for any
                decision involving real funds or wagers.
              </p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                3. No Gambling Services
              </h2>
              <p className="text-zinc-400">
                Sports Market OS is not a betting operator, bookmaker, betting exchange, or
                gambling service of any kind. The Platform does not accept wagers, hold customer
                funds, or facilitate any form of gambling transaction.
              </p>
              <p className="text-zinc-400 mt-3">
                References to odds, market prices, exchange data, or liquidity are informational
                only. Bug Hutch Ltd holds no gambling licence and does not operate under any
                gambling regulatory framework.
              </p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                4. No Financial Advice
              </h2>
              <p className="text-zinc-400">
                Nothing on the Platform constitutes a financial promotion, investment advice, or
                a recommendation to buy or sell any financial instrument. Bug Hutch Ltd is not
                authorised or regulated by the Financial Conduct Authority (FCA) or any equivalent
                regulatory body in any jurisdiction.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                5. Platform Availability
              </h2>
              <p className="text-zinc-400">
                We do not guarantee uninterrupted availability of the Platform. The Platform may
                be modified, suspended, or discontinued at any time without notice. We are not
                liable for any loss arising from unavailability or interruption of the service.
              </p>
              <p className="text-zinc-400 mt-3">
                Some features are marked as &ldquo;coming soon&rdquo; or &ldquo;simulated.&rdquo; These are either in
                development or demonstration states and should not be relied upon as production
                functionality.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                6. User Accounts
              </h2>
              <p className="text-zinc-400">
                You are responsible for maintaining the security of your account credentials.
                You must not share your account with third parties or use the Platform in any way
                that violates these Terms. We reserve the right to suspend or terminate accounts
                that breach these Terms at our sole discretion.
              </p>
              <p className="text-zinc-400 mt-3">
                You must be at least 18 years of age to create an account on the Platform.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                7. Intellectual Property
              </h2>
              <p className="text-zinc-400">
                All content, software, branding, AI models, data pipelines, and analytics
                methodologies on the Platform are the intellectual property of Bug Hutch Ltd or
                its licensors. You may not reproduce, distribute, or create derivative works
                from Platform content without prior written consent.
              </p>
              <p className="text-zinc-400 mt-3">
                Creator-tier users may distribute AI-generated outputs under their own branding
                subject to the Creator Programme terms. Distribution must comply with applicable
                laws in each jurisdiction.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                8. API Usage
              </h2>
              <p className="text-zinc-400">
                Access to the Platform API is subject to the API plan terms and applicable rate
                limits. API outputs may not be used to build products that facilitate gambling
                transactions, provide regulated financial advice, or otherwise violate these Terms.
              </p>
              <p className="text-zinc-400 mt-3">
                We reserve the right to revoke API access at any time for breach of these Terms
                or misuse of the API infrastructure.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                9. Limitation of Liability
              </h2>
              <p className="text-zinc-400">
                To the maximum extent permitted by law, Bug Hutch Ltd shall not be liable for
                any direct, indirect, incidental, consequential, or special damages arising from
                your use of, or inability to use, the Platform or any data provided by it.
              </p>
              <p className="text-zinc-400 mt-3">
                This limitation applies regardless of the theory of liability, including
                negligence, contract, or any other legal theory, even if Bug Hutch Ltd has been
                advised of the possibility of such damages.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                10. Contact Information
              </h2>
              <p className="text-zinc-400">
                For questions about these Terms, please contact Bug Hutch Ltd at:
              </p>
              <p className="text-zinc-300 mt-3 font-mono text-sm">
                support@sportsmarketos.com
              </p>
              <p className="text-zinc-600 text-xs mt-4">
                These Terms are governed by the laws of England and Wales. Any disputes shall
                be subject to the exclusive jurisdiction of the courts of England and Wales.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
