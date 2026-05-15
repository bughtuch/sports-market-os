import Link from "next/link";

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

const tagStyles: Record<SignalTag, string> = {
  Free:    "text-zinc-500 border-zinc-800",
  Premium: "text-amber-500/70 border-amber-400/20",
  Creator: "text-purple-400/70 border-purple-400/20",
  API:     "text-blue-400/70 border-blue-400/20",
};

export default function SignalCard({
  sport,
  timestamp,
  title,
  description,
  confidence,
  tag,
  type,
  exchange,
}: SignalCardData) {
  const tagStyle = tagStyles[tag];

  // Compose the mono header: VENUE · TYPE · EXCHANGE
  const venue = sport.toUpperCase();
  const header = [venue, type.toUpperCase(), exchange?.toUpperCase()].filter(Boolean).join(" · ");

  return (
    <div className="group bg-zinc-950 border border-zinc-900 rounded-[8px] p-4 hover:border-zinc-800 transition-[border-color] duration-[200ms] ease-[cubic-bezier(0.2,0,0,1)]">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest leading-none">
          {header}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[9px] font-mono border px-1.5 py-0.5 rounded-[4px] ${tagStyle}`}>
            {tag}
          </span>
          <span className="text-zinc-700 text-[9px] font-mono tabular-nums">{timestamp}</span>
        </div>
      </div>

      {/* Signal text */}
      <p className="text-white text-xs font-semibold leading-snug mb-1.5">{title}</p>
      <p className="text-zinc-400 text-[11px] leading-relaxed mb-4">{description}</p>

      {/* Confidence + decay + evidence */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="h-px flex-1 bg-zinc-900 overflow-hidden rounded-full">
            <div
              className="h-full rounded-full"
              style={{ width: `${confidence}%`, backgroundColor: "var(--accent)" }}
            />
          </div>
          <span className="text-[10px] font-mono font-semibold tabular-nums shrink-0" style={{ color: "var(--accent)" }}>
            {confidence}%
          </span>
        </div>
        <Link
          href={`/export-studio?sport=${encodeURIComponent(sport)}&title=${encodeURIComponent(title)}&confidence=${confidence}&exchange=${encodeURIComponent(exchange ?? "")}&type=${encodeURIComponent(type)}`}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-[200ms] text-[9px] font-mono text-zinc-600 hover:text-zinc-300"
        >
          evidence →
        </Link>
      </div>
    </div>
  );
}
