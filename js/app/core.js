/* global activeProfileNameParts, ambassadorDashboard, applyQuickComment, applyVoiceComment, artistAuthorizationCards, artistChecklistCards, artistDashboard, artistHasCompanyAuthorization, artistMetricCards, artistReceptionCount, bindEvents, capsuleSequenceWidth, closeModal, compactArtistCard, companyDashboard, companyMetricCards, companyRadarCard, companySceneCards, companySceneSummary, companyScoutingCards, completeViewGuide, curatorDashboard, dismissNotification, ecosystemConfig, explorerDashboard, finishOnboarding, formatTime, generateInvoice, getAudioPlayer, handleConsentForm, handleGlobalClick, lastRoleSignal, logoutSession, lowerAccount, maybeShowViewGuide, memoryArtistCard, normalizeCapsuleLoop, notificationBelongsToActiveProfile, personalizeBaseNotification, phasePrototypePanel, privacyCards, profileComments, profileCommunityEvents, profileMetricTiles, profileNeighborhoods, profilePlan, profilePlanId, profileRoleSummary, profileScenes, profileSummaryCards, publishTrack, publishedProfileCard, registerResponsibleScout, remindOnboardingLater, remindViewGuideLater, removeSaved, renderAll, renderBilling, renderCapsules, renderDiscoverSummary, renderHero, renderInteraction, renderNotificationBadge, renderNowPlaying, renderPlayer, renderProfile, renderPrototypePanels, renderPublished, renderSaved, replaySaved, repostArtist, repostCurrent, resetEverything, roleDashboard, roleMetricItems, roleWorkspace, runAiAction, saveArtist, scrollActiveCapsuleIntoView, scrollCapsules, setCurrentArtist, settingEnabled, settingsToggleRow, shareCurrent, showActionGuide, showAiAssistant, showCommentComposer, showFriendsPanel, showLegalGate, showModal, showNotificationsPanel, showPlayerFullscreen, showSaveNote, showSettingsPanel, showSharePanel, showWelcomeOnboarding, startClock, startFallbackAudio, startPlayback, stopFallbackAudio, stopPlayback, submitComment, submitFriendMessage, submitSaveNote, toggleLikeArtist, toggleLikeCurrent, togglePlay, toggleSetting, unreadNotifications, updateFileLabel */
/* exported CREATED_KEY, DATA, STORAGE_KEY, activeArtist, activeProfile, addCommunityEvent, allProfiles, applyInterfacePreferences, artistById, audioContext, audioPlayer, avatarMarkup, capsuleLoopTimer, communityActivityCards, communityNotificationItems, communitySignalPanel, communityTypeLabel, createdProfiles, currentView, defaultState, escapeHtml, fallbackNodes, formatCommunityTime, formatMemoryDate, iconActionMarkup, imgMarkup, legalConsentCopy, legalDocLink, loadState, memoryReminderItems, money, nowPlayingHideTimer, playTimer, playerFullscreenContent, qs, qsa, renderProfileChrome, renderSidebarSession, roleActionButtons, roleDefinition, roleFeatureCards, roleLegalCopy, runtimeArtists, saveState, savedReason, sessionMedia, setView, statPill, state, svgIcon, syncViewChrome, toast, viewChromeCopy, viewGuideCopy, viewGuideKey */

const DATA = window.KORA_DATA;

const STORAGE_KEY = 'kora-corte3-state';

const CREATED_KEY = 'kora-created-profiles';

