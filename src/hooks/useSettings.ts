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
    provider: 'anthropic',
    apiKey: '',
    model: PROVIDER_MODELS.anthropic.models[0].id,
  };
}

export function useSettings() {
  const [settings, setSettingsState] = useState<Settings>(loadSettings);

  const setSettings = useCallback((update: Partial<Settings>) => {
    setSettingsState(prev => {
      const next = { ...prev, ...update };
      // When changing provider, reset model to first available for that provider
      if (update.provider && update.provider !== prev.provider) {
        next.model = PROVIDER_MODELS[update.provider].models[0].id;
        next.apiKey = '';
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { settings, setSettings };
}
