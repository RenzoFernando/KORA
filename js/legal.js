const DATA = window.KORA_DATA;

const qs = (selector, scope = document) => scope.querySelector(selector);
const params = new URLSearchParams(window.location.search);
const legalRoutes = {
  terms: {
    label: 'Términos y condiciones',
    path: 'legal/terminos/',
    title: 'Términos de uso de KORΛ | Documento legal',
    description: 'Consulta los términos que regulan el acceso a KORΛ, los roles de usuario, la baja de cuenta y las responsabilidades de uso.',
  },
  privacy: {
    label: 'Datos personales',
    path: 'legal/privacidad/',
    title: 'Privacidad y datos personales en KORΛ | Documento legal',
    description: 'Consulta qué datos contempla KORΛ, para qué se usan y qué límites de visibilidad se aplican según el rol.',
  },
  license: {
    label: 'Licencia musical',
    path: 'legal/licencia-musical/',
    title: 'Licencia musical de KORΛ | Derechos y retiro de contenido',
    description: 'Consulta la licencia no exclusiva, los derechos morales y el procedimiento de retiro de contenido descritos por KORΛ.',
  },
  payments: {
    label: 'Pagos',
    path: 'legal/pagos/',
    title: 'Pagos y facturación en KORΛ | Condiciones comerciales',
    description: 'Consulta las condiciones de precios, facturación, retracto y reversión previstas para las suscripciones de KORΛ.',
  },
};

let active = params.get('doc') || 'terms';
if (!DATA.legalDocs[active]) active = 'terms';

function escapeHtml(value) {
  return String(value).replace(
    /[&<>'"]/g,
    character =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]
  );
}

function syncMetadata() {
  const route = legalRoutes[active];
  document.title = route.title;
  qs('meta[name="description"]').setAttribute('content', route.description);
  qs('[data-legal-canonical]').setAttribute(
    'href',
    `https://renzofernando.github.io/KORA/${route.path}`
  );
}

function renderTabs() {
  qs('[data-legal-tabs]').innerHTML = Object.entries(legalRoutes)
    .map(
      ([key, route]) =>
        `<a class="soft-button ${key === active ? 'is-active' : ''}" href="${route.path}" ${key === active ? 'aria-current="page"' : ''}>${route.label}</a>`
    )
    .join('');
}

function renderDocument() {
  const doc = DATA.legalDocs[active];

  qs('[data-legal-document]').innerHTML = `
    <p class="eyebrow">KORΛ</p>
    <h1>${escapeHtml(doc.title)}</h1>
    <p>${escapeHtml(doc.lead)}</p>
    ${doc.sections.map(section => `<section class="legal-section"><h2>${escapeHtml(section[0])}</h2><p>${escapeHtml(section[1])}</p></section>`).join('')}
    <section class="legal-section"><a class="primary-button" href="index.html">Volver a KORΛ</a></section>
  `;
}

syncMetadata();
renderTabs();
renderDocument();
