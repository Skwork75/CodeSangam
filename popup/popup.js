import { extractSlug } from '../lib/slug.js';
import { findEquivalents } from '../lib/matcher.js';

document.addEventListener('DOMContentLoaded', async () => {
  const loadingState = document.getElementById('loading-state');
  const unsupportedState = document.getElementById('unsupported-state');
  const notFoundState = document.getElementById('not-found-state');
  const resultState = document.getElementById('result-state');
  const errorState = document.getElementById('error-state');

  const notFoundSlugEl = document.getElementById('not-found-slug');
  const leetcodeTitleEl = document.getElementById('leetcode-title');
  const leetcodeDifficultyEl = document.getElementById('leetcode-difficulty');
  const leetcodeSlugEl = document.getElementById('leetcode-slug');
  const errorMessageEl = document.getElementById('error-message');

  const hackerrankTitleEl = document.getElementById('hackerrank-title');
  const hackerrankLinkEl = document.getElementById('hackerrank-link');
  const hackerrankMissingEl = document.getElementById('hackerrank-missing');

  const codechefTitleEl = document.getElementById('codechef-title');
  const codechefLinkEl = document.getElementById('codechef-link');
  const codechefMissingEl = document.getElementById('codechef-missing');

  function showState(stateEl) {
    [loadingState, unsupportedState, notFoundState, resultState, errorState].forEach(el => {
      el.classList.add('hidden');
    });
    stateEl.classList.remove('hidden');
  }

  function isValidUrl(urlString, expectedDomain) {
    try {
      const parsed = new URL(urlString);
      return parsed.protocol === 'https:' && parsed.hostname.toLowerCase() === expectedDomain;
    } catch {
      return false;
    }
  }

  try {
    let currentUrl = null;

    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const currentTab = tabs && tabs[0];
      currentUrl = currentTab && currentTab.url;
    }

    if (!currentUrl) {
      showState(unsupportedState);
      return;
    }

    const slug = extractSlug(currentUrl);
    if (!slug) {
      showState(unsupportedState);
      return;
    }

    const mapping = await findEquivalents(slug);

    if (!mapping) {
      notFoundSlugEl.textContent = `slug: ${slug}`;
      showState(notFoundState);
      return;
    }

    leetcodeTitleEl.textContent = mapping.leetcode && mapping.leetcode.title ? mapping.leetcode.title : slug;
    leetcodeSlugEl.textContent = `leetcode.com/problems/${slug}`;

    const difficulty = mapping.leetcode && mapping.leetcode.difficulty ? mapping.leetcode.difficulty.toLowerCase() : '';
    leetcodeDifficultyEl.textContent = mapping.leetcode && mapping.leetcode.difficulty ? mapping.leetcode.difficulty : 'Normal';
    leetcodeDifficultyEl.className = 'difficulty-badge';
    if (difficulty === 'easy' || difficulty === 'medium' || difficulty === 'hard') {
      leetcodeDifficultyEl.classList.add(difficulty);
    }

    if (mapping.hackerrank && mapping.hackerrank.url && isValidUrl(mapping.hackerrank.url, 'www.hackerrank.com')) {
      hackerrankTitleEl.textContent = mapping.hackerrank.title || 'HackerRank Problem';
      hackerrankLinkEl.href = mapping.hackerrank.url;
      hackerrankLinkEl.classList.remove('hidden');
      hackerrankMissingEl.classList.add('hidden');
    } else {
      hackerrankTitleEl.textContent = 'HackerRank';
      hackerrankLinkEl.classList.add('hidden');
      hackerrankMissingEl.classList.remove('hidden');
    }

    if (mapping.codechef && mapping.codechef.url && isValidUrl(mapping.codechef.url, 'www.codechef.com')) {
      codechefTitleEl.textContent = mapping.codechef.title || 'CodeChef Problem';
      codechefLinkEl.href = mapping.codechef.url;
      codechefLinkEl.classList.remove('hidden');
      codechefMissingEl.classList.add('hidden');
    } else {
      codechefTitleEl.textContent = 'CodeChef';
      codechefLinkEl.classList.add('hidden');
      codechefMissingEl.classList.remove('hidden');
    }

    showState(resultState);
  } catch (err) {
    errorMessageEl.textContent = err.message || 'An unexpected error occurred.';
    showState(errorState);
  }
});
