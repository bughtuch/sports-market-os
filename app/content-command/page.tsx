import type { Metadata } from "next";
import Link from "next/link";
import MarketTicker from "@/components/MarketTicker";
import TerminalHeader from "@/components/TerminalHeader";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import XPostGenerator from "@/components/XPostGenerator";
import ShortsScriptGenerator from "@/components/ShortsScriptGenerator";
import TelegramBroadcastGenerator from "@/components/TelegramBroadcastGenerator";
import CreatorOutreachQueue from "@/components/CreatorOutreachQueue";
import WeeklyContentCalendar from "@/components/WeeklyContentCalendar";
import CatalystContentGenerator from "@/components/CatalystContentGenerator";
import OddsContentGenerator from "@/components/OddsContentGenerator";

export const metadata: Metadata = {
  title: "Content Command — Creator Pipeline | Sports Market OS",
  description:
    "Daily content generation for Sports Market OS creators. Generate X posts, YouTube Shorts scripts, Telegram broadcasts, manage creator outreach, and schedule content.",
};

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({
  id,
  label,
  sublabel,
  accentClass = "text-zinc-500",
}: {
  id?: string;
  label: string;
  sublabel?: string;
  accentClass?: string;
}) {
  return (
    <div id={id} className="flex items-center gap-3 mb-5 scroll-mt-4">
      <span className={`text-[9px] font-mono uppercase tracking-widest shrink-0 ${accentClass}`}>
        {label}
      </span>
      {sublabel && (
        <span className="text-zinc-700 text-[9px] font-mono shrink-0">— {sublabel}</span>
      )}
      <div className="flex-1 h-px bg-zinc-900" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContentCommandPage() {
  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      <MarketTicker />
      <TerminalHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {/* ─── Header ─────────────────────────────────────────────────── */}
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
                href="/creator-studio"
                className="text-zinc-600 text-[10px] font-mono hover:text-zinc-400 transition-colors"
              >
                Creator Studio
              </Link>
              <span className="text-zinc-800 text-[10px]">›</span>
              <span className="text-zinc-400 text-[10px] font-mono">Content Command</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-white text-2xl font-semibold tracking-tight mb-2">
                  Content Command
                </h1>
                <p className="text-zinc-500 text-sm max-w-xl leading-relaxed">
                  Daily content generation pipeline. Generate posts, Shorts scripts, broadcasts,
                  manage creator outreach, and schedule the weekly content calendar.
                </p>
              </div>

              {/* Live stats */}
              <div className="flex items-center gap-6 shrink-0">
                <div className="text-right">
                  <p className="text-zinc-600 text-[9px] font-mono mb-0.5">SIGNALS TODAY</p>
                  <p className="text-white text-sm font-semibold tabular-nums">142</p>
                  <p className="text-zinc-600 text-[9px] font-mono">across 7 sports</p>
                </div>
                <div className="text-right">
                  <p className="text-zinc-600 text-[9px] font-mono mb-0.5">POSTS READY</p>
                  <p className="text-amber-400 text-sm font-semibold tabular-nums">18</p>
                  <p className="text-zinc-600 text-[9px] font-mono">this week</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end mb-0.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot" />
                    <span className="text-emerald-400 text-[9px] font-mono uppercase tracking-wider">Live</span>
                  </div>
                  <p className="text-white text-sm font-semibold tabular-nums">6</p>
                  <p className="text-zinc-600 text-[9px] font-mono">AI engines</p>
                </div>
              </div>
            </div>

            {/* Quick-jump nav */}
            <div className="flex flex-wrap gap-2 mt-5">
              {[
                { href: "#catalysts", label: "Live Catalysts",  color: "text-emerald-400" },
                { href: "#pricing",   label: "Pricing Movement",color: "text-teal-400" },
                { href: "#x-posts",   label: "X Posts",         color: "text-zinc-300" },
                { href: "#shorts",    label: "YouTube Shorts",  color: "text-red-400" },
                { href: "#telegram",  label: "Telegram",        color: "text-blue-400" },
                { href: "#outreach",  label: "Creator Outreach",color: "text-amber-400" },
                { href: "#calendar",  label: "Content Calendar",color: "text-purple-400" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-[9px] font-mono px-3 py-1.5 border border-zinc-800 rounded-sm hover:border-zinc-600 transition-colors ${link.color}`}
                >
                  {link.label} →
                </a>
              ))}
            </div>
          </section>

          {/* ─── Real Catalyst Feed ─────────────────────────────────────── */}
          <section id="catalysts" className="px-6 py-6 border-b border-zinc-900 scroll-mt-4">
            <SectionHeader
              label="Real Catalyst Feed"
              sublabel="Generate content from live news"
              accentClass="text-emerald-400"
            />
            <CatalystContentGenerator />
          </section>

          {/* ─── Pricing Movement Content ────────────────────────────────── */}
          <section id="pricing" className="px-6 py-6 border-b border-zinc-900 scroll-mt-4">
            <SectionHeader
              label="Pricing Movement Content"
              sublabel="Generate posts from live odds movement"
              accentClass="text-teal-400"
            />
            <OddsContentGenerator />
          </section>

          {/* ─── X Post Generator ───────────────────────────────────────── */}
          <section id="x-posts" className="px-6 py-6 border-b border-zinc-900 scroll-mt-4">
            <SectionHeader
              label="X Post Generator"
              sublabel="3 styles per signal"
              accentClass="text-zinc-300"
            />
            <XPostGenerator />
          </section>

          {/* ─── YouTube Shorts Generator ───────────────────────────────── */}
          <section id="shorts" className="px-6 py-6 border-b border-zinc-900 scroll-mt-4">
            <SectionHeader
              label="YouTube Shorts Script"
              sublabel="30–60 second scripts"
              accentClass="text-red-400"
            />
            <ShortsScriptGenerator />
          </section>

          {/* ─── Telegram Broadcast Generator ──────────────────────────── */}
          <section id="telegram" className="px-6 py-6 border-b border-zinc-900 scroll-mt-4">
            <SectionHeader
              label="Telegram Broadcast"
              sublabel="Standard · Brief · Deep Dive"
              accentClass="text-blue-400"
            />
            <TelegramBroadcastGenerator />
          </section>

          {/* ─── Creator Outreach Queue ─────────────────────────────────── */}
          <section id="outreach" className="px-6 py-6 border-b border-zinc-900 scroll-mt-4">
            <SectionHeader
              label="Creator Outreach"
              sublabel="10 leads"
              accentClass="text-amber-400"
            />

            {/* Positioning reminder */}
            <div className="mb-5 bg-zinc-950/60 border border-zinc-800/40 rounded-sm px-4 py-3 flex items-start gap-3">
              <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <p className="text-zinc-600 text-[10px] leading-relaxed">
                Positioning: <span className="text-zinc-400">&ldquo;We built a free Bloomberg-style sports market intelligence terminal with shareable AI signal cards.&rdquo;</span>{" "}
                No tips, no picks, no gambling language.
              </p>
            </div>

            <CreatorOutreachQueue />
          </section>

          {/* ─── Weekly Content Calendar ────────────────────────────────── */}
          <section id="calendar" className="px-6 py-6 border-b border-zinc-900 scroll-mt-4">
            <SectionHeader
              label="Weekly Content Calendar"
              sublabel="21 scheduled posts"
              accentClass="text-purple-400"
            />
            <WeeklyContentCalendar />
          </section>

          {/* ─── Copy safety note ────────────────────────────────────────── */}
          <section className="px-6 py-6 border-b border-zinc-900">
            <div className="max-w-2xl bg-zinc-950 border border-zinc-800/60 rounded-sm p-5">
              <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-3">
                Content compliance guidelines
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-wider mb-2">Always use</p>
                  <ul className="space-y-1.5">
                    {[
                      "Market intelligence",
                      "Volatility detection",
                      "Liquidity analysis",
                      "Structural movement",
                      "AI analysis / AI confidence",
                      "Exchange order flow",
                    ].map((term) => (
                      <li key={term} className="flex items-center gap-2">
                        <span className="text-emerald-500 text-[9px] font-mono">+</span>
                        <span className="text-zinc-400 text-[10px]">{term}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-wider mb-2">Never use</p>
                  <ul className="space-y-1.5">
                    {[
                      "Guaranteed profit",
                      "Bet now",
                      "Picks / tips",
                      "Gambling advice",
                      "Win / lose",
                      "Place a bet",
                    ].map((term) => (
                      <li key={term} className="flex items-center gap-2">
                        <span className="text-red-500 text-[9px] font-mono">−</span>
                        <span className="text-zinc-500 text-[10px]">{term}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <Footer />
        </main>
      </div>
    </div>
  );
}
