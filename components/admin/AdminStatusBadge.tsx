const STATUS_STYLES: Record<string, string> = {
  pending:    "text-amber-400 border-amber-400/30 bg-amber-400/5",
  active:     "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
  approved:   "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
  in_review:  "text-blue-400 border-blue-400/30 bg-blue-400/5",
  rejected:   "text-red-400 border-red-400/30 bg-red-400/5",
  suspended:  "text-red-400 border-red-400/30 bg-red-400/5",
  click:      "text-zinc-400 border-zinc-700",
  signup:     "text-emerald-400 border-emerald-400/30",
  export:     "text-purple-400 border-purple-400/30",
  api_referral: "text-blue-400 border-blue-400/30",
};

const LABEL_MAP: Record<string, string> = {
  in_review:    "In Review",
  api_referral: "API Ref",
};

interface AdminStatusBadgeProps {
  status: string;
}

export default function AdminStatusBadge({ status }: AdminStatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? "text-zinc-500 border-zinc-700";
  const label = LABEL_MAP[status] ?? status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span
      className={`inline-block text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 border rounded-sm ${style}`}
    >
      {label}
    </span>
  );
}
