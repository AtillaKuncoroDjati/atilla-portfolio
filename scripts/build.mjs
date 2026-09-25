import { readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const data = JSON.parse((await readFile(new URL('data/github-snapshot.json', root), 'utf8')).replace(/^\uFEFF/, ''));
await writeFile(new URL('public/data.json', root), JSON.stringify(data));
const activity = await readFile(new URL('data/activity-snapshot.json', root), 'utf8');
await writeFile(new URL('public/activity.json', root), activity);
console.log('Portfolio ready in public/');
