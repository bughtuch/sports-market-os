"use client";

import { useState } from "react";
import { useAuthContext } from "@/providers/AuthProvider";
import Link from "next/link";

interface Props {
  initialHandle: string | null;
}

export default function CreatorIdentityBanner({ initialHandle }: Props) {
  const { user } = useAuthContext();
  const [handle, setHandle] = useState(initialHandle ?? "");
  const [editing, setEditing] = useState(!initialHandle);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(!!initialHandle);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm px-4 py-3 flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0" />
        <p className="text-zinc-500 text-xs leading-relaxed">
          <Link href="/signup" className="text-white hover:text-zinc-300 transition-colors">
            Create a free creator identity
          </Link>{" "}
          to watermark your signal cards with your handle.
        </p>
      </div>
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!handle.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creator_handle: handle.trim() }),
      });
      const json = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok) {
        setError(json.error ?? "Failed to save.");
      } else {
        setSaved(true);
        setEditing(false);
      }
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  if (saved && !editing) {
    return (
      <div className="bg-zinc-950 border border-purple-400/20 rounded-sm px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 pulse-dot shrink-0" />
          <div>
            <p className="text-white text-xs font-medium">
              Welcome back, <span className="text-purple-400">{handle}</span>
            </p>
            <p className="text-zinc-600 text-[10px] font-mono">Creator identity active · Cards watermarked with your handle</p>
          </div>
        </div>
        <button
          onClick={() => setEditing(true)}
          className="text-[9px] font-mono text-zinc-600 hover:text-zinc-400 border border-zinc-800 hover:border-zinc-600 px-2 py-1 rounded-sm transition-colors shrink-0"
        >
          Edit
        </button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm px-4 py-3">
      <p className="text-zinc-400 text-xs font-medium mb-2">Set your creator handle</p>
      <form onSubmit={handleSave} className="flex items-center gap-2">
        <input
          type="text"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="@YourHandle"
          maxLength={64}
          className="flex-1 bg-zinc-900 border border-zinc-800 text-white text-xs font-mono px-2.5 py-2 rounded-sm placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600"
        />
        <button
          type="submit"
          disabled={saving || !handle.trim()}
          className="text-xs font-medium text-black bg-white px-3 py-2 rounded-sm hover:bg-zinc-200 transition-colors disabled:opacity-50"
        >
          {saving ? "…" : "Save"}
        </button>
        {editing && saved && (
          <button
            type="button"
            onClick={() => { setEditing(false); setHandle(initialHandle ?? ""); }}
            className="text-[10px] font-mono text-zinc-600 hover:text-zinc-400"
          >
            Cancel
          </button>
        )}
      </form>
      {error && <p className="text-red-400 text-[10px] font-mono mt-1.5">{error}</p>}
    </div>
  );
}
