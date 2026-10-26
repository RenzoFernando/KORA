import fs from 'node:fs/promises';
import vm from 'node:vm';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const source = await fs.readFile(
  new URL('../backend/apps-script/KORlambda.gs', import.meta.url),
  'utf8',
);
const seed = { rows: [] };
const { seedCatalog: catalog } = await import('../src/core/catalog.ts');
const tables = {
  Usuarios: [
    [
      'email',
      'name',
      'role',
      'status',
      'premium',
      'plan',
      'plan_until',
      'is_admin',
      'is_test',
      'id',
      'created_at',
      'trial_started_at',
      'terms_version',
      'terms_at',
      'privacy_at',
      'password_salt',
      'password_hash',
      'bio',
    ],
    ...seed.rows,
  ],
  Perfiles: [['user_id', 'data_json', 'updated_at']],
  Sesiones: [['id', 'user_id', 'token_hash', 'created_at', 'expires_at', 'status', 'last_plan']],
  Lanzamientos: [['id', 'owner_id', 'data_json', 'status', 'updated_at']],
  Eventos: [['id', 'release_id', 'owner_id', 'type', 'at', 'label']],
  Solicitudes: [
    [
      'id',
      'user_id',
      'plan',
      'amount_cop',
      'method',
      'status',
      'created_at',
      'reference',
      'is_test',
    ],
  ],
  Espera: [['id', 'user_id', 'email', 'created_at', 'consent_at', 'status']],
  Notificaciones: [['id', 'user_id', 'title', 'body', 'type', 'link', 'created_at', 'read_at']],
  Configuracion: [
    ['key', 'value', 'description'],
    ['legal_version', '2026-10-25.2', ''],
    ['registration_open', 'TRUE', ''],
  ],
  Media: [['id', 'owner_id', 'mime', 'name', 'size', 'created_at']],
  Moderacion: [['release_id', 'hidden', 'updated_at']],
  Catalogo: [['publicApproved', 'data_json'], ...catalog.map((r) => [true, JSON.stringify(r)])],
};
const sheet = (name) => ({
  getLastRow: () => tables[name].length,
  getLastColumn: () => tables[name][0].length,
  getRange: (r, c, h, w) => ({
    getValues: () =>
      Array.from({ length: h }, (_, i) =>
        Array.from({ length: w }, (_, j) => tables[name][r + i - 1]?.[c + j - 1] ?? ''),
      ),
    setValues: (values) => {
      values.forEach((row, i) => {
        const target = tables[name][r + i - 1] || (tables[name][r + i - 1] = []);
        row.forEach(
          (value, j) =>
            (target[c + j - 1] =
              typeof value === 'string' && value.startsWith("'") ? value.slice(1) : value),
        );
      });
    },
  }),
  appendRow: (row) => tables[name].push(row),
  deleteRow: (r) => tables[name].splice(r - 1, 1),
});
const cache = new Map();
const context = vm.createContext({
  console,
  Date,
  JSON,
  Math,
  Number,
  String,
  Object,
  Array,
  Set,
  Error,
  RegExp,
  SpreadsheetApp: { openById: () => ({ getSheetByName: sheet, setSpreadsheetTimeZone: () => {} }) },
  CacheService: {
    getScriptCache: () => ({
      get: (key) => cache.get(key) || null,
      put: (key, val) => cache.set(key, val),
      remove: (key) => cache.delete(key),
    }),
  },
  LockService: { getScriptLock: () => ({ waitLock: () => {}, releaseLock: () => {} }) },
  PropertiesService: {
    getScriptProperties: () => ({ getProperty: () => null, setProperty: () => {} }),
  },
  Utilities: {
    getUuid: () => crypto.randomUUID(),
    DigestAlgorithm: { SHA_256: 'sha256' },
    Charset: { UTF_8: 'utf8' },
    computeDigest: (a, t) => [...crypto.createHash('sha256').update(t).digest()],
    computeHmacSha256Signature: (msg, key) => [
      ...crypto.createHmac('sha256', key).update(msg).digest(),
    ],
    base64Decode: (t) => [...Buffer.from(t, 'base64')],
    base64Encode: (t) => Buffer.from(t).toString('base64'),
  },
});
vm.runInContext(source + '\nthis.api=handleKora_;', context);
const call = (action, args = {}, token) =>
  JSON.parse(JSON.stringify(context.api({ action, args, token, requestId: crypto.randomUUID() })));
