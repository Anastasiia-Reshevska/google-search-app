export function formatSearchResults(data, query, searchedAt) {
  return {
    query,
    searchedAt,
    locale: { language: 'en', country: 'us' },
    results: (data.organic_results || []).map((item) => ({
      position: item.position,
      title: item.title,
      url: item.link,
      description: item.snippet || item.description || '',
    })),
  };
}
