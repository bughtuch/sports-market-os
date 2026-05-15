/**
 * /developer — API key management and developer access dashboard.
 * Protected: requires authenticated user.
 */

import { redirect } from "next/navigation";
import type { Metadata } from "next";
import MarketTicker from "@/components/MarketTicker";
import TerminalHeader from "@/components/TerminalHeader";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import ApiKeyManager from "@/components/ApiKeyManager";
import ApiUsagePanel from "@/components/ApiUsagePanel";
import ApiQuotaDisplay from "@/components/ApiQuotaDisplay";
import PlanBadge from "@/components/PlanBadge";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/db/profile";
import { normalizePlan } from "@/lib/plans/featureAccess";
import { PLAN_LABEL, PLAN_TIER } from "@/lib/apiAccess/apiPlanTypes";
import { getAllEndpoints } from "@/lib/apiAccess/apiPermissions";
import { DAILY_LIMIT, formatLimit } from "@/lib/apiAccess/apiPlanLimits";
import type { ApiPlan } from "@/lib/apiAccess/apiPlanTypes";

export const metadata: Metadata = {
  title: "Developer Access — API Keys | Sports Market OS",
  description: "Manage your API keys and monitor usage for Sports Market OS intelligence feeds.",
};

export const dynamic = "force-dynamic";

const PLANS: ApiPlan[] = ["free", "partner", "api"];

