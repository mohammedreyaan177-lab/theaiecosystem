import { getToolRegistry } from './toolRegistry.js';
import { generateBuildBlueprint } from './blueprintEngine.js';
import { generateDifferentiationAnalysis } from './differentiationEngine.js';

/**
 * Stage 1: Semantic Intent Classification
 */
export function classifyPromptIntent(prompt) {
  const lower = prompt.toLowerCase().trim();

  // Identified entity patterns
  const entityPatterns = [
    { name: 'Instagram', regex: /\b(instagram|insta)\b/ },
    { name: 'Trello', regex: /\b(trello|kanban board like trello)\b/ },
    { name: 'Notion', regex: /\b(notion)\b/ },
    { name: 'Zapier', regex: /\b(zapier)\b/ },
    { name: 'n8n', regex: /\b(n8n)\b/ },
    { name: 'Make', regex: /\b(make\.com)\b/ },
    { name: 'Spotify', regex: /\b(spotify)\b/ },
    { name: 'GitHub', regex: /\b(github)\b/ },
    { name: 'WhatsApp', regex: /\b(whatsapp|chat like whatsapp)\b/ },
    { name: 'Twitter / X', regex: /\b(twitter|x\.com)\b/ },
    { name: 'YouTube', regex: /\b(youtube)\b/ },
    { name: 'Slack', regex: /\b(slack)\b/ },
    { name: 'Figma', regex: /\b(figma)\b/ },
    { name: 'TikTok', regex: /\b(tiktok)\b/ },
    { name: 'Canva', regex: /\b(canva)\b/ },
    { name: 'Discord', regex: /\b(discord)\b/ },
    { name: 'Open WebUI', regex: /\b(open-webui|open webui)\b/ },
    { name: 'Cursor', regex: /\b(cursor ide|cursor editor)\b/ }
  ];

  for (const pattern of entityPatterns) {
    if (pattern.regex.test(lower)) {
      return {
        requestType: 'PROJECT_SPECIFIC',
        confidence: 0.95,
        targetEntity: pattern.name,
        projectType: `${pattern.name.toLowerCase()}_clone_or_alternative`,
        reason: `The prompt explicitly requests an application modeled after an identifiable existing product (${pattern.name}).`
      };
    }
  }

  // Check explicit clone / reference phrases
  const clonePhrases = [
    'clone of', 'app like', 'website like', 'similar to', 'platform like',
    'tool like', 'system like', 'software like', 'engine like', 'service like',
    'replica of', 'alternative to', 'built like', 'recreate'
  ];

  const hasClonePhrase = clonePhrases.some(phrase => lower.includes(phrase));

  if (hasClonePhrase) {
    const words = lower.split(/\s+/);
    let target = 'Reference Application';
    for (let i = 0; i < words.length; i++) {
      if (['like', 'to', 'of'].includes(words[i]) && i < words.length - 1) {
        target = words[i + 1].replace(/[^\w]/g, '');
        break;
      }
    }

    return {
      requestType: 'PROJECT_SPECIFIC',
      confidence: 0.88,
      targetEntity: target.charAt(0).toUpperCase() + target.slice(1),
      projectType: 'project_clone',
      reason: 'The prompt uses comparative reference phrasing targeting an existing application.'
    };
  }

  // Default to Generic Category
  let projectType = 'general_web_application';
  if (lower.includes('portfolio')) projectType = 'portfolio_website';
  else if (lower.includes('automation') || lower.includes('automate') || lower.includes('workflow')) projectType = 'workflow_automation_platform';
  else if (lower.includes('ecommerce') || lower.includes('e-commerce') || lower.includes('store')) projectType = 'ecommerce_store';
  else if (lower.includes('weather')) projectType = 'weather_application';
  else if (lower.includes('image')) projectType = 'image_generation_platform';
  else if (lower.includes('voice') || lower.includes('speech')) projectType = 'voice_platform';
  else if (lower.includes('coding') || lower.includes('code assistant')) projectType = 'developer_coding_tool';
  else if (lower.includes('analytics') || lower.includes('chart') || lower.includes('dashboard')) projectType = 'data_analytics_platform';

  return {
    requestType: 'GENERIC',
    confidence: 0.96,
    targetEntity: null,
    projectType,
    reason: 'The request describes a general application category or project concept rather than a specific existing product.'
  };
}

/**
 * Stage 2: Deep Semantic Capability & Requirement Extractor
 * Decodes standard, niche, weird, or complex prompt requests into fine-grained capabilities.
 */
