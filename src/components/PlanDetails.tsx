import type { Account } from '../core/types';
import { formatDate } from '../core/dates';
import { plans, trialRemaining } from '../core/plans';

export function PlanDetails({ account }: { account: Account }) {
  const trial = account.role === 'artist' && account.plan === 'free' && account.trialStartedAt;
  const trialStart = trial ? Date.parse(trial) : NaN;
  return (
    <section className="panel plan-details" aria-label="Vigencia de tu acceso">
      <h2>Tu acceso · {plans.find((p) => p.id === account.plan)?.name}</h2>
      <dl className="plan-dates">
        <div>
          <dt>Cuenta creada</dt>
          <dd>{formatDate(account.createdAt)}</dd>
        </div>
        {account.plan !== 'free' && (
          <>
            <div>
              <dt>Activación del plan</dt>
              <dd>{formatDate(account.planStartedAt)}</dd>
            </div>
            <div>
              <dt>Terminación del acceso</dt>
              <dd>
                {account.planUntil
                  ? formatDate(account.planUntil)
                  : 'Sin fecha registrada · consulta al equipo'}
              </dd>
            </div>
          </>
        )}
        {account.plan === 'free' && account.planUntil && (
          <div>
            <dt>Terminación del plan anterior</dt>
            <dd>{formatDate(account.planUntil)}</dd>
          </div>
        )}
        {trial && (
          <>
            <div>
              <dt>Inicio de prueba Artist</dt>
              <dd>{formatDate(trial)}</dd>
            </div>
            <div>
              <dt>Fin de prueba Artist</dt>
              <dd>
                {formatDate(
                  Number.isFinite(trialStart)
                    ? new Date(trialStart + 7 * 86400000).toISOString()
                    : undefined,
                )}
              </dd>
            </div>
          </>
        )}
      </dl>
      {trial && (
        <p>
          {trialRemaining(account) > 0
            ? `${trialRemaining(account)} días restantes de prueba.`
            : 'Tu prueba Artist terminó. Puedes guardar borradores y consultar los planes.'}
        </p>
      )}
      <p className="micro">
        Horas de Colombia. La solicitud y la activación son fechas distintas. No hay renovación ni
        cobro automático.
      </p>
    </section>
  );
}
