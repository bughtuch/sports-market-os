"use client";

import { useState } from "react";

interface AuthState {
  loading: boolean;
  error: string | null;
}

export function useSignIn() {
  const [state, setState] = useState<AuthState>({ loading: false, error: null });

  async function signIn(email: string, password: string) {
    setState({ loading: true, error: null });
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setState({ loading: false, error: error.message });
        return false;
      }
      setState({ loading: false, error: null });
      return true;
    } catch {
      setState({ loading: false, error: "Authentication service unavailable." });
      return false;
    }
  }

  return { ...state, signIn };
}

export function useSignUp() {
  const [state, setState] = useState<AuthState>({ loading: false, error: null });

  async function signUp(email: string, password: string) {
    setState({ loading: true, error: null });
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setState({ loading: false, error: error.message });
        return false;
      }
      setState({ loading: false, error: null });
      return true;
    } catch {
      setState({ loading: false, error: "Authentication service unavailable." });
      return false;
    }
  }

  return { ...state, signUp };
}

export function useSignOut() {
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // noop
    } finally {
      setLoading(false);
    }
  }

  return { loading, signOut };
}
