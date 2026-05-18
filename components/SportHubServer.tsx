/**
 * SportHubServer — server component for all sport hub pages.
 *
 * LIVE sports (nba, football, nhl): queries Supabase for real signals.
 * COVERAGE BUILDING sports (nfl, ufc, mlb): honest placeholder.
 *
 * Tennis and Horse Racing use dedicated page files with portfolio content.
 */

import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ── Hub config ────────────────────────────────────────────────────────────────

const HUB_CONFIG = {
  nba: {
    name: "NBA", dbKey: "nba", status: "live" as const,
    accent: "text-blue-400", accentBg: "bg-blue-400/10", accentBorder: "border-blue-400/20", dot: "bg-blue-400",
    description: "Spread pressure, sharp movement, and quarter-by-quarter liquidity signals across Polymarket NBA markets.",
  },
  football: {
    name: "Football", dbKey: "football", status: "live" as const,
    accent: "text-zinc-300", accentBg: "bg-zinc-300/10", accentBorder: "border-zinc-300/20", dot: "bg-zinc-300",
    description: "European match markets, value identification across top leagues. Polymarket football event intelligence.",
  },
  nhl: {
    name: "NHL", dbKey: "nhl", status: "live" as const,
    accent: "text-cyan-400", accentBg: "bg-cyan-400/10", accentBorder: "border-cyan-400/20", dot: "bg-cyan-400",
    description: "Puck line pressure, volume anomalies, and moneyline intelligence across Polymarket NHL markets.",
  },
  nfl: {
    name: "NFL", dbKey: "nfl", status: "building" as const,
    accent: "text-red-400", accentBg: "bg-red-400/10", accentBorder: "border-red-400/20", dot: "bg-red-400",
    description: "Line movement analytics, public vs sharp divergence, and totals pressure.",
  },
  ufc: {
    name: "UFC", dbKey: "ufc", status: "building" as const,
    accent: "text-orange-400", accentBg: "bg-orange-400/10", accentBorder: "border-orange-400/20", dot: "bg-orange-400",
    description: "Underdog value detection, late-money identification, and opening-line pressure.",
  },
  mlb: {
    name: "MLB", dbKey: "mlb", status: "building" as const,
    accent: "text-emerald-400", accentBg: "bg-emerald-400/10", accentBorder: "border-emerald-400/20", dot: "bg-emerald-400",
    description: "Run line signals, pitching market analysis, and moneyline intelligence.",
  },
} satisfies Record<string, {
  name: string; dbKey: string; status: "live" | "building";
  accent: string; accentBg: string; accentBorder: string; dot: string;
  description: string;
}>;

type HubSlug = keyof typeof HUB_CONFIG;
type HubConfig = typeof HUB_CONFIG[HubSlug];

const SIGNAL_TYPE_LABELS: Record<string, string> = {
  volume_surge:            "Volume Surge",
  open_interest_shift:     "OI Shift",
  queue_thinning:          "Queue Thinning",
  spread_compression:      "Spread Compression",
  spread_widening:         "Spread Widening",
  whale_concentration:     "Whale Concentration",
  sharp_flow:              "Sharp Flow",
  price_divergence:        "Price Divergence",
  cross_source_divergence: "Cross-Source Divergence",
  line_move:               "Line Move",
  catalyst_detected:       "Catalyst",
};

interface SignalRow {
  id: string;
  event_title: string;
  event_id: string;
  signal_type: string;
  confidence: number;
  narrative: string | null;
  generated_at: string;
}

function formatTs(iso: string): string {
  const d = new Date(iso);
  const h = d.getUTCHours().toString().padStart(2, "0");
  const m = d.getUTCMinutes().toString().padStart(2, "0");
  const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getUTCMonth()];
  return `${month} ${d.getUTCDate()} · ${h}:${m} UTC`;
}

function confColor(conf: number): string {
  return conf >= 85 ? "text-teal-400" : "text-white";
}

// ── Coverage Building placeholder ─────────────────────────────────────────────

