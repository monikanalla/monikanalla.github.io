import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getSettings } from '../api/endpoints';
import type { Settings } from '../api/types';

export const FALLBACK_SETTINGS: Settings = {
  brandName: 'HAIR5S',
  tagline: 'Unisex Salon',
  heroHeadline: 'Hair that holds its shape — and its shine.',
  heroSubhead: 'A unisex salon in Mumbai for colour, keratin, extensions, lashes, nails and skin — booked over WhatsApp, finished in the chair.',
  heroBadge: 'Mumbai · Unisex salon',
  aboutCopy: '',
  whatsappNumber: '',
  phone: '',
  email: '',
  instagram: 'https://www.instagram.com/hair5s/',
  address: '',
  mapsUrl: '',
  hours: '',
  messageTemplate: '',
  announcement: '',
};

interface SettingsContextValue {
  settings: Settings;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(FALLBACK_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await getSettings();
      setSettings({ ...FALLBACK_SETTINGS, ...data });
    } catch {
      /* the fallback copy keeps the site readable if the API is offline */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(() => ({ settings, loading, refresh }), [settings, loading, refresh]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used inside SettingsProvider');
  return context;
}
