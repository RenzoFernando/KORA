export function formatDate(value?: string) {
  if (!value || !Number.isFinite(Date.parse(value))) return 'Fecha no registrada';
  return new Date(value).toLocaleString('es-CO', {
    dateStyle: 'long',
    ...(/^\d{4}-\d{2}-\d{2}$/.test(value)
      ? { timeZone: 'UTC' }
      : { timeZone: 'America/Bogota', timeStyle: 'short' }),
  });
}
