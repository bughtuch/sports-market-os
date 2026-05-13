import { redirect } from "next/navigation";
import Link from "next/link";
import MarketTicker from "@/components/MarketTicker";
import TerminalHeader from "@/components/TerminalHeader";
import Sidebar from "@/components/Sidebar";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();

  // If Supabase is not configured, redirect to sign-in
  if (!supabase) {
    redirect("/signin");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?next=/account");
  }

  const plan = (user.user_metadata?.plan as string) ?? "free";
  const joinedAt = new Date(user.created_at).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen md:h-screen bg-black text-white flex flex-col md:overflow-hidden">
      <MarketTicker />
      <TerminalHeader />

      <div className="flex flex-1 flex-col md:flex-row md:overflow-hidden">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <main className="flex-1 md:overflow-y-auto">
          {/* Header */}
          <section className="px-6 py-5 border-b border-zinc-900 bg-zinc-950/40">
            <div className="flex items-center gap-2 mb-4">
              <Link
                href="/terminal"
                className="text-zinc-600 text-[10px] font-mono hover:text-zinc-400 transition-colors"
              >
                Terminal
              </Link>
              <span className="text-zinc-800 text-[10px]">›</span>
              <span className="text-zinc-400 text-[10px] font-mono">Account</span>
            </div>
            <h1 className="text-white text-2xl font-semibold tracking-tight mb-1">
              Account
            </h1>
            <p className="text-zinc-500 text-sm">
              Manage your profile, plan, and access.
            </p>
          </section>

          {/* Profile section */}
          <section className="px-6 py-5 border-b border-zinc-900">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-4">
              Profile
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
              <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">
                  Email
                </p>
                <p className="text-white text-sm font-mono">{user.email}</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">
                  Member Since
                </p>
                <p className="text-white text-sm">{joinedAt}</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">
                  Plan
                </p>
                <p
                  className={`text-sm font-semibold uppercase tracking-wide ${
                    plan === "premium" ? "text-amber-400" : "text-white"
                  }`}
                >
                  {plan}
                </p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">
                  User ID
                </p>
                <p className="text-zinc-500 text-[10px] font-mono truncate">{user.id}</p>
              </div>
            </div>
          </section>

          {/* Plan section */}
          <section className="px-6 py-5 border-b border-zinc-900">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-4">
              Plan & Access
            </p>
            {plan === "free" && (
              <div className="max-w-xl bg-zinc-950 border border-zinc-800/60 rounded-sm p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-white text-sm font-semibold mb-1">Free Plan</p>
                    <p className="text-zinc-500 text-xs leading-relaxed">
                      You have access to market pulse signals, share card generation, AI summaries, and the creator network.
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-400 border border-zinc-700 px-2 py-0.5 rounded-sm shrink-0">
                    ACTIVE
                  </span>
                </div>
                <button className="text-xs font-medium text-black bg-white px-4 py-2 rounded-sm hover:bg-zinc-200 transition-colors">
                  Upgrade to Premium
                </button>
              </div>
            )}
            {plan === "premium" && (
              <div className="max-w-xl bg-zinc-950 border border-amber-400/20 rounded-sm p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-amber-400 text-sm font-semibold mb-1">Premium Plan</p>
                    <p className="text-zinc-500 text-xs leading-relaxed">
                      Full access to deep signal feeds, advanced AI modules, priority data speed, API layer, and partner infrastructure.
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded-sm shrink-0">
                    ACTIVE
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* Quick links */}
          <section className="px-6 py-5">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-4">
              Quick Links
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/terminal"
                className="text-xs font-mono text-zinc-400 border border-zinc-800 px-4 py-2 rounded-sm hover:border-zinc-600 hover:text-white transition-colors"
              >
                Terminal →
              </Link>
              <Link
                href="/watchlists"
                className="text-xs font-mono text-zinc-400 border border-zinc-800 px-4 py-2 rounded-sm hover:border-zinc-600 hover:text-white transition-colors"
              >
                Watchlists →
              </Link>
              <Link
                href="/creator-studio"
                className="text-xs font-mono text-zinc-400 border border-zinc-800 px-4 py-2 rounded-sm hover:border-zinc-600 hover:text-white transition-colors"
              >
                Creator Studio →
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
