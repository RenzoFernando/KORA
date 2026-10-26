import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../core/useApp';
import type { Role } from '../core/types';
import { Icon } from '../components/Icon';
export function AuthPage() {
  const { account, register, login } = useApp();
  const [params, setParams] = useSearchParams();
  const signup = params.get('modo') === 'registro';
  const initialRole = params.get('rol');
  const [role, setRole] = useState<Role>(
    initialRole === 'artist' ? 'artist' : initialRole === 'scout' ? 'scout' : 'explorer',
  );
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  if (account)
    return (
      <div className="page empty-state">
        <h1>Ya estás en tu escena.</h1>
        <Link className="button" to="/cuenta">
          Ir a mi cuenta
        </Link>
      </div>
    );
  return (
    <div className="page auth-page">
      <section className="auth-editorial">
        <p className="eyebrow">UN ENCUENTRO CON LO CERCANO</p>
        <h1>
          Cada escena
          <br />
          empieza
          <br />
          <em>contigo.</em>
        </h1>
        <p>
          Escucha con curiosidad.
          <br />
          Comparte con intención.
          <br />
          Haz que tu música llegue.
        </p>
        <div className="auth-emblem">
          <img src="/branding/01_isotipo_positivo.svg" alt="" />
        </div>
        <span className="micro">Cali primero. Colombia en el horizonte.</span>
      </section>
      <section className="panel auth-panel">
        <div className="tabs">
          <button
            className={!signup ? 'active' : ''}
            onClick={() => {
              setParams({});
              setError('');
            }}
          >
            Iniciar sesión
          </button>
          <button
            className={signup ? 'active' : ''}
            onClick={() => {
              setParams({ modo: 'registro' });
              setError('');
            }}
          >
            Crear cuenta
          </button>
        </div>
        <h2>{signup ? 'Un lugar en la escena.' : 'Qué bueno volver.'}</h2>
        <p className="muted">
          {signup
            ? 'Una cuenta propia. Tu manera de vivir la música.'
            : 'Tu música y tus hallazgos, donde estés.'}
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError('');
            setBusy(true);
            const data = new FormData(e.currentTarget);
            try {
              if (signup) {
                await register(
                  String(data.get('name')),
                  String(data.get('email')),
                  String(data.get('password')),
                  role,
                );
                navigate(role === 'artist' ? '/studio' : role === 'scout' ? '/scout' : '/discover');
              } else {
                await login(String(data.get('email')), String(data.get('password')));
                navigate('/cuenta');
              }
            } catch (err) {
              setError(err instanceof Error ? err.message : 'No pudimos completar la solicitud.');
            } finally {
              setBusy(false);
            }
          }}
        >
          {signup && (
            <>
              <label>
                Tu nombre o nombre artístico
                <input
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={80}
                  placeholder="Cómo te conocemos"
                />
              </label>
              <fieldset className="role-options">
                <legend>¿Cómo llegas a KORΛ?</legend>
                {(
                  [
                    ['explorer', 'Escucho y descubro', 'compass'],
                    ['artist', 'Hago música', 'music'],
                    ['scout', 'Busco talento', 'chart'],
                  ] as const
                ).map(([value, label, icon]) => (
                  <label key={value} className={role === value ? 'selected' : ''}>
                    <input
                      type="radio"
                      name="role"
                      value={value}
                      checked={role === value}
                      onChange={() => setRole(value)}
                    />
                    <Icon name={icon} />
                    <span>{label}</span>
                  </label>
                ))}
              </fieldset>
            </>
          )}
          <label>
            Correo electrónico
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              maxLength={160}
              placeholder="tu@correo.com"
            />
          </label>
          <label>
            Contraseña
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete={signup ? 'new-password' : 'current-password'}
              required
              minLength={8}
              maxLength={200}
              placeholder="Mínimo 8 caracteres"
            />
          </label>
          <button
            className="text-link password-toggle"
            type="button"
            aria-pressed={showPassword}
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          </button>
          {signup && (
            <label className="checkbox-label">
              <input type="checkbox" required name="consent" />
              <span>
                Acepto los{' '}
                <Link to="/legal/terminos" target="_blank">
                  términos
                </Link>{' '}
                y el tratamiento descrito en{' '}
                <Link to="/legal/privacidad" target="_blank">
                  privacidad
                </Link>
                .
              </span>
            </label>
          )}
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button className="button full" disabled={busy} type="submit">
            {busy ? 'Un momento…' : signup ? 'Crear mi cuenta' : 'Entrar'}
            <Icon name="arrow" size={17} />
          </button>
        </form>
        <p className="micro auth-local">
          <Icon name="shield" size={16} />
          Usa una contraseña exclusiva para KORΛ. Si necesitas recuperar el acceso, contacta al
          equipo.
        </p>
      </section>
    </div>
  );
}
