"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      setState("error");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      setState("error");
      return;
    }

    setState("loading");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setErrorMsg(error.message);
        setState("error");
      } else {
        setState("success");
        setTimeout(() => {
          router.push("/signin?reset=success");
        }, 1500);
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
        <Link href="/" className="text-zinc-600 text-[10px] font-mono hover:text-zinc-400 transition-colors">
          ← Sports Market OS
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
              Set a new password
            </h1>
            <p className="text-zinc-500 text-sm mt-1.5">
              Choose a strong password for your account.
            </p>
          </div>

          {state === "success" ? (
            <div className="bg-emerald-950/40 border border-emerald-900/60 rounded-sm px-4 py-4">
              <p className="text-emerald-400 text-sm font-medium mb-1">Password updated</p>
              <p className="text-emerald-600 text-xs">Redirecting you to sign in…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block mb-1.5">
                  New password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white text-sm font-mono px-3 py-2.5 rounded-sm placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600 transition-colors"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block mb-1.5">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Repeat password"
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
                {state === "loading" ? "Updating…" : "Update password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
