import { getProjects, filterProjects, summarizeProjects, categoryLabels, safeGitHubUrl, safePublicUrl } from './projects.js';

const $ = selector => document.querySelector(selector);
const dialog = $('#project-dialog');
let projects = [];
let activeCategory = 'all';
let currentQuery = '';
let currentProject = null;
let lastOpener = null;
let latestRelease = 'https://github.com/AtillaKuncoroDjati/Bening-Studio/releases/latest';
let ready = false;

function element(tag, className = '', content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
}
function externalLink(label, url, className = '') {
  const link = element('a', className, label);
  link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
  return link;
}
function projectLink(project, label, className = '') {
  const link = element('a', className, label);
  link.href = '#proyek/' + encodeURIComponent(project.name);
  return link;
}
function tags(values) {
  const list = element('div', 'project-tags');
  values.forEach(value => list.append(element('span', '', value)));
  return list;
}
function renderCard(project) {
  const index = String(projects.indexOf(project) + 1).padStart(2, '0');
  const article = element('article', 'project-card');
  const art = element('div', 'card-art');
  art.dataset.category = project.category; art.setAttribute('aria-hidden', 'true');
  art.append(element('span', 'card-art-word', project.art), element('span', 'card-art-index', index));
  const body = element('div', 'card-content');
  const topline = element('div', 'project-topline');
  const date = new Date(project.updated_at);
  const year = Number.isNaN(date.getTime()) ? 'GITHUB' : String(date.getFullYear());
  topline.append(element('span', '', categoryLabels[project.category]), element('span', '', year));
  const title = element('h3'); title.append(projectLink(project, project.title));
  const bottom = element('div', 'card-bottom');
  bottom.append(tags(project.stack.slice(0, 3)));
  const arrow = element('span', 'card-arrow', '↗'); arrow.setAttribute('aria-hidden', 'true'); bottom.append(arrow);
  body.append(topline, title, element('p', '', project.summary), bottom);
  article.append(art, body);
  return article;
}
function renderProjects() {
  const visible = filterProjects(projects, activeCategory, currentQuery);
  const featuredVisible = visible.some(project => project.name === 'Bening-Studio');
  $('#bening').hidden = !featuredVisible;
  const fragment = document.createDocumentFragment();
  visible.filter(project => project.name !== 'Bening-Studio').forEach(project => fragment.append(renderCard(project)));
  if (!visible.length) {
    const empty = element('div', 'empty-state');
    empty.append(element('h3', '', 'BELUM ADA YANG COCOK.'), element('p', '', 'Coba kata kunci lain atau tampilkan semua kategori.'));
    const reset = element('button', '', 'Tampilkan semua proyek');
    reset.addEventListener('click', () => {
      currentQuery = ''; $('#project-search').value = ''; setCategory('all');
      $('#project-search').focus();
    });
    empty.append(reset); fragment.append(empty);
  }
  $('#project-grid').replaceChildren(fragment);
  $('#results-label').textContent = ready ? visible.length + ' dari ' + projects.length + ' karya' + (featuredVisible ? ' · termasuk proyek unggulan di atas' : '') : '';
}
function setCategory(category) {
  activeCategory = category;
  document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
  renderProjects();
}
function render(data, live = false) {
  if (!data || !Array.isArray(data.repos)) throw new Error('Invalid portfolio data');
  projects = getProjects(data.repos);
  ready = true;
  renderProjects();
  const summary = summarizeProjects(projects);
  $('#project-count').textContent = summary.count + ' karya publik · GitHub';
  $('#hero-project-count').textContent = String(summary.count).padStart(2, '0');
  $('#stat-projects').textContent = summary.count;
  $('#stat-languages').textContent = summary.languages;
  $('#stat-stars').textContent = summary.stars;
  if (data.profile?.location) $('#location').textContent = data.profile.location;
  if (data.release?.tag_name) $('#release-tag').textContent = data.release.tag_name;
  if (data.release?.html_url) latestRelease = safeGitHubUrl(data.release.html_url, latestRelease);
  $('#download-link').href = latestRelease;
  const date = new Date(data.updatedAt);
  const label = Number.isNaN(date.getTime()) ? 'Data GitHub' : 'Data GitHub · ' + new Intl.DateTimeFormat('id-ID', {day:'numeric', month:'short', year:'numeric'}).format(date);
  $('#sync-label').textContent = live ? label : label + ' · salinan tersimpan';
  followHash();
}
function detailSection(title, content) {
  const section = element('section', 'dialog-section');
  section.append(element('h3', '', title));
  if (Array.isArray(content)) {
    const list = element('ul');
    content.forEach(item => list.append(element('li', '', item)));
    section.append(list);
  } else section.append(element('p', '', content));
  return section;
}
function openProject(project) {
  if (dialog.open && currentProject === project.name) return;
  if (!dialog.open) lastOpener = document.activeElement;
  currentProject = project.name;
  const content = $('#dialog-content');
  const title = element('h2', '', project.title); title.id = 'dialog-title';
  const fragment = document.createDocumentFragment();
  fragment.append(element('p', 'dialog-kicker', categoryLabels[project.category] + ' / CASE FILE ' + String(projects.indexOf(project) + 1).padStart(2, '0')), title, element('p', 'dialog-summary', project.summary), tags(project.stack));
  if (project.image) {
    const image = element('img', 'dialog-image');
    image.src = project.image; image.alt = project.imageAlt || project.title; image.width = 1260; image.height = 840;
    fragment.append(image);
  }
  if (project.purpose) fragment.append(detailSection('IDENYA', project.purpose));
  if (project.features?.length) fragment.append(detailSection('APA YANG BISA DILAKUKAN?', project.features));
  if (project.approach) fragment.append(detailSection('DI BALIK LAYAR', project.approach));
  if (project.note) fragment.append(detailSection('CATATAN PENGGUNAAN', project.note));
  const actions = element('div', 'dialog-actions');
  actions.append(externalLink('KODE & DOKUMENTASI ↗', project.url, 'button button-red'));
  if (project.name === 'Bening-Studio') actions.append(externalLink('UNDUH BENING STUDIO ↓', latestRelease, 'button'));
  fragment.append(actions, element('p', 'dialog-footnote', 'Ringkasan berdasarkan dokumentasi publik proyek. Detail terbaru tersedia di repositori GitHub.'));
  content.replaceChildren(fragment);
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
  document.body.classList.add('modal-open');
}
function followHash() {
  if (!location.hash.startsWith('#proyek/')) {
    if (dialog.open) dialog.close();
    return;
  }
  let name;
  try { name = decodeURIComponent(location.hash.slice(8)); } catch { return; }
  const project = projects.find(item => item.name === name);
  if (project) openProject(project);
}
$('#dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  currentProject = null;
  if (location.hash.startsWith('#proyek/')) history.replaceState(null, '', location.pathname + location.search + '#karya');
  if (lastOpener?.isConnected && lastOpener !== document.body) lastOpener.focus({ preventScroll: true });
  else $('.filters button[aria-pressed="true"]').focus({ preventScroll: true });
});
window.addEventListener('hashchange', followHash);

