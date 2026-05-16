import type { Metadata } from "next";
import PublicNavBar from "@/components/PublicNavBar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Acceptable Use Policy — Sports Market OS",
  description:
    "Acceptable Use Policy governing the use of Sports Market OS and its API. Operated by Bug Hutch Ltd.",
};

const EFFECTIVE_DATE = "1 January 2026";

export default function AcceptableUsePage() {
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
            <h1 className="text-2xl font-semibold tracking-tight mb-3">Acceptable Use Policy</h1>
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
                This Acceptable Use Policy (&ldquo;AUP&rdquo;) governs all use of Sports Market OS,
                including the web Platform, API, and any related tooling operated by Bug Hutch
                Ltd. By using the Platform, you agree to comply with this AUP in full.
              </p>
              <p className="text-zinc-400 mt-3">
                Violations of this AUP may result in immediate suspension or termination of
                your account and API access, without notice or refund.
              </p>
            </section>

            {/* Prohibited: Scraping */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                2. Scraping and automated access
              </h2>
              <p className="text-zinc-400">
                You may not scrape, crawl, spider, or use any automated method to extract
                data from the Platform beyond your permitted API entitlements. This includes:
              </p>
              <ul className="mt-3 space-y-2 text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-zinc-700 mt-0.5">—</span>
                  <span>Scraping web pages using headless browsers or bots.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-700 mt-0.5">—</span>
                  <span>Exceeding API rate limits or attempting to circumvent them.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-700 mt-0.5">—</span>
                  <span>Using multiple accounts to aggregate data beyond a single account&apos;s entitlements.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-700 mt-0.5">—</span>
                  <span>Mirroring or caching Platform data in a way that replicates Platform functionality.</span>
                </li>
              </ul>
            </section>

            {/* Prohibited: Resale */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                3. Resale and redistribution
              </h2>
              <p className="text-zinc-400">
                You may not resell, sublicense, or redistribute raw Platform data or API
                outputs to third parties without a written data distribution agreement with
                Bug Hutch Ltd. This includes:
              </p>
              <ul className="mt-3 space-y-2 text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-zinc-700 mt-0.5">—</span>
                  <span>Selling API responses, odds feeds, or market data to other parties.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-700 mt-0.5">—</span>
                  <span>Building competing data products or intelligence platforms on top of Platform data.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-700 mt-0.5">—</span>
                  <span>Publishing raw API feeds publicly in a way that substitutes for a Platform subscription.</span>
                </li>
              </ul>
              <p className="text-zinc-400 mt-3">
                Creator-tier users may distribute AI-generated narratives and analysis under
                their own branding, subject to the Creator Programme terms. This does not
                extend to raw data or structured feeds.
              </p>
            </section>

            {/* Prohibited: Reverse engineering */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                4. Reverse engineering
              </h2>
              <p className="text-zinc-400">
                You may not reverse engineer, decompile, disassemble, or attempt to extract
                the source code, AI models, algorithms, or data pipelines underlying the
                Platform. You may not use the Platform to develop a competing service.
              </p>
            </section>

            {/* Prohibited: Circumvention */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                5. Security and circumvention
              </h2>
              <p className="text-zinc-400">
                You may not attempt to circumvent, disable, or interfere with any security
                or access control mechanism on the Platform. Prohibited activities include:
              </p>
              <ul className="mt-3 space-y-2 text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-zinc-700 mt-0.5">—</span>
                  <span>Probing, scanning, or testing for vulnerabilities without written authorisation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-700 mt-0.5">—</span>
                  <span>Attempting to access accounts, data, or systems belonging to other users.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-700 mt-0.5">—</span>
                  <span>Introducing malware, denial-of-service attacks, or other disruptive payloads.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-700 mt-0.5">—</span>
                  <span>Bypassing paywalls, plan restrictions, or rate limits through technical means.</span>
                </li>
              </ul>
            </section>

            {/* Prohibited: Unlawful use */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                6. Unlawful use
              </h2>
              <p className="text-zinc-400">
                You may not use the Platform for any purpose that is unlawful or prohibited
                by applicable law in your jurisdiction, including but not limited to:
              </p>
              <ul className="mt-3 space-y-2 text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-zinc-700 mt-0.5">—</span>
                  <span>Money laundering, fraud, or financial crime of any kind.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-700 mt-0.5">—</span>
                  <span>Unlicensed gambling or betting operations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-700 mt-0.5">—</span>
                  <span>Market manipulation or collusion schemes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-700 mt-0.5">—</span>
                  <span>Providing regulated financial or gambling advice without the appropriate licence.</span>
                </li>
              </ul>
            </section>

            {/* Misrepresentation */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                7. Misrepresentation
              </h2>
              <p className="text-zinc-400">
                You may not misrepresent the source or accuracy of Platform data. You may not
                claim that AI-generated narratives or signals are guaranteed predictions, or
                present them to third parties in a way that omits the informational-only
                disclaimer required under our Terms of Use.
              </p>
              <p className="text-zinc-400 mt-3">
                You may not impersonate Bug Hutch Ltd, Sports Market OS, or any of our staff
                in any context.
              </p>
            </section>

            {/* Harassment */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                8. Harassment and abuse
              </h2>
              <p className="text-zinc-400">
                You may not use the Platform to harass, threaten, or abuse any individual
                or group. You may not use Platform features or outputs to generate, promote,
                or distribute discriminatory, hateful, or harmful content.
              </p>
            </section>

            {/* Reporting */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                9. Reporting violations
              </h2>
              <p className="text-zinc-400">
                If you become aware of a violation of this AUP, please report it to us at:
              </p>
              <p className="text-zinc-300 mt-3 font-mono text-sm">
                support@sportsmarketos.com
              </p>
              <p className="text-zinc-600 text-xs mt-4">
                This AUP is governed by the laws of England and Wales. Bug Hutch Ltd reserves
                the right to update this AUP at any time. Continued use of the Platform
                following an update constitutes acceptance of the revised AUP.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
