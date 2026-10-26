/** Plantilla SIN CONECTAR para un disparador instalado en la hoja privada de respuestas. */
function onPrivateFormSubmit(event) {
  if (!event || !event.range) throw new Error('Ejecutar únicamente desde el disparador de envío del Form privado');
  const sheet = event.range.getSheet();
  const lastColumn = sheet.getLastColumn();
  const headers = sheet.getRange(1,1,1,lastColumn).getDisplayValues()[0];
  const column = headers.indexOf('referencia_korλ') + 1;
  if (!column) throw new Error('Añadir una columna referencia_korλ a la hoja privada');
  const cell = sheet.getRange(event.range.getRow(),column);
  if (!cell.getValue()) cell.setValue('KORΛ-' + Utilities.getUuid());
  // Sin doGet ni endpoint que publique datos. No activa planes ni confirma pagos.
}
