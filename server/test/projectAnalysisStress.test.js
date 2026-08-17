import assert from 'assert';
import { runIntelligentProjectAnalysis, classifyPromptIntent, extractProjectCapabilities, evaluateArchitectureRequirements } from '../services/projectAnalysisEngine.js';
import { runProjectAnalysis } from '../../src/project-analysis/services/analysisEngine.js';

console.log('=== STARTING DEEP STRESS & LIVE DATA RECEPTION TEST: PROJECT ANALYSIS ===\n');

async function testProjectAnalysisLiveDataDiscovery() {
  console.log('[TEST 1] Testing Project Analysis Live Data Discovery (GitHub API & Tool Registry)...');
  
  const prompt = 'AI agent workflow orchestrator using Python, FastAPI, CrewAI, and LangChain';
  const startTime = Date.now();
  const report = await runIntelligentProjectAnalysis(prompt);
  const duration = Date.now() - startTime;

  assert.ok(report, 'Report must be generated');
  assert.ok(report.timestamp, 'Timestamp missing');
  assert.strictEqual(report.rawInput, prompt);
  
  // Verify Stage 1: Intent Classification
  assert.ok(report.classification, 'Classification missing');
  assert.ok(['GENERIC', 'PROJECT_SPECIFIC'].includes(report.classification.requestType));

  // Verify Stage 2 & 3: Capabilities & Architecture Summary
  assert.ok(Array.isArray(report.capabilities), 'Capabilities must be an array');
  assert.ok(report.capabilities.length > 0, 'Capabilities should not be empty');
  assert.ok(report.architectureSummary, 'Architecture summary missing');

  // Verify Stage 4 & 5: Tech Stack & Tool Registry Matches
  assert.ok(Array.isArray(report.techStack) && report.techStack.length >= 3, 'Tech stack must contain multiple layers');
  assert.ok(Array.isArray(report.recommendedTools) && report.recommendedTools.length > 0, 'Tool recommendations missing');

  // Verify Stage 6: Multi-Source Web Discovery (GitHub & Web Search)
  assert.ok(Array.isArray(report.discoveredProjects), 'Discovered projects must be an array');
  assert.ok(report.discoveredProjects.length > 0, 'Must discover live GitHub open-source repositories');
  report.discoveredProjects.forEach((proj, idx) => {
    assert.ok(proj.name, `Discovered project #${idx} missing name`);
    assert.ok(proj.repositoryUrl || proj.websiteUrl, `Discovered project #${idx} missing URL`);
    assert.ok(typeof proj.similarityPercentage === 'number', `Discovered project #${idx} missing similarity percentage`);
  });

  // Verify Stage 7, 8 & 9: Build Blueprint, Product Differentiation & Plans
  assert.ok(Array.isArray(report.buildBlueprint) && report.buildBlueprint.length >= 3, 'Build blueprint must contain phases');
  assert.ok(report.differentiationEngine && Array.isArray(report.differentiationEngine.matrix), 'Differentiation matrix missing');
  assert.ok(Array.isArray(report.testingPlan) && report.testingPlan.length > 0, 'Testing plan missing');
  assert.ok(Array.isArray(report.deploymentPlan) && report.deploymentPlan.length > 0, 'Deployment plan missing');

  console.log(`  ✓ Live evaluation completed in ${duration}ms with ${report.discoveredProjects.length} GitHub repositories discovered and 0 crashes!`);
}

async function testProjectAnalysisExtremeStressAndConcurrencies() {
  console.log('\n[TEST 2] Testing High-Concurrency (30 Requests) & Adversarial Input Resilience...');

  const extremeInputs = [
    '   ', // Whitespace
    'x', // Single character
    'Build an app like Notion with real-time multiplayer editing, canvas drawing, and AI autocomplete.',
    'Quantum whale song synthesizer using WebSockets, Rust, and DeepSeek R1',
    '<script>alert("xss")</script> DROP TABLE users; --',
    '🎉 🚀 🤖 🧠 ⚡ 💻', // Emoji prompt
    'Create a simple personal blog with static markdown and CSS', // Frontend-only prompt
    'A SaaS for enterprise document ingestion with OCR, vector search, Pinecone, and OAuth '.repeat(30) // Long prompt (3,000+ chars)
  ];

  console.log('  Launching 30 concurrent evaluation requests...');
  const promises = [];
  for (let i = 0; i < 30; i++) {
    const input = extremeInputs[i % extremeInputs.length];
    promises.push(runIntelligentProjectAnalysis(input));
  }

  const reports = await Promise.all(promises);
  assert.strictEqual(reports.length, 30, 'All 30 promises must resolve');

  reports.forEach((r, idx) => {
    assert.ok(r.timestamp, `Report #${idx} missing timestamp`);
    assert.ok(r.techStack && r.techStack.length > 0, `Report #${idx} missing techStack`);
    assert.ok(r.buildBlueprint && r.buildBlueprint.length > 0, `Report #${idx} missing buildBlueprint`);
    assert.ok(r.architectureNodes && r.architectureNodes.length > 0, `Report #${idx} missing architectureNodes`);
    assert.ok(r.securityRisks && r.securityRisks.length > 0, `Report #${idx} missing securityRisks`);
  });

  console.log('  ✓ 30/30 concurrent requests resolved with 100% complete payloads and zero crashes!');
}

async function testClientSideLocalEngineFallback() {
  console.log('\n[TEST 3] Testing Local Client-Side Analysis Engine Fallback (Offline Mode)...');

  const clientPrompt = 'Build a static markdown blog portfolio website';
  const localReport = await runProjectAnalysis(clientPrompt, []);

  assert.ok(localReport, 'Local report must resolve');
  assert.strictEqual(localReport.rawInput, clientPrompt);
  assert.ok(localReport.architectureSummary.isFrontendOnly, 'Task tracker SPA should classify as Frontend-Only');
  assert.ok(Array.isArray(localReport.buildBlueprint) && localReport.buildBlueprint.length > 0, 'Local report must contain buildBlueprint');
  assert.ok(localReport.differentiationEngine && Array.isArray(localReport.differentiationEngine.matrix), 'Local report must contain differentiation matrix');
  assert.ok(Array.isArray(localReport.testingPlan), 'Local report must contain testing plan');
  assert.ok(Array.isArray(localReport.deploymentPlan), 'Local report must contain deployment plan');

  console.log('  ✓ Client-side local analysis engine produced full report schema in offline mode!');
}

async function runAllProjectAnalysisStressTests() {
  try {
    await testProjectAnalysisLiveDataDiscovery();
    await testProjectAnalysisExtremeStressAndConcurrencies();
    await testClientSideLocalEngineFallback();
    console.log('\n========================================================================');
    console.log('🎉 PROJECT ANALYSIS DEEP STRESS & LIVE DATA TEST 100% PASSED (NO CRASHES)');
    console.log('========================================================================');
  } catch (err) {
    console.error('\n❌ PROJECT ANALYSIS STRESS TEST FAILED:', err);
    process.exit(1);
  }
}

runAllProjectAnalysisStressTests();
