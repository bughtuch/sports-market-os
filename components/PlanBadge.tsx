import type { PlanId } from "@/lib/plans/planTypes";

interface PlanBadgeProps {
  plan: PlanId | "soon";
  size?: "xs" | "sm";
}

const CONFIG = {
  free:    { label: "FREE",    classes: "text-zinc-400 border-zinc-700/60 bg-zinc-900/60" },
  partner: { label: "PARTNER", classes: "text-amber-400 border-amber-400/30 bg-amber-400/10" },
  api:     { label: "API",     classes: "text-blue-400  border-blue-400/30  bg-blue-400/10"  },
  soon:    { label: "SOON",    classes: "text-zinc-600 border-zinc-800/60 bg-zinc-900/40"    },
};

export default function PlanBadge({ plan, size = "xs" }: PlanBadgeProps) {
  const cfg = CONFIG[plan];
  const textSize = size === "sm" ? "text-[9px]" : "text-[8px]";
  return (
    <span
      className={`inline-block font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-sm border ${textSize} ${cfg.classes}`}
    >
      {cfg.label}
    </span>
  );
}
