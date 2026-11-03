import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../core/useApp';
import { plans } from '../core/plans';
import { paymentWhatsApp } from '../core/payments';
export function PaymentFollowup() {
  const { account, store, whatsapp, refresh } = useApp();
  const [checking, setChecking] = useState(false);
  const request = [...store.requests].reverse().find((r) => r.status === 'pending');
  const [feedback, setFeedback] = useState<{ reference: string; text: string }>();
  if (!account || !request) return null;
  const name = plans.find((p) => p.id === request.plan)?.name || request.plan;
  const active = account.plan === request.plan;
  return (
    <aside className="payment-followup" aria-label="Seguimiento de tu solicitud">
      <div>
        <span className="eyebrow">{active ? 'ACCESO ACTIVO' : 'TU SIGUIENTE PASO'}</span>
        <strong>{active ? name + ' ya está activo' : '¿Ya realizaste el pago?'}</strong>
        <p>
          {active
            ? 'El equipo activó tu cuenta. La solicitud conserva su estado de revisión.'
            : 'Envía el comprobante por WhatsApp junto a tu referencia. El equipo lo revisa y activa tu acceso.'}{' '}
          <span className="payment-reference">{request.reference}</span>
        </p>
      </div>
      <div className="action-row">
        {!active && (
          <a
            className="button small"
            href={paymentWhatsApp(whatsapp, request, account.email, name, true)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Enviar comprobante ↗
          </a>
        )}
        {!active && (
          <button
            className="text-link"
            disabled={checking}
            onClick={async () => {
              setChecking(true);
              try {
                const latest = await refresh();
                setFeedback({
                  reference: request.id,
                  text:
                    latest?.plan === request.plan
                      ? name + ' ya está activo.'
                      : latest
                        ? 'Tu plan todavía está pendiente de activación.'
                        : 'No pudimos comprobar el estado ahora. Inténtalo de nuevo en unos segundos.',
                });
              } finally {
                setChecking(false);
              }
            }}
          >
            {checking ? 'Consultando…' : 'Comprobar activación'}
          </button>
        )}
        <Link className="text-link" to={'/planes#solicitud-' + request.id}>
          Ver solicitud
        </Link>
      </div>
      <p role="status" className="payment-status">
        {checking
          ? 'Estamos consultando tu activación. Puede tardar unos segundos.'
          : feedback?.reference === request.id
            ? active
              ? name + ' ya está activo.'
              : feedback.text
            : ''}
      </p>
    </aside>
  );
}
