"use client";

import { useEffect, useState } from "react";
import AdminTable from "./AdminTable";
import AdminStatusBadge from "./AdminStatusBadge";

type EventType = "all" | "click" | "signup" | "export" | "api_referral";

interface ReferralEvent {
  id: string;
  partner_code: string;
  event_type: string;
  landing_page: string | null;
  source_url: string | null;
  created_at: string;
}

const FILTERS: { label: string; value: EventType }[] = [
  { label: "All",         value: "all" },
  { label: "Clicks",      value: "click" },
  { label: "Signups",     value: "signup" },
  { label: "Exports",     value: "export" },
  { label: "API Ref",     value: "api_referral" },
];

export default function AdminReferralEvents() {
  const [events, setEvents] = useState<ReferralEvent[]>([]);
  const [filter, setFilter] = useState<EventType>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const url =
      filter === "all"
        ? "/api/admin/referral-events"
        : `/api/admin/referral-events?type=${filter}`;
    fetch(url, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setEvents(d.events ?? []))
      .catch(() => setError("Failed to load referral events."))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`text-[9px] font-mono px-3 py-1.5 border rounded-sm transition-colors ${
              filter === value
                ? "text-white border-zinc-500 bg-zinc-900"
                : "text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && <p className="text-amber-500 text-[9px] font-mono">{error}</p>}

      {loading ? (
        <p className="text-zinc-700 text-[10px] font-mono animate-pulse">Loading events…</p>
      ) : (
        <AdminTable<ReferralEvent>
          keyFn={(r) => r.id}
          emptyMessage={
            filter === "all"
              ? "No referral events recorded yet."
              : `No ${filter} events found.`
          }
          columns={[
            {
              key: "partner_code",
              label: "Partner Code",
              width: "0.8fr",
              render: (r) => (
                <span className="text-emerald-400 font-mono text-[9px]">{r.partner_code}</span>
              ),
            },
            {
              key: "event_type",
              label: "Type",
              width: "0.7fr",
              render: (r) => <AdminStatusBadge status={r.event_type} />,
            },
            {
              key: "landing_page",
              label: "Landing Page",
              width: "1fr",
              render: (r) => (
                <span className="text-zinc-500 text-[9px] truncate block" title={r.landing_page ?? ""}>
                  {r.landing_page ?? "—"}
                </span>
              ),
            },
            {
              key: "source_url",
              label: "Source URL",
              width: "1.5fr",
              render: (r) => (
                <span className="text-zinc-600 text-[9px] truncate block" title={r.source_url ?? ""}>
                  {r.source_url ? (r.source_url.length > 50 ? r.source_url.slice(0, 50) + "…" : r.source_url) : "—"}
                </span>
              ),
            },
            {
              key: "created_at",
              label: "Time",
              width: "0.9fr",
              render: (r) => (
                <span className="text-zinc-600 text-[9px] font-mono">
                  {new Date(r.created_at).toLocaleString()}
                </span>
              ),
            },
          ]}
          rows={events}
        />
      )}

      {!loading && events.length > 0 && (
        <p className="text-zinc-700 text-[9px] font-mono">
          Showing {events.length} event{events.length !== 1 ? "s" : ""} · max 200 results
        </p>
      )}
    </div>
  );
}
