"use client";

import { useEffect, useState } from "react";
import type { RetentionScore } from "@/lib/activity/retentionScoring";
import { tierColor } from "@/lib/activity/retentionScoring";
import type { ActivitySummary } from "@/lib/activity/activityTypes";
import { EVENT_LABELS } from "@/lib/activity/activityTypes";
import type { ActivityEventType } from "@/lib/activity/activityTypes";

interface RetentionResponse {
  score:             RetentionScore;
  summary:           ActivitySummary;
  todayEventCounts:  Record<string, number>;
  totalToday:        number;
}

export default function AdminRetentionDashboard() {
  const [data, setData]     = useState<RetentionResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activity/retention")
      .then(r => r.json())
      .then((d: RetentionResponse) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const score   = data?.score;
  const summary = data?.summary;

  return (
    <section id="retention" className="border border-zinc-800 rounded-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
          <h2 className="text-xs font-mono font-bold text-white tracking-widest uppercase">
            Retention Intelligence
          </h2>
        </div>
        <span className={`text-[10px] font-mono font-bold tracking-widest ${loading ? "text-zinc-600" : "text-emerald-400"}`}>
          {loading ? "LOADING" : "OPERATIONAL"}
        </span>
      </div>

      {/* Score + streak */}
      {score && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="border border-zinc-800 rounded-sm p-3 col-span-1">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Habit Score</p>
            <p className={`text-2xl font-mono font-bold ${tierColor(score.tier)}`}>{score.total}</p>
            <p className={`text-[9px] font-mono ${tierColor(score.tier)}`}>{score.label}</p>
          </div>
          <div className="border border-zinc-800 rounded-sm p-3">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Streak</p>
            <p className="text-2xl font-mono font-bold text-white">{summary?.streak ?? 0}</p>
            <p className="text-[9px] font-mono text-zinc-600">days</p>
          </div>
          <div className="border border-zinc-800 rounded-sm p-3">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Events Today</p>
            <p className="text-2xl font-mono font-bold text-white">{data?.totalToday ?? 0}</p>
            <p className="text-[9px] font-mono text-zinc-600">tracked</p>
          </div>
          <div className="border border-zinc-800 rounded-sm p-3">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Total Events</p>
            <p className="text-2xl font-mono font-bold text-white">{summary?.totalEvents ?? 0}</p>
            <p className="text-[9px] font-mono text-zinc-600">lifetime</p>
          </div>
        </div>
      )}

      {/* Score components */}
      {score && (
        <div className="mb-6">
          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-3">Score Components (7-day)</p>
          <div className="space-y-2">
            {(Object.entries(score.components) as [string, number][]).map(([key, val]) => {
              const label = {
                dailyUsage:       "Daily Usage",
                briefEngagement:  "Brief Engagement",
                alertActivity:    "Alert Activity",
                exportActivity:   "Export Activity",
                watchlistUse:     "Watchlist Use",
                streakBonus:      "Streak Bonus",
              }[key] ?? key;
              return (
                <div key={key}>
                  <div className="flex justify-between mb-0.5">
                    <span className="text-[9px] font-mono text-zinc-500">{label}</span>
                    <span className="text-[9px] font-mono text-zinc-300">{val}</span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-0.5">
                    <div
                      className="h-0.5 rounded-full bg-blue-400/60 transition-all"
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Today's event breakdown */}
      {data?.todayEventCounts && Object.keys(data.todayEventCounts).length > 0 && (
        <div className="mb-6">
          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-3">Today's Events</p>
          <div className="space-y-1.5">
            {Object.entries(data.todayEventCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([type, count]) => (
                <div key={type} className="flex items-center justify-between px-3 py-1.5 border border-zinc-900 rounded-sm">
                  <span className="text-[10px] font-mono text-zinc-300">
                    {EVENT_LABELS[type as ActivityEventType] ?? type}
                  </span>
                  <span className="text-[10px] font-mono text-white font-bold">{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Architecture note */}
      <div className="pt-4 border-t border-zinc-800">
        <p className="text-[9px] font-mono text-zinc-600 leading-relaxed">
          Activity data is owner-only (RLS). Cross-user platform analytics requires service-role access.
          Current view: authenticated admin user&rsquo;s own activity.
        </p>
      </div>
    </section>
  );
}
