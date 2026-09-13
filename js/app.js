/* global CREATED_KEY, DATA, STORAGE_KEY, activeArtist, activeProfile, activeProfileNameParts, addCommunityEvent, allProfiles, ambassadorDashboard, applyInterfacePreferences, applyQuickComment, applyVoiceComment, artistAuthorizationCards, artistById, artistChecklistCards, artistDashboard, artistHasCompanyAuthorization, artistMetricCards, artistReceptionCount, audioContext, audioPlayer, avatarMarkup, capsuleLoopTimer, communityActivityCards, communityNotificationItems, communitySignalPanel, communityTypeLabel, compactArtistCard, companyDashboard, companyMetricCards, companyRadarCard, companySceneCards, companySceneSummary, companyScoutingCards, createdProfiles, curatorDashboard, currentView, defaultState, dismissNotification, ecosystemConfig, escapeHtml, explorerDashboard, fallbackNodes, formatCommunityTime, formatMemoryDate, formatTime, generateInvoice, getAudioPlayer, iconActionMarkup, imgMarkup, lastRoleSignal, legalConsentCopy, legalDocLink, loadState, memoryArtistCard, memoryReminderItems, money, notificationBelongsToActiveProfile, nowPlayingHideTimer, personalizeBaseNotification, ecosystemOverviewPanel, playTimer, playerFullscreenContent, privacyCards, profileComments, profileCommunityEvents, profileMetricTiles, profileNeighborhoods, profilePlan, profilePlanId, profileRoleSummary, profileScenes, profileSummaryCards, publishedProfileCard, qs, qsa, registerResponsibleScout, removeSaved, renderBilling, renderCapsules, renderDiscoverSummary, renderHero, renderInteraction, renderNotificationBadge, renderNowPlaying, renderPlayer, renderProfile, renderProfileChrome, renderEcosystemPanels, renderPublished, renderSaved, renderSidebarSession, replaySaved, repostArtist, repostCurrent, roleActionButtons, roleDashboard, roleDefinition, roleFeatureCards, roleLegalCopy, roleMetricItems, roleWorkspace, runAiAction, runtimeArtists, saveArtist, saveState, savedReason, sessionMedia, setCurrentArtist, setView, settingEnabled, settingsToggleRow, shareCurrent, showAiAssistant, showCommentComposer, showFriendsPanel, showNotificationsPanel, showPlayerFullscreen, showSaveNote, showSettingsPanel, showSharePanel, startClock, startFallbackAudio, startPlayback, statPill, state, stopFallbackAudio, stopPlayback, submitComment, submitFriendMessage, submitSaveNote, svgIcon, syncViewChrome, toast, toggleLikeArtist, toggleLikeCurrent, togglePlay, toggleSetting, unreadNotifications, viewChromeCopy, viewGuideCopy, viewGuideKey */
/* exported bindEvents, capsuleSequenceWidth, closeModal, completeViewGuide, finishOnboarding, handleConsentForm, handleGlobalClick, logoutSession, lowerAccount, maybeShowViewGuide, normalizeCapsuleLoop, publishTrack, remindOnboardingLater, remindViewGuideLater, renderAll, resetEverything, scrollActiveCapsuleIntoView, scrollCapsules, showActionGuide, showLegalGate, showModal, showWelcomeOnboarding, updateFileLabel */

function renderAll() {
  applyInterfacePreferences();
  syncViewChrome();
  renderProfileChrome();

  renderSidebarSession();

  renderHero();

  renderDiscoverSummary();

  renderCapsules();

  renderSaved();

  renderPlayer();

  renderInteraction();

  renderPublished();

  renderBilling();

  renderEcosystemPanels();

  renderProfile();

  renderNowPlaying();

  renderNotificationBadge();

  if (!qs('[data-modal-layer]').hidden && qs('.player-fullscreen-card', qs('[data-modal-layer]')))
    showPlayerFullscreen();
}

