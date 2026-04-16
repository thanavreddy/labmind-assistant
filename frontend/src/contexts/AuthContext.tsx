import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { User, Session } from "@supabase/supabase-js";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Role = "student" | "faculty";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: Role | null;
  loading: boolean;
  signUpWithEmail: (
    email: string,
    password: string,
    fullName: string,
    role: Role
  ) => Promise<{ error: string | null }>;
  signInWithEmail: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  setRoleDirectly: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  role: null,
  loading: true,
  signUpWithEmail: async () => ({ error: null }),
  signInWithEmail: async () => ({ error: null }),
  signInWithGoogle: async () => ({ error: null }),
  signOut: async () => {},
  setRoleDirectly: () => {},
});

export const useAuth = () => useContext(AuthContext);

// ─── Role Cache ──────────────────────────────────────────────────────────────
// ─── Role Cache ──────────────────────────────────────────────────────────────

export const CACHE_KEY = (uid: string) => `lm_role_${uid}`;

export const readCachedRole = (
  uid: string
): "student" | "faculty" | null => {
  try {
    const v = localStorage.getItem(CACHE_KEY(uid));
    return v === "student" || v === "faculty" ? v : null;
  } catch {
    return null;
  }
};

export const writeCachedRole = (
  uid: string,
  role: "student" | "faculty" | null
) => {
  try {
    if (role) {
      localStorage.setItem(CACHE_KEY(uid), role);
    } else {
      localStorage.removeItem(CACHE_KEY(uid));
    }
  } catch {
    // Ignore storage errors
  }
};

export const clearRoleCache = () => {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("lm_role_"))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    // Ignore storage errors
  }
};
// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  // ─── Fetch Role from Database ──────────────────────────────────────────────

  const fetchUserRole = useCallback(async (userId: string): Promise<Role | null> => {
    // Check students table
    const { data: student } = await supabase
      .from("students")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (student) return "student";

    // Check faculty table
    const { data: faculty } = await supabase
      .from("faculty")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (faculty) return "faculty";

    return null;
  }, []);

  // ─── Sign Up ───────────────────────────────────────────────────────────────
const signUpWithEmail = async (
  email: string,
  password: string,
  name: string,
  role: "student" | "faculty"
): Promise<{ error: string | null }> => {
  try {
    // Step 1: Create user in Supabase Auth
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
      },
    });

    if (authError) {
      return { error: authError.message };
    }

    const user = data.user;
    if (!user) {
      return { error: "User creation failed." };
    }

    // Step 2: Insert into the correct table
    const tableName = role === "student" ? "students" : "faculty";

    const { error: dbError } = await supabase.from(tableName).insert({
      id: user.id,
      email,
      name,
      department: null,
    });

    if (dbError) {
      console.error("Database Insert Error:", dbError);
      return { error: dbError.message };
    }

    return { error: null };
  } catch (err: any) {
    console.error("Signup Error:", err);
    return { error: err.message || "Unexpected error during signup." };
  }
};

  // ─── Sign In ───────────────────────────────────────────────────────────────

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error: error?.message ?? null };
    } catch (err: any) {
      return { error: err.message ?? "Sign in failed." };
    }
  }, []);

  // ─── Google OAuth ──────────────────────────────────────────────────────────

  const signInWithGoogle = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { hd: "cbit.org.in" },
        },
      });
      return { error: error?.message ?? null };
    } catch (err: any) {
      return { error: err.message ?? "Google sign-in failed." };
    }
  }, []);

  // ─── Sign Out ──────────────────────────────────────────────────────────────

  const signOut = useCallback(async () => {
    clearRoleCache();
    await supabase.auth.signOut();
  }, []);

  const setRoleDirectly = useCallback((r: Role) => {
    setRole(r);
  }, []);

  // ─── Auth State Listener ───────────────────────────────────────────────────

  useEffect(() => {
    let isMounted = true;

    const handleSession = async (session: Session | null) => {
      if (!isMounted) return;

      const currentUser = session?.user ?? null;
      setSession(session);
      setUser(currentUser);

      if (!currentUser) {
        setRole(null);
        setLoading(false);
        return;
      }

      // Apply cached role immediately
      const cached = readCachedRole(currentUser.id);
      if (cached) setRole(cached);

      // Fetch role from database
      const fetchedRole = await fetchUserRole(currentUser.id);
      if (fetchedRole) {
        writeCachedRole(currentUser.id, fetchedRole);
        setRole(fetchedRole);
      }

      setLoading(false);
    };

    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      handleSession(data.session);
    });

    // Listen for auth changes
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        handleSession(session);
      });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserRole]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        loading,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
        signOut,
        setRoleDirectly,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};