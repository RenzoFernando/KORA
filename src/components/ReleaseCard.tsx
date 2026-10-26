import { Link } from 'react-router-dom';
import type { Release } from '../core/types';
import { useApp } from '../core/useApp';
import { usePlayer } from '../player/usePlayer';
import { Artwork } from './Artwork';
import { Icon } from './Icon';
export function ReleaseCard({ release }: { release: Release }) {
  const { shelf, save } = useApp();
  const player = usePlayer();
  return (
    <article className="release-card">
      <div className="card-art">
        <Link
          to={'/lanzamiento/' + release.slug}
          aria-label={'Conocer ' + release.title + ' de ' + release.artist}
        >
          <Artwork release={release} />
        </Link>
        <button
          className="card-play"
          onClick={() => player.select(release)}
          aria-label={
            (player.current?.id === release.id && player.playing ? 'Pausar ' : 'Escuchar ') +
            release.title
          }
        >
          <Icon name={player.current?.id === release.id && player.playing ? 'pause' : 'play'} />
        </button>
      </div>
      <div className="card-info">
        <div>
          <Link to={'/lanzamiento/' + release.slug}>
            <h3>{release.title}</h3>
          </Link>
          <Link className="muted" to={'/artista/' + release.artistId}>
            {release.artist}
          </Link>
        </div>
        <button
          className={'icon-button ' + (shelf.saved.includes(release.id) ? 'selected' : '')}
          onClick={() => save(release.id)}
          aria-label={(shelf.saved.includes(release.id) ? 'Quitar ' : 'Guardar ') + release.title}
          aria-pressed={shelf.saved.includes(release.id)}
        >
          <Icon name={shelf.saved.includes(release.id) ? 'check' : 'plus'} />
        </button>
      </div>
      <p className="card-genre">
        {release.city} <span>·</span> {release.genre}
        {release.playback === 'file' && <span> · Cápsula 30 s</span>}
      </p>
    </article>
  );
}
