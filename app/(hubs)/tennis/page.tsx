import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Suspense } from "react";

import MarketsPulse from "@/components/MarketsPulse";
import HotMarkets from "@/components/HotMarkets";
import TheEdge from "@/components/TheEdge";
import LiveGameTicker from "@/components/LiveGameTicker";
import MatchSlate from "@/components/MatchSlate";
import SportAccuracySnapshot from "@/components/SportAccuracySnapshot";
import DecayCountdown from "@/components/DecayCountdown";
import Sparkline from "@/components/Sparkline";

import { generateSportBrief } from "@/lib/signals/sportBrief";
import { getHotMarkets } from "@/lib/signals/hotMarkets";
import { getSportAccuracy } from "@/lib/signals/sportAccuracy";

export const revalidate = 300;

export const metadata = {
  title: "Tennis Markets — Sports Market OS · Tennis Trader AI",
  description:
    "Polymarket tennis outright signals plus Tennis Trader AI — the live Betfair Exchange trading system for ATP and WTA match markets.",
};

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ── Constants ─────────────────────────────────────────────────────────────────

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

const TTA_FEATURES = [
  {
    heading: "Live Betfair Exchange ladder",
    body: "Real-time order book across ATP and WTA markets. Full depth visibility.",
  },
  {
    heading: "AI Guardian",
    body: "Automated risk management with 4 exit strategies. Liability control in live markets.",
  },
  {
    heading: "Paper trading free",
    body: "Full functionality without live balance required. Trade on paper first.",
  },
  {
    heading: "5 platforms",
    body: "Mac · iPhone · iPad · Windows · Android — browser-native, no downloads.",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

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

// ── Page ──────────────────────────────────────────────────────────────────────

interface SignalRow {
  id: string;
  event_title: string;
  event_id: string;
  signal_type: string;
  confidence: number;
  narrative: string | null;
  generated_at: string;
  decay_window_minutes: number | null;
}

export default async function TennisPage() {
  const db = adminClient();
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  // ── Parallel data fetching ─────────────────────────────────────────────────
  const [signalsResult, hotMarketsData, accuracyData, gamesResult] = await Promise.all([
    db
      .from("signals")
      .select("id, event_title, event_id, signal_type, confidence, narrative, generated_at, decay_window_minutes")
      .eq("sport", "tennis")
      .eq("is_published", true)
      .gte("generated_at", since30d)
      .order("generated_at", { ascending: false })
      .limit(30),
    getHotMarkets("tennis", 5, 48),
    getSportAccuracy("tennis"),
    fetch(
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/odds/games?sport=tennis`,
      { next: { revalidate: 3600 } }
    ).then((r) => r.json()).catch(() => ({ games: [] })),
  ]);

  const signals = (signalsResult.data ?? []) as SignalRow[];
  const games = (gamesResult.games ?? []) as import("@/app/api/odds/games/route").GameListing[];

  // ── Derived stats ──────────────────────────────────────────────────────────
  const uniqueEvents = new Set(signals.map((s) => s.event_id)).size;
  const highConf     = signals.filter((s) => s.confidence >= 85).length;
  const avgConf      = signals.length > 0
    ? Math.round(signals.reduce((acc, s) => acc + s.confidence, 0) / signals.length)
    : null;

  // Top signal types
  const typeCounts: Record<string, number> = {};
  for (const s of signals) {
    typeCounts[s.signal_type] = (typeCounts[s.signal_type] ?? 0) + 1;
  }
  const topSignalTypes = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type, count]) => ({ type: SIGNAL_TYPE_LABELS[type] ?? type, count }));

  // ── AI analyst brief ───────────────────────────────────────────────────────
  const brief = await generateSportBrief({
    sport: "tennis",
    sportLabel: "Tennis",
    signalCount: signals.length,
    highConfCount: highConf,
    avgConfidence: avgConf ?? 0,
    topSignalTypes,
    latestEventTitles: signals.slice(0, 5).map((s) => s.event_title),
  });

  // Confidence sparkline (last 20 signals, oldest→newest)
  const sparkData = signals.slice(0, 20).reverse().map((s) => s.confidence);

  return (
    <div className="max-w-[840px] mx-auto px-4 md:px-6 py-12">

      {/* ── Zone 1: Header ──────────────────────────────────────────────────── */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-amber-400">
            Tennis · Portfolio Coverage
          </p>
        </div>
        <h1 className="text-[40px] md:text-[48px] font-semibold text-white leading-none tracking-[-0.02em] mb-4">
          Tennis
        </h1>
        <p className="font-serif text-white text-[17px] leading-[1.65] max-w-[680px]">
          Polymarket lists tennis outright markets — Grand Slam winners, year-end #1, season-specific
          positions. Signal coverage activates during tournament cycles when liquidity builds. For live
          match-level trading, Bug Hutch operates Tennis Trader AI on Betfair Exchange.
        </p>
      </div>

      {/* ── Zone 2: Stats bar ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
        {[
          { label: "Signals (30d)", value: signals.length.toString() },
          { label: "Events",        value: uniqueEvents.toString() },
          { label: "High Conf ≥85%",value: highConf.toString() },
          { label: "Avg Confidence",value: avgConf != null ? `${avgConf}%` : "—" },
        ].map((s) => (
          <div key={s.label} className="border border-amber-400/20 rounded-sm p-4">
            <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-2">
              {s.label}
            </p>
            <p className="text-[36px] md:text-[44px] font-mono font-semibold leading-none tracking-[-0.02em] text-amber-400">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Zone 3: Confidence sparkline ────────────────────────────────────── */}
      {sparkData.length >= 2 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-600">
              Confidence Trend · Last {sparkData.length} Signals
            </p>
            <span className="text-[11px] font-mono text-zinc-700">30 days</span>
          </div>
          <Sparkline
            data={sparkData}
            width={780}
            height={40}
            colorOverride="#f59e0b"
            className="w-full"
          />
        </div>
      )}

      {/* ── Zone 4: AI Analyst (The Edge) ───────────────────────────────────── */}
      <div className="mb-12">
        <div className="h-px bg-zinc-900 mb-8" />
        <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-5">
          AI Analyst · Tennis Brief
        </p>
        <TheEdge
          narrative={brief}
          sportLabel="Tennis"
          signalCount={signals.length}
          highConfCount={highConf}
          avgConfidence={avgConf}
          windowLabel="30 days"
        />
      </div>

      {/* ── Zone 5: Markets Pulse (tennis-filtered) ──────────────────────────── */}
      <div className="mb-12">
        <div className="h-px bg-zinc-900 mb-8" />
        <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-5">
          Markets Pulse · Tennis · Last 4 Hours
        </p>
        <Suspense fallback={
          <div className="border border-zinc-900 rounded-[8px] p-6 text-center">
            <p className="text-[11px] font-mono text-zinc-700">Loading pulse…</p>
          </div>
        }>
          <MarketsPulse sport="tennis" />
        </Suspense>
      </div>

      {/* ── Zone 6: Hot Markets ──────────────────────────────────────────────── */}
      <div className="mb-12">
        <div className="h-px bg-zinc-900 mb-8" />
        <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-5">
          Hot Markets · Tennis · Last 48 Hours
        </p>
        <HotMarkets markets={hotMarketsData} accentColor="text-amber-400" />
      </div>

      {/* ── Zone 7: Live signal feed ────────────────────────────────────────── */}
      <div className="mb-12">
        <div className="h-px bg-zinc-900 mb-8" />
        <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-5">
          Polymarket Tennis · Signal Feed · Last 30 Days
        </p>

        {signals.length > 0 ? (
          <div className="divide-y divide-zinc-900">
            {signals.map((sig) => {
              const typeLabel = SIGNAL_TYPE_LABELS[sig.signal_type] ?? sig.signal_type;
              const desc = sig.narrative?.trim() || `${typeLabel} detected. Confidence ${sig.confidence}%.`;
              return (
                <div key={sig.id} className="py-6 first:pt-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-zinc-400 border border-zinc-800 px-1.5 py-0.5 rounded-sm">
                        {typeLabel}
                      </span>
                      <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-teal-400">
                        POLYMARKET
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-[14px] font-mono font-bold tabular-nums ${confColor(sig.confidence)}`}>
                        {sig.confidence}%
                      </span>
                      {sig.decay_window_minutes && (
                        <DecayCountdown
                          generatedAt={sig.generated_at}
                          decayWindowMinutes={sig.decay_window_minutes}
                        />
                      )}
                      <span className="text-[11px] font-mono text-zinc-600">
                        {formatTs(sig.generated_at)}
                      </span>
                    </div>
                  </div>
                  <p className="text-[18px] font-semibold text-white leading-snug mb-3">
                    {sig.event_title}
                  </p>
                  <p className="font-serif text-white text-[15px] leading-[1.6] max-w-[720px]">
                    {desc}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="border border-zinc-800/60 rounded-sm p-6">
            <p className="font-serif text-white text-[16px] leading-[1.65] max-w-[680px]">
              No active tennis signals in the last 30 days. Polymarket tennis markets are
              tournament-driven — signal coverage activates when Grand Slam liquidity builds
              (January, May, July, August/September).
            </p>
          </div>
        )}
      </div>

      {/* ── Zone 8: Odds API — Upcoming Matches ─────────────────────────────── */}
      {games.length > 0 && (
        <div className="mb-12">
          <div className="h-px bg-zinc-900 mb-8" />
          <div className="flex items-center justify-between mb-5">
            <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500">
              Upcoming Fixtures · Odds API · Decimal Odds
            </p>
            <span className="text-[10px] font-mono text-zinc-700">UK · h2h</span>
          </div>
          <div className="mb-6">
            <LiveGameTicker games={games.slice(0, 6)} accentColor="text-amber-400" />
          </div>
          <MatchSlate games={games} accentColor="text-amber-400" />
        </div>
      )}

      {/* ── Zone 9: Accuracy Ledger ──────────────────────────────────────────── */}
      <div className="mb-12">
        <div className="h-px bg-zinc-900 mb-8" />
        <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-2">
          Accuracy Ledger · Tennis
        </p>
        <p className="font-serif text-zinc-400 text-[14px] leading-relaxed mb-6">
          Every signal resolves. Outcomes tracked against predicted direction.
        </p>
        <SportAccuracySnapshot
          stats={accuracyData}
          sportLabel="Tennis"
          accentColor="text-amber-400"
        />
      </div>

      {/* ── Zone 10: Tennis Trader AI ────────────────────────────────────────── */}
      <div className="mb-12">
        <div className="h-px bg-zinc-900 mb-8" />
        <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-5">
          Partner Product · Bug Hutch Portfolio
        </p>
        <h2 className="text-[28px] md:text-[32px] font-semibold text-white leading-tight mb-4">
          For live tennis trading: Tennis Trader AI
        </h2>
        <p className="font-serif text-white text-[17px] leading-[1.65] max-w-[680px] mb-8">
          Tennis Trader AI is the browser-native AI trading system built for Betfair Exchange tennis
          markets. The execution layer for traders who use Sports Market OS for intelligence.
          Built and operated by Bug Hutch Ltd.
        </p>

        {/* Feature pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {TTA_FEATURES.map((f) => (
            <div key={f.heading} className="border border-zinc-800/60 rounded-sm p-5">
              <p className="text-white text-[15px] font-semibold mb-2">{f.heading}</p>
              <p className="font-serif text-zinc-400 text-[14px] leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>

        {/* Stat row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { value: "£37",  label: "Per Month · Founding Member" },
            { value: "Free", label: "Paper Trading" },
            { value: "5",    label: "Platforms · Mac · iPhone · iPad · Windows · Android" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-[32px] md:text-[40px] font-mono font-semibold leading-none tracking-[-0.02em] text-white mb-2">
                {s.value}
              </p>
              <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-400 leading-snug">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-start gap-3">
          <a
            href="https://www.tennistraderai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center min-h-[44px] bg-teal-500 text-zinc-950 text-[13px] font-mono font-semibold uppercase tracking-[0.1em] px-7 py-3 rounded-md hover:bg-teal-400 transition-colors"
          >
            Open Tennis Trader AI →
          </a>
          <p className="text-[11px] font-mono text-zinc-600">
            A Bug Hutch Ltd product · Operated separately from Sports Market OS
          </p>
        </div>
      </div>

      {/* ── Zone 11: Match-level roadmap ─────────────────────────────────────── */}
      <div className="mb-8">
        <div className="h-px bg-zinc-900 mb-8" />
        <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-5">
          Match-Level Coverage · Roadmap
        </p>
        <p className="font-serif text-white text-[16px] leading-[1.65] max-w-[680px] mb-4">
          For individual ATP and WTA match signals — line moves, sportsbook divergence, in-play
          volatility — The Odds API is being activated as a co-equal data source. This will add
          match-level tennis signals to the live feed alongside Polymarket outright signals.
        </p>
        <Link
          href="/accuracy"
          className="text-[12px] font-mono text-zinc-500 hover:text-white transition-colors"
        >
          View full accuracy ledger →
        </Link>
      </div>

      {/* Footer note */}
      <p className="text-zinc-700 text-[11px] font-mono">
        Market intelligence only — Sports Market OS does not place bets or execute trades.
      </p>

    </div>
  );
}
