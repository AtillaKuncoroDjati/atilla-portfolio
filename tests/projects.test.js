import test from 'node:test';
import assert from 'node:assert/strict';
import { getProjects, filterProjects, summarizeProjects, safeGitHubUrl, safePublicUrl } from '../public/projects.js';

const repos = [
  { name: 'Bening-Studio', language: 'C#', stargazers_count: 2 },
  { name: 'EduSkillWebsite', language: 'JavaScript', stargazers_count: 3 },
  { name: 'Future-Analysis', language: 'Python', description: 'Analisis data terbuka' },
  { name: 'atilla-portfolio', language: 'JavaScript' },
  { name: 'AtillaKuncoroDjati' },
  { name: 'Secret', private: true },
  { name: 'Fork', fork: true },
  { name: 'Old', archived: true },
  null
];

test('catalog includes future public work while excluding private, fork, archive, and profile repositories', () => {
  const projects = getProjects(repos);
  assert.deepEqual(projects.map(project => project.name), ['Bening-Studio', 'EduSkillWebsite', 'Future-Analysis']);
  assert.equal(projects[2].category, 'data');
  assert.equal(projects[2].summary, 'Analisis data terbuka');
  assert.deepEqual(getProjects(null), []);
});

test('category and multiword search combine, and desktop retains the featured project', () => {
  const projects = getProjects(repos);
  assert.equal(filterProjects(projects, 'desktop')[0].name, 'Bening-Studio');
  assert.equal(filterProjects(projects, 'web', '  LARAVEL   kuis ')[0].name, 'EduSkillWebsite');
  assert.equal(filterProjects(projects, 'desktop', 'Laravel').length, 0);
  assert.equal(filterProjects(projects, 'all', 'missing').length, 0);
});

test('public statistics describe displayed projects without counting excluded repositories', () => {
  assert.deepEqual(summarizeProjects(getProjects(repos)), {count: 3, languages: 3, stars: 5});
});

test('project links stay on the owner GitHub account and block executable or credential URLs', () => {
  const fallback = 'https://github.com/AtillaKuncoroDjati';
  for (const value of ['javascript:alert(1)', 'https://github.com/another-account/private', 'https://user:password@github.com/AtillaKuncoroDjati', 'https://github.com.evil.test/AtillaKuncoroDjati']) {
    assert.equal(safeGitHubUrl(value), fallback);
  }
  assert.equal(safeGitHubUrl(fallback + '/Bening-Studio'), fallback + '/Bening-Studio');
});

test('optional public materials allow HTTPS and local documents but reject unsafe paths', () => {
  assert.equal(safePublicUrl('/documents/atilla-cv.pdf'), '/documents/atilla-cv.pdf');
  assert.equal(safePublicUrl('/assets/certificate.png'), '/assets/certificate.png');
  assert.equal(safePublicUrl('https://example.com/certificate'), 'https://example.com/certificate');
  for (const value of [null, '', 'javascript:alert(1)', '//example.com/file', '/assets/../.env', '/documents/%2e%2e/.env', 'https://user:pass@example.com/']) {
    assert.equal(safePublicUrl(value), null);
  }
});
