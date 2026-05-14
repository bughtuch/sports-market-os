"use client";

import { useLiveMarketData } from "@/hooks/useLiveMarketData";
import SignalCard from "@/components/SignalCard";
import SaveToWatchlistButton from "@/components/SaveToWatchlistButton";
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
    <div className="bg-zinc-950 border border-zinc-800/80 rounded-sm p-4 space-y-3">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="skeleton h-4 w-20 rounded-sm" />
          <div className="skeleton h-3 w-14 rounded-sm" />
        </div>
        <div className="skeleton h-4 w-12 rounded-sm" />
      </div>
      {/* Title */}
      <div className="skeleton h-4 w-3/4 rounded-sm" />
      {/* Description lines */}
      <div className="space-y-1.5">
        <div className="skeleton h-3 w-full rounded-sm" />
        <div className="skeleton h-3 w-5/6 rounded-sm" />
        <div className="skeleton h-3 w-2/3 rounded-sm" />
      </div>
      {/* Confidence bar */}
      <div className="skeleton h-1.5 w-full rounded-full mt-2" />
      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
        <div className="skeleton h-3 w-32 rounded-sm" />
        <div className="skeleton h-3 w-10 rounded-sm" />
      </div>
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
          ? Array.from({ length: 4 }).map((_, i) => (
              <SignalCardSkeleton key={i} />
            ))
          : signals.map((signal) => (
              <div key={signal.id} className="relative feed-enter">
                <SignalCard {...toSignalCardProps(signal)} />
                <div className="absolute bottom-[14px] right-[14px]">
                  <SaveToWatchlistButton
                    sport={signal.sport}
                    marketName={signal.title}
                    marketType={signal.type}
                    source={signal.exchange}
                  />
                </div>
              </div>
            ))}
      </div>

      {/* Empty state — when not loading but no signals */}
      {!loading && signals.length === 0 && (
        <div className="border border-zinc-800/60 rounded-sm p-8 text-center bg-zinc-950">
          <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-2">
            No signals detected
          </p>
          <p className="text-zinc-700 text-xs leading-relaxed max-w-xs mx-auto">
            Market intelligence feeds are initialising. Signal data will appear as market structure events are detected.
          </p>
        </div>
      )}
    </div>
  );
}
