"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://sportsmarketos.com/reset-password",
      });

      if (error) {
        setErrorMsg(error.message);
        setState("error");
      } else {
        setState("success");
      }
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setState("error");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top bar */}
      <div className="h-8 border-b border-zinc-900 flex items-center px-6">
        <Link href="/signin" className="text-zinc-600 text-[10px] font-mono hover:text-zinc-400 transition-colors">
          ← Back to sign in
        </Link>
      </div>

      {/* Center form */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-2">
              Account recovery
            </p>
            <h1 className="text-white text-xl font-semibold tracking-tight">
              Reset your password
            </h1>
            <p className="text-zinc-500 text-sm mt-1.5">
              Enter your email and we&apos;ll send a reset link.
            </p>
          </div>

          {state === "success" ? (
            <div className="bg-emerald-950/40 border border-emerald-900/60 rounded-sm px-4 py-4">
              <p className="text-emerald-400 text-sm font-medium mb-1">Check your inbox</p>
              <p className="text-emerald-600 text-xs leading-relaxed">
                If an account exists for <span className="text-emerald-400 font-mono">{email}</span>,
                a password reset link has been sent. Check your spam folder if it doesn&apos;t arrive.
              </p>
            </div>
          ) : (
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

              {state === "error" && (
                <div className="bg-red-950/40 border border-red-900/60 rounded-sm px-3 py-2.5">
                  <p className="text-red-400 text-xs font-mono">{errorMsg}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={state === "loading"}
                className="w-full bg-white text-black text-sm font-medium py-2.5 rounded-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state === "loading" ? "Sending…" : "Send reset link"}
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-zinc-900">
            <p className="text-zinc-600 text-xs">
              Remember your password?{" "}
              <Link href="/signin" className="text-white hover:text-zinc-300 transition-colors">
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
