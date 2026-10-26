import type { Release } from '../core/types';
export function Attribution({ release: r }: { release: Release }) {
  if (r.rights !== 'open-license') return null;
  const licence = r.links.find((l) => l.url.startsWith('https://creativecommons.org/licenses/'));
  return (
    <p className="audio-attribution">
      {r.rightsEvidence}{' '}
      {licence && (
        <a href={licence.url} target="_blank" rel="noopener noreferrer">
          {licence.label} ↗
        </a>
      )}
    </p>
  );
}
