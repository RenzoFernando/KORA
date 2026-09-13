import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const generator = spawnSync(process.execPath, [path.join(root, 'scripts/generate-seo.mjs')], { stdio: 'inherit' });
if (generator.status !== 0) process.exit(generator.status ?? 1);
const check = spawnSync(process.execPath, [path.join(root, 'scripts/seo-check.mjs')], { stdio: 'inherit' });
if (check.status !== 0) process.exit(check.status ?? 1);

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
const entries = [
  'index.html','login.html','legal.html','404.html','robots.txt','sitemap.xml','llms.txt','site.webmanifest',
  'css','js','img','branding','audio','descubrir','para-artistas','para-empresas','equipo','legal'
];
for (const entry of entries) {
  const source = path.join(root, entry);
  if (!fs.existsSync(source)) continue;
  fs.cpSync(source, path.join(dist, entry), { recursive: true });
}
console.log(`Build estático generado en ${dist}`);
