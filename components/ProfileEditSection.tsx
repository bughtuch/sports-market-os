"use client";

import { useState } from "react";
import type { Profile } from "@/lib/db/types";

export default function ProfileEditSection({ profile }: { profile: Profile }) {
  const [username, setUsername] = useState(profile.username ?? "");
  const [handle, setHandle] = useState(profile.creator_handle ?? "");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, creator_handle: handle }),
      });
      const json = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(json.error ?? "Failed to save.");
      } else {
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="max-w-xl space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block mb-1.5">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="yourhandle"
            maxLength={32}
            className="w-full bg-zinc-950 border border-zinc-800 text-white text-sm font-mono px-3 py-2.5 rounded-sm placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>
        <div>
          <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block mb-1.5">
            Creator Handle
          </label>
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="@handle"
            maxLength={64}
            className="w-full bg-zinc-950 border border-zinc-800 text-white text-sm font-mono px-3 py-2.5 rounded-sm placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>
      </div>

      {status === "error" && errorMsg && (
        <p className="text-red-400 text-[10px] font-mono">{errorMsg}</p>
      )}
      {status === "saved" && (
        <p className="text-emerald-400 text-[10px] font-mono">Saved successfully.</p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="text-xs font-medium text-black bg-white px-4 py-2 rounded-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
