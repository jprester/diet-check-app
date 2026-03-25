import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import type { DietProfile } from "../types";
import { DIET_PROFILES, DEFAULT_DIET_ID } from "../types";

interface DietSelectorProps {
  selectedDietId: string;
  onChange: (dietId: string) => void;
}

export function DietSelector({ selectedDietId, onChange }: DietSelectorProps) {
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selected =
    DIET_PROFILES.find((d) => d.id === selectedDietId) ||
    DIET_PROFILES.find((d) => d.id === DEFAULT_DIET_ID)!;

  const openDropdown = useCallback(() => {
    const activeIdx = DIET_PROFILES.findIndex((d) => d.id === selectedDietId);
    setFocusIndex(activeIdx >= 0 ? activeIdx : 0);
    setOpen(true);
  }, [selectedDietId]);

  const closeDropdown = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  useEffect(() => {
    if (open && listRef.current && focusIndex >= 0) {
      const items = listRef.current.querySelectorAll<HTMLLIElement>('[role="option"]');
      items[focusIndex]?.focus();
    }
  }, [open, focusIndex]);

  const handleSelect = useCallback(
    (diet: DietProfile) => {
      onChange(diet.id);
      closeDropdown();
    },
    [onChange, closeDropdown],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openDropdown();
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusIndex((i) => (i + 1) % DIET_PROFILES.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusIndex((i) => (i - 1 + DIET_PROFILES.length) % DIET_PROFILES.length);
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (focusIndex >= 0 && focusIndex < DIET_PROFILES.length) {
            handleSelect(DIET_PROFILES[focusIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          closeDropdown();
          break;
      }
    },
    [open, focusIndex, handleSelect, openDropdown, closeDropdown],
  );

  return (
    <div className="diet-selector" ref={ref} onKeyDown={handleKeyDown}>
      <button
        className="diet-selector-trigger"
        ref={triggerRef}
        onClick={() => (open ? closeDropdown() : openDropdown())}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? "diet-listbox" : undefined}>
        <span className="diet-selector-emoji">{selected.emoji}</span>
        <span className="diet-selector-label">
          <span className="diet-selector-name">{selected.name}</span>
          <span className="diet-selector-desc">{selected.description}</span>
        </span>
        <span className={`diet-selector-chevron ${open ? "open" : ""}`}>&#x25BE;</span>
      </button>

      {open && (
        <ul
          id="diet-listbox"
          className="diet-selector-dropdown"
          role="listbox"
          aria-label="Diet profile"
          ref={listRef}>
          {DIET_PROFILES.map((diet, index) => (
            <li
              key={diet.id}
              role="option"
              tabIndex={-1}
              aria-selected={diet.id === selectedDietId}
              className={`diet-option ${diet.id === selectedDietId ? "active" : ""} ${index === focusIndex ? "focused" : ""}`}
              onClick={() => handleSelect(diet)}>
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
