import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export const revalidate = 300;

export const metadata = {
  title: "Tennis Markets — Sports Market OS · Tennis Trader AI",
  description: "Polymarket tennis outright signals plus Tennis Trader AI — the live Betfair Exchange trading system for ATP and WTA match markets.",
};

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

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

interface SignalRow {
  id: string;
  event_title: string;
  event_id: string;
  signal_type: string;
  confidence: number;
  narrative: string | null;
  generated_at: string;
}

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

const TTA_STATS = [
  { value: "£37", label: "Per Month · Founding Member Pricing" },
  { value: "Free", label: "Paper Trading" },
  { value: "5", label: "Platforms · Mac · iPhone · iPad · Windows · Android" },
];

export default async function TennisPage() {
  const db = adminClient();
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data } = await db
    .from("signals")
    .select("id, event_title, event_id, signal_type, confidence, narrative, generated_at")
    .eq("sport", "tennis")
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
    <div className="max-w-[840px] mx-auto px-4 md:px-6 py-12">

      {/* ── Portfolio header ─────────────────────────────────────────────────── */}
      <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-amber-400 mb-4">
        Tennis Markets · Portfolio Coverage
      </p>
      <h1 className="text-[36px] md:text-[40px] font-semibold text-white leading-tight mb-4">
        Tennis
      </h1>
      <p className="font-serif text-white text-[17px] leading-[1.65] max-w-[720px] mb-14">
        Polymarket lists tennis outright markets — Grand Slam winners, year-end #1, season-specific
        positions. Signal coverage activates during tournament cycles when liquidity builds. For live
        tennis match-level trading, Bug Hutch operates Tennis Trader AI on the Betfair Exchange — a
        separate browser-native product built for the same audience.
      </p>

      {/* ── Section 1: Polymarket Tennis Status ─────────────────────────────── */}
      <div className="h-px bg-zinc-900 mb-12" />

      <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-6">
        Polymarket Tennis · Current Status
      </p>

      {signals.length > 0 ? (
        <>
          {/* Stat grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {[
              { label: "Signals (30d)", value: signals.length.toString() },
              { label: "Events",        value: uniqueEvents.toString() },
              { label: "High Conf ≥85%", value: highConf.toString() },
              { label: "Avg Confidence", value: avgConf != null ? `${avgConf}%` : "—" },
            ].map((s) => (
              <div key={s.label} className="border border-amber-400/20 rounded-sm p-4">
                <p className="text-[12px] font-mono uppercase tracking-[0.15em] text-zinc-400 mb-2">{s.label}</p>
                <p className="text-[40px] md:text-[48px] font-mono font-semibold leading-none tracking-[-0.02em] text-amber-400">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Signal cards */}
          <div className="divide-y divide-zinc-900 mb-12">
            {signals.map((sig) => {
              const typeLabel = SIGNAL_TYPE_LABELS[sig.signal_type] ?? sig.signal_type;
              const desc = sig.narrative?.trim() || `${typeLabel} detected. Confidence ${sig.confidence}%.`;
              return (
                <div key={sig.id} className="py-6 first:pt-0">
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
                  <p className="text-[18px] font-semibold text-white leading-snug mb-3">{sig.event_title}</p>
                  <p className="font-serif text-white text-[15px] leading-[1.6] max-w-[720px]">{desc}</p>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="border border-zinc-800/60 rounded-sm p-6 mb-12">
          <p className="font-serif text-white text-[16px] leading-[1.65] max-w-[720px]">
            No active tennis signals in the last 30 days. Polymarket tennis markets are
            tournament-driven and typically quiet outside Grand Slam cycles (January, May, July,
            August/September). When liquidity builds on tennis outrights, the signal engine begins
            emitting events to the live feed.
          </p>
        </div>
      )}

      {/* ── Section 2: Tennis Trader AI ─────────────────────────────────────── */}
      <div className="h-px bg-zinc-900 mb-12" />

      <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-5">
        Partner Product · Bug Hutch Portfolio
      </p>
      <h2 className="text-[28px] md:text-[32px] font-semibold text-white leading-tight mb-4">
        For live tennis trading: Tennis Trader AI
      </h2>
      <p className="font-serif text-white text-[17px] leading-[1.65] max-w-[720px] mb-10">
        Tennis Trader AI is the browser-native AI trading system built for Betfair Exchange tennis
        markets. It&apos;s the execution layer for traders who use Sports Market OS for intelligence.
        Built and operated by Bug Hutch Ltd.
      </p>

      {/* Feature pillars — 2×2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {TTA_FEATURES.map((f) => (
          <div key={f.heading} className="border border-zinc-800/60 rounded-sm p-5">
            <p className="text-white text-[16px] font-semibold mb-2">{f.heading}</p>
            <p className="font-serif text-zinc-400 text-[14px] leading-relaxed">{f.body}</p>
          </div>
        ))}
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {TTA_STATS.map((s) => (
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

      {/* ── Section 3: Match-level coverage roadmap ──────────────────────────── */}
      <div className="h-px bg-zinc-900 mt-14 mb-12" />

      <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-5">
        Match-Level Coverage · Roadmap
      </p>
      <p className="font-serif text-white text-[16px] leading-[1.65] max-w-[720px]">
        For individual ATP and WTA match signals — line moves, sportsbook divergence, in-play
        volatility — we&apos;re activating The Odds API as a co-equal data source over the coming
        weeks. This will add tennis match-level signals to the live feed alongside Polymarket outright
        signals.
      </p>

    </div>
  );
}
