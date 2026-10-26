import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../core/useApp';
import { filterCatalog } from '../core/catalog';
import { download } from '../core/storage';
import { csv } from '../studio/kit';
import { Artwork } from '../components/Artwork';
import { Icon } from '../components/Icon';
export function ScoutPage() {
  const { account, catalog, store, shelf, setShelf } = useApp();
  const [query, setQuery] = useState('');
  const [onlySaved, setOnlySaved] = useState(false);
  const access =
    account?.role === 'scout' && account.plan === 'scout' && account.entitlementSource === 'sheet';
  const results = filterCatalog(catalog, store.settings.city, 'Todos', query).filter(
    (r) => !onlySaved || shelf.shortlist.includes(r.id),
  );
  return (
    <div className="page">
      <p className="eyebrow">KORΛ SCOUT · OTRA FORMA DE ENCONTRAR</p>
      <div className="intro-line">
        <h1>
          Talento cerca.
          <br />
          Contexto primero.
        </h1>
        {access && (
          <button
            className="button secondary small"
            onClick={() =>
              download(
                'KORΛ-seleccion-scout.csv',
                csv([
                  ['artista', 'lanzamiento', 'ciudad', 'genero', 'fuente'],
                  ...catalog
                    .filter((r) => shelf.shortlist.includes(r.id))
                    .map((r) => [r.artist, r.title, r.city, r.genre, r.sourceUrl]),
                ]),
                'text/csv;charset=utf-8',
              )
            }
          >
            <Icon name="download" size={16} />
            Exportar mi selección
          </button>
        )}
      </div>
      <p className="lead">
        Conoce una escena por su música. Las métricas solo se muestran con autorización del artista.
      </p>
      {!access ? (
        <section className="panel scout-gate">
          <Icon name="chart" size={40} />
          <h2>Escucha la escena con permiso.</h2>
          <p>
            Scout incluye una lista de seguimiento y señales agregadas autorizadas. En esta versión
            el acceso lo activa el equipo desde la hoja privada.
          </p>
          <Link
            className="button"
            to={
              account?.role === 'scout'
                ? '/planes'
                : account
                  ? '/cuenta'
                  : '/acceso?modo=registro&rol=scout'
            }
          >
            {account?.role === 'scout'
              ? 'Revisar plan Scout'
              : account
                ? 'Revisar mi cuenta'
                : 'Crear cuenta Scout'}
            <Icon name="arrow" size={17} />
          </Link>
          <p className="micro">
            {account && account.role !== 'scout'
              ? 'Esta cuenta no es Scout. No cambiaremos tu rol automáticamente.'
              : 'Sin acceso a datos privados de oyentes ni contactos de artistas.'}
          </p>
        </section>
      ) : (
        <>
          <p className="notice">
            Acceso Scout · Métricas de acciones consentidas en KORΛ; no equivalen a oyentes únicos
            ni a reproducciones externas.
          </p>
          <div className="scout-toolbar">
            <label className="search-field">
              <Icon name="search" size={18} />
              <input
                placeholder="Artista, género o lanzamiento"
                type="search"
                aria-label="Buscar talento"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <button
              className={'button secondary small ' + (onlySaved ? 'selected' : '')}
              aria-pressed={onlySaved}
              onClick={() => setOnlySaved(!onlySaved)}
            >
              <Icon name="bookmark" size={16} />
              Mi selección ({shelf.shortlist.length})
            </button>
          </div>
          <div className="scout-results">
            {results.map((r) => (
              <article key={r.id} className="panel scout-row">
                <Artwork release={r} />
                <div>
                  <Link to={'/artista/' + r.artistId}>
                    <h2>{r.artist}</h2>
                  </Link>
                  <p>
                    {r.title} · {r.city} · {r.genre}
                  </p>
                  <div className="scout-metrics">
                    {r.allowScout ? (
                      <>
                        <span>
                          {
                            store.events.filter(
                              (e) => e.releaseId === r.id && e.type === 'page_view',
                            ).length
                          }{' '}
                          visitas
                        </span>
                        <span>
                          {
                            store.events.filter(
                              (e) => e.releaseId === r.id && e.type === 'outbound_click',
                            ).length
                          }{' '}
                          clics
                        </span>
                        <span className="tag">Métricas autorizadas</span>
                      </>
                    ) : (
                      <span className="micro">
                        Solo ficha pública · Sin autorización para métricas.
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className="button secondary small"
                  onClick={() =>
                    setShelf((s) => ({
                      ...s,
                      shortlist: s.shortlist.includes(r.id)
                        ? s.shortlist.filter((id) => id !== r.id)
                        : [...s.shortlist, r.id],
                    }))
                  }
                  aria-pressed={shelf.shortlist.includes(r.id)}
                >
                  <Icon name={shelf.shortlist.includes(r.id) ? 'check' : 'plus'} size={16} />
                  {shelf.shortlist.includes(r.id) ? 'En selección' : 'Seguir'}
                </button>
              </article>
            ))}
          </div>
          {!results.length && (
            <div className="empty-state">
              <h2>No hay coincidencias en esta selección.</h2>
              <p>Prueba otra ciudad o un nombre distinto.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
