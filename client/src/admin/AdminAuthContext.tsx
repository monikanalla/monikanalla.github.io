import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getToken, setToken } from '../api/client';
import { adminLogin, adminMe } from '../api/endpoints';
import type { Admin } from '../api/types';

interface AdminAuthValue {
  admin: Admin | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<Admin>;
  signOut: () => void;
  refresh: () => Promise<void>;
  setMustChangePassword: (value: boolean) => void;
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setAdmin(null);
      setLoading(false);
      return;
    }

    try {
      const me = await adminMe();
      setAdmin(me);
    } catch {
      setToken(null);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await adminLogin(email, password);
    setToken(result.token);
    setAdmin(result.admin);
    return result.admin;
  }, []);

  const signOut = useCallback(() => {
    setToken(null);
    setAdmin(null);
  }, []);

  const setMustChangePassword = useCallback((value: boolean) => {
    setAdmin((current) => (current ? { ...current, mustChangePassword: value } : current));
  }, []);

  const value = useMemo(
    () => ({ admin, loading, signIn, signOut, refresh, setMustChangePassword }),
    [admin, loading, signIn, signOut, refresh, setMustChangePassword],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthValue {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  return context;
}
