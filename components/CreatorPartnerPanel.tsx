"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { PartnerProfile } from "@/lib/partners/partnerTypes";
import { buildReferralDisplay } from "@/lib/partners/referralUtils";

export default function CreatorPartnerPanel() {
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [referralUrl, setReferralUrl] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/partner/profile", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setProfile(data.profile ?? null);
        setReferralUrl(data.referralUrl ?? null);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) return null;

  if (!profile) {
    return (
      <div className="p-4 bg-zinc-950 border border-zinc-800/60 rounded-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1 h-1 rounded-full bg-amber-400 shrink-0" />
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            Partner Referral
          </span>
        </div>
        <p className="text-zinc-500 text-[11px] leading-relaxed mb-3">
          Create a partner profile to append tracked referral links to your content exports.
        </p>
        <Link
          href="/partner-dashboard"
          className="text-[9px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Create Partner Profile →
        </Link>
      </div>
    );
  }

  const displayUrl = buildReferralDisplay(profile.partnerCode);

  return (
    <div className="p-4 bg-zinc-950 border border-zinc-800/60 rounded-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot shrink-0" />
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
          Partner Referral
        </span>
        <span className={`text-[8px] font-mono uppercase ml-auto ${
          profile.status === "active" ? "text-emerald-500" : "text-amber-500"
        }`}>
          {profile.status}
        </span>
      </div>

      <p className="text-zinc-600 text-[9px] font-mono mb-1">Your referral URL</p>
      <p className="text-emerald-400 text-[10px] font-mono mb-3 truncate">{displayUrl}</p>

      <div className="flex items-center gap-3">
        <Link
          href="/partner-dashboard"
          className="text-[9px] font-mono text-zinc-400 hover:text-white transition-colors"
        >
          Dashboard →
        </Link>
        <span className="text-zinc-800 text-[9px]">·</span>
        <span className="text-zinc-600 text-[9px] font-mono">
          Code: {profile.partnerCode}
        </span>
      </div>
    </div>
  );
}
