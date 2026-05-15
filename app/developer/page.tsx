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
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Developer Access — API Keys | Sports Market OS",
  description: "Manage your API keys and monitor usage for Sports Market OS intelligence feeds.",
};

export const dynamic = "force-dynamic";

export default async function DeveloperPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/signin");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/signin?next=/developer");

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
            <h1 className="text-xl font-bold mb-1">Developer Access</h1>
            <p className="text-zinc-400 text-sm">
              Manage API keys and monitor usage for the v1 intelligence feed.
            </p>
          </div>

          {/* Quick start */}
          <section>
            <SectionLabel label="Quick start" />
            <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 p-4 space-y-3">
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Include your API key in the <code className="text-zinc-300 font-mono">x-smo-api-key</code> header
                on all requests to <code className="text-zinc-300 font-mono">/api/v1/*</code>.
              </p>
              <pre className="text-[9px] font-mono text-zinc-400 bg-zinc-900/60 rounded-sm p-3 overflow-x-auto leading-relaxed">{`# Signals feed
curl https://sportsmarketos.com/api/v1/signals \\
  -H "x-smo-api-key: smo_live_your_key_here"

# Market pulse
curl https://sportsmarketos.com/api/v1/market-pulse \\
  -H "x-smo-api-key: smo_live_your_key_here"

# Daily brief
curl https://sportsmarketos.com/api/v1/daily-brief \\
  -H "x-smo-api-key: smo_live_your_key_here"`}</pre>
            </div>
          </section>

          {/* Available endpoints */}
          <section>
            <SectionLabel label="Available endpoints" />
            <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 overflow-hidden">
              <div className="divide-y divide-zinc-900/60">
                {[
                  { method: "GET", path: "/api/v1/signals",      desc: "Live market intelligence signals" },
                  { method: "GET", path: "/api/v1/market-pulse", desc: "Market pulse and regime data" },
                  { method: "GET", path: "/api/v1/daily-brief",  desc: "Latest persisted daily brief" },
                ].map((ep) => (
                  <div key={ep.path} className="px-4 py-3 flex items-center gap-3">
                    <span className="text-[8px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded-sm">
                      {ep.method}
                    </span>
                    <code className="text-zinc-200 text-[11px] font-mono flex-1">{ep.path}</code>
                    <span className="text-zinc-500 text-[10px]">{ep.desc}</span>
                  </div>
                ))}
              </div>
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

          {/* Rate limits note */}
          <section>
            <SectionLabel label="Rate limits & policy" />
            <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 p-4">
              <div className="space-y-2 text-[10px] text-zinc-500 leading-relaxed">
                <p>· All v1 endpoints require a valid, active API key.</p>
                <p>· Revoked keys return HTTP 403 immediately.</p>
                <p>· Keys are tied to your user account — one set of usage events per user.</p>
                <p>· Usage is recorded per request including endpoint, status code, and latency.</p>
                <p>· Rate limiting tiers are enforced at the plan level — contact us for higher limits.</p>
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