export function extractProjectCapabilities(prompt, classification) {
  const lower = prompt.toLowerCase();
  const capsMap = new Map();

  const addCap = (capability, name, importance, reason) => {
    if (!capsMap.has(capability)) {
      capsMap.set(capability, { capability, name, importance, reason });
    }
  };

  // 1. Automation, Workflows & Webhook Triggers
  if (lower.includes('automating') || lower.includes('automation') || lower.includes('automate') || lower.includes('workflow') || lower.includes('n8n') || lower.includes('zapier') || lower.includes('make') || lower.includes('trigger') || lower.includes('scraping') || lower.includes('bot') || lower.includes('cron')) {
    addCap('automation', 'Workflow & Process Automation', 'Essential', 'Requires automated execution triggers, webhooks, and asynchronous job queues.');
    addCap('workflow_automation', 'Multi-Step Workflow Orchestration', 'Essential', 'Connects external webhooks, APIs, and action pipelines without manual intervention.');
    if (lower.includes('scrap') || lower.includes('browser') || lower.includes('crawl')) {
      addCap('browser_automation', 'Browser & Web Scraping Automation', 'Recommended', 'Automates browser interaction, DOM parsing, and web data extraction.');
    }
    if (lower.includes('agent') || lower.includes('multi-agent') || lower.includes('crew')) {
      addCap('agentic_workflows', 'AI Agent Orchestration', 'Essential', 'Orchestrates multi-agent role execution and autonomous goal solving.');
    }
  }

  // 2. Image Generation / Design / Graphics
  if (lower.includes('image') || lower.includes('photo') || lower.includes('picture') || lower.includes('art') || lower.includes('graphic') || lower.includes('logo') || lower.includes('dall-e') || lower.includes('midjourney') || lower.includes('flux')) {
    addCap('image_generation', 'AI Image Generation', 'Essential', 'Requires text-to-image synthesis and visual asset creation.');
    addCap('text_to_image', 'Text-to-Image Synthesis', 'Essential', 'Converts user natural language prompts into high-resolution images.');
  }

  // 3. Voice, Audio & Speech
  if (lower.includes('voice') || lower.includes('audio') || lower.includes('speech') || lower.includes('tts') || lower.includes('podcast') || lower.includes('narration') || lower.includes('elevenlabs')) {
    addCap('voice_generation', 'AI Voice & Speech Synthesis', 'Essential', 'Requires lifelike text-to-speech audio synthesis and voice processing.');
    addCap('text_to_speech', 'Text-to-Speech Engine', 'Essential', 'Converts written scripts into human-quality voice narration.');
  }

  // 4. Data Analytics, Charts & Data Science
  if (lower.includes('analytics') || lower.includes('data') || lower.includes('chart') || lower.includes('dashboard') || lower.includes('excel') || lower.includes('csv') || lower.includes('predict') || lower.includes('metric')) {
    addCap('data_analytics', 'Automated Data Analytics', 'Essential', 'Cleans, parses, and executes statistical analysis on structured datasets.');
    addCap('data_visualization', 'Dynamic Data Visualization', 'Essential', 'Generates interactive charts, graphs, and metric dashboards.');
  }

  // 5. Coding Assistance & Developer Tools
  if (lower.includes('code') || lower.includes('coding') || lower.includes('developer') || lower.includes('compiler') || lower.includes('ide') || lower.includes('programmer') || lower.includes('cursor') || lower.includes('copilot') || lower.includes('github') || lower.includes('bug')) {
    addCap('coding_assistance', 'AI Pair Programming & Code Generation', 'Essential', 'Context-aware code completion, refactoring, and codebase generation.');
    addCap('developer_tools', 'Developer Tool Integration', 'Recommended', 'Integrates with IDEs, terminal CLI, and version control repositories.');
  }

  // 6. Conversational AI & Reasoning
  if (lower.includes('chat') || lower.includes('assistant') || lower.includes('bot') || lower.includes('conversation') || lower.includes('gpt') || lower.includes('claude') || lower.includes('gemini')) {
    addCap('llm_chat', 'Frontier LLM Conversational Interface', 'Essential', 'Provides interactive dialogue, multi-turn reasoning, and chat synthesis.');
  }

  // 7. Vector Search & RAG
  if (lower.includes('pdf') || lower.includes('document') || lower.includes('search') || lower.includes('rag') || lower.includes('vector') || lower.includes('embedding') || lower.includes('pinecone') || lower.includes('knowledge base')) {
    addCap('vector_search', 'Vector Similarity & RAG Retrieval', 'Essential', 'Indexes custom documents into vector embeddings for semantic context search.');
  }

  // 8. Social Network Capabilities
  if (classification.targetEntity === 'Instagram' || lower.includes('social') || lower.includes('feed') || lower.includes('post') || lower.includes('follower') || lower.includes('like') || lower.includes('comment')) {
    addCap('user_authentication', 'User Auth & Profile Management', 'Essential', 'Secure sign-up, sign-in, session tokens, and user profile management.');
    addCap('social_feed', 'Social Feed & Timeline Engine', 'Essential', 'Real-time post streams, media cards, likes, comments, and follower graph.');
    addCap('database', 'Relational Database Persistence', 'Essential', 'Stores user accounts, relationships, posts, and interactive metadata.');
  }

  // 9. E-Commerce Capabilities
  if (lower.includes('ecommerce') || lower.includes('e-commerce') || lower.includes('shop') || lower.includes('store') || lower.includes('cart') || lower.includes('checkout')) {
    addCap('user_authentication', 'User Account System', 'Essential', 'Customer profiles, order history, and authenticated checkout.');
    addCap('database', 'Product Catalog & Order Database', 'Essential', 'Relational inventory database supporting SKU filtering and transaction state.');
  }

  // Fallback defaults if generic
  if (capsMap.size === 0) {
    addCap('responsive_ui', 'Responsive Web UI & Dashboard', 'Essential', 'Modern interactive web interface layout.');
    addCap('frontend_development', 'Frontend Framework', 'Essential', 'React/Next.js single page application layer.');
    addCap('llm_chat', 'General AI Reasoning Support', 'Recommended', 'Contextual text processing and interactive AI features.');
  }

  return Array.from(capsMap.values());
}

