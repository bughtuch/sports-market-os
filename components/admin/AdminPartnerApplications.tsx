"use client";

import { useEffect, useState } from "react";
import AdminTable from "./AdminTable";
import AdminStatusBadge from "./AdminStatusBadge";
import AdminActionButton from "./AdminActionButton";

interface Application {
  id: string;
  name: string;
  platform: string;
  audience_size: string | null;
  channel_url: string | null;
  reason: string | null;
  status: string;
  created_at: string;
}

export default function AdminPartnerApplications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/partner-applications", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setApps(d.applications ?? []))
      .catch(() => setError("Failed to load applications."))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: string) {
    setUpdating(id + status);
    try {
      const res = await fetch("/api/admin/partner-applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      } else {
        setError("Update failed.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setUpdating(null);
    }
  }

  if (loading) return <p className="text-zinc-700 text-[10px] font-mono animate-pulse">Loading applications…</p>;

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-amber-500 text-[9px] font-mono">{error}</p>
      )}
      <AdminTable<Application>
        keyFn={(r) => r.id}
        emptyMessage="No partner applications. partner_applications table may not exist yet."
        columns={[
          {
            key: "name",
            label: "Name",
            width: "1.5fr",
            render: (r) => <span className="text-zinc-300 truncate block">{r.name}</span>,
          },
          {
            key: "platform",
            label: "Platform",
            width: "0.8fr",
            render: (r) => <span className="text-zinc-400 font-mono">{r.platform}</span>,
          },
          {
            key: "audience_size",
            label: "Audience",
            width: "0.7fr",
            render: (r) => <span className="text-zinc-500">{r.audience_size ?? "—"}</span>,
          },
          {
            key: "reason",
            label: "Reason",
            width: "2fr",
            render: (r) => (
              <span className="text-zinc-500 text-[9px] truncate block" title={r.reason ?? ""}>
                {r.reason ? (r.reason.length > 60 ? r.reason.slice(0, 60) + "…" : r.reason) : "—"}
              </span>
            ),
          },
          {
            key: "status",
            label: "Status",
            width: "0.8fr",
            render: (r) => <AdminStatusBadge status={r.status} />,
          },
          {
            key: "created_at",
            label: "Applied",
            width: "0.8fr",
            render: (r) => (
              <span className="text-zinc-600 text-[9px] font-mono">
                {new Date(r.created_at).toLocaleDateString()}
              </span>
            ),
          },
          {
            key: "actions",
            label: "Actions",
            width: "1.4fr",
            render: (r) => (
              <div className="flex gap-1.5 flex-wrap">
                <AdminActionButton
                  label="Approve"
                  variant="approve"
                  loading={updating === r.id + "approved"}
                  disabled={r.status === "approved"}
                  onClick={() => updateStatus(r.id, "approved")}
                />
                <AdminActionButton
                  label="Review"
                  variant="warn"
                  loading={updating === r.id + "in_review"}
                  disabled={r.status === "in_review"}
                  onClick={() => updateStatus(r.id, "in_review")}
                />
                <AdminActionButton
                  label="Reject"
                  variant="reject"
                  loading={updating === r.id + "rejected"}
                  disabled={r.status === "rejected"}
                  onClick={() => updateStatus(r.id, "rejected")}
                />
              </div>
            ),
          },
        ]}
        rows={apps}
      />
    </div>
  );
}
