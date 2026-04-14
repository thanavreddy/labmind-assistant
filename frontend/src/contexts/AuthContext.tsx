import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: "student" | "professor" | null;
  loading: boolean;
  /** Call this after saving role in SelectRole to update context immediately. */
  setRoleDirectly: (role: "student" | "professor") => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  role: null,
  loading: true,
  setRoleDirectly: () => {},
});

export const useAuth = () => useContext(AuthContext);

// ─── Role cache ───────────────────────────────────────────────────────────────
const CACHE_KEY = (uid: string) => `lm_role_${uid}`;

const readCachedRole = (uid: string): "student" | "professor" | null => {
  try {
    const v = localStorage.getItem(CACHE_KEY(uid));
    return v === "student" || v === "professor" ? v : null;
  } catch { return null; }
};

export const writeCachedRole = (uid: string, role: "student" | "professor" | null) => {
  try {
    if (role) localStorage.setItem(CACHE_KEY(uid), role);
    else localStorage.removeItem(CACHE_KEY(uid));
  } catch { /* ignore */ }
};

const clearRoleCache = () => {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("lm_role_"))
      .forEach((k) => localStorage.removeItem(k));
  } catch { /* ignore */ }
};
// ─────────────────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<"student" | "professor" | null>(null);
  const [loading, setLoading] = useState(true);

  /** Exposed so SelectRole can update role state instantly after saving. */
  const setRoleDirectly = useCallback((r: "student" | "professor") => {
    setRole(r);
  }, []);

  useEffect(() => {
    let isMounted = true;
    let resolved = false;

    // Called at most once — prevents any double-resolve race
    const resolveLoading = () => {
      if (!resolved && isMounted) {
        resolved = true;
        setLoading(false);
      }
    };

    /**
     * Fetches (or creates) the profile row entirely in the background.
     * NEVER awaited in the critical init path — loading is not gated on this.
     */
    const syncProfileInBackground = (u: User) => {
      Promise.resolve(
        supabase
          .from("profiles")
          .select("role")
          .eq("id", u.id)
          .maybeSingle()
      )
        .then(({ data, error }) => {
          if (!isMounted) return;
          if (error) { console.error("[Auth] profile fetch error:", error); return; }

          if (!data) {
            // Create row for first-time user
            Promise.resolve(
              supabase.from("profiles").insert({
                id: u.id,
                email: u.email,
                full_name: u.user_metadata?.full_name ?? "",
                role: null,
              })
            ).then(({ error: ie }) => {
              if (ie && ie.code !== "23505") console.error("[Auth] insert error:", ie);
            });
            writeCachedRole(u.id, null);
            if (isMounted) setRole(null);
          } else {
            const fetched = data.role as "student" | "professor" | null;
            writeCachedRole(u.id, fetched);
            if (isMounted) setRole(fetched);
          }
        })
        .catch((err) => console.error("[Auth] unexpected profile error:", err));
    };

    // ── Hard safety net: 6 s cap ──────────────────────────────────────────────
    const safetyTimer = setTimeout(() => {
      console.warn("[Auth] timeout — forcing loading=false");
      resolveLoading();
    }, 6000);

    // ── Single source of truth ────────────────────────────────────────────────
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      if (!isMounted) return;
      console.log("[Auth] event:", event);

      if (event === "SIGNED_OUT") {
        clearRoleCache();
        setSession(null);
        setUser(null);
        setRole(null);
        resolveLoading();
        return;
      }

      // Handle INITIAL_SESSION, SIGNED_IN, TOKEN_REFRESHED, USER_UPDATED
      setSession(s);
      setUser(s?.user ?? null);

      if (!s?.user) {
        setRole(null);
        resolveLoading(); // no user → done immediately
        return;
      }

      // ── Set role from cache instantly, THEN sync in background ────────────
      const cached = readCachedRole(s.user.id);
      if (cached !== null) {
        setRole(cached);
      }
      // loading ALWAYS resolves here — never gated on a network call
      resolveLoading();

      // Sync profile in background on session events (verifies / creates row)
      if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
        syncProfileInBackground(s.user);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={{ user, session, role, loading, setRoleDirectly }}>
      {children}
    </AuthContext.Provider>
  );
};