import assert from 'assert';
import { 
  classifyPromptIntent, 
  extractProjectCapabilities, 
  matchAndRankTools, 
  runIntelligentProjectAnalysis 
} from '../services/projectAnalysisEngine.js';

console.log('=== RUNNING FULL BLUEPRINT & DIFFERENTIATION ENGINE TEST SUITE ===\n');

async function runTests() {
  // TEST A: Portfolio Website (Generic, Frontend-Only, Dynamic Guides)
  console.log('TEST A: Generic Portfolio Prompt ("Build me a portfolio website.")');
  const rA = await runIntelligentProjectAnalysis('Build me a portfolio website.');
  assert.strictEqual(rA.classification.requestType, 'GENERIC');
  assert.strictEqual(rA.architectureSummary.isFrontendOnly, true);
  assert.strictEqual(rA.buildBlueprint.length > 0, true);
  assert.strictEqual(rA.buildBlueprint[0].guides.length > 0, true);
  console.log(`  Phases Generated: ${rA.buildBlueprint.length}`);
  console.log(`  Phase 1 Guide: ${rA.buildBlueprint[0].guides[0].title} (${rA.buildBlueprint[0].guides[0].url})`);
  console.log('✓ TEST A PASSED: Generated portfolio blueprint with dynamic guides.\n');

  // TEST B: AI Image Generation Platform (Multi-Phase Blueprint & Prompt Enhancement Differentiation)
  console.log('TEST B: AI Image Generation Prompt ("Build me an AI image generation website.")');
  const rB = await runIntelligentProjectAnalysis('Build me an AI image generation website.');
  assert.strictEqual(rB.capabilities.some(c => c.capability === 'image_generation'), true);
  assert.strictEqual(rB.buildBlueprint.some(p => p.title.includes('Image Generation')), true);
  assert.strictEqual(rB.differentiationEngine.differentiators.length > 0, true);
  console.log(`  Rank 1 Differentiator: ${rB.differentiationEngine.differentiators[0].title} (${rB.differentiationEngine.differentiators[0].impactLevel})`);
  console.log('✓ TEST B PASSED: Generated AI image platform blueprint & differentiation matrix.\n');

  // TEST C: Instagram Clone (Project Specific, GitHub Discovery, Feature Gap Analysis)
  console.log('TEST C: Instagram Clone Prompt ("Build me an app like Instagram.")');
  const rC = await runIntelligentProjectAnalysis('Build me an app like Instagram.');
  assert.strictEqual(rC.classification.requestType, 'PROJECT_SPECIFIC');
  assert.strictEqual(rC.classification.targetEntity, 'Instagram');
  assert.strictEqual(rC.discoveredProjects.length > 0, true);
  assert.strictEqual(rC.differentiationEngine.matrix.length > 0, true);
  console.log(`  Discovered ${rC.discoveredProjects.length} real GitHub repos (Top: ${rC.discoveredProjects[0].name})`);
  console.log(`  Feature Matrix Items: ${rC.differentiationEngine.matrix.length}`);
  console.log('✓ TEST C PASSED: Discovered real repos, evaluated feature gaps, and constructed differentiation strategy.\n');

  // TEST D: AI Voice Platform (Text-to-Speech Blueprint & Dedicated Voice Tools)
  console.log('TEST D: AI Voice Platform Prompt ("Build me an AI voice generation platform.")');
  const rD = await runIntelligentProjectAnalysis('Build me an AI voice generation platform.');
  assert.strictEqual(rD.recommendedTools[0].satisfiedCapabilities.some(c => c.includes('Voice') || c.includes('Speech')), true);
  console.log(`  Top Recommended Voice Tool: ${rD.recommendedTools[0].name} (${rD.recommendedTools[0].relevanceScore}%)`);
  console.log('✓ TEST D PASSED: Recommended dedicated voice tools & build procedure.\n');

  // TEST E: Automation Platform (n8n / Zapier Workflow Engine)
  console.log('TEST E: Workflow Automation Prompt ("Build an automated workflow tool using webhooks.")');
  const rE = await runIntelligentProjectAnalysis('Build an automated workflow tool using webhooks.');
  assert.strictEqual(rE.recommendedTools.some(t => t.name.includes('n8n') || t.name.includes('Zapier') || t.name.includes('Make')), true);
  console.log(`  Top Recommended Automation Tool: ${rE.recommendedTools[0].name}`);
  console.log('✓ TEST E PASSED: Recommended dedicated workflow automation tools.\n');
}

runTests().then(() => {
  console.log('\n=== ALL FULL BLUEPRINT & DIFFERENTIATION ENGINE TESTS PASSED! ===');
}).catch(err => {
  console.error('\n❌ Test Execution Failed:', err);
  process.exit(1);
});
