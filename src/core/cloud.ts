import { newSalt, passwordHash } from './storage';
export const SESSION_KEY = 'korlambda-shared-session';
type RuntimeConfig = { mode: 'shared'; apiUrl: string };
let runtime: Promise<RuntimeConfig> | undefined;
export class CloudError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}
export function runtimeConfig() {
  return (
    runtime ||
    (runtime = fetch('/runtime-config.json', { cache: 'no-store' }).then(async (r) => {
      if (!r.ok) throw new CloudError('UNCONFIGURED', 'Falta configurar la conexión compartida.');
      const value = await r.json();
      const apiUrl = String(import.meta.env.VITE_API_URL || value.apiUrl || '').trim();
      if (
        apiUrl &&
        !/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(apiUrl)
      )
        throw new CloudError('UNCONFIGURED', 'La URL de Apps Script debe terminar en /exec.');
      return { mode: 'shared' as const, apiUrl };
    }))
  );
}
export function getToken() {
  try {
    return localStorage.getItem(SESSION_KEY) || '';
  } catch {
    return '';
  }
}
export function setToken(token: string) {
  try {
    if (token) localStorage.setItem(SESSION_KEY, token);
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    throw new CloudError('STORAGE', 'Este navegador no permite guardar la sesión.');
  }
}
export async function cloudCall<T = unknown>(
  action: string,
  args: Record<string, unknown> = {},
  token = getToken(),
): Promise<T> {
  const config = await runtimeConfig();
  if (!config.apiUrl)
    throw new CloudError(
      'UNCONFIGURED',
      'La prueba compartida está preparada. Falta activar la URL de Apps Script.',
    );
  if (!navigator.onLine)
    throw new CloudError(
      'OFFLINE',
      'Estás sin conexión. Los cambios de cuenta necesitan Internet.',
    );
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45000);
  try {
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, args, token, requestId: crypto.randomUUID() }),
      credentials: 'omit',
      redirect: 'follow',
      cache: 'no-store',
      signal: controller.signal,
    });
    if (!response.ok)
      throw new CloudError('NETWORK', 'El servicio no respondió. Inténtalo de nuevo.');
    const result = await response.json();
    if (!result.ok)
      throw new CloudError(
        result.error?.code || 'SERVER_ERROR',
        result.error?.message || 'No se completó la operación.',
      );
    return result.data as T;
  } catch (error) {
    if (error instanceof CloudError) throw error;
    throw new CloudError(
      'NETWORK',
      'No se pudo conectar con Google Sheets. Revisa Internet o la implementación de Apps Script.',
    );
  } finally {
    clearTimeout(timer);
  }
}
async function proof(key: string, message: string) {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return Array.from(
    new Uint8Array(await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message))),
    (b) => b.toString(16).padStart(2, '0'),
  ).join('');
}
export async function cloudRegister(name: string, email: string, password: string, role: string) {
  const salt = newSalt();
  const hash = await passwordHash(password, salt);
  return cloudCall<{ token: string }>('auth.register', { name, email, role, salt, hash }, '');
}
export async function cloudLogin(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  const c = await cloudCall<{ challengeId: string; nonce: string; salt: string }>(
    'auth.challenge',
    { email: normalized },
    '',
  );
  const hash = await passwordHash(password, c.salt);
  return cloudCall<{ token: string }>(
    'auth.login',
    {
      challengeId: c.challengeId,
      proof: await proof(hash, c.challengeId + '.' + c.nonce + '.' + normalized),
    },
    '',
  );
}
export async function blobBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.readAsDataURL(blob);
  });
}
