"use client";

import { useState, useEffect } from "react";

interface CreatorPost {
  handle: string;
  action: string;
  sport: string;
  time: string;
  accentColor: string;
}

const allPosts: CreatorPost[] = [
  {
    handle: "@SharpFlowAI",
    action: "published NFL divergence signal",
    sport: "NFL",
    time: "just now",
    accentColor: "text-red-400",
  },
  {
    handle: "@LiquidityDesk",
    action: "flagged Ascot queue imbalance",
    sport: "HR",
    time: "1m ago",
    accentColor: "text-amber-400",
  },
  {
    handle: "@MarketPulse",
    action: "posted UFC volatility shift",
    sport: "UFC",
    time: "2m ago",
    accentColor: "text-orange-400",
  },
  {
    handle: "@ExchangeEdge",
    action: "shared NBA sharp movement card",
    sport: "NBA",
    time: "4m ago",
    accentColor: "text-blue-400",
  },
  {
    handle: "@TennisMomentum",
    action: "published Djokovic AI brief",
    sport: "TEN",
    time: "6m ago",
    accentColor: "text-emerald-400",
  },
  {
    handle: "@PredictionDesk",
    action: "flagged election market volume spike",
    sport: "PRED",
    time: "8m ago",
    accentColor: "text-purple-400",
  },
  {
    handle: "@RacingEdgeAI",
    action: "posted Cheltenham queue warning",
    sport: "HR",
    time: "11m ago",
    accentColor: "text-amber-400",
  },
  {
    handle: "@OddsOracle",
    action: "published Football exchange flow brief",
    sport: "FB",
    time: "14m ago",
    accentColor: "text-zinc-400",
  },
];

export default function CreatorFeed() {
  const [startIdx, setStartIdx] = useState(0);
  const visible = 4;

  useEffect(() => {
    const id = setInterval(() => {
      setStartIdx((i) => (i + 1) % allPosts.length);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  const posts = Array.from(
    { length: visible },
    (_, i) => allPosts[(startIdx + i) % allPosts.length]
  );

  return (
    <div className="border-t border-zinc-800/60 bg-zinc-950">
      {/* Header */}
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-purple-400 pulse-dot" />
          <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">Creator Network</span>
        </div>
        <span className="text-zinc-700 text-[9px] font-mono">LIVE</span>
      </div>

      {/* Posts */}
      <div className="divide-y divide-zinc-800/30">
        {posts.map((post, i) => (
          <div
            key={`${post.handle}-${i}`}
            className="px-4 py-2 hover:bg-zinc-900/40 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-2">
              <span className={`text-[10px] font-mono font-semibold shrink-0 ${post.accentColor}`}>
                {post.handle}
              </span>
            </div>
            <p className="text-zinc-500 text-[10px] leading-snug mt-0.5">{post.action}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-zinc-700 text-[8px] font-mono">{post.sport}</span>
              <span className="text-zinc-800 text-[8px]">·</span>
              <span className="text-zinc-700 text-[8px] font-mono">{post.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
