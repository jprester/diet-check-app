import { useState, useRef, useEffect, useCallback } from 'react';
import type { DietProfile } from '../types';
import { DIET_PROFILES, DEFAULT_DIET_ID } from '../types';

interface DietSelectorProps {
  selectedDietId: string;
  onChange: (dietId: string) => void;
}

export function DietSelector({ selectedDietId, onChange }: DietSelectorProps) {
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = DIET_PROFILES.find(d => d.id === selectedDietId)
    || DIET_PROFILES.find(d => d.id === DEFAULT_DIET_ID)!;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      const activeIdx = DIET_PROFILES.findIndex(d => d.id === selectedDietId);
      setFocusIndex(activeIdx >= 0 ? activeIdx : 0);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open, selectedDietId]);

  useEffect(() => {
    if (open && listRef.current && focusIndex >= 0) {
      const items = listRef.current.querySelectorAll<HTMLLIElement>('[role="option"]');
      items[focusIndex]?.focus();
    }
  }, [open, focusIndex]);

  function handleSelect(diet: DietProfile) {
    onChange(diet.id);
    setOpen(false);
  }

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusIndex(i => (i + 1) % DIET_PROFILES.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusIndex(i => (i - 1 + DIET_PROFILES.length) % DIET_PROFILES.length);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusIndex >= 0 && focusIndex < DIET_PROFILES.length) {
          handleSelect(DIET_PROFILES[focusIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
    }
  }, [open, focusIndex]);

  return (
    <div className="diet-selector" ref={ref} onKeyDown={handleKeyDown}>
      <button
        className="diet-selector-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="diet-selector-emoji">{selected.emoji}</span>
        <span className="diet-selector-label">
          <span className="diet-selector-name">{selected.name}</span>
          <span className="diet-selector-desc">{selected.description}</span>
        </span>
        <span className={`diet-selector-chevron ${open ? 'open' : ''}`}>&#x25BE;</span>
      </button>

      {open && (
        <ul className="diet-selector-dropdown" role="listbox" ref={listRef}>
          {DIET_PROFILES.map((diet, index) => (
            <li
              key={diet.id}
              role="option"
              tabIndex={-1}
              aria-selected={diet.id === selectedDietId}
              className={`diet-option ${diet.id === selectedDietId ? 'active' : ''} ${index === focusIndex ? 'focused' : ''}`}
              onClick={() => handleSelect(diet)}
            >
              <span className="diet-option-emoji">{diet.emoji}</span>
              <span className="diet-option-text">
                <span className="diet-option-name">{diet.name}</span>
                <span className="diet-option-desc">{diet.description}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
