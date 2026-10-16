import { person, projects, ui } from './content.mjs';

/**
 * Template tag for readable multi-line markup. Line breaks and the indentation that
 * follows them are removed from the literal parts only, so the generated HTML stays
 * compact and interpolated content is never altered. Arrays are joined without separators.
 */
const html = (strings, ...values) =>
  strings.reduce((out, part, i) => {
    const value = i === 0 ? '' : values[i - 1];
    return out + (Array.isArray(value) ? value.join('') : (value ?? '')) + part.replace(/\n\s*/g, '');
  }, '');

export const escape = (value = '') =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );

export const route = (locale, page = '') =>
  `${locale === 'en' ? '/en' : ''}/${page ? `${page.replace(/^\/+|\/+$/g, '')}/` : ''}`;

const symbol = html`
  <svg viewBox="0 0 40 40" aria-hidden="true">
    <path d="M14 3h12v7h7v7h7v8h-7v7h-7v7H14v-7H7v-7H0v-8h7v-7h7z"/>
    <path d="M14 17h12v8H14z"/>
  </svg>`;
const external = 'target="_blank" rel="noopener noreferrer"';
const cv = (locale) => `/assets/cv/Arnie_Calderon_${locale.toUpperCase()}.pdf`;
const other = (locale) => (locale === 'es' ? 'en' : 'es');

function header(locale, page, home) {
  const t = ui[locale];
  const links = ['projects', 'about', 'contact'].map(
    (key) => html`
      <a href="${route(locale, key)}" ${page === key || page.startsWith(`${key}/`) ? 'aria-current="page"' : ''}>${t[key]}</a>`
  );
  return html`
    <a class="skip" href="#main">${t.skip}</a>
    <header class="site-header">
      <a class="identity" href="${route(locale)}" aria-label="Arnie Calderón · ${t.home}">
        ${symbol}<span>AC<span class="identity-dot">.</span></span>
      </a>
      <nav id="site-nav" class="site-nav" aria-label="${locale === 'es' ? 'Navegación principal' : 'Main navigation'}">${links}</nav>
      <div class="header-actions">
        ${home ? html`<button id="view-mode" class="quiet-button" hidden>${t.reading}</button>` : ''}
        <a class="language-switch" href="${route(other(locale), page)}" lang="${other(locale)}" hreflang="${other(locale)}" aria-label="${locale === 'es' ? 'Read this page in English' : 'Leer esta página en español'}">${other(locale).toUpperCase()}</a>
        <a class="cv" href="${cv(locale)}" download>${t.cv} <span aria-hidden="true">↓</span></a>
        <button id="menu-toggle" class="menu-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="${t.menu}">
          <span></span><span></span>
        </button>
      </div>
    </header>`;
}

function footer(locale) {
  const t = ui[locale];
  return html`
    <footer class="site-footer">
      <a class="footer-call" href="${route(locale, 'contact')}">${t.contactCta}<span aria-hidden="true">↗</span></a>
      <div class="footer-bottom">
        <span>Arnie Calderón · ${t.location}</span>
        <p>${t.title}.</p>
        <div>
          <a href="${person.github}" ${external}>GitHub</a>
          <a href="${person.linkedin}" ${external}>LinkedIn</a>
          <a href="mailto:${person.email}">Email</a>
        </div>
      </div>
    </footer>`;
}

function tags(project) {
  return html`
    <ul class="tags" aria-label="${project.name}">
      ${project.stack.map((s) => html`<li>${escape(s)}</li>`)}
    </ul>`;
}

const imprexArt = html`
  <span class="imprex-art">IMPREX<small>EUROPE</small><span>React / SAP / Sales Layer</span></span>`;

