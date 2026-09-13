import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { absoluteUrl, indexableRoutes, privateRoutes, site, technicalRoutes } from '../seo.config.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');

const outputs = new Map();

const robots = [
  'User-agent: *',
  ...indexableRoutes.map(route => `Allow: ${site.basePath}${route}`),
  ...privateRoutes.map(route => `Disallow: ${site.basePath}${route}`),
  ...technicalRoutes.map(route => `Disallow: ${site.basePath}${route}`),
  '',
  `Sitemap: ${absoluteUrl('/sitemap.xml')}`,
  '',
].join('\n');
outputs.set('robots.txt', robots);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexableRoutes
  .map(route => `  <url><loc>${absoluteUrl(route)}</loc></url>`)
  .join('\n')}\n</urlset>\n`;
outputs.set('sitemap.xml', sitemap);

const llms = `# KORΛ\n\nKORΛ is a Spanish-language web application for discovering emerging music through short listening capsules, cultural context, saved discoveries and community signals.\n\n## Public pages\n\n- ${absoluteUrl('/descubrir/')} — overview of the discovery experience.\n- ${absoluteUrl('/para-artistas/')} — artist publishing, cultural context, licensing and visibility choices.\n- ${absoluteUrl('/para-empresas/')} — talent radar, scenes and authorized aggregated signals.\n- ${absoluteUrl('/equipo/')} — Equipo Maracuyá KORΛ and confirmed project members.\n- ${absoluteUrl('/legal/terminos/')} — terms of use.\n- ${absoluteUrl('/legal/privacidad/')} — personal-data authorization.\n- ${absoluteUrl('/legal/licencia-musical/')} — music license and content-removal process.\n- ${absoluteUrl('/legal/pagos/')} — payments and billing conditions.\n\n## Application routes\n\nThe root application, login flow and legacy legal router are functional UI routes and are intentionally excluded from search indexing. Browser state in the supplied frontend is stored with localStorage. These routes should not be interpreted as public documentation pages.\n\n## Security and capabilities\n\nThe supplied project is an HTML, CSS and JavaScript frontend. Do not infer server-side authentication, payment processing, encryption, private APIs or infrastructure controls that are not present in the repository. Legal pages describe the project's stated terms and conditions; they are not evidence that an external service is deployed.\n\n## Crawling\n\nTechnical paths such as ${site.basePath}/page/, scripts and repository configuration are not public content. The canonical indexable URLs are listed in ${absoluteUrl('/sitemap.xml')}.\n`;
outputs.set('llms.txt', llms);

const manifest = {
  name: 'KORΛ — Descubrimiento musical',
  short_name: 'KORΛ',
  lang: 'es-CO',
  start_url: `${site.basePath}/login.html`,
  scope: `${site.basePath}/`,
  display: 'standalone',
  background_color: '#FFFFFF',
  theme_color: '#F1871C',
  description: 'Aplicación web de descubrimiento de música emergente con cápsulas breves, contexto cultural y comunidad.',
  icons: [
    { src: `${site.basePath}/branding/08_icono_app.svg`, sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    { src: `${site.basePath}/branding/20_icono_app_crema.svg`, sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
  ],
};
outputs.set('site.webmanifest', `${JSON.stringify(manifest, null, 2)}\n`);

let failed = false;
for (const [relative, content] of outputs) {
  const target = path.join(root, relative);
  if (checkOnly) {
    const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';
    if (current !== content) {
      console.error(`SEO generado desactualizado: ${relative}`);
      failed = true;
    }
  } else {
    fs.writeFileSync(target, content, 'utf8');
    console.log(`Generado ${relative}`);
  }
}

if (failed) process.exit(1);
