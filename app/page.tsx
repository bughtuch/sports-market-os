import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import PublicNavBar from "@/components/PublicNavBar";

export const revalidate = 300; // 5-minute cache

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SPORT_SHORT: Record<string, string> = {
  nba: "NBA", nfl: "NFL", nhl: "NHL", mlb: "MLB",
  ufc: "UFC", mma: "MMA", tennis: "Tennis", football: "Football",
  cricket: "Cricket", golf: "Golf", rugby: "Rugby",
};

const SIGNAL_LABEL: Record<string, string> = {
  volume_surge:           "VOL SURGE",
  line_move:              "LINE MOVE",
  spread_compression:     "SPREAD",
  open_interest_shift:    "OI SHIFT",
  cross_source_divergence:"DIVERGENCE",
};

// ─── Sports coverage config ────────────────────────────────────────────────────

const COVERED_SPORTS = [
  // LIVE
  {
    key: "nba", name: "NBA", category: "live" as const, href: "/nba",
    tagline: "Spread pressure, sharp movement, and quarter-by-quarter liquidity signals across active Polymarket NBA markets.",
    accent: "text-blue-400", accentBg: "bg-blue-400/10", accentBorder: "border-blue-400/20", symbol: "▣",
  },
  {
    key: "football", name: "Football", category: "live" as const, href: "/football",
    tagline: "European match markets, value identification across top leagues, and sharp money signals.",
    accent: "text-zinc-300", accentBg: "bg-zinc-300/10", accentBorder: "border-zinc-300/20", symbol: "○",
  },
  {
    key: "nhl", name: "NHL", category: "live" as const, href: "/nhl",
    tagline: "Puck line pressure, volume anomalies, and sharp positioning signals on active Polymarket NHL markets.",
    accent: "text-cyan-400", accentBg: "bg-cyan-400/10", accentBorder: "border-cyan-400/20", symbol: "◆",
  },
  // PORTFOLIO
  {
    key: "tennis", name: "Tennis", category: "portfolio" as const, href: "/tennis",
    tagline: "Polymarket tennis outrights monitored through Grand Slam cycles. Tennis Trader AI for live Betfair match trading.",
    accent: "text-amber-400", accentBg: "bg-amber-400/10", accentBorder: "border-amber-400/20", symbol: "◇",
  },
  {
    key: "horse_racing", name: "Horse Racing", category: "portfolio" as const, href: "/horse-racing",
    tagline: "Horse Racing Trader in build — Betfair Exchange AI terminal for UK and Irish racing markets.",
    accent: "text-amber-400", accentBg: "bg-amber-400/10", accentBorder: "border-amber-400/20", symbol: "◈",
  },
  // BUILDING
  {
    key: "nfl", name: "NFL", category: "building" as const, href: "/nfl",
    tagline: "Line movement analytics, public vs sharp divergence, and game-time liquidity signals.",
    accent: "text-red-400", accentBg: "bg-red-400/10", accentBorder: "border-red-400/20", symbol: "▲",
  },
  {
    key: "mlb", name: "MLB", category: "building" as const, href: undefined,
    tagline: "Run line signals, pitching market analysis, and daily volume patterns across the season.",
    accent: "text-emerald-400", accentBg: "bg-emerald-400/10", accentBorder: "border-emerald-400/20", symbol: "◉",
  },
  {
    key: "ufc", name: "UFC", category: "building" as const, href: "/ufc",
    tagline: "Underdog value detection, late-money identification, and fight-week momentum tracking.",
    accent: "text-orange-400", accentBg: "bg-orange-400/10", accentBorder: "border-orange-400/20", symbol: "◉",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface TickerSignal {
  signal_type: string;
  sport: string;
  event_title: string;
  confidence: number;
}

function LiveTicker({ signals }: { signals: TickerSignal[] }) {
  const items = [...signals, ...signals];
  return (
    <div className="overflow-hidden border-b border-white/5 bg-black py-2">
      <div className="alert-animate">
        {items.map((s, i) => {
          const label    = SIGNAL_LABEL[s.signal_type] ?? s.signal_type.toUpperCase();
          const sport    = SPORT_SHORT[s.sport] ?? s.sport.toUpperCase();
          const color    = s.confidence >= 90 ? "text-cyan-400" : "text-amber-400";
          const dotColor = s.confidence >= 90 ? "bg-cyan-400"   : "bg-amber-400";
          return (
            <span key={i} className="inline-flex items-center gap-2.5 px-8 whitespace-nowrap">
              <span className={`w-1 h-1 rounded-full shrink-0 pulse-dot ${dotColor}`} />
              <span className={`text-[10px] font-mono ${color}`}>
                {label} · {sport} · {s.event_title} · {s.confidence}% confidence
              </span>
              <span className="text-zinc-800 mx-3">·</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const since4h  = new Date(Date.now() -  4 * 60 * 60 * 1000).toISOString();
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  let accuracyPct:   number | null   = null;
  let gradedCount                    = 0;
  let totalSignals:  number | null   = null;
  let highConfToday: number | null   = null;
  let tickerSignals: TickerSignal[]  = [];
  const sportEventCounts: Record<string, number> = {};

  try {
    const [correctRes, incorrectRes, totalSignalsRes, highConfRes, tickerRes, sportEventsRes] = await Promise.all([
      db.from("signal_resolutions")
        .select("*", { count: "exact", head: true })
        .eq("outcome", "correct"),
      db.from("signal_resolutions")
        .select("*", { count: "exact", head: true })
        .eq("outcome", "incorrect"),
      db.from("signals").select("*", { count: "exact", head: true }),
      db.from("signals")
        .select("*", { count: "exact", head: true })
        .gte("generated_at", since4h)
        .gte("confidence", 85),
      db.from("signals")
        .select("signal_type, sport, event_title, confidence")
        .gte("generated_at", since4h)
        .gte("confidence", 80)
        .order("confidence", { ascending: false })
        .limit(10),
      db.from("signals")
        .select("sport, event_id")
        .gte("generated_at", since30d)
        .limit(5000),
    ]);

    const correct   = correctRes.count   ?? 0;
    const incorrect = incorrectRes.count ?? 0;
    gradedCount = correct + incorrect;
    // Require at least one incorrect outcome before displaying — 100% with zero incorrect
    // is a resolver calibration artefact, not a meaningful accuracy claim.
    accuracyPct = (gradedCount >= 10 && incorrect > 0)
      ? Math.min(99, Math.round((correct / gradedCount) * 100))
      : null;
    totalSignals  = totalSignalsRes.count ?? null;
    highConfToday = highConfRes.count ?? null;
    tickerSignals = (tickerRes.data ?? []) as TickerSignal[];

    // Distinct event count per sport
    const sportEventSets: Record<string, Set<string>> = {};
    for (const row of (sportEventsRes.data ?? [])) {
      if (!sportEventSets[row.sport]) sportEventSets[row.sport] = new Set();
      sportEventSets[row.sport].add(row.event_id);
    }
    for (const [sport, set] of Object.entries(sportEventSets)) {
      sportEventCounts[sport] = set.size;
    }
  } catch {
    // Queries failed — page still renders with fallback values
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ─── Live Signal Ticker ─────────────────────────────────────────────── */}
      {tickerSignals.length > 0 && <LiveTicker signals={tickerSignals} />}

      {/* ─── Nav ──────────────────────────────────────────────────────────────── */}
      <PublicNavBar />

      <main>

        {/* ─── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/3 rounded-full blur-3xl hero-ambient pointer-events-none" />
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-emerald-500/3 rounded-full blur-3xl hero-ambient pointer-events-none" style={{ animationDelay: "5s" }} />

          <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-20">

            {/* Accuracy ledger live label */}
            <div className="flex items-center gap-2 mb-10">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
              <span
                className="text-[12px] font-mono uppercase tracking-[0.15em]"
                style={{ color: "var(--accent)" }}
              >
                Public Accuracy Ledger · Live
              </span>
            </div>

            {/* Three live stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800 rounded-lg overflow-hidden border border-zinc-800 mb-14">
              {[
                {
                  label: "Lifetime Accuracy",
                  value: accuracyPct != null ? `${accuracyPct}%` : "—",
                  sub: accuracyPct != null
                    ? `${gradedCount} graded predictions`
                    : gradedCount > 0
                    ? "calibrating — resolver update applied"
                    : "awaiting first resolution",
                  accent: accuracyPct != null,
                },
                {
                  label: "Signals Logged",
                  value: totalSignals != null ? totalSignals.toLocaleString() : "—",
                  sub: "all permanent, auditable",
                  accent: false,
                },
                {
                  label: "High-Confidence Today",
                  value: highConfToday != null ? highConfToday.toLocaleString() : "—",
                  sub: "last 4 hours · threshold 85%+",
                  accent: false,
                },
              ].map((stat) => (
                <div key={stat.label} className="bg-zinc-950 p-8">
                  <p className="text-[12px] font-mono text-zinc-400 uppercase tracking-[0.15em] mb-4">
                    {stat.label}
                  </p>
                  <p
                    className="text-6xl md:text-7xl font-bold font-mono tabular-nums leading-none tracking-tight mb-3"
                    style={{ color: stat.accent ? "var(--accent)" : "#F4F5F7" }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-[13px] font-mono text-zinc-500">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Free / no-signup status badge */}
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
              <span className="text-[12px] font-mono uppercase tracking-[0.15em] text-zinc-300">
                Free · No signup required
              </span>
            </div>

            {/* Serif headline */}
            <h1 className="font-serif text-4xl md:text-5xl text-white leading-[1.15] mb-6 max-w-3xl">
              The institutional intelligence layer for sports prediction markets.
            </h1>

            {/* Serif sub-headline */}
            <p className="font-serif text-zinc-400 text-lg md:text-xl leading-[1.55] mb-10 max-w-2xl">
              Every signal generated by Sports Market OS is logged permanently to a public ledger
              before it reaches any user. Every prediction is graded mechanically against live
              Polymarket data. The accuracy number above is not a marketing claim — it is a query.
              The terminal is free to use, no signup or credit card required.
            </p>

            {/* CTAs */}
            <div className="flex items-start gap-4 flex-wrap">
              <div className="flex flex-col items-center gap-2">
                <Link
                  href="/terminal"
                  className="inline-flex items-center font-mono text-[14px] font-semibold uppercase tracking-[0.1em] py-[14px] px-7 rounded-md hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "var(--accent)", color: "#09090b" }}
                >
                  Open Terminal →
                </Link>
                <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-zinc-500">
                  no signup required
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Link
                  href="/accuracy"
                  className="inline-flex items-center font-mono text-[14px] font-semibold uppercase tracking-[0.1em] py-[14px] px-7 rounded-md border border-zinc-500 text-white hover:border-zinc-300 hover:bg-white/5 transition-colors"
                >
                  Audit the Ledger →
                </Link>
                <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-zinc-500">
                  public dataset
                </span>
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
              {[
                {
                  label: "Public Sees",
                  color: "text-zinc-400",
                  border: "border-zinc-800/60",
                  bg: "",
                  items: [
                    "The final score and the match outcome",
                    "Injury news after it reaches mainstream media",
                    "Odds movement without understanding why",
                    "Prediction market prices without context",
                    "The result — after the market already priced it",
                  ],
                },
                {
                  label: "Market Sees",
                  color: "text-amber-400",
                  border: "border-amber-400/20",
                  bg: "bg-amber-400/5",
                  items: [
                    "Volume surges before public information breaks",
                    "Price movement against the prevailing consensus",
                    "Open interest accumulating on one side",
                    "Spread compression under directional pressure",
                  ],
                },
                {
                  label: "AI Sees",
                  color: "text-cyan-400",
                  border: "border-cyan-400/20",
                  bg: "bg-cyan-400/5",
                  items: [
                    "Four distinct signal patterns across Polymarket data",
                    "Volume/price divergence before narrative forms",
                    "Cross-source disagreement between prediction platforms",
                    "Open interest shifts indicating directional conviction",
                    "The pattern emerging before it becomes consensus",
                  ],
                },
              ].map((panel) => (
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
                { public_: "Public sees the scoreline.", market: "The market saw the volume shift before the narrative formed." },
                { public_: "Public sees injury rumours.", market: "SMO saw the price compression before the confirmation." },
                { public_: "Public sees the headline.", market: "The signal fired before anyone wrote the story." },
              ].map((line, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-zinc-600 text-sm">{line.public_}</p>
                  <p className="text-white text-sm font-semibold">{line.market}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Intelligence Systems ──────────────────────────────────────────── */}
        <section className="border-b border-white/5 bg-zinc-950/30">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="max-w-2xl mb-14">
              <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest mb-3">How it works</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05]">
                Three systems.<br />
                <span className="text-zinc-500">One intelligence layer.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  label:  "Signal Engine",
                  color:  "text-cyan-400",
                  border: "border-cyan-400/15",
                  dot:    "bg-cyan-400",
                  value:  "4",
                  unit:   "detectors",
                  desc:   "Volume surge, line move, spread compression, and open interest shift — four independent pattern detectors running continuously across Polymarket data.",
                },
                {
                  label:  "AI Narrator",
                  color:  "text-purple-400",
                  border: "border-purple-400/15",
                  dot:    "bg-purple-400",
                  value:  "3",
                  unit:   "Claude layers",
                  desc:   "Every signal gets a narrative. Market context, signal framing, and creator-ready brief — three layers of AI analysis generated for each detection event.",
                },
                {
                  label:  "Accuracy Ledger",
                  color:  "text-emerald-400",
                  border: "border-emerald-400/15",
                  dot:    "bg-emerald-400",
                  value:  "Public",
                  unit:   "permanent record",
                  desc:   "Every prediction is logged before distribution and graded mechanically against live Polymarket data. The accuracy number on this page is a database query — not a curated figure.",
                },
              ].map((mod) => (
                <div key={mod.label} className={`module-card p-7 border rounded-sm bg-zinc-950 ${mod.border}`}>
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

        {/* ─── Creator Intelligence Network ─────────────────────────────────── */}
        <section className="border-b border-white/5 bg-black">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="max-w-2xl mb-14">
              <p className="text-purple-400 text-[9px] font-mono uppercase tracking-widest mb-3">Creator Intelligence</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05]">
                Turn live signals<br />
                <span className="text-purple-400">into content.</span>
              </h2>
              <p className="text-zinc-400 text-base mt-4 leading-relaxed max-w-xl">
                Every signal generated by the engine is immediately exportable. Every daily brief
                is AI-generated from live market data. No manual curation. No fabrication.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 border rounded-sm border-purple-400/15 bg-purple-400/[0.03]">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span className="text-[9px] font-mono uppercase tracking-widest text-purple-400">Export Studio</span>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                  Branded share cards generated from live signal data. Every signal event produces
                  an exportable card — sport, event, confidence, signal type, and AI narrative included.
                </p>
                <Link href="/export-studio" className="inline-flex items-center text-sm font-medium text-purple-400 hover:opacity-80 transition-opacity">
                  Open Export Studio →
                </Link>
              </div>

              <div className="p-8 border rounded-sm border-cyan-400/15 bg-cyan-400/[0.03]">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="text-[9px] font-mono uppercase tracking-widest text-cyan-400">Today&apos;s Brief</span>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                  An AI-generated daily market intelligence brief, delivered to the terminal every
                  morning. Covers signal density, sport distribution, and high-confidence calls
                  from the prior 24 hours.
                </p>
                <Link href="/terminal" className="inline-flex items-center text-sm font-medium text-cyan-400 hover:opacity-80 transition-opacity">
                  Read Today&apos;s Brief →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Partner Product: Tennis Trader AI ────────────────────────────── */}
        <section className="border-b border-white/5 bg-emerald-950/10">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                <div className="flex items-center gap-2.5 mb-6">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
                  <span className="text-emerald-400 text-[9px] font-mono uppercase tracking-widest">Partner Product</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05] mb-5">
                  Tennis Trader AI
                </h2>
                <p className="text-zinc-300 text-base leading-relaxed mb-8 max-w-md">
                  The browser-native AI trading system built for Betfair Exchange. A separate product,
                  built by the same team — the execution layer for traders who also use the intelligence layer.
                </p>

                {/* Four engine pillars */}
                <div className="space-y-4 mb-10">
                  {[
                    {
                      label: "Live Betfair Ladder",
                      desc:  "Real-time order book, tick-by-tick price updates, and full market depth.",
                      color: "text-emerald-400",
                    },
                    {
                      label: "AI Guardian",
                      desc:  "Automated risk management — configurable loss limits, liability caps, and position monitoring.",
                      color: "text-emerald-400",
                    },
                    {
                      label: "Paper Trading",
                      desc:  "Free risk-free onboarding. Full functionality without a live Betfair balance.",
                      color: "text-emerald-400",
                    },
                    {
                      label: "One-Tap Green Up",
                      desc:  "Close all open positions across the market in a single action.",
                      color: "text-emerald-400",
                    },
                  ].map((p) => (
                    <div key={p.label} className="flex items-start gap-4 p-4 border border-white/5 rounded-sm bg-black/40">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0 mt-2" />
                      <div>
                        <p className={`text-sm font-semibold mb-0.5 ${p.color}`}>{p.label}</p>
                        <p className="text-zinc-500 text-xs leading-relaxed">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Three stats */}
                <div className="flex gap-8 mb-10 pb-10 border-b border-white/5">
                  {[
                    { value: "Free",         label: "Paper trading" },
                    { value: "5 platforms",  label: "Mac · iPhone · iPad · Windows · Android" },
                    { value: "Live",         label: "Betfair ladder" },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="text-2xl font-bold tabular-nums text-white">{s.value}</p>
                      <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>

                <a
                  href="https://www.tennistraderai.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-400 text-black text-sm font-bold px-6 py-3 rounded-sm hover:bg-emerald-300 transition-colors"
                >
                  Open Tennis Trader AI →
                </a>
              </div>

              {/* Panel */}
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
                    { label: "Betfair Ladder",   value: "Live",       color: "text-emerald-400" },
                    { label: "AI Guardian",       value: "Active",     color: "text-emerald-400" },
                    { label: "Paper Trading",     value: "Free",       color: "text-emerald-400" },
                    { label: "Green Up",          value: "1-tap",      color: "text-white" },
                    { label: "Platform support",  value: "All",        color: "text-white" },
                    { label: "Intelligence feed", value: "SMO / Live", color: "text-cyan-400" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-zinc-900/60 last:border-0">
                      <span className="text-zinc-500 text-xs font-mono">{row.label}</span>
                      <span className={`text-sm font-bold ${row.color}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Sports Coverage ──────────────────────────────────────────────── */}
        <section className="border-b border-white/5 bg-zinc-950/20">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="flex items-end justify-between gap-4 mb-12">
              <div>
                <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest mb-2">Sports Intelligence</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  Eight sports. One intelligence layer.
                </h2>
              </div>
              <Link href="/markets" className="text-[10px] font-mono text-zinc-500 hover:text-white transition-colors shrink-0 hidden md:block">
                All markets →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {COVERED_SPORTS.map((sport) => {
                const count       = sportEventCounts[sport.key] ?? 0;
                const isLive      = sport.category === "live" && count > 0;
                const isPortfolio = sport.category === "portfolio";

                const tileClass = "group relative bg-zinc-950 border border-zinc-800/80 rounded-sm p-5 hover:border-zinc-700 transition-all duration-200 block";

                const inner = (
                  <>
                    <div className={`text-2xl font-mono mb-4 ${sport.accent}`}>{sport.symbol}</div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white text-sm font-semibold">{sport.name}</h3>
                      {isLive ? (
                        <span className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-sm border ${sport.accent} ${sport.accentBg} ${sport.accentBorder}`}>
                          LIVE
                        </span>
                      ) : isPortfolio ? (
                        <span className="text-[9px] font-mono uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-sm border text-zinc-400 bg-white/[0.04] border-zinc-800">
                          PORTFOLIO
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-sm border text-zinc-600 bg-zinc-900/50 border-zinc-800">
                          BUILDING
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-500 text-xs leading-relaxed mb-4">{sport.tagline}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600 text-[10px] font-mono">
                        {isLive
                          ? `${count} event${count === 1 ? "" : "s"} tracked`
                          : isPortfolio
                          ? "Portfolio product"
                          : "Coverage building"}
                      </span>
                      <svg className="w-3 h-3 text-zinc-700 group-hover:text-zinc-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </>
                );

                return sport.href ? (
                  <Link key={sport.key} href={sport.href} className={tileClass}>{inner}</Link>
                ) : (
                  <div key={sport.key} className={tileClass}>{inner}</div>
                );
              })}
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
              Live Polymarket intelligence, AI signal narration, and a public accuracy ledger —
              all running, right now.
            </p>

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
            </div>

            <p className="text-zinc-800 text-[9px] font-mono mt-12">
              Sports Market OS · Polymarket intelligence · Not financial advice
            </p>
          </div>
        </section>

        {/* ─── Footer minimal ───────────────────────────────────────────────── */}
        <footer className="border-t border-white/5 px-6 py-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-zinc-600 text-[9px] font-mono">
              Sports Market OS · Polymarket intelligence · Not financial advice
            </span>
            <div className="flex items-center gap-5 text-[9px] font-mono text-zinc-700">
              <Link href="/pricing"   className="hover:text-zinc-400 transition-colors">Pricing</Link>
              <Link href="/developer" className="hover:text-zinc-400 transition-colors">API</Link>
              <Link href="/terms"     className="hover:text-zinc-400 transition-colors">Terms</Link>
              <Link href="/privacy"   className="hover:text-zinc-400 transition-colors">Privacy</Link>
              <Link href="/contact"   className="hover:text-zinc-400 transition-colors">Contact</Link>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
