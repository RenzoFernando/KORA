/* global CREATED_KEY, DATA, STORAGE_KEY, activeArtist, activeProfile, addCommunityEvent, allProfiles, ambassadorDashboard, applyInterfacePreferences, artistAuthorizationCards, artistById, artistChecklistCards, artistDashboard, artistHasCompanyAuthorization, artistMetricCards, artistReceptionCount, audioContext, audioPlayer, avatarMarkup, bindEvents, capsuleLoopTimer, capsuleSequenceWidth, closeModal, communityActivityCards, communityNotificationItems, communitySignalPanel, communityTypeLabel, compactArtistCard, companyDashboard, companyMetricCards, companyRadarCard, companySceneCards, companySceneSummary, companyScoutingCards, completeViewGuide, createdProfiles, curatorDashboard, currentView, defaultState, ecosystemConfig, escapeHtml, explorerDashboard, fallbackNodes, finishOnboarding, formatCommunityTime, formatMemoryDate, formatTime, generateInvoice, getAudioPlayer, handleConsentForm, handleGlobalClick, iconActionMarkup, imgMarkup, lastRoleSignal, legalConsentCopy, legalDocLink, loadState, logoutSession, lowerAccount, maybeShowViewGuide, memoryArtistCard, memoryReminderItems, money, normalizeCapsuleLoop, nowPlayingHideTimer, phasePrototypePanel, playTimer, playerFullscreenContent, privacyCards, profileComments, profileCommunityEvents, profileMetricTiles, profileNeighborhoods, profilePlan, profilePlanId, profileRoleSummary, profileScenes, profileSummaryCards, publishTrack, publishedProfileCard, qs, qsa, registerResponsibleScout, remindOnboardingLater, remindViewGuideLater, removeSaved, renderAll, renderBilling, renderCapsules, renderDiscoverSummary, renderHero, renderInteraction, renderNowPlaying, renderPlayer, renderProfile, renderProfileChrome, renderPrototypePanels, renderPublished, renderSaved, renderSidebarSession, replaySaved, repostArtist, repostCurrent, resetEverything, roleActionButtons, roleDashboard, roleDefinition, roleFeatureCards, roleLegalCopy, roleMetricItems, roleWorkspace, runtimeArtists, saveArtist, saveState, savedReason, scrollActiveCapsuleIntoView, scrollCapsules, sessionMedia, setCurrentArtist, setView, shareCurrent, showActionGuide, showLegalGate, showModal, showSaveNote, showWelcomeOnboarding, startClock, startFallbackAudio, startPlayback, statPill, state, stopFallbackAudio, stopPlayback, submitSaveNote, svgIcon, syncViewChrome, toast, toggleLikeArtist, toggleLikeCurrent, togglePlay, updateFileLabel, viewChromeCopy, viewGuideCopy, viewGuideKey */
/* exported activeProfileNameParts, applyQuickComment, applyVoiceComment, dismissNotification, notificationBelongsToActiveProfile, personalizeBaseNotification, renderNotificationBadge, runAiAction, settingEnabled, settingsToggleRow, showAiAssistant, showCommentComposer, showFriendsPanel, showNotificationsPanel, showPlayerFullscreen, showSettingsPanel, showSharePanel, submitComment, submitFriendMessage, toggleSetting, unreadNotifications */

function showPlayerFullscreen() {
  showModal(playerFullscreenContent(), 'player-fullscreen-card');
}

function showAiAssistant() {
  const artist = activeArtist();

  showModal(
    `<h2>KORΛ AI</h2><p>Estoy leyendo la cápsula activa y el contexto cultural para ayudarte a decidir rápido.</p><div class="ai-card"><strong>${escapeHtml(artist.track)} · ${escapeHtml(artist.name)}</strong><p>${escapeHtml(artist.story)}</p><span class="status-chip">Pregunta sugerida: ¿por qué este artista importa en Cali?</span></div><div class="settings-list"><button class="soft-button full" type="button" data-ai-action="recommend">Recomiéndame algo parecido</button><button class="soft-button full" type="button" data-ai-action="summary">Resume el contexto cultural</button><button class="soft-button full" type="button" data-ai-action="playlist">Crear playlist con este sonido</button></div><div class="ai-output" data-ai-output><strong>Listo para ayudarte.</strong><span>Elige una acción para generar una respuesta personalizada.</span></div><button class="primary-button full" type="button" data-close-modal>Cerrar</button>`
  );
}

