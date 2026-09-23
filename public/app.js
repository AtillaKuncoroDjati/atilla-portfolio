const $ = (selector) => document.querySelector(selector);
const titles = {
  EduSkillWebsite: 'EduSkill',
  Dentist_Appointment_System: 'Dentist Appointment',
  'Restaurant-Table-Booking-System': 'Restaurant Booking',
  'Manajemen-Pertandingan-Sepak-Bola': 'Manajemen Sepak Bola',
  'PWE_Dashboard-Penjualan': 'Dashboard Penjualan',
  'Flood-Data-Classification-and-Prediction-in-Jakarta-Districts-Using-the-Naive-Bayes-Method': 'Eksplorasi Data Banjir Jakarta'
};
const categories = { 'C#':'DESKTOP', JavaScript:'WEB APPLICATION', CSS:'WEB APPLICATION', Blade:'WEB APPLICATION', PHP:'WEB APPLICATION', 'Jupyter Notebook':'DATA EXPLORATION' };
const colors = { 'C#':'#b4d671', JavaScript:'#e9cd72', CSS:'#b39bd7', Blade:'#cf828c', PHP:'#a3afdb', 'Jupyter Notebook':'#dfab79' };
const exclude = new Set(['AtillaKuncoroDjati', 'atilla-portfolio']);
function safeUrl(value, fallback = 'https://github.com/AtillaKuncoroDjati') {
  try { const url = new URL(value); return url.protocol === 'https:' && url.hostname === 'github.com' ? url.href : fallback; } catch { return fallback; }
}
function element(tag, className, content) { const node = document.createElement(tag); node.className = className; if (content !== undefined) node.textContent = content; return node; }
function render(data, live = false) {
  if (!data || !Array.isArray(data.repos)) throw new Error('Invalid portfolio data');
  const repos = data.repos.filter(repo => !repo.fork && !repo.archived && !exclude.has(repo.name));
  const selected = repos.find(repo => repo.name === 'Bening-Studio');
  if (selected?.description) $('#bening-description').textContent = selected.description;
  const grid = $('#project-grid');
  const fragment = document.createDocumentFragment();
  const remaining = repos.filter(repo => repo.name !== 'Bening-Studio');
  remaining.forEach((repo, index) => {
    const article = element('article', 'project-card');
    const top = element('div', 'project-topline');
    top.append(element('span', '', `${String(index + 2).padStart(2, '0')} / ${categories[repo.language] || 'PROJECT'}`));
    const arrow = element('span', 'project-arrow', '↗'); arrow.setAttribute('aria-hidden', 'true'); top.append(arrow);
    const title = element('h3', '');
    const link = element('a', 'repo-link', titles[repo.name] || repo.name.replace(/[-_]/g, ' '));
    link.href = safeUrl(repo.html_url); link.target = '_blank'; link.rel = 'noopener noreferrer'; link.setAttribute('aria-label', `${titles[repo.name] || repo.name} — buka repositori GitHub`); title.append(link);
    const desc = element('p', '', repo.description || 'Kode dan dokumentasi proyek tersedia di repositori GitHub.');
    const bottom = element('div', 'project-bottom');
    const language = element('span', 'language');
    const dot = element('span', 'language-dot'); dot.style.setProperty('--lang-color', colors[repo.language] || '#a5b9a2'); dot.setAttribute('aria-hidden', 'true');
    language.append(dot, document.createTextNode(repo.language || 'Dokumentasi'));
    const date = new Date(repo.updated_at);
    const updated = element('span', '', Number.isNaN(date.getTime()) ? 'GitHub' : new Intl.DateTimeFormat('id-ID', {month:'short',year:'numeric'}).format(date));
    bottom.append(language, updated); article.append(top, title, desc, bottom); fragment.append(article);
  });
  if (!remaining.length) fragment.append(element('p', 'empty-state', 'Proyek lainnya akan muncul di sini ketika tersedia di GitHub.'));
  grid.replaceChildren(fragment);
  $('#project-count').textContent = `${repos.length} karya publik · GitHub`;
  $('.work-overline > span:last-child').textContent = `01 / ${String(repos.length).padStart(2, '0')}`;
  if (data.profile?.location) $('#location').textContent = data.profile.location;
  if (data.release?.tag_name) {
    $('#release-tag').textContent = data.release.tag_name;
    $('.stage-meta > span:last-child').textContent = `Windows / ${data.release.tag_name.replace(/^v/, '')}`;
  }
  if (data.release?.html_url) $('#download-link').href = safeUrl(data.release.html_url, $('#download-link').href);
  const date = new Date(data.updatedAt);
  const label = Number.isNaN(date.getTime()) ? 'Data GitHub' : `Data GitHub · ${new Intl.DateTimeFormat('id-ID', {day:'numeric',month:'short',year:'numeric'}).format(date)}`;
  $('#sync-label').textContent = live ? label : `${label} · salinan tersimpan`;
}
async function load() {
  let ready = false;
  try { const response = await fetch('/data.json'); if (!response.ok) throw new Error(); render(await response.json()); ready = true; } catch { /* Continue to the live endpoint. */ }
  try { const response = await fetch('/api/github', { signal: AbortSignal.timeout(12000) }); if (!response.ok) throw new Error(); const data = await response.json(); render(data, !data.stale); }
  catch { if (!ready) { $('#project-grid').replaceChildren(element('p', 'empty-state', 'Daftar proyek belum dapat dimuat. Kamu tetap bisa melihat seluruh karya melalui tautan GitHub di bawah.')); $('#sync-label').textContent = 'GitHub sementara tidak tersedia'; } }
}
$('#year').textContent = new Date().getFullYear();
load();
