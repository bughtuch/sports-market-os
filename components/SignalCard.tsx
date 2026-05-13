export type SignalTag = "Free" | "Premium" | "Creator" | "API";

export interface SignalCardData {
  sport: string;
  timestamp: string;
  title: string;
  description: string;
  confidence: number;
  tag: SignalTag;
  type: string;
}

const sportColors: Record<string, string> = {
  "Horse Racing": "text-amber-400 bg-amber-400/10 border-amber-400/20",
  "Tennis": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  "NBA": "text-blue-400 bg-blue-400/10 border-blue-400/20",
  "NFL": "text-red-400 bg-red-400/10 border-red-400/20",
  "UFC": "text-orange-400 bg-orange-400/10 border-orange-400/20",
  "Football": "text-zinc-300 bg-zinc-300/10 border-zinc-300/20",
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
        <div
          className="h-full bg-zinc-400 rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-zinc-500 text-xs font-mono tabular-nums">{value}%</span>
    </div>
  );
}

export default function SignalCard({
  sport,
  timestamp,
  title,
  description,
  confidence,
  tag,
  type,
}: SignalCardData) {
  const sportStyle = sportColors[sport] ?? "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
  const tagStyle = tagStyles[tag];

  return (
    <div className="group relative bg-zinc-950 border border-zinc-800/80 rounded-sm p-4 hover:border-zinc-700 transition-colors duration-200">
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-semibold font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm border ${sportStyle}`}>
            {sport}
          </span>
          <span className="text-zinc-600 text-[10px] font-mono">{type}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-sm border ${tagStyle}`}>
            {tag}
          </span>
          <span className="text-zinc-600 text-[10px] font-mono">{timestamp}</span>
        </div>
      </div>

      {/* Content */}
      <h3 className="text-white text-sm font-semibold leading-snug mb-1.5">{title}</h3>
      <p className="text-zinc-400 text-xs leading-relaxed mb-4">{description}</p>

      {/* Bottom row */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-zinc-600 text-[10px] font-mono uppercase tracking-wider">Confidence</span>
        </div>
        <ConfidenceBar value={confidence} />
      </div>

      {/* Watermark */}
      <div className="mt-3 pt-3 border-t border-zinc-900 text-[9px] text-zinc-700 font-mono tracking-wider">
        Powered by Sports Market OS
      </div>
    </div>
  );
}