export default async function DeveloperPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/signin");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/signin?next=/developer");

  const profile  = await getProfile(supabase, user.id);
  const plan     = normalizePlan(profile?.plan ?? "free") as ApiPlan;
  const endpoints = getAllEndpoints();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <MarketTicker />
      <TerminalHeader />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 px-6 py-8 space-y-10 max-w-4xl">

          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                Sports Market OS · Developer
              </span>
            </div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold">Developer Access</h1>
              <PlanBadge plan={plan} />
            </div>
            <p className="text-zinc-400 text-sm">
              Manage API keys and monitor usage for the v1 intelligence feed.
            </p>
          </div>

          {/* Quota */}
          <section>
            <SectionLabel label="Daily Quota" />
            <ApiQuotaDisplay />
          </section>

          {/* Endpoint access matrix */}
          <section>
            <SectionLabel label="Endpoint access" />
            <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-900/60 grid grid-cols-[1fr_auto_auto_auto] gap-4 text-[9px] font-mono text-zinc-600 uppercase tracking-wider">
                <span>Endpoint</span>
                {PLANS.map((p) => (
                  <span key={p} className={`text-center ${plan === p ? "text-blue-400" : ""}`}>
                    {PLAN_LABEL[p]}
                  </span>
                ))}
              </div>
              <div className="divide-y divide-zinc-900/60">
                {endpoints.map((ep) => {
                  const userCanAccess = PLAN_TIER[plan] >= PLAN_TIER[ep.requiredPlan];
                  return (
                    <div
                      key={ep.path}
                      className={`px-4 py-3 grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center ${
                        !ep.live ? "opacity-50" : ""
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <code className={`text-[10px] font-mono ${userCanAccess ? "text-zinc-200" : "text-zinc-600"}`}>
                            {ep.path}
                          </code>
                          {!ep.live && (
                            <span className="text-[8px] font-mono text-zinc-700 border border-zinc-800 px-1 py-0.5 rounded-sm">
                              soon
                            </span>
                          )}
                        </div>
                        <p className="text-zinc-600 text-[9px] mt-0.5">{ep.description}</p>
                      </div>
                      {PLANS.map((p) => {
                        const planCanAccess = PLAN_TIER[p] >= PLAN_TIER[ep.requiredPlan];
                        return (
                          <span key={p} className="text-center text-[11px]">
                            {planCanAccess ? (
                              <span className={p === plan ? "text-emerald-400" : "text-emerald-800"}>✓</span>
                            ) : (
                              <span className="text-zinc-800">—</span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Quick start */}
          <section>
            <SectionLabel label="Quick start" />
            <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 p-4 space-y-3">
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Include your API key in the{" "}
                <code className="text-zinc-300 font-mono">x-smo-api-key</code> header.
                All v1 responses include rate limit headers.
              </p>
              <pre className="text-[9px] font-mono text-zinc-400 bg-zinc-900/60 rounded-sm p-3 overflow-x-auto leading-relaxed">{`# Signals feed
curl https://sportsmarketos.com/api/v1/signals \\
  -H "x-smo-api-key: smo_live_your_key_here"

# Response headers
X-SMO-Plan: free
X-SMO-RateLimit-Limit: 100
X-SMO-RateLimit-Remaining: 97
X-SMO-RateLimit-Reset: 2026-05-16T00:00:00.000Z`}</pre>
            </div>
          </section>

          {/* API key manager */}
          <section>
            <SectionLabel label="API Keys" />
            <ApiKeyManager />
          </section>

          {/* Usage panel */}
          <section>
            <SectionLabel label="Usage — Today" />
            <ApiUsagePanel />
          </section>

          {/* Rate limits by plan */}
          <section>
            <SectionLabel label="Plan limits" />
            <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 overflow-hidden">
              <div className="divide-y divide-zinc-900/60">
                {PLANS.map((p) => (
                  <div key={p} className={`px-4 py-3 flex items-center gap-4 ${plan === p ? "bg-zinc-900/30" : ""}`}>
                    <PlanBadge plan={p} />
                    <div className="flex-1">
                      <p className="text-zinc-300 text-[11px]">{PLAN_LABEL[p]} plan</p>
                      <p className="text-zinc-600 text-[9px] font-mono mt-0.5">
                        {formatLimit(p)} calls/day · resets at UTC midnight
                      </p>
                    </div>
                    {plan === p && (
                      <span className="text-blue-400 text-[9px] font-mono">current</span>
                    )}
                    {plan !== p && PLAN_TIER[p] > PLAN_TIER[plan] && (
                      <a href="/pricing" className="text-zinc-600 text-[9px] font-mono hover:text-zinc-400 transition-colors">
                        Upgrade →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Upgrade CTA if not on api plan */}
          {plan !== "api" && (
            <section>
              <div className="border border-zinc-800/40 rounded-sm bg-zinc-950 p-5 text-center">
                <p className="text-zinc-400 text-sm mb-1">
                  Need higher limits or access to future endpoints?
                </p>
                <p className="text-zinc-600 text-[10px] mb-4">
                  API plan: {DAILY_LIMIT.api.toLocaleString()} calls/day · all v1 endpoints · WebSocket-ready
                </p>
                <a
                  href="/pricing"
                  className="inline-block text-[11px] font-mono text-black bg-white px-5 py-2 rounded-sm hover:bg-zinc-200 transition-colors"
                >
                  View API plan →
                </a>
              </div>
            </section>
          )}

          {/* Policy */}
          <section>
            <SectionLabel label="Policy" />
            <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 p-4">
              <div className="space-y-2 text-[10px] text-zinc-500 leading-relaxed">
                <p>· All v1 endpoints require a valid, active API key via <code className="text-zinc-600">x-smo-api-key</code> header.</p>
                <p>· Revoked keys return HTTP 403 immediately.</p>
                <p>· Quota exceeded returns HTTP 429 with <code className="text-zinc-600">Retry-After</code> header.</p>
                <p>· Plan restrictions return HTTP 403 with an upgrade message.</p>
                <p>· Usage is recorded per request. Quota resets at UTC midnight.</p>
                <p>· If quota tracking is temporarily unavailable, requests are allowed and marked degraded.</p>
              </div>
            </div>
          </section>

        </main>
      </div>

      <Footer />
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest shrink-0">
        {label}
      </span>
      <div className="flex-1 h-px bg-zinc-900" />
    </div>
  );
}
