import { useState, useCallback } from 'react';
import type { HistoryItem } from '../types';

const STORAGE_KEY = 'trigcheck-history';
const MAX_ITEMS = 10;

function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.slice(0, MAX_ITEMS);
    }
  } catch { /* ignore */ }
  return [];
}

function saveHistory(items: HistoryItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch { /* storage full — drop oldest item and retry */
    try {
      const trimmed = items.slice(0, -1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch { /* give up silently */ }
  }
}

export function useHistory() {
  const [history, setHistoryState] = useState<HistoryItem[]>(loadHistory);

  const addItem = useCallback((item: HistoryItem) => {
    setHistoryState(prev => {
      const next = [item, ...prev].slice(0, MAX_ITEMS);
      saveHistory(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistoryState([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }, []);

  return { history, addItem, clearHistory };
}
