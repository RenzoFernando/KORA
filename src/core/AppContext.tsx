import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Context } from './useApp';
import type {
  Store,
  Account,
  Role,
  Plan,
  Release,
  Metric,
  Shelf,
  AppNotice,
  CommunityPost,
  AdminOverview,
  RequestItem,
} from './types';
import { freshStore, loadStore, emptyShelf, download } from './storage';
import { seedCatalog } from './catalog';
import {
  cloudCall,
  cloudLogin,
  cloudRegister,
  CloudError,
  getToken,
  setToken,
  SESSION_KEY,
} from './cloud';
type Bootstrap = {
  account: Account | null;
  catalog: Release[];
  shelf: Shelf | null;
  releases: Release[];
  events: Metric[];
  requests: RequestItem[];
  notices: AppNotice[];
  communityPosts: CommunityPost[];
  legalVersion: string;
  whatsapp: string;
  admin?: AdminOverview;
};
const PREFS_KEY = 'korlambda-shared-preferences';
function initialStore() {
  const data = freshStore();
  try {
    const prefs = JSON.parse(localStorage.getItem(PREFS_KEY) || 'null');
    data.settings = prefs || loadStore().data.settings;
  } catch {
    // Keep safe defaults when saved preferences cannot be read.
  }
  return data;
}
export function AppProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState(initialStore);
  const state = useRef(store);
  const [catalog, setCatalog] = useState<Release[]>(seedCatalog);
  const [notice, notify] = useState('');
  const [storageWarning, setWarning] = useState('');
  const [connection, setConnection] = useState<
    'loading' | 'ready' | 'unconfigured' | 'offline' | 'error'
  >('loading');
  const [syncState, setSyncState] = useState<'saved' | 'saving' | 'error'>('saved');
  const [notices, setNotices] = useState<AppNotice[]>([]);
  const [communityPosts, setPosts] = useState<CommunityPost[]>([]);
  const [adminOverview, setAdmin] = useState<AdminOverview>();
  const [legalVersion, setLegalVersion] = useState('2026-10-25.2');
  const [whatsapp, setWhatsapp] = useState('573112476840');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const busy = useRef(false);
  const pending = useRef(0);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const replace = useCallback((next: Store) => {
    state.current = next;
    setStore(next);
  }, []);
  const clearSession = useCallback(() => {
    setToken('');
    const before = state.current;
    replace({ ...freshStore(), settings: before.settings });
    setNotices([]);
    setAdmin(undefined);
  }, [replace]);
  const refresh = useCallback(async () => {
    if (busy.current || pending.current) return;
    busy.current = true;
    const token = getToken();
    try {
      const data = await cloudCall<Bootstrap>('bootstrap', {}, token);
      if (getToken() !== token) return;
      setCatalog(data.catalog || seedCatalog);
      setPosts(data.communityPosts || []);
      setLegalVersion(data.legalVersion || '2026-10-25.2');
      setWhatsapp(data.whatsapp || '573112476840');
      setNotices(data.notices || []);
      setAdmin(data.admin);
      const prefs = state.current.settings;
      const next: Store = {
        ...freshStore(),
        settings: prefs,
        accounts: data.account ? [data.account] : [],
        sessionId: data.account?.id || null,
        releases: data.releases || [],
        shelves: data.account ? { [data.account.id]: data.shelf || emptyShelf() } : {},
        events: data.events || [],
        requests: data.requests || [],
        hidden: data.admin?.hiddenIds || [],
      };
      replace(next);
      setConnection('ready');
    } catch (error) {
      if (
        error instanceof CloudError &&
        ['UNAUTHORIZED', 'ACCOUNT_INACTIVE'].includes(error.code)
      ) {
        clearSession();
        notify(error.message);
      } else
        setConnection(
          error instanceof CloudError && error.code === 'UNCONFIGURED'
            ? 'unconfigured'
            : !navigator.onLine
              ? 'offline'
              : 'error',
        );
    } finally {
      busy.current = false;
    }
  }, [clearSession, replace]);
  useEffect(() => {
    void refresh();
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') void refresh();
    }, 30000);
    const focus = () => void refresh();
    const offline = () => setConnection('offline');
    window.addEventListener('online', focus);
    window.addEventListener('focus', focus);
    window.addEventListener('offline', offline);
    document.addEventListener('visibilitychange', focus);
    const storage = (e: StorageEvent) => {
      if (e.key === SESSION_KEY) void refresh();
    };
    window.addEventListener('storage', storage);
    return () => {
      clearInterval(timer);
      window.removeEventListener('online', focus);
      window.removeEventListener('focus', focus);
      window.removeEventListener('offline', offline);
      document.removeEventListener('visibilitychange', focus);
      window.removeEventListener('storage', storage);
    };
  }, [refresh]);
  useEffect(() => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(store.settings));
      setWarning('');
    } catch {
      setWarning('No se pudieron guardar las preferencias de este dispositivo.');
    }
  }, [store.settings]);
  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const next =
        store.settings.theme === 'system'
          ? media.matches
            ? 'dark'
            : 'light'
          : store.settings.theme;
      document.documentElement.dataset.theme = next;
      setResolvedTheme(next);
    };
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [store.settings.theme]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => notify(''), 5000);
    return () => clearTimeout(timer);
  }, [notice]);
  const account = store.accounts.find((a) => a.id === store.sessionId);
  const shelf = account ? store.shelves[account.id] || emptyShelf() : emptyShelf();
  async function update(fn: (s: Store) => Store): Promise<boolean> {
    const before = state.current;
    const next = fn(before);
    const user = before.accounts.find((a) => a.id === before.sessionId);
    const privateChange =
      JSON.stringify([next.accounts, next.releases, next.shelves, next.hidden]) !==
      JSON.stringify([before.accounts, before.releases, before.shelves, before.hidden]);
    if (!privateChange) {
      replace(next);
      return true;
    }
    if (!user) {
      notify('Inicia sesión para conservar tus hallazgos.');
      return false;
    }
    if (!navigator.onLine) {
      notify('Sin conexión. Este cambio necesita guardarse en tu cuenta.');
      return false;
    }
    replace(next);
    pending.current++;
    setSyncState('saving');
    const token = getToken();
    const profile = next.accounts.find((a) => a.id === user.id) || user;
    const operation = queue.current
      .catch(() => {})
      .then(async () => {
        try {
          await cloudCall(
            'bundle.save',
            {
              profile: { name: profile.name, bio: profile.bio || '' },
              shelf: next.shelves[user.id] || emptyShelf(),
              releases: next.releases.filter((r) => r.ownerId === user.id),
            },
            token,
          );
          if (JSON.stringify(next.hidden) !== JSON.stringify(before.hidden)) {
            for (const id of new Set([...next.hidden, ...before.hidden]))
              if (next.hidden.includes(id) !== before.hidden.includes(id))
                await cloudCall('admin.hide', { id, hidden: next.hidden.includes(id) }, token);
          }
          setSyncState('saved');
          return true;
        } catch (error) {
          if (getToken() === token && state.current === next)
            replace({ ...before, settings: state.current.settings });
          setSyncState('error');
          notify(error instanceof Error ? error.message : 'No se pudo guardar en tu cuenta.');
          return false;
        } finally {
          pending.current--;
        }
      });
    queue.current = operation;
    return operation;
  }
  async function register(name: string, email: string, password: string, role: Role) {
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email.trim()) || password.length < 8)
      throw Error('Revisa el nombre, correo y una contraseña de mínimo ocho caracteres.');
    const result = await cloudRegister(name.trim(), email.trim().toLowerCase(), password, role);
    setToken(result.token);
    while (busy.current) await new Promise((resolve) => setTimeout(resolve, 100));
    await refresh();
    notify('Tu cuenta está creada. Lee los términos para entrar a tu escena.');
  }
  async function login(email: string, password: string) {
    const result = await cloudLogin(email, password);
    setToken(result.token);
    while (busy.current) await new Promise((resolve) => setTimeout(resolve, 100));
    await refresh();
    notify('Tu escena te estaba esperando.');
  }
  function logout() {
    const token = getToken();
    clearSession();
    void cloudCall('auth.logout', {}, token).catch(() => {});
    notify('Sesión cerrada.');
  }
  async function setShelf(fn: (s: Shelf) => Shelf) {
    const user = state.current.accounts.find((a) => a.id === state.current.sessionId);
    if (!user) {
      notify('Crea tu cuenta para guardar hallazgos.');
      return false;
    }
    return update((s) => ({
      ...s,
      shelves: { ...s.shelves, [user.id]: fn(s.shelves[user.id] || emptyShelf()) },
    }));
  }
  function save(id: string) {
    void setShelf((s) => ({
      ...s,
      saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [...s.saved, id],
    }));
  }
  function metric(releaseId: string, type: Metric['type'], label?: string) {
    if (!state.current.settings.analytics || !getToken()) return;
    void cloudCall('metric.record', { releaseId, type, label: label || '', consent: true }).catch(
      () => {},
    );
  }
  async function acceptTerms() {
    await cloudCall('consent.accept', { version: legalVersion, terms: true, privacy: true });
    await refresh();
    notify('Términos aceptados. Bienvenido a tu escena.');
  }
  function readNotice(id: string) {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n)),
    );
    void cloudCall('notice.read', { id }).catch(() =>
      notify('No se pudo marcar el aviso. Puedes reintentarlo.'),
    );
  }
  function simulatePlan() {
    notify('Los planes se activan desde la hoja privada después de la revisión del equipo.');
  }
  function exportData() {
    if (!account) return;
    const { hash: _, salt: __, ...profile } = account;
    void _;
    void __;
    download(
      'KORΛ-mis-datos.json',
      JSON.stringify(
        {
          profile,
          shelf,
          releases: store.releases,
          requests: store.requests,
          exportedAt: new Date().toISOString(),
        },
        null,
        2,
      ),
    );
  }
  async function deleteAccount() {
    await cloudCall('account.delete', { confirm: 'ELIMINAR' });
    clearSession();
    notify('Cuenta retirada de la prueba compartida.');
  }
  async function createOrder(plan: Plan, method: 'cash' | 'transfer') {
    const result = await cloudCall<RequestItem>('order.create', { plan, method });
    await refresh();
    return result;
  }
  async function joinWaitlist() {
    await cloudCall('waitlist.join', { consent: true });
    notify('Ya estás en la lista para recibir novedades de KORΛ.');
  }
  const remoteStatus =
    connection === 'ready'
      ? 'Google Sheets conectado'
      : connection === 'unconfigured'
        ? 'Conexión compartida pendiente'
        : connection === 'offline'
          ? 'Sin conexión · catálogo disponible'
          : connection === 'error'
            ? 'Conexión compartida pendiente'
            : 'Conectando con tu escena';
  return (
    <Context.Provider
      value={{
        store,
        account,
        catalog,
        shelf,
        notice,
        storageWarning,
        remoteStatus,
        connection,
        syncState,
        notify,
        update,
        register,
        login,
        logout,
        save,
        setShelf,
        metric,
        simulatePlan,
        exportData,
        deleteAccount,
        isAdmin: !!account?.isAdmin,
        resolvedTheme,
        notices,
        readNotice,
        acceptTerms,
        refresh,
        legalVersion,
        whatsapp,
        communityPosts,
        adminOverview,
        createOrder,
        joinWaitlist,
      }}
    >
      {children}
    </Context.Provider>
  );
}
