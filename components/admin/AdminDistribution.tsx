"use client";

/**
 * AdminDistribution — admin view of distribution posts and export events.
 *
 * Fetches from /api/admin/distribution.
 * Shows: recent posts, recent exports, platform mix, top partner codes.
 */

import { useEffect, useState } from "react";

interface Post {
  id:        string;
  platform:  string;
  status:    string;
  content:   string;
  created_at: string;
}

interface ExportEvent {
  id:            string;
  partner_code?:  string | null;
  sport?:        string | null;
  layout?:       string | null;
  theme?:        string | null;
  export_type?:  string | null;
  signal_title?: string | null;
  created_at:    string;
}

interface TopPartner {
  partner_code: string;
  count:        number;
}

interface AdminDistData {
  recentPosts:          Post[];
  recentExports:        ExportEvent[];
  topPartnersByExports: TopPartner[];
  platformMix:          Record<string, number>;
  totalPosts:           number;
  totalExports:         number;
}

const STATUS_COLOR: Record<string, string> = {
  queued:    "text-blue-400",
  posted:    "text-emerald-400",
  failed:    "text-red-400",
  draft:     "text-zinc-500",
  scheduled: "text-amber-400",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminDistribution() {
  const [data,    setData]    = useState<AdminDistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/distribution")
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-8 bg-zinc-900 rounded-sm animate-pulse" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <p className="text-zinc-600 text-[10px] font-mono">
        {error ?? "No distribution data"}
        {error?.includes("Forbidden") ? " — run distribution_tracking.sql migration first." : ""}
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Posts",   value: data.totalPosts,   color: "text-white" },
          { label: "Total Exports", value: data.totalExports, color: "text-purple-400" },
          { label: "Queued",        value: data.recentPosts.filter(p => p.status === "queued").length, color: "text-blue-400" },
          { label: "Posted",        value: data.recentPosts.filter(p => p.status === "posted").length, color: "text-emerald-400" },
        ].map(m => (
          <div key={m.label} className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-3">
            <p className="text-zinc-700 text-[8px] font-mono uppercase tracking-wider mb-1">{m.label}</p>
            <p className={`text-xl font-semibold font-mono tabular-nums ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Platform mix */}
      {Object.keys(data.platformMix).length > 0 && (
        <div>
          <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest mb-2">Platform Mix</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(data.platformMix)
              .sort((a, b) => b[1] - a[1])
              .map(([platform, count]) => (
                <div
                  key={platform}
                  className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800/60 rounded-sm px-2.5 py-1.5 text-[9px] font-mono"
                >
                  <span className="text-zinc-400">{platform}</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-white">{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Top partners by exports */}
      {data.topPartnersByExports.length > 0 && (
        <div>
          <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest mb-2">
            Top Partner Codes by Exports
          </p>
          <div className="space-y-1.5">
            {data.topPartnersByExports.map(p => (
              <div
                key={p.partner_code}
                className="flex items-center justify-between bg-zinc-950 border border-zinc-800/60 rounded-sm px-3 py-2"
              >
                <span className="text-emerald-400 text-[10px] font-mono">{p.partner_code}</span>
                <span className="text-white text-[10px] font-mono tabular-nums">{p.count} exports</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent distribution posts */}
      <div>
        <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest mb-2">
          Recent Distribution Posts ({data.recentPosts.length})
        </p>
        {data.recentPosts.length === 0 ? (
          <p className="text-zinc-700 text-[10px] font-mono">No posts yet.</p>
        ) : (
          <div className="space-y-1.5">
            {data.recentPosts.slice(0, 15).map(post => (
              <div
                key={post.id}
                className="flex items-center gap-3 bg-zinc-950 border border-zinc-800/60 rounded-sm px-3 py-2"
              >
                <span className={`text-[8px] font-mono shrink-0 ${STATUS_COLOR[post.status] ?? "text-zinc-500"}`}>
                  {post.status}
                </span>
                <span className="text-zinc-600 text-[9px] font-mono shrink-0 w-20 truncate">
                  {post.platform}
                </span>
                <span className="text-zinc-400 text-[10px] flex-1 truncate min-w-0">
                  {post.content.slice(0, 80).replace(/\n/g, " ")}
                </span>
                <span className="text-zinc-700 text-[9px] font-mono shrink-0">
                  {timeAgo(post.created_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent export events */}
      <div>
        <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest mb-2">
          Recent Export Events ({data.recentExports.length})
        </p>
        {data.recentExports.length === 0 ? (
          <p className="text-zinc-700 text-[10px] font-mono">No exports tracked yet.</p>
        ) : (
          <div className="space-y-1.5">
            {data.recentExports.slice(0, 15).map(ev => (
              <div
                key={ev.id}
                className="flex items-center gap-3 bg-zinc-950 border border-zinc-800/60 rounded-sm px-3 py-2"
              >
                <span className="text-purple-400 text-[8px] font-mono shrink-0">
                  {ev.export_type ?? "export"}
                </span>
                {ev.sport && (
                  <span className="text-zinc-600 text-[9px] font-mono shrink-0">{ev.sport}</span>
                )}
                {ev.layout && (
                  <span className="text-zinc-700 text-[9px] font-mono shrink-0">{ev.layout}</span>
                )}
                {ev.partner_code && (
                  <span className="text-emerald-600 text-[9px] font-mono shrink-0">
                    ref:{ev.partner_code}
                  </span>
                )}
                <span className="text-zinc-500 text-[10px] flex-1 truncate min-w-0">
                  {ev.signal_title ?? "—"}
                </span>
                <span className="text-zinc-700 text-[9px] font-mono shrink-0">
                  {timeAgo(ev.created_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
