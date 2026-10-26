/** Plantilla SIN CONECTAR. Solo para la hoja pública de datos autorizados. */
const PUBLIC_CATALOG_SPREADSHEET_ID = 'CONFIGURAR_TRAS_AUTORIZACION';
const PUBLIC_CATALOG_TAB = 'catalogo';
const PUBLIC_FIELDS = ['id','artistId','artist','title','city','genre','story','officialUrl','sourceUrl','verifiedAt','rightsEvidence','embedType','embedId'];
function doGet() {
  if (PUBLIC_CATALOG_SPREADSHEET_ID === 'CONFIGURAR_TRAS_AUTORIZACION') return ContentService.createTextOutput('[]').setMimeType(ContentService.MimeType.JSON);
  const sheet = SpreadsheetApp.openById(PUBLIC_CATALOG_SPREADSHEET_ID).getSheetByName(PUBLIC_CATALOG_TAB);
  if (!sheet) throw new Error('Falta pestaña de catálogo público');
  const rows = sheet.getDataRange().getDisplayValues();
  const headers = rows.shift() || [];
  const approval = headers.indexOf('publicApproved');
  if (approval < 0 || PUBLIC_FIELDS.some(field => headers.indexOf(field) < 0)) throw new Error('Encabezados públicos incompletos');
  const result = rows.filter(row => row[approval] === 'TRUE').slice(0,500).map(row => Object.fromEntries(PUBLIC_FIELDS.map(field => [field, row[headers.indexOf(field)]])));
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}
