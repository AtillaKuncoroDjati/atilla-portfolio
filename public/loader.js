const overlay = document.querySelector('#page-loader');
const bar = document.querySelector('#loader-bar');
const percent = document.querySelector('#loader-percent');
const status = document.querySelector('#loader-status');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let value = 0;
let finished = false;
const started = performance.now();

const messages = [
  [0, 'MENYIAPKAN PENGALAMAN'],
  [28, 'MEMBUKA PORTOFOLIO'],
  [56, 'MENYUSUN KARYA'],
  [78, 'MENGHUBUNGKAN GITHUB'],
  [94, 'SEBENTAR LAGI']
];

function paint(next) {
  value = Math.max(value, Math.min(100, Math.round(next)));
  bar.style.width = `${value}%`;
  percent.textContent = `${value}%`;
  status.textContent = [...messages].reverse().find(([threshold]) => value >= threshold)?.[1] || messages[0][1];
}

function closeLoader() {
  if (finished) return;
  const remaining = reduced ? 0 : 1050 - (performance.now() - started);
  if (remaining > 0) {
    window.setTimeout(closeLoader, remaining);
    return;
  }
  finished = true;
  paint(100);
  overlay.classList.add('is-complete');
  window.setTimeout(() => overlay.remove(), reduced ? 0 : 520);
}

if (reduced) {
  paint(100);
} else {
  const tick = now => {
    if (finished) return;
    const elapsed = now - started;
    paint(Math.min(94, (elapsed / 1050) * 94));
    if (elapsed < 1050) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

window.addEventListener('load', closeLoader, {once: true});
window.setTimeout(closeLoader, reduced ? 80 : 2600);
