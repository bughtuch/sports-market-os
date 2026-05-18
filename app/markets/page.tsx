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

const SPORT_FILTERS = [
  { key: "",            label: "All" },
  { key: "nba",         label: "NBA" },
  { key: "football",    label: "Football" },
  { key: "nhl",         label: "NHL" },
  { key: "tennis",      label: "Tennis" },
  { key: "horse_racing",label: "Horse Racing" },
  { key: "nfl",         label: "NFL" },
  { key: "ufc",         label: "UFC" },
];

const HUB_LINKS = [
  { label: "NBA",          href: "/nba",          accent: "text-blue-400",   bg: "bg-blue-400/10",   border: "border-blue-400/20" },
  { label: "Football",     href: "/football",     accent: "text-zinc-300",   bg: "bg-zinc-300/10",   border: "border-zinc-300/20" },
  { label: "NHL",          href: "/nhl",          accent: "text-cyan-400",   bg: "bg-cyan-400/10",   border: "border-cyan-400/20" },
  { label: "Tennis",       href: "/tennis",       accent: "text-amber-400",  bg: "bg-amber-400/10",  border: "border-amber-400/20" },
  { label: "Horse Racing", href: "/horse-racing", accent: "text-amber-400",  bg: "bg-amber-400/10",  border: "border-amber-400/20" },
  { label: "NFL",          href: "/nfl",          accent: "text-red-400",    bg: "bg-red-400/10",    border: "border-red-400/20" },
  { label: "UFC",          href: "/ufc",          accent: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" },
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getUTCMonth()];
  return `${month} ${d.getUTCDate()}`;
}

function confColor(conf: number): string {
  return conf >= 85 ? "text-teal-400" : conf >= 70 ? "text-white" : "text-zinc-400";
}

interface SignalRow {
  event_id: string;
  event_title: string;
  sport: string;
  signal_type: string;
  confidence: number;
  generated_at: string;
}

