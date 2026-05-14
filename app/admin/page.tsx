/**
 * /admin — Private admin console.
 *
 * Security notes (Sprint 18):
 * - Route is hidden from public nav, sidebar, footer, sitemap, robots.txt
 * - Access requires authenticated user with profiles.role = 'admin'
 * - Non-admin visitors see a clean "Access restricted" page
 * - API routes enforce admin role server-side and return 403 if not admin
 * - No service role key is exposed client-side
 * - Future: stricter admin allowlist via env-var email whitelist
 */

import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/db/profile";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminPartnerApplications from "@/components/admin/AdminPartnerApplications";
import AdminPartnerProfiles from "@/components/admin/AdminPartnerProfiles";
import AdminReferralEvents from "@/components/admin/AdminReferralEvents";
import AdminDistribution from "@/components/admin/AdminDistribution";
import AdminSystemStatus from "@/components/admin/AdminSystemStatus";
import AdminProviderActivation from "@/components/admin/AdminProviderActivation";
import AdminConsoleNav from "@/components/admin/AdminConsoleNav";

export const metadata: Metadata = {
  title: "Admin Console | Sports Market OS",
  // Intentionally minimal — this page should not be indexed
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  // ─── Auth gate ──────────────────────────────────────────────────────────────
  const supabase = await createClient();

  if (!supabase) {
    return <AccessRestricted reason="Database not configured." />;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  const profile = await getProfile(supabase, user.id);

  if (!profile || profile.role !== "admin") {
    return <AccessRestricted reason="You do not have admin access." />;
  }

  // ─── Admin console ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Admin header — deliberately minimal, no public nav */}
      <header className="px-6 py-3 border-b border-zinc-800/60 bg-zinc-950 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 pulse-dot" />
          <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
            Sports Market OS · Admin Console
          </span>
          <span className="text-zinc-700 text-[9px] font-mono">·</span>
          <span className="text-zinc-600 text-[9px] font-mono">{user.email}</span>
        </div>
        <Link
          href="/terminal"
          className="text-zinc-600 text-[9px] font-mono hover:text-zinc-400 transition-colors"
        >
          ← Terminal
        </Link>
      </header>

      <div className="flex flex-1">
        {/* Sidebar nav */}
        <AdminConsoleNav />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-10">

          {/* ─── Overview ───────────────────────────────────────────────── */}
          <section id="overview">
            <SectionHeader label="Platform Overview" />
            <AdminOverview />
          </section>

          {/* ─── Partner Applications ────────────────────────────────────── */}
          <section id="applications">
            <SectionHeader label="Partner Applications" />
            <AdminPartnerApplications />
          </section>

          {/* ─── Partner Profiles ────────────────────────────────────────── */}
          <section id="profiles">
            <SectionHeader label="Partner Profiles" />
            <AdminPartnerProfiles />
          </section>

          {/* ─── Referral Events ────────────────────────────────────────── */}
          <section id="events">
            <SectionHeader label="Referral Events" />
            <AdminReferralEvents />
          </section>

          {/* ─── Distribution + Export Analytics ─────────────────────────── */}
          <section id="distribution">
            <SectionHeader label="Distribution & Export Analytics" />
            <AdminDistribution />
          </section>

          {/* ─── System Status ───────────────────────────────────────────── */}
          <section id="system">
            <SectionHeader label="System & Provider Status" />
            <AdminSystemStatus />
          </section>

          {/* ─── Provider Activation ─────────────────────────────────────── */}
          <section id="providers">
            <SectionHeader label="Provider Activation Readiness" />
            <AdminProviderActivation />
          </section>

          {/* ─── Admin footer ────────────────────────────────────────────── */}
          <div className="pt-6 border-t border-zinc-900/60">
            <p className="text-zinc-800 text-[9px] font-mono leading-relaxed">
              Admin console · Sports Market OS · Signed in as {user.email} ·{" "}
              role: {profile.role} · This page is not indexed, linked publicly, or visible in sitemap.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest shrink-0">
        {label}
      </span>
      <div className="flex-1 h-px bg-zinc-900" />
    </div>
  );
}

function AccessRestricted({ reason }: { reason: string }) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center max-w-sm px-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            Access Restricted
          </span>
        </div>
        <p className="text-zinc-400 text-sm mb-2">{reason}</p>
        <p className="text-zinc-700 text-[10px] font-mono mb-6">
          If you believe this is an error, contact the platform administrator.
        </p>
        <Link
          href="/terminal"
          className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          ← Return to Terminal
        </Link>
      </div>
    </div>
  );
}
