# KORΛ

Aplicación web de KORΛ desarrollada con HTML, CSS y JavaScript, con interfaz responsive, autenticación y despliegue en GitHub Pages.

## Integrantes

- Johan
- Karold
- Luna
- Renzo

## Identidad visual

Los recursos oficiales de marca viven en `branding/`. Los SVG de esa carpeta son assets finales entregados por diseño y no deben editarse. La interfaz usa el nombre `KORΛ` como texto en navegación y reserva los SVG oficiales para contextos puntuales donde el isotipo aporte valor.

La interfaz toma como base el naranja KORΛ (`#F1871C`) y suma los acentos azul, turquesa, verde, rosa, error y éxito definidos en la guía visual. El tema claro usa blanco como fondo predominante y el tema oscuro parte de `#0F0F12`.

## Estructura de estilos

`css/styles.css` funciona únicamente como punto de entrada. Los estilos están separados por responsabilidad:

- `css/tokens.css`: colores, temas y tokens visuales.
- `css/base.css`: reset, tipografía y formularios.
- `css/shell.css`: sidebar, topbar y navegación.
- `css/components.css`: botones, cards, listas, modales y controles.
- `css/views.css`: descubrir, player, comunidad, perfiles y pagos.
- `css/auth-legal.css`: login, consentimiento y documentos legales.
- `css/responsive.css`: adaptación tablet y móvil.

## Estructura de JavaScript

`js/app.js` conserva la inicialización y los eventos globales. La lógica principal se divide en scripts clásicos cargados en orden desde `index.html`:

- `js/app/core.js`: estado, utilidades y chrome de la aplicación.
- `js/app/discover-player.js`: descubrimiento, guardados y reproducción.
- `js/app/community-account.js`: comunidad, facturación y perfiles por rol.
- `js/app/overlays.js`: ajustes, notificaciones, modales y onboarding.

## Assets

Las rutas de runtime son `img/` para imágenes y `audio/` para audio. Los perfiles del equipo usan únicamente sus cuatro ilustraciones correspondientes y los artistas utilizan sus portadas como avatar para evitar reutilizar retratos de personas ajenas al lanzamiento.

Los archivos de `img/` que no estén referenciados desde HTML, CSS o JavaScript pueden eliminarse del proyecto sin afectar la aplicación. La carpeta `branding/` no debe limpiarse ni modificarse.

### Limpieza de imágenes heredadas

Después de copiar los archivos actualizados, ejecuta una sola vez desde PowerShell:

```powershell
.\cleanup-unused-img.ps1
```

El script elimina únicamente los 16 SVG de `img/` que ya no tienen referencias en la aplicación. No toca `branding/`, las nueve portadas activas ni los cuatro avatares del equipo.
