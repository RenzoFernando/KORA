# Google Sheets · Conectado

El usuario autorizó y activó la conexión. Leer PRUEBA-COMPARTIDA.md para enlaces y edición de planes. La API vigente está en backend/apps-script/KORlambda.gs y public/runtime-config.json.

La hoja Operaciones privadas contiene Usuarios, Perfiles, Sesiones, Lanzamientos, Eventos, Solicitudes, Espera, Notificaciones, Configuracion, Media, Moderacion y Uso. La hoja de catálogo contiene 26 entradas aprobadas; ambas hojas son privadas. Apps Script filtra los campos públicos y valida cada operación privada. No publicar ninguna hoja por enlace.

Usuarios.premium y Usuarios.plan controlan los accesos, status suspende una cuenta, plan_until limita su vigencia. Los cambios se leen al volver a la ventana y cada 30 segundos en primer plano. La marca de una solicitud no activa un plan ni prueba un pago bancario.

El flujo actual usa Apps Script en lugar del Form sugerido inicialmente. La lista de interés y solicitudes se escriben directamente en las pestañas privadas, con sesión y consentimiento.

Las contraseñas no se guardan en texto: sal y derivado PBKDF2-SHA256. Los tokens de sesión también se conservan derivados en la hoja. No editar esas columnas. Las credenciales iniciales están solo en el archivo privado fuera del proyecto.

Las plantillas de integrations/ y la guía GOOGLE-SHEETS-LOCAL-ANTERIOR.md son históricas; no reemplazan el backend vigente. Nunca pegues credenciales privadas en variables VITE_.