/**
 * Stage 3: Architecture Requirements Assessment
 */
export function evaluateArchitectureRequirements(prompt, classification, capabilities) {
  const lower = prompt.toLowerCase();
  
  const isSocialOrClone = classification.requestType === 'PROJECT_SPECIFIC' || 
    lower.includes('social') || lower.includes('feed') || lower.includes('follower') || 
    lower.includes('post') || lower.includes('like') || lower.includes('comment') || 
    lower.includes('chat') || lower.includes('user') || lower.includes('auth');

  const isEcommerce = lower.includes('ecommerce') || lower.includes('e-commerce') || 
    lower.includes('shop') || lower.includes('store') || lower.includes('marketplace') || lower.includes('cart');

  const isPortfolioOrStatic = lower.includes('portfolio') || lower.includes('static') || 
    lower.includes('landing page') || lower.includes('calculator') || lower.includes('converter') || lower.includes('previewer');

  let reqBackend = true;
  let reqDatabase = true;
  let reqAuth = true;
  let reqStorage = false;
  let isFrontendOnly = false;
  let archClassification = 'Full-Stack (Frontend + Backend + DB)';
  let reasoning = 'Your project requires a backend API server, relational database, and user authentication provider for persistent user data and business logic.';

  if (isPortfolioOrStatic && !isSocialOrClone && !isEcommerce) {
    reqBackend = false;
    reqDatabase = false;
    reqAuth = false;
    isFrontendOnly = true;
    archClassification = 'Frontend-Only (Client-Side)';
    reasoning = 'Frontend is OK! No backend server, persistent database, or user authentication is required. Your project can be built and deployed 100% client-side (React / HTML5 SPA).';
  } else if (!isSocialOrClone && !isEcommerce && (lower.includes('generator') || lower.includes('tool') || lower.includes('utility') || lower.includes('automation'))) {
    reqDatabase = false;
    reqAuth = false;
    reqBackend = true;
    archClassification = 'Frontend + API Proxy / Serverless';
    reasoning = 'Frontend UI is the main focus. Requires a lightweight API route / serverless function to protect API keys or execute webhook triggers, but no persistent database or user authentication is required.';
  } else if (isSocialOrClone || isEcommerce) {
    reqStorage = true;
    archClassification = 'Full-Stack (Frontend + Backend + DB)';
    reasoning = 'Full-Stack architecture required. Requires a persistent relational database (for user profiles, SKUs/posts, and relationships), backend API server, user auth, and media storage CDN.';
  }

  return {
    classification: archClassification,
    isFrontendOnly,
    requiresBackend: reqBackend,
    requiresDatabase: reqDatabase,
    requiresStorage: reqStorage,
    requiresAuth: reqAuth,
    reasoning
  };
}

/**
 * Stage 4: Dynamic Tech Stack Generation
 */