let checks = 0;
function check(name, fn) {
  fn();
  checks++;
  console.log('OK ' + name);
}
function register(email, role) {
  const salt = crypto.randomBytes(16).toString('hex'),
    hash = crypto.pbkdf2Sync('ClaveDePrueba-123', salt, 210000, 32, 'sha256').toString('hex');
  const r = call('auth.register', {
    name: 'Verificación',
    email,
    role,
    salt,
    hash,
    premium: true,
    is_admin: true,
  });
  assert.equal(r.ok, true);
  return { token: r.data.token, user: r.data.account, salt, hash, email };
}
const explorer = register('api-explorer@example.test', 'explorer');
check('el registro ignora privilegios solicitados por el cliente', () => {
  assert.equal(explorer.user.plan, 'free');
  assert.equal(explorer.user.isAdmin, false);
  assert.equal(explorer.user.needsConsent, true);
});
check('los términos son obligatorios en el servidor', () => {
  const r = call('bundle.save', { shelf: {} }, explorer.token);
  assert.equal(r.error.code, 'CONSENT_REQUIRED');
});
check('aceptación versionada registra consentimiento', () => {
  assert.equal(
    call('consent.accept', { version: '2026-10-25.2', terms: true, privacy: true }, explorer.token)
      .data.account.needsConsent,
    false,
  );
});
check('el catálogo público no devuelve contraseñas ni sesiones', () => {
  const r = call('public.catalog');
  const raw = JSON.stringify(r);
  assert.equal(r.data.catalog.length, 26);
  assert.ok(!raw.includes('password_hash'));
  assert.ok(!raw.includes('token_hash'));
  assert.ok(!raw.includes(explorer.hash));
});
check('un explorador gratuito no publica recomendaciones Pro', () => {
  const r = call(
    'bundle.save',
    {
      shelf: { recommendations: [{ id: 'rec1', releaseId: 'zalama-dejalo', text: 'prueba' }] },
      releases: [],
    },
    explorer.token,
  );
  assert.equal(r.error.code, 'PLAN_REQUIRED');
});
const row = tables.Usuarios.find((row) => row[0] === explorer.email);
check('editar premium en la hoja activa Curador sin venta simulada', () => {
  row[4] = true;
  row[5] = 'curator';
  const r = call('bootstrap', {}, explorer.token);
  assert.equal(r.data.account.plan, 'curator');
  assert.equal(r.data.account.simulated, false);
  assert.ok(r.data.notices.some((n) => n.type === 'plan'));
});
check('la suspensión de la hoja revoca el acceso', () => {
  row[3] = 'inactive';
  assert.equal(call('bootstrap', {}, explorer.token).error.code, 'ACCOUNT_INACTIVE');
  row[3] = 'active';
});
check('una fecha vencida retira premium', () => {
  row[6] = '2000-01-01T00:00:00Z';
  assert.equal(call('bootstrap', {}, explorer.token).data.account.plan, 'free');
  row[6] = '';
});
check('el rol se valida en el servidor al crear lanzamientos', () => {
  const r = call(
    'bundle.save',
    { shelf: {}, releases: [{ id: crypto.randomUUID() }] },
    explorer.token,
  );
  assert.equal(r.error.code, 'ROLE_REQUIRED');
});
check('el acceso usa prueba HMAC y contraseña derivada', () => {
  const c = call('auth.challenge', { email: explorer.email }).data;
  const proof = crypto
    .createHmac('sha256', explorer.hash)
    .update(c.challengeId + '.' + c.nonce + '.' + explorer.email)
    .digest('hex');
  const r = call('auth.login', { challengeId: c.challengeId, proof });
  assert.equal(r.ok, true);
  assert.ok(r.data.token);
  assert.equal(call('auth.login', { challengeId: c.challengeId, proof }).ok, false);
});
check('no se permiten solicitudes de planes de otro perfil', () => {
  assert.equal(call('order.create', { plan: 'scout' }, explorer.token).error.code, 'PLAN_REQUIRED');
});
check('una solicitud no activa el plan ni confirma pago', () => {
  row[4] = false;
  const r = call('order.create', { plan: 'curator', method: 'transfer' }, explorer.token);
  assert.equal(r.data.status, 'pending');
  assert.equal(call('bootstrap', {}, explorer.token).data.account.plan, 'free');
});
check('un token desconocido no recibe datos privados', () => {
  assert.equal(call('bootstrap', {}, 'token-falso').error.code, 'UNAUTHORIZED');
});

