/* global CREATED_KEY, DATA, STORAGE_KEY, activeArtist, activeProfile, activeProfileNameParts, addCommunityEvent, allProfiles, ambassadorDashboard, applyInterfacePreferences, applyQuickComment, applyVoiceComment, artistAuthorizationCards, artistById, artistChecklistCards, artistDashboard, artistHasCompanyAuthorization, artistMetricCards, artistReceptionCount, audioContext, audioPlayer, avatarMarkup, bindEvents, capsuleLoopTimer, capsuleSequenceWidth, closeModal, communityActivityCards, communityNotificationItems, communitySignalPanel, communityTypeLabel, compactArtistCard, companyDashboard, companyMetricCards, companyRadarCard, companySceneCards, companySceneSummary, companyScoutingCards, completeViewGuide, createdProfiles, curatorDashboard, currentView, defaultState, dismissNotification, ecosystemConfig, escapeHtml, explorerDashboard, fallbackNodes, finishOnboarding, formatCommunityTime, formatMemoryDate, generateInvoice, handleConsentForm, handleGlobalClick, iconActionMarkup, imgMarkup, lastRoleSignal, legalConsentCopy, legalDocLink, loadState, logoutSession, lowerAccount, maybeShowViewGuide, memoryArtistCard, memoryReminderItems, money, normalizeCapsuleLoop, notificationBelongsToActiveProfile, nowPlayingHideTimer, personalizeBaseNotification, ecosystemOverviewPanel, playTimer, playerFullscreenContent, privacyCards, profileComments, profileCommunityEvents, profileMetricTiles, profileNeighborhoods, profilePlan, profilePlanId, profileRoleSummary, profileScenes, profileSummaryCards, publishTrack, publishedProfileCard, qs, qsa, registerResponsibleScout, remindOnboardingLater, remindViewGuideLater, renderAll, renderBilling, renderDiscoverSummary, renderInteraction, renderNotificationBadge, renderNowPlaying, renderProfile, renderProfileChrome, renderEcosystemPanels, renderPublished, renderSidebarSession, resetEverything, roleActionButtons, roleDashboard, roleDefinition, roleFeatureCards, roleLegalCopy, roleMetricItems, roleWorkspace, runAiAction, runtimeArtists, saveState, savedReason, scrollActiveCapsuleIntoView, scrollCapsules, sessionMedia, setView, settingEnabled, settingsToggleRow, showActionGuide, showAiAssistant, showCommentComposer, showFriendsPanel, showLegalGate, showModal, showNotificationsPanel, showPlayerFullscreen, showSettingsPanel, showSharePanel, showWelcomeOnboarding, statPill, state, submitComment, submitFriendMessage, svgIcon, syncViewChrome, toast, toggleSetting, unreadNotifications, updateFileLabel, viewChromeCopy, viewGuideCopy, viewGuideKey */
/* exported formatTime, getAudioPlayer, removeSaved, renderCapsules, renderHero, renderPlayer, renderSaved, replaySaved, repostArtist, repostCurrent, saveArtist, setCurrentArtist, shareCurrent, showSaveNote, startClock, startFallbackAudio, startPlayback, stopFallbackAudio, stopPlayback, submitSaveNote, toggleLikeArtist, toggleLikeCurrent, togglePlay */

function renderHero() {
  const artist = activeArtist();

  qs('[data-hero-panel]').className = `hero-panel tone-${artist.tone || 'sunset'}`;

  qs('[data-hero-panel]').innerHTML = `

    <div class="hero-copy">

      <p class="eyebrow">${escapeHtml(artist.city)} · ${escapeHtml(artist.neighborhood)}</p>

      <h2>${escapeHtml(artist.name)} en ${escapeHtml(artist.preview)} segundos.</h2>

      <p>${escapeHtml(artist.story)}</p>

      <div class="tag-row">${artist.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div>

      <div class="action-row">

        <button class="primary-button" type="button" data-go-player>Escuchar cápsula</button>

        <button class="soft-button" type="button" data-save-current>Guardar hallazgo</button>

        <button class="soft-button" type="button" data-share-current>Compartir con contexto</button>

      </div>

    </div>

    <div class="hero-art tone-surface">${imgMarkup(artist.cover, artist.track, artist.symbol)}</div>

  `;
}