const defaultState = {
  uiVersion: 11,

  profileId: 'luna',

  acceptedLegal: false,

  acceptedAt: null,

  onboardingSeen: false,

  onboardingSnoozedUntil: 0,

  legalRole: null,

  viewGuidesSeen: {},

  viewGuideSnoozed: {},

  discoverSummaryCollapsed: false,

  savedMeta: {},

  legalDraft: { terms: false, privacy: false, roleData: false },

  saved: [],

  liked: [],

  playlist: ['valentina-cruz', 'santa-loma'],

  shared: [],

  discarded: [],

  interactions: {},

  comments: {},

  dismissedNotifications: [],

  settingsState: {
    notifications: true,
    privateMode: false,
    compactMode: false,
    highContrast: false,
  },

  friendMessages: [],

  communityEvents: [],

  scoutingLog: [],

  currentArtist: 0,

  isPlaying: false,

  playback: 0,

  previewMode: 'short',

  theme: 'light',

  invoices: [],

  accountHidden: false,

  published: [],

  audioMessage: '',

  shuffle: false,

  repeat: false,

  reposted: [],

  lastPausedAt: null,
};

let state = loadState();

let playTimer = null;

let audioPlayer = null;

let audioContext = null;

let fallbackNodes = null;

let sessionMedia = {};

let nowPlayingHideTimer = null;

let capsuleLoopTimer = null;

const qs = (selector, scope = document) => scope.querySelector(selector);

const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw)
      return { ...defaultState, currentArtist: Math.floor(Math.random() * DATA.artists.length) };

    const parsed = { ...defaultState, ...JSON.parse(raw) };

    if (parsed.uiVersion !== 11) {
      parsed.uiVersion = 11;

      parsed.currentArtist = Math.floor(Math.random() * DATA.artists.length);
    }

    return parsed;
  } catch {
    return { ...defaultState };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  document.documentElement.dataset.theme = state.theme;
}

function createdProfiles() {
  try {
    return JSON.parse(localStorage.getItem(CREATED_KEY) || '[]');
  } catch {
    return [];
  }
}

function allProfiles() {
  return [...DATA.teamMembers, ...DATA.roleProfiles, ...createdProfiles()];
}

function money(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
}

function activeProfile() {
  return allProfiles().find(item => item.id === state.profileId) || DATA.teamMembers[0];
}

function runtimeArtists() {
  return [
    ...DATA.artists,
    ...state.published.map(item => ({
      ...item,
      audio: sessionMedia[item.id]?.audio || item.audio || '',
      cover: sessionMedia[item.id]?.cover || item.cover || '',
    })),
  ];
}

function activeArtist() {
  return runtimeArtists()[state.currentArtist] || runtimeArtists()[0];
}

function artistById(id) {
  return runtimeArtists().find(artist => artist.id === id);
}

function escapeHtml(value) {
  return String(value ?? '').replace(
    /[&<>'"]/g,
    character =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]
  );
}

