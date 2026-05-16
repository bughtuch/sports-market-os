"use client";

import { useState, useEffect } from "react";
import NavAuth from "@/components/NavAuth";

interface QuotaState {
  remaining: number | null;
  used: number | null;
  lastSync: string | null;
}

const IS_DEV = process.env.NODE_ENV !== "production";

export default function TerminalHeader() {
  const [utcTime, setUtcTime] = useState("");
  const [quota, setQuota] = useState<QuotaState | null>(null);

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

  useEffect(() => {
    if (!IS_DEV) return;
    const fetchQuota = () => {
      fetch("/api/live/odds-quota")
        .then((r) => r.json())
        .then((d: QuotaState) => setQuota(d))
        .catch(() => {/* non-fatal */});
    };
    fetchQuota();
    const id = setInterval(fetchQuota, 60000);
    return () => clearInterval(id);
  }, []);

  const lastSyncLabel = quota?.lastSync
    ? (() => {
        const d = new Date(quota.lastSync);
        const h = d.getUTCHours().toString().padStart(2, "0");
        const m = d.getUTCMinutes().toString().padStart(2, "0");
        return `${h}:${m} UTC`;
      })()
    : null;

  return (
    <div className="h-7 shrink-0 border-b border-zinc-800/40 bg-black flex items-center px-4 gap-2 overflow-x-auto">
      <span className="text-zinc-600 text-[10px] font-mono tabular-nums">
        {utcTime || "--:--"} UTC
      </span>

      {IS_DEV && quota && quota.remaining !== null && (
        <>
          <span className="text-zinc-800 text-[10px] ml-2">·</span>
          <span className="text-amber-600/70 text-[9px] font-mono tabular-nums shrink-0">
            Odds API · {quota.remaining} req remaining
            {lastSyncLabel ? ` · last sync ${lastSyncLabel}` : ""}
          </span>
        </>
      )}

      {/* Auth — push to far right */}
      <div className="ml-auto shrink-0">
        <NavAuth />
      </div>
    </div>
  );
}
