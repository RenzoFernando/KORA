import { Link } from 'react-router-dom';
import { useApp } from '../core/useApp';
import { StudioGate } from './StudioGate';
import { Icon } from '../components/Icon';
import { download } from '../core/storage';
import { csv } from './kit';
export function AnalyticsPage() {
  const { account, store } = useApp();
  const releases = store.releases.filter((r) => r.ownerId === account?.id);
  const events = store.events.filter((e) => releases.some((r) => r.id === e.releaseId));
  const kinds = [
    ['page_view', 'Visitas a páginas'],
    ['outbound_click', 'Clics a servicios'],
    ['embed_open', 'Aperturas de embed'],
    ['audio_play', 'Audios nativos iniciados'],
  ] as const;
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    return {
      date: d.toLocaleDateString('en-CA'),
      label: d.toLocaleDateString('es-CO', { weekday: 'short' }),
      count: events.filter(
        (e) => new Date(e.at).toLocaleDateString('en-CA') === d.toLocaleDateString('en-CA'),
      ).length,
    };
  });
  const max = Math.max(1, ...days.map((d) => d.count));
  return (
    <StudioGate>
      <div className="page">
        <p className="eyebrow">ESCUCHA LO QUE DICEN LAS SEÑALES</p>
        <div className="intro-line">
          <h1>Actividad de tus lanzamientos.</h1>
          <button
            className="button secondary small"
            onClick={() =>
              download(
                'KORΛ-actividad.csv',
                csv([
                  ['fecha', 'lanzamiento', 'evento', 'servicio'],
                  ...events.map((e) => [
                    e.at,
                    releases.find((r) => r.id === e.releaseId)?.title || '',
                    e.type,
                    e.label || '',
                  ]),
                ]),
                'text/csv;charset=utf-8',
              )
            }
          >
            <Icon name="download" size={16} />
            Exportar CSV
          </button>
        </div>
        <p className="notice">
          Eventos consentidos de la prueba compartida. No son oyentes únicos ni datos de audiencia
          de otras plataformas. Las aperturas de Bandcamp no equivalen a reproducciones.
        </p>
        {!store.settings.analytics && (
          <p className="notice">
            La medición está desactivada. <Link to="/cuenta">Puedes activarla en tu cuenta</Link>.
            No se reconstruye actividad anterior.
          </p>
        )}
        <div className="metrics-grid">
          {kinds.map(([key, label]) => (
            <article className="panel metric-card" key={key}>
              <p>{label}</p>
              <strong>{events.filter((e) => e.type === key).length}</strong>
              <span className="micro">Eventos de KORΛ</span>
            </article>
          ))}
        </div>
        <section className="panel activity-chart">
          <div className="section-heading">
            <h2>Los últimos siete días</h2>
            <span className="micro">Eventos registrados</span>
          </div>
          <div
            className="bar-chart"
            role="img"
            aria-label={days.map((d) => d.label + ': ' + d.count + ' eventos').join(', ')}
          >
            {days.map((day) => (
              <div key={day.date}>
                <span>{day.count}</span>
                <div className="bar-track">
                  <i style={{ height: (day.count / max) * 100 + '%' }} />
                </div>
                <small>{day.label}</small>
              </div>
            ))}
          </div>
          {!events.length && (
            <p className="micro">
              Aún no hay actividad registrada. Las barras crecerán con las acciones que ocurran.
            </p>
          )}
        </section>
        <section className="panel">
          <h2>Por lanzamiento</h2>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Lanzamiento</th>
                  {kinds.map(([key, label]) => (
                    <th key={key}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {releases.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <Link to={'/lanzamiento/' + r.slug}>{r.title}</Link>
                    </td>
                    {kinds.map(([key]) => (
                      <td key={key}>
                        {events.filter((e) => e.releaseId === r.id && e.type === key).length}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!releases.length && <p className="muted">Crea tu primer lanzamiento para comenzar.</p>}
        </section>
      </div>
    </StudioGate>
  );
}