function showLegalGate(force = false) {
  const overlay = qs('[data-consent-overlay]');
  const profile = activeProfile();
  const roleLegal = roleLegalCopy(profile);
  const roleChanged = state.legalRole !== profile.role;

  if (!force && state.acceptedLegal && !roleChanged) {
    overlay.hidden = true;
    return;
  }

  if (roleChanged && !force) state.legalDraft = { ...defaultState.legalDraft };

  overlay.hidden = false;
  const form = qs('[data-consent-form]');

  qs('#consent-title').textContent = 'Términos y condiciones';

  const lead = qs('[data-consent-role-lead]');
  if (lead) lead.textContent = `${roleLegal.title}. ${roleLegal.lead}`;

  const copyMap = legalConsentCopy(roleLegal);
  Object.keys(copyMap).forEach(name => {
    const text = qs(`[data-legal-copy="${name}"]`, form);
    if (text) text.innerHTML = copyMap[name];
  });

  const draft = state.legalDraft || defaultState.legalDraft;
  ['terms', 'privacy', 'roleData'].forEach(name => {
    form.elements[name].checked = Boolean(draft[name]);
  });

  qs('.consent-submit', form).disabled = !['terms', 'privacy', 'roleData'].every(
    name => form.elements[name].checked
  );
}

function handleConsentForm(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const valid = ['terms', 'privacy', 'roleData'].every(name => form.elements[name].checked);

  if (!valid) return;

  const profile = activeProfile();

  state.acceptedLegal = true;
  state.acceptedAt = new Date().toISOString();
  state.legalRole = profile.role;
  state.legalDraft = { terms: true, privacy: true, roleData: true };

  saveState();

  qs('[data-consent-overlay]').hidden = true;
  toast('Listo. Puedes empezar a explorar; la guía queda en Herramientas.');
}

function showModal(html, className = '') {
  const layer = qs('[data-modal-layer]');
  const classes = ['modal-card', className].filter(Boolean).join(' ');

  layer.innerHTML = `<section class="${classes}" role="dialog" aria-modal="true">${html}</section>`;
  layer.hidden = false;

  requestAnimationFrame(() => {
    const firstControl = qs(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]',
      layer
    );
    if (firstControl) firstControl.focus({ preventScroll: true });
  });
}

function maybeShowViewGuide(view = currentView(), force = false) {
  if (!state.acceptedLegal || !force) return;

  const layer = qs('[data-modal-layer]');
  const overlay = qs('[data-consent-overlay]');

  if ((layer && !layer.hidden) || (overlay && !overlay.hidden)) return;

  const guide = viewGuideCopy(view);

  showModal(
    `
    <div class="guide-hero">
      <p class="eyebrow">${escapeHtml(guide.eyebrow)}</p>
      <h2>${escapeHtml(guide.title)}</h2>
      <p>${escapeHtml(guide.body)}</p>
    </div>
    <div class="guide-role-note"><strong>${escapeHtml(guide.roleLabel)} · ${escapeHtml(guide.roleAction)}</strong><p>${escapeHtml(guide.roleNote)}</p></div>
    <div class="onboarding-actions">
      <button class="primary-button" type="button" data-complete-view-guide="${escapeHtml(view)}">Entendido</button>
      <button class="soft-button" type="button" data-remind-view-guide="${escapeHtml(view)}">Cerrar</button>
    </div>
  `,
    'guide-card'
  );
}

function completeViewGuide(view) {
  if (!state.viewGuidesSeen) state.viewGuidesSeen = {};

  state.viewGuidesSeen[viewGuideKey(view)] = true;

  saveState();

  closeModal();
}

function remindViewGuideLater() {
  closeModal();
}

function showActionGuide(action) {
  const profile = activeProfile();

  const role = roleDefinition(profile);

  const guides = {
    discover: [
      'Descubrir artistas emergentes',
      'Explora cápsulas organizadas por barrio, escena, género y afinidad cultural para saber qué quieres escuchar después.',
    ],

    listen: [
      'Escuchar cápsulas breves',
      'Prueba fragmentos rápidos con historia y señales de contexto antes de decidir si quieres escuchar completo.',
    ],

    save: [
      'Guardar hallazgos',
      'Cuando guardas una canción, KORΛ conserva la razón, permite añadir nota y la puede recordar en notificaciones.',
    ],

    community: [
      'Compartir comunidad',
      'Recomienda, comenta o comparte para que el descubrimiento tenga señales humanas y no solo reproducciones.',
    ],

    role: [
      'Participar según tu rol',
      `${role.label}: tu experiencia se orienta a ${role.action.toLowerCase()} dentro de la escena musical local.`,
    ],
  };

  const [title, body] = guides[action] || guides.discover;

  showModal(
    `<div class="guide-hero"><p class="eyebrow">Acción principal</p><h2>${escapeHtml(title)}</h2><p>${escapeHtml(body)}</p></div><div class="onboarding-actions"><button class="primary-button" type="button" data-close-modal>Entendido</button></div>`,
    'guide-card'
  );
}

