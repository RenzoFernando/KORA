# Verificación de KORΛ-2

Fecha: 25 de octubre de 2026 (America/Bogota).

## Comprobaciones automáticas

- npm test: 10 pruebas correctas, cero fallos.
- npm run build: TypeScript correcto y compilación Vite correcta, 87 módulos. JavaScript principal aproximado: 374 kB / 116 kB gzip; QR en módulo separado.
- npm run format:check: todos los archivos comprobados con formato válido.
- 26 SVG de branding: copia idéntica al original, validada byte a byte y por SHA-256 en BRANDING-SHA256.json.

Las pruebas de dominio verifican la expiración exacta de siete días, cupo de cinco activos, cupo de un Kit, separación entre cuentas, borradores/archivados, acceso simulado, filtrado por ciudad y tildes, URLs HTTPS, IDs oficiales de embed, privacidad Scout y derivación de contraseñas con sal.

## Recorridos comprobados en navegador

Se utilizó un origen separado en el puerto 5191 para crear cuentas técnicas y archivos. Esas cuentas no se precargan en el código ni en el origen de uso 5188. El archivo de prueba era silencio generado para QA y no se añadió al catálogo inicial entregado.

1. Invitado: catálogo de seis lanzamientos, tarjeta, artista, página de lanzamiento, ventana del reproductor y carga del iframe oficial de Zalama Crew. El servicio mostró título, portada, duración y controles oficiales.
2. Artista: registro propio, prueba de siete días, carga de WAV en IndexedDB, autorización y procedencia, guardado como borrador y activación posterior.
3. Reproductor nativo: duración real de ocho segundos del archivo técnico, inicio, progreso hasta final y mini reproductor conservado al cambiar de experiencia. Sin osciladores ni progreso simulado.
4. Analítica: tras consentimiento, exactamente una visita y un inicio nativo en el lanzamiento técnico; cero clics y cero aperturas externas que no ocurrieron.
5. Kit: descarga HTML de 472.092 bytes con audio WAV autorizado incrustado, título correcto y sin scripts de seguimiento. No se publicó en Internet.
6. Scout: registro sin acceso de pago automático; simulación explícita; seis artistas editoriales sin métricas concedidas y un lanzamiento técnico que muestra sus señales solo por autorización. Lista de selección de dos entradas y filtro correcto.
7. Biblioteca: guardado de Dejalo, nota personal, creación de colección, incorporación y persistencia tras recargar. Los datos permanecen asociados a la cuenta técnica.
8. Curador Pro: registro de explorador, activación de simulación y publicación de una recomendación escrita durante la prueba. No se precargan publicaciones ni voces ficticias.
9. Compilación final en puerto 4174: cambio Cali → Bogotá produce cero entradas y mensaje honesto; búsqueda «punta talon» sin tildes produce una coincidencia; acceso interno sin configurar permanece restringido; documento de derechos musicales disponible.
10. Vista móvil de 390 × 844 y escritorio de 1440 × 1000, temas claro y oscuro. Sin desbordamiento horizontal (ancho visible = ancho de contenido) ni imágenes rotas. Se restauró el tamaño normal del navegador tras verificar.
11. Consola de la compilación final, después de navegación y cambio de tema: sin errores ni advertencias nuevos.

## Evidencias

Las capturas finales están en capturas/KORΛ-discover.png y capturas/KORΛ-movil-oscuro.png. También se entregan en la carpeta outputs de Codex.

## Límites de la verificación

- No se conectaron Google Sheets, Forms, cuentas de artistas, pasarela de pago ni hosting. Las plantillas no se desplegaron.
- Se verificaron metadatos oficiales de los seis lanzamientos y la carga del reproductor de Zalama Crew. No se afirma haber escuchado íntegramente cada álbum ni garantizar disponibilidad futura en Bandcamp.
- La medición de terceros se limita a aperturas y clics; no se inspeccionan sus reproducciones internas.
- El acceso administrativo configurado y los flujos de borrado de cuentas reales no se ejercieron sobre datos del usuario. Se revisaron su implementación y la restricción inicial sin configuración.
- El sistema de identidad y permisos es local y modificable desde el navegador; no debe presentarse como una autenticación de producción.
- Se conservó todo el contexto recuperable de read_thread. Las respuestas del asistente que la herramienta devolvió como referencias, sin cuerpo, se identifican expresamente en CONTEXTO.md.

No se escribieron archivos en KORA ni kora-discover; no se crearon commits, ramas, remotos o publicaciones. Los servidores temporales de prueba se cierran al finalizar. Para usar la aplicación se incluye INICIAR-KORA-2.cmd, que abre el servidor en 5188.
