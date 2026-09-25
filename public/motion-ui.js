import { animate } from './vendor/motion.js';
import { t, translateTree } from './i18n.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const canAnimate = () => !reduced.matches;
const ease = [.16, 1, .3, 1];
const running = new Map();
const root = document.documentElement;

// Keep one entrance per element: rapid filtering never queues old animations.
function enter(node, { delay = 0, distance = 28, duration = .65 } = {}) {
  running.get(node)?.stop();
  running.delete(node);
  node.style.removeProperty('opacity');
  node.style.removeProperty('translate');
  if (!canAnimate()) return;
  const control = animate(node, {
    opacity: [0, 1], translate: [`0px ${distance}px`, '0px 0px'],
  }, { duration, delay, ease });
  running.set(node, control);
  control.then(() => {
    if (running.get(node) !== control) return;
    running.delete(node);
    node.style.removeProperty('opacity');
    node.style.removeProperty('translate');
  });
}

const observed = new WeakSet();
const pending = new Set();
const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(({ target, isIntersecting }) => {
    if (!isIntersecting) return;
    observer.unobserve(target);
    pending.delete(target);
    target.classList.remove('motion-pending');
    enter(target, { delay: Number(target.dataset.motionDelay || 0) });
  });
}, { threshold: .06, rootMargin: '0px 0px -20px 0px' }) : null;

export function enhanceMotion(container = document) {
  for (const node of pending) {
    if (!node.isConnected) { observer?.unobserve(node); pending.delete(node); }
  }
  for (const [node, control] of running) {
    if (!node.isConnected) { control.stop(); running.delete(node); }
  }
  container.querySelectorAll('.section-heading,.project-card,.featured-project,.skill-card,.record-card,.about-copy,.about-passport,.github-panel,.contact-heading,.contact-info,.contact-form').forEach((node, index) => {
    if (observed.has(node)) return;
    observed.add(node);
    if (!canAnimate() || !observer) return;
    node.dataset.motionDelay = String((index % 3) * .065);
    node.classList.add('motion-pending');
    pending.add(node);
    observer.observe(node);
  });
}

function revealImmediately(node) {
  if (!node) return;
  pending.delete(node);
  observer?.unobserve(node);
  node.classList.remove('motion-pending');
  running.get(node)?.stop();
  running.delete(node);
  node.style.removeProperty('opacity');
  node.style.removeProperty('translate');
}
document.addEventListener('focusin', event => {
  revealImmediately(event.target.closest('.motion-pending'));
});
reduced.addEventListener('change', () => {
  if (!reduced.matches) return;
  for (const node of [...pending, ...running.keys()]) revealImmediately(node);
  document.querySelector('.art-halftone')?.style.removeProperty('translate');
});

// Start the hero entrance after the original loader has faded away.
let introPlayed = false;
function playIntro() {
  if (introPlayed) return;
  introPlayed = true;
  if (scrollY > innerHeight || !canAnimate()) return;
  document.querySelectorAll('#hero-title > span').forEach((node, i) => enter(node, { delay: i * .11, distance: 48, duration: .85 }));
  document.querySelectorAll('.hero-copy > .eyebrow,.hero-tagline,.focus-switch,.focus-copy,.hero-actions,.hero-location').forEach((node, i) => enter(node, { delay: .2 + i * .06, distance: 18 }));
  enter(document.querySelector('.portrait-tilt'), { delay: .16, distance: 44, duration: 1 });
}
if (root.dataset.introReady === 'true' || !document.querySelector('#page-loader')) playIntro();
else {
  document.addEventListener('portfolio:ready', playIntro, { once: true });
}

