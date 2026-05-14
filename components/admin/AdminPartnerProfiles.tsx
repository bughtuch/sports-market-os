"use client";

import { useEffect, useState } from "react";
import AdminTable from "./AdminTable";
import AdminStatusBadge from "./AdminStatusBadge";
import AdminActionButton from "./AdminActionButton";

interface PartnerMetricsSummary {
  clicks: number;
  signups: number;
  exports: number;
  api_referrals: number;
  estimated_reach: number;
}

interface PartnerProfileRow {
  id: string;
  partner_code: string;
  display_name: string | null;
  platform: string | null;
  audience_size: string | null;
  status: string;
  created_at: string;
  metrics: PartnerMetricsSummary | null;
}

export default function AdminPartnerProfiles() {
  const [profiles, setProfiles] = useState<PartnerProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/partner-profiles", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setProfiles(d.profiles ?? []))
      .catch(() => setError("Failed to load partner profiles."))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: string) {
    setUpdating(id + status);
    try {
      const res = await fetch("/api/admin/partner-profiles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setProfiles((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status } : p))
        );
      } else {
        setError("Update failed.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setUpdating(null);
    }
  }

  if (loading) return <p className="text-zinc-700 text-[10px] font-mono animate-pulse">Loading partner profiles…</p>;

  return (
    <div className="space-y-3">
      {error && <p className="text-amber-500 text-[9px] font-mono">{error}</p>}
      <AdminTable<PartnerProfileRow>
        keyFn={(r) => r.id}
        emptyMessage="No partner profiles found."
        columns={[
          {
            key: "code",
            label: "Code",
            width: "0.8fr",
            render: (r) => (
              <span className="text-emerald-400 font-mono text-[9px]">{r.partner_code}</span>
            ),
          },
          {
            key: "display_name",
            label: "Name",
            width: "1fr",
            render: (r) => (
              <span className="text-zinc-300 truncate block">{r.display_name ?? "—"}</span>
            ),
          },
          {
            key: "platform",
            label: "Platform",
            width: "0.7fr",
            render: (r) => <span className="text-zinc-400">{r.platform ?? "—"}</span>,
          },
          {
            key: "audience_size",
            label: "Audience",
            width: "0.7fr",
            render: (r) => <span className="text-zinc-500">{r.audience_size ?? "—"}</span>,
          },
          {
            key: "metrics",
            label: "Clicks / Signups",
            width: "0.9fr",
            render: (r) =>
              r.metrics ? (
                <span className="text-zinc-400 font-mono text-[9px]">
                  {r.metrics.clicks} / {r.metrics.signups}
                </span>
              ) : (
                <span className="text-zinc-700">—</span>
              ),
          },
          {
            key: "status",
            label: "Status",
            width: "0.7fr",
            render: (r) => <AdminStatusBadge status={r.status} />,
          },
          {
            key: "created_at",
            label: "Created",
            width: "0.7fr",
            render: (r) => (
              <span className="text-zinc-600 text-[9px] font-mono">
                {new Date(r.created_at).toLocaleDateString()}
              </span>
            ),
          },
          {
            key: "actions",
            label: "Actions",
            width: "1.2fr",
            render: (r) => (
              <div className="flex gap-1.5 flex-wrap">
                <AdminActionButton
                  label="Activate"
                  variant="approve"
                  loading={updating === r.id + "active"}
                  disabled={r.status === "active"}
                  onClick={() => updateStatus(r.id, "active")}
                />
                <AdminActionButton
                  label="Pause"
                  variant="warn"
                  loading={updating === r.id + "suspended"}
                  disabled={r.status === "suspended"}
                  onClick={() => updateStatus(r.id, "suspended")}
                />
                <AdminActionButton
                  label="Pending"
                  loading={updating === r.id + "pending"}
                  disabled={r.status === "pending"}
                  onClick={() => updateStatus(r.id, "pending")}
                />
              </div>
            ),
          },
        ]}
        rows={profiles}
      />
    </div>
  );
}
