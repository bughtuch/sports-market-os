"use client";

import { useState } from "react";
import Link from "next/link";
import { useSignUp } from "@/hooks/useAuth";

export default function SignUpPage() {
  const { signUp, loading, error } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError(null);

    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setValidationError("Passwords do not match.");
      return;
    }

    const ok = await signUp(email, password);
    if (ok) setDone(true);
  }

  const displayError = validationError ?? error;

  if (done) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <div className="h-8 border-b border-zinc-900 flex items-center px-6">
          <Link href="/" className="text-zinc-600 text-[10px] font-mono hover:text-zinc-400 transition-colors">
            ← Sports Market OS
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-sm text-center">
            <div className="w-10 h-10 rounded-sm bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-emerald-400 text-lg">◈</span>
            </div>
            <h2 className="text-white text-xl font-semibold mb-2">Check your inbox</h2>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6">
              We&apos;ve sent a confirmation link to <span className="text-zinc-300">{email}</span>.
              Click it to activate your account.
            </p>
            <Link
              href="/signin"
              className="inline-block text-xs font-medium text-black bg-white px-5 py-2.5 rounded-sm hover:bg-zinc-200 transition-colors"
            >
              Go to sign in →
            </Link>
          </div>
        </div>
      </div>
    );
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
              Free Access
            </p>
            <h1 className="text-white text-xl font-semibold tracking-tight">
              Create your account
            </h1>
            <p className="text-zinc-500 text-sm mt-1.5">
              Live market intelligence — free forever. No card required.
            </p>
          </div>

          {/* Free tier callout */}
          <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-3 mb-6 flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot mt-1 shrink-0" />
            <div>
              <p className="text-zinc-300 text-xs font-medium mb-0.5">Free plan includes</p>
              <p className="text-zinc-600 text-[10px] leading-relaxed">
                Market pulse signals · Share card generation · AI market summaries · Creator network access
              </p>
            </div>
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
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
                className="w-full bg-zinc-950 border border-zinc-800 text-white text-sm font-mono px-3 py-2.5 rounded-sm placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600 transition-colors"
              />
            </div>

            <div>
              <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 text-white text-sm font-mono px-3 py-2.5 rounded-sm placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600 transition-colors"
              />
            </div>

            {displayError && (
              <div className="bg-red-950/40 border border-red-900/60 rounded-sm px-3 py-2.5">
                <p className="text-red-400 text-xs font-mono">{displayError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black text-sm font-medium py-2.5 rounded-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account…" : "Create free account"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-zinc-900">
            <p className="text-zinc-600 text-xs">
              Already have an account?{" "}
              <Link href="/signin" className="text-white hover:text-zinc-300 transition-colors">
                Sign in →
              </Link>
            </p>
          </div>

          <div className="mt-8 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot" />
            <span className="text-zinc-700 text-[9px] font-mono">SYSTEM NOMINAL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
