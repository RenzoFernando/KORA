import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from './Icon';
export function CityPicker({
  value,
  cities,
  onChange,
}: {
  value: string;
  cities: string[];
  onChange: (city: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const id = useId();
  const options = [...new Set(cities)];
  function close(restore = false) {
    setOpen(false);
    if (restore) trigger.current?.focus();
  }
  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    list.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.focus();
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  return (
    <div
      ref={root}
      className="city-picker"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          close(true);
        }
        if (open && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
          e.preventDefault();
          const buttons = [
            ...(list.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') || []),
          ];
          const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
          buttons[
            e.key === 'Home'
              ? 0
              : e.key === 'End'
                ? buttons.length - 1
                : (index + (e.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length
          ]?.focus();
        }
      }}
    >
      <button
        ref={trigger}
        className="city-trigger"
        aria-label={'Cambiar ciudad, actual: ' + value}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (!open && ['ArrowDown', 'ArrowUp'].includes(e.key)) {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        <Icon name="pin" size={18} />
        <span>{value}</span>
        <Icon name="chevron" size={16} />
      </button>
      {open && (
        <div className="city-menu" id={id} role="listbox" aria-label="Elige tu ciudad" ref={list}>
          <p>Tu escena comienza aquí</p>
          {options.map((city) => (
            <button
              type="button"
              key={city}
              role="option"
              aria-selected={city === value}
              onClick={() => {
                onChange(city);
                close(true);
              }}
            >
              <span>{city}</span>
              {city === value && <Icon name="check" size={18} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
