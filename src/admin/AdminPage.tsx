import { Link } from 'react-router-dom';
import { useApp } from '../core/useApp';
export function AdminPage() {
  const { store, isAdmin, update, adminOverview, remoteStatus } = useApp();
  if (!isAdmin)
    return (
      <div className="page empty-state">
        <h1>Acceso interno restringido.</h1>
        <Link className="button secondary" to="/discover">
          Volver a Discover
        </Link>
      </div>
    );
  return (
    <div className="page">
      <p className="eyebrow">ADMINISTRACIÓN · PRUEBA COMPARTIDA</p>
      <h1>El pulso del proyecto.</h1>
      <p className="notice">
        {remoteStatus} · Solo tu cuenta administradora recibe este resumen. Las cuentas de prueba se
        identifican en la hoja.
      </p>
      <div className="metrics-grid">
        {[
          [adminOverview?.accounts || 0, 'Cuentas'],
          [adminOverview?.releases || 0, 'Lanzamientos aportados'],
          [adminOverview?.requests || 0, 'Solicitudes registradas'],
          [
            adminOverview?.approvedPayments || 0,
            'Solicitudes marcadas como revisadas, fuera de prueba',
          ],
        ].map(([count, label]) => (
          <div className="panel" key={label}>
            <h2>{count}</h2>
            <p>{label}</p>
          </div>
        ))}
      </div>
      <section className="panel">
        <h2>Activar o suspender una cuenta</h2>
        <p>
          En «Usuarios», cambia premium a TRUE para habilitar el plan del perfil, o a FALSE para
          volver al gratuito. plan permite curator, artist, scout o kit. status: inactive suspende
          el acceso. plan_until es opcional y admite fecha ISO. La app comprueba cambios al volver a
          la ventana y cada 60 segundos mientras está abierta.
        </p>
        <p>
          Revisar una solicitud y activar premium son decisiones separadas. Marcar una solicitud no
          confirma un pago bancario ni genera una factura.
        </p>
        <p className="micro">
          Mantén la hoja de operaciones privada. No cambies las columnas de contraseñas ni is_admin
          desde cuentas de prueba.
        </p>
      </section>
      <section className="panel">
        <h2>Moderación del catálogo</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Lanzamiento</th>
                <th>Artista</th>
                <th>Visibilidad</th>
              </tr>
            </thead>
            <tbody>
              {(adminOverview?.catalog || []).map((r) => (
                <tr key={r.id}>
                  <td>{r.title}</td>
                  <td>{r.artist}</td>
                  <td>
                    <button
                      className="text-link"
                      onClick={async () => {
                        await update((s) => ({
                          ...s,
                          hidden: s.hidden.includes(r.id)
                            ? s.hidden.filter((id) => id !== r.id)
                            : [...s.hidden, r.id],
                        }));
                      }}
                    >
                      {store.hidden.includes(r.id) ? 'Restaurar' : 'Ocultar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
