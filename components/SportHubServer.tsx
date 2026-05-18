/**
 * SportHubServer — server component for all sport hub pages.
 *
 * LIVE sports (nba, football, nhl): queries Supabase for real signals.
 * COVERAGE BUILDING sports (tennis, nfl, ufc, mlb): honest placeholder.
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
  tennis: {
    name: "Tennis", dbKey: "tennis", status: "building" as const,
    accent: "text-amber-400", accentBg: "bg-amber-400/10", accentBorder: "border-amber-400/20", dot: "bg-amber-400",
    description: "In-play momentum, serve pattern divergence, and live odds intelligence.",
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

// ── Coverage Building placeholder ─────────────────────────────────────────────

function CoverageBuildingView({ cfg }: { cfg: HubConfig }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="flex items-center gap-2 mb-6">
        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
        <span className={`text-[9px] font-mono uppercase tracking-widest ${cfg.accent}`}>
          {cfg.name} Markets · Coverage Building
        </span>
      </div>
      <h1 className="text-3xl font-bold text-white mb-6">{cfg.name}</h1>

      <div className={`border ${cfg.accentBorder} ${cfg.accentBg} rounded-sm p-6 mb-8`}>
        <p className="text-zinc-200 text-sm leading-relaxed">
          Polymarket {cfg.name} markets are monitored continuously. Active signal generation begins as
          liquidity builds. The signal engine evaluates volume surges, spread compression, line moves,
          open interest shifts, and cross-source divergence against The Odds API on every {cfg.name}{" "}
          event Polymarket lists.
        </p>
      </div>

      <div className="space-y-4 mb-10">
        {[
          `When a Polymarket ${cfg.name} market crosses the liquidity threshold, the signal engine begins emitting confidence-scored events to the live feed.`,
          `Add any ${cfg.name} market to your watchlist from the Terminal. You'll see signals as soon as activity begins.`,
          `The Accuracy Ledger will populate with resolved ${cfg.name} signals as outcomes are determined.`,
        ].map((text) => (
          <div key={text} className="flex items-start gap-3">
            <span className="text-zinc-700 font-mono text-xs mt-0.5 shrink-0">›</span>
            <p className="text-zinc-400 text-sm leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/terminal"
          className="inline-flex items-center text-xs font-mono px-4 py-2.5 rounded-sm bg-white text-black hover:bg-zinc-200 transition-colors"
        >
          Open Terminal →
        </Link>
        <Link
          href="/markets"
          className="inline-flex items-center text-xs font-mono px-4 py-2.5 rounded-sm border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
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
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`w-2 h-2 rounded-full ${cfg.dot} pulse-dot`} />
        <span className={`text-[9px] font-mono uppercase tracking-widest ${cfg.accent}`}>
          {cfg.name} Markets · Live Coverage
        </span>
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">{cfg.name}</h1>
      <p className="text-zinc-400 text-sm leading-relaxed mb-10 max-w-2xl">{cfg.description}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {[
          { label: "Signals (30d)", value: total.toString() },
          { label: "Events",        value: uniqueEvents.toString() },
          { label: "High Conf ≥85%", value: highConf.toString() },
          { label: "Avg Confidence", value: avgConf != null ? `${avgConf}%` : "—" },
        ].map((s) => (
          <div key={s.label} className={`border ${cfg.accentBorder} rounded-sm p-4`}>
            <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1">{s.label}</p>
            <p className={`text-2xl font-bold tabular-nums ${cfg.accent}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Signal feed */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Recent Signals</span>
        <div className="flex-1 h-px bg-zinc-900" />
      </div>

      {signals.length === 0 ? (
        <div className="border border-zinc-800/60 rounded-sm p-8 text-center mb-8">
          <p className="text-zinc-500 text-sm">No signals in the last 30 days.</p>
          <p className="text-zinc-700 text-xs mt-1">The signal engine is running and monitoring active markets.</p>
        </div>
      ) : (
        <div className="space-y-2 mb-8">
          {signals.map((sig) => {
            const typeLabel = SIGNAL_TYPE_LABELS[sig.signal_type] ?? sig.signal_type;
            const desc = sig.narrative?.trim() || `${typeLabel} detected. Confidence ${sig.confidence}%.`;
            return (
              <div
                key={sig.id}
                className="bg-zinc-950 border border-zinc-800/40 rounded-sm p-4 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-sm border ${cfg.accentBorder} ${cfg.accentBg} ${cfg.accent}`}>
                      {typeLabel}
                    </span>
                    <span className="text-zinc-700 text-[8px] font-mono uppercase tracking-wider">
                      POLYMARKET
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[10px] font-mono tabular-nums font-semibold ${cfg.accent}`}>
                      {sig.confidence}%
                    </span>
                    <span className="text-zinc-600 text-[9px] font-mono">{formatTs(sig.generated_at)}</span>
                  </div>
                </div>
                <p className="text-white text-xs font-semibold mb-1.5">{sig.event_title}</p>
                <p className="text-zinc-400 text-[11px] leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-4">
        <Link
          href="/terminal"
          className="inline-flex items-center text-xs font-mono px-4 py-2.5 rounded-sm bg-white text-black hover:bg-zinc-200 transition-colors"
        >
          Open Terminal →
        </Link>
        <Link
          href="/accuracy"
          className="inline-flex items-center text-xs font-mono px-4 py-2.5 rounded-sm border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
        >
          View Accuracy Ledger
        </Link>
      </div>

      <p className="mt-8 text-zinc-800 text-[9px] font-mono">
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
