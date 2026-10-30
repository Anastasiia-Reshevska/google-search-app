import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { formatSearchResults } from './searchResults.js';

const apiKey = process.env.SERPAPI_KEY;
const isProduction = process.env.NODE_ENV === 'production';
const distPath = resolve(fileURLToPath(new URL('../../dist/', import.meta.url)));
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
};

async function serveStatic(pathname, res) {
  const requestedPath = pathname === '/' ? '/index.html' : pathname;
  let filePath;
  try {
    filePath = resolve(distPath, `.${decodeURIComponent(requestedPath)}`);
  } catch {
    res.statusCode = 400;
    res.end('Bad request.');
    return;
  }
  if (!filePath.startsWith(distPath + sep)) {
    res.statusCode = 403;
    res.end('Forbidden.');
    return;
  }

  try {
    const file = await readFile(filePath);
    res.setHeader('Content-Type', contentTypes[extname(filePath)] || 'application/octet-stream');
    res.end(file);
  } catch {
    res.statusCode = 404;
    res.end('Not found.');
  }
}

createServer(async (req, res) => {
  const requestUrl = new URL(req.url, 'http://localhost');

  if (requestUrl.pathname !== '/api/search') {
    if (isProduction && req.method === 'GET') {
      await serveStatic(requestUrl.pathname, res);
      return;
    }
    res.statusCode = 404;
    res.end('Not found.');
    return;
  }
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method not allowed.' }));
    return;
  }

  const query = requestUrl.searchParams.get('q')?.trim();
  if (!query || query.length > 200) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Enter a search phrase (up to 200 characters).' }));
    return;
  }
  if (!apiKey) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Add SERPAPI_KEY to the .env file.' }));
    return;
  }

  const params = new URLSearchParams({
    engine: 'google', q: query, hl: 'en', gl: 'us', start: '0',
    output: 'json', api_key: apiKey,
  });

  try {
    const response = await fetch(`https://serpapi.com/search.json?${params}`, {
      signal: AbortSignal.timeout(20000),
    });
    const data = await response.json();
    if (!response.ok || data.error) {
      res.statusCode = 502;
      res.end(JSON.stringify({ error: data.error || 'SerpApi request failed.' }));
      return;
    }

    res.end(JSON.stringify(formatSearchResults(data, query, new Date().toISOString())));
  } catch {
    res.statusCode = 502;
    res.end(JSON.stringify({ error: 'Could not fetch results from SerpApi.' }));
  }
}).listen(Number(process.env.PORT) || 3001, isProduction ? '0.0.0.0' : '127.0.0.1', () => {
  console.log(`Search server running on port ${Number(process.env.PORT) || 3001}`);
});
