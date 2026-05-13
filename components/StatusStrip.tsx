const metrics = [
  { label: "Active markets", value: "248" },
  { label: "AI scans/min", value: "1,920" },
  { label: "Connected feeds", value: "12" },
  { label: "Creator posts today", value: "486" },
  { label: "Terminal latency", value: "82ms" },
  { label: "Free users online", value: "4,812" },
];

export default function StatusStrip() {
  return (
    <div className="h-8 shrink-0 border-t border-zinc-800/60 bg-zinc-950 flex items-center px-4 gap-6 overflow-x-auto">
      {/* Live indicator */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
        <span className="text-emerald-400 text-[10px] font-mono uppercase tracking-widest">Live</span>
      </div>

      <div className="w-px h-3 bg-zinc-800 shrink-0" />

      {/* Metrics */}
      {metrics.map((metric, i) => (
        <div key={i} className="flex items-center gap-1.5 shrink-0">
          <span className="text-zinc-600 text-[10px] font-mono">{metric.label}:</span>
          <span className="text-zinc-300 text-[10px] font-mono tabular-nums">{metric.value}</span>
          {i < metrics.length - 1 && (
            <span className="ml-3 text-zinc-800 font-mono text-[10px]">·</span>
          )}
        </div>
      ))}

      <div className="ml-auto shrink-0">
        <span className="text-zinc-700 text-[9px] font-mono tracking-wider">SPORTS MARKET OS v1.0</span>
      </div>
    </div>
  );
}
