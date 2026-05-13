"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignIn } from "@/hooks/useAuth";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/terminal";

  const { signIn, loading, error } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await signIn(email, password);
    if (ok) {
      setSuccess(true);
      router.push(next);
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top bar */}
      <div className="h-8 border-b border-zinc-900 flex items-center px-6">
        <Link href="/" className="text-zinc-600 text-[10px] font-mono hover:text-zinc-400 transition-colors">
          ← Sports Market OS
        </Link>
      </div>

      {/* Center form */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="mb-8">
            <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-2">
              Intelligence Terminal
            </p>
            <h1 className="text-white text-xl font-semibold tracking-tight">
              Sign in to your account
            </h1>
            <p className="text-zinc-500 text-sm mt-1.5">
              Access live market intelligence and your creator tools.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full bg-zinc-950 border border-zinc-800 text-white text-sm font-mono px-3 py-2.5 rounded-sm placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600 transition-colors"
              />
            </div>

            <div>
              <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 text-white text-sm font-mono px-3 py-2.5 rounded-sm placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600 transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-950/40 border border-red-900/60 rounded-sm px-3 py-2.5">
                <p className="text-red-400 text-xs font-mono">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-emerald-950/40 border border-emerald-900/60 rounded-sm px-3 py-2.5">
                <p className="text-emerald-400 text-xs font-mono">Signed in — redirecting…</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-white text-black text-sm font-medium py-2.5 rounded-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-zinc-900">
            <p className="text-zinc-600 text-xs">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-white hover:text-zinc-300 transition-colors">
                Get free access →
              </Link>
            </p>
          </div>

          {/* Status */}
          <div className="mt-8 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot" />
            <span className="text-zinc-700 text-[9px] font-mono">SYSTEM NOMINAL</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