// Native dialog supplies focus trapping, Escape, and an inert page underneath.
const menu = document.querySelector('#navigation-dialog');
const menuButton = document.querySelector('.menu-toggle');
const menuClose = document.querySelector('#navigation-close');
const compactNavigation = matchMedia('(max-width: 900px)');
let closeTimer;
let menuReturnFocus = menuButton;
function finishMenu() {
  clearTimeout(closeTimer);
  menu.close();
}
function closeMenu() {
  if (!menu.open || menu.classList.contains('is-closing')) return;
  menu.classList.add('is-closing');
  if (canAnimate()) closeTimer = setTimeout(finishMenu, 180);
  else finishMenu();
}
compactNavigation.addEventListener('change', () => {
  if (compactNavigation.matches || !menu.open) return;
  menuReturnFocus = document.querySelector('.header-inner .wordmark');
  finishMenu();
});
menuButton.addEventListener('click', () => {
  menuReturnFocus = menuButton;
  clearTimeout(closeTimer);
  menu.classList.remove('is-closing');
  menu.showModal();
  document.body.classList.add('navigation-open');
  menuButton.setAttribute('aria-expanded', 'true');
  const journey = menu.querySelector('a[href="#rekam-jejak"]');
  journey.hidden = document.querySelector('#rekam-jejak').hidden;
  menu.querySelectorAll('.navigation-links a:not([hidden])').forEach((node, i) => enter(node, { delay: .12 + i * .045, distance: 30, duration: .5 }));
});
menuClose.addEventListener('click', closeMenu);
menu.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const items = [...menu.querySelectorAll('button,a[href]')].filter(node => !node.hidden);
  const first = items[0], last = items.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault(); first.focus();
  }
});
menu.addEventListener('cancel', event => { event.preventDefault(); closeMenu(); });
menu.addEventListener('close', () => {
  clearTimeout(closeTimer);
  menu.classList.remove('is-closing');
  document.body.classList.remove('navigation-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuReturnFocus.focus({ preventScroll: true });
});
menu.querySelector('nav').addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link) return;
  // Release the scroll lock before the browser follows the anchor.
  const target = document.querySelector(link.hash);
  if (target) {
    target.setAttribute('tabindex', '-1');
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
    menuReturnFocus = target;
  }
  finishMenu();
});

// Use the real, existing toolkit cards as the source so icons and content stay in sync.
const toolkit = document.querySelector('.skill-grid');
const cards = [...toolkit.querySelectorAll('.skill-card')];
const toolbar = document.createElement('div');
toolbar.className = 'toolkit-toolbar';
const controls = document.createElement('div');
controls.className = 'toolkit-filters';
controls.setAttribute('role', 'group');
controls.setAttribute('aria-label', 'Kategori toolkit');
const status = document.createElement('p');
status.className = 'toolkit-status';
status.setAttribute('role', 'status');
const hint = document.createElement('p');
hint.className = 'toolkit-hint';
hint.textContent = 'Pilih kategori untuk menjelajahi alat.';
let activeTool = 'all';
function updateToolkitStatus() {
  const visible = cards.filter(card => !card.hidden);
  const count = new Set(visible.flatMap(card => [...card.querySelectorAll('.tool-badge')].map(badge => badge.textContent.trim()))).size;
  const name = activeTool === 'all' ? t('Semua kategori') : cards[Number(activeTool)].querySelector('h3').lastChild.textContent.trim();
  status.textContent = `${name} / ${String(count).padStart(2, '0')} ${t('alat')}`;
}
['SEMUA', ...cards.map(card => card.querySelector('h3').lastChild.textContent.trim())].forEach((label, index) => {
  const key = index === 0 ? 'all' : String(index - 1);
  const button = document.createElement('button');
  button.type = 'button'; button.textContent = label;
  button.dataset.toolCategory = key;
  button.setAttribute('aria-pressed', String(key === activeTool));
  button.addEventListener('click', () => {
    if (activeTool === key) return;
    activeTool = key;
    controls.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    toolkit.classList.toggle('is-focused', key !== 'all');
    cards.forEach((card, i) => {
      revealImmediately(card);
      card.hidden = key !== 'all' && Number(key) !== i;
      if (!card.hidden) {
        enter(card, { distance: 14, duration: .4 });
        card.querySelectorAll('.tool-badge').forEach((badge, j) => enter(badge, { distance: 12, delay: j * .035, duration: .4 }));
      }
    });
    updateToolkitStatus();
  });
  controls.append(button);
});
toolbar.append(controls, status, hint);
toolkit.before(toolbar);
translateTree(toolbar);
updateToolkitStatus();
document.addEventListener('languagechange', updateToolkitStatus);

// Small pointer and scroll accents; page scrolling remains native on every device.
const hero = document.querySelector('.portrait-hero');
const texture = document.querySelector('.art-halftone');
let heroVisible = true;
let parallaxFrame = 0;
if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
  heroVisible = entries[0].isIntersecting;
  hero.classList.toggle('is-offscreen', !heroVisible);
}).observe(hero);
addEventListener('scroll', () => {
  if (parallaxFrame || !heroVisible || !canAnimate() || !fine.matches) return;
  parallaxFrame = requestAnimationFrame(() => {
    texture.style.translate = `0px ${Math.min(scrollY * .065, 55)}px`;
    parallaxFrame = 0;
  });
}, { passive: true });

const portrait = document.querySelector('#portrait-tilt');
portrait.addEventListener('pointermove', event => {
  if (!canAnimate() || !fine.matches || event.pointerType === 'touch') return;
  const bounds = portrait.getBoundingClientRect();
  portrait.style.setProperty('--shine-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
  portrait.style.setProperty('--shine-y', `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
});
portrait.addEventListener('pointerleave', () => {
  portrait.style.removeProperty('--shine-x'); portrait.style.removeProperty('--shine-y');
});