function showWelcomeOnboarding(force = false) {
  if (!state.acceptedLegal && !force) return;
  if (!force && state.onboardingSeen) return;

  showModal(
    `
    <div class="onboarding-hero">
      <p class="eyebrow">Bienvenida</p>
      <h2>Explora KORΛ a tu ritmo</h2>
      <p>Esta guía es opcional. Puedes cerrarla ahora y volver a abrirla desde Herramientas cuando quieras.</p>
    </div>
    <div class="onboarding-steps" aria-label="Acciones principales de KORΛ">
      <article class="onboarding-step"><span>01</span><div><strong>Descubre artistas emergentes.</strong><p>Explora por escena, barrio, género y afinidad cultural.</p></div></article>
      <article class="onboarding-step"><span>02</span><div><strong>Escucha con contexto.</strong><p>Cada cápsula combina una muestra breve con historia local.</p></div></article>
      <article class="onboarding-step"><span>03</span><div><strong>Guarda hallazgos.</strong><p>Construye una memoria musical para volver a lo que conectó contigo.</p></div></article>
      <article class="onboarding-step"><span>04</span><div><strong>Participa en comunidad.</strong><p>Comenta, comparte y descubre a través de señales humanas.</p></div></article>
      <article class="onboarding-step"><span>05</span><div><strong>Usa las funciones de tu rol.</strong><p>Artistas, curadores, embajadores y empresas tienen espacios propios.</p></div></article>
    </div>
    <div class="onboarding-actions">
      <button class="primary-button" type="button" data-finish-onboarding>Empezar a explorar</button>
      <button class="soft-button" type="button" data-remind-onboarding>Cerrar</button>
    </div>
  `,
    'onboarding-card'
  );
}

function remindOnboardingLater() {
  state.onboardingSnoozedUntil = Date.now() + 86400000;
  saveState();
  closeModal();
  toast('La guía seguirá disponible en Herramientas.');
}

function finishOnboarding() {
  state.onboardingSeen = true;
  state.onboardingSnoozedUntil = 0;
  saveState();
  closeModal();
  toast('Listo. Puedes seguir explorando KORΛ.');
}

function closeModal() {
  const layer = qs('[data-modal-layer]');

  layer.hidden = true;
  layer.innerHTML = '';
}

function publishTrack(form) {
  const profile = activeProfile();

  if (profile.role !== 'artist') {
    toast('Solo un perfil de artista local puede publicar música.');

    return;
  }

  const formData = new FormData(form);

  const id = `published-${Date.now()}`;

  const audioFile = formData.get('audio');

  const coverFile = formData.get('cover');

  if (audioFile && audioFile.size)
    sessionMedia[id] = { ...(sessionMedia[id] || {}), audio: URL.createObjectURL(audioFile) };

  if (coverFile && coverFile.size)
    sessionMedia[id] = { ...(sessionMedia[id] || {}), cover: URL.createObjectURL(coverFile) };

  const item = {
    id,

    name: formData.get('artist'),

    track: formData.get('track'),

    genre: formData.get('genre'),

    city: profile.city || 'Cali',

    neighborhood: formData.get('neighborhood'),

    scene: formData.get('genre'),

    language: 'Español',

    match: 87,

    duration: 120,

    preview: 30,

    symbol: '✹',

    tone: 'violet',

    cover: '',

    audio: '',

    story: formData.get('story'),

    tags: [
      formData.get('neighborhood'),
      formData.get('genre'),
      'Nuevo lanzamiento',
      formData.get('visibility') ? 'Visible CM' : 'Comunidad',
    ],

    insight: [
      'Cápsula publicada desde el espacio del artista.',
      'Licencia de uso registrada para operación de KORΛ.',
      'Lista para guardado, escucha y lista local.',
    ],

    visibility: Boolean(formData.get('visibility')),
  };

  state.published.push(item);

  state.currentArtist = runtimeArtists().length - 1;

  addCommunityEvent('publish', item, {
    body: `${profile.name} publicó ${item.track} con historia de ${item.neighborhood}.`,
  });

  saveState();

  form.reset();

  renderAll();

  toast('Cápsula publicada, agregada a la comunidad y notificada a sus participantes.');
}

