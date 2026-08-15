import assert from 'assert';
import { executeTool, TOOL_CAPABILITY_REGISTRY } from '../services/toolExecutionEngine.js';

console.log('=== RUNNING COMPREHENSIVE 36-TOOL VALIDATION MATRIX & UNIVERSALITY TEST ===\n');

const PORTAL_36_TOOLS = [
  { id: 'f01', name: 'AI Stack DNA', capability: 'architecture_analysis', input: 'React SPA with Express backend and Postgres DB' },
  { id: 'f02', name: 'AI Migration Planner', capability: 'architecture_analysis', input: 'Migrate MongoDB to PostgreSQL' },
  { id: 'f03', name: 'AI Dependency Graph', capability: 'architecture_analysis', input: 'Next.js frontend with Vercel deployment' },
  { id: 'f04', name: 'AI Stack Risk Detector', capability: 'architecture_analysis', input: 'Single region AWS deployment' },
  { id: 'f05', name: 'AI Fallback Designer', capability: 'architecture_analysis', input: 'Primary OpenAI with Claude fallback' },
  { id: 'f06', name: 'AI Provider Health Monitor', capability: 'web_research', input: 'OpenAI Gemini Claude status' },
  { id: 'f07', name: 'AI Output Reliability Lab', capability: 'text_generation', input: 'Evaluate JSON output adherence' },
  { id: 'f08', name: 'AI Hallucination Detector', capability: 'web_research', input: 'Fact check quantum computing claim' },
  { id: 'f09', name: 'Source Quality Analyzer', capability: 'web_research', input: 'Evaluate MIT tech review article' },
  { id: 'f10', name: 'Citation Integrity Checker', capability: 'web_research', input: 'Audit research paper citations' },
  { id: 'f11', name: 'AI Knowledge Graph Builder', capability: 'architecture_analysis', input: 'Map vector DB to RAG pipeline' },
  { id: 'f12', name: 'AI Decision Tree Generator', capability: 'architecture_analysis', input: 'Choose between Supabase and Neon' },
  { id: 'f13', name: 'Architecture Decision Records', capability: 'architecture_analysis', input: 'ADR for microservices migration' },
  { id: 'f14', name: 'AI Research Reproduction', capability: 'code_generation', input: 'Reproduce LoRA fine-tuning script' },
  { id: 'f15', name: 'Research → Prototype', capability: 'code_generation', input: 'Prototype RAG retrieval pipeline' },
  { id: 'f16', name: 'AI MVP Generator', capability: 'architecture_analysis', input: 'MVP scope for AI image generator' },
  { id: 'f17', name: 'AI Engineering Backlog', capability: 'architecture_analysis', input: 'Generate epics for authentication' },
  { id: 'f18', name: 'Dependency-Aware Roadmap', capability: 'architecture_analysis', input: 'Order features for social app' },
  { id: 'f19', name: 'AI Codebase Evolution Planner', capability: 'code_generation', input: 'Plan TypeScript refactoring' },
  { id: 'f20', name: 'AI Technical Debt Scanner', capability: 'code_generation', input: 'Scan Express API for missing tests' },
  { id: 'f21', name: 'Technical Debt Simulator', capability: 'architecture_analysis', input: 'Simulate 12-month debt growth' },
  { id: 'f22', name: 'Architecture What-If Simulator', capability: 'architecture_analysis', input: 'Compare Serverless vs VPS cost' },
  { id: 'f23', name: 'Architecture Cost Simulator', capability: 'architecture_analysis', input: 'Estimate cost at 100k users' },
  { id: 'f24', name: 'Scalability Simulator', capability: 'architecture_analysis', input: 'Simulate 1M websocket connections' },
  { id: 'f25', name: 'AI Latency Optimizer', capability: 'architecture_analysis', input: 'Optimize TTFT for LLM streaming' },
  { id: 'f26', name: 'AI Token Optimizer', capability: 'text_generation', input: 'Compress prompt instructions' },
  { id: 'f27', name: 'Context Window Optimizer', capability: 'text_generation', input: 'Prune chat history to 4k tokens' },
  { id: 'f28', name: 'AI Permission Simulator', capability: 'architecture_analysis', input: 'Least privilege RBAC audit' },
  { id: 'f29', name: 'AI Agent Attack Simulator', capability: 'code_generation', input: 'Simulate prompt injection guard' },
  { id: 'f30', name: 'AI Red Team Lab', capability: 'code_generation', input: 'Adversarial red team test suite' },
  { id: 'f31', name: 'Why AI?', capability: 'architecture_analysis', input: 'Evaluate if recommendation needs AI' },
  { id: 'f32', name: 'AI vs Traditional Software', capability: 'architecture_analysis', input: 'Compare AI OCR vs Regex parsing' },
  { id: 'f33', name: 'AI Feature Necessity Analyzer', capability: 'architecture_analysis', input: 'Audit feature bloat in SaaS app' },
  { id: 'f34', name: 'AI Architecture Critic', capability: 'text_generation', input: 'Critique multi-cloud Kubernetes setup' },
  { id: 'f35', name: 'Senior Engineer Mode', capability: 'text_generation', input: 'Senior staff review of DB indexing' },
  { id: 'f36', name: 'Destroy My Architecture', capability: 'text_generation', input: 'Aggressive stress test of single DB node' }
];

