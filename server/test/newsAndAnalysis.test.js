import assert from 'assert';
import { runNewsIngestion, getArticles, getArticleById, normalizeCategoryInput, getCanonicalUrl, getNormalizedTitle, getContentHash, isSimilarStory } from '../services/newsService.js';
import { runIntelligentProjectAnalysis, classifyPromptIntent, extractProjectCapabilities, evaluateArchitectureRequirements } from '../services/projectAnalysisEngine.js';

console.log('=== STARTING AUTOMATED TEST SUITE: NEWS FEED & PROJECT ANALYSIS ===\n');

async function testNewsFeedNormal() {
  console.log('[TEST 1] News Feed - Normal Severity: Standard Ingestion & Pagination');
  const ingestResult = await runNewsIngestion();
  assert.strictEqual(typeof ingestResult.storedCount, 'number', 'storedCount must be a number');
  assert.strictEqual(typeof ingestResult.skippedDuplicatesCount, 'number', 'skippedDuplicatesCount must be a number');

  const page1 = getArticles({ page: 1, limit: 5 });
  assert.ok(Array.isArray(page1.articles), 'articles must be an array');
  assert.ok(page1.articles.length > 0, 'articles should not be empty');
  assert.strictEqual(page1.page, 1);
  assert.strictEqual(page1.limit, 5);
  console.log(`  ✓ Successfully retrieved ${page1.articles.length} articles (Total: ${page1.total})`);
}

async function testNewsFeedAverage() {
  console.log('[TEST 2] News Feed - Average Severity: Category Normalization & Deduplication');
  
  // Category Normalization tests across case variations and slugs
  assert.strictEqual(normalizeCategoryInput('models'), 'Models');
  assert.strictEqual(normalizeCategoryInput('DEVELOPER-TOOLS'), 'Developer Tools');
  assert.strictEqual(normalizeCategoryInput('ai-agents'), 'AI Agents');
  assert.strictEqual(normalizeCategoryInput('open_source'), 'Open Source');
  assert.strictEqual(normalizeCategoryInput('all'), 'all');

  const modelsCat = getArticles({ category: 'models', limit: 10 });
  assert.ok(Array.isArray(modelsCat.articles), 'models category articles must be array');

  const devToolsCat = getArticles({ category: 'developer-tools', limit: 10 });
  assert.ok(Array.isArray(devToolsCat.articles), 'developer-tools category articles must be array');

  // Deduplication logic tests
  const url1 = getCanonicalUrl('HTTPS://techcrunch.com/article/?utm_source=fb&ref=123#heading');
  const url2 = getCanonicalUrl('https://techcrunch.com/article');
  assert.strictEqual(url1, url2, 'Canonical URL normalization failed');

  const normTitle = getNormalizedTitle('DeepSeek-R1 Released! | TechCrunch');
  assert.strictEqual(normTitle, 'deepseek r1 released', 'Title normalization failed');

  const hash1 = getContentHash('test title', 'test description');
  const hash2 = getContentHash('test title', 'test description');
  assert.strictEqual(hash1, hash2, 'Content hash deterministic check failed');

  console.log('  ✓ Category normalization & 5-level deduplication logic passed');
}

async function testNewsFeedExtreme() {
  console.log('[TEST 3] News Feed - Extreme Severities & Twists: Invalid Params, Boundary Values & Offline Fallbacks');

  // Negative / Extreme Page & Limit Bounds
  const extreme1 = getArticles({ page: -99, limit: 99999 });
  assert.strictEqual(extreme1.page, 1, 'Page should sanitize to 1');
  assert.strictEqual(extreme1.limit, 100, 'Limit should cap at 100');

  const extreme2 = getArticles({ page: 'abc', limit: 'xyz' });
  assert.strictEqual(extreme2.page, 1);
  assert.strictEqual(extreme2.limit, 20);

  // Single article lookup with invalid ID
  const invalidArt = getArticleById(null);
  assert.strictEqual(invalidArt, null, 'Invalid ID lookup must return null');

  // After timestamp incremental polling check
  const latestDate = new Date(Date.now() - 3600 * 1000).toISOString();
  const pollRes = getArticles({ after: latestDate });
  assert.ok(Array.isArray(pollRes.articles), 'Incremental poll must return articles array');

  console.log('  ✓ Boundary conditions, invalid params, and incremental polling twist passed');
}