function projectRow(project, locale, heading = 3) {
  const c = project[locale];
  const href = route(locale, `projects/${project.slug}`);
  const preview = project.images.length
    ? html`<img src="${project.images[0]}" width="800" height="500" alt="" loading="lazy" decoding="async">`
    : imprexArt;
  return html`
    <article class="project-row">
      <a class="project-preview ${project.images.length ? '' : 'imprex-preview'}" href="${href}" tabindex="-1" aria-hidden="true">${preview}</a>
      <div class="project-info">
        <span class="project-type">${project.type[locale]}</span>
        <h${heading}><a href="${href}">${project.name}<span aria-hidden="true">↗</span></a></h${heading}>
        <p>${escape(c.summary)}</p>
        ${tags(project)}
        <span class="project-role">${escape(project.role[locale])}</span>
      </div>
    </article>`;
}

function stories(locale) {
  const t = ui[locale];
  return ['ventify', 'imprex', 'origen'].map((name) => {
    const p = projects.find((project) => project.slug === name);
    const title = p?.name ?? t.stories.origen[0];
    const role = p?.role[locale] ?? t.stories.origen[1];
    const body = p
      ? html`<p>${escape(p[locale].context)}</p><p>${escape(p[locale].summary)}</p>`
      : html`<p>${escape(t.stories.origen[2])}</p>`;
    return html`
      <template id="story-${name}">
        <p class="story-location">${t.labels[name][1]}</p>
        <h2 id="story-title">${escape(title)}</h2>
        <p class="story-role">${escape(role)}</p>
        <div class="story-body">${body}</div>
        <a class="text-link" href="${route(locale, p ? `projects/${name}` : 'about')}">${p ? t.case : t.about} <span aria-hidden="true">↗</span></a>
        <span class="story-bottom">${t.path}</span>
      </template>`;
  });
}

const placeRoute = (locale, name) => route(locale, name === 'origen' ? 'about' : `projects/${name}`);
const destinationNotes = {
  es: { ventify: 'Mi producto', imprex: 'Mi experiencia', origen: 'Sobre mí' },
  en: { ventify: 'My product', imprex: 'My experience', origen: 'About me' },
};

function home(locale) {
  const t = ui[locale];
  const labels = Object.entries(t.labels);
  return html`
    <div id="landscape" class="landscape" aria-hidden="true"></div>
    <div class="world-shade" aria-hidden="true"></div>
    <main id="main" tabindex="-1">
      <section class="home-hero" aria-labelledby="name">
        <div class="introduction" id="intro">
          <div class="intro-line"></div>
          <h1 id="name">Arnie<br>Calderón<span>.</span></h1>
          <p class="profession">${t.role}</p>
          <p class="description">${t.roots}</p>
          <p class="personal-note">${t.intro}</p>
          <a class="enter" id="enter" href="${route(locale, 'about')}" data-place="origen">${t.explore} <span aria-hidden="true">↗</span></a>
          <a class="direct-link" href="${route(locale, 'contact')}">${t.direct}</a>
        </div>
        <p id="scene-status" role="status" class="scene-status">${t.loading}</p>
        <button id="enable-world" class="enable-world" hidden>${t.immersive} ↗</button>
      </section>
      <div class="location-labels" id="location-labels" hidden>
        ${labels.map(
          ([name, label]) => html`
            <a href="${placeRoute(locale, name)}" class="world-label" data-place="${name}">
              <span class="label-diamond" aria-hidden="true"></span>
              <span>${label[0]}<small>${label[1]}</small></span>
            </a>`
        )}
      </div>
      <aside id="story" class="story" aria-labelledby="story-title" hidden>
        <button class="close-story" id="close-story" aria-label="${t.close}">×</button>
        <div id="story-content"></div>
      </aside>
      ${stories(locale)}
      <nav class="destinations" id="destinations" aria-label="${t.projects}" hidden>
        <span class="destination-hint">${t.hint}</span>
        <div class="destination-buttons">
          ${labels.map(
            ([name, label]) => html`
              <a href="${placeRoute(locale, name)}" data-place="${name}">
                <span class="nav-diamond" aria-hidden="true"></span>
                ${name === 'imprex' ? 'IMPREX' : label[0]}<small>${destinationNotes[locale][name]}</small>
              </a>`
          )}
        </div>
        <button id="motion-toggle" class="scene-tool" aria-label="${t.pause}" aria-pressed="false" hidden>
          <svg class="icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6v12M15 6v12"/></svg>
          <svg class="icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6l10 6-10 6z"/></svg>
        </button>
        <button id="reset-view" class="scene-tool" aria-label="${t.reset}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9a8 8 0 1 1 0 6M4 3v6h6"/></svg>
        </button>
      </nav>
      <div class="world-tools">
        <p class="controls-hint">
          <span class="desktop-controls">${t.controls}</span>
          <span class="mobile-controls">${t.touch}</span>
        </p>
      </div>
      <div class="home-caption">
        <span>${t.location}</span>
        <p>${t.title}.</p>
        <a href="${route(locale, 'projects')}">${t.allProjects} ↗</a>
      </div>
      <section class="reading-content">
        <div class="section-intro">
          <h2>${t.workTitle}</h2>
          <p>${t.workIntro}</p>
        </div>
        <div class="project-list">${featured.slice(0, 3).map((p) => projectRow(p, locale))}</div>
        <a class="text-link all-work" href="${route(locale, 'projects')}">${t.allProjects} <span>↗</span></a>
      </section>
    </main>`;
}