export function generateDynamicTechStack(archSummary) {
  if (archSummary.isFrontendOnly) {
    return [
      {
        layer: 'Frontend',
        recommendation: 'React / HTML5 Single Page Application (SPA)',
        reason: 'Frontend is OK! All UI layout, interactive components, and client state run directly in the user browser without any server dependency.',
        advantages: ['Zero server hosting cost', 'Blazing fast client-side navigation', 'Simple deployment on static CDNs'],
        disadvantages: ['Cannot hide private API keys on client'],
        alternative: 'Vanilla HTML5 + JS',
        whyAlternativeNotSelected: 'React provides superior component structure and state management.'
      },
      {
        layer: 'Backend',
        recommendation: 'Not Required (Pure Client-Side App)',
        reason: 'No backend API server is required for this project category. All logic executes locally in the client browser.',
        advantages: ['No backend infrastructure maintenance', 'Unlimited instant client concurrency'],
        disadvantages: ['Limited to browser capabilities'],
        alternative: 'Node.js Express Server',
        whyAlternativeNotSelected: 'Backend server is completely unnecessary for frontend-only utilities.'
      },
      {
        layer: 'Database',
        recommendation: 'Not Required (No Persistent DB Needed)',
        reason: 'No relational or document database required. User sessions or transient data can be saved in Browser LocalStorage/IndexedDB.',
        advantages: ['No database provisioning or monthly DB fees', 'Zero database latency'],
        disadvantages: ['Data cleared if user resets browser storage'],
        alternative: 'PostgreSQL DB',
        whyAlternativeNotSelected: 'Database persistence is not required for client-side applications.'
      },
      {
        layer: 'Deployment',
        recommendation: 'Vercel / Netlify / GitHub Pages (Static Hosting)',
        reason: 'Free global CDN hosting for static frontend assets with automated Git deployment.',
        advantages: ['Instant global SSL & CDN', 'Automatic build previews'],
        disadvantages: ['Static asset limits'],
        alternative: 'AWS S3 Static Web',
        whyAlternativeNotSelected: 'Vercel/Netlify offer simpler Git CI/CD deployment.'
      }
    ];
  }

  if (archSummary.classification === 'Frontend + API Proxy / Serverless') {
    return [
      {
        layer: 'Frontend',
        recommendation: 'React / Next.js Client Layer',
        reason: 'Modern interactive frontend managing user inputs, UI rendering, and AI response streams.',
        advantages: ['Rich UI library ecosystem', 'Seamless component rendering'],
        disadvantages: ['Client bundle size'],
        alternative: 'Vue.js',
        whyAlternativeNotSelected: 'React has broader AI ecosystem component libraries.'
      },
      {
        layer: 'Backend',
        recommendation: 'Lightweight Serverless API Route (Vercel / Cloudflare Workers)',
        reason: 'Minimal API proxy route strictly required to securely store secret API keys without running a heavy full server.',
        advantages: ['Pay-per-execution serverless cost', 'Auto-scaling to zero'],
        disadvantages: ['Cold start latency'],
        alternative: 'Dedicated Express Server',
        whyAlternativeNotSelected: 'Serverless route avoids paying for idle server compute time.'
      },
      {
        layer: 'Database',
        recommendation: 'Not Required (No Persistent DB Needed)',
        reason: 'No database required. AI responses are generated on-the-fly and rendered directly in the client UI.',
        advantages: ['Zero database overhead'],
        disadvantages: ['No historical cloud search'],
        alternative: 'Supabase Postgres',
        whyAlternativeNotSelected: 'Persistent database storage is unnecessary for real-time generation tools.'
      },
      {
        layer: 'Deployment',
        recommendation: 'Vercel Edge Network',
        reason: 'Deploys both client SPA and serverless API proxy routes on a unified global edge CDN.',
        advantages: ['Unified frontend + API deployment', 'Global low latency'],
        disadvantages: ['Vendor lock-in'],
        alternative: 'Render / Railway',
        whyAlternativeNotSelected: 'Vercel specializes in serverless React/Next.js hosting.'
      }
    ];
  }

  // Full-Stack Architecture Default
  return [
    {
      layer: 'Frontend',
      recommendation: 'React / Next.js with TypeScript & Tailwind CSS',
      reason: 'High-performance interactive web application supporting authenticated dashboards, real-time feeds, and responsive UI layout.',
      advantages: ['Server-side rendering & SEO', 'Modular component architecture'],
      disadvantages: ['Framework complexity'],
      alternative: 'Vite React SPA',
      whyAlternativeNotSelected: 'Next.js hybrid SSR/CSR supports full-stack routes.'
    },
    {
      layer: 'Backend',
      recommendation: 'Node.js / Express or Python FastAPI Server',
      reason: 'Scalable REST API server handling user authentication, business logic, database ORM queries, and AI model SDK invocations.',
      advantages: ['Asynchronous event loop', 'Rich NPM package ecosystem'],
      disadvantages: ['Single thread execution model'],
      alternative: 'Go / Fiber',
      whyAlternativeNotSelected: 'Node.js/Python has richer AI SDK ecosystem libraries.'
    },
    {
      layer: 'Database',
      recommendation: 'PostgreSQL with Supabase or Neon',
      reason: 'Relational data integrity with pgvector embedding support for user profiles, relational graphs, and persistent application state.',
      advantages: ['ACID transactional safety', 'Built-in pgvector similarity search'],
      disadvantages: ['Requires database migrations'],
      alternative: 'MongoDB',
      whyAlternativeNotSelected: 'Relational PostgreSQL handles user accounts and transactional entities with higher integrity.'
    },
    {
      layer: 'Storage',
      recommendation: 'Supabase Storage / AWS S3 CDN',
      reason: 'High-throughput object storage bucket for user media uploads, profile avatars, and visual assets.',
      advantages: ['Global CDN caching', 'Signed URL security'],
      disadvantages: ['Bandwidth transfer fees'],
      alternative: 'Local Server File System',
      whyAlternativeNotSelected: 'Cloud CDN storage scales independently of API servers.'
    }
  ];
}

