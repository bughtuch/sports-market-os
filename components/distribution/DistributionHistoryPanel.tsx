"use client";

/**
 * DistributionHistoryPanel — recent queue activity with engagement placeholders.
 *
 * Reads from localStorage queue. Shows latest posts across all statuses.
 */

import { useEffect, useState } from "react";
import { getQueue, seedQueueIfEmpty } from "@/lib/distribution/distributionQueue";
import type { DistributionPost } from "@/lib/distribution/distributionTypes";
import { PLATFORM_LABELS } from "@/lib/distribution/distributionTypes";

const STATUS_STYLES: Record<string, string> = {
  queued:    "text-blue-400 bg-blue-400/10 border-blue-400/20",
  scheduled: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  posted:    "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  failed:    "text-red-400 bg-red-400/10 border-red-400/20",
  draft:     "text-zinc-400 bg-zinc-800 border-zinc-700",
};

function formatReach(n?: number): string {
  if (!n) return "—";
  return n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n);
}

function formatImpressions(n?: number): string {
  if (!n) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function DistributionHistoryPanel() {
  const [posts, setPosts] = useState<DistributionPost[]>([]);

  useEffect(() => {
    seedQueueIfEmpty();
    const all = getQueue();
    setPosts(
      all
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 12)
    );
  }, []);

  if (posts.length === 0) {
    return (
      <div className="border border-zinc-800/60 rounded-sm p-8 text-center bg-zinc-950">
        <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-2">No activity yet</p>
        <p className="text-zinc-700 text-xs leading-relaxed max-w-xs mx-auto">
          Queue a post from the signal feed or Export Studio to see it here.
        </p>
      </div>
    );
  }

  // Totals for posted items
  const totalImpressions = posts
    .filter(p => p.status === "posted")
    .reduce((s, p) => s + (p.engagementEstimate?.estimatedImpressions ?? 0), 0);

  const queuedReach = posts
    .filter(p => p.status === "queued" || p.status === "scheduled")
    .reduce((s, p) => s + (p.engagementEstimate?.estimatedReach ?? 0), 0);

  return (
    <div>
      {/* Aggregate metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Posts",         value: posts.filter(p => p.status === "posted").length,    color: "text-emerald-400" },
          { label: "Queued",              value: posts.filter(p => p.status === "queued").length,    color: "text-blue-400" },
          { label: "Est. Impressions",    value: formatImpressions(totalImpressions),                color: "text-white" },
          { label: "Queued Reach",        value: formatReach(queuedReach),                           color: "text-amber-400" },
        ].map(m => (
          <div key={m.label} className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-3">
            <p className="text-zinc-700 text-[8px] font-mono uppercase tracking-wider mb-1">{m.label}</p>
            <p className={`text-base font-semibold font-mono tabular-nums ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Activity list */}
      <div className="space-y-2">
        {posts.map(post => (
          <div
            key={post.id}
            className="bg-zinc-950 border border-zinc-800/60 rounded-sm px-3.5 py-3 flex items-center gap-3"
          >
            {/* Status */}
            <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-sm border shrink-0 ${STATUS_STYLES[post.status]}`}>
              {post.status}
            </span>

            {/* Platform */}
            <span className="text-zinc-500 text-[9px] font-mono shrink-0 w-24 truncate">
              {PLATFORM_LABELS[post.platform]}
            </span>

            {/* Content preview */}
            <span className="text-zinc-400 text-[10px] flex-1 truncate min-w-0">
              {post.content.slice(0, 80).replace(/\n/g, " ")}
            </span>

            {/* Reach */}
            <span className="text-zinc-700 text-[9px] font-mono shrink-0 tabular-nums">
              {formatReach(post.engagementEstimate?.estimatedReach)} reach
            </span>

            {/* Time */}
            <span className="text-zinc-700 text-[9px] font-mono shrink-0">
              {timeAgo(post.createdAt)}
            </span>
          </div>
        ))}
      </div>

      <p className="text-zinc-800 text-[9px] font-mono mt-4">
        Engagement estimates are projections only — not connected to real analytics.
      </p>
    </div>
  );
}
