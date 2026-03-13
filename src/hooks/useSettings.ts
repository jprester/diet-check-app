import { useState, useCallback } from 'react';
import type { Settings } from '../types';
import { PROVIDER_MODELS } from '../types';

const STORAGE_KEY = 'trigcheck-settings';

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {
    provider: 'openrouter',
    model: PROVIDER_MODELS.openrouter.models[0].id,
  };
}

export function useSettings() {
  const [settings, setSettingsState] = useState<Settings>(loadSettings);

  const setSettings = useCallback((update: Partial<Settings>) => {
    setSettingsState(prev => {
      const next = { ...prev, ...update };
      if (update.provider && update.provider !== prev.provider) {
        next.model = PROVIDER_MODELS[update.provider].models[0].id;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { settings, setSettings };
}
