import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../core/useApp';
import { plans, money } from '../core/plans';
import type { Plan, RequestItem } from '../core/types';
import { Dialog } from '../components/Dialog';
import { Icon } from '../components/Icon';
import { download } from '../core/storage';
export function PlansPage() {
  const { account, store, createOrder, joinWaitlist, whatsapp } = useApp();
  const [selected, setSelected] = useState<Plan | null>(null);
  const [method, setMethod] = useState<'cash' | 'transfer'>('transfer');
  const [request, setRequest] = useState<RequestItem>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [waiting, setWaiting] = useState(false);
  const [consent, setConsent] = useState(false);
  const plan = plans.find((p) => p.id === selected);
  const allowed =
    account?.role === 'artist'
      ? ['free', 'artist', 'kit']
      : account?.role === 'scout'
        ? ['free', 'scout']
        : ['free', 'curator'];
  const choices = account ? plans.filter((p) => allowed.includes(p.id)) : plans;
  function whatsappUrl(r: RequestItem) {
    const name = plans.find((p) => p.id === r.plan)?.name || r.plan;
    return (
      'https://wa.me/' +
      whatsapp +
      '?text=' +
      encodeURIComponent(
        'Hola, equipo KORΛ. Solicité ' +
          name +
          '. Referencia: ' +
          r.reference +
          '. Cuenta: ' +
          account?.email +
          '. Medio propuesto: ' +
          (r.method === 'cash' ? 'efectivo' : 'transferencia') +
          '. Quiero confirmar las condiciones y la activación.' +
          (r.isTest ? ' Es una solicitud de prueba.' : ''),
      )
    );
  }
  function summary(r: RequestItem) {
    download(
      'KORΛ-solicitud-' + r.reference + '.txt',
      'KORΛ · Solicitud pendiente\nReferencia: ' +
        r.reference +
        '\nPlan: ' +
        r.plan +
        '\nValor orientativo: ' +
        money(r.amount || 0) +
        '\nFecha: ' +
        r.at +
        '\nCuenta: ' +
        account?.email +
        '\n\nEsto no es un comprobante de pago, factura ni activación. El equipo confirma el alcance y revisa cualquier pago antes de habilitar el acceso.',
    );
  }
  return (
    <div className="page plans-page">
      <p className="eyebrow">CADA QUIEN TIENE SU LUGAR</p>
      <h1>
        Tu forma de conectar.
        <br />
        Tu espacio para crecer.
      </h1>
      <p className="lead">
        Descubrir es el comienzo. Dale más espacio a tu criterio o a tu música.
      </p>
      <p className="notice">
        <Icon name="shield" size={17} />
        Prueba compartida · Las solicitudes quedan pendientes. El equipo confirma las condiciones y
        activa el acceso manualmente; no hay cobro automático.
      </p>
      <div className="plan-grid">
        {choices.map((p) => (
          <article
            className={
              'plan-card ' +
              (['artist', 'curator'].includes(p.id) ? 'featured ' : '') +
              (p.id === 'kit' ? 'launch-kit-card' : '')
            }
            key={p.id}
          >
            {['artist', 'curator'].includes(p.id) && (
              <span className="plan-ribbon">
                {p.id === 'curator' ? 'TU CRITERIO MUEVE LA ESCENA' : 'TU MÚSICA, MÁS LEJOS'}
              </span>
            )}
            <span className="eyebrow">
              {p.id === 'kit' ? 'UN LANZAMIENTO' : p.id === 'free' ? 'DESCUBRIR' : 'ACCESO MENSUAL'}
            </span>
            <h2>{p.name}</h2>
            <p>{p.description}</p>
            <div className="plan-price">
              {money(p.price)}
              <small>{p.period}</small>
            </div>
            <ul>
              {p.features.map((f) => (
                <li key={f}>
                  <Icon name="check" size={16} />
                  {f}
                </li>
              ))}
            </ul>
            {p.id === 'free' ? (
              <Link className="button secondary full" to="/discover">
                Seguir explorando
              </Link>
            ) : account?.plan === p.id ? (
              <span className="tag">Tu acceso actual</span>
            ) : account ? (
              <button
                className="button full"
                onClick={() => {
                  setSelected(p.id);
                  setRequest(undefined);
                  setError('');
                }}
              >
                Solicitar activación <Icon name="arrow" size={16} />
              </button>
            ) : (
              <Link
                className="button full"
                to={
                  '/acceso?modo=registro&rol=' +
                  (p.id === 'artist' || p.id === 'kit'
                    ? 'artist'
                    : p.id === 'scout'
                      ? 'scout'
                      : 'explorer')
                }
              >
                Crear mi cuenta <Icon name="arrow" size={16} />
              </Link>
            )}
          </article>
        ))}
      </div>
      <section className="panel service-scope">
        <div>
          <p className="eyebrow">UN ALCANCE CLARO</p>
          <h2>Lo que recibes.</h2>
        </div>
        <div>
          <p>
            <strong>Artist:</strong> siete días de prueba desde el registro y cinco lanzamientos
            activos. Incluye páginas compartibles, bio, enlaces, QR y eventos consentidos. Los
            borradores no cuentan.
          </p>
          <p>
            <strong>Launch Kit:</strong> una página para un único lanzamiento. Historia, portada
            autorizada, enlaces y QR; puedes exportarla. Antes de pagar, acuerda entrega,
            revisiones, plazo de alojamiento y soporte.
          </p>
          <p>
            <strong>Curador Pro:</strong> tus recomendaciones llegan a la comunidad de KORΛ con tu
            nombre. Las notas y colecciones personales siguen privadas.
          </p>
          <p>
            <strong>Scout:</strong> selección de talento y métricas agregadas solo cuando el artista
            las autorice. No incluye contactos privados ni cifras de audiencia externa.
          </p>
          <Link className="text-link" to="/legal/pagos">
            Ver condiciones de prestación ↗
          </Link>
        </div>
      </section>
      {account && (
        <section className="panel">
          <h2>Tus solicitudes</h2>
          {!store.requests.length ? (
            <p>Aún no has solicitado una activación.</p>
          ) : (
            <div className="request-list">
              {[...store.requests].reverse().map((r) => (
                <article key={r.id}>
                  <strong>
                    {plans.find((p) => p.id === r.plan)?.name} · {r.reference}
                  </strong>
                  <p>
                    {r.status === 'pending'
                      ? 'Pendiente de revisión'
                      : r.status === 'approved'
                        ? 'Revisada por el equipo'
                        : r.status === 'rejected'
                          ? 'No aprobada'
                          : 'Interés registrado'}
                    {r.isTest ? ' · Prueba' : ''}
                  </p>
                  <div className="action-row">
                    <a
                      className="text-link"
                      href={whatsappUrl(r)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Consultar por WhatsApp ↗
                    </a>
                    <button className="text-link" onClick={() => summary(r)}>
                      Descargar resumen
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
      {account && (
        <section className="panel waitlist">
          <p className="eyebrow">LO QUE VIENE</p>
          <h2>La escena sigue creciendo.</h2>
          <p>
            Déjanos avisarte cuando haya novedades del proyecto. No se envían mensajes automáticos
            desde esta pantalla.
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              setError('');
              try {
                await joinWaitlist();
                setWaiting(true);
              } catch (err) {
                setError(err instanceof Error ? err.message : 'No se pudo guardar.');
              } finally {
                setBusy(false);
              }
            }}
          >
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={consent}
                required
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>
                Autorizo al equipo a usar mi correo para novedades de KORΛ. Puedo solicitar la baja
                por WhatsApp.
              </span>
            </label>
            <button className="button secondary" disabled={busy || waiting || !consent}>
              {waiting ? 'Ya estás en la lista' : 'Quiero enterarme'}
            </button>
          </form>
        </section>
      )}
      {error && !plan && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {plan && (
        <Dialog
          title={request ? 'Tu solicitud está registrada' : 'Solicitar ' + plan.name}
          onClose={() => {
            setSelected(null);
            setError('');
          }}
        >
          {request ? (
            <>
              <p>
                Referencia <strong>{request.reference}</strong>. Estado: pendiente de revisión
                {request.isTest ? ' · cuenta de prueba' : ''}.
              </p>
              <p>
                Ahora puedes hablar con el equipo para confirmar el alcance y el pago. La solicitud
                no activa tu cuenta por sí sola.
              </p>
              <a
                className="button full"
                href={whatsappUrl(request)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Continuar en WhatsApp ↗
              </a>
              <button className="text-link" onClick={() => summary(request)}>
                Descargar resumen de solicitud
              </button>
            </>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                setError('');
                try {
                  setRequest(await createOrder(plan.id, method));
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'No se pudo registrar.');
                } finally {
                  setBusy(false);
                }
              }}
            >
              <p className="plan-dialog-price">
                {money(plan.price)} <small>{plan.period}</small>
              </p>
              <label>
                ¿Cómo prefieres coordinar el pago?
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as 'cash' | 'transfer')}
                >
                  <option value="transfer">Transferencia, por acordar con el equipo</option>
                  <option value="cash">Efectivo</option>
                </select>
              </label>
              <label className="checkbox-label">
                <input type="checkbox" required />
                <span>
                  Leí las{' '}
                  <Link to="/legal/pagos" target="_blank">
                    condiciones
                  </Link>
                  . Entiendo que es una solicitud pendiente y que debo confirmar la prestación antes
                  de pagar.
                </span>
              </label>
              {error && (
                <p role="alert" className="error">
                  {error}
                </p>
              )}
              <button className="button full" disabled={busy}>
                {busy ? 'Registrando…' : 'Registrar solicitud'}
              </button>
            </form>
          )}
        </Dialog>
      )}
    </div>
  );
}
