export default function Watchlist() {
  return (
    <div className="border-t border-zinc-800/60 bg-zinc-950">
      {/* Header */}
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-zinc-700" />
          <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">Active Watchlist</span>
        </div>
        <span className="text-zinc-700 text-[9px] font-mono">0 markets · sign in to track</span>
      </div>

      {/* Empty state */}
      <div className="px-4 py-6">
        <p className="text-zinc-600 text-[11px] leading-relaxed">
          Watchlist activates once you sign in. Track live markets, set confidence thresholds, and receive alerts when signals cross your trigger.
        </p>
      </div>
    </div>
  );
}
