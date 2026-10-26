export const legalDocs: Record<
  string,
  { title: string; lead: string; sections: [string, string][] }
> = {
  terminos: {
    title: 'Términos de uso',
    lead: 'KORΛ es una prueba académica compartida de descubrimiento musical y herramientas para artistas, coordinada por Renzo Fernando. Contacto del proyecto: renzofernando.md@gmail.com o el WhatsApp de activación.',
    sections: [
      [
        'Reproducción y cápsulas',
        'KORΛ adapta la presentación de la escucha a su interfaz. El audio aportado con autorización utiliza controles propios y cápsulas de hasta 30 segundos. Los reproductores integrados como Bandcamp conservan sus controles, duración y condiciones. La duración de una cápsula no sustituye la autorización del titular.',
      ],
      [
        'Qué puedes hacer',
        'Discover ofrece fichas editoriales y fuentes oficiales. Studio permite crear borradores privados y compartir lanzamientos, enlaces, QR y páginas de artista. Al activar un lanzamiento, su historia, enlaces y archivos autorizados pasan a ser consultables por quienes accedan a la prueba. El alojamiento puede cambiar o finalizar al terminar el ejercicio académico.',
      ],
      [
        'Tu cuenta',
        'Puedes navegar como invitado o registrarte como explorador, artista o empresa/Scout. Curador Pro es un plan de explorador. Las cuentas se conservan en hojas privadas del responsable mediante Apps Script. El correo todavía no se verifica. No suplantes a otra persona y usa una contraseña exclusiva. El equipo puede suspender cuentas y retirar contenido tras revisar un aviso de uso indebido.',
      ],
      [
        'Planes y acceso',
        'Artist ofrece siete días de prueba desde el registro y hasta cinco lanzamientos activos. Launch Kit admite uno. El equipo revisa las solicitudes y controla premium, plan y estado en la hoja. Registrar una solicitud o abrir WhatsApp no confirma pago ni concede acceso. No existe renovación ni cobro automático.',
      ],
      [
        'Tu contenido',
        'Comparte solo audio, imágenes y textos sobre los que tengas autorización suficiente. Las fichas editoriales de artistas reales no implican que sean clientes, usuarios o aliados de KORΛ. Las recomendaciones muestran el nombre del curador; las notas y colecciones personales son privadas.',
      ],
      [
        'Cambios y retirada',
        'Puedes editar tu perfil, exportar datos, retirar recomendaciones y archivar lanzamientos. Eliminar tu cuenta retira sus registros del proyecto y mueve sus archivos de Drive a la papelera del responsable. Las copias exportadas o compartidas y los datos de terceros no se borran automáticamente.',
      ],
      [
        'Disponibilidad y soporte',
        'Esta prueba depende de la disponibilidad y cuotas de Google, del alojamiento y de las plataformas musicales. Si encuentras una falla, una infracción o necesitas ejercer tus derechos, contacta al responsable e indica el enlace o identificador. No se garantiza distribución comercial ni resultados de promoción.',
      ],
    ],
  },
  privacidad: {
    title: 'Privacidad y datos personales',
    lead: 'El responsable de esta prueba es Renzo Fernando, contacto: renzofernando.md@gmail.com. La participación es voluntaria; puedes consultar, actualizar, solicitar supresión o revocar autorizaciones mediante ese canal.',
    sections: [
      [
        'Datos y finalidades',
        'Las hojas privadas conservan nombre, correo, perfil, estado, plan, sal y hash de contraseña, sesiones con token derivado, fechas de aceptación, guardados, notas, colecciones, solicitudes y avisos. Se usan para gestionar el acceso, tu contenido y las pruebas del proyecto. No se guarda la contraseña en texto legible. En tu dispositivo se conservan la sesión y las preferencias; el audio autorizado se almacena en Drive y se carga temporalmente para reproducirlo.',
      ],
      [
        'Quién ve cada cosa',
        'El responsable puede administrar las hojas privadas. El catálogo entrega solo los datos de presentación autorizados. Un lanzamiento activo y sus archivos son consultables públicamente a través de la aplicación; un borrador es privado. Las recomendaciones se muestran con el nombre del curador. Scout recibe señales agregadas de un lanzamiento solo si su artista permite ese uso. No recibe correos, contraseñas ni notas personales.',
      ],
      [
        'Medición opcional',
        'Por defecto está desactivada. Si la activas, KORΛ registra lanzamiento, tipo de evento, fecha y nombre del servicio de destino. Estos eventos no incluyen un campo de identidad del oyente, IP, GPS ni identificador de oyente único. No prueban reproducciones en Bandcamp. Desactivar detiene nuevos registros desde este dispositivo. Los artistas pueden borrar los eventos de sus lanzamientos. Los proveedores de infraestructura pueden tratar datos técnicos conforme a sus políticas.',
      ],
      [
        'Google, alojamiento y servicios externos',
        'Sheets y Drive alojan los registros y archivos del proyecto; Apps Script atiende solicitudes. El alojamiento entrega la aplicación. Esos proveedores pueden procesar datos fuera de Colombia conforme a sus condiciones. Bandcamp se carga al elegir un lanzamiento para escucharlo y puede aplicar su propia política. Su reproductor conserva los controles oficiales; los archivos aportados con autorización usan los controles personalizados de KORΛ. WhatsApp se abre por decisión tuya y envía solo lo que confirmes allí. No se envían mensajes desde esta pantalla.',
      ],
      [
        'Novedades y comunicaciones',
        'La lista de novedades requiere una autorización adicional. Conserva tu correo y fecha de consentimiento para que el equipo pueda informarte sobre el proyecto. Puedes pedir la baja por el correo del responsable o el WhatsApp del proyecto. Esta versión no implementa envíos automáticos ni avisos push del teléfono.',
      ],
      [
        'Control, conservación y eliminación',
        'Puedes editar tu perfil, exportar tus datos, retirar publicaciones y eliminar la cuenta. Las sesiones caducan a los siete días y pueden revocarse antes. Los datos de cuenta permanecen hasta su eliminación o el cierre de la prueba. Al eliminarla se retiran sus registros de las hojas activas y los archivos se mueven a la papelera de Drive; copias, historial de versiones o respaldos del proveedor pueden persistir según sus plazos. Para consultas, supresión de copias o revocación, escribe al responsable. No introduzcas información sensible.',
      ],
      [
        'Tus derechos',
        'Puedes solicitar acceso y actualización de tus datos, conocer el uso que se les da, pedir prueba de la autorización, solicitar su supresión o revocar el consentimiento cuando corresponda, y acudir a la autoridad competente. El responsable debe atender las consultas y reclamos conforme a la normativa aplicable, incluida la Ley 1581 de 2012.',
      ],
    ],
  },
  'licencia-musical': {
    title: 'Derechos musicales y retiro',
    lead: 'La música pertenece a sus titulares. Una página oficial de escucha no autoriza a descargar ni volver a alojar sus canciones.',
    sections: [
      [
        'Catálogo editorial',
        'Las entradas iniciales enlazan páginas oficiales y usan reproductores integrados. Cada ficha conserva fuente, fecha y alcance de revisión. Las composiciones de tarjetas son arte editorial KORΛ, no portadas originales atribuidas al artista. No se descargaron audios de esas plataformas.',
      ],
      [
        'Reproductores y adaptación',
        'La interfaz KORΛ acompaña a los reproductores oficiales sin extraer sus streams ni ocultar su procedencia. Los controles propios de pausa, posición y volumen corresponden al audio autorizado alojado por el proyecto. Las cápsulas limitan la escucha dentro de la aplicación, no son un mecanismo de protección del archivo ni modifican la duración de embeds externos.',
      ],
      [
        'Archivos aportados',
        'Al cargar audio, portada o textos declaras contar con permisos de sus titulares, incluidos composición, fonograma e interpretación cuando corresponda. Conserva los soportes. La aplicación registra tu declaración; no afirma haber verificado la titularidad.',
      ],
      [
        'Autorización limitada',
        'Al activar un lanzamiento autorizas de forma no exclusiva su almacenamiento en el proyecto y presentación y reproducción dentro de esta prueba compartida, mientras esté activo. Conservas tus derechos. Los borradores no son públicos. Una promoción fuera de este alcance, sublicencia o cesión requiere otro acuerdo.',
      ],
      [
        'Retiro y avisos',
        'Puedes archivar un lanzamiento y retirar su visibilidad Scout. Para avisar una posible infracción, escribe a renzofernando.md@gmail.com con enlace, titularidad alegada y evidencia. La administración puede ocultarlo durante la revisión. Una copia exportada permanece bajo el control de quien la recibió.',
      ],
      [
        'Fuentes y medición',
        'No se usan streams extraídos, páginas piratas ni música de sustitución que aparente ser la obra real. La disponibilidad depende del servicio oficial. Clics y aperturas de reproductor se identifican como tales, nunca como escuchas confirmadas.',
      ],
    ],
  },
  pagos: {
    title: 'Planes y condiciones de prestación',
    lead: 'Precios tentativos en COP para la prueba académica. La aplicación registra solicitudes pendientes y permite contactar al equipo. No procesa pagos ni emite facturas.',
    sections: [
      [
        'Explorador y Curador Pro',
        'Explorador es gratuito. Curador Pro propone $12.900 COP por mes para publicar recomendaciones con tu nombre, además de guardados, notas y colecciones privadas.',
      ],
      [
        'Artist',
        'Precio propuesto: $24.900 COP por mes, siete días de prueba desde el registro, cinco lanzamientos activos simultáneos, páginas de presentación, QR y eventos consentidos. Los borradores no cuentan. El final de la prueba no genera un cobro.',
      ],
      [
        'Scout',
        'Precio propuesto: $69.900 COP por mes. Seguimiento de talento y señales agregadas autorizadas. No garantiza contratos, contactos privados ni cifras de audiencia de otras plataformas.',
      ],
      [
        'Launch Kit',
        'Precio propuesto: $24.900 COP por un lanzamiento único, sin renovación automática. Incluye página con historia, material autorizado, enlaces y QR, y exportación HTML. Antes de pagar deben acordarse por escrito la entrega, las revisiones, la duración del alojamiento y el soporte. No incluye un catálogo ilimitado.',
      ],
      [
        'Solicitud, revisión y activación',
        'Al solicitar se crea una referencia pendiente, con medio de pago propuesto. El equipo confirma alcance y condiciones por WhatsApp u otro canal acordado, revisa el pago y activa el acceso en la hoja. Una referencia o marca de revisión no es un comprobante bancario. Las cuentas de prueba y sus solicitudes se marcan y no se cuentan como ventas reales.',
      ],
      [
        'Antes de cualquier cobro',
        'El equipo debe informar proveedor e identificación, precio total e impuestos aplicables, alcance, entrega, duración, cancelación, atención y condiciones de garantías, retracto, reversión o devolución que correspondan. No pagues basándote únicamente en una solicitud pendiente. Esta pantalla no fija una promesa de reembolso o de activación inmediata.',
      ],
    ],
  },
};
