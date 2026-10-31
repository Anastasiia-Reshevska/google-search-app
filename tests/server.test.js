import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createSearchHandler } from '../src/js/server.js';

let calls = 0;
let providerResponse = { ok: true, data: { organic_results: [] } };
process.env.SERPAPI_KEY = 'test-key';
const handler = createSearchHandler({
  fetchResults: async (url) => {
    calls += 1;
    const params = new URL(url).searchParams;
    assert.equal(params.get('start'), '0');
    assert.equal(params.get('q'), 'test');
    return { ok: providerResponse.ok, json: async () => providerResponse.data };
  },
});

async function request(url) {
  const response = { statusCode: 200, headers: {}, setHeader(name, value) { this.headers[name] = value; }, end(body) { this.body = body; } };
  await handler({ url, method: 'GET', socket: { remoteAddress: '127.0.0.1' } }, response);
  return { status: response.statusCode, headers: response.headers, body: JSON.parse(response.body) };
}

test('serializes results and sends start=0', async () => {
  providerResponse = { ok: true, data: { organic_results: [{ position: 1, title: 'A', link: 'https://a.example', snippet: 'Summary' }] } };
  const response = await request('/api/search?q=test');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body.results, [{ position: 1, title: 'A', url: 'https://a.example', description: 'Summary' }]);
});

test('rejects invalid queries without calling provider', async () => {
  const previous = calls;
  for (const query of ['', '   ', 'x'.repeat(201)]) {
    const response = await request(`/api/search?q=${encodeURIComponent(query)}`);
    assert.equal(response.status, 400);
  }
  assert.equal(calls, previous);
});

test('returns provider errors as 502', async () => {
  providerResponse = { ok: false, data: { error: 'Provider unavailable' } };
  const response = await request('/api/search?q=test');
  assert.equal(response.status, 502);
  assert.deepEqual(response.body, { error: 'Provider unavailable' });
});

test('limits searches before calling provider', async () => {
  providerResponse = { ok: true, data: { organic_results: [] } };
  const previous = calls;
  for (let i = 0; i < 8; i += 1) await request('/api/search?q=test');
  const response = await request('/api/search?q=test');
  assert.equal(response.status, 429);
  assert.ok(Number(response.headers['Retry-After']) > 0);
  assert.equal(calls, previous + 8);
});
