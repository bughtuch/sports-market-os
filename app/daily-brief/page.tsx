import Link from "next/link";
import type { Metadata } from "next";
import MarketTicker from "@/components/MarketTicker";
import TerminalHeader from "@/components/TerminalHeader";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import WatchlistIntelligencePanel from "@/components/WatchlistIntelligencePanel";
import { generateDailyBrief } from "@/lib/briefs/dailyBriefGenerator";
import { BRIEF_TYPE_LABELS } from "@/lib/briefs/briefTypes";

export const metadata: Metadata = {
  title: "Daily Intelligence Brief | Sports Market OS",
  description:
    "Your daily AI-generated sports market intelligence brief. " +
    "Top signals, catalysts, volatility analysis, exchange flow notes, and regime commentary.",
};

export const dynamic = "force-dynamic";

const SECTION_SEVERITY_COLOR: Record<string, string> = {
  info:     "text-blue-400",
  warning:  "text-amber-400",
  critical: "text-red-400",
};

export default function DailyBriefPage() {
  const brief = generateDailyBrief();
  const label = BRIEF_TYPE_LABELS[brief.type];

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
              <span className="text-zinc-400 text-[10px] font-mono">Daily Brief</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
                  <span className="text-emerald-400 text-[9px] font-mono uppercase tracking-wider">
                    {label}
                  </span>
                </div>
                <h1 className="text-white text-2xl font-semibold tracking-tight mb-1">
                  {brief.title}
                </h1>
                <p className="text-zinc-500 text-sm max-w-xl leading-relaxed">
                  {brief.subtitle}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-zinc-600 text-[9px] font-mono mb-0.5">GENERATED</p>
                <p className="text-white text-sm font-mono">
                  {new Date(brief.generatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
                <p className="text-zinc-700 text-[9px] font-mono">
                  {new Date(brief.generatedAt).toLocaleDateString("en-GB", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </section>

          <div className="flex flex-col lg:flex-row">
            {/* Main brief content */}
            <div className="flex-1 px-6 py-6 space-y-6">

              {/* Brief sections */}
              {brief.sections.map((section, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-3">
                    {section.severity && (
                      <span className={`text-[8px] font-mono uppercase tracking-wider ${
                        SECTION_SEVERITY_COLOR[section.severity] ?? "text-zinc-600"
                      }`}>
                        {section.severity}
                      </span>
                    )}
                    <p className="text-zinc-500 text-[9px] font-mono uppercase tracking-widest">
                      {section.heading}
                    </p>
                    <div className="flex-1 h-px bg-zinc-900" />
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-3">{section.body}</p>
                  {section.bullets && (
                    <ul className="space-y-1.5">
                      {section.bullets.map((bullet, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="text-zinc-600 text-[10px] font-mono mt-0.5 shrink-0">
                            {j + 1 < 10 ? `0${j + 1}` : j + 1}.
                          </span>
                          <span className="text-zinc-300 text-[11px] leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {/* Brief type selector */}
              <div className="border-t border-zinc-900/60 pt-6">
                <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest mb-3">
                  Other Briefs
                </p>
                <div className="flex flex-wrap gap-2">
                  {(["morning", "midday", "overnight", "volatility-alert", "exchange-shift"] as const).map(t => (
                    <span
                      key={t}
                      className={`text-[9px] font-mono px-3 py-1.5 border rounded-sm ${
                        t === brief.type
                          ? "border-zinc-600 text-white bg-zinc-900"
                          : "border-zinc-800 text-zinc-500"
                      }`}
                    >
                      {BRIEF_TYPE_LABELS[t]}
                    </span>
                  ))}
                </div>
                <p className="text-zinc-700 text-[9px] font-mono mt-2">
                  Brief type auto-detected from current hour. Manual selection available in Sprint 24.
                </p>
              </div>

              {/* Compliance */}
              <p className="text-zinc-800 text-[9px] font-mono pt-2 border-t border-zinc-900/40">
                Market intelligence only · Not financial advice · Sports Market OS
              </p>
            </div>

            {/* Right panel — watchlist intelligence */}
            <div className="lg:w-80 shrink-0 border-t lg:border-t-0 lg:border-l border-zinc-900 px-6 py-6">
              <div className="flex items-center gap-2 mb-4">
                <p className="text-zinc-500 text-[9px] font-mono uppercase tracking-widest">
                  Watchlist Intelligence
                </p>
                <div className="flex-1 h-px bg-zinc-900" />
              </div>
              <WatchlistIntelligencePanel />

              {/* Quick nav */}
              <div className="mt-6 space-y-2">
                <p className="text-zinc-700 text-[8px] font-mono uppercase tracking-widest mb-2">
                  Quick Links
                </p>
                {[
                  { label: "Terminal →",         href: "/terminal" },
                  { label: "Alerts →",            href: "/alerts" },
                  { label: "Export Studio →",     href: "/export-studio" },
                  { label: "System Status →",     href: "/system-status" },
                ].map(l => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="block text-[9px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}
