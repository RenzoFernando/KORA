import test from 'node:test';
import assert from 'node:assert/strict';
import { paymentWhatsApp } from '../src/core/payments.ts';
import type { RequestItem } from '../src/core/types.ts';
const request: RequestItem = {
  id: 'qa',
  accountId: 'qa',
  plan: 'curator',
  at: '2026-10-26',
  status: 'pending',
  simulated: false,
  reference: 'KORA-ABC',
  method: 'transfer',
  isTest: true,
};
test('receipt WhatsApp identifies the account and reference without confirming a payment', () => {
  const url = new URL(
    paymentWhatsApp('+57 3112476840', request, 'qa@example.test', 'Curador Pro', true),
  );
  assert.equal(url.pathname, '/573112476840');
  const text = url.searchParams.get('text')!;
  assert.ok(text.includes('KORA-ABC'));
  assert.ok(text.includes('comprobante para revisión'));
  assert.ok(text.includes('no es una venta real'));
  assert.ok(text.includes('qa@example.test'));
});
test('invalid phone does not produce a misleading payment link', () =>
  assert.equal(paymentWhatsApp('abc', request, '', 'Artist'), ''));
