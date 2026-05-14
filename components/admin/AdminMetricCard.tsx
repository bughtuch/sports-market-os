interface AdminMetricCardProps {
  label: string;
  value: number | string;
  sub?: string;
  color?: string;
}

export default function AdminMetricCard({
  label,
  value,
  sub,
  color = "text-white",
}: AdminMetricCardProps) {
  return (
    <div className="p-4 bg-zinc-950 border border-zinc-800/60 rounded-sm">
      <p className="text-zinc-600 text-[8px] font-mono uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className={`text-xl font-bold tabular-nums ${color}`}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {sub && (
        <p className="text-zinc-700 text-[9px] font-mono mt-0.5">{sub}</p>
      )}
    </div>
  );
}
