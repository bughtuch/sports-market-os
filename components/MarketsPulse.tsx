import { createClient } from "@supabase/supabase-js";
import {
  generatePulseNarrative,
  type PulseData,
} from "@/lib/signals/marketsPulseNarrator";

// ── Supabase (service role — server-only) ─────────────────────────────────────

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ── Constants ─────────────────────────────────────────────────────────────────

const ALL_SPORTS: { key: string; label: string }[] = [
  { key: "nba",          label: "NBA"          },
  { key: "nfl",          label: "NFL"          },
  { key: "mlb",          label: "MLB"          },
  { key: "nhl",          label: "NHL"          },
  { key: "ufc",          label: "UFC"          },
  { key: "tennis",       label: "Tennis"       },
  { key: "football",     label: "Football"     },
  { key: "horse_racing", label: "Horse Racing" },
  { key: "golf",         label: "Golf"         },
  { key: "f1",           label: "Formula 1"    },
];

const SIGNAL_TYPE_LABELS: Record<string, string> = {
  volume_surge:            "volume surges",
  open_interest_shift:     "OI shifts",
  queue_thinning:          "queue thinning",
  spread_compression:      "spread compression",
  spread_widening:         "spread widening",
  whale_concentration:     "whale concentration",
  sharp_flow:              "sharp flow",
  price_divergence:        "price divergence",
  cross_source_divergence: "cross-source divergence",
  line_move:               "line moves",
  catalyst_detected:       "catalyst events",
};

// ── Component ─────────────────────────────────────────────────────────────────

export default async function MarketsPulse() {
  const db = adminClient();
  const since4h = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString();

  const { data } = await db
    .from("signals")
    .select("sport, confidence, signal_type")
    .gte("generated_at", since4h)
    .eq("is_published", true);

  const rows = data ?? [];

  // ── Sport activity aggregation ─────────────────────────────────────────────
  const sportAgg: Record<string, { count: number; confSum: number }> = {};
  for (const row of rows) {
    if (!sportAgg[row.sport]) sportAgg[row.sport] = { count: 0, confSum: 0 };
    sportAgg[row.sport].count++;
    sportAgg[row.sport].confSum += (row.confidence as number) ?? 0;
  }

  const maxCount = Math.max(
    1,
    ...ALL_SPORTS.map(({ key }) => sportAgg[key]?.count ?? 0)
  );

  // ── Signal type aggregation ────────────────────────────────────────────────
  const typeCounts: Record<string, number> = {};
  for (const row of rows) {
    if (!row.signal_type) continue;
    typeCounts[row.signal_type as string] =
      (typeCounts[row.signal_type as string] ?? 0) + 1;
  }
  const topTypes = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // ── Market temperature ─────────────────────────────────────────────────────
  const totalSignals = rows.length;
  const highConf = rows.filter((r) => (r.confidence as number) >= 85).length;
  const peakConf =
    rows.length > 0
      ? Math.round(Math.max(...rows.map((r) => (r.confidence as number) ?? 0)))
      : null;

  // ── Type distribution sentence ─────────────────────────────────────────────
  let typeSentence: string;
  if (topTypes.length === 0) {
    typeSentence = "No signal activity in the last 4 hours.";
  } else if (topTypes.length === 1) {
    const [type, n] = topTypes[0];
    typeSentence = `Activity concentrated in ${SIGNAL_TYPE_LABELS[type] ?? type} (${n}).`;
  } else {
    const [t1, n1] = topTypes[0];
    const [t2, n2] = topTypes[1];
    typeSentence = `Activity skewed toward ${SIGNAL_TYPE_LABELS[t1] ?? t1} (${n1}) and ${SIGNAL_TYPE_LABELS[t2] ?? t2} (${n2}).`;
  }

  // ── AI narrative ───────────────────────────────────────────────────────────
  const pulseData: PulseData = {
    totalSignals,
    highConfCount: highConf,
    peakConfidence: peakConf ?? 0,
    sportBreakdown: ALL_SPORTS
      .map(({ key, label }) => ({
        sport: label,
        count: sportAgg[key]?.count ?? 0,
        avgConf: sportAgg[key]
          ? sportAgg[key].confSum / sportAgg[key].count
          : 0,
      }))
      .filter((s) => s.count > 0),
    topTypes: topTypes.map(([type, count]) => ({
      type: SIGNAL_TYPE_LABELS[type] ?? type,
      count,
    })),
  };

  const narrative = await generatePulseNarrative(pulseData);

  return (
    <div className="border border-zinc-900/80 rounded-[8px] bg-zinc-950 p-6">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[12px] font-mono uppercase tracking-[0.15em] text-zinc-600">
            Markets Pulse
          </p>
          <p className="font-serif text-sm text-zinc-500 mt-0.5">
            Aggregate state, last 4 hours
          </p>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className="w-1.5 h-1.5 rounded-full pulse-dot"
            style={{ backgroundColor: "var(--accent)" }}
          />
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">
            Live
          </span>
        </div>
      </div>

      {/* ── Zone 2: AI narrative (LEADS) ──────────────────────────────────── */}
      <p className="font-serif text-base text-zinc-200 leading-[1.7] mb-6">
        {narrative}
      </p>

      {/* ── Zone 3: Sport activity bars (supporting evidence) ─────────────── */}
      <div className="border-t border-zinc-900 pt-5 mb-5">
        <div className="space-y-1.5">
          {ALL_SPORTS.map(({ key, label }) => {
            const agg = sportAgg[key];
            const count = agg?.count ?? 0;
            const avgConf = count > 0 ? agg!.confSum / count : 0;
            const widthPct = Math.round((count / maxCount) * 100);
            const barOpacity = count > 0 ? Math.max(0.25, avgConf / 100) : 0;

            return (
              <div key={key} className="flex items-center gap-3 h-7 group">
                <span className="w-24 text-right text-[11px] font-mono text-zinc-700 group-hover:text-zinc-500 transition-colors shrink-0">
                  {label}
                </span>
                <div className="flex-1 h-[6px] bg-zinc-900 rounded-full overflow-hidden">
                  {count > 0 && (
                    <div
                      className="h-full rounded-full transition-all duration-300 group-hover:opacity-100"
                      style={{
                        width: `${widthPct}%`,
                        backgroundColor: "var(--accent)",
                        opacity: barOpacity,
                      }}
                    />
                  )}
                </div>
                <span
                  className={`w-6 text-right text-[12px] font-mono tabular-nums shrink-0 ${
                    count > 0 ? "text-zinc-400" : "text-zinc-800"
                  }`}
                >
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Zone 4: Type distribution sentence ────────────────────────────── */}
      <p className="font-serif text-sm text-zinc-500 leading-relaxed mb-5">
        {typeSentence}
      </p>

      {/* ── Zone 5: Market temperature footer ─────────────────────────────── */}
      <div className="pt-4 border-t border-zinc-900">
        <p className="text-[12px] font-mono uppercase tracking-[0.1em] text-zinc-700">
          Total {totalSignals}
          <span className="mx-2 text-zinc-800">·</span>
          High-conf {highConf}
          <span className="mx-2 text-zinc-800">·</span>
          Peak {peakConf != null ? `${peakConf}%` : "—"}
        </p>
      </div>

    </div>
  );
}
