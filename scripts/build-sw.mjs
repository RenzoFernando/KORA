import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
const files = walk('dist')
  .filter(
    (f) =>
      !f.replaceAll('\\', '/').includes('/audio/') &&
      !f.endsWith('sw.js') &&
      !f.endsWith('runtime-config.json') &&
      !['_headers', '_redirects'].includes(path.basename(f)),
  )
  .map((f) => '/' + f.replaceAll('\\', '/').replace(/^dist\//, ''));
const version = crypto
  .createHash('sha256')
  .update(
    files
      .map((f) => fs.readFileSync('dist' + f))
      .map((b) => crypto.createHash('sha256').update(b).digest('hex'))
      .join(''),
  )
  .digest('hex')
  .slice(0, 12);
fs.writeFileSync(
  'dist/sw.js',
  `const CACHE='korlambda-shell-${version}';const ASSETS=${JSON.stringify(files)};self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('korlambda-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting();});self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin||u.pathname==='/runtime-config.json')return;if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).catch(()=>caches.match('/index.html')));return;}if(ASSETS.includes(u.pathname))e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});`,
);
console.log('PWA: shell versionada. API, cuentas y audio externo excluidos de caché.');
