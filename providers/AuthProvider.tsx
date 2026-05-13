"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
});

export function useAuthContext() {
  return useContext(AuthContext);
}

let supabaseEnvMissing = false;
if (
  typeof process !== "undefined" &&
  (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
) {
  supabaseEnvMissing = true;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(!supabaseEnvMissing);

  useEffect(() => {
    if (supabaseEnvMissing) return;

    let sub: { unsubscribe: () => void } | undefined;

    import("@/lib/supabase/client").then(({ createClient }) => {
      try {
        const supabase = createClient();

        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        });

        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        });
        sub = data.subscription;
      } catch {
        setLoading(false);
      }
    });

    return () => {
      sub?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