function breadcrumb(locale, current, parent = 'home') {
  const t = ui[locale];
  const href = parent === 'home' ? route(locale) : route(locale, parent);
  return html`<p class="breadcrumb"><a href="${href}">${t[parent]}</a> / ${current}</p>`;
}

const featured = projects.filter((p) => p.featured !== false);
const secondary = projects.filter((p) => p.featured === false);

function moreProjects(locale) {
  if (!secondary.length) return '';
  const t = ui[locale];
  return html`
    <section class="more-projects" aria-labelledby="more-projects-title">
      <h2 id="more-projects-title">${t.moreProjects}</h2>
      <ul>
        ${secondary.map(
          (p) => html`
            <li>
              <a href="${route(locale, `projects/${p.slug}`)}">
                <span class="more-name">${p.name}</span>
                <span class="more-summary">${escape(p[locale].summary)}</span>
                <span class="more-stack">${p.stack.map(escape).join(' · ')}</span>
                <span class="more-arrow" aria-hidden="true">↗</span>
              </a>
            </li>`
        )}
      </ul>
    </section>`;
}

function projectIndex(locale) {
  const t = ui[locale];
  return html`
    <main id="main" tabindex="-1" class="page-content">
      <div class="page-heading">
        ${breadcrumb(locale, t.projects)}
        <h1>${t.workTitle}</h1>
        <p>${t.workIntro}</p>
      </div>
      <div class="project-list">${featured.map((p) => projectRow(p, locale, 2))}</div>
      ${moreProjects(locale)}
    </main>`;
}

function gallery(project, locale) {
  const t = ui[locale];
  if (!project.images.length) {
    const note =
      locale === 'es'
        ? 'Experiencia en una plataforma interna. Aquí comparto mi contribución sin exponer código ni información de la empresa.'
        : 'Experience on an internal platform. This case explains my contribution without exposing company code or information.';
    return html`<div class="case-confidential">${imprexArt}<p>${note}</p></div>`;
  }
  const count = project.images.length;
  return html`
    <section class="case-gallery" aria-labelledby="gallery-title">
      <h2 id="gallery-title">${t.screenshots}</h2>
      <div data-gallery>
        <div class="gallery-image">
          <a data-gallery-link href="${project.images[0]}" target="_blank" rel="noopener noreferrer" aria-label="${t.fullImage}">
            <img data-gallery-image src="${project.images[0]}" alt="${project.name} · ${t.image} 1" width="1440" height="900" loading="lazy" decoding="async">
          </a>
        </div>
        <div class="gallery-controls">
          <p data-gallery-status aria-live="polite">1 / ${count}</p>
          <div>
            <button data-gallery-prev aria-label="${t.galleryPrev}">←</button>
            <button data-gallery-next aria-label="${t.galleryNext}">→</button>
          </div>
        </div>
        <div class="gallery-thumbnails">
          ${project.images.map(
            (src, i) => html`
              <a href="${src}" data-gallery-thumb="${i}" ${i === 0 ? 'aria-current="true"' : ''} aria-label="${t.image} ${i + 1}">
                <img src="${src}" alt="${project.name} · ${t.image} ${i + 1}" width="160" height="100" loading="lazy">
              </a>`
          )}
        </div>
      </div>
    </section>`;
}

