> Actualización 26/10/2026: trabajo retomado; revisión publicada como versión 3. Consultar ESTADO-ACTUAL.md (proyecto) o ESTADO-KORΛ.md (outputs). Lo siguiente es el checkpoint histórico.

# Continuación de KORΛ · pausa solicitada por el usuario

El usuario pidió terminar, guardar todo y apagar; retomar mañana. No hacer más cambios durante esta pausa.

Proyecto principal: C:\Users\renzi\WebstormProjects\KORA-2. KORA y kora-discover no se modifican.

ESTADO LOCAL
- Todos los cambios están guardados en los archivos del proyecto.
- Se quitó el aviso de instalación en escritorio, la insignia de prueba en cabecera y las etiquetas repetidas de arte editorial.
- Studio visible para invitados y artistas. Selector de ciudad accesible con teclado y menú propio. Letras ampliadas, nueva portada y tarjetas legibles. Mostrar contraseña en acceso.
- Bandcamp se carga al seleccionar, conserva su iframe al navegar o cambiar tema y mantiene sus controles oficiales. No hay API documentada de playback implementada ni extracción de streams. Los controles propios completos son para archivos autorizados.
- Reproductor propio: inicio al cargar si el navegador permite, pausa, progreso, volumen y saltos ±15 segundos. Una sola X ampliada contrae sin detener. Detener y quitar está en el menú.
- Kit HTML incluye QR y audio/imagen autorizados cuando corresponde; muestra preparación y confirmación. QR de borrador avisa que es privado.
- public/_redirects y _headers preparados para Pages; el SW los excluye de caché junto a runtime-config.json y todos los otros orígenes.
- 12 pruebas de dominio/plataforma y 18 del backend aislado pasaron. TypeScript, formato y compilación pasaron. Última compilación: index-Gw7YAIHE.js, index-DboLvQ2P.css, 93 módulos.

VERIFICACIÓN REAL
- Las ocho credenciales se comprobaron contra Apps Script. No se cambiaron sus contraseñas ni planes.
- Se inició sesión como explorador desde la interfaz; aparecieron términos pendientes y se salió sin aceptarlos por el usuario.
- Una cuenta técnica temporal y un WAV silencioso de 60 segundos, en borrador privado, permitieron comprobar inicio, pausa, ±15 segundos, volumen 0.74 y continuidad de posición 45.8 s al volver a Discover. El kit terminó de generarse con QR. La cuenta, borrador, sesiones y archivo se retiraron al terminar; native-player-session.json se eliminó. Nunca entró al catálogo público de 26 entradas.
- Bandcamp mostró el reproductor y timeline; el control de navegador no pudo pulsar dentro del iframe por coordenadas fraccionarias. No afirmar prueba de audio externo ni control externo de Bandcamp.
- Capturas de esta revisión en outputs/KORΛ-revision-inicio.png y KORΛ-revision-catalogo.png. No hay prueba en teléfono físico.

PUBLICACIÓN PENDIENTE
- El sitio público todavía está en la versión 2 ANTERIOR a esta revisión: https://korlambda-pruebas.prettyskink128.chatgpt.site
- No se publicó esta revisión porque el usuario pidió terminar.
- Sites project_id: appgprj_6adec8a1b31c8191a2738a2fb52fa898, acceso public.
- Checkout de publicación separado: work/online/site-source. Se abrió con site-workflow y remoto actual 91800b6fbaf49767b5d20e9abc030b9f76bb3863. Tiene cambios locales de preparación; NO publicar ese paquete sin volver a copiar el último src/dist de KORA-2.
- Para retomar, leer skill Sites, obtener credencial NUEVA (la anterior solo estaba en memoria), abrir/reconciliar checkout, ejecutar stage-revision.mjs tras compilar, escanear exclusión de contraseñas, guardar/push con helper por stdin, guardar versión y desplegar en el mismo sitio. No crear otro sitio ni publicar GitHub.
- Apps Script ya funciona como versión 2. No pedir al usuario que repita la activación.
- Cloudflare se prepara para DESPUÉS, no se desplegó allí ni se reservó kora.pages.dev. Guía en docs/CLOUDFLARE-PAGES.md y outputs/CLOUDFLARE-KORΛ.md. El ZIP contiene solo dist y se actualiza al guardar esta pausa.

ACCESOS Y PRIVACIDAD
- Ocho accesos en outputs/ACCESOS-KORΛ.md y CREDENCIALES-KORΛ-PRUEBAS.txt. Son privados; NO incluir en sitio, ZIP o repositorios públicos. El usuario pidió ver los ocho en una tabla: entregar directamente o enlazar el archivo al retomar.
- Hojas privadas y URL de Apps Script en docs/PRUEBA-COMPARTIDA.md y public/runtime-config.json. Los planes los controla el servidor: artista gratuito siete días de prueba, Artist cinco activos, Kit uno, Curador Pro recomendaciones, Scout métricas autorizadas.
- Conservar 26 SVG intactos. No poner contraseñas legibles en Sheets.
