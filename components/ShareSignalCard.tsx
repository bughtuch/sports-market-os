import Sparkline from "@/components/Sparkline";

export interface ShareCardProps {
  sport: string;
  title: string;
  insight: string;
  aiCommentary?: string;
  confidence: number;
  movement: string;
  direction: "up" | "down" | "flat";
  sparkData: number[];
  exchange: string;
  timestamp: string;
  tag: "Free" | "Premium" | "Creator" | "API";
  accentHex: string;
  accentClass: string;
  includeSparkline?: boolean;
  includeWatermark?: boolean;
  includeConfidence?: boolean;
  includeAI?: boolean;
  platform?: string;
}

const tagStyles = {
  Free: "text-zinc-300 border-zinc-600",
  Premium: "text-amber-300 border-amber-500/40",
  Creator: "text-purple-300 border-purple-500/40",
  API: "text-blue-300 border-blue-500/40",
};

function Arrow({ direction }: { direction: "up" | "down" | "flat" }) {
  if (direction === "up") return <span className="text-emerald-400">↑</span>;
  if (direction === "down") return <span className="text-red-400">↓</span>;
  return <span className="text-zinc-500">→</span>;
}

export default function ShareSignalCard({
  sport,
  title,
  insight,
  aiCommentary,
  confidence,
  movement,
  direction,
  sparkData,
  exchange,
  timestamp,
  tag,
  accentHex,
  accentClass,
  includeSparkline = true,
  includeWatermark = true,
  includeConfidence = true,
  includeAI = true,
  platform,
}: ShareCardProps) {
  const movColor =
    direction === "up"
      ? "text-emerald-400"
      : direction === "down"
      ? "text-red-400"
      : "text-zinc-500";

  return (
    <div
      className="bg-zinc-950 border border-zinc-800 overflow-hidden rounded-sm"
      style={{ borderLeftColor: accentHex, borderLeftWidth: "2px" }}
    >
      {/* Header */}
      <div className="px-5 py-3 bg-black border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className={`text-[10px] font-mono font-semibold uppercase tracking-widest ${accentClass}`}
          >
            {sport}
          </span>
          <span className="text-zinc-800">·</span>
          <span
            className={`text-[9px] font-mono px-1.5 py-0.5 border rounded-sm ${tagStyles[tag]}`}
          >
            {tag}
          </span>
          {platform && (
            <>
              <span className="text-zinc-800">·</span>
              <span className="text-zinc-600 text-[9px] font-mono uppercase tracking-wider">
                {platform}
              </span>
            </>
          )}
        </div>
        <span className="text-zinc-600 text-[9px] font-mono tracking-widest">
          SPORTS MARKET OS
        </span>
      </div>

      {/* Main content */}
      <div className="px-5 py-5">
        <h2 className="text-white text-base font-semibold leading-tight tracking-tight mb-3">
          {title}
        </h2>

        <div className="flex items-start gap-4">
          <p className="text-zinc-400 text-xs leading-relaxed flex-1">{insight}</p>
          {includeSparkline && sparkData.length >= 2 && (
            <div className="shrink-0 mt-0.5">
              <Sparkline
                data={sparkData}
                width={64}
                height={28}
                colorOverride={accentHex}
              />
            </div>
          )}
        </div>

        {includeAI && aiCommentary && (
          <div className="mt-4 pt-4 border-t border-zinc-900">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot" />
              <span className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest">
                AI Market Desk
              </span>
            </div>
            <p className="text-zinc-500 text-[11px] leading-relaxed italic">
              &ldquo;{aiCommentary}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="px-5 py-3 border-t border-zinc-900 bg-black/30">
        <div className="flex items-center gap-4">
          {includeConfidence && (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-zinc-700 text-[9px] font-mono shrink-0">CONF</span>
              <div className="flex-1 h-0.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${confidence}%`,
                    backgroundColor: accentHex,
                    opacity: 0.8,
                  }}
                />
              </div>
              <span className="text-zinc-400 text-[10px] font-mono tabular-nums shrink-0">
                {confidence}%
              </span>
            </div>
          )}
          <div className="flex items-center gap-1 shrink-0">
            <Arrow direction={direction} />
            <span className={`text-[10px] font-mono tabular-nums font-semibold ${movColor}`}>
              {movement}
            </span>
          </div>
        </div>
      </div>

      {/* Meta row */}
      <div className="px-5 py-2 border-t border-zinc-900/60 flex items-center justify-between">
        <span className="text-zinc-600 text-[9px] font-mono">
          {exchange} · {timestamp}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-emerald-400/60 pulse-dot" />
          <span className="text-zinc-700 text-[9px] font-mono">LIVE</span>
        </div>
      </div>

      {/* Watermark */}
      {includeWatermark && (
        <div className="px-5 py-2.5 bg-black border-t border-zinc-900 flex items-center justify-between">
          <span className="text-zinc-600 text-[9px] font-mono tracking-wider">
            Powered by Sports Market OS
          </span>
          <span className="text-zinc-700 text-[9px] font-mono">sportsmarket.os</span>
        </div>
      )}
    </div>
  );
}