function svgIcon(name) {
  const icons = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.4v13.2L18.4 12 8 5.4Z" fill="currentColor"/></svg>',

    pause:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7V5Zm6 0h4v14h-4V5Z" fill="currentColor"/></svg>',

    heart:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.6 10.9 19.6C5.7 14.9 2.3 11.8 2.3 8A4.5 4.5 0 0 1 6.9 3.4c2 0 3.8 1.1 5.1 2.8 1.3-1.7 3.1-2.8 5.1-2.8A4.5 4.5 0 0 1 21.7 8c0 3.8-3.4 6.9-8.6 11.6L12 20.6Zm0-2.7.1-.1c4.8-4.4 7.6-6.9 7.6-9.8a2.6 2.6 0 0 0-2.6-2.6c-1.6 0-3.1 1-3.9 2.4h-2.4C10 6.4 8.5 5.4 6.9 5.4A2.6 2.6 0 0 0 4.3 8c0 2.9 2.8 5.4 7.6 9.8l.1.1Z" fill="currentColor"/></svg>',

    heartFilled:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.6 10.9 19.6C5.7 14.9 2.3 11.8 2.3 8A4.5 4.5 0 0 1 6.9 3.4c2 0 3.8 1.1 5.1 2.8 1.3-1.7 3.1-2.8 5.1-2.8A4.5 4.5 0 0 1 21.7 8c0 3.8-3.4 6.9-8.6 11.6L12 20.6Z" fill="currentColor"/></svg>',

    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" fill="currentColor"/></svg>',

    check:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.4 16.6-4-4 1.4-1.4 2.6 2.6 7.8-7.8 1.4 1.4-9.2 9.2Z" fill="currentColor"/></svg>',

    repost:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h9.2l-2.1-2.1L15.5 3 21 8.5 15.5 14l-1.4-1.9 2.1-2.1H7v3H5V9a2 2 0 0 1 2-2Zm10 10H7.8l2.1 2.1L8.5 21 3 15.5 8.5 10l1.4 1.9L7.8 14H17v-3h2v4a2 2 0 0 1-2 2Z" fill="currentColor"/></svg>',

    share:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 16.1c-1 0-1.9.4-2.5 1.1L8.9 13.4c.1-.4.1-.6.1-.9s0-.5-.1-.9l6.5-3.8A3.4 3.4 0 1 0 14.4 6l-6.5 3.8a3.4 3.4 0 1 0 0 5.4l6.6 3.9A3.4 3.4 0 1 0 18 16.1Z" fill="currentColor"/></svg>',

    comment:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c5 0 9 3.4 9 7.5S17 18 12 18a10 10 0 0 1-3-.4L4 20l1.5-4.2A6.8 6.8 0 0 1 3 10.5C3 6.4 7 3 12 3Z" fill="currentColor"/></svg>',

    expand:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 14h2v3h3v2H5v-5Zm0-9h5v2H7v3H5V5Zm12 12v-3h2v5h-5v-2h3Zm-3-12h5v5h-2V7h-3V5Z" fill="currentColor"/></svg>',

    next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 8 7-8 7V5Zm9 0h2v14h-2V5Z" fill="currentColor"/></svg>',

    prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 19 8 12l8-7v14ZM5 5h2v14H5V5Z" fill="currentColor"/></svg>',

    shuffle:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 3h4v4h-2V6.4l-4.7 4.7-1.4-1.4L17.6 5H17V3ZM3 7h3.6l12 12H21v2h-3.2L5.8 9H3V7Zm11.3 7.2 1.4 1.4L19 12.4V11h2v4h-4v-2h.6l-3.3 3.2ZM3 17h2.8l3.1-3.1 1.4 1.4L6.6 19H3v-2Z" fill="currentColor"/></svg>',

    repeat:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h9.2l-2.1-2.1L15.5 3 21 8.5 15.5 14l-1.4-1.9 2.1-2.1H7v3H5V9a2 2 0 0 1 2-2Zm10 10H7.8l2.1 2.1L8.5 21 3 15.5 8.5 10l1.4 1.9L7.8 14H17v-3h2v4a2 2 0 0 1-2 2Z" fill="currentColor"/></svg>',

    sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',

    moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.2A8.2 8.2 0 0 1 8.8 4a8.2 8.2 0 1 0 11.2 11.2Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',

    close:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',

    friends:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm0 2c-3.2 0-6 1.6-6 3.8V20h12v-2.7c0-2.2-2.8-3.8-6-3.8Zm8.5-1.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 1.7c-.8 0-1.6.1-2.3.4 1.1.9 1.8 2 1.8 3.2V20h4v-2.4c0-2-1.9-3.9-3.5-3.9Z" fill="currentColor"/></svg>',
  };

  return icons[name] || '';
}

function toast(message) {
  const node = qs('[data-toast]');

  node.textContent = message;

  node.classList.add('is-visible');

  clearTimeout(node.timer);

  node.timer = setTimeout(() => node.classList.remove('is-visible'), 3000);
}

function imgMarkup(src, alt, symbol, className = '') {
  if (!src) return `<span class="cover-symbol">${escapeHtml(symbol || '♪')}</span>`;

  return `<img class="${className}" src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'cover-symbol',textContent:'${escapeHtml(symbol || '♪')}' }))">`;
}

