# Catálogo público y operaciones privadas

Estado: sin conexión. No se usaron credenciales, no se crearon hojas y no se envió información a Google. Los archivos de esta carpeta son plantillas para una conexión que el usuario autorice explícitamente después.

## Hoja 1 · catálogo público autorizado

Importar integrations/catalogo-publico.csv como punto de partida. Contiene solo metadatos públicos y fuentes oficiales; no incluye cuentas, correos ni audio. El archivo no concede una licencia para descargar música.

Columnas admitidas: id, artistId, artist, title, city, genre, story, officialUrl, sourceUrl, verifiedAt, rightsEvidence, embedType, embedId, publicApproved. Revisar y aprobar cada entrada con publicApproved=TRUE. rightsEvidence debe ser una descripción pública del alcance, nunca un contrato privado ni un enlace a documentos sensibles.

integrations/catalogo-publico.gs tiene un doGet que lee solo esas columnas y devuelve las aprobadas. El responsable debe asignar el ID de esta hoja pública y desplegar el endpoint de lectura cuando autorice la conexión. No usar el ID de operaciones privadas. El código cliente valida estructura, URLs HTTPS y IDs de Bandcamp y conserva el catálogo local si hay un fallo.

Copiar .env.example a .env.local, configurar VITE_CATALOG_URL con el endpoint HTTPS de Apps Script y reiniciar Vite. Se admiten script.google.com y script.googleusercontent.com. No hay campos para editar esa URL desde una cuenta pública de la aplicación. La conexión no escribe a la hoja.

## Hoja 2 · operaciones privadas

Crear un Google Form que guarde respuestas en una hoja privada con acceso solo al equipo responsable. Campos sugeridos: nombre, correo, tipo de solicitud, plan de interés, enlace oficial del artista y aceptación de la finalidad. No pedir contraseñas, tarjetas o documentos de identidad. Confirmar responsable, contacto de privacidad y conservación antes de recibir personas reales.

Configurar VITE_OPERATIONS_FORM_URL solo con el enlace HTTPS de ese Form. La aplicación abrirá el formulario por decisión del usuario; no enviará campos ocultos ni completará datos automáticamente. La persona revisa y envía dentro de Google Forms. El interés guardado localmente no se envía ni se considera una respuesta del Form.

integrations/operaciones-privadas.gs contiene un disparador opcional para asignar identificadores a filas ya recibidas por Form. No crea un endpoint público ni devuelve datos de operaciones. Su ejecución e instalación se dejan al usuario al autorizar el flujo.

## Separación necesaria

- No publicar la hoja privada ni su endpoint de lectura.
- No almacenar claves privadas, tokens o contraseñas en VITE_.
- La hoja pública no contiene usuarios, ventas, contactos ni evidencias privadas.
- Un Form es captura de solicitudes, no autenticación ni pasarela de pagos.
- Los eventos locales de analítica no se transmiten automáticamente a estas hojas.
- El CSV conserva la atribución a fuentes públicas y no implica que esos artistas sean clientes.

La aplicación no se debe comercializar como una operación conectada mientras estos pasos sigan pendientes.
