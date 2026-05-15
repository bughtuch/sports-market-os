import Link from "next/link";

export default function DailyBriefWidget() {
  return (
    <div className="border border-zinc-900 rounded-[8px] overflow-hidden">
      <div className="px-6 py-6">
        <p className="font-serif text-zinc-200 text-base leading-[1.75]">
          Overnight flow ran 18% below the 30-day baseline. Three structural signals queued for the
          morning window. The strongest is Cheltenham 15:15 — bilateral queue thinning, 14th
          percentile depth, configuration consistent with a stewards&apos; window opening inside the
          next 22 minutes. Polymarket&apos;s US presidential contract continues to drift from polling
          by 6.8 points, the widest gap of the week. Tennis is compressed. NFL totals are
          compressed. The market is waiting on something the public has not seen.
        </p>
      </div>
      <div className="px-6 py-3 border-t border-zinc-900/60 flex justify-end">
        <Link
          href="/terminal"
          className="text-[10px] font-mono text-zinc-600 hover:text-white transition-colors duration-[200ms]"
        >
          View all signals →
        </Link>
      </div>
    </div>
  );
}