function avatarMarkup(profile) {
  if (profile.avatar)
    return `<img src="${escapeHtml(profile.avatar)}" alt="${escapeHtml(profile.name)}" onerror="this.classList.add('is-hidden')"><span>${escapeHtml(profile.initial || profile.name.slice(0, 1))}</span>`;

  return `<span>${escapeHtml(profile.initial || profile.name.slice(0, 1))}</span>`;
}

function roleDefinition(profile) {
  const roles = DATA.roleSystem || {};

  return (
    roles[profile.role] ||
    roles.user || {
      label: profile.roleLabel || 'Explorador musical',
      action: 'Descubrir',
      purpose: 'Participa en el descubrimiento musical local.',
      accountState: 'Explorando Cali',
      accountMeta: 'Guardados, playlists y actividad protegidos.',
      profileAxis: 'Descubrimiento musical',
      interactionHeadline: 'Interacción con artistas, curadores y escena local.',
      interactionCta: 'Sumar a playlist local',
      saveLabel: 'Guardar artista',
      impactTitle: 'artistas visibles',
      impactBody: 'Cada aporte aparece como señal cultural para otros usuarios.',
      workspace: {
        eyebrow: 'Rol',
        title: profile.roleLabel || 'Explorador musical',
        badge: 'KORΛ',
        intro: 'Participa en el ecosistema musical local.',
        features: [],
        actions: [],
      },
      privacy: [],
    }
  );
}

function roleLegalCopy(profile) {
  const role = profile?.role || 'user';

  const legal = DATA.roleLegal || {};

  return (
    legal[role] ||
    legal.user || {
      title: 'Autorizaciones KORΛ',
      lead: 'Acepta las condiciones para continuar.',
      terms: 'Acepto las condiciones de uso de KORΛ.',
      privacy: 'Autorizo el tratamiento de datos personales necesario para usar KORΛ.',
      roleData: 'Acepto el tratamiento de datos asociado a mi rol.',
    }
  );
}

function legalDocLink(doc, label) {
  return `<a href="legal.html?doc=${escapeHtml(doc)}" target="_blank" rel="noopener">${escapeHtml(label)}</a>`;
}

function legalConsentCopy(roleLegal) {
  return {
    terms: `He leído y acepto los ${legalDocLink('terms', 'Términos y Condiciones')} de KORΛ. ${escapeHtml(roleLegal.terms)}`,

    privacy: `Acepto la ${legalDocLink('privacy', 'Autorización de Tratamiento de Datos Personales')}. ${escapeHtml(roleLegal.privacy)}`,

    roleData: `${escapeHtml(roleLegal.roleData)} Consulta también la ${legalDocLink('license', 'Licencia Musical')} y las ${legalDocLink('payments', 'condiciones de pago')} cuando apliquen.`,
  };
}

function currentView() {
  const active = qs('.view.is-active');

  return active?.dataset.view || 'discover';
}

function viewGuideKey(view) {
  return `${activeProfile().role}:${view}`;
}

function viewGuideCopy(view) {
  const profile = activeProfile();

  const role = roleDefinition(profile);

  const guide = (DATA.viewGuides || {})[view] ||
    (DATA.viewGuides || {}).discover || {
      eyebrow: 'Guía KORΛ',
      title: 'Qué vas a encontrar',
      body: 'Esta sección te ayuda a participar en KORΛ.',
      roleNotes: {},
    };

  const roleNote = guide.roleNotes?.[profile.role] || role.purpose;

  return { ...guide, roleNote, roleLabel: role.label, roleAction: role.action };
}

function savedReason(artist) {
  if (!artist) return 'Conectó con tu escena local.';

  const prompts = DATA.memoryPrompts || [];

  if (artist.tags?.length) return `Conectó con ${artist.tags.slice(0, 2).join(' y ')}.`;

  return (
    prompts[Math.abs(String(artist.id || '').length) % prompts.length] ||
    'Conectó con tu escena local.'
  );
}

