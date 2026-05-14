import type { Metadata } from "next";
import Link from "next/link";
import MarketTicker from "@/components/MarketTicker";
import TerminalHeader from "@/components/TerminalHeader";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import NotificationSettingsClient from "@/components/NotificationSettingsClient";

export const metadata: Metadata = {
  title: "Notification Settings | Sports Market OS",
  description:
    "Configure delivery channels, alert categories, quiet hours, and daily brief delivery " +
    "for your Sports Market OS intelligence notifications.",
  robots: { index: false, follow: false },
};

export default function NotificationSettingsPage() {
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
              <Link href="/account" className="text-zinc-600 text-[10px] font-mono hover:text-zinc-400 transition-colors">
                Account
              </Link>
              <span className="text-zinc-800 text-[10px]">›</span>
              <span className="text-zinc-400 text-[10px] font-mono">Notification Settings</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-white text-2xl font-semibold tracking-tight mb-1">
                  Notification Settings
                </h1>
                <p className="text-zinc-500 text-sm max-w-lg leading-relaxed">
                  Configure delivery channels, alert categories, quiet hours, and daily brief delivery.
                  In-app delivery is always active.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-emerald-600 text-[9px] font-mono">IN-APP ACTIVE</span>
                </div>
              </div>
            </div>
          </section>

          {/* Delivery architecture strip */}
          <section className="px-6 py-3 border-b border-zinc-900 bg-zinc-950/20">
            <div className="flex flex-wrap items-center gap-6">
              {[
                { label: "In-App",   status: "Active",           color: "text-emerald-400" },
                { label: "Email",    status: "Setup required",   color: "text-zinc-500" },
                { label: "Telegram", status: "Bot not connected",color: "text-zinc-500" },
                { label: "Push",     status: "Permission needed",color: "text-zinc-500" },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-2">
                  <span className="text-zinc-600 text-[9px] font-mono">{c.label}</span>
                  <span className={`text-[9px] font-mono ${c.color}`}>{c.status}</span>
                </div>
              ))}
              <Link
                href="/alerts"
                className="text-zinc-600 text-[9px] font-mono hover:text-zinc-400 transition-colors ml-auto"
              >
                Alert Center →
              </Link>
            </div>
          </section>

          {/* Settings */}
          <section className="px-6 py-6">
            <NotificationSettingsClient />
          </section>

          <Footer />
        </main>
      </div>
    </div>
  );
}
