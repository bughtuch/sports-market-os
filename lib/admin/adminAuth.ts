/**
 * Admin authentication helpers — server-only.
 *
 * Security model (Sprint 18):
 * - Routes check auth.user + profiles.role === 'admin'
 * - No service role key is exposed client-side
 * - Admin route /admin is hidden from nav, sitemap, robots
 * - Future: stricter admin allowlist (env-var email list)
 *
 * To grant admin role manually in Supabase:
 *   UPDATE public.profiles SET role = 'admin' WHERE email = 'you@example.com';
 */

import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/db/profile";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/db/types";

export interface AdminSession {
  user: User;
  profile: Profile;
}

/**
 * Returns { user, profile } if the request is from an authenticated admin.
 * Returns null if unauthenticated or not admin.
 * Never throws — safe to call in API routes and server components.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const supabase = await createClient();
    if (!supabase) return null;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const profile = await getProfile(supabase, user.id);
    if (!profile) return null;
    if (profile.role !== "admin") return null;

    return { user, profile };
  } catch {
    return null;
  }
}

/**
 * Returns true if the current request is from an admin.
 * Convenience wrapper around getAdminSession.
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getAdminSession();
  return session !== null;
}