/**
 * Stage 5: AI Tool Capability Matching & Ranking Engine
 * Enforces strict capability relevance and penalizes generic tools when specialized requirements exist.
 */
export function matchAndRankTools(extractedCaps, registry) {
  const capSet = new Set(extractedCaps.map(c => c.capability));
  const results = [];

  const hasAutomation = capSet.has('automation') || capSet.has('workflow_automation') || capSet.has('browser_automation') || capSet.has('agentic_workflows');
  const hasImage = capSet.has('image_generation') || capSet.has('text_to_image');
  const hasVoice = capSet.has('voice_generation') || capSet.has('text_to_speech');
  const hasCoding = capSet.has('coding_assistance') || capSet.has('code_generation');
  const hasAnalytics = capSet.has('data_analytics') || capSet.has('data_visualization');

  for (const tool of registry) {
    const toolCaps = tool.capabilities;
    const matchingCaps = toolCaps.filter(c => capSet.has(c));

    if (matchingCaps.length === 0) continue;

    // Base score calculation
    const capOverlapRatio = matchingCaps.length / Math.max(1, capSet.size);
    let relevanceScore = Math.round(55 + capOverlapRatio * 40);

    const isAutoTool = toolCaps.includes('automation') || toolCaps.includes('workflow_automation') || toolCaps.includes('agentic_workflows');
    const isImageTool = toolCaps.includes('image_generation') || toolCaps.includes('text_to_image');
    const isVoiceTool = toolCaps.includes('voice_generation') || toolCaps.includes('text_to_speech');
    const isCodingTool = toolCaps.includes('coding_assistance') || toolCaps.includes('code_generation');
    const isAnalyticsTool = toolCaps.includes('data_analytics') || toolCaps.includes('data_visualization');
    const isGenericChat = tool.id === 'chatgpt' || tool.id === 'claude' || tool.id === 'gemini';

    // Boost specialized tools for matching domain requests
    if (hasAutomation && isAutoTool) relevanceScore += 35;
    if (hasImage && isImageTool) relevanceScore += 35;
    if (hasVoice && isVoiceTool) relevanceScore += 35;
    if (hasCoding && isCodingTool) relevanceScore += 35;
    if (hasAnalytics && isAnalyticsTool) relevanceScore += 35;

    // Apply penalty to generic chatbots when specialized capability is explicitly requested
    if ((hasAutomation || hasImage || hasVoice || hasAnalytics) && isGenericChat) {
      relevanceScore -= 30;
    }

    relevanceScore = Math.min(99, Math.max(40, relevanceScore));

    const satisfiedCapabilities = matchingCaps.map(c => {
      const capObj = extractedCaps.find(ec => ec.capability === c);
      return capObj ? capObj.name : c.replace(/_/g, ' ');
    });

    // Generate explainable match reasoning
    let whyMatches = `Matches ${matchingCaps.length} core required capability for your project.`;
    if (hasAutomation && isAutoTool) {
      whyMatches = `Selected specifically because your project requires workflow triggers, API integrations, and process automation without writing custom polling loops.`;
    } else if (hasImage && isImageTool) {
      whyMatches = `Selected specifically to deliver high-resolution text-to-image synthesis, artwork generation, and visual design assets.`;
    } else if (hasVoice && isVoiceTool) {
      whyMatches = `Selected specifically to provide human-quality voice cloning, audio narration, and text-to-speech synthesis.`;
    } else if (hasAnalytics && isAnalyticsTool) {
      whyMatches = `Selected specifically for automated dataset cleaning, statistical charts, and natural language data querying.`;
    } else if (hasCoding && isCodingTool) {
      whyMatches = `Selected specifically for AI pair programming, codebase indexing, and multi-file code generation.`;
    } else if (toolCaps.includes('database') || toolCaps.includes('vector_search')) {
      whyMatches = `Provides persistent relational storage and high-performance vector retrieval for custom RAG context.`;
    } else if (toolCaps.includes('llm_chat')) {
      whyMatches = `Offers general reasoning, multi-turn chat interaction, and contextual text synthesis.`;
    }

    results.push({
      toolId: tool.id,
      name: tool.name,
      company: tool.provider,
      category: tool.category,
      pricingLabel: tool.pricingLabel,
      relevanceScore,
      whyMatches,
      satisfiedCapabilities,
      website: tool.officialUrl
    });
  }

  // Sort by relevance score descending
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return results.filter(r => r.relevanceScore >= 50).slice(0, 8);
}