const testArtist = register('roles-artist@example.test', 'artist');
call('consent.accept', { version: '2026-10-25.2', terms: true, privacy: true }, testArtist.token);
const makeRelease = () => ({
  id: crypto.randomUUID(),
  title: 'Prueba aislada',
  artist: 'Artista QA',
  city: 'Cali',
  genre: 'Prueba',
  story: 'Solo datos aislados en memoria.',
  rightsEvidence: 'Fixture de verificación, no publicado.',
  playback: 'link',
  officialUrl: 'https://example.com/music',
  status: 'active',
  links: [],
});
const five = Array.from({ length: 5 }, makeRelease);
check('el servidor permite cinco activos durante la prueba Artist y rechaza seis', () => {
  assert.equal(call('bundle.save', { shelf: {}, releases: five }, testArtist.token).ok, true);
  assert.equal(
    call('bundle.save', { shelf: {}, releases: [...five, makeRelease()] }, testArtist.token).error
      .code,
    'LIMIT_REACHED',
  );
});
const testArtistRow = tables.Usuarios.find((row) => row[0] === testArtist.email);
check('la prueba vencida no permite activar otro lanzamiento', () => {
  testArtistRow[11] = '2000-01-01T00:00:00Z';
  assert.equal(
    call(
      'bundle.save',
      { shelf: {}, releases: [...five.slice(0, 4), makeRelease()] },
      testArtist.token,
    ).error.code,
    'PLAN_REQUIRED',
  );
});
check('Launch Kit aplica su cupo de un activo en el servidor', () => {
  testArtistRow[4] = true;
  testArtistRow[5] = 'kit';
  assert.equal(
    call(
      'bundle.save',
      {
        shelf: {},
        releases: [five[0], ...five.slice(1).map((r) => ({ ...r, status: 'archived' }))],
      },
      testArtist.token,
    ).ok,
    true,
  );
  assert.equal(
    call(
      'bundle.save',
      { shelf: {}, releases: [five[0], { ...five[1], status: 'active' }] },
      testArtist.token,
    ).error.code,
    'LIMIT_REACHED',
  );
});
const otherArtist = register('other-artist@example.test', 'artist');
call('consent.accept', { version: '2026-10-25.2', terms: true, privacy: true }, otherArtist.token);
check('un artista no puede editar el lanzamiento de otra cuenta', () => {
  assert.equal(
    call('bundle.save', { shelf: {}, releases: [five[0]] }, otherArtist.token).error.code,
    'FORBIDDEN',
  );
});
check('una clave de archivo ajena o inexistente no autoriza audio nativo', () => {
  assert.equal(
    call(
      'bundle.save',
      {
        shelf: {},
        releases: [{ ...makeRelease(), playback: 'file', audioKey: 'drive:inexistente' }],
      },
      otherArtist.token,
    ).error.code,
    'FORBIDDEN',
  );
});
console.log('TOTAL ' + checks + ' verificaciones correctas.');