function lowerAccount() {
  state.accountHidden = true;

  state.saved = [];

  state.liked = [];

  state.shared = [];

  state.isPlaying = false;

  stopPlayback();

  saveState();

  renderAll();

  showModal(
    '<h2>Cuenta dada de baja</h2><p>El perfil deja de ser visible inmediatamente. Se limpiaron guardados e interacciones personales de esta sesión. Serás enviado al acceso para elegir o crear otra cuenta.</p><button class="primary-button full" type="button" data-go-login>Ir al acceso</button>'
  );

  setTimeout(() => {
    window.location.href = 'login.html';
  }, 2200);
}

function logoutSession() {
  state.isPlaying = false;
  state.lastPausedAt = Date.now();
  stopPlayback();
  saveState();
  sessionStorage.clear();
  window.location.href = 'login.html';
}

function resetEverything() {
  stopPlayback();

  localStorage.removeItem(STORAGE_KEY);

  localStorage.removeItem(CREATED_KEY);

  sessionStorage.clear();

  window.location.href = 'login.html';
}

function scrollActiveCapsuleIntoView(smooth = true) {
  const track = qs('[data-capsule-grid]');
  if (!track) return;

  const active = qs('.capsule-card[data-current="true"][data-loop-copy="1"]', track);
  if (!active) return;

  const left = active.offsetLeft - Math.max(0, (track.clientWidth - active.clientWidth) / 2);
  track.scrollTo({ left: Math.max(0, left), behavior: smooth ? 'smooth' : 'auto' });
}

function capsuleSequenceWidth(track = qs('[data-capsule-grid]')) {
  if (!track) return 0;
  const firstMiddle = qs('.capsule-card[data-loop-copy="1"]', track);
  const firstNext = qs('.capsule-card[data-loop-copy="2"]', track);
  if (!firstMiddle || !firstNext) return 0;
  return firstNext.offsetLeft - firstMiddle.offsetLeft;
}

function normalizeCapsuleLoop() {
  const track = qs('[data-capsule-grid]');
  if (!track || track.dataset.loopReady !== 'true') return;

  const sequenceWidth = capsuleSequenceWidth(track);
  if (!sequenceWidth) return;

  if (track.scrollLeft < sequenceWidth * 0.35) {
    track.scrollLeft += sequenceWidth;
  } else if (track.scrollLeft > sequenceWidth * 2.65) {
    track.scrollLeft -= sequenceWidth;
  }
}

function scrollCapsules(direction) {
  const track = qs('[data-capsule-grid]');
  const firstCard = track ? qs('.capsule-card', track) : null;

  if (!track || !firstCard) return;

  const styles = getComputedStyle(track);
  const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0;
  const step = firstCard.getBoundingClientRect().width + gap;

  track.scrollBy({ left: direction * step, behavior: 'smooth' });

  clearTimeout(capsuleLoopTimer);
  capsuleLoopTimer = setTimeout(normalizeCapsuleLoop, 420);
}

function updateFileLabel(input) {
  const label = qs(`[data-file-label="${input.name}"]`);

  if (!label) return;

  label.textContent =
    input.files && input.files[0]
      ? input.files[0].name
      : input.name === 'audio'
        ? 'Seleccionar audio'
        : 'Seleccionar portada';
}

