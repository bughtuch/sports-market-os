"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type {
  UserPreferences,
  SportSelection,
  IntelligenceFocus,
  AlertPreference,
  ExportPlatform,
  OnboardingStepId,
} from "@/lib/onboarding/onboardingTypes";
import {
  DEFAULT_PREFERENCES,
  ONBOARDING_STEPS,
  PREFERENCES_STORAGE_KEY,
  ONBOARDING_STORAGE_KEY,
  ONBOARDING_PROGRESS_KEY,
} from "@/lib/onboarding/onboardingTypes";
import {
  SPORT_OPTIONS,
  FOCUS_OPTIONS,
  ALERT_OPTIONS,
  EXPORT_OPTIONS,
} from "@/lib/onboarding/onboardingConfig";

// ─── Step components ──────────────────────────────────────────────────────────

function StepHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-white text-xl font-semibold tracking-tight mb-1.5">{title}</h2>
      <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function SelectionChip({
  label,
  symbol,
  accent,
  description,
  selected,
  onClick,
}: {
  label: string;
  symbol?: string;
  accent?: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-4 border rounded-sm transition-all duration-150 ${
        selected
          ? "border-white/30 bg-zinc-900"
          : "border-zinc-800/60 bg-zinc-950 hover:border-zinc-700/60 hover:bg-zinc-900/50"
      }`}
    >
      <div className="flex items-start gap-3">
        {symbol && (
          <span className={`text-lg shrink-0 ${selected ? (accent ?? "text-white") : "text-zinc-600"}`}>
            {symbol}
          </span>
        )}
        <div className="min-w-0">
          <p className={`text-sm font-medium leading-tight ${selected ? "text-white" : "text-zinc-400"}`}>
            {label}
          </p>
          {description && (
            <p className={`text-[11px] leading-snug mt-1 ${selected ? "text-zinc-400" : "text-zinc-600"}`}>
              {description}
            </p>
          )}
        </div>
        <div className={`ml-auto shrink-0 w-3 h-3 rounded-full border transition-colors ${
          selected ? "bg-white border-white" : "border-zinc-700"
        }`} />
      </div>
    </button>
  );
}

// ─── Step: Sports ─────────────────────────────────────────────────────────────

function SportsStep({
  value,
  onChange,
}: {
  value: SportSelection[];
  onChange: (v: SportSelection[]) => void;
}) {
  const toggle = (id: SportSelection) => {
    onChange(value.includes(id) ? value.filter((s) => s !== id) : [...value, id]);
  };
  return (
    <>
      <StepHeader
        title="Your Markets"
        description="Select the sports you want to monitor. You can change these later."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {SPORT_OPTIONS.map((opt) => (
          <SelectionChip
            key={opt.id}
            label={opt.label}
            symbol={opt.symbol}
            accent={opt.accent}
            description={opt.description}
            selected={value.includes(opt.id)}
            onClick={() => toggle(opt.id)}
          />
        ))}
      </div>
    </>
  );
}

// ─── Step: Intelligence focus ─────────────────────────────────────────────────

function IntelligenceStep({
  value,
  onChange,
}: {
  value: IntelligenceFocus[];
  onChange: (v: IntelligenceFocus[]) => void;
}) {
  const toggle = (id: IntelligenceFocus) => {
    onChange(value.includes(id) ? value.filter((f) => f !== id) : [...value, id]);
  };
  return (
    <>
      <StepHeader
        title="Intelligence Focus"
        description="Choose the intelligence types that matter most to you. Select all that apply."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {FOCUS_OPTIONS.map((opt) => (
          <SelectionChip
            key={opt.id}
            label={opt.label}
            accent={opt.accent}
            description={opt.description}
            selected={value.includes(opt.id)}
            onClick={() => toggle(opt.id)}
          />
        ))}
      </div>
    </>
  );
}

// ─── Step: Creator mode ───────────────────────────────────────────────────────

function CreatorStep({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <>
      <StepHeader
        title="Creator Mode"
        description="Are you creating content from market intelligence? Enabling this unlocks export templates, distribution tools, and creator-specific workflows."
      />
      <div className="flex flex-col gap-3 max-w-md">
        <button
          onClick={() => onChange(true)}
          className={`text-left p-5 border rounded-sm transition-all duration-150 ${
            value === true
              ? "border-purple-400/40 bg-zinc-900"
              : "border-zinc-800/60 bg-zinc-950 hover:border-zinc-700/60"
          }`}
        >
          <div className="flex items-start gap-3">
            <span className={`text-lg shrink-0 ${value === true ? "text-purple-400" : "text-zinc-600"}`}>▲</span>
            <div>
              <p className={`text-sm font-medium ${value === true ? "text-white" : "text-zinc-400"}`}>
                Yes — I create content
              </p>
              <p className={`text-[11px] mt-1 leading-snug ${value === true ? "text-zinc-400" : "text-zinc-600"}`}>
                Share cards, export formats, channel intelligence packages, social distribution tools.
              </p>
            </div>
            <div className={`ml-auto shrink-0 w-3 h-3 rounded-full border transition-colors ${
              value === true ? "bg-purple-400 border-purple-400" : "border-zinc-700"
            }`} />
          </div>
        </button>

        <button
          onClick={() => onChange(false)}
          className={`text-left p-5 border rounded-sm transition-all duration-150 ${
            value === false
              ? "border-zinc-500/40 bg-zinc-900"
              : "border-zinc-800/60 bg-zinc-950 hover:border-zinc-700/60"
          }`}
        >
          <div className="flex items-start gap-3">
            <span className={`text-lg shrink-0 ${value === false ? "text-zinc-300" : "text-zinc-600"}`}>◇</span>
            <div>
              <p className={`text-sm font-medium ${value === false ? "text-white" : "text-zinc-400"}`}>
                No — personal intelligence only
              </p>
              <p className={`text-[11px] mt-1 leading-snug ${value === false ? "text-zinc-400" : "text-zinc-600"}`}>
                Full access to market data, AI signals, and watchlists — without creator export tools.
              </p>
            </div>
            <div className={`ml-auto shrink-0 w-3 h-3 rounded-full border transition-colors ${
              value === false ? "bg-white border-white" : "border-zinc-700"
            }`} />
          </div>
        </button>
      </div>
    </>
  );
}

// ─── Step: Alerts ─────────────────────────────────────────────────────────────

const SEVERITY_COLOR: Record<string, string> = {
  critical: "text-red-400",
  warning:  "text-amber-400",
  info:     "text-blue-400",
};

function AlertsStep({
  value,
  onChange,
}: {
  value: AlertPreference[];
  onChange: (v: AlertPreference[]) => void;
}) {
  const toggle = (id: AlertPreference) => {
    onChange(value.includes(id) ? value.filter((a) => a !== id) : [...value, id]);
  };
  return (
    <>
      <StepHeader
        title="Alert Preferences"
        description="What market events do you want to be notified about? Alerts appear in your terminal and daily brief."
      />
      <div className="flex flex-col gap-2 max-w-xl">
        {ALERT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => toggle(opt.id)}
            className={`text-left p-4 border rounded-sm transition-all duration-150 ${
              value.includes(opt.id)
                ? "border-white/20 bg-zinc-900"
                : "border-zinc-800/60 bg-zinc-950 hover:border-zinc-700/60"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className={`text-sm font-medium ${value.includes(opt.id) ? "text-white" : "text-zinc-400"}`}>
                    {opt.label}
                  </p>
                  <span className={`text-[9px] font-mono uppercase ${SEVERITY_COLOR[opt.severity] ?? "text-zinc-600"}`}>
                    {opt.severity}
                  </span>
                </div>
                <p className={`text-[11px] ${value.includes(opt.id) ? "text-zinc-400" : "text-zinc-600"}`}>
                  {opt.description}
                </p>
              </div>
              <div className={`shrink-0 w-3 h-3 rounded-full border transition-colors ${
                value.includes(opt.id) ? "bg-white border-white" : "border-zinc-700"
              }`} />
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

// ─── Step: Exports ────────────────────────────────────────────────────────────

function ExportsStep({
  value,
  onChange,
  creatorMode,
}: {
  value: ExportPlatform[];
  onChange: (v: ExportPlatform[]) => void;
  creatorMode: boolean;
}) {
  const toggle = (id: ExportPlatform) => {
    onChange(value.includes(id) ? value.filter((e) => e !== id) : [...value, id]);
  };

  if (!creatorMode) {
    return (
      <>
        <StepHeader
          title="Export Platforms"
          description="You've selected personal intelligence mode. You can enable Creator Mode from your account settings at any time to unlock export tools."
        />
        <div className="max-w-md bg-zinc-950 border border-zinc-800/60 rounded-sm p-5">
          <p className="text-zinc-500 text-sm leading-relaxed">
            Export templates and distribution workflows are available on Creator Mode.
            Enable it from Account → Creator Mode.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <StepHeader
        title="Export Platforms"
        description="Where do you distribute your market intelligence? Select all channels you use."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl">
        {EXPORT_OPTIONS.map((opt) => (
          <SelectionChip
            key={opt.id}
            label={opt.label}
            symbol={opt.symbol}
            accent={opt.accent}
            description={opt.description}
            selected={value.includes(opt.id)}
            onClick={() => toggle(opt.id)}
          />
        ))}
      </div>
    </>
  );
}

// ─── Step: Complete ───────────────────────────────────────────────────────────

function CompleteStep({ prefs }: { prefs: UserPreferences }) {
  return (
    <>
      <StepHeader
        title="Setup Complete"
        description="Your personalised intelligence is ready. The terminal is configured for your markets."
      />
      <div className="space-y-3 max-w-md">
        <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Markets Selected</p>
          <div className="flex flex-wrap gap-1.5">
            {prefs.favorite_sports.length > 0 ? prefs.favorite_sports.map((s) => (
              <span key={s} className="text-[11px] font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-sm">{s}</span>
            )) : <span className="text-zinc-600 text-xs">None selected</span>}
          </div>
        </div>
        <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Intelligence Focus</p>
          <div className="flex flex-wrap gap-1.5">
            {prefs.intelligence_focus.length > 0 ? prefs.intelligence_focus.map((f) => (
              <span key={f} className="text-[11px] font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-sm">{f}</span>
            )) : <span className="text-zinc-600 text-xs">None selected</span>}
          </div>
        </div>
        <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">Creator Mode</p>
          <p className={`text-sm font-mono ${prefs.creator_mode ? "text-purple-400" : "text-zinc-500"}`}>
            {prefs.creator_mode ? "Enabled" : "Disabled"}
          </p>
        </div>
        {prefs.creator_mode && prefs.export_preferences.length > 0 && (
          <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Export Platforms</p>
            <div className="flex flex-wrap gap-1.5">
              {prefs.export_preferences.map((p) => (
                <span key={p} className="text-[11px] font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-sm">{p}</span>
              ))}
            </div>
          </div>
        )}
        <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-sm p-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
            <p className="text-emerald-400 text-sm font-medium">Intelligence terminal activated</p>
          </div>
          <p className="text-emerald-700 text-[11px] mt-1">
            Watchlists seeded · Daily brief personalised · Alert rules configured
          </p>
        </div>
      </div>
    </>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="flex-1 h-px bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-white transition-all duration-500 ease-out rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-zinc-600 text-[9px] font-mono tabular-nums shrink-0">
        {current}/{total}
      </span>
    </div>
  );
}

// ─── Main flow ────────────────────────────────────────────────────────────────

const STEP_IDS: OnboardingStepId[] = ["sports", "intelligence", "creator", "alerts", "exports", "complete"];

export default function OnboardingFlow() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState<UserPreferences>({ ...DEFAULT_PREFERENCES });

  // Restore progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (saved) setPrefs(JSON.parse(saved) as UserPreferences);
      const progress = localStorage.getItem(ONBOARDING_PROGRESS_KEY);
      if (progress) {
        const idx = parseInt(progress, 10);
        if (!isNaN(idx) && idx < STEP_IDS.length) setStepIndex(idx);
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist preferences and progress to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
      localStorage.setItem(ONBOARDING_PROGRESS_KEY, String(stepIndex));
    } catch {
      // ignore
    }
  }, [prefs, stepIndex]);

  const updatePrefs = useCallback(<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const currentStep = ONBOARDING_STEPS[stepIndex];
  const isLast = stepIndex === ONBOARDING_STEPS.length - 1;
  const isComplete = currentStep?.id === "complete";

  async function handleNext() {
    if (isComplete) {
      await finish();
      return;
    }
    setStepIndex((i) => Math.min(i + 1, ONBOARDING_STEPS.length - 1));
  }

  function handleBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  async function finish() {
    setSaving(true);
    const finalPrefs = { ...prefs, onboarding_completed: true };

    // Save to localStorage
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(finalPrefs));
      localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
      localStorage.removeItem(ONBOARDING_PROGRESS_KEY);
    } catch { /* ignore */ }

    // Attempt Supabase save
    try {
      await fetch("/api/onboarding/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPrefs),
      });
    } catch { /* fail silently — localStorage is the source of truth */ }

    setSaving(false);
    router.push(finalPrefs.creator_mode ? "/creator-studio" : "/terminal");
  }

  function renderStep() {
    if (!currentStep) return null;
    switch (currentStep.id) {
      case "sports":
        return <SportsStep value={prefs.favorite_sports} onChange={(v) => updatePrefs("favorite_sports", v)} />;
      case "intelligence":
        return <IntelligenceStep value={prefs.intelligence_focus} onChange={(v) => updatePrefs("intelligence_focus", v)} />;
      case "creator":
        return <CreatorStep value={prefs.creator_mode} onChange={(v) => updatePrefs("creator_mode", v)} />;
      case "alerts":
        return <AlertsStep value={prefs.alert_preferences} onChange={(v) => updatePrefs("alert_preferences", v)} />;
      case "exports":
        return <ExportsStep value={prefs.export_preferences} onChange={(v) => updatePrefs("export_preferences", v)} creatorMode={prefs.creator_mode} />;
      case "complete":
        return <CompleteStep prefs={prefs} />;
      default:
        return null;
    }
  }

  const canProceed = (() => {
    if (!currentStep) return false;
    switch (currentStep.id) {
      case "sports":       return prefs.favorite_sports.length > 0;
      case "intelligence": return prefs.intelligence_focus.length > 0;
      case "alerts":       return prefs.alert_preferences.length > 0;
      default:             return true;
    }
  })();

  const nextLabel = isComplete ? (saving ? "Launching..." : "Enter Terminal") : "Continue";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-zinc-900 px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <span className="text-white text-xs font-semibold tracking-tight">Sports Market</span>
          <span className="text-zinc-500 text-xs font-semibold ml-1">OS</span>
        </div>
        <span className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest">Setup</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-6 py-10">
        <div className="w-full max-w-lg">
          {/* Step label */}
          <p className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest mb-2">
            Step {stepIndex + 1} of {ONBOARDING_STEPS.length} — {currentStep?.title}
          </p>

          <ProgressBar current={stepIndex + 1} total={ONBOARDING_STEPS.length} />

          {renderStep()}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-900">
            <button
              onClick={handleBack}
              disabled={stepIndex === 0}
              className="text-zinc-600 text-xs font-mono hover:text-zinc-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Back
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed || saving}
              className="text-xs font-medium text-black bg-white px-6 py-2 rounded-sm hover:bg-zinc-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {nextLabel}
            </button>
          </div>

          {/* Skip */}
          {!isComplete && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setStepIndex(ONBOARDING_STEPS.length - 1)}
                className="text-zinc-700 text-[10px] font-mono hover:text-zinc-500 transition-colors"
              >
                Skip setup →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-900 px-6 py-3 text-center shrink-0">
        <p className="text-zinc-800 text-[9px] font-mono">
          Market intelligence only · Not financial advice
        </p>
      </div>
    </div>
  );
}
