"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NavAuth from "@/components/NavAuth";

interface QuotaState {
  remaining: number | null;
  used: number | null;
  lastSync: string | null;
}

const IS_DEV = process.env.NODE_ENV !== "production";

const NAV_LINKS = [
  { label: "Terminal",  href: "/terminal" },
  { label: "Markets",   href: "/markets" },
  { label: "Ledger",    href: "/accuracy" },
  { label: "Pricing",   href: "/pricing" },
  { label: "Partners",  href: "/partners" },
  { label: "API",       href: "/api-access" },
];

export default function TerminalHeader() {
  const [utcTime, setUtcTime] = useState("");
  const [quota, setQuota] = useState<QuotaState | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = now.getUTCHours().toString().padStart(2, "0");
      const m = now.getUTCMinutes().toString().padStart(2, "0");
      setUtcTime(`${h}:${m}`);
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!IS_DEV) return;
    const fetchQuota = () => {
      fetch("/api/live/odds-quota")
        .then((r) => r.json())
        .then((d: QuotaState) => setQuota(d))
        .catch(() => {/* non-fatal */});
    };
    fetchQuota();
    const id = setInterval(fetchQuota, 60000);
    return () => clearInterval(id);
  }, []);

  const lastSyncLabel = quota?.lastSync
    ? (() => {
        const d = new Date(quota.lastSync);
        const h = d.getUTCHours().toString().padStart(2, "0");
        const m = d.getUTCMinutes().toString().padStart(2, "0");
        return `${h}:${m} UTC`;
      })()
    : null;

  return (
    <>
      <div className="h-11 md:h-7 shrink-0 border-b border-zinc-800/40 bg-black flex items-center px-4 gap-2 overflow-x-auto">
        <span className="text-zinc-600 text-[10px] font-mono tabular-nums">
          {utcTime || "--:--"} UTC
        </span>

        {IS_DEV && quota && quota.remaining !== null && (
          <>
            <span className="text-zinc-800 text-[10px] ml-2">·</span>
            <span className="text-amber-600/70 text-[9px] font-mono tabular-nums shrink-0">
              Odds API · {quota.remaining} req remaining
              {lastSyncLabel ? ` · last sync ${lastSyncLabel}` : ""}
            </span>
          </>
        )}

        {/* Auth — push to far right */}
        <div className="ml-auto shrink-0 hidden md:block">
          <NavAuth />
        </div>

        {/* Mobile: hamburger */}
        <button
          className="ml-auto md:hidden flex items-center justify-center w-11 h-11 text-zinc-400 hover:text-white transition-colors"
          onClick={() => setMenuOpen(true)}
          aria-label="Open navigation"
        >
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
            <rect width="18" height="1.5" rx="0.75" fill="currentColor" />
            <rect y="5.25" width="18" height="1.5" rx="0.75" fill="currentColor" />
            <rect y="10.5" width="18" height="1.5" rx="0.75" fill="currentColor" />
          </svg>
        </button>
      </div>

      {/* Mobile nav overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col md:hidden">
          {/* Overlay header */}
          <div className="h-11 shrink-0 border-b border-zinc-800/40 flex items-center px-4 justify-between">
            <Link
              href="/"
              className="text-white text-sm font-semibold font-mono tracking-widest uppercase"
              onClick={() => setMenuOpen(false)}
            >
              Sports Market OS
            </Link>
            <button
              className="w-11 h-11 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center h-11 text-zinc-300 hover:text-white text-sm font-mono transition-colors border-b border-zinc-900/60"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth at bottom */}
          <div className="shrink-0 border-t border-zinc-800/40 px-4 py-6">
            <NavAuth />
          </div>
        </div>
      )}
    </>
  );
}
