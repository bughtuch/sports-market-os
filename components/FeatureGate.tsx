import Link from "next/link";
import { hasFeatureAccess, normalizePlan } from "@/lib/plans/featureAccess";
import type { PlanId } from "@/lib/plans/planTypes";
import PlanBadge from "@/components/PlanBadge";

interface FeatureGateProps {
  /** The current user's plan string (from DB — may be legacy value). */
  userPlan: string;
  /** Minimum plan required to access this feature. */
  requiredPlan: PlanId;
  children: React.ReactNode;
  /** Short description shown in the lock overlay. */
  featureLabel?: string;
}

/**
 * Server-compatible feature gate.
 * If the user's plan meets the requirement → renders children.
 * If not → renders a minimal lock overlay with an upgrade link.
 */
export default function FeatureGate({
  userPlan,
  requiredPlan,
  children,
  featureLabel,
}: FeatureGateProps) {
  const plan = normalizePlan(userPlan);

  if (hasFeatureAccess(plan, requiredPlan)) {
    return <>{children}</>;
  }

  const label =
    featureLabel ??
    (requiredPlan === "api" ? "API plan feature" : "Partner plan feature");

  return (
    <div className="relative rounded-sm overflow-hidden">
      {/* Dimmed content preview */}
      <div
        className="opacity-20 pointer-events-none select-none"
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Lock overlay — minimal, terminal-style */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-zinc-950/95 border border-zinc-800/80 rounded-sm px-6 py-4 text-center shadow-2xl">
          <PlanBadge plan={requiredPlan} size="sm" />
          <p className="text-zinc-400 text-xs mt-2 mb-3 max-w-[200px] leading-relaxed">
            {label}
          </p>
          <Link
            href="/pricing"
            className="inline-block text-[10px] font-mono text-black bg-white px-4 py-1.5 rounded-sm hover:bg-zinc-200 transition-colors"
          >
            View plans →
          </Link>
        </div>
      </div>
    </div>
  );
}
