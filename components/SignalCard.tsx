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

export default function SignalCard({
  sport,
  timestamp,
  title,
  description,
  confidence,
  type,
  exchange,
}: SignalCardData) {
  // Compose the mono header: VENUE · TYPE · EXCHANGE
  const venue = sport.toUpperCase();
  const header = [venue, type.toUpperCase(), exchange?.toUpperCase()].filter(Boolean).join(" · ");

  return (
    <div className="group bg-zinc-950 border border-zinc-900 rounded-[8px] p-4 hover:border-zinc-800 transition-[border-color] duration-[200ms] ease-[cubic-bezier(0.2,0,0,1)]">
      {/* Header row — venue/type/exchange left, timestamp right */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest leading-none">
          {header}
        </span>
        <span className="text-zinc-700 text-[9px] font-mono tabular-nums shrink-0">{timestamp}</span>
      </div>

      {/* Signal text */}
      <p className="text-white text-xs font-semibold leading-snug mb-1.5">{title}</p>
      <p className="text-zinc-400 text-[11px] leading-relaxed mb-4">{description}</p>

      {/* Confidence bar */}
      <div className="flex items-center gap-2 mb-3">
        <div className="h-px flex-1 bg-zinc-900 overflow-hidden rounded-full">
          <div
            className="h-full rounded-full"
            style={{ width: `${confidence}%`, backgroundColor: "var(--accent)" }}
          />
        </div>
        <span
          className="text-[10px] font-mono font-semibold tabular-nums shrink-0"
          style={{ color: "var(--accent)" }}
        >
          {confidence}%
        </span>
      </div>

      {/* Footer — evidence link only */}
      <div className="flex justify-end">
        <Link
          href={`/export-studio?sport=${encodeURIComponent(sport)}&title=${encodeURIComponent(title)}&confidence=${confidence}&exchange=${encodeURIComponent(exchange ?? "")}&type=${encodeURIComponent(type)}`}
          className="text-[9px] font-mono hover:underline transition-colors duration-[200ms]"
          style={{ color: "var(--accent)" }}
        >
          evidence →
        </Link>
      </div>
    </div>
  );
}
