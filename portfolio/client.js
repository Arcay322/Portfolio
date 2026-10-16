document.documentElement.classList.add('js-enabled');
const locale = document.documentElement.lang === 'en' ? 'en' : 'es';
const words = locale === 'es' ? {
  reading: 'Modo lectura', immersive: 'Volver al paisaje', pause: 'Pausar movimiento ambiental', resume: 'Activar movimiento ambiental', fallback: 'Puedes explorar todo mi trabajo en modo lectura.', copied: 'Correo copiado', copyError: 'No se pudo copiar. Selecciona el correo o usa el enlace.', image: 'Captura',
} : {
  reading: 'Reading mode', immersive: 'Back to the landscape', pause: 'Pause ambient motion', resume: 'Enable ambient motion', fallback: 'All my work is available in reading mode.', copied: 'Email copied', copyError: 'Could not copy. Select the email or use the email link.', image: 'Screenshot',
};
const $ = id => document.getElementById(id);
const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
let paused = motionQuery.matches;
let world = null;
let loadingWorld = false;
let activePlace = null;
let previousFocus;
let fallbackTimer;
const menu = $('menu-toggle');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  $('site-nav').classList.toggle('is-open', open);
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (activePlace) closeStory();
  else if (menu?.getAttribute('aria-expanded') === 'true') { menu.setAttribute('aria-expanded', 'false'); $('site-nav').classList.remove('is-open'); menu.focus(); }
});
function openStory(name) {
  if (!document.body.classList.contains('world-ready') || document.body.classList.contains('reading-mode')) return false;
  const template = $(`story-${name}`);
  if (!template) return false;
  previousFocus = document.activeElement;
  activePlace = name;
  $('story-content').replaceChildren(template.content.cloneNode(true));
  $('story').hidden = false;
  $('story').scrollTop = 0;
  document.body.classList.add('scene-active');
  document.querySelectorAll('[data-place]').forEach(link => {
    if (link.dataset.place === name) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
  world?.focus(name);
  $('close-story').focus({ preventScroll: true });
  return true;
}
function closeStory() {
  activePlace = null;
  if ($('story')) $('story').hidden = true;
  document.body.classList.remove('scene-active');
  document.querySelectorAll('[data-place]').forEach(link => link.removeAttribute('aria-current'));
  world?.reset();
  if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
}
document.querySelectorAll('[data-place]').forEach(link => link.addEventListener('click', event => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (openStory(link.dataset.place)) event.preventDefault();
}));
$('close-story')?.addEventListener('click', closeStory);
$('reset-view')?.addEventListener('click', closeStory);
function readingMode(enable) {
  closeStory();
  document.body.classList.toggle('reading-mode', enable);
  $('view-mode').textContent = enable ? words.immersive : words.reading;
  $('view-mode').setAttribute('aria-pressed', String(enable));
  // Release the GPU completely while reading; a new scene is created only on return.
  if (enable) { world?.dispose(); world = null; window.scrollTo({ top: 0 }); }
  else if (!world) loadWorld();
}
$('view-mode')?.addEventListener('click', () => readingMode(!document.body.classList.contains('reading-mode')));
$('enable-world')?.addEventListener('click', () => { document.body.classList.remove('reading-mode'); loadWorld(); });
function updateMotion() {
  $('motion-toggle').textContent = paused ? words.resume : words.pause;
  $('motion-toggle').setAttribute('aria-pressed', String(paused));
  world?.setMotion(paused);
}
$('motion-toggle')?.addEventListener('click', () => { paused = !paused; updateMotion(); });
motionQuery.addEventListener('change', event => { paused = event.matches; if (world) updateMotion(); });
function failedWorld() {
  clearTimeout(fallbackTimer);
  loadingWorld = false;
  world?.dispose(); world = null;
  document.body.classList.remove('world-ready', 'scene-active');
  document.body.classList.add('reading-mode');
  $('scene-status').hidden = false;
  $('scene-status').textContent = words.fallback;
  $('enable-world').hidden = false;
  $('location-labels').hidden = true;
  $('destinations').hidden = true;
  $('view-mode').hidden = true;
  $('motion-toggle').hidden = true;
  $('story').hidden = true;
}
async function loadWorld() {
  if (world || loadingWorld) return;
  loadingWorld = true;
  fallbackTimer = setTimeout(failedWorld, 12000);
  try {
    const { startWorld } = await import('./world.js');
    if (!loadingWorld) return;
    world = startWorld({
      onSelect: openStory,
      isReducedMotion: paused,
      onReady() {
        clearTimeout(fallbackTimer);
        document.body.classList.add('world-ready');
        document.body.classList.remove('reading-mode');
        $('scene-status').hidden = true;
        $('enable-world').hidden = true;
        $('location-labels').hidden = false;
        $('destinations').hidden = false;
        $('view-mode').hidden = false;
        $('view-mode').textContent = words.reading;
        $('motion-toggle').hidden = false;
      },
      onFailure: failedWorld,
    });
    loadingWorld = false;
    if (world) updateMotion();
  } catch { failedWorld(); }
}
if (document.body.classList.contains('home-page')) {
  const view = new URLSearchParams(location.search).get('view');
  if (view === 'reading' || navigator.connection?.saveData) {
    document.body.classList.add('reading-mode');
    $('scene-status').hidden = true;
    $('enable-world').hidden = false;
  } else {
    // Keep the personal introduction readable while the 3D module loads.
    if ('requestIdleCallback' in window) requestIdleCallback(() => loadWorld(), { timeout: 1200 });
    else setTimeout(loadWorld, 80);
  }
}
// Progressive enhancement: original screenshots stay linked when JS is disabled.
document.querySelectorAll('[data-gallery]').forEach(gallery => {
  const thumbs = [...gallery.querySelectorAll('[data-gallery-thumb]')];
  let current = 0;
  const image = gallery.querySelector('[data-gallery-image]');
  const imageLink = gallery.querySelector('[data-gallery-link]');
  const prefix = image.alt.split(' · ')[0];
  function show(index) {
    current = (index + thumbs.length) % thumbs.length;
    image.src = thumbs[current].getAttribute('href');
    image.alt = `${prefix} · ${words.image} ${current + 1}`;
    imageLink.href = image.src;
    thumbs.forEach((thumb, i) => { if (i === current) thumb.setAttribute('aria-current', 'true'); else thumb.removeAttribute('aria-current'); });
    gallery.querySelector('[data-gallery-status]').textContent = `${current + 1} / ${thumbs.length}`;
  }
  thumbs.forEach((thumb, index) => thumb.addEventListener('click', event => { event.preventDefault(); show(index); }));
  gallery.querySelector('[data-gallery-prev]').addEventListener('click', () => show(current - 1));
  gallery.querySelector('[data-gallery-next]').addEventListener('click', () => show(current + 1));
});
document.querySelector('[data-copy]')?.addEventListener('click', async event => {
  const status = document.querySelector('.copy-status');
  try { await navigator.clipboard.writeText(event.currentTarget.dataset.copy); status.textContent = words.copied; }
  catch { status.textContent = words.copyError; }
});
// The old Next.js portfolio registered /sw.js. Retire only that exact root worker.
if ('serviceWorker' in navigator) navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => {
    const worker = registration.active || registration.waiting || registration.installing;
    if (worker && new URL(worker.scriptURL).origin === location.origin && new URL(worker.scriptURL).pathname === '/sw.js') registration.unregister();
  });
}).catch(() => {});
