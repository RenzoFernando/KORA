import fs from 'node:fs';
import assert from 'node:assert/strict';
import { publicPages } from '../src/core/seo.ts';
for (const [route, data] of Object.entries(publicPages)) {
  const html = fs.readFileSync('dist' + route + '/index.html', 'utf8');
  assert.ok(html.includes(data.title));
  assert.ok(html.includes('noindex,nofollow'));
  assert.ok(html.includes('property="og:title"'));
  assert.equal((html.match(/<title>/g) || []).length, 1);
}
assert.ok(!fs.readFileSync('dist/sitemap.xml', 'utf8').includes('<loc>'));
assert.ok(fs.readFileSync('dist/robots.txt', 'utf8').includes('Disallow: /'));
assert.ok(fs.existsSync('dist/llms.txt'));
console.log('SEO build checks passed.');
