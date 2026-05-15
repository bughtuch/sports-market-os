import Link from "next/link";
import MarketTicker from "@/components/MarketTicker";
import SportsHubCard, { type SportsHubData } from "@/components/SportsHubCard";
import NavAuth from "@/components/NavAuth";
import Footer from "@/components/Footer";


// ─── Mock data ───────────────────────────────────────────────────────────────

const pulseSignals = [
  {
    id: "sharp-money",
    label: "Sharp Money",
    description: "Institutional-grade detection of sharp-side movement across exchanges.",
    indicator: "text-amber-400",
  },
  {
    id: "liquidity-radar",
    label: "Liquidity Radar",
    description: "Real-time queue depth and exchange flow analysis across all markets.",
    indicator: "text-blue-400",
  },
  {
    id: "ai-brief",
    label: "AI Market Brief",
    description: "Narrative intelligence generated from structural market data.",
    indicator: "text-emerald-400",
  },
  {
    id: "volatility",
    label: "Volatility Watch",
    description: "Compression and expansion events flagged before they become consensus.",
    indicator: "text-red-400",
  },
  {
    id: "creator-signal",
    label: "Creator Signal",
    description: "Branded market intelligence ready for distribution to any audience.",
    indicator: "text-purple-400",
  },
  {
    id: "exchange-flow",
    label: "Exchange Flow",
    description: "Cross-market liquidity movement and pricing divergence detection.",
    indicator: "text-zinc-300",
  },
];

const sportsHubs: SportsHubData[] = [
  {
    name: "Horse Racing",
    tagline: "Queue health, exchange flow, Betfair liquidity, and sharp positioning — the complete racing intelligence layer.",
    metrics: "48 markets live",
    accent: "text-amber-400",
    accentBg: "bg-amber-400/10",
    accentBorder: "border-amber-400/20",
    symbol: "◈",
  },
  {
    name: "Tennis",
    tagline: "In-play momentum, serve pattern analysis, and live volatility across ATP and WTA markets.",
    metrics: "24 markets live",
    accent: "text-emerald-400",
    accentBg: "bg-emerald-400/10",
    accentBorder: "border-emerald-400/20",
    symbol: "◇",
  },
  {
    name: "NBA",
    tagline: "Spread pressure detection, sharp movement tracking, and quarter-by-quarter liquidity analysis.",
    metrics: "16 markets live",
    accent: "text-blue-400",
    accentBg: "bg-blue-400/10",
    accentBorder: "border-blue-400/20",
    symbol: "▣",
  },
  {
    name: "NFL",
    tagline: "Line movement analytics, public vs. sharp divergence, and game-time liquidity shifts.",
    metrics: "12 markets live",
    accent: "text-red-400",
    accentBg: "bg-red-400/10",
    accentBorder: "border-red-400/20",
    symbol: "▲",
  },
  {
    name: "UFC",
    tagline: "Underdog value detection, late-money identification, and fight-week momentum tracking.",
    metrics: "8 markets live",
    accent: "text-orange-400",
    accentBg: "bg-orange-400/10",
    accentBorder: "border-orange-400/20",
    symbol: "◉",
  },
  {
    name: "Football",
    tagline: "European exchange data, value identification across leagues, and sharp money mapping.",
    metrics: "64 markets live",
    accent: "text-zinc-300",
    accentBg: "bg-zinc-300/10",
    accentBorder: "border-zinc-300/20",
    symbol: "○",
  },
  {
    name: "Prediction Markets",
    tagline: "Contract pricing divergence, volume acceleration, and structural edge across prediction platforms.",
    metrics: "76 contracts live",
    accent: "text-purple-400",
    accentBg: "bg-purple-400/10",
    accentBorder: "border-purple-400/20",
    symbol: "◎",
  },
];

const ecosystemApps = [
  {
    name: "Horse Racing Trader",
    description: "The execution layer for the Betfair exchange. Trade, monitor, and act on Sports Market OS intelligence in real time.",
    status: "Live",
    statusColor: "text-emerald-400",
  },
  {
    name: "Tennis Trader UK",
    description: "Exchange-native tennis trading for UK markets. Powered by live momentum, volatility, and queue data from the intelligence layer.",
    status: "Live",
    statusColor: "text-emerald-400",
  },
  {
    name: "Tennis Trader USA",
    description: "US market tennis intelligence and execution. Connects directly to the Sports Market OS AI feed for real-time signals.",
    status: "Live",
    statusColor: "text-emerald-400",
  },
  {
    name: "NBA Trading",
    description: "Coming soon. Exchange-native basketball market intelligence with in-play spread analytics and sharp-side detection.",
    status: "Coming Soon",
    statusColor: "text-zinc-500",
  },
];

const distributionFeatures = [
  {
    title: "Free Market Intelligence",
    description: "Core signals are available at no cost. Premium depth for those who need more.",
  },
  {
    title: "Creator Content Studio",
    description: "Branded, watermarked share cards generated from live market data — ready to post.",
  },
  {
    title: "Partner Distribution",
    description: "Connect your audience to Sports Market OS intelligence through a co-branded feed.",
  },
  {
    title: "API Layer",
    description: "Structured data access for builders. Integrate market intelligence into your own product.",
  },
];

