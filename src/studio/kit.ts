import type { Release } from '../core/types';
import { readFile } from '../core/media';
import { download } from '../core/storage';
import { safeUrl } from '../core/catalog';
const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
function dataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
export async function exportKit(r: Release) {
  const cover = r.coverKey ? await readFile(r.coverKey) : undefined;
  const audio = r.playback === 'file' && r.audioKey ? await readFile(r.audioKey) : undefined;
  const coverUrl = cover ? await dataUrl(cover) : '';
  const audioUrl = audio ? await dataUrl(audio) : '';
  const links = r.links.filter((l) => safeUrl(l.url));
  const pageUrl = location.origin + '/lanzamiento/' + r.slug;
  const { default: QRCode } = await import('qrcode');
  const qr = await QRCode.toDataURL(pageUrl, {
    width: 220,
    margin: 2,
    color: { dark: '#171414', light: '#ffffff' },
  });
  const html =
    '<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' +
    escape(r.title) +
    ' · ' +
    escape(r.artist) +
    ' | KORΛ</title><style>*{box-sizing:border-box}body{margin:0;background:#f6f4ef;color:#171414;font:16px system-ui,sans-serif}main{max-width:680px;margin:4rem auto;padding:2rem}h1{font-size:clamp(38px,8vw,68px);letter-spacing:-.04em;line-height:1.05}p{line-height:1.7}.brand{font-weight:800;letter-spacing:.25em}.art{aspect-ratio:1;background:#F1871C;color:#171414;display:grid;place-items:center;font-size:50px;font-weight:800;overflow:hidden}.art img{width:100%;height:100%;object-fit:cover}a{display:block;color:inherit;text-decoration:none;border:1px solid #aaa;padding:18px;margin:12px 0;border-radius:8px}audio{width:100%}.small{font-size:12px;color:#65594d}footer{margin-top:3rem}</style><main><p class="brand">KORΛ</p><div class="art">' +
    (coverUrl ? '<img alt="Portada" src="' + coverUrl + '">' : escape(r.artist)) +
    '</div><p>' +
    escape(r.city) +
    ' · ' +
    escape(r.genre) +
    '</p><h1>' +
    escape(r.title) +
    '</h1><h2>' +
    escape(r.artist) +
    '</h2><p>' +
    escape(r.story).replaceAll('\n', '<br>') +
    '</p>' +
    (audioUrl ? '<audio controls preload="metadata" src="' + audioUrl + '"></audio>' : '') +
    links
      .map(
        (l) =>
          '<a href="' +
          escape(safeUrl(l.url)) +
          '" target="_blank" rel="noopener noreferrer">' +
          escape(l.label) +
          ' ↗</a>',
      )
      .join('') +
    '<section><h2>Tu enlace, a un escaneo.</h2><img width="180" height="180" alt="QR del lanzamiento" src="' +
    qr +
    '"><p class="small">' +
    (r.status === 'active'
      ? 'El QR abre la página de este lanzamiento.'
      : 'Vista previa: este QR requiere la sesión del autor hasta activar el lanzamiento.') +
    '</p><a href="' +
    escape(pageUrl) +
    '" target="_blank" rel="noopener noreferrer">Abrir página del lanzamiento ↗</a></section>' +
    '<footer><p class="small">Kit exportado desde KORΛ. Sin seguimiento ni alojamiento incluido. La escucha externa depende de cada servicio. Derechos del artista y sus titulares.</p><p class="small">Procedencia: ' +
    escape(r.rightsEvidence) +
    '</p></footer></main></html>';
  download('KORΛ-' + r.slug + '-kit.html', html, 'text/html');
}
export function csv(rows: string[][]) {
  return rows
    .map((row) =>
      row
        .map(
          (cell) => '"' + (/^[=+@\-\t\r]/.test(cell) ? "'" : '') + cell.replaceAll('"', '""') + '"',
        )
        .join(','),
    )
    .join('\r\n');
}
