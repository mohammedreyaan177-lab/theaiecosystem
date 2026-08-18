/**
 * ============================================================
 *  PROJECT ANALYSIS FEATURE — COMPREHENSIVE TEST SUITE
 *  Tests: 9-Stage Pipeline, Project Resemblance Engine,
 *         Recommended Tools Matching, Tool Registry, API Route
 * ============================================================
 */

import {
  classifyPromptIntent,
  extractProjectCapabilities,
  evaluateArchitectureRequirements,
  generateDynamicTechStack,
  matchAndRankTools,
  discoverWebProjects,
  runIntelligentProjectAnalysis,
} from './services/projectAnalysisEngine.js';

import { getToolRegistry } from './services/toolRegistry.js';

// ── Tiny test runner ─────────────────────────────────────────
let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, label) {
  if (condition) {
    console.log(`  ✅  ${label}`);
    passed++;
  } else {
    console.error(`  ❌  FAIL: ${label}`);
    failed++;
    failures.push(label);
  }
}

function section(title) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  📋  ${title}`);
  console.log('═'.repeat(60));
}

function sub(title) {
  console.log(`\n  ── ${title} ──`);
}

// ── Shared test-data ─────────────────────────────────────────
const TEST_PROMPTS = [
  { label: 'Instagram Clone',     prompt: 'Build a social media app like Instagram with photo feeds and stories' },
  { label: 'GitHub Clone',        prompt: 'I want to create an app like GitHub for code hosting and collaboration' },
  { label: 'Notion Clone',        prompt: 'Build a productivity workspace similar to Notion with pages and databases' },
  { label: 'Slack Clone',         prompt: 'Create a team messaging platform like Slack with channels and DMs' },
  { label: 'Zapier Alternative',  prompt: 'Build an automation workflow platform like Zapier' },
  { label: 'Automation Platform', prompt: 'AI-powered workflow automation tool with n8n-style triggers and webhooks' },
  { label: 'Image Generator',     prompt: 'Create an AI image generation platform using DALL-E and Midjourney' },
  { label: 'Voice App',           prompt: 'Build a voice cloning and text-to-speech app using ElevenLabs' },
  { label: 'E-commerce Store',    prompt: 'Build an ecommerce store with cart, checkout and product catalog' },
  { label: 'Data Analytics',      prompt: 'An AI analytics dashboard for CSV and Excel data with charts and predictions' },
  { label: 'Coding Assistant',    prompt: 'Build a Cursor IDE alternative with AI code completion and codebase indexing' },
  { label: 'Portfolio Website',   prompt: 'Create a personal portfolio website with project showcase' },
  { label: 'RAG / PDF Chat',      prompt: 'Build a document chatbot that can search PDFs using vector embeddings and RAG' },
  { label: 'Chat / LLM App',      prompt: 'A conversational AI assistant with GPT and Claude integration' },
  { label: 'Generic (fallback)',  prompt: 'A general web application platform' },
];

// ═══════════════════════════════════════════════════════════
//  STAGE 1 — Semantic Intent Classification
// ═══════════════════════════════════════════════════════════
section('STAGE 1 — classifyPromptIntent()');

sub('Known product detection');
const igResult = classifyPromptIntent('Build a social media app like Instagram');
assert(igResult.requestType === 'PROJECT_SPECIFIC', 'Instagram: requestType is PROJECT_SPECIFIC');
assert(igResult.targetEntity === 'Instagram',       'Instagram: targetEntity = "Instagram"');
assert(igResult.confidence >= 0.8,                  'Instagram: confidence >= 0.8');
assert(typeof igResult.reason === 'string' && igResult.reason.length > 0, 'Instagram: reason string present');

const zapRes = classifyPromptIntent('workflow automation platform like Zapier');
assert(zapRes.requestType === 'PROJECT_SPECIFIC', 'Zapier: detected as PROJECT_SPECIFIC');
assert(zapRes.targetEntity === 'Zapier',          'Zapier: targetEntity correct');

const n8nRes = classifyPromptIntent('Build an n8n-style agent workflow manager');
assert(n8nRes.requestType === 'PROJECT_SPECIFIC', 'n8n: detected as PROJECT_SPECIFIC');
assert(n8nRes.targetEntity === 'n8n',             'n8n: targetEntity = n8n');

const discordRes = classifyPromptIntent('Gaming chat app like Discord');
assert(discordRes.requestType === 'PROJECT_SPECIFIC', 'Discord: PROJECT_SPECIFIC');

sub('Clone phrase detection');
const cloneRes = classifyPromptIntent('A system like Linear for issue tracking');
assert(cloneRes.requestType === 'PROJECT_SPECIFIC', 'Clone phrase "like": PROJECT_SPECIFIC');
assert(cloneRes.confidence >= 0.8,                  'Clone phrase confidence >= 0.8');

const replicaRes = classifyPromptIntent('replica of Asana for project management');
assert(replicaRes.requestType === 'PROJECT_SPECIFIC', '"replica of" phrase detected');

sub('Generic category detection');
const portfolioRes = classifyPromptIntent('Create a personal portfolio website');
assert(portfolioRes.requestType === 'GENERIC',           'Portfolio: GENERIC requestType');
assert(portfolioRes.projectType === 'portfolio_website', 'Portfolio: projectType = portfolio_website');

const automationRes = classifyPromptIntent('Build an automation platform with webhook triggers');
assert(automationRes.requestType === 'GENERIC',                      'Automation: GENERIC');
assert(automationRes.projectType === 'workflow_automation_platform', 'Automation: correct projectType');

const weatherRes = classifyPromptIntent('A weather forecast web app');
assert(weatherRes.projectType === 'weather_application', 'Weather: projectType = weather_application');

const analyticsRes = classifyPromptIntent('Data analytics dashboard with charts and metrics');
assert(analyticsRes.projectType === 'data_analytics_platform', 'Analytics: data_analytics_platform');

const ecomRes = classifyPromptIntent('Online store with shopping cart');
assert(ecomRes.projectType === 'ecommerce_store', 'Ecommerce: ecommerce_store');

sub('Structure / field validation for all prompts');
for (const { label, prompt } of TEST_PROMPTS) {
  const r = classifyPromptIntent(prompt);
  assert(typeof r.requestType === 'string',               `[${label}] requestType is string`);
  assert(typeof r.confidence === 'number',                `[${label}] confidence is number`);
  assert(r.confidence >= 0 && r.confidence <= 1,         `[${label}] confidence in [0,1]`);
  assert(typeof r.projectType === 'string',              `[${label}] projectType string present`);
  assert(typeof r.reason === 'string',                   `[${label}] reason string present`);
}

// ═══════════════════════════════════════════════════════════
//  STAGE 2 — Capability Extraction
// ═══════════════════════════════════════════════════════════
section('STAGE 2 — extractProjectCapabilities()');

sub('Automation prompt → automation caps');
const autoCls  = classifyPromptIntent('automation tool with n8n triggers');
const autoCaps = extractProjectCapabilities('automation tool with n8n triggers', autoCls);
const autoIds  = autoCaps.map(c => c.capability);
assert(autoIds.includes('automation'),          'Automation: "automation" capability extracted');
assert(autoIds.includes('workflow_automation'), 'Automation: "workflow_automation" extracted');
assert(autoCaps.every(c => ['Essential','Recommended','Optional'].includes(c.importance)), 'Automation: all importances valid');

sub('Image prompt → image caps');
const imgCls  = classifyPromptIntent('AI image generation platform DALL-E Midjourney');
const imgCaps = extractProjectCapabilities('AI image generation platform DALL-E Midjourney', imgCls);
const imgIds  = imgCaps.map(c => c.capability);
assert(imgIds.includes('image_generation'), 'Image: image_generation extracted');
assert(imgIds.includes('text_to_image'),    'Image: text_to_image extracted');

sub('Voice prompt → voice caps');
const voiceCls  = classifyPromptIntent('voice cloning app ElevenLabs text to speech');
const voiceCaps = extractProjectCapabilities('voice cloning app ElevenLabs text to speech', voiceCls);
const voiceIds  = voiceCaps.map(c => c.capability);
assert(voiceIds.includes('voice_generation'), 'Voice: voice_generation extracted');
assert(voiceIds.includes('text_to_speech'),   'Voice: text_to_speech extracted');

sub('Coding prompt → coding caps');
const codeCls  = classifyPromptIntent('AI code assistant with IDE integration and github');
const codeCaps = extractProjectCapabilities('AI code assistant with IDE integration and github', codeCls);
const codeIds  = codeCaps.map(c => c.capability);
assert(codeIds.includes('coding_assistance'), 'Coding: coding_assistance extracted');
assert(codeIds.includes('developer_tools'),   'Coding: developer_tools extracted');

sub('RAG / vector search caps');
const ragCls  = classifyPromptIntent('PDF chatbot using vector embeddings pinecone RAG');
const ragCaps = extractProjectCapabilities('PDF chatbot using vector embeddings pinecone RAG', ragCls);
assert(ragCaps.map(c => c.capability).includes('vector_search'), 'RAG: vector_search extracted');

sub('Social / Instagram → auth + feed caps');
const socialCls  = classifyPromptIntent('Build a social media app like Instagram with photo feeds');
const socialCaps = extractProjectCapabilities('Build a social media app like Instagram with photo feeds', socialCls);
const socialIds  = socialCaps.map(c => c.capability);
assert(socialIds.includes('user_authentication'), 'Social: user_authentication extracted');
assert(socialIds.includes('social_feed'),         'Social: social_feed extracted');
assert(socialIds.includes('database'),            'Social: database extracted');

sub('Fallback → defaults when no known caps');
const genericCls  = classifyPromptIntent('An innovative digital platform');
const genericCaps = extractProjectCapabilities('An innovative digital platform', genericCls);
assert(genericCaps.length > 0, 'Generic: fallback caps returned (non-empty)');

sub('Structure per capability for all prompts');
for (const { label, prompt } of TEST_PROMPTS) {
  const cls  = classifyPromptIntent(prompt);
  const caps = extractProjectCapabilities(prompt, cls);
  assert(Array.isArray(caps), `[${label}] caps is array`);
  for (const c of caps) {
    assert(typeof c.capability === 'string' && c.capability.length > 0, `[${label}] capability.capability string`);
    assert(typeof c.name === 'string',       `[${label}] capability.name string`);
    assert(typeof c.importance === 'string', `[${label}] capability.importance string`);
    assert(typeof c.reason === 'string',     `[${label}] capability.reason string`);
  }
}

// ═══════════════════════════════════════════════════════════
//  STAGE 3 — Architecture Assessment
// ═══════════════════════════════════════════════════════════
section('STAGE 3 — evaluateArchitectureRequirements()');

sub('Portfolio → Frontend-Only');
const portfolioCls2  = classifyPromptIntent('Create a personal portfolio website');
const portfolioCaps2 = extractProjectCapabilities('Create a personal portfolio website', portfolioCls2);
const portfolioArch  = evaluateArchitectureRequirements('Create a personal portfolio website', portfolioCls2, portfolioCaps2);
assert(portfolioArch.isFrontendOnly === true,                        'Portfolio: isFrontendOnly = true');
assert(portfolioArch.requiresBackend === false,                      'Portfolio: requiresBackend = false');
assert(portfolioArch.requiresDatabase === false,                     'Portfolio: requiresDatabase = false');
assert(portfolioArch.classification.includes('Frontend-Only'),       'Portfolio: classification = Frontend-Only');

sub('Full social/clone → Full-Stack');
const instaCls2  = classifyPromptIntent('Build a social media app like Instagram');
const instaCaps2 = extractProjectCapabilities('Build a social media app like Instagram', instaCls2);
const instaArch  = evaluateArchitectureRequirements('Build a social media app like Instagram', instaCls2, instaCaps2);
assert(instaArch.isFrontendOnly === false,  'Instagram: NOT frontend-only');
assert(instaArch.requiresBackend === true,  'Instagram: requiresBackend = true');
assert(instaArch.requiresDatabase === true, 'Instagram: requiresDatabase = true');
assert(instaArch.requiresStorage === true,  'Instagram: requiresStorage = true (media uploads)');

sub('Image generator → Serverless arch (no DB)');
const imgGenCls  = classifyPromptIntent('AI image generator tool');
const imgGenCaps = extractProjectCapabilities('AI image generator tool', imgGenCls);
const imgGenArch = evaluateArchitectureRequirements('AI image generator tool', imgGenCls, imgGenCaps);
assert(!imgGenArch.requiresDatabase, 'Image generator: no DB required');
assert(imgGenArch.requiresBackend,   'Image generator: requires backend (API proxy)');

sub('Ecommerce → Full-Stack');
const ecomCls2  = classifyPromptIntent('Build an ecommerce store with cart and checkout');
const ecomCaps2 = extractProjectCapabilities('Build an ecommerce store with cart and checkout', ecomCls2);
const ecomArch  = evaluateArchitectureRequirements('Build an ecommerce store with cart and checkout', ecomCls2, ecomCaps2);
assert(ecomArch.requiresBackend  === true, 'Ecommerce: requiresBackend');
assert(ecomArch.requiresDatabase === true, 'Ecommerce: requiresDatabase');

sub('Arch structure for all prompts');
for (const { label, prompt } of TEST_PROMPTS) {
  const cls  = classifyPromptIntent(prompt);
  const caps = extractProjectCapabilities(prompt, cls);
  const arch = evaluateArchitectureRequirements(prompt, cls, caps);
  assert(typeof arch.classification === 'string',   `[${label}] arch.classification string`);
  assert(typeof arch.isFrontendOnly === 'boolean',  `[${label}] arch.isFrontendOnly boolean`);
  assert(typeof arch.requiresBackend === 'boolean', `[${label}] arch.requiresBackend boolean`);
  assert(typeof arch.requiresDatabase === 'boolean',`[${label}] arch.requiresDatabase boolean`);
  assert(typeof arch.requiresStorage === 'boolean', `[${label}] arch.requiresStorage boolean`);
  assert(typeof arch.requiresAuth === 'boolean',    `[${label}] arch.requiresAuth boolean`);
  assert(typeof arch.reasoning === 'string' && arch.reasoning.length > 0, `[${label}] arch.reasoning string`);
}

// ═══════════════════════════════════════════════════════════
//  STAGE 4 — Dynamic Tech Stack
// ═══════════════════════════════════════════════════════════
section('STAGE 4 — generateDynamicTechStack()');

sub('Frontend-Only arch → static hosting, no backend needed');
const foArch = { isFrontendOnly: true, requiresBackend: false, requiresDatabase: false, requiresStorage: false, requiresAuth: false, classification: 'Frontend-Only (Client-Side)', reasoning: '' };
const foStack = generateDynamicTechStack(foArch);
assert(Array.isArray(foStack) && foStack.length > 0, 'FrontendOnly: returns stacks');
assert(foStack.some(s => s.layer === 'Frontend'),    'FrontendOnly: has Frontend layer');
assert(foStack.some(s => s.recommendation.toLowerCase().includes('not required') || s.recommendation.toLowerCase().includes('static')), 'FrontendOnly: backend layer says Not Required or Static');

sub('Serverless arch → lightweight backend');
const slArch = { isFrontendOnly: false, requiresBackend: true, requiresDatabase: false, requiresStorage: false, requiresAuth: false, classification: 'Frontend + API Proxy / Serverless', reasoning: '' };
const slStack = generateDynamicTechStack(slArch);
assert(slStack.some(s => s.layer === 'Backend' && (s.recommendation.includes('Serverless') || s.recommendation.includes('serverless') || s.recommendation.includes('Vercel'))), 'Serverless: Backend layer mentions Serverless/Vercel');

sub('Full-Stack arch → all 4 layers present');
const fsArch = { isFrontendOnly: false, requiresBackend: true, requiresDatabase: true, requiresStorage: true, requiresAuth: true, classification: 'Full-Stack (Frontend + Backend + DB)', reasoning: '' };
const fsStack = generateDynamicTechStack(fsArch);
const fsLayers = fsStack.map(s => s.layer);
assert(fsLayers.includes('Frontend'),  'FullStack: Frontend layer present');
assert(fsLayers.includes('Backend'),   'FullStack: Backend layer present');
assert(fsLayers.includes('Database'),  'FullStack: Database layer present');
assert(fsLayers.includes('Storage'),   'FullStack: Storage layer present');

sub('Stack item fields for all prompts');
for (const { label, prompt } of TEST_PROMPTS) {
  const cls   = classifyPromptIntent(prompt);
  const caps  = extractProjectCapabilities(prompt, cls);
  const arch  = evaluateArchitectureRequirements(prompt, cls, caps);
  const stack = generateDynamicTechStack(arch);
  assert(Array.isArray(stack) && stack.length > 0, `[${label}] stack is non-empty array`);
  for (const item of stack) {
    assert(typeof item.layer === 'string',           `[${label}] stack.layer string`);
    assert(typeof item.recommendation === 'string',  `[${label}] stack.recommendation string`);
    assert(typeof item.reason === 'string',          `[${label}] stack.reason string`);
    assert(Array.isArray(item.advantages),           `[${label}] advantages is array`);
    assert(Array.isArray(item.disadvantages),        `[${label}] disadvantages is array`);
    assert(typeof item.alternative === 'string',     `[${label}] alternative string`);
  }
}

// ═══════════════════════════════════════════════════════════
//  STAGE 5 — Tool Matching & Recommended Tools
// ═══════════════════════════════════════════════════════════
section('STAGE 5 — matchAndRankTools() + getToolRegistry()');

const registry = getToolRegistry();

sub('Tool Registry: structure integrity');
assert(Array.isArray(registry) && registry.length > 0, 'Registry: non-empty array');
assert(registry.length >= 10, `Registry: at least 10 tools (got ${registry.length})`);
for (const tool of registry) {
  assert(typeof tool.id === 'string' && tool.id.length > 0,       `[${tool.id}] id string`);
  assert(typeof tool.name === 'string' && tool.name.length > 0,   `[${tool.id}] name string`);
  assert(Array.isArray(tool.capabilities),                        `[${tool.id}] capabilities array`);
  assert(typeof tool.category === 'string',                       `[${tool.id}] category string`);
  assert(typeof tool.pricingLabel === 'string',                   `[${tool.id}] pricingLabel string`);
  assert(typeof tool.officialUrl === 'string',                    `[${tool.id}] officialUrl string`);
}

sub('Registry: No duplicate tool IDs');
const idSet = new Set(registry.map(t => t.id));
assert(idSet.size === registry.length, `Registry: ${registry.length} tools, all unique IDs`);

sub('Tool Matching: automation prompt → n8n/Zapier boosted');
const autoCls2  = classifyPromptIntent('workflow automation with n8n and zapier triggers');
const autoCaps2 = extractProjectCapabilities('workflow automation with n8n and zapier triggers', autoCls2);
const autoTools = matchAndRankTools(autoCaps2, registry);
assert(Array.isArray(autoTools),    'Automation: returns array');
assert(autoTools.length > 0,       'Automation: at least 1 tool recommended');
assert(autoTools.length <= 8,      'Automation: max 8 tools returned');
const hasAutoTool = autoTools.some(t => {
  const n = t.name.toLowerCase();
  return n.includes('n8n') || n.includes('zapier') || n.includes('make') || n.includes('crewai');
});
assert(hasAutoTool, 'Automation: an automation tool (n8n/Zapier/Make/CrewAI) is included');

sub('Tool Matching: relevance scores in range [50, 99]');
for (const tool of autoTools) {
  assert(tool.relevanceScore >= 50 && tool.relevanceScore <= 99,
    `[${tool.name}] relevanceScore in [50,99] (got ${tool.relevanceScore})`);
}

sub('Tool Matching: image prompt → DALL-E / Midjourney boosted');
const imgCls2  = classifyPromptIntent('AI image generation DALL-E Midjourney Flux');
const imgCaps2 = extractProjectCapabilities('AI image generation DALL-E Midjourney Flux', imgCls2);
const imgTools = matchAndRankTools(imgCaps2, registry);
const hasImgTool = imgTools.some(t => {
  const n = t.name.toLowerCase();
  return n.includes('dall') || n.includes('midjourney') || n.includes('flux') || n.includes('stable');
});
assert(hasImgTool, 'Image: an image-gen tool is included in recommendations');

sub('Tool Matching: generic LLMs penalised for specialised (automation) prompts');
const llmEntry = autoTools.find(t => t.toolId === 'chatgpt' || t.toolId === 'claude' || t.toolId === 'gemini');
if (llmEntry) {
  assert(llmEntry.relevanceScore < 80, `Automation: generic LLM penalised, score=${llmEntry.relevanceScore} < 80`);
}

sub('Tool Matching: required fields on each result for all prompts');
for (const { label, prompt } of TEST_PROMPTS) {
  const cls   = classifyPromptIntent(prompt);
  const caps  = extractProjectCapabilities(prompt, cls);
  const tools = matchAndRankTools(caps, registry);
  for (const t of tools) {
    assert(typeof t.toolId === 'string',             `[${label}] toolId string`);
    assert(typeof t.name === 'string',               `[${label}] name string`);
    assert(typeof t.company === 'string',            `[${label}] company string`);
    assert(typeof t.relevanceScore === 'number',     `[${label}] relevanceScore number`);
    assert(typeof t.whyMatches === 'string' && t.whyMatches.length > 0, `[${label}] whyMatches string`);
    assert(Array.isArray(t.satisfiedCapabilities),   `[${label}] satisfiedCapabilities array`);
    assert(t.satisfiedCapabilities.length > 0,       `[${label}] at least 1 satisfied capability`);
  }
}

sub('Tool Matching: sorted descending by relevanceScore for all prompts');
for (const { label, prompt } of TEST_PROMPTS) {
  const cls   = classifyPromptIntent(prompt);
  const caps  = extractProjectCapabilities(prompt, cls);
  const tools = matchAndRankTools(caps, registry);
  for (let i = 0; i < tools.length - 1; i++) {
    assert(tools[i].relevanceScore >= tools[i + 1].relevanceScore,
      `[${label}] tools sorted desc at position ${i}`);
  }
}

// ═══════════════════════════════════════════════════════════
//  STAGE 6 — Project Resemblance / Web Discovery Engine
// ═══════════════════════════════════════════════════════════
section('STAGE 6 — discoverWebProjects() (Resemblance Engine)');

sub('Instagram clone → projects discovered');
const igCls2  = classifyPromptIntent('Build a social media app like Instagram');
const igCaps2 = extractProjectCapabilities('Build a social media app like Instagram', igCls2);
const igProjects = await discoverWebProjects(igCls2.targetEntity, igCls2, igCaps2);
assert(Array.isArray(igProjects),  'Instagram: returns array');
assert(igProjects.length > 0,     'Instagram: at least 1 project discovered');
assert(igProjects.length <= 5,    'Instagram: max 5 projects (slice enforced)');

sub('Resemblance: similarity scores in range [50, 100]');
for (const proj of igProjects) {
  assert(proj.similarityPercentage >= 50 && proj.similarityPercentage <= 100,
    `[${proj.name}] similarityPercentage in [50,100] (got ${proj.similarityPercentage})`);
}

sub('Resemblance: sorted descending by similarityPercentage');
for (let i = 0; i < igProjects.length - 1; i++) {
  assert(igProjects[i].similarityPercentage >= igProjects[i + 1].similarityPercentage,
    `Projects sorted desc at index ${i}`);
}

sub('Resemblance: required fields on each project');
for (const proj of igProjects) {
  assert(typeof proj.name === 'string' && proj.name.length > 0,             `[${proj.name}] name string`);
  assert(typeof proj.websiteUrl === 'string' && proj.websiteUrl.length > 0, `[${proj.name}] websiteUrl string`);
  assert(typeof proj.repositoryUrl === 'string',                            `[${proj.name}] repositoryUrl string`);
  assert(typeof proj.similarityPercentage === 'number',                     `[${proj.name}] similarityPercentage number`);
  assert(['Very High','High','Medium','Low'].includes(proj.similarityLevel),`[${proj.name}] valid similarityLevel (${proj.similarityLevel})`);
  assert(Array.isArray(proj.whySimilar) && proj.whySimilar.length > 0,     `[${proj.name}] whySimilar non-empty array`);
  assert(Array.isArray(proj.majorDifferences),                              `[${proj.name}] majorDifferences array`);
  assert(Array.isArray(proj.relevantFeatures),                              `[${proj.name}] relevantFeatures array`);
  assert(typeof proj.source === 'string',                                   `[${proj.name}] source string`);
}

sub('Resemblance: similarityLevel matches percentage bracket');
for (const proj of igProjects) {
  if (proj.similarityPercentage >= 90) {
    assert(proj.similarityLevel === 'Very High',
      `[${proj.name}] >=90% → Very High (got ${proj.similarityLevel})`);
  } else if (proj.similarityPercentage >= 75) {
    assert(proj.similarityLevel === 'High',
      `[${proj.name}] >=75% → High (got ${proj.similarityLevel})`);
  } else {
    assert(['Medium','Low'].includes(proj.similarityLevel),
      `[${proj.name}] <75% → Medium/Low (got ${proj.similarityLevel})`);
  }
}

sub('Resemblance: fallback for generic/unknown prompt (never empty)');
const genCls2  = classifyPromptIntent('An extremely unique bespoke enterprise data orchestration platform');
const genCaps2 = extractProjectCapabilities('An extremely unique bespoke enterprise data orchestration platform', genCls2);
const genProjects = await discoverWebProjects(null, genCls2, genCaps2);
assert(Array.isArray(genProjects) && genProjects.length > 0, 'Generic: fallback projects returned (never empty)');

sub('Resemblance: no duplicate repositoryUrls');
const dupCheck = [...igProjects];
const dupUrls = new Set(dupCheck.map(p => p.repositoryUrl));
assert(dupUrls.size === dupCheck.length, 'Instagram projects: no duplicate repositoryUrls');

sub('Resemblance: GitHub-discovered projects have valid URLs');
for (const proj of igProjects) {
  if (proj.source === 'GitHub Search Engine') {
    assert(proj.repositoryUrl.startsWith('https://'), `[${proj.name}] GitHub URL starts with https://`);
    assert(proj.repositoryUrl.includes('github.com'), `[${proj.name}] GitHub URL contains github.com`);
  }
}

