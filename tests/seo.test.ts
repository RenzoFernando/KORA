import test from 'node:test';
import assert from 'node:assert/strict';
import { publicPages, routeMetadata } from '../src/core/seo.ts';
test('SEO public routes exclude accounts, tools and unknown paths', () => {
  for (const route of ['/cuenta', '/interno', '/studio/nuevo', '/guardados', '/missing'])
    assert.equal(publicPages[route], undefined);
  assert.notEqual(routeMetadata('/discover').title, routeMetadata('/planes').title);
  for (const data of Object.values(publicPages)) {
    assert.ok(data.title.includes('KORΛ'));
    assert.ok(data.description.length > 20);
  }
});
