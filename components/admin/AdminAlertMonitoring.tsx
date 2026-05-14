"use client";

import { useEffect, useState } from "react";
import type {
  PersistentAlertRule,
  TriggeredAlert,
  AlertRuleStats,
  TriggeredAlertStats,
} from "@/lib/alerts/persistent/persistentAlertTypes";
import { PERSISTENT_SEVERITY_COLOR } from "@/lib/alerts/persistent/persistentAlertTypes";

interface RulesResponse {
  rules: PersistentAlertRule[];
  stats: AlertRuleStats | null;
}

interface TriggeredResponse {
  alerts: TriggeredAlert[];
  stats: TriggeredAlertStats | null;
}

export default function AdminAlertMonitoring() {
  const [rulesData,     setRulesData]     = useState<RulesResponse | null>(null);
  const [triggeredData, setTriggeredData] = useState<TriggeredResponse | null>(null);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/alerts/rules").then(r => r.json()),
      fetch("/api/alerts/triggered?limit=100").then(r => r.json()),
    ])
      .then(([rules, triggered]) => {
        setRulesData(rules as RulesResponse);
        setTriggeredData(triggered as TriggeredResponse);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 bg-zinc-900 rounded-sm animate-pulse" />
        ))}
      </div>
    );
  }

  const rStats = rulesData?.stats;
  const tStats = triggeredData?.stats;
  const rules  = rulesData?.rules ?? [];

  // Top sport by rule count
  const topSport = rStats?.bySport
    ? Object.entries(rStats.bySport).sort((a, b) => b[1] - a[1])[0]
    : null;

  // Top alert type by rule count
  const topType = rStats?.byType
    ? Object.entries(rStats.byType).sort((a, b) => b[1] - a[1])[0]
    : null;

  return (
    <div className="space-y-5">
      {/* Summary metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Rules",     value: rStats?.total    ?? 0, color: "text-white" },
          { label: "Enabled",         value: rStats?.enabled  ?? 0, color: "text-emerald-400" },
          { label: "Triggered Today", value: tStats?.today    ?? 0, color: "text-amber-400" },
          { label: "Total Triggered", value: tStats?.total    ?? 0, color: "text-zinc-400" },
        ].map((m) => (
          <div key={m.label} className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-3">
            <p className="text-zinc-600 text-[8px] font-mono uppercase tracking-widest mb-1">{m.label}</p>
            <p className={`text-xl font-bold tabular-nums ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Key insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
          <p className="text-zinc-600 text-[8px] font-mono uppercase tracking-widest mb-2">Most Common Type</p>
          <p className="text-zinc-200 text-sm font-mono">{topType ? topType[0] : "—"}</p>
          {topType && <p className="text-zinc-600 text-[9px] mt-0.5">{topType[1]} rules</p>}
        </div>
        <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
          <p className="text-zinc-600 text-[8px] font-mono uppercase tracking-widest mb-2">Highest-Trigger Sport</p>
          <p className="text-zinc-200 text-sm font-mono">{tStats?.mostActiveSport ?? topSport?.[0] ?? "—"}</p>
          {topSport && <p className="text-zinc-600 text-[9px] mt-0.5">{topSport[1]} rules configured</p>}
        </div>
        <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
          <p className="text-zinc-600 text-[8px] font-mono uppercase tracking-widest mb-2">Critical Triggered</p>
          <p className={`text-xl font-bold tabular-nums ${(tStats?.critical ?? 0) > 0 ? "text-red-400" : "text-zinc-600"}`}>
            {tStats?.critical ?? 0}
          </p>
        </div>
      </div>

      {/* Severity distribution */}
      {rStats && Object.keys(rStats.bySeverity).length > 0 && (
        <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
          <p className="text-zinc-600 text-[8px] font-mono uppercase tracking-widest mb-3">Severity Distribution</p>
          <div className="flex gap-4 flex-wrap">
            {Object.entries(rStats.bySeverity).map(([sev, count]) => (
              <div key={sev} className="flex items-center gap-2">
                <span className={`text-[10px] font-mono ${PERSISTENT_SEVERITY_COLOR[sev as keyof typeof PERSISTENT_SEVERITY_COLOR] ?? "text-zinc-400"}`}>
                  {sev}
                </span>
                <span className="text-zinc-500 text-[10px] font-mono tabular-nums">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent user rules sample */}
      {rules.length > 0 ? (
        <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm overflow-hidden">
          <div className="px-4 py-2.5 border-b border-zinc-900/60">
            <p className="text-zinc-600 text-[8px] font-mono uppercase tracking-widest">
              Platform Alert Rules (last {Math.min(rules.length, 10)})
            </p>
          </div>
          <div className="divide-y divide-zinc-900/60">
            {rules.slice(0, 10).map((rule) => (
              <div key={rule.id} className="flex items-center justify-between px-4 py-2 gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-300 text-[10px] font-mono truncate">{rule.alert_type}</p>
                  {rule.sport && <p className="text-zinc-600 text-[9px]">{rule.sport}</p>}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[9px] font-mono ${PERSISTENT_SEVERITY_COLOR[rule.severity] ?? "text-zinc-400"}`}>
                    {rule.severity}
                  </span>
                  <span className={`text-[9px] font-mono ${rule.enabled ? "text-emerald-500" : "text-zinc-600"}`}>
                    {rule.enabled ? "on" : "off"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-5">
          <p className="text-zinc-600 text-xs">
            No alert rules yet. Rules are created by users via the Alert Center or from signal cards.
            Supabase must be configured for persistence.
          </p>
        </div>
      )}
    </div>
  );
}
