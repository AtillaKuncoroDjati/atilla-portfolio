import {loadActivity} from '../lib/activity.js';
export default async function handler(req, res) {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.setHeader('Allow', 'GET, HEAD'); res.writeHead(405, {'Content-Type': 'application/json'}); return res.end(JSON.stringify({error: 'Method not allowed'}));
  }
  const data = await loadActivity();
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', `public, max-age=0, s-maxage=${data.stale ? 300 : 3600}, stale-while-revalidate=86400`);
  res.statusCode = 200;
  res.end(req.method === 'HEAD' ? undefined : JSON.stringify(data));
}