function CoverageBuildingView({ cfg }: { cfg: HubConfig }) {
  return (
    <div className="max-w-[720px] mx-auto px-6 py-16">
      <p className={`text-[11px] font-mono uppercase tracking-[0.15em] mb-6 ${cfg.accent}`}>
        {cfg.name} Markets · Coverage Building
      </p>
      <h1 className="text-[36px] md:text-[40px] font-semibold text-white leading-tight mb-8">
        {cfg.name}
      </h1>

      <div className={`border ${cfg.accentBorder} ${cfg.accentBg} rounded-sm p-6 mb-10`}>
        <p className="font-serif text-white text-[17px] leading-[1.65]">
          Polymarket {cfg.name} markets are monitored continuously. Active signal generation begins as
          liquidity builds. The signal engine evaluates volume surges, spread compression, line moves,
          open interest shifts, and cross-source divergence against The Odds API on every {cfg.name}{" "}
          event Polymarket lists.
        </p>
      </div>

      <div className="space-y-5 mb-12">
        {[
          `When a Polymarket ${cfg.name} market crosses the liquidity threshold, the signal engine begins emitting confidence-scored events to the live feed.`,
          `Add any ${cfg.name} market to your watchlist from the Terminal. You'll see signals as soon as activity begins.`,
          `The Accuracy Ledger will populate with resolved ${cfg.name} signals as outcomes are determined.`,
        ].map((text) => (
          <div key={text} className="flex items-start gap-3">
            <span className="text-zinc-600 font-mono text-xs mt-1 shrink-0">›</span>
            <p className="font-serif text-white text-[15px] leading-[1.6]">{text}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/terminal"
          className="inline-flex items-center min-h-[44px] text-[13px] font-mono px-5 py-3 rounded-sm bg-white text-black hover:bg-zinc-200 transition-colors"
        >
          Open Terminal →
        </Link>
        <Link
          href="/markets"
          className="inline-flex items-center min-h-[44px] text-[13px] font-mono px-5 py-3 rounded-sm border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
        >
          Browse Live Markets
        </Link>
      </div>
    </div>
  );
}

// ── Live sport view ───────────────────────────────────────────────────────────

function LiveSportView({
  cfg, signals, total, highConf, avgConf, uniqueEvents,
}: {
  cfg: HubConfig;
  signals: SignalRow[];
  total: number;
  highConf: number;
  avgConf: number | null;
  uniqueEvents: number;
}) {
  return (
    <div className="max-w-[840px] mx-auto px-6 py-12">
      {/* Header */}
      <p className={`text-[11px] font-mono uppercase tracking-[0.15em] mb-4 ${cfg.accent}`}>
        {cfg.name} Markets · Live Coverage
      </p>
      <h1 className="text-[36px] md:text-[40px] font-semibold text-white leading-tight mb-3">
        {cfg.name}
      </h1>
      <p className="font-serif text-white text-[17px] leading-[1.65] mb-10 max-w-[720px]">
        {cfg.description}
      </p>

      {/* Stat grid — 2x2 mobile, 4 col desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
        {[
          { label: "Signals (30d)", value: total.toString() },
          { label: "Events",        value: uniqueEvents.toString() },
          { label: "High Conf ≥85%", value: highConf.toString() },
          { label: "Avg Confidence", value: avgConf != null ? `${avgConf}%` : "—" },
        ].map((s) => (
          <div key={s.label} className={`border ${cfg.accentBorder} rounded-sm p-4`}>
            <p className="text-[12px] font-mono uppercase tracking-[0.15em] text-zinc-400 mb-2">
              {s.label}
            </p>
            <p className={`text-[40px] md:text-[48px] font-mono font-semibold leading-none tracking-[-0.02em] ${cfg.accent}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Signal feed */}
      <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-6">
        Recent Signals
      </p>

      {signals.length === 0 ? (
        <div className="border border-zinc-800/60 rounded-sm p-8 text-center mb-10">
          <p className="font-serif text-white text-[15px] mb-1">No signals in the last 30 days.</p>
          <p className="text-zinc-500 text-[13px] font-mono">The signal engine is running and monitoring active markets.</p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-900 mb-10">
          {signals.map((sig) => {
            const typeLabel = SIGNAL_TYPE_LABELS[sig.signal_type] ?? sig.signal_type;
            const desc = sig.narrative?.trim() || `${typeLabel} detected. Confidence ${sig.confidence}%.`;
            return (
              <div key={sig.id} className="py-6 first:pt-0">
                {/* Meta row */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-zinc-400 border border-zinc-800 px-1.5 py-0.5 rounded-sm">
                      {typeLabel}
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-teal-400">
                      POLYMARKET
                    </span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className={`text-[14px] font-mono font-bold tabular-nums ${confColor(sig.confidence)}`}>
                      {sig.confidence}%
                    </span>
                    <span className="text-[12px] font-mono text-zinc-500">
                      {formatTs(sig.generated_at)}
                    </span>
                  </div>
                </div>
                {/* Event title */}
                <p className="text-[18px] md:text-[20px] font-semibold text-white leading-snug mb-3">
                  {sig.event_title}
                </p>
                {/* Narrative */}
                <p className="font-serif text-white text-[15px] leading-[1.6] max-w-[720px]">
                  {desc}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-4">
        <Link
          href="/terminal"
          className="inline-flex items-center min-h-[44px] text-[13px] font-mono px-5 py-3 rounded-sm bg-white text-black hover:bg-zinc-200 transition-colors"
        >
          Open Terminal →
        </Link>
        <Link
          href="/accuracy"
          className="inline-flex items-center min-h-[44px] text-[13px] font-mono px-5 py-3 rounded-sm border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
        >
          View Accuracy Ledger
        </Link>
      </div>

      <p className="mt-10 text-zinc-700 text-[11px] font-mono">
        Market intelligence only — Sports Market OS does not place bets or execute trades.
      </p>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default async function SportHubServer({ sportSlug }: { sportSlug: string }) {
  const cfg = HUB_CONFIG[sportSlug as HubSlug];
  if (!cfg) return null;

  if (cfg.status === "building") {
    return <CoverageBuildingView cfg={cfg} />;
  }

  const db = adminClient();
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data } = await db
    .from("signals")
    .select("id, event_title, event_id, signal_type, confidence, narrative, generated_at")
    .eq("sport", cfg.dbKey)
    .eq("is_published", true)
    .gte("generated_at", since30d)
    .order("generated_at", { ascending: false })
    .limit(20);

  const signals = (data ?? []) as SignalRow[];
  const uniqueEvents = new Set(signals.map((s) => s.event_id)).size;
  const highConf     = signals.filter((s) => s.confidence >= 85).length;
  const avgConf      = signals.length > 0
    ? Math.round(signals.reduce((acc, s) => acc + s.confidence, 0) / signals.length)
    : null;

  return (
    <LiveSportView
      cfg={cfg}
      signals={signals}
      total={signals.length}
      highConf={highConf}
      avgConf={avgConf}
      uniqueEvents={uniqueEvents}
    />
  );
}
