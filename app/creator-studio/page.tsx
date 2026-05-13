import Link from "next/link";
import MarketTicker from "@/components/MarketTicker";
import TerminalHeader from "@/components/TerminalHeader";
import Sidebar from "@/components/Sidebar";
import SignalGenerator from "@/components/SignalGenerator";
import CreatorMetric, { type CreatorMetricProps } from "@/components/CreatorMetric";
import PartnerCard, { type PartnerData } from "@/components/PartnerCard";
import CreatorFeed from "@/components/CreatorFeed";
import MostSharedSignals from "@/components/MostSharedSignals";

// ─── Mock data ────────────────────────────────────────────────────────────────

const quickActions = [
  {
    label: "Generate Signal Card",
    symbol: "◈",
    description: "Create a branded, watermarked share card from any live signal.",
    accent: "text-amber-400",
    accentBg: "bg-amber-400/5",
    accentBorder: "hover:border-amber-400/30",
    href: "#generator",
    badge: "Core",
  },
  {
    label: "Create X Thread",
    symbol: "◇",
    description: "Multi-part thread breakdown with market intelligence narrative.",
    accent: "text-zinc-300",
    accentBg: "bg-zinc-300/5",
    accentBorder: "hover:border-zinc-500/30",
    href: "#",
    badge: "Coming",
  },
  {
    label: "Telegram Broadcast",
    symbol: "▣",
    description: "Send intelligence packages to connected channel networks.",
    accent: "text-blue-400",
    accentBg: "bg-blue-400/5",
    accentBorder: "hover:border-blue-400/30",
    href: "#",
    badge: "Beta",
  },
  {
    label: "Reddit Breakdown",
    symbol: "◎",
    description: "Long-form market analysis formatted for Reddit communities.",
    accent: "text-orange-400",
    accentBg: "bg-orange-400/5",
    accentBorder: "hover:border-orange-400/30",
    href: "#",
    badge: "Coming",
  },
  {
    label: "AI Market Brief",
    symbol: "◉",
    description: "AI-generated summary card with confidence scores and sparklines.",
    accent: "text-emerald-400",
    accentBg: "bg-emerald-400/5",
    accentBorder: "hover:border-emerald-400/30",
    href: "#",
    badge: "Core",
  },
  {
    label: "Export Watchlist",
    symbol: "▲",
    description: "Formatted watchlist package for sharing across platforms.",
    accent: "text-purple-400",
    accentBg: "bg-purple-400/5",
    accentBorder: "hover:border-purple-400/30",
    href: "#",
    badge: "Core",
  },
];

const distributionMetrics: CreatorMetricProps[] = [
  { label: "Estimated Reach", value: "248,400", change: "+12.4%", trend: "up", live: true },
  { label: "Shares Today", value: "1,284", change: "+34.2%", trend: "up", live: true },
  { label: "Creator Engagement", value: "8.7%", change: "+1.2pp", trend: "up" },
  { label: "Viral Velocity", value: "+142%", subtext: "7-day avg", trend: "up" },
  { label: "API Pulls", value: "4,812", change: "+22%", trend: "up", live: true },
  { label: "Partner Broadcasts", value: "48", subtext: "active", trend: "neutral" },
];