const list = (items) => items.map((s) => html`<li>${escape(s)}</li>`);

function projectPage(project, locale) {
  const t = ui[locale];
  const c = project[locale];
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return html`
    <main id="main" tabindex="-1" class="page-content case-page">
      <div class="page-heading">
        ${breadcrumb(locale, project.name, 'projects')}
        <p class="project-type">${project.type[locale]}</p>
        <h1>${project.name}</h1>
        <p class="case-subtitle">${escape(c.subtitle)}</p>
        <div class="case-meta">
          <span>${escape(project.role[locale])}</span>
          <span>${escape(project.dates[locale])}</span>
        </div>
        ${tags(project)}
        <div class="case-actions">
          ${project.url ? html`<a class="text-link" href="${project.url}" ${external}>${t.visit} ↗</a>` : ''}
          ${project.github ? html`<a class="text-link" href="${project.github}" ${external}>${t.source} ↗</a>` : ''}
        </div>
      </div>
      ${gallery(project, locale)}
      <div class="case-sections">
        <section><h2>${t.scope}</h2><p>${escape(c.context)}</p></section>
        <section><h2>${t.contribution}</h2><ul>${list(c.contributions)}</ul></section>
        <section><h2>${t.decisions}</h2><ul>${list(c.decisions)}</ul></section>
        <section class="case-outcome"><h2>${t.outcome}</h2><p>${escape(c.outcome)}</p></section>
      </div>
      <div class="case-navigation">
        <a href="${route(locale, 'projects')}">← ${t.back}</a>
        <a href="${route(locale, `projects/${next.slug}`)}">${t.next}: ${next.name} ↗</a>
      </div>
    </main>`;
}

function about(locale) {
  const t = ui[locale];
  const es = locale === 'es';
  const skills = [
    ['Frontend', 'React, Next.js, TypeScript, JavaScript, HTML/CSS, Tailwind CSS'],
    ['Backend', 'Node.js, Express, Python, Django REST Framework, PostgreSQL, Firebase'],
    [es ? 'Integraciones' : 'Integrations', 'APIs REST, SAP, XML, Sales Layer, Firebase Genkit'],
    [
      es ? 'Herramientas y pruebas' : 'Tools and testing',
      'Git, Linux, Docker, Vercel, Postman, Vitest, Jest, React Testing Library, Playwright',
    ],
  ];
  return html`
    <main id="main" tabindex="-1" class="page-content">
      <div class="page-heading">
        ${breadcrumb(locale, t.about)}
        <h1>${t.aboutTitle}</h1>
        <p>${t.aboutIntro}</p>
      </div>
      <div class="about-grid">
        <div class="about-portrait">
          <img src="/images/profile/avatar.webp" alt="Arnie Calderón" width="384" height="384">
          <span>${t.role} · ${t.location}</span>
          <a class="text-link" href="${cv(locale)}" download>${t.cv} ↓</a>
        </div>
        <div class="about-prose">
          ${t.aboutBody.map(([title, text]) => html`<section><h2>${title}</h2><p>${escape(text)}</p></section>`)}
          <section>
            <h2>${t.skills}</h2>
            <dl class="skills-list">
              ${skills.map(([term, detail]) => html`<div><dt>${term}</dt><dd>${detail}</dd></div>`)}
            </dl>
          </section>
          <section><h2>${t.education}</h2><p>${t.educationText}</p></section>
        </div>
      </div>
    </main>`;
}

