import { loadPortfolio } from '../lib/github.js';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    res.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }
  const data = await loadPortfolio();
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', `public, max-age=0, s-maxage=${data.stale ? 60 : 900}, stale-while-revalidate=3600`);
  res.statusCode = 200;
  res.end(req.method === 'HEAD' ? undefined : JSON.stringify(data));
}
