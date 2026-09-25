import { getProjects, filterProjects, summarizeProjects, categoryLabels, safeGitHubUrl, safePublicUrl } from './projects.js';
import { enhanceMotion } from './interactions.js';
import { t, locale, translateTree } from './i18n.js';
import './activity.js';

const $ = selector => document.querySelector(selector);
const dialog = $('#project-dialog');
let projects = [];
let activeCategory = 'all';
let currentQuery = '';
let currentProject = null;
let lastOpener = null;
let latestRelease = 'https://github.com/AtillaKuncoroDjati/Bening-Studio/releases/latest';
let ready = false;
let profileLocation = '';
let lastData = null;
let lastLive = false;

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
  const art = projectLink(project, '', 'card-art');
  art.dataset.category = project.category;
  art.setAttribute('aria-label', t('Buka proyek') + ' ' + t(project.title));
  art.append(element('span', 'card-art-word', project.art), element('span', 'card-art-index', index));
  if (project.image) {
    art.classList.add('card-art-preview');
    const image = element('img');
    image.src = project.image; image.alt = ''; image.loading = 'lazy'; image.decoding = 'async';
    image.width = project.imageWidth || 1260; image.height = project.imageHeight || 840;
    art.replaceChildren(image, element('span', 'card-preview-label', 'INTERFACE / ' + index));
  }
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
  translateTree($('#project-grid'));
  enhanceMotion($('#project-grid'));
  $('#results-label').textContent = ready ? t(visible.length + ' dari ' + projects.length + ' karya' + (featuredVisible ? ' · termasuk proyek unggulan di atas' : '')) : '';
}
function setCategory(category) {
  activeCategory = category;
  document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
  renderProjects();
}
function render(data, live = false) {
  if (!data || !Array.isArray(data.repos)) throw new Error('Invalid portfolio data');
  lastData = data; lastLive = live;
  projects = getProjects(data.repos);
  ready = true;
  renderProjects();
  const summary = summarizeProjects(projects);
  $('#project-count').textContent = t(summary.count + ' karya publik · GitHub');
  $('#hero-project-count').textContent = String(summary.count).padStart(2, '0');
  $('#passport-projects').textContent = String(summary.count).padStart(2, '0');
  $('#passport-repos').textContent = data.profile?.public_repos ?? '—';
  $('#passport-followers').textContent = data.profile?.followers ?? '—';
  $('#stat-projects').textContent = summary.count;
  $('#stat-languages').textContent = summary.languages;
  if (profileLocation || data.profile?.location) $('#location').textContent = t(profileLocation || data.profile.location);
  if (data.release?.tag_name) $('#release-tag').textContent = data.release.tag_name;
  if (data.release?.html_url) latestRelease = safeGitHubUrl(data.release.html_url, latestRelease);
  $('#download-link').href = latestRelease;
  const date = new Date(data.updatedAt);
  const label = Number.isNaN(date.getTime()) ? t('Data GitHub') : t('Data GitHub') + ' · ' + new Intl.DateTimeFormat(locale(), {day:'numeric', month:'short', year:'numeric'}).format(date);
  $('#sync-label').textContent = live ? label : label + ' · ' + t('salinan tersimpan');
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
    image.src = project.image; image.alt = project.imageAlt || project.title;
    image.width = project.imageWidth || 1260; image.height = project.imageHeight || 840;
    const preview = externalLink('', project.image, 'dialog-preview');
    preview.append(image, element('span', '', 'Lihat gambar ukuran penuh ↗'));
    fragment.append(preview);
  }
  if (project.purpose) fragment.append(detailSection('IDENYA', project.purpose));
  if (project.features?.length) fragment.append(detailSection('APA YANG BISA DILAKUKAN?', project.features));
  if (project.approach) fragment.append(detailSection('DI BALIK LAYAR', project.approach));
  if (project.note) fragment.append(detailSection('CATATAN PENGGUNAAN', project.note));
  const actions = element('div', 'dialog-actions');
  actions.append(externalLink('KODE & DOKUMENTASI ↗', project.url, 'button button-red'));
  if (project.name === 'Bening-Studio') actions.append(externalLink('UNDUH BENING STUDIO ↓', latestRelease, 'button'));
  fragment.append(actions, element('p', 'dialog-footnote', 'Ringkasan berdasarkan dokumentasi proyek dan portofolio Atilla. Detail kode terbaru tersedia di repositori GitHub.'));
  content.replaceChildren(fragment);
  translateTree(content);
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
document.addEventListener('portfolio:filter', event => {
  if (!['web', 'data', 'desktop', 'all'].includes(event.detail)) return;
  currentQuery = ''; $('#project-search').value = ''; setCategory(event.detail);
});
$('#project-search').addEventListener('input', event => { currentQuery = event.target.value; renderProjects(); });
document.addEventListener('keydown', event => {
  const editing = event.target instanceof HTMLElement && (event.target.matches('input, textarea, select') || event.target.isContentEditable);
  if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !editing && !dialog.open) {
    event.preventDefault(); $('#project-search').focus();
  }
});