function contact(locale) {
  const t = ui[locale];
  const option = (href, label, value, attrs = '') => html`
    <a href="${href}"${attrs ? ` ${attrs}` : ''}><span>${label}</span><strong>${value}</strong><span>↗</span></a>`;
  return html`
    <main id="main" tabindex="-1" class="page-content contact-page">
      <div class="page-heading">
        ${breadcrumb(locale, t.contact)}
        <h1>${t.contactTitle}</h1>
        <p>${t.contactIntro}</p>
      </div>
      <div class="contact-layout">
        <div class="contact-primary">
          <h2>${t.email}</h2>
          <a class="email-address" href="mailto:${person.email}">${person.email} <span>↗</span></a>
          <button class="copy-email" data-copy="${person.email}">${t.copy}</button>
          <p class="copy-status" role="status" aria-live="polite"></p>
        </div>
        <div class="contact-options">
          ${option(`tel:${person.phone}`, t.calls, '+51 918 793 956')}
          ${option(`https://wa.me/${person.whatsapp}`, t.whatsapp, '+51 917 455 538', external)}
          ${option(person.linkedin, 'LinkedIn', 'Arnie Calderón Ayala', external)}
          ${option(person.github, 'GitHub', 'Arcay322', external)}
        </div>
      </div>
    </main>`;
}

function notFound(locale) {
  const t = ui[locale];
  return html`
    <main id="main" class="page-content error-page" tabindex="-1">
      <p>404</p>
      <h1>${t.notFound}</h1>
      <p>${t.notFoundBody}</p>
      <a class="text-link" href="${route(locale)}">${t.goHome} ↗</a>
    </main>`;
}

function alternates(origin, locale, page) {
  return html`
    <link rel="canonical" href="${origin + route(locale, page)}">
    <link rel="alternate" hreflang="es" href="${origin + route('es', page)}">
    <link rel="alternate" hreflang="en" href="${origin + route('en', page)}">
    <link rel="alternate" hreflang="x-default" href="${origin + route('es', page)}">`;
}

export function renderPage({ locale = 'es', page = '', origin, is404 = false }) {
  const t = ui[locale];
  const p = projects.find((project) => `projects/${project.slug}` === page);
  const homePage = !page && !is404;
  const title = is404
    ? '404 · Arnie Calderón'
    : p
      ? `${p.name} · Arnie Calderón`
      : `${page ? t[page] : t.title} · Arnie Calderón`;
  const description = p ? p[locale].summary : t.metaDescription;
  const canonical = origin + route(locale, page);
  const content = is404
    ? notFound(locale)
    : homePage
      ? home(locale)
      : p
        ? projectPage(p, locale)
        : page === 'projects'
          ? projectIndex(locale)
          : page === 'about'
            ? about(locale)
            : contact(locale);
  const structured = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    url: origin,
    jobTitle: t.role,
    sameAs: [person.github, person.linkedin],
  }).replace(/</g, '\\u003c');
  return html`
    <!doctype html>
    <html lang="${locale}">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#172321">
        <title>${escape(title)}</title>
        <meta name="description" content="${escape(description)}">
        ${is404 ? '<meta name="robots" content="noindex,follow">' : alternates(origin, locale, page)}
        <meta property="og:type" content="website">
        <meta property="og:title" content="${escape(title)}">
        <meta property="og:description" content="${escape(description)}">
        <meta property="og:url" content="${canonical}">
        <meta property="og:image" content="${origin}/assets/og-portfolio.jpg">
        <meta property="og:locale" content="${locale === 'es' ? 'es_PE' : 'en_US'}">
        <meta name="twitter:card" content="summary_large_image">
        <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
        <link rel="preload" href="/assets/fonts/cormorant-semibold.ttf" as="font" type="font/ttf" crossorigin>
        <link rel="stylesheet" href="/assets/portfolio.css">
        <script type="application/ld+json">${structured}</script>
        <script type="module" src="/assets/client.js"></script>
      </head>
      <body class="${homePage ? 'home-page' : 'inner-page'}" data-locale="${locale}" data-page="${page}">
        ${header(locale, is404 ? '' : page, homePage)}${content}${footer(locale)}
        <noscript><style>.scene-status{display:none}</style></noscript>
      </body>
    </html>`;
}
