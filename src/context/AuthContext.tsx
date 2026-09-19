import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  restoreSession,
  signInWithGoogle,
  signOutEverywhere,
  type AuthState,
} from '@/services/authService';

interface AuthContextValue {
  auth: AuthState;
  loading: boolean;
  signIn: () => Promise<AuthState>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  auth: { status: 'signed-out' },
  loading: true,
  signIn: async () => ({ status: 'signed-out' }),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ status: 'signed-out' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession()
      .then(setAuth)
      .catch(() => setAuth({ status: 'signed-out' }))
      .finally(() => setLoading(false));
  }, []);

  const signIn = useCallback(async () => {
    const next = await signInWithGoogle();
    setAuth(next);
    return next;
  }, []);

  const signOut = useCallback(async () => {
    await signOutEverywhere();
    setAuth({ status: 'signed-out' });
  }, []);

  const value = useMemo(() => ({ auth, loading, signIn, signOut }), [auth, loading, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
