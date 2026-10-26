# KORΛ · Discover + Studio

Proyecto independiente en React + Vite + TypeScript. El original KORA y la landing kora-discover se consultaron en lectura. No se inicializó Git, no se creó rama y no se publicó nada.

## Abrir en Windows

Haz doble clic en **INICIAR-KORA-2.cmd**, o abre una terminal en esta carpeta y ejecuta:

~~~powershell
npm install
npm run dev -- --open
~~~

URL: http://127.0.0.1:5188. Mantén la ventana del servidor abierta mientras uses la aplicación. Para detenerla, Ctrl+C. Si necesitas cambiar el puerto, ten presente que las cuentas y archivos están ligados al origen y no se trasladan automáticamente.

Node usado: 24.19.0. Dependencias resueltas en package-lock.json. No usa Next.js, bases de datos remotas, SDK de pagos ni un servidor de identidad.

## Lo que funciona

- Discover: seis fichas editoriales de artistas reales vinculados a Cali, búsqueda por nombre/sonido, filtro por ciudad y género; ciudades sin resultados muestran un estado vacío honesto.
- Reproductor persistente: Bandcamp oficial bajo acción explícita; audio nativo de archivos con autorización declarada, duración y progreso reales, volumen, cola y vista ampliada con foco controlado.
- Cuentas propias locales: registro por rol, inicio/cierre de sesión, contraseñas PBKDF2 con sal, preferencias y eliminación de cuenta. Sin usuarios precargados ni correos verificados ficticiamente.
- Biblioteca: guardados, notas y colecciones privadas por cuenta. Curador Pro permite recomendaciones en la comunidad de este navegador.
- Studio: borrador, edición, activación, archivo, portada, enlaces, QR, bio page y exportación de kit HTML autónomo. El kit puede incluir el archivo de audio autorizado y la portada aportados por el autor.
- Planes: precios tentativos, interés local sin venta, simulación explícita y cupos. Artist: siete días de prueba y cinco activos; Kit: uno; Scout requiere su plan simulado para el recorrido avanzado.
- Analítica: visitas, clics, aperturas de embed e inicios nativos con consentimiento, sin estimaciones ni oyentes inventados. No se afirma medir lo que ocurre dentro de Bandcamp.
- Scout: selección exportable y métricas agregadas únicamente de contenido autorizado.
- Documentos legales adaptados al alcance local; originales preservados como referencia.

## Estructura

~~~text
src/
  core/         tipos, catálogo, cuentas, planes, persistencia, integraciones
  components/   estructura, botones gráficos, tarjetas, ventanas y arte editorial
  discover/     descubrimiento, artistas, lanzamientos, biblioteca, curaduría
  player/       audio nativo y reproductores oficiales persistentes
  studio/       editor, catálogo propio, bio, métricas, exportación
  account/      registro, acceso, preferencias y planes
  scout/        radar con permisos
  admin/        moderación interna de desarrollo
  legal/        términos, privacidad, derechos y condiciones
  styles/       tokens, base, estructura, módulos y adaptación
public/branding/ los 26 SVG originales sin editar
tests/           reglas de negocio y seguridad de enlaces
integrations/    plantillas sin conectar de Sheets/Apps Script
docs/            plan, auditoría, contexto, validación y referencias originales
~~~

## Datos y límites

localStorage conserva metadatos, cuentas, sesiones y preferencias. IndexedDB conserva audio e imagen. Borrar datos del navegador elimina su disponibilidad. Las exportaciones JSON excluyen hash y sal de la contraseña; el kit HTML es una copia separada bajo control del usuario. Autenticación y permisos locales son simulación de aplicación, no seguridad de producción.

No hay ventas reales, alojamiento, sincronización entre dispositivos, analítica global ni operaciones privadas conectadas. Los QR apuntan al servidor local; no funcionarán desde otro teléfono mientras la página solo exista en este computador. Para compartir fuera puede usarse la exportación HTML, con enlaces oficiales o material propio autorizado.

## Integraciones pendientes

Lee docs/GOOGLE-SHEETS.md. .env.example define VITE_CATALOG_URL para un endpoint público de catálogo autorizado y VITE_OPERATIONS_FORM_URL para abrir un Form privado. Ambos están vacíos. No pongas secretos en variables VITE_. No se creó ni modificó ninguna hoja de Google.

Administración interna: en desarrollo, configura VITE_LOCAL_ADMIN_EMAIL en .env.local con el correo de una cuenta que hayas creado y reinicia Vite. La ruta /interno permanece restringida mientras no lo hagas. No se expone un selector público de administrador; esta verificación local no es un control de seguridad para producción.

## Validar

~~~powershell
npm test
npm run build
npm run format:check
~~~

Las pruebas cubren ventanas de siete días, cupos, separación entre cuentas, filtros, URLs, IDs de embed y derivación de contraseñas. Los recorridos de navegador y sus límites están registrados en docs/VALIDACION.md.

Identidad escrita: **KORΛ**, con lambda mayúscula. Naranja #F1871C. SVG originales protegidos por verificación de hash. Fuente tipográfica del sistema, sin peticiones externas de fuentes.
