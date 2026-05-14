"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { PartnerProfile } from "@/lib/partners/partnerTypes";
import { buildReferralDisplay } from "@/lib/partners/referralUtils";

/**
 * Shown at the top of Content Command sections.
 * If partner code exists: shows the tracked referral URL to append to posts.
 * If not: prompts to create a partner profile.
 */
export default function ContentCommandReferralBadge() {
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/partner/profile", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setProfile(data.profile ?? null))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) return null;

  if (!profile) {
    return (
      <div className="mb-4 flex items-center gap-3 px-3 py-2 bg-zinc-950/60 border border-zinc-800/40 rounded-sm">
        <span className="w-1 h-1 rounded-full bg-zinc-600 shrink-0" />
        <p className="text-zinc-600 text-[10px] leading-relaxed">
          No partner code.{" "}
          <Link href="/partner-dashboard" className="text-zinc-400 hover:text-white transition-colors underline underline-offset-2">
            Create partner profile
          </Link>{" "}
          to append tracked links to generated posts.
        </p>
      </div>
    );
  }

  const displayUrl = buildReferralDisplay(profile.partnerCode);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(`https://${displayUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silent
    }
  }

  return (
    <div className="mb-4 flex items-center gap-3 px-3 py-2 bg-zinc-950/60 border border-emerald-400/10 rounded-sm">
      <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
      <p className="text-zinc-500 text-[10px] leading-relaxed flex-1">
        Partner link:{" "}
        <span className="text-emerald-400 font-mono">{displayUrl}</span>
        {" "}— append to generated posts for tracked attribution.
      </p>
      <button
        onClick={copyCode}
        className="shrink-0 text-[8px] font-mono text-zinc-400 hover:text-white transition-colors"
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
    </div>
  );
}
