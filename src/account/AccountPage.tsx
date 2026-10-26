import { cloudCall } from '../core/cloud';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../core/useApp';
import { Dialog } from '../components/Dialog';
import { Icon } from '../components/Icon';
import { trialRemaining, plans } from '../core/plans';
export function AccountPage() {
  const { account, store, update, logout, exportData, deleteAccount, notify, refresh } = useApp();
  const [remove, setRemove] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  if (!account)
    return (
      <div className="page empty-state">
        <h1>Tu espacio empieza con una cuenta.</h1>
        <Link className="button" to="/acceso">
          Entrar o crear cuenta
        </Link>
      </div>
    );
  const roleLabel = { explorer: 'Explorador musical', artist: 'Artista', scout: 'Empresa / Scout' }[
    account.role
  ];
  return (
    <div className="page narrow-page">
      <p className="eyebrow">TU ESPACIO EN KORΛ</p>
      <div className="intro-line">
        <h1>Hola, {account.name.split(' ')[0]}.</h1>
        <button
          className="button secondary small"
          onClick={() => {
            logout();
            navigate('/discover');
          }}
        >
          <Icon name="logout" size={16} />
          Cerrar sesión
        </button>
      </div>
      <div className="account-overview panel">
        <span className="avatar large">{account.name[0].toUpperCase()}</span>
        <div>
          <h2>{account.name}</h2>
          <p>{account.email}</p>
          <span className="tag">{roleLabel}</span>{' '}
          <span className="tag">
            {account.plan === 'free' && account.role !== 'explorer'
              ? 'Sin suscripción'
              : plans.find((p) => p.id === account.plan)?.name}
            {account.isTest ? ' · Cuenta de prueba' : ''}
          </span>
          {account.role === 'artist' && (
            <p className="micro">Prueba Artist: {trialRemaining(account)} días restantes.</p>
          )}
        </div>
      </div>
      <section className="panel">
        <h2>Tu perfil</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const saved = await update((s) => ({
              ...s,
              accounts: s.accounts.map((a) =>
                a.id === account.id
                  ? {
                      ...a,
                      name: String(data.get('name')).trim(),
                      bio: String(data.get('bio')).trim(),
                    }
                  : a,
              ),
            }));
            if (saved) notify('Perfil guardado en tu cuenta.');
          }}
        >
          <label>
            Nombre
            <input name="name" defaultValue={account.name} required maxLength={80} />
          </label>
          <label>
            Sobre ti
            <textarea name="bio" defaultValue={account.bio || ''} rows={3} maxLength={700} />
          </label>
          <button className="button small" type="submit">
            Guardar perfil
          </button>
        </form>
      </section>
      <section className="panel">
        <h2>A tu manera</h2>
        <div className="settings-row">
          <div>
            <strong>Apariencia</strong>
            <p>Elige el ambiente que prefieres.</p>
          </div>
          <select
            aria-label="Tema de la interfaz"
            value={store.settings.theme}
            onChange={(e) =>
              update((s) => ({
                ...s,
                settings: { ...s.settings, theme: e.target.value as 'light' | 'dark' | 'system' },
              }))
            }
          >
            <option value="system">Seguir sistema</option>
            <option value="light">Claro</option>
            <option value="dark">Oscuro</option>
          </select>
        </div>
        <label className="settings-row">
          <div>
            <strong>Medición opcional de actividad</strong>
            <p>
              Permite contar visitas, aperturas de reproductores y clics desde ahora. Sin IP, sin
              identificadores de oyentes únicos. Se aplica a este dispositivo y registra eventos
              agregados en la hoja del proyecto. Google y las plataformas externas tratan datos
              técnicos conforme a sus políticas.
            </p>
          </div>
          <input
            type="checkbox"
            className="toggle"
            checked={store.settings.analytics}
            onChange={(e) =>
              update((s) => ({ ...s, settings: { ...s.settings, analytics: e.target.checked } }))
            }
          />
        </label>
        <p className="micro">
          Desactivar detiene nuevos registros desde este dispositivo. Si eres artista, puedes
          retirar los eventos agregados de tus lanzamientos.
        </p>
        <button
          className="text-link danger"
          disabled={account.role !== 'artist'}
          onClick={async () => {
            try {
              await cloudCall('metrics.clear');
              await refresh();
              notify('Eventos de tus lanzamientos eliminados.');
            } catch (err) {
              notify(err instanceof Error ? err.message : 'No se pudo eliminar.');
            }
          }}
        >
          Eliminar eventos de mis lanzamientos
        </button>
      </section>
      <section className="panel">
        <h2>Tus datos, contigo.</h2>
        <p>
          Exporta tu perfil, notas, guardados y lanzamientos en JSON. Los archivos de audio e imagen
          se exportan desde Studio.
        </p>
        <div className="action-row">
          <button className="button secondary small" onClick={exportData}>
            <Icon name="download" size={16} />
            Exportar mis datos
          </button>
          <Link className="text-link" to="/legal/privacidad">
            Leer política de privacidad <Icon name="arrow" size={16} />
          </Link>
        </div>
      </section>
      <section className="panel danger-panel">
        <h2>Eliminar cuenta compartida</h2>
        <p>
          Elimina esta cuenta y sus registros del proyecto; retira sus archivos de la carpeta activa
          de Drive. No modifica cuentas de servicios externos.
        </p>
        <button className="text-link danger" onClick={() => setRemove(true)}>
          Eliminar mi cuenta
        </button>
      </section>
      {remove && (
        <Dialog title="Eliminar tu cuenta de KORΛ" onClose={() => setRemove(false)}>
          <p>
            Se retirarán tus registros y archivos de esta prueba. Las copias que hayas descargado
            siguen bajo tu control. Escribe ELIMINAR para confirmar.
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await deleteAccount();
                navigate('/discover');
              } catch {
                setError(
                  'No pudimos eliminar los archivos. Exporta tus datos y vuelve a intentarlo.',
                );
              }
            }}
          >
            <label>
              Confirmación
              <input name="confirm" required pattern="ELIMINAR" autoComplete="off" />
            </label>
            {error && (
              <p role="alert" className="error">
                {error}
              </p>
            )}
            <button className="button danger-button" type="submit">
              Eliminar definitivamente
            </button>
          </form>
        </Dialog>
      )}
    </div>
  );
}
