import Link from "next/link";
import type { Metadata } from "next";
import MarketTicker from "@/components/MarketTicker";
import TerminalHeader from "@/components/TerminalHeader";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import ProviderConfigClient from "@/components/ProviderConfigClient";
import { getSystemReadiness } from "@/lib/providerConfig/providerReadiness";

export const metadata: Metadata = {
  title: "Provider Configuration — Activation Readiness | Sports Market OS",
  description:
    "Operational overview of Sports Market OS data provider configuration, " +
    "activation readiness, mode status, and environment validation.",
};

export const dynamic = "force-dynamic";

export default function ProviderConfigPage() {
  const readiness = getSystemReadiness();

  const overallColor =
    readiness.overallReadiness >= 80 ? "text-emerald-400" :
    readiness.overallReadiness >= 50 ? "text-amber-400"   : "text-red-400";

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
              <Link
                href="/system-status"
                className="text-zinc-600 text-[10px] font-mono hover:text-zinc-400 transition-colors"
              >
                System Status
              </Link>
              <span className="text-zinc-800 text-[10px]">›</span>
              <span className="text-zinc-400 text-[10px] font-mono">Provider Config</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-white text-2xl font-semibold tracking-tight mb-2">
                  Provider Configuration
                </h1>
                <p className="text-zinc-500 text-sm max-w-xl leading-relaxed">
                  Activation readiness, environment validation, data mode status,
                  and provider orchestration across the intelligence infrastructure.
                  No secret values are exposed.
                </p>
              </div>
              <div className="flex items-center gap-6 shrink-0">
                <div className="text-right">
                  <p className="text-zinc-600 text-[9px] font-mono mb-0.5">OVERALL READINESS</p>
                  <p className={`text-2xl font-bold tabular-nums ${overallColor}`}>
                    {readiness.overallReadiness}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-zinc-600 text-[9px] font-mono mb-0.5">LIVE</p>
                  <p className="text-emerald-400 text-2xl font-bold tabular-nums">
                    {readiness.liveReadyCount}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-zinc-600 text-[9px] font-mono mb-0.5">PROVIDERS</p>
                  <p className="text-white text-2xl font-bold tabular-nums">
                    {readiness.providers.length}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Config content */}
          <section className="px-6 py-6">
            <ProviderConfigClient readiness={readiness} />
          </section>

          <Footer />
        </main>
      </div>
    </div>
  );
}
