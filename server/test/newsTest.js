import assert from 'assert';
import { getCanonicalUrl, getNormalizedTitle, getContentHash, isSimilarStory } from '../services/newsService.js';
import { getISTGreeting } from '../../src/utils/greeting.ts';

console.log('=== STARTING AUTOMATED UNIT TESTS ===\n');

// TEST 1: Tracking parameters canonicalization
console.log('Test 1: Canonical URL tracking parameter removal...');
const rawUrl1 = 'https://example.com/ai-article/123?utm_source=twitter&utm_medium=social&fbclid=XYZ123';
const rawUrl2 = 'https://example.com/ai-article/123';
const canonical1 = getCanonicalUrl(rawUrl1);
const canonical2 = getCanonicalUrl(rawUrl2);
assert.strictEqual(canonical1, 'https://example.com/ai-article/123');
assert.strictEqual(canonical1, canonical2);
console.log('✓ Passed Level 2 Canonical URL normalization.');

// TEST 2: Normalized Title
console.log('Test 2: Normalized title comparison...');
const titleA = 'OpenAI Launches a New AI Reasoning Model!';
const titleB = 'openai launches a new ai reasoning model';
const titleC = 'OpenAI Launches a New AI Reasoning Model | TechCrunch';
const normA = getNormalizedTitle(titleA);
const normB = getNormalizedTitle(titleB);
const normC = getNormalizedTitle(titleC);
assert.strictEqual(normA, normB);
assert.strictEqual(normA, normC);
console.log('✓ Passed Level 3 Normalized Title matching.');

// TEST 3: Content Fingerprint Hash
console.log('Test 3: Content Hash generation...');
const hash1 = getContentHash(normA, 'OpenAI announces o3 model family.');
const hash2 = getContentHash(normB, 'OpenAI announces o3 model family.');
assert.strictEqual(hash1, hash2);
console.log('✓ Passed Level 4 Content Hash generation.');

// TEST 4: Similar Story Detection
console.log('Test 4: Similar Story Headline Detection...');
const headline1 = getNormalizedTitle('DeepSeek releases new open reasoning model R1');
const existingHeadlines = [
  getNormalizedTitle('DeepSeek releases new open reasoning model R1')
];
const isDuplicate = isSimilarStory(headline1, existingHeadlines);
assert.strictEqual(isDuplicate, true);
console.log('✓ Passed Level 5 Similar Story Detection.');

// TEST 5: IST Greeting Time Boundaries
console.log('Test 5: IST Greeting Boundary Tests (Asia/Kolkata)...');

// Helper to construct a Date at a specific hour in UTC that corresponds to an IST hour
// IST is UTC + 5:30.
function createISTDate(hoursIST, minutesIST) {
  const d = new Date();
  // Adjust UTC time so that IST time matches hoursIST:minutesIST
  const totalISTMinutes = hoursIST * 60 + minutesIST;
  let totalUTCMinutes = totalISTMinutes - 330; // - 5h 30m
  if (totalUTCMinutes < 0) totalUTCMinutes += 24 * 60;
  
  const utcHours = Math.floor(totalUTCMinutes / 60) % 24;
  const utcMinutes = totalUTCMinutes % 60;
  
  // Set date string with explicit Kolkata timezone
  const dateStr = `2026-08-15T${String(utcHours).padStart(2, '0')}:${String(utcMinutes).padStart(2, '0')}:00Z`;
  return new Date(dateStr);
}

// 05:00 IST -> Good Morning
assert.strictEqual(getISTGreeting(createISTDate(5, 0)), 'Good Morning');
// 11:59 IST -> Good Morning
assert.strictEqual(getISTGreeting(createISTDate(11, 59)), 'Good Morning');

// 12:00 IST -> Good Afternoon
assert.strictEqual(getISTGreeting(createISTDate(12, 0)), 'Good Afternoon');
// 16:59 IST -> Good Afternoon
assert.strictEqual(getISTGreeting(createISTDate(16, 59)), 'Good Afternoon');

// 17:00 IST -> Good Evening
assert.strictEqual(getISTGreeting(createISTDate(17, 0)), 'Good Evening');
// 23:59 IST -> Good Evening
assert.strictEqual(getISTGreeting(createISTDate(23, 59)), 'Good Evening');

// 00:00 IST -> Good Evening
assert.strictEqual(getISTGreeting(createISTDate(0, 0)), 'Good Evening');
// 04:59 IST -> Good Evening
assert.strictEqual(getISTGreeting(createISTDate(4, 59)), 'Good Evening');

console.log('✓ Passed ALL IST Greeting boundary tests (05:00-11:59 Morning, 12:00-16:59 Afternoon, 17:00-04:59 Evening).');

console.log('\n=== ALL UNIT TESTS PASSED SUCCESSFULLY! ===');
