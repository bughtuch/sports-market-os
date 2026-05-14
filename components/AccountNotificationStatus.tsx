"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { QueueStats } from "@/lib/notifications/notificationTypes";
import type { NotificationPreferences } from "@/lib/notifications/notificationTypes";

interface EventsResponse {
  stats: QueueStats | null;
}

export default function AccountNotificationStatus() {
  const [prefs,  setPrefs]  = useState<NotificationPreferences | null>(null);
  const [stats,  setStats]  = useState<QueueStats | null>(null);
  const [loading,setLoading]= useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/notifications/preferences").then(r => r.json()),
      fetch("/api/notifications/events").then(r => r.json()),
    ])
      .then(([p, e]) => {
        const pd = p as { preferences?: NotificationPreferences };
        const ed = e as EventsResponse;
        if (pd.preferences) setPrefs(pd.preferences);
        if (ed.stats)       setStats(ed.stats);
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

  const enabledChannels = prefs
    ? [
        "in-app",
        prefs.email_enabled    && "email",
        prefs.telegram_enabled && "telegram",
        prefs.push_enabled     && "push",
      ].filter(Boolean)
    : ["in-app"];

  return (
    <div className="space-y-3 max-w-xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-3">
          <p className="text-zinc-700 text-[8px] font-mono uppercase tracking-wider mb-1">Active Channels</p>
          <p className="text-white text-lg font-bold tabular-nums">{enabledChannels.length}</p>
          <p className="text-zinc-700 text-[9px] font-mono truncate">{enabledChannels.join(", ")}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-3">
          <p className="text-zinc-700 text-[8px] font-mono uppercase tracking-wider mb-1">Queued</p>
          <p className={`text-lg font-bold tabular-nums ${(stats?.queued ?? 0) > 0 ? "text-amber-400" : "text-zinc-600"}`}>
            {stats?.queued ?? 0}
          </p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-3">
          <p className="text-zinc-700 text-[8px] font-mono uppercase tracking-wider mb-1">Delivered</p>
          <p className="text-emerald-400 text-lg font-bold tabular-nums">{stats?.delivered ?? 0}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-3">
          <p className="text-zinc-700 text-[8px] font-mono uppercase tracking-wider mb-1">Failed</p>
          <p className={`text-lg font-bold tabular-nums ${(stats?.failed ?? 0) > 0 ? "text-red-400" : "text-zinc-600"}`}>
            {stats?.failed ?? 0}
          </p>
        </div>
      </div>

      {prefs && !prefs.email_enabled && !prefs.telegram_enabled && !prefs.push_enabled && (
        <div className="bg-zinc-950 border border-zinc-700/40 rounded-sm p-3 flex items-start gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1" />
          <div>
            <p className="text-zinc-400 text-[11px] font-medium mb-0.5">Only in-app delivery is active</p>
            <p className="text-zinc-600 text-[10px]">Enable email, Telegram, or push in notification settings to receive off-platform alerts.</p>
            <Link href="/notification-settings" className="text-zinc-500 text-[9px] font-mono hover:text-zinc-300 transition-colors">
              Configure notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
