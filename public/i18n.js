import { english } from './translations.js';

export const language = () => document.documentElement.lang === 'en' ? 'en' : 'id';
export const locale = () => language() === 'en' ? 'en-US' : 'id-ID';
export function t(value) {
  if (language() !== 'en' || typeof value !== 'string') return value;
  if (Object.hasOwn(english, value)) return english[value];
  if (/^\d+ dari \d+ karya/.test(value)) return value.replace(/^(\d+) dari (\d+) karya/, '$1 of $2 projects').replace(' · termasuk proyek unggulan di atas', ' · including the featured project above');
  if (/^\d+ dokumen/.test(value)) return value.replace('dokumen','documents').replace('Kursus','Courses').replace('Magang','Internship').replace('Prestasi','Achievement');
  if (/^\d+ karya publik · GitHub$/.test(value)) return value.replace('karya publik','public projects');
  if (value.startsWith('Buka PDF: ')) return 'Open PDF: ' + t(value.slice(10));
  if (value.startsWith('Pratinjau ')) return 'Preview: ' + t(value.slice(10));
  return value;
}

const textSources = new WeakMap();
const attributeSources = new WeakMap();
export function translateTree(container = document.body) {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {acceptNode: node => node.parentElement?.closest('script,style') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT});
  let node;
  while ((node = walker.nextNode())) {
    const old = textSources.get(node);
    const source = old && node.nodeValue === old.rendered ? old.source : node.nodeValue;
    const trimmed = source.trim();
    if (!trimmed) continue;
    const rendered = source.replace(trimmed, t(trimmed));
    if (node.nodeValue !== rendered) node.nodeValue = rendered;
    textSources.set(node, {source, rendered});
  }
  const nodes = [container, ...container.querySelectorAll('[aria-label],[placeholder],[title],[alt]')];
  for (const item of nodes) {
    if (!item.getAttribute) continue;
    const sources = attributeSources.get(item) || {};
    for (const name of ['aria-label','placeholder','title','alt']) {
      const value = item.getAttribute(name);
      if (!value) continue;
      const old = sources[name];
      const source = old && value === old.rendered ? old.source : value;
      const rendered = t(source);
      if (value !== rendered) item.setAttribute(name, rendered);
      sources[name] = {source, rendered};
    }
    attributeSources.set(item, sources);
  }
}

function syncButtons() {
  document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language())));
}
document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => {
  if (button.dataset.language === language()) return;
  document.documentElement.lang = button.dataset.language;
  try { localStorage.setItem('portfolio-language', language()); } catch { /* Optional persistence. */ }
  syncButtons(); translateTree();
  document.dispatchEvent(new CustomEvent('languagechange'));
}));
syncButtons(); translateTree();

function syncTheme() {
  const light = document.documentElement.dataset.theme === 'light';
  const button = document.querySelector('#theme-toggle');
  button.setAttribute('aria-label', t(light ? 'Gunakan tema gelap' : 'Gunakan tema terang'));
  button.title = t(light ? 'Gunakan tema gelap' : 'Gunakan tema terang');
  document.querySelector('#theme-symbol').textContent = light ? '☾' : '☀';
}
document.querySelector('#theme-toggle').addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('portfolio-theme', theme); } catch { /* Optional persistence. */ }
  syncTheme();
});
document.addEventListener('languagechange', syncTheme);
syncTheme();
