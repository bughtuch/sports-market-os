"use client";

import { useEffect, useState, useCallback } from "react";
import type { NotificationPreferences, QuietHours } from "@/lib/notifications/notificationTypes";
import { CHANNEL_STATUS, DEFAULT_PREFERENCES } from "@/lib/notifications/notificationTypes";

// ─── Toggle row ───────────────────────────────────────────────────────────────

function ToggleRow({
  label,
  description,
  value,
  onChange,
  badge,
  badgeColor,
  disabled,
}: {
  label:        string;
  description?: string;
  value:        boolean;
  onChange:     (v: boolean) => void;
  badge?:       string;
  badgeColor?:  string;
  disabled?:    boolean;
}) {
  return (
    <div className={`flex items-start justify-between gap-4 py-3 border-b border-zinc-900/60 last:border-0 ${disabled ? "opacity-50" : ""}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-[11px] font-medium ${value && !disabled ? "text-white" : "text-zinc-400"}`}>{label}</span>
          {badge && (
            <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded-sm border ${badgeColor ?? "text-zinc-500 border-zinc-700 bg-zinc-900"}`}>
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="text-zinc-600 text-[10px] leading-snug">{description}</p>
        )}
      </div>
      <button
        onClick={() => !disabled && onChange(!value)}
        disabled={disabled}
        className={`shrink-0 w-10 h-5 rounded-full border transition-all duration-200 relative ${
          value && !disabled
            ? "bg-white border-white"
            : "bg-zinc-900 border-zinc-700"
        } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
        aria-pressed={value}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200 ${
            value && !disabled ? "left-5 bg-black" : "left-0.5 bg-zinc-600"
          }`}
        />
      </button>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ label }: { label: string }) {
  return (
    <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-3 pt-5 first:pt-0">
      {label}
    </p>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function NotificationSettingsClient() {
  const [prefs,   setPrefs]   = useState<NotificationPreferences>({ ...DEFAULT_PREFERENCES, user_id: "" });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/notifications/preferences")
      .then(r => r.json())
      .then((d: { preferences?: NotificationPreferences }) => {
        if (d.preferences) setPrefs(d.preferences);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  function update<K extends keyof NotificationPreferences>(key: K, value: NotificationPreferences[K]) {
    setPrefs(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function updateQuietHours(patch: Partial<QuietHours>) {
    setPrefs(prev => ({ ...prev, quiet_hours: { ...prev.quiet_hours, ...patch } }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/notifications/preferences", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(prefs),
      });
      const json = await res.json() as { error?: string };
      if (!res.ok || json.error) {
        setError(json.error ?? "Failed to save");
      } else {
        setSaved(true);
      }
    } catch {
      setError("Network error — preferences not saved. Supabase may not be configured.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-3 max-w-xl">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-zinc-900 rounded-sm animate-pulse" />
        ))}
      </div>
    );
  }

  const quietHours = prefs.quiet_hours ?? {};

  return (
    <div className="max-w-xl space-y-1">

      {/* ─── Delivery Channels ───────────────────────────────────────────── */}
      <SectionHeader label="Delivery Channels" />
      <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm px-4 divide-y-0">
        <ToggleRow
          label="In-App"
          description="Alerts and notifications in the terminal. Always active."
          value={true}
          onChange={() => {}}
          disabled={true}
          badge="Always on"
          badgeColor="text-emerald-600 border-emerald-900 bg-emerald-950/30"
        />
        <ToggleRow
          label="Email"
          description="Delivered via Resend. Requires email setup."
          value={prefs.email_enabled}
          onChange={(v) => update("email_enabled", v)}
          badge={CHANNEL_STATUS.email === "pending" ? "Setup required" : "Active"}
          badgeColor="text-zinc-500 border-zinc-700 bg-zinc-900"
        />
        <ToggleRow
          label="Telegram"
          description="Delivered via Telegram bot. Bot must be connected first."
          value={prefs.telegram_enabled}
          onChange={(v) => update("telegram_enabled", v)}
          badge="Bot not connected"
          badgeColor="text-zinc-500 border-zinc-700 bg-zinc-900"
        />
        <ToggleRow
          label="Push Notifications"
          description="Browser push. Requires browser permission grant."
          value={prefs.push_enabled}
          onChange={(v) => update("push_enabled", v)}
          badge="Permission required"
          badgeColor="text-zinc-500 border-zinc-700 bg-zinc-900"
        />
      </div>

      {/* ─── Alert Categories ────────────────────────────────────────────── */}
      <SectionHeader label="Alert Categories" />
      <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm px-4 divide-y-0">
        <ToggleRow
          label="Volatility Alerts"
          description="IV spikes, queue deterioration, and spread widening events."
          value={prefs.volatility_alerts}
          onChange={(v) => update("volatility_alerts", v)}
        />
        <ToggleRow
          label="Catalyst Alerts"
          description="High-severity news, injury reports, and catalyst injections."
          value={prefs.catalyst_alerts}
          onChange={(v) => update("catalyst_alerts", v)}
        />
        <ToggleRow
          label="Queue Health Alerts"
          description="Betfair queue deterioration and liquidity anomaly warnings."
          value={prefs.queue_alerts}
          onChange={(v) => update("queue_alerts", v)}
        />
        <ToggleRow
          label="Creator Notifications"
          description="Export ready, broadcast confirmations, distribution events."
          value={prefs.creator_alerts}
          onChange={(v) => update("creator_alerts", v)}
        />
      </div>

      {/* ─── Daily Brief ─────────────────────────────────────────────────── */}
      <SectionHeader label="Daily Brief Delivery" />
      <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm px-4">
        <ToggleRow
          label="Daily Intelligence Brief"
          description="Morning, midday, and overnight brief delivery notifications."
          value={prefs.daily_brief_enabled}
          onChange={(v) => update("daily_brief_enabled", v)}
        />
      </div>

      {/* ─── Quiet Hours ─────────────────────────────────────────────────── */}
      <SectionHeader label="Quiet Hours" />
      <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm px-4">
        <ToggleRow
          label="Enable Quiet Hours"
          description="Suppress non-critical notifications during a time window. Critical alerts always deliver."
          value={quietHours.enabled ?? false}
          onChange={(v) => updateQuietHours({ enabled: v })}
        />
        {quietHours.enabled && (
          <div className="flex items-center gap-4 pb-3 pt-1">
            <div>
              <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider block mb-1">From (UTC)</label>
              <input
                type="time"
                value={quietHours.from ?? "22:00"}
                onChange={(e) => updateQuietHours({ from: e.target.value })}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono px-3 py-1.5 rounded-sm focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div>
              <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider block mb-1">To (UTC)</label>
              <input
                type="time"
                value={quietHours.to ?? "07:00"}
                onChange={(e) => updateQuietHours({ to: e.target.value })}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono px-3 py-1.5 rounded-sm focus:outline-none focus:border-zinc-600"
              />
            </div>
            <p className="text-zinc-700 text-[9px] font-mono self-end pb-2">All times UTC</p>
          </div>
        )}
      </div>

      {/* ─── Watchlist Notifications ──────────────────────────────────────── */}
      <SectionHeader label="Watchlist Notifications" />
      <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm px-4">
        <ToggleRow
          label="Watchlist Anomaly Alerts"
          description="Notify when watchlisted markets show significant movement or IV spikes."
          value={prefs.volatility_alerts}
          onChange={(v) => update("volatility_alerts", v)}
          badge="Uses volatility toggle"
          badgeColor="text-zinc-600 border-zinc-800 bg-zinc-900"
        />
      </div>

      {/* ─── Save ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-4">
        {error && <p className="text-red-400 text-[10px] font-mono">{error}</p>}
        {saved && !error && <p className="text-emerald-500 text-[10px] font-mono">Preferences saved.</p>}
        {!error && !saved && <span />}
        <button
          onClick={handleSave}
          disabled={saving}
          className="text-xs font-medium text-black bg-white px-6 py-2 rounded-sm hover:bg-zinc-200 transition-colors disabled:opacity-40"
        >
          {saving ? "Saving..." : "Save Preferences"}
        </button>
      </div>

      <p className="text-zinc-800 text-[9px] font-mono pt-2">
        Notification delivery is market intelligence only. No alerts constitute financial advice.
        Email and Telegram delivery require additional setup. In-app delivery is always active.
      </p>
    </div>
  );
}
