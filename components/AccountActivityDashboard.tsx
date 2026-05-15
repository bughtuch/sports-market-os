"use client";

import { useEffect, useState } from "react";
import type { ActivitySummary } from "@/lib/activity/activityTypes";
import type { RetentionScore } from "@/lib/activity/retentionScoring";
import { tierColor } from "@/lib/activity/retentionScoring";

interface SummaryResponse {
  summary:       ActivitySummary;
  retentionScore: RetentionScore;
}

function StatCell({ label, value, color = "text-white" }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="border border-zinc-800 rounded-sm p-3">
      <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-lg font-mono font-bold ${color}`}>{value}</p>
    </div>
  );
}

export default function AccountActivityDashboard() {
  const [data, setData]     = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activity/summary")
      .then(r => r.json())
      .then((d: SummaryResponse) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-zinc-900 rounded-sm w-32" />
        <div className="grid grid-cols-3 gap-2">
          {[...Array(6)].map((_, i) => <div key={i} className="h-14 bg-zinc-900 rounded-sm" />)}
        </div>
      </div>
    );
  }

  const score   = data?.retentionScore;
  const today   = data?.summary.today;
  const streak  = data?.summary.streak ?? 0;
  const total   = data?.summary.totalEvents ?? 0;

  return (
    <div className="space-y-5">
      {/* Intelligence Habit Score */}
      {score && (
        <div className="flex items-center justify-between p-4 border border-zinc-800 rounded-sm">
          <div>
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1">
              Intelligence Habit Score
            </p>
            <p className={`text-2xl font-mono font-bold ${tierColor(score.tier)}`}>
              {score.total}
              <span className="text-zinc-600 text-sm font-normal"> / 100</span>
            </p>
            <p className={`text-[10px] font-mono mt-0.5 ${tierColor(score.tier)}`}>
              {score.label}
            </p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Streak</p>
            <p className="text-xl font-mono font-bold text-white">{streak}<span className="text-zinc-600 text-xs"> days</span></p>
            <p className="text-[9px] font-mono text-zinc-600">{total} total events</p>
          </div>
        </div>
      )}

      {/* Today's stats */}
      <div>
        <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-2">Today</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <StatCell label="Terminal Views"   value={today?.terminal_views ?? 0} />
          <StatCell label="Briefs Viewed"    value={today?.briefs_viewed ?? 0} />
          <StatCell label="Exports Created"  value={today?.exports_created ?? 0} color="text-emerald-400" />
          <StatCell label="Alerts Created"   value={today?.alerts_created ?? 0} color="text-amber-400" />
          <StatCell label="Watchlists Used"  value={today?.watchlists_used ?? 0} />
          <StatCell label="Distribution"     value={today?.distribution_actions ?? 0} color="text-violet-400" />
        </div>
      </div>

      {/* 7-day trend bar */}
      {data && data.summary.last7Days.length > 0 && (
        <div>
          <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-2">7-Day Activity</p>
          <div className="flex items-end gap-1 h-10">
            {[...data.summary.last7Days].reverse().map((day, i) => {
              const total = day.terminal_views + day.exports_created + day.alerts_created +
                day.briefs_viewed + day.watchlists_used + day.distribution_actions;
              const maxPossible = 20;
              const height = total > 0 ? Math.max(4, Math.round((total / maxPossible) * 40)) : 2;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-sm ${total > 0 ? "bg-emerald-400/60" : "bg-zinc-800"}`}
                    style={{ height: `${height}px` }}
                  />
                  <span className="text-[7px] font-mono text-zinc-700">
                    {new Date(day.activity_date + "T00:00:00Z").toLocaleDateString("en-GB", { weekday: "narrow" })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!data && (
        <p className="text-[10px] font-mono text-zinc-600">
          Activity data will appear here as you use the platform.
        </p>
      )}
    </div>
  );
}
