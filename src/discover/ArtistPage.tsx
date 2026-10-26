import { Link, useParams } from 'react-router-dom';
import { useApp } from '../core/useApp';
import { Artwork } from '../components/Artwork';
import { ReleaseCard } from '../components/ReleaseCard';
import { Icon } from '../components/Icon';
import { safeUrl } from '../core/catalog';
export function ArtistPage() {
  const { artistId } = useParams();
  const { catalog } = useApp();
  const releases = catalog.filter((r) => r.artistId === artistId);
  const artist = releases[0];
  if (!artist)
    return (
      <div className="page empty-state">
        <h1>Artista no disponible</h1>
        <Link to="/discover">Volver a Discover</Link>
      </div>
    );
  return (
    <div className="page">
      <Link className="back-link" to="/discover">
        ← Volver a Discover
      </Link>
      <section className="artist-header">
        <div className="artist-art">
          <Artwork release={artist} />
        </div>
        <div>
          <p className="eyebrow">DESDE {artist.city.toUpperCase()}, COLOMBIA</p>
          <h1>{artist.artist}</h1>
          <p>{artist.artistBio || artist.story}</p>
          <div className="action-row">
            <span className="tag">{artist.genre}</span>
            {artist.artistLinks?.map((l) => (
              <a
                className="button secondary small"
                key={l.url}
                href={safeUrl(l.url)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {l.label} ↗
              </a>
            ))}
            {safeUrl(artist.officialUrl) && (
              <a
                className="text-link"
                href={safeUrl(artist.officialUrl)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Página oficial <Icon name="external" size={16} />
              </a>
            )}
          </div>
        </div>
      </section>
      <div className="section-heading">
        <h2>Lanzamientos</h2>
        <span className="muted">{releases.length} en KORΛ</span>
      </div>
      <div className="release-grid">
        {releases.map((r) => (
          <ReleaseCard key={r.id} release={r} />
        ))}
      </div>
      <p className="micro">
        {artist.ownerId
          ? 'Página de la cuenta que aportó estos lanzamientos.'
          : 'Ficha editorial basada en fuentes oficiales. Este artista no tiene una cuenta ni suscripción atribuida por KORΛ.'}
      </p>
    </div>
  );
}
