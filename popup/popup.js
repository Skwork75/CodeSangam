import { extractSlug } from '../lib/slug.js';
import { findAlternatives } from '../lib/matcher.js';

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
  const summaryTextEl = document.getElementById('summary-text');
  const alternativesListEl = document.getElementById('alternatives-list');
  const filterBtns = document.querySelectorAll('.filter-btn');

  let currentAlternatives = [];
  let activeFilter = 'all';

  function showState(stateEl) {
    [loadingState, unsupportedState, notFoundState, resultState, errorState].forEach(el => {
      el.classList.add('hidden');
    });
    stateEl.classList.remove('hidden');
  }

  const PLATFORM_DOMAINS = {
    'HackerRank': 'www.hackerrank.com',
    'CodeChef': 'www.codechef.com',
    'GeeksforGeeks': 'www.geeksforgeeks.org',
    'HackerEarth': 'www.hackerearth.com',
    'Codeforces': 'codeforces.com',
    'AtCoder': 'atcoder.jp',
    'Codewars': 'www.codewars.com'
  };

  function isValidPlatformUrl(urlString, platform) {
    try {
      const parsed = new URL(urlString);
      const expectedDomain = PLATFORM_DOMAINS[platform];
      return parsed.protocol === 'https:' && expectedDomain && parsed.hostname.toLowerCase() === expectedDomain;
    } catch {
      return false;
    }
  }

  function formatMatchType(matchType) {
    if (matchType === 'exact') return 'Exact Match';
    if (matchType === 'similar') return 'Similar Problem';
    if (matchType === 'related') return 'Related Problem';
    return matchType;
  }

  function renderAlternatives(filter) {
    alternativesListEl.innerHTML = '';

    const filtered = currentAlternatives.filter(alt => {
      if (filter === 'all') return true;
      return alt.matchType === filter;
    });

    if (filtered.length === 0) {
      const emptyEl = document.createElement('div');
      emptyEl.className = 'sub-text';
      emptyEl.style.textAlign = 'center';
      emptyEl.style.padding = '16px';
      emptyEl.textContent = 'No alternative questions found for this filter.';
      alternativesListEl.appendChild(emptyEl);
      return;
    }

    for (const alt of filtered) {
      const card = document.createElement('div');
      card.className = 'alt-card';

      const topRow = document.createElement('div');
      topRow.className = 'alt-top';

      const platformSpan = document.createElement('span');
      platformSpan.className = 'platform-tag';
      platformSpan.textContent = alt.platform || 'Platform';
      topRow.appendChild(platformSpan);

      const badgesGroup = document.createElement('div');
      badgesGroup.className = 'badges-group';

      if (alt.matchType) {
        const matchBadge = document.createElement('span');
        matchBadge.className = `match-badge ${alt.matchType}`;
        matchBadge.textContent = formatMatchType(alt.matchType);
        badgesGroup.appendChild(matchBadge);
      }

      if (alt.verified) {
        const verifiedBadge = document.createElement('span');
        verifiedBadge.className = 'verified-badge';
        verifiedBadge.textContent = 'Verified';
        badgesGroup.appendChild(verifiedBadge);
      }

      topRow.appendChild(badgesGroup);
      card.appendChild(topRow);

      const bottomRow = document.createElement('div');
      bottomRow.className = 'alt-bottom';

      const titleSpan = document.createElement('span');
      titleSpan.className = 'alt-title';
      titleSpan.textContent = alt.title || 'Problem';
      bottomRow.appendChild(titleSpan);

      if (alt.url && isValidPlatformUrl(alt.url, alt.platform)) {
        const linkBtn = document.createElement('a');
        linkBtn.className = 'alt-btn';
        linkBtn.href = alt.url;
        linkBtn.target = '_blank';
        linkBtn.rel = 'noopener noreferrer';
        linkBtn.textContent = 'Open';
        bottomRow.appendChild(linkBtn);
      }

      card.appendChild(bottomRow);
      alternativesListEl.appendChild(card);
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter');
      renderAlternatives(activeFilter);
    });
  });

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

    const record = await findAlternatives(slug);

    if (!record || !record.alternatives || record.alternatives.length === 0) {
      notFoundSlugEl.textContent = `slug: ${slug}`;
      showState(notFoundState);
      return;
    }

    leetcodeTitleEl.textContent = record.leetcode && record.leetcode.title ? record.leetcode.title : slug;
    leetcodeSlugEl.textContent = `leetcode.com/problems/${slug}`;

    const difficulty = record.leetcode && record.leetcode.difficulty ? record.leetcode.difficulty.toLowerCase() : '';
    leetcodeDifficultyEl.textContent = record.leetcode && record.leetcode.difficulty ? record.leetcode.difficulty : 'Normal';
    leetcodeDifficultyEl.className = 'difficulty-badge';
    if (difficulty === 'easy' || difficulty === 'medium' || difficulty === 'hard') {
      leetcodeDifficultyEl.classList.add(difficulty);
    }

    currentAlternatives = record.alternatives;
    const platformsCount = new Set(currentAlternatives.map(a => a.platform)).size;
    summaryTextEl.textContent = `${currentAlternatives.length} alternative${currentAlternatives.length === 1 ? '' : 's'} across ${platformsCount} platform${platformsCount === 1 ? '' : 's'}`;

    renderAlternatives('all');
    showState(resultState);
  } catch (err) {
    errorMessageEl.textContent = err.message || 'An unexpected error occurred.';
    showState(errorState);
  }
});
