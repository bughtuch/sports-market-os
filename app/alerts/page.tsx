"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import MarketTicker from "@/components/MarketTicker";
import TerminalHeader from "@/components/TerminalHeader";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import CreateAlertRuleModal from "@/components/CreateAlertRuleModal";
import type { Alert } from "@/lib/alerts/alertTypes";
import {
  ALERT_CATEGORY_LABELS,
  ALERT_SEVERITY_COLOR,
  ALERT_SEVERITY_BG,
} from "@/lib/alerts/alertTypes";
import type {
  PersistentAlertRule,
  TriggeredAlert,
  AlertRuleStats,
  TriggeredAlertStats,
  PersistentSeverity,
} from "@/lib/alerts/persistent/persistentAlertTypes";
import {
  PERSISTENT_ALERT_TYPES,
  PERSISTENT_SEVERITY_COLOR,
  PERSISTENT_SEVERITY_BG,
} from "@/lib/alerts/persistent/persistentAlertTypes";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "active" | "all" | "saved-rules" | "triggered";

interface LiveAlertsResponse {
  alerts: Alert[];
  stats: { total: number; active: number; critical: number; warning: number; info: number; dismissed: number };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const SPORT_OPTIONS = [
  "All Sports", "Horse Racing", "Tennis", "NBA", "NFL", "UFC", "Football", "Prediction Markets",
];

// ─── Live alert card ──────────────────────────────────────────────────────────

function AlertCard({ alert, onDismiss }: { alert: Alert; onDismiss: (id: string) => void }) {
  return (
    <div className={`border rounded-sm p-4 ${ALERT_SEVERITY_BG[alert.severity]} ${alert.dismissed ? "opacity-40" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`text-[9px] font-mono uppercase tracking-wider font-semibold ${ALERT_SEVERITY_COLOR[alert.severity]}`}>
              {alert.severity}
            </span>
            <span className="text-zinc-600 text-[9px] font-mono">{ALERT_CATEGORY_LABELS[alert.category]}</span>
            {alert.sport && <span className="text-zinc-700 text-[9px] font-mono">{alert.sport}</span>}
          </div>
          <p className="text-white text-sm font-medium mb-1">{alert.title}</p>
          <p className="text-zinc-400 text-[10px] leading-relaxed">{alert.body}</p>
          {alert.relatedMarkets && alert.relatedMarkets.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {alert.relatedMarkets.map(m => (
                <span key={m} className="text-zinc-600 text-[9px] font-mono bg-zinc-900 border border-zinc-800/60 px-1.5 py-0.5 rounded-sm">{m}</span>
              ))}
            </div>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-zinc-600 text-[9px] font-mono mb-1.5">{timeAgo(alert.triggeredAt)}</p>
          {!alert.dismissed ? (
            <button onClick={() => onDismiss(alert.id)} className="text-zinc-700 text-[9px] font-mono hover:text-zinc-400 transition-colors">
              dismiss
            </button>
          ) : (
            <span className="text-zinc-700 text-[9px] font-mono">dismissed</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Triggered alert card ─────────────────────────────────────────────────────

function TriggeredAlertCard({ alert }: { alert: TriggeredAlert }) {
  return (
    <div className={`border rounded-sm p-4 ${PERSISTENT_SEVERITY_BG[alert.severity]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`text-[9px] font-mono uppercase tracking-wider font-semibold ${PERSISTENT_SEVERITY_COLOR[alert.severity]}`}>
              {alert.severity}
            </span>
            {alert.sport && <span className="text-zinc-700 text-[9px] font-mono">{alert.sport}</span>}
            {alert.market_slug && <span className="text-zinc-700 text-[9px] font-mono">{alert.market_slug}</span>}
          </div>
          <p className="text-white text-sm font-medium mb-1">{alert.title}</p>
          <p className="text-zinc-400 text-[10px] leading-relaxed">{alert.message}</p>
        </div>
        <p className="text-zinc-600 text-[9px] font-mono shrink-0">{timeAgo(alert.triggered_at)}</p>
      </div>
    </div>
  );
}

// ─── Saved rule card ──────────────────────────────────────────────────────────

function SavedRuleCard({
  rule,
  onToggle,
  onDelete,
}: {
  rule: PersistentAlertRule;
  onToggle: (id: string, enabled: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const typeDef = PERSISTENT_ALERT_TYPES.find((t) => t.id === rule.alert_type);
  return (
    <div className={`bg-zinc-950 border rounded-sm px-4 py-3 ${rule.enabled ? "border-zinc-800/60" : "border-zinc-900 opacity-60"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-white text-[11px] font-medium">{typeDef?.label ?? rule.alert_type}</span>
            <span className={`text-[9px] font-mono uppercase ${PERSISTENT_SEVERITY_COLOR[rule.severity]}`}>{rule.severity}</span>
          </div>
          <p className="text-zinc-500 text-[10px] leading-snug">{typeDef?.description}</p>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            {rule.sport && <span className="text-zinc-600 text-[9px] font-mono">{rule.sport}</span>}
            {rule.market_slug && <span className="text-zinc-600 text-[9px] font-mono">{rule.market_slug}</span>}
            {rule.threshold !== undefined && rule.threshold !== null && (
              <span className="text-zinc-700 text-[9px] font-mono">threshold: {rule.threshold}</span>
            )}
            <span className="text-zinc-800 text-[9px] font-mono">
              {new Date(rule.created_at).toLocaleDateString("en-GB")}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onToggle(rule.id, !rule.enabled)}
            className={`text-[9px] font-mono transition-colors ${rule.enabled ? "text-emerald-400 hover:text-emerald-300" : "text-zinc-600 hover:text-zinc-400"}`}
          >
            {rule.enabled ? "enabled" : "disabled"}
          </button>
          <button
            onClick={() => onDelete(rule.id)}
            className="text-zinc-700 text-[9px] font-mono hover:text-red-400 transition-colors"
          >
            delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty states ─────────────────────────────────────────────────────────────

function EmptyState({ message, cta, ctaHref, onCtaClick }: {
  message: string;
  cta?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
}) {
  return (
    <div className="text-center py-12 border border-zinc-900 rounded-sm">
      <p className="text-zinc-600 text-sm mb-4">{message}</p>
      {cta && ctaHref && (
        <Link href={ctaHref} className="text-xs font-mono text-zinc-400 border border-zinc-800 px-4 py-2 rounded-sm hover:border-zinc-600 hover:text-white transition-colors">
          {cta}
        </Link>
      )}
      {cta && onCtaClick && (
        <button onClick={onCtaClick} className="text-xs font-mono text-zinc-400 border border-zinc-800 px-4 py-2 rounded-sm hover:border-zinc-600 hover:text-white transition-colors">
          {cta}
        </button>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AlertsPage() {
  const [tab,           setTab]           = useState<Tab>("active");
  const [liveData,      setLiveData]      = useState<LiveAlertsResponse | null>(null);
  const [savedRules,    setSavedRules]    = useState<PersistentAlertRule[]>([]);
  const [ruleStats,     setRuleStats]     = useState<AlertRuleStats | null>(null);
  const [triggeredAlerts, setTriggered]   = useState<TriggeredAlert[]>([]);
  const [triggeredStats,  setTrigStats]   = useState<TriggeredAlertStats | null>(null);
  const [dismissed,     setDismissed]     = useState<Set<string>>(new Set());
  const [loading,       setLoading]       = useState(true);
  const [showModal,     setShowModal]     = useState(false);

  // Filters
  const [severityFilter, setSeverityFilter] = useState<PersistentSeverity | "all">("all");
  const [sportFilter,    setSportFilter]    = useState("All Sports");

  const loadLiveAlerts = useCallback(() => {
    fetch("/api/alerts")
      .then(r => r.json())
      .then(setLiveData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loadSavedRules = useCallback(() => {
    fetch("/api/alerts/rules")
      .then(r => r.json())
      .then((d: { rules?: PersistentAlertRule[]; stats?: AlertRuleStats }) => {
        setSavedRules(d.rules ?? []);
        setRuleStats(d.stats ?? null);
      })
      .catch(() => {});
  }, []);

  const loadTriggered = useCallback(() => {
    fetch("/api/alerts/triggered")
      .then(r => r.json())
      .then((d: { alerts?: TriggeredAlert[]; stats?: TriggeredAlertStats }) => {
        setTriggered(d.alerts ?? []);
        setTrigStats(d.stats ?? null);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadLiveAlerts();
    loadSavedRules();
    loadTriggered();
  }, [loadLiveAlerts, loadSavedRules, loadTriggered]);

  function handleDismiss(id: string) {
    setDismissed(prev => new Set([...prev, id]));
  }

  function handleToggleRule(ruleId: string, enabled: boolean) {
    fetch("/api/alerts/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle", ruleId, enabled }),
    }).then(() => loadSavedRules()).catch(() => {});
    // Optimistic UI
    setSavedRules(prev => prev.map(r => r.id === ruleId ? { ...r, enabled } : r));
  }

  function handleDeleteRule(ruleId: string) {
    fetch("/api/alerts/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", ruleId }),
    }).then(() => loadSavedRules()).catch(() => {});
    setSavedRules(prev => prev.filter(r => r.id !== ruleId));
  }

  const liveAlerts = (liveData?.alerts ?? []).map(a => ({
    ...a,
    dismissed: a.dismissed || dismissed.has(a.id),
  }));
  const activeAlerts   = liveAlerts.filter(a => !a.dismissed);
  const criticalAlerts = activeAlerts.filter(a => a.severity === "critical");
  const warningAlerts  = activeAlerts.filter(a => a.severity === "warning");

  // Apply filters to saved rules
  const filteredRules = savedRules.filter(r => {
    if (severityFilter !== "all" && r.severity !== severityFilter) return false;
    if (sportFilter !== "All Sports" && r.sport !== sportFilter) return false;
    return true;
  });

  // Apply filters to triggered
  const filteredTriggered = triggeredAlerts.filter(a => {
    if (severityFilter !== "all" && a.severity !== severityFilter) return false;
    if (sportFilter !== "All Sports" && a.sport !== sportFilter) return false;
    return true;
  });

  const TABS: { id: Tab; label: string }[] = [
    { id: "active",      label: `Active (${activeAlerts.length})` },
    { id: "all",         label: `All Live (${liveAlerts.length})` },
    { id: "saved-rules", label: `Saved Rules (${savedRules.length})` },
    { id: "triggered",   label: `Triggered (${triggeredAlerts.length})` },
  ];

  return (
    <div className="min-h-screen md:h-screen bg-black text-white flex flex-col md:overflow-hidden">
      <MarketTicker />
      <TerminalHeader />

      <div className="flex flex-1 flex-col md:flex-row md:overflow-hidden">
        <div className="hidden md:block"><Sidebar /></div>

        <main className="flex-1 md:overflow-y-auto">
          {/* Header */}
          <section className="px-6 py-5 border-b border-zinc-900 bg-zinc-950/40">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/terminal" className="text-zinc-600 text-[10px] font-mono hover:text-zinc-400 transition-colors">Terminal</Link>
              <span className="text-zinc-800 text-[10px]">›</span>
              <span className="text-zinc-400 text-[10px] font-mono">Alert Center</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-white text-2xl font-semibold tracking-tight mb-1">Alert Center</h1>
                <p className="text-zinc-500 text-sm">
                  Persistent rules, triggered alerts, and live market intelligence signals.
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                {liveData && (
                  <>
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
                  </>
                )}
                <button
                  onClick={() => setShowModal(true)}
                  className="text-xs font-medium text-black bg-white px-4 py-2 rounded-sm hover:bg-zinc-200 transition-colors shrink-0"
                >
                  + Create Rule
                </button>
              </div>
            </div>
          </section>

          {/* Filters strip */}
          {(tab === "saved-rules" || tab === "triggered") && (
            <section className="px-6 py-3 border-b border-zinc-900 bg-zinc-950/20 flex flex-wrap items-center gap-3">
              <span className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest">Filter:</span>

              {/* Severity filter */}
              <div className="flex gap-1">
                {(["all", "low", "medium", "high", "critical"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSeverityFilter(s)}
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-sm border transition-colors ${
                      severityFilter === s
                        ? "border-white/20 text-white bg-zinc-900"
                        : "border-zinc-800 text-zinc-600 hover:border-zinc-700"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Sport filter */}
              <select
                value={sportFilter}
                onChange={(e) => setSportFilter(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-[9px] font-mono px-2 py-0.5 rounded-sm focus:outline-none focus:border-zinc-600"
              >
                {SPORT_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </section>
          )}

          {/* Tabs */}
          <div className="px-6 border-b border-zinc-900 flex items-center gap-6 h-10 overflow-x-auto">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`text-[10px] font-mono uppercase tracking-wider shrink-0 h-full border-b-2 transition-colors ${
                  tab === t.id
                    ? "border-white text-white"
                    : "border-transparent text-zinc-600 hover:text-zinc-400"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <section className="px-6 py-5">
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 bg-zinc-900 rounded-sm animate-pulse" />
                ))}
              </div>
            ) : tab === "saved-rules" ? (
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-zinc-600 text-[10px] font-mono">
                    {ruleStats?.enabled ?? 0} enabled · {ruleStats?.disabled ?? 0} disabled · persisted to Supabase
                  </p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="text-[10px] font-mono text-zinc-500 hover:text-white transition-colors"
                  >
                    + Add Rule →
                  </button>
                </div>
                {filteredRules.length === 0 ? (
                  <EmptyState
                    message="No saved alert rules yet. Create your first rule to start persistent monitoring."
                    cta="Create First Rule"
                    onCtaClick={() => setShowModal(true)}
                  />
                ) : (
                  filteredRules.map(rule => (
                    <SavedRuleCard
                      key={rule.id}
                      rule={rule}
                      onToggle={handleToggleRule}
                      onDelete={handleDeleteRule}
                    />
                  ))
                )}
              </div>
            ) : tab === "triggered" ? (
              <div className="space-y-2 max-w-2xl">
                {triggeredStats && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { label: "Total", value: triggeredStats.total },
                      { label: "Today", value: triggeredStats.today,    color: "text-amber-400" },
                      { label: "Critical", value: triggeredStats.critical, color: "text-red-400" },
                    ].map(m => (
                      <div key={m.label} className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-3">
                        <p className="text-zinc-700 text-[8px] font-mono uppercase tracking-widest mb-1">{m.label}</p>
                        <p className={`text-lg font-bold tabular-nums ${m.color ?? "text-white"}`}>{m.value}</p>
                      </div>
                    ))}
                  </div>
                )}
                {filteredTriggered.length === 0 ? (
                  <EmptyState
                    message={savedRules.length === 0
                      ? "Create alert rules first — triggered events will appear here when rules fire."
                      : "No triggered alerts yet. Evaluation runs when market conditions cross your rule thresholds."}
                    cta={savedRules.length === 0 ? "Create First Rule" : undefined}
                    onCtaClick={savedRules.length === 0 ? () => setShowModal(true) : undefined}
                  />
                ) : (
                  filteredTriggered.map(alert => (
                    <TriggeredAlertCard key={alert.id} alert={alert} />
                  ))
                )}
              </div>
            ) : (
              /* Live alerts (active / all) */
              <div className="space-y-2 max-w-2xl">
                {(tab === "active" ? activeAlerts : liveAlerts).length === 0 ? (
                  <EmptyState
                    message="No active alerts right now."
                    cta="View Alert Rules"
                    onCtaClick={() => setTab("saved-rules")}
                  />
                ) : (
                  (tab === "active" ? activeAlerts : liveAlerts).map(alert => (
                    <AlertCard key={alert.id} alert={alert} onDismiss={handleDismiss} />
                  ))
                )}
              </div>
            )}

            <p className="text-zinc-800 text-[9px] font-mono mt-8 pt-4 border-t border-zinc-900/40">
              Market intelligence only · Not financial advice · Sports Market OS
            </p>
          </section>

          <Footer />
        </main>
      </div>

      <CreateAlertRuleModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={() => { loadSavedRules(); setTab("saved-rules"); }}
      />
    </div>
  );
}
