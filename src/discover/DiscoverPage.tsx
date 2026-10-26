import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../core/useApp';
import { filterCatalog } from '../core/catalog';
import { ReleaseCard } from '../components/ReleaseCard';
import { Icon } from '../components/Icon';
import { usePlayer } from '../player/usePlayer';
export function DiscoverPage() {
  const { catalog, store, account } = useApp();
  const player = usePlayer();
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const [genre, setGenre] = useState('Todos');
  const city = store.settings.city;
  const cityCatalog = filterCatalog(catalog, city, 'Todos', '');
  const filtered = filterCatalog(catalog, city, genre, query);
  const spotlight = cityCatalog.find((r) => r.id === 'zalama-dejalo') || cityCatalog[0];
  const starters = cityCatalog
    .filter((r, i, all) => all.findIndex((other) => other.artistId === r.artistId) === i)
    .slice(0, 3);
  return (
    <div className="page discover-page">
      {!query && genre === 'Todos' && spotlight && (
        <section className="discovery-hero scene-hero">
          <div className="hero-copy">
            <p className="eyebrow">KORΛ · HECHO DE AQUÍ</p>
            <h1>
              {city === 'Colombia' ? 'La música de aquí' : city + ' tiene'}
              <br />
              <em>{city === 'Colombia' ? 'llega más lejos.' : 'otro sonido.'}</em>
            </h1>
            <p className="scene-lead">
              Hay historias que solo se encuentran escuchando cerca. Conoce las voces de tu escena y
              vuelve a lo que te mueve.
            </p>
            <div className="hero-actions">
              <button className="button" onClick={() => player.select(spotlight)}>
                <Icon name="play" size={18} />
                Escuchar la escena
              </button>
              <a className="text-link" href="#catalog-title">
                Explorar catálogo ↓
              </a>
            </div>
            <p className="scene-count">
              {cityCatalog.length} lanzamientos · {new Set(cityCatalog.map((r) => r.artistId)).size}{' '}
              artistas · {city}
            </p>
          </div>
          <div className="scene-starters">
            <p className="eyebrow">UN PUNTO DE PARTIDA</p>
            {starters.map((r, i) => (
              <div className="scene-starter" key={r.id}>
                <span className="starter-index">0{i + 1}</span>
                <div>
                  <Link to={'/lanzamiento/' + r.slug}>
                    <strong>{r.title}</strong>
                  </Link>
                  <Link to={'/artista/' + r.artistId}>{r.artist}</Link>
                  <small>{r.genre}</small>
                </div>
                <button
                  className="icon-button"
                  aria-label={'Abrir ' + r.title + ' en el reproductor'}
                  onClick={() => player.select(r)}
                >
                  <Icon name="play" size={20} />
                </button>
              </div>
            ))}
            <span className="scene-signature">
              <img src="/branding/01_isotipo_positivo.svg" alt="" />
              Música que conecta.
            </span>
          </div>
        </section>
      )}
      <section className="catalog-section" aria-labelledby="catalog-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">DESCUBRIMIENTO SIN PRISA</p>
            <h2 id="catalog-title">
              Encuentra tu próxima conexión<span className="count">{filtered.length}</span>
            </h2>
          </div>
          <label className="search-field">
            <Icon name="search" size={18} />
            <input
              type="search"
              aria-label="Buscar artista o lanzamiento"
              placeholder="Artista, lanzamiento, sonido…"
              value={query}
              onChange={(e) =>
                setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })
              }
            />
          </label>
        </div>
        <div className="filter-line">
          <div className="genre-filters" aria-label="Filtrar por género">
            {['Todos', ...new Set(cityCatalog.map((r) => r.genre))].map((g) => (
              <button
                key={g}
                className={genre === g ? 'active' : ''}
                aria-pressed={genre === g}
                onClick={() => setGenre(g)}
              >
                {g}
              </button>
            ))}
          </div>
          <span className="micro">{city} · Fuentes oficiales</span>
        </div>
        {filtered.length ? (
          <div className="release-grid">
            {filtered.map((release) => (
              <ReleaseCard key={release.id} release={release} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Icon name="search" size={35} />
            <h3>
              {cityCatalog.length ? 'Ese sonido aún no aparece.' : 'Una escena por descubrir.'}
            </h3>
            <p>
              {cityCatalog.length
                ? 'Prueba con otro nombre o género.'
                : 'Todavía no tenemos lanzamientos verificados para esta ciudad. Cali es nuestro punto de partida.'}
            </p>
            <button
              className="button secondary"
              onClick={() => {
                setGenre('Todos');
                setParams({});
              }}
            >
              Limpiar filtros
            </button>
          </div>
        )}
        <div className="catalog-footnote">
          <Icon name="shield" size={15} />
          <span>
            Música en sus fuentes oficiales. Conoce la historia y la procedencia de cada
            lanzamiento.
          </span>
          <Link to="/fuentes">
            Ver procedencia <Icon name="arrow" size={14} />
          </Link>
        </div>
      </section>
      {!query && genre === 'Todos' && (!account || account.role === 'artist') && (
        <section className="studio-banner">
          <div className="studio-banner-icon">
            <Icon name="studio" size={32} />
          </div>
          <div>
            <p className="eyebrow">EL OTRO LADO DE LA ESCENA</p>
            <h2>¿Esta vez, la música la haces tú?</h2>
            <p>Una página para tu historia. Un enlace para compartirla.</p>
          </div>
          <Link className="button secondary" to="/studio">
            Entrar a Studio <Icon name="arrow" size={17} />
          </Link>
        </section>
      )}
    </div>
  );
}