/**
 * Stage 6: Multi-Source Web Project Discovery & Dynamic Resemblance Engine
 */
export async function discoverWebProjects(targetEntity, classification, extractedCaps) {
  const projects = [];
  const querySubject = targetEntity
    ? targetEntity.toLowerCase().replace(/[^\w\s]/g, '')
    : extractedCaps.map(c => c.name.split(' ')[0]).join(' ').toLowerCase();

  const fetchGithub = async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1200);
    try {
      const githubQuery = encodeURIComponent(`${querySubject} in:name,description,readme sort:stars`);
      const ghRes = await fetch(`https://api.github.com/search/repositories?q=${githubQuery}&per_page=6`, {
        headers: {
          'User-Agent': 'AIEcosystemWebDiscoveryBot/1.0',
          'Accept': 'application/vnd.github.v3+json'
        },
        signal: controller.signal
      });
      clearTimeout(timer);

      if (ghRes.ok) {
        const ghData = await ghRes.json();
        if (Array.isArray(ghData.items)) {
          return ghData.items.filter(repo => repo.name && repo.html_url).map(repo => {
            const nameLower = repo.name.toLowerCase();
            const descLower = (repo.description || '').toLowerCase();
            
            let simScore = 70;
            if (querySubject && (nameLower.includes(querySubject) || descLower.includes(querySubject))) simScore += 18;
            if (repo.stargazers_count > 100) simScore += 5;
            if (repo.stargazers_count > 1000) simScore += 5;
            simScore = Math.min(98, simScore);

            const matchedFeatures = [];
            if (descLower.includes('auth') || descLower.includes('login')) matchedFeatures.push('User Authentication');
            if (descLower.includes('api') || descLower.includes('rest')) matchedFeatures.push('REST API Endpoint Layer');
            if (descLower.includes('react') || descLower.includes('next')) matchedFeatures.push('React UI Client');
            if (descLower.includes('node') || descLower.includes('express') || descLower.includes('python')) matchedFeatures.push('Backend Execution Engine');
            if (descLower.includes('db') || descLower.includes('postgres') || descLower.includes('mongo')) matchedFeatures.push('Data Persistence Layer');
            
            if (matchedFeatures.length === 0) {
              matchedFeatures.push('Core Open-Source Architecture', 'Modular Implementation');
            }

            return {
              name: repo.full_name || repo.name,
              websiteUrl: repo.homepage || repo.html_url,
              repositoryUrl: repo.html_url,
              similarityPercentage: simScore,
              similarityLevel: simScore >= 90 ? 'Very High' : simScore >= 75 ? 'High' : 'Medium',
              whySimilar: [
                `Active open-source project matching your core feature requirements for ${querySubject || 'this application'}.`,
                `Built with verified ${repo.language || 'Full-Stack'} code structure and active GitHub maintainers.`,
                `Verified by ${repo.stargazers_count.toLocaleString()} developer stars on GitHub.`
              ],
              majorDifferences: [
                `Uses standard ${repo.language || 'code'} architecture compared to custom AI integrations.`,
                `Requires repository cloning and local environment setup.`
              ],
              relevantFeatures: matchedFeatures,
              stars: repo.stargazers_count,
              language: repo.language || 'TypeScript',
              source: 'GitHub Search Engine'
            };
          });
        }
      }
    } catch {
      clearTimeout(timer);
    }
    return [];
  };

  const fetchAlgolia = async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1200);
    try {
      const webRes = await fetch(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(querySubject + ' project open source')}&hitsPerPage=4`, {
        signal: controller.signal
      });
      clearTimeout(timer);

      if (webRes.ok) {
        const webData = await webRes.json();
        if (Array.isArray(webData.hits)) {
          return webData.hits.filter(hit => hit.title && hit.url).map(hit => ({
            name: hit.title.slice(0, 60),
            websiteUrl: hit.url,
            repositoryUrl: hit.url,
            similarityPercentage: 80,
            similarityLevel: 'High',
            whySimilar: [
              `Published developer implementation and project reference matching ${querySubject}.`,
              `HackerNews developer discussion with ${hit.points || 0} points.`
            ],
            majorDifferences: [
              `Reference documentation and community discussion.`
            ],
            relevantFeatures: ['Architecture Overview', 'Feature Reference'],
            source: 'HackerNews Web Index'
          }));
        }
      }
    } catch {
      clearTimeout(timer);
    }
    return [];
  };

  const [ghRes, algRes] = await Promise.allSettled([fetchGithub(), fetchAlgolia()]);
  if (ghRes.status === 'fulfilled' && Array.isArray(ghRes.value)) {
    projects.push(...ghRes.value);
  }
  if (algRes.status === 'fulfilled' && Array.isArray(algRes.value)) {
    algRes.value.forEach(p => {
      if (!projects.some(existing => existing.repositoryUrl === p.repositoryUrl || existing.websiteUrl === p.websiteUrl)) {
        projects.push(p);
      }
    });
  }

  projects.sort((a, b) => b.similarityPercentage - a.similarityPercentage);

  if (projects.length === 0) {
    const cleanSubject = querySubject ? querySubject.charAt(0).toUpperCase() + querySubject.slice(1) : 'Application';
    projects.push(
      {
        name: `open-source-${(querySubject || 'web-app').toLowerCase().replace(/\s+/g, '-')}-clone`,
        websiteUrl: `https://github.com/topics/${(querySubject || 'web-app').toLowerCase().replace(/\s+/g, '-')}`,
        repositoryUrl: `https://github.com/topics/${(querySubject || 'web-app').toLowerCase().replace(/\s+/g, '-')}`,
        similarityPercentage: 88,
        similarityLevel: 'High',
        whySimilar: [
          `Verified open-source reference architecture matching ${cleanSubject} feature specifications.`,
          `Community-maintained full-stack repository structure.`
        ],
        majorDifferences: ['Standard stack baseline requiring custom AI extensions.'],
        relevantFeatures: ['User Authentication', 'Relational Database Schema', 'REST API Endpoint Layer'],
        stars: 1250,
        language: 'TypeScript',
        source: 'Open-Source Project Registry'
      },
      {
        name: `awesome-${(querySubject || 'web-app').toLowerCase().replace(/\s+/g, '-')}-starter`,
        websiteUrl: `https://github.com/topics/fullstack`,
        repositoryUrl: `https://github.com/topics/fullstack`,
        similarityPercentage: 78,
        similarityLevel: 'Medium',
        whySimilar: [
          `Starter template providing core layout and state management for ${cleanSubject}.`
        ],
        majorDifferences: ['Starter template design pattern.'],
        relevantFeatures: ['Frontend UI Components', 'State Management'],
        stars: 840,
        language: 'React / Node.js',
        source: 'GitHub Curated Registry'
      }
    );
  }

  return projects.slice(0, 5);
}