function runAiAction(action) {
  const output = qs('[data-ai-output]');

  if (!output) return;

  const artist = activeArtist();

  output.classList.add('is-thinking');

  output.innerHTML =
    '<strong>KORΛ AI está escribiendo...</strong><span>Analizando sonido, barrio, afinidad y señales de guardado.</span>';

  setTimeout(() => {
    output.classList.remove('is-thinking');

    if (action === 'recommend') {
      const matches = runtimeArtists()
        .filter(item => item.id !== artist.id)
        .slice(0, 3);

      output.innerHTML = `<strong>Recomendación para seguir explorando</strong><span>Por tu cápsula activa, seguiría con ${matches.map(item => escapeHtml(item.track)).join(', ')}. Mantienen cercanía de escena, entrada rápida y lectura local clara.</span>`;

      return;
    }

    if (action === 'summary') {
      output.innerHTML = `<strong>Resumen cultural</strong><span>${escapeHtml(artist.track)} conecta ${escapeHtml(artist.neighborhood)} con ${escapeHtml(artist.scene)}. La señal principal es ${escapeHtml(artist.insight[0])}</span>`;

      return;
    }

    output.innerHTML = `<strong>Playlist creada</strong><span>Organicé una ruta con ${escapeHtml(artist.track)}, Barrio Norte y Tierra Sonora para combinar identidad local, descubrimiento rápido y alta probabilidad de guardado.</span>`;
  }, 850);
}

function showSharePanel() {
  const artist = activeArtist();

  showModal(
    `<h2>Compartir cápsula</h2><p>Elige cómo quieres compartir ${escapeHtml(artist.track)}.</p><div class="settings-list"><button class="soft-button full" type="button" data-open-friends>Compartir con amigos</button><button class="soft-button full" type="button">Copiar enlace de KORΛ</button><button class="soft-button full" type="button">Enviar a WhatsApp</button><button class="soft-button full" type="button">Publicar en Instagram</button><button class="soft-button full" type="button">Compartir en Facebook</button></div><button class="primary-button full" type="button" data-close-modal>Cerrar</button>`
  );
}

function settingEnabled(key) {
  return Boolean(state.settingsState && state.settingsState[key]);
}

function settingsToggleRow(key, title, body, accent = 'green') {
  return `<article class="settings-row"><div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(body)}</p></div><button class="switch-button ${settingEnabled(key) ? 'is-on' : ''}" type="button" data-toggle-setting="${escapeHtml(key)}" aria-pressed="${settingEnabled(key)}" data-setting-accent="${escapeHtml(accent)}"><span></span></button></article>`;
}

