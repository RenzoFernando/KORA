# KORΛ

Aplicación web de KORΛ desarrollada con HTML, CSS y JavaScript, con interfaz responsive, acceso por perfiles y despliegue en GitHub Pages.

## Equipo Maracuyá KORΛ

- Johan
- Karold
- Luna
- Renzo

Los perfiles de integrantes usan avatares propios y diferenciados. Los perfiles adicionales de exploración por rol son identidades ficticias creadas únicamente para mostrar los distintos recorridos de la interfaz.

## Identidad visual

Los recursos oficiales de marca viven en `branding/`. Los 26 SVG de esa carpeta son assets finales entregados por diseño y no deben editarse. La interfaz usa el nombre `KORΛ` como texto en navegación y reserva los SVG oficiales para contextos puntuales donde el isotipo aporte valor.

La interfaz toma como base el naranja KORΛ (`#F1871C`) y suma los acentos azul, turquesa, verde, rosa, error y éxito definidos en la guía visual. El tema claro usa blanco como fondo predominante y el tema oscuro parte de `#0F0F12`.

## Rutas públicas e indexación

El área funcional de la aplicación conserva sus rutas existentes y permanece fuera del índice para evitar que estados de sesión o contenido personalizado compitan con las páginas públicas. El contenido orgánico se organiza en URLs limpias:

- `/descubrir/`: explicación principal del descubrimiento musical.
- `/para-artistas/`: publicación, contexto, licencia y visibilidad para artistas.
- `/para-empresas/`: radar de talento, escenas y señales agregadas autorizadas.
- `/equipo/`: Equipo Maracuyá KORΛ e integrantes confirmados.
- `/legal/terminos/`, `/legal/privacidad/`, `/legal/licencia-musical/` y `/legal/pagos/`: documentos legales canónicos.

`legal.html?doc=...` se mantiene por compatibilidad, pero lleva `noindex` y enlaza a las rutas legales limpias.

## SEO técnico

`seo.config.mjs` centraliza la URL pública y las rutas indexables. `scripts/generate-seo.mjs` genera `robots.txt`, `sitemap.xml`, `llms.txt` y `site.webmanifest`. `scripts/seo-check.mjs` valida títulos y descripciones únicos, un solo H1, canonical, JSON-LD, FAQ, alt de imágenes, robots y sitemap.

Comandos disponibles sin dependencias adicionales:

```bash
node scripts/generate-seo.mjs
node scripts/generate-seo.mjs --check
node scripts/seo-check.mjs
node scripts/build.mjs
```

El workflow `.github/workflows/seo-quality.yml` ejecuta esas validaciones, comprueba la sintaxis JavaScript y construye la versión estática.

## Estructura de estilos

`css/styles.css` funciona únicamente como punto de entrada para la aplicación. Los estilos están separados por responsabilidad:

- `css/tokens.css`: colores, temas y tokens visuales.
- `css/base.css`: reset, tipografía y formularios.
- `css/shell.css`: sidebar, topbar y navegación.
- `css/components.css`: botones, tarjetas, listas, modales y controles.
- `css/views.css`: descubrir, reproductor, comunidad, perfiles y pagos.
- `css/auth-legal.css`: acceso, consentimiento y documentos legales internos.
- `css/responsive.css`: adaptación tablet y móvil.
- `css/public.css`: páginas públicas, contenido SEO y CTA móvil.

## Estructura de JavaScript

`js/app.js` conserva la inicialización y los eventos globales. La lógica principal se divide en scripts clásicos cargados en orden desde `index.html`:

- `js/app/core.js`: estado, utilidades y estructura global de la aplicación.
- `js/app/discover-player.js`: descubrimiento, guardados y reproducción.
- `js/app/community-account.js`: comunidad, facturación y perfiles por rol.
- `js/app/overlays.js`: ajustes, notificaciones, modales y bienvenida.
- `js/public.js`: compartir páginas públicas mediante Web Share API con fallback de copiado.

## Assets

Las rutas de runtime son `img/` para imágenes y `audio/` para audio. Los cuatro integrantes usan avatares circulares con paletas distintas y los artistas utilizan portadas de lanzamiento. Los SVG de `branding/` quedan separados de estos recursos y no se modifican desde la interfaz.
