"use client";

import { useState } from "react";
import type {
  PersistentAlertType,
  PersistentSeverity,
  CreateAlertRulePayload,
} from "@/lib/alerts/persistent/persistentAlertTypes";
import {
  PERSISTENT_ALERT_TYPES,
  PERSISTENT_SEVERITY_LEVELS,
  DEFAULT_THRESHOLDS,
} from "@/lib/alerts/persistent/persistentAlertTypes";

const SPORT_OPTIONS = [
  "Horse Racing", "Tennis", "NBA", "NFL", "UFC", "Football", "Prediction Markets",
];

const THRESHOLD_LABELS: Partial<Record<PersistentAlertType, string>> = {
  "volatility-spike":    "Volatility threshold (σ)",
  "queue-deterioration": "Queue health threshold (0–1)",
  "ai-confidence":       "AI confidence threshold (%)",
  "exchange-flow-shift": "Flow percentile threshold (0–100)",
  "liquidity-anomaly":   "Liquidity depth threshold (0–1)",
};

const SEVERITY_COLOR: Record<PersistentSeverity, string> = {
  low:      "text-zinc-400",
  medium:   "text-blue-400",
  high:     "text-amber-400",
  critical: "text-red-400",
};

interface Props {
  open:       boolean;
  onClose:    () => void;
  onCreated:  () => void;
  initialSport?: string;
}

export default function CreateAlertRuleModal({ open, onClose, onCreated, initialSport }: Props) {
  const [alertType, setAlertType] = useState<PersistentAlertType>("volatility-spike");
  const [severity,  setSeverity]  = useState<PersistentSeverity>("medium");
  const [sport,     setSport]     = useState(initialSport ?? "");
  const [threshold, setThreshold] = useState<string>("");
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  if (!open) return null;

  const thresholdLabel  = THRESHOLD_LABELS[alertType];
  const defaultThreshold = DEFAULT_THRESHOLDS[alertType];
  const showThreshold    = !!thresholdLabel;

  async function handleSubmit() {
    setError(null);
    setSaving(true);

    const payload: CreateAlertRulePayload = {
      alert_type: alertType,
      severity,
      sport:      sport || undefined,
      threshold:  threshold ? parseFloat(threshold) : defaultThreshold,
    };

    try {
      const res = await fetch("/api/alerts/rules", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", payload }),
      });
      const json = await res.json() as { error?: string };
      if (!res.ok || json.error) {
        setError(json.error ?? "Failed to create rule");
      } else {
        onCreated();
        onClose();
        resetForm();
      }
    } catch {
      setError("Network error — rule not saved. Supabase may not be configured.");
    } finally {
      setSaving(false);
    }
  }

  function resetForm() {
    setAlertType("volatility-spike");
    setSeverity("medium");
    setSport(initialSport ?? "");
    setThreshold("");
    setError(null);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800/60 rounded-sm shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-900">
          <div>
            <p className="text-white text-sm font-semibold">Create Alert Rule</p>
            <p className="text-zinc-600 text-[10px] font-mono mt-0.5">Saved to your persistent alert infrastructure</p>
          </div>
          <button onClick={handleClose} className="text-zinc-600 hover:text-zinc-300 text-lg leading-none">×</button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-4">

          {/* Alert type */}
          <div>
            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">
              Alert Type
            </label>
            <div className="space-y-1.5">
              {PERSISTENT_ALERT_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setAlertType(t.id); setThreshold(""); }}
                  className={`w-full text-left px-3 py-2.5 border rounded-sm transition-all ${
                    alertType === t.id
                      ? "border-white/20 bg-zinc-900"
                      : "border-zinc-800/60 bg-zinc-950/50 hover:border-zinc-700/60"
                  }`}
                >
                  <p className={`text-[11px] font-medium ${alertType === t.id ? "text-white" : "text-zinc-400"}`}>{t.label}</p>
                  <p className={`text-[10px] ${alertType === t.id ? "text-zinc-500" : "text-zinc-700"}`}>{t.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Sport (optional) */}
          <div>
            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">
              Sport <span className="text-zinc-700">(optional — all sports if blank)</span>
            </label>
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800/60 text-zinc-300 text-xs font-mono px-3 py-2 rounded-sm focus:outline-none focus:border-zinc-600"
            >
              <option value="">All sports</option>
              {SPORT_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Threshold (conditional) */}
          {showThreshold && (
            <div>
              <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">
                {thresholdLabel} <span className="text-zinc-700">(default: {defaultThreshold})</span>
              </label>
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                placeholder={String(defaultThreshold ?? "")}
                step="0.1"
                className="w-full bg-zinc-900 border border-zinc-800/60 text-zinc-300 text-xs font-mono px-3 py-2 rounded-sm focus:outline-none focus:border-zinc-600 placeholder-zinc-700"
              />
            </div>
          )}

          {/* Severity */}
          <div>
            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">
              Severity
            </label>
            <div className="flex gap-2">
              {PERSISTENT_SEVERITY_LEVELS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSeverity(s)}
                  className={`flex-1 py-1.5 border rounded-sm text-[10px] font-mono uppercase transition-all ${
                    severity === s
                      ? `border-white/20 bg-zinc-900 ${SEVERITY_COLOR[s]}`
                      : "border-zinc-800/60 text-zinc-600 hover:border-zinc-700/60"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-[10px] font-mono">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-zinc-900">
          <button
            onClick={handleClose}
            className="text-zinc-500 text-xs font-mono hover:text-zinc-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="text-xs font-medium text-black bg-white px-5 py-1.5 rounded-sm hover:bg-zinc-200 transition-colors disabled:opacity-40"
          >
            {saving ? "Saving..." : "Create Rule"}
          </button>
        </div>
      </div>
    </div>
  );
}
