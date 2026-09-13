export const site = {
  name: 'KORΛ',
  origin: 'https://renzofernando.github.io',
  basePath: '/KORA',
  language: 'es-CO',
};

export const indexableRoutes = [
  '/descubrir/',
  '/para-artistas/',
  '/para-empresas/',
  '/equipo/',
  '/legal/terminos/',
  '/legal/privacidad/',
  '/legal/licencia-musical/',
  '/legal/pagos/',
];

export const privateRoutes = ['/index.html', '/login.html', '/legal.html'];
export const technicalRoutes = ['/page/', '/scripts/', '/seo.config.mjs', '/.github/'];

export function absoluteUrl(path = '/') {
  return `${site.origin}${site.basePath}${path}`;
}
