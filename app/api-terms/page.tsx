import type { Metadata } from "next";
import PublicNavBar from "@/components/PublicNavBar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "API Terms of Service — Sports Market OS",
  description:
    "API-specific terms of service for Sports Market OS. Governs access to structured data feeds, AI endpoints, and developer infrastructure. Operated by Bug Hutch Ltd.",
};

const EFFECTIVE_DATE = "1 January 2026";

export default function ApiTermsPage() {
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
            <h1 className="text-2xl font-semibold tracking-tight mb-3">API Terms of Service</h1>
            <p className="text-zinc-500 text-sm">Effective date: {EFFECTIVE_DATE}</p>
            <p className="text-zinc-500 text-sm mt-1">
              Operated by <span className="text-zinc-300">Bug Hutch Ltd</span>
            </p>
          </div>

          <div className="space-y-10 text-sm leading-relaxed">

            {/* Overview */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                1. Overview
              </h2>
              <p className="text-zinc-400">
                These API Terms of Service (&ldquo;API Terms&rdquo;) govern your access to and use of
                the Sports Market OS API, including structured data feeds, AI narrative
                endpoints, odds and liquidity data, and any related developer infrastructure
                operated by Bug Hutch Ltd.
              </p>
              <p className="text-zinc-400 mt-3">
                These API Terms supplement and are incorporated into the Sports Market OS
                Terms of Use and Acceptable Use Policy. In the event of a conflict, these
                API Terms govern with respect to API access. By accessing the API, you agree
                to all three documents.
              </p>
            </section>

            {/* Eligibility */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                2. Eligibility
              </h2>
              <p className="text-zinc-400">
                API access is available to users on the API plan. You must maintain an active
                paid subscription to use the API. Access is granted to the individual or
                entity that holds the account; credentials may not be shared, transferred,
                or sublicensed to third parties.
              </p>
              <p className="text-zinc-400 mt-3">
                You must be at least 18 years of age and legally capable of entering into
                a binding contract in your jurisdiction to access the API.
              </p>
            </section>

            {/* API Credentials */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                3. API credentials
              </h2>
              <p className="text-zinc-400">
                You are responsible for maintaining the confidentiality of your API key. You
                must not expose your API key in client-side code, public repositories, or
                any context accessible to third parties.
              </p>
              <p className="text-zinc-400 mt-3">
                If you suspect your API key has been compromised, you must rotate it
                immediately via the Developer settings page. Bug Hutch Ltd is not liable for
                any misuse arising from a leaked or compromised key.
              </p>
            </section>

            {/* Rate Limits */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                4. Rate limits
              </h2>
              <p className="text-zinc-400">
                API usage is subject to rate limits defined by your plan tier. Limits apply
                per endpoint, per rolling window, as documented in the Developer portal. You
                must not attempt to circumvent rate limits through multiple accounts, request
                batching, or any other technical means.
              </p>
              <p className="text-zinc-400 mt-3">
                Bug Hutch Ltd reserves the right to adjust rate limits at any time. We will
                provide reasonable notice of significant changes to paid-tier limits. Temporary
                rate limit changes for platform stability may be made without notice.
              </p>
            </section>

            {/* Data Licence */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                5. Data licence
              </h2>
              <p className="text-zinc-400">
                Subject to these API Terms, Bug Hutch Ltd grants you a limited,
                non-exclusive, non-transferable licence to use API outputs in your own
                applications and products, provided that:
              </p>
              <ul className="mt-3 space-y-2 text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-zinc-700 mt-0.5">—</span>
                  <span>You do not resell, redistribute, or sublicense raw API data to third parties without written agreement.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-700 mt-0.5">—</span>
                  <span>You do not build competing market intelligence platforms primarily powered by our API outputs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-700 mt-0.5">—</span>
                  <span>You include appropriate informational disclaimers when presenting AI-generated narratives to end users.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-700 mt-0.5">—</span>
                  <span>You comply with the Acceptable Use Policy in all downstream applications of API data.</span>
                </li>
              </ul>
              <p className="text-zinc-400 mt-3">
                This licence is revocable. It terminates automatically upon any breach of
                these API Terms or the Terms of Use.
              </p>
            </section>

            {/* Availability */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                6. Availability and SLA
              </h2>
              <p className="text-zinc-400">
                We aim to maintain high API availability but do not guarantee any specific
                uptime or service level. The API may be degraded, rate-limited further, or
                temporarily unavailable during maintenance windows, incidents, or periods of
                high demand.
              </p>
              <p className="text-zinc-400 mt-3">
                No formal SLA is provided under the current API plan tier. Enterprise and
                custom API agreements may include availability commitments — contact us
                directly to discuss.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                7. Termination
              </h2>
              <p className="text-zinc-400">
                Bug Hutch Ltd reserves the right to suspend or terminate your API access at
                any time, without notice, if we determine that you have breached these API
                Terms, the Terms of Use, or the Acceptable Use Policy.
              </p>
              <p className="text-zinc-400 mt-3">
                You may cancel your API plan subscription at any time. Access will continue
                until the end of the current billing period. We do not provide prorated
                refunds for unused API capacity.
              </p>
            </section>

            {/* Liability */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                8. Limitation of liability
              </h2>
              <p className="text-zinc-400">
                To the maximum extent permitted by law, Bug Hutch Ltd shall not be liable
                for any damages arising from your use of the API, including but not limited
                to losses caused by inaccurate data, API downtime, rate limit enforcement,
                or changes to endpoint behaviour.
              </p>
              <p className="text-zinc-400 mt-3">
                You are solely responsible for validating API outputs before using them in
                any production system or presenting them to end users.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                9. Contact
              </h2>
              <p className="text-zinc-400">
                For API access enquiries, data licensing discussions, or questions about
                these terms, contact Bug Hutch Ltd at:
              </p>
              <p className="text-zinc-300 mt-3 font-mono text-sm">
                support@sportsmarketos.com
              </p>
              <p className="text-zinc-600 text-xs mt-4">
                These API Terms are governed by the laws of England and Wales.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