const partners: PartnerData[] = [
  {
    name: "@SharpFlowAI",
    platform: "Telegram",
    audience: "84.3K",
    signalsToday: 142,
    reach: "38.2K / day",
    engagement: "8.4%",
    live: true,
  },
  {
    name: "@LiquidityDesk",
    platform: "X / Twitter",
    audience: "31.2K",
    signalsToday: 64,
    reach: "14.8K / day",
    engagement: "6.2%",
    live: true,
  },
  {
    name: "@MarketPulse",
    platform: "Discord",
    audience: "12.8K",
    signalsToday: 48,
    reach: "6.4K / day",
    engagement: "11.2%",
    live: true,
  },
  {
    name: "Racing Intelligence",
    platform: "Telegram",
    audience: "28.4K",
    signalsToday: 88,
    reach: "22.1K / day",
    engagement: "9.1%",
    live: true,
  },
  {
    name: "Tennis Markets",
    platform: "X / Twitter",
    audience: "18.6K",
    signalsToday: 36,
    reach: "9.8K / day",
    engagement: "7.8%",
    live: false,
  },
  {
    name: "The Sharp Report",
    platform: "Newsletter",
    audience: "22.1K",
    signalsToday: 24,
    reach: "12.4K / day",
    engagement: "14.2%",
    live: false,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ label, sublabel }: { label: string; sublabel?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest shrink-0">
        {label}
      </span>
      {sublabel && (
        <span className="text-zinc-700 text-[9px] font-mono shrink-0">— {sublabel}</span>
      )}
      <div className="flex-1 h-px bg-zinc-900" />
    </div>
  );
}

