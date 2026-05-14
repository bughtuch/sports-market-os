"use client";

import { useEffect, useState } from "react";

interface EmailStats {
  queued:      number;
  delivered:   number;
  failed:      number;
  retrying:    number;
  total:       number;
  oldestQueued: string | null;
}

interface QueueResponse {
  stats:           EmailStats;
  emailConfigured: boolean;
}

type TestState = "idle" | "sending" | "sent" | "error";

export default function AdminEmailMonitoring() {
  const [data, setData]         = useState<QueueResponse | null>(null);
  const [loading, setLoading]   = useState(true);
  const [testState, setTestState] = useState<TestState>("idle");
  const [testMsg, setTestMsg]   = useState("");

  useEffect(() => {
    fetch("/api/email/queue")
      .then((r) => r.json())
      .then((d: QueueResponse) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function sendTestEmail() {
    setTestState("sending");
    setTestMsg("");
    try {
      const res  = await fetch("/api/email/test", { method: "POST" });
      const body = await res.json() as { sent?: boolean; skipped?: boolean; to?: string; error?: string };
      if (body.sent) {
        setTestState("sent");
        setTestMsg(`Delivered to ${body.to}`);
      } else if (body.skipped) {
        setTestState("error");
        setTestMsg("Resend not configured");
      } else {
        setTestState("error");
        setTestMsg(body.error ?? "Unknown error");
      }
    } catch {
      setTestState("error");
      setTestMsg("Request failed");
    }
  }

  const stats = data?.stats;
  const configured = data?.emailConfigured ?? false;

  const deliveryRate = stats && stats.total > 0
    ? Math.round((stats.delivered / stats.total) * 100)
    : null;

  const healthState = !configured
    ? { label: "NOT CONFIGURED", color: "text-zinc-500" }
    : stats?.failed && stats.failed > 0
      ? { label: "DEGRADED", color: "text-red-400" }
      : stats?.queued && stats.queued > 0
        ? { label: "QUEUE BACKED UP", color: "text-amber-400" }
        : { label: "OPERATIONAL", color: "text-emerald-400" };

  return (
    <section id="email" className="border border-zinc-800 rounded-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${configured ? "bg-emerald-400" : "bg-zinc-600"}`} />
          <h2 className="text-xs font-mono font-bold text-white tracking-widest uppercase">
            Email Monitoring
          </h2>
        </div>
        <span className={`text-[10px] font-mono font-bold tracking-widest ${healthState.color}`}>
          {loading ? "LOADING" : healthState.label}
        </span>
      </div>

      {/* Config status + test button */}
      <div className="mb-6 p-3 border border-zinc-800 rounded-sm">
        <p className="text-[9px] font-mono text-zinc-500 tracking-widest uppercase mb-2">Resend Integration</p>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${configured ? "bg-emerald-400" : "bg-zinc-600"}`} />
            <span className={`text-xs font-mono ${configured ? "text-emerald-400" : "text-zinc-500"}`}>
              {configured ? "RESEND_API_KEY configured — email active" : "RESEND_API_KEY not set — email suppressed"}
            </span>
          </div>
          {configured && (
            <div className="flex items-center gap-3">
              <button
                onClick={sendTestEmail}
                disabled={testState === "sending"}
                className="text-[10px] font-mono px-3 py-1 border border-zinc-700 text-zinc-300 rounded-sm hover:border-zinc-500 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {testState === "sending" ? "Sending…" : "Send Test Email"}
              </button>
              {testMsg && (
                <span className={`text-[10px] font-mono ${testState === "sent" ? "text-emerald-400" : "text-red-400"}`}>
                  {testState === "sent" ? "✓ " : "✗ "}{testMsg}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div className="text-xs font-mono text-zinc-600 animate-pulse">Loading queue data...</div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Queued",    val: stats.queued,    color: "text-amber-400" },
              { label: "Delivered", val: stats.delivered, color: "text-emerald-400" },
              { label: "Failed",    val: stats.failed,    color: "text-red-400" },
              { label: "Total",     val: stats.total,     color: "text-white" },
            ].map(({ label, val, color }) => (
              <div key={label} className="border border-zinc-800 rounded-sm p-3">
                <p className="text-[9px] font-mono text-zinc-500 tracking-widest uppercase mb-1">{label}</p>
                <p className={`text-xl font-mono font-bold ${color}`}>{val}</p>
              </div>
            ))}
          </div>

          {deliveryRate !== null && (
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-[9px] font-mono text-zinc-500 tracking-widest uppercase">Delivery Rate</span>
                <span className="text-[10px] font-mono text-white">{deliveryRate}%</span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-1">
                <div
                  className={`h-1 rounded-full transition-all ${deliveryRate >= 95 ? "bg-emerald-400" : deliveryRate >= 80 ? "bg-amber-400" : "bg-red-400"}`}
                  style={{ width: `${deliveryRate}%` }}
                />
              </div>
            </div>
          )}

          {stats.oldestQueued && (
            <p className="text-[10px] font-mono text-zinc-500">
              Oldest queued: {new Date(stats.oldestQueued).toLocaleString()}
            </p>
          )}

          {stats.failed > 0 && (
            <div className="mt-4 p-3 border border-red-900 rounded-sm">
              <p className="text-[10px] font-mono text-red-400">
                {stats.failed} email{stats.failed !== 1 ? "s" : ""} failed delivery — check Resend dashboard for bounce/rejection details.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-xs font-mono text-zinc-600">No data available (user must be authenticated)</div>
      )}

      {/* Channel map */}
      <div className="mt-6 pt-4 border-t border-zinc-800">
        <p className="text-[9px] font-mono text-zinc-500 tracking-widest uppercase mb-3">Delivery Architecture</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            { label: "Resend API", status: configured ? "active" : "pending", note: configured ? "Connected" : "Needs RESEND_API_KEY" },
            { label: "Email Channel", status: configured ? "active" : "pending", note: "notification_events" },
            { label: "Preview Page", status: "active", note: "/email-preview (noindex)" },
          ].map(({ label, status, note }) => (
            <div key={label} className="flex items-start gap-2 p-2 border border-zinc-800 rounded-sm">
              <div className={`w-1.5 h-1.5 rounded-full mt-0.5 flex-shrink-0 ${status === "active" ? "bg-emerald-400" : "bg-zinc-600"}`} />
              <div>
                <p className="text-[10px] font-mono text-white">{label}</p>
                <p className="text-[9px] font-mono text-zinc-500">{note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
