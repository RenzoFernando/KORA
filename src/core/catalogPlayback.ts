import type { Release } from './types';
import { licensedCatalog } from './licensedCatalog.ts';
// The server remains authoritative for visibility. Only an approved, present ID is enriched.
export function playableCatalog(catalog: Release[]) {
  return catalog
    .map((r) => {
      const known = licensedCatalog.find(
        (item) => item.id === r.id && item.sourceUrl === r.sourceUrl,
      );
      return known ? { ...r, playback: known.playback, audioKey: known.audioKey } : r;
    })
    .sort((a, b) => Number(b.playback === 'file') - Number(a.playback === 'file'));
}
