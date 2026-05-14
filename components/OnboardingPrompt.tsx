"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ONBOARDING_STORAGE_KEY } from "@/lib/onboarding/onboardingTypes";

export default function OnboardingPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const completed = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (!completed) setShow(true);
    } catch {
      // SSR guard — ignore
    }
  }, []);

  if (!show) return null;

  return (
    <div className="mx-3 mb-3 p-3 border border-zinc-700/60 rounded-sm bg-zinc-900/60">
      <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">Setup Incomplete</p>
      <p className="text-zinc-500 text-[11px] leading-snug mb-2.5">
        Personalise your intelligence feed for your markets and focus areas.
      </p>
      <Link
        href="/onboarding"
        className="block text-center text-[10px] font-mono text-black bg-white px-3 py-1.5 rounded-sm hover:bg-zinc-200 transition-colors"
      >
        Complete Setup →
      </Link>
    </div>
  );
}
