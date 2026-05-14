"use client";

import { useEffect, useState } from "react";
import type { AlertRuleStats } from "@/lib/alerts/persistent/persistentAlertTypes";
import { PERSISTENT_SEVERITY_COLOR } from "@/lib/alerts/persistent/persistentAlertTypes";

export default function AccountAlertSummary() {
  const [stats,   setStats]   = useState<AlertRuleStats | null>(null);
  const [today,   setToday]   = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/alerts/rules").then(r => r.json()),
      fetch("/api/alerts/triggered").then(r => r.json()),
    ])
      .then(([rules, triggered]) => {
        const r = rules as { stats?: AlertRuleStats };
        const t = triggered as { stats?: { today?: number } };
        setStats(r.stats ?? null);
        setToday(t.stats?.today ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-xl">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 bg-zinc-900 rounded-sm animate-pulse" />
        ))}
      </div>
    );
  }

  const topSeverity = stats?.bySeverity
    ? Object.entries(stats.bySeverity).sort((a, b) => {
        const order = ["critical", "high", "medium", "low"];
        return order.indexOf(a[0]) - order.indexOf(b[0]);
      })[0]
    : null;

  const topSport = stats?.bySport
    ? Object.entries(stats.bySport).sort((a, b) => b[1] - a[1])[0]
    : null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-xl">
      <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-3">
        <p className="text-zinc-700 text-[8px] font-mono uppercase tracking-wider mb-1">Active Rules</p>
        <p className="text-white text-lg font-bold tabular-nums">{stats?.enabled ?? 0}</p>
        <p className="text-zinc-700 text-[9px] font-mono">{stats?.total ?? 0} total</p>
      </div>
      <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-3">
        <p className="text-zinc-700 text-[8px] font-mono uppercase tracking-wider mb-1">Triggered Today</p>
        <p className={`text-lg font-bold tabular-nums ${today > 0 ? "text-amber-400" : "text-zinc-600"}`}>
          {today}
        </p>
      </div>
      <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-3">
        <p className="text-zinc-700 text-[8px] font-mono uppercase tracking-wider mb-1">Top Severity</p>
        {topSeverity ? (
          <>
            <p className={`text-sm font-mono font-semibold ${PERSISTENT_SEVERITY_COLOR[topSeverity[0] as keyof typeof PERSISTENT_SEVERITY_COLOR] ?? "text-zinc-400"}`}>
              {topSeverity[0]}
            </p>
            <p className="text-zinc-700 text-[9px] font-mono">{topSeverity[1]} rules</p>
          </>
        ) : (
          <p className="text-zinc-600 text-sm font-mono">—</p>
        )}
      </div>
      <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-3">
        <p className="text-zinc-700 text-[8px] font-mono uppercase tracking-wider mb-1">Primary Sport</p>
        <p className="text-zinc-300 text-xs font-mono truncate">{topSport ? topSport[0] : "—"}</p>
        {topSport && <p className="text-zinc-700 text-[9px] font-mono">{topSport[1]} rules</p>}
      </div>
    </div>
  );
}
