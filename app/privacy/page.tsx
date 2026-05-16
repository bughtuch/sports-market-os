import type { Metadata } from "next";
import PublicNavBar from "@/components/PublicNavBar";


import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Sports Market OS",
  description:
    "Privacy policy for Sports Market OS. How Bug Hutch Ltd collects, uses, and protects your data.",
};

const EFFECTIVE_DATE = "1 January 2026";

export default function PrivacyPage() {
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
            <h1 className="text-2xl font-semibold tracking-tight mb-3">Privacy Policy</h1>
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
                Bug Hutch Ltd (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) operates Sports Market OS
                (&ldquo;the Platform&rdquo;). This Privacy Policy explains what data we collect, how we use
                it, and your rights in relation to it.
              </p>
              <p className="text-zinc-400 mt-3">
                We are committed to protecting your privacy and handling your data in
                accordance with the UK General Data Protection Regulation (UK GDPR) and
                the Data Protection Act 2018.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                2. Data We Collect
              </h2>
              <p className="text-zinc-400 mb-3">
                We collect only the data necessary to operate the Platform. This includes:
              </p>
              <ul className="space-y-2 text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600 mt-0.5 shrink-0">›</span>
                  <span><strong className="text-zinc-300">Account data:</strong> email address, username, and optional creator handle provided during registration.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600 mt-0.5 shrink-0">›</span>
                  <span><strong className="text-zinc-300">Usage data:</strong> pages visited, features used, and interaction events within the Platform.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600 mt-0.5 shrink-0">›</span>
                  <span><strong className="text-zinc-300">Technical data:</strong> IP address, browser type, device type, and access timestamps.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600 mt-0.5 shrink-0">›</span>
                  <span><strong className="text-zinc-300">Subscription data:</strong> plan type and billing status (when billing activates).</span>
                </li>
              </ul>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                3. Account Information
              </h2>
              <p className="text-zinc-400">
                Account information is collected when you register for the Platform. We use your
                email address to authenticate your account, communicate important platform
                updates, and (where opted in) send product communications.
              </p>
              <p className="text-zinc-400 mt-3">
                Authentication is handled via Supabase. Your credentials are stored securely
                and are never shared with third parties for marketing purposes.
              </p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                4. Analytics Data
              </h2>
              <p className="text-zinc-400">
                We may collect anonymised usage analytics to understand how the Platform is
                used and to improve the product. Analytics data is aggregated and does not
                identify individual users.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                5. Cookies
              </h2>
              <p className="text-zinc-400">
                The Platform uses session cookies required for authentication. These are
                strictly necessary and cannot be disabled while using the Platform.
              </p>
              <p className="text-zinc-400 mt-3">
                We do not use third-party advertising cookies or tracking cookies. Any analytics
                tools used are configured to respect user privacy and are subject to data
                processing agreements.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                6. Creator Data
              </h2>
              <p className="text-zinc-400">
                If you use Creator Studio features, your creator handle, export history, and
                distribution activity are stored to power your creator analytics dashboard.
                This data is used solely to provide the Creator Studio functionality and is
                not shared or sold.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                7. API Usage Data
              </h2>
              <p className="text-zinc-400">
                For API plan users, we record API call counts, endpoint access patterns, and
                request metadata for rate limiting, billing (when active), and abuse prevention.
                This data is not shared with third parties.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                8. Third-Party Providers
              </h2>
              <p className="text-zinc-400 mb-3">
                We use the following third-party providers to operate the Platform:
              </p>
              <ul className="space-y-2 text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600 mt-0.5 shrink-0">›</span>
                  <span><strong className="text-zinc-300">Supabase</strong> — authentication, database, and secure data storage.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600 mt-0.5 shrink-0">›</span>
                  <span><strong className="text-zinc-300">Vercel</strong> — hosting, edge delivery, and infrastructure.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600 mt-0.5 shrink-0">›</span>
                  <span><strong className="text-zinc-300">Stripe</strong> — payment processing (when billing activates). No card data is stored by Bug Hutch Ltd.</span>
                </li>
              </ul>
              <p className="text-zinc-400 mt-3">
                Each provider is bound by appropriate data processing agreements and operates
                under their own privacy policies.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                9. Data Retention
              </h2>
              <p className="text-zinc-400">
                We retain account data for as long as your account is active. If you request
                account deletion, we will remove your personal data within 30 days, subject
                to any legal obligations to retain certain records.
              </p>
              <p className="text-zinc-400 mt-3">
                Anonymised usage data may be retained for analytical purposes indefinitely.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                10. Your Rights
              </h2>
              <p className="text-zinc-400">
                Under UK GDPR, you have the right to access, rectify, erase, or restrict the
                processing of your personal data. You also have the right to data portability
                and to object to processing in certain circumstances.
              </p>
              <p className="text-zinc-400 mt-3">
                To exercise any of these rights, contact us at{" "}
                <a href="mailto:support@sportsmarketos.com" className="text-zinc-300 hover:text-white transition-colors">
                  support@sportsmarketos.com
                </a>
                .
              </p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                11. Contact
              </h2>
              <p className="text-zinc-400">
                Bug Hutch Ltd is the data controller for the Platform. For all privacy
                enquiries:
              </p>
              <p className="text-zinc-300 mt-3 font-mono text-sm">
                support@sportsmarketos.com
              </p>
              <p className="text-zinc-600 text-xs mt-4">
                You have the right to lodge a complaint with the Information Commissioner&apos;s
                Office (ICO) if you believe your data has been handled unlawfully.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