function renderCapsules() {
  const artists = runtimeArtists();
  const track = qs('[data-capsule-grid]');

  if (!track || !artists.length) return;

  const previousScroll = track.dataset.loopReady === 'true' ? track.scrollLeft : null;
  const sets = [0, 1, 2];

  track.innerHTML = sets
    .map(loopCopy =>
      artists
        .map((artist, index) => {
          const saved = state.saved.includes(artist.id);
          const current = index === state.currentArtist;
          const playing = current && state.isPlaying;

          return `
      <article class="capsule-card tone-${escapeHtml(artist.tone || 'sunset')} ${playing ? 'is-playing' : ''}"
        data-loop-card="${index}" data-loop-copy="${loopCopy}" data-current="${current ? 'true' : 'false'}">
        <div class="capsule-cover tone-surface">${imgMarkup(artist.cover, artist.track, artist.symbol)}</div>
        <div class="capsule-copy">
          <div class="capsule-title-row">
            <p class="eyebrow">${escapeHtml(artist.scene)}</p>
            ${playing ? '<span class="capsule-playing-status">Sonando</span>' : ''}
          </div>
          <h3>${escapeHtml(artist.track)}</h3>
          <p>${escapeHtml(artist.name)} · ${escapeHtml(artist.genre)}</p>
        </div>
        <div class="tag-row"><span class="tag">${escapeHtml(artist.neighborhood)}</span><span class="tag">${artist.match}% afinidad</span><span class="tag">${escapeHtml(artist.language)}</span></div>
        <div class="action-row">
          <button class="soft-button" type="button" data-select-artist="${index}">Ver</button>
          <button class="soft-button ${saved ? 'is-active' : ''}" type="button" data-save-artist="${escapeHtml(artist.id)}">${saved ? 'Guardado' : 'Guardar'}</button>
        </div>
      </article>
    `;
        })
        .join('')
    )
    .join('');

  requestAnimationFrame(() => {
    track.dataset.loopReady = 'true';

    if (previousScroll === null || !Number.isFinite(previousScroll)) {
      scrollActiveCapsuleIntoView(false);
      return;
    }

    const sequenceWidth = capsuleSequenceWidth(track);
    if (!sequenceWidth) return;

    const relative =
      (((previousScroll - sequenceWidth) % sequenceWidth) + sequenceWidth) % sequenceWidth;
    track.scrollLeft = sequenceWidth + relative;
  });
}

function renderSaved() {
  if (!state.savedMeta) state.savedMeta = {};

  const savedArtists = state.saved.map(artistById).filter(Boolean);

  qs('[data-saved-count]').textContent = savedArtists.length;

  qs('[data-saved-board]').innerHTML = savedArtists.length
    ? savedArtists
        .map(artist => {
          const meta = state.savedMeta[artist.id] || {};

          const reason = meta.reason || savedReason(artist);

          return `

    <article class="list-item memory-card">

      <span class="list-cover tone-${escapeHtml(artist.tone || 'sunset')}">${imgMarkup(artist.cover, artist.track, artist.symbol)}</span>

      <div class="list-item-content memory-content">

        <strong>${escapeHtml(artist.name)}</strong>

        <span>${escapeHtml(artist.track)} · ${escapeHtml(artist.neighborhood)}</span>

        <small>${escapeHtml(formatMemoryDate(meta.savedAt))}</small>

        <p>Lo guardaste porque ${escapeHtml(reason)}</p>

        ${meta.note ? `<em>${escapeHtml(meta.note)}</em>` : `<em>Sin nota personal todavía.</em>`}

      </div>

      <div class="memory-actions">

        <button class="primary-button" type="button" data-replay-saved="${escapeHtml(artist.id)}">Vuelve a escuchar</button>

        <button class="soft-button" type="button" data-open-save-note="${escapeHtml(artist.id)}">Nota</button>

        <button class="soft-button" type="button" data-remove-saved="${escapeHtml(artist.id)}">Quitar</button>

      </div>

    </article>

  `;
        })
        .join('')
    : '<div class="empty-state">Todavía no tienes hallazgos guardados. Cuando guardes una cápsula, KORΛ recordará por qué conectó contigo.</div>';

  qs('[data-signal-tags]').innerHTML = [
    'Decisión rápida',
    'Contexto cultural',
    'Barrio',
    'Escena',
    'Idioma',
    'Afinidad',
    'Guardados',
    'Impacto social',
  ]
    .map(tag => `<span class="tag">${tag}</span>`)
    .join('');
}

