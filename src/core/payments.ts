import type { RequestItem } from './types';
export function paymentWhatsApp(
  number: string,
  r: RequestItem,
  email: string,
  planName: string,
  receipt = false,
) {
  const phone = number.replace(/\D/g, '');
  if (phone.length < 8 || phone.length > 15) return '';
  const text =
    (receipt
      ? 'Hola, equipo KORΛ. Quiero enviar el comprobante para revisión.'
      : 'Hola, equipo KORΛ. Quiero coordinar el pago y confirmar las condiciones.') +
    ' Plan: ' +
    planName +
    '. Referencia: ' +
    r.reference +
    '. Cuenta: ' +
    email +
    '. Medio: ' +
    (r.method === 'cash' ? 'efectivo' : 'transferencia') +
    '.' +
    (r.isTest ? ' Solicitud de prueba; no es una venta real.' : '');
  return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(text);
}
