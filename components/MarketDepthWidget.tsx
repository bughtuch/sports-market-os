interface DepthModule {
  label: string;
  value: string;
  subtext: string;
  level: number; // 0–100 for bar/fill
  trend: "up" | "down" | "neutral";
  accent: string;
  type: "bar" | "heatgrid" | "score";
}

const modules: DepthModule[] = [
  {
    label: "Volatility Index",
    value: "0.74",
    subtext: "Above 30d avg",
    level: 74,
    trend: "up",
    accent: "bg-red-400",
    type: "bar",
  },
  {
    label: "Exchange Flow",
    value: "68% Buy",
    subtext: "Betfair / Smarkets",
    level: 68,
    trend: "up",
    accent: "bg-emerald-400",
    type: "bar",
  },
  {
    label: "Queue Health",
    value: "NOMINAL",
    subtext: "3 warnings active",
    level: 78,
    trend: "neutral",
    accent: "bg-amber-400",
    type: "score",
  },
  {
    label: "Market Consensus",
    value: "62%",
    subtext: "Sharp alignment",
    level: 62,
    trend: "neutral",
    accent: "bg-blue-400",
    type: "bar",
  },
  {
    label: "Sharp/Public Split",
    value: "+14.2pts",
    subtext: "Sharp leading",
    level: 70,
    trend: "up",
    accent: "bg-purple-400",
    type: "bar",
  },
  {
    label: "AI Confidence",
    value: "81%",
    subtext: "High signal quality",
    level: 81,
    trend: "up",
    accent: "bg-zinc-300",
    type: "score",
  },
];

function TrendArrow({ trend }: { trend: "up" | "down" | "neutral" }) {
  if (trend === "up") return <span className="text-emerald-400 text-[9px]">↑</span>;
  if (trend === "down") return <span className="text-red-400 text-[9px]">↓</span>;
  return <span className="text-zinc-600 text-[9px]">—</span>;
}

function DepthBar({ level, accent }: { level: number; accent: string }) {
  return (
    <div className="h-0.5 w-full bg-zinc-800 rounded-full overflow-hidden mt-2">
      <div
        className={`h-full rounded-full ${accent}`}
        style={{ width: `${level}%`, opacity: 0.7 }}
      />
    </div>
  );
}

function HeatGrid({ level }: { level: number }) {
  const cells = Array.from({ length: 12 });
  return (
    <div className="grid grid-cols-6 gap-0.5 mt-2">
      {cells.map((_, i) => {
        const threshold = (i / cells.length) * 100;
        const active = threshold <= level;
        return (
          <div
            key={i}
            className={`h-1 rounded-sm ${active ? "bg-amber-400/60" : "bg-zinc-800"}`}
          />
        );
      })}
    </div>
  );
}

export default function MarketDepthWidget() {
  return (
    <div className="px-4 pb-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Market Depth</span>
        <div className="flex-1 h-px bg-zinc-900" />
        <span className="text-zinc-700 text-[9px] font-mono">6 MODULES</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {modules.map((mod) => (
          <div
            key={mod.label}
            className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-2.5 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-zinc-600 text-[9px] font-mono uppercase tracking-wider leading-tight">
                {mod.label}
              </span>
              <TrendArrow trend={mod.trend} />
            </div>
            <p className="text-white text-xs font-semibold tabular-nums leading-none">{mod.value}</p>
            <p className="text-zinc-700 text-[9px] font-mono mt-0.5 leading-tight">{mod.subtext}</p>
            {mod.type === "heatgrid" ? (
              <HeatGrid level={mod.level} />
            ) : (
              <DepthBar level={mod.level} accent={mod.accent} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
