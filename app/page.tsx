import Link from "next/link";
import MarketTicker from "@/components/MarketTicker";
import SportsHubCard, { type SportsHubData } from "@/components/SportsHubCard";
import NavAuth from "@/components/NavAuth";
import Footer from "@/components/Footer";

// ─── Data ─────────────────────────────────────────────────────────────────────

const heroTickerItems = [
  "Ascot 2.40 · Liquidity spike +340% · Sharp rotation detected",
  "Djokovic v Alcaraz · Volatility expanding · AI confidence 91%",
  "NFL Week 14 · Spread pressure building · Late sharp money identified",
  "UFC 305 · Underdog value flagged · Queue depth anomaly",
  "Prediction market volume accelerating · Divergence from consensus",
  "Horse Racing · Queue health warning · Exchange flow reversal",
  "NBA · Line movement: late-side pressure · Liquidity thinning",
  "Tennis ATP · Serve pattern break detected · AI brief updated",
];

const liveSignals = [
  {
    id:          "sharp-money",
    label:       "Sharp Money",
    description: "Institutional-grade detection of sharp-side movement across exchanges.",
    accent:      "text-amber-400",
    dotColor:    "bg-amber-400",
    value:       "+340%",
    valueLabel:  "volume surge",
  },
  {
    id:          "liquidity-radar",
    label:       "Liquidity Radar",
    description: "Real-time queue depth and exchange flow analysis across all markets.",
    accent:      "text-blue-400",
    dotColor:    "bg-blue-400",
    value:       "18ms",
    valueLabel:  "avg latency",
  },
  {
    id:          "ai-brief",
    label:       "AI Market Brief",
    description: "Narrative intelligence generated from structural market data.",
    accent:      "text-emerald-400",
    dotColor:    "bg-emerald-400",
    value:       "91%",
    valueLabel:  "confidence",
  },
  {
    id:          "volatility",
    label:       "Volatility Watch",
    description: "Compression and expansion events flagged before they become consensus.",
    accent:      "text-red-400",
    dotColor:    "bg-red-400",
    value:       "HIGH",
    valueLabel:  "regime",
  },
  {
    id:          "creator-signal",
    label:       "Creator Signal",
    description: "Branded market intelligence ready for distribution to any audience.",
    accent:      "text-purple-400",
    dotColor:    "bg-purple-400",
    value:       "3",
    valueLabel:  "exports ready",
  },
  {
    id:          "exchange-flow",
    label:       "Exchange Flow",
    description: "Cross-market liquidity movement and pricing divergence detection.",
    accent:      "text-zinc-200",
    dotColor:    "bg-zinc-300",
    value:       "×2.1",
    valueLabel:  "flow divergence",
  },
];

const terminalRows = [
  { market: "Ascot 2.40",          exchange: "Betfair",   price: "2.44",  move: "+0.18", dir: "up",   ai: "91", status: "LIVE" },
  { market: "Djokovic v Alcaraz",  exchange: "Betfair",   price: "1.62",  move: "-0.04", dir: "down", ai: "87", status: "LIVE" },
  { market: "Man City v Arsenal",  exchange: "Betfair",   price: "2.10",  move: "+0.06", dir: "up",   ai: "74", status: "LIVE" },
  { market: "NFL Week 14 · Chiefs",exchange: "Pinnacle",  price: "-110",  move: "-5",    dir: "down", ai: "82", status: "LIVE" },
  { market: "UFC 305 · Main Event",exchange: "Betfair",   price: "3.20",  move: "+0.40", dir: "up",   ai: "68", status: "LIVE" },
];

