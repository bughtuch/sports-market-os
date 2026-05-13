"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthContext } from "@/providers/AuthProvider";

interface Props {
  sport: string;
  marketName: string;
  marketType?: string;
  source?: string;
}

export default function SaveToWatchlistButton({ sport, marketName, marketType, source }: Props) {
  const { user, loading } = useAuthContext();
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [showPrompt, setShowPrompt] = useState(false);

  if (loading) return null;

  if (!user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowPrompt((v) => !v)}
          className="text-[9px] font-mono text-zinc-600 hover:text-zinc-400 border border-zinc-800 hover:border-zinc-600 px-1.5 py-0.5 rounded-sm transition-colors"
        >
          Save
        </button>
        {showPrompt && (
          <div className="absolute right-0 top-full mt-1.5 w-56 bg-zinc-950 border border-zinc-800 rounded-sm shadow-xl z-20 p-3">
            <p className="text-zinc-300 text-xs font-medium mb-1">Save market intelligence</p>
            <p className="text-zinc-600 text-[10px] leading-relaxed mb-3">
              Create a free account to save market intelligence to your watchlist.
            </p>
            <div className="flex items-center gap-2">
              <Link
                href="/signup"
                className="text-[10px] font-medium text-black bg-white px-2.5 py-1.5 rounded-sm hover:bg-zinc-200 transition-colors"
              >
                Get free access
              </Link>
              <Link
                href="/signin"
                className="text-[10px] font-mono text-zinc-500 hover:text-white transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  async function handleSave() {
    setState("saving");
    try {
      const res = await fetch("/api/markets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sport, market_name: marketName, market_type: marketType, source }),
      });
      if (res.ok) {
        setState("saved");
      } else {
        setState("error");
        setTimeout(() => setState("idle"), 3000);
      }
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  }

  if (state === "saved") {
    return (
      <span className="text-[9px] font-mono text-emerald-500 border border-emerald-800/40 px-1.5 py-0.5 rounded-sm">
        Saved ✓
      </span>
    );
  }

  return (
    <button
      onClick={handleSave}
      disabled={state === "saving"}
      className={`text-[9px] font-mono border px-1.5 py-0.5 rounded-sm transition-colors ${
        state === "error"
          ? "text-red-400 border-red-800/40"
          : "text-zinc-600 hover:text-zinc-300 border-zinc-800 hover:border-zinc-600"
      } disabled:opacity-50`}
    >
      {state === "saving" ? "…" : state === "error" ? "Error" : "Save"}
    </button>
  );
}
