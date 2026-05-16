"use client";

/**
 * PublicNavBar — sticky marketing navigation.
 *
 * Replaces the per-page TerminalHeader + MarketTicker combo on all public
 * (non-terminal) pages. Handles its own auth state via useAuthContext so it
 * does not depend on NavAuth's opinionated button layout.
 *
 * Desktop: wordmark · center nav links · Sign in + Open Terminal CTA
 * Mobile:  wordmark · hamburger → fullscreen overlay with stacked nav + auth
 */

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/providers/AuthProvider";
import AccountDropdown from "@/components/AccountDropdown";

const NAV_LINKS = [
  { label: "Terminal",  href: "/terminal" },
  { label: "Markets",   href: "/markets" },
  { label: "Ledger",    href: "/accuracy" },
  { label: "Pricing",   href: "/pricing" },
  { label: "Partners",  href: "/partners" },
  { label: "API",       href: "/api-access" },
];

export default function PublicNavBar() {
  const pathname  = usePathname();
  const { user, loading } = useAuthContext();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      {/* ── Desktop / tablet bar ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 h-16 bg-black border-b border-zinc-800/60 flex items-center shrink-0">
        <div className="w-full max-w-screen-xl mx-auto px-6 flex items-center justify-between gap-6">

          {/* Left: wordmark */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <span className="text-white text-sm font-semibold font-mono tracking-widest uppercase">
              Sports Market OS
            </span>
            <span className="hidden lg:inline text-zinc-600 text-[10px] font-mono uppercase tracking-wider">
              Intelligence Terminal
            </span>
          </Link>

          {/* Center: nav links (hidden on mobile) */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`text-[13px] font-mono transition-colors ${
                  isActive(href)
                    ? "text-white underline underline-offset-4 decoration-zinc-600"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right: auth + CTA (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            {loading && (
              <span className="w-16 h-5 bg-zinc-900 rounded-sm animate-pulse" />
            )}
            {!loading && user && (
              <AccountDropdown user={user} />
            )}
            {!loading && !user && (
              <Link
                href="/signin"
                className="text-zinc-500 text-[13px] font-mono hover:text-white transition-colors"
              >
                Sign in
              </Link>
            )}
            <Link
              href="/terminal"
              className="text-[13px] font-mono font-medium text-black bg-white px-4 py-2 rounded-md hover:bg-zinc-200 transition-colors"
            >
              Open Terminal →
            </Link>
          </div>

          {/* Mobile: hamburger */}
          <button
            className="md:hidden text-zinc-400 hover:text-white transition-colors p-1"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4l12 12M16 4L4 16" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 6h14M3 10h14M3 14h14" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ── Mobile overlay ────────────────────────────────────────────────── */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-black flex flex-col pt-16">

          {/* Nav links */}
          <nav className="flex-1 flex flex-col px-6 pt-6">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`py-4 text-base font-mono border-b border-zinc-900 transition-colors ${
                  isActive(href) ? "text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth block at bottom */}
          <div className="px-6 py-8 space-y-3 border-t border-zinc-900">
            {!loading && user && (
              <div onClick={() => setOpen(false)}>
                <AccountDropdown user={user} />
              </div>
            )}
            {!loading && !user && (
              <Link
                href="/signin"
                onClick={() => setOpen(false)}
                className="block text-center text-sm font-mono text-zinc-400 border border-zinc-700 py-3 rounded-md hover:border-zinc-500 hover:text-white transition-colors"
              >
                Sign in
              </Link>
            )}
            <Link
              href="/terminal"
              onClick={() => setOpen(false)}
              className="block text-center text-sm font-mono font-medium text-black bg-white py-3 rounded-md hover:bg-zinc-200 transition-colors"
            >
              Open Terminal →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