async function runValidationMatrix() {
  const matrix = [];
  let passCount = 0;

  console.log('| Tool ID | Name | Capability | Input Tested | Expected Output | Status |');
  console.log('|---------|------|------------|--------------|-----------------|--------|');

  for (const t of PORTAL_36_TOOLS) {
    try {
      const res = await executeTool(t.id, t.input);
      const isSuccess = res.success === true && (res.data?.text || res.data?.imageUrl || res.data?.results || res.data?.code || res.data?.audioUrl || res.data?.nodes);
      const status = isSuccess ? 'PASS' : 'FAIL';
      if (isSuccess) passCount++;

      matrix.push({
        toolId: t.id,
        name: t.name,
        capability: t.capability,
        input: t.input.slice(0, 30),
        expected: t.capability.replace('_', ' '),
        status
      });

      console.log(`| ${t.id} | ${t.name} | ${t.capability} | ${t.input.slice(0, 20)}... | ${t.capability} | ${status} |`);
    } catch (err) {
      console.log(`| ${t.id} | ${t.name} | ${t.capability} | ${t.input.slice(0, 20)}... | Error | FAIL |`);
    }
  }

  console.log(`\nValidation Summary: ${passCount} / ${PORTAL_36_TOOLS.length} Portal Tools Passed (100% Functionality).\n`);
  assert.strictEqual(passCount, PORTAL_36_TOOLS.length, 'All 36 Portal tools MUST pass execution validation');

  // UNIVERSALITY TEST WITH A DYNAMIC CUSTOM TOOL ID
  console.log('--- RUNNING UNIVERSALITY TEST WITH DYNAMIC CUSTOM TOOL ---');
  const customToolId = `custom_test_tool_${Date.now()}`;
  const customInput = 'A futuristic neon AI ecosystem terminal';
  
  // Register dynamic custom tool capability on the fly
  TOOL_CAPABILITY_REGISTRY[customToolId] = {
    id: customToolId,
    name: 'Dynamic Custom Image Generator',
    capability: 'image_generation',
    provider: 'pollinations',
    outputType: 'image',
    requiredEnvVar: null
  };

  const customRes = await executeTool(customToolId, customInput);
  assert.strictEqual(customRes.success, true, 'Universal tool executor MUST execute new dynamic tool configurations without code changes');
  assert.strictEqual(customRes.type, 'image', 'Dynamic custom tool MUST produce image output');
  assert.strictEqual(typeof customRes.data.imageUrl, 'string', 'Dynamic tool MUST return valid image URL');
  console.log('✓ UNIVERSALITY TEST PASSED: Dynamic custom tool executed seamlessly via universal architecture!\n');
}

runValidationMatrix().then(() => {
  console.log('=== ALL 36-TOOL VALIDATION MATRIX & UNIVERSALITY TESTS PASSED! ===');
}).catch(err => {
  console.error('❌ Validation Matrix Failed:', err);
  process.exit(1);
});
