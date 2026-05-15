/**
 * stripeTypes.ts — Type definitions for billing state.
 */

import type { PlanId } from "@/lib/plans/planTypes";

export type SubscriptionStatus =
  | "free"
  | "active"
  | "trialing"
  | "past_due"
  | "cancelled"
  | "unpaid"
  | "incomplete";

/** Billing state stored on profiles row. */
export interface BillingState {
  plan:                 PlanId;
  subscription_status:  SubscriptionStatus;
  stripe_customer_id:   string | null;
  stripe_subscription_id: string | null;
  current_period_end:   string | null;
}

/** What the checkout API returns to the client. */
export interface CheckoutResponse {
  url: string;
}

/** What the portal API returns to the client. */
export interface PortalResponse {
  url: string;
}

export const STATUS_COLOR: Record<SubscriptionStatus, string> = {
  free:       "text-zinc-500",
  active:     "text-emerald-400",
  trialing:   "text-blue-400",
  past_due:   "text-amber-400",
  cancelled:  "text-red-400",
  unpaid:     "text-red-400",
  incomplete: "text-zinc-500",
};

export const STATUS_LABEL: Record<SubscriptionStatus, string> = {
  free:       "Free",
  active:     "Active",
  trialing:   "Trial",
  past_due:   "Past due",
  cancelled:  "Cancelled",
  unpaid:     "Unpaid",
  incomplete: "Incomplete",
};