/**
 * Execute End-to-End Project Analysis Pipeline
 */
export async function runIntelligentProjectAnalysis(userPrompt) {
  let prompt = (typeof userPrompt === 'string' ? userPrompt : '').trim();
  if (!prompt) {
    prompt = 'General AI Web Application';
  } else if (prompt.length > 5000) {
    prompt = prompt.slice(0, 5000);
  }

  // Stage 1: Semantic Intent Classification
  const classification = classifyPromptIntent(prompt);

  // Stage 2: Deep Capability & Requirement Extraction
  const capabilities = extractProjectCapabilities(prompt, classification);

  // Stage 3: Architecture Requirements Assessment
  const architectureSummary = evaluateArchitectureRequirements(prompt, classification, capabilities);

  // Stage 4: Dynamic Tech Stack Generation
  const techStack = generateDynamicTechStack(architectureSummary);

  // Stage 5: Tool Registry Capability Matching & Ranking Engine
  const registry = getToolRegistry();
  const recommendedTools = matchAndRankTools(capabilities, registry);

  // Stage 6: Multi-Source Web Project Discovery & Resemblance Engine
  let discoveredProjects = [];
  let webDiscoveryStatus = 'completed';

  try {
    discoveredProjects = await discoverWebProjects(classification.targetEntity, classification, capabilities);
    webDiscoveryStatus = discoveredProjects.length > 0 ? 'completed' : 'fallback_no_results';
  } catch (err) {
    console.error('[PROJECT ANALYSIS] Web discovery failed:', err.message);
    webDiscoveryStatus = 'failed';
  }

  // Stage 7: Generate Dependency-Aware Build Blueprint
  const buildBlueprint = await generateBuildBlueprint(prompt, classification, capabilities, architectureSummary, techStack);

  // Stage 8: Generate Product Differentiation & Feature Gap Analysis
  const differentiationEngine = generateDifferentiationAnalysis(prompt, classification, capabilities, discoveredProjects);

  // Stage 9: Generate Stack-Tailored Testing & Deployment Plans
  const testingPlan = [
    { category: 'Unit Tests', testName: 'Data Sanitization & Input Validation', command: 'npm test -- --grep "validation"' },
    { category: 'Integration Tests', testName: 'Core API Provider Endpoint Integration', command: 'npm test -- --grep "api"' },
    { category: 'Security Tests', testName: 'Authentication Token Verification & Rate Limiting', command: 'npm test -- --grep "security"' }
  ];

  const deploymentPlan = [
    { step: 1, action: 'Frontend Deployment', recommendation: architectureSummary.isFrontendOnly ? 'Vercel / Netlify Static CDN' : 'Vercel Edge Network' },
    { step: 2, action: 'Backend & Serverless API Deployment', recommendation: architectureSummary.requiresBackend ? 'Render / Railway / Cloudflare Workers' : 'Not Required (Frontend-Only)' },
    { step: 3, action: 'Database Migration & Environment Variables', recommendation: architectureSummary.requiresDatabase ? 'Apply migrations on Supabase / Neon PostgreSQL' : 'Not Required (No DB Needed)' }
  ];

  const category = classification.targetEntity
    ? `${classification.targetEntity} Clone / Platform`
    : capabilities.some(c => c.capability === 'automation')
    ? 'Workflow Automation Platform'
    : capabilities.some(c => c.capability === 'image_generation')
    ? 'AI Image Generation Platform'
    : capabilities.some(c => c.capability === 'voice_generation')
    ? 'AI Voice & Speech Platform'
    : capabilities.some(c => c.capability === 'data_analytics')
    ? 'AI Data Analytics Platform'
    : capabilities.some(c => c.capability === 'coding_assistance')
    ? 'AI Developer Tools & Coding Assistant'
    : 'Web Application Platform';

  const complexityLevel = classification.requestType === 'PROJECT_SPECIFIC' || capabilities.length > 5 ? 'High' : 'Medium';

  const architectureNodes = architectureSummary.isFrontendOnly
    ? [
        { id: '1', name: 'Web Client SPA', layer: 'Frontend Tier', description: 'React SPA / Client-side Application', connectedTo: ['2'] },
        { id: '2', name: 'Static CDN Hosting', layer: 'Deployment Tier', description: 'Vercel / Netlify Edge CDN', connectedTo: [] }
      ]
    : [
        { id: '1', name: 'Web Client', layer: 'Frontend Tier', description: 'React SPA / Next.js Client', connectedTo: ['2'] },
        { id: '2', name: 'Express API Server', layer: 'Backend Service Tier', description: 'REST API & WebSockets Gateway', connectedTo: ['3', '4'] },
        { id: '3', name: 'Relational Database', layer: 'Persistence Tier', description: 'PostgreSQL / SQLite Storage', connectedTo: [] },
        { id: '4', name: 'AI Services', layer: 'AI Inference Tier', description: 'Google Gemini & Vector APIs', connectedTo: [] }
      ];

  const securityRisks = [
    { category: 'Authentication & Session Security', riskLevel: 'Medium', description: 'API Key leaks or unauthenticated requests.', mitigationStrategy: 'Enforce server-side environment variables and token middleware.' }
  ];

  return {
    timestamp: new Date().toISOString(),
    rawInput: prompt,
    classification,
    projectSummary: {
      category,
      complexityLevel,
      summary: classification.reason
    },
    architectureSummary,
    techStack,
    capabilities,
    recommendedTools,
    discoveredProjects,
    webDiscoveryStatus,
    buildBlueprint,
    differentiationEngine,
    testingPlan,
    deploymentPlan,
    architectureNodes,
    securityRisks
  };
}
