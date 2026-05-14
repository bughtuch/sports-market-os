/**
 * Distribution Center — Sprint 20.
 *
 * Command center for queued posts, scheduled exports, creator broadcasts,
 * distribution history, and engagement placeholders.
 *
 * No real API posting. OAuth not yet wired. Queue lives in localStorage.
 */

import type { Metadata } from "next";
import Link from "next/link";
import MarketTicker from "@/components/MarketTicker";
import TerminalHeader from "@/components/TerminalHeader";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import DistributionCenterClient from "@/components/distribution/DistributionCenterClient";

export const metadata: Metadata = {
  title:       "Distribution Center — Sports Market OS",
  description: "Manage queued posts, scheduled broadcasts, creator distributions, and engagement tracking.",
  robots:      { index: false, follow: false },
};

// ─── Platform connection pills ────────────────────────────────────────────────
// All show as "not connected" until OAuth is wired per-platform.

const PLATFORMS = [
  { label: "X / Twitter",      connected: false, color: "text-zinc-300" },
  { label: "Telegram",         connected: false, color: "text-blue-400" },
  { label: "Discord",          connected: false, color: "text-indigo-400" },
  { label: "Reddit",           connected: false, color: "text-orange-400" },
  { label: "YouTube Shorts",   connected: false, color: "text-red-400" },
  { label: "TikTok",           connected: false, color: "text-pink-400" },
  { label: "Instagram",        connected: false, color: "text-purple-400" },
  { label: "Email Brief",      connected: false, color: "text-amber-400" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DistributionCenterPage() {
  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      <MarketTicker />
      <TerminalHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          {/* ─── Header ───────────────────────────────────────────────── */}
          <section className="px-6 py-5 border-b border-zinc-900 bg-zinc-950/40">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-4">
              <Link href="/terminal" className="text-zinc-600 text-[10px] font-mono hover:text-zinc-400 transition-colors">
                Terminal
              </Link>
              <span className="text-zinc-800 text-[10px]">›</span>
              <span className="text-zinc-400 text-[10px] font-mono">Distribution Center</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-white text-2xl font-semibold tracking-tight mb-2">
                  Distribution Center
                </h1>
                <p className="text-zinc-500 text-sm max-w-xl leading-relaxed">
                  Manage your signal distribution queue, creator broadcasts, and posting history.
                  Content goes out via X, Telegram, Discord, Reddit, and more — when OAuth is connected.
                </p>
              </div>

              {/* Status indicators */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="text-amber-500 text-[9px] font-mono">MOCK MODE</span>
                </div>
                <div className="text-zinc-700 text-[9px] font-mono border border-zinc-800 px-2 py-1 rounded-sm">
                  No OAuth connected
                </div>
              </div>
            </div>

            {/* Platform connection status */}
            <div className="flex flex-wrap gap-2 mt-5">
              {PLATFORMS.map(p => (
                <div
                  key={p.label}
                  className="flex items-center gap-1.5 text-[9px] font-mono px-2.5 py-1 border border-zinc-800 rounded-sm"
                >
                  <span className="w-1 h-1 rounded-full bg-zinc-700" />
                  <span className={p.connected ? p.color : "text-zinc-700"}>{p.label}</span>
                  <span className="text-zinc-800">·</span>
                  <span className="text-zinc-700">{p.connected ? "connected" : "not connected"}</span>
                </div>
              ))}
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                { href: "/export-studio",    label: "Export Studio →",    color: "text-violet-400" },
                { href: "/content-command",  label: "Content Command →",  color: "text-red-400" },
                { href: "/creator-studio",   label: "Creator Studio →",   color: "text-purple-400" },
                { href: "/partner-dashboard",label: "Partner Dashboard →", color: "text-emerald-400" },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[9px] font-mono px-3 py-1.5 border border-zinc-800 rounded-sm hover:border-zinc-600 transition-colors ${link.color}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>

          {/* ─── Main client content ───────────────────────────────────── */}
          <section className="px-6 py-6">
            <DistributionCenterClient />
          </section>

          <Footer />
        </main>
      </div>
    </div>
  );
}