async function loadProfile() {
  try {
    const response = await fetch('/profile.json');
    if (!response.ok) return;
    const profile = await response.json();
    if (typeof profile.location === 'string' && profile.location.trim()) {
      profileLocation = profile.location;
      $('#location').textContent = t(profileLocation);
    }
    const resume = safePublicUrl(profile.resume);
    if (resume) {
      const link = $('#resume-link'); link.href = resume; link.download = 'CV-Atilla-Kuncoro-Djati.pdf'; link.hidden = false;
    }
    let count = 0;
    const container = $('#records-content');
    for (const [key, heading] of [['experience', 'PENGALAMAN'], ['education', 'PENDIDIKAN'], ['certificates', 'SERTIFIKAT & PRESTASI']]) {
      const items = Array.isArray(profile[key]) ? profile[key].filter(item => item && typeof item.title === 'string' && item.title.trim()) : [];
      if (!items.length) continue;
      count += items.length;
      const section = element('section', 'record-group');
      section.dataset.kind = key;
      if (key === 'certificates') section.id = 'sertifikat';
      section.append(element('h3', '', heading));
      if (key === 'certificates') section.append(element('p', 'record-intro', 'Jejak belajar dan pencapaian. Pilih kategori, lalu buka dokumen atau verifikasi dari penerbitnya.'));
      const grid = element('div', 'record-grid');
      if (key === 'certificates') {
        const filters = element('div', 'certificate-filters');
        filters.setAttribute('role', 'group'); filters.setAttribute('aria-label', 'Filter sertifikat dan prestasi');
        const result = element('p', 'certificate-results', items.length + ' dokumen');
        result.setAttribute('role', 'status');
        for (const kind of ['Semua', ...new Set(items.map(item => item.kind).filter(Boolean))]) {
          const button = element('button', '', kind);
          button.type = 'button'; button.setAttribute('aria-pressed', String(kind === 'Semua'));
          button.addEventListener('click', () => {
            filters.querySelectorAll('button').forEach(node => node.setAttribute('aria-pressed', String(node === button)));
            let visible = 0;
            grid.querySelectorAll('.record-card').forEach(card => {
              card.hidden = kind !== 'Semua' && card.dataset.kind !== kind;
              if (!card.hidden) visible++;
            });
            result.textContent = visible + ' dokumen' + (kind === 'Semua' ? '' : ' · ' + kind);
            translateTree(section);
          });
          filters.append(button);
        }
        section.append(filters, result);
      }
      for (const item of items) {
        const card = element('article', 'record-card');
        card.dataset.kind = item.kind || '';
        const imageUrl = safePublicUrl(item.image);
        const linkUrl = safePublicUrl(item.url);
        if (imageUrl) {
          const image = element('img'); image.src = imageUrl; image.alt = 'Pratinjau ' + item.title + ' — Atilla Kuncoro Djati'; image.loading = 'lazy'; image.decoding = 'async';
          if (item.imageWidth && item.imageHeight) { image.width = item.imageWidth; image.height = item.imageHeight; }
          const preview = linkUrl ? externalLink('', linkUrl, 'record-preview') : element('div', 'record-preview');
          if (linkUrl) preview.setAttribute('aria-label', 'Buka PDF: ' + item.title);
          preview.append(image); card.append(preview);
        }
        const body = element('div', 'record-body');
        const meta = element('div', 'record-meta');
        if (item.kind) meta.append(element('span', 'record-kind', item.kind));
        meta.append(element('small', '', item.period || ''));
        body.append(meta, element('h4', '', item.title), element('p', 'record-organization', item.organization || ''));
        if (item.description) body.append(element('p', 'record-description', item.description));
        if (Array.isArray(item.highlights) && item.highlights.length) {
          const list = element('ul', 'record-highlights');
          item.highlights.forEach(text => list.append(element('li', '', text)));
          body.append(list);
        }
        const actions = element('div', 'record-actions');
        if (linkUrl) actions.append(externalLink(item.linkLabel || (key === 'certificates' ? 'Buka PDF ↗' : 'Informasi lengkap ↗'), linkUrl));
        const verificationUrl = safePublicUrl(item.verificationUrl);
        if (verificationUrl) actions.append(externalLink('Verifikasi ↗', verificationUrl));
        if (actions.childElementCount) body.append(actions);
        card.append(body);
        grid.append(card);
      }
      section.append(grid); container.append(section);
    }
    $('#rekam-jejak').hidden = count === 0; $('#records-nav').hidden = count === 0;
    translateTree(container);
    enhanceMotion(container);
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
document.addEventListener('languagechange', () => { if (lastData) render(lastData, lastLive); });
load(); loadProfile();
