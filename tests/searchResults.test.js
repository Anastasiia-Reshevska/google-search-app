import assert from 'node:assert/strict';
import test from 'node:test';
import { formatSearchResults } from '../src/js/searchResults.js';

test('returns only organic results with the fields used by the app', () => {
  const input = {
    organic_results: [
      { position: 1, title: 'Example', link: 'https://example.com', snippet: 'Provider snippet', description: 'Fallback summary', extra: 'ignored' },
      { position: 2, title: 'Second', link: 'https://second.example', description: 'Fallback summary' },
      { position: 3, title: 'Third', link: 'https://third.example' },
    ],
    ads: [{ title: 'Sponsored', link: 'https://ad.example' }],
    local_results: [{ title: 'Nearby' }],
  };

  assert.deepEqual(formatSearchResults(input, 'example query', '2026-10-30T10:00:00.000Z'), {
    query: 'example query',
    searchedAt: '2026-10-30T10:00:00.000Z',
    locale: { language: 'en', country: 'us' },
    results: [
      { position: 1, title: 'Example', url: 'https://example.com', description: 'Provider snippet' },
      { position: 2, title: 'Second', url: 'https://second.example', description: 'Fallback summary' },
      { position: 3, title: 'Third', url: 'https://third.example', description: '' },
    ],
  });
});

test('formatted results serialize to JSON without provider fields', () => {
  const output = formatSearchResults({ organic_results: [{ position: 1, title: 'A', link: 'https://a.example', snippet: 'Summary', extra: 'private' }] }, 'a', '2026-10-30T10:00:00.000Z');
  assert.deepEqual(JSON.parse(JSON.stringify(output)), {
    query: 'a', searchedAt: '2026-10-30T10:00:00.000Z',
    locale: { language: 'en', country: 'us' },
    results: [{ position: 1, title: 'A', url: 'https://a.example', description: 'Summary' }],
  });
});

test('returns an empty results list when SerpApi has no organic results', () => {
  const output = formatSearchResults({ ads: [{ title: 'Sponsored' }] }, 'missing', '2026-10-30T10:00:00.000Z');
  assert.deepEqual(output.results, []);
});
