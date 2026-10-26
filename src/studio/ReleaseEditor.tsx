import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../core/useApp';
import type { Release } from '../core/types';
import { cities, safeUrl } from '../core/catalog';
import { releaseAllowance } from '../core/plans';
import { storeFile, deleteFiles } from '../core/media';
import { Artwork } from '../components/Artwork';
import { StudioGate } from './StudioGate';
import { Icon } from '../components/Icon';
export function ReleaseEditor() {
  const { connection, account } = useApp();
  if (connection === 'loading')
    return (
      <div className="page">
        <p role="status">Abriendo tu espacio…</p>
      </div>
    );
  return <ReleaseEditorForm key={account?.id || 'guest'} />;
}
function ReleaseEditorForm() {
  const { id } = useParams();
  const { account, store, shelf, update, notify } = useApp();
  const existing = store.releases.find((r) => r.id === id && r.ownerId === account?.id);
  const [title, setTitle] = useState(existing?.title || '');
  const [artist, setArtist] = useState(existing?.artist || account?.name || '');
  const [city, setCity] = useState(existing?.city || 'Cali');
  const [genre, setGenre] = useState(existing?.genre || '');
  const [story, setStory] = useState(existing?.story || '');
  const [playback, setPlayback] = useState<'link' | 'file' | 'bandcamp'>(
    existing?.playback || 'link',
  );
  const [url, setUrl] = useState(existing?.officialUrl || '');
  const [links, setLinks] = useState(
    existing?.links.filter((l) => l.url !== existing?.officialUrl) || [],
  );
  const [evidence, setEvidence] = useState(existing?.rightsEvidence || '');
  const [allowScout, setAllowScout] = useState(existing?.allowScout || false);
  const [color, setColor] = useState(existing?.color || '#F1871C');
  const [art, setArt] = useState(existing?.art || 0);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [audio, setAudio] = useState<File>();
  const [cover, setCover] = useState<File>();
  const [publish, setPublish] = useState(existing?.status === 'active');
  const navigate = useNavigate();
  if (id && !existing)
    return (
      <StudioGate>
        <div className="page empty-state">
          <h1>No encontramos tu lanzamiento.</h1>
          <Link to="/studio/lanzamientos">Volver a mis lanzamientos</Link>
        </div>
      </StudioGate>
    );
  const preview: Release = {
    id: 'preview',
    slug: 'preview',
    artistId: 'preview',
    artist: artist || 'Tu nombre artístico',
    title: title || 'Tu próximo lanzamiento',
    city,
    genre: genre || 'Tu sonido',
    story,
    kind: 'single',
    color,
    art,
    officialUrl: url,
    links: [],
    playback,
    status: 'draft',
    rights: 'artist-declaration',
    rightsEvidence: evidence,
    sourceUrl: url,
    verifiedAt: '',
    allowScout,
    createdAt: '',
    ...(existing?.coverKey ? { coverKey: existing.coverKey } : {}),
  };
  return (
    <StudioGate>
      <div className="page">
        <Link className="back-link" to="/studio/lanzamientos">
          ← Mis lanzamientos
        </Link>
        <p className="eyebrow">DEL SONIDO A LA HISTORIA</p>
        <h1>{existing ? 'Afina tu lanzamiento.' : 'Dale forma a lo que viene.'}</h1>
        <div className="editor-layout">
          <form
            className="release-editor"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!account) return;
              setBusy(true);
              setError('');
              const provisionalKeys: string[] = [];
              try {
                if (
                  !title.trim() ||
                  !artist.trim() ||
                  !genre.trim() ||
                  !story.trim() ||
                  !evidence.trim()
                )
                  throw Error('Completa los campos requeridos.');
                if (playback !== 'file' && !safeUrl(url))
                  throw Error('Usa un enlace oficial HTTPS válido.');
                if (url && !safeUrl(url))
                  throw Error('Revisa el enlace principal: debe usar HTTPS.');
                if (links.some((l) => !l.label.trim() || !safeUrl(l.url)))
                  throw Error('Cada enlace adicional necesita nombre y una URL HTTPS.');
                if (playback === 'file' && !audio && !existing?.audioKey)
                  throw Error('Selecciona el audio autorizado.');
                if (
                  audio &&
                  (audio.size > 5 * 1024 * 1024 ||
                    !(
                      audio.type.startsWith('audio/') ||
                      /\.(mp3|wav|ogg|m4a|flac)$/i.test(audio.name)
                    ))
                )
                  throw Error('Usa un archivo de audio de máximo 5 MB.');
                if (
                  cover &&
                  (cover.size > 2 * 1024 * 1024 ||
                    !['image/jpeg', 'image/png', 'image/webp'].includes(cover.type))
                )
                  throw Error('La portada debe ser JPG, PNG o WebP de máximo 2 MB.');
                if (
                  publish &&
                  account.plan === 'kit' &&
                  shelf.kitReleaseId &&
                  existing?.id !== shelf.kitReleaseId
                )
                  throw Error(
                    'Este Launch Kit ya tiene su lanzamiento. Edita esa página o solicita otro kit.',
                  );
                const allowance = releaseAllowance(account, store.releases);
                if (publish && existing?.status !== 'active' && !allowance.canActivate)
                  throw Error(
                    allowance.hasAccess
                      ? 'Ya alcanzaste el límite de ' +
                          allowance.limit +
                          ' lanzamientos activos. Archiva uno o guarda este como borrador.'
                      : 'La prueba terminó. Guarda un borrador o solicita la activación de un plan.',
                  );
                const releaseId = existing?.id || crypto.randomUUID();
                let audioKey =
                  playback === 'file'
                    ? audio
                      ? 'audio-' + releaseId
                      : existing?.audioKey
                    : undefined;
                let coverKey = cover ? 'cover-' + releaseId : existing?.coverKey;
                if (audio && audioKey) {
                  audioKey = await storeFile(audioKey, audio);
                  provisionalKeys.push(audioKey);
                }
                if (cover && coverKey) {
                  coverKey = await storeFile(coverKey, cover);
                  provisionalKeys.push(coverKey);
                }
                const now = new Date().toISOString();
                const next: Release = {
                  ...preview,
                  id: releaseId,
                  slug: existing?.slug || 'r-' + releaseId,
                  artistId: 'a-' + account.id,
                  artist: artist.trim(),
                  title: title.trim(),
                  genre: genre.trim(),
                  story: story.trim(),
                  officialUrl: safeUrl(url),
                  sourceUrl: safeUrl(url),
                  links: [
                    ...(safeUrl(url)
                      ? [
                          {
                            label: playback === 'bandcamp' ? 'Bandcamp' : 'Escuchar',
                            url: safeUrl(url),
                          },
                        ]
                      : []),
                    ...links.map((l) => ({ label: l.label.trim(), url: safeUrl(l.url) })),
                  ],
                  ownerId: account.id,
                  audioKey,
                  coverKey,
                  status: publish ? 'active' : 'draft',
                  rights: 'artist-declaration',
                  rightsEvidence: evidence.trim(),
                  verifiedAt: now,
                  createdAt: existing?.createdAt || now,
                  ...(playback === 'bandcamp' && existing
                    ? { embedId: existing.embedId, embedType: existing.embedType }
                    : {}),
                };
                const saved = await update((s) => ({
                  ...s,
                  releases: existing
                    ? s.releases.map((r) => (r.id === releaseId ? next : r))
                    : [...s.releases, next],
                }));
                if (!saved) throw Error('No se guardó el lanzamiento. Puedes reintentarlo.');
                provisionalKeys.length = 0;
                notify(
                  publish ? 'Lanzamiento compartido con la escena.' : 'Borrador privado guardado.',
                );
                navigate('/studio/lanzamientos');
              } catch (err) {
                if (provisionalKeys.length) await deleteFiles(provisionalKeys).catch(() => {});
                setError(
                  err instanceof Error
                    ? err.message
                    : 'No se pudo guardar. Revisa el espacio disponible.',
                );
              } finally {
                setBusy(false);
              }
            }}
          >
            <section className="panel">
              <span className="step-label">01 · EL LANZAMIENTO</span>
              <div className="field-pair">
                <label>
                  Título
                  <input
                    required
                    maxLength={120}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Cómo se llama esta historia"
                  />
                </label>
                <label>
                  Nombre artístico
                  <input
                    required
                    maxLength={100}
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                  />
                </label>
              </div>
              <div className="field-pair">
                <label>
                  Ciudad
                  <select value={city} onChange={(e) => setCity(e.target.value)}>
                    {cities.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Género o escena
                  <input
                    required
                    maxLength={60}
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="Rock, hip hop, fusión…"
                  />
                </label>
              </div>
              <label>
                La historia detrás
                <textarea
                  required
                  maxLength={1200}
                  rows={5}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="De dónde viene, qué la mueve, qué quieres que escuchen…"
                />
              </label>
              <small className="muted">{story.length}/1200</small>
            </section>
            <section className="panel">
              <span className="step-label">02 · DÓNDE SUENA</span>
              <label>
                Forma de escuchar
                <select
                  value={playback}
                  onChange={(e) => setPlayback(e.target.value as 'link' | 'file' | 'bandcamp')}
                >
                  <option value="link">Enlace oficial externo</option>
                  <option value="file">Archivo con autorización expresa</option>
                  {existing?.playback === 'bandcamp' && (
                    <option value="bandcamp">Reproductor oficial de Bandcamp</option>
                  )}
                </select>
              </label>
              {playback === 'file' && (
                <label className="upload-zone">
                  <Icon name="music" size={28} />
                  <strong>{audio?.name || 'Selecciona tu archivo de audio'}</strong>
                  <small>
                    MP3, WAV, OGG, M4A o FLAC · Máximo 5 MB · Se guarda para esta prueba compartida.
                  </small>
                  <input
                    type="file"
                    accept="audio/*,.mp3,.wav,.ogg,.m4a,.flac"
                    onChange={(e) => setAudio(e.target.files?.[0])}
                  />
                  {existing?.audioKey && (
                    <span className="micro">
                      Ya hay un archivo guardado. Selecciona uno nuevo solo si quieres reemplazarlo.
                    </span>
                  )}
                </label>
              )}
              <label>
                Enlace principal {playback === 'file' ? '(opcional)' : '*'}
                <input
                  type="url"
                  required={playback !== 'file'}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://…"
                />
              </label>
              <p className="micro">
                Usa páginas oficiales de escucha. No enlaces directos a audio de terceros.
              </p>
              {links.map((l, index) => (
                <div className="link-editor-row" key={index}>
                  <input
                    aria-label={'Nombre enlace ' + (index + 1)}
                    value={l.label}
                    placeholder="Spotify, YouTube, web…"
                    maxLength={40}
                    onChange={(e) =>
                      setLinks((prev) =>
                        prev.map((item, i) =>
                          i === index ? { ...item, label: e.target.value } : item,
                        ),
                      )
                    }
                  />
                  <input
                    aria-label={'URL enlace ' + (index + 1)}
                    type="url"
                    value={l.url}
                    placeholder="https://…"
                    onChange={(e) =>
                      setLinks((prev) =>
                        prev.map((item, i) =>
                          i === index ? { ...item, url: e.target.value } : item,
                        ),
                      )
                    }
                  />
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={'Quitar enlace ' + (index + 1)}
                    onClick={() => setLinks((prev) => prev.filter((_, i) => i !== index))}
                  >
                    <Icon name="close" size={17} />
                  </button>
                </div>
              ))}
              {links.length < 5 && (
                <button
                  type="button"
                  className="text-link"
                  onClick={() => setLinks((prev) => [...prev, { label: '', url: '' }])}
                >
                  <Icon name="plus" size={16} />
                  Añadir enlace oficial
                </button>
              )}
            </section>
            <section className="panel">
              <span className="step-label">03 · SU IDENTIDAD VISUAL</span>
              <label>
                Portada propia o autorizada
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => setCover(e.target.files?.[0])}
                />
                <small>JPG, PNG o WebP · Máximo 2 MB. {cover?.name}</small>
              </label>
              <p className="micro">
                Sin portada, usaremos una composición editorial KORΛ, identificada como tal.
              </p>
              <div className="field-pair">
                <label>
                  Color editorial
                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
                </label>
                <label>
                  Composición
                  <select value={art} onChange={(e) => setArt(Number(e.target.value))}>
                    {['Órbita', 'Pulso', 'Cruce', 'Frecuencia', 'Eco', 'Encuentro'].map(
                      (label, i) => (
                        <option value={i} key={label}>
                          {label}
                        </option>
                      ),
                    )}
                  </select>
                </label>
              </div>
            </section>
            <section className="panel">
              <span className="step-label">04 · PERMISOS Y VISIBILIDAD</span>
              <label>
                Registro de procedencia y autorización
                <textarea
                  required
                  maxLength={1000}
                  rows={3}
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                  placeholder="Titular, fuente, fecha y alcance de la autorización. Conserva el soporte fuera de esta aplicación."
                />
              </label>
              <label className="checkbox-label">
                <input type="checkbox" required />
                <span>
                  Declaro tener permisos suficientes para este audio, textos y portada, y acepto la{' '}
                  <Link to="/legal/licencia-musical" target="_blank">
                    licencia no exclusiva
                  </Link>{' '}
                  necesaria para almacenarlo y mostrarlo públicamente en esta prueba compartida
                  mientras el lanzamiento esté activo.
                </span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={allowScout}
                  onChange={(e) => setAllowScout(e.target.checked)}
                />
                <span>
                  Autorizo que cuentas Scout vean métricas agregadas de este lanzamiento. No incluye
                  mis datos de contacto.
                </span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={publish}
                  onChange={(e) => setPublish(e.target.checked)}
                />
                <span>
                  Compartir públicamente en el catálogo de KORΛ. Desmarcado, se guarda como borrador
                  privado.
                </span>
              </label>
            </section>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <div className="action-row editor-submit">
              <button type="submit" className="button" disabled={busy}>
                {busy ? 'Guardando…' : publish ? 'Compartir lanzamiento' : 'Guardar borrador'}
                <Icon name="arrow" size={17} />
              </button>
              <Link className="text-link" to="/studio/lanzamientos">
                Cancelar
              </Link>
            </div>
          </form>
          <aside className="editor-preview">
            <p className="eyebrow">ASÍ VA TOMANDO FORMA</p>
            <Artwork release={preview} />
            <h2>{title || 'Tu próximo lanzamiento'}</h2>
            <p>{artist || 'Tu nombre artístico'}</p>
            <p className="micro">
              La portada nueva aparece al guardar. Un borrador es privado; al activar el
              lanzamiento, su página y los archivos autorizados podrán consultarse públicamente.
            </p>
            <div className="editor-tip">
              <Icon name="shield" />
              <p>
                Tu historia importa tanto como tu sonido. Comparte solo material que puedas
                autorizar.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </StudioGate>
  );
}
