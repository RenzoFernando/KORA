/* global CREATED_KEY, DATA, STORAGE_KEY, activeArtist, activeProfile, activeProfileNameParts, addCommunityEvent, allProfiles, applyInterfacePreferences, applyQuickComment, applyVoiceComment, artistById, audioContext, audioPlayer, avatarMarkup, bindEvents, capsuleLoopTimer, capsuleSequenceWidth, closeModal, communityActivityCards, communityNotificationItems, communitySignalPanel, communityTypeLabel, completeViewGuide, createdProfiles, currentView, defaultState, dismissNotification, escapeHtml, fallbackNodes, finishOnboarding, formatCommunityTime, formatMemoryDate, formatTime, getAudioPlayer, handleConsentForm, handleGlobalClick, iconActionMarkup, imgMarkup, legalConsentCopy, legalDocLink, loadState, logoutSession, lowerAccount, maybeShowViewGuide, memoryReminderItems, money, normalizeCapsuleLoop, notificationBelongsToActiveProfile, nowPlayingHideTimer, personalizeBaseNotification, playTimer, playerFullscreenContent, publishTrack, qs, qsa, remindOnboardingLater, remindViewGuideLater, removeSaved, renderAll, renderCapsules, renderHero, renderNotificationBadge, renderPlayer, renderProfileChrome, renderSaved, renderSidebarSession, replaySaved, repostArtist, repostCurrent, resetEverything, roleActionButtons, roleDefinition, roleFeatureCards, roleLegalCopy, runAiAction, runtimeArtists, saveArtist, saveState, savedReason, scrollActiveCapsuleIntoView, scrollCapsules, sessionMedia, setCurrentArtist, setView, settingEnabled, settingsToggleRow, shareCurrent, showActionGuide, showAiAssistant, showCommentComposer, showFriendsPanel, showLegalGate, showModal, showNotificationsPanel, showPlayerFullscreen, showSaveNote, showSettingsPanel, showSharePanel, showWelcomeOnboarding, startClock, startFallbackAudio, startPlayback, statPill, state, stopFallbackAudio, stopPlayback, submitComment, submitFriendMessage, submitSaveNote, svgIcon, syncViewChrome, toast, toggleLikeArtist, toggleLikeCurrent, togglePlay, toggleSetting, unreadNotifications, updateFileLabel, viewChromeCopy, viewGuideCopy, viewGuideKey */
/* exported ambassadorDashboard, artistAuthorizationCards, artistChecklistCards, artistDashboard, artistHasCompanyAuthorization, artistMetricCards, artistReceptionCount, compactArtistCard, companyDashboard, companyMetricCards, companyRadarCard, companySceneCards, companySceneSummary, companyScoutingCards, curatorDashboard, ecosystemConfig, explorerDashboard, generateInvoice, lastRoleSignal, memoryArtistCard, ecosystemOverviewPanel, privacyCards, profileComments, profileCommunityEvents, profileMetricTiles, profileNeighborhoods, profilePlan, profilePlanId, profileRoleSummary, profileScenes, profileSummaryCards, publishedProfileCard, registerResponsibleScout, renderBilling, renderDiscoverSummary, renderInteraction, renderNowPlaying, renderProfile, renderEcosystemPanels, renderPublished, roleDashboard, roleMetricItems, roleWorkspace */

