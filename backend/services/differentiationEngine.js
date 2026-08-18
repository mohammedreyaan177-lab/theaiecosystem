/**
 * Product Differentiation & Feature Gap Analysis Engine
 * Prompt-aware: reads the user's actual words to generate specific differentiators.
 */

/**
 * Extract unique action/feature keywords directly from the user's prompt.
 * These feed into differentiator titles so they mention the user's actual intent.
 */
function extractPromptKeywords(prompt) {
  const lower = prompt.toLowerCase();

  // Feature signals from prompt text
  const signals = {
    realTime:    /real.?time|live|instant|streaming|websocket/i.test(prompt),
    offline:     /offline|local.?first|sync|pwa/i.test(prompt),
    multiTenant: /multi.?tenant|team|workspace|organisation|enterprise/i.test(prompt),
    mobile:      /mobile|ios|android|react native|flutter/i.test(prompt),
    payment:     /payment|stripe|billing|subscription|monetiz/i.test(prompt),
    collaborative: /collaborat|shared|multiplayer|co-author|together/i.test(prompt),
    privacy:     /privacy|gdpr|anonymous|encrypted|zero.?knowledge/i.test(prompt),
    recommendation: /recommend|personaliz|curate|suggest|discover/i.test(prompt),
    analytics:   /analytics|dashboard|metric|chart|insight/i.test(prompt),
    search:      /search|find|filter|query|browse/i.test(prompt),
    notification: /notif|alert|push|email|sms|remind/i.test(prompt),
    export:      /export|download|csv|pdf|report/i.test(prompt),
    api:         /api|sdk|webhook|integration|connect/i.test(prompt),
    openSource:  /open.?source|self.?host|docker|self.?deploy/i.test(prompt),
  };

  return signals;
}

/**
 * Build a feature matrix that uses the user's actual prompt to decide which rows are "key differentiators"
 * vs baseline features of the existing comparable projects.
 */
