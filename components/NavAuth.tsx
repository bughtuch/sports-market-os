"use client";

import Link from "next/link";
import { useAuthContext } from "@/providers/AuthProvider";
import AccountDropdown from "@/components/AccountDropdown";

export default function NavAuth() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <span className="w-16 h-5 bg-zinc-900 rounded-sm animate-pulse" />;
  }

  if (user) {
    return <AccountDropdown user={user} />;
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/signin"
        className="text-zinc-400 text-xs font-mono hover:text-white transition-colors"
      >
        Sign in
      </Link>
      <Link
        href="/signup"
        className="text-xs font-medium text-black bg-white px-3 py-1.5 rounded-sm hover:bg-zinc-200 transition-colors"
      >
        Get access
      </Link>
    </div>
  );
}