function renderInteraction() {
  const profile = activeProfile();

  const role = roleDefinition(profile);

  const headline = qs('[data-view="interaction"] .section-heading h2');

  const cta = qs('[data-add-playlist]');

  if (headline) headline.textContent = role.interactionHeadline;

  if (cta) cta.textContent = role.interactionCta;

  const posts =
    profile.role === 'company' ? DATA.interactions.slice().reverse() : DATA.interactions;

  const feedHtml = posts
    .map(post => {
      const artist = artistById(post.artistId) || DATA.artists[0];

      const postComments = state.comments[post.id] || [];

      const count = (state.interactions[post.id] || 0) + postComments.length;

      const liked = state.liked.includes(artist.id);

      const saved = state.saved.includes(artist.id);

      const reposted = state.reposted.includes(artist.id);

      const shared = state.shared.includes(artist.id);

      const communityForArtist = (state.communityEvents || []).filter(
        item => item.artistId === artist.id
      ).length;

      const socialCount = count + communityForArtist + (liked ? 1 : 0);

      const commentPreview = postComments
        .slice(-2)
        .map(
          comment =>
            `<article class="comment-chip"><div class="comment-chip-avatar">${escapeHtml((comment.author || 'K').slice(0, 1).toUpperCase())}</div><div><strong>${escapeHtml(comment.author)}</strong><small>${escapeHtml(comment.role || 'Comunidad')} · ${escapeHtml(comment.at || 'Ahora')}</small><span>${escapeHtml(comment.text)}</span></div></article>`
        )
        .join('');

      return `

      <article class="feed-card social-feed-card tone-${escapeHtml(artist.tone || 'sunset')}">

        <div class="feed-top">

          <div class="feed-author">

            <span class="list-cover tone-surface social-avatar">${imgMarkup(artist.avatar || artist.cover, artist.name, artist.symbol)}</span>

            <div class="feed-author-text"><strong>${escapeHtml(artist.name)}</strong><span>${escapeHtml(post.type)} · ${escapeHtml(artist.neighborhood)}</span></div>

          </div>

          <button class="soft-button compact-button" type="button" data-open-player-fullscreen>${svgIcon('expand')}<span>Abrir</span></button>

        </div>

        <div class="feed-media">${imgMarkup(artist.cover, artist.track, artist.symbol)}</div>

        <div class="feed-body">

          <div class="feed-body-head">

            <div>

              <h2>${escapeHtml(post.title)}</h2>

              <p>${escapeHtml(post.body)}</p>

            </div>

            <span class="counter-pill">${socialCount} señales</span>

          </div>

          <div class="feed-track-glance">

            <strong>${escapeHtml(artist.track)}</strong>

            <span>${escapeHtml(artist.genre)} · ${escapeHtml(artist.scene)}</span>

          </div>

        </div>

        <div class="community-tags"><span>${escapeHtml(post.type)}</span><span>${postComments.length} comentarios</span><span>${communityForArtist} movimientos</span><span>${escapeHtml(artist.scene)}</span></div>

        <div class="social-stats-row">

          ${statPill('heart', 'Me gusta', liked ? 1 : 0)}

          ${statPill('comment', 'Comentarios', postComments.length)}

          ${statPill('repost', 'Recomendaciones', communityForArtist)}

        </div>

        ${commentPreview ? `<div class="comment-list">${commentPreview}</div>` : `<div class="comment-list muted-comment">Aún no hay comentarios visibles. Sé el primero en aportar contexto, criterio o memoria local.</div>`}

        <div class="social-actions-bar">

          <button class="social-action ${liked ? 'is-active' : ''}" type="button" data-like-artist="${escapeHtml(artist.id)}" title="${liked ? 'Quitar me gusta' : 'Me gusta'}">${svgIcon(liked ? 'heartFilled' : 'heart')}<span>${liked ? '1' : '0'}</span></button>

          <button class="social-action primary" type="button" data-interact-post="${escapeHtml(post.id)}" title="${escapeHtml(post.cta)}">${svgIcon('comment')}<span>${postComments.length}</span></button>

          <button class="social-action ${saved ? 'is-active' : ''}" type="button" data-save-artist="${escapeHtml(artist.id)}" title="${saved ? 'Quitar guardado' : 'Guardar'}">${svgIcon(saved ? 'check' : 'plus')}<span>${saved ? '1' : '0'}</span></button>

          <button class="social-action ${reposted ? 'is-active' : ''}" type="button" data-repost-artist="${escapeHtml(artist.id)}" title="${reposted ? 'Quitar recomendación' : 'Recomendar'}">${svgIcon('repost')}<span>${reposted ? '1' : '0'}</span></button>

          <button class="social-action ${shared ? 'is-active' : ''}" type="button" data-share-artist="${escapeHtml(artist.id)}" title="Compartir cápsula">${svgIcon('share')}<span>${shared ? '1' : '0'}</span></button>

        </div>

      </article>

    `;
    })
    .join('');

  qs('[data-artist-feed]').innerHTML = `${communitySignalPanel()}${feedHtml}`;

  const playlist = state.playlist.map(artistById).filter(Boolean);

  qs('[data-playlist-list]').innerHTML = playlist.length
    ? playlist
        .map(
          artist => `

    <article class="list-item social-list-item"><span class="list-cover tone-${escapeHtml(artist.tone || 'sunset')}">${imgMarkup(artist.cover, artist.track, artist.symbol)}</span><div class="list-item-content"><strong>${escapeHtml(artist.track)}</strong><span>${escapeHtml(artist.name)} · añadido por la comunidad</span></div><button class="social-action ${state.reposted.includes(artist.id) ? 'is-active' : ''}" type="button" data-repost-artist="${escapeHtml(artist.id)}" title="Recomendar">${svgIcon('repost')}<span>Recomendar</span></button></article>

  `
        )
        .join('')
    : '<div class="empty-state">La lista local todavía no tiene aportes.</div>';

  qs('[data-impact-box]').innerHTML =
    `<strong>${playlist.length} ${escapeHtml(role.impactTitle)}</strong><p>${escapeHtml(role.impactBody)}</p><div class="community-trail">${communityActivityCards(3)}</div>`;

  const friendsNode = qs('[data-friend-activity]');

  if (friendsNode) friendsNode.innerHTML = communityActivityCards(5);

  const notificationsNode = qs('[data-notification-list]');

  if (notificationsNode)
    notificationsNode.innerHTML =
      unreadNotifications()
        .slice(0, 4)
        .map(
          item =>
            `<article class="notification-summary-row"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.body)}</span></article>`
        )
        .join('') ||
      '<article class="notification-summary-row"><strong>Sin notificaciones pendientes</strong><span>Tu bandeja está limpia.</span></article>';
}

function ecosystemConfig() {
  return (
    DATA.ecosystemPanels || {
      title: 'Herramientas del ecosistema KORΛ',

      body: 'Artistas, empresas y usuarios participan con permisos claros, métricas visibles y funciones separadas por rol.',

      artist: {
        eyebrow: 'Espacio del artista',
        title: 'Publicación y seguimiento del artista',
        badge: 'Herramientas de artista',
        body: 'Publicación, métricas, licencia y autorización de visibilidad.',
        items: ['Publicaciones', 'Métricas', 'Licencia', 'Autorización'],
      },

      company: {
        eyebrow: 'Radar empresarial',
        title: 'Evaluación con datos autorizados',
        badge: 'Acceso controlado',
        body: 'Radar, escenas activas y evaluación responsable.',
        items: ['Radar', 'Escenas', 'Métricas', 'Límites'],
      },
    }
  );
}

function ecosystemOverviewPanel(type) {
  const ecosystem = ecosystemConfig();

  const block = ecosystem[type] || ecosystem.artist;

  const items = block.items || [];

  return `

    <div class="phase-panel-layout">

      <div>

        <p class="eyebrow">${escapeHtml(block.eyebrow)}</p>

        <h2>${escapeHtml(block.title)}</h2>

        <p>${escapeHtml(block.body)}</p>

        <div class="tag-cloud">${items.map(item => `<span class="tag">${escapeHtml(item)}</span>`).join('')}</div>

      </div>

      <aside class="phase-validation-note">

        <span class="counter-pill">${escapeHtml(block.badge)}</span>

        <strong>${escapeHtml(ecosystem.title)}</strong>

        <p>${escapeHtml(ecosystem.body)}</p>

      </aside>

    </div>

  `;
}

function renderEcosystemPanels() {
  const artistPanel = qs('[data-artist-ecosystem-panel]');

  if (artistPanel) artistPanel.innerHTML = ecosystemOverviewPanel('artist');

  const companyPanel = qs('[data-company-ecosystem-panel]');

  if (companyPanel) companyPanel.innerHTML = ecosystemOverviewPanel('company');
}