function buildDynamicMatrix(signals, isSocial, isImage, isVoice, isAuto, isAnalytics, isCoding, prompt) {
  const matrix = [];

  // ── Domain-specific baseline rows ──────────────────────────────
  if (isSocial) {
    matrix.push(
      { feature: 'User Auth & Profiles',     existingProjectsHas: true,  userProjectHas: true,  status: 'Baseline Feature' },
      { feature: 'Media Post Feed',           existingProjectsHas: true,  userProjectHas: true,  status: 'Baseline Feature' },
      { feature: 'Likes & Comments',          existingProjectsHas: true,  userProjectHas: true,  status: 'Baseline Feature' },
      { feature: 'Follow / Follower Graph',   existingProjectsHas: true,  userProjectHas: true,  status: 'Baseline Feature' }
    );
  } else if (isImage) {
    matrix.push(
      { feature: 'Text-to-Image Generation',  existingProjectsHas: true,  userProjectHas: true,  status: 'Baseline Feature' },
      { feature: 'Image Preview & Download',  existingProjectsHas: true,  userProjectHas: true,  status: 'Baseline Feature' },
      { feature: 'Prompt History',            existingProjectsHas: true,  userProjectHas: true,  status: 'Baseline Feature' }
    );
  } else if (isVoice) {
    matrix.push(
      { feature: 'Text-to-Speech Synthesis',  existingProjectsHas: true,  userProjectHas: true,  status: 'Baseline Feature' },
      { feature: 'Audio Playback & Download', existingProjectsHas: true,  userProjectHas: true,  status: 'Baseline Feature' }
    );
  } else if (isAuto) {
    matrix.push(
      { feature: 'Webhook Event Triggers',    existingProjectsHas: true,  userProjectHas: true,  status: 'Baseline Feature' },
      { feature: 'API Action Execution',      existingProjectsHas: true,  userProjectHas: true,  status: 'Baseline Feature' },
      { feature: 'Visual Workflow Builder',   existingProjectsHas: true,  userProjectHas: true,  status: 'Baseline Feature' }
    );
  } else if (isAnalytics) {
    matrix.push(
      { feature: 'CSV / Excel Data Upload',   existingProjectsHas: true,  userProjectHas: true,  status: 'Baseline Feature' },
      { feature: 'Chart & Graph Rendering',   existingProjectsHas: true,  userProjectHas: true,  status: 'Baseline Feature' }
    );
  } else if (isCoding) {
    matrix.push(
      { feature: 'Code Completion / Autocomplete', existingProjectsHas: true, userProjectHas: true, status: 'Baseline Feature' },
      { feature: 'Syntax Highlighting',       existingProjectsHas: true,  userProjectHas: true,  status: 'Baseline Feature' }
    );
  } else {
    matrix.push(
      { feature: 'Core Interactive Dashboard', existingProjectsHas: true, userProjectHas: true, status: 'Baseline Feature' },
      { feature: 'Standard Data Export',       existingProjectsHas: true, userProjectHas: true, status: 'Baseline Feature' }
    );
  }

  // ── Prompt-signal-driven differentiator rows ───────────────────
  if (signals.realTime) {
    matrix.push({ feature: 'Real-Time Live Updates (WebSockets)', existingProjectsHas: false, userProjectHas: true, status: '🔥 Key Differentiator' });
  }
  if (signals.recommendation) {
    matrix.push({ feature: 'AI Personalized Recommendation Engine', existingProjectsHas: false, userProjectHas: true, status: '🔥 Key Differentiator' });
  }
  if (signals.collaborative) {
    matrix.push({ feature: 'Real-Time Collaborative Editing', existingProjectsHas: false, userProjectHas: true, status: '🔥 Key Differentiator' });
  }
  if (signals.payment) {
    matrix.push({ feature: 'Built-in Payment & Subscription Billing', existingProjectsHas: false, userProjectHas: true, status: '🔥 Key Differentiator' });
  }
  if (signals.privacy) {
    matrix.push({ feature: 'Privacy-First / GDPR Compliance Layer', existingProjectsHas: false, userProjectHas: true, status: '🔥 Key Differentiator' });
  }
  if (signals.mobile) {
    matrix.push({ feature: 'Cross-Platform Mobile App (iOS/Android)', existingProjectsHas: false, userProjectHas: true, status: '🔥 Key Differentiator' });
  }
  if (signals.offline) {
    matrix.push({ feature: 'Offline / Local-First Data Sync', existingProjectsHas: false, userProjectHas: true, status: '🔥 Key Differentiator' });
  }
  if (signals.openSource) {
    matrix.push({ feature: 'Self-Hostable Open-Source Deployment', existingProjectsHas: false, userProjectHas: true, status: '🔥 Key Differentiator' });
  }
  if (signals.api) {
    matrix.push({ feature: 'Public API / SDK / Webhook Integration Layer', existingProjectsHas: false, userProjectHas: true, status: '🔥 Key Differentiator' });
  }

  // Always add at least 2 AI differentiators if none of the above fired
  const hasAnyDifferentiator = matrix.some(m => m.status === '🔥 Key Differentiator');
  if (!hasAnyDifferentiator) {
    if (isSocial) {
      matrix.push(
        { feature: 'AI-Curated Personalised Feed', existingProjectsHas: false, userProjectHas: true, status: '🔥 Key Differentiator' },
        { feature: 'AI Content Creation Assistant', existingProjectsHas: false, userProjectHas: true, status: '🔥 Key Differentiator' }
      );
    } else if (isImage) {
      matrix.push(
        { feature: 'AI Prompt Auto-Enhancer',      existingProjectsHas: false, userProjectHas: true, status: '🔥 Key Differentiator' },
        { feature: 'Multi-Model Comparison View',  existingProjectsHas: false, userProjectHas: true, status: '🔥 Key Differentiator' }
      );
    } else if (isAuto) {
      matrix.push(
        { feature: 'Autonomous AI Agent Nodes',    existingProjectsHas: false, userProjectHas: true, status: '🔥 Key Differentiator' },
        { feature: 'Self-Healing Retry Loops',     existingProjectsHas: false, userProjectHas: true, status: '🔥 Key Differentiator' }
      );
    } else {
      matrix.push(
        { feature: 'Contextual AI Copilot Advisor', existingProjectsHas: false, userProjectHas: true, status: '🔥 Key Differentiator' },
        { feature: 'Automated Insight Alerts',      existingProjectsHas: false, userProjectHas: true, status: '🔥 Key Differentiator' }
      );
    }
  }

  return matrix;
}

/**
 * Build ranked differentiators based on the user's actual prompt signals.
 */
