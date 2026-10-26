import test from 'node:test';
import assert from 'node:assert/strict';
import { isPhonePlatform } from '../src/core/platform.ts';
test('no ofrece instalación a un computador, aunque su ventana sea estrecha', () => {
  assert.equal(
    isPhonePlatform('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/138.0', false),
    false,
  );
  assert.equal(isPhonePlatform('Mozilla/5.0 (Macintosh; Intel Mac OS X) Safari/605.1.15'), false);
});
test('ofrece instalación en teléfonos iPhone y Android', () => {
  assert.equal(
    isPhonePlatform('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Mobile Safari/604.1'),
    true,
  );
  assert.equal(
    isPhonePlatform('Mozilla/5.0 (Linux; Android 15; Pixel) Chrome/138 Mobile Safari/537.36', true),
    true,
  );
  assert.equal(
    isPhonePlatform('Mozilla/5.0 (Linux; Android 15) Chrome/138 Safari/537.36', false),
    false,
  );
  assert.equal(isPhonePlatform('Mozilla/5.0 (iPad; CPU OS 18_0) Mobile Safari/604.1'), false);
});
