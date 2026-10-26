import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../core/useApp';
import { Artwork } from '../components/Artwork';
import { Icon } from '../components/Icon';
import { usePlayer } from '../player/usePlayer';
export function LibraryPage() {
  const { account, catalog, shelf, setShelf, save, notify } = useApp();
  const player = usePlayer();
  const [collection, setCollection] = useState('all');
  const [name, setName] = useState('');
  const [noteId, setNoteId] = useState('');
  const [note, setNote] = useState('');
  if (!account)
    return (
      <div className="page empty-state">
        <Icon name="bookmark" size={40} />
        <h1>
          Lo que te mueve,
          <br />
          merece volver.
        </h1>
        <p>Crea tu cuenta para guardar música, escribir notas y armar colecciones en tu cuenta.</p>
        <Link className="button" to="/acceso?modo=registro">
          Crear cuenta
        </Link>
      </div>
    );
  const currentCollection = shelf.collections.find((c) => c.id === collection);
  const ids = currentCollection?.releaseIds || shelf.saved;
  const releases = ids.map((id) => catalog.find((r) => r.id === id)).filter((r) => !!r);
  return (
    <div className="page">
      <p className="eyebrow">TU MEMORIA MUSICAL</p>
      <div className="intro-line">
        <h1>Vuelve a lo que conectó.</h1>
        <span className="muted">{shelf.saved.length} guardados</span>
      </div>
      <div className="library-layout">
        <aside className="panel library-sidebar">
          <button
            className={collection === 'all' ? 'collection-active' : ''}
            onClick={() => setCollection('all')}
          >
            <Icon name="bookmark" />
            Todos los guardados<span>{shelf.saved.length}</span>
          </button>
          {shelf.collections.map((c) => (
            <button
              key={c.id}
              className={collection === c.id ? 'collection-active' : ''}
              onClick={() => setCollection(c.id)}
            >
              <Icon name="list" />
              {c.name}
              <span>{c.releaseIds.length}</span>
            </button>
          ))}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!name.trim()) return;
              const id = crypto.randomUUID();
              const saved = await setShelf((s) => ({
                ...s,
                collections: [
                  ...s.collections,
                  { id, name: name.trim().slice(0, 60), releaseIds: [] },
                ],
              }));
              if (!saved) return;
              setName('');
              setCollection(id);
            }}
          >
            <label>
              Nueva colección
              <input
                required
                maxLength={60}
                placeholder="Un nombre para este sonido"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <button className="button small secondary" type="submit">
              <Icon name="plus" size={16} />
              Crear colección
            </button>
          </form>
          <p className="micro">Tus notas y colecciones son privadas y se conservan en tu cuenta.</p>
        </aside>
        <section>
          <div className="section-heading">
            <h2>{currentCollection?.name || 'Todos los guardados'}</h2>
            {currentCollection && (
              <button
                className="text-link danger"
                onClick={() => {
                  setShelf((s) => ({
                    ...s,
                    collections: s.collections.filter((c) => c.id !== collection),
                  }));
                  setCollection('all');
                }}
              >
                Eliminar colección
              </button>
            )}
          </div>
          {!releases.length && (
            <div className="empty-state">
              <h3>Una buena colección empieza escuchando.</h3>
              <p>
                {currentCollection
                  ? 'Agrega canciones desde tus guardados.'
                  : 'Encuentra un lanzamiento y pulsa Guardar.'}
              </p>
              <Link className="button secondary" to="/discover">
                Explorar música
              </Link>
            </div>
          )}
          <div className="saved-list">
            {releases.map((r) => (
              <article key={r.id} className="saved-item">
                <button
                  className="saved-art"
                  onClick={() => player.select(r)}
                  aria-label={'Escuchar ' + r.title}
                >
                  <Artwork release={r} />
                </button>
                <div>
                  <Link to={'/lanzamiento/' + r.slug}>
                    <h3>{r.title}</h3>
                  </Link>
                  <p>
                    {r.artist} · {r.city}
                  </p>
                  {noteId === r.id ? (
                    <form
                      className="note-form"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const saved = await setShelf((s) => ({
                          ...s,
                          notes: { ...s.notes, [r.id]: note.trim() },
                        }));
                        if (!saved) return;
                        setNoteId('');
                        notify('Nota guardada.');
                      }}
                    >
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        aria-label="Nota personal"
                        maxLength={700}
                      />
                      <button className="button small" type="submit">
                        Guardar nota
                      </button>
                      <button className="text-link" type="button" onClick={() => setNoteId('')}>
                        Cancelar
                      </button>
                    </form>
                  ) : (
                    <button
                      className="note-button"
                      onClick={() => {
                        setNoteId(r.id);
                        setNote(shelf.notes[r.id] || '');
                      }}
                    >
                      {shelf.notes[r.id] || '+ ¿Por qué conectó contigo? Añade una nota.'}
                    </button>
                  )}
                  <div className="saved-tools">
                    {shelf.collections.length > 0 && !currentCollection && (
                      <select
                        aria-label={'Añadir ' + r.title + ' a colección'}
                        value=""
                        onChange={async (e) => {
                          const id = e.target.value;
                          const saved = await setShelf((s) => ({
                            ...s,
                            collections: s.collections.map((c) =>
                              c.id === id
                                ? { ...c, releaseIds: [...new Set([...c.releaseIds, r.id])] }
                                : c,
                            ),
                          }));
                          if (saved) notify('Añadido a la colección.');
                        }}
                      >
                        <option value="" disabled>
                          Añadir a colección
                        </option>
                        {shelf.collections.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    )}
                    <button
                      className="text-link danger"
                      onClick={() =>
                        currentCollection
                          ? setShelf((s) => ({
                              ...s,
                              collections: s.collections.map((c) =>
                                c.id === collection
                                  ? { ...c, releaseIds: c.releaseIds.filter((id) => id !== r.id) }
                                  : c,
                              ),
                            }))
                          : save(r.id)
                      }
                    >
                      {currentCollection ? 'Quitar de colección' : 'Quitar guardado'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
