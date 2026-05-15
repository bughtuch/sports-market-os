import Link from "next/link";
import SportsHubCard, { type SportsHubData } from "@/components/SportsHubCard";
import NavAuth from "@/components/NavAuth";

// ─── Data ─────────────────────────────────────────────────────────────────────

const alertItems = [
  { text: "SHARP · Ascot 2.40 · Unmatched lay liability 3.4× above average", color: "text-cyan-400" },
  { text: "CRIT · Cheltenham 3.15 · Queue collapse · Bilateral thinning confirmed", color: "text-red-400" },
  { text: "AI · Djokovic v Alcaraz · Volume/price divergence — expansion pre-signal", color: "text-cyan-400" },
  { text: "WARN · NFL Chiefs v Bills · IV compression — 3rd consecutive hour", color: "text-amber-400" },
  { text: "SIGNAL · UFC 305 · Underdog shortening without public catalyst", color: "text-amber-400" },
  { text: "FLOW · Man City v Arsenal · Institutional AH→match result rotation", color: "text-emerald-400" },
  { text: "SHARP · Prediction Mkt · Polling consensus divergence 6.8 points", color: "text-cyan-400" },
  { text: "AI · NBA Warriors v Lakers · Pace regression misalignment — sharp on under", color: "text-cyan-400" },
  { text: "LIVE · Horse Racing · Queue health warning · 14th percentile", color: "text-amber-400" },
  { text: "INTEL · Tennis ATP · Serve pattern break · Exchange flow rotating", color: "text-emerald-400" },
];

const activeAnomalies = [
  { market: "Ascot 2.40",        signal: "Queue collapse — lay side",          sev: "HIGH", color: "text-red-400",   dot: "bg-red-400" },
  { market: "UFC 305",           signal: "Non-public signal — underdog move",  sev: "HIGH", color: "text-red-400",   dot: "bg-red-400" },
  { market: "NFL Chiefs",        signal: "IV compression — no trigger 3hr",    sev: "MED",  color: "text-amber-400", dot: "bg-amber-400" },
  { market: "Djokovic v Alcaraz",signal: "Vol/price divergence — coiled",      sev: "MED",  color: "text-amber-400", dot: "bg-amber-400" },
  { market: "Prediction Mkt",    signal: "Polling gap 6.8pt — volume +89%",    sev: "MED",  color: "text-amber-400", dot: "bg-amber-400" },
];

const systemState = [
  { label: "AI Regime",       value: "VOLATILE",       color: "text-red-400" },
  { label: "Active Markets",  value: "142",            color: "text-white" },
  { label: "Signal Rate",     value: "284 / hr",       color: "text-white" },
  { label: "AI Scans / min",  value: "1,847",          color: "text-white" },
  { label: "Exchange Flow",   value: "Betfair↔Smkts",  color: "text-cyan-400" },
  { label: "Sharp Diverge",   value: "+340%",          color: "text-emerald-400" },
];

const timelineEvents = [
  { time: "12:41", event: "Queue depth begins thinning on Ascot lay side — first structural signal" },
  { time: "12:52", event: "Sharp-side liquidity rotation detected across two markets simultaneously" },
  { time: "13:05", event: "Volatility compression enters its fourth consecutive cycle — no trigger" },
  { time: "13:18", event: "Public sentiment diverges from exchange flow by 34 standard points" },
  { time: "13:22", event: "AI engine flags expansion probability spike — confidence elevated to 87%" },
  { time: "Now",   event: "Structural divergence active across 5 markets. The market has already moved.", highlight: true },
];

