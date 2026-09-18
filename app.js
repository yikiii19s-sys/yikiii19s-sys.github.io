'use strict';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const menuButton = document.querySelector('.menu');
const menu = document.querySelector('#project-menu');
function closeMenu(restoreFocus = false) {
  menu.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', '打开项目导航');
  if (restoreFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const opening = menu.hidden;
  menu.hidden = !opening;
  menuButton.setAttribute('aria-expanded', String(opening));
  menuButton.setAttribute('aria-label', opening ? '关闭项目导航' : '打开项目导航');
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !menu.hidden) closeMenu(true);
});
document.addEventListener('click', e => {
  if (!menu.hidden && !menu.contains(e.target) && !menuButton.contains(e.target)) closeMenu();
});
document.addEventListener('focusin', e => {
  if (!menu.hidden && !menu.contains(e.target) && !menuButton.contains(e.target)) closeMenu();
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  closeMenu();
  const target = document.querySelector(link.hash);
  if (target) {
    target.setAttribute('tabindex', '-1');
    target.focus({preventScroll:true});
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), {once:true});
  }
}));

const homeImages = [...document.querySelectorAll('.home-image')];
const homeLinks = [...document.querySelectorAll('.home-index a')];
const homeVisual = document.querySelector('.home-visual');
const caption = document.querySelector('.home-art-caption b');
let visibleImage = 0;
let activeSource = homeImages[0].getAttribute('src');
let requestedSource = activeSource;
let requestId = 0;
async function switchHomeVisual(link) {
  const source = link.dataset.image;
  if (!source || source === requestedSource) return;
  requestedSource = source;
  const id = ++requestId;
  if (source === activeSource) return;
  const preload = new Image();
  preload.src = source;
  try { await preload.decode(); } catch { if (id === requestId) requestedSource = activeSource; return; }
  if (id !== requestId) return;
  const incoming = homeImages[1-visibleImage];
  const outgoing = homeImages[visibleImage];
  incoming.src = source;
  incoming.width = preload.naturalWidth;
  incoming.height = preload.naturalHeight;
  incoming.alt = link.dataset.alt || '';
  incoming.removeAttribute('aria-hidden');
  outgoing.setAttribute('aria-hidden', 'true');
  incoming.className = 'home-image is-visible' + (link.dataset.project === 'tiangong' ? ' is-tiangong' : '');
  outgoing.classList.remove('is-visible');
  homeLinks.forEach(item => item.classList.toggle('is-active',item === link));
  homeVisual.dataset.project = link.dataset.project;
  caption.textContent = link.querySelector('b').textContent.replace('S/', '') + ' / ' + link.querySelector('span').textContent;
  activeSource = source;
  visibleImage = 1-visibleImage;
}
homeLinks.forEach(link => {
  link.addEventListener('pointerenter', e => { if(e.pointerType !== 'touch') switchHomeVisual(link); });
  link.addEventListener('focus', () => switchHomeVisual(link));
});

// Keep the film user-initiated and pause it outside the viewport.
const film = document.querySelector('.wf-video');
if (film && 'IntersectionObserver' in window) {
  new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) film.pause();
  }, {threshold:0}).observe(film);
}
document.addEventListener('visibilitychange', () => { if(document.hidden) film?.pause(); });
const strip = document.querySelector('.wf-filmstrip');
if (strip) strip.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    e.preventDefault();
    strip.scrollBy({left:(e.key === 'ArrowRight' ? 1 : -1)*strip.clientWidth*.7,behavior:reducedMotion.matches?'instant':'smooth'});
  }
});

// Preserve the existing accent behaviour for the other project sections.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if(entry.isIntersecting) document.documentElement.style.setProperty('--accent',entry.target.dataset.accent || '#b68c52');
  }), {threshold:.2});
  document.querySelectorAll('.project').forEach(section => observer.observe(section));
}

// User-initiated film playback; pause either film when it leaves view.
const tiangongFilm = document.querySelector('.tg-video');
if (tiangongFilm && 'IntersectionObserver' in window) {
  new IntersectionObserver(entries => { if (!entries[0].isIntersecting) tiangongFilm.pause(); }).observe(tiangongFilm);
  document.addEventListener('visibilitychange', () => { if(document.hidden) tiangongFilm.pause(); });
}

const celestialStrip = document.querySelector('.te-filmstrip');
celestialStrip?.addEventListener('keydown', e => {
 if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
  e.preventDefault();celestialStrip.scrollBy({left:(e.key === 'ArrowRight'?1:-1)*celestialStrip.clientWidth*.7,behavior:document.documentElement.classList.contains('motion-off')?'instant':'smooth'});
 }
});
