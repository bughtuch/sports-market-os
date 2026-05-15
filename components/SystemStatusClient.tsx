"use client";

import Link from "next/link";
import type { ProviderHealthSummary, ProviderHealth } from "@/lib/providers/providerHealth";

const STATUS_COLOR: Record<string, string> = {
  healthy:   "text-emerald-400",
  simulated: "text-amber-400",
  degraded:  "text-red-400",
  planned:   "text-zinc-500",
  offline:   "text-red-600",
};

const STATUS_DOT: Record<string, string> = {
  healthy:   "bg-emerald-400",
  simulated: "bg-amber-400",
  degraded:  "bg-red-400",
  planned:   "bg-zinc-700",
  offline:   "bg-red-700",
};

const CATEGORY_LABEL: Record<string, string> = {
  ai:           "AI",
  news:         "News",
  odds:         "Odds",
  exchange:     "Exchange",
  distribution: "Distribution",
  intelligence: "Intelligence",
};

const REFRESH_CADENCE = [
  { label: "AI Engine",         cadence: "On-demand",    note: "Per user request" },
  { label: "News Feed",         cadence: "5 min",         note: "Polling interval" },
  { label: "Odds Snapshots",    cadence: "60 sec",        note: "Live: 30s, Sim: 60s" },
  { label: "Market Pulse",      cadence: "30 sec",        note: "Client refresh" },
  { label: "Exchange Flow",     cadence: "90 sec",        note: "Simulation cadence" },
  { label: "Provider Status",   cadence: "On load",       note: "Server-rendered" },
  { label: "Alert Engine",      cadence: "On load",       note: "Mock generation" },
  { label: "Daily Brief",       cadence: "Per session",   note: "Hour-based generation" },
];

function ProviderRow({ p }: { p: ProviderHealth }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 border-b border-zinc-900/60 last:border-0">
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1 ${STATUS_DOT[p.status] ?? "bg-zinc-700"}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white text-[11px] font-medium">{p.name}</span>
          <span className="text-zinc-700 text-[9px] font-mono">{CATEGORY_LABEL[p.category] ?? p.category}</span>
          <span className={`text-[9px] font-mono uppercase ${STATUS_COLOR[p.status] ?? "text-zinc-500"}`}>
            {p.status}
          </span>
        </div>
        <p className="text-zinc-500 text-[10px] leading-relaxed mt-0.5">{p.description}</p>
      </div>
      <div className="shrink-0 text-right">
        {p.avgLatencyMs > 0 && (
          <p className="text-zinc-400 text-[10px] font-mono tabular-nums">{p.avgLatencyMs}ms</p>
        )}
        {p.uptimePct > 0 && (
          <p className="text-zinc-700 text-[9px] font-mono">{p.uptimePct}% up</p>
        )}
        {p.fallbackCount > 0 && (
          <p className="text-amber-600 text-[9px] font-mono">{p.fallbackCount} fallbacks</p>
        )}
      </div>
    </div>
  );
}