function renderDiscoverSummary() {
  const card = qs('[data-discover-summary]');

  if (!card) return;

  const collapsed = Boolean(state.discoverSummaryCollapsed);

  card.classList.toggle('is-collapsed', collapsed);

  const button = qs('[data-toggle-discover-summary]');

  const label = qs('[data-discover-summary-label]');

  const content = qs('[data-discover-summary-content]');

  if (button) button.setAttribute('aria-expanded', String(!collapsed));

  if (label) label.textContent = collapsed ? 'Mostrar' : 'Ocultar';

  if (content) content.hidden = collapsed;
}

function renderPublished() {
  const profile = activeProfile();

  const published = state.published;

  qs('[data-published-count]').textContent = published.length;

  qs('[data-published-list]').innerHTML = published.length
    ? published
        .slice()
        .reverse()
        .map(
          item => `

    <article class="published-card">

      <div class="list-item"><span class="list-cover tone-${escapeHtml(item.tone || 'violet')}">${imgMarkup(item.cover, item.track, item.symbol)}</span><div class="list-item-content"><strong>${escapeHtml(item.track)}</strong><span>${escapeHtml(item.name)} · ${escapeHtml(item.neighborhood)}</span></div></div>

      <div class="tag-row"><span class="tag">${escapeHtml(item.scene)}</span><span class="tag">Licencia registrada</span><span class="tag">${item.visibility ? 'Visible para CM' : 'Solo comunidad'}</span></div>

    </article>

  `
        )
        .join('')
    : `<div class="empty-state">${profile.role === 'artist' ? 'Aún no has publicado cápsulas.' : 'Cambia a un perfil de artista para publicar música.'}</div>`;

  const form = qs('[data-publish-form]');

  qsa('input, textarea, button', form).forEach(node => (node.disabled = profile.role !== 'artist'));
}

function profilePlanId(profile = activeProfile()) {
  if (profile.planId) return profile.planId;

  const roleMap = {
    user: 'free',
    curator: 'premium',
    ambassador: 'premium',
    artist: 'artist',
    company: 'company',
  };

  return roleMap[profile.role] || 'free';
}

function profilePlan(profile = activeProfile()) {
  return DATA.plans.find(plan => plan.id === profilePlanId(profile)) || DATA.plans[0];
}

function renderBilling() {
  const profile = activeProfile();

  const activePlan = profilePlan(profile);

  qs('[data-plan-grid]').innerHTML = DATA.plans
    .map(plan => {
      const isCurrent = plan.id === activePlan.id;

      return `

    <article class="plan-card ${isCurrent ? 'is-current-plan' : ''}">

      <p class="eyebrow">${escapeHtml(plan.audience)}</p>

      <h2>${escapeHtml(plan.name)}</h2>

      <div class="tag-row"><span class="status-chip">${escapeHtml(plan.badge)}</span>${isCurrent ? '<span class="status-chip">Plan activo</span>' : ''}</div>

      <div class="plan-price">${plan.price ? money(plan.price) : 'Sin costo'}</div>

      <ul class="plan-feature-list">${plan.features.map(feature => `<li>${escapeHtml(feature)}</li>`).join('')}</ul>

      ${plan.note ? `<p class="support-copy">${escapeHtml(plan.note)}</p>` : ''}

      <button class="soft-button full" type="button" data-select-plan="${escapeHtml(plan.id)}">${isCurrent ? 'Usar este plan' : 'Elegir plan'}</button>

    </article>

  `;
    })
    .join('');

  const paidPlans = DATA.plans.filter(plan => plan.price > 0);

  qs('[data-plan-select]').innerHTML = paidPlans
    .map(
      plan =>
        `<option value="${escapeHtml(plan.id)}">${escapeHtml(plan.name)} · ${money(plan.price)}</option>`
    )
    .join('');

  if (activePlan.price > 0) qs('[data-plan-select]').value = activePlan.id;

  qs('[data-invoice-count]').textContent = state.invoices.length;

  qs('[data-invoice-list]').innerHTML = state.invoices.length
    ? state.invoices
        .slice()
        .reverse()
        .map(
          invoice => `

    <article class="invoice-card"><strong>${escapeHtml(invoice.number)}</strong><p>${escapeHtml(invoice.planName)} · ${money(invoice.total)} · ${escapeHtml(invoice.paidAt)}</p><span class="status-chip">Factura electrónica generada</span></article>

  `
        )
        .join('')
    : '<div class="empty-state">Aún no hay facturas registradas.</div>';

  qs('[data-company-access-panel]').innerHTML =
    profile.role === 'company'
      ? `

    <div class="panel-head"><div><p class="eyebrow">Acceso empresas CM</p><h2>Datos disponibles por autorización</h2></div><span class="counter-pill">${escapeHtml(activePlan.name)}</span></div>

    <div class="tag-cloud"><span class="tag">Métricas agregadas</span><span class="tag">Artistas visibles</span><span class="tag">Límites de uso</span><span class="tag">Acceso controlado</span></div>

    <p>El acceso empresarial se limita a artistas que autorizaron visibilidad o análisis de perfil. La información se presenta para evaluación responsable, no para contacto automático ni cesión irrestricta de datos.</p>

    <div class="phase-mini-grid"><article class="mini-card"><strong>Qué puede ver</strong><span>Afinidad cultural, escena, guardados agregados y señales comunitarias.</span></article><article class="mini-card"><strong>Qué no puede ver</strong><span>Datos privados, contacto directo o información no autorizada por artistas.</span></article></div>

  `
      : `

    <div class="panel-head"><div><p class="eyebrow">Plan asociado</p><h2>${escapeHtml(activePlan.name)} para ${escapeHtml(profile.name)}</h2></div><span class="counter-pill">${activePlan.price ? money(activePlan.price) : 'Sin costo'}</span></div>

    <p>Este perfil tiene un plan sugerido según su rol. Puedes cambiarlo en el selector de pago para generar una factura o probar otro modelo de suscripción.</p>

    <div class="phase-mini-grid"><article class="mini-card"><strong>Beneficio principal</strong><span>${escapeHtml(activePlan.features[0] || 'Acceso a KORΛ')}</span></article><article class="mini-card"><strong>Alcance comercial</strong><span>${escapeHtml(activePlan.note || 'Condiciones visibles antes del pago.')}</span></article></div>

  `;
}

