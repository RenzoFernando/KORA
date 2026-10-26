import { Link } from 'react-router-dom';
import { useApp } from '../core/useApp';
import { releaseAllowance, trialRemaining, plans } from '../core/plans';
import { StudioGate } from './StudioGate';
import { Artwork } from '../components/Artwork';
import { Icon } from '../components/Icon';
export function StudioPage() {
  const { account, store, shelf } = useApp();
  const own = store.releases.filter((r) => r.ownerId === account?.id);
  const kitRelease =
    account?.plan === 'kit'
      ? own.find((r) => r.id === shelf.kitReleaseId) || own.find((r) => r.status === 'active')
      : undefined;
  const allowance = account ? releaseAllowance(account, own) : { active: 0, limit: 5 };
  return (
    <StudioGate>
      <div className="page">
        <div className="studio-heading">
          <div>
            <p className="eyebrow">TU MÚSICA, EN TUS TÉRMINOS</p>
            <h1>Hagamos que llegue.</h1>
            <p className="lead">Un lanzamiento empieza con una historia. Continúa con un enlace.</p>
          </div>
          <Link
            className="button"
            to={kitRelease ? '/studio/editar/' + kitRelease.id : '/studio/nuevo'}
          >
            <Icon name="plus" size={18} />
            {kitRelease ? 'Editar mi lanzamiento' : 'Nuevo lanzamiento'}
          </Link>
        </div>
        <div className="status-strip">
          <span>
            <i className="status-dot" />
            {account && account.plan !== 'free'
              ? (plans.find((p) => p.id === account.plan)?.name || account.plan) + ' · Activo'
              : 'Prueba Artist · ' + (account ? trialRemaining(account) : 0) + ' días restantes'}
          </span>
          <span>
            {allowance.active} de {allowance.limit} lanzamientos activos
          </span>
          <Link to="/planes">Ver mi plan ↗</Link>
        </div>
        <div className="studio-overview">
          <article className="panel">
            <span className="eyebrow">TU CATÁLOGO</span>
            <strong>{own.length}</strong>
            <p>Lanzamientos creados</p>
          </article>
          <article className="panel">
            <span className="eyebrow">EN ESCENA</span>
            <strong>{allowance.active}</strong>
            <p>Lanzamientos activos</p>
          </article>
          <article className="panel">
            <span className="eyebrow">PRÓXIMOS PASOS</span>
            <strong>{own.filter((r) => r.status === 'draft').length}</strong>
            <p>Borradores por afinar</p>
          </article>
        </div>
        <div className="section-heading">
          <h2>Tus últimos lanzamientos</h2>
          <Link className="text-link" to="/studio/lanzamientos">
            Ver todos <Icon name="arrow" size={16} />
          </Link>
        </div>
        {own.length ? (
          <div className="studio-release-list">
            {own
              .slice(-3)
              .reverse()
              .map((r) => (
                <Link key={r.id} className="panel studio-release-row" to={'/studio/editar/' + r.id}>
                  <Artwork release={r} />
                  <span>
                    <strong>{r.title}</strong>
                    <small>
                      {r.artist} · {r.city}
                    </small>
                  </span>
                  <span className={'tag ' + r.status}>
                    {r.status === 'active'
                      ? 'Activo'
                      : r.status === 'draft'
                        ? 'Borrador'
                        : 'Archivado'}
                  </span>
                  <Icon name="arrow" />
                </Link>
              ))}
          </div>
        ) : (
          <div className="first-release">
            <div className="empty-release-art">
              <Icon name="music" size={55} />
              <span>01</span>
            </div>
            <div>
              <p className="eyebrow">EMPIEZA POR UNA CANCIÓN</p>
              <h2>
                Este puede ser
                <br />
                tu próximo lanzamiento.
              </h2>
              <p>Cuenta qué hay detrás, añade tus enlaces y hazlo tuyo.</p>
              <Link className="button secondary" to="/studio/nuevo">
                Crear mi primer lanzamiento <Icon name="arrow" size={17} />
              </Link>
            </div>
          </div>
        )}
        <div className="studio-feature-grid">
          <Link className="panel feature-link" to="/studio/bio">
            <Icon name="user" size={27} />
            <h3>Tu bio page</h3>
            <p>Tu historia y tus lanzamientos en una sola página.</p>
            <Icon name="arrow" />
          </Link>
          <Link className="panel feature-link" to="/studio/analitica">
            <Icon name="chart" size={27} />
            <h3>Lee las señales</h3>
            <p>Revisa lo que ocurrió en tus páginas.</p>
            <Icon name="arrow" />
          </Link>
          <Link className="panel feature-link" to="/legal/licencia-musical">
            <Icon name="shield" size={27} />
            <h3>Tu música es tuya</h3>
            <p>Conoce los permisos y el alcance de cada uso.</p>
            <Icon name="arrow" />
          </Link>
        </div>
      </div>
    </StudioGate>
  );
}
