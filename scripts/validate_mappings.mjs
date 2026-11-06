import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MAPPINGS_PATH = path.join(__dirname, '../data/mappings.json');

const SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const ALLOWED_PLATFORMS = new Set([
  'HackerRank',
  'CodeChef',
  'GeeksforGeeks',
  'HackerEarth',
  'Codeforces',
  'AtCoder',
  'Codewars'
]);

const PLATFORM_DOMAINS = {
  'HackerRank': 'www.hackerrank.com',
  'CodeChef': 'www.codechef.com',
  'GeeksforGeeks': 'www.geeksforgeeks.org',
  'HackerEarth': 'www.hackerearth.com',
  'Codeforces': 'codeforces.com',
  'AtCoder': 'atcoder.jp',
  'Codewars': 'www.codewars.com'
};

const ALLOWED_MATCH_TYPES = new Set(['exact', 'similar', 'related']);

function isValidDate(dateString) {
  if (!DATE_REGEX.test(dateString)) return false;
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function isValidPlatformUrl(urlString, platform) {
  try {
    const parsed = new URL(urlString);
    const expectedDomain = PLATFORM_DOMAINS[platform];
    return (
      parsed.protocol === 'https:' &&
      expectedDomain &&
      parsed.hostname.toLowerCase() === expectedDomain
    );
  } catch {
    return false;
  }
}

function validateMappings() {
  let rawData;
  try {
    rawData = fs.readFileSync(MAPPINGS_PATH, 'utf8');
  } catch (err) {
    console.error(`Error reading mappings.json: ${err.message}`);
    process.exit(1);
  }

  let mappings;
  try {
    mappings = JSON.parse(rawData);
  } catch (err) {
    console.error(`Error parsing mappings.json as JSON: ${err.message}`);
    process.exit(1);
  }

  if (!mappings || typeof mappings !== 'object' || Array.isArray(mappings)) {
    console.error('Validation Error: Root of mappings.json must be an object.');
    process.exit(1);
  }

  let hasErrors = false;

  for (const [key, value] of Object.entries(mappings)) {
    if (!SLUG_REGEX.test(key)) {
      console.error(`[Error] Key "${key}" does not match slug format ^[a-z0-9]+(-[a-z0-9]+)*$`);
      hasErrors = true;
    }

    if (!value || typeof value !== 'object') {
      console.error(`[Error] Mapping for "${key}" must be an object.`);
      hasErrors = true;
      continue;
    }

    if (!value.leetcode || typeof value.leetcode !== 'object') {
      console.error(`[Error] Mapping "${key}" is missing required "leetcode" object.`);
      hasErrors = true;
    } else {
      if (typeof value.leetcode.title !== 'string' || value.leetcode.title.trim() === '') {
        console.error(`[Error] Mapping "${key}" has invalid or empty leetcode.title.`);
        hasErrors = true;
      }
      if (value.leetcode.difficulty !== undefined && typeof value.leetcode.difficulty !== 'string') {
        console.error(`[Error] Mapping "${key}" has invalid leetcode.difficulty type.`);
        hasErrors = true;
      }
    }

    if (value.alternatives !== undefined) {
      if (!Array.isArray(value.alternatives)) {
        console.error(`[Error] Mapping "${key}" alternatives must be an array.`);
        hasErrors = true;
      } else {
        const seenIds = new Set();
        for (const [index, alt] of value.alternatives.entries()) {
          if (!alt || typeof alt !== 'object') {
            console.error(`[Error] Mapping "${key}" alternative at index ${index} must be an object.`);
            hasErrors = true;
            continue;
          }

          if (typeof alt.id !== 'string' || alt.id.trim() === '') {
            console.error(`[Error] Mapping "${key}" alternative at index ${index} has missing or invalid id.`);
            hasErrors = true;
          } else {
            if (seenIds.has(alt.id)) {
              console.error(`[Error] Mapping "${key}" has duplicate alternative id "${alt.id}".`);
              hasErrors = true;
            }
            seenIds.add(alt.id);
          }

          if (!ALLOWED_PLATFORMS.has(alt.platform)) {
            console.error(`[Error] Mapping "${key}" alternative at index ${index} has unsupported platform "${alt.platform}".`);
            hasErrors = true;
          }

          if (typeof alt.title !== 'string' || alt.title.trim() === '') {
            console.error(`[Error] Mapping "${key}" alternative at index ${index} has missing or invalid title.`);
            hasErrors = true;
          }

          if (typeof alt.url !== 'string' || !isValidPlatformUrl(alt.url, alt.platform)) {
            console.error(`[Error] Mapping "${key}" alternative at index ${index} has invalid or insecure URL for platform "${alt.platform}".`);
            hasErrors = true;
          }

          if (!ALLOWED_MATCH_TYPES.has(alt.matchType)) {
            console.error(`[Error] Mapping "${key}" alternative at index ${index} has invalid matchType "${alt.matchType}".`);
            hasErrors = true;
          }

          if (typeof alt.verified !== 'boolean') {
            console.error(`[Error] Mapping "${key}" alternative at index ${index} has invalid or missing verified boolean.`);
            hasErrors = true;
          }

          if (typeof alt.lastUpdated !== 'string' || !isValidDate(alt.lastUpdated)) {
            console.error(`[Error] Mapping "${key}" alternative at index ${index} has invalid lastUpdated date (expected YYYY-MM-DD).`);
            hasErrors = true;
          }
        }
      }
    }
  }

  if (hasErrors) {
    console.error('\nMapping validation failed.');
    process.exit(1);
  } else {
    console.log('Mapping validation passed successfully.');
    process.exit(0);
  }
}

validateMappings();
