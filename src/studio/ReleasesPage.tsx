import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../core/useApp';
import { StudioGate } from './StudioGate';
import { Artwork } from '../components/Artwork';
import { Icon } from '../components/Icon';
import { releaseAllowance } from '../core/plans';
import { exportKit } from './kit';
export function ReleasesPage() {
  const { account, store, shelf, update, notify } = useApp();
  const [filter, setFilter] = useState('all');
  const [exporting, setExporting] = useState('');
  const [exported, setExported] = useState('');
  const releases = store.releases.filter((r) => r.ownerId === account?.id);
  const visible = releases.filter((r) => filter === 'all' || r.status === filter);
  return (
    <StudioGate>
      <div className="page">
        <p className="eyebrow">TU CATÁLOGO, TU HISTORIA</p>
        <div className="intro-line">
          <h1>Mis lanzamientos.</h1>
          <Link className="button" to="/studio/nuevo">
            <Icon name="plus" size={17} />
            Nuevo lanzamiento
          </Link>
        </div>
        <div className="genre-filters release-filters">
          {[
            ['all', 'Todos'],
            ['active', 'Activos'],
            ['draft', 'Borradores'],
            ['archived', 'Archivados'],
          ].map(([key, label]) => (
            <button
              key={key}
              className={filter === key ? 'active' : ''}
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
        {!visible.length ? (
          <div className="empty-state">
            <Icon name="music" size={36} />
            <h2>
              {releases.length ? 'Nada por aquí, todavía.' : 'Tu primer lanzamiento empieza aquí.'}
            </h2>
            <Link className="button secondary" to="/studio/nuevo">
              Crear un lanzamiento
            </Link>
          </div>
        ) : (
          <div className="managed-release-grid">
            {visible.map((r) => (
              <article className="panel managed-release" key={r.id}>
                <Link to={'/lanzamiento/' + r.slug}>
                  <Artwork release={r} />
                </Link>
                <div className="section-heading">
                  <h2>{r.title}</h2>
                  <span className={'tag ' + r.status}>
                    {r.status === 'active'
                      ? 'Activo'
                      : r.status === 'draft'
                        ? 'Borrador'
                        : 'Archivado'}
                  </span>
                </div>
                <p>
                  {r.artist} · {r.city}
                </p>
                <div className="action-row">
                  <Link className="button small secondary" to={'/studio/editar/' + r.id}>
                    Editar
                  </Link>
                  <Link className="text-link" to={'/lanzamiento/' + r.slug}>
                    Vista previa ↗
                  </Link>
                </div>
                <div className="managed-actions">
                  <button
                    className="text-link"
                    disabled={!!exporting}
                    onClick={async () => {
                      setExporting(r.id);
                      try {
                        await exportKit(r);
                        setExported(r.id);
                        notify('Kit con QR preparado. Revisa las descargas del navegador.');
                      } catch {
                        notify('No se pudo preparar el kit. Revisa tu conexión y los archivos.');
                      } finally {
                        setExporting('');
                      }
                    }}
                  >
                    <Icon name="download" size={15} />
                    {exporting === r.id ? 'Preparando kit…' : 'Exportar kit'}
                  </button>
                  <button
                    className="text-link"
                    onClick={async () => {
                      if (!account) return;
                      if (
                        account.plan === 'kit' &&
                        shelf.kitReleaseId &&
                        r.id !== shelf.kitReleaseId
                      ) {
                        notify(
                          'Este kit pertenece a otro lanzamiento. Edita la página incluida o solicita otro kit.',
                        );
                        return;
                      }
                      const allowance = releaseAllowance(account, store.releases);
                      if (r.status !== 'active' && !allowance.canActivate) {
                        notify(
                          allowance.hasAccess
                            ? 'Límite de lanzamientos alcanzado. Archiva otro primero.'
                            : 'La prueba terminó. Revisa tus planes o guarda borradores.',
                        );
                        return;
                      }
                      const saved = await update((s) => ({
                        ...s,
                        releases: s.releases.map((item) =>
                          item.id === r.id
                            ? { ...item, status: r.status === 'active' ? 'archived' : 'active' }
                            : item,
                        ),
                      }));
                      if (!saved) return;
                      notify(
                        r.status === 'active'
                          ? 'Lanzamiento archivado.'
                          : 'Lanzamiento compartido con la escena.',
                      );
                    }}
                  >
                    {r.status === 'active' ? 'Archivar' : 'Activar'}
                  </button>
                </div>
                {exported === r.id && (
                  <p className="notice" role="status">
                    Kit HTML con página, enlaces y QR preparado.{' '}
                    {r.playback === 'file'
                      ? 'Incluye el audio autorizado.'
                      : 'La escucha abre tus enlaces oficiales.'}{' '}
                    Revisa las descargas del navegador.
                  </p>
                )}
                <small className="micro">
                  {r.allowScout ? 'Métricas autorizadas para Scout' : 'Métricas privadas'} ·
                  Declaración de derechos registrada
                </small>
              </article>
            ))}
          </div>
        )}
      </div>
    </StudioGate>
  );
}
