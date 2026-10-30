import { fetchResults } from './apiRequests.js';

const form = document.getElementById('form');
const input = document.getElementById('input');
const status = document.getElementById('status');
const results = document.getElementById('results');
const downloadButton = document.getElementById('download');
const searchButton = document.getElementById('search-button');
let currentData = null;

function renderResults(items) {
  const listItems = items.map((item) => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    const description = document.createElement('p');

    link.href = item.url;
    link.textContent = item.title || item.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    description.textContent = item.description;
    listItem.append(link, description);
    return listItem;
  });

  results.replaceChildren(...listItems);
}

async function handleSearch(event) {
  event.preventDefault();
  const query = input.value.trim();
  if (!query) return;

  currentData = null;
  downloadButton.hidden = true;
  results.replaceChildren();
  status.textContent = 'Searching…';
  searchButton.disabled = true;

  try {
    const data = await fetchResults(query);
    currentData = data;
    renderResults(data.results);
    status.textContent = `Organic results found: ${data.results.length}`;
    downloadButton.hidden = false;
  } catch (error) {
    status.textContent = error.message;
  } finally {
    searchButton.disabled = false;
  }
}

function downloadJson() {
  if (!currentData) return;

  const blob = new Blob([JSON.stringify(currentData, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `google-results-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

form.addEventListener('submit', handleSearch);
downloadButton.addEventListener('click', downloadJson);
