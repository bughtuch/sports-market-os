"use client";

/**
 * AdminBillingMonitoring — Admin view of billing state.
 *
 * Shows the admin account's billing state (RLS-bounded).
 * Platform-wide subscriber counts require a service-role query (future sprint).
 * Mock summary tiles shown until service-role metrics are available.
 */

import { useEffect, useState } from "react";
import type { SubscriptionStatus } from "@/lib/stripe/stripeTypes";
import { STATUS_COLOR, STATUS_LABEL } from "@/lib/stripe/stripeTypes";
import PlanBadge from "@/components/PlanBadge";
import type { PlanId } from "@/lib/plans/planTypes";

interface BillingInfo {
  plan:                PlanId;
  subscription_status: SubscriptionStatus;
  stripe_customer_id:  string | null;
  current_period_end:  string | null;
  email:               string | null;
}

export default function AdminBillingMonitoring() {
  const [billing, setBilling]   = useState<BillingInfo | null>(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch("/api/billing/status")
      .then((r) => r.json())
      .then((j: { billing: BillingInfo }) => setBilling(j.billing))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const status = billing?.subscription_status ?? "free";

  return (
    <div className="space-y-4">

      {/* Summary tiles — mock until service-role metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Stripe configured", value: Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) ? "Yes" : "Check env", color: "text-emerald-400" },
          { label: "Partner subscribers", value: "—",  color: "text-amber-400",  note: "service-role required" },
          { label: "API subscribers",     value: "—",  color: "text-blue-400",   note: "service-role required" },
          { label: "Past due / unpaid",   value: "—",  color: "text-zinc-500",   note: "service-role required" },
        ].map((m) => (
          <div key={m.label} className="border border-zinc-800/60 rounded-sm bg-zinc-950 p-3">
            <p className={`text-xl font-bold tabular-nums ${m.color}`}>{m.value}</p>
            <p className="text-zinc-600 text-[9px] font-mono mt-0.5">{m.label}</p>
            {m.note && <p className="text-zinc-800 text-[8px] font-mono mt-0.5">{m.note}</p>}
          </div>
        ))}
      </div>

      {/* Admin account billing state */}
      <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-900/60">
          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Admin account billing</p>
        </div>
        {loading ? (
          <div className="px-4 py-6 text-zinc-700 text-[10px] font-mono">Loading…</div>
        ) : !billing ? (
          <div className="px-4 py-6 text-zinc-600 text-[10px] font-mono">
            Add GET /api/billing/status route to display live billing state.
          </div>
        ) : (
          <div className="px-4 py-4 space-y-3">
            <div className="flex items-center gap-3">
              <PlanBadge plan={billing.plan} />
              <span className={`text-[10px] font-mono ${STATUS_COLOR[status]}`}>
                {STATUS_LABEL[status]}
              </span>
            </div>
            {billing.stripe_customer_id && (
              <p className="text-zinc-600 text-[9px] font-mono">
                Customer: {billing.stripe_customer_id}
              </p>
            )}
            {billing.current_period_end && (
              <p className="text-zinc-600 text-[9px] font-mono">
                Period ends: {new Date(billing.current_period_end).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Webhook event registry */}
      <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-900/60">
          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Webhook event coverage</p>
        </div>
        <div className="divide-y divide-zinc-900/60">
          {[
            { event: "checkout.session.completed",    action: "Activate plan + store customer/sub IDs" },
            { event: "customer.subscription.created", action: "Upsert plan from price ID"             },
            { event: "customer.subscription.updated", action: "Sync plan + period end"                },
            { event: "customer.subscription.deleted", action: "Downgrade to free"                     },
            { event: "invoice.payment_failed",        action: "Set subscription_status = past_due"    },
          ].map((e) => (
            <div key={e.event} className="px-4 py-2.5 flex items-start gap-3">
              <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
              <code className="text-zinc-400 text-[9px] font-mono flex-1">{e.event}</code>
              <span className="text-zinc-600 text-[9px] shrink-0">{e.action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Platform-wide note */}
      <div className="border border-zinc-800/60 rounded-sm bg-zinc-950 p-4">
        <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1">Platform-wide metrics</p>
        <p className="text-zinc-700 text-[10px] leading-relaxed">
          Subscriber counts across all users require a service-role Supabase query.
          Planned for a future sprint once billing is live in production.
          Register your webhook endpoint at Stripe Dashboard → Webhooks → {"`"}POST /api/stripe/webhook{"`"}.
        </p>
      </div>
    </div>
  );
}
