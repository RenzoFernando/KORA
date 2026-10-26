import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../core/useApp';
import { Dialog } from './Dialog';
export function Notifications() {
  const { account, notices, readNotice, refresh } = useApp();
  const [open, setOpen] = useState(false);
  if (!account) return null;
  const unread = notices.filter((n) => !n.readAt).length;
  return (
    <>
      <button
        className="icon-button notification-button"
        aria-label={'Notificaciones' + (unread ? ' · ' + unread + ' sin leer' : '')}
        onClick={() => {
          setOpen(true);
          void refresh();
        }}
      >
        <svg
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          aria-hidden="true"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
        </svg>
        {unread > 0 && <span className="notification-count">{unread}</span>}
      </button>
      {open && (
        <Dialog title="Lo que pasa en tu escena" onClose={() => setOpen(false)}>
          <p className="micro">Avisos dentro de KORΛ. No son notificaciones push del teléfono.</p>
          {!notices.length ? (
            <p>No tienes novedades pendientes.</p>
          ) : (
            <div className="notification-list">
              {[...notices].reverse().map((n) => (
                <article key={n.id} className={'notification-item ' + (!n.readAt ? 'unread' : '')}>
                  <h3>{n.title}</h3>
                  <p>{n.body}</p>
                  <small>{new Date(n.createdAt).toLocaleString('es-CO')}</small>
                  <div className="action-row">
                    <Link
                      className="text-link"
                      to={n.link.startsWith('/') && !n.link.startsWith('//') ? n.link : '/cuenta'}
                      onClick={() => {
                        readNotice(n.id);
                        setOpen(false);
                      }}
                    >
                      Ver detalle ↗
                    </Link>
                    {!n.readAt && (
                      <button className="text-link" onClick={() => readNotice(n.id)}>
                        Marcar leído
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </Dialog>
      )}
    </>
  );
}
