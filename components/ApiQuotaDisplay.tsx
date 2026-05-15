"use client";

/**
 * ApiQuotaDisplay — Daily quota bar + stats for the developer dashboard.
 */

import { useEffect, useState } from "react";
import type { QuotaStatus } from "@/lib/apiAccess/apiPlanTypes";
import { PLAN_LABEL } from "@/lib/apiAccess/apiPlanTypes";

export default function ApiQuotaDisplay() {
  const [quota, setQuota]     = useState<QuotaStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/keys/quota")
      .then((r) => r.json())
      .then((j: { quota: QuotaStatus }) => setQuota(j.quota))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 p-4">
        <p className="text-zinc-700 text-[10px] font-mono">Loading quota…</p>
      </div>
    );
  }

  if (!quota) {
    return (
      <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 p-4">
        <p className="text-zinc-600 text-[10px] font-mono">Quota unavailable.</p>
      </div>
    );
  }

  const barColor =
    quota.percentUsed >= 90 ? "bg-red-500" :
    quota.percentUsed >= 70 ? "bg-amber-500" :
    "bg-blue-500";

  const resetDate = new Date(quota.resetAt).toLocaleTimeString([], {
    hour: "2-digit", minute: "2-digit", timeZoneName: "short",
  });

  return (
    <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 p-4 space-y-4">

      {/* Plan + header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <p className="text-zinc-300 text-[11px] font-medium">
            Daily Quota
          </p>
        </div>
        <span className="text-[9px] font-mono text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2 py-0.5 rounded-sm">
          {PLAN_LABEL[quota.plan]} plan
        </span>
      </div>

      {/* Progress bar */}
      <div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${quota.percentUsed}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[9px] font-mono">
          <span className="text-zinc-500">
            {quota.used.toLocaleString()} / {quota.limit.toLocaleString()} calls
          </span>
          <span className={quota.percentUsed >= 90 ? "text-red-400" : "text-zinc-600"}>
            {quota.percentUsed}% used
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-zinc-300 text-sm font-bold tabular-nums">{quota.remaining.toLocaleString()}</p>
          <p className="text-zinc-600 text-[9px] font-mono">remaining</p>
        </div>
        <div>
          <p className="text-zinc-300 text-sm font-bold tabular-nums">{quota.used.toLocaleString()}</p>
          <p className="text-zinc-600 text-[9px] font-mono">used today</p>
        </div>
        <div>
          <p className="text-zinc-300 text-sm font-bold tabular-nums">{quota.limit.toLocaleString()}</p>
          <p className="text-zinc-600 text-[9px] font-mono">daily limit</p>
        </div>
      </div>

      {/* Reset time */}
      <p className="text-zinc-700 text-[9px] font-mono">
        Resets at {resetDate}
        {quota.degraded && " · quota check degraded — limit not enforced"}
      </p>

      {/* Upgrade prompt if high usage */}
      {quota.percentUsed >= 80 && quota.plan !== "api" && (
        <div className="border border-amber-500/20 rounded-sm bg-amber-500/5 px-3 py-2">
          <p className="text-amber-400 text-[10px]">
            Approaching daily limit.{" "}
            <a href="/pricing" className="underline hover:text-amber-300 transition-colors">
              Upgrade to increase quota →
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