function generateInvoice(form) {
  const formData = new FormData(form);

  const plan = DATA.plans.find(item => item.id === formData.get('plan')) || DATA.plans[1];

  const now = new Date();

  const invoice = {
    number: `KORA-${now.getFullYear()}-${String(state.invoices.length + 1).padStart(4, '0')}`,

    planId: plan.id,

    planName: plan.name,

    subtotal: Math.round(plan.price / 1.19),

    tax: plan.price - Math.round(plan.price / 1.19),

    total: plan.price,

    payer: formData.get('payer'),

    document: formData.get('document'),

    email: formData.get('email'),

    method: formData.get('method'),

    paidAt: now.toLocaleString('es-CO'),
  };

  state.invoices.push(invoice);

  saveState();

  renderBilling();

  showModal(
    `<h2>Pago registrado</h2><div class="invoice-card"><strong>${escapeHtml(invoice.number)}</strong><p>${escapeHtml(invoice.planName)}</p><p>Subtotal: ${money(invoice.subtotal)}<br>IVA incluido: ${money(invoice.tax)}<br>Total: ${money(invoice.total)}</p><span class="status-chip">Enviada a ${escapeHtml(invoice.email)}</span></div><div class="legal-note">Comprobante generado en la aplicación. Las condiciones comerciales, retracto, reversión y alcance por rol están documentados en la sección legal.</div><button class="primary-button full" type="button" data-close-modal>Entendido</button>`
  );

  form.reset();
}

function renderProfile() {
  const profile = activeProfile();

  const role = roleDefinition(profile);

  const summary = profileRoleSummary(profile);

  qs('[data-profile-overview]').innerHTML = `

    <div class="profile-hero-mini role-profile-hero">

      <span class="avatar-shell large-avatar">${avatarMarkup(profile)}</span>

      <div><p class="eyebrow">Perfil activo · ${escapeHtml(role.action)}</p><h2>${escapeHtml(profile.name)}</h2><p>${escapeHtml(profile.bio || role.purpose)}</p></div>

    </div>

    <div class="profile-panel-stack">

      <div class="tag-cloud"><span class="tag">${escapeHtml(role.label)}</span><span class="tag">${escapeHtml(profile.city)}</span><span class="tag">${escapeHtml(summary.space)}</span><span class="tag">${escapeHtml(profilePlan(profile).name)}</span></div>

      <div class="profile-role-banner"><strong>${escapeHtml(summary.title)}</strong><span>${escapeHtml(summary.body)}</span></div>

      <div class="profile-metrics role-aware-metrics">${profileMetricTiles(profile)}</div>

      <div class="profile-summary-grid">${profileSummaryCards(profile)}</div>

      <div class="profile-activity-strip">${summary.chips.map(item => `<span class="status-chip">${escapeHtml(item)}</span>`).join('')}</div>

      <div class="profile-actions-row"><button class="soft-button" type="button" data-open-friends>Actividad de amigos</button><button class="soft-button" type="button" data-open-settings>Ajustes</button><button class="soft-button" type="button" data-open-ai>KORΛ IA</button></div>

    </div>

  `;

  qs('[data-role-workspace]').innerHTML = roleWorkspace(profile);

  qs('[data-privacy-list]').innerHTML = privacyCards(profile)
    .map(
      item =>
        `<article class="privacy-card"><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.body)}</p></article>`
    )
    .join('');
}

function profileRoleSummary(profile) {
  const role = roleDefinition(profile);

  const summaries = {
    user: {
      space: 'Memoria personal',

      title: 'Espacio de exploración',

      body: 'Tu perfil prioriza hallazgos guardados, listas locales y actividad reciente para volver a escuchar sin perder lo descubierto.',

      chips: ['Hallazgos', 'Listas', 'Actividad reciente'],
    },

    curator: {
      space: 'Mesa de curaduría',

      title: 'Espacio de recomendación',

      body: 'Tu perfil ordena comentarios, recomendaciones y listas curadas para convertir canciones emergentes en rutas de escucha con criterio.',

      chips: ['Recomendaciones', 'Comentarios destacados', 'Listas curadas'],
    },

    ambassador: {
      space: 'Mapa cultural',

      title: 'Espacio de contexto local',

      body: 'Tu perfil muestra barrios, escenas y aportes culturales para conectar canciones con memoria territorial y comunidad.',

      chips: ['Barrios', 'Escenas', 'Aportes culturales'],
    },

    artist: {
      space: 'Estudio de artista',

      title: 'Espacio de publicación',

      body: 'Tu perfil reúne publicaciones, métricas de recepción y estado legal para que el lanzamiento tenga historia y control de visibilidad.',

      chips: ['Publicaciones', 'Métricas', 'Estado legal'],
    },

    company: {
      space: 'Radar de talento',

      title: 'Espacio de análisis autorizado',

      body: 'Tu perfil prioriza radar de talento, métricas agregadas y límites de datos para analizar artistas con permisos claros.',

      chips: ['Radar', 'Métricas autorizadas', 'Evaluación'],
    },
  };

  return (
    summaries[profile.role] || {
      space: role.profileAxis,
      title: role.label,
      body: role.purpose,
      chips: [role.action, role.profileAxis, profile.city || 'Cali'],
    }
  );
}

function roleMetricItems(profile) {
  const comments = profileComments(profile).length;

  const events = profileCommunityEvents(profile).length;

  const visiblePublished = state.published.filter(item => item.visibility).length;

  const authorizedArtists = runtimeArtists().filter(
    item => item.visibility || !String(item.id || '').startsWith('published-')
  ).length;

  const common = {
    user: [
      [state.saved.length, 'Hallazgos'],

      [state.playlist.length, 'Lista'],

      [memoryReminderItems().length, 'Recordatorios'],

      [(state.communityEvents || []).length, 'Actividad'],
    ],

    curator: [
      [comments, 'Comentarios'],

      [state.reposted.length, 'Recomendaciones'],

      [DATA.playlists.length, 'Listas curadas'],

      [events, 'Señales propias'],
    ],

    ambassador: [
      [profileNeighborhoods().length, 'Barrios'],

      [profileScenes().length, 'Escenas'],

      [events, 'Aportes'],

      [state.playlist.length, 'Rutas locales'],
    ],

    artist: [
      [state.published.length, 'Publicaciones'],

      [artistReceptionCount(), 'Señales'],

      [visiblePublished, 'Visible CM'],

      [state.acceptedLegal ? 1 : 0, 'Estado legal'],
    ],

    company: [
      [authorizedArtists, 'Artistas radar'],

      [runtimeArtists().filter(item => item.match >= 88).length, 'Afinidad alta'],

      [state.saved.length, 'En radar'],

      [state.invoices.length, 'Facturas'],
    ],
  };

  return common[profile.role] || common.user;
}

