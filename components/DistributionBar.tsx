"use client";

import { useState, useEffect } from "react";

interface Channel {
  label: string;
  value: number;
  suffix: string;
  accentColor: string;
}

const baseChannels: Channel[] = [
  { label: "Telegram", value: 84320, suffix: " reach", accentColor: "text-blue-400" },
  { label: "X Impressions", value: 1240000, suffix: "", accentColor: "text-zinc-300" },
  { label: "Discord", value: 12840, suffix: " reach", accentColor: "text-purple-400" },
  { label: "Reddit", value: 8420, suffix: " views", accentColor: "text-orange-400" },
  { label: "API Calls", value: 4812, suffix: "/day", accentColor: "text-emerald-400" },
  { label: "Partners", value: 48, suffix: " active", accentColor: "text-amber-400" },
];

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export default function DistributionBar() {
  const [channels, setChannels] = useState<Channel[]>(baseChannels);

  useEffect(() => {
    const id = setInterval(() => {
      setChannels((prev) =>
        prev.map((ch) => ({
          ...ch,
          value: Math.max(
            1,
            ch.value + Math.round((Math.random() - 0.48) * ch.value * 0.003)
          ),
        }))
      );
    }, 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="border-b border-zinc-900/80 bg-black/40">
      <div className="px-4 py-2.5 flex items-center gap-2 overflow-x-auto">
        {/* Label */}
        <div className="flex items-center gap-1.5 shrink-0 pr-4 border-r border-zinc-800">
          <span className="w-1 h-1 rounded-full bg-purple-400 pulse-dot" />
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            Distribution Network
          </span>
        </div>

        {/* Channels */}
        {channels.map((ch, i) => (
          <div key={ch.label} className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-600 text-[9px] font-mono">{ch.label}</span>
              <span className={`text-[10px] font-mono tabular-nums font-medium ${ch.accentColor}`}>
                {fmt(ch.value)}{ch.suffix}
              </span>
            </div>
            {i < channels.length - 1 && (
              <span className="text-zinc-800 text-[9px]">·</span>
            )}
          </div>
        ))}

        <div className="ml-auto shrink-0 pl-4 border-l border-zinc-800">
          <span className="text-zinc-700 text-[9px] font-mono">REAL-TIME</span>
        </div>
      </div>
    </div>
  );
}