const edgePanels = [
  {
    label: "Public Sees",
    color: "text-zinc-400",
    border: "border-zinc-800/60",
    bg: "",
    items: [
      "The scoreline and the match narrative",
      "Injury rumours after they are confirmed",
      "Headlines when they hit mainstream media",
      "Odds movement without understanding why",
      "The result — after the market already priced it",
    ],
  },
  {
    label: "Sharp Sees",
    color: "text-amber-400",
    border: "border-amber-400/20",
    bg: "bg-amber-400/5",
    items: [
      "Queue depth and bilateral thinning patterns",
      "Unmatched liability accumulating pre-race",
      "Price compression despite elevated volume",
      "Liquidity withdrawal without a public trigger",
      "Exchange flow rotating between venues",
    ],
  },
  {
    label: "AI Sees",
    color: "text-cyan-400",
    border: "border-cyan-400/20",
    bg: "bg-cyan-400/5",
    items: [
      "Structural regime changes before they resolve",
      "The pattern behind the pattern — divergence signals",
      "Expansion probability spikes in compression windows",
      "Sharp/public behavioural divergence at scale",
      "The market moving 12 minutes before the story breaks",
    ],
  },
];

const creatorSignals = [
  {
    sport: "Horse Racing",
    hook: "The horse racing market is moving before the race does.",
    tag: "Sharp Signal",
    conf: 87,
    tagColor: "text-amber-400",
    border: "border-amber-400/20",
  },
  {
    sport: "Tennis",
    hook: "The tennis market is moving before the scoreboard does.",
    tag: "AI Brief",
    conf: 74,
    tagColor: "text-emerald-400",
    border: "border-emerald-400/20",
  },
  {
    sport: "Prediction",
    hook: "The prediction market knows something the polls don't.",
    tag: "Intelligence",
    conf: 78,
    tagColor: "text-cyan-400",
    border: "border-cyan-400/20",
  },
];

const modulePanels = [
  {
    id: "exchange-flow",
    label: "Exchange Flow",
    value: "×2.1",
    unit: "divergence",
    desc: "Cross-market liquidity rotation between Betfair and Smarkets. Institutional flow confirmed.",
    color: "text-cyan-400",
    border: "border-cyan-400/15",
    dot: "bg-cyan-400",
  },
  {
    id: "volatility",
    label: "Volatility Engine",
    value: "HIGH",
    unit: "regime",
    desc: "Compression event in 3 markets. Expansion probability elevated. AI confidence 87%.",
    color: "text-red-400",
    border: "border-red-400/15",
    dot: "bg-red-400",
  },
  {
    id: "sharp-split",
    label: "Sharp / Public Split",
    value: "+340%",
    unit: "volume surge",
    desc: "Sharp-side volume 340% above baseline. Public sentiment counter-positioned in 4 markets.",
    color: "text-amber-400",
    border: "border-amber-400/15",
    dot: "bg-amber-400",
  },
  {
    id: "queue-health",
    label: "Queue Health",
    value: "14th",
    unit: "percentile",
    desc: "Bilateral thinning confirmed in two horse racing markets. Pre-race anomaly pattern.",
    color: "text-orange-400",
    border: "border-orange-400/15",
    dot: "bg-orange-400",
  },
  {
    id: "ai-regime",
    label: "AI Regime",
    value: "1,847",
    unit: "scans / min",
    desc: "Regime classification running across all active markets. Current: VOLATILE predominant.",
    color: "text-blue-400",
    border: "border-blue-400/15",
    dot: "bg-blue-400",
  },
  {
    id: "creator-velocity",
    label: "Creator Velocity",
    value: "7",
    unit: "exports ready",
    desc: "Signal cards, AI briefs, and X posts queued for distribution. Creator queue live.",
    color: "text-purple-400",
    border: "border-purple-400/15",
    dot: "bg-purple-400",
  },
];