function profileMetricTiles(profile) {
  return roleMetricItems(profile)
    .map(item => `<span><b>${escapeHtml(item[0])}</b><small>${escapeHtml(item[1])}</small></span>`)
    .join('');
}

function profileSummaryCards(profile) {
  const role = roleDefinition(profile);

  const summary = profileRoleSummary(profile);

  const signal = lastRoleSignal(profile);

  return [
    ['Acción principal', role.action],

    ['Espacio propio', summary.space],

    [
      'Permisos',
      state.acceptedLegal
        ? `Autorizaciones ${role.label.toLowerCase()}`
        : 'Autorizaciones pendientes',
    ],

    ['Última señal', signal],
  ]
    .map(
      item =>
        `<article class="mini-card"><strong>${escapeHtml(item[0])}</strong><span>${escapeHtml(item[1])}</span></article>`
    )
    .join('');
}

function lastRoleSignal(profile) {
  const events = profileCommunityEvents(profile);

  if (events.length) return events[0].title;

  if (profile.role === 'artist' && state.published.length)
    return `Publicaste ${state.published[state.published.length - 1].track}`;

  if (profile.role === 'company')
    return `${runtimeArtists()[0]?.name || 'Artista'} en radar inicial`;

  if (state.saved.length) {
    const artist = artistById(state.saved[state.saved.length - 1]);

    if (artist) return `${artist.track} guardada`;
  }

  return `${activeArtist().track} · ${activeArtist().name}`;
}

function profileCommunityEvents(profile) {
  return (state.communityEvents || []).filter(
    item => item.actor === profile.name || item.role === roleDefinition(profile).label
  );
}

function profileComments(profile) {
  return Object.values(state.comments || {})
    .flat()
    .filter(item => item.author === profile.name || item.role === roleDefinition(profile).label);
}

function profileNeighborhoods() {
  const ids = [...state.saved, ...state.playlist];

  const source = ids.length ? ids.map(artistById).filter(Boolean) : runtimeArtists().slice(0, 6);

  return [...new Set(source.map(item => item.neighborhood).filter(Boolean))];
}

function profileScenes() {
  const ids = [...state.saved, ...state.playlist];

  const source = ids.length ? ids.map(artistById).filter(Boolean) : runtimeArtists().slice(0, 6);

  return [...new Set(source.map(item => item.scene).filter(Boolean))];
}

function artistReceptionCount() {
  const publishedIds = state.published.map(item => item.id);

  const publishedSignals = (state.communityEvents || []).filter(item =>
    publishedIds.includes(item.artistId)
  ).length;

  return (
    publishedSignals +
    state.saved.filter(id => publishedIds.includes(id)).length +
    state.reposted.filter(id => publishedIds.includes(id)).length
  );
}

function roleWorkspace(profile) {
  const role = roleDefinition(profile);

  const workspace = role.workspace || {};

  const features = roleFeatureCards(workspace.features);

  const actions = roleActionButtons(workspace.actions);

  return `<div class="workspace-hero"><div><p class="eyebrow">${escapeHtml(workspace.eyebrow || 'Rol KORΛ')}</p><h2>${escapeHtml(workspace.title || role.label)}</h2><p>${escapeHtml(workspace.intro || role.purpose)}</p></div><span class="counter-pill">${escapeHtml(workspace.badge || role.action)}</span></div>${roleDashboard(profile)}<div class="role-action-grid">${features}</div>${actions ? `<div class="role-work-actions">${actions}</div>` : ''}`;
}

function roleDashboard(profile) {
  if (profile.role === 'curator') return curatorDashboard(profile);

  if (profile.role === 'ambassador') return ambassadorDashboard(profile);

  if (profile.role === 'artist') return artistDashboard(profile);

  if (profile.role === 'company') return companyDashboard(profile);

  return explorerDashboard(profile);
}

function explorerDashboard(_profile) {
  const saved = state.saved.map(artistById).filter(Boolean).slice(-4).reverse();

  const playlist = state.playlist.map(artistById).filter(Boolean).slice(0, 3);

  return `<div class="role-dashboard-grid"><section class="role-workspace-section"><div class="panel-head"><div><p class="eyebrow">Hallazgos</p><h3>Para volver a escuchar</h3></div><span class="counter-pill">${state.saved.length}</span></div>${saved.length ? saved.map(artist => memoryArtistCard(artist)).join('') : '<div class="empty-state">Guarda una cápsula para construir tu memoria musical.</div>'}</section><section class="role-workspace-section"><div class="panel-head"><div><p class="eyebrow">Lista</p><h3>Rutas activas</h3></div><span class="counter-pill">${playlist.length}</span></div>${playlist.length ? playlist.map(artist => compactArtistCard(artist, 'Recomendar', 'data-repost-artist')).join('') : '<div class="empty-state">Aún no hay canciones en la lista.</div>'}</section><section class="role-workspace-section role-section-wide"><div class="panel-head"><div><p class="eyebrow">Actividad reciente</p><h3>Lo que mueve tu comunidad</h3></div></div><div class="role-mini-list">${communityActivityCards(4)}</div></section></div>`;
}

