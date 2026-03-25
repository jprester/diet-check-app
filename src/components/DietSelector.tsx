import { useState, useRef, useEffect } from 'react';
import type { DietProfile } from '../types';
import { DIET_PROFILES } from '../types';

interface DietSelectorProps {
  selectedDietId: string;
  onChange: (dietId: string) => void;
}

export function DietSelector({ selectedDietId, onChange }: DietSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = DIET_PROFILES.find(d => d.id === selectedDietId) || DIET_PROFILES[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  function handleSelect(diet: DietProfile) {
    onChange(diet.id);
    setOpen(false);
  }

  return (
    <div className="diet-selector" ref={ref}>
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
        <ul className="diet-selector-dropdown" role="listbox">
          {DIET_PROFILES.map(diet => (
            <li
              key={diet.id}
              role="option"
              aria-selected={diet.id === selectedDietId}
              className={`diet-option ${diet.id === selectedDietId ? 'active' : ''}`}
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