function BadgePill({ label }: { label: string }) {
  const styles: Record<string, string> = {
    Core: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
    Beta: "text-blue-400 border-blue-400/30 bg-blue-400/5",
    Coming: "text-zinc-600 border-zinc-700 bg-zinc-900",
  };
  return (
    <span
      className={`text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 border rounded-sm ${
        styles[label] ?? styles.Coming
      }`}
    >
      {label}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CreatorStudioPage() {
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
          {/* ─── Studio header ──────────────────────────────────────────── */}
          <section className="px-6 py-5 border-b border-zinc-900 bg-zinc-950/40">
            <div className="flex items-center gap-2 mb-4">
              <Link
                href="/terminal"
                className="text-zinc-600 text-[10px] font-mono hover:text-zinc-400 transition-colors"
              >
                Terminal
              </Link>
              <span className="text-zinc-800 text-[10px]">›</span>
              <span className="text-zinc-400 text-[10px] font-mono">Creator Studio</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-white text-2xl font-semibold tracking-tight mb-2">
                  Creator Studio
                </h1>
                <p className="text-zinc-500 text-sm max-w-xl leading-relaxed">
                  Generate branded market intelligence for X, Telegram, Discord, Reddit, LinkedIn,
                  and creator distribution networks.
                </p>
              </div>

              {/* Live header stats */}
              <div className="flex items-center gap-6 shrink-0">
                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end mb-0.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot" />
                    <span className="text-emerald-400 text-[9px] font-mono uppercase tracking-wider">
                      Live
                    </span>
                  </div>
                  <p className="text-white text-sm font-semibold tabular-nums">1,284</p>
                  <p className="text-zinc-600 text-[9px] font-mono">cards today</p>
                </div>
                <div className="text-right">
                  <p className="text-zinc-600 text-[9px] font-mono mb-0.5">CREATOR REACH</p>
                  <p className="text-white text-sm font-semibold tabular-nums">248,400</p>
                  <p className="text-zinc-600 text-[9px] font-mono">estimated</p>
                </div>
                <div className="text-right">
                  <p className="text-zinc-600 text-[9px] font-mono mb-0.5">PARTNERS</p>
                  <p className="text-purple-400 text-sm font-semibold tabular-nums">48</p>
                  <p className="text-zinc-600 text-[9px] font-mono">active</p>
                </div>
              </div>
            </div>
          </section>

          {/* ─── Quick Actions ──────────────────────────────────────────── */}
          <section className="px-6 py-5 border-b border-zinc-900">
            <SectionHeader label="Quick Actions" sublabel="6 tools" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {quickActions.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className={`group bg-zinc-950 border border-zinc-800/80 rounded-sm p-4 transition-all duration-200 hover:bg-zinc-900/50 ${action.accentBorder} ${action.accentBg} block`}
                >
                  <div className={`text-xl font-mono mb-3 ${action.accent}`}>
                    {action.symbol}
                  </div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <p className="text-white text-xs font-medium leading-tight">{action.label}</p>
                  </div>
                  <p className="text-zinc-600 text-[10px] leading-relaxed mb-3">
                    {action.description}
                  </p>
                  <BadgePill label={action.badge} />
                </a>
              ))}
            </div>
          </section>

          {/* ─── Signal Generator ───────────────────────────────────────── */}
          <section id="generator" className="px-6 py-5 border-b border-zinc-900">
            <SectionHeader label="Signal Card Generator" sublabel="Live preview" />
            <SignalGenerator />
          </section>

          {/* ─── Distribution Metrics ───────────────────────────────────── */}
          <section className="px-6 py-5 border-b border-zinc-900">
            <SectionHeader label="Distribution Metrics" sublabel="Real-time" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {distributionMetrics.map((m) => (
                <CreatorMetric key={m.label} {...m} />
              ))}
            </div>
          </section>

          {/* ─── Most Shared ────────────────────────────────────────────── */}
          <section className="px-6 py-5 border-b border-zinc-900">
            <SectionHeader label="Most Shared Signals" sublabel="Last 24h" />
            <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm overflow-hidden">
              <MostSharedSignals />
            </div>
          </section>

          {/* ─── Partner Network ────────────────────────────────────────── */}
          <section className="px-6 py-5 border-b border-zinc-900">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                  Partner Network
                </span>
                <div className="h-px w-16 bg-zinc-900" />
              </div>
              <button className="text-xs font-medium text-black bg-white px-4 py-1.5 rounded-sm hover:bg-zinc-200 transition-colors">
                Apply For Partner Access
              </button>
            </div>

            <div className="mb-4 max-w-xl">
              <p className="text-zinc-500 text-sm leading-relaxed">
                Partners distribute Sports Market OS intelligence to their audiences — reaching
                sports traders, creators, and market enthusiasts across every platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {partners.map((p) => (
                <PartnerCard key={p.name} {...p} />
              ))}
            </div>
          </section>

          {/* ─── Free Model ─────────────────────────────────────────────── */}
          <section className="px-6 py-5 border-b border-zinc-900">
            <SectionHeader label="Distribution Model" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-900 border border-zinc-900 rounded-sm overflow-hidden">
              {[
                {
                  tier: "Free",
                  color: "text-white",
                  items: [
                    "Market pulse signals",
                    "Share card generation",
                    "Watermarked exports",
                    "Watchlist snapshots",
                    "AI market summaries",
                    "Creator network access",
                  ],
                },
                {
                  tier: "Premium",
                  color: "text-amber-400",
                  items: [
                    "Deep signal feeds",
                    "Advanced AI modules",
                    "Priority data speed",
                    "API layer access",
                    "Partner infrastructure",
                    "Custom watermarks",
                  ],
                },
              ].map((tier) => (
                <div key={tier.tier} className="bg-black p-6">
                  <p className={`text-xs font-semibold font-mono uppercase tracking-widest mb-4 ${tier.color}`}>
                    {tier.tier}
                  </p>
                  <ul className="space-y-2">
                    {tier.items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-zinc-400 text-xs">
                        <span className={`text-[10px] ${tier.color}`}>◈</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Creator Feed ───────────────────────────────────────────── */}
          <section className="px-6 py-5">
            <SectionHeader label="Creator Activity" sublabel="Live network feed" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm overflow-hidden">
                <CreatorFeed />
              </div>
              <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-5 flex flex-col justify-between">
                <div>
                  <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-3">
                    Become A Creator
                  </p>
                  <h3 className="text-white text-base font-semibold mb-2">
                    Distribute intelligence to your audience
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    Generate branded signal cards from live market data. Share across X, Telegram,
                    Discord, and Reddit. Every card carries your handle and the Sports Market OS
                    watermark — growing both your brand and ours.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <button className="text-xs font-medium text-black bg-white px-5 py-2.5 rounded-sm hover:bg-zinc-200 transition-colors">
                    Start Creating
                  </button>
                  <button className="text-xs font-medium text-zinc-400 border border-zinc-800 px-5 py-2.5 rounded-sm hover:border-zinc-600 hover:text-white transition-colors">
                    View Docs
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
