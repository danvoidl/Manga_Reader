import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  login as authLogin,
  refresh as authRefresh,
  type AuthTokens,
  type LoginParams,
} from "@/services/auth";
import {
  clearSession,
  loadSession,
  saveSession,
  type StoredSession,
} from "@/services/secureStore";

// Refresh a bit before the real expiry to avoid using an almost-dead token.
const EXPIRY_SKEW_MS = 30_000;

interface AuthContextValue {
  username: string | null;
  isAuthenticated: boolean;
  /** True while the persisted session is being restored on startup. */
  loading: boolean;
  login: (params: LoginParams) => Promise<void>;
  logout: () => Promise<void>;
  /** Returns a valid access token, refreshing it if needed. Null if logged out. */
  getValidAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

function sessionFromTokens(
  params: LoginParams,
  tokens: AuthTokens,
): StoredSession {
  return {
    username: params.username,
    clientId: params.clientId,
    clientSecret: params.clientSecret,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    accessTokenExpiresAt: Date.now() + tokens.expires_in * 1000,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<StoredSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Keep a ref in sync so getValidAccessToken always reads the latest session
  // without being recreated (and without racing concurrent callers).
  const sessionRef = useRef<StoredSession | null>(null);
  const refreshPromise = useRef<Promise<string | null> | null>(null);

  const persist = useCallback(async (next: StoredSession | null) => {
    sessionRef.current = next;
    setSession(next);
    if (next) {
      await saveSession(next);
    } else {
      await clearSession();
    }
  }, []);

  useEffect(() => {
    let active = true;
    loadSession()
      .then((restored) => {
        if (!active) return;
        sessionRef.current = restored;
        setSession(restored);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(
    async (params: LoginParams) => {
      const tokens = await authLogin(params);
      await persist(sessionFromTokens(params, tokens));
    },
    [persist],
  );

  const logout = useCallback(async () => {
    await persist(null);
  }, [persist]);

  const getValidAccessToken = useCallback(async (): Promise<string | null> => {
    const current = sessionRef.current;
    if (!current) return null;

    if (Date.now() < current.accessTokenExpiresAt - EXPIRY_SKEW_MS) {
      return current.accessToken;
    }

    // Coalesce concurrent refreshes into a single in-flight request.
    if (!refreshPromise.current) {
      refreshPromise.current = (async () => {
        try {
          const tokens = await authRefresh({
            clientId: current.clientId,
            clientSecret: current.clientSecret,
            refreshToken: current.refreshToken,
          });
          await persist({
            ...current,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            accessTokenExpiresAt: Date.now() + tokens.expires_in * 1000,
          });
          return tokens.access_token;
        } catch {
          // Refresh token likely expired — force a fresh login.
          await persist(null);
          return null;
        } finally {
          refreshPromise.current = null;
        }
      })();
    }

    return refreshPromise.current;
  }, [persist]);

  return (
    <AuthContext.Provider
      value={{
        username: session?.username ?? null,
        isAuthenticated: !!session,
        loading,
        login,
        logout,
        getValidAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