function showSettingsPanel() {
  const lightActive = state.theme !== 'dark';
  const darkActive = !lightActive;
  const privacyRows = [
    settingsToggleRow(
      'notifications',
      'Notificaciones',
      'Avisos de lanzamientos, comentarios y actividad relevante.',
      'blue'
    ),
    settingsToggleRow(
      'privateMode',
      'Modo privado',
      'Reduce temporalmente la visibilidad de tu actividad de escucha.',
      'turquoise'
    ),
  ].join('');
  const interfaceRows = [
    settingsToggleRow(
      'compactMode',
      'Interfaz compacta',
      'Reduce espacios sin esconder funciones.',
      'pink'
    ),
    settingsToggleRow(
      'highContrast',
      'Contraste reforzado',
      'Aumenta la separación visual de bordes y superficies.',
      'green'
    ),
  ].join('');

  showModal(
    `<div class="panel-head"><div><p class="eyebrow">Preferencias</p><h2>Ajustes</h2></div><button class="icon-button" type="button" data-close-modal aria-label="Cerrar">${svgIcon('close')}</button></div>
    <div class="settings-section"><p class="settings-section-title">Apariencia</p><div class="theme-choice-grid">
      <button class="theme-choice ${lightActive ? 'is-active' : ''}" type="button" data-set-theme="light"><span class="theme-swatch light"></span><span><strong>Claro</strong><small>Blanco predominante</small></span><span class="theme-check">${lightActive ? '✓' : ''}</span></button>
      <button class="theme-choice ${darkActive ? 'is-active' : ''}" type="button" data-set-theme="dark"><span class="theme-swatch dark"></span><span><strong>Oscuro</strong><small>#0F0F12</small></span><span class="theme-check">${darkActive ? '✓' : ''}</span></button>
    </div></div>
    <div class="settings-section"><p class="settings-section-title">Reproducción</p><div class="settings-list">
      <article class="settings-row"><div><strong>Aleatorio</strong><p>Mezcla el orden de las cápsulas.</p></div><button class="switch-button ${state.shuffle ? 'is-on' : ''}" type="button" data-toggle-shuffle aria-pressed="${state.shuffle}"><span></span></button></article>
      <article class="settings-row"><div><strong>Repetir</strong><p>Repite la cápsula actual al terminar.</p></div><button class="switch-button ${state.repeat ? 'is-on' : ''}" type="button" data-toggle-repeat aria-pressed="${state.repeat}"><span></span></button></article>
    </div></div>
    <div class="settings-section"><p class="settings-section-title">Privacidad y avisos</p><div class="settings-list">${privacyRows}</div></div>
    <div class="settings-section"><p class="settings-section-title">Interfaz</p><div class="settings-list">${interfaceRows}</div></div>
    <div class="settings-section"><p class="settings-section-title">Ayuda y cuenta</p><div class="settings-list"><button class="soft-button full" type="button" data-open-onboarding>Ver bienvenida</button><button class="soft-button full" type="button" data-open-legal-gate>Privacidad y términos</button></div></div>`,
    'settings-modal'
  );
}

function toggleSetting(key) {
  if (!['notifications', 'privateMode', 'compactMode', 'highContrast'].includes(key)) return;

  state.settingsState = { ...(state.settingsState || {}), [key]: !settingEnabled(key) };
  saveState();
  applyInterfacePreferences();
  showSettingsPanel();
  toast(state.settingsState[key] ? 'Ajuste activado.' : 'Ajuste desactivado.');
}

function activeProfileNameParts() {
  const profile = activeProfile();

  const fullName = String(profile.name || '')
    .trim()
    .toLowerCase();

  const firstName = fullName.split(/\s+/)[0] || '';

  return { id: profile.id, fullName, firstName };
}

function notificationBelongsToActiveProfile(item) {
  const active = activeProfileNameParts();

  const actor = String(item.actor || '')
    .trim()
    .toLowerCase();

  const title = String(item.title || '')
    .trim()
    .toLowerCase();

  if (item.actorId && item.actorId === active.id) return true;

  if (actor && (actor === active.fullName || actor === active.firstName)) return true;

  if (active.fullName && title.includes(active.fullName)) return true;

  if (active.firstName && title.startsWith(`${active.firstName} `)) return true;

  return false;
}

function personalizeBaseNotification(item) {
  return { ...item, source: 'system' };
}

function unreadNotifications() {
  const base = DATA.notifications.map(personalizeBaseNotification);

  return [
    ...communityNotificationItems().filter(item => !notificationBelongsToActiveProfile(item)),
    ...base.filter(item => !notificationBelongsToActiveProfile(item)),
  ].filter(item => !state.dismissedNotifications.includes(item.id || item.title));
}

