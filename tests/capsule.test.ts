import test from 'node:test';
import assert from 'node:assert/strict';
import { capsuleDuration, capsulePosition } from '../src/player/capsule.ts';
test('capsules cap long tracks and preserve shorter tracks', () => {
  assert.equal(capsuleDuration(180), 30);
  assert.equal(capsuleDuration(12), 12);
  assert.equal(capsuleDuration(Infinity), 0);
});
test('seeking cannot escape the capsule', () => {
  assert.equal(capsulePosition(75, 180), 30);
  assert.equal(capsulePosition(-4, 180), 0);
  assert.equal(capsulePosition(20, 12), 12);
  assert.equal(capsulePosition(NaN, 180), 0);
});