const heroTickerItems = [
  "Ascot liquidity spike detected",
  "Djokovic market volatility rising",
  "NFL sharp movement: spread pressure building",
  "UFC momentum shift flagged by AI",
  "Prediction market volume accelerating",
  "Queue health warning: Ascot 2.40",
  "NBA line movement: late-side pressure",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeroTicker() {
  const doubled = [...heroTickerItems, ...heroTickerItems];
  return (
    <div className="overflow-hidden border border-zinc-800 rounded-sm bg-zinc-950/60 py-2.5 mb-10">
      <div className="ticker-animate">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 px-6 text-xs text-zinc-400 whitespace-nowrap"
          >
            <span className="w-1 h-1 rounded-full bg-emerald-500 pulse-dot shrink-0" />
            {item}
            <span className="text-zinc-700 mx-2">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest shrink-0">
        {label}
      </span>
      <div className="flex-1 h-px bg-zinc-900" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top market ticker */}
      <MarketTicker />

      {/* Nav */}
      <header className="border-b border-zinc-900 px-6 py-3 flex items-center justify-between sticky top-0 bg-black/90 backdrop-blur-sm z-10">
        <Link href="/" className="text-white text-sm font-semibold tracking-tight">
          Sports Market <span className="text-zinc-500">OS</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-500">
          <Link href="/terminal" className="hover:text-white transition-colors">Terminal</Link>
          <Link href="#markets" className="hover:text-white transition-colors">Markets</Link>
          <Link href="#ecosystem" className="hover:text-white transition-colors">Ecosystem</Link>
          <Link href="#api" className="hover:text-white transition-colors">API</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/terminal"
            className="text-xs font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block"
          >
            Terminal
          </Link>
          <NavAuth />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* ─── Hero ──────────────────────────────────────────────────────── */}
        <section className="mb-28">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
              <span className="text-emerald-400 text-[10px] font-mono uppercase tracking-widest">
                Intelligence Terminal — Live
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight text-white mb-6">
              The AI Operating System
              <br />
              <span className="text-zinc-500">For Sports Markets</span>
            </h1>

            <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl mb-10">
              Live market intelligence, sharp money detection, liquidity analysis, AI commentary,
              and creator-ready sports market content — built for the next era of exchange-native
              sports trading.
            </p>

            <HeroTicker />

            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/terminal"
                className="inline-flex items-center gap-2 bg-white text-black text-sm font-medium px-6 py-3 rounded-sm hover:bg-zinc-200 transition-colors"
              >
                Open Terminal
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="#markets"
                className="inline-flex items-center gap-2 border border-zinc-800 text-zinc-300 text-sm font-medium px-6 py-3 rounded-sm hover:border-zinc-600 hover:text-white transition-colors"
              >
                Explore Markets
              </Link>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 rounded-sm">
                <span className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot shrink-0" />
                LIVE ON BETFAIR EXCHANGE
              </span>
            </div>
          </div>
        </section>

        {/* ─── Live Market Pulse ─────────────────────────────────────────── */}
        <section className="mb-24">
          <SectionLabel label="Live Market Pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-900">
            {pulseSignals.map((signal) => (
              <div
                key={signal.id}
                className="bg-black p-6 hover:bg-zinc-950 transition-colors group cursor-pointer"
              >
                <div className={`text-xs font-mono uppercase tracking-widest mb-3 ${signal.indicator}`}>
                  {signal.label}
                </div>
                <p className="text-zinc-500 text-sm leading-relaxed">{signal.description}</p>
                <div className="mt-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-zinc-600 text-[10px] font-mono">View feed</span>
                  <svg
                    className="w-3 h-3 text-zinc-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Sports Hubs ───────────────────────────────────────────────── */}
        <section id="markets" className="mb-24">
          <SectionLabel label="Sports Hubs" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {sportsHubs.map((hub) => (
              <SportsHubCard key={hub.name} {...hub} />
            ))}
          </div>
        </section>

        {/* ─── Ecosystem Layer ───────────────────────────────────────────── */}
        <section id="ecosystem" className="mb-24">
          <SectionLabel label="Ecosystem" />
          <div className="mb-6 max-w-xl">
            <p className="text-zinc-500 text-sm leading-relaxed">
              Sports Market OS is the intelligence layer. Connected execution apps deliver that
              intelligence directly to trading environments.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ecosystemApps.map((app) => (
              <div
                key={app.name}
                className="bg-zinc-950 border border-zinc-800/80 rounded-sm p-5 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white text-sm font-semibold">{app.name}</h3>
                  <span className={`text-[10px] font-mono uppercase tracking-wider ${app.statusColor}`}>
                    {app.status}
                  </span>
                </div>
                <p className="text-zinc-500 text-xs leading-relaxed">{app.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Distribution Model ────────────────────────────────────────── */}
        <section id="api" className="mb-24">
          <SectionLabel label="Distribution" />
          <div className="mb-6 max-w-xl">
            <h2 className="text-white text-xl font-semibold mb-2">Built to move at scale</h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Intelligence without reach is wasted. Sports Market OS is designed to be distributed,
              embedded, and shared.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {distributionFeatures.map((feature) => (
              <div
                key={feature.title}
                className="border border-zinc-900 rounded-sm p-5 hover:border-zinc-800 transition-colors"
              >
                <h3 className="text-white text-sm font-medium mb-2">{feature.title}</h3>
                <p className="text-zinc-600 text-xs leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Final CTA ─────────────────────────────────────────────────── */}
        <section className="border border-zinc-900 rounded-sm p-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
            <span className="text-emerald-400 text-[10px] font-mono uppercase tracking-widest">
              Terminal Ready
            </span>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-white mb-4">
            Open The Terminal
          </h2>
          <p className="text-zinc-500 text-sm mb-8 max-w-md mx-auto">
            Live market intelligence, AI-generated analysis, and exchange data — all in one place.
          </p>
          <Link
            href="/terminal"
            className="inline-flex items-center gap-2 bg-white text-black text-sm font-medium px-8 py-3.5 rounded-sm hover:bg-zinc-200 transition-colors"
          >
            Open Terminal
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
