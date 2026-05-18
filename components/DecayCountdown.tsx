/**
 * DecayCountdown — client component that renders a live countdown
 * to a signal's decay window expiry.
 *
 * Shows "Xh Ym remaining" or "Expired" — updates every 60 s.
 */

"use client";

import { useEffect, useState } from "react";

interface Props {
  generatedAt: string;       // ISO timestamp when signal was generated
  decayWindowMinutes: number; // from signals.decay_window_minutes
}

function computeRemaining(generatedAt: string, decayWindowMinutes: number): number {
  const expiresAt = new Date(generatedAt).getTime() + decayWindowMinutes * 60_000;
  return Math.max(0, expiresAt - Date.now());
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return "Expired";
  const totalMinutes = Math.floor(ms / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

export default function DecayCountdown({ generatedAt, decayWindowMinutes }: Props) {
  const [ms, setMs] = useState(() => computeRemaining(generatedAt, decayWindowMinutes));

  useEffect(() => {
    const interval = setInterval(() => {
      setMs(computeRemaining(generatedAt, decayWindowMinutes));
    }, 60_000);
    return () => clearInterval(interval);
  }, [generatedAt, decayWindowMinutes]);

  const expired = ms <= 0;
  const label = formatRemaining(ms);
  const urgentClass = ms < 60 * 60_000 && !expired ? "text-amber-400" : expired ? "text-zinc-700" : "text-zinc-500";

  return (
    <span className={`text-[11px] font-mono tabular-nums ${urgentClass}`}>
      {expired ? "Expired" : `↓ ${label}`}
    </span>
  );
}
