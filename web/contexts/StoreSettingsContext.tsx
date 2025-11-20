'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { subscribeToStoreSettings, StoreSettings, updateStoreSettings as updateSettings } from '@/lib/firebase/storeSettings';

interface StoreSettingsContextType {
  settings: StoreSettings | null;
  loading: boolean;
  updateStoreSettings: (settings: Partial<Omit<StoreSettings, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
}

const StoreSettingsContext = createContext<StoreSettingsContextType | undefined>(undefined);

export const useStoreSettings = () => {
  const context = useContext(StoreSettingsContext);
  if (!context) {
    throw new Error('useStoreSettings must be used within StoreSettingsProvider');
  }
  return context;
};

export const StoreSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribir às mudanças em tempo real
    const unsubscribe = subscribeToStoreSettings((newSettings) => {
      setSettings(newSettings);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateSettings = async (newSettings: Partial<Omit<StoreSettings, 'id' | 'createdAt' | 'updatedAt'>>) => {
    await updateSettings(newSettings);
    // O listener em tempo real irá atualizar automaticamente
  };

  return (
    <StoreSettingsContext.Provider value={{ settings, loading, updateStoreSettings: handleUpdateSettings }}>
      {children}
    </StoreSettingsContext.Provider>
  );
};

