import { createContext, useContext } from 'react';
import type { Release } from '../core/types';
export type PlayerValue = {
  current: Release | undefined;
  playing: boolean;
  loading: boolean;
  elapsed: number;
  duration: number;
  volume: number;
  error: string;
  expanded: boolean;
  setExpanded: (v: boolean) => void;
  select: (r: Release) => void;
  toggle: () => Promise<void>;
  seek: (v: number) => void;
  setVolume: (v: number) => void;
  step: (direction: number) => void;
  close: () => void;
  iframeSrc: string;
  loadEmbed: () => void;
  embedReady: boolean;
};
export const Context = createContext<PlayerValue | null>(null);
export const formatTime = (value: number) => {
  const n = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  return Math.floor(n / 60) + ':' + String(n % 60).padStart(2, '0');
};
export function usePlayer() {
  const c = useContext(Context);
  if (!c) throw Error('Falta PlayerProvider');
  return c;
}
