# Prueba compartida KORΛ

Sitio de prueba: https://korlambda-pruebas.prettyskink128.chatgpt.site

## Hojas privadas

Operaciones: https://docs.google.com/spreadsheets/d/1B8oXPKOZ7glj5rZYtidjxo0-nN5f0E3LHlgnXBqGjBk/edit
Catálogo: https://docs.google.com/spreadsheets/d/1x1xKeYkDLWZcvYWoQ94XNmttjZCmSHN4SfvIQkAFytw/edit

No compartir por enlace ninguna hoja. La API devuelve únicamente los campos públicos autorizados del catálogo. La hoja de operaciones contiene los controles de acceso y registros privados.

## Activar desde el celular

En Operaciones → Usuarios, ubica el correo. Cambia premium a TRUE para conceder el plan de su perfil; FALSE vuelve al gratuito. Elige plan: curator para explorador, artist o kit para artista, scout para empresa. status debe ser active; inactive suspende la cuenta. plan_until vacío no agrega vencimiento, o usa fecha ISO como 2026-11-25T23:59:59-05:00. No modifiques id, fechas de consentimiento, sal, hash ni is_admin.

La aplicación comprueba cambios al volver a la ventana y cada 30 segundos si permanece visible. La activación es manual; una solicitud no confirma ni procesa un pago. Conserva el soporte de cualquier revisión fuera del catálogo.

## Instalar en teléfono

Abre el sitio HTTPS en Chrome, visita Discover y elige Instalar aplicación cuando Chrome lo ofrezca, o menú ⋮ → Instalar aplicación / Añadir a pantalla de inicio. En iPhone, Safari → Compartir → Añadir a inicio. La PWA conserva interfaz y catálogo incorporado, pero necesita Internet para iniciar sesión, sincronizar y escuchar fuentes externas.

## Pruebas y límites

10 pruebas de dominio y 13 del backend aislado correctas. Verificadas las ocho cuentas contra la API desplegada, las 26 entradas públicas, guardado privado entre dos sesiones, carga y lectura privada en Drive, solicitudes pendientes, avisos y lista voluntaria con una cuenta QA temporal eliminada al terminar. Confirmadas ambas hojas privadas. No se aceptaron los términos de las cuentas iniciales por sus titulares.

No se ha probado la instalación en un teléfono físico. La automatización del navegador se detuvo al no poder verificar la URL de Opera con seguridad; se completaron comprobaciones de API, compilación, recursos, permisos y entrega HTTP. No se afirma una prueba visual completa de navegador en esta revisión.

La página de artista usa la historia del primer lanzamiento activo, y no publica todavía la biografía privada del perfil. Sin push, correo verificado, recuperación de clave ni conciliación bancaria automática.
