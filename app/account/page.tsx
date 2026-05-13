import { redirect } from "next/navigation";
import Link from "next/link";
import MarketTicker from "@/components/MarketTicker";
import TerminalHeader from "@/components/TerminalHeader";
import Sidebar from "@/components/Sidebar";
import ProfileEditSection from "@/components/ProfileEditSection";
import PlanBadge from "@/components/PlanBadge";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/db/profile";
import { normalizePlan, getMockUsage, canAccessFeature } from "@/lib/plans/featureAccess";
import { getPlan } from "@/lib/plans/plans";

export default async function AccountPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/signin");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/signin?next=/account");

  const profile = await getProfile(supabase, user.id);

  const rawPlan  = profile?.plan ?? "free";
  const planId   = normalizePlan(rawPlan);
  const planDef  = getPlan(planId);
  const role     = profile?.role ?? "free";
  const usage    = getMockUsage(planId);
  const joinedAt = new Date(user.created_at).toLocaleDateString("en-GB", {
    year: "numeric", month: "long", day: "numeric",
  });

  const accentColor  = planDef?.accentColor  ?? "text-zinc-300";
  const accentBorder = planDef?.accentBorder ?? "border-zinc-700/60";

  return (
    <div className="min-h-screen md:h-screen bg-black text-white flex flex-col md:overflow-hidden">
      <MarketTicker />
      <TerminalHeader />

      <div className="flex flex-1 flex-col md:flex-row md:overflow-hidden">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <main className="flex-1 md:overflow-y-auto">

          {/* Header */}
          <section className="px-6 py-5 border-b border-zinc-900 bg-zinc-950/40">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/terminal" className="text-zinc-600 text-[10px] font-mono hover:text-zinc-400 transition-colors">
                Terminal
              </Link>
              <span className="text-zinc-800 text-[10px]">›</span>
              <span className="text-zinc-400 text-[10px] font-mono">Account</span>
            </div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="text-white text-2xl font-semibold tracking-tight mb-1">Account</h1>
                <p className="text-zinc-500 text-sm">Manage your profile, plan, and access.</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <PlanBadge plan={planId} size="sm" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
                <span className="text-emerald-600 text-[9px] font-mono uppercase">Active</span>
              </div>
            </div>
          </section>

          {/* Profile data */}
          <section className="px-6 py-5 border-b border-zinc-900">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-4">Profile</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl">
              <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">Email</p>
                <p className="text-white text-sm font-mono truncate">{user.email}</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">Username</p>
                <p className="text-white text-sm font-mono">{profile?.username ?? "—"}</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">Creator Handle</p>
                <p className={`text-sm font-mono ${profile?.creator_handle ? "text-purple-400" : "text-zinc-600"}`}>
                  {profile?.creator_handle ?? "—"}
                </p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">Plan</p>
                <PlanBadge plan={planId} size="sm" />
              </div>
              <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">Role</p>
                <p className="text-white text-sm font-mono uppercase">{role}</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">Member Since</p>
                <p className="text-white text-sm">{joinedAt}</p>
              </div>
            </div>
          </section>

          {/* Edit section */}
          <section className="px-6 py-5 border-b border-zinc-900">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-4">Edit Profile</p>
            {profile ? (
              <ProfileEditSection profile={profile} />
            ) : (
              <p className="text-zinc-600 text-sm">Profile data unavailable — the database schema may not be applied yet.</p>
            )}
          </section>

          {/* Plan & Access */}
          <section className="px-6 py-5 border-b border-zinc-900">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-4">Plan &amp; Access</p>
            <div className="max-w-2xl space-y-4">

              {/* Current plan card */}
              <div className={`bg-zinc-950 border rounded-sm p-5 ${accentBorder}`}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <PlanBadge plan={planId} size="sm" />
                      <span className="text-[9px] font-mono text-zinc-600 uppercase">Active</span>
                    </div>
                    <p className={`text-sm font-semibold mt-1 ${accentColor}`}>
                      {planDef?.name ?? planId} Plan
                    </p>
                    <p className="text-zinc-500 text-xs leading-relaxed mt-1">
                      {planDef?.tagline ?? "Full terminal access."}
                    </p>
                  </div>
                  {planDef?.monthlyPrice !== null && planDef?.monthlyPrice !== undefined && planDef.monthlyPrice > 0 && (
                    <div className="text-right shrink-0">
                      <span className={`text-xl font-bold tabular-nums ${accentColor}`}>
                        ${planDef.monthlyPrice}
                      </span>
                      <span className="text-zinc-600 text-[10px] font-mono">/mo</span>
                    </div>
                  )}
                </div>

                {planId === "free" && (
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href="/pricing#partner"
                      className="text-xs font-medium text-black bg-amber-400 px-4 py-1.5 rounded-sm hover:bg-amber-300 transition-colors"
                    >
                      Upgrade to Partner
                    </Link>
                    <Link
                      href="/pricing#api"
                      className="text-xs font-medium text-black bg-blue-400 px-4 py-1.5 rounded-sm hover:bg-blue-300 transition-colors"
                    >
                      Unlock API Access
                    </Link>
                  </div>
                )}
              </div>

              {/* Feature access table */}
              <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-zinc-900/60">
                  <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                    Feature access
                  </p>
                </div>
                <div className="divide-y divide-zinc-900/60">
                  {[
                    { label: "Live market pulse",             feature: "live_market_pulse"         as const },
                    { label: "AI market narratives",          feature: "ai_narratives"             as const },
                    { label: "Creator share card exports",    feature: "creator_exports"           as const },
                    { label: "Watchlists",                    feature: "watchlists"                as const },
                    { label: "Creator distribution network",  feature: "creator_distribution"      as const },
                    { label: "Partner analytics",             feature: "partner_analytics"         as const },
                    { label: "Branded export tooling",        feature: "branded_exports"           as const },
                    { label: "Advanced volatility analytics", feature: "advanced_volatility_analytics" as const },
                    { label: "Structured API access",         feature: "api_endpoints"             as const },
                    { label: "AI feed endpoints",             feature: "ai_feed_access"            as const },
                    { label: "Deep liquidity scans",          feature: "deep_liquidity_scans"      as const },
                  ].map(({ label, feature }) => {
                    const hasAccess = canAccessFeature(planId, feature);
                    return (
                      <div key={feature} className="flex items-center justify-between px-4 py-2">
                        <span className={`text-[11px] ${hasAccess ? "text-zinc-300" : "text-zinc-600"}`}>
                          {label}
                        </span>
                        {hasAccess ? (
                          <span className="text-emerald-500 text-[10px] font-mono">✓ active</span>
                        ) : (
                          <Link href="/pricing" className="text-zinc-600 text-[9px] font-mono hover:text-zinc-400 transition-colors">
                            upgrade →
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Usage metrics */}
          <section className="px-6 py-5 border-b border-zinc-900">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Usage</p>
              <p className="text-zinc-700 text-[9px] font-mono">Stripe metering activates in Sprint 11</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl">
              <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">Exports generated</p>
                <p className="text-white text-lg font-bold tabular-nums">{usage.exportsGenerated}</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">Watchlists saved</p>
                <p className="text-white text-lg font-bold tabular-nums">{usage.watchlistsSaved}</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">AI scans</p>
                <p className="text-white text-lg font-bold tabular-nums">
                  {usage.aiScansConsumed.toLocaleString()}
                </p>
              </div>
              <div className={`bg-zinc-950 border rounded-sm p-4 ${planId === "api" ? "border-blue-400/20" : "border-zinc-800/60"}`}>
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">API calls</p>
                {planId === "api" ? (
                  <div>
                    <p className="text-blue-400 text-lg font-bold tabular-nums">
                      {usage.apiCallsUsed.toLocaleString()}
                    </p>
                    <p className="text-zinc-700 text-[9px] font-mono">
                      of {usage.apiCallsLimit?.toLocaleString() ?? "∞"}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-zinc-700 text-sm font-mono">—</p>
                    <Link href="/pricing#api" className="text-zinc-600 text-[9px] font-mono hover:text-zinc-400 transition-colors">
                      API plan →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Billing section */}
          <section className="px-6 py-5 border-b border-zinc-900">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-4">Billing</p>
            <div className="max-w-xl bg-zinc-950 border border-zinc-800/60 rounded-sm p-5">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-zinc-700 mt-1 shrink-0" />
                <div>
                  <p className="text-zinc-300 text-sm font-medium mb-1">
                    Billing system activates in Sprint 11.
                  </p>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    Stripe integration is in progress. When billing goes live, you&apos;ll manage
                    subscriptions, invoices, and usage directly from this section.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Quick links */}
          <section className="px-6 py-5">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-4">Quick Links</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/terminal"       className="text-xs font-mono text-zinc-400 border border-zinc-800 px-4 py-2 rounded-sm hover:border-zinc-600 hover:text-white transition-colors">Terminal →</Link>
              <Link href="/watchlists"     className="text-xs font-mono text-zinc-400 border border-zinc-800 px-4 py-2 rounded-sm hover:border-zinc-600 hover:text-white transition-colors">Watchlists →</Link>
              <Link href="/creator-studio" className="text-xs font-mono text-zinc-400 border border-zinc-800 px-4 py-2 rounded-sm hover:border-zinc-600 hover:text-white transition-colors">Creator Studio →</Link>
              <Link href="/pricing"        className="text-xs font-mono text-zinc-400 border border-zinc-800 px-4 py-2 rounded-sm hover:border-zinc-600 hover:text-white transition-colors">Pricing →</Link>
              <Link href="/partner-program"className="text-xs font-mono text-zinc-400 border border-zinc-800 px-4 py-2 rounded-sm hover:border-zinc-600 hover:text-white transition-colors">Partner Program →</Link>
              <Link href="/api-access"     className="text-xs font-mono text-zinc-400 border border-zinc-800 px-4 py-2 rounded-sm hover:border-zinc-600 hover:text-white transition-colors">API Access →</Link>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
