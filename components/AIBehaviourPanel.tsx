"use client";

import { useState, useEffect } from "react";
import type { AIBehaviourSignal, BehaviouralState } from "@/lib/ai/types";

const STATE_CONFIG: Record<BehaviouralState, { text: string; bg: string; border: string; label: string }> = {
  panic:            { text: "text-red-400",     bg: "bg-red-400/10",     border: "border-red-400/20",     label: "PANIC" },
  euphoria:         { text: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", label: "EUPHORIA" },
  uncertainty:      { text: "text-amber-400",   bg: "bg-amber-400/10",   border: "border-amber-400/20",   label: "UNCERTAINTY" },
  crowd_consensus:  { text: "text-blue-400",    bg: "bg-blue-400/10",    border: "border-blue-400/20",    label: "CONSENSUS" },
  sharp_divergence: { text: "text-purple-400",  bg: "bg-purple-400/10",  border: "border-purple-400/20",  label: "DIVERGENCE" },
  neutral:          { text: "text-zinc-400",    bg: "bg-zinc-400/10",    border: "border-zinc-400/20",    label: "NEUTRAL" },
};

function PressureBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-zinc-700 text-[9px] font-mono w-28 shrink-0">{label}</span>
      <div className="h-1 flex-1 bg-zinc-900 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className="text-zinc-500 text-[9px] font-mono tabular-nums w-6 text-right">{value}</span>
    </div>
  );
}

export default function AIBehaviourPanel() {
  const [data, setData] = useState<AIBehaviourSignal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch("/api/ai/behaviour");
        if (res.ok) {
          const json = await res.json() as { signal?: AIBehaviourSignal };
          if (json.signal) setData(json.signal);
        }
      } catch { /* noop */ }
      finally { setLoading(false); }
    }
    void fetch_();
    const timer = setInterval(() => void fetch_(), 18_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="border-b border-zinc-900/80">
      <div className="px-4 py-3 flex items-center gap-2">
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
          Behavioural Intelligence
        </span>
        <div className="flex-1 h-px bg-zinc-900" />
        {data && (() => {
          const cfg = STATE_CONFIG[data.state];
          return (
            <span className={`text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-sm border ${cfg.text} ${cfg.bg} ${cfg.border}`}>
              {cfg.label}
            </span>
          );
        })()}
      </div>

      {loading ? (
        <div className="px-4 pb-3 space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-3 bg-zinc-900/40 rounded-sm animate-pulse" />)}
        </div>
      ) : !data ? (
        <p className="px-4 pb-3 text-zinc-600 text-xs">Engine unavailable.</p>
      ) : (
        <div className="px-4 pb-3">
          <p className="text-zinc-400 text-[10px] leading-relaxed mb-3">{data.summary}</p>
          <div className="space-y-1.5">
            <PressureBar label="Behavioural Pressure" value={data.behaviouralPressure} color="bg-amber-500/50" />
            <PressureBar label="Crowd Alignment"      value={data.crowdAlignment}      color="bg-blue-500/40" />
            <PressureBar label="Inst. Divergence"     value={data.institutionalDivergence} color="bg-purple-500/40" />
          </div>
          <p className="mt-2 text-zinc-700 text-[9px] font-mono tabular-nums">
            Confidence: {data.confidence}%
          </p>
        </div>
      )}
    </section>
  );
}