export default async function MarketsPage(props: {
  searchParams: Promise<{ sport?: string }>;
}) {
  const { sport: sportFilter = "" } = await props.searchParams;

  const db = adminClient();
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data } = await db
    .from("signals")
    .select("event_id, event_title, sport, signal_type, confidence, generated_at")
    .gte("generated_at", since7d)
    .eq("is_published", true)
    .order("generated_at", { ascending: false })
    .limit(200);

  // Deduplicate by event_id — keep latest signal per event
  const seen = new Set<string>();
  const allEvents = ((data ?? []) as SignalRow[]).filter((row) => {
    if (seen.has(row.event_id)) return false;
    seen.add(row.event_id);
    return true;
  });

  const filteredEvents = sportFilter
    ? allEvents.filter((e) => e.sport === sportFilter)
    : allEvents;

  const isHorseRacingFilter = sportFilter === "horse_racing";

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-6 py-10 border-b border-zinc-900/80">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
            <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500">
              Sports Market OS · Market Directory
            </span>
          </div>
          <h1 className="text-[32px] md:text-[40px] font-semibold text-white mb-3">
            Active Markets
          </h1>
          <p className="font-serif text-white text-[16px] md:text-[17px] leading-[1.65] max-w-[640px] mb-8">
            Polymarket events with signal intelligence in the last 7 days.
            {allEvents.length > 0
              ? ` ${allEvents.length} unique event${allEvents.length === 1 ? "" : "s"} monitored.`
              : " No events detected yet — engine running."}
          </p>

          {/* Sport hub quick links */}
          <div className="flex flex-wrap gap-2">
            {HUB_LINKS.map((h) => (
              <Link
                key={h.href}
                href={h.href}
                className={`text-[11px] font-mono uppercase tracking-[0.1em] px-3 py-1.5 rounded-sm border transition-colors ${h.accent} ${h.bg} ${h.border} hover:opacity-80 min-h-[36px] inline-flex items-center`}
              >
                {h.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Event list ─────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {SPORT_FILTERS.map((f) => {
            const isActive = sportFilter === f.key;
            return (
              <Link
                key={f.key}
                href={f.key ? `?sport=${f.key}` : "/markets"}
                className={`text-[11px] font-mono uppercase tracking-[0.1em] px-3 py-1.5 rounded-sm border transition-colors min-h-[36px] inline-flex items-center ${
                  isActive
                    ? "text-white bg-teal-500/10 border-teal-500/40"
                    : "text-zinc-400 border-zinc-700 hover:text-white hover:border-zinc-500"
                }`}
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        {/* Horse Racing special empty state */}
        {isHorseRacingFilter ? (
          <div className="border border-zinc-800/60 rounded-sm p-8">
            <p className="font-serif text-white text-[16px] leading-[1.65] mb-4">
              No Polymarket horse racing markets currently listed.
            </p>
            <p className="font-serif text-zinc-400 text-[15px] leading-relaxed mb-6">
              Polymarket does not cover horse racing. For UK and Irish horse racing exchange trading,
              see Horse Racing Trader — a Bug Hutch portfolio product in build for Betfair Exchange.
            </p>
            <Link
              href="/horse-racing"
              className="text-[12px] font-mono text-amber-400 hover:text-amber-300 transition-colors"
            >
              See Horse Racing Trader →
            </Link>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="border border-zinc-800/60 rounded-sm p-8 text-center">
            <p className="font-serif text-white text-[15px] mb-2">No market activity in the last 7 days.</p>
            <p className="text-zinc-600 text-[12px] font-mono">
              {sportFilter
                ? `No ${SPORT_DISPLAY[sportFilter] ?? sportFilter} signals this week. Try All Sports.`
                : "The signal engine is running. Markets will appear here as activity is detected on Polymarket."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-900">
            {/* Table header */}
            <div className="grid grid-cols-[80px_1fr_auto_52px_52px] gap-4 pb-3">
              {["Sport", "Event", "Signal Type", "Conf", "Date"].map((h) => (
                <span key={h} className="text-[11px] font-mono uppercase tracking-[0.1em] text-zinc-500">
                  {h}
                </span>
              ))}
            </div>

            {filteredEvents.map((event) => {
              const sportLabel = SPORT_DISPLAY[event.sport] ?? event.sport;
              const sportColor = SPORT_COLORS[event.sport] ?? "text-zinc-400";
              const typeLabel  = SIGNAL_TYPE_LABELS[event.signal_type] ?? event.signal_type;
              const hubLink    = SPORT_LINKS[event.sport];
              const ts         = formatDate(event.generated_at);

              return (
                <div
                  key={event.event_id}
                  className="grid grid-cols-[80px_1fr_auto_52px_52px] gap-4 items-center py-4"
                >
                  {/* Sport */}
                  <div>
                    {hubLink ? (
                      <Link href={hubLink} className={`text-[11px] font-mono uppercase tracking-[0.1em] hover:underline ${sportColor}`}>
                        {sportLabel}
                      </Link>
                    ) : (
                      <span className={`text-[11px] font-mono uppercase tracking-[0.1em] ${sportColor}`}>
                        {sportLabel}
                      </span>
                    )}
                    <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-teal-400 mt-0.5">
                      POLYMARKET
                    </p>
                  </div>

                  {/* Event title */}
                  <p className="text-white text-[15px] font-medium truncate">{event.event_title}</p>

                  {/* Signal type */}
                  <p className="text-zinc-500 text-[12px] font-mono hidden md:block">{typeLabel}</p>

                  {/* Confidence */}
                  <p className={`text-[14px] font-mono font-bold tabular-nums ${confColor(event.confidence)}`}>
                    {event.confidence}%
                  </p>

                  {/* Date + terminal link */}
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-600 text-[12px] font-mono">{ts}</span>
                    <Link
                      href="/terminal"
                      className="text-zinc-600 hover:text-white transition-colors text-[12px] font-mono"
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

        <p className="mt-8 text-zinc-700 text-[11px] font-mono">
          Market intelligence only — Sports Market OS does not place bets or execute trades.
        </p>
      </div>
    </>
  );
}
