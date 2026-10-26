import test from 'node:test';
import assert from 'node:assert/strict';
import { playableCatalog } from '../src/core/catalogPlayback.ts';
import { licensedCatalog } from '../src/core/licensedCatalog.ts';
test('native enrichment respects server visibility and original source', () => {
  const native = licensedCatalog[0];
  assert.equal(playableCatalog([]).length, 0);
  assert.equal(playableCatalog([{ ...native, playback: 'link' }])[0].playback, 'file');
  assert.equal(
    playableCatalog([{ ...native, playback: 'link', sourceUrl: 'https://example.com' }])[0]
      .playback,
    'link',
  );
});