const sportsHubs: SportsHubData[] = [
  { name: "Horse Racing",     tagline: "Queue health, exchange flow, Betfair liquidity, and sharp positioning — the complete racing intelligence layer.", metrics: "48 markets live", accent: "text-amber-400",   accentBg: "bg-amber-400/10",   accentBorder: "border-amber-400/20",  symbol: "◈" },
  { name: "Tennis",           tagline: "In-play momentum, serve pattern analysis, and live volatility across ATP and WTA markets.",                        metrics: "24 markets live", accent: "text-emerald-400", accentBg: "bg-emerald-400/10", accentBorder: "border-emerald-400/20", symbol: "◇" },
  { name: "NBA",              tagline: "Spread pressure detection, sharp movement tracking, and quarter-by-quarter liquidity analysis.",                    metrics: "16 markets live", accent: "text-blue-400",    accentBg: "bg-blue-400/10",    accentBorder: "border-blue-400/20",    symbol: "▣" },
  { name: "NFL",              tagline: "Line movement analytics, public vs sharp divergence, and game-time liquidity shifts.",                              metrics: "12 markets live", accent: "text-zinc-300",    accentBg: "bg-zinc-300/10",    accentBorder: "border-zinc-300/20",    symbol: "▲" },
  { name: "UFC",              tagline: "Underdog value detection, late-money identification, and fight-week momentum tracking.",                             metrics: "8 markets live",  accent: "text-orange-400",  accentBg: "bg-orange-400/10",  accentBorder: "border-orange-400/20",  symbol: "◉" },
  { name: "Football",         tagline: "European exchange data, value identification across leagues, and sharp money mapping.",                              metrics: "64 markets live", accent: "text-zinc-400",    accentBg: "bg-zinc-400/10",    accentBorder: "border-zinc-400/20",    symbol: "○" },
  { name: "Prediction Markets",tagline: "Contract pricing divergence, volume acceleration, and structural edge across prediction platforms.",               metrics: "76 contracts",    accent: "text-purple-400",  accentBg: "bg-purple-400/10",  accentBorder: "border-purple-400/20",  symbol: "◎" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function AlertStrip() {
  const items = [...alertItems, ...alertItems];
  return (
    <div className="overflow-hidden border-b border-white/5 bg-black py-2">
      <div className="alert-animate">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2.5 px-8 whitespace-nowrap">
            <span className={`w-1 h-1 rounded-full shrink-0 pulse-dot ${item.color.replace("text-", "bg-")}`} />
            <span className={`text-[10px] font-mono ${item.color}`}>{item.text}</span>
            <span className="text-zinc-800 mx-3">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function IntelPanel() {
  return (
    <div className="relative border border-cyan-400/15 rounded-sm bg-black overflow-hidden glow-cyan">
      {/* Scan line */}
      <div className="absolute inset-x-0 h-px bg-cyan-400/15 scan-line" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/6 bg-white/[0.015]">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse-dot" />
          <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest">Live Intelligence · SMO/Active</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[9px] font-mono text-zinc-600 tabular-nums">142 markets</span>
          <span className="text-[9px] font-mono text-emerald-500">● OPERATIONAL</span>
        </div>
      </div>

      {/* Three-column body */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">

        {/* Col 1 — Active Anomalies */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Active Anomalies</span>
            <span className="text-[9px] font-mono text-red-400">{activeAnomalies.length} flagged</span>
          </div>
          <div className="space-y-px">
            {activeAnomalies.map((a) => (
              <div key={a.market} className="intel-row flex items-center justify-between px-2 py-2 rounded-sm">
                <div className="min-w-0 flex-1">
                  <p className="text-white text-[10px] font-medium truncate">{a.market}</p>
                  <p className="text-zinc-500 text-[9px] font-mono truncate">{a.signal}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-3">
                  <span className={`w-1 h-1 rounded-full ${a.dot}`} />
                  <span className={`text-[8px] font-mono ${a.color}`}>{a.sev}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Col 2 — System State */}
        <div className="px-5 py-4">
          <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block mb-3">System State</span>
          <div className="space-y-2">
            {systemState.map((s) => (
              <div key={s.label} className="flex items-center justify-between gap-3">
                <span className="text-zinc-600 text-[9px] font-mono">{s.label}</span>
                <span className={`text-[10px] font-mono font-semibold tabular-nums ${s.color}`}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Col 3 — Creator + AI brief */}
        <div className="px-5 py-4 flex flex-col gap-4">
          <div>
            <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block mb-3">Creator Queue</span>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 text-[9px] font-mono">Exports ready</span>
                <span className="text-purple-400 text-[10px] font-mono font-semibold">7</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 text-[9px] font-mono">Last AI Brief</span>
                <span className="text-zinc-300 text-[10px] font-mono tabular-nums">14:29 UTC</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 text-[9px] font-mono">Signal rate</span>
                <span className="text-cyan-400 text-[10px] font-mono font-semibold">284 / hr</span>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-hidden border-t border-white/5 pt-3">
            <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block mb-2">AI Feed</span>
            <div className="overflow-hidden">
              <div className="flow-animate">
                {[
                  "Sharp rotation: Ascot markets",
                  "Djokovic: expansion pre-signal",
                  "NFL Chiefs: IV compression",
                  "Prediction: polling gap 6.8pt",
                  "UFC 305: non-public signal",
                  "Sharp rotation: Ascot markets",
                  "Djokovic: expansion pre-signal",
                ].map((t, i) => (
                  <span key={i} className="inline-flex items-center gap-3 px-4 text-[9px] font-mono text-cyan-700 whitespace-nowrap">
                    › {t}<span className="text-zinc-800">·</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* ─── Alert Strip ──────────────────────────────────────────────────── */}
      <AlertStrip />

      {/* ─── Nav ──────────────────────────────────────────────────────────── */}
      <header className="border-b border-white/6 px-6 py-3 flex items-center justify-between sticky top-0 bg-black/95 backdrop-blur-sm z-10">
        <Link href="/" className="text-white text-sm font-semibold tracking-tight">
          Sports Market <span className="text-zinc-500">OS</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-500">
          <Link href="/terminal"  className="hover:text-white transition-colors">Terminal</Link>
          <Link href="/markets"   className="hover:text-white transition-colors">Markets</Link>
          <Link href="/daily-brief" className="hover:text-white transition-colors">AI Briefs</Link>
          <Link href="/pricing"   className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/developer" className="hover:text-white transition-colors">API</Link>
        </nav>
        <div className="flex items-center gap-3">
          <NavAuth />
        </div>
      </header>

      <main>

        {/* ─── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/3 rounded-full blur-3xl hero-ambient pointer-events-none" />
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-emerald-500/3 rounded-full blur-3xl hero-ambient pointer-events-none" style={{ animationDelay: "5s" }} />

          <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-20">

            {/* Status pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                { label: "LIVE TERMINAL",  dot: "bg-emerald-400", text: "text-emerald-400", border: "border-emerald-400/20" },
                { label: "AI ENGINE",      dot: "bg-cyan-400",    text: "text-cyan-400",    border: "border-cyan-400/20" },
                { label: "142 MARKETS",    dot: "bg-white",       text: "text-zinc-300",    border: "border-white/10" },
              ].map((p) => (
                <span key={p.label} className={`inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-sm border bg-white/[0.02] ${p.text} ${p.border}`}>
                  <span className={`w-1 h-1 rounded-full shrink-0 pulse-dot ${p.dot}`} />
                  {p.label}
                </span>
              ))}
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.0] tracking-tight text-white mb-6 max-w-4xl">
              The sports market moves<br />
              <span className="text-zinc-500">before the story does.</span>
            </h1>

            <p className="text-zinc-300 text-base md:text-lg leading-relaxed max-w-2xl mb-10">
              Sports Market OS monitors exchange flow, volatility regimes, liquidity shifts,
              sharp/public divergence, and creator-ready intelligence across global sports markets —
              in real time.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-3 flex-wrap mb-10">
              <Link href="/terminal" className="inline-flex items-center gap-2 bg-white text-black text-sm font-bold px-7 py-3 rounded-sm hover:bg-zinc-100 transition-colors">
                Open Terminal
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/markets" className="inline-flex items-center gap-2 border border-cyan-400/30 text-cyan-400 text-sm font-medium px-7 py-3 rounded-sm hover:border-cyan-400/60 hover:bg-cyan-400/5 transition-colors">
                Explore Markets
              </Link>
              <Link href="/signup" className="inline-flex items-center gap-2 border border-white/12 text-zinc-300 text-sm font-medium px-7 py-3 rounded-sm hover:border-white/25 hover:bg-white/5 transition-colors">
                Start Free
              </Link>
            </div>

            {/* Stat row */}
            <div className="flex flex-wrap gap-10 pb-12 border-b border-white/5 mb-12">
              {[
                { value: "142",   label: "Active markets" },
                { value: "284",   label: "Signals / hour" },
                { value: "1,847", label: "AI scans / min" },
                { value: "7",     label: "Sport hubs live" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-3xl md:text-4xl font-bold tabular-nums text-white leading-none num-breathe">{s.value}</p>
                  <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest mt-1.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Full-width intelligence panel */}
            <IntelPanel />
          </div>
        </section>

        {/* ─── The Market Is Already Moving ────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-white/5 bg-zinc-950/40">
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 py-24 relative">

            <div className="max-w-2xl mb-14">
              <p className="text-cyan-400 text-[9px] font-mono uppercase tracking-widest mb-3">Market Movement Story</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05]">
                The market is<br />
                <span className="text-zinc-500">already moving.</span>
              </h2>
              <p className="text-zinc-400 text-base mt-4 leading-relaxed">
                A forensic account of how a structural signal forms — before the public narrative catches up.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Timeline */}
              <div className="space-y-0">
                {timelineEvents.map((ev, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-6 py-5 border-b border-zinc-900/60 last:border-0 ${ev.highlight ? "bg-cyan-400/[0.04] -mx-4 px-4 rounded-sm" : ""}`}
                  >
                    <div className="shrink-0 w-12 text-right">
                      <span className={`text-xs font-mono tabular-nums ${ev.highlight ? "text-cyan-400 font-bold" : "text-zinc-600"}`}>
                        {ev.time}
                      </span>
                    </div>
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`mt-1.5 shrink-0 ${ev.highlight ? "w-2 h-2 rounded-full bg-cyan-400 pulse-dot" : "w-px h-4 bg-zinc-800"}`} />
                      <p className={`text-sm leading-relaxed ${ev.highlight ? "text-white font-semibold" : "text-zinc-300"}`}>
                        {ev.event}
                      </p>
                    </div>
                    {ev.highlight && (
                      <span className="text-[9px] font-mono text-cyan-400 border border-cyan-400/30 bg-cyan-400/5 px-2 py-0.5 rounded-sm shrink-0">
                        NOW
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Narrative frame */}
              <div className="space-y-6">
                <div className="p-6 border border-cyan-400/15 rounded-sm bg-cyan-400/[0.03]">
                  <p className="text-cyan-400 text-[9px] font-mono uppercase tracking-widest mb-3">What this means</p>
                  <p className="text-white text-lg font-semibold leading-snug mb-3">
                    The structure tells you before the story does.
                  </p>
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    Queue deterioration, volume divergence, and sharp-side flow rotate through
                    the exchange order book 8–22 minutes before the public narrative forms.
                    Sports Market OS reads those structural signals and surfaces them in real time.
                  </p>
                </div>

                <div className="p-6 border border-white/6 rounded-sm bg-black/40">
                  <p className="text-zinc-500 text-[9px] font-mono uppercase tracking-widest mb-3">Currently monitoring</p>
                  <div className="space-y-2">
                    {[
                      { label: "Ascot 2.40",          val: "Queue collapse",          color: "text-red-400" },
                      { label: "Djokovic v Alcaraz",  val: "Compression → Expansion", color: "text-amber-400" },
                      { label: "NFL Chiefs",           val: "IV compression — 3hr",    color: "text-amber-400" },
                      { label: "Prediction Mkt",       val: "Polling +6.8pt gap",      color: "text-cyan-400" },
                    ].map((r) => (
                      <div key={r.label} className="flex items-center justify-between">
                        <span className="text-zinc-400 text-xs">{r.label}</span>
                        <span className={`text-xs font-mono ${r.color}`}>{r.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/terminal"
                  className="flex items-center justify-between p-4 border border-white/8 rounded-sm hover:border-white/15 hover:bg-white/[0.02] transition-colors group"
                >
                  <span className="text-zinc-300 text-sm group-hover:text-white transition-colors">Watch it live in the terminal</span>
                  <svg className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── The Edge ─────────────────────────────────────────────────────── */}
        <section className="border-b border-white/5 bg-black">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="max-w-2xl mb-14">
              <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest mb-3">What the market is missing</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05]">
                The Edge
              </h2>
              <p className="text-zinc-400 text-base mt-4 leading-relaxed">
                Three layers of market intelligence. Only one of them reaches most people.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              {edgePanels.map((panel) => (
                <div key={panel.label} className={`p-7 border rounded-sm ${panel.border} ${panel.bg}`}>
                  <p className={`text-[9px] font-mono uppercase tracking-widest mb-5 ${panel.color}`}>{panel.label}</p>
                  <ul className="space-y-3">
                    {panel.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className={`text-xs font-mono mt-0.5 shrink-0 ${panel.color}`}>›</span>
                        <p className="text-zinc-300 text-sm leading-relaxed">{item}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Three killer lines */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-white/5">
              {[
                { public_: "Public sees the scoreline.", market: "The exchange saw the liquidity withdrawal 14 minutes ago." },
                { public_: "Public sees injury rumours.", market: "Sharp flow saw the repricing before the confirmation." },
                { public_: "Public sees the headline.", market: "The market already moved 12 minutes before it published." },
              ].map((line, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-zinc-600 text-sm">{line.public_}</p>
                  <p className="text-white text-sm font-semibold">{line.market}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Creator Intelligence Network ─────────────────────────────────── */}
        <section className="border-b border-white/5 bg-zinc-950/30">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                <p className="text-purple-400 text-[9px] font-mono uppercase tracking-widest mb-3">Creator Intelligence Network</p>
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05] mb-5">
                  Turn live market<br />
                  intelligence into<br />
                  <span className="text-purple-400">content.</span>
                </h2>
                <p className="text-zinc-300 text-base leading-relaxed mb-8">
                  Every structural signal is a story. Every AI brief is a thread.
                  Every market anomaly is a short. Sports Market OS generates
                  creator-ready intelligence from live exchange data — in seconds.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    { label: "Export Studio",         desc: "Branded share cards from live market data",           color: "text-purple-400", href: "/export-studio" },
                    { label: "Creator Studio",        desc: "X posts, threads, shorts — generated from signals",   color: "text-pink-400",   href: "/creator-studio" },
                    { label: "Distribution Network",  desc: "Co-branded feeds distributed to your audience",       color: "text-blue-400",   href: "/distribution-center" },
                    { label: "Daily Brief",           desc: "Morning intelligence brief — AI-generated, daily",     color: "text-cyan-400",   href: "/daily-brief" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-4 p-4 border border-white/5 rounded-sm bg-black/40 hover:border-white/10 hover:bg-white/[0.02] transition-colors group"
                    >
                      <span className={`w-1 h-1 rounded-full shrink-0 ${item.color.replace("text-", "bg-")}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${item.color}`}>{item.label}</p>
                        <p className="text-zinc-500 text-xs mt-0.5">{item.desc}</p>
                      </div>
                      <svg className="w-3 h-3 text-zinc-700 group-hover:text-zinc-300 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>

                {/* Reach stats */}
                <div className="flex flex-wrap gap-8 pt-8 border-t border-white/5">
                  {[
                    { value: "3.2M",  label: "Creator reach" },
                    { value: "284",   label: "Signals / hr" },
                    { value: "7",     label: "Export ready" },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="text-2xl font-bold tabular-nums text-white">{s.value}</p>
                      <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signal cards preview */}
              <div className="space-y-4">
                {/* Export queue panel */}
                <div className="border border-purple-400/15 rounded-sm overflow-hidden bg-black">
                  <div className="px-4 py-3 border-b border-white/6 bg-purple-400/[0.03] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-purple-400 pulse-dot" />
                      <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest">Creator Export Queue</span>
                    </div>
                    <span className="text-[9px] font-mono text-purple-400">7 ready</span>
                  </div>
                  {creatorSignals.map((s) => (
                    <div key={s.sport} className={`px-4 py-4 border-b border-white/4 last:border-0`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-zinc-600 text-[8px] font-mono uppercase">{s.sport}</span>
                            <span className={`text-[8px] font-mono border px-1.5 py-0.5 rounded-sm ${s.tagColor} ${s.border} ${s.tagColor.replace("text-", "bg-").replace("-400", "-400/10")}`}>
                              {s.tag}
                            </span>
                          </div>
                          <p className="text-white text-sm font-semibold italic">&ldquo;{s.hook}&rdquo;</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-lg font-bold tabular-nums text-blue-400">{s.conf}%</p>
                          <p className="text-[8px] font-mono text-zinc-700 uppercase">confidence</p>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <span className="text-[9px] font-mono text-zinc-600 border border-zinc-800 px-2 py-0.5 rounded-sm hover:text-zinc-400 cursor-pointer transition-colors">X Post</span>
                        <span className="text-[9px] font-mono text-zinc-600 border border-zinc-800 px-2 py-0.5 rounded-sm hover:text-zinc-400 cursor-pointer transition-colors">Short</span>
                        <span className="text-[9px] font-mono text-zinc-600 border border-zinc-800 px-2 py-0.5 rounded-sm hover:text-zinc-400 cursor-pointer transition-colors">Card</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-5 border border-white/5 rounded-sm bg-black/40 text-center">
                  <p className="text-zinc-500 text-xs mb-3">Every market signal. Creator-ready in seconds.</p>
                  <Link href="/creator-studio" className="inline-flex items-center gap-2 border border-purple-400/30 text-purple-400 text-sm font-medium px-5 py-2 rounded-sm hover:border-purple-400/60 hover:bg-purple-400/5 transition-colors">
                    Open Creator Studio →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Market Intelligence Modules ──────────────────────────────────── */}
        <section className="border-b border-white/5 bg-black">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="max-w-2xl mb-14">
              <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest mb-3">Intelligence Layer</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05]">
                Six systems.<br />
                <span className="text-zinc-500">One operating layer.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {modulePanels.map((mod) => (
                <div key={mod.id} className={`module-card p-7 border rounded-sm bg-zinc-950 ${mod.border}`}>
                  <div className="flex items-center gap-2 mb-5">
                    <span className={`w-1.5 h-1.5 rounded-full pulse-dot ${mod.dot}`} />
                    <span className={`text-[9px] font-mono uppercase tracking-widest ${mod.color}`}>{mod.label}</span>
                  </div>
                  <p className={`text-4xl font-bold tabular-nums leading-none mb-1 ${mod.color}`}>{mod.value}</p>
                  <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-wider mb-4">{mod.unit}</p>
                  <p className="text-zinc-300 text-sm leading-relaxed">{mod.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Tennis Trader AI ─────────────────────────────────────────────── */}
        <section className="border-b border-white/5 bg-emerald-950/10">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-2.5 mb-6">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
                  <span className="text-emerald-400 text-[9px] font-mono uppercase tracking-widest">Execution Layer</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05] mb-5">
                  Tennis Trader AI
                </h2>
                <p className="text-zinc-300 text-base leading-relaxed mb-8">
                  The browser-native AI trading system built for Betfair Exchange.
                  The execution layer connected to the intelligence layer.
                </p>
                <ul className="space-y-3 mb-10">
                  {[
                    "Live Betfair ladder — real-time order book",
                    "Paper trading free — no risk onboarding",
                    "AI Guardian — automated risk management",
                    "One-tap green up across all positions",
                    "Mac · iPhone · iPad · Windows · Android",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                      <span className="text-zinc-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.tennistraderai.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-400 text-black text-sm font-bold px-6 py-3 rounded-sm hover:bg-emerald-300 transition-colors"
                  >
                    Open Tennis Trader AI →
                  </a>
                  <span className="text-zinc-600 text-xs font-mono">Execution on Betfair Exchange</span>
                </div>
              </div>

              {/* Panel preview */}
              <div className="border border-emerald-400/20 rounded-sm bg-black overflow-hidden glow-emerald">
                <div className="px-4 py-3 border-b border-white/6 bg-emerald-400/[0.03] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
                    <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest">Tennis Trader AI — Live</span>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-600">Betfair Exchange</span>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { label: "Betfair Ladder",   value: "Live",      color: "text-emerald-400" },
                    { label: "AI Guardian",       value: "Active",    color: "text-emerald-400" },
                    { label: "Paper Trading",     value: "Free",      color: "text-emerald-400" },
                    { label: "Green Up",          value: "1-tap",     color: "text-white" },
                    { label: "Platform support",  value: "All",       color: "text-white" },
                    { label: "Intelligence feed", value: "SMO / Live", color: "text-cyan-400" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-zinc-900/60 last:border-0">
                      <span className="text-zinc-500 text-xs font-mono">{row.label}</span>
                      <span className={`text-sm font-bold ${row.color}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-white/5 bg-black/40">
                  <p className="text-zinc-600 text-[9px] font-mono">Intelligence layer: Sports Market OS · Execution: Betfair Exchange</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Sports Hubs ──────────────────────────────────────────────────── */}
        <section className="border-b border-white/5 bg-zinc-950/20">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="flex items-end justify-between gap-4 mb-12">
              <div>
                <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest mb-2">Sports Intelligence</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  Seven sports. One intelligence layer.
                </h2>
              </div>
              <Link href="/markets" className="text-[10px] font-mono text-zinc-500 hover:text-white transition-colors shrink-0 hidden md:block">
                All markets →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {sportsHubs.map((hub) => (
                <SportsHubCard key={hub.name} {...hub} />
              ))}
            </div>
          </div>
        </section>

        {/* ─── Final CTA ────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/3 rounded-full blur-3xl hero-ambient pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-cyan-400 pulse-dot" />
              <span className="text-cyan-400 text-[10px] font-mono uppercase tracking-widest">
                Intelligence Terminal — Operational
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.0] mb-3">
              Open the terminal.
            </h2>
            <h3 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-600 mb-10">
              Watch the market move.
            </h3>

            <p className="text-zinc-300 text-base mb-12 max-w-lg mx-auto leading-relaxed">
              Live market intelligence, AI analysis, exchange routing,
              and creator infrastructure — all running, right now.
            </p>

            {/* Live alert strip */}
            <div className="overflow-hidden border border-white/6 rounded-sm bg-white/[0.015] py-2.5 mb-12 max-w-3xl mx-auto">
              <div className="alert-animate">
                {[...alertItems, ...alertItems].map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-2.5 px-6 whitespace-nowrap">
                    <span className={`w-1 h-1 rounded-full shrink-0 ${item.color.replace("text-", "bg-")}/60`} />
                    <span className="text-[9px] font-mono text-zinc-600">{item.text}</span>
                    <span className="text-zinc-800 mx-2">·</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link href="/terminal" className="inline-flex items-center gap-2 bg-white text-black text-sm font-bold px-8 py-3.5 rounded-sm hover:bg-zinc-100 transition-colors">
                Open Terminal
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/signup" className="inline-flex items-center gap-2 border border-white/15 text-white text-sm font-medium px-8 py-3.5 rounded-sm hover:border-white/30 hover:bg-white/5 transition-colors">
                Create Free Account
              </Link>
              <a
                href="https://www.tennistraderai.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-emerald-400/25 text-emerald-400 text-sm font-medium px-8 py-3.5 rounded-sm hover:border-emerald-400/50 hover:bg-emerald-400/5 transition-colors"
              >
                Tennis Trader AI →
              </a>
            </div>

            <p className="text-zinc-800 text-[9px] font-mono mt-12">
              Sports Market OS · Intelligence layer · Not financial advice · Execution on Betfair Exchange
            </p>
          </div>
        </section>

        {/* ─── Footer minimal ───────────────────────────────────────────────── */}
        <footer className="border-t border-white/5 px-6 py-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-zinc-600 text-[9px] font-mono">
              Sports Market OS · Market intelligence · Not financial advice
            </span>
            <div className="flex items-center gap-5 text-[9px] font-mono text-zinc-700">
              <Link href="/pricing"    className="hover:text-zinc-400 transition-colors">Pricing</Link>
              <Link href="/developer"  className="hover:text-zinc-400 transition-colors">API</Link>
              <Link href="/terms"      className="hover:text-zinc-400 transition-colors">Terms</Link>
              <Link href="/privacy"    className="hover:text-zinc-400 transition-colors">Privacy</Link>
              <Link href="/contact"    className="hover:text-zinc-400 transition-colors">Contact</Link>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
