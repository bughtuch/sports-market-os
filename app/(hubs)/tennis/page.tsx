/**
 * /tennis — Adaptive lead-data-source page.
 *
 * leadSource logic:
 *   'oddsapi'       — Odds API has ≥5 matches (Roland Garros live, etc.)
 *   'polymarket'    — Polymarket has ≥5 signals, Odds API quiet
 *   'portfolio_first' — Neither source rich (off-season)
 *
 * Zone ordering changes based on leadSource so the richest data always leads.
 */

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
import { fetchMatchesForSport } from "@/lib/providers/oddsApi/fetchMatches";
import type { NormalizedOddsMatch } from "@/lib/providers/oddsApi/fetchMatches";
import type { GameListing } from "@/app/api/odds/games/route";

export const revalidate = 300;

export const metadata = {
  title: "Tennis Markets — Sports Market OS · Tennis Trader AI",
  description:
    "Live Odds API tennis signals, Roland Garros 2026 coverage, Polymarket outright signals, and Tennis Trader AI — the live Betfair Exchange trading system for ATP and WTA match markets.",
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
  price_divergence:        "Sportsbook Divergence",
  cross_source_divergence: "Cross-Source Divergence",
  line_move:               "Line Move",
  catalyst_detected:       "Catalyst",
};

const SOURCE_LABELS: Record<string, string> = {
  polymarket:   "POLYMARKET",
  the_odds_api: "ODDS API",
  mock:         "SIMULATION",
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

function matchToGameListing(m: NormalizedOddsMatch): GameListing {
  const homeOdds = m.outcomes
    .filter((o) => o.selection === m.home_team)
    .reduce((best, o) => (o.price > (best ?? 0) ? o.price : best), null as number | null);
  const awayOdds = m.outcomes
    .filter((o) => o.selection === m.away_team)
    .reduce((best, o) => (o.price > (best ?? 0) ? o.price : best), null as number | null);
  const bookmakerTitles = [...new Set(m.outcomes.map((o) => o.bookmaker_title))];
  return {
    id: m.id,
    home_team: m.home_team,
    away_team: m.away_team,
    commence_time: m.commence_time,
    sport_key: m.sport_key,
    sport: m.sport,
    bookmaker:
      bookmakerTitles.slice(0, 2).join(", ") +
      (bookmakerTitles.length > 2 ? ` +${bookmakerTitles.length - 2}` : ""),
    home_odds: homeOdds !== null ? Math.round(homeOdds * 100) / 100 : null,
    away_odds: awayOdds !== null ? Math.round(awayOdds * 100) / 100 : null,
    bookmaker_count: m.bookmaker_count,
  };
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface SignalRow {
  id: string;
  event_title: string;
  event_id: string;
  signal_type: string;
  source: string;
  confidence: number;
  narrative: string | null;
  generated_at: string;
  decay_window_minutes: number | null;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function MatchesLeadZone({
  matches,
  games,
}: {
  matches: NormalizedOddsMatch[];
  games: GameListing[];
}) {
  // Detect which tournaments are covered
  const sportKeys = [...new Set(matches.map((m) => m.sport_key))];
  const hasATP = sportKeys.some((k) => k.includes("atp"));
  const hasWTA = sportKeys.some((k) => k.includes("wta"));
  const isFrenchOpen = sportKeys.some((k) => k.includes("french_open"));

  const tournamentLabel = isFrenchOpen
    ? "Roland Garros 2026"
    : sportKeys[0]?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ?? "Tennis";

  return (
    <div className="mb-10">
      {/* Tournament banner */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 pulse-dot" />
            <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-teal-400">
              Live Data
            </span>
          </div>
          <p className="text-[20px] font-semibold text-white">
            {tournamentLabel}
          </p>
          <p className="text-[12px] font-mono text-zinc-500 mt-1">
            {matches.length} match{matches.length !== 1 ? "es" : ""} ·{" "}
            {hasATP && hasWTA ? "ATP + WTA" : hasATP ? "ATP" : "WTA"} ·{" "}
            Odds API · Best of {Math.max(...matches.map((m) => m.bookmaker_count))} books
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-[11px] font-mono text-zinc-700">UK · decimal odds</p>
        </div>
      </div>

      {/* Full fixture table — primary */}
      <MatchSlate games={games} accentColor="text-amber-400" />
    </div>
  );
}

function SignalFeed({ signals }: { signals: SignalRow[] }) {
  if (signals.length === 0) {
    return (
      <div className="border border-zinc-800/60 rounded-sm p-6">
        <p className="font-serif text-white text-[16px] leading-[1.65] max-w-[680px]">
          No tennis signals in the last 30 days. Signals appear when the engine
          detects price divergence, volume anomalies, or sportsbook disagreements
          on tennis markets.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-900">
      {signals.map((sig) => {
        const typeLabel = SIGNAL_TYPE_LABELS[sig.signal_type] ?? sig.signal_type;
        const sourceLabel = SOURCE_LABELS[sig.source] ?? sig.source.toUpperCase();
        const desc = sig.narrative?.trim() || `${typeLabel} detected. Confidence ${sig.confidence}%.`;
        return (
          <div key={sig.id} className="py-6 first:pt-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-zinc-400 border border-zinc-800 px-1.5 py-0.5 rounded-sm">
                  {typeLabel}
                </span>
                <span className={`text-[11px] font-mono uppercase tracking-[0.15em] ${sig.source === "the_odds_api" ? "text-amber-400" : "text-teal-400"}`}>
                  {sourceLabel}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0 flex-wrap justify-end">
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
            <p className="text-[17px] font-semibold text-white leading-snug mb-3">
              {sig.event_title}
            </p>
            <p className="font-serif text-white text-[15px] leading-[1.6] max-w-[720px]">
              {desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function TennisPage() {
  const db = adminClient();
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  // ── Parallel data fetch ────────────────────────────────────────────────────
  const [signalsResult, rawMatches, hotMarketsData, accuracyData] = await Promise.all([
    db
      .from("signals")
      .select("id, event_title, event_id, signal_type, source, confidence, narrative, generated_at, decay_window_minutes")
      .eq("sport", "tennis")
      .eq("is_published", true)
      .gte("generated_at", since30d)
      .order("generated_at", { ascending: false })
      .limit(40),
    fetchMatchesForSport("tennis").catch(() => [] as NormalizedOddsMatch[]),
    getHotMarkets("tennis", 5, 48),
    getSportAccuracy("tennis"),
  ]);

  const signals = (signalsResult.data ?? []) as SignalRow[];
  const games: GameListing[] = rawMatches.map(matchToGameListing);

  // ── Adaptive lead logic ───────────────────────────────────────────────────
  const oddsApiRichness = rawMatches.length;
  const polymarketRichness = signals.filter((s) => s.source === "polymarket").length;

  const leadSource: "oddsapi" | "polymarket" | "portfolio_first" =
    oddsApiRichness >= 5
      ? "oddsapi"
      : polymarketRichness >= 5
      ? "polymarket"
      : "portfolio_first";

  // ── Derived stats ─────────────────────────────────────────────────────────
  const uniqueEvents = new Set(signals.map((s) => s.event_id)).size;
  const highConf = signals.filter((s) => s.confidence >= 85).length;
  const avgConf =
    signals.length > 0
      ? Math.round(signals.reduce((acc, s) => acc + s.confidence, 0) / signals.length)
      : null;

  const typeCounts: Record<string, number> = {};
  for (const s of signals) {
    typeCounts[s.signal_type] = (typeCounts[s.signal_type] ?? 0) + 1;
  }
  const topSignalTypes = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type, count]) => ({ type: SIGNAL_TYPE_LABELS[type] ?? type, count }));

  // Tournament context for the brief
  const sportKeys = [...new Set(rawMatches.map((m) => m.sport_key))];
  const isFrenchOpen = sportKeys.some((k) => k.includes("french_open"));
  const tournamentContext = isFrenchOpen
    ? `Roland Garros 2026 is currently live with ${rawMatches.length} matches available on the Odds API.`
    : rawMatches.length > 0
    ? `${rawMatches.length} matches are currently available from the Odds API.`
    : "";

  // AI brief — richer context when Odds API is live
  const brief = await generateSportBrief({
    sport: "tennis",
    sportLabel: "Tennis",
    signalCount: signals.length,
    highConfCount: highConf,
    avgConfidence: avgConf ?? 0,
    topSignalTypes,
    latestEventTitles: [
      ...(isFrenchOpen ? [`${rawMatches.length} Roland Garros 2026 matches live`] : []),
      ...signals.slice(0, 4).map((s) => s.event_title),
    ],
  });

  // Confidence sparkline (last 20 signals, oldest→newest)
  const sparkData = signals.slice(0, 20).reverse().map((s) => s.confidence);

  // ── Zones ────────────────────────────────────────────────────────────────

  const identityZone = (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-amber-400">
          Tennis · Portfolio Coverage
          {leadSource === "oddsapi" && (
            <>
              <span className="mx-2 text-zinc-700">·</span>
              <span className="text-teal-400">Odds API Leading</span>
            </>
          )}
        </p>
      </div>
      <h1 className="text-[40px] md:text-[48px] font-semibold text-white leading-none tracking-[-0.02em] mb-4">
        Tennis
      </h1>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Signals (30d)", value: signals.length.toString() },
          {
            label: "Matches Live",
            value: rawMatches.length > 0 ? rawMatches.length.toString() : "—",
          },
          { label: "High Conf ≥85%", value: highConf.toString() },
          {
            label: "Avg Confidence",
            value: avgConf != null ? `${avgConf}%` : "—",
          },
        ].map((s) => (
          <div key={s.label} className="border border-amber-400/20 rounded-sm p-4">
            <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-2">
              {s.label}
            </p>
            <p className="text-[32px] md:text-[40px] font-mono font-semibold leading-none tracking-[-0.02em] text-amber-400">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <p className="font-serif text-white text-[16px] leading-[1.65] max-w-[680px]">
        {leadSource === "oddsapi"
          ? `${isFrenchOpen ? "Roland Garros 2026 is live. " : ""}The Odds API is the primary signal source — live sportsbook data leads. Polymarket lists tennis outright markets during Grand Slam cycles.`
          : leadSource === "polymarket"
          ? "Polymarket tennis outright signals active. Grand Slam cycle coverage — outright winners, year-end #1, season-specific positions."
          : "Polymarket lists tennis outright markets during Grand Slam cycles. For live match-level trading, Bug Hutch operates Tennis Trader AI on Betfair Exchange."}
      </p>
    </div>
  );

  const aiAnalystZone = (
    <div className="mb-10">
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
      {tournamentContext && (
        <p className="text-[11px] font-mono text-zinc-700 mt-3">{tournamentContext}</p>
      )}
    </div>
  );

  const oddsApiMatchesZone = (
    <div className="mb-10">
      <div className="h-px bg-zinc-900 mb-8" />
      <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-3">
        Live Fixture Data · Odds API · Decimal Odds (UK)
      </p>
      {rawMatches.length > 0 ? (
        <>
          <MatchesLeadZone matches={rawMatches} games={games} />
          {/* Ticker as secondary view on mobile */}
          <div className="mt-6">
            <LiveGameTicker games={games.slice(0, 8)} accentColor="text-amber-400" />
          </div>
        </>
      ) : (
        <div className="border border-zinc-800/60 rounded-sm p-6">
          <p className="font-serif text-white text-[15px] leading-relaxed mb-2">
            No matches currently available from The Odds API.
          </p>
          <p className="text-[12px] font-mono text-zinc-600">
            Matches appear when bookmakers have listed upcoming tennis events. French Open coverage
            uses tournament-specific keys (tennis_atp_french_open, tennis_wta_french_open).
          </p>
        </div>
      )}
    </div>
  );

  const signalFeedZone = (
    <div className="mb-10">
      <div className="h-px bg-zinc-900 mb-8" />
      <div className="flex items-center justify-between mb-5">
        <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500">
          Signal Feed · Tennis · Last 30 Days
        </p>
        <p className="text-[10px] font-mono text-zinc-700">
          Polymarket + Odds API
        </p>
      </div>
      <SignalFeed signals={signals} />
    </div>
  );

  const hotMarketsZone = (
    <div className="mb-10">
      <div className="h-px bg-zinc-900 mb-8" />
      <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-5">
        Hot Markets · Tennis · Last 48 Hours
      </p>
      <HotMarkets markets={hotMarketsData} accentColor="text-amber-400" />
    </div>
  );

  const marketsPulseZone = (
    <div className="mb-10">
      <div className="h-px bg-zinc-900 mb-8" />
      <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-5">
        Markets Pulse · Tennis · Last 4 Hours
      </p>
      <Suspense
        fallback={
          <div className="border border-zinc-900 rounded-[8px] p-6 text-center">
            <p className="text-[11px] font-mono text-zinc-700">Loading…</p>
          </div>
        }
      >
        <MarketsPulse sport="tennis" />
      </Suspense>
    </div>
  );

  const sparklineZone = sparkData.length >= 2 ? (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-600">
          Confidence Trend · Last {sparkData.length} Signals
        </p>
        <span className="text-[11px] font-mono text-zinc-700">30 days</span>
      </div>
      <Sparkline
        data={sparkData}
        width={780}
        height={36}
        colorOverride="#f59e0b"
        className="w-full"
      />
    </div>
  ) : null;

  const ttaZone = (
    <div className="mb-10">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {TTA_FEATURES.map((f) => (
          <div key={f.heading} className="border border-zinc-800/60 rounded-sm p-5">
            <p className="text-white text-[15px] font-semibold mb-2">{f.heading}</p>
            <p className="font-serif text-zinc-400 text-[14px] leading-relaxed">{f.body}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { value: "£37",  label: "Per Month · Founding Member" },
          { value: "Free", label: "Paper Trading" },
          { value: "5",    label: "Platforms · Mac · iPhone · iPad · Windows · Android" },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-[28px] md:text-[36px] font-mono font-semibold leading-none tracking-[-0.02em] text-white mb-2">
              {s.value}
            </p>
            <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-400 leading-snug">
              {s.label}
            </p>
          </div>
        ))}
      </div>
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
  );

  const accuracyZone = (
    <div className="mb-10">
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
  );

  const roadmapZone = (
    <div className="mb-8">
      <div className="h-px bg-zinc-900 mb-8" />
      <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-5">
        Coverage Roadmap
      </p>
      <p className="font-serif text-white text-[16px] leading-[1.65] max-w-[680px] mb-4">
        {leadSource === "oddsapi"
          ? "Odds API is the primary live data source. Polymarket outright coverage activates during Grand Slam cycles (January, May, July, August/September). Betfair Exchange in-play data planned."
          : "Match-level ATP and WTA signals — line moves, sportsbook divergence, in-play volatility — are being activated through The Odds API as a co-equal data source."}
      </p>
      <Link
        href="/accuracy"
        className="text-[12px] font-mono text-zinc-500 hover:text-white transition-colors"
      >
        View full accuracy ledger →
      </Link>
    </div>
  );

  // ── Render zones in adaptive order ────────────────────────────────────────

  return (
    <div className="max-w-[840px] mx-auto px-4 md:px-6 py-12">

      {/* Zone 1: Identity (always first) */}
      {identityZone}

      {leadSource === "oddsapi" && (
        <>
          {/* oddsapi lead order: matches → brief → hot → pulse → signals → TTA → accuracy → roadmap */}
          {oddsApiMatchesZone}
          {aiAnalystZone}
          {sparklineZone}
          {hotMarketsZone}
          {marketsPulseZone}
          {signalFeedZone}
          {ttaZone}
          {accuracyZone}
          {roadmapZone}
        </>
      )}

      {leadSource === "polymarket" && (
        <>
          {/* polymarket lead order: brief → hot → pulse → matches → signals → TTA → accuracy → roadmap */}
          {aiAnalystZone}
          {sparklineZone}
          {hotMarketsZone}
          {marketsPulseZone}
          {oddsApiMatchesZone}
          {signalFeedZone}
          {ttaZone}
          {accuracyZone}
          {roadmapZone}
        </>
      )}

      {leadSource === "portfolio_first" && (
        <>
          {/* portfolio_first order: TTA → brief → matches → signals → accuracy → roadmap */}
          {ttaZone}
          {aiAnalystZone}
          {oddsApiMatchesZone}
          {marketsPulseZone}
          {signalFeedZone}
          {accuracyZone}
          {roadmapZone}
        </>
      )}

      <p className="text-zinc-700 text-[11px] font-mono">
        Market intelligence only — Sports Market OS does not place bets or execute trades.
      </p>

    </div>
  );
}