const platformModules = [
  {
    id:          "terminal",
    name:        "Intelligence Terminal",
    description: "Live market pulse, exchange flow, signals, and AI commentary — unified.",
    status:      "LIVE",
    statusColor: "text-emerald-400",
    dotColor:    "bg-emerald-400",
    accent:      "border-emerald-400/10 hover:border-emerald-400/25",
    href:        "/terminal",
  },
  {
    id:          "ai-briefs",
    name:        "AI Market Briefs",
    description: "Morning, midday, and overnight intelligence briefs generated from structural data.",
    status:      "LIVE",
    statusColor: "text-blue-400",
    dotColor:    "bg-blue-400",
    accent:      "border-blue-400/10 hover:border-blue-400/25",
    href:        "/daily-brief",
  },
  {
    id:          "alerts",
    name:        "Alert Engine",
    description: "Real-time alerts for liquidity shifts, volatility spikes, and sharp-money flows.",
    status:      "LIVE",
    statusColor: "text-amber-400",
    dotColor:    "bg-amber-400",
    accent:      "border-amber-400/10 hover:border-amber-400/25",
    href:        "/alerts",
  },
  {
    id:          "exchange-flow",
    name:        "Exchange Flow",
    description: "Cross-market liquidity movement, queue depth, and order flow microstructure.",
    status:      "LIVE",
    statusColor: "text-emerald-400",
    dotColor:    "bg-emerald-400",
    accent:      "border-emerald-400/10 hover:border-emerald-400/25",
    href:        "/terminal",
  },
  {
    id:          "export-studio",
    name:        "Export Studio",
    description: "Branded share cards generated from live market data. Ready to post instantly.",
    status:      "LIVE",
    statusColor: "text-purple-400",
    dotColor:    "bg-purple-400",
    accent:      "border-purple-400/10 hover:border-purple-400/25",
    href:        "/export-studio",
  },
  {
    id:          "distribution",
    name:        "Distribution Network",
    description: "Partner-grade content infrastructure. Co-branded feeds, reach metrics, referral systems.",
    status:      "LIVE",
    statusColor: "text-blue-400",
    dotColor:    "bg-blue-400",
    accent:      "border-blue-400/10 hover:border-blue-400/25",
    href:        "/distribution-center",
  },
  {
    id:          "api",
    name:        "Developer API",
    description: "Structured market intelligence endpoints. Signals, odds, narratives, and exchange data.",
    status:      "LIVE",
    statusColor: "text-blue-400",
    dotColor:    "bg-blue-400",
    accent:      "border-blue-400/10 hover:border-blue-400/25",
    href:        "/developer",
  },
];

const sportsHubs: SportsHubData[] = [
  {
    name:         "Horse Racing",
    tagline:      "Queue health, exchange flow, Betfair liquidity, and sharp positioning — the complete racing intelligence layer.",
    metrics:      "48 markets live",
    accent:       "text-amber-400",
    accentBg:     "bg-amber-400/10",
    accentBorder: "border-amber-400/20",
    symbol:       "◈",
  },
  {
    name:         "Tennis",
    tagline:      "In-play momentum, serve pattern analysis, and live volatility across ATP and WTA markets.",
    metrics:      "24 markets live",
    accent:       "text-emerald-400",
    accentBg:     "bg-emerald-400/10",
    accentBorder: "border-emerald-400/20",
    symbol:       "◇",
  },
  {
    name:         "NBA",
    tagline:      "Spread pressure detection, sharp movement tracking, and quarter-by-quarter liquidity analysis.",
    metrics:      "16 markets live",
    accent:       "text-blue-400",
    accentBg:     "bg-blue-400/10",
    accentBorder: "border-blue-400/20",
    symbol:       "▣",
  },
  {
    name:         "NFL",
    tagline:      "Line movement analytics, public vs. sharp divergence, and game-time liquidity shifts.",
    metrics:      "12 markets live",
    accent:       "text-red-400",
    accentBg:     "bg-red-400/10",
    accentBorder: "border-red-400/20",
    symbol:       "▲",
  },
  {
    name:         "UFC",
    tagline:      "Underdog value detection, late-money identification, and fight-week momentum tracking.",
    metrics:      "8 markets live",
    accent:       "text-orange-400",
    accentBg:     "bg-orange-400/10",
    accentBorder: "border-orange-400/20",
    symbol:       "◉",
  },
  {
    name:         "Football",
    tagline:      "European exchange data, value identification across leagues, and sharp money mapping.",
    metrics:      "64 markets live",
    accent:       "text-zinc-300",
    accentBg:     "bg-zinc-300/10",
    accentBorder: "border-zinc-300/20",
    symbol:       "○",
  },
  {
    name:         "Prediction Markets",
    tagline:      "Contract pricing divergence, volume acceleration, and structural edge across prediction platforms.",
    metrics:      "76 contracts live",
    accent:       "text-purple-400",
    accentBg:     "bg-purple-400/10",
    accentBorder: "border-purple-400/20",
    symbol:       "◎",
  },
];