function renderNotificationBadge() {
  const button = qs('[data-open-notifications].top-icon');

  if (!button) return;

  const count = settingEnabled('notifications') ? unreadNotifications().length : 0;

  let badge = qs('[data-notification-badge]', button);

  if (!badge) {
    badge = document.createElement('span');

    badge.dataset.notificationBadge = '';

    button.appendChild(badge);
  }

  badge.textContent = count > 9 ? '9+' : String(count);
  button.dataset.hasUnread = count > 0 ? 'true' : 'false';

  badge.hidden = count === 0;
}

function showNotificationsPanel() {
  const unread = unreadNotifications();

  const content = unread.length
    ? unread
        .map(
          item => `

    <article class="notification-card ${item.community ? 'is-community' : ''}">

      <div class="notification-card-main">

        <div class="notification-card-icon ${item.community ? 'is-community' : ''}">${svgIcon(item.artistId ? 'play' : item.postId ? 'comment' : 'friends')}</div>

        <div class="notification-card-copy">

          <div class="notification-card-topline">

            <span class="status-chip">${escapeHtml(communityTypeLabel(item.type || item.source || 'system'))}</span>

          </div>

          <strong>${escapeHtml(item.title)}</strong>

          <p>${escapeHtml(item.body)}</p>

        </div>

      </div>

      <div class="notification-actions">

        ${item.artistId ? `<button class="icon-button is-accent" type="button" data-open-notification-artist="${escapeHtml(item.artistId)}" aria-label="Abrir cápsula" title="Abrir cápsula">${svgIcon('play')}</button>` : ''}

        ${item.postId ? `<button class="icon-button" type="button" data-open-notification-post="${escapeHtml(item.postId)}" aria-label="Ver publicación" title="Ver publicación">${svgIcon('comment')}</button>` : ''}

        <button class="icon-button" type="button" data-dismiss-notification="${escapeHtml(item.id || item.title)}" aria-label="Descartar notificación" title="Descartar">${svgIcon('check')}</button>

      </div>

    </article>`
        )
        .join('')
    : '<div class="empty-state">No tienes notificaciones pendientes.</div>';

  showModal(
    `

    <div class="notification-modal-head">

      <div>

        <h2>Notificaciones</h2>

        <p>${unread.length ? `${unread.length} nuevas` : 'Sin pendientes'}</p>

      </div>

      <button class="top-icon" type="button" data-close-modal aria-label="Cerrar" title="Cerrar">${svgIcon('plus')}</button>

    </div>

    <div class="settings-list notification-modal-list">${content}</div>

  `,
    'notifications-modal-card'
  );
}

function dismissNotification(id) {
  if (!state.dismissedNotifications.includes(id)) state.dismissedNotifications.push(id);

  saveState();

  renderAll();

  showNotificationsPanel();
}

function showFriendsPanel() {
  const artist = activeArtist();

  const messages = state.friendMessages.length
    ? state.friendMessages
        .map(
          item =>
            `<article class="chat-bubble"><strong>${escapeHtml(item.author)} → ${escapeHtml(item.friend)}</strong><span>${escapeHtml(item.text)}</span><small>${escapeHtml(item.track)} · ${escapeHtml(item.at || 'Ahora')}</small></article>`
        )
        .join('')
    : '<div class="empty-state">Aún no has enviado música a tus amigos.</div>';

  const friends = DATA.friends
    .map(
      friend =>
        `<option value="${escapeHtml(friend.name)}">${escapeHtml(friend.name)} · ${escapeHtml(friend.affinity)}</option>`
    )
    .join('');

  showModal(
    `<h2>Amigos y actividad</h2><p>Comparte la cápsula activa y revisa qué está moviendo la comunidad sin depender de un chat privado.</p><div class="friend-layout"><div class="settings-list"><article class="privacy-card"><strong>Actividad comunitaria reciente</strong><p>Guardados, comentarios, reposts y playlists aparecen como señales visibles.</p></article>${communityActivityCards(6)}</div><form class="friend-chat-form" data-friend-chat-form><label>Amigo<select name="friend">${friends}</select></label><label>Mensaje<textarea name="message" data-friend-message-text>Escucha ${escapeHtml(artist.track)} de ${escapeHtml(artist.name)}. Creo que conecta con tu playlist local.</textarea></label><button class="primary-button full" type="submit">Enviar cápsula al chat</button></form></div><div class="chat-thread">${messages}</div><button class="soft-button full" type="button" data-close-modal>Cerrar</button>`
  );
}

