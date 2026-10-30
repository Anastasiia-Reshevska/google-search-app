import axios from 'axios';

export async function fetchResults(query) {
  try {
    const { data } = await axios.get('/api/search', { params: { q: query } });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Search failed.');
  }
}