// ═══════════════════════════════════════════════════════════
//  FULL PIPELINE — runIntelligentProjectAnalysis()
// ═══════════════════════════════════════════════════════════
section('FULL PIPELINE — runIntelligentProjectAnalysis()');

const FULL_TEST_PROMPTS = [
  'Build a social media app like Instagram with photo sharing and stories',
  'AI-powered workflow automation tool with n8n-style triggers and webhooks',
  'Create a voice cloning app using ElevenLabs with real-time TTS playback',
  'Build an ecommerce marketplace with AI product recommendations and cart',
  'A personal portfolio website with project showcase and contact form',
  'AI coding assistant like Cursor with multi-file editing and codebase indexing',
];

for (const prompt of FULL_TEST_PROMPTS) {
  const label = prompt.slice(0, 45) + '...';
  sub(`Pipeline: "${label}"`);

  const report = await runIntelligentProjectAnalysis(prompt);

  assert(typeof report === 'object' && report !== null, `[${label}] returns object`);
  assert(typeof report.timestamp === 'string',         `[${label}] timestamp present`);
  assert(typeof report.rawInput === 'string',          `[${label}] rawInput present`);

  // Stage 1
  assert(report.classification !== undefined,          `[${label}] classification present`);
  assert(['GENERIC','PROJECT_SPECIFIC'].includes(report.classification.requestType),
    `[${label}] valid requestType`);

  // Stage 2
  assert(Array.isArray(report.capabilities) && report.capabilities.length > 0,
    `[${label}] capabilities non-empty`);

  // Stage 3
  assert(report.architectureSummary !== undefined,     `[${label}] architectureSummary present`);
  assert(typeof report.architectureSummary.isFrontendOnly === 'boolean',
    `[${label}] isFrontendOnly boolean`);

  // Stage 4
  assert(Array.isArray(report.techStack) && report.techStack.length > 0,
    `[${label}] techStack non-empty`);

  // Stage 5 recommended tools
  assert(Array.isArray(report.recommendedTools),       `[${label}] recommendedTools is array`);
  if (report.recommendedTools.length > 1) {
    assert(report.recommendedTools[0].relevanceScore >= report.recommendedTools[report.recommendedTools.length - 1].relevanceScore,
      `[${label}] recommendedTools sorted desc`);
  }

  // Stage 6 discovered projects / resemblance
  assert(Array.isArray(report.discoveredProjects),     `[${label}] discoveredProjects is array`);
  assert(report.discoveredProjects.length > 0,        `[${label}] at least 1 discovered project`);
  assert(typeof report.webDiscoveryStatus === 'string',`[${label}] webDiscoveryStatus string`);
  assert(['completed','fallback_no_results','failed'].includes(report.webDiscoveryStatus),
    `[${label}] valid webDiscoveryStatus: ${report.webDiscoveryStatus}`);

  // Stage 7
  assert(report.buildBlueprint !== undefined,          `[${label}] buildBlueprint present`);

  // Stage 8
  assert(report.differentiationEngine !== undefined,   `[${label}] differentiationEngine present`);

  // Stage 9
  assert(Array.isArray(report.testingPlan) && report.testingPlan.length > 0,
    `[${label}] testingPlan non-empty`);
  assert(Array.isArray(report.deploymentPlan) && report.deploymentPlan.length > 0,
    `[${label}] deploymentPlan non-empty`);

  // Architecture nodes
  assert(Array.isArray(report.architectureNodes) && report.architectureNodes.length > 0,
    `[${label}] architectureNodes non-empty`);

  // Security risks
  assert(Array.isArray(report.securityRisks) && report.securityRisks.length > 0,
    `[${label}] securityRisks non-empty`);

  // Project summary
  assert(report.projectSummary !== undefined,          `[${label}] projectSummary present`);
  assert(typeof report.projectSummary.category === 'string',
    `[${label}] projectSummary.category string`);
  assert(typeof report.projectSummary.complexityLevel === 'string',
    `[${label}] projectSummary.complexityLevel string`);
}

