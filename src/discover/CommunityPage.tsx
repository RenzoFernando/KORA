import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../core/useApp';
import { Artwork } from '../components/Artwork';
import { Icon } from '../components/Icon';
export function CommunityPage() {
  const { communityPosts, account, catalog, shelf, setShelf, refresh } = useApp();
  const [releaseId, setReleaseId] = useState('');
  const [text, setText] = useState('');
  const canCurate = account?.plan === 'curator' && account.entitlementSource === 'sheet';
  const posts = [...communityPosts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <div className="page narrow-page">
      <p className="eyebrow">DE UN OÍDO A OTRO</p>
      <h1>
        La música también
        <br />
        se encuentra en alguien.
      </h1>
      <p className="lead">Recomendar es contar por qué una canción merece una escucha.</p>
      <p className="notice">
        Una escena construida por sus oyentes. Las recomendaciones publicadas se comparten con la
        comunidad.
      </p>
      {canCurate ? (
        <form
          className="panel recommendation-form"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!releaseId || !text.trim()) return;
            const saved = await setShelf((s) => ({
              ...s,
              recommendations: [
                {
                  id: crypto.randomUUID(),
                  releaseId,
                  text: text.trim(),
                  createdAt: new Date().toISOString(),
                },
                ...s.recommendations,
              ],
            }));
            if (!saved) return;
            await refresh();
            setText('');
            setReleaseId('');
          }}
        >
          <h2>Tu recomendación</h2>
          <label>
            Elige un lanzamiento
            <select required value={releaseId} onChange={(e) => setReleaseId(e.target.value)}>
              <option value="">Seleccionar música</option>
              {catalog.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} · {r.artist}
                </option>
              ))}
            </select>
          </label>
          <label>
            ¿Por qué vale la pena escucharlo?
            <textarea
              required
              maxLength={700}
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Un detalle, una sensación, una historia…"
            />
          </label>
          <button className="button" type="submit">
            Compartir recomendación <Icon name="arrow" size={16} />
          </button>
        </form>
      ) : (
        <div className="panel community-prompt">
          <Icon name="list" size={32} />
          <div>
            <h2>Tu criterio tiene un lugar.</h2>
            <p>
              Curador Pro te permite publicar recomendaciones con tu nombre y dar contexto a tus
              hallazgos.
            </p>
          </div>
          <Link className="button secondary" to={account ? '/planes' : '/acceso?modo=registro'}>
            {account ? 'Ver Curador Pro' : 'Crear cuenta'}
          </Link>
        </div>
      )}
      <div className="community-posts">
        {!posts.length && (
          <div className="empty-state">
            <h2>Todavía no hay recomendaciones.</h2>
            <p>Sin voces inventadas. El primer hallazgo puede ser el tuyo.</p>
          </div>
        )}
        {posts.map((post) => {
          const r = catalog.find((item) => item.id === post.releaseId);
          return r ? (
            <article className="panel community-post" key={post.id}>
              <div className="post-author">
                <span className="avatar">{post.author[0]}</span>
                <span>
                  <strong>{post.author}</strong>
                  {post.isTest && <span className="tag">Prueba</span>}
                  <small>
                    Recomendación · {new Date(post.createdAt).toLocaleDateString('es-CO')}
                  </small>
                </span>
                {shelf.recommendations.some((p) => p.id === post.id) && (
                  <button
                    className="text-link danger"
                    onClick={async () => {
                      await setShelf((s) => ({
                        ...s,
                        recommendations: s.recommendations.filter((p) => p.id !== post.id),
                      }));
                      await refresh();
                    }}
                  >
                    Retirar
                  </button>
                )}
              </div>
              <p>{post.text}</p>
              <Link className="post-release" to={'/lanzamiento/' + r.slug}>
                <Artwork release={r} />
                <span>
                  <strong>{r.title}</strong>
                  <small>{r.artist}</small>
                </span>
                <Icon name="arrow" />
              </Link>
            </article>
          ) : null;
        })}
      </div>
    </div>
  );
}
