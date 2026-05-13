"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthContext } from "@/providers/AuthProvider";

const PLATFORMS = ["Telegram", "X / Twitter", "Discord", "Reddit", "Newsletter", "YouTube", "Other"];

export default function PartnerApplyButton() {
  const { user, loading } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [audienceSize, setAudienceSize] = useState("");
  const [channelUrl, setChannelUrl] = useState("");
  const [reason, setReason] = useState("");

  if (loading) return null;

  if (!user) {
    return (
      <div className="relative inline-block">
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-xs font-medium text-black bg-white px-4 py-1.5 rounded-sm hover:bg-zinc-200 transition-colors"
        >
          Apply For Partner Access
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-zinc-950 border border-zinc-800 rounded-sm shadow-xl z-20 p-4">
            <p className="text-zinc-300 text-sm font-medium mb-1">Partner Network</p>
            <p className="text-zinc-600 text-xs leading-relaxed mb-4">
              Create a free account to apply for partner access.
            </p>
            <div className="flex items-center gap-2">
              <Link
                href="/signup"
                className="text-xs font-medium text-black bg-white px-3 py-1.5 rounded-sm hover:bg-zinc-200 transition-colors"
              >
                Get free access
              </Link>
              <Link
                href="/signin"
                className="text-xs font-mono text-zinc-500 hover:text-white transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 bg-zinc-950 border border-emerald-900/40 rounded-sm px-4 py-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot shrink-0" />
        <span className="text-emerald-400 text-xs font-mono">Application received — pending review.</span>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, platform, audience_size: audienceSize, channel_url: channelUrl, reason }),
      });
      const json = await res.json() as { error?: string };
      if (!res.ok) {
        setError(json.error ?? "Submission failed.");
        return;
      }
      setSubmitted(true);
      setOpen(false);
    } catch {
      setError("Network error.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-xs font-medium text-black bg-white px-4 py-1.5 rounded-sm hover:bg-zinc-200 transition-colors"
      >
        Apply For Partner Access
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
          />
          {/* Modal */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-zinc-950 border border-zinc-800 rounded-sm shadow-2xl z-40 p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white text-sm font-semibold">Partner Application</p>
              <button
                onClick={() => setOpen(false)}
                className="text-zinc-600 hover:text-zinc-400 text-[10px] font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block mb-1">
                  Name / Channel
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="@YourHandle"
                  className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs font-mono px-2.5 py-2 rounded-sm placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block mb-1">
                  Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs font-mono px-2.5 py-2 rounded-sm focus:outline-none focus:border-zinc-600"
                >
                  {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block mb-1">
                  Audience Size
                </label>
                <input
                  type="text"
                  value={audienceSize}
                  onChange={(e) => setAudienceSize(e.target.value)}
                  placeholder="e.g. 12,000 subscribers"
                  className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs font-mono px-2.5 py-2 rounded-sm placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block mb-1">
                  Channel URL
                </label>
                <input
                  type="text"
                  value={channelUrl}
                  onChange={(e) => setChannelUrl(e.target.value)}
                  placeholder="https://…"
                  className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs font-mono px-2.5 py-2 rounded-sm placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block mb-1">
                  Why do you want to partner?
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  placeholder="Tell us about your audience and goals…"
                  className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs font-mono px-2.5 py-2 rounded-sm placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600 resize-none"
                />
              </div>

              {error && (
                <p className="text-red-400 text-[10px] font-mono">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full text-xs font-medium text-black bg-white py-2 rounded-sm hover:bg-zinc-200 transition-colors disabled:opacity-50"
              >
                {submitting ? "Submitting…" : "Submit Application"}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
