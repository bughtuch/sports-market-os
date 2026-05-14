import Link from "next/link";
import { generateDailyBrief } from "@/lib/briefs/dailyBriefGenerator";
import { BRIEF_TYPE_LABELS } from "@/lib/briefs/briefTypes";

/**
 * DailyBriefWidget — compact brief panel for terminal, account, and creator studio.
 *
 * Server component — calls generateDailyBrief() directly.
 * Renders a single-section summary with top signals and a link to /daily-brief.
 */
export default function DailyBriefWidget() {
  const brief = generateDailyBrief();
  const label = BRIEF_TYPE_LABELS[brief.type];
  const summary = brief.sections.find(s => s.type === "summary");

  return (
    <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-900/60">
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot" />
          <span className="text-zinc-400 text-[9px] font-mono uppercase tracking-widest">
            {label}
          </span>
        </div>
        <Link
          href="/daily-brief"
          className="text-zinc-600 text-[9px] font-mono hover:text-zinc-400 transition-colors"
        >
          Full brief →
        </Link>
      </div>

      {/* Summary body */}
      <div className="px-4 py-3">
        {summary && (
          <p className="text-zinc-400 text-[10px] leading-relaxed mb-3">
            {summary.body}
          </p>
        )}

        {/* Top signals */}
        <div className="space-y-1">
          {brief.topSignalTitles.slice(0, 3).map((title, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-zinc-700 text-[9px] font-mono mt-0.5 shrink-0">{i + 1}.</span>
              <span className="text-zinc-300 text-[10px] leading-tight">{title}</span>
            </div>
          ))}
        </div>

        {/* Catalysts row */}
        {brief.catalysts.length > 0 && (
          <div className="mt-3 pt-2 border-t border-zinc-900/60">
            <p className="text-zinc-700 text-[8px] font-mono uppercase tracking-wider mb-1.5">
              Active Catalysts
            </p>
            <div className="flex flex-wrap gap-1.5">
              {brief.catalysts.slice(0, 2).map((c, i) => (
                <span
                  key={i}
                  className="text-amber-400/70 text-[9px] font-mono bg-amber-400/5 border border-amber-400/15 rounded-sm px-1.5 py-0.5 truncate max-w-[200px]"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI regime footer */}
      <div className="px-4 py-2 border-t border-zinc-900/60 bg-black/20">
        <p className="text-zinc-600 text-[9px] font-mono leading-tight line-clamp-1">
          {brief.aiRegimeSummary.split(".")[0]}.
        </p>
      </div>
    </div>
  );
}
