(() => {
  const status = document.querySelector('[data-share-status]');

  async function copyLink(url) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return true;
    }

    const input = document.createElement('textarea');
    input.value = url;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.append(input);
    input.select();
    const copied = document.execCommand('copy');
    input.remove();
    return copied;
  }

  document.addEventListener('click', async event => {
    const button = event.target.closest('[data-share-page]');
    if (!button) return;

    const payload = {
      title: document.title,
      text: document.querySelector('meta[name="description"]')?.content || 'KORΛ',
      url: document.querySelector('link[rel="canonical"]')?.href || window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(payload);
        if (status) status.textContent = 'Página compartida.';
        return;
      }

      const copied = await copyLink(payload.url);
      if (status) status.textContent = copied ? 'Enlace copiado.' : 'Copia el enlace desde la barra del navegador.';
    } catch (error) {
      if (error?.name === 'AbortError') return;
      try {
        const copied = await copyLink(payload.url);
        if (status) status.textContent = copied ? 'Enlace copiado.' : 'No se pudo copiar el enlace.';
      } catch {
        if (status) status.textContent = 'No se pudo compartir. Copia el enlace desde la barra del navegador.';
      }
    }
  });
})();
