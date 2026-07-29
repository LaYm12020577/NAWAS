import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface ModelComboboxProps {
  id: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  labelClassName?: string;
  inputClassName?: string;
}

/**
 * Writable combobox: a free-text input that also drops down a filtered list of
 * known model codes. Typing filters the list (case-insensitive substring);
 * arrow keys move the highlight, Enter/Tab or click commits a selection.
 * The committed value is always one of `options`; arbitrary text is allowed
 * but the highlight follows the closest match.
 */
export default function ModelCombobox({
  id,
  value,
  options,
  onChange,
  labelClassName = '',
  inputClassName = '',
}: ModelComboboxProps) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Remember the last valid selection so we can restore it if the user
  // focuses the field, clears it to type, and then blurs without choosing.
  const committedRef = useRef<string>(value);

  // Filter the option list by the current typed value (case-insensitive).
  const filtered = value.trim()
    ? options.filter(o => o.toLowerCase().includes(value.trim().toLowerCase()))
    : options;

  // Keep the highlight within range as the filtered list shrinks/grows.
  useEffect(() => {
    if (highlight >= filtered.length) setHighlight(0);
  }, [filtered.length, highlight]);

  // Close the dropdown when a click lands outside the component.
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const commit = (val: string) => {
    committedRef.current = val;
    onChange(val);
    setOpen(false);
    inputRef.current?.blur();
  };

  // On focus, select the whole value instead of clearing it. Typing then
  // replaces the selection in one keystroke (so the user doesn't have to
  // delete the old model manually), but the chosen value stays visible
  // until they actually type something — no jarring disappearance.
  const handleFocus = () => {
    const el = inputRef.current;
    if (el && value) {
      el.setSelectionRange(0, value.length);
    }
    setOpen(true);
  };

  // If the user blurs with empty or non-matching text, restore the last
  // valid selection so nothing is silently lost. A small delay lets a
  // pending option click (which fires after blur) commit first.
  const handleBlur = () => {
    window.setTimeout(() => {
      const typed = value.trim();
      const isValid = options.some(o => o === typed);
      if (!isValid) {
        onChange(committedRef.current);
      } else {
        committedRef.current = typed;
      }
      setOpen(false);
    }, 120);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter')) {
      setOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight(h => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight(h => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[highlight]) commit(filtered[highlight]);
      else setOpen(false);
    } else if (e.key === 'Escape') {
      // Restore the last committed value and close.
      onChange(committedRef.current);
      setOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'Tab') {
      if (open && filtered[highlight]) commit(filtered[highlight]);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        ref={inputRef}
        id={id}
        type="text"
        autoComplete="off"
        value={value}
        placeholder="NWS-B-500A6"
        onChange={(e) => { onChange(e.target.value); setOpen(true); setHighlight(0); }}
        // onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`${inputClassName} pr-10`}
      />
      {/* Dropdown caret, also toggles the list */}
      <button
        type="button"
        tabIndex={-1}
        onClick={() => { setOpen(o => !o); inputRef.current?.focus(); }}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
        aria-label="Toggle model list"
      >
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul className="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto bg-white dark:bg-[#121212] border border-gray-200/50 dark:border-border-dark rounded-[10px] shadow-xl shadow-black/10 dark:shadow-black/50 py-1">
          {filtered.length === 0 && (
            <li className="px-4 py-2 text-xs text-gray-400 italic">
              {value.trim() ? 'Совпадений не найдено' : 'Список пуст'}
            </li>
          )}
          {filtered.map((opt, idx) => {
            const isActive = idx === highlight;
            const isSelected = opt === value;
            return (
              <li key={opt}>
                <button
                  type="button"
                  onMouseEnter={() => setHighlight(idx)}
                  onClick={() => commit(opt)}
                  className={`w-full text-left px-4 py-2 text-sm font-mono flex items-center justify-between gap-2 transition-colors ${
                    isActive
                      ? 'bg-[#002045]/5 dark:bg-[#CCFF00]/10 text-[#002045] dark:text-[#CCFF00]'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#CCFF00] shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
