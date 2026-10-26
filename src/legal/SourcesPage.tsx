import { useApp } from '../core/useApp';
import { safeUrl } from '../core/catalog';
import { Icon } from '../components/Icon';
export function SourcesPage() {
  const { catalog } = useApp();
  return (
    <div className="page narrow-page">
      <p className="eyebrow">UN CATÁLOGO CON PROCEDENCIA</p>
      <h1>La fuente también importa.</h1>
      <p className="lead">
        Artistas reales, enlaces oficiales y un registro del alcance de cada uso. Las fichas
        iniciales son editoriales, sin atribuir afiliación a los artistas.
      </p>
      <div className="source-list">
        {catalog.map((r) => (
          <article className="panel" key={r.id}>
            <div className="section-heading">
              <h2>{r.title}</h2>
              <Icon name="shield" />
            </div>
            <p>
              {r.artist} · {r.city}
            </p>
            <p className="micro">
              {r.rights === 'official-embed' ? 'Fuente verificada' : 'Autorización declarada'} ·{' '}
              {r.verifiedAt.slice(0, 10)}
            </p>
            <p>{r.rightsEvidence}</p>
            {safeUrl(r.sourceUrl) && (
              <a
                className="text-link"
                href={safeUrl(r.sourceUrl)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Consultar fuente original <Icon name="external" size={15} />
              </a>
            )}
          </article>
        ))}
      </div>
      <section className="panel">
        <h2>Criterio de incorporación</h2>
        <p>
          La ubicación de las seis fichas iniciales se verificó en sus perfiles oficiales de
          Bandcamp. Para La Mambanegra se contrastó además con el catálogo público de Artes
          Escénicas de MinCultura. Los identificadores de embed se obtuvieron de los metadatos
          públicos de las páginas de cada lanzamiento; no se extrajeron streams.
        </p>
        <a
          className="text-link"
          href="https://mng.mincultura.gov.co/areas/artes/publicaciones/Documents/Cat%C3%A1logo%20Artes%20Esc%C3%A9nicas%20Colombia.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Catálogo de Artes Escénicas · MinCultura ↗
        </a>
        <p>
          Los controles externos y la disponibilidad son responsabilidad de Bandcamp. KORΛ no
          promete que su catálogo sea música libre ni permite descargarlo desde aquí.
        </p>
        <a
          className="text-link"
          href="https://get.bandcamp.help/en/articles/15263139-how-do-i-embed-my-music-on-tumblr"
          target="_blank"
          rel="noopener noreferrer"
        >
          Guía oficial de integración de Bandcamp ↗
        </a>
      </section>
    </div>
  );
}
