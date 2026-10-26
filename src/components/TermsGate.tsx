import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../core/useApp';
import { Dialog } from './Dialog';
export function TermsGate() {
  const { account, acceptTerms, logout, legalVersion } = useApp();
  const { pathname } = useLocation();
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  if (!account?.needsConsent || pathname.startsWith('/legal/')) return null;
  return (
    <Dialog title="Antes de entrar a tu escena" onClose={logout}>
      <p>
        Bienvenido a KORΛ, {account.name}. Esta es una prueba compartida: tu cuenta se conserva en
        las hojas privadas del proyecto y lo que publiques como artista o curador será visible para
        otras personas.
      </p>
      <p className="micro">
        Versión {legalVersion}. Puedes leer los documentos antes de decidir. Cerrar esta ventana
        cierra tu sesión.
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!terms || !privacy) return;
          setBusy(true);
          setError('');
          try {
            await acceptTerms();
          } catch (err) {
            setError(err instanceof Error ? err.message : 'No se pudo registrar tu aceptación.');
          } finally {
            setBusy(false);
          }
        }}
      >
        <label className="checkbox-label">
          <input
            type="checkbox"
            required
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
          />
          <span>
            Leí y acepto los{' '}
            <Link to="/legal/terminos" target="_blank">
              términos de uso
            </Link>{' '}
            y las{' '}
            <Link to="/legal/licencia-musical" target="_blank">
              condiciones de derechos musicales
            </Link>
            .
          </span>
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            required
            checked={privacy}
            onChange={(e) => setPrivacy(e.target.checked)}
          />
          <span>
            Autorizo el tratamiento descrito en{' '}
            <Link to="/legal/privacidad" target="_blank">
              privacidad
            </Link>
            . La medición de actividad es opcional y se activa por separado en Mi cuenta.
          </span>
        </label>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <button className="button full" disabled={!terms || !privacy || busy}>
          {busy ? 'Guardando aceptación…' : 'Aceptar y entrar'}
        </button>
        <button type="button" className="text-link" onClick={logout}>
          Salir por ahora
        </button>
      </form>
    </Dialog>
  );
}
