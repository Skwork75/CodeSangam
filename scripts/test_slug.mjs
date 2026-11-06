import test from 'node:test';
import assert from 'node:assert';
import { extractSlug } from '../lib/slug.js';
import { findAlternatives, findEquivalents } from '../lib/matcher.js';

test('extractSlug - valid URLs', () => {
  assert.strictEqual(extractSlug('https://leetcode.com/problems/two-sum/'), 'two-sum');
  assert.strictEqual(extractSlug('https://leetcode.com/problems/valid-parentheses/description/'), 'valid-parentheses');
  assert.strictEqual(extractSlug('http://leetcode.com/problems/reverse-string'), 'reverse-string');
  assert.strictEqual(extractSlug('https://www.leetcode.com/problems/longest-substring-without-repeating-characters/'), 'longest-substring-without-repeating-characters');
});

test('extractSlug - unsupported websites', () => {
  assert.strictEqual(extractSlug('https://github.com/problems/two-sum'), null);
  assert.strictEqual(extractSlug('https://hackerrank.com/challenges/two-sum'), null);
});

test('extractSlug - invalid URLs and edge cases', () => {
  assert.strictEqual(extractSlug('not-a-url'), null);
  assert.strictEqual(extractSlug(''), null);
  assert.strictEqual(extractSlug('   '), null);
  assert.strictEqual(extractSlug(null), null);
  assert.strictEqual(extractSlug(undefined), null);
  assert.strictEqual(extractSlug(123), null);
});

test('extractSlug - malformed or missing problem slugs', () => {
  assert.strictEqual(extractSlug('https://leetcode.com/'), null);
  assert.strictEqual(extractSlug('https://leetcode.com/problems/'), null);
  assert.strictEqual(extractSlug('https://leetcode.com/explore/'), null);
});

test('matcher - findAlternatives with non-existent slug', async () => {
  const result = await findAlternatives('non-existent-problem-slug-12345');
  assert.strictEqual(result, null);
});

test('matcher - findAlternatives with invalid inputs', async () => {
  assert.strictEqual(await findAlternatives(null), null);
  assert.strictEqual(await findAlternatives(''), null);
  assert.strictEqual(await findAlternatives('   '), null);
});

test('matcher - findAlternatives with valid multi-alternative slug', async () => {
  const result = await findAlternatives('two-sum');
  assert.notStrictEqual(result, null);
  assert.strictEqual(result.leetcode.title, 'Two Sum');
  assert.strictEqual(Array.isArray(result.alternatives), true);
  assert.strictEqual(result.alternatives.length, 2);
  assert.strictEqual(result.alternatives[0].platform, 'HackerRank');
});

test('matcher - findEquivalents backward compatibility', async () => {
  const result = await findEquivalents('two-sum');
  assert.notStrictEqual(result, null);
  assert.strictEqual(result.leetcode.title, 'Two Sum');
});
