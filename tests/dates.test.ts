import test from 'node:test';
import assert from 'node:assert/strict';
import { formatDate } from '../src/core/dates.ts';
import { requestStatus } from '../src/core/payments.ts';

test('fechas ausentes o inválidas no rompen las pantallas', () => {
  assert.equal(formatDate(), 'Fecha no registrada');
  assert.equal(formatDate('incorrecta'), 'Fecha no registrada');
});
test('una fecha sin hora conserva su día y los instantes usan Colombia', () => {
  assert.match(formatDate('2026-11-03'), /3 de noviembre/);
  assert.match(formatDate('2026-11-03T02:00:00Z'), /2 de noviembre/);
});
test('las solicitudes distinguen revisión, activación y rechazo', () => {
  assert.equal(requestStatus('approved'), 'Revisada por el equipo');
  assert.equal(requestStatus('activated'), 'Acceso activado');
  assert.equal(requestStatus('rejected'), 'No aprobada');
});
