import Link from "next/link";
import Sparkline from "@/components/Sparkline";
import TradeLiveButton from "@/components/TradeLiveButton";

export type SignalTag = "Free" | "Premium" | "Creator" | "API";

export interface SignalCardData {
  sport: string;
  timestamp: string;
  title: string;
  description: string;
  confidence: number;
  tag: SignalTag;
  type: string;
  // Sprint 2
  movement?: string;
  direction?: "up" | "down" | "flat";
  aiScore?: number;
  exchange?: string;
  sparkData?: number[];
}

const sportColors: Record<string, string> = {
  "Horse Racing": "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Tennis: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  NBA: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  NFL: "text-red-400 bg-red-400/10 border-red-400/20",
  UFC: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  Football: "text-zinc-300 bg-zinc-300/10 border-zinc-300/20",
  "Prediction Markets": "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

const tagStyles: Record<SignalTag, string> = {
  Free: "text-zinc-300 bg-zinc-800 border-zinc-700",
  Premium: "text-amber-300 bg-amber-400/10 border-amber-400/20",
  Creator: "text-purple-300 bg-purple-400/10 border-purple-400/20",
  API: "text-blue-300 bg-blue-400/10 border-blue-400/20",
};

function ConfidenceBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-0.5 flex-1 bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full bg-zinc-400 rounded-full" style={{ width: `${value}%` }} />
      </div>
      <span className="text-zinc-500 text-[10px] font-mono tabular-nums">{value}%</span>
    </div>
  );
}

function Arrow({ direction }: { direction?: "up" | "down" | "flat" }) {
  if (direction === "up") return <span className="text-emerald-400 text-[10px]">↑</span>;
  if (direction === "down") return <span className="text-red-400 text-[10px]">↓</span>;
  return <span className="text-zinc-600 text-[10px]">→</span>;
}

export default function SignalCard({
  sport,
  timestamp,
  title,
  description,
  confidence,
  tag,
  type,
  movement,
  direction = "flat",
  aiScore,
  exchange,
  sparkData,
}: SignalCardData) {
  const sportStyle =
    sportColors[sport] ?? "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
  const tagStyle = tagStyles[tag];
  const movColor =
    direction === "up"
      ? "text-emerald-400"
      : direction === "down"
      ? "text-red-400"
      : "text-zinc-500";

  return (
    <div className="group relative bg-zinc-950 border border-zinc-800/80 rounded-sm p-4 hover:border-zinc-700 transition-colors duration-200">
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-[10px] font-semibold font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm border ${sportStyle}`}
          >
            {sport}
          </span>
          <span className="text-zinc-600 text-[10px] font-mono">{type}</span>
          {exchange && (
            <span className="text-zinc-700 text-[9px] font-mono border border-zinc-800 px-1.5 py-0.5 rounded-sm">
              {exchange}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`text-[10px] font-mono px-1.5 py-0.5 rounded-sm border ${tagStyle}`}
          >
            {tag}
          </span>
          <span className="text-zinc-600 text-[10px] font-mono">{timestamp}</span>
        </div>
      </div>

      {/* Title row with sparkline */}
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <h3 className="text-white text-sm font-semibold leading-snug flex-1">{title}</h3>
        {sparkData && sparkData.length >= 2 && (
          <div className="shrink-0 mt-0.5">
            <Sparkline data={sparkData} width={52} height={20} />
          </div>
        )}
      </div>

      <p className="text-zinc-400 text-xs leading-relaxed mb-3">{description}</p>

      {/* Meta row */}
      {(movement || aiScore !== undefined) && (
        <div className="flex items-center gap-3 mb-3">
          {movement && (
            <div className="flex items-center gap-1">
              <Arrow direction={direction} />
              <span className={`text-[10px] font-mono tabular-nums ${movColor}`}>
                {movement}
              </span>
            </div>
          )}
          {aiScore !== undefined && (
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-700 text-[9px] font-mono">AI</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-1 h-2 rounded-sm ${
                      i < Math.round(aiScore / 20)
                        ? "bg-zinc-300"
                        : "bg-zinc-800"
                    }`}
                  />
                ))}
              </div>
              <span className="text-zinc-500 text-[9px] font-mono tabular-nums">{aiScore}</span>
            </div>
          )}
        </div>
      )}

      {/* Confidence */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-zinc-700 text-[9px] font-mono uppercase tracking-wider">
            Confidence
          </span>
        </div>
        <ConfidenceBar value={confidence} />
      </div>

      {/* Watermark + export + betfair routing */}
      <div className="mt-3 pt-2.5 border-t border-zinc-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TradeLiveButton
            sport={sport}
            variant="signal"
            source="signal_card"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-emerald-500/40 pulse-dot" />
          <Link
            href={`/export-studio?sport=${encodeURIComponent(sport)}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&movement=${encodeURIComponent(movement ?? "")}&direction=${direction}&confidence=${confidence}&exchange=${encodeURIComponent(exchange ?? "")}&type=${encodeURIComponent(type)}`}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-mono text-zinc-600 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-600 px-1.5 py-0.5 rounded-sm"
          >
            Export →
          </Link>
        </div>
      </div>
    </div>
  );
}
