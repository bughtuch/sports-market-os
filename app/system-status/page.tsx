import Link from "next/link";
import type { Metadata } from "next";
import MarketTicker from "@/components/MarketTicker";
import TerminalHeader from "@/components/TerminalHeader";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import SystemStatusClient from "@/components/SystemStatusClient";
import { getProviderHealth } from "@/lib/providers/providerHealth";
import { getSystemReadiness } from "@/lib/providerConfig/providerReadiness";
import { isEmailConfigured } from "@/lib/email/resendClient";

export const metadata: Metadata = {
  title: "System Status — Provider Health & Data Modes | Sports Market OS",
  description:
    "Live view of Sports Market OS provider health, data modes, API latency, " +
    "fallback events, and refresh cadence across the intelligence infrastructure.",
};

export const dynamic = "force-dynamic";

export default function SystemStatusPage() {
  const summary         = getProviderHealth();
  const readiness       = getSystemReadiness();
  const emailConfigured = isEmailConfigured();

  const scoreColor =
    summary.systemHealthScore >= 80 ? "text-emerald-400" :
    summary.systemHealthScore >= 50 ? "text-amber-400"   : "text-red-400";

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
              <Link
                href="/terminal"
                className="text-zinc-600 text-[10px] font-mono hover:text-zinc-400 transition-colors"
              >
                Terminal
              </Link>
              <span className="text-zinc-800 text-[10px]">›</span>
              <span className="text-zinc-400 text-[10px] font-mono">System Status</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-white text-2xl font-semibold tracking-tight mb-2">
                  System Status
                </h1>
                <p className="text-zinc-500 text-sm max-w-xl leading-relaxed">
                  Provider health, data modes, API latency, and refresh orchestration
                  across the live intelligence infrastructure.
                </p>
              </div>
              <div className="flex items-center gap-6 shrink-0">
                <div className="text-right">
                  <p className="text-zinc-600 text-[9px] font-mono mb-0.5">HEALTH SCORE</p>
                  <p className={`text-2xl font-bold tabular-nums ${scoreColor}`}>
                    {summary.systemHealthScore}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-zinc-600 text-[9px] font-mono mb-0.5">PROVIDERS</p>
                  <p className="text-white text-2xl font-bold tabular-nums">
                    {summary.providers.length}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Readiness summary strip */}
          <section className="px-6 py-3 border-b border-zinc-900 bg-zinc-950/30">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-zinc-600 text-[9px] font-mono uppercase tracking-wider">Activation Readiness</span>
                <span className={`text-sm font-mono font-bold ${
                  readiness.overallReadiness >= 80 ? "text-emerald-400" :
                  readiness.overallReadiness >= 50 ? "text-amber-400"   : "text-red-400"
                }`}>{readiness.overallReadiness}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-zinc-500 text-[9px] font-mono">{readiness.liveReadyCount} live</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-zinc-500 text-[9px] font-mono">{readiness.simulatedCount} simulated</span>
              </div>
              {readiness.missingRequirementsCount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span className="text-red-400 text-[9px] font-mono">{readiness.missingRequirementsCount} missing env vars</span>
                </div>
              )}
              <Link
                href="/provider-config"
                className="text-zinc-600 text-[9px] font-mono hover:text-zinc-400 transition-colors ml-auto"
              >
                Provider Config →
              </Link>
            </div>
          </section>

          {/* Status content */}
          <section className="px-6 py-6">
            <SystemStatusClient summary={summary} emailConfigured={emailConfigured} />
          </section>

          <Footer />
        </main>
      </div>
    </div>
  );
}