function renderPlayer() {
  const artist = activeArtist();

  const total = state.previewMode === 'short' ? artist.preview : artist.duration;

  const liked = state.liked.includes(artist.id);

  const saved = state.saved.includes(artist.id);

  const reposted = state.reposted.includes(artist.id);

  qs('[data-player-panel]').className = `player-panel tone-${artist.tone || 'sunset'}`;

  qs('[data-player-panel]').innerHTML = `
    <div class="cover-art tone-surface player-cover-shell">
      ${imgMarkup(artist.cover, artist.track, artist.symbol)}
      <button class="player-cover-expand" type="button" data-open-player-fullscreen aria-label="Expandir reproductor">${svgIcon('expand')}</button>
    </div>
    <div class="player-copy">
      <div class="player-kicker-row">
        <p class="eyebrow">${escapeHtml(artist.city)} · ${escapeHtml(artist.neighborhood)}</p>
        <span class="status-chip">${state.previewMode === 'short' ? `${artist.preview} s` : 'Completa'}</span>
      </div>
      <h2>${escapeHtml(artist.track)}</h2>
      <p class="player-artistline"><strong>${escapeHtml(artist.name)}</strong><span>${escapeHtml(artist.genre)} · ${escapeHtml(artist.scene)}</span></p>
      <p class="player-story">${escapeHtml(artist.story)}</p>
      <div class="tag-row"><span class="tag">${artist.match}% afinidad</span><span class="tag">${escapeHtml(artist.language)}</span></div>
    </div>
  `;

  qs('[data-player-range]').max = total;

  qs('[data-player-range]').value = Math.min(state.playback, total);

  qs('[data-player-current]').textContent = formatTime(Math.min(state.playback, total));

  qs('[data-player-total]').textContent = formatTime(total);

  const playButton = qs('[data-toggle-play]');

  if (playButton) {
    playButton.innerHTML = `${svgIcon(state.isPlaying ? 'pause' : 'play')}<span class="visually-hidden">${state.isPlaying ? 'Pausar' : 'Reproducir'}</span>`;

    playButton.setAttribute('aria-label', state.isPlaying ? 'Pausar' : 'Reproducir');
  }

  const previewButton = qs('[data-toggle-preview-mode]');

  if (previewButton)
    previewButton.innerHTML = `${svgIcon('expand')}<span>${state.previewMode === 'short' ? 'Escuchar canción completa' : 'Volver a cápsula de 30 s'}</span>`;

  qsa('[data-like-current]').forEach(button => {
    button.classList.toggle('is-active', liked);
    const label = liked ? 'Quitar me gusta' : 'Me gusta';
    button.innerHTML = button.classList.contains('player-action')
      ? iconActionMarkup(
          liked ? 'heartFilled' : 'heart',
          label,
          liked,
          liked ? 'Te gusta' : 'Me gusta'
        )
      : svgIcon(liked ? 'heartFilled' : 'heart');
    button.setAttribute('title', label);
    button.setAttribute('aria-label', label);
  });

  qsa('[data-save-current]').forEach(button => {
    if (button.classList.contains('player-action')) {
      button.classList.toggle('is-active', saved);

      button.innerHTML = iconActionMarkup(
        saved ? 'check' : 'plus',
        saved ? 'Quitar guardado' : 'Guardar',
        saved,
        saved ? 'Guardado' : 'Guardar'
      );

      button.setAttribute('title', saved ? 'Quitar guardado' : 'Guardar');
    }
  });

  qsa('[data-repost-current]').forEach(button => {
    button.classList.toggle('is-active', reposted);
    const label = reposted ? 'Quitar recomendación' : 'Recomendar';
    button.innerHTML = button.classList.contains('player-action')
      ? iconActionMarkup('repost', label, reposted, reposted ? 'Recomendado' : 'Recomendar')
      : svgIcon('repost');
    button.setAttribute('title', label);
    button.setAttribute('aria-label', label);
  });

  qsa('[data-share-menu]').forEach(button => {
    if (button.classList.contains('player-action')) {
      button.innerHTML = iconActionMarkup('share', 'Compartir', false, 'Compartir');

      button.setAttribute('title', 'Compartir');
    }
  });

  qs('[data-audio-state]').textContent = state.audioMessage || 'Audio listo para reproducir.';

  qs('[data-player-insights]').innerHTML = artist.insight
    .map(
      item =>
        `<article class="insight-card"><strong>${escapeHtml(item)}</strong><span>Señal para decidir sin perder el contexto local.</span></article>`
    )
    .join('');

  qs('[data-queue-list]').innerHTML = runtimeArtists()
    .map(
      (item, index) => `

    <button class="list-item clickable" type="button" data-select-artist="${index}">

      <span class="list-cover tone-${escapeHtml(item.tone || 'sunset')}">${imgMarkup(item.cover, item.track, item.symbol)}</span>

      <span class="list-item-content"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.track)} · ${item.match}%</span></span>

    </button>

  `
    )
    .join('');
}

