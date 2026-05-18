/**
 * HotMarkets — displays top N highest-heat events for a sport,
 * driven by the composite heat score from lib/signals/hotMarkets.ts.
 *
 * Server component — fetched inline in the hub page.
 */

import type { HotMarket } from "@/lib/signals/hotMarkets";

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

function heatColor(score: number): string {
  if (score >= 80) return "text-teal-400";
  if (score >= 50) return "text-white";
  return "text-zinc-400";
}

function heatBar(score: number, max: number): number {
  return max > 0 ? Math.round((score / max) * 100) : 0;
}

interface Props {
  markets: HotMarket[];
  accentColor?: string; // Tailwind text color class e.g. "text-amber-400"
}

export default function HotMarkets({ markets, accentColor = "text-teal-400" }: Props) {
  if (markets.length === 0) {
    return (
      <div className="border border-zinc-800/60 rounded-sm p-6">
        <p className="font-serif text-zinc-500 text-[14px] leading-relaxed">
          No hot markets detected in the last 48 hours. Signal activity will populate this view as events accumulate multiple detections.
        </p>
      </div>
    );
  }

  const maxHeat = markets[0]?.heat_score ?? 1;

  return (
    <div className="divide-y divide-zinc-900">
      {markets.map((m, i) => {
        const barPct = heatBar(m.heat_score, maxHeat);
        const typeLabel = SIGNAL_TYPE_LABELS[m.latest_signal_type] ?? m.latest_signal_type;

        return (
          <div key={m.event_id} className="py-5 first:pt-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-mono text-zinc-700 tabular-nums w-4">
                  {i + 1}
                </span>
                <span className={`text-[11px] font-mono uppercase tracking-[0.1em] border border-zinc-800 px-1.5 py-0.5 rounded-sm ${accentColor}`}>
                  {typeLabel}
                </span>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className={`text-[13px] font-mono font-bold tabular-nums ${heatColor(m.heat_score)}`}>
                  {m.avg_confidence}%
                </span>
                <span className="text-[11px] font-mono text-zinc-600">
                  {m.signal_count} signal{m.signal_count !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <p className="text-white text-[15px] font-medium leading-snug mb-3 ml-6">
              {m.event_title}
            </p>

            {/* Heat bar */}
            <div className="ml-6 h-[3px] bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${barPct}%`,
                  backgroundColor: "#2dd4bf",
                  opacity: Math.max(0.3, m.avg_confidence / 100),
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
