/**
 * /tennis — Tennis Trader AI portfolio lander.
 *
 * V1: Pure Polymarket intelligence source. No Odds API code paths.
 *
 * Zones:
 *   1. Header — sport identity + Polymarket signal status
 *   2. Polymarket Intelligence — AI brief + hot markets + pulse + signal feed + accuracy
 *   3. Tennis Trader AI — execution layer product block
 *   4. Cross-sport nav
 */

import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Suspense } from "react";

import MarketsPulse from "@/components/MarketsPulse";
import HotMarkets from "@/components/HotMarkets";
import TheEdge from "@/components/TheEdge";
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
    "Polymarket tennis intelligence, AI signal narration, and Tennis Trader AI — the live Betfair Exchange trading system for ATP and WTA match markets.",
};

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const SIGNAL_TYPE_LABELS: Record<string, string> = {
  volume_surge:        "Volume Surge",
  open_interest_shift: "OI Shift",
  spread_compression:  "Spread Compression",
  line_move:           "Line Move",
  sharp_flow:          "Sharp Flow",
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

function formatTs(iso: string): string {
  const d = new Date(iso);
  const h = d.getUTCHours().toString().padStart(2, "0");
  const m = d.getUTCMinutes().toString().padStart(2, "0");
  const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getUTCMonth()];
  return `${month} ${d.getUTCDate()} · ${h}:${m} UTC`;
}

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

  const [signalsResult, hotMarketsData, accuracyData] = await Promise.all([
    db
      .from("signals")
      .select("id, event_title, event_id, signal_type, confidence, narrative, generated_at, decay_window_minutes")
      .eq("sport", "tennis")
      .eq("is_published", true)
      .gte("generated_at", since30d)
      .order("generated_at", { ascending: false })
      .limit(40),
    getHotMarkets("tennis", 5, 48),
    getSportAccuracy("tennis"),
  ]);

  const signals = (signalsResult.data ?? []) as SignalRow[];
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

  const brief = await generateSportBrief({
    sport: "tennis",
    sportLabel: "Tennis",
    signalCount: signals.length,
    highConfCount: highConf,
    avgConfidence: avgConf ?? 0,
    topSignalTypes,
    latestEventTitles: signals.slice(0, 4).map((s) => s.event_title),
  });

  const sparkData = signals.slice(0, 20).reverse().map((s) => s.confidence);
  const polymarketStatus = signals.length >= 5 ? "ACTIVE" : signals.length > 0 ? "QUIET" : "NO DATA";

  return (
    <div className="max-w-[840px] mx-auto px-4 md:px-6 py-12">

      {/* ── Zone 1: Header ─────────────────────────────────────────────────── */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-amber-400">
            Tennis · Polymarket Coverage
          </p>
        </div>
        <h1 className="text-[40px] md:text-[48px] font-semibold text-white leading-none tracking-[-0.02em] mb-5">
          Tennis
        </h1>

        {/* Polymarket status chip */}
        <div className="inline-flex items-center gap-2 border border-zinc-800 px-3 py-1.5 rounded-sm mb-6">
          <span className={`w-1.5 h-1.5 rounded-full ${signals.length > 0 ? "bg-teal-400 pulse-dot" : "bg-zinc-600"}`} />
          <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-400">
            Polymarket · {polymarketStatus}
          </span>
          <span className="text-zinc-700 text-[11px] font-mono">·</span>
          <span className="text-[11px] font-mono text-zinc-500">{signals.length} signals (30d)</span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {[
            { label: "Signals (30d)",  value: signals.length.toString() },
            { label: "High Conf ≥85%", value: highConf.toString() },
            { label: "Avg Confidence", value: avgConf != null ? `${avgConf}%` : "—" },
          ].map((s) => (
            <div key={s.label} className="border border-amber-400/20 rounded-sm p-4">
              <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-2">
                {s.label}
              </p>
              <p className="text-[32px] font-mono font-semibold leading-none tracking-[-0.02em] text-amber-400">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        <p className="font-serif text-white text-[16px] leading-[1.65] max-w-[680px]">
          Polymarket lists tennis outright markets during Grand Slam cycles — outright winners,
          year-end rankings, season positions. For live match-level trading, Bug Hutch operates
          Tennis Trader AI on Betfair Exchange.
        </p>
      </div>

      {/* ── Zone 2: Polymarket Intelligence ────────────────────────────────── */}

      {/* AI Analyst Brief */}
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
      </div>

      {/* Confidence Sparkline */}
      {sparkData.length >= 2 && (
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
      )}

      {/* Hot Markets */}
      <div className="mb-10">
        <div className="h-px bg-zinc-900 mb-8" />
        <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-5">
          Hot Markets · Tennis · Last 48 Hours
        </p>
        <HotMarkets markets={hotMarketsData} accentColor="text-amber-400" />
      </div>

      {/* Markets Pulse */}
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

      {/* Signal Feed */}
      <div className="mb-10">
        <div className="h-px bg-zinc-900 mb-8" />
        <div className="flex items-center justify-between mb-5">
          <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500">
            Signal Feed · Tennis · Last 30 Days
          </p>
          <p className="text-[10px] font-mono text-zinc-700">Polymarket</p>
        </div>
        {signals.length === 0 ? (
          <div className="border border-zinc-800/60 rounded-sm p-6">
            <p className="font-serif text-white text-[16px] leading-[1.65] max-w-[680px]">
              No tennis signals in the last 30 days. Signals appear when the engine
              detects price divergence or volume anomalies on Polymarket tennis markets.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-900">
            {signals.map((sig) => {
              const typeLabel = SIGNAL_TYPE_LABELS[sig.signal_type] ?? sig.signal_type;
              const desc = sig.narrative?.trim() || `${typeLabel} detected. Confidence ${sig.confidence}%.`;
              return (
                <div key={sig.id} className="py-6 first:pt-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-zinc-400 border border-zinc-800 px-1.5 py-0.5 rounded-sm">
                      {typeLabel}
                    </span>
                    <div className="flex items-center gap-3 shrink-0 flex-wrap justify-end">
                      <span className={`text-[14px] font-mono font-bold tabular-nums ${sig.confidence >= 85 ? "text-teal-400" : "text-white"}`}>
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
        )}
      </div>

      {/* Accuracy Ledger */}
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
        <Link
          href="/accuracy"
          className="inline-block text-[12px] font-mono text-zinc-500 hover:text-white transition-colors mt-4"
        >
          View full accuracy ledger →
        </Link>
      </div>

      {/* ── Zone 3: Tennis Trader AI ────────────────────────────────────────── */}
      <div className="mb-10">
        <div className="h-px bg-zinc-900 mb-8" />
        <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-5">
          Partner Product · Bug Hutch Portfolio
        </p>
        <h2 className="text-[28px] md:text-[32px] font-semibold text-white leading-tight mb-4">
          Tennis Trader AI
        </h2>
        <p className="font-serif text-white text-[17px] leading-[1.65] max-w-[680px] mb-8">
          The browser-native AI trading system built for Betfair Exchange tennis markets.
          The execution layer for traders who use Sports Market OS for intelligence.
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

      {/* ── Zone 4: Cross-sport nav ─────────────────────────────────────────── */}
      <div className="mb-10">
        <div className="h-px bg-zinc-900 mb-8" />
        <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-5">
          More from Sports Market OS
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { href: "/horse-racing", label: "Horse Racing",          tag: "Coming Soon", accent: "text-orange-400" },
            { href: "/terminal",     label: "Intelligence Terminal", tag: "Live",         accent: "text-cyan-400" },
            { href: "/accuracy",     label: "Accuracy Ledger",       tag: "Public",       accent: "text-emerald-400" },
            { href: "/markets",      label: "All Markets",           tag: "Live",         accent: "text-white" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between p-4 border border-zinc-800/60 rounded-sm hover:border-zinc-600 transition-colors group"
            >
              <div>
                <span className="text-white text-[14px] font-semibold group-hover:text-zinc-200 transition-colors">
                  {link.label}
                </span>
                <span className={`ml-2 text-[10px] font-mono uppercase tracking-[0.1em] ${link.accent}`}>
                  {link.tag}
                </span>
              </div>
              <svg className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      <p className="text-zinc-700 text-[11px] font-mono">
        Market intelligence only — Sports Market OS does not place bets or execute trades.
      </p>

    </div>
  );
}