function formatTime(seconds) {
  const safe = Math.max(0, Math.floor(seconds));

  const minutes = Math.floor(safe / 60);

  const rest = String(safe % 60).padStart(2, '0');

  return `${minutes}:${rest}`;
}

function setCurrentArtist(index) {
  const artists = runtimeArtists();

  const wasPlaying = state.isPlaying;

  state.currentArtist = (index + artists.length) % artists.length;

  state.playback = 0;

  state.isPlaying = false;

  state.audioMessage = 'Audio listo para reproducir.';

  stopPlayback();

  saveState();

  renderAll();

  if (wasPlaying) setTimeout(startPlayback, 80);
}

function toggleLikeCurrent() {
  const artist = activeArtist();

  if (state.liked.includes(artist.id)) state.liked = state.liked.filter(item => item !== artist.id);
  else state.liked.push(artist.id);

  saveState();

  renderAll();

  toast(state.liked.includes(artist.id) ? 'Marcado como me gusta.' : 'Me gusta retirado.');
}

function toggleLikeArtist(id) {
  const artist = artistById(id);

  if (!artist) return;

  const isLiked = state.liked.includes(id);

  state.liked = isLiked ? state.liked.filter(item => item !== id) : [...state.liked, id];

  saveState();

  renderAll();
}

function saveArtist(id) {
  const artist = artistById(id);

  if (!artist) return;

  if (!state.savedMeta) state.savedMeta = {};

  if (state.saved.includes(id)) {
    state.saved = state.saved.filter(item => item !== id);

    delete state.savedMeta[id];

    saveState();

    renderAll();

    toast('Hallazgo retirado de tu tablero.');

    return;
  }

  state.saved.push(id);

  state.savedMeta[id] = {
    savedAt: new Date().toISOString(),

    reason: savedReason(artist),

    note: '',

    reminderAt: Date.now() + 86400000,
  };

  addCommunityEvent('save', artist, {
    body: `${activeProfile().name} guardó ${artist.track} porque ${savedReason(artist)}`,
  });

  saveState();

  renderAll();

  toast('Hallazgo guardado. También aparece como señal comunitaria.');
}

function removeSaved(id) {
  state.saved = state.saved.filter(item => item !== id);

  if (state.savedMeta) delete state.savedMeta[id];

  saveState();

  renderAll();
}

function replaySaved(id) {
  const index = runtimeArtists().findIndex(item => item.id === id);

  if (index >= 0) {
    setCurrentArtist(index);

    setView('player');

    toast('Hallazgo abierto para volver a escucharlo.');
  }
}

function showSaveNote(id) {
  const artist = artistById(id);

  if (!artist) return;

  const meta = state.savedMeta?.[id] || {};

  showModal(
    `<h2>Nota para ${escapeHtml(artist.track)}</h2><p>Agrega una razón breve para recordar por qué guardaste este hallazgo.</p><form class="settings-list" data-save-note-form="${escapeHtml(id)}"><label>Nota personal<textarea name="note" maxlength="160">${escapeHtml(meta.note || '')}</textarea></label><button class="primary-button full" type="submit">Guardar nota</button><button class="soft-button full" type="button" data-close-modal>Cerrar</button></form>`
  );
}

function submitSaveNote(form) {
  const id = form.dataset.saveNoteForm;

  const artist = artistById(id);

  if (!artist) return;

  if (!state.savedMeta) state.savedMeta = {};

  state.savedMeta[id] = {
    ...(state.savedMeta[id] || {}),
    savedAt: state.savedMeta[id]?.savedAt || new Date().toISOString(),
    reason: state.savedMeta[id]?.reason || savedReason(artist),
    note: new FormData(form).get('note').trim(),
    reminderAt: Date.now() + 86400000,
  };

  saveState();

  closeModal();

  renderAll();

  toast('Nota guardada en tu memoria musical.');
}

function repostArtist(id) {
  const artist = artistById(id) || activeArtist();

  if (state.reposted.includes(artist.id)) {
    state.reposted = state.reposted.filter(item => item !== artist.id);

    toast('Recomendación retirada de tu perfil.');
  } else {
    state.reposted.push(artist.id);

    addCommunityEvent('repost', artist);

    toast(`Recomendaste ${artist.track} en tu actividad comunitaria.`);
  }

  saveState();

  renderAll();
}

function repostCurrent() {
  repostArtist(activeArtist().id);
}

