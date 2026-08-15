import { discoverTaskGuides } from './guideDiscoveryEngine.js';

/**
 * Dependency-Aware Build Blueprint Engine
 * Dynamically builds project-specific, phased development procedures.
 */

export async function generateBuildBlueprint(prompt, classification, capabilities, archSummary, techStack) {
  const lowerPrompt = prompt.toLowerCase();
  const phases = [];

  const isFrontendOnly = archSummary.isFrontendOnly;
  const requiresDB = archSummary.requiresDatabase;
  const requiresAuth = archSummary.requiresAuth;

  const isImageReq = capabilities.some(c => c.capability === 'image_generation');
  const isVoiceReq = capabilities.some(c => c.capability === 'voice_generation');
  const isAutoReq = capabilities.some(c => c.capability === 'automation');
  const isCodingReq = capabilities.some(c => c.capability === 'coding_assistance');
  const isAnalyticsReq = capabilities.some(c => c.capability === 'data_analytics');

  let phaseIndex = 1;

  // PHASE 1 — Project Foundation & Environment Setup
  const p1Tech = techStack.find(t => t.layer === 'Frontend')?.recommendation || 'React';
  const p1Guides = await discoverTaskGuides('Project setup framework environment initialization', p1Tech);
  phases.push({
    phaseNumber: phaseIndex++,
    title: 'Project Foundation & Environment Setup',
    goal: 'Initialize repository, folder structure, environment variables, and client development server.',
    dependencies: ['Node.js LTS runtime', 'Git version control'],
    tasks: [
      'Initialize Git repository and package manifest (`package.json`).',
      `Configure ${p1Tech} frontend build tooling and environment secrets (\`.env.local\`).`,
      'Establish client folder structure (`src/components`, `src/services`, `src/utils`).',
      'Verify local development server boot without errors.'
    ],
    likelyFiles: ['package.json', '.env.example', 'src/App.tsx', 'vite.config.ts'],
    expectedResult: 'Clean local development server running on localhost.',
    testCases: ['Run `npm run dev` and verify frontend loads in browser.'],
    guides: p1Guides
  });

  // PHASE 2 — Database Schema & Data Persistence (If DB Required)
  if (requiresDB) {
    const dbTech = techStack.find(t => t.layer === 'Database')?.recommendation || 'PostgreSQL';
    const p2Guides = await discoverTaskGuides('Database schema migrations and connection pool', dbTech);
    phases.push({
      phaseNumber: phaseIndex++,
      title: 'Database Schema & Data Persistence',
      goal: 'Define database relational schema, user tables, generation logs, and query connection pool.',
      dependencies: ['Phase 1 Foundation', 'Database Connection URI'],
      tasks: [
        `Initialize ${dbTech} connection pool and client ORM/driver.`,
        'Define database tables for Users, Items, Generation History, and Relations.',
        'Create strict UNIQUE indexes on email, canonical URLs, and content hashes.',
        'Test query execution and connection error handling.'
      ],
      likelyFiles: ['server/db.js', 'schema.sql', 'server/models/index.js'],
      expectedResult: 'Database tables initialized with verified indexes.',
      testCases: ['Execute DB migration script and test inserting a dummy record.'],
      guides: p2Guides
    });
  }

  // PHASE 3 — Core Technical Capability & API Integration
  let coreTaskTitle = 'Core Feature API Endpoint Integration';
  let coreTech = 'REST API';
  if (isImageReq) { coreTaskTitle = 'AI Image Generation API Integration'; coreTech = 'DALL-E / Midjourney / Replicate API'; }
  else if (isVoiceReq) { coreTaskTitle = 'AI Speech Synthesis API Integration'; coreTech = 'ElevenLabs API'; }
  else if (isAutoReq) { coreTaskTitle = 'Workflow Automation Engine & Webhook Triggers'; coreTech = 'n8n / Webhooks'; }
  else if (isAnalyticsReq) { coreTaskTitle = 'Data Analytics & Visualization Engine'; coreTech = 'Python Data Stack / Chart.js'; }
  else if (isCodingReq) { coreTaskTitle = 'AI Code Assistant & Parsing Engine'; coreTech = 'OpenAI Code API / Claude SDK'; }

  const p3Guides = await discoverTaskGuides(coreTaskTitle, coreTech);
  phases.push({
    phaseNumber: phaseIndex++,
    title: `Core Capability: ${coreTaskTitle}`,
    goal: `Implement primary domain engine logic for ${classification.projectType || 'this project'}.`,
    dependencies: isFrontendOnly ? ['Phase 1 Foundation'] : ['Phase 1 Foundation', 'Backend API Proxy'],
    tasks: [
      `Create core processing handler/endpoint for ${coreTaskTitle}.`,
      'Validate prompt and incoming request payloads.',
      `Connect to ${coreTech} provider SDK / API endpoint.`,
      'Format output payload, handling provider timeout and rate limit errors.'
    ],
    likelyFiles: isFrontendOnly ? ['src/services/coreService.ts'] : ['server/services/aiService.js', 'server/routes/api.js'],
    expectedResult: `Submitting a valid request returns synthesized output payload.`,
    testCases: [`Send test request payload and verify valid result format returned.`],
    guides: p3Guides
  });

  // PHASE 4 — Authentication & Security (If Auth Required)
  if (requiresAuth) {
    const p4Guides = await discoverTaskGuides('User authentication JWT session security', 'JWT / Auth');
    phases.push({
      phaseNumber: phaseIndex++,
      title: 'Authentication & Session Security',
      goal: 'Secure user registration, sign-in, password hashing, and token authorization middleware.',
      dependencies: ['Phase 2 Database Schema'],
      tasks: [
        'Implement password hashing (bcrypt / argon2) and user registration endpoint.',
        'Implement JWT / session token generation on login.',
        'Create authorization middleware to inspect Bearer tokens on protected API routes.',
        'Add client-side authentication context and token persistence.'
      ],
      likelyFiles: ['server/middleware/auth.js', 'server/routes/auth.js', 'src/context/AuthContext.tsx'],
      expectedResult: 'Unauthenticated requests to protected endpoints return HTTP 401.',
      testCases: ['Attempt to fetch protected endpoint without token, verify 401 error.'],
      guides: p4Guides
    });
  }

  // PHASE 5 — Interactive UI Components & Primary User Flow
  const p5Guides = await discoverTaskGuides('React form submission UI state management', 'React UI');
  phases.push({
    phaseNumber: phaseIndex++,
    title: 'Interactive User Interface & Main Workflow',
    goal: 'Build responsive UI input forms, interactive cards, status indicators, and asset history view.',
    dependencies: [`Phase ${phaseIndex - 2} Core Capability`],
    tasks: [
      'Build responsive main application layout and form inputs.',
      'Bind form submission to API client with live loading states.',
      'Render dynamic output cards (image preview, synthesized speech player, workflow status).',
      'Add user feedback alert banners for error and success states.'
    ],
    likelyFiles: ['src/components/MainView.tsx', 'src/components/FormInput.tsx', 'src/components/ResultCard.tsx'],
    expectedResult: 'User can submit inputs in UI and view live interactive results.',
    testCases: ['Perform manual end-to-end flow in browser from input to output display.'],
    guides: p5Guides
  });

  // PHASE 6 — Rate Limiting, Error Resilience & Edge Cases
  const p6Guides = await discoverTaskGuides('Express rate limiting input sanitization error handling', 'Express Security');
  phases.push({
    phaseNumber: phaseIndex++,
    title: 'Rate Limiting, Error Resilience & Edge Cases',
    goal: 'Protect endpoints against request abuse, handle API rate limits, and sanitize inputs.',
    dependencies: [`Phase ${phaseIndex - 2} Main Workflow`],
    tasks: [
      'Configure IP rate-limiting middleware (e.g. 20 requests per minute).',
      'Sanitize prompt input text to prevent injection or invalid parameter crashes.',
      'Add fallback retry logic for external API provider downtime.',
      'Implement graceful error UI components.'
    ],
    likelyFiles: isFrontendOnly ? ['src/utils/rateLimit.ts'] : ['server/middleware/rateLimit.js', 'src/components/ErrorBoundary.tsx'],
    expectedResult: 'Excessive requests trigger HTTP 429 alert; invalid inputs display clean warnings.',
    testCases: ['Trigger 25 rapid requests and verify HTTP 429 Rate Limit error banner.'],
    guides: p6Guides
  });

  // PHASE 7 — Testing & Production Deployment
  const p7Tech = isFrontendOnly ? 'Vercel / Netlify' : 'Vercel + Render / Railway';
  const p7Guides = await discoverTaskGuides(`${p7Tech} production deployment static build`, p7Tech);
  phases.push({
    phaseNumber: phaseIndex++,
    title: 'Testing & Stack-Tailored Production Deployment',
    goal: 'Run automated test suites, build production bundles, and deploy live on cloud CDN.',
    dependencies: [`Phase ${phaseIndex - 2} Security`],
    tasks: [
      'Execute automated unit and API integration tests.',
      'Run production build compiler (`npm run build`) and fix warnings.',
      `Configure environment variables on ${p7Tech} production dashboard.`,
      'Verify live production URL and HTTPS SSL certificate.'
    ],
    likelyFiles: ['vercel.json', 'render.yaml', 'dist/index.html'],
    expectedResult: 'Live HTTPS web URL accessible globally.',
    testCases: ['Visit live production domain and complete full user flow.'],
    guides: p7Guides
  });

  return phases;
}
