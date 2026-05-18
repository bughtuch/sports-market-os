/**
 * TheEdge — AI analyst narrative block for a sport hub page.
 * Renders the Claude-generated sport brief in editorial typography.
 *
 * Server component — receives pre-generated narrative as a prop.
 */

interface Props {
  narrative: string;
  sportLabel: string;
  signalCount: number;
  highConfCount: number;
  avgConfidence: number | null;
  windowLabel?: string; // e.g. "30 days"
}

export default function TheEdge({
  narrative,
  sportLabel,
  signalCount,
  highConfCount,
  avgConfidence,
  windowLabel = "30 days",
}: Props) {
  return (
    <div className="border border-zinc-800/60 rounded-sm p-6 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-500 mb-1">
            {sportLabel} · AI Analyst
          </p>
          <p className="text-[11px] font-mono text-zinc-700">
            Last {windowLabel} · Haiku 4.5 · Cached 5 min
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 pulse-dot" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">
            Live
          </span>
        </div>
      </div>

      {/* Narrative */}
      <p className="font-serif text-white text-[17px] leading-[1.7] mb-6">
        {narrative}
      </p>

      {/* Stats footer */}
      <div className="pt-4 border-t border-zinc-900 flex flex-wrap gap-x-6 gap-y-1">
        <span className="text-[12px] font-mono text-zinc-600 uppercase tracking-[0.1em]">
          Signals {signalCount}
        </span>
        <span className="text-[12px] font-mono text-zinc-800">·</span>
        <span className="text-[12px] font-mono text-zinc-600 uppercase tracking-[0.1em]">
          High-conf {highConfCount}
        </span>
        {avgConfidence !== null && (
          <>
            <span className="text-[12px] font-mono text-zinc-800">·</span>
            <span className="text-[12px] font-mono text-zinc-600 uppercase tracking-[0.1em]">
              Avg {avgConfidence}%
            </span>
          </>
        )}
      </div>
    </div>
  );
}
