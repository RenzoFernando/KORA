import { isPhonePlatform } from '../core/platform';
import { useEffect, useState } from 'react';
type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};
export function PwaStatus() {
  const phone = isPhonePlatform(
    navigator.userAgent,
    (navigator as Navigator & { userAgentData?: { mobile?: boolean } }).userAgentData?.mobile,
  );
  const [install, setInstall] = useState<InstallEvent>();
  const [online, setOnline] = useState(navigator.onLine);
  const [update, setUpdate] = useState<ServiceWorker>();
  const [help, setHelp] = useState(false);
  const [installed, setInstalled] = useState(matchMedia('(display-mode: standalone)').matches);
  useEffect(() => {
    const available = (e: Event) => {
      e.preventDefault();
      setInstall(e as InstallEvent);
    };
    const done = () => {
      setInstalled(true);
      setInstall(undefined);
    };
    const network = () => setOnline(navigator.onLine);
    const ready = (e: Event) => setUpdate((e as CustomEvent<ServiceWorker>).detail);
    window.addEventListener('beforeinstallprompt', available);
    window.addEventListener('appinstalled', done);
    window.addEventListener('online', network);
    window.addEventListener('offline', network);
    window.addEventListener('korlambda-update', ready);
    return () => {
      window.removeEventListener('beforeinstallprompt', available);
      window.removeEventListener('appinstalled', done);
      window.removeEventListener('online', network);
      window.removeEventListener('offline', network);
      window.removeEventListener('korlambda-update', ready);
    };
  }, []);
  return (
    <>
      {!online && (
        <div className="connection-banner" role="status">
          Estás sin conexión. Puedes explorar el catálogo incluido; el audio oficial y los cambios
          de cuenta necesitan Internet.
        </div>
      )}
      {update && (
        <div className="connection-banner">
          Hay una versión nueva.{' '}
          <button
            className="text-link"
            onClick={() => update.postMessage({ type: 'SKIP_WAITING' })}
          >
            Actualizar KORΛ
          </button>
        </div>
      )}
      {phone && !installed && (
        <div className="install-strip">
          <span>KORΛ, a un toque de tu escena.</span>
          <button
            className="text-link"
            onClick={async () => {
              if (install) {
                await install.prompt();
                const choice = await install.userChoice;
                if (choice.outcome === 'accepted') setInstall(undefined);
              } else setHelp((v) => !v);
            }}
          >
            Instalar aplicación ↗
          </button>
          {help && (
            <p>
              En Chrome abre el menú ⋮ y elige «Instalar aplicación» o «Añadir a pantalla de
              inicio». En iPhone, usa Safari → Compartir → Añadir a inicio. Se necesita abrir la
              dirección HTTPS compartida.
            </p>
          )}
        </div>
      )}
    </>
  );
}
