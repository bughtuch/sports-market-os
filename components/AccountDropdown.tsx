"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { useSignOut } from "@/hooks/useAuth";

export default function AccountDropdown({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { signOut, loading } = useSignOut();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const email = user.email ?? "";
  const initial = email[0]?.toUpperCase() ?? "U";
  const plan = (user.user_metadata?.plan as string) ?? "free";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 group"
      >
        <span className="w-6 h-6 rounded-sm bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-mono text-white group-hover:border-zinc-500 transition-colors">
          {initial}
        </span>
        <span className="text-zinc-400 text-[10px] font-mono group-hover:text-white transition-colors hidden sm:block">
          {email.length > 20 ? email.slice(0, 18) + "…" : email}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-zinc-950 border border-zinc-800 rounded-sm shadow-xl z-50">
          <div className="px-3 py-2.5 border-b border-zinc-900">
            <p className="text-white text-xs font-medium truncate">{email}</p>
            <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-wider mt-0.5">
              {plan} plan
            </p>
          </div>
          <div className="py-1">
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-zinc-400 text-xs hover:text-white hover:bg-zinc-900 transition-colors"
            >
              Account
            </Link>
            <Link
              href="/watchlists"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-zinc-400 text-xs hover:text-white hover:bg-zinc-900 transition-colors"
            >
              Watchlists
            </Link>
            <Link
              href="/creator-studio"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-zinc-400 text-xs hover:text-white hover:bg-zinc-900 transition-colors"
            >
              Creator Studio
            </Link>
            <Link
              href="/pricing"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-zinc-400 text-xs hover:text-white hover:bg-zinc-900 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/partner-program"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-zinc-400 text-xs hover:text-white hover:bg-zinc-900 transition-colors"
            >
              Partner Program
            </Link>
            <Link
              href="/api-access"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-zinc-400 text-xs hover:text-white hover:bg-zinc-900 transition-colors"
            >
              API Access
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-zinc-400 text-xs hover:text-white hover:bg-zinc-900 transition-colors"
            >
              Contact
            </Link>
          </div>
          <div className="border-t border-zinc-900 py-1">
            <button
              onClick={async () => {
                await signOut();
                setOpen(false);
                window.location.href = "/";
              }}
              disabled={loading}
              className="w-full text-left px-3 py-2 text-zinc-600 text-xs hover:text-red-400 hover:bg-zinc-900 transition-colors"
            >
              {loading ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
