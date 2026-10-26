import { createContext, useContext } from 'react';
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
export type ContextValue = {
  store: Store;
  account: Account | undefined;
  catalog: Release[];
  shelf: Shelf;
  notice: string;
  storageWarning: string;
  remoteStatus: string;
  connection: 'loading' | 'ready' | 'unconfigured' | 'offline' | 'error';
  syncState: 'saved' | 'saving' | 'error';
  notify: (s: string) => void;
  update: (fn: (s: Store) => Store) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: Role) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  save: (id: string) => void;
  setShelf: (fn: (s: Shelf) => Shelf) => Promise<boolean>;
  metric: (releaseId: string, type: Metric['type'], label?: string) => void;
  simulatePlan: (plan: Plan) => void;
  exportData: () => void;
  deleteAccount: () => Promise<void>;
  isAdmin: boolean;
  resolvedTheme: 'light' | 'dark';
  notices: AppNotice[];
  readNotice: (id: string) => void;
  acceptTerms: () => Promise<void>;
  refresh: () => Promise<void>;
  legalVersion: string;
  whatsapp: string;
  communityPosts: CommunityPost[];
  adminOverview: AdminOverview | undefined;
  createOrder: (plan: Plan, method: 'cash' | 'transfer') => Promise<RequestItem>;
  joinWaitlist: () => Promise<void>;
};
export const Context = createContext<ContextValue | null>(null);
export function useApp() {
  const value = useContext(Context);
  if (!value) throw Error('Falta AppProvider');
  return value;
}
