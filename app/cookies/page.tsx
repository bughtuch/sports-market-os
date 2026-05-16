import type { Metadata } from "next";
import PublicNavBar from "@/components/PublicNavBar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cookie Policy — Sports Market OS",
  description:
    "Cookie policy for Sports Market OS. Learn what cookies we set, why we set them, and how to manage your preferences.",
};

const EFFECTIVE_DATE = "1 January 2026";

export default function CookiesPage() {
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
            <h1 className="text-2xl font-semibold tracking-tight mb-3">Cookie Policy</h1>
            <p className="text-zinc-500 text-sm">Effective date: {EFFECTIVE_DATE}</p>
            <p className="text-zinc-500 text-sm mt-1">
              Operated by <span className="text-zinc-300">Bug Hutch Ltd</span>
            </p>
          </div>

          <div className="space-y-10 text-sm leading-relaxed">

            {/* Overview */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                1. What are cookies?
              </h2>
              <p className="text-zinc-400">
                Cookies are small text files stored on your device when you visit a website.
                They allow the site to remember information about your visit, such as whether
                you are signed in, your preferences, and anonymous usage data.
              </p>
              <p className="text-zinc-400 mt-3">
                We use cookies in accordance with the UK Privacy and Electronic Communications
                Regulations (PECR) and the UK GDPR. Where we use non-essential cookies, we
                ask for your consent via the cookie banner shown on your first visit.
              </p>
            </section>

            {/* Essential */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                2. Essential cookies
              </h2>
              <p className="text-zinc-400">
                These cookies are required for the Platform to function. They cannot be
                disabled. No consent is required for essential cookies under PECR.
              </p>
              <div className="mt-4 border border-zinc-900 rounded-sm overflow-hidden">
                <div className="grid grid-cols-3 gap-3 px-4 py-2 border-b border-zinc-900 bg-zinc-950/50">
                  <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Cookie</span>
                  <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Provider</span>
                  <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Purpose</span>
                </div>
                {[
                  { name: "sb-*-auth-token", provider: "Supabase", purpose: "Authentication session" },
                  { name: "smos_cookie_consent", provider: "Sports Market OS", purpose: "Stores your cookie preference" },
                ].map((row) => (
                  <div key={row.name} className="grid grid-cols-3 gap-3 px-4 py-2.5 border-b border-zinc-900 last:border-0">
                    <span className="text-zinc-400 text-[11px] font-mono">{row.name}</span>
                    <span className="text-zinc-500 text-[11px]">{row.provider}</span>
                    <span className="text-zinc-500 text-[11px]">{row.purpose}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Analytics */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                3. Analytics cookies
              </h2>
              <p className="text-zinc-400">
                We use anonymous analytics to understand how the Platform is used — which
                pages are visited, how long sessions last, and where users navigate. This
                helps us improve the product. These cookies are only set if you accept
                cookies via the banner.
              </p>
              <p className="text-zinc-400 mt-3">
                All analytics data is anonymised. We do not collect personally identifiable
                information through analytics cookies, and we do not share analytics data
                with advertising networks.
              </p>
              <div className="mt-4 border border-zinc-900 rounded-sm overflow-hidden">
                <div className="grid grid-cols-3 gap-3 px-4 py-2 border-b border-zinc-900 bg-zinc-950/50">
                  <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Cookie</span>
                  <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Provider</span>
                  <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Purpose</span>
                </div>
                {[
                  { name: "_ga, _ga_*", provider: "Google Analytics", purpose: "Anonymous page view tracking" },
                ].map((row) => (
                  <div key={row.name} className="grid grid-cols-3 gap-3 px-4 py-2.5 border-b border-zinc-900 last:border-0">
                    <span className="text-zinc-400 text-[11px] font-mono">{row.name}</span>
                    <span className="text-zinc-500 text-[11px]">{row.provider}</span>
                    <span className="text-zinc-500 text-[11px]">{row.purpose}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Stripe */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                4. Payment processing cookies
              </h2>
              <p className="text-zinc-400">
                If you proceed to checkout, Stripe — our payment processor — may set cookies
                to detect fraud, remember your payment details, and ensure secure transaction
                processing. These are set by Stripe&apos;s domain and are governed by{" "}
                <span className="text-zinc-300">Stripe&apos;s own cookie policy</span>.
              </p>
              <p className="text-zinc-400 mt-3">
                Stripe cookies are only activated when you interact with the checkout flow.
              </p>
            </section>

            {/* What we don't do */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                5. What we do not do
              </h2>
              <ul className="space-y-2 text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-zinc-700 mt-0.5">—</span>
                  <span>We do not use cookies for targeted or behavioural advertising.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-700 mt-0.5">—</span>
                  <span>We do not sell your data to third parties.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-700 mt-0.5">—</span>
                  <span>We do not use cross-site tracking or advertising networks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-700 mt-0.5">—</span>
                  <span>We do not fingerprint your browser or device.</span>
                </li>
              </ul>
            </section>

            {/* Managing cookies */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                6. Managing your preferences
              </h2>
              <p className="text-zinc-400">
                You can withdraw your cookie consent at any time by clearing the{" "}
                <span className="font-mono text-zinc-300">smos_cookie_consent</span> key
                from your browser&apos;s local storage. The cookie banner will reappear on
                your next visit, allowing you to make a new choice.
              </p>
              <p className="text-zinc-400 mt-3">
                You can also control cookies through your browser settings. Most browsers
                allow you to block or delete cookies entirely, though this may affect
                Platform functionality including sign-in.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-white text-base font-semibold mb-3 pb-2 border-b border-zinc-900">
                7. Contact
              </h2>
              <p className="text-zinc-400">
                For questions about this Cookie Policy, contact Bug Hutch Ltd at:
              </p>
              <p className="text-zinc-300 mt-3 font-mono text-sm">
                support@sportsmarketos.com
              </p>
              <p className="text-zinc-600 text-xs mt-4">
                This policy is governed by the laws of England and Wales.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
