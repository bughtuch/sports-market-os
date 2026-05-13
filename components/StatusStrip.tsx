const metrics = [
  { label: "Active markets", value: "248" },
  { label: "AI scans/min", value: "1,920" },
  { label: "Signal throughput", value: "142/hr" },
  { label: "Connected exchanges", value: "8" },
  { label: "Anomalies detected", value: "3" },
  { label: "AI load", value: "67%" },
  { label: "Avg volatility", value: "0.74" },
  { label: "Creator posts/min", value: "2.4" },
  { label: "Terminal latency", value: "82ms" },
  { label: "Free users online", value: "4,812" },
];

export default function StatusStrip() {
  return (
    <div className="h-7 shrink-0 border-t border-zinc-800/60 bg-zinc-950 flex items-center px-4 gap-0 overflow-x-auto">
      {/* Live indicator */}
      <div className="flex items-center gap-1.5 shrink-0 pr-4">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
        <span className="text-emerald-500 text-[9px] font-mono uppercase tracking-widest">Live</span>
      </div>

      <div className="w-px h-3 bg-zinc-800 shrink-0 mr-4" />

      {/* Metrics */}
      {metrics.map((metric, i) => (
        <div key={i} className="flex items-center shrink-0">
          <span className="text-zinc-700 text-[9px] font-mono">{metric.label}:</span>
          <span className="text-zinc-400 text-[9px] font-mono tabular-nums ml-1">{metric.value}</span>
          {i < metrics.length - 1 && (
            <span className="mx-3 text-zinc-800 font-mono text-[9px]">·</span>
          )}
        </div>
      ))}

      {/* Version */}
      <div className="ml-auto shrink-0 pl-4">
        <span className="text-zinc-800 text-[9px] font-mono tracking-wider">
          SPORTS MARKET OS v2.0
        </span>
      </div>
    </div>
  );
}
