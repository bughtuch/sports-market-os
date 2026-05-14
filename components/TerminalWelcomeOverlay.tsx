"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "smos_welcome_seen_v1";

const ONBOARDING_COLUMNS = [
  {
    title: "Live Intelligence",
    dot: "bg-emerald-400",
    items: [
      "Market heat scoring",
      "Volatility detection",
      "Queue depth analysis",
      "AI market narratives",
    ],
  },
  {
    title: "Creator Distribution",
    dot: "bg-purple-400",
    items: [
      "Signal export cards",
      "Shareable analytics",
      "Creator feeds",
      "Viral distribution",
    ],
  },
  {
    title: "Trading Ecosystem",
    dot: "bg-amber-400",
    items: [
      "Horse Racing Trader",
      "Tennis Trader USA",
      "API infrastructure",
      "Partner integrations",
    ],
  },
];

export default function TerminalWelcomeOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) setVisible(true);
    } catch {
      // localStorage unavailable — skip overlay
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [visible]);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800/80 rounded-sm shadow-2xl">

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-zinc-900">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              Sports Market OS · Intelligence Terminal
            </span>
          </div>
          <h1 className="text-xl font-semibold text-white tracking-tight mb-2">
            Welcome to Sports Market OS
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-lg">
            AI-powered sports market intelligence, volatility detection, liquidity
            analytics, and creator-ready signal infrastructure.
          </p>
        </div>

        {/* Feature columns */}
        <div className="px-8 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-zinc-900">
          {ONBOARDING_COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${col.dot}`} />
                <p className="text-zinc-200 text-[11px] font-semibold">{col.title}</p>
              </div>
              <ul className="space-y-1.5">
                {col.items.map((item) => (
                  <li key={item} className="text-zinc-500 text-[11px] flex items-start gap-1.5">
                    <span className="text-zinc-700 mt-0.5 shrink-0">›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-zinc-700 text-[10px] font-mono leading-relaxed max-w-sm">
            Sports Market OS provides analytics and informational tooling only.
            Not financial or gambling advice.
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-zinc-600 text-[10px] font-mono">ESC to close</span>
            <button
              onClick={dismiss}
              className="text-sm font-medium text-black bg-white px-6 py-2 rounded-sm hover:bg-zinc-200 transition-colors"
            >
              Enter Terminal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
