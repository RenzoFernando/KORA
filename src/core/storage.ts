import type { Store, Shelf } from './types';
export const STORAGE_KEY = 'korlambda-v1';
export const emptyShelf = (): Shelf => ({
  saved: [],
  notes: {},
  collections: [],
  recommendations: [],
  shortlist: [],
});
export const freshStore = (): Store => ({
  version: 1,
  accounts: [],
  sessionId: null,
  releases: [],
  shelves: {},
  events: [],
  requests: [],
  settings: { theme: 'system', city: 'Cali', analytics: false },
  hidden: [],
});
export function loadStore(): { data: Store; warning: string } {
  try {
    const legacyKey = Object.keys(localStorage).find((key) => /^korlambda-\d+-v1$/.test(key));
    const raw =
      localStorage.getItem(STORAGE_KEY) ?? (legacyKey ? localStorage.getItem(legacyKey) : null);
    if (!raw) return { data: freshStore(), warning: '' };
    const data = JSON.parse(raw);
    if (
      data.version !== 1 ||
      !Array.isArray(data.accounts) ||
      !Array.isArray(data.releases) ||
      !data.settings ||
      !Array.isArray(data.events) ||
      !data.shelves ||
      !Array.isArray(data.requests) ||
      !Array.isArray(data.hidden)
    )
      throw Error();
    return { data, warning: '' };
  } catch {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) localStorage.setItem(STORAGE_KEY + '-recovery-' + Date.now(), raw);
    } catch {
      // Storage may be unavailable; return the recovery warning below.
    }
    return {
      data: freshStore(),
      warning:
        'No pudimos leer el almacenamiento local. Se intentó conservar una copia de recuperación. Exporta tus datos antes de cerrar si el problema continúa.',
    };
  }
}
export function saveStore(data: Store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
const hex = (bytes: Uint8Array) =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
export async function passwordHash(password: string, salt: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  return hex(
    new Uint8Array(
      await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: new TextEncoder().encode(salt),
          iterations: 210000,
          hash: 'SHA-256',
        },
        key,
        256,
      ),
    ),
  );
}
export function newSalt() {
  return hex(crypto.getRandomValues(new Uint8Array(16)));
}
export function download(name: string, content: string, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
