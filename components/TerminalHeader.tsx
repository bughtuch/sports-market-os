"use client";

import { useState, useEffect } from "react";

export default function TerminalHeader() {
  const [utcTime, setUtcTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = now.getUTCHours().toString().padStart(2, "0");
      const m = now.getUTCMinutes().toString().padStart(2, "0");
      setUtcTime(`${h}:${m}`);
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-7 shrink-0 border-b border-zinc-800/40 bg-black flex items-center px-4 gap-2 overflow-x-auto">
      <span className="text-zinc-600 text-[10px] font-mono tabular-nums">
        {utcTime || "--:--"} UTC
      </span>
      <span className="text-zinc-800 text-[10px]">·</span>
      <span className="text-zinc-600 text-[10px] font-mono">248 markets</span>
      <span className="text-zinc-800 text-[10px]">·</span>
      <span className="text-zinc-600 text-[10px] font-mono">
        regime{" "}
        <span className="font-semibold" style={{ color: "var(--accent)" }}>volatile</span>
      </span>
      <span className="text-zinc-800 text-[10px]">·</span>
      <span className="text-zinc-600 text-[10px] font-mono">3 anomalies</span>
    </div>
  );
}
