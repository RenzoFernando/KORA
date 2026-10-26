import type { Account, Plan, Release } from './types';
export const plans: {
  id: Plan;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
}[] = [
  {
    id: 'free',
    name: 'Explorador',
    price: 0,
    period: 'siempre',
    description: 'Un oído nuevo para tu ciudad.',
    features: [
      'Catálogo y reproductores oficiales',
      'Guardados y notas personales',
      'Colecciones privadas',
    ],
  },
  {
    id: 'curator',
    name: 'Curador Pro',
    price: 12900,
    period: '/ mes',
    description: 'Dale contexto a lo que descubres.',
    features: [
      'Todo lo de Explorador',
      'Publicar recomendaciones para la comunidad',
      'Colecciones con criterio propio',
    ],
  },
  {
    id: 'artist',
    name: 'Artist',
    price: 24900,
    period: '/ mes',
    description: 'Un lugar para cada nuevo sonido.',
    features: [
      'Prueba de 7 días sin cobro',
      'Hasta 5 lanzamientos activos',
      'Bio page, enlaces, QR y métricas consentidas',
    ],
  },
  {
    id: 'scout',
    name: 'Scout',
    price: 69900,
    period: '/ mes',
    description: 'Acércate a una escena con permiso.',
    features: [
      'Catálogo y lista de seguimiento',
      'Solo métricas autorizadas',
      'Exportación de tu selección',
    ],
  },
  {
    id: 'kit',
    name: 'Launch Kit',
    price: 24900,
    period: '/ lanzamiento',
    description: 'Una canción. Una página. Tu historia.',
    features: [
      '1 lanzamiento, sin renovación automática',
      'Historia, enlaces oficiales y QR',
      'Página compartida y exportación; plazo por acordar',
    ],
  },
];
export const money = (n: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n);
export function trialRemaining(account: Account, now = Date.now()) {
  return account.trialStartedAt
    ? Math.max(
        0,
        Math.ceil((new Date(account.trialStartedAt).getTime() + 7 * 86400000 - now) / 86400000),
      )
    : 0;
}
export function releaseAllowance(account: Account, releases: Release[], now = Date.now()) {
  const active = releases.filter((r) => r.ownerId === account.id && r.status === 'active').length;
  const hasAccess =
    (account.plan === 'artist' && (account.simulated || account.entitlementSource === 'sheet')) ||
    (account.plan === 'kit' && (account.simulated || account.entitlementSource === 'sheet')) ||
    trialRemaining(account, now) > 0;
  const limit = account.plan === 'kit' ? 1 : 5;
  return { active, limit, hasAccess, canActivate: hasAccess && active < limit };
}
