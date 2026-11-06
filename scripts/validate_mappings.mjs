import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MAPPINGS_PATH = path.join(__dirname, '../data/mappings.json');

const SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

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

function isValidUrl(urlString, expectedDomain) {
  try {
    const parsed = new URL(urlString);
    return (
      parsed.protocol === 'https:' &&
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
    // 1. Validate mapping key format
    if (!SLUG_REGEX.test(key)) {
      console.error(`[Error] Key "${key}" does not match slug format ^[a-z0-9]+(-[a-z0-9]+)*$`);
      hasErrors = true;
    }

    if (!value || typeof value !== 'object') {
      console.error(`[Error] Mapping for "${key}" must be an object.`);
      hasErrors = true;
      continue;
    }

    // 2. Validate leetcode field
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

    // 3. Validate hackerrank field
    if (value.hackerrank !== null && value.hackerrank !== undefined) {
      if (typeof value.hackerrank !== 'object') {
        console.error(`[Error] Mapping "${key}" hackerrank must be null or an object.`);
        hasErrors = true;
      } else {
        if (typeof value.hackerrank.title !== 'string' || value.hackerrank.title.trim() === '') {
          console.error(`[Error] Mapping "${key}" hackerrank.title must be a non-empty string.`);
          hasErrors = true;
        }
        if (typeof value.hackerrank.url !== 'string' || !isValidUrl(value.hackerrank.url, 'www.hackerrank.com')) {
          console.error(`[Error] Mapping "${key}" hackerrank.url must be a valid https://www.hackerrank.com URL.`);
          hasErrors = true;
        }
      }
    }

    // 4. Validate codechef field
    if (value.codechef !== null && value.codechef !== undefined) {
      if (typeof value.codechef !== 'object') {
        console.error(`[Error] Mapping "${key}" codechef must be null or an object.`);
        hasErrors = true;
      } else {
        if (typeof value.codechef.title !== 'string' || value.codechef.title.trim() === '') {
          console.error(`[Error] Mapping "${key}" codechef.title must be a non-empty string.`);
          hasErrors = true;
        }
        if (typeof value.codechef.url !== 'string' || !isValidUrl(value.codechef.url, 'www.codechef.com')) {
          console.error(`[Error] Mapping "${key}" codechef.url must be a valid https://www.codechef.com URL.`);
          hasErrors = true;
        }
      }
    }

    // 5. Validate verified field
    if (typeof value.verified !== 'boolean') {
      console.error(`[Error] Mapping "${key}" has invalid or missing "verified" boolean.`);
      hasErrors = true;
    }

    // 6. Validate lastUpdated field
    if (typeof value.lastUpdated !== 'string' || !isValidDate(value.lastUpdated)) {
      console.error(`[Error] Mapping "${key}" has invalid or missing "lastUpdated" date (expected YYYY-MM-DD).`);
      hasErrors = true;
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
