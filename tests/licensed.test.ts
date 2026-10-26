import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { licensedCatalog, licensedAudio } from '../src/core/licensedCatalog.ts';
test('licensed capsules have local audio, provenance and attribution', () => {
  assert.ok(licensedCatalog.length >= 6);
  for (const r of licensedCatalog) {
    assert.ok(['Medellín', 'Bogotá'].includes(r.city));
    assert.equal(r.playback, 'file');
    assert.equal(r.rights, 'open-license');
    assert.ok(r.links.some((l) => l.url.startsWith('https://creativecommons.org/licenses/')));
    assert.ok(fs.statSync('public' + licensedAudio[r.audioKey!]).size > 1000);
  }
});