function submitFriendMessage(form) {
  const data = new FormData(form);

  const artist = activeArtist();

  state.friendMessages.push({
    author: activeProfile().name,
    friend: data.get('friend'),
    text: data.get('message'),
    track: artist.track,
    at: new Date().toLocaleString('es-CO'),
  });

  if (!state.shared.includes(artist.id)) state.shared.push(artist.id);

  addCommunityEvent('share', artist, {
    body: `${activeProfile().name} compartió ${artist.track} con ${data.get('friend')} desde la comunidad KORΛ.`,
  });

  saveState();

  showFriendsPanel();

  toast('Cápsula enviada y registrada como actividad comunitaria.');
}

function showCommentComposer(postId) {
  const post = DATA.interactions.find(item => item.id === postId);

  if (!post) return;

  const artist = artistById(post.artistId) || activeArtist();

  showModal(
    `<h2>${escapeHtml(post.cta)}</h2><p>${escapeHtml(artist.name)} está esperando una señal de la comunidad sobre ${escapeHtml(post.title.toLowerCase())}.</p><form class="comment-form social-comment-form" data-comment-form data-post-id="${escapeHtml(postId)}"><div class="quick-comment-grid"><button class="soft-button compact-button" type="button" data-quick-comment="Me conecta por el barrio y la historia local.">${svgIcon('comment')}<span>Contexto</span></button><button class="soft-button compact-button" type="button" data-quick-comment="Voto por la línea con más identidad caleña.">${svgIcon('heart')}<span>Voto</span></button><button class="soft-button compact-button" type="button" data-quick-comment="Guardaría esta cápsula para compartirla con amigos.">${svgIcon('share')}<span>Share</span></button><button class="soft-button compact-button" type="button" data-voice-comment>${svgIcon('friends')}<span>Voz</span></button></div><label>Comentario<textarea name="comment" data-comment-text required placeholder="Escribe tu aporte"></textarea></label><div class="social-comment-actions"><button class="soft-button" type="button" data-close-modal>Cancelar</button><button class="primary-button" type="submit">Publicar</button></div></form>`,
    'social-comment-modal'
  );
}

function submitComment(form) {
  const postId = form.dataset.postId;

  const text = new FormData(form).get('comment').trim();

  if (!text) return;

  const profile = activeProfile();

  const role = roleDefinition(profile);

  const post = DATA.interactions.find(item => item.id === postId);

  const artist = artistById(post?.artistId) || activeArtist();

  state.comments[postId] = state.comments[postId] || [];

  state.comments[postId].push({
    author: profile.name,
    role: role.label,
    text,
    at: new Date().toLocaleString('es-CO'),
  });

  state.interactions[postId] = (state.interactions[postId] || 0) + 1;

  addCommunityEvent(profile.role === 'ambassador' ? 'context' : 'comment', artist, {
    postId,
    text,
    body: `${profile.name} aportó: ${text}`,
  });

  saveState();

  closeModal();

  renderInteraction();

  renderNotificationBadge();

  toast('Tu comentario quedó publicado y generó una notificación comunitaria.');
}

function applyQuickComment(text) {
  const area = qs('[data-comment-text]');

  if (!area) return;

  area.value = text;

  area.focus();
}

function applyVoiceComment() {
  const area = qs('[data-comment-text]');

  if (!area) return;

  area.value =
    'Aporte de voz: esta cápsula tiene una entrada clara y representa bien la escena local.';

  toast('Grabación simulada añadida como aporte de voz.');
}