export default function SystemStatusClient({
  summary,
  emailConfigured = false,
}: {
  summary: ProviderHealthSummary;
  emailConfigured?: boolean;
}) {
  const { providers, healthyCount, degradedCount, simulatedCount, plannedCount, avgUptimePct, systemHealthScore, generatedAt } = summary;

  const scoreColor =
    systemHealthScore >= 80 ? "text-emerald-400" :
    systemHealthScore >= 50 ? "text-amber-400"   : "text-red-400";

  return (
    <div className="space-y-8">

      {/* ─── Health Score ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "System Health",  value: `${systemHealthScore}%`, color: scoreColor },
          { label: "Healthy",        value: healthyCount,            color: "text-emerald-400" },
          { label: "Simulated",      value: simulatedCount,          color: "text-amber-400" },
          { label: "Planned",        value: plannedCount,            color: "text-zinc-500" },
          { label: "Avg Uptime",     value: `${avgUptimePct}%`,      color: "text-white" },
        ].map(m => (
          <div key={m.label} className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-3">
            <p className="text-zinc-700 text-[8px] font-mono uppercase tracking-wider mb-1">{m.label}</p>
            <p className={`text-xl font-semibold font-mono tabular-nums ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* ─── Provider Health Grid ──────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest">Provider Health</p>
          <div className="flex-1 h-px bg-zinc-900" />
          <p className="text-zinc-700 text-[9px] font-mono">{providers.length} providers</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm overflow-hidden">
          {providers.map(p => <ProviderRow key={p.id} p={p} />)}
        </div>
      </div>

      {/* ─── Refresh Cadence ───────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest">Refresh Cadence</p>
          <div className="flex-1 h-px bg-zinc-900" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {REFRESH_CADENCE.map(r => (
            <div key={r.label} className="bg-zinc-950 border border-zinc-800/60 rounded-sm px-3 py-2.5">
              <p className="text-zinc-600 text-[8px] font-mono uppercase tracking-wider mb-0.5">{r.label}</p>
              <p className="text-white text-[11px] font-mono">{r.cadence}</p>
              <p className="text-zinc-700 text-[9px]">{r.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Live Feed Status ──────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest">Live Feed Status</p>
          <div className="flex-1 h-px bg-zinc-900" />
        </div>
        <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm divide-y divide-zinc-900/60">
          {[
            { feed: "Signal Feed",       endpoint: "/api/live/signals",         status: "active",    note: "Mock signals, refreshed per request" },
            { feed: "News Catalysts",    endpoint: "/api/live/news",            status: "active",    note: "Live or simulated per SPORTS_NEWS_API_KEY" },
            { feed: "Odds Movements",    endpoint: "/api/live/odds",            status: "active",    note: "Live or simulated per THE_ODDS_API_KEY" },
            { feed: "Market Pulse",      endpoint: "/api/live/market-pulse",    status: "active",    note: "Mock pulse data" },
            { feed: "Exchange Flow",     endpoint: "/api/exchange/flow",        status: "simulated", note: "Simulated — awaiting live exchange feeds" },
            { feed: "Order Book",        endpoint: "/api/exchange/orderbook",   status: "simulated", note: "Simulated — Betfair adapter pending" },
            { feed: "Provider Status",   endpoint: "/api/live/provider-status", status: "active",    note: "Reflects actual env config" },
            { feed: "Alerts",            endpoint: "/api/alerts",              status: "active",    note: "Mock alert generation" },
            { feed: "Distribution",      endpoint: "/api/distribution/posts",   status: "active",    note: "Cloud + localStorage dual mode" },
          ].map(row => (
            <div key={row.endpoint} className="flex items-center gap-3 px-4 py-2.5">
              <span className={`w-1 h-1 rounded-full shrink-0 ${row.status === "active" ? "bg-emerald-400" : "bg-amber-400"}`} />
              <span className="text-zinc-300 text-[10px] w-32 shrink-0">{row.feed}</span>
              <span className="text-zinc-600 text-[9px] font-mono flex-1">{row.endpoint}</span>
              <span className="text-zinc-500 text-[9px] shrink-0 hidden sm:block">{row.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── AI Engine State ───────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest">AI Engine State</p>
          <div className="flex-1 h-px bg-zinc-900" />
          <span className="text-emerald-400 text-[9px] font-mono">ONLINE</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            { module: "Regime Assessment",     status: "live",      note: "Market regime classification" },
            { module: "Market Narrative",      status: "live",      note: "AI-generated sport narratives" },
            { module: "Daily Brief",           status: "live",      note: "Morning / midday / overnight" },
            { module: "Opportunity Scanner",   status: "live",      note: "Signal pattern detection" },
            { module: "Liquidity Analysis",    status: "live",      note: "Exchange liquidity intelligence" },
            { module: "Volatility Engine",     status: "live",      note: "IV surface and spike detection" },
            { module: "Behaviour Intelligence",status: "live",      note: "Sharp vs retail flow analysis" },
            { module: "Signal Generator",      status: "live",      note: "Creator share card generation" },
            { module: "Social Adapters",       status: "mock-only", note: "OAuth not yet connected" },
          ].map(m => (
            <div key={m.module} className="bg-zinc-950 border border-zinc-800/60 rounded-sm px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={`w-1 h-1 rounded-full ${m.status === "live" ? "bg-emerald-400" : "bg-amber-400"}`} />
                <p className="text-white text-[10px] font-medium">{m.module}</p>
              </div>
              <p className="text-zinc-600 text-[9px]">{m.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Distribution System Status ────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest">Distribution System</p>
          <div className="flex-1 h-px bg-zinc-900" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { label: "Export Engine",       status: "live",    color: "text-emerald-400" },
            { label: "Queue Persistence",   status: "live",    color: "text-emerald-400" },
            { label: "Cloud Sync",          status: "live",    color: "text-emerald-400" },
            { label: "Social Posting",      status: "mock",    color: "text-amber-400" },
          ].map(d => (
            <div key={d.label} className="bg-zinc-950 border border-zinc-800/60 rounded-sm px-3 py-2.5">
              <p className="text-zinc-600 text-[8px] font-mono uppercase tracking-wider mb-0.5">{d.label}</p>
              <p className={`text-[10px] font-mono font-medium ${d.color}`}>{d.status.toUpperCase()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Fallback Events ───────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest">Fallback Events</p>
          <div className="flex-1 h-px bg-zinc-900" />
        </div>
        <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm divide-y divide-zinc-900/60">
          {providers.filter(p => p.fallbackCount > 0).length === 0 ? (
            <p className="text-zinc-700 text-[10px] font-mono px-4 py-3">No fallback events recorded.</p>
          ) : providers.filter(p => p.fallbackCount > 0).map(p => (
            <div key={p.id} className="flex items-center gap-3 px-4 py-2.5">
              <span className="text-amber-400 text-[9px] font-mono shrink-0">{p.fallbackCount}x</span>
              <span className="text-zinc-300 text-[10px]">{p.name}</span>
              <span className="text-zinc-600 text-[9px] flex-1">→ mock fallback</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Notification System ───────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest">Notification System</p>
          <div className="flex-1 h-px bg-zinc-900" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {[
            { label: "In-App Delivery", status: "active",  color: "text-emerald-400", note: "Always available" },
            {
              label:  "Email (Resend)",
              status: emailConfigured ? "ready"   : "pending",
              color:  emailConfigured ? "text-emerald-400" : "text-zinc-500",
              note:   emailConfigured ? "Resend connected"  : "Resend not connected",
            },
            { label: "Telegram Bot",         status: "pending", color: "text-zinc-500",    note: "Bot not connected" },
            { label: "Web Push",             status: "pending", color: "text-zinc-500",    note: "Permission required" },
            { label: "Creator Broadcast",    status: "mock",    color: "text-amber-400",   note: "Simulated queue" },
          ].map(d => (
            <div key={d.label} className="bg-zinc-950 border border-zinc-800/60 rounded-sm px-3 py-2.5">
              <p className="text-zinc-600 text-[8px] font-mono uppercase tracking-wider mb-0.5">{d.label}</p>
              <p className={`text-[10px] font-mono font-medium ${d.color}`}>{d.status.toUpperCase()}</p>
              <p className="text-zinc-700 text-[9px]">{d.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Email Delivery ────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest">Email Delivery</p>
          <div className="flex-1 h-px bg-zinc-900" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            {
              label:  "Resend API",
              status: emailConfigured ? "active"  : "pending",
              color:  emailConfigured ? "text-emerald-400" : "text-zinc-500",
              note:   emailConfigured ? "Connected" : "Set RESEND_API_KEY to activate",
            },
            {
              label:  "Email Queue",
              status: emailConfigured ? "active"  : "pending",
              color:  emailConfigured ? "text-emerald-400" : "text-zinc-500",
              note:   "notification_events table",
            },
            { label: "Preview Page", status: "active", color: "text-emerald-400", note: "/email-preview (noindex)" },
          ].map(d => (
            <div key={d.label} className="bg-zinc-950 border border-zinc-800/60 rounded-sm px-3 py-2.5">
              <p className="text-zinc-600 text-[8px] font-mono uppercase tracking-wider mb-0.5">{d.label}</p>
              <p className={`text-[10px] font-mono font-medium ${d.color}`}>{d.status.toUpperCase()}</p>
              <p className="text-zinc-700 text-[9px]">{d.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Daily Brief Engine ────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest">Daily Brief Engine</p>
          <div className="flex-1 h-px bg-zinc-900" />
          <span className="text-emerald-400 text-[9px] font-mono">OPERATIONAL</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            { label: "Engine Status",          status: "OPERATIONAL", color: "text-emerald-400", note: "briefGeneration.ts active" },
            { label: "Session Detection",      status: "ACTIVE",      color: "text-emerald-400", note: "Morning / Midday / Overnight auto" },
            { label: "Persistence Layer",      status: "ACTIVE",      color: "text-emerald-400", note: "daily_briefs + sections tables" },
            { label: "Scoring Engine",         status: "ACTIVE",      color: "text-emerald-400", note: "briefScoring.ts — deterministic" },
            { label: "Creator Opportunities",  status: "ACTIVE",      color: "text-emerald-400", note: "Injected per brief generation" },
            { label: "Email Queue",            status: emailConfigured ? "READY" : "PENDING", color: emailConfigured ? "text-emerald-400" : "text-zinc-500", note: emailConfigured ? "notification_events channel" : "Resend not connected" },
          ].map(d => (
            <div key={d.label} className="bg-zinc-950 border border-zinc-800/60 rounded-sm px-3 py-2.5">
              <p className="text-zinc-600 text-[8px] font-mono uppercase tracking-wider mb-0.5">{d.label}</p>
              <p className={`text-[10px] font-mono font-medium ${d.color}`}>{d.status}</p>
              <p className="text-zinc-700 text-[9px]">{d.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Activity Tracking ─────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest">Activity Tracking</p>
          <div className="flex-1 h-px bg-zinc-900" />
          <span className="text-emerald-400 text-[9px] font-mono">ACTIVE</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { label: "Event Tracking",    status: "ACTIVE",  color: "text-emerald-400", note: "user_activity_events" },
            { label: "Daily Rollup",      status: "ACTIVE",  color: "text-emerald-400", note: "user_activity_daily" },
            { label: "Retention Scoring", status: "ACTIVE",  color: "text-emerald-400", note: "retentionScoring.ts" },
            { label: "Route Tracker",     status: "ACTIVE",  color: "text-emerald-400", note: "ActivityTracker.tsx" },
          ].map(d => (
            <div key={d.label} className="bg-zinc-950 border border-zinc-800/60 rounded-sm px-3 py-2.5">
              <p className="text-zinc-600 text-[8px] font-mono uppercase tracking-wider mb-0.5">{d.label}</p>
              <p className={`text-[10px] font-mono font-medium ${d.color}`}>{d.status}</p>
              <p className="text-zinc-700 text-[9px]">{d.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── API Gateway ───────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest">API Gateway</p>
          <div className="flex-1 h-px bg-zinc-900" />
          <span className="text-emerald-400 text-[9px] font-mono">ACTIVE</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { label: "Key Auth",         status: "ACTIVE",    color: "text-emerald-400", note: "SHA-256 hash lookup" },
            { label: "Plan Enforcement", status: "ACTIVE",    color: "text-emerald-400", note: "free·partner·api tiers" },
            { label: "Quota Engine",     status: "ACTIVE",    color: "text-emerald-400", note: "100·1k·10k daily" },
            { label: "v1 Endpoints",     status: "3 LIVE",    color: "text-blue-400",    note: "signals·pulse·brief" },
          ].map(d => (
            <div key={d.label} className="bg-zinc-950 border border-zinc-800/60 rounded-sm px-3 py-2.5">
              <p className="text-zinc-600 text-[8px] font-mono uppercase tracking-wider mb-0.5">{d.label}</p>
              <p className={`text-[10px] font-mono font-medium ${d.color}`}>{d.status}</p>
              <p className="text-zinc-700 text-[9px]">{d.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Exchange Routing Layer ────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest">Exchange Routing Layer</p>
          <div className="flex-1 h-px bg-zinc-900" />
          <span className="text-emerald-400 text-[9px] font-mono">ACTIVE</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { label: "Betfair Exchange",   status: "ROUTING",    color: "text-emerald-400", note: "Outbound links active" },
            { label: "Affiliate Layer",    status: "READY",      color: "text-emerald-400", note: "NEXT_PUBLIC_BETFAIR_AFFILIATE_ID" },
            { label: "Click Tracking",     status: "ACTIVE",     color: "text-emerald-400", note: "localStorage ring-buffer" },
            { label: "Execution",          status: "ON BETFAIR", color: "text-zinc-500",    note: "No custody — read-only" },
          ].map(d => (
            <div key={d.label} className="bg-zinc-950 border border-zinc-800/60 rounded-sm px-3 py-2.5">
              <p className="text-zinc-600 text-[8px] font-mono uppercase tracking-wider mb-0.5">{d.label}</p>
              <p className={`text-[10px] font-mono font-medium ${d.color}`}>{d.status}</p>
              <p className="text-zinc-700 text-[9px]">{d.note}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 bg-zinc-950 border border-zinc-800/60 rounded-sm divide-y divide-zinc-900/60">
          {[
            { sport: "Horse Racing", status: "routed", note: "Betfair Exchange — UK & Irish racing" },
            { sport: "Tennis",       status: "routed", note: "Betfair Exchange — ATP & WTA" },
            { sport: "Football",     status: "routed", note: "Betfair Exchange — European leagues" },
            { sport: "NBA / NFL / UFC", status: "routed", note: "Betfair Exchange — American / combat sports" },
            { sport: "Prediction Markets", status: "unsupported", note: "Not available on Betfair Exchange" },
          ].map(row => (
            <div key={row.sport} className="flex items-center gap-3 px-4 py-2">
              <span className={`w-1 h-1 rounded-full shrink-0 ${row.status === "routed" ? "bg-emerald-400" : "bg-zinc-700"}`} />
              <span className="text-zinc-300 text-[10px] w-40 shrink-0">{row.sport}</span>
              <span className="text-zinc-600 text-[9px] flex-1">{row.note}</span>
              <span className={`text-[9px] font-mono ${row.status === "routed" ? "text-emerald-600" : "text-zinc-700"}`}>
                {row.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Footer ────────────────────────────────────────────────── */}
      <div className="border-t border-zinc-900/60 pt-4 flex items-center justify-between">
        <p className="text-zinc-700 text-[9px] font-mono">
          Generated: {new Date(generatedAt).toLocaleTimeString()} ·
          Market intelligence only · Not financial advice
        </p>
        <Link
          href="/terminal"
          className="text-zinc-600 text-[9px] font-mono hover:text-zinc-400 transition-colors"
        >
          ← Terminal
        </Link>
      </div>
    </div>
  );
}