function handleGlobalClick(event) {
  const target = event.target.closest('button, a');

  if (!target) return;

  if (target.dataset.viewTarget) setView(target.dataset.viewTarget);

  if (target.dataset.mobileMenu !== undefined) document.body.classList.toggle('sidebar-open');

  if (target.dataset.closeSidebar !== undefined) document.body.classList.remove('sidebar-open');

  if (target.dataset.logout !== undefined) logoutSession();

  if (target.dataset.goLogin !== undefined) window.location.href = 'login.html';

  if (target.dataset.themeToggle !== undefined) {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';

    saveState();

    renderProfileChrome();
  }

  if (target.dataset.setTheme) {
    state.theme = target.dataset.setTheme === 'dark' ? 'dark' : 'light';
    saveState();
    applyInterfacePreferences();
    renderProfileChrome();
    showSettingsPanel();
  }

  if (target.dataset.resetState !== undefined) resetEverything();

  if (target.dataset.nextArtist !== undefined)
    setCurrentArtist(
      state.shuffle ? Math.floor(Math.random() * runtimeArtists().length) : state.currentArtist + 1
    );

  if (target.dataset.capsuleNext !== undefined) scrollCapsules(1);

  if (target.dataset.capsulePrev !== undefined) scrollCapsules(-1);

  if (target.dataset.prevArtist !== undefined) setCurrentArtist(state.currentArtist - 1);

  if (target.dataset.selectArtist !== undefined)
    setCurrentArtist(Number(target.dataset.selectArtist));

  if (target.dataset.goPlayer !== undefined) setView('player');

  if (target.dataset.likeCurrent !== undefined) toggleLikeCurrent();

  if (target.dataset.likeArtist) toggleLikeArtist(target.dataset.likeArtist);

  if (target.dataset.saveCurrent !== undefined) saveArtist(activeArtist().id);

  if (target.dataset.saveArtist) saveArtist(target.dataset.saveArtist);

  if (target.dataset.removeSaved) removeSaved(target.dataset.removeSaved);

  if (target.dataset.replaySaved) replaySaved(target.dataset.replaySaved);

  if (target.dataset.openSaveNote) showSaveNote(target.dataset.openSaveNote);

  if (target.dataset.repostCurrent !== undefined) repostCurrent();

  if (target.dataset.repostArtist) repostArtist(target.dataset.repostArtist);

  if (target.dataset.shareCurrent !== undefined) shareCurrent();

  if (target.dataset.shareMenu !== undefined) shareCurrent();

  if (target.dataset.copyFallbackLink !== undefined) {
    const input = qs('[data-share-fallback-input]');
    if (input) {
      input.select();
      try {
        navigator.clipboard?.writeText(input.value);
      } catch {}
      toast('Enlace copiado.');
    }
  }

  if (target.dataset.shareArtist) {
    const artist = artistById(target.dataset.shareArtist);

    if (artist) {
      state.currentArtist = runtimeArtists().findIndex(item => item.id === artist.id);
      shareCurrent();
    }
  }

  if (target.dataset.togglePlay !== undefined) togglePlay();

  if (target.dataset.togglePreviewMode !== undefined) {
    state.previewMode = state.previewMode === 'short' ? 'full' : 'short';

    state.playback = 0;

    state.isPlaying = false;

    state.audioMessage = 'Modo de reproducción actualizado.';

    stopPlayback();

    saveState();

    renderAll();
  }

  if (target.dataset.discardArtist !== undefined) {
    const artist = activeArtist();

    if (!state.discarded.includes(artist.id)) state.discarded.push(artist.id);

    saveState();

    setCurrentArtist(state.currentArtist + 1);

    toast('Cápsula descartada. Pasamos al siguiente artista.');
  }

  if (target.dataset.addPlaylist !== undefined) {
    const artist = activeArtist();

    if (!state.playlist.includes(artist.id)) state.playlist.push(artist.id);

    addCommunityEvent('playlist', artist);

    saveState();

    renderInteraction();

    renderNotificationBadge();

    toast('Aporte añadido a la lista local y visible como actividad comunitaria.');
  }

  if (target.dataset.interactPost) showCommentComposer(target.dataset.interactPost);

  if (target.dataset.scoutResponsible) registerResponsibleScout(target.dataset.scoutResponsible);

  if (target.dataset.selectPlan) {
    qs('[data-plan-select]').value = target.dataset.selectPlan;

    setView('billing');

    toast('Plan seleccionado. Completa los datos de facturación.');
  }

  if (target.dataset.openLegalGate !== undefined) showLegalGate(true);

  if (target.dataset.deleteAccount !== undefined) lowerAccount();

  if (target.dataset.toggleShuffle !== undefined) {
    state.shuffle = !state.shuffle;

    saveState();

    renderNowPlaying();
    if (target.closest('.settings-modal')) showSettingsPanel();
  }

  if (target.dataset.toggleRepeat !== undefined) {
    state.repeat = !state.repeat;

    saveState();

    renderNowPlaying();
    if (target.closest('.settings-modal')) showSettingsPanel();
  }

  if (target.dataset.openAi !== undefined) showAiAssistant();

  if (target.dataset.toggleDiscoverSummary !== undefined) {
    state.discoverSummaryCollapsed = !state.discoverSummaryCollapsed;

    saveState();

    renderDiscoverSummary();
  }

  if (target.dataset.openOnboarding !== undefined) showWelcomeOnboarding(true);

  if (target.dataset.finishOnboarding !== undefined) finishOnboarding();

  if (target.dataset.remindOnboarding !== undefined) remindOnboardingLater();

  if (target.dataset.openViewGuide !== undefined) maybeShowViewGuide(currentView(), true);

  if (target.dataset.openActionGuide) showActionGuide(target.dataset.openActionGuide);

  if (target.dataset.completeViewGuide) completeViewGuide(target.dataset.completeViewGuide);

  if (target.dataset.remindViewGuide) remindViewGuideLater(target.dataset.remindViewGuide);

  if (target.dataset.aiAction) runAiAction(target.dataset.aiAction);

  if (target.dataset.quickComment) applyQuickComment(target.dataset.quickComment);

  if (target.dataset.voiceComment !== undefined) applyVoiceComment();

  if (target.dataset.openNotificationArtist) {
    const index = runtimeArtists().findIndex(
      item => item.id === target.dataset.openNotificationArtist
    );

    if (index >= 0) {
      closeModal();

      setCurrentArtist(index);

      setView('player');
    }
  }

  if (target.dataset.openNotificationPost) {
    closeModal();

    setView('interaction');
  }

  if (target.dataset.dismissNotification) dismissNotification(target.dataset.dismissNotification);

  if (target.dataset.toggleSetting !== undefined)
    toggleSetting(target.dataset.toggleSetting);

  if (target.dataset.openSettings !== undefined) showSettingsPanel();

  if (target.dataset.openNotifications !== undefined) showNotificationsPanel();

  if (target.dataset.openFriends !== undefined) showFriendsPanel();

  if (target.dataset.openPlayerFullscreen !== undefined) showPlayerFullscreen();

  if (target.dataset.closeModal !== undefined) closeModal();
}