sub('Pipeline: empty prompt uses fallback gracefully');
const blankReport = await runIntelligentProjectAnalysis('');
assert(typeof blankReport === 'object' && blankReport !== null, 'Blank prompt: returns object');
assert(typeof blankReport.rawInput === 'string',  'Blank prompt: rawInput is string (fallback used)');
assert(Array.isArray(blankReport.techStack) && blankReport.techStack.length > 0, 'Blank prompt: techStack non-empty');

sub('Pipeline: very long prompt truncated safely to 5000 chars');
const longPrompt = 'Build an AI-powered platform that does '.padEnd(5100, 'everything and more ');
const longReport = await runIntelligentProjectAnalysis(longPrompt);
assert(longReport !== null, 'Long prompt: returns without crash');
assert(longReport.rawInput.length <= 5000, `Long prompt: rawInput.length=${longReport.rawInput.length} <= 5000`);

// ═══════════════════════════════════════════════════════════
//  SUMMARY
// ═══════════════════════════════════════════════════════════
console.log(`\n${'═'.repeat(60)}`);
console.log('  📊  TEST RESULTS');
console.log('═'.repeat(60));
console.log(`  ✅  Passed : ${passed}`);
console.log(`  ❌  Failed : ${failed}`);
console.log(`  📈  Total  : ${passed + failed}`);

if (failures.length > 0) {
  console.log('\n  ❌ Failed tests:');
  failures.forEach((f, i) => console.log(`     ${i + 1}. ${f}`));
  process.exit(1);
} else {
  console.log('\n  🎉  ALL TESTS PASSED!');
  process.exit(0);
}