function curatorDashboard(profile) {
  const comments = profileComments(profile).slice(-4).reverse();

  const reposted = state.reposted.map(artistById).filter(Boolean).slice(0, 4);

  const playlists = (DATA.playlists || []).slice(0, 3);

  return `<div class="role-dashboard-grid"><section class="role-workspace-section"><div class="panel-head"><div><p class="eyebrow">Recomendaciones</p><h3>Recomendaciones con criterio</h3></div><span class="counter-pill">${reposted.length}</span></div>${reposted.length ? reposted.map(artist => compactArtistCard(artist, 'Recomendar', 'data-repost-artist')).join('') : '<div class="empty-state">Recomienda una cápsula para iniciar tu ruta curatorial.</div>'}</section><section class="role-workspace-section"><div class="panel-head"><div><p class="eyebrow">Comentarios</p><h3>Criterio visible</h3></div><span class="counter-pill">${comments.length}</span></div>${comments.length ? comments.map(item => `<article class="role-dossier"><strong>${escapeHtml(item.text)}</strong><span>${escapeHtml(item.at || 'Ahora')}</span></article>`).join('') : '<div class="empty-state">Publica comentarios para que aparezcan como señales curatoriales.</div>'}</section><section class="role-workspace-section role-section-wide"><div class="panel-head"><div><p class="eyebrow">Listas curadas</p><h3>Rutas de escucha sugeridas</h3></div></div><div class="playlist-grid">${playlists.map(item => `<article class="playlist-card"><span class="list-cover">${imgMarkup(item.cover, item.name, '♪')}</span><div><strong>${escapeHtml(item.name)}</strong><p>${escapeHtml(item.mood)}</p><span class="tag">Curada por ${escapeHtml(item.curator)}</span></div></article>`).join('')}</div></section></div>`;
}

function ambassadorDashboard(profile) {
  const neighborhoods = profileNeighborhoods();

  const scenes = profileScenes();

  const events = profileCommunityEvents(profile)
    .filter(item => ['context', 'comment', 'playlist'].includes(item.type))
    .slice(0, 4);

  return `<div class="role-dashboard-grid"><section class="role-workspace-section"><div class="panel-head"><div><p class="eyebrow">Barrios</p><h3>Territorios destacados</h3></div><span class="counter-pill">${neighborhoods.length}</span></div><div class="scene-map">${neighborhoods.map(item => `<span>${escapeHtml(item)}</span>`).join('') || '<span>Cali</span>'}</div></section><section class="role-workspace-section"><div class="panel-head"><div><p class="eyebrow">Escenas</p><h3>Lectura cultural</h3></div><span class="counter-pill">${scenes.length}</span></div><div class="scene-map">${scenes.map(item => `<span>${escapeHtml(item)}</span>`).join('') || '<span>Escena local</span>'}</div></section><section class="role-workspace-section role-section-wide"><div class="panel-head"><div><p class="eyebrow">Aportes culturales</p><h3>Memoria agregada por comunidad</h3></div><span class="counter-pill">${events.length}</span></div>${events.length ? events.map(item => `<article class="role-dossier"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.body)}</span></article>`).join('') : '<div class="empty-state">Comenta o suma canciones a una lista para crear aportes culturales visibles.</div>'}</section></div>`;
}

function artistDashboard(_profile) {
  const published = state.published.slice().reverse();

  const visible = published.filter(item => item.visibility).length;

  const legalState = state.acceptedLegal
    ? 'Licencia y autorizaciones registradas'
    : 'Autorizaciones pendientes';

  return `<div class="role-dashboard-grid">

    <section class="role-workspace-section role-section-wide ecosystem-inline">${ecosystemOverviewPanel('artist')}</section>

    <section class="role-workspace-section">

      <div class="panel-head"><div><p class="eyebrow">Publicaciones</p><h3>Cápsulas subidas</h3></div><span class="counter-pill">${published.length}</span></div>

      ${
        published.length
          ? published
              .slice(0, 4)
              .map(item => publishedProfileCard(item))
              .join('')
          : '<div class="empty-state">Aún no has publicado cápsulas en esta sesión.</div>'
      }

    </section>

    <section class="role-workspace-section">

      <div class="panel-head"><div><p class="eyebrow">Métricas</p><h3>Recepción reciente</h3></div><span class="counter-pill">${artistReceptionCount()} señales</span></div>

      <div class="artist-health-grid">${artistMetricCards(published)}</div>

    </section>

    <section class="role-workspace-section">

      <div class="panel-head"><div><p class="eyebrow">Estado legal</p><h3>Licencia y autorización</h3></div><span class="counter-pill">${state.acceptedLegal ? 'Activo' : 'Pendiente'}</span></div>

      <div class="license-status-list">${artistAuthorizationCards(published, visible, legalState)}</div>

    </section>

    <section class="role-workspace-section">

      <div class="panel-head"><div><p class="eyebrow">Lista de verificación</p><h3>Antes de publicar</h3></div><span class="counter-pill">Guía</span></div>

      <div class="publish-checklist">${artistChecklistCards()}</div>

    </section>

  </div>`;
}

function artistMetricCards(published) {
  const ids = published.map(item => item.id);

  const relatedEvents = (state.communityEvents || []).filter(item => ids.includes(item.artistId));

  const comments = ids.reduce((total, id) => total + ((state.comments || {})[id]?.length || 0), 0);

  const saves = state.saved.filter(id => ids.includes(id)).length;

  const reposts = state.reposted.filter(id => ids.includes(id)).length;

  const visible = published.filter(item => item.visibility).length;

  return [
    [saves, 'Guardados de cápsulas'],

    [reposts, 'Recomendaciones comunitarias'],

    [comments, 'Comentarios recibidos'],

    [relatedEvents.length, 'Eventos de comunidad'],

    [visible, 'Visibles para CM'],

    [published.length, 'Cápsulas publicadas'],
  ]
    .map(item => `<span><b>${escapeHtml(item[0])}</b><small>${escapeHtml(item[1])}</small></span>`)
    .join('');
}

function artistAuthorizationCards(published, visible, legalState) {
  const items = [
    ['Licencia de plataforma', legalState, state.acceptedLegal ? 'Activo' : 'Pendiente'],

    [
      'Visibilidad para empresas',
      `${visible} de ${published.length} cápsulas habilitadas para métricas agregadas`,
      visible ? 'Autorizada' : 'Sin habilitar',
    ],

    [
      'Datos compartidos',
      'Solo señales agregadas: guardados, recomendaciones, comentarios y afinidad cultural.',
      'Limitado',
    ],

    [
      'Control de publicación',
      'Revisar audio, portada, historia, licencia y visibilidad antes de compartir la cápsula.',
      'Revisar',
    ],
  ];

  return items
    .map(
      item =>
        `<article class="role-dossier"><div class="license-status-head"><strong>${escapeHtml(item[0])}</strong><span class="status-chip">${escapeHtml(item[2])}</span></div><span>${escapeHtml(item[1])}</span></article>`
    )
    .join('');
}