async function shareCurrent() {
  const artist = activeArtist();
  const url = new URL('index.html', window.location.href);
  url.searchParams.set('artista', artist.id);
  const payload = {
    title: `${artist.track} · ${artist.name} en KORΛ`,
    text: `Escucha ${artist.track} de ${artist.name} y conoce su contexto en KORΛ.`,
    url: url.href,
  };

  if (!state.shared.includes(artist.id)) state.shared.push(artist.id);
  addCommunityEvent('share', artist, { notification: false });
  saveState();
  renderAll();

  if (navigator.share) {
    try {
      await navigator.share(payload);
      toast('Cápsula compartida.');
      return;
    } catch (error) {
      if (error?.name === 'AbortError') return;
    }
  }

  try {
    await navigator.clipboard.writeText(payload.url);
    toast('Enlace de la cápsula copiado.');
  } catch {
    showSharePanel(payload);
  }
}

function getAudioPlayer() {
  if (!audioPlayer && typeof Audio !== 'undefined') {
    audioPlayer = new Audio();

    audioPlayer.preload = 'auto';
  }

  return audioPlayer;
}

function stopFallbackAudio() {
  if (fallbackNodes) {
    try {
      fallbackNodes.oscillator.stop();
    } catch {}

    try {
      fallbackNodes.gain.disconnect();

      fallbackNodes.oscillator.disconnect();
    } catch {}

    fallbackNodes = null;
  }
}

function startFallbackAudio() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;

  if (!AudioCtx) return;

  audioContext = audioContext || new AudioCtx();

  if (audioContext.state === 'suspended') audioContext.resume();

  stopFallbackAudio();

  const oscillator = audioContext.createOscillator();

  const gain = audioContext.createGain();

  const artist = activeArtist();

  const base = 180 + (state.currentArtist % 6) * 32;

  oscillator.type = 'triangle';

  oscillator.frequency.setValueAtTime(base, audioContext.currentTime);

  oscillator.frequency.linearRampToValueAtTime(base * 1.5, audioContext.currentTime + 0.35);

  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);

  gain.gain.exponentialRampToValueAtTime(0.055, audioContext.currentTime + 0.08);

  gain.gain.exponentialRampToValueAtTime(0.018, audioContext.currentTime + 0.7);

  oscillator.connect(gain).connect(audioContext.destination);

  oscillator.start();

  fallbackNodes = { oscillator, gain, artistId: artist.id };
}

function startClock(total) {
  clearInterval(playTimer);

  playTimer = setInterval(() => {
    const player = getAudioPlayer();

    if (player && !player.paused && player.src)
      state.playback = Math.min(Math.floor(player.currentTime), total);
    else state.playback = Math.min(state.playback + 1, total);

    if (state.playback >= total || (player && player.ended)) {
      if (state.repeat) {
        state.playback = 0;

        const playerNode = getAudioPlayer();

        if (playerNode && playerNode.src) playerNode.currentTime = 0;
      } else {
        state.playback = total;

        state.isPlaying = false;

        stopPlayback();
      }
    }

    saveState();

    renderPlayer();

    renderNowPlaying();
  }, 600);
}

function startPlayback() {
  stopPlayback();

  state.lastPausedAt = null;

  const artist = activeArtist();

  const total = state.previewMode === 'short' ? artist.preview : artist.duration;

  const player = getAudioPlayer();

  state.isPlaying = true;

  state.audioMessage = 'Reproduciendo cápsula.';

  saveState();

  if (player && artist.audio) {
    const url = new URL(artist.audio, window.location.href).href;

    if (player.src !== url) player.src = url;

    player.currentTime = Math.min(state.playback, Math.max(total - 1, 0));

    player
      .play()
      .then(() => {
        state.audioMessage = 'Audio real enlazado correctamente.';

        saveState();

        startClock(total);

        renderPlayer();
      })
      .catch(() => {
        state.audioMessage =
          'No se encontró el WAV o el navegador bloqueó el archivo. Se activa preescucha funcional.';

        startFallbackAudio();

        startClock(total);

        renderPlayer();
      });
  } else {
    state.audioMessage = 'No hay archivo de audio asociado. Se activa preescucha funcional.';

    startFallbackAudio();

    startClock(total);
  }

  renderPlayer();

  renderNowPlaying();

  renderNotificationBadge();
}

function stopPlayback() {
  clearInterval(playTimer);

  playTimer = null;

  const player = getAudioPlayer();

  if (player) player.pause();

  stopFallbackAudio();
}

function togglePlay() {
  if (state.isPlaying) {
    state.isPlaying = false;

    state.lastPausedAt = Date.now();

    state.audioMessage = 'Pausado.';

    stopPlayback();

    saveState();

    renderPlayer();

    renderNowPlaying();

    return;
  }

  startPlayback();
}