import { redirect } from "next/navigation";
import Link from "next/link";
import MarketTicker from "@/components/MarketTicker";
import TerminalHeader from "@/components/TerminalHeader";
import Sidebar from "@/components/Sidebar";
import ProfileEditSection from "@/components/ProfileEditSection";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/db/profile";

export default async function AccountPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/signin");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/signin?next=/account");

  const profile = await getProfile(supabase, user.id);

  const plan = profile?.plan ?? "free";
  const role = profile?.role ?? "free";
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
              <Link href="/terminal" className="text-zinc-600 text-[10px] font-mono hover:text-zinc-400 transition-colors">
                Terminal
              </Link>
              <span className="text-zinc-800 text-[10px]">›</span>
              <span className="text-zinc-400 text-[10px] font-mono">Account</span>
            </div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="text-white text-2xl font-semibold tracking-tight mb-1">Account</h1>
                <p className="text-zinc-500 text-sm">Manage your profile, plan, and access.</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
                <span className="text-emerald-600 text-[9px] font-mono uppercase">Active</span>
              </div>
            </div>
          </section>

          {/* Profile data */}
          <section className="px-6 py-5 border-b border-zinc-900">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-4">Profile</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mb-1">
              <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">Email</p>
                <p className="text-white text-sm font-mono truncate">{user.email}</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">Username</p>
                <p className="text-white text-sm font-mono">{profile?.username ?? <span className="text-zinc-600">—</span>}</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">Creator Handle</p>
                <p className={`text-sm font-mono ${profile?.creator_handle ? "text-purple-400" : "text-zinc-600"}`}>
                  {profile?.creator_handle ?? "—"}
                </p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">Plan</p>
                <p className={`text-sm font-semibold uppercase tracking-wide ${plan === "premium" ? "text-amber-400" : "text-white"}`}>
                  {plan}
                </p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">Role</p>
                <p className="text-white text-sm font-mono uppercase">{role}</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800/60 rounded-sm p-4">
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">Member Since</p>
                <p className="text-white text-sm">{joinedAt}</p>
              </div>
            </div>
          </section>

          {/* Edit section */}
          <section className="px-6 py-5 border-b border-zinc-900">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-4">Edit Profile</p>
            {profile ? (
              <ProfileEditSection profile={profile} />
            ) : (
              <p className="text-zinc-600 text-sm">Profile data unavailable — the database schema may not be applied yet.</p>
            )}
          </section>

          {/* Plan */}
          <section className="px-6 py-5 border-b border-zinc-900">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-4">Plan & Access</p>
            {plan === "free" ? (
              <div className="max-w-xl bg-zinc-950 border border-zinc-800/60 rounded-sm p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-white text-sm font-semibold mb-1">Free Plan</p>
                    <p className="text-zinc-500 text-xs leading-relaxed">
                      Market pulse signals, share card generation, AI summaries, watchlists, and creator network access.
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-400 border border-zinc-700 px-2 py-0.5 rounded-sm shrink-0">ACTIVE</span>
                </div>
                <button className="text-xs font-medium text-black bg-white px-4 py-2 rounded-sm hover:bg-zinc-200 transition-colors">
                  Upgrade to Premium
                </button>
              </div>
            ) : (
              <div className="max-w-xl bg-zinc-950 border border-amber-400/20 rounded-sm p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-amber-400 text-sm font-semibold mb-1">Premium Plan</p>
                    <p className="text-zinc-500 text-xs leading-relaxed">
                      Deep signal feeds, advanced AI modules, priority data speed, API layer, and partner infrastructure.
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded-sm shrink-0">ACTIVE</span>
                </div>
              </div>
            )}
          </section>

          {/* Quick links */}
          <section className="px-6 py-5">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-4">Quick Links</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/terminal" className="text-xs font-mono text-zinc-400 border border-zinc-800 px-4 py-2 rounded-sm hover:border-zinc-600 hover:text-white transition-colors">
                Terminal →
              </Link>
              <Link href="/watchlists" className="text-xs font-mono text-zinc-400 border border-zinc-800 px-4 py-2 rounded-sm hover:border-zinc-600 hover:text-white transition-colors">
                Watchlists →
              </Link>
              <Link href="/creator-studio" className="text-xs font-mono text-zinc-400 border border-zinc-800 px-4 py-2 rounded-sm hover:border-zinc-600 hover:text-white transition-colors">
                Creator Studio →
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
