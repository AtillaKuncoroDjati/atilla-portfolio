import { readFile } from 'node:fs/promises';
import { OWNER } from './github.js';

const snapshot = JSON.parse(await readFile(new URL('../data/activity-snapshot.json', import.meta.url), 'utf8'));
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
export function parseContributions(html) {
  const tips = new Map();
  for (const match of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)) {
    const id = attr(match[1], 'for');
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    const count = /^No contributions\b/i.test(text) ? 0 : Number(text.match(/^([\d,]+) contributions?\b/i)?.[1]?.replaceAll(',', ''));
    if (id && Number.isSafeInteger(count) && count >= 0) tips.set(id, count);
  }
  const days = new Map();
  for (const match of html.matchAll(/<td\b[^>]*\bdata-date="[^"<>]+"[^>]*>/g)) {
    const date = attr(match[0], 'data-date');
    const count = tips.get(attr(match[0], 'id'));
    const level = Number(attr(match[0], 'data-level'));
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '') || new Date(date).toISOString().slice(0, 10) !== date || !Number.isSafeInteger(count) || !Number.isInteger(level) || level < 0 || level > 4) throw new Error('Invalid contribution day');
    if (days.has(date)) throw new Error('Duplicate contribution day');
    days.set(date, {date, count, level});
  }
  if (!days.size) throw new Error('Contribution calendar not found');
  return [...days.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export function contributionStats(days) {
  let run = 0, longest = 0, previous = null;
  for (const day of days) {
    const consecutive = previous && Date.parse(day.date) - Date.parse(previous) === 86400000;
    run = day.count > 0 ? (consecutive ? run + 1 : 1) : 0;
    longest = Math.max(longest, run); previous = day.date;
  }
  let index = days.length - 1;
  if (index >= 0 && days[index].count === 0) index--;
  let current = 0;
  for (; index >= 0 && days[index].count > 0; index--) {
    if (current && Date.parse(days[index + 1].date) - Date.parse(days[index].date) !== 86400000) break;
    current++;
  }
  return {total: days.reduce((sum, day) => sum + day.count, 0), currentStreak: current, longestStreak: longest};
}

export function summarizeLanguages(languageMaps) {
  const totals = new Map();
  for (const map of languageMaps) for (const [name, bytes] of Object.entries(map || {})) {
    if (Number.isSafeInteger(bytes) && bytes > 0) totals.set(name, (totals.get(name) || 0) + bytes);
  }
  const total = [...totals.values()].reduce((sum, bytes) => sum + bytes, 0);
  return [...totals].sort((a, b) => b[1] - a[1]).map(([name, bytes]) => ({name, bytes, percent: total ? Math.round(bytes / total * 1000) / 10 : 0}));
}

export async function fetchActivity({fetchImpl = fetch, token = process.env.GITHUB_TOKEN} = {}) {
  const headers = {Accept: 'application/vnd.github+json', 'User-Agent': 'Atilla-Portfolio', ...(token ? {Authorization: `Bearer ${token}`} : {})};
  const get = async path => {
    const response = await fetchImpl('https://api.github.com' + path, {headers, signal: AbortSignal.timeout(8000)});
    if (!response.ok) throw new Error('GitHub activity unavailable');
    return response.json();
  };
  const parts = await Promise.allSettled([
    (async () => {
      const response = await fetchImpl(`https://github.com/users/${OWNER}/contributions`, {headers: {'User-Agent': 'Atilla-Portfolio'}, signal: AbortSignal.timeout(8000)});
      if (!response.ok) throw new Error('Calendar unavailable');
      const days = parseContributions(await response.text());
      if (days.length < 300) throw new Error('Incomplete annual calendar');
      return {days, ...contributionStats(days)};
    })(),
    (async () => {
      const repos = await get(`/users/${OWNER}/repos?type=owner&per_page=100`);
      if (!Array.isArray(repos)) throw new Error('Repository data invalid');
      const owned = repos.filter(repo => !repo.private && !repo.fork && !repo.archived && repo.owner?.login?.toLowerCase() === OWNER.toLowerCase());
      const maps = await Promise.all(owned.filter(repo => repo.language).map(repo => get(`/repos/${OWNER}/${encodeURIComponent(repo.name)}/languages`)));
      return {languages: summarizeLanguages(maps), repoCount: owned.length, stars: owned.reduce((sum, repo) => sum + (Number.isSafeInteger(repo.stargazers_count) ? repo.stargazers_count : 0), 0)};
    })(),
    get(`/search/commits?q=author%3A${OWNER}&per_page=1`).then(result => {
      if (!Number.isSafeInteger(result.total_count) || result.incomplete_results) throw new Error('Commit search incomplete');
      return result.total_count;
    })
  ]);
  const calendar = parts[0].status === 'fulfilled' ? {...parts[0].value, updatedAt: new Date().toISOString(), stale: false} : {...snapshot.calendar, stale: true};
  const repositories = parts[1].status === 'fulfilled' ? {...parts[1].value, updatedAt: new Date().toISOString(), stale: false} : {...snapshot.repositories, stale: true};
  const commits = parts[2].status === 'fulfilled' ? {count: parts[2].value, updatedAt: new Date().toISOString(), stale: false} : {...snapshot.commits, stale: true};
  return {calendar, repositories, commits, stale: parts.some(part => part.status !== 'fulfilled')};
}

// CDN and this process keep the more expensive activity lookups for one hour.
export function createActivityLoader(fetcher = fetchActivity, now = () => Date.now()) {
  let cached, expires = 0, pending;
  return async () => {
    if (cached && now() < expires) return cached;
    if (!pending) pending = Promise.resolve().then(fetcher).catch(() => ({...snapshot, stale: true})).then(data => {
      cached = data; expires = now() + (data.stale ? 300000 : 3600000); return data;
    }).finally(() => { pending = null; });
    return pending;
  };
}
export const loadActivity = createActivityLoader();