const ecosystemApps = [
  {
    name:        "Horse Racing Trader",
    description: "The execution layer for the Betfair exchange. Trade, monitor, and act on Sports Market OS intelligence in real time.",
    status:      "Live",
    statusColor: "text-emerald-400",
  },
  {
    name:        "Tennis Trader UK",
    description: "Exchange-native tennis trading for UK markets. Powered by live momentum, volatility, and queue data from the intelligence layer.",
    status:      "Live",
    statusColor: "text-emerald-400",
  },
  {
    name:        "Tennis Trader USA",
    description: "US market tennis intelligence and execution. Connects directly to the Sports Market OS AI feed for real-time signals.",
    status:      "Live",
    statusColor: "text-emerald-400",
  },
  {
    name:        "NBA Trading",
    description: "Coming soon. Exchange-native basketball market intelligence with in-play spread analytics and sharp-side detection.",
    status:      "Coming Soon",
    statusColor: "text-zinc-500",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeroTicker() {
  const items = [...heroTickerItems, ...heroTickerItems];
  return (
    <div className="overflow-hidden border border-white/6 rounded-sm bg-white/[0.02] py-2.5 mb-10">
      <div className="ticker-animate">
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 px-6 text-[11px] text-zinc-400 whitespace-nowrap font-mono"
          >
            <span className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot shrink-0" />
            {item}
            <span className="text-zinc-800 mx-2">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function SectionLabel({ label, accent }: { label: string; accent?: string }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <span className={`text-[10px] font-mono uppercase tracking-widest shrink-0 ${accent ?? "text-zinc-500"}`}>
        {label}
      </span>
      <div className="flex-1 h-px bg-white/5" />
    </div>
  );
}

function TerminalPreview() {
  return (
    <div className="relative border border-white/8 rounded-sm bg-black overflow-hidden glow-emerald">
      {/* Scan line */}
      <div className="absolute inset-x-0 h-px bg-emerald-400/20 scan-line" />

      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/6 bg-white/[0.015]">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
            Intelligence Terminal — Live Feed
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[9px] font-mono text-zinc-600">SMO/EXCHANGE</span>
          <span className="text-[9px] font-mono text-emerald-400">●  OPERATIONAL</span>
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-12 gap-0 px-4 py-1.5 border-b border-white/4">
        {["MARKET", "EXCHANGE", "PRICE", "MOVE", "AI", "STATUS"].map((h, i) => (
          <span
            key={h}
            className={`text-[8px] font-mono text-zinc-600 uppercase tracking-wider col-span-${[4,2,2,1,1,2][i]}`}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Data rows */}
      {terminalRows.map((row) => (
        <div
          key={row.market}
          className="data-row-live grid grid-cols-12 gap-0 px-4 py-2 border-b border-white/[0.03] items-center"
        >
          <span className="col-span-4 text-[11px] text-white font-medium truncate pr-2">{row.market}</span>
          <span className="col-span-2 text-[9px] font-mono text-zinc-500">{row.exchange}</span>
          <span className="col-span-2 text-[11px] font-mono text-white tabular-nums">{row.price}</span>
          <span className={`col-span-1 text-[10px] font-mono tabular-nums ${row.dir === "up" ? "text-emerald-400" : "text-red-400"}`}>
            {row.move}
          </span>
          <span className="col-span-1 text-[10px] font-mono text-blue-400 tabular-nums">{row.ai}</span>
          <span className="col-span-2 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot shrink-0" />
            <span className="text-[8px] font-mono text-emerald-400">{row.status}</span>
          </span>
        </div>
      ))}

      {/* AI Brief strip */}
      <div className="px-4 py-3 border-t border-white/6 bg-blue-400/[0.03]">
        <div className="flex items-start gap-3">
          <span className="text-[8px] font-mono text-blue-400 uppercase tracking-wider shrink-0 mt-0.5">AI Brief</span>
          <p className="text-[10px] text-zinc-200 leading-relaxed">
            Sharp rotation detected across Ascot markets. Queue depth thinning into the 2.40.
            Djokovic volatility compressing — AI flags late-session inflection. NFL spread pressure
            building on Chiefs line. Recommend monitoring exchange flow divergence.
          </p>
        </div>
      </div>

      {/* Alert rail */}
      <div className="px-4 py-2.5 border-t border-white/4 bg-white/[0.01] overflow-hidden">
        <div className="flow-animate">
          {[
            "⚡ Liquidity spike: Ascot 2.40",
            "△ Volatility expanding: ATP Wien",
            "● Sharp money: NFL Chiefs -110",
            "◈ Queue health: Cheltenham 3.15",
            "▲ AI alert: UFC underdog value",
            "⚡ Liquidity spike: Ascot 2.40",
            "△ Volatility expanding: ATP Wien",
            "● Sharp money: NFL Chiefs -110",
            "◈ Queue health: Cheltenham 3.15",
            "▲ AI alert: UFC underdog value",
          ].map((a, i) => (
            <span key={i} className="inline-flex items-center gap-4 px-6 text-[9px] font-mono text-zinc-500 whitespace-nowrap">
              {a}
              <span className="text-zinc-800">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <MarketTicker />

      {/* ─── Nav ───────────────────────────────────────────────────────────── */}
      <header className="border-b border-white/6 px-6 py-3 flex items-center justify-between sticky top-0 bg-black/95 backdrop-blur-sm z-10">
        <Link href="/" className="text-white text-sm font-semibold tracking-tight">
          Sports Market <span className="text-zinc-500">OS</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-500">
          <Link href="/terminal"   className="hover:text-white transition-colors">Terminal</Link>
          <Link href="#markets"    className="hover:text-white transition-colors">Markets</Link>
          <Link href="#platform"   className="hover:text-white transition-colors">Platform</Link>
          <Link href="#ecosystem"  className="hover:text-white transition-colors">Ecosystem</Link>
          <Link href="/pricing"    className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/developer"  className="hover:text-white transition-colors">API</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/pricing"
            className="text-xs font-mono text-zinc-400 hover:text-white transition-colors hidden sm:block"
          >
            Pricing
          </Link>
          <NavAuth />
        </div>
      </header>

      <main>
        {/* ─── Hero ────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-white/5">
          {/* Ambient grid */}
          <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />
          {/* Ambient glow — very subtle */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/4 rounded-full blur-3xl hero-ambient pointer-events-none" />
          <div className="absolute top-20 right-1/4 w-64 h-64 bg-blue-500/3 rounded-full blur-3xl hero-ambient pointer-events-none" style={{ animationDelay: "4s" }} />

          <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24">
            {/* Status pills */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              {[
                { label: "LIVE TERMINAL",    dot: "bg-emerald-400", text: "text-emerald-400", border: "border-emerald-400/20" },
                { label: "BETFAIR ROUTING",  dot: "bg-emerald-400", text: "text-emerald-400", border: "border-emerald-400/20" },
                { label: "API READY",        dot: "bg-blue-400",    text: "text-blue-400",    border: "border-blue-400/20" },
                { label: "CREATOR EXPORTS",  dot: "bg-purple-400",  text: "text-purple-400",  border: "border-purple-400/20" },
                { label: "DAILY BRIEFS",     dot: "bg-blue-400",    text: "text-zinc-400",    border: "border-white/10" },
              ].map((pill) => (
                <span
                  key={pill.label}
                  className={`inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-sm border bg-white/[0.02] ${pill.text} ${pill.border}`}
                >
                  <span className={`w-1 h-1 rounded-full shrink-0 pulse-dot ${pill.dot}`} />
                  {pill.label}
                </span>
              ))}
            </div>

            {/* Headline */}
            <div className="max-w-4xl mb-6">
              <h1 className="text-5xl md:text-7xl font-semibold leading-[1.02] tracking-tight text-white mb-3">
                Sports Market OS
              </h1>
              <h2 className="text-3xl md:text-5xl font-semibold leading-[1.05] tracking-tight text-zinc-500">
                The Intelligence Layer<br className="hidden md:block" /> for Sports Markets.
              </h2>
            </div>

            {/* Subheadline */}
            <p className="text-zinc-300 text-base md:text-lg leading-relaxed max-w-2xl mb-10">
              Live market signals, exchange microstructure, AI briefs, volatility alerts,
              creator exports, API infrastructure, and exchange routing — unified into one operating system.
            </p>

            {/* Live ticker */}
            <HeroTicker />

            {/* CTAs */}
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/terminal"
                className="inline-flex items-center gap-2 bg-white text-black text-sm font-semibold px-7 py-3 rounded-sm hover:bg-zinc-100 transition-colors"
              >
                Open Terminal
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 border border-white/15 text-white text-sm font-medium px-7 py-3 rounded-sm hover:border-white/30 hover:bg-white/5 transition-colors"
              >
                Start Free
              </Link>
              <Link
                href="/developer"
                className="inline-flex items-center gap-2 border border-blue-400/25 text-blue-400 text-sm font-medium px-7 py-3 rounded-sm hover:border-blue-400/50 hover:bg-blue-400/5 transition-colors"
              >
                View API
              </Link>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 rounded-sm ml-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot shrink-0" />
                LIVE ON BETFAIR EXCHANGE
              </span>
            </div>
          </div>
        </section>

        {/* ─── Terminal Preview ─────────────────────────────────────────────── */}
        <section className="border-b border-white/5 bg-zinc-950/30">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1">
                  Live Intelligence Feed
                </p>
                <h2 className="text-white text-xl font-semibold">
                  The terminal is always running.
                </h2>
              </div>
              <Link
                href="/terminal"
                className="text-[10px] font-mono text-zinc-500 hover:text-white transition-colors shrink-0"
              >
                Open full terminal →
              </Link>
            </div>
            <TerminalPreview />
          </div>
        </section>

        {/* ─── Live Market Pulse ───────────────────────────────────────────── */}
        <section className="border-b border-white/5">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <SectionLabel label="Live Market Pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
              {liveSignals.map((signal) => (
                <div
                  key={signal.id}
                  className="bg-black p-6 hover:bg-zinc-950 transition-colors group cursor-pointer relative"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest ${signal.accent}`}>
                      <span className={`w-1 h-1 rounded-full shrink-0 pulse-dot ${signal.dotColor}`} />
                      {signal.label}
                    </div>
                    <div className="text-right">
                      <p className={`text-base font-bold tabular-nums font-mono ${signal.accent}`}>{signal.value}</p>
                      <p className="text-zinc-600 text-[8px] font-mono uppercase">{signal.valueLabel}</p>
                    </div>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed">{signal.description}</p>
                  <div className="mt-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-zinc-500 text-[10px] font-mono">View feed</span>
                    <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Platform Modules ─────────────────────────────────────────────── */}
        <section id="platform" className="border-b border-white/5">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <SectionLabel label="One Platform" />
            <div className="mb-10 max-w-2xl">
              <h2 className="text-white text-2xl font-semibold mb-3">
                Every layer of sports market intelligence, unified.
              </h2>
              <p className="text-zinc-300 text-sm leading-relaxed">
                Terminal. AI briefs. Alerts. Exchange flow. Creator exports. Distribution network.
                Developer API. Seven systems — one operating layer.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {platformModules.map((mod) => (
                <Link
                  key={mod.id}
                  href={mod.href}
                  className={`module-card block bg-zinc-950 border rounded-sm p-5 ${mod.accent}`}
                >
                  {/* Status dot only — no repeated LIVE label */}
                  <div className="mb-4">
                    <span className={`w-1.5 h-1.5 rounded-full pulse-dot inline-block ${mod.dotColor}`} />
                  </div>
                  <h3 className="text-white text-sm font-semibold mb-2">{mod.name}</h3>
                  <p className="text-zinc-300 text-xs leading-relaxed">{mod.description}</p>
                  <div className="mt-5 text-[9px] font-mono text-zinc-500 transition-colors">
                    Explore →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Sports Hubs ─────────────────────────────────────────────────── */}
        <section id="markets" className="border-b border-white/5">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <SectionLabel label="Sports Intelligence Hubs" />
            <div className="mb-10 max-w-2xl">
              <h2 className="text-white text-2xl font-semibold mb-3">
                Seven sports. One intelligence layer.
              </h2>
              <p className="text-zinc-300 text-sm leading-relaxed">
                Each hub delivers live market data, AI analysis, exchange flow, and structural
                intelligence specific to that sport's markets and dynamics.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {sportsHubs.map((hub) => (
                <SportsHubCard key={hub.name} {...hub} />
              ))}
            </div>
          </div>
        </section>

        {/* ─── Exchange Section ─────────────────────────────────────────────── */}
        <section className="border-b border-white/5 bg-emerald-950/10">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <SectionLabel label="Exchange Routing" accent="text-emerald-500" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-white text-2xl font-semibold mb-4">
                  From intelligence to exchange action.
                </h2>
                <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                  Sports Market OS reads the market. You act on it.
                  Signal cards, market pages, and the terminal surface direct routing
                  to the Betfair Exchange — keeping the intelligence and execution layers clean.
                </p>
                <p className="text-zinc-600 text-[10px] font-mono leading-relaxed">
                  Execution occurs on Betfair Exchange. Sports Market OS provides intelligence only —
                  no wager execution, no custody.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { step: "01", label: "AI detects signal",           desc: "Sharp money, liquidity spike, volatility shift",            color: "text-white",       dot: "bg-white" },
                  { step: "02", label: "Intelligence surfaced",        desc: "Terminal, signal card, market page — structured analysis",  color: "text-zinc-200",    dot: "bg-zinc-300" },
                  { step: "03", label: "Exchange routing activated",   desc: "One click to Betfair Exchange market",                     color: "text-emerald-400", dot: "bg-emerald-400" },
                  { step: "04", label: "Execution on exchange",        desc: "Betfair Exchange handles trade. SMO stays intelligence.",   color: "text-emerald-400", dot: "bg-emerald-600" },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-4 p-4 border border-white/5 rounded-sm bg-black/40">
                    <span className="text-zinc-600 text-[10px] font-mono tabular-nums shrink-0 mt-0.5">{s.step}</span>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1 ${s.dot}`} />
                    <div>
                      <p className={`text-sm font-medium ${s.color}`}>{s.label}</p>
                      <p className="text-zinc-400 text-xs mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Creator / Distribution ───────────────────────────────────────── */}
        <section className="border-b border-white/5">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <SectionLabel label="Creator Distribution" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-white text-2xl font-semibold mb-4">
                  Intelligence built to distribute.
                </h2>
                <p className="text-zinc-300 text-sm leading-relaxed mb-8">
                  Bloomberg-grade sports market data, formatted for distribution.
                  Branded share cards, partner analytics, referral systems, and API feeds —
                  all driven by the same live intelligence layer.
                </p>
                <div className="space-y-3">
                  {[
                    { label: "Export Studio",          desc: "Branded share cards from live data. Ready to post.",        color: "text-purple-400",  href: "/export-studio" },
                    { label: "Partner Analytics",      desc: "Reach metrics, engagement data, audience intelligence.",    color: "text-blue-400",    href: "/partner-dashboard" },
                    { label: "Distribution Network",   desc: "Co-branded feeds distributed to your audience.",           color: "text-blue-400",    href: "/distribution-center" },
                    { label: "Referral Engine",        desc: "Commission tracking and affiliate routing infrastructure.", color: "text-amber-400",   href: "/partner-program" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-3 p-4 border border-white/5 rounded-sm bg-black/40 hover:border-white/10 hover:bg-white/[0.02] transition-colors group"
                    >
                      <span className={`w-1 h-1 rounded-full shrink-0 ${item.color.replace("text-", "bg-")}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${item.color}`}>{item.label}</p>
                        <p className="text-zinc-400 text-xs mt-0.5">{item.desc}</p>
                      </div>
                      <svg className="w-3 h-3 text-zinc-600 group-hover:text-zinc-300 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mock export card preview */}
              <div className="border border-white/8 rounded-sm overflow-hidden bg-black/60">
                <div className="px-4 py-2.5 border-b border-white/6 bg-white/[0.02] flex items-center justify-between">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Export Queue</span>
                  <span className="text-[9px] font-mono text-purple-400">3 ready</span>
                </div>
                {[
                  { sport: "Horse Racing",  title: "Ascot 2.40 · Sharp Rotation",         conf: 91, tag: "Creator" },
                  { sport: "Tennis",        title: "Djokovic AI Brief · Volatility Alert", conf: 87, tag: "Premium" },
                  { sport: "NFL",           title: "Chiefs Spread · Late Money",           conf: 74, tag: "API" },
                ].map((card) => (
                  <div key={card.title} className="px-4 py-3 border-b border-white/4 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[8px] font-mono text-zinc-600 uppercase">{card.sport}</span>
                        <span className="text-[8px] font-mono text-purple-400 border border-purple-400/20 px-1">{card.tag}</span>
                      </div>
                      <p className="text-[11px] text-white font-medium">{card.title}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[10px] font-mono text-blue-400 tabular-nums">{card.conf}%</p>
                      <p className="text-[8px] font-mono text-zinc-700">confidence</p>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-zinc-700">Powered by Sports Market OS</span>
                  <span className="text-[9px] font-mono text-zinc-600 border border-zinc-800 px-2 py-0.5">Export all →</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Ecosystem Apps ───────────────────────────────────────────────── */}
        <section id="ecosystem" className="border-b border-white/5 bg-zinc-950/20">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <SectionLabel label="Execution Ecosystem" />
            <div className="mb-10 max-w-xl">
              <h2 className="text-white text-2xl font-semibold mb-3">
                Intelligence connects to execution.
              </h2>
              <p className="text-zinc-300 text-sm leading-relaxed">
                Sports Market OS is the intelligence layer. Connected execution apps
                deliver that intelligence directly to trading environments.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ecosystemApps.map((app) => (
                <div
                  key={app.name}
                  className="module-card bg-black border border-white/6 rounded-sm p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white text-sm font-semibold">{app.name}</h3>
                    <div className="flex items-center gap-1.5">
                      {app.status === "Live" && (
                        <span className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot" />
                      )}
                      <span className={`text-[10px] font-mono ${app.statusColor}`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-zinc-300 text-xs leading-relaxed">{app.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Developer API ────────────────────────────────────────────────── */}
        <section className="border-b border-white/5 bg-blue-950/5">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <SectionLabel label="Developer API" accent="text-blue-400" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-white text-2xl font-semibold mb-4">
                  Structured market intelligence for builders.
                </h2>
                <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                  Three authenticated endpoints. Plan-gated access. Rate-limited, versioned,
                  and quota-managed. Integrate Sports Market OS signals into your own product.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/developer"
                    className="inline-flex items-center gap-2 border border-blue-400/30 text-blue-400 text-sm font-medium px-5 py-2.5 rounded-sm hover:border-blue-400/60 hover:bg-blue-400/5 transition-colors"
                  >
                    Developer Docs
                  </Link>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 border border-white/10 text-zinc-300 text-sm font-medium px-5 py-2.5 rounded-sm hover:border-white/20 transition-colors"
                  >
                    View Pricing
                  </Link>
                </div>
              </div>
              <div className="border border-white/8 rounded-sm bg-black overflow-hidden glow-blue">
                <div className="px-4 py-2.5 border-b border-white/6 bg-white/[0.015] flex items-center justify-between">
                  <span className="text-[9px] font-mono text-zinc-500">API — v1 endpoints</span>
                  <span className="text-[9px] font-mono text-blue-400">● ACTIVE</span>
                </div>
                {[
                  { method: "GET", path: "/api/v1/signals",      plan: "Free",    note: "Live market signals" },
                  { method: "GET", path: "/api/v1/market-pulse", plan: "Free",    note: "Exchange pulse data" },
                  { method: "GET", path: "/api/v1/daily-brief",  plan: "Free",    note: "AI narrative brief" },
                  { method: "GET", path: "/api/v1/distribution", plan: "Partner", note: "Distribution feed" },
                  { method: "GET", path: "/api/v1/exchange-flow",plan: "API",     note: "Exchange microstructure" },
                ].map((ep) => (
                  <div key={ep.path} className="px-4 py-2.5 border-b border-white/4 flex items-center gap-3">
                    <span className="text-[9px] font-mono text-emerald-500 w-8 shrink-0">{ep.method}</span>
                    <code className="text-[10px] font-mono text-zinc-300 flex-1">{ep.path}</code>
                    <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-sm border shrink-0 ${
                      ep.plan === "Free"    ? "text-zinc-400 border-zinc-700 bg-zinc-900" :
                      ep.plan === "Partner" ? "text-amber-400 border-amber-400/25 bg-amber-400/5" :
                                             "text-blue-400 border-blue-400/25 bg-blue-400/5"
                    }`}>
                      {ep.plan}
                    </span>
                  </div>
                ))}
                <div className="px-4 py-2.5 text-[9px] font-mono text-zinc-500">
                  Auth: x-smo-api-key · Quota: 100 / 1k / 10k daily
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Final CTA ────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/4 rounded-full blur-3xl hero-ambient pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
              <span className="text-emerald-400 text-[10px] font-mono uppercase tracking-widest">
                Terminal Ready — Operational
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-3">
              Open the terminal.
            </h2>
            <h3 className="text-4xl md:text-6xl font-semibold tracking-tight text-zinc-500 mb-8">
              Watch the market move.
            </h3>

            <p className="text-zinc-300 text-base mb-10 max-w-lg mx-auto leading-relaxed">
              Live market intelligence, AI analysis, exchange routing, and creator infrastructure —
              all running, right now.
            </p>

            {/* Live activity strip */}
            <div className="overflow-hidden border border-white/6 rounded-sm bg-white/[0.015] py-2 mb-10 max-w-2xl mx-auto">
              <div className="flow-animate">
                {[...heroTickerItems, ...heroTickerItems].map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-3 px-6 text-[10px] font-mono text-zinc-500 whitespace-nowrap">
                    <span className="w-1 h-1 rounded-full bg-emerald-500/60 shrink-0" />
                    {item}
                    <span className="text-zinc-800 mx-2">·</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                href="/terminal"
                className="inline-flex items-center gap-2 bg-white text-black text-sm font-semibold px-8 py-3.5 rounded-sm hover:bg-zinc-100 transition-colors"
              >
                Open Terminal
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 border border-white/15 text-white text-sm font-medium px-8 py-3.5 rounded-sm hover:border-white/30 hover:bg-white/5 transition-colors"
              >
                Create Free Account
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 border border-white/8 text-zinc-400 text-sm font-medium px-8 py-3.5 rounded-sm hover:border-white/15 hover:text-white transition-colors"
              >
                View Pricing
              </Link>
            </div>

            <p className="text-zinc-800 text-[9px] font-mono mt-10">
              Sports Market OS · Intelligence layer · Not financial advice · Execution on Betfair Exchange
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
