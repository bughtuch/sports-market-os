import Sparkline from "@/components/Sparkline";

export interface PulseCardData {
  title: string;
  sport: string;
  value: string;
  change: string;
  direction: "up" | "down" | "flat";
  sparkData: number[];
  timestamp: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
}

function Arrow({ direction }: { direction: "up" | "down" | "flat" }) {
  if (direction === "up") return <span className="text-emerald-400 text-[10px] leading-none">↑</span>;
  if (direction === "down") return <span className="text-red-400 text-[10px] leading-none">↓</span>;
  return <span className="text-zinc-500 text-[10px] leading-none">→</span>;
}

export default function PulseCard({
  title,
  sport,
  value,
  change,
  direction,
  sparkData,
  timestamp,
  accentColor,
  accentBg,
  accentBorder,
}: PulseCardData) {
  const changeColor =
    direction === "up"
      ? "text-emerald-400"
      : direction === "down"
      ? "text-red-400"
      : "text-zinc-500";

  return (
    <div className="bg-zinc-950 border border-zinc-800/80 rounded-sm p-3 hover:border-zinc-700 transition-colors group">
      {/* Header row */}
      <div className="flex items-start justify-between mb-2">
        <div className="space-y-1">
          <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">{title}</p>
          <span
            className={`inline-block text-[9px] font-mono font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-sm border ${accentColor} ${accentBg} ${accentBorder}`}
          >
            {sport}
          </span>
        </div>
        <Sparkline data={sparkData} width={52} height={22} />
      </div>

      {/* Value row */}
      <div className="flex items-end justify-between mt-3">
        <div>
          <p className="text-white text-sm font-semibold leading-none tabular-nums">{value}</p>
          <div className="flex items-center gap-1 mt-1">
            <Arrow direction={direction} />
            <span className={`text-[10px] font-mono tabular-nums ${changeColor}`}>{change}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot" />
          <span className="text-zinc-700 text-[9px] font-mono">{timestamp}</span>
        </div>
      </div>
    </div>
  );
}
