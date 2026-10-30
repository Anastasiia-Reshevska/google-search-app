import assert from 'node:assert/strict';
import test from 'node:test';
import { formatSearchResults } from '../src/js/searchResults.js';

test('returns only organic results with the fields used by the app', () => {
  const input = {
    organic_results: [
      { position: 1, title: 'Example', link: 'https://example.com', description: 'Page summary', extra: 'ignored' },
      { position: 2, title: 'Second', link: 'https://second.example' },
    ],
    ads: [{ title: 'Sponsored', link: 'https://ad.example' }],
    local_results: [{ title: 'Nearby' }],
  };

  assert.deepEqual(formatSearchResults(input, 'example query', '2026-10-30T10:00:00.000Z'), {
    query: 'example query',
    searchedAt: '2026-10-30T10:00:00.000Z',
    locale: { language: 'en', country: 'us' },
    results: [
      { position: 1, title: 'Example', url: 'https://example.com', description: 'Page summary' },
      { position: 2, title: 'Second', url: 'https://second.example', description: '' },
    ],
  });
});

test('returns an empty results list when SerpApi has no organic results', () => {
  const output = formatSearchResults({ ads: [{ title: 'Sponsored' }] }, 'missing', '2026-10-30T10:00:00.000Z');
  assert.deepEqual(output.results, []);
});
