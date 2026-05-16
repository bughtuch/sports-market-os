"use client";

/**
 * Cookie consent banner — GDPR/PECR compliance.
 *
 * Shows on first visit. Persists choice to localStorage.
 * Key: "smos_cookie_consent" → "accepted" | "declined"
 *
 * Client-side only. Add to layout.tsx inside AuthProvider.
 */

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "smos_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable (SSR, private mode edge cases) — hide banner
    }
  }, []);

  function accept() {
    try { localStorage.setItem(STORAGE_KEY, "accepted"); } catch { /**/ }
    setVisible(false);
  }

  function decline() {
    try { localStorage.setItem(STORAGE_KEY, "declined"); } catch { /**/ }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-sm px-5 py-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6"
    >
      <p className="text-zinc-400 text-[11px] leading-relaxed flex-1 min-w-0">
        We use cookies to keep you signed in and measure anonymous usage.{" "}
        <Link
          href="/cookies"
          className="text-zinc-300 hover:text-white underline underline-offset-2 transition-colors"
        >
          Cookie Policy
        </Link>
        {" · "}
        <Link
          href="/privacy"
          className="text-zinc-300 hover:text-white underline underline-offset-2 transition-colors"
        >
          Privacy Policy
        </Link>
      </p>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={decline}
          className="text-[10px] font-mono text-zinc-600 hover:text-zinc-400 transition-colors px-3 py-1.5"
        >
          Decline
        </button>
        <button
          onClick={accept}
          className="text-[10px] font-mono font-medium text-black bg-white px-4 py-1.5 rounded-sm hover:bg-zinc-200 transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
