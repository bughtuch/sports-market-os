"use client";

import { useState, useEffect } from "react";

export default function TerminalHeader() {
  const [utcTime, setUtcTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = now.getUTCHours().toString().padStart(2, "0");
      const m = now.getUTCMinutes().toString().padStart(2, "0");
      const s = now.getUTCSeconds().toString().padStart(2, "0");
      setUtcTime(`${h}:${m}:${s}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-7 shrink-0 border-b border-zinc-800/40 bg-black flex items-center px-4 gap-5 overflow-x-auto">
      {/* Clock */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest">UTC</span>
        <span className="text-zinc-200 text-[10px] font-mono tabular-nums">
          {utcTime || "--:--:--"}
        </span>
      </div>

      <span className="text-zinc-800 text-[10px]">·</span>

      {/* Session */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-zinc-600 text-[9px] font-mono">SESSION</span>
        <span className="text-amber-400 text-[9px] font-mono font-semibold tracking-wider">LONDON</span>
      </div>

      <span className="text-zinc-800 text-[10px]">·</span>

      {/* Feeds */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot" />
        <span className="text-zinc-500 text-[9px] font-mono">LIVE FEEDS</span>
        <span className="text-zinc-200 text-[9px] font-mono">12 CONNECTED</span>
      </div>

      <span className="text-zinc-800 text-[10px]">·</span>

      {/* AI Engine */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="w-1 h-1 rounded-full bg-blue-400 pulse-dot" />
        <span className="text-zinc-500 text-[9px] font-mono">AI ENGINE</span>
        <span className="text-blue-400 text-[9px] font-mono">ACTIVE</span>
      </div>

      <span className="text-zinc-800 text-[10px]">·</span>

      {/* AI Scans */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-zinc-500 text-[9px] font-mono">SCANS/MIN</span>
        <span className="text-zinc-200 text-[9px] font-mono tabular-nums">1,920</span>
      </div>

      {/* Creator count — right aligned */}
      <div className="ml-auto flex items-center gap-1.5 shrink-0">
        <span className="w-1 h-1 rounded-full bg-purple-400 pulse-dot" />
        <span className="text-zinc-500 text-[9px] font-mono">CREATOR NETWORK</span>
        <span className="text-purple-400 text-[9px] font-mono">486 POSTS TODAY</span>
      </div>
    </div>
  );
}
