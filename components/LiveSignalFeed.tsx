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
          <span className="text-zinc-700 text-[9px] font-mono animate-pulse">fetching…</span>
        ) : (
          <span className="text-zinc-700 text-[9px] font-mono">{signals.length} signals</span>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {signals.map((signal) => (
          <div key={signal.id} className="relative">
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
    </div>
  );
}
