const cursor = document.createElement('div');
cursor.className = 'persona-cursor';
cursor.setAttribute('aria-hidden', 'true');
const html = document.documentElement;
const hotspot = { normal: { x: 11, y: 9 }, link: { x: 15, y: 15 } };
const size = 38;
const interactive = 'a[href],button:not(:disabled),[role="button"],[role="link"],select,input[type="button"],input[type="submit"]';
const textEntry = 'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]),textarea,[contenteditable="true"]';

if (!matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Touch devices and reduced-motion users keep their normal system cursor.
} else {
  document.body.append(cursor);
  html.classList.add('has-persona-cursor');
  const move = event => {
    if (event.pointerType && event.pointerType !== 'mouse') return;
    const target = event.target instanceof Element ? event.target : null;
    const isTextEntry = Boolean(target?.closest(textEntry));
    const isLink = !isTextEntry && Boolean(target?.closest(interactive));
    cursor.classList.toggle('is-link', isLink);
    cursor.classList.toggle('is-visible', !isTextEntry);
    if (!isTextEntry) {
      const point = isLink ? hotspot.link : hotspot.normal;
      cursor.style.transform = `translate3d(${event.clientX - point.x * size / 128}px,${event.clientY - point.y * size / 128}px,0)`;
    }
  };
  document.addEventListener('pointermove', move, { passive: true });
  document.addEventListener('pointerover', move, { passive: true });
  window.addEventListener('blur', () => cursor.classList.remove('is-visible'));
  document.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
}