function artistChecklistCards() {
  return (DATA.artistPublishChecklist || [])
    .map(
      item =>
        `<article class="checklist-card"><span class="status-chip">${escapeHtml(item.state)}</span><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.body)}</p></article>`
    )
    .join('');
}

function companyDashboard(_profile) {
  const radar = runtimeArtists()
    .slice()
    .sort((a, b) => b.match - a.match)
    .slice(0, 6);

  const authorized = radar.filter(item => artistHasCompanyAuthorization(item));

  const logged = state.scoutingLog || [];

  return `<div class="role-dashboard-grid">

    <section class="role-workspace-section role-section-wide ecosystem-inline">${ecosystemOverviewPanel('company')}</section>

    <section class="role-workspace-section role-section-wide">

      <div class="panel-head"><div><p class="eyebrow">Radar de talento</p><h3>Artistas con señales de evaluación</h3></div><span class="counter-pill">${authorized.length} autorizados</span></div>

      <div class="company-radar-dashboard">${radar.map(artist => companyRadarCard(artist, logged)).join('')}</div>

    </section>

    <section class="role-workspace-section">

      <div class="panel-head"><div><p class="eyebrow">Escenas activas</p><h3>Lectura agregada</h3></div><span class="counter-pill">${companySceneSummary(radar).length}</span></div>

      <div class="scene-activity-list">${companySceneCards(radar)}</div>

    </section>

    <section class="role-workspace-section">

      <div class="panel-head"><div><p class="eyebrow">Métricas autorizadas</p><h3>Datos disponibles</h3></div><span class="counter-pill">${authorized.length}</span></div>

      <div class="artist-health-grid">${companyMetricCards(radar, authorized)}</div>

    </section>

    <section class="role-workspace-section role-section-wide">

      <div class="panel-head"><div><p class="eyebrow">Evaluación responsable</p><h3>Uso permitido del radar</h3></div><span class="counter-pill">${logged.length} revisiones</span></div>

      <div class="scouting-responsible-grid">${companyScoutingCards()}</div>

    </section>

  </div>`;
}

function artistHasCompanyAuthorization(artist) {
  return Boolean(artist.visibility || !String(artist.id || '').startsWith('published-'));
}

function companyRadarCard(artist, logged) {
  const allowed = artistHasCompanyAuthorization(artist);

  const reviewed = logged.includes(artist.id);

  return `<article class="list-item company-radar-card ${allowed ? '' : 'is-locked'}"><span class="list-cover tone-${escapeHtml(artist.tone || 'sunset')}">${imgMarkup(artist.cover, artist.track, artist.symbol)}</span><div class="list-item-content"><strong>${escapeHtml(artist.name)}</strong><span>${artist.match}% afinidad · ${escapeHtml(artist.scene)} · ${escapeHtml(artist.neighborhood)}</span><div class="role-pill-row"><span>${allowed ? 'Métricas autorizadas' : 'No autorizado para CM'}</span><span>${escapeHtml(artist.track)}</span></div></div><button class="soft-button ${reviewed ? 'is-active' : ''}" type="button" ${allowed ? `data-scout-responsible="${escapeHtml(artist.id)}"` : 'disabled'}>${reviewed ? 'Revisado' : allowed ? 'Registrar revisión' : 'Bloqueado'}</button></article>`;
}

function companySceneSummary(radar) {
  const grouped = radar.reduce((map, artist) => {
    const key = artist.scene || 'Escena local';

    if (!map[key]) map[key] = { scene: key, count: 0, match: 0 };

    map[key].count += 1;

    map[key].match += artist.match || 0;

    return map;
  }, {});

  return Object.values(grouped)
    .map(item => ({ ...item, average: Math.round(item.match / item.count) }))
    .sort((a, b) => b.count - a.count || b.average - a.average);
}

function companySceneCards(radar) {
  return companySceneSummary(radar)
    .map(
      item =>
        `<article class="role-dossier"><div class="license-status-head"><strong>${escapeHtml(item.scene)}</strong><span class="status-chip">${item.count} artista${item.count === 1 ? '' : 's'}</span></div><span>${item.average}% de afinidad promedio en el radar.</span></article>`
    )
    .join('');
}

function companyMetricCards(radar, authorized) {
  const savedRadar = radar.filter(item => state.saved.includes(item.id)).length;

  const avgMatch = radar.length
    ? Math.round(radar.reduce((total, item) => total + (item.match || 0), 0) / radar.length)
    : 0;

  const reviewed = (state.scoutingLog || []).length;

  return [
    [authorized.length, 'Artistas autorizados'],

    [`${avgMatch}%`, 'Afinidad promedio'],

    [savedRadar, 'Guardados en radar'],

    [reviewed, 'Revisiones registradas'],

    [companySceneSummary(radar).length, 'Escenas activas'],

    ['Agregado', 'Tipo de dato'],
  ]
    .map(item => `<span><b>${escapeHtml(item[0])}</b><small>${escapeHtml(item[1])}</small></span>`)
    .join('');
}

function companyScoutingCards() {
  return (
    (DATA.companyScoutingSignals || [])
      .map(
        item =>
          `<article class="checklist-card"><span class="status-chip">Permitido</span><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.body)}</p></article>`
      )
      .join('') +
    `<article class="role-dossier is-highlight"><strong>Sin contacto automático</strong><span>KORΛ no entrega datos privados ni habilita contacto directo fuera de autorizaciones del artista.</span></article>`
  );
}

