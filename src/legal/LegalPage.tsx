import { Link, useParams } from 'react-router-dom';
import { legalDocs } from './legalContent';
import { Icon } from '../components/Icon';
export function LegalPage() {
  const { document } = useParams();
  const doc = legalDocs[document || 'terminos'];
  if (!doc)
    return (
      <div className="page empty-state">
        <h1>Documento no encontrado</h1>
        <Link to="/legal/terminos">Ver términos</Link>
      </div>
    );
  return (
    <div className="page legal-page">
      <p className="eyebrow">KORΛ · CLARIDAD DESDE EL PRINCIPIO</p>
      <h1>{doc.title}</h1>
      <p className="lead">{doc.lead}</p>
      <nav className="legal-tabs" aria-label="Documentos legales">
        {Object.entries(legalDocs).map(([key, item]) => (
          <Link key={key} className={key === document ? 'active' : ''} to={'/legal/' + key}>
            {item.title}
          </Link>
        ))}
      </nav>
      <p className="legal-version">
        <Icon name="shield" size={17} />
        Prueba compartida · Versión 2026-10-25.2 · Condiciones sujetas a revisión antes de operación
        comercial.
      </p>
      {doc.sections.map(([title, text]) => (
        <section key={title}>
          <h2>{title}</h2>
          <p>{text}</p>
        </section>
      ))}
      {document === 'privacidad' && (
        <p className="micro">
          Referencia normativa:{' '}
          <a
            href="https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ley 1581 de 2012 · Función Pública ↗
          </a>
        </p>
      )}
      <p className="micro">
        Los documentos originales se conservaron sin cambios en docs/originales dentro del proyecto.
        Esta versión ajusta su alcance a las funciones realmente disponibles.
      </p>
    </div>
  );
}
