import { t, translateTree } from './i18n.js';
const root = document.documentElement;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
let allowMotion = true;
try { allowMotion = localStorage.getItem('portfolio-motion') !== 'off'; } catch { /* Storage is optional. */ }
export const motionEnabled = () => allowMotion && !reducedMotion.matches;

const motionToggle = document.querySelector('#motion-toggle');
const portraitTilt = document.querySelector('#portrait-tilt');
let focusAnimation;
let tiltFrame = 0;
function resetTilt() {
  cancelAnimationFrame(tiltFrame);
  portraitTilt.style.setProperty('--tilt-x', '0deg');
  portraitTilt.style.setProperty('--tilt-y', '0deg');
}
function syncMotion() {
  const enabled = motionEnabled();
  root.dataset.motion = enabled ? 'on' : 'off';
  motionToggle.setAttribute('aria-pressed', String(enabled));
  motionToggle.disabled = reducedMotion.matches;
  document.querySelector('#motion-label').textContent = t(reducedMotion.matches ? 'ANIMASI DIKURANGI' : enabled ? 'ANIMASI AKTIF' : 'ANIMASI NONAKTIF');
  if (!enabled) {
    focusAnimation?.cancel(); resetTilt();
    document.querySelectorAll('.reveal-pending').forEach(node => node.classList.add('is-revealed'));
  }
}
motionToggle.addEventListener('click', () => {
  allowMotion = !allowMotion;
  try { localStorage.setItem('portfolio-motion', allowMotion ? 'on' : 'off'); } catch { /* Keep the setting for this page. */ }
  syncMotion();
});
reducedMotion.addEventListener('change', syncMotion);
syncMotion();

const focusAreas = {
  web: { role: 'WEB DEVELOPMENT', text: 'Dari antarmuka hingga alur aplikasi. Saya membangun website dengan HTML, CSS, JavaScript, React, PHP, dan Laravel.', label: 'Lihat proyek web ↗', href: '#karya', category: 'web' },
  design: { role: 'UI/UX DESIGN', text: 'Berangkat dari kebutuhan pengguna. Saya merancang user flow, wireframe, dan prototipe, lalu menguji kemudahannya dengan SUS.', label: 'Lihat pengalaman UI/UX ↗', href: '#rekam-jejak', category: '' },
  data: { role: 'DATA EXPLORATION', text: 'Mencari pola di balik angka. Saya mengeksplorasi data dengan Python, SQL, dan Jupyter, termasuk klasifikasi banjir Jakarta.', label: 'Lihat eksplorasi data ↗', href: '#karya', category: 'data' }
};
function setFocus(button, animate = true) {
  const focus = focusAreas[button.dataset.focus];
  document.querySelectorAll('[data-focus]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelector('#focus-summary').textContent = focus.text;
  document.querySelector('#portrait-role').textContent = focus.role;
  const link = document.querySelector('#focus-link');
  link.textContent = focus.label; link.href = focus.href; link.dataset.category = focus.category;
  translateTree(document.querySelector('.focus-copy'));
  focusAnimation?.cancel();
  if (animate && motionEnabled()) focusAnimation = document.querySelector('.focus-copy').animate([{opacity: 0, transform: 'translateX(-12px)'}, {opacity: 1, transform: 'translateX(0)'}], {duration: 280, easing: 'ease-out'});
}
document.querySelectorAll('[data-focus]').forEach(button => button.addEventListener('click', () => setFocus(button)));
document.querySelector('#focus-link').addEventListener('click', event => {
  const category = event.currentTarget.dataset.category;
  if (category) document.dispatchEvent(new CustomEvent('portfolio:filter', {detail: category}));
});

const flipButton = document.querySelector('#portrait-flip');
flipButton.addEventListener('click', () => {
  const flipped = flipButton.getAttribute('aria-expanded') !== 'true';
  document.querySelector('#portrait-flipper').classList.toggle('is-flipped', flipped);
  document.querySelector('#portrait-front').setAttribute('aria-hidden', String(flipped));
  document.querySelector('#portrait-back').setAttribute('aria-hidden', String(!flipped));
  flipButton.setAttribute('aria-expanded', String(flipped));
  document.querySelector('#portrait-flip-label').textContent = t(flipped ? 'LIHAT FOTO' : 'KENALI SAYA');
  resetTilt();
});
portraitTilt.addEventListener('pointermove', event => {
  if (!motionEnabled() || !finePointer.matches || event.pointerType === 'touch') return;
  const bounds = portraitTilt.getBoundingClientRect();
  const x = Math.max(-.5, Math.min(.5, (event.clientX - bounds.left) / bounds.width - .5));
  const y = Math.max(-.5, Math.min(.5, (event.clientY - bounds.top) / bounds.height - .5));
  cancelAnimationFrame(tiltFrame);
  tiltFrame = requestAnimationFrame(() => {
    portraitTilt.style.setProperty('--tilt-x', `${-y * 9}deg`);
    portraitTilt.style.setProperty('--tilt-y', `${x * 9}deg`);
  });
});
portraitTilt.addEventListener('pointerleave', resetTilt);
finePointer.addEventListener('change', resetTilt);

const enhanced = new WeakSet();
const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-revealed');
    revealObserver.unobserve(entry.target);
  });
}, {threshold: .06, rootMargin: '0px 0px -24px 0px'}) : null;

export function enhanceMotion(container = document) {
  container.querySelectorAll('.section-heading,.project-card,.featured-project,.skill-card,.record-card,.about-copy,.about-passport,.github-panel,.contact-heading').forEach((node, index) => {
    if (enhanced.has(node)) return;
    enhanced.add(node);
    if (!motionEnabled() || !revealObserver) return;
    node.classList.add('reveal-pending');
    node.style.setProperty('--reveal-delay', `${(index % 3) * 65}ms`);
    revealObserver.observe(node);
  });
}
document.addEventListener('focusin', event => {
  event.target.closest('.reveal-pending')?.classList.add('is-revealed');
});
let scrollFrame = 0;
function updateProgress() {
  const length = document.documentElement.scrollHeight - innerHeight;
  const progress = length > 0 ? Math.min(1, Math.max(0, scrollY / length)) : 0;
  document.querySelector('#reading-progress').style.transform = `scaleX(${progress})`;
  scrollFrame = 0;
}
function scheduleProgress() { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateProgress); }
addEventListener('scroll', scheduleProgress, {passive: true});
addEventListener('resize', scheduleProgress);
if ('ResizeObserver' in window) new ResizeObserver(scheduleProgress).observe(document.body);
updateProgress();
enhanceMotion();
document.addEventListener('languagechange', () => {
  syncMotion();
  setFocus(document.querySelector('[data-focus][aria-pressed=true]'), false);
  document.querySelector('#portrait-flip-label').textContent = t(flipButton.getAttribute('aria-expanded') === 'true' ? 'LIHAT FOTO' : 'KENALI SAYA');
});
