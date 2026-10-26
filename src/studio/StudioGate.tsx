import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../core/useApp';
import { Icon } from '../components/Icon';
export function StudioGate({ children }: { children: ReactNode }) {
  const { account } = useApp();
  if (account?.role === 'artist') return children;
  return (
    <div className="page studio-welcome">
      <p className="eyebrow">KORΛ STUDIO · PARA ARTISTAS</p>
      <h1>
        Tu música ya tiene voz.
        <br />
        <em>Dale un lugar.</em>
      </h1>
      <p className="lead">
        Presenta un lanzamiento con su historia.
        <br />
        Reúne tus enlaces. Compártelo con intención.
      </p>
      <div className="action-row">
        <Link className="button" to={account ? '/cuenta' : '/acceso?modo=registro&rol=artist'}>
          {account ? 'Revisar mi cuenta' : 'Crear mi cuenta de artista'}
          <Icon name="arrow" size={17} />
        </Link>
        <Link className="text-link" to="/planes">
          Conocer los planes
        </Link>
      </div>
      {account && (
        <p className="notice">
          Esta cuenta es de {account.role === 'scout' ? 'Scout' : 'oyente'}. Crea una cuenta de
          artista para gestionar tus propios lanzamientos.
        </p>
      )}
      <div className="studio-feature-grid">
        {[
          [
            'music',
            'Tu lanzamiento, completo.',
            'Historia, enlaces oficiales y un reproductor autorizado en una misma página.',
          ],
          [
            'share',
            'Un enlace. Muchas puertas.',
            'Enlaces oficiales, página de artista y QR en una dirección compartible.',
          ],
          [
            'chart',
            'Señales que sí ocurrieron.',
            'Visitas, clics y aperturas medidos con consentimiento. Sin cifras de relleno.',
          ],
        ].map(([icon, title, text], index) => (
          <article className="panel" key={title}>
            <span className="feature-num">0{index + 1}</span>
            <Icon name={icon} size={28} />
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <div className="studio-statement">
        <span>KORΛ</span>
        <p>
          Del primer play
          <br />
          al próximo encuentro.
        </p>
      </div>
    </div>
  );
}
