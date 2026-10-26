import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { usePlayer, formatTime } from './usePlayer';
import { useApp } from '../core/useApp';
import { Artwork } from '../components/Artwork';
import { Icon } from '../components/Icon';
import { safeUrl } from '../core/catalog';
export function PlayerDock() {
  const p = usePlayer();
  const { shelf, save, metric, notify } = useApp();
  const panel = useRef<HTMLElement>(null);
  const r = p.current;
  useEffect(() => {
    if (!p.expanded || !r) return;
    const previous = document.activeElement as HTMLElement;
    const containers = [
      document.querySelector<HTMLElement>('.main-column'),
      document.querySelector<HTMLElement>('.sidebar'),
    ];
    containers.forEach((c) => {
      if (c) c.inert = true;
    });
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        p.setExpanded(false);
      }
      if (e.key === 'Tab') {
        const items = [
          ...(panel.current?.querySelectorAll<HTMLElement>('button,a[href],input,iframe') || []),
        ].filter((el) => el.offsetParent !== null && !el.hasAttribute('disabled'));
        const first = items[0],
          last = items[items.length - 1];
        if (!items.includes(document.activeElement as HTMLElement)) {
          e.preventDefault();
          (e.shiftKey ? last : first)?.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', key);
    return () => {
      containers.forEach((c) => {
        if (c) c.inert = false;
      });
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', key);
      previous?.focus();
    };
  }, [p.expanded, r?.id]);
  if (!r) return null;
  async function share() {
    try {
      await navigator.clipboard.writeText(location.origin + '/lanzamiento/' + r!.slug);
      notify('Enlace del lanzamiento copiado.');
    } catch {
      notify('Copia el enlace desde la página del lanzamiento.');
    }
  }
  return (
    <>
      {p.expanded && (
        <button
          className="player-backdrop"
          tabIndex={-1}
          aria-label="Contraer reproductor"
          onClick={() => p.setExpanded(false)}
        />
      )}
      <section
        ref={panel}
        tabIndex={-1}
        className={
          'player-dock shared-player provider-' +
          r.playback +
          ' ' +
          (p.expanded ? 'expanded' : 'compact')
        }
        role={p.expanded ? 'dialog' : 'region'}
        aria-modal={p.expanded ? true : undefined}
        aria-label="Reproductor KORΛ"
      >
        <button className="dock-track" onClick={() => p.setExpanded(!p.expanded)}>
          <Artwork release={r} />
          <span>
            <strong>{r.title}</strong>
            <small>
              {r.artist} · {r.city}
            </small>
          </span>
        </button>
        <div className="dock-controls">
          {r.playback === 'file' ? (
            <>
              <span className="capsule-label">Cápsula · hasta 30 segundos</span>
              <div className="transport">
                <button className="icon-button" aria-label="Anterior" onClick={() => p.step(-1)}>
                  <Icon name="previous" />
                </button>
                <button
                  className="play-button"
                  disabled={p.loading || !p.duration}
                  onClick={() => void p.toggle()}
                  aria-label={p.loading ? 'Cargando audio' : p.playing ? 'Pausar' : 'Reproducir'}
                >
                  <Icon name={p.playing ? 'pause' : 'play'} />
                </button>
                <button className="icon-button" aria-label="Siguiente" onClick={() => p.step(1)}>
                  <Icon name="next" />
                </button>
              </div>
              <div className="native-extras">
                <button
                  className="seek-step"
                  aria-label="Retroceder 15 segundos"
                  disabled={!p.duration}
                  onClick={() => p.seek(p.elapsed - 15)}
                >
                  <Icon name="back15" size={18} />
                  <span>15</span>
                </button>
                <label className="volume compact-volume">
                  <span>Volumen</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={p.volume}
                    onChange={(e) => p.setVolume(Number(e.target.value))}
                  />
                </label>
                <button
                  className="seek-step"
                  aria-label="Adelantar 15 segundos"
                  disabled={!p.duration}
                  onClick={() => p.seek(p.elapsed + 15)}
                >
                  <Icon name="forward15" size={18} />
                  <span>15</span>
                </button>
              </div>
              <div className="seek">
                <time>{formatTime(p.elapsed)}</time>
                <input
                  type="range"
                  min="0"
                  max={p.duration || 0}
                  value={Math.min(p.elapsed, p.duration || 0)}
                  step="0.1"
                  disabled={!p.duration}
                  onChange={(e) => p.seek(Number(e.target.value))}
                  aria-label="Posición de reproducción"
                />
                <time>{formatTime(p.duration)}</time>
              </div>
            </>
          ) : r.playback === 'bandcamp' ? (
            <iframe
              key={r.id}
              className="dock-official-frame"
              src={p.iframeSrc}
              title={'Reproductor oficial · ' + r.title + ' · ' + r.artist}
              allow="autoplay; encrypted-media"
            />
          ) : (
            <a
              className="button small"
              href={safeUrl(r.officialUrl)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => metric(r.id, 'outbound_click', 'Oficial')}
            >
              Escuchar en la fuente oficial ↗
            </a>
          )}
        </div>
        <div className="dock-actions">
          <button
            className="icon-button"
            aria-label="Guardar lanzamiento"
            aria-pressed={shelf.saved.includes(r.id)}
            onClick={() => save(r.id)}
          >
            <Icon name={shelf.saved.includes(r.id) ? 'check' : 'bookmark'} />
          </button>
          <button
            className="icon-button"
            aria-label={p.expanded ? 'Volver a navegar, mantener música' : 'Ampliar reproductor'}
            onClick={() => p.setExpanded(!p.expanded)}
          >
            <Icon name={p.expanded ? 'close' : 'expand'} />
          </button>
          <details className="player-options">
            <summary aria-label="Opciones del reproductor">
              <Icon name="more" />
            </summary>
            <button type="button" onClick={p.close}>
              Detener y quitar de la barra
            </button>
          </details>
        </div>
        <div className="expanded-story" hidden={!p.expanded}>
          <Artwork release={r} />
          <div>
            <p className="eyebrow">
              {r.city} · {r.genre}
            </p>
            <h2>{r.title}</h2>
            <Link
              className="artist-link"
              to={'/artista/' + r.artistId}
              onClick={() => p.setExpanded(false)}
            >
              {r.artist} ↗
            </Link>
            <p>{r.story}</p>
            <div className="action-row">
              <button className="button secondary small" onClick={() => void share()}>
                <Icon name="share" size={16} />
                Compartir
              </button>
              <Link
                className="text-link"
                to={'/lanzamiento/' + r.slug}
                onClick={() => p.setExpanded(false)}
              >
                Historia, enlaces y QR ↗
              </Link>
            </div>
            {r.playback === 'file' && (
              <label className="volume">
                Volumen
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={p.volume}
                  onChange={(e) => p.setVolume(Number(e.target.value))}
                />
              </label>
            )}
            <Link
              className="text-link player-legal"
              to="/legal/privacidad"
              onClick={() => p.setExpanded(false)}
            >
              Sobre esta escucha y tu privacidad ↗
            </Link>
            {safeUrl(r.officialUrl) && (
              <a
                className="text-link"
                href={safeUrl(r.officialUrl)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => metric(r.id, 'outbound_click', 'Oficial')}
              >
                Abrir página oficial ↗
              </a>
            )}
          </div>
        </div>
        {p.error && (
          <p role="alert" className="error player-error">
            {p.error}
          </p>
        )}
      </section>
    </>
  );
}
