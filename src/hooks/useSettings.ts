import { useState, useCallback, useLayoutEffect } from 'react';
import type { Settings, Theme } from '../types';
import { PROVIDER_MODELS, DIET_PROFILES, DEFAULT_DIET_ID } from '../types';

const STORAGE_KEY = 'trigcheck-settings';

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const validThemes = ['light', 'dark', 'system'];
      if (parsed.theme && !validThemes.includes(parsed.theme)) {
        parsed.theme = 'system';
      }
      if (typeof parsed.dietId !== 'string' || !DIET_PROFILES.some((d) => d.id === parsed.dietId)) {
        parsed.dietId = DEFAULT_DIET_ID;
      }
      return { theme: 'system', dietId: DEFAULT_DIET_ID, ...parsed };
    }
  } catch { /* ignore */ }
  return {
    provider: 'openrouter',
    model: PROVIDER_MODELS.openrouter.models[0].id,
    theme: 'system',
    dietId: DEFAULT_DIET_ID,
  };
}

function applyTheme(theme: Theme) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

export function useSettings() {
  const [settings, setSettingsState] = useState<Settings>(loadSettings);

  useLayoutEffect(() => {
    applyTheme(settings.theme);
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme(settings.theme);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [settings.theme]);

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