document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => setCategory(button.dataset.filter)));
$('#project-search').addEventListener('input', event => { currentQuery = event.target.value; renderProjects(); });
document.addEventListener('keydown', event => {
  const editing = event.target instanceof HTMLElement && (event.target.matches('input, textarea, select') || event.target.isContentEditable);
  if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !editing && !dialog.open) {
    event.preventDefault(); $('#project-search').focus();
  }
});

const menuButton = $('.menu-toggle');
const nav = $('#main-nav');
function closeMenu() { nav.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); }
menuButton.addEventListener('click', () => {
  const open = !nav.classList.contains('is-open'); nav.classList.toggle('is-open', open); menuButton.setAttribute('aria-expanded', String(open));
});
nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); menuButton.focus(); } });
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.hash === '#' + visible.target.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-15% 0px -40% 0px', threshold: [0, .1, .3] });
  document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
}

async function loadProfile() {
  try {
    const response = await fetch('/profile.json');
    if (!response.ok) return;
    const profile = await response.json();
    const resume = safePublicUrl(profile.resume);
    if (resume) {
      const link = $('#resume-link'); link.href = resume; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.hidden = false;
    }
    let count = 0;
    const container = $('#records-content');
    for (const [key, heading] of [['experience', 'PENGALAMAN'], ['education', 'PENDIDIKAN'], ['certificates', 'SERTIFIKAT']]) {
      const items = Array.isArray(profile[key]) ? profile[key].filter(item => item && typeof item.title === 'string' && item.title.trim()) : [];
      if (!items.length) continue;
      count += items.length;
      const section = element('section', 'record-group');
      section.append(element('h3', '', heading));
      const grid = element('div', 'record-grid');
      for (const item of items) {
        const card = element('article', 'record-card');
        const imageUrl = safePublicUrl(item.image);
        if (imageUrl) {
          const image = element('img'); image.src = imageUrl; image.alt = item.title; image.loading = 'lazy'; card.append(image);
        }
        card.append(element('small', '', item.period || ''), element('h4', '', item.title), element('p', '', item.organization || ''));
        if (item.description) card.append(element('p', '', item.description));
        const linkUrl = safePublicUrl(item.url);
        if (linkUrl) card.append(externalLink(key === 'certificates' ? 'Lihat sertifikat ↗' : 'Informasi lengkap ↗', linkUrl));
        grid.append(card);
      }
      section.append(grid); container.append(section);
    }
    $('#rekam-jejak').hidden = count === 0; $('#records-nav').hidden = count === 0;
  } catch { /* Optional records stay hidden until real materials are available. */ }
}
async function load() {
  try { const response = await fetch('/data.json'); if (!response.ok) throw new Error(); render(await response.json()); } catch { /* Continue with the live source. */ }
  try {
    const response = await fetch('/api/github', {signal: AbortSignal.timeout(12000)});
    if (!response.ok) throw new Error();
    const data = await response.json(); render(data, !data.stale);
  } catch {
    if (!ready) {
      $('#project-grid').replaceChildren(element('p', 'empty-state', 'Daftar proyek belum dapat dimuat. Seluruh karya tetap tersedia melalui tautan GitHub di bawah.'));
      $('#sync-label').textContent = 'GitHub sementara tidak tersedia';
    }
  }
}
$('#year').textContent = new Date().getFullYear();
load(); loadProfile();
