(() => {
  const overlay = document.querySelector('#page-loader');
  if (!overlay) return;
  const root = document.documentElement;
  const status = document.querySelector('#loader-status');
  const skip = document.querySelector('#loader-skip');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const sessionKey = 'portfolio-intro-v2';
  const started = performance.now();
  const background = [...document.querySelectorAll('.site-header,#main,.site-footer,.skip-link')];
  const originalInert = background.map(node => node.inert);
  let complete = false;
  let closing = false;
  let deadline;
  let minimum;
  let exitFallback;
  const english = root.lang === 'en';

  function reveal() {
    if (complete) return;
    complete = true;
    clearTimeout(deadline);
    clearTimeout(minimum);
    clearTimeout(exitFallback);
    background.forEach((node, index) => { node.inert = originalInert[index]; });
    root.classList.remove('intro-loading');
    root.dataset.introReady = 'true';
    overlay.remove();
    try { sessionStorage.setItem(sessionKey, 'seen'); } catch { /* Optional session storage. */ }
    reduced.removeEventListener?.('change', onMotionChange);
    window.removeEventListener('pagehide', reveal);
    window.removeEventListener('pageshow', onPageShow);
    document.dispatchEvent(new Event('portfolio:ready'));
  }
  function finish() {
    if (complete || closing) return;
    const remaining = 850 - (performance.now() - started);
    if (remaining > 0) {
      if (!minimum) minimum = setTimeout(() => { minimum = undefined; finish(); }, remaining);
      return;
    }
    closing = true;
    clearTimeout(deadline);
    status.textContent = english ? 'Welcome.' : 'Selamat datang.';
    overlay.classList.add('is-complete');
    // Always release the page even when transition events are unavailable.
    exitFallback = setTimeout(reveal, 420);
  }
  function onMotionChange(event) { if (event.matches) reveal(); }
  function onPageShow(event) { if (event.persisted) reveal(); }

  let seen = false;
  try { seen = sessionStorage.getItem(sessionKey) === 'seen'; } catch { /* Loading still works. */ }
  if (seen || reduced.matches || performance.now() >= 2200) { reveal(); return; }

  root.classList.add('intro-loading');
  background.forEach(node => { node.inert = true; });
  status.textContent = english ? 'Preparing the page…' : 'Menyiapkan halaman…';
  if (english) skip.firstChild.nodeValue = 'Enter now ';
  skip.addEventListener('click', reveal, { once: true });
  skip.disabled = false;
  overlay.addEventListener('transitionend', event => {
    if (closing && event.target === overlay && event.propertyName === 'transform') reveal();
  });
  reduced.addEventListener?.('change', onMotionChange);
  window.addEventListener('pagehide', reveal, { once: true });
  window.addEventListener('pageshow', onPageShow);

  // Only wait for the first frame's font and portrait, never GitHub or lazy images.
  // The cover stays under two seconds even if either asset stalls.
  deadline = setTimeout(finish, 1400);
  const portrait = document.querySelector('.hero-portrait-image');
  const fontReady = Promise.resolve().then(() => document.fonts?.load('900 48px "Barlow Condensed"'));
  const portraitReady = Promise.resolve().then(() => portrait?.decode?.());
  Promise.allSettled([fontReady, portraitReady]).then(finish);
})();
