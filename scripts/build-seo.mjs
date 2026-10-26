import fs from 'node:fs';
import { publicPages } from '../src/core/seo.ts';
const raw = process.env.VITE_SITE_URL;
const origin = raw ? new URL(raw).origin : null;
const escape = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const template = fs.readFileSync('dist/index.html', 'utf8');
for (const [route, data] of Object.entries(publicPages)) {
  const canonical = origin ? origin + route : null;
  const extra =
    '<meta property="og:title" content="' +
    escape(data.title) +
    '" /><meta property="og:description" content="' +
    escape(data.description) +
    '" /><meta property="og:type" content="website" /><meta name="twitter:card" content="summary" />' +
    (canonical
      ? '<link rel="canonical" href="' +
        escape(canonical) +
        '" /><meta property="og:url" content="' +
        escape(canonical) +
        '" />'
      : '');
  const html = template
    .replace(/<title>.*?<\/title>/s, '<title>' + escape(data.title) + '</title>')
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/s,
      '<meta name="description" content="' + escape(data.description) + '" />',
    )
    .replace('</head>', extra + '</head>');
  fs.mkdirSync('dist' + route, { recursive: true });
  fs.writeFileSync('dist' + route + '/index.html', html);
}
// This shared trial intentionally has no indexable URLs. Metadata is not SSR.
fs.writeFileSync('dist/robots.txt', 'User-agent: *\nDisallow: /\n');
fs.writeFileSync(
  'dist/sitemap.xml',
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
);
fs.writeFileSync(
  'dist/llms.txt',
  '# KORΛ\n\nPrueba de descubrimiento musical de Cali y herramientas para artistas.\n\n## Rutas públicas\n' +
    Object.entries(publicPages)
      .map(([route, data]) => '- ' + route + ': ' + data.description)
      .join('\n') +
    '\n\n## Límites\nLas cuentas, biblioteca, administración y herramientas de Studio requieren sesión y permisos. Los borradores no son contenido público. Bandcamp conserva sus controles oficiales; el audio subido requiere autorización. Esta prueba no está destinada a indexación.\n',
);
console.log('SEO: metadata por ruta; prueba noindex, sitemap vacío y llms.txt generados.');
