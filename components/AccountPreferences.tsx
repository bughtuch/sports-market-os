"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { UserPreferences } from "@/lib/onboarding/onboardingTypes";
import {
  DEFAULT_PREFERENCES,
  PREFERENCES_STORAGE_KEY,
  ONBOARDING_STORAGE_KEY,
} from "@/lib/onboarding/onboardingTypes";

export default function AccountPreferences() {
  const [prefs, setPrefs]       = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [completed, setCompleted] = useState(false);
  const [mounted, setMounted]   = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (raw) setPrefs(JSON.parse(raw) as UserPreferences);
      setCompleted(!!localStorage.getItem(ONBOARDING_STORAGE_KEY));
    } catch { /* ignore */ }
  }, []);

  if (!mounted) return null;

  if (!completed) {
    return (
      <div className="max-w-md bg-zinc-950 border border-zinc-700/60 rounded-sm p-5">
        <p className="text-zinc-400 text-sm font-medium mb-1">Setup not complete</p>
        <p className="text-zinc-600 text-xs leading-relaxed mb-3">
          Personalise your markets, intelligence focus, and alerts to get the most out of the terminal.
        </p>
        <Link
          href="/onboarding"
          className="text-xs font-medium text-black bg-white px-4 py-1.5 rounded-sm hover:bg-zinc-200 transition-colors"
        >
          Complete Setup →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl">
      <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
        <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-2">Markets</p>
        <div className="flex flex-wrap gap-1">
          {prefs.favorite_sports.length > 0
            ? prefs.favorite_sports.map((s) => (
                <span key={s} className="text-[10px] font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded-sm">{s}</span>
              ))
            : <span className="text-zinc-700 text-xs">None</span>
          }
        </div>
      </div>
      <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
        <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-2">Focus</p>
        <div className="flex flex-wrap gap-1">
          {prefs.intelligence_focus.length > 0
            ? prefs.intelligence_focus.map((f) => (
                <span key={f} className="text-[10px] font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded-sm">{f}</span>
              ))
            : <span className="text-zinc-700 text-xs">None</span>
          }
        </div>
      </div>
      <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
        <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">Creator Mode</p>
        <p className={`text-sm font-mono ${prefs.creator_mode ? "text-purple-400" : "text-zinc-500"}`}>
          {prefs.creator_mode ? "Enabled" : "Disabled"}
        </p>
        {prefs.creator_mode && prefs.export_preferences.length > 0 && (
          <p className="text-zinc-600 text-[10px] mt-1">{prefs.export_preferences.join(", ")}</p>
        )}
      </div>
    </div>
  );
}
