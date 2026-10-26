import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Release } from '../core/types';
import { readFile } from '../core/media';
export function Artwork({ release, className = '' }: { release: Release; className?: string }) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    let dead = false;
    let objectUrl = '';
    setUrl('');
    if (release.coverKey)
      readFile(release.coverKey)
        .then((blob) => {
          if (blob && !dead) {
            objectUrl = URL.createObjectURL(blob);
            setUrl(objectUrl);
          }
        })
        .catch(() => {});
    return () => {
      dead = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [release.coverKey]);
  return (
    <div
      role="img"
      aria-label={(release.coverKey ? 'Portada de ' : 'Composición KORΛ para ') + release.title}
      className={'artwork art-' + release.art + ' ' + className}
      style={{ '--art-color': release.color } as CSSProperties}
    >
      {url ? (
        <img src={url} alt={'Portada de ' + release.title} />
      ) : (
        <>
          <span className="art-small">KORΛ · {release.city}</span>
          <div className="art-shape" />
          <span className="art-title">{release.artist}</span>
        </>
      )}
    </div>
  );
}
