# KORΛ en Cloudflare Pages

La aplicación sigue siendo React + Vite. No se ha publicado en Cloudflare en esta revisión; el enlace actual de prueba se conserva.

## Subida directa, sin Git

1. En Cloudflare abre Workers & Pages y crea un proyecto Pages con Direct Upload.
2. Usa un nombre de proyecto disponible. Si kora está disponible, podrá generar kora.pages.dev; no se ha comprobado ni reservado ese nombre.
3. Sube KORΛ-Cloudflare-Pages.zip de la carpeta outputs. El ZIP contiene index.html, assets, iconos, branding y configuración pública en su raíz. No subas la carpeta completa KORA-2.
4. Abre la URL HTTPS y comprueba /discover, /acceso y una página de lanzamiento también al recargar directamente.
5. En el teléfono, abre la URL de Cloudflare en Chrome y usa el botón Instalar aplicación si el navegador lo ofrece.

Las cuentas y planes permanecen en las mismas hojas privadas, mediante la URL pública de Apps Script en runtime-config.json. Cambiar de dominio pide iniciar sesión otra vez; conserva el contenido de la cuenta. Las preferencias son de cada dispositivo.

## Recompilar una actualización

Ejecuta npm ci y npm run build dentro de KORA-2. Empaqueta únicamente el contenido de dist en un nuevo ZIP y súbelo como actualización del mismo proyecto Pages. Si después eliges conexión Git, el comando de compilación es npm run build y la carpeta de salida dist. Usa una versión de Node compatible con Vite 8 (el proyecto se comprobó con Node 24).

## Archivos de publicación

- _redirects devuelve la aplicación para las rutas de React.
- _headers evita cachear configuración de conexión y fuerza revisar actualizaciones del service worker.
- El service worker excluye _headers, _redirects, runtime-config.json y todas las peticiones a otros orígenes. No almacena cuentas, tokens, respuestas de Apps Script ni audio externo.
- No se incluyen backend, documentos privados, adjuntos originales o contraseñas.

## Reproducción

Bandcamp se carga directamente al seleccionar un lanzamiento. Mantiene sus controles oficiales; no existe aquí un controlador externo de Bandcamp ni se extraen streams. Los archivos autorizados cargados por artistas usan el reproductor KORΛ, con pausa, progreso, saltos de 15 segundos y volumen. Contraer o navegar conserva el reproductor; Detener y quitar se ofrece en su menú.

Referencias oficiales: https://developers.cloudflare.com/pages/get-started/direct-upload/ y https://developers.cloudflare.com/pages/configuration/serving-pages/
