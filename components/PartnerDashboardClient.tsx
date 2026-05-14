"use client";

import { useState } from "react";
import Link from "next/link";
import type { PartnerProfile, PartnerMetrics } from "@/lib/partners/partnerTypes";
import { generatePartnerCode, buildReferralUrl, buildReferralDisplay } from "@/lib/partners/referralUtils";

interface Props {
  profile: PartnerProfile | null;
  metrics: PartnerMetrics | null;
  referralUrl: string | null;
  referralDisplay: string | null;
  userEmail: string;
}

const METRIC_ROWS = [
  { key: "clicks",         label: "Referral Clicks",  color: "text-blue-400"    },
  { key: "signups",        label: "Attributed Signups",color: "text-emerald-400" },
  { key: "exports",        label: "Creator Exports",   color: "text-purple-400"  },
  { key: "apiReferrals",   label: "API Referrals",     color: "text-amber-400"   },
  { key: "estimatedReach", label: "Estimated Reach",   color: "text-teal-400"    },
] as const;

export default function PartnerDashboardClient({
  profile,
  metrics,
  referralUrl,
  referralDisplay,
  userEmail,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);
  const [localProfile, setLocalProfile] = useState(profile);
  const [localMetrics, setLocalMetrics] = useState(metrics);
  const [localReferralUrl, setLocalReferralUrl] = useState(referralUrl);
  const [localReferralDisplay, setLocalReferralDisplay] = useState(referralDisplay);
  const [error, setError] = useState<string | null>(null);

  async function copyLink() {
    if (!localReferralUrl) return;
    try {
      await navigator.clipboard.writeText(localReferralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select input
    }
  }

  async function createProfile() {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/partner/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.profile) {
        setLocalProfile(data.profile);
        setLocalReferralUrl(data.referralUrl);
        setLocalReferralDisplay(buildReferralDisplay(data.profile.partnerCode));
        setLocalMetrics({
          partnerCode:    data.profile.partnerCode,
          clicks:         0,
          signups:        0,
          exports:        0,
          apiReferrals:   0,
          estimatedReach: 0,
          updatedAt:      new Date().toISOString(),
        });
      } else {
        setError(data.error ?? "Could not create partner profile.");
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setCreating(false);
    }
  }

  // No profile yet — show creation prompt
  if (!localProfile) {
    // Generate a preview code from the email for display
    const previewCode = generatePartnerCode(userEmail);
    const previewUrl  = buildReferralUrl(previewCode);

    return (
      <section className="px-6 py-8 border-b border-zinc-900">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              Partner Status
            </span>
            <div className="flex-1 h-px bg-zinc-900" />
            <span className="text-amber-500 text-[8px] font-mono uppercase">No Profile</span>
          </div>

          <div className="p-5 bg-zinc-950 border border-zinc-800/60 rounded-sm mb-4">
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              Create your partner profile to get a tracked referral link.
              Your code will be: <span className="text-emerald-400 font-mono">{previewCode}</span>
            </p>
            <p className="text-zinc-600 text-[10px] mb-5">
              Preview referral URL: <span className="text-zinc-500 font-mono">{previewUrl}</span>
            </p>
            {error && (
              <p className="text-red-400 text-[10px] font-mono mb-3">{error}</p>
            )}
            <button
              onClick={createProfile}
              disabled={creating}
              className="text-sm font-medium text-black bg-emerald-400 px-5 py-2.5 rounded-sm hover:bg-emerald-300 transition-colors disabled:opacity-50"
            >
              {creating ? "Creating…" : "Create Partner Profile →"}
            </button>
          </div>

          <p className="text-zinc-700 text-[9px] font-mono">
            No earnings are guaranteed. Partner attribution tracks referrals for future commission infrastructure.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* ─── Partner status + referral link ──────────────────────────── */}
      <section className="px-6 py-6 border-b border-zinc-900">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            Your Referral Link
          </span>
          <div className="flex-1 h-px bg-zinc-900" />
          <span className={`text-[8px] font-mono uppercase ${
            localProfile.status === "active"  ? "text-emerald-500" :
            localProfile.status === "pending" ? "text-amber-500"   : "text-red-500"
          }`}>
            {localProfile.status}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 max-w-xl mb-4">
          <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-sm px-3 py-2.5 font-mono text-[11px] text-zinc-400 truncate">
            {localReferralDisplay}
          </div>
          <button
            onClick={copyLink}
            className="shrink-0 text-xs font-medium text-black bg-emerald-400 px-4 py-2.5 rounded-sm hover:bg-emerald-300 transition-colors min-w-[100px]"
          >
            {copied ? "Copied ✓" : "Copy Link"}
          </button>
        </div>

        {/* QR placeholder */}
        <div className="w-24 h-24 border border-zinc-800 rounded-sm bg-zinc-950 flex items-center justify-center mb-3">
          <div className="text-center">
            <div className="grid grid-cols-3 gap-0.5 mb-1 mx-auto w-fit">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-[1px] ${
                  [0,1,3,4,5,8].includes(i) ? "bg-zinc-500" : "bg-zinc-900"
                }`} />
              ))}
            </div>
            <p className="text-zinc-700 text-[7px] font-mono">QR</p>
          </div>
        </div>
        <p className="text-zinc-700 text-[8px] font-mono">
          QR code generation — coming soon
        </p>
      </section>

      {/* ─── Metrics ─────────────────────────────────────────────────── */}
      <section className="px-6 py-6 border-b border-zinc-900">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            Tracked Referrals
          </span>
          <div className="flex-1 h-px bg-zinc-900" />
          {localMetrics && (
            <span className="text-zinc-700 text-[8px] font-mono">
              Updated {new Date(localMetrics.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {METRIC_ROWS.map(({ key, label, color }) => {
            const value = localMetrics ? localMetrics[key] : 0;
            return (
              <div key={key} className="p-4 bg-zinc-950 border border-zinc-800/60 rounded-sm">
                <p className="text-zinc-600 text-[8px] font-mono uppercase tracking-widest mb-1">
                  {label}
                </p>
                <p className={`text-xl font-bold tabular-nums ${color}`}>
                  {value.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>

        {(!localMetrics || (localMetrics.clicks === 0 && localMetrics.signups === 0)) && (
          <p className="text-zinc-700 text-[9px] font-mono mt-3">
            Share your referral link to start tracking. Clicks and signups will appear here within minutes.
          </p>
        )}
      </section>

      {/* ─── Referral URL for sharing ────────────────────────────────── */}
      <section className="px-6 py-6 border-b border-zinc-900">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            Share Your Link
          </span>
          <div className="flex-1 h-px bg-zinc-900" />
        </div>
        <div className="flex flex-wrap gap-3">
          {localReferralUrl && [
            {
              label: "X / Twitter",
              href: `https://x.com/intent/tweet?text=${encodeURIComponent(
                `I use Sports Market OS for exchange microstructure intelligence — market data, AI signals, and creator tools.\n\n${localReferralUrl}`
              )}`,
            },
            {
              label: "Copy for Telegram",
              href: "#",
            },
          ].map(({ label, href }) => (
            href === "#" ? (
              <button
                key={label}
                onClick={copyLink}
                className="text-[9px] font-mono px-3 py-1.5 border border-zinc-800 rounded-sm hover:border-zinc-600 text-zinc-400 hover:text-white transition-colors"
              >
                {label} →
              </button>
            ) : (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] font-mono px-3 py-1.5 border border-zinc-800 rounded-sm hover:border-zinc-600 text-zinc-400 hover:text-white transition-colors"
              >
                {label} →
              </Link>
            )
          ))}
        </div>
      </section>
    </>
  );
}