function buildDynamicDifferentiators(signals, isSocial, isImage, isVoice, isAuto, isAnalytics, isCoding, prompt, capabilities) {
  const differentiators = [];
  let rank = 1;

  // Prompt-signal specific differentiators (highest priority — user explicitly asked for these)
  if (signals.recommendation) {
    differentiators.push({
      rank: rank++,
      title: 'AI-Powered Personalised Recommendation Engine',
      impactLevel: 'HIGH IMPACT',
      whyValue: 'Most open-source alternatives use chronological or rule-based ordering. A machine-learning recommendation layer creates dramatically stronger user retention and engagement loops.',
      implementationComplexity: 'Medium',
      relevantCapabilities: capabilities.filter(c => ['llm_chat', 'vector_search', 'data_analytics'].includes(c.capability)).map(c => c.name)
    });
  }

  if (signals.realTime) {
    differentiators.push({
      rank: rank++,
      title: 'Real-Time Live Collaboration & Sync (WebSockets)',
      impactLevel: 'HIGH IMPACT',
      whyValue: 'Real-time capabilities fundamentally change the user experience — instant updates, live cursors, and collaborative sessions elevate a single-user app into a team product.',
      implementationComplexity: 'Medium',
      relevantCapabilities: capabilities.filter(c => ['user_authentication', 'database', 'social_feed'].includes(c.capability)).map(c => c.name)
    });
  }

  if (signals.payment) {
    differentiators.push({
      rank: rank++,
      title: 'Native Subscription Billing & Usage-Based Pricing',
      impactLevel: 'HIGH IMPACT',
      whyValue: 'Open-source alternatives are rarely monetised. Embedding Stripe billing with usage-based tiers converts a free tool into a commercial-grade SaaS product from day one.',
      implementationComplexity: 'Low',
      relevantCapabilities: []
    });
  }

  if (signals.privacy) {
    differentiators.push({
      rank: rank++,
      title: 'Privacy-First Architecture & GDPR Compliance',
      impactLevel: 'MEDIUM IMPACT',
      whyValue: 'With growing regulatory pressure and user privacy awareness, a platform built with explicit GDPR controls, data minimisation, and zero-tracking wins enterprise trust.',
      implementationComplexity: 'Medium',
      relevantCapabilities: []
    });
  }

  if (signals.mobile) {
    differentiators.push({
      rank: rank++,
      title: 'Cross-Platform Native Mobile App (iOS & Android)',
      impactLevel: 'HIGH IMPACT',
      whyValue: 'Web-only competitors miss 60%+ of mobile-first users. A React Native or Flutter companion app dramatically expands your addressable market with shared backend code.',
      implementationComplexity: 'High',
      relevantCapabilities: []
    });
  }

  if (signals.api) {
    differentiators.push({
      rank: rank++,
      title: 'Public API / SDK & Webhook Integration Layer',
      impactLevel: 'MEDIUM IMPACT',
      whyValue: 'Exposing a well-documented REST API transforms a standalone app into a platform — enabling third-party integrations, Zapier automation, and developer ecosystem growth.',
      implementationComplexity: 'Medium',
      relevantCapabilities: capabilities.filter(c => ['automation', 'workflow_automation'].includes(c.capability)).map(c => c.name)
    });
  }

  if (signals.offline) {
    differentiators.push({
      rank: rank++,
      title: 'Offline-First / Local Data Sync with Conflict Resolution',
      impactLevel: 'MEDIUM IMPACT',
      whyValue: 'Local-first apps work seamlessly without internet and sync reliably when reconnected — a major UX advantage over cloud-only alternatives in low-bandwidth environments.',
      implementationComplexity: 'High',
      relevantCapabilities: []
    });
  }

  if (signals.collaborative) {
    differentiators.push({
      rank: rank++,
      title: 'Multiplayer Real-Time Collaborative Workspace',
      impactLevel: 'HIGH IMPACT',
      whyValue: 'Collaboration multiplies user value — teams sharing a workspace create network effects, improve retention, and are the primary reason products like Notion and Figma dominate.',
      implementationComplexity: 'High',
      relevantCapabilities: capabilities.filter(c => ['user_authentication', 'database'].includes(c.capability)).map(c => c.name)
    });
  }

  // Domain-specific fallbacks if no prompt signals fired
  if (differentiators.length === 0) {
    if (isSocial) {
      differentiators.push(
        { rank: rank++, title: 'AI-Curated Feed & Smart Content Discovery', impactLevel: 'HIGH IMPACT', whyValue: 'Most social clones sort chronologically. An AI-curated feed based on user intent and engagement patterns creates the same addictive retention loop Instagram uses.', implementationComplexity: 'Medium', relevantCapabilities: capabilities.slice(0, 2).map(c => c.name) },
        { rank: rank++, title: 'Built-in AI Creator Assistant (Captions, Hashtags, Edits)', impactLevel: 'HIGH IMPACT', whyValue: 'Empowers content creators directly inside the platform — no external tools needed — dramatically reducing friction and increasing post frequency.', implementationComplexity: 'Low', relevantCapabilities: [] }
      );
    } else if (isImage) {
      differentiators.push(
        { rank: rank++, title: 'Smart Prompt Auto-Enhancement Engine', impactLevel: 'HIGH IMPACT', whyValue: 'Solves the "blank prompt" problem — expands short user prompts into rich, detailed diffusion prompts using an LLM pre-processor.', implementationComplexity: 'Low', relevantCapabilities: [] },
        { rank: rank++, title: 'AI Style Memory & Custom Persona Presets', impactLevel: 'HIGH IMPACT', whyValue: 'Users save aesthetic personas (e.g. Cyberpunk, Watercolour) and apply across generations — creating personalised, repeatable visual consistency.', implementationComplexity: 'Medium', relevantCapabilities: [] }
      );
    } else if (isVoice) {
      differentiators.push(
        { rank: rank++, title: 'Custom Voice Clone from Short Audio Sample', impactLevel: 'HIGH IMPACT', whyValue: 'Voice cloning from <30 seconds of audio unlocks personalised narration — a premium feature none of the basic TTS alternatives offer.', implementationComplexity: 'Medium', relevantCapabilities: [] }
      );
    } else if (isAuto) {
      differentiators.push(
        { rank: rank++, title: 'Autonomous AI Agent Nodes with Dynamic Decision Trees', impactLevel: 'HIGH IMPACT', whyValue: 'Traditional tools execute static IF-THEN rules. AI Agent nodes allow LLMs to decide next action steps dynamically based on live context — far more powerful.', implementationComplexity: 'High', relevantCapabilities: [] },
        { rank: rank++, title: 'Self-Healing API Error Recovery', impactLevel: 'HIGH IMPACT', whyValue: 'Automatically analyses API error responses and rewrites payload parameters on retry — eliminating broken workflows from schema changes or rate limits.', implementationComplexity: 'Medium', relevantCapabilities: [] }
      );
    } else if (isAnalytics) {
      differentiators.push(
        { rank: rank++, title: 'Natural Language Data Querying ("Ask your data")', impactLevel: 'HIGH IMPACT', whyValue: 'Non-technical users can type questions like "show revenue by region last quarter" and get instant chart answers — eliminating SQL barriers.', implementationComplexity: 'Medium', relevantCapabilities: [] }
      );
    } else if (isCoding) {
      differentiators.push(
        { rank: rank++, title: 'Whole-Codebase Context Indexing (Not Just Current File)', impactLevel: 'HIGH IMPACT', whyValue: 'Most code assistants only see the active file. Full-codebase vector indexing enables cross-file refactoring, function discovery, and architectural reasoning.', implementationComplexity: 'High', relevantCapabilities: [] }
      );
    } else {
      differentiators.push(
        { rank: rank++, title: 'Embedded AI Copilot & Contextual Advisor', impactLevel: 'HIGH IMPACT', whyValue: 'Transforms a passive dashboard into an active strategic advisor that proactively highlights opportunities, risks, and next steps without manual querying.', implementationComplexity: 'Medium', relevantCapabilities: capabilities.slice(0, 2).map(c => c.name) }
      );
    }
  }

  return differentiators;
}

