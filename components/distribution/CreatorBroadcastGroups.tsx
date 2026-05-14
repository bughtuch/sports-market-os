"use client";

/**
 * CreatorBroadcastGroups — mock creator network broadcast targets.
 *
 * Shows creator group roster with est. reach and platform mix.
 * No real posting — queue integration only.
 */

import { useState } from "react";
import { queuePost } from "@/lib/distribution/distributionQueue";
import { telegramTemplate } from "@/lib/distribution/distributionTemplates";
import type { BroadcastGroup } from "@/lib/distribution/distributionTypes";

const GROUPS: BroadcastGroup[] = [
  {
    id: "horse-racing",
    name: "Horse Racing Creators",
    sport: "Horse Racing",
    platforms: ["telegram", "x", "youtube-shorts"],
    creatorCount: 14,
    estReach: 42000,
    activityLevel: "high",
    lastBroadcast: "2h ago",
  },
  {
    id: "tennis-trading",
    name: "Tennis Trading Creators",
    sport: "Tennis",
    platforms: ["telegram", "x", "discord"],
    creatorCount: 9,
    estReach: 28000,
    activityLevel: "high",
    lastBroadcast: "4h ago",
  },
  {
    id: "ufc-markets",
    name: "UFC Market Creators",
    sport: "UFC",
    platforms: ["x", "reddit", "youtube-shorts"],
    creatorCount: 6,
    estReach: 19000,
    activityLevel: "medium",
    lastBroadcast: "1d ago",
  },
  {
    id: "prediction-markets",
    name: "Prediction Market Accounts",
    sport: "Prediction Markets",
    platforms: ["x", "discord", "telegram"],
    creatorCount: 11,
    estReach: 35000,
    activityLevel: "high",
    lastBroadcast: "6h ago",
  },
  {
    id: "nba-betting",
    name: "NBA Betting Creators",
    sport: "NBA",
    platforms: ["x", "youtube-shorts", "tiktok"],
    creatorCount: 8,
    estReach: 31000,
    activityLevel: "medium",
    lastBroadcast: "8h ago",
  },
];

const ACTIVITY_STYLES: Record<BroadcastGroup["activityLevel"], string> = {
  high:   "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  low:    "text-zinc-500 bg-zinc-800 border-zinc-700",
};

const PLATFORM_ICONS: Record<string, string> = {
  "x":              "𝕏",
  "telegram":       "✈",
  "discord":        "◈",
  "reddit":         "○",
  "youtube-shorts": "▶",
  "tiktok":         "♪",
  "instagram":      "◻",
  "email-brief":    "✉",
};

function formatReach(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n);
}

export default function CreatorBroadcastGroups() {
  const [queued, setQueued] = useState<string[]>([]);

  function handleBroadcastToGroup(group: BroadcastGroup) {
    // Queue a mock broadcast to the primary platform for this group
    const content = telegramTemplate({
      sport:       group.sport,
      title:       `${group.sport} intelligence broadcast`,
      description: `Latest market intelligence for the ${group.name} network. AI-detected structural movements across major exchanges.`,
      confidence:  78,
    });
    queuePost({
      platform:         group.platforms[0],
      content,
      distributionType: "creator-broadcast",
      metadata: {
        sport:          group.sport,
        broadcastGroup: group.id,
        tags:           [group.sport.toLowerCase().replace(/\s/g, "-")],
      },
    });
    setQueued(q => [...q, group.id]);
    setTimeout(() => setQueued(q => q.filter(id => id !== group.id)), 3000);
  }

  return (
    <div className="space-y-3">
      {GROUPS.map(group => {
        const isQueued = queued.includes(group.id);
        return (
          <div
            key={group.id}
            className="bg-zinc-950 border border-zinc-800/80 rounded-sm p-4 flex items-center justify-between gap-4"
          >
            {/* Left: info */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white text-[11px] font-mono font-semibold">{group.name}</span>
                <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-sm border ${ACTIVITY_STYLES[group.activityLevel]}`}>
                  {group.activityLevel}
                </span>
              </div>
              <div className="flex items-center gap-3 text-zinc-600 text-[9px] font-mono">
                <span>{group.creatorCount} creators</span>
                <span>est. {formatReach(group.estReach)} reach</span>
                {group.lastBroadcast && <span>last: {group.lastBroadcast}</span>}
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                {group.platforms.map(p => (
                  <span
                    key={p}
                    title={p}
                    className="text-zinc-600 text-[10px] w-5 h-5 flex items-center justify-center border border-zinc-800 rounded-sm"
                  >
                    {PLATFORM_ICONS[p] ?? "•"}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleBroadcastToGroup(group)}
                disabled={isQueued}
                className={`text-[9px] font-mono px-2.5 py-1.5 rounded-sm border transition-colors ${
                  isQueued
                    ? "border-emerald-700 text-emerald-400 bg-emerald-400/5"
                    : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
                }`}
              >
                {isQueued ? "✓ Queued" : "Queue Broadcast"}
              </button>
            </div>
          </div>
        );
      })}

      <p className="text-zinc-800 text-[9px] font-mono pt-1">
        Broadcasts are queued — no real posting until OAuth is configured.
        Market intelligence framing only.
      </p>
    </div>
  );
}
