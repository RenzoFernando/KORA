window.KORA_DATA = {
  teamMembers: [
    {
      id: 'johan',
      name: 'Johan Guzman',
      role: 'curator',
      roleLabel: 'Oyente curador',
      city: 'Cali',
      initial: 'J',
      avatar: 'img/johan-stiven-guzman.svg',
      bio: 'Recomienda cápsulas, comenta con criterio y ayuda a ordenar hallazgos por escena.',
      planId: 'premium',
    },

    {
      id: 'karold',
      name: 'Karold Mejia',
      role: 'artist',
      roleLabel: 'Artista local',
      city: 'Cali',
      initial: 'K',
      avatar: 'img/karold-lizeth-mejia-orozco.svg',
      bio: 'Publica cápsulas, cuenta la historia de su lanzamiento y gestiona visibilidad autorizada.',
      planId: 'artist',
    },

    {
      id: 'luna',
      name: 'Luna Martinez',
      role: 'user',
      roleLabel: 'Exploradora musical',
      city: 'Cali',
      initial: 'L',
      avatar: 'img/luna-catalina-martinez.svg',
      bio: 'Descubre artistas emergentes, guarda hallazgos y sigue actividad de la comunidad.',
      planId: 'free',
    },

    {
      id: 'renzo',
      name: 'Renzo Mosquera',
      role: 'company',
      roleLabel: 'Empresa / talento',
      city: 'Cali',
      initial: 'R',
      avatar: 'img/renzo-mosquera-daza.svg',
      bio: 'Analiza talento emergente con métricas agregadas, permisos y límites de datos.',
      planId: 'company',
    },
  ],

  roleProfiles: [
    {
      id: 'scout-role',
      name: 'Nébula Sur',
      role: 'company',
      roleLabel: 'Empresa / talento',
      city: 'Cali',
      initial: 'A',
      avatar: '',
      bio: 'Analiza escenas, identifica artistas y revisa señales autorizadas para evaluación responsable.',
      planId: 'company',
    },

    {
      id: 'ambassador-role',
      name: 'Marea Violeta',
      role: 'ambassador',
      roleLabel: 'Embajadora cultural',
      city: 'Cali',
      initial: 'L',
      avatar: '',
      bio: 'Contextualiza música local conectando canciones con barrio, escena y comunidad.',
      planId: 'premium',
    },

    {
      id: 'listener-role',
      name: 'Ruido Menta',
      role: 'user',
      roleLabel: 'Explorador musical',
      city: 'Cali',
      initial: 'M',
      avatar: '',
      bio: 'Descubre artistas emergentes, guarda hallazgos y comparte canciones con amigos.',
      planId: 'free',
    },

    {
      id: 'artist-role',
      name: 'Sol Nómada',
      role: 'artist',
      roleLabel: 'Artista local',
      city: 'Cali',
      initial: 'S',
      avatar: '',
      bio: 'Publica cápsulas, agrega contexto cultural y revisa señales de recepción.',
      planId: 'artist',
    },
  ],

  roleSystem: {
    user: {
      label: 'Explorador musical',

      action: 'Descubrir',

      purpose: 'Encuentra artistas emergentes y guarda hallazgos para volver a escucharlos.',

      accountState: 'Descubriendo escena local',

      accountMeta: 'Hallazgos, listas de reproducción y actividad de esta sesión.',

      profileAxis: 'Descubrimiento musical',

      interactionHeadline: 'Descubre artistas, guarda hallazgos y conversa con la escena local.',

      interactionCta: 'Sumar a lista de reproducción local',

      saveLabel: 'Guardar artista',

      impactTitle: 'artistas visibles',

      impactBody:
        'Cada guardado alimenta tu memoria musical y convierte el descubrimiento en una señal para otros oyentes.',

      workspace: {
        eyebrow: 'Rol: descubrir',

        title: 'Explorador musical',

        badge: 'Descubrir',

        intro:
          'El explorador musical encuentra artistas emergentes, guarda lo que conecta con sus gustos y vuelve a esos hallazgos sin perderlos entre listas genéricas.',

        features: [
          [
            'Cápsulas locales',
            'Escucha fragmentos breves con historia, barrio y escena antes de decidir si quieres seguir.',
          ],

          [
            'Memoria musical',
            'Guarda hallazgos para construir un tablero propio y recordarlos después.',
          ],

          [
            'Comunidad cercana',
            'Sigue lo que tus amigos guardan, comentan o recomiendan dentro de KORΛ.',
          ],
        ],

        actions: [
          ['primary', 'Abrir amigos y actividad', 'openFriends'],

          ['soft', 'Guardar cápsula actual', 'saveCurrent'],
        ],
      },

      privacy: [
        [
          'Actividad de descubrimiento',
          'Tus guardados, marcados como me gusta y listas de reproducción se usan para personalizar la experiencia sin convertirlos en datos comerciales visibles por defecto.',
        ],
      ],
    },

    curator: {
      label: 'Oyente curador',

      action: 'Recomendar',

      purpose: 'Comenta, recomendaciónea y da criterio para que otros descubran con razones.',

      accountState: 'Curaduría activa',

      accountMeta: 'Comentarios, tableros y recomendaciones visibles.',

      profileAxis: 'Curaduría local',

      interactionHeadline:
        'Recomienda cápsulas con criterio cultural y señales para otros oyentes.',

      interactionCta: 'Crear recomendación',

      saveLabel: 'Guardar para curar',

      impactTitle: 'señales curatoriales',

      impactBody:
        'Cada aporte ayuda a convertir canciones emergentes en rutas de escucha con criterio humano.',

      workspace: {
        eyebrow: 'Rol: recomendar',

        title: 'Oyente curador',

        badge: 'Recomendar',

        intro:
          'El oyente curador no solo escucha: explica por qué una cápsula vale la pena, la recomendaciónea con criterio y ayuda a otros usuarios a encontrar música relevante.',

        features: [
          [
            'Lectura crítica',
            'Comenta canciones desde letra, sonido, contexto cultural o afinidad con una escena.',
          ],

          [
            'Recomendación con criterio',
            'Convierte un hallazgo en recomendación visible para la comunidad.',
          ],

          [
            'Tableros curados',
            'Agrupa canciones por barrio, energía, género o intención de escucha.',
          ],
        ],

        actions: [
          ['primary', 'Recomendar en comunidad', 'interactPost:post-1'],

          ['soft', 'Guardar para curar', 'saveCurrent'],
        ],
      },

      privacy: [
        [
          'Aportes curatoriales',
          'Tus comentarios y recomendaciones pueden mostrarse en la comunidad como señales comunitarias asociadas a tu perfil.',
        ],
      ],
    },

    ambassador: {
      label: 'Embajadora cultural',

      action: 'Contextualizar',

      purpose: 'Conecta música con barrio, escena, memoria cultural y comunidad.',

      accountState: 'Contexto comunitario activo',

      accountMeta: 'Barrios, escenas y tableros culturales visibles.',

      profileAxis: 'Embajada cultural',

      interactionHeadline:
        'Conecta canciones con barrio, escena y memoria cultural de la comunidad.',

      interactionCta: 'Crear aporte cultural',

      saveLabel: 'Guardar con contexto',

      impactTitle: 'aportes culturales',

      impactBody:
        'Cada contexto agregado evita que la música local aparezca como contenido aislado y fortalece la memoria de la escena.',

      workspace: {
        eyebrow: 'Rol: contextualizar',

        title: 'Embajadora cultural',

        badge: 'Contextualizar',

        intro:
          'La embajadora cultural relaciona canciones con barrio, escena, relatos locales y comunidad para que el descubrimiento tenga memoria territorial.',

        features: [
          [
            'Barrio y escena',
            'Resalta de dónde viene una cápsula y qué conversación cultural abre.',
          ],

          [
            'Notas de contexto',
            'Aporta datos, relatos o referencias que expliquen por qué importa la canción.',
          ],

          [
            'Activación comunitaria',
            'Invita a otros usuarios a sumar recuerdos, comentarios o listas de reproducción locales.',
          ],
        ],

        actions: [
          ['primary', 'Aportar contexto', 'interactPost:post-3'],

          ['soft', 'Ver actividad comunitaria', 'openFriends'],
        ],
      },

      privacy: [
        [
          'Contexto comunitario',
          'Tus aportes culturales pueden mostrarse como parte de la memoria pública de la plataforma.',
        ],
      ],
    },

    artist: {
      label: 'Artista local',

      action: 'Publicar',

      purpose: 'Sube cápsulas, cuenta la historia de su obra y revisa señales de recepción.',

      accountState: 'Publicación activa',

      accountMeta: 'Licencia, cápsulas y visibilidad configurables.',

      profileAxis: 'Publicación musical',

      interactionHeadline: 'Responde a la comunidad y revisa señales para tus lanzamientos.',

      interactionCta: 'Impulsar cápsula activa',

      saveLabel: 'Guardar referencia',

      impactTitle: 'señales para lanzamiento',

      impactBody:
        'Cada guardado, comentario o recomendación ayuda a leer cómo conecta tu música con la comunidad.',

      workspace: {
        eyebrow: 'Rol: publicar',

        title: 'Artista local',

        badge: 'Publicar',

        intro:
          'El artista local publica cápsulas de 30 segundos, agrega historia y decide qué señales pueden analizar empresas autorizadas.',

        features: [
          ['Cápsulas', 'Publica adelantos con audio, portada, barrio, género e historia cultural.'],

          ['Recepción', 'Revisa guardados, marcados como me gusta, recomendaciones y señales de interacción disponibles.'],

          [
            'Visibilidad autorizada',
            'Controla si empresas suscriptoras pueden ver métricas agregadas del lanzamiento.',
          ],
        ],

        actions: [
          ['primary', 'Ir a publicar música', 'view:publish'],

          ['soft', 'Generar texto de lanzamiento', 'openAi'],
        ],
      },

      privacy: [
        [
          'Visibilidad para empresas CM',
          'El perfil artístico y sus métricas solo se comparten con empresas cuando existe autorización expresa.',
        ],
      ],
    },

    company: {
      label: 'Empresa / talento',

      action: 'Analizar',

      purpose: 'Revisa talento emergente mediante métricas agregadas y datos autorizados.',

      accountState: 'Evaluación de talento activa',

      accountMeta: 'Métricas agregadas y datos autorizados visibles.',

      profileAxis: 'Evaluación responsable',

      interactionHeadline: 'Analiza artistas, señales y oportunidades con datos autorizados.',

      interactionCta: 'Marcar artista para contacto',

      saveLabel: 'Guardar en radar',

      impactTitle: 'señales comerciales',

      impactBody:
        'El radar prioriza artistas con autorización, afinidad cultural y límites claros de acceso a datos.',

      workspace: {
        eyebrow: 'Rol: analizar',

        title: 'Empresa / talento',

        badge: 'Analizar',

        intro:
          'La empresa explora talento emergente con métricas agregadas y solo accede a información autorizada por artistas.',

        features: [
          [
            'Radar de talento',
            'Marca artistas con afinidad alta para revisar oportunidades de evaluación.',
          ],

          [
            'Datos autorizados',
            'Consulta señales agregadas sin acceder a información privada no habilitada.',
          ],

          [
            'Decisión responsable',
            'Prepara contacto o campaña respetando límites legales y de visibilidad.',
          ],
        ],

        actions: [
          ['primary', 'Ver radar en interacción', 'view:interaction'],

          ['soft', 'Revisar plan empresa', 'view:billing'],
        ],
      },

      privacy: [
        [
          'Límites empresariales',
          'La empresa accede a datos autorizados para evaluación y gestión, con límites de disponibilidad y veracidad informados.',
        ],
      ],
    },
  },

  roleLegal: {
    user: {
      title: 'Autorizaciones para explorador musical',

      lead: 'Estas autorizaciones se enfocan en descubrimiento, guardados, listas de reproducción, actividad social y recordatorios de hallazgos.',

      terms:
        'Acepto el uso de KORΛ como explorador musical para descubrir cápsulas, guardar hallazgos, crear listas de reproducción y participar en la comunidad.',

      privacy:
        'Autorizo el tratamiento de mis datos de perfil, gustos, guardados, reproducciones, notas de hallazgo y actividad social para personalizar mi experiencia.',

      roleData:
        'Entiendo que mis guardados y comentarios pueden mostrarse como señales comunitarias cuando yo interactúe públicamente dentro de KORΛ.',
    },

    curator: {
      title: 'Autorizaciones para oyente curador',

      lead: 'Estas autorizaciones se enfocan en recomendaciones, comentarios curatoriales, recomendaciones y tableros de escucha.',

      terms:
        'Acepto participar como oyente curador, publicando recomendaciones, comentarios y señales de criterio sobre canciones emergentes.',

      privacy:
        'Autorizo el tratamiento de mis comentarios, recomendaciones, guardados y criterios de curaduría para ordenar recomendaciones dentro de la comunidad.',

      roleData:
        'Entiendo que mis aportes curatoriales pueden aparecer asociados a mi perfil como recomendaciones visibles para otros usuarios.',
    },

    ambassador: {
      title: 'Autorizaciones para embajador cultural',

      lead: 'Estas autorizaciones se enfocan en contexto territorial, memoria cultural, barrios, escenas y aportes comunitarios.',

      terms:
        'Acepto participar como embajador cultural, aportando contexto sobre barrios, escenas, relatos y memoria local vinculada a canciones.',

      privacy:
        'Autorizo el tratamiento de mis aportes culturales, escenas seguidas, barrios destacados y comentarios comunitarios para fortalecer la memoria musical local.',

      roleData:
        'Entiendo que mis aportes culturales pueden mostrarse públicamente como contexto de canciones, listas de reproducción o escenas dentro de KORΛ.',
    },

    artist: {
      title: 'Autorizaciones para artista local',

      lead: 'Estas autorizaciones se enfocan en publicación musical, licencia de cápsulas, portada, historia cultural y métricas de recepción.',

      terms:
        'Acepto publicar contenido como artista local y declaro que cuento con derechos o permisos suficientes sobre el audio, portada e información que suba.',

      privacy:
        'Autorizo el tratamiento de mi perfil artístico, publicaciones, métricas de interacción, comentarios recibidos y señales de interacción de mis cápsulas.',

      roleData:
        'Entiendo que las empresas solo podrán ver métricas agregadas o señales de mis lanzamientos cuando yo active la autorización correspondiente.',
    },

    company: {
      title: 'Autorizaciones para empresas',

      lead: 'Estas autorizaciones se enfocan en evaluación responsable de talento, analítica agregada, facturación y límites de acceso a datos de artistas.',

      terms:
        'Acepto usar KORΛ como empresa únicamente para analizar talento con datos autorizados y sin contactar o explotar información fuera de los límites informados.',

      privacy:
        'Autorizo el tratamiento de datos de cuenta empresarial, facturación, suscripción, artistas revisados y actividad de evaluación de talento dentro de KORΛ.',

      roleData:
        'Entiendo que el acceso empresarial se limita a métricas agregadas y datos autorizados por artistas, sin visibilidad de información privada no habilitada.',
    },
  },

  viewGuides: {
    discover: {
      eyebrow: 'Inicio de exploración',

      title: 'Qué vas a encontrar en Descubrir',

      body: 'Aquí aparecen cápsulas locales, historia del artista, barrio, escena y señales rápidas para decidir qué vale la pena escuchar después.',

      roleNotes: {
        user: 'Como explorador, este es tu punto de partida para encontrar y guardar hallazgos.',

        curator: 'Como curador, usa esta vista para detectar canciones que merecen recomendación.',

        ambassador: 'Como embajador, revisa qué contexto territorial puede reforzar cada cápsula.',

        artist: 'Como artista, observa cómo se presenta una cápsula a la comunidad.',

        company: 'Como empresa, identifica señales iniciales de escena, afinidad y recepción.',
      },
    },

    player: {
      eyebrow: 'Escucha con contexto',

      title: 'Qué vas a encontrar en el reproductor',

      body: 'El reproductor no solo reproduce: muestra historia, escena, afinidad cultural y acciones para guardar, recomendar o compartir la cápsula.',

      roleNotes: {
        user: 'Como explorador, decide si la canción pasa a tu memoria musical.',

        curator: 'Como curador, identifica razones para recomendarla con criterio.',

        ambassador: 'Como embajador, revisa si la historia necesita más contexto local.',

        artist: 'Como artista, mira cómo se vería la lectura de una publicación propia.',

        company: 'Como empresa, observa señales antes de marcar un artista para radar.',
      },
    },

    interaction: {
      eyebrow: 'Comunidad visible',

      title: 'Qué vas a encontrar en Interacción',

      body: 'Aquí se reúnen comentarios, recomendaciones, actividad de amigos, listas de reproducción colaborativas y señales humanas alrededor de canciones locales.',

      roleNotes: {
        user: 'Como explorador, puedes seguir lo que otras personas guardan o recomiendan.',

        curator: 'Como curador, este es tu espacio natural para dejar criterio visible.',

        ambassador: 'Como embajador, aquí conectas canciones con memoria cultural y comunidad.',

        artist: 'Como artista, revisa cómo responde la comunidad a las cápsulas.',

        company: 'Como empresa, usa esta vista como radar de señales autorizadas.',
      },
    },

    publish: {
      eyebrow: 'Publicación musical',

      title: 'Qué vas a encontrar en Publicar música',

      body: 'Esta vista permite a artistas subir cápsulas, portada, género, barrio, historia y autorizaciones de visibilidad.',

      roleNotes: {
        artist:
          'Como artista, aquí conviertes una canción en cápsula contextualizada para la comunidad.',

        user: 'Esta función está reservada para artistas locales.',

        curator: 'Esta función está reservada para artistas locales.',

        ambassador: 'Esta función está reservada para artistas locales.',

        company: 'Esta función está reservada para artistas locales.',
      },
    },

    billing: {
      eyebrow: 'Planes y facturación',

      title: 'Qué vas a encontrar en Pagos',

      body: 'Aquí se muestran planes, beneficios, suscripción, facturación y acceso comercial según tipo de usuario.',

      roleNotes: {
        user: 'Como explorador, puedes revisar opciones para ampliar descubrimiento y listas de reproducción.',

        curator: 'Como curador, los planes refuerzan herramientas de descubrimiento frecuente.',

        ambassador: 'Como embajador, los planes conectan comunidad, escenas y acceso ampliado.',

        artist: 'Como artista, revisa el plan de publicación y métricas de lanzamiento.',

        company: 'Como empresa, revisa el plan de evaluación de talento y analítica autorizada.',
      },
    },

    profile: {
      eyebrow: 'Tu rol en KORΛ',

      title: 'Qué vas a encontrar en Perfil',

      body: 'El perfil resume tu rol, métricas personales, permisos, autorizaciones y espacio de participación dentro del ecosistema.',

      roleNotes: {
        user: 'Como explorador, verás hallazgos, listas de reproducción y actividad de esta sesión.',

        curator: 'Como curador, verás recomendaciones, comentarios y tableros.',

        ambassador: 'Como embajador, verás escenas, barrios y aportes culturales.',

        artist: 'Como artista, verás publicaciones, permisos y señales de recepción.',

        company: 'Como empresa, verás radar, límites de datos y evaluación responsable.',
      },
    },
  },

  memoryPrompts: [
    'Conectó con tu escena local.',

    'Tiene historia de barrio y contexto cultural.',

    'Puede servir para una lista de reproducción o tablero futuro.',

    'La comunidad está generando señales alrededor de esta cápsula.',

    'El fragmento merece una segunda escucha.',
  ],

  communityTypes: {
    save: 'Guardado',

    comment: 'Comentario',

    recomendación: 'Recomendación',

    share: 'Compartido',

    playlist: 'Lista de reproducción',

    publish: 'Lanzamiento',

    curator: 'Curaduría',

    context: 'Contexto',

    scout: 'Evaluación',
  },

  communitySignals: [
    {
      title: 'Criterio humano',
      body: 'Las recomendaciones visibles vienen de comentarios, recomendaciones y guardados de la comunidad.',
    },

    {
      title: 'Memoria local',
      body: 'Cada aporte suma barrio, escena o razón para que el hallazgo no se pierda.',
    },

    {
      title: 'Actividad sin chat privado',
      body: 'El usuario se entera por comunidad, notificaciones y actividad de amigos.',
    },
  ],

  ecosystemPanels: {
    title: 'Herramientas del ecosistema KORΛ',

    body: 'Artistas, empresas y usuarios participan con permisos claros, métricas visibles y funciones separadas por rol.',

    artist: {
      eyebrow: 'Espacio del artista',
      title: 'Publicación y seguimiento del artista',
      badge: 'Herramientas de artista',
      body: 'El artista puede publicar cápsulas, revisar recepción, confirmar estado de licencia y decidir si habilita métricas agregadas para empresas.',
      items: ['Publicaciones', 'Métricas', 'Licencia', 'Autorización'],
    },

    company: {
      eyebrow: 'Radar empresarial',
      title: 'Evaluación con datos autorizados',
      badge: 'Acceso controlado',
      body: 'La empresa puede revisar radar de artistas, escenas activas y métricas agregadas sin acceder a información privada no autorizada.',
      items: ['Radar', 'Escenas', 'Métricas', 'Límites'],
    },
  },

  artistPublishChecklist: [
    {
      title: 'Derechos del audio y portada',
      body: 'Confirmar que el artista cuenta con permisos suficientes sobre música, imagen y material visual.',
      state: 'Requerido',
    },

    {
      title: 'Historia y contexto cultural',
      body: 'Agregar barrio, escena, género y relato breve para que la cápsula no sea solo un archivo de audio.',
      state: 'Requerido',
    },

    {
      title: 'Licencia dentro de KORΛ',
      body: 'Aceptar licencia no exclusiva para reproducir y comunicar la cápsula dentro de la plataforma.',
      state: 'Requerido',
    },

    {
      title: 'Visibilidad para empresas',
      body: 'Definir si las empresas CM pueden ver métricas agregadas del lanzamiento.',
      state: 'Opcional',
    },

    {
      title: 'Preparación de lanzamiento',
      body: 'Revisar portada, audio, historia y permisos antes de publicar la cápsula.',
      state: 'Revisar',
    },
  ],

  companyScoutingSignals: [
    {
      title: 'Afinidad cultural',
      body: 'Afinidad indicada entre artista, escena y criterios de descubrimiento.',
    },

    {
      title: 'Recepción comunitaria',
      body: 'Guardados, recomendaciones, comentarios y actividad visible dentro de KORΛ.',
    },

    {
      title: 'Visibilidad autorizada',
      body: 'La empresa solo interpreta métricas agregadas cuando el artista habilita ese acceso.',
    },

    {
      title: 'Escena y territorio',
      body: 'Lectura de barrio, género y contexto cultural para evitar decisiones basadas solo en reproducciones.',
    },
  ],

  artists: [
    {
      id: 'valentina-cruz',
      name: 'Valentina Cruz',
      track: 'Río de Fuego',
      genre: 'R&B afrolatino',
      city: 'Cali',
      neighborhood: 'San Antonio',
      scene: 'Afro urbano',
      language: 'Español',
      match: 94,
      duration: 150,
      preview: 30,
      symbol: '♪',
      tone: 'sunset',
      cover: 'img/cover-valentina-cruz.svg',
      avatar: 'img/cover-valentina-cruz.svg',
      audio: 'audio/rio-de-fuego.wav',

      story:
        'Voces suaves, percusión del Pacífico y una narrativa íntima sobre crecer cerca del río y volver a la ciudad con identidad propia.',

      tags: ['San Antonio', 'Afro urbano', 'Voz cálida', 'Cali nocturna'],

      insight: [
        'Entrada vocal clara antes de los 8 segundos.',
        'Contexto fuerte de barrio y escena local.',
        'Alta probabilidad de guardado para oyentes de R&B.',
      ],
    },

    {
      id: 'maelo-solar',
      name: 'Kmelo',
      track: 'Barrio Norte',
      genre: 'Hip hop alternativo',
      city: 'Cali',
      neighborhood: 'La Flora',
      scene: 'Rap independiente',
      language: 'Español',
      match: 88,
      duration: 132,
      preview: 30,
      symbol: '◆',
      tone: 'green',
      cover: 'img/cover-kmelo.svg',
      avatar: 'img/cover-kmelo.svg',
      audio: 'audio/barrio-norte.wav',

      story:
        'Rap de observación urbana con beats cálidos y referencias a movilidad, universidad y vida de barrio.',

      tags: ['La Flora', 'Rap local', 'Lírica urbana', 'Beat cálido'],

      insight: [
        'Gancho lírico claro desde los primeros 10 segundos.',
        'Buen contenido para compartir como cápsula cultural.',
        'Ideal para lista de reproducción de rap caleño.',
      ],
    },

    {
      id: 'nina-santacruz',
      name: 'Soledad',
      track: 'Palmeras de Sal',
      genre: 'Pop tropical',
      city: 'Cali',
      neighborhood: 'El Peñón',
      scene: 'Pop independiente',
      language: 'Español',
      match: 91,
      duration: 146,
      preview: 30,
      symbol: '✦',
      tone: 'coral',
      cover: 'img/cover-soleada.svg',
      avatar: 'img/cover-soleada.svg',
      audio: 'audio/palmeras-de-sal.wav',

      story:
        'Pop luminoso con percusión latina, diseñado para cápsulas breves y fácil recordación.',

      tags: ['El Peñón', 'Pop local', 'Hook rápido', 'Lista de verano'],

      insight: [
        'La melodía principal entra antes del segundo 12.',
        'Alta recordación por coro directo.',
        'Recomendable para usuarios que priorizan energía.',
      ],
    },

    {
      id: 'duo-cables',
      name: 'Andrés Mora',
      track: 'Cables de Lluvia',
      genre: 'Electrónica orgánica',
      city: 'Cali',
      neighborhood: 'Granada',
      scene: 'Electro local',
      language: 'Instrumental',
      match: 82,
      duration: 158,
      preview: 30,
      symbol: '⌁',
      tone: 'blue',
      cover: 'img/cover-andres-mora.svg',
      avatar: 'img/cover-andres-mora.svg',
      audio: 'audio/cables-de-lluvia.wav',

      story:
        'Texturas electrónicas inspiradas en lluvia, tráfico y noches de estudio en el oeste de Cali.',

      tags: ['Granada', 'Electrónica', 'Textura ambiental', 'Noche'],

      insight: [
        'Puede requerir modo extendido por entrada instrumental.',
        'Buen candidato para usuarios de música ambiental.',
        'Se recomienda mostrar contexto antes del play.',
      ],
    },

    {
      id: 'santa-loma',
      name: 'Maracuyás',
      track: 'Tierra Sonora',
      genre: 'Fusión pacífico',
      city: 'Cali',
      neighborhood: 'Siloé',
      scene: 'Raíz contemporánea',
      language: 'Español',
      match: 90,
      duration: 154,
      preview: 30,
      symbol: '●',
      tone: 'gold',
      cover: 'img/cover-maracuyas.svg',
      avatar: 'img/cover-maracuyas.svg',
      audio: 'audio/tierra-sonora.wav',

      story:
        'Marimba, bajo moderno y relato sobre memoria familiar entre ladera, mercado y escena independiente.',

      tags: ['Siloé', 'Fusión', 'Pacífico', 'Raíz'],

      insight: [
        'Contexto cultural diferencial y fácil de explicar.',
        'Conecta con usuarios que buscan identidad local.',
        'Aporta diversidad al comunidad principal.',
      ],
    },

    {
      id: 'lucia-puerto',
      name: 'Los Pleneros',
      track: 'Amanecer del Puerto',
      genre: 'Soul latino',
      city: 'Cali',
      neighborhood: 'Alameda',
      scene: 'Soul independiente',
      language: 'Español',
      match: 86,
      duration: 138,
      preview: 30,
      symbol: '◐',
      tone: 'violet',
      cover: 'img/cover-pleneros.svg',
      avatar: 'img/cover-pleneros.svg',
      audio: 'audio/amanecer-del-puerto.wav',

      story:
        'Soul con guitarras limpias y narrativa de trayectos cotidianos, mercado y madrugadas creativas.',

      tags: ['Alameda', 'Soul', 'Guitarra limpia', 'Madrugada'],

      insight: [
        'Buena entrada vocal en menos de 8 segundos.',
        'Funciona para usuarios de descubrimiento tranquilo.',
        'Puede generar guardados por historia cercana.',
      ],
    },

    {
      id: 'aurora-ladera',
      name: 'Naya del Valle',
      track: 'Aurora de Ladera',
      genre: 'Neo soul caleño',
      city: 'Cali',
      neighborhood: 'Terrón Colorado',
      scene: 'Soul local',
      language: 'Español',
      match: 89,
      duration: 142,
      preview: 30,
      symbol: '✺',
      tone: 'teal',
      cover: 'img/cover-aurora-ladera.svg',
      avatar: 'img/cover-aurora-ladera.svg',
      audio: 'audio/aurora-de-ladera.wav',

      story:
        'Voces suaves, bajo redondo y una historia sobre mirar la ciudad desde la ladera antes de empezar el día.',

      tags: ['Terrón Colorado', 'Neo soul', 'Ladera', 'Voz íntima'],

      insight: [
        'Entrada vocal directa y cálida.',
        'Conecta con usuarios que guardan R&B y soul.',
        'Aporta representación de ladera al comunidad digital.',
      ],
    },

    {
      id: 'medianoche-alameda',
      name: 'Cromo Pacífico',
      track: 'Medianoche Alameda',
      genre: 'House latino',
      city: 'Cali',
      neighborhood: 'Alameda',
      scene: 'Electro afro',
      language: 'Instrumental',
      match: 84,
      duration: 160,
      preview: 30,
      symbol: '◇',
      tone: 'indigo',
      cover: 'img/cover-medianoche-alameda.svg',
      avatar: 'img/cover-medianoche-alameda.svg',
      audio: 'audio/medianoche-alameda.wav',

      story:
        'Percusión filtrada, sintetizadores nocturnos y una lectura sonora del mercado, las luces y los recorridos por Alameda.',

      tags: ['Alameda', 'House', 'Nocturno', 'Percusión'],

      insight: [
        'Ideal para cápsulas visuales con movimiento.',
        'Buena opción para listas de reproducción de noche.',
        'Su contexto funciona antes del drop.',
      ],
    },

    {
      id: 'brisa-oriente',
      name: 'Lía Montoya',
      track: 'Brisa del Oriente',
      genre: 'Pop urbano',
      city: 'Cali',
      neighborhood: 'Ciudad Córdoba',
      scene: 'Pop de barrio',
      language: 'Español',
      match: 87,
      duration: 136,
      preview: 30,
      symbol: '✧',
      tone: 'rose',
      cover: 'img/cover-brisa-oriente.svg',
      avatar: 'img/cover-brisa-oriente.svg',
      audio: 'audio/brisa-del-oriente.wav',

      story:
        'Melodía pegajosa, percusión ligera y una cápsula sobre amistad, buses, colegio y tardes al oriente de Cali.',

      tags: ['Ciudad Córdoba', 'Pop urbano', 'Hook rápido', 'Oriente'],

      insight: [
        'Coro memorable antes del segundo 15.',
        'Probabilidad alta de compartir con amigos.',
        'Suma diversidad territorial al descubrimiento.',
      ],
    },
  ],

  interactions: [
    {
      id: 'post-1',
      artistId: 'valentina-cruz',
      type: 'Lanzamiento',
      title: 'Nueva cápsula disponible',
      body: 'Valentina comparte un fragmento de su próximo sencillo y pregunta qué parte conecta más con la escena de San Antonio.',
      cta: 'Responder con criterio cultural',
    },

    {
      id: 'post-2',
      artistId: 'maelo-solar',
      type: 'Pregunta',
      title: '¿Qué barra representa mejor a Cali?',
      body: 'Kmelo abre votación para elegir la línea que aparecerá en la versión final del track.',
      cta: 'Votar y comentar',
    },

    {
      id: 'post-3',
      artistId: 'santa-loma',
      type: 'Proceso',
      title: 'Detrás del sonido',
      body: 'Maracuyás explica cómo mezcla marimba con bajo moderno y por qué esa decisión importa para la identidad local.',
      cta: 'Guardar contexto',
    },

    {
      id: 'post-4',
      artistId: 'nina-santacruz',
      type: 'Curaduría',
      title: 'Arma el tablero visual',
      body: 'Soledad invita a guardar referencias visuales asociadas a su lanzamiento para construir comunidad alrededor del concepto.',
      cta: 'Aportar al tablero',
    },
  ],

  friendActivity: [
    {
      name: 'Luna',
      action: 'guardó Río de Fuego',
      detail: 'Lo añadió a su tablero Cali nocturna.',
    },

    {
      name: 'Johan',
      action: 'comentó en Barrio Norte',
      detail: 'Resaltó la lírica urbana y el beat cálido.',
    },

    {
      name: 'Karold',
      action: 'publicó una cápsula',
      detail: 'Nuevo adelanto visible para la comunidad.',
    },
  ],

  notifications: [
    {
      id: 'notif-launch-san-antonio',
      title: 'Nueva cápsula en San Antonio',
      body: 'Valentina Cruz tiene una actualización de lanzamiento.',
      type: 'launch',
      artistId: 'valentina-cruz',
    },

    {
      id: 'notif-comment-recomendación',
      title: 'Comentaron un hallazgo de tu comunidad',
      body: 'Un aporte agregó contexto de barrio a una cápsula compartida.',
      type: 'comment',
      artistId: 'santa-loma',
      postId: 'post-3',
    },

    {
      id: 'notif-friend-save',
      title: 'Hay una cápsula guardada que podría gustarte',
      body: 'Fue añadida a un tablero de rap, barrio y ladera.',
      type: 'save',
      artistId: 'maelo-solar',
    },

    {
      id: 'notif-curator-context',
      title: 'Una canción fue destacada por su contexto cultural',
      body: 'La recomendación aparece como señal curatorial en la comunidad.',
      type: 'curator',
      artistId: 'valentina-cruz',
      postId: 'post-1',
    },

    {
      id: 'notif-lista de reproducción-grow',
      title: 'La lista de reproducción local creció',
      body: 'La comunidad sumó nuevos aportes esta semana.',
      type: 'lista de reproducción',
    },

    {
      id: 'notif-data-ready',
      title: 'Autorizaciones al día',
      body: 'Tu configuración de datos está activa por rol.',
      type: 'system',
    },
  ],

  friends: [
    { name: 'Johan', affinity: 'Rap y contexto urbano' },

    { name: 'Karold', affinity: 'Lanzamientos y métricas' },

    { name: 'Luna', affinity: 'Listas y tableros' },

    { name: 'Renzo', affinity: 'Evaluación y radar' },
  ],

  playlists: [
    {
      id: 'cali-nocturna',
      name: 'Cali nocturna',
      curator: 'Luna Martinez',
      cover: 'img/cover-medianoche-alameda.svg',
      tracks: ['valentina-cruz', 'duo-cables', 'medianoche-alameda'],
      mood: 'R&B, electrónica suave y ciudad de noche',
    },

    {
      id: 'barrio-y-ladera',
      name: 'Barrio y ladera',
      curator: 'Johan Guzman',
      cover: 'img/cover-aurora-ladera.svg',
      tracks: ['maelo-solar', 'santa-loma', 'aurora-ladera'],
      mood: 'Rap, raíz y relatos territoriales',
    },

    {
      id: 'pop-local',
      name: 'Pop local emergente',
      curator: 'Marea Violeta',
      cover: 'img/cover-brisa-oriente.svg',
      tracks: ['nina-santacruz', 'brisa-oriente'],
      mood: 'Hooks rápidos para compartir',
    },
  ],

  settings: [
    { title: 'Tu cuenta', body: 'Perfil, correo, privacidad y baja de cuenta.' },

    { title: 'Reproducción', body: 'Modo de reproducción, repetir, aleatorio y calidad.' },

    { title: 'Vista', body: 'Tema claro u oscuro, densidad de interfaz y accesibilidad.' },

    { title: 'Modo privado', body: 'Oculta temporalmente tu actividad de escucha.' },

    { title: 'Nueva lista de reproducción', body: 'Crea tableros de descubrimiento musical local.' },

    {
      title: 'Ayuda y comunidad KORΛ',
      body: 'Soporte, preguntas frecuentes y normas comunitarias.',
    },

    { title: 'Acerca de KORΛ', body: 'Propósito, identidad KORΛ y enfoque de descubrimiento digital.' },
  ],

  plans: [
    {
      id: 'free',
      name: 'KORΛ Base',
      price: 0,
      audience: 'Exploradores',
      badge: 'Incluido',
      features: [
        'Cápsulas de 30 segundos con historia',
        'Guardados y tablero de memoria',
        'Comunidad público de interacción',
        'Lista local colaborativa',
      ],
      note: 'Plan enfocado en descubrir, guardar y participar en comunidad.',
    },

    {
      id: 'premium',
      name: 'KORΛ Premium Ligero',
      price: 12900,
      audience: 'Usuarios frecuentes',
      badge: 'Descubrimiento ampliado',
      features: [
        'Descubrimiento más personalizado',
        'Listas locales curadas',
        'Acceso anticipado a lanzamientos',
        'Pasaporte digital con insignias',
      ],
      note: 'Extiende la experiencia de descubrimiento sin cambiar el alcance legal base.',
    },

    {
      id: 'artist',
      name: 'KORΛ Artista',
      price: 24900,
      audience: 'Artistas',
      badge: 'Para publicar',
      features: [
        'Publicación de cápsulas con historia',
        'Panel de recepción',
        'Estado de licencia y autorización CM',
        'Lista de verificación previa a publicación',
      ],
      note: 'Plan orientado a publicación, seguimiento y permisos de visibilidad.',
    },

    {
      id: 'company',
      name: 'KORΛ Empresas CM',
      price: 69900,
      audience: 'Empresas y talento',
      badge: 'B2B',
      features: [
        'Radar de talento emergente',
        'Escenas activas por contexto',
        'Métricas agregadas autorizadas',
        'Evaluación responsable con límites legales',
      ],
      note: 'Plan orientado a evaluación responsable con datos autorizados.',
    },
  ],

  legalDocs: {
    terms: {
      title: 'Términos y Condiciones de Uso',

      lead: 'Estos términos y condiciones regulan el acceso a KORΛ para usuarios, artistas y empresas que participan en el ecosistema de descubrimiento musical local.',

      sections: [
        [
          'Objeto de la plataforma',
          'KORΛ permite descubrir artistas locales emergentes mediante cápsulas de audio, contexto cultural, tableros de hallazgos, interacción social y servicios asociados a suscripciones.',
        ],

        [
          'Categorías de usuario',
          'Los usuarios normales pueden crear, guardar y compartir contenido tipo tablero. Los artistas pueden publicar canciones, asociar contenido visual y promocionar material. Las empresas pueden contratar planes para evaluación de talento, gestión de comunidad y analítica autorizada.',
        ],

        [
          'Permisos por rol',
          'La plataforma aplica control de acceso por roles para que cada categoría vea únicamente las funciones y datos necesarios para su operación.',
        ],

        [
          'Baja de cuenta',
          'Cuando una cuenta se da de baja, el perfil deja de ser visible de inmediato. Los datos personales sensibles se eliminan según la política aplicable y puede conservarse información mínima anonimizada para estadísticas globales e integridad del sistema.',
        ],

        [
          'Menores de edad',
          'Los menores podrán acceder bajo restricciones y, cuando corresponda, con autorización de su tutor legal. KORΛ podrá limitar funciones de publicación, visibilidad o tratamiento de datos en estos casos.',
        ],

        [
          'Responsabilidad de uso',
          'KORΛ organiza funciones por rol para que usuarios, artistas y empresas usen únicamente los datos y herramientas habilitadas dentro de la plataforma.',
        ],
      ],
    },

    privacy: {
      title: 'Autorización de Tratamiento de Datos Personales',

      lead: 'Esta autorización explica qué datos se recogen, para qué se usan y cómo se comparten según la categoría del usuario.',

      sections: [
        [
          'Datos personales',
          'KORΛ trata datos de autenticación, perfil, preferencias, guardados, actividad de cápsulas, interacciones y configuración de cuenta para prestar el servicio.',
        ],

        [
          'Datos de artistas',
          'KORΛ puede tratar métricas de contenido, interacción, publicaciones, rendimiento de cápsulas, perfil artístico y señales de curaduría.',
        ],

        [
          'Datos de empresas',
          'KORΛ puede tratar información de contacto, facturación, suscripción, gestión de cuentas, analíticas consultadas y límites de acceso.',
        ],

        [
          'Compartición con empresas CM',
          'Los datos de artistas solo serán visibles o analizables por empresas suscriptoras cuando exista autorización expresa del artista y únicamente dentro de los límites informados.',
        ],

        [
          'Canal de datos',
          'Las dudas, quejas o reclamos sobre tratamiento de datos deberán gestionarse mediante el canal de privacidad que KORΛ informe dentro de la plataforma.',
        ],

        [
          'Datos autorizados por rol',
          'Exploradores, curadores y embajadores usan datos de actividad comunitaria; artistas autorizan métricas agregadas de sus cápsulas; empresas solo acceden a señales autorizadas y límites visibles.',
        ],
      ],
    },

    license: {
      title: 'Licencia Musical y Protocolo de Aviso y Retiro',

      lead: 'Los artistas conservan sus derechos morales sobre la obra, pero autorizan usos patrimoniales necesarios para que KORΛ funcione.',

      sections: [
        [
          'Licencia no exclusiva',
          'Al publicar contenido, el artista otorga a KORΛ una licencia no exclusiva, revocable según las condiciones aplicables, para reproducir, comunicar públicamente, alojar y distribuir cápsulas musicales dentro de la plataforma.',
        ],

        [
          'Derechos morales',
          'El artista conserva la autoría de la obra y el reconocimiento moral correspondiente. KORΛ no se presenta como propietaria de la creación musical.',
        ],

        [
          'Derechos patrimoniales autorizados',
          'La autorización permite operar la comunidad, el reproductor, las listas de reproducción colaborativas, la promoción interna y la visualización de contenido por usuarios o empresas autorizadas.',
        ],

        [
          'Música de terceros',
          'Quien suba contenido declara que cuenta con autorizaciones suficientes. Si existe posible infracción, KORΛ podrá retirar preventivamente el contenido mediante el protocolo de aviso y retiro.',
        ],

        [
          'Retiro de contenido',
          'Los titulares de derechos podrán reportar material presuntamente infractor mediante el canal de derechos que KORΛ informe, indicando obra, titularidad y motivo de retiro.',
        ],

        [
          'Estado de publicación',
          'Cada cápsula publicada debe mostrar si la licencia está registrada y si las métricas agregadas están habilitadas para empresas CM.',
        ],
      ],
    },

    payments: {
      title: 'Pagos, Facturación y Comercio Electrónico',

      lead: 'Esta sección informa las condiciones comerciales de las suscripciones de KORΛ.',

      sections: [
        [
          'Precios',
          'Los precios se muestran en pesos colombianos e incluyen impuestos aplicables cuando correspondan.',
        ],

        [
          'Factura electrónica',
          'Si KORΛ opera como responsable obligado a facturar, emitirá factura electrónica a los suscriptores de acuerdo con la normativa DIAN aplicable.',
        ],

        [
          'Pasarela de pago',
          'El proveedor de pagos deberá cumplir estándares de seguridad para proteger la información financiera, incluyendo controles equivalentes a PCI-DSS para datos de tarjetas.',
        ],

        [
          'Derecho de retracto',
          'En ventas electrónicas, el usuario podrá ejercer el derecho de retracto dentro de los cinco días hábiles siguientes a la compra, siempre que el servicio no haya comenzado a ejecutarse en los términos aplicables.',
        ],

        [
          'Reversión del pago',
          'KORΛ habilitará revisión de reversión por fraude, operación no solicitada o fallas del servicio mediante el canal de soporte que se informe al usuario.',
        ],

        [
          'Nivel de servicio para empresas',
          'Los planes empresariales informarán disponibilidad esperada, alcance de datos autorizados, límites de exactitud y canales de soporte comercial.',
        ],

        [
          'Alcance de los planes',
          'Cada plan informa sus beneficios, límites de acceso, condiciones de pago, facturación y soporte antes de completar la suscripción.',
        ],
      ],
    },
  },
};