function bindEvents() {
  document.addEventListener('click', handleGlobalClick);

  document.addEventListener('click', event => {
    if (window.innerWidth > 1100 || !document.body.classList.contains('sidebar-open')) return;
    if (event.target.closest('.sidebar') || event.target.closest('[data-mobile-menu]')) return;
    document.body.classList.remove('sidebar-open');
  });

  window.addEventListener(
    'resize',
    () => {
      if (window.innerWidth > 1100) document.body.classList.remove('sidebar-open');
    },
    { passive: true }
  );

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      const layer = qs('[data-modal-layer]');
      if (layer && !layer.hidden) closeModal();
      document.body.classList.remove('sidebar-open');
    }
  });

  const modalLayer = qs('[data-modal-layer]');
  if (modalLayer) {
    modalLayer.addEventListener('click', event => {
      if (event.target === modalLayer) closeModal();
    });
  }

  const capsuleTrack = qs('[data-capsule-grid]');
  if (capsuleTrack) {
    capsuleTrack.addEventListener(
      'scroll',
      () => {
        clearTimeout(capsuleLoopTimer);
        capsuleLoopTimer = setTimeout(normalizeCapsuleLoop, 160);
      },
      { passive: true }
    );
  }

  document.addEventListener('submit', event => {
    if (event.target.dataset.commentForm !== undefined) {
      event.preventDefault();

      submitComment(event.target);
    }

    if (event.target.dataset.friendChatForm !== undefined) {
      event.preventDefault();

      submitFriendMessage(event.target);
    }

    if (event.target.dataset.saveNoteForm !== undefined) {
      event.preventDefault();

      submitSaveNote(event.target);
    }
  });

  qs('[data-consent-form]').addEventListener('submit', handleConsentForm);

  qs('[data-consent-form]').addEventListener('change', event => {
    const form = event.currentTarget;

    state.legalDraft = {
      terms: form.elements.terms.checked,

      privacy: form.elements.privacy.checked,

      roleData: form.elements.roleData.checked,
    };

    saveState();

    qs('.consent-submit', form).disabled = !['terms', 'privacy', 'roleData'].every(
      name => form.elements[name].checked
    );
  });

  qs('[data-payment-form]').addEventListener('submit', event => {
    event.preventDefault();

    generateInvoice(event.currentTarget);
  });

  qs('[data-publish-form]').addEventListener('submit', event => {
    event.preventDefault();

    publishTrack(event.currentTarget);
  });

  qs('[data-player-range]').addEventListener('input', event => {
    state.playback = Number(event.target.value);

    const player = getAudioPlayer();

    if (player && player.src) player.currentTime = state.playback;

    saveState();

    renderPlayer();
  });

  qsa('.file-picker input[type="file"]').forEach(input =>
    input.addEventListener('change', () => updateFileLabel(input))
  );
}

renderAll();

bindEvents();

showLegalGate();