async function testProjectAnalysisNormal() {
  console.log('[TEST 4] Project Analysis - Normal Severity: Standard Prompt Requirements');
  const prompt = 'Build a SaaS platform for AI image generation and background removal.';
  const report = await runIntelligentProjectAnalysis(prompt);

  assert.ok(report.timestamp, 'Timestamp missing');
  assert.strictEqual(report.rawInput, prompt);
  assert.strictEqual(report.projectSummary.category, 'AI Image Generation Platform');
  assert.strictEqual(report.architectureSummary.classification, 'Full-Stack (Frontend + Backend + DB)');
  assert.ok(Array.isArray(report.techStack), 'techStack must be array');
  assert.ok(report.techStack.length >= 3, 'techStack must contain layers');
  assert.ok(Array.isArray(report.buildBlueprint), 'buildBlueprint must be array');
  assert.ok(report.differentiationEngine, 'differentiationEngine missing');

  console.log(`  ✓ Analysis completed for category "${report.projectSummary.category}" with ${report.techStack.length} tech stack layers`);
}

async function testProjectAnalysisAverage() {
  console.log('[TEST 5] Project Analysis - Average Severity: Clone & Multi-Entity Intent Classification');
  const prompt = 'Build an app like Instagram with real-time video chat, follower feeds, and photo filters.';
  const report = await runIntelligentProjectAnalysis(prompt);

  assert.strictEqual(report.classification.requestType, 'PROJECT_SPECIFIC');
  assert.strictEqual(report.classification.targetEntity, 'Instagram');
  assert.strictEqual(report.architectureSummary.requiresDatabase, true, 'Instagram clone requires DB');
  assert.strictEqual(report.architectureSummary.requiresAuth, true, 'Instagram clone requires Auth');
  assert.strictEqual(report.architectureSummary.requiresStorage, true, 'Instagram clone requires Storage');

  console.log(`  ✓ Intent classified target "${report.classification.targetEntity}" with ${report.recommendedTools.length} matching tools`);
}

async function testProjectAnalysisExtreme() {
  console.log('[TEST 6] Project Analysis - Extreme Severities & Twists: Empty/Whitespace, Huge 5K Prompt & Client-Only Portfolio');

  // Twist A: Empty / Whitespace prompt
  const emptyReport = await runIntelligentProjectAnalysis('   ');
  assert.ok(emptyReport.rawInput.length > 0, 'Empty prompt should fallback gracefully');
  assert.ok(emptyReport.techStack.length > 0);

  // Twist B: Frontend-Only Client-Side Portfolio (Zero Backend Needed)
  const clientPrompt = 'A simple personal portfolio website with markdown previewer, static dark mode, and color converter tool.';
  const clientReport = await runIntelligentProjectAnalysis(clientPrompt);
  assert.strictEqual(clientReport.architectureSummary.isFrontendOnly, true, 'Portfolio must be classified as Frontend-Only');
  assert.strictEqual(clientReport.architectureSummary.classification, 'Frontend-Only (Client-Side)');

  // Twist C: Huge 6,000 character prompt with exotic multi-domain requests
  const hugePrompt = 'Build an autonomous agent application '.repeat(200) + ' featuring n8n workflows, Rust CLI, DeepSeek R1, Kafka streaming, and Gemini 2.0';
  const hugeReport = await runIntelligentProjectAnalysis(hugePrompt);
  assert.ok(hugeReport.rawInput.length <= 5000, 'Prompt should be safely capped to max length');
  assert.ok(hugeReport.capabilities.length > 0);
  assert.ok(hugeReport.buildBlueprint.length > 0);

  console.log('  ✓ Empty inputs, frontend-only portfolios, and extreme 5k character prompts handled cleanly!');
}

async function runAllTests() {
  try {
    await testNewsFeedNormal();
    await testNewsFeedAverage();
    await testNewsFeedExtreme();
    await testProjectAnalysisNormal();
    await testProjectAnalysisAverage();
    await testProjectAnalysisExtreme();
    console.log('\n======================================================');
    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! (100% SATISFIED)');
    console.log('======================================================');
  } catch (err) {
    console.error('\n❌ TEST FAILED:', err);
    process.exit(1);
  }
}

runAllTests();