export function generateDifferentiationAnalysis(userPrompt, classification, capabilities, discoveredProjects) {
  const lower = userPrompt.toLowerCase();

  const isSocial    = classification.targetEntity === 'Instagram' || lower.includes('social') || lower.includes('feed') || lower.includes('follower');
  const isImage     = capabilities.some(c => c.capability === 'image_generation');
  const isVoice     = capabilities.some(c => c.capability === 'voice_generation');
  const isAuto      = capabilities.some(c => c.capability === 'automation');
  const isAnalytics = capabilities.some(c => c.capability === 'data_analytics');
  const isCoding    = capabilities.some(c => c.capability === 'coding_assistance');

  // Extract what the user actually asked for
  const signals = extractPromptKeywords(userPrompt);

  // Build prompt-specific matrix and differentiators
  const matrix = buildDynamicMatrix(signals, isSocial, isImage, isVoice, isAuto, isAnalytics, isCoding, userPrompt);
  const differentiators = buildDynamicDifferentiators(signals, isSocial, isImage, isVoice, isAuto, isAnalytics, isCoding, userPrompt, capabilities);

  // Reference guidance from the actual discovered project data
  const referenceGuidance = discoveredProjects.map((p, idx) => ({
    projectName: p.name,
    repositoryUrl: p.repositoryUrl,
    stars: p.stars || 0,
    architectureUtility: idx === 0
      ? 'Primary reference for overall project folder structure, API route layout, and data model design.'
      : idx === 1
      ? 'Useful reference for database schema, authentication flow, and middleware patterns.'
      : 'Useful reference for frontend UI component structure, state management, and routing patterns.',
    ethicalNote: 'Use strictly as an open-source reference for architecture patterns. Do NOT copy proprietary source code, branding, or assets directly. Always respect the project\'s open-source licence (MIT/Apache 2.0/GPL).'
  }));

  return {
    matrix,
    differentiators,
    referenceGuidance,
    antiCopyingPolicy: 'Discovered web projects are intended solely for architectural learning, feature gap analysis, and market comparison. Always respect open-source licensing (MIT/Apache 2.0/GPL) and never copy proprietary code or brand assets.'
  };
}
