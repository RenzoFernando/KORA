import { Attribution } from '../components/Attribution';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApp } from '../core/useApp';
import { usePlayer } from '../player/usePlayer';
import { Artwork } from '../components/Artwork';
import { Icon } from '../components/Icon';
import { ReleaseCard } from '../components/ReleaseCard';
import { safeUrl } from '../core/catalog';
export function ReleasePage() {
  const { slug } = useParams();
  const { catalog, shelf, save, metric, notify, store, account } = useApp();
  const player = usePlayer();
  const [qr, setQr] = useState('');
  const seen = useRef('');
  const release =
    catalog.find((r) => r.slug === slug) ||
    store.releases.find((r) => r.slug === slug && r.ownerId === account?.id);
  useEffect(() => {
    if (release && release.id !== seen.current) {
      seen.current = release.id;
      metric(release.id, 'page_view');
    }
  }, [release, metric]);
  useEffect(() => {
    let cancelled = false;
    import('qrcode')
      .then(({ default: QRCode }) =>
        QRCode.toDataURL(location.href, {
          width: 220,
          margin: 2,
          color: { dark: '#171414', light: '#ffffff' },
        }),
      )
      .then((data) => {
        if (!cancelled) setQr(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug]);
  if (!release)
    return (
      <div className="page empty-state">
        <h1>Este lanzamiento no está disponible.</h1>
        <p>Puede estar archivado o haber sido retirado del catálogo.</p>
        <Link className="button" to="/discover">
          Volver a Discover
        </Link>
      </div>
    );
  const r = release;
  async function share() {
    try {
      await navigator.clipboard.writeText(location.href);
      notify('Enlace del lanzamiento copiado.');
    } catch {
      notify('Copia la dirección desde la barra del navegador.');
    }
  }
  return (
    <div className="page release-page">
      <Link className="back-link" to="/discover">
        ← Volver a la escena
      </Link>
      {r.status !== 'active' && (
        <p className="notice">
          Vista previa privada · {r.status === 'draft' ? 'Borrador' : 'Archivado'}
        </p>
      )}
      <section className="release-detail">
        <Artwork release={r} />
        <div className="release-detail-copy">
          <p className="eyebrow">
            {r.city}, Colombia · {r.kind === 'album' ? 'Álbum' : 'Sencillo'}
          </p>
          <h1>{r.title}</h1>
          <Link className="artist-link" to={'/artista/' + r.artistId}>
            {r.artist}
            <Icon name="arrow" />
          </Link>
          <p className="release-story">{r.story}</p>
          <span className="tag">{r.genre}</span>
          <Attribution release={r} />
          <div className="action-row">
            <button className="button" onClick={() => player.select(r)}>
              <Icon name="play" />
              Escuchar {r.playback === 'file' ? 'lanzamiento' : 'en reproductor oficial'}
            </button>
            <button className="button secondary" onClick={() => save(r.id)}>
              <Icon name={shelf.saved.includes(r.id) ? 'check' : 'plus'} />
              {shelf.saved.includes(r.id) ? 'Guardado' : 'Guardar'}
            </button>
          </div>
          <button className="text-link" onClick={() => void share()}>
            <Icon name="share" size={16} />
            Compartir lanzamiento
          </button>
        </div>
      </section>
      <div className="release-bottom">
        <section className="panel">
          <p className="eyebrow">DALE PLAY A TU MANERA</p>
          <h2>Enlaces oficiales</h2>
          <div className="official-links">
            {!r.links.length && (
              <p className="micro">
                Este lanzamiento usa audio autorizado. Puedes escucharlo en el reproductor KORΛ.
              </p>
            )}
            {r.links
              .filter((link) => safeUrl(link.url))
              .map((link) => (
                <a
                  key={link.url}
                  href={safeUrl(link.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => metric(r.id, 'outbound_click', link.label)}
                >
                  <span>
                    <Icon name="music" />
                    {link.label}
                  </span>
                  <Icon name="external" size={17} />
                </a>
              ))}
          </div>
          <p className="micro">
            Cada servicio define su disponibilidad y sus condiciones de escucha.
          </p>
        </section>
        <section className="panel qr-panel">
          <div>
            <p className="eyebrow">DEL ENLACE AL ENCUENTRO</p>
            <h2>Llévalo contigo.</h2>
            <p>
              {r.status === 'active'
                ? 'Este QR abre tu lanzamiento desde esta dirección. Usa el enlace público de KORΛ para compartirlo.'
                : 'Este borrador es privado. Su QR requiere tu sesión; activa el lanzamiento antes de compartirlo.'}
            </p>
            {qr && (
              <a className="text-link" href={qr} download={'KORΛ-' + r.slug + '-QR.png'}>
                <Icon name="download" size={16} />
                Descargar QR
              </a>
            )}
          </div>
          {qr && <img src={qr} width="132" height="132" alt={'QR de ' + r.title} />}
        </section>
      </div>
      <details className="source-details">
        <summary>
          <Icon name="shield" size={16} />
          Procedencia y derechos de este lanzamiento
        </summary>
        <p>{r.rightsEvidence}</p>
        <p>
          {r.rights === 'official-embed'
            ? 'Fuente oficial verificada el '
            : 'Declaración registrada el '}
          {r.verifiedAt.slice(0, 10)}.{' '}
          {r.rights === 'official-embed'
            ? 'La inclusión es editorial; no implica afiliación ni autorización para descargar audio.'
            : 'La declaración del autor no equivale a una verificación independiente.'}
        </p>
        {safeUrl(r.sourceUrl) && (
          <a href={safeUrl(r.sourceUrl)} target="_blank" rel="noopener noreferrer">
            Consultar fuente oficial ↗
          </a>
        )}
        <p>
          <Link to="/legal/licencia-musical">Derechos musicales y retiro de contenido</Link>
        </p>
      </details>
      <div className="section-heading">
        <h2>La escena sigue sonando.</h2>
        <Link className="text-link" to="/discover">
          Seguir explorando <Icon name="arrow" size={16} />
        </Link>
      </div>
      <div className="release-grid compact-grid">
        {catalog
          .filter((item) => item.id !== r.id && item.city === r.city)
          .slice(0, 3)
          .map((item) => (
            <ReleaseCard key={item.id} release={item} />
          ))}
      </div>
    </div>
  );
}
