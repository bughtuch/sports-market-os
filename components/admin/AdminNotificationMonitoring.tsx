"use client";

import { useEffect, useState } from "react";
import type { QueueStats, DeliveryChannel } from "@/lib/notifications/notificationTypes";
import { CHANNEL_LABELS, STATUS_COLOR } from "@/lib/notifications/notificationTypes";

export default function AdminNotificationMonitoring() {
  const [stats,   setStats]   = useState<QueueStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications/queue")
      .then(r => r.json())
      .then((d: { stats?: QueueStats }) => { if (d.stats) setStats(d.stats); })
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

  const STATUSES: { key: keyof QueueStats; label: string }[] = [
    { key: "queued",    label: "Queued" },
    { key: "delivered", label: "Delivered" },
    { key: "failed",    label: "Failed" },
    { key: "retrying",  label: "Retrying" },
    { key: "skipped",   label: "Skipped" },
  ];

  return (
    <div className="space-y-5">
      {/* Volume summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {STATUSES.map(({ key, label }) => {
          const val = stats ? (stats[key] as number) : 0;
          const color = STATUS_COLOR[key as keyof typeof STATUS_COLOR] ?? "text-zinc-400";
          return (
            <div key={key} className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-3">
              <p className="text-zinc-600 text-[8px] font-mono uppercase tracking-widest mb-1">{label}</p>
              <p className={`text-xl font-bold tabular-nums ${val > 0 ? color : "text-zinc-700"}`}>{val}</p>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4 flex items-center justify-between">
        <div>
          <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest mb-1">Total Notification Events</p>
          <p className="text-white text-2xl font-bold tabular-nums">{stats?.total ?? 0}</p>
        </div>
        <div className="text-right">
          <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest mb-1">Queue Health</p>
          <p className={`text-sm font-mono font-semibold ${
            (stats?.failed ?? 0) === 0 ? "text-emerald-400" :
            (stats?.failed ?? 0) < 5  ? "text-amber-400"   : "text-red-400"
          }`}>
            {(stats?.failed ?? 0) === 0 ? "NOMINAL" :
             (stats?.failed ?? 0) < 5  ? "DEGRADED" : "FAILING"}
          </p>
        </div>
      </div>

      {/* Channel mix */}
      {stats?.channels && Object.keys(stats.channels).length > 0 ? (
        <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
          <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest mb-3">Channel Mix</p>
          <div className="space-y-2">
            {(Object.entries(stats.channels) as [DeliveryChannel, number][]).map(([channel, count]) => {
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={channel} className="flex items-center gap-3">
                  <span className="text-zinc-400 text-[10px] font-mono w-28 shrink-0">
                    {CHANNEL_LABELS[channel] ?? channel}
                  </span>
                  <div className="flex-1 h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-zinc-600 text-[9px] font-mono tabular-nums w-10 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-5">
          <p className="text-zinc-600 text-xs">
            No notification events yet. Events are created when alert rules trigger or daily briefs are queued.
            Supabase must be configured for persistence.
          </p>
        </div>
      )}

      {/* Delivery architecture note */}
      <div className="border border-zinc-900 rounded-sm p-4">
        <p className="text-zinc-700 text-[9px] font-mono uppercase tracking-widest mb-2">Delivery Architecture</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {[
            { channel: "In-App",            status: "Active",  color: "text-emerald-400" },
            { channel: "Email (Resend)",     status: "Pending", color: "text-zinc-500" },
            { channel: "Telegram Bot",       status: "Pending", color: "text-zinc-500" },
            { channel: "Web Push",           status: "Pending", color: "text-zinc-500" },
            { channel: "Creator Broadcast",  status: "Mock",    color: "text-amber-400" },
          ].map((d) => (
            <div key={d.channel} className="bg-zinc-950 border border-zinc-900 rounded-sm px-2.5 py-2">
              <p className="text-zinc-600 text-[8px] font-mono mb-0.5">{d.channel}</p>
              <p className={`text-[10px] font-mono font-semibold ${d.color}`}>{d.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
