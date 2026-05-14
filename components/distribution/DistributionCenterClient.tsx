"use client";

/**
 * DistributionCenterClient — main distribution center UI.
 *
 * Sync mode detection (Sprint 21):
 *   - On mount, probe GET /api/distribution/posts
 *   - If 200: mode="cloud" — posts loaded from Supabase (merged with localStorage)
 *   - If 401/error: mode="local" — localStorage only
 *
 * Mutations always update localStorage for offline resilience.
 * Cloud mutations (create/delete/update) sync via API when in cloud mode.
 */

import { useEffect, useState, useCallback } from "react";
import {
  getQueue,
  removeQueuedPost,
  retryQueuedPost,
  duplicatePost,
  publishDraft,
  seedQueueIfEmpty,
  getQueueStats,
} from "@/lib/distribution/distributionQueue";
import { PLATFORM_LABELS } from "@/lib/distribution/distributionTypes";
import CreatorBroadcastGroups from "./CreatorBroadcastGroups";
import DistributionHistoryPanel from "./DistributionHistoryPanel";
import type { DistributionPost, PostStatus, QueueStats } from "@/lib/distribution/distributionTypes";

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type Tab = "queue" | "scheduled" | "posted" | "failed" | "drafts" | "broadcast" | "analytics";

const TABS: { id: Tab; label: string; statusFilter?: PostStatus }[] = [
  { id: "queue",     label: "Queue",            statusFilter: "queued" },
  { id: "scheduled", label: "Scheduled",        statusFilter: "scheduled" },
  { id: "posted",    label: "Posted",           statusFilter: "posted" },
  { id: "failed",    label: "Failed",           statusFilter: "failed" },
  { id: "drafts",    label: "Drafts",           statusFilter: "draft" },
  { id: "broadcast", label: "Broadcast Groups" },
  { id: "analytics", label: "Analytics" },
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<PostStatus, string> = {
  queued:    "text-blue-400 bg-blue-400/10 border-blue-400/20",
  scheduled: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  posted:    "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  failed:    "text-red-400 bg-red-400/10 border-red-400/20",
  draft:     "text-zinc-400 bg-zinc-800 border-zinc-700",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatReach(n?: number): string {
  if (!n) return "—";
  return n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n);
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

// ─── Post row ─────────────────────────────────────────────────────────────────

function PostRow({
  post,
  onRemove,
  onRetry,
  onDuplicate,
  onPublish,
}: {
  post:        DistributionPost;
  onRemove:    (id: string) => void;
  onRetry:     (id: string) => void;
  onDuplicate: (id: string) => void;
  onPublish:   (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-zinc-950 border border-zinc-800/80 rounded-sm">
      {/* Summary row */}
      <div
        className="flex items-center gap-3 px-3.5 py-3 cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        {/* Status badge */}
        <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-sm border shrink-0 ${STATUS_STYLES[post.status]}`}>
          {post.status}
        </span>

        {/* Platform */}
        <span className="text-zinc-500 text-[9px] font-mono shrink-0 w-24 truncate">
          {PLATFORM_LABELS[post.platform]}
        </span>

        {/* Content preview */}
        <span className="text-zinc-300 text-[10px] flex-1 truncate min-w-0">
          {post.content.slice(0, 90).replace(/\n/g, " ")}
        </span>

        {/* Meta */}
        <div className="flex items-center gap-3 shrink-0">
          {post.metadata.sport && (
            <span className="text-zinc-700 text-[9px] font-mono">{post.metadata.sport}</span>
          )}
          <span className="text-zinc-700 text-[9px] font-mono tabular-nums">
            {formatReach(post.engagementEstimate?.estimatedReach)}
          </span>
          <span className="text-zinc-700 text-[9px] font-mono">{timeAgo(post.createdAt)}</span>
          <span className="text-zinc-700 text-[10px]">{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-3.5 pb-3.5 border-t border-zinc-900 pt-3 space-y-3">
          {/* Full content */}
          <pre className="text-zinc-400 text-[10px] leading-relaxed whitespace-pre-wrap bg-zinc-900/50 rounded-sm p-2.5 font-mono max-h-40 overflow-y-auto">
            {post.content}
          </pre>

          {/* Engagement estimate */}
          {post.engagementEstimate && (
            <div className="flex gap-4 text-[9px] font-mono">
              <span className="text-zinc-600">Est. reach: <span className="text-zinc-400">{formatReach(post.engagementEstimate.estimatedReach)}</span></span>
              <span className="text-zinc-600">Est. impressions: <span className="text-zinc-400">{formatReach(post.engagementEstimate.estimatedImpressions)}</span></span>
              <span className="text-zinc-600">Eng. rate: <span className="text-zinc-400">{(post.engagementEstimate.engagementRate * 100).toFixed(1)}%</span></span>
            </div>
          )}

          {/* Failure reason */}
          {post.metadata.failureReason && (
            <p className="text-red-500 text-[9px] font-mono">Error: {post.metadata.failureReason}</p>
          )}

          {/* Scheduled for */}
          {post.scheduledFor && (
            <p className="text-amber-500 text-[9px] font-mono">Scheduled: {new Date(post.scheduledFor).toLocaleString()}</p>
          )}

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            {post.status === "failed" && (
              <button
                onClick={() => onRetry(post.id)}
                className="text-[9px] font-mono px-2.5 py-1 border border-blue-700 text-blue-400 rounded-sm hover:border-blue-500 transition-colors"
              >
                ↺ Retry
              </button>
            )}
            {post.status === "draft" && (
              <button
                onClick={() => onPublish(post.id)}
                className="text-[9px] font-mono px-2.5 py-1 border border-emerald-700 text-emerald-400 rounded-sm hover:border-emerald-500 transition-colors"
              >
                → Queue
              </button>
            )}
            <button
              onClick={() => onDuplicate(post.id)}
              className="text-[9px] font-mono px-2.5 py-1 border border-zinc-700 text-zinc-400 rounded-sm hover:border-zinc-500 transition-colors"
            >
              ⊕ Duplicate
            </button>
            <button
              onClick={() => onRemove(post.id)}
              className="text-[9px] font-mono px-2.5 py-1 border border-zinc-800 text-zinc-600 rounded-sm hover:border-red-800 hover:text-red-500 transition-colors"
            >
              × Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Analytics placeholder ────────────────────────────────────────────────────

function AnalyticsPlaceholder({ stats }: { stats: QueueStats }) {
  const metrics = [
    { label: "Queued Posts",         value: stats.queued,                          color: "text-blue-400" },
    { label: "Scheduled",            value: stats.scheduled,                       color: "text-amber-400" },
    { label: "Posted",               value: stats.posted,                          color: "text-emerald-400" },
    { label: "Failed",               value: stats.failed,                          color: "text-red-400" },
    { label: "Drafts",               value: stats.drafts,                          color: "text-zinc-400" },
    { label: "Est. Queued Reach",    value: stats.estimatedReach >= 1000 ? `${Math.round(stats.estimatedReach / 1000)}K` : stats.estimatedReach, color: "text-white" },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {metrics.map(m => (
          <div key={m.label} className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
            <p className="text-zinc-700 text-[8px] font-mono uppercase tracking-wider mb-1.5">{m.label}</p>
            <p className={`text-xl font-semibold font-mono tabular-nums ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-zinc-950 border border-zinc-800/40 rounded-sm p-5 max-w-lg">
        <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest mb-3">Analytics roadmap</p>
        <div className="space-y-2">
          {[
            { label: "Real impression tracking",     status: "planned" },
            { label: "Platform-level analytics",     status: "planned" },
            { label: "Partner-linked attribution",   status: "planned" },
            { label: "Creator engagement breakdown", status: "planned" },
            { label: "Export → post linkage",        status: "planned" },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-zinc-500 text-[10px]">{item.label}</span>
              <span className="text-zinc-700 text-[8px] font-mono border border-zinc-800 px-1.5 py-0.5 rounded-sm">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DistributionCenterClient() {
  const [tab,    setTab]    = useState<Tab>("queue");
  const [posts,  setPosts]  = useState<DistributionPost[]>([]);
  const [stats,  setStats]  = useState<QueueStats>({ queued: 0, scheduled: 0, posted: 0, failed: 0, drafts: 0, estimatedReach: 0 });
  const [mode,   setMode]   = useState<"detecting" | "cloud" | "local">("detecting");

  const refresh = useCallback(async () => {
    // Try API first — determines cloud vs local mode
    try {
      const res = await fetch("/api/distribution/posts", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        // Merge API posts with any local posts not yet in cloud
        const localPosts = getQueue();
        const apiPosts   = (json.posts ?? []) as DistributionPost[];
        // API is authoritative when signed in — show API data
        // Keep local-only posts that have no cloud id (created offline)
        const apiIds = new Set(apiPosts.map((p: DistributionPost) => p.id));
        const localOnly = localPosts.filter(p => !apiIds.has(p.id) && p.id.startsWith("dist_"));
        setPosts([...apiPosts, ...localOnly]);
        setStats({
          queued:    apiPosts.filter(p => p.status === "queued").length,
          scheduled: apiPosts.filter(p => p.status === "scheduled").length,
          posted:    apiPosts.filter(p => p.status === "posted").length,
          failed:    apiPosts.filter(p => p.status === "failed").length,
          drafts:    apiPosts.filter(p => p.status === "draft").length,
          estimatedReach: 0,
        });
        setMode("cloud");
        return;
      }
    } catch {
      // Fall through to localStorage
    }
    // Fallback: localStorage
    setMode("local");
    seedQueueIfEmpty();
    setPosts(getQueue());
    setStats(getQueueStats());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function handleRemove(id: string) {
    removeQueuedPost(id);
    refresh();
  }

  function handleRetry(id: string) {
    retryQueuedPost(id);
    refresh();
  }

  function handleDuplicate(id: string) {
    duplicatePost(id);
    refresh();
  }

  function handlePublish(id: string) {
    publishDraft(id);
    refresh();
  }

  const activeTab  = TABS.find(t => t.id === tab)!;
  const filtered   = activeTab.statusFilter
    ? posts.filter(p => p.status === activeTab.statusFilter)
    : posts;

  return (
    <div>
      {/* Stats bar */}
      <div className="flex items-center gap-4 mb-5 flex-wrap">
        {[
          { label: "Queued",    n: stats.queued,    color: "text-blue-400" },
          { label: "Scheduled", n: stats.scheduled, color: "text-amber-400" },
          { label: "Posted",    n: stats.posted,    color: "text-emerald-400" },
          { label: "Failed",    n: stats.failed,    color: "text-red-400" },
          { label: "Drafts",    n: stats.drafts,    color: "text-zinc-500" },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span className={`text-base font-mono font-semibold tabular-nums ${s.color}`}>{s.n}</span>
            <span className="text-zinc-700 text-[9px] font-mono">{s.label}</span>
          </div>
        ))}
        <div className="flex-1 h-px bg-zinc-900" />
        <span className="text-zinc-600 text-[9px] font-mono">
          Est. queued reach: <span className="text-zinc-400">{formatReach(stats.estimatedReach)}</span>
        </span>
        {/* Sync mode badge */}
        {mode === "cloud" ? (
          <span className="flex items-center gap-1 text-[8px] font-mono text-emerald-700 border border-emerald-900/50 px-1.5 py-0.5 rounded-sm">
            <span className="w-1 h-1 rounded-full bg-emerald-500" />
            Cloud synced
          </span>
        ) : mode === "local" ? (
          <span className="flex items-center gap-1 text-[8px] font-mono text-amber-700 border border-amber-900/50 px-1.5 py-0.5 rounded-sm">
            <span className="w-1 h-1 rounded-full bg-amber-500" />
            Local mode
          </span>
        ) : (
          <span className="text-[8px] font-mono text-zinc-700">syncing…</span>
        )}
        <button onClick={refresh} className="text-zinc-700 text-[9px] font-mono hover:text-zinc-400 transition-colors">
          ↺ Refresh
        </button>
      </div>

      {/* Tab nav */}
      <div className="flex gap-0.5 mb-4 flex-wrap">
        {TABS.map(t => {
          const count = t.statusFilter ? posts.filter(p => p.status === t.statusFilter).length : null;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 text-[10px] font-mono rounded-sm transition-colors flex items-center gap-1.5 ${
                tab === t.id
                  ? "bg-zinc-900 text-white border border-zinc-700"
                  : "text-zinc-600 hover:text-zinc-300 border border-transparent hover:border-zinc-800"
              }`}
            >
              {t.label}
              {count !== null && count > 0 && (
                <span className="bg-zinc-800 text-zinc-400 text-[8px] font-mono px-1 rounded-sm">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {tab === "broadcast" ? (
        <CreatorBroadcastGroups />
      ) : tab === "analytics" ? (
        <AnalyticsPlaceholder stats={stats} />
      ) : (
        <div>
          {/* History panel for posted/failed */}
          {(tab === "posted" || tab === "failed") && filtered.length === 0 && posts.length > 0 ? (
            <DistributionHistoryPanel />
          ) : filtered.length === 0 ? (
            <div className="border border-zinc-800/60 rounded-sm p-8 text-center bg-zinc-950">
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-2">
                No {activeTab.label.toLowerCase()} posts
              </p>
              <p className="text-zinc-700 text-xs leading-relaxed max-w-xs mx-auto">
                {tab === "queue"
                  ? "Queue posts from the signal feed, Export Studio, or Content Command."
                  : tab === "drafts"
                  ? "Save drafts from the signal feed or Export Studio to work on them later."
                  : `No ${activeTab.label.toLowerCase()} posts yet.`}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(post => (
                <PostRow
                  key={post.id}
                  post={post}
                  onRemove={handleRemove}
                  onRetry={handleRetry}
                  onDuplicate={handleDuplicate}
                  onPublish={handlePublish}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Local → cloud sync offer */}
      {mode === "local" && posts.some(p => p.id.startsWith("dist_")) && (
        <div className="mt-4 bg-zinc-950 border border-zinc-800/60 rounded-sm px-4 py-3 flex items-center justify-between gap-4">
          <p className="text-zinc-500 text-[10px] leading-relaxed">
            You have local drafts. Sign in to sync them to your account.
          </p>
          <a
            href="/signin"
            className="text-[9px] font-mono text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-2.5 py-1 rounded-sm transition-colors shrink-0"
          >
            Sign in →
          </a>
        </div>
      )}

      {/* Compliance note */}
      <div className="mt-6 pt-4 border-t border-zinc-900">
        <p className="text-zinc-800 text-[9px] font-mono leading-relaxed max-w-xl">
          Distribution shell only. No posts are sent without OAuth configuration.
          All content uses market intelligence framing — not financial advice, not betting picks.
        </p>
      </div>
    </div>
  );
}
