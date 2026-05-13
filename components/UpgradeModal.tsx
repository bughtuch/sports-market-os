"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { PlanId } from "@/lib/plans/planTypes";
import { PLANS } from "@/lib/plans/plans";
import PlanBadge from "@/components/PlanBadge";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  targetPlan: Exclude<PlanId, "free">;
  featureLabel?: string;
}

export default function UpgradeModal({
  open,
  onClose,
  targetPlan,
  featureLabel,
}: UpgradeModalProps) {
  const plan = PLANS.find((p) => p.id === targetPlan);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open || !plan) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal card */}
      <div
        className={`w-full max-w-sm bg-zinc-950 border rounded-sm shadow-2xl ${plan.accentBorder}`}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-zinc-900">
          <div className="flex items-start justify-between gap-4">
            <div>
              <PlanBadge plan={plan.id} size="sm" />
              <p className={`text-xl font-bold mt-2 ${plan.accentColor}`}>
                {plan.name} Plan
              </p>
              {plan.monthlyPrice !== null && plan.monthlyPrice > 0 && (
                <p className="text-zinc-400 text-sm mt-0.5">
                  <span className="font-bold text-white">
                    ${plan.monthlyPrice}
                  </span>
                  <span className="text-zinc-600 text-xs"> / month</span>
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-zinc-600 hover:text-zinc-400 text-lg font-mono transition-colors mt-0.5"
            >
              ✕
            </button>
          </div>
          {featureLabel && (
            <p className="text-zinc-500 text-xs mt-3 leading-relaxed">
              {featureLabel}
            </p>
          )}
        </div>

        {/* Features */}
        <div className="px-6 py-4">
          <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-3">
            What&apos;s included
          </p>
          <div className="space-y-2">
            {plan.features
              .filter((f) => f.included)
              .slice(0, 6)
              .map((f) => (
                <div key={f.label} className="flex items-start gap-2">
                  <span className={`text-[10px] font-mono mt-0.5 ${plan.accentColor}`}>
                    ›
                  </span>
                  <span className="text-zinc-400 text-[11px] leading-snug">
                    {f.label}
                  </span>
                  {f.badge === "soon" && (
                    <PlanBadge plan="soon" />
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 pb-6">
          <Link
            href="/pricing"
            onClick={onClose}
            className="block w-full text-center text-sm font-medium text-black bg-white py-2.5 rounded-sm hover:bg-zinc-200 transition-colors mb-3"
          >
            {plan.ctaLabel}
          </Link>
          <p className="text-zinc-700 text-[9px] font-mono text-center leading-relaxed">
            Billing system activates in Sprint 11. Join waitlist via pricing page.
          </p>
        </div>
      </div>
    </div>
  );
}
