"use client";

interface AdminActionButtonProps {
  label: string;
  onClick: () => void;
  loading?: boolean;
  variant?: "default" | "approve" | "reject" | "warn";
  disabled?: boolean;
}

const VARIANT_STYLES = {
  default:  "text-zinc-400 border-zinc-700 hover:text-white hover:border-zinc-500",
  approve:  "text-emerald-400 border-emerald-400/30 hover:bg-emerald-400/10",
  reject:   "text-red-400 border-red-400/30 hover:bg-red-400/10",
  warn:     "text-amber-400 border-amber-400/30 hover:bg-amber-400/10",
};

export default function AdminActionButton({
  label,
  onClick,
  loading = false,
  variant = "default",
  disabled = false,
}: AdminActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`text-[8px] font-mono uppercase tracking-wider px-2 py-1 border rounded-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${VARIANT_STYLES[variant]}`}
    >
      {loading ? "…" : label}
    </button>
  );
}