function registerResponsibleScout(artistId) {
  const profile = activeProfile();

  if (profile.role !== 'company') {
    toast('Solo un perfil de empresa puede registrar revisiones de radar.');

    return;
  }

  const artist = artistById(artistId);

  if (!artist) return;

  if (!artistHasCompanyAuthorization(artist)) {
    toast('Este artista no autorizó visibilidad empresarial.');

    return;
  }

  state.scoutingLog = state.scoutingLog || [];

  if (!state.scoutingLog.includes(artist.id)) state.scoutingLog.unshift(artist.id);

  if (!state.saved.includes(artist.id)) state.saved.push(artist.id);

  addCommunityEvent('scout', artist, {
    title: `${profile.name} revisó ${artist.name} con límites autorizados`,
    body: `${artist.track} queda en radar empresarial sin contacto directo ni datos privados fuera de autorización.`,
  });

  saveState();

  renderAll();

  toast('Revisión responsable registrada en el radar empresarial.');
}

function memoryArtistCard(artist) {
  const meta = state.savedMeta?.[artist.id] || {};

  const reason = meta.note || meta.reason || savedReason(artist);

  return `<article class="role-dossier"><div class="list-item"><span class="list-cover tone-${escapeHtml(artist.tone || 'sunset')}">${imgMarkup(artist.cover, artist.track, artist.symbol)}</span><div class="list-item-content"><strong>${escapeHtml(artist.track)}</strong><span>${escapeHtml(artist.name)} · ${escapeHtml(reason)}</span></div></div><div class="role-pill-row"><span>${escapeHtml(formatMemoryDate(meta.savedAt))}</span><span>${escapeHtml(artist.neighborhood)}</span></div></article>`;
}

function compactArtistCard(artist, label, attr) {
  return `<article class="list-item"><span class="list-cover tone-${escapeHtml(artist.tone || 'sunset')}">${imgMarkup(artist.cover, artist.track, artist.symbol)}</span><div class="list-item-content"><strong>${escapeHtml(artist.track)}</strong><span>${escapeHtml(artist.name)} · ${escapeHtml(artist.scene)}</span></div><button class="soft-button" type="button" ${attr}="${escapeHtml(artist.id)}">${escapeHtml(label)}</button></article>`;
}

function publishedProfileCard(item) {
  return `<article class="role-dossier"><div class="list-item"><span class="list-cover tone-${escapeHtml(item.tone || 'violet')}">${imgMarkup(item.cover, item.track, item.symbol)}</span><div class="list-item-content"><strong>${escapeHtml(item.track)}</strong><span>${escapeHtml(item.name)} · ${escapeHtml(item.neighborhood)}</span></div></div><div class="role-pill-row"><span>Licencia registrada</span><span>${item.visibility ? 'Visible CM' : 'Solo comunidad'}</span></div></article>`;
}

function privacyCards(profile) {
  const role = roleDefinition(profile);

  const rolePrivacy = (role.privacy || [])[0];

  return [
    {
      title: 'Términos aceptados',
      body: 'Uso de KORΛ, datos personales y permisos básicos por rol.',
    },

    { title: role.label, body: rolePrivacy ? rolePrivacy[1] : role.purpose },

    {
      title: 'Control de cuenta',
      body: 'Puedes cambiar perfil, revisar términos o bajar la cuenta desde esta sección.',
    },
  ];
}

function renderNowPlaying() {
  const bar = qs('[data-now-playing-bar]');

  if (!bar) return;

  const artist = activeArtist();

  const pausedVisible = Boolean(state.lastPausedAt && Date.now() - state.lastPausedAt < 15000);

  clearTimeout(nowPlayingHideTimer);

  if (!state.isPlaying && !pausedVisible) {
    bar.hidden = true;

    bar.classList.remove('is-paused', 'is-fading');

    return;
  }

  bar.hidden = false;

  bar.classList.toggle('is-paused', !state.isPlaying);

  bar.classList.remove('is-fading');

  if (!state.isPlaying && state.lastPausedAt) {
    const remaining = Math.max(0, 15000 - (Date.now() - state.lastPausedAt));

    nowPlayingHideTimer = setTimeout(() => {
      bar.classList.add('is-fading');

      setTimeout(() => {
        bar.hidden = true;

        bar.classList.remove('is-paused', 'is-fading');
      }, 420);
    }, remaining);
  }

  const playIcon = state.isPlaying ? 'pause' : 'play';

  const playLabel = state.isPlaying ? 'Pausar' : 'Reproducir';

  const total = state.previewMode === 'short' ? artist.preview : artist.duration;

  const percent = Math.min(
    100,
    Math.max(0, total ? Math.round((state.playback / total) * 100) : 0)
  );

  bar.innerHTML = `

    <div class="mini-now-media"><span class="list-cover tone-${escapeHtml(artist.tone || 'sunset')}">${imgMarkup(artist.cover, artist.track, artist.symbol)}</span><div><strong>${escapeHtml(artist.track)}</strong><span>${escapeHtml(artist.name)} · ${formatTime(state.playback)} / ${formatTime(total)}${state.isPlaying ? '' : ' · pausado'}</span><div class="mini-now-progress"><i style="width:${percent}%"></i></div></div></div>

    <div class="mini-now-controls"><button class="icon-button" type="button" data-prev-artist aria-label="Anterior">${svgIcon('prev')}</button><button class="primary-button play-toggle mini-play" type="button" data-toggle-play aria-label="${playLabel}">${svgIcon(playIcon)}<span class="visually-hidden">${playLabel}</span></button><button class="icon-button" type="button" data-next-artist aria-label="Siguiente">${svgIcon('next')}</button><button class="icon-button ${state.shuffle ? 'is-active' : ''}" type="button" data-toggle-shuffle aria-label="Aleatorio">${svgIcon('shuffle')}</button><button class="icon-button ${state.repeat ? 'is-active' : ''}" type="button" data-toggle-repeat aria-label="Repetir">${svgIcon('repeat')}</button></div>

    <div class="mini-now-actions"><button class="icon-button" type="button" data-open-player-fullscreen aria-label="Expandir">${svgIcon('expand')}</button><button class="icon-button" type="button" data-repost-current aria-label="Recomendar">${svgIcon('repost')}</button><button class="icon-button" type="button" data-share-menu aria-label="Compartir">${svgIcon('share')}</button></div>

  `;
}