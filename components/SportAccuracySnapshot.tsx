/**
 * SportAccuracySnapshot — sport-specific accuracy ledger block.
 *
 * Server component. Renders stats + CalibrationChart for one sport.
 * Pre-computed accuracy data passed as a prop.
 */

import CalibrationChart from "@/components/CalibrationChart";
import type { SportAccuracyStats } from "@/lib/signals/sportAccuracy";

interface Props {
  stats: SportAccuracyStats;
  sportLabel: string;
  accentColor?: string;
}

function pct(n: number | null): string {
  if (n === null) return "—";
  return `${Math.round(n * 100)}%`;
}

export default function SportAccuracySnapshot({ stats, sportLabel, accentColor = "text-teal-400" }: Props) {
  return (
    <div>
      {/* Stat row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Resolved", value: stats.totalResolved.toString() },
          { label: "Hit Rate", value: pct(stats.hitRate) },
          { label: "Correct",  value: stats.correctCount.toString() },
          { label: "Avg Confidence", value: stats.avgConfidence !== null ? `${stats.avgConfidence}%` : "—" },
        ].map((s) => (
          <div key={s.label} className="border border-zinc-800/60 rounded-sm p-4">
            <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-2">
              {s.label}
            </p>
            <p className={`text-[32px] md:text-[40px] font-mono font-semibold leading-none tracking-[-0.02em] ${accentColor}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Calibration chart */}
      <div className="mb-4">
        <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-600 mb-4">
          {sportLabel} Calibration Curve · Predicted vs Actual Hit Rate
        </p>
        <CalibrationChart
          data={stats.calibrationBuckets}
          hasEnoughData={stats.hasEnoughData}
        />
      </div>

      {!stats.hasEnoughData && stats.totalResolved > 0 && (
        <p className="text-[11px] font-mono text-zinc-700 mt-2">
          {stats.totalResolved} resolved · calibration curve activates at 20.
        </p>
      )}

      {stats.totalResolved === 0 && (
        <p className="text-[12px] font-mono text-zinc-700">
          No resolved {sportLabel.toLowerCase()} signals yet. Ledger builds as signals expire and outcomes are confirmed.
        </p>
      )}
    </div>
  );
}
