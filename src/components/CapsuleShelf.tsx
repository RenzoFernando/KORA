import { useApp } from '../core/useApp';
import { ReleaseCard } from './ReleaseCard';
export function CapsuleShelf() {
  const { catalog, connection } = useApp();
  const tracks = catalog.filter((r) => r.rights === 'open-license' && r.playback === 'file');
  if (!tracks.length) return null;
  return (
    <section className="capsule-shelf" aria-labelledby="capsule-shelf-title">
      <div className="capsule-intro">
        <div>
          <p className="eyebrow">DALE TREINTA A ALGO NUEVO</p>
          <h2 id="capsule-shelf-title">
            Un pequeño play.
            <br />
            <em>Una nueva conexión.</em>
          </h2>
          <p>Voces de Bogotá. Pulsos de Medellín. Cada lugar tiene algo que contarte.</p>
        </div>
        <span className="capsule-stamp" aria-label="Cápsulas de 30 segundos">
          <strong>30</strong>
          <span>
            SEGUNDOS
            <br />
            PARA CONECTAR
          </span>
        </span>
      </div>
      <p className="micro">
        {connection === 'ready'
          ? 'Audio con licencia abierta · Controles KORΛ'
          : 'Vista del catálogo · Conectando disponibilidad'}
      </p>
      <div className="capsule-rail">
        {tracks.map((r) => (
          <ReleaseCard key={r.id} release={r} />
        ))}
      </div>
    </section>
  );
}
