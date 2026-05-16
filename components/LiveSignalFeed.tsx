"use client";

import { useLiveMarketData } from "@/hooks/useLiveMarketData";
import SignalCard from "@/components/SignalCard";
import type { MarketSignal } from "@/lib/providers/types";

function toSignalCardProps(s: MarketSignal) {
  return {
    sport: s.sport,
    timestamp: s.timestamp,
    title: s.title,
    description: s.description,
    confidence: s.confidence,
    tag: s.tag,
    type: s.type,
    movement: s.movement,
    direction: s.direction,
    aiScore: s.aiScore,
    exchange: s.exchange,
    sparkData: s.sparkData,
  };
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SignalCardSkeleton() {
  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-[8px] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="skeleton h-3 w-40 rounded-sm" />
        <div className="skeleton h-3 w-10 rounded-sm" />
      </div>
      <div className="skeleton h-4 w-3/4 rounded-sm" />
      <div className="space-y-1.5">
        <div className="skeleton h-3 w-full rounded-sm" />
        <div className="skeleton h-3 w-5/6 rounded-sm" />
        <div className="skeleton h-3 w-2/3 rounded-sm" />
      </div>
      <div className="skeleton h-px w-full rounded-full mt-2" />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LiveSignalFeed() {
  const { signals, loading, usingFallback } = useLiveMarketData();

  return (
    <div>
      {/* Feed meta row */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
          Signal Feed
        </span>
        <div className="flex-1 h-px bg-zinc-900" />
        {usingFallback ? (
          <span className="text-zinc-700 text-[9px] font-mono">cached data</span>
        ) : loading ? (
          <span className="text-zinc-700 text-[9px] font-mono">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-700 animate-pulse mr-1" />
            scanning markets
          </span>
        ) : (
          <span className="text-zinc-700 text-[9px] font-mono">{signals.length} signals</span>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SignalCardSkeleton key={i} />)
          : signals.map((signal) => (
              <div key={signal.id} className="feed-enter">
                <SignalCard {...toSignalCardProps(signal)} />
              </div>
            ))}
      </div>

      {!loading && signals.length === 0 && (
        <div className="bg-zinc-950 border border-zinc-900 rounded-[8px] p-8 text-center">
          <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-2">
            NO SIGNALS · MARKETS QUIET
          </p>
          <p className="text-zinc-500 text-xs leading-relaxed max-w-xs mx-auto">
            No signals at &gt;70% confidence in the last 4 hours. The engine is running. Check back in 15 minutes.
          </p>
        </div>
      )}
    </div>
  );
}
