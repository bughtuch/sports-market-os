import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import MarketTicker from "@/components/MarketTicker";
import TerminalHeader from "@/components/TerminalHeader";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { getPartnerProfile, getPartnerMetrics } from "@/lib/partners/partnerTracking";
import { buildReferralDisplay, buildReferralUrl } from "@/lib/partners/referralUtils";
import PartnerDashboardClient from "@/components/PartnerDashboardClient";

export const metadata: Metadata = {
  title: "Partner Dashboard — Referral Tracking | Sports Market OS",
  description:
    "Your Sports Market OS partner dashboard. Track referral clicks, signups, exports, and estimated reach. Commission infrastructure activates after billing integration.",
};

export default async function PartnerDashboardPage() {
  // Auth guard — redirect to signin if not authenticated
  const supabase = await createClient();
  if (!supabase) redirect("/signin");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  // Fetch partner data
  const profile = await getPartnerProfile();
  const metrics = profile ? await getPartnerMetrics(profile.partnerCode) : null;

  const referralUrl     = profile ? buildReferralUrl(profile.partnerCode)     : null;
  const referralDisplay = profile ? buildReferralDisplay(profile.partnerCode) : null;

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      <MarketTicker />
      <TerminalHeader />

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <main className="flex-1 overflow-y-auto">
          {/* ─── Header ─────────────────────────────────────────────────── */}
          <section className="px-6 py-5 border-b border-zinc-900 bg-zinc-950/40">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/terminal" className="text-zinc-600 text-[10px] font-mono hover:text-zinc-400 transition-colors">
                Terminal
              </Link>
              <span className="text-zinc-800 text-[10px]">›</span>
              <span className="text-zinc-400 text-[10px] font-mono">Partner Dashboard</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-white text-2xl font-semibold tracking-tight mb-2">
                  Partner Dashboard
                </h1>
                <p className="text-zinc-500 text-sm max-w-xl leading-relaxed">
                  Track your referral links, attributed signups, and estimated creator reach.
                  Commission infrastructure activates after billing integration.
                </p>
              </div>
              {profile && (
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-zinc-600 text-[9px] font-mono mb-0.5">PARTNER CODE</p>
                    <p className="text-emerald-400 text-sm font-semibold font-mono tabular-nums">
                      {profile.partnerCode}
                    </p>
                    <p className={`text-[9px] font-mono mt-0.5 ${
                      profile.status === "active" ? "text-emerald-600" :
                      profile.status === "pending" ? "text-amber-600" : "text-red-600"
                    }`}>
                      {profile.status.toUpperCase()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ─── Client section (copy button, QR placeholder, metrics) ── */}
          <PartnerDashboardClient
            profile={profile}
            metrics={metrics}
            referralUrl={referralUrl}
            referralDisplay={referralDisplay}
            userEmail={user.email ?? ""}
          />

          {/* ─── Commission placeholder ──────────────────────────────────── */}
          <section className="px-6 py-6 border-b border-zinc-900">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                Commission Infrastructure
              </span>
              <div className="flex-1 h-px bg-zinc-900" />
              <span className="text-zinc-700 text-[8px] font-mono">Future</span>
            </div>
            <div className="p-5 bg-zinc-950 border border-zinc-800/60 border-dashed rounded-sm max-w-xl">
              <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest mb-2">
                Pending Billing Integration
              </p>
              <p className="text-zinc-400 text-sm mb-3">
                Commission infrastructure activates after billing integration.
              </p>
              <ul className="space-y-1.5">
                {[
                  "Tracked referral conversions",
                  "Partner commission rates",
                  "Payout schedule and history",
                  "Stripe Connect or equivalent settlement",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="text-zinc-700 text-[9px] font-mono">›</span>
                    <span className="text-zinc-600 text-[10px]">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-zinc-700 text-[9px] font-mono mt-4">
                No earnings are guaranteed. Partner attribution is tracked now so
                referrals are credited when commission infrastructure launches.
              </p>
            </div>
          </section>

          {/* ─── Content performance placeholder ────────────────────────── */}
          <section className="px-6 py-6 border-b border-zinc-900">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                Content Performance
              </span>
              <div className="flex-1 h-px bg-zinc-900" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { label: "Posts Generated",   value: "—", note: "Connect Content Command" },
                { label: "Exports Created",   value: metrics ? metrics.exports.toString() : "0", note: "tracked referral exports" },
                { label: "API Referrals",     value: metrics ? metrics.apiReferrals.toString() : "0", note: "attributed API leads" },
              ].map(({ label, value, note }) => (
                <div key={label} className="p-4 bg-zinc-950 border border-zinc-800/60 rounded-sm">
                  <p className="text-zinc-600 text-[8px] font-mono uppercase tracking-widest mb-1">{label}</p>
                  <p className="text-white text-xl font-bold tabular-nums">{value}</p>
                  <p className="text-zinc-700 text-[9px] font-mono">{note}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Quick links ─────────────────────────────────────────────── */}
          <section className="px-6 py-6 border-b border-zinc-900">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                Quick Links
              </span>
              <div className="flex-1 h-px bg-zinc-900" />
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Creator Studio →",    href: "/creator-studio" },
                { label: "Content Command →",   href: "/content-command" },
                { label: "Partner Ecosystem →", href: "/partners" },
                { label: "Partner Program →",   href: "/partner-program" },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[9px] font-mono px-3 py-1.5 border border-zinc-800 rounded-sm hover:border-zinc-600 text-zinc-400 hover:text-white transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </section>

          {/* ─── Compliance ──────────────────────────────────────────────── */}
          <div className="px-6 py-3 border-t border-zinc-900/60">
            <p className="text-zinc-800 text-[9px] font-mono leading-relaxed">
              Partner attribution is tracked for referral credit purposes only. No earnings are guaranteed.
              Sports Market OS does not promise income, commission, or financial return from participation in the partner programme.
            </p>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}
