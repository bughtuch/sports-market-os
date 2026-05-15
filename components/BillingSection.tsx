"use client";

/**
 * BillingSection — Account billing UI.
 * Shows subscription status, period end, manage billing button, upgrade CTAs.
 * Handles billing=success / billing=cancelled query params from Stripe redirects.
 */

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { BillingState } from "@/lib/stripe/stripeTypes";
import { STATUS_COLOR, STATUS_LABEL } from "@/lib/stripe/stripeTypes";
import type { SubscriptionStatus } from "@/lib/stripe/stripeTypes";
import PlanBadge from "@/components/PlanBadge";
import type { PlanId } from "@/lib/plans/planTypes";

interface Props {
  plan:                PlanId;
  subscriptionStatus:  string;
  stripeCustomerId:    string | null;
  currentPeriodEnd:    string | null;
  stripeConfigured:    boolean;
}

type ActionState = "idle" | "loading" | "error";

export default function BillingSection({
  plan,
  subscriptionStatus,
  stripeCustomerId,
  currentPeriodEnd,
  stripeConfigured,
}: Props) {
  const searchParams   = useSearchParams();
  const [state, setState] = useState<ActionState>("idle");

  const billingOutcome = searchParams.get("billing");  // "success" | "cancelled" | null
  const status = (subscriptionStatus || "free") as SubscriptionStatus;
  const isActive = status === "active" || status === "trialing";
  const hasBillingAccount = Boolean(stripeCustomerId);

  // ─── Checkout ──────────────────────────────────────────────────────────────

  async function startCheckout(targetPlan: "partner" | "api") {
    setState("loading");
    try {
      const res  = await fetch("/api/billing/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ plan: targetPlan }),
      });

      if (res.status === 401) {
        window.location.href = "/signin?next=/pricing";
        return;
      }

      const json = await res.json() as { url?: string; error?: string };
      if (json.url) {
        window.location.href = json.url;
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  // ─── Portal ────────────────────────────────────────────────────────────────

  async function openPortal() {
    setState("loading");
    try {
      const res  = await fetch("/api/billing/portal", { method: "POST" });
      const json = await res.json() as { url?: string; error?: string };
      if (json.url) {
        window.location.href = json.url;
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4 max-w-xl">

      {/* Outcome banner */}
      {billingOutcome === "success" && (
        <div className="border border-emerald-500/30 bg-emerald-950/20 rounded-sm px-4 py-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          <p className="text-emerald-400 text-[11px]">
            Subscription activated — your plan has been upgraded. Refresh if the plan badge hasn&apos;t updated yet.
          </p>
        </div>
      )}
      {billingOutcome === "cancelled" && (
        <div className="border border-zinc-700/40 bg-zinc-950 rounded-sm px-4 py-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
          <p className="text-zinc-400 text-[11px]">Checkout cancelled. Your plan has not changed.</p>
        </div>
      )}

      {/* Main billing card */}
      <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <PlanBadge plan={plan} size="sm" />
              <span className={`text-[9px] font-mono ${STATUS_COLOR[status]}`}>
                {STATUS_LABEL[status]}
              </span>
            </div>
            {currentPeriodEnd && isActive && (
              <p className="text-zinc-500 text-[10px] font-mono">
                Renews {new Date(currentPeriodEnd).toLocaleDateString("en-GB", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </p>
            )}
            {status === "past_due" && (
              <p className="text-amber-400 text-[10px] mt-1">
                Payment failed — update your payment method to keep access.
              </p>
            )}
            {status === "cancelled" && currentPeriodEnd && (
              <p className="text-zinc-400 text-[10px] mt-1">
                Access until {new Date(currentPeriodEnd).toLocaleDateString("en-GB", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        {!stripeConfigured ? (
          <p className="text-zinc-600 text-[10px] font-mono">Billing not configured — set Stripe env vars.</p>
        ) : hasBillingAccount ? (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => void openPortal()}
              disabled={state === "loading"}
              className="text-[11px] font-mono text-zinc-300 border border-zinc-700 px-4 py-2 rounded-sm hover:border-zinc-500 hover:text-white transition-colors disabled:opacity-40"
            >
              {state === "loading" ? "Loading…" : "Manage billing →"}
            </button>
            {plan === "free" && (
              <>
                <button
                  onClick={() => void startCheckout("partner")}
                  disabled={state === "loading"}
                  className="text-[11px] font-mono text-black bg-amber-400 px-4 py-2 rounded-sm hover:bg-amber-300 transition-colors disabled:opacity-40"
                >
                  Upgrade to Partner
                </button>
                <button
                  onClick={() => void startCheckout("api")}
                  disabled={state === "loading"}
                  className="text-[11px] font-mono text-black bg-blue-400 px-4 py-2 rounded-sm hover:bg-blue-300 transition-colors disabled:opacity-40"
                >
                  Unlock API Access
                </button>
              </>
            )}
            {plan === "partner" && (
              <button
                onClick={() => void startCheckout("api")}
                disabled={state === "loading"}
                className="text-[11px] font-mono text-black bg-blue-400 px-4 py-2 rounded-sm hover:bg-blue-300 transition-colors disabled:opacity-40"
              >
                Upgrade to API
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {plan === "free" && (
              <>
                <button
                  onClick={() => void startCheckout("partner")}
                  disabled={state === "loading"}
                  className="text-[11px] font-mono text-black bg-amber-400 px-4 py-2 rounded-sm hover:bg-amber-300 transition-colors disabled:opacity-40"
                >
                  {state === "loading" ? "Loading…" : "Upgrade to Partner — $97/mo"}
                </button>
                <button
                  onClick={() => void startCheckout("api")}
                  disabled={state === "loading"}
                  className="text-[11px] font-mono text-black bg-blue-400 px-4 py-2 rounded-sm hover:bg-blue-300 transition-colors disabled:opacity-40"
                >
                  {state === "loading" ? "Loading…" : "Unlock API Access — $297/mo"}
                </button>
              </>
            )}
          </div>
        )}

        {state === "error" && (
          <p className="text-red-400 text-[10px] font-mono mt-2">
            Something went wrong. Try again or contact support.
          </p>
        )}
      </div>

      {/* Policy note */}
      <p className="text-zinc-700 text-[9px] font-mono leading-relaxed">
        Subscriptions are managed via Stripe. Cancel any time from the billing portal.
        Plan access updates within seconds of payment via webhook.
        Test mode is active until production Stripe keys are set.
      </p>
    </div>
  );
}
