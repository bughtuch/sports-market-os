import Link from "next/link";
import Sparkline from "@/components/Sparkline";

interface SharedSignal {
  title: string;
  sport: string;
  shares: number;
  reach: string;
  aiScore: number;
  sparkData: number[];
  direction: "up" | "down" | "flat";
  accentHex: string;
  accentClass: string;
}

const mostShared: SharedSignal[] = [
  {
    title: "Sharp Money — Ascot 2.40",
    sport: "Horse Racing",
    shares: 342,
    reach: "84K",
    aiScore: 87,
    sparkData: [28, 31, 35, 32, 39, 37, 43, 41, 48, 46, 52, 58],
    direction: "up",
    accentHex: "#f59e0b",
    accentClass: "text-amber-400",
  },
  {
    title: "Volatility Spike — Djokovic",
    sport: "Tennis",
    shares: 218,
    reach: "62K",
    aiScore: 74,
    sparkData: [40, 42, 38, 45, 41, 50, 47, 55, 52, 60, 57, 66],
    direction: "up",
    accentHex: "#10b981",
    accentClass: "text-emerald-400",
  },
  {
    title: "AI Market Thesis — Warriors",
    sport: "NBA",
    shares: 184,
    reach: "48K",
    aiScore: 81,
    sparkData: [60, 58, 62, 55, 59, 52, 56, 49, 53, 47, 50, 44],
    direction: "down",
    accentHex: "#3b82f6",
    accentClass: "text-blue-400",
  },
  {
    title: "Queue Health — Cheltenham",
    sport: "Horse Racing",
    shares: 156,
    reach: "41K",
    aiScore: 92,
    sparkData: [70, 68, 72, 65, 69, 62, 66, 59, 63, 56, 60, 54],
    direction: "down",
    accentHex: "#f59e0b",
    accentClass: "text-amber-400",
  },
  {
    title: "Prediction Volume Surge",
    sport: "Prediction",
    shares: 124,
    reach: "38K",
    aiScore: 78,
    sparkData: [15, 18, 22, 19, 26, 23, 30, 27, 35, 32, 40, 46],
    direction: "up",
    accentHex: "#a855f7",
    accentClass: "text-purple-400",
  },
];

function Arrow({ direction }: { direction: "up" | "down" | "flat" }) {
  if (direction === "up") return <span className="text-emerald-400 text-[9px]">↑</span>;
  if (direction === "down") return <span className="text-red-400 text-[9px]">↓</span>;
  return <span className="text-zinc-600 text-[9px]">→</span>;
}

export default function MostSharedSignals() {
  return (
    <div className="px-4 pb-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
          Most Shared Signals
        </span>
        <div className="flex-1 h-px bg-zinc-900" />
        <Link
          href="/creator-studio"
          className="text-zinc-600 text-[9px] font-mono hover:text-zinc-400 transition-colors"
        >
          Creator Studio →
        </Link>
      </div>

      <div className="space-y-0 divide-y divide-zinc-900/60">
        {mostShared.map((signal, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-2 hover:bg-zinc-900/30 transition-colors px-1 -mx-1 cursor-pointer group"
          >
            {/* Rank */}
            <span className="text-zinc-700 text-[9px] font-mono tabular-nums w-3 shrink-0">
              {i + 1}
            </span>

            {/* Sport dot */}
            <span
              className="w-1 h-1 rounded-full shrink-0"
              style={{ backgroundColor: signal.accentHex }}
            />

            {/* Title */}
            <span className="text-zinc-300 text-[10px] flex-1 min-w-0 truncate group-hover:text-white transition-colors">
              {signal.title}
            </span>

            {/* Sparkline */}
            <Sparkline
              data={signal.sparkData}
              width={32}
              height={12}
              colorOverride={signal.accentHex}
              className="shrink-0"
            />

            {/* Direction */}
            <Arrow direction={signal.direction} />

            {/* Shares */}
            <div className="text-right shrink-0 w-14">
              <span className="text-zinc-400 text-[9px] font-mono tabular-nums">
                {signal.shares}
              </span>
              <span className="text-zinc-700 text-[8px] font-mono ml-0.5">shr</span>
            </div>

            {/* Reach */}
            <div className="text-right shrink-0 w-8">
              <span className="text-zinc-500 text-[9px] font-mono tabular-nums">
                {signal.reach}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
