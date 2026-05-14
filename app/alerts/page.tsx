"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MarketTicker from "@/components/MarketTicker";
import TerminalHeader from "@/components/TerminalHeader";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import type { Alert } from "@/lib/alerts/alertTypes";
import {
  ALERT_CATEGORY_LABELS,
  ALERT_SEVERITY_COLOR,
  ALERT_SEVERITY_BG,
} from "@/lib/alerts/alertTypes";
import { DEFAULT_ALERT_RULES } from "@/lib/alerts/alertRules";

interface AlertsResponse {
  alerts: Alert[];
  stats: {
    total: number;
    active: number;
    critical: number;
    warning: number;
    info: number;
    dismissed: number;
  };
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

function AlertCard({ alert, onDismiss }: { alert: Alert; onDismiss: (id: string) => void }) {
  return (
    <div className={`border rounded-sm p-4 ${ALERT_SEVERITY_BG[alert.severity]} ${alert.dismissed ? "opacity-40" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`text-[9px] font-mono uppercase tracking-wider font-semibold ${ALERT_SEVERITY_COLOR[alert.severity]}`}>
              {alert.severity}
            </span>
            <span className="text-zinc-600 text-[9px] font-mono">
              {ALERT_CATEGORY_LABELS[alert.category]}
            </span>
            {alert.sport && (
              <span className="text-zinc-700 text-[9px] font-mono">{alert.sport}</span>
            )}
          </div>
          <p className="text-white text-sm font-medium mb-1">{alert.title}</p>
          <p className="text-zinc-400 text-[10px] leading-relaxed">{alert.body}</p>
          {alert.relatedMarkets && alert.relatedMarkets.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {alert.relatedMarkets.map(m => (
                <span key={m} className="text-zinc-600 text-[9px] font-mono bg-zinc-900 border border-zinc-800/60 px-1.5 py-0.5 rounded-sm">
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-zinc-600 text-[9px] font-mono mb-1.5">{timeAgo(alert.triggeredAt)}</p>
          {!alert.dismissed && (
            <button
              onClick={() => onDismiss(alert.id)}
              className="text-zinc-700 text-[9px] font-mono hover:text-zinc-400 transition-colors"
            >
              dismiss
            </button>
          )}
          {alert.dismissed && (
            <span className="text-zinc-700 text-[9px] font-mono">dismissed</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AlertsPage() {
  const [data,      setData]      = useState<AlertsResponse | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [tab,       setTab]       = useState<"active" | "all" | "rules">("active");

  useEffect(() => {
    fetch("/api/alerts")
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleDismiss(id: string) {
    setDismissed(prev => new Set([...prev, id]));
  }

  const alerts = (data?.alerts ?? []).map(a => ({
    ...a,
    dismissed: a.dismissed || dismissed.has(a.id),
  }));

  const activeAlerts    = alerts.filter(a => !a.dismissed);
  const criticalAlerts  = activeAlerts.filter(a => a.severity === "critical");
  const warningAlerts   = activeAlerts.filter(a => a.severity === "warning");

  return (
    <div className="min-h-screen md:h-screen bg-black text-white flex flex-col md:overflow-hidden">
      <MarketTicker />
      <TerminalHeader />

      <div className="flex flex-1 flex-col md:flex-row md:overflow-hidden">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <main className="flex-1 md:overflow-y-auto">
          {/* Header */}
          <section className="px-6 py-5 border-b border-zinc-900 bg-zinc-950/40">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/terminal" className="text-zinc-600 text-[10px] font-mono hover:text-zinc-400 transition-colors">
                Terminal
              </Link>
              <span className="text-zinc-800 text-[10px]">›</span>
              <span className="text-zinc-400 text-[10px] font-mono">Alerts</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-white text-2xl font-semibold tracking-tight mb-1">Alert Center</h1>
                <p className="text-zinc-500 text-sm">
                  Triggered alerts across monitored markets, watchlists, and AI intelligence signals.
                </p>
              </div>
              {data && (
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-zinc-600 text-[9px] font-mono mb-0.5">ACTIVE</p>
                    <p className="text-white text-xl font-bold tabular-nums">{activeAlerts.length}</p>
                  </div>
                  {criticalAlerts.length > 0 && (
                    <div className="text-right">
                      <p className="text-zinc-600 text-[9px] font-mono mb-0.5">CRITICAL</p>
                      <p className="text-red-400 text-xl font-bold tabular-nums">{criticalAlerts.length}</p>
                    </div>
                  )}
                  {warningAlerts.length > 0 && (
                    <div className="text-right">
                      <p className="text-zinc-600 text-[9px] font-mono mb-0.5">WARNING</p>
                      <p className="text-amber-400 text-xl font-bold tabular-nums">{warningAlerts.length}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Tabs */}
          <div className="px-6 border-b border-zinc-900 flex items-center gap-6 h-10">
            {(["active", "all", "rules"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-[10px] font-mono uppercase tracking-wider pb-0 h-full border-b-2 transition-colors ${
                  tab === t
                    ? "border-white text-white"
                    : "border-transparent text-zinc-600 hover:text-zinc-400"
                }`}
              >
                {t === "active" ? `Active (${activeAlerts.length})` :
                 t === "all"    ? `All (${alerts.length})` : "Alert Rules"}
              </button>
            ))}
          </div>

          <section className="px-6 py-5">
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 bg-zinc-900 rounded-sm animate-pulse" />
                ))}
              </div>
            ) : tab === "rules" ? (
              /* Alert Rules */
              <div className="space-y-2">
                <p className="text-zinc-600 text-[10px] font-mono mb-4">
                  {DEFAULT_ALERT_RULES.length} rules configured · Email/push/Telegram delivery available in Sprint 24.
                </p>
                {DEFAULT_ALERT_RULES.map(rule => (
                  <div key={rule.id} className="bg-zinc-950 border border-zinc-800/60 rounded-sm px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white text-[11px] font-medium">{rule.name}</span>
                          <span className="text-zinc-600 text-[9px] font-mono">
                            {ALERT_CATEGORY_LABELS[rule.category]}
                          </span>
                        </div>
                        <p className="text-zinc-500 text-[10px]">{rule.description}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          {rule.sport && (
                            <span className="text-zinc-600 text-[9px] font-mono">{rule.sport}</span>
                          )}
                          {rule.threshold !== undefined && (
                            <span className="text-zinc-700 text-[9px] font-mono">
                              threshold: {rule.threshold}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`text-[9px] font-mono shrink-0 ${rule.enabled ? "text-emerald-400" : "text-zinc-600"}`}>
                        {rule.enabled ? "enabled" : "disabled"}
                      </span>
                    </div>
                  </div>
                ))}
                <p className="text-zinc-700 text-[9px] font-mono mt-4">
                  Rule management UI and email delivery activate after notification infrastructure sprint.
                </p>
              </div>
            ) : (
              /* Alert list */
              <div className="space-y-2">
                {(tab === "active" ? activeAlerts : alerts).length === 0 ? (
                  <p className="text-zinc-700 text-[10px] font-mono py-4">No alerts.</p>
                ) : (
                  (tab === "active" ? activeAlerts : alerts).map(alert => (
                    <AlertCard
                      key={alert.id}
                      alert={alert}
                      onDismiss={handleDismiss}
                    />
                  ))
                )}
              </div>
            )}

            <p className="text-zinc-800 text-[9px] font-mono mt-8 pt-4 border-t border-zinc-900/40">
              Alerts are generated from market intelligence signals only. No alerts constitute financial,
              investment, or betting advice. Market intelligence only · Sports Market OS.
            </p>
          </section>

          <Footer />
        </main>
      </div>
    </div>
  );
}
