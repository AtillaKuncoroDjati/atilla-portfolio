import { readFile } from 'node:fs/promises';

export const OWNER = 'AtillaKuncoroDjati';
const snapshot = JSON.parse((await readFile(new URL('../data/github-snapshot.json', import.meta.url), 'utf8')).replace(/^\uFEFF/, ''));
const text = (value, max = 1000) => typeof value === 'string' ? value.slice(0, max) : '';
const count = value => Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
const date = value => typeof value === 'string' && !Number.isNaN(Date.parse(value)) ? value : null;
const githubUrl = (value, fallback) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'github.com' && url.pathname.split('/')[1]?.toLowerCase() === OWNER.toLowerCase() ? url.href : fallback;
  } catch { return fallback; }
};

export function cleanRepos(repos) {
  if (!Array.isArray(repos)) throw new Error('GitHub returned invalid repository data');
  return repos.filter(repo => repo && !repo.private && !repo.fork && !repo.archived && typeof repo.name === 'string'
    && (!repo.owner || repo.owner.login?.toLowerCase() === OWNER.toLowerCase()))
    .map(repo => ({
      name: text(repo.name, 200), description: text(repo.description),
      html_url: githubUrl(repo.html_url, `https://github.com/${OWNER}/${encodeURIComponent(repo.name)}`),
      language: text(repo.language, 80) || null,
      stargazers_count: count(repo.stargazers_count), forks_count: count(repo.forks_count),
      updated_at: date(repo.updated_at), pushed_at: date(repo.pushed_at),
      fork: false, archived: false,
      topics: Array.isArray(repo.topics) ? repo.topics.filter(value => typeof value === 'string').slice(0, 20) : []
    }));
}

function cleanProfile(profile) {
  return {
    login: OWNER, name: text(profile.name, 150) || OWNER,
    bio: text(profile.bio, 500), location: text(profile.location, 150),
    avatar_url: snapshot.profile.avatar_url, html_url: `https://github.com/${OWNER}`,
    public_repos: count(profile.public_repos), followers: count(profile.followers)
  };
}

function cleanRelease(release) {
  if (!release || release.draft || release.prerelease) return snapshot.release;
  return {
    tag_name: text(release.tag_name, 100),
    html_url: githubUrl(release.html_url, `https://github.com/${OWNER}/Bening-Studio/releases/latest`),
    published_at: date(release.published_at)
  };
}

export function fallbackData() {
  return { profile: cleanProfile(snapshot.profile), repos: cleanRepos(snapshot.repos), release: cleanRelease(snapshot.release), updatedAt: snapshot.updatedAt, stale: true };
}

export async function fetchPortfolio({ fetchImpl = fetch, token = process.env.GITHUB_TOKEN } = {}) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'Atilla-Portfolio', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  const get = async (path) => {
    const response = await fetchImpl(`https://api.github.com${path}`, { headers, signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(`GitHub request failed: ${response.status}`);
    return response.json();
  };
  const results = await Promise.allSettled([
    get(`/users/${OWNER}`),
    get(`/users/${OWNER}/repos?type=owner&sort=updated&per_page=100`),
    get(`/repos/${OWNER}/Bening-Studio/releases/latest`)
  ]);
  // Keep the complete last-known snapshot when the primary repository list fails.
  if (results[1].status !== 'fulfilled') return fallbackData();
  try {
    const stale = results.some(result => result.status !== 'fulfilled');
    return {
      profile: cleanProfile(results[0].status === 'fulfilled' ? results[0].value : snapshot.profile),
      repos: cleanRepos(results[1].value),
      release: cleanRelease(results[2].status === 'fulfilled' ? results[2].value : snapshot.release),
      updatedAt: new Date().toISOString(), stale
    };
  } catch { return fallbackData(); }
}

export function createPortfolioLoader(fetcher = fetchPortfolio, now = () => Date.now()) {
  let cache = null;
  let expiresAt = 0;
  let pending = null;
  return async function loadPortfolio() {
    if (cache && now() < expiresAt) return cache;
    if (!pending) pending = (async () => {
      try { cache = await fetcher(); } catch { cache = fallbackData(); }
      expiresAt = now() + (cache.stale ? 60_000 : 900_000);
      return cache;
    })().finally(() => { pending = null; });
    return pending;
  };
}

export const loadPortfolio = createPortfolioLoader();
