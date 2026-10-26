export function registerPwa() {
  if (!('serviceWorker' in navigator) || !import.meta.env.PROD) return;
  window.addEventListener('load', () => {
    void navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        const notify = () => {
          if (reg.waiting && navigator.serviceWorker.controller)
            window.dispatchEvent(new CustomEvent('korlambda-update', { detail: reg.waiting }));
        };
        notify();
        reg.addEventListener('updatefound', () =>
          reg.installing?.addEventListener('statechange', notify),
        );
      })
      .catch(() => {});
    let reloading = false;
    let alreadyControlled = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!alreadyControlled) {
        alreadyControlled = true;
        return;
      }
      if (!reloading) {
        reloading = true;
        location.reload();
      }
    });
  });
}
