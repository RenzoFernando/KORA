import type { Release } from './types';
import { safeUrl } from './catalog';
export const catalogEndpoint = (import.meta.env.VITE_CATALOG_URL || '').trim();
const configuredForm = safeUrl((import.meta.env.VITE_OPERATIONS_FORM_URL || '').trim());
export const operationsForm =
  configuredForm &&
  (new URL(configuredForm).hostname === 'forms.gle' ||
    (new URL(configuredForm).hostname === 'docs.google.com' &&
      new URL(configuredForm).pathname.startsWith('/forms/')))
    ? configuredForm
    : '';
// Explicit deployment configuration only. No account information is sent to the public catalog.
export async function loadRemoteCatalog(signal: AbortSignal): Promise<Release[]> {
  if (!catalogEndpoint) return [];
  const endpoint = new URL(catalogEndpoint);
  if (
    endpoint.protocol !== 'https:' ||
    !['script.google.com', 'script.googleusercontent.com'].includes(endpoint.hostname)
  )
    throw Error('El catálogo debe usar el endpoint HTTPS de Apps Script configurado.');
  const response = await fetch(endpoint.href, { signal, credentials: 'omit', redirect: 'follow' });
  if (!response.ok) throw Error('El catálogo conectado no respondió.');
  const rows = await response.json();
  if (!Array.isArray(rows)) throw Error('El catálogo debe devolver una lista JSON.');
  return rows.slice(0, 500).map((row, index) => {
    if (!row || typeof row !== 'object') throw Error('Fila de catálogo inválida.');
    const required = [
      'id',
      'artistId',
      'artist',
      'title',
      'city',
      'genre',
      'story',
      'officialUrl',
      'sourceUrl',
      'verifiedAt',
      'rightsEvidence',
    ];
    for (const key of required)
      if (typeof row[key] !== 'string' || !row[key].trim())
        throw Error('Falta ' + key + ' en fila ' + (index + 1));
    if (!safeUrl(row.officialUrl) || !safeUrl(row.sourceUrl))
      throw Error('Los enlaces deben ser HTTPS.');
    if (!['track', 'album'].includes(row.embedType) || !/^\d+$/.test(String(row.embedId)))
      throw Error('Reproductor Bandcamp inválido.');
    return {
      id: 'sheet-' + row.id,
      slug: 'sheet-' + row.id,
      artistId: 'sheet-' + row.artistId,
      artist: row.artist.slice(0, 120),
      title: row.title.slice(0, 160),
      city: row.city.slice(0, 70),
      genre: row.genre.slice(0, 70),
      story: row.story.slice(0, 1200),
      officialUrl: safeUrl(row.officialUrl),
      sourceUrl: safeUrl(row.sourceUrl),
      verifiedAt: row.verifiedAt,
      rightsEvidence: row.rightsEvidence.slice(0, 1200),
      embedType: row.embedType,
      embedId: String(row.embedId),
      playback: 'bandcamp',
      rights: 'official-embed',
      status: 'active',
      allowScout: false,
      kind: row.embedType === 'album' ? 'album' : 'single',
      color: '#94b7b5',
      art: index % 6,
      createdAt: row.verifiedAt,
      links: [{ label: 'Bandcamp', url: safeUrl(row.officialUrl) }],
    };
  });
}
