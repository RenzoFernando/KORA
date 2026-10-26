import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../core/useApp';
import { StudioGate } from './StudioGate';
import { ReleaseCard } from '../components/ReleaseCard';
import { safeUrl } from '../core/catalog';
import type { LinkItem } from '../core/types';
export function BioPage() {
  const { connection, account } = useApp();
  if (connection === 'loading')
    return (
      <div className="page">
        <p role="status">Abriendo tu espacio…</p>
      </div>
    );
  return <BioPageForm key={account?.id || 'guest'} />;
}
function BioPageForm() {
  const { account, store, shelf, setShelf, notify, publicProfilesEnabled } = useApp();
  const [bio, setBio] = useState(shelf.publicProfile?.bio || '');
  const [links, setLinks] = useState<LinkItem[]>(shelf.publicProfile?.links || []);
  const [published, setPublished] = useState(shelf.publicProfile?.published || false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const releases = store.releases.filter((r) => r.ownerId === account?.id && r.status === 'active');
  return (
    <StudioGate>
      <div className="page">
        <p className="eyebrow">TU HISTORIA TIENE SU PROPIO ENLACE</p>
        <h1>Tu nombre. Tu sonido. Tu lugar.</h1>
        <p className="lead">Una presentación para quien acaba de descubrirte.</p>
        {!publicProfilesEnabled && (
          <p className="notice">
            La publicación de biografías necesita actualizar el backend de esta instalación. Tus
            lanzamientos y enlaces compartidos siguen disponibles.
          </p>
        )}
        <div className="bio-layout">
          <form
            className="panel"
            onSubmit={async (e) => {
              e.preventDefault();
              setError('');
              if (!publicProfilesEnabled) return;
              if (links.some((l) => !l.label.trim() || !safeUrl(l.url))) {
                setError('Cada enlace necesita un nombre y una URL HTTPS.');
                return;
              }
              setBusy(true);
              try {
                const saved = await setShelf((s) => ({
                  ...s,
                  publicProfile: {
                    bio: bio.trim(),
                    links: links.map((l) => ({ label: l.label.trim(), url: safeUrl(l.url) })),
                    published,
                  },
                }));
                if (saved)
                  notify(published ? 'Bio pública actualizada.' : 'Bio guardada como privada.');
              } finally {
                setBusy(false);
              }
            }}
          >
            <label>
              Biografía pública
              <textarea
                rows={6}
                maxLength={700}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="De dónde viene tu música. Qué te mueve. Qué quieres compartir."
              />
            </label>
            <h2>Tus enlaces</h2>
            {links.map((link, i) => (
              <div className="field-pair" key={i}>
                <label>
                  Nombre
                  <input
                    value={link.label}
                    maxLength={40}
                    onChange={(e) =>
                      setLinks(links.map((l, n) => (n === i ? { ...l, label: e.target.value } : l)))
                    }
                  />
                </label>
                <label>
                  URL HTTPS
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) =>
                      setLinks(links.map((l, n) => (n === i ? { ...l, url: e.target.value } : l)))
                    }
                  />
                </label>
                <button
                  type="button"
                  className="text-link"
                  onClick={() => setLinks(links.filter((_, n) => n !== i))}
                >
                  Quitar enlace {i + 1}
                </button>
              </div>
            ))}
            {links.length < 6 && (
              <button
                className="button secondary small"
                type="button"
                onClick={() => setLinks([...links, { label: '', url: '' }])}
              >
                Añadir enlace
              </button>
            )}
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />
              <span>
                Publicar esta biografía y sus enlaces en mi página de artista. Mi correo y mis notas
                de cuenta siguen privados.
              </span>
            </label>
            {error && (
              <p role="alert" className="error">
                {error}
              </p>
            )}
            <button className="button" disabled={busy || !publicProfilesEnabled}>
              {busy ? 'Guardando…' : 'Guardar mi página'}
            </button>
            {releases.length > 0 && (
              <Link className="text-link" to={'/artista/a-' + account?.id}>
                Abrir mi página pública ↗
              </Link>
            )}
          </form>
          <div className="panel bio-preview">
            <div className="bio-monogram">{account?.name[0]}</div>
            <span className="eyebrow">KORΛ · ARTISTA</span>
            <h2>{account?.name}</h2>
            <p>{bio || 'Tu historia empieza aquí.'}</p>
            {links.map((l, i) => (
              <span className="tag" key={i}>
                {l.label || 'Tu enlace'}
              </span>
            ))}
            <p>
              {published
                ? 'Se comparte al guardar con al menos un lanzamiento activo.'
                : 'Vista previa privada.'}
            </p>
          </div>
        </div>
        <h2>En tu página</h2>
        {releases.length ? (
          <div className="release-grid">
            {releases.map((r) => (
              <ReleaseCard key={r.id} release={r} />
            ))}
          </div>
        ) : (
          <p className="empty-state">Activa tu primer lanzamiento para abrir tu página pública.</p>
        )}
      </div>
    </StudioGate>
  );
}
