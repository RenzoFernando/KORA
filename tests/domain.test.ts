import test from 'node:test';
import assert from 'node:assert/strict';
import { seedCatalog, filterCatalog, safeUrl, embedUrl } from '../src/core/catalog.ts';
import { releaseAllowance, trialRemaining } from '../src/core/plans.ts';
import { passwordHash, newSalt } from '../src/core/storage.ts';
import type { Account } from '../src/core/types.ts';
const now = Date.parse('2026-10-25T12:00:00.000Z');
const artist: Account = {
  id: 'artist',
  name: 'Prueba',
  email: 'artist@example.test',
  role: 'artist',
  salt: '',
  hash: '',
  createdAt: new Date(now).toISOString(),
  trialStartedAt: new Date(now).toISOString(),
  plan: 'free',
  simulated: false,
  termsAt: '',
  privacyAt: '',
};
test('la prueba termina exactamente a los siete días', () => {
  assert.equal(trialRemaining(artist, now), 7);
  assert.equal(trialRemaining(artist, now + 7 * 86400000 - 1), 1);
  assert.equal(trialRemaining(artist, now + 7 * 86400000), 0);
  assert.equal(releaseAllowance(artist, [], now + 7 * 86400000).canActivate, false);
});
test('cinco activos agotan Artist, borradores no cuentan', () => {
  const releases = seedCatalog.slice(0, 5).map((r) => ({ ...r, ownerId: 'artist' }));
  assert.equal(releaseAllowance(artist, releases, now).canActivate, false);
  releases[0] = { ...releases[0], status: 'draft' };
  assert.equal(releaseAllowance(artist, releases, now).canActivate, true);
});
test('Launch Kit permite un lanzamiento y no activa Artist', () => {
  const kit = { ...artist, trialStartedAt: undefined, plan: 'kit' as const, simulated: true };
  assert.equal(releaseAllowance(kit, [], now).limit, 1);
  assert.equal(
    releaseAllowance(kit, [{ ...seedCatalog[0], ownerId: 'artist' }], now).canActivate,
    false,
  );
});
test('elegir un plan sin simulación no desbloquea acceso', () => {
  const expired = {
    ...artist,
    trialStartedAt: undefined,
    plan: 'artist' as const,
    simulated: false,
  };
  assert.equal(releaseAllowance(expired, [], now).hasAccess, false);
});
test('las cuentas y los archivados no consumen cupos ajenos', () => {
  const other = seedCatalog.map((r) => ({ ...r, ownerId: 'other' }));
  assert.equal(releaseAllowance(artist, other, now).active, 0);
  assert.equal(
    releaseAllowance(
      artist,
      seedCatalog.map((r) => ({ ...r, ownerId: 'artist', status: 'archived' })),
      now,
    ).active,
    0,
  );
});
test('filtra ciudades y normaliza tildes sin inventar resultados', () => {
  assert.equal(filterCatalog(seedCatalog, 'Cali', 'Todos', 'punta talon').length, 1);
  assert.ok(filterCatalog(seedCatalog, 'Bogotá', 'Todos', '').every((r) => r.city === 'Bogotá'));
  const rock = filterCatalog(seedCatalog, 'Colombia', 'Rock', '');
  assert.ok(rock.length >= 5);
  assert.ok(rock.every((r) => r.genre === 'Rock'));
});
test('URLs ejecutables, HTTP y credenciales se rechazan', () => {
  assert.equal(safeUrl('javascript:alert(1)'), '');
  assert.equal(safeUrl('http://example.com'), '');
  assert.equal(safeUrl('https://user:pass@example.com'), '');
  assert.equal(safeUrl('https://example.com/music'), 'https://example.com/music');
});
test('los embeds solo apuntan a Bandcamp con IDs numéricos', () => {
  assert.ok(
    embedUrl(seedCatalog.find((r) => r.id === 'zalama-dejalo')!).startsWith(
      'https://bandcamp.com/EmbeddedPlayer/track=481549181/',
    ),
  );
  assert.equal(
    embedUrl({ ...seedCatalog.find((r) => r.id === 'zalama-dejalo')!, embedId: '<script>' }),
    '',
  );
  assert.equal(embedUrl({ ...seedCatalog[0], playback: 'file' }), '');
});
test('el catálogo editorial no concede permisos para analítica Scout', () => {
  const editorial = seedCatalog.filter((r) => r.playback === 'bandcamp');
  assert.equal(editorial.length, 26);
  assert.ok(editorial.every((r) => r.rights === 'official-embed' && !r.allowScout && !r.audioKey));
  assert.equal(new Set(seedCatalog.map((r) => r.id)).size, seedCatalog.length);
});
test('contraseñas con sal distinta generan hashes distintos sin texto plano', async () => {
  const salt = newSalt(),
    second = newSalt();
  assert.notEqual(salt, second);
  const first = await passwordHash('solo-prueba-123', salt);
  assert.equal(first.length, 64);
  assert.equal(first, await passwordHash('solo-prueba-123', salt));
  assert.notEqual(first, await passwordHash('solo-prueba-123', second));
});
