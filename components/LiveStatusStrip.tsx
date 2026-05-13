"use client";

import { useState, useEffect } from "react";
import {
  simulatedLatencyMs,
  simulatedEventsPerMin,
  syncCountdownSecs,
  sessionLabel,
} from "@/lib/realtime/terminalClock";

const STATIC_METRICS = [
  { label: "Active markets", value: "248" },
  { label: "AI scans/min",   value: "1,920" },
  { label: "Exchanges",       value: "8" },
  { label: "Anomalies",       value: "3" },
  { label: "AI load",         value: "67%" },
  { label: "Avg volatility",  value: "0.74" },
  { label: "Creator posts",   value: "2.4/min" },
  { label: "Users online",    value: "4,812" },
];

export default function LiveStatusStrip() {
  const [nowMs, setNowMs] = useState(0);

  useEffect(() => {
    setNowMs(Date.now());
    const id = setInterval(() => setNowMs(Date.now()), 5_000);
    return () => clearInterval(id);
  }, []);

  const latency      = nowMs ? simulatedLatencyMs(nowMs)    : 32;
  const throughput   = nowMs ? simulatedEventsPerMin(nowMs) : 148;
  const syncSecs     = nowMs ? syncCountdownSecs(nowMs)     : 30;
  const session      = nowMs ? sessionLabel(nowMs)          : "LONDON";

  return (
    <div className="h-7 shrink-0 border-t border-zinc-800/60 bg-zinc-950 flex items-center px-4 gap-0 overflow-x-auto">
      {/* Live indicator */}
      <div className="flex items-center gap-1.5 shrink-0 pr-4">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
        <span className="text-emerald-500 text-[9px] font-mono uppercase tracking-widest">
          Live
        </span>
      </div>

      <div className="w-px h-3 bg-zinc-800 shrink-0 mr-4" />

      {/* Live metrics */}
      <div className="flex items-center shrink-0">
        <span className="text-zinc-700 text-[9px] font-mono">Terminal latency:</span>
        <span
          className={`text-[9px] font-mono tabular-nums ml-1 ${
            latency > 60 ? "text-amber-400" : "text-emerald-400"
          }`}
        >
          {latency}ms
        </span>
        <span className="mx-3 text-zinc-800 font-mono text-[9px]">·</span>
      </div>

      <div className="flex items-center shrink-0">
        <span className="text-zinc-700 text-[9px] font-mono">Signal throughput:</span>
        <span className="text-zinc-400 text-[9px] font-mono tabular-nums ml-1">
          {throughput}/min
        </span>
        <span className="mx-3 text-zinc-800 font-mono text-[9px]">·</span>
      </div>

      <div className="flex items-center shrink-0">
        <span className="text-zinc-700 text-[9px] font-mono">Provider sync:</span>
        <span className="text-zinc-400 text-[9px] font-mono tabular-nums ml-1">
          {syncSecs}s
        </span>
        <span className="mx-3 text-zinc-800 font-mono text-[9px]">·</span>
      </div>

      <div className="flex items-center shrink-0">
        <span className="text-zinc-700 text-[9px] font-mono">Session:</span>
        <span className="text-amber-400 text-[9px] font-mono ml-1">{session}</span>
        <span className="mx-3 text-zinc-800 font-mono text-[9px]">·</span>
      </div>

      {/* Static metrics */}
      {STATIC_METRICS.map((m, i) => (
        <div key={m.label} className="flex items-center shrink-0">
          <span className="text-zinc-700 text-[9px] font-mono">{m.label}:</span>
          <span className="text-zinc-400 text-[9px] font-mono tabular-nums ml-1">
            {m.value}
          </span>
          {i < STATIC_METRICS.length - 1 && (
            <span className="mx-3 text-zinc-800 font-mono text-[9px]">·</span>
          )}
        </div>
      ))}

      {/* Version */}
      <div className="ml-auto shrink-0 pl-4">
        <span className="text-zinc-800 text-[9px] font-mono tracking-wider">
          SPORTS MARKET OS v2.0
        </span>
      </div>
    </div>
  );
}
