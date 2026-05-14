"use client";

import { useEffect, useState } from "react";
import AdminMetricCard from "./AdminMetricCard";

interface Overview {
  totalUsers: number;
  totalPartnerProfiles: number;
  pendingApplications: number;
  referralEventsToday: number;
  savedMarkets: number;
  creatorProfiles: number;
  estimatedReach: number;
  latestSignups: { email: string; created_at: string }[];
  source: "live" | "mock";
}

export default function AdminOverview() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/overview", { cache: "no-store" })
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-zinc-700 text-[10px] font-mono animate-pulse">Loading overview…</p>;
  }

  if (!data) {
    return <p className="text-red-500 text-[10px] font-mono">Failed to load overview.</p>;
  }

  return (
    <div className="space-y-6">
      {data.source === "mock" && (
        <div className="px-3 py-2 bg-amber-400/5 border border-amber-400/20 rounded-sm">
          <p className="text-amber-500 text-[9px] font-mono">
            Mock data — Supabase not connected or table missing.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <AdminMetricCard label="Total Users"          value={data.totalUsers}          color="text-white" />
        <AdminMetricCard label="Partner Profiles"     value={data.totalPartnerProfiles} color="text-emerald-400" />
        <AdminMetricCard label="Pending Applications" value={data.pendingApplications}  color="text-amber-400" />
        <AdminMetricCard label="Referral Events Today" value={data.referralEventsToday} color="text-blue-400" />
        <AdminMetricCard label="Saved Markets"        value={data.savedMarkets}         color="text-purple-400" />
        <AdminMetricCard label="Creator Profiles"     value={data.creatorProfiles}      color="text-teal-400" />
        <AdminMetricCard label="Est. Reach"           value={data.estimatedReach.toLocaleString()} sub="partner network" color="text-zinc-300" />
      </div>

      {data.latestSignups.length > 0 && (
        <div>
          <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-3">
            Latest Signups
          </p>
          <div className="border border-zinc-800/60 rounded-sm overflow-hidden">
            {data.latestSignups.map((u, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-3 py-2 border-b border-zinc-900/60 last:border-0"
              >
                <span className="text-zinc-400 text-[10px] font-mono truncate">{u.email}</span>
                <span className="text-zinc-600 text-[9px] font-mono shrink-0 ml-4">
                  {new Date(u.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
