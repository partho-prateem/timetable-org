import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export type AuthContextType = {
  user: any | null;
  loading: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  configured: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    const init = async () => {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (!ignore) setUser(data.session?.user ?? null);
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      setLoading(false);
      return () => sub.subscription.unsubscribe();
    };
    init();
    return () => {
      ignore = true;
    };
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      configured: isSupabaseConfigured,
      signInWithPassword: async (email, password) => {
        if (!isSupabaseConfigured || !supabase) return { error: "Supabase not configured" };
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return error ? { error: error.message } : {};
      },
      signOut: async () => {
        if (!isSupabaseConfigured || !supabase) return;
        await supabase.auth.signOut();
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
