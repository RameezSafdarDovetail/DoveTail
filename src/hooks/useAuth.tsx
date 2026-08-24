import {
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
  createContext,
  type ReactNode,
} from "react";
import {
  isAuthUser,
  readAuthSession,
  writeAuthSession,
  clearAuthSession,
  type AuthUser,
} from "../libs/authSession";
import { queryClient } from "../libs/queryClient";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (session: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readAuthSession());

  const login = useCallback((session: AuthUser) => {
    if (!isAuthUser(session)) {
      clearAuthSession();
      setUser(null);
      queryClient.clear();
      throw new Error("Login did not return a valid session.");
    }
    // Drop any previous user's cached queries before loading the new session.
    queryClient.clear();
    writeAuthSession(session);
    setUser(session);
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
    setUser(null);
    queryClient.clear();
  }, []);

  useEffect(() => {
    function syncSession() {
      const session = readAuthSession();
      setUser((current) => {
        const nextId = session?.ContactId ?? null;
        const currentId = current?.ContactId ?? null;
        if (nextId !== currentId) {
          queryClient.clear();
        }
        return session;
      });
    }

    function onStorage(event: StorageEvent) {
      if (event.key === "dovetail.auth.session") syncSession();
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", syncSession);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", syncSession);
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user?.Token),
      login,
      logout,
    }),
    [login, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