function formatMemoryDate(value) {
  if (!value) return 'Guardado recientemente';

  const elapsed = Date.now() - new Date(value).getTime();

  if (elapsed < 60000) return 'Guardado hace un momento';

  const minutes = Math.floor(elapsed / 60000);

  if (minutes < 60) return `Guardado hace ${minutes} min`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `Guardado hace ${hours} h`;

  const days = Math.floor(hours / 24);

  return `Guardado hace ${days} d`;
}

function memoryReminderItems() {
  return state.saved
    .map(id => {
      const artist = artistById(id);

      if (!artist) return null;

      const meta = state.savedMeta?.[id] || {};

      return {
        id: `memory-${id}`,

        title: `Vuelve a escuchar ${artist.track}`,

        body: meta.note
          ? `Tu nota: ${meta.note}`
          : `Lo guardaste porque ${meta.reason || savedReason(artist)}`,

        artistId: id,

        memory: true,

        type: 'memory',
      };
    })
    .filter(Boolean);
}

function formatCommunityTime(value) {
  if (!value) return 'Ahora';

  const elapsed = Date.now() - new Date(value).getTime();

  if (elapsed < 60000) return 'Ahora';

  const minutes = Math.floor(elapsed / 60000);

  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours} h`;

  const days = Math.floor(hours / 24);

  return `${days} d`;
}

function communityTypeLabel(type) {
  return DATA.communityTypes?.[type] || 'Comunidad';
}

function addCommunityEvent(type, artist, options = {}) {
  if (!state.communityEvents) state.communityEvents = [];

  const profile = activeProfile();

  const role = roleDefinition(profile);

  const safeArtist = artist || activeArtist();

  const titleByType = {
    save: `${profile.name} guardó ${safeArtist.track}`,

    comment: `${profile.name} comentó un hallazgo`,

    repost: `${profile.name} reposteó ${safeArtist.track}`,

    share: `${profile.name} compartió ${safeArtist.track}`,

    playlist: `${profile.name} sumó ${safeArtist.track} a la playlist local`,

    publish: `${profile.name} publicó una nueva cápsula`,

    curator: `${profile.name} dejó una señal curatorial`,

    context: `${profile.name} agregó contexto cultural`,

    scout: `${profile.name} registró una revisión responsable`,
  };

  const bodyByType = {
    save: `${safeArtist.name} ahora aparece como señal de memoria musical para la comunidad.`,

    comment: options.text || `La conversación suma criterio social sobre ${safeArtist.track}.`,

    repost: `El hallazgo queda visible para amigos, curadores y escena local.`,

    share: `La cápsula viaja con contexto, no solo como enlace suelto.`,

    playlist: `La playlist colaborativa crece con una señal humana de descubrimiento.`,

    publish: `${safeArtist.name} ya tiene una cápsula disponible para escuchar, guardar y comentar.`,

    curator: `La recomendación ayuda a otros usuarios a decidir con razones.`,

    context: `El aporte conecta música, barrio y memoria cultural.`,

    scout: `La revisión queda registrada como scouting responsable con límites de datos autorizados.`,
  };

  state.communityEvents.unshift({
    id: `event-${Date.now()}-${String(Math.random()).slice(2, 7)}`,

    type,

    actor: profile.name,

    actorId: profile.id,

    role: role.label,

    roleAction: role.action,

    artistId: safeArtist.id,

    artistName: safeArtist.name,

    track: safeArtist.track,

    postId: options.postId || '',

    title: options.title || titleByType[type] || `${profile.name} participó en KORΛ`,

    body: options.body || bodyByType[type] || role.purpose,

    note: options.note || '',

    at: new Date().toISOString(),

    notification: options.notification !== false,
  });

  state.communityEvents = state.communityEvents.slice(0, 40);
}

function communityNotificationItems() {
  return (state.communityEvents || [])
    .filter(item => item.notification)
    .map(item => ({
      id: `community-${item.id}`,

      title: item.title,

      body: item.body,

      artistId: item.artistId,

      postId: item.postId,

      community: true,

      type: item.type,

      actor: item.actor,
    }));
}

function communityActivityCards(limit = 6) {
  const events = (state.communityEvents || [])
    .filter(item => !notificationBelongsToActiveProfile(item))
    .slice(0, limit);

  if (!events.length) {
    const active = activeProfileNameParts();

    return DATA.friendActivity
      .filter(item => {
        const name = String(item.name || '')
          .trim()
          .toLowerCase();

        return name !== active.firstName && name !== active.fullName;
      })
      .map(
        item =>
          `<article class="mini-card"><strong>${escapeHtml(item.name)} ${escapeHtml(item.action)}</strong><span>${escapeHtml(item.detail)}</span></article>`
      )
      .join('');
  }

  return events
    .map(
      item =>
        `<article class="mini-card community-mini"><div><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.body)}</span></div><small>${escapeHtml(communityTypeLabel(item.type))} · ${escapeHtml(formatCommunityTime(item.at))}</small></article>`
    )
    .join('');
}

function communitySignalPanel() {
  const events = state.communityEvents || [];

  const comments = Object.values(state.comments || {}).reduce(
    (total, list) => total + list.length,
    0
  );

  const reposts = state.reposted.length;

  const saves = state.saved.length;

  const playlist = state.playlist.length;

  const signals = DATA.communitySignals || [];

  return `<article class="panel-card community-overview"><div class="panel-head"><div><p class="eyebrow">Comunidad activa</p><h2>Lo que pasa alrededor de la música</h2></div><span class="counter-pill">${events.length} señales</span></div><div class="community-metrics"><span><b>${saves}</b><small>Guardados</small></span><span><b>${comments}</b><small>Comentarios</small></span><span><b>${reposts}</b><small>Reposts</small></span><span><b>${playlist}</b><small>Playlist</small></span></div><div class="community-signal-grid">${signals.map(item => `<article class="role-feature"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.body)}</span></article>`).join('')}</div></article>`;
}

function iconActionMarkup(icon, label, active = false, text = '') {
  return `<span class="player-action-icon" aria-hidden="true">${svgIcon(icon)}</span><span class="visually-hidden">${escapeHtml(label)}</span>${text ? `<b class="player-action-label ${active ? 'is-active' : ''}">${escapeHtml(text)}</b>` : ''}`;
}

function statPill(icon, label, value) {
  return `<span class="social-stat" title="${escapeHtml(label)}">${svgIcon(icon)}<b>${escapeHtml(String(value))}</b></span>`;
}

function playerFullscreenContent() {
  const artist = activeArtist();

  const total = state.previewMode === 'short' ? artist.preview : artist.duration;

  const liked = state.liked.includes(artist.id);

  const saved = state.saved.includes(artist.id);

  const reposted = state.reposted.includes(artist.id);

  const percent = Math.min(
    100,
    Math.max(0, total ? Math.round((Math.min(state.playback, total) / total) * 100) : 0)
  );

  return `

    <div class="player-fullscreen-shell tone-${escapeHtml(artist.tone || 'sunset')}">

      <div class="player-fullscreen-backdrop">${imgMarkup(artist.cover, artist.track, artist.symbol)}</div>

      <div class="player-fullscreen-header">

        <button class="top-icon" type="button" data-close-modal aria-label="Cerrar">${svgIcon('prev')}</button>

        <div class="player-fullscreen-title"><p class="eyebrow">Now playing</p><strong>${state.previewMode === 'short' ? 'Cápsula local' : 'Modo extendido'}</strong></div>

        <button class="top-icon" type="button" data-toggle-preview-mode aria-label="Cambiar modo">${svgIcon('expand')}</button>

      </div>

      <div class="player-fullscreen-body">

        <div class="player-fullscreen-cover">${imgMarkup(artist.cover, artist.track, artist.symbol)}</div>

        <div class="player-fullscreen-meta">

          <div>

            <h2>${escapeHtml(artist.track)}</h2>

            <p>${escapeHtml(artist.name)} · ${escapeHtml(artist.genre)}</p>

          </div>

          <div class="player-fullscreen-side-actions">

            <button class="player-icon-button ${liked ? 'is-active' : ''}" type="button" data-like-current title="${liked ? 'Quitar me gusta' : 'Me gusta'}">${svgIcon(liked ? 'heartFilled' : 'heart')}</button>

            <button class="player-icon-button ${saved ? 'is-active' : ''}" type="button" data-save-current title="${saved ? 'Quitar guardado' : 'Guardar'}">${svgIcon(saved ? 'check' : 'plus')}</button>

            <button class="player-icon-button ${reposted ? 'is-active' : ''}" type="button" data-repost-current title="${reposted ? 'Quitar repost' : 'Repostear'}">${svgIcon('repost')}</button>

            <button class="player-icon-button" type="button" data-share-menu title="Compartir">${svgIcon('share')}</button>

          </div>

        </div>

        <div class="player-fullscreen-progress">

          <div class="fullscreen-progress-track"><i style="width:${percent}%"></i></div>

          <div class="fullscreen-time-row"><span>${formatTime(Math.min(state.playback, total))}</span><span>${formatTime(total)}</span></div>

        </div>

        <div class="player-fullscreen-controls">

          <button class="player-circle-button" type="button" data-prev-artist aria-label="Anterior">${svgIcon('prev')}</button>

          <button class="player-main-button" type="button" data-toggle-play aria-label="${state.isPlaying ? 'Pausar' : 'Reproducir'}">${svgIcon(state.isPlaying ? 'pause' : 'play')}</button>

          <button class="player-circle-button" type="button" data-next-artist aria-label="Siguiente">${svgIcon('next')}</button>

        </div>

        <div class="player-fullscreen-subcontrols">

          <button class="soft-button compact-button ${state.shuffle ? 'is-active' : ''}" type="button" data-toggle-shuffle>${svgIcon('shuffle')}<span>Mix</span></button>

          <button class="soft-button compact-button ${state.repeat ? 'is-active' : ''}" type="button" data-toggle-repeat>${svgIcon('repeat')}<span>Loop</span></button>

          <button class="soft-button compact-button" type="button" data-follow-listen>Completa</button>

          <button class="soft-button compact-button" type="button" data-discard-artist>Pasar</button>

        </div>

        <div class="player-fullscreen-story">

          <p>${escapeHtml(artist.story)}</p>

          <div class="tag-row"><span class="tag">${artist.match}% match</span><span class="tag">${escapeHtml(artist.scene)}</span><span class="tag">${escapeHtml(artist.neighborhood)}</span></div>

        </div>

      </div>

    </div>

  `;
}

function roleFeatureCards(features) {
  return (features || [])
    .map(
      item =>
        `<article class="role-feature"><strong>${escapeHtml(item[0])}</strong><span>${escapeHtml(item[1])}</span></article>`
    )
    .join('');
}

function roleActionButtons(actions) {
  return (actions || [])
    .map(item => {
      const className = item[0] === 'primary' ? 'primary-button full' : 'soft-button full';

      const label = escapeHtml(item[1]);

      const action = item[2] || '';

      if (action.startsWith('view:'))
        return `<button class="${className}" type="button" data-view-target="${escapeHtml(action.slice(5))}">${label}</button>`;

      if (action.startsWith('interactPost:'))
        return `<button class="${className}" type="button" data-interact-post="${escapeHtml(action.slice(13))}">${label}</button>`;

      if (action === 'openFriends')
        return `<button class="${className}" type="button" data-open-friends>${label}</button>`;

      if (action === 'saveCurrent')
        return `<button class="${className}" type="button" data-save-current>${label}</button>`;

      if (action === 'openAi')
        return `<button class="${className}" type="button" data-open-ai>${label}</button>`;

      return `<button class="${className}" type="button">${label}</button>`;
    })
    .join('');
}

function viewChromeCopy(view) {
  const copy = {
    discover: ['Descubrir', 'música emergente'],
    player: ['Player', 'escucha activa'],
    interaction: ['Comunidad', 'señales humanas'],
    publish: ['Publicar', 'workspace artista'],
    billing: ['Pagos', 'planes y facturación'],
    profile: ['Perfil', 'tu espacio'],
  };

  return copy[view] || copy.discover;
}

function syncViewChrome(view = currentView()) {
  const [title, subtitle] = viewChromeCopy(view);
  const titleNode = qs('[data-topbar-title]');
  const subtitleNode = qs('[data-topbar-subtitle]');

  if (titleNode) titleNode.textContent = title;
  if (subtitleNode) subtitleNode.textContent = subtitle;
}

function applyInterfacePreferences() {
  document.documentElement.dataset.theme = state.theme === 'dark' ? 'dark' : 'light';
  document.body.classList.toggle('compact-ui', Boolean(state.settingsState?.compactMode));
  document.body.classList.toggle('high-contrast-ui', Boolean(state.settingsState?.highContrast));
  document.body.classList.toggle('private-mode', Boolean(state.settingsState?.privateMode));
}

function setView(view) {
  const profile = activeProfile();

  if (view === 'publish' && profile.role !== 'artist') {
    toast('La pestaña de publicación está disponible para perfiles de artista local.');
    return;
  }

  qsa('[data-view]').forEach(node =>
    node.classList.toggle('is-active', node.dataset.view === view)
  );
  qsa('[data-view-target]').forEach(node =>
    node.classList.toggle('is-active', node.dataset.viewTarget === view)
  );
  document.body.classList.remove('sidebar-open');
  syncViewChrome(view);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderProfileChrome() {
  const profile = activeProfile();

  const role = roleDefinition(profile);

  const isArtist = profile.role === 'artist';

  document.body.classList.toggle('is-artist', isArtist);

  qsa('[data-role-nav="artist"]').forEach(node => node.classList.toggle('hidden', !isArtist));

  qsa('[data-profile-name]').forEach(node => (node.textContent = profile.name));

  qsa('[data-profile-role]').forEach(node => (node.textContent = role.label));

  qsa('[data-profile-initial]').forEach(
    node => (node.textContent = profile.initial || profile.name.slice(0, 1))
  );

  qsa('[data-profile-avatar]').forEach(node => {
    node.src = profile.avatar || '';

    node.alt = profile.name;

    node.classList.toggle('is-hidden', !profile.avatar);
  });

  qs('[data-account-state]').textContent = state.accountHidden
    ? 'Perfil oculto'
    : role.accountState;

  qs('[data-account-meta]').textContent = role.accountMeta;

  applyInterfacePreferences();
  syncViewChrome();

  qsa('[data-theme-toggle]').forEach(button => {
    const toLight = state.theme === 'dark';
    button.innerHTML = `<span data-theme-icon>${svgIcon(toLight ? 'sun' : 'moon')}</span>`;
    button.setAttribute('aria-label', toLight ? 'Activar tema claro' : 'Activar tema oscuro');
    button.setAttribute('title', toLight ? 'Tema claro' : 'Tema oscuro');
  });
}

function renderSidebarSession() {
  const artist = activeArtist();

  const sideCurrent = qs('[data-side-current]');

  if (qs('[data-side-saved]')) qs('[data-side-saved]').textContent = state.saved.length;

  if (qs('[data-side-playlist]')) qs('[data-side-playlist]').textContent = state.playlist.length;

  if (sideCurrent) {
    sideCurrent.innerHTML = `<span class="side-dot tone-${escapeHtml(artist.tone || 'sunset')}">${imgMarkup(artist.cover, artist.track, artist.symbol)}</span><span><b>${escapeHtml(artist.track)}</b><small>${escapeHtml(artist.name)}</small></span>`;
  }
}
