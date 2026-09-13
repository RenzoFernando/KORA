import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { absoluteUrl, indexableRoutes, site } from '../seo.config.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const seenTitles = new Map();
const seenDescriptions = new Map();
const normalize = value => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const fail = message => failures.push(message);

function routeFile(route) {
  return path.join(root, route.replace(/^\//, ''), 'index.html');
}

function meta(html, name) {
  const re = new RegExp(`<meta\\s+[^>]*name=["']${name}["'][^>]*content=["']([^"']+)["'][^>]*>`, 'i');
  return html.match(re)?.[1]?.trim() || '';
}

function propertyMeta(html, property) {
  const re = new RegExp(`<meta\\s+[^>]*property=["']${property}["'][^>]*content=["']([^"']+)["'][^>]*>`, 'i');
  return html.match(re)?.[1]?.trim() || '';
}

function canonical(html) {
  return html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1] || '';
}

function jsonLdBlocks(html) {
  return [...html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)].map(match => match[1]);
}

for (const route of indexableRoutes) {
  const file = routeFile(route);
  if (!fs.existsSync(file)) {
    fail(`${route}: falta index.html`);
    continue;
  }

  const html = fs.readFileSync(file, 'utf8');
  const title = normalize(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '');
  const description = meta(html, 'description');
  const robots = meta(html, 'robots').toLowerCase();
  const h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(match => normalize(match[1]));
  const canon = canonical(html);

  if (!title) fail(`${route}: falta title`);
  if (!description) fail(`${route}: falta meta description`);
  if (h1.length !== 1) fail(`${route}: debe contener exactamente un H1, encontrados ${h1.length}`);
  if (h1[0] && title.toLowerCase() === h1[0].toLowerCase()) fail(`${route}: title y H1 no deben ser idénticos`);
  if (robots.includes('noindex')) fail(`${route}: una ruta indexable no puede llevar noindex`);
  if (canon !== absoluteUrl(route)) fail(`${route}: canonical incorrecta (${canon})`);
  if (!/<html\s+lang=["']es["']/i.test(html)) fail(`${route}: falta lang=es`);

  if (propertyMeta(html, 'og:title') !== title) fail(`${route}: og:title debe coincidir con el title`);
  if (propertyMeta(html, 'og:description') !== description) fail(`${route}: og:description debe coincidir con la description`);
  if (propertyMeta(html, 'og:url') !== absoluteUrl(route)) fail(`${route}: og:url incorrecta`);
  if (!propertyMeta(html, 'og:image')) fail(`${route}: falta og:image`);
  if (meta(html, 'twitter:title') !== title) fail(`${route}: twitter:title debe coincidir con el title`);
  if (meta(html, 'twitter:description') !== description) fail(`${route}: twitter:description debe coincidir con la description`);
  if (!meta(html, 'twitter:card') || !meta(html, 'twitter:image')) fail(`${route}: Twitter Card incompleta`);
  if (!/<link\s+[^>]*rel=["']manifest["']/i.test(html)) fail(`${route}: falta enlace al manifest`);
  if (!/<link\s+[^>]*rel=["']icon["']/i.test(html)) fail(`${route}: falta favicon`);
  if (!/class=["'][^"']*quick-summary/i.test(html)) fail(`${route}: falta bloque En breve`);
  if (!/data-share-page/i.test(html)) fail(`${route}: falta opción de compartir`);
  if (!/class=["'][^"']*mobile-sticky-cta/i.test(html)) fail(`${route}: falta CTA fijo móvil`);

  const headingLevels = [...html.matchAll(/<h([1-6])\b/gi)].map(match => Number(match[1]));
  if (headingLevels[0] !== 1) fail(`${route}: la jerarquía debe comenzar con H1`);
  for (let index = 1; index < headingLevels.length; index += 1) {
    if (headingLevels[index] > headingLevels[index - 1] + 1) {
      fail(`${route}: salto de jerarquía H${headingLevels[index - 1]} → H${headingLevels[index]}`);
      break;
    }
  }

  if (seenTitles.has(title)) fail(`${route}: title duplicado con ${seenTitles.get(title)}`);
  else seenTitles.set(title, route);
  if (seenDescriptions.has(description)) fail(`${route}: description duplicada con ${seenDescriptions.get(description)}`);
  else seenDescriptions.set(description, route);

  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    const attrs = match[1];
    if (!/\balt=["'][^"']*["']/i.test(attrs)) fail(`${route}: imagen sin atributo alt`);
    if (!/\bwidth=["']?\d+/i.test(attrs) || !/\bheight=["']?\d+/i.test(attrs)) fail(`${route}: imagen sin dimensiones explícitas`);
  }

  const parsed = [];
  for (const block of jsonLdBlocks(html)) {
    try { parsed.push(JSON.parse(block)); }
    catch { fail(`${route}: JSON-LD inválido`); }
  }
  if (!parsed.length) fail(`${route}: falta structured data`);
  if (!parsed.some(item => item['@type'] === 'WebPage')) fail(`${route}: falta schema WebPage`);
  if (!parsed.some(item => item['@type'] === 'BreadcrumbList')) fail(`${route}: falta schema BreadcrumbList`);
  if (route === '/descubrir/' && !parsed.some(item => item['@type'] === 'WebApplication')) fail(`${route}: falta schema WebApplication`);

  const faq = parsed.find(item => item['@type'] === 'FAQPage');
  const visibleQuestions = [...html.matchAll(/<h3\s+data-faq-question[^>]*>([\s\S]*?)<\/h3>/gi)].map(match => normalize(match[1]));
  const visibleAnswers = [...html.matchAll(/<p\s+data-faq-answer[^>]*>([\s\S]*?)<\/p>/gi)].map(match => normalize(match[1]));
  if (faq) {
    const schemaQuestions = faq.mainEntity.map(item => item.name);
    const schemaAnswers = faq.mainEntity.map(item => item.acceptedAnswer.text);
    if (JSON.stringify(visibleQuestions) !== JSON.stringify(schemaQuestions)) fail(`${route}: preguntas FAQ visibles y schema no coinciden`);
    if (JSON.stringify(visibleAnswers) !== JSON.stringify(schemaAnswers)) fail(`${route}: respuestas FAQ visibles y schema no coinciden`);
  } else if (visibleQuestions.length) {
    fail(`${route}: hay FAQ visible sin FAQPage`);
  }
}

for (const route of indexableRoutes) {
  const file = routeFile(route);
  const html = fs.readFileSync(file, 'utf8');
  for (const match of html.matchAll(/href=["']([^"']+)["']/gi)) {
    const href = match[1];
    if (/^(?:https?:|mailto:|tel:|#)/i.test(href)) continue;
    const clean = href.split('#')[0].split('?')[0];
    if (!clean) continue;
    if (/\.html$/i.test(clean) && !/login\.html$/i.test(clean)) fail(`${route}: enlace interno no limpio ${href}`);
    const target = path.resolve(path.dirname(file), clean);
    const resolved = clean.endsWith('/') ? path.join(target, 'index.html') : target;
    if (!fs.existsSync(resolved)) fail(`${route}: enlace interno roto ${href}`);
  }
}

for (const file of ['index.html', 'login.html', 'legal.html', '404.html']) {
  const target = path.join(root, file);
  if (!fs.existsSync(target)) { if (file === '404.html') fail('falta 404.html'); continue; }
  const robots = meta(fs.readFileSync(target, 'utf8'), 'robots').toLowerCase();
  if (!robots.includes('noindex')) fail(`${file}: la ruta funcional/técnica debe llevar noindex`);
}

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
for (const route of indexableRoutes) if (!sitemap.includes(`<loc>${absoluteUrl(route)}</loc>`)) fail(`sitemap: falta ${route}`);
for (const privatePath of ['/login.html', '/index.html', '/legal.html', '/404.html']) if (sitemap.includes(privatePath)) fail(`sitemap: incluye ruta privada ${privatePath}`);

const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
if (!robots.includes(`Disallow: ${site.basePath}/page/`)) fail('robots.txt: falta bloqueo de /page/');
if (!robots.includes(`Sitemap: ${absoluteUrl('/sitemap.xml')}`)) fail('robots.txt: falta referencia al sitemap canónico');

const sourceFiles = [];
function collect(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (['branding', 'dist', '.git'].includes(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) collect(full);
    else if (/\.(html|css|js|mjs|md|txt|xml|json)$/i.test(entry.name)) sourceFiles.push(full);
  }
}
collect(root);
const forbiddenA = ['proto', 'tipo'].join('');
const forbiddenB = ['proto', 'type'].join('');
for (const file of sourceFiles) {
  const content = fs.readFileSync(file, 'utf8').toLowerCase();
  if (content.includes(forbiddenA) || content.includes(forbiddenB)) fail(`${path.relative(root, file)}: contiene terminología que debe retirarse de la aplicación`);
}

if (failures.length) {
  console.error(`SEO check falló con ${failures.length} problema(s):`);
  failures.forEach(item => console.error(`- ${item}`));
  process.exit(1);
}

console.log(`SEO check OK: ${indexableRoutes.length} rutas indexables, titles/descriptions únicos, H1, canonical, JSON-LD, FAQ, robots y sitemap validados.`);
