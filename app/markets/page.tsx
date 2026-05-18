import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export const revalidate = 300;

export const metadata = {
  title: "Active Markets — Sports Market OS",
  description: "Polymarket events with live signal intelligence. Volume surges, spread compression, and sharp flow signals across sports.",
};

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const SPORT_DISPLAY: Record<string, string> = {
  nba: "NBA", nfl: "NFL", nhl: "NHL", mlb: "MLB", ufc: "UFC",
  tennis: "Tennis", football: "Football", soccer: "Football",
  horse_racing: "Horse Racing", golf: "Golf", f1: "Formula 1",
};

const SPORT_COLORS: Record<string, string> = {
  nba: "text-blue-400", nfl: "text-red-400", nhl: "text-cyan-400",
  mlb: "text-emerald-400", ufc: "text-orange-400", tennis: "text-amber-400",
  football: "text-zinc-300", soccer: "text-zinc-300",
  horse_racing: "text-amber-400", golf: "text-green-400", f1: "text-red-400",
};

const SPORT_LINKS: Record<string, string> = {
  nba: "/nba", nfl: "/nfl", nhl: "/nhl",
  tennis: "/tennis", ufc: "/ufc", football: "/football",
};

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

function formatDate(iso: string): string {
  const d = new Date(iso);
  const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getUTCMonth()];
  return `${month} ${d.getUTCDate()}`;
}

const HUB_LINKS = [
  { label: "NBA",      href: "/nba",      accent: "text-blue-400",    bg: "bg-blue-400/10",    border: "border-blue-400/20" },
  { label: "Football", href: "/football", accent: "text-zinc-300",    bg: "bg-zinc-300/10",    border: "border-zinc-300/20" },
  { label: "NHL",      href: "/nhl",      accent: "text-cyan-400",    bg: "bg-cyan-400/10",    border: "border-cyan-400/20" },
  { label: "Tennis",   href: "/tennis",   accent: "text-amber-400",   bg: "bg-amber-400/10",   border: "border-amber-400/20" },
  { label: "NFL",      href: "/nfl",      accent: "text-red-400",     bg: "bg-red-400/10",     border: "border-red-400/20" },
  { label: "UFC",      href: "/ufc",      accent: "text-orange-400",  bg: "bg-orange-400/10",  border: "border-orange-400/20" },
];

interface SignalRow {
  event_id: string;
  event_title: string;
  sport: string;
  signal_type: string;
  confidence: number;
  generated_at: string;
}

export default async function MarketsPage() {
  const db = adminClient();
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data } = await db
    .from("signals")
    .select("event_id, event_title, sport, signal_type, confidence, generated_at")
    .gte("generated_at", since7d)
    .eq("is_published", true)
    .order("generated_at", { ascending: false })
    .limit(200);

  // Deduplicate by event_id — keep the latest signal per event
  const seen = new Set<string>();
  const events = ((data ?? []) as SignalRow[]).filter((row) => {
    if (seen.has(row.event_id)) return false;
    seen.add(row.event_id);
    return true;
  });

  return (
    <>
      {/* Header */}
      <section className="px-6 py-10 border-b border-zinc-900/80">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              Sports Market OS · Market Directory
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Active Markets</h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl mb-6">
            Polymarket events with signal intelligence in the last 7 days.
            {events.length > 0
              ? ` ${events.length} unique event${events.length === 1 ? "" : "s"} monitored.`
              : " No events detected yet — engine running."}
          </p>

          {/* Sport hub quick links */}
          <div className="flex flex-wrap gap-2">
            {HUB_LINKS.map((h) => (
              <Link
                key={h.href}
                href={h.href}
                className={`text-[10px] font-mono px-2.5 py-1 rounded-sm border transition-colors ${h.accent} ${h.bg} ${h.border} hover:opacity-80`}
              >
                {h.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Event list */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {events.length === 0 ? (
          <div className="border border-zinc-800/60 rounded-sm p-8 text-center">
            <p className="text-zinc-500 text-sm mb-2">No market activity in the last 7 days.</p>
            <p className="text-zinc-700 text-xs">
              The signal engine is running. Markets will appear here as activity is detected on Polymarket.
            </p>
          </div>
        ) : (
          <div className="space-y-px">
            {/* Table header */}
            <div className="grid grid-cols-[80px_1fr_140px_60px_60px] gap-3 px-4 mb-2">
              {["Sport", "Event", "Signal Type", "Conf", "Date"].map((h) => (
                <span key={h} className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest truncate">{h}</span>
              ))}
            </div>

            {events.map((event) => {
              const sportLabel = SPORT_DISPLAY[event.sport] ?? event.sport;
              const sportColor = SPORT_COLORS[event.sport] ?? "text-zinc-400";
              const typeLabel  = SIGNAL_TYPE_LABELS[event.signal_type] ?? event.signal_type;
              const hubLink    = SPORT_LINKS[event.sport];
              const ts         = formatDate(event.generated_at);

              return (
                <div
                  key={event.event_id}
                  className="grid grid-cols-[80px_1fr_140px_60px_60px] gap-3 items-center bg-zinc-950 border border-zinc-800/40 rounded-sm px-4 py-3 hover:border-zinc-700 transition-colors"
                >
                  {/* Sport */}
                  <div>
                    {hubLink ? (
                      <Link href={hubLink} className={`text-[9px] font-mono uppercase tracking-wider hover:underline ${sportColor}`}>
                        {sportLabel}
                      </Link>
                    ) : (
                      <span className={`text-[9px] font-mono uppercase tracking-wider ${sportColor}`}>
                        {sportLabel}
                      </span>
                    )}
                    <p className="text-zinc-700 text-[8px] font-mono mt-0.5">POLYMARKET</p>
                  </div>

                  {/* Event title */}
                  <p className="text-zinc-200 text-xs truncate">{event.event_title}</p>

                  {/* Signal type */}
                  <p className="text-zinc-500 text-[9px] font-mono truncate">{typeLabel}</p>

                  {/* Confidence */}
                  <p className="text-zinc-300 text-[10px] font-mono tabular-nums font-semibold">{event.confidence}%</p>

                  {/* Date + link */}
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-700 text-[9px] font-mono">{ts}</span>
                    <Link
                      href="/terminal"
                      className="text-[9px] font-mono text-zinc-600 hover:text-white transition-colors"
                      title="View in Terminal"
                    >
                      →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-6 text-zinc-800 text-[9px] font-mono">
          Market intelligence only — Sports Market OS does not place bets or execute trades.
        </p>
      </div>
    </>
  );
}
