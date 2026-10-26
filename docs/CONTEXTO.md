# Actualización vigente · 25 de octubre de 2026

El usuario autorizó explícitamente la prueba compartida online, las dos hojas en su cuenta Google, cuentas de prueba para cada rol y plan, y una PWA. Estas instrucciones reemplazan las restricciones históricas de local-only, hojas sin conectar y ausencia de cuentas de prueba de abajo. KORA y kora-discover siguen intocables; no hay publicación en GitHub.

Apps Script fue pegado, autorizado y desplegado por el usuario como versión 2; API verificada en vivo. Las dos hojas permanecen privadas. Sitio: https://korlambda-pruebas.prettyskink128.chatgpt.site. Ocho accesos iniciales en el archivo privado de outputs fuera del proyecto. Leer README.md y docs/PRUEBA-COMPARTIDA.md para comportamiento, límites y comprobaciones actuales. Los términos iniciales no fueron aceptados en nombre de los titulares.

Se leyó la nota de voz Voice 261025_213722.txt como datos del encargo, separando conversación incidental de instrucciones. Se integraron términos al primer ingreso, avisos internos, solicitudes por WhatsApp, lista voluntaria, roles diferenciados, planes controlados por Sheets, reproductor compacto y catálogo de 26 entradas. Se conserva el contexto previo a continuación como historial.

---

# Contexto transferido a KORΛ-2

Origen: conversación ChatGPT «Revisar Cora y refactorizar», ID 6ade8920-fb14-83e8-9c3f-5a3aa5f39d04, y encargo explícito de esta conversación local de Codex.

Se conservó la respuesta completa disponible de read_thread en docs/originales/conversacion-recuperada.json. La herramienta devuelve 5 turnos de usuario y marcadores de referencia para algunas respuestas del asistente; los cuerpos de esas respuestas no estuvieron disponibles. No se presenta esta recuperación como una transcripción de contenido que no se pudo leer. Los adjuntos se localizaron y revisaron directamente en el computador.

## Decisiones vigentes del usuario

- Trabajar en su computador desde Work/Codex. KORA original no se modifica ni sobrescribe. Nuevo proyecto independiente C:\Users\renzi\WebstormProjects\KORA-2.
- React + Vite; no Next.js. Componentes, rutas y módulos claros; evitar complejidad innecesaria.
- Trabajo local; no publicar Git, no crear rama remota. Solo proponer codex/kora-2 si un repositorio y el trabajo lo hacen útil. No fue necesario alterar Git.
- Mantener intacta la landing del proyecto separado kora-discover.
- Revisar primero Reporte_KORA_v1(4).md y Rediseño integral de KORA.zip, conservar las piezas logradas, especialmente reproductor, y mejorar la presentación.
- Marca textual KORΛ, con Λ y no A convencional. Preservar 26 SVG oficiales y naranja #F1871C, tema claro/oscuro y documentación de derechos y privacidad.
- Core y catálogo compartidos. Discover para invitados, exploradores y Curador Pro. Studio para artistas. Empresas/Scout para talento y analítica autorizada. Administrador interno. Eliminar embajador independiente y usuarios ficticios precargados.
- Cuentas propias simuladas en el navegador; no prometer autenticación remota ni correo verificado.
- Cali primero, expansión por ciudad hacia Colombia. No confundir barrios o ciudades inventados con procedencia verificada.
- Feature.fm como referencia de patrones de smart links, bio pages, lanzamientos, QR y analítica. No copiar sus recursos ni su diseño protegido exactamente.
- Precios tentativos COP: Curador Pro 12.900/mes; Artist 24.900/mes, siete días de prueba y cinco activos; Scout 69.900/mes; Launch Kit 24.900 por lanzamiento único.
- Condiciones acotadas y visibles. Ninguna simulación se marca como venta, ingreso, cliente adquirido, factura o pago real.
- Dos hojas futuras: catálogo público de texto/enlaces autorizados y operaciones privadas mediante Forms/Apps Script. No conectar ni crear en la cuenta de Google sin una autorización posterior explícita.
- Música real con procedencia. Usar fuentes oficiales, embeds o archivos expresamente autorizados. Excluir descargas ilegales, extracción de streams y enlaces de sitios piratas.
- Entregar plan primero, revisar lo existente, implementar y verificar en la carpeta nueva. Guardar el contexto para continuidad sin depender del chat anterior.

## Implementación de estas decisiones

Catálogo editorial de seis lanzamientos de Cali con verificación de fuente e IDs públicos de Bandcamp. Sin atribuir cuentas o suscripciones a esos artistas. Archivo autorizado e imagen aportados por el artista en IndexedDB. Sin WAV antiguos dentro del catálogo.

Roles: explorador, artista y scout en registro; Pro es un plan de explorador. El administrador se habilita en desarrollo solo con configuración explícita local. Los permisos de interfaz no se presentan como seguridad para producción.

Las páginas locales usan rutas normales con BrowserRouter; la exportación HTML del kit es independiente. El QR local no es un enlace publicado en Internet. La analítica registra eventos consentidos del navegador, diferenciando aperturas de embed de reproducciones nativas.
