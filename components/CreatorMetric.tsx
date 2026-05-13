export interface CreatorMetricProps {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  subtext?: string;
  accentColor?: string;
  live?: boolean;
}

function TrendBadge({ trend, change }: { trend: "up" | "down" | "neutral"; change: string }) {
  const styles =
    trend === "up"
      ? "text-emerald-400"
      : trend === "down"
      ? "text-red-400"
      : "text-zinc-500";
  const arrow = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";
  return (
    <span className={`text-[9px] font-mono ${styles}`}>
      {arrow} {change}
    </span>
  );
}

export default function CreatorMetric({
  label,
  value,
  change,
  trend = "neutral",
  subtext,
  accentColor,
  live,
}: CreatorMetricProps) {
  return (
    <div className="bg-zinc-950 border border-zinc-800/80 rounded-sm p-4 hover:border-zinc-700 transition-colors group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest">
          {label}
        </span>
        {live && (
          <div className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot" />
          </div>
        )}
      </div>
      <p
        className={`text-xl font-semibold leading-none tabular-nums mb-1 ${
          accentColor ?? "text-white"
        }`}
      >
        {value}
      </p>
      <div className="flex items-center gap-2 mt-1.5">
        {change && trend && <TrendBadge trend={trend} change={change} />}
        {subtext && (
          <span className="text-zinc-700 text-[9px] font-mono">{subtext}</span>
        )}
      </div>
    </div>
  );
}
