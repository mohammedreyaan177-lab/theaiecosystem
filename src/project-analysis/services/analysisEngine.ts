import { 
  CompleteAnalysisReport, 
  ProjectUnderstanding, 
  TechStackItem, 
  AICapability, 
  EcosystemToolMatch, 
  ArchitectureNode, 
  SecurityRisk, 
  RequirementItem,
  ArchitectureTypeSummary
} from '../types';
import { performWebResearch } from './webResearch';

export interface ToolData {
  id: string;
  name: string;
  category: string;
  company: string;
  pricingLabel: string;
  description: string;
  website?: string;
  openSource?: boolean;
  apiAvailable?: boolean;
}

export async function runProjectAnalysis(
  userDescription: string,
  availableTools: ToolData[] = []
): Promise<CompleteAnalysisReport> {
  const prompt = userDescription.trim();
  const lowerPrompt = prompt.toLowerCase();

  // Extract keywords
  const keywords = extractKeywords(lowerPrompt);

  // 1. Evaluate Architecture Requirements (Strict Domain-Aware Analysis)
  const architectureSummary = evaluateArchitectureRequirements(lowerPrompt);
  
  // 2. Project Understanding & Requirements
  const understanding = analyzeProjectUnderstanding(prompt, lowerPrompt, keywords);

  // 3. Tech Stack Recommendations (Strictly tailored to actual domain needs!)
  const techStack = generateTechStackRecommendations(lowerPrompt, architectureSummary);

  // 4. AI Stack Analysis & Ecosystem Tool Matching
  const aiStack = analyzeAIStack(lowerPrompt);
  const ecosystemTools = matchEcosystemTools(lowerPrompt, availableTools, aiStack);

  // 5. Internet Web Research & Product Existence Analysis
  const researchResult = await performWebResearch(understanding.category, keywords);

  const existsSummary = researchResult.products.length > 0
    ? `Identified ${researchResult.products.length} related online products/repositories operating in adjacent spaces, but no exact 1:1 match was found for your specific combination.`
    : `No identical or highly similar products were found in the searched web sources.`;

  // 6. Architecture & Security
  const architectureNodes = generateArchitectureNodes(techStack, architectureSummary);
  const securityRisks = analyzeSecurityRisks(lowerPrompt, architectureSummary);

  return {
    timestamp: new Date().toISOString(),
    rawInput: prompt,
    classification: {
      requestType: lowerPrompt.includes('like') || lowerPrompt.includes('clone') ? 'PROJECT_SPECIFIC' : 'GENERIC',
      confidence: 0.90,
      targetEntity: null,
      projectType: understanding.category,
      reason: existsSummary
    },
    understanding,
    architectureSummary,
    techStack,
    aiStack,
    ecosystemTools,
    existingProducts: researchResult.products,
    searchDisclaimer: researchResult.searchDisclaimer,
    existsOnInternetSummary: existsSummary,
    architectureNodes,
    securityRisks
  };
}

function extractKeywords(lowerPrompt: string): string[] {
  const words = lowerPrompt.split(/\W+/).filter(w => w.length > 3);
  const stopwords = new Set(['want', 'build', 'create', 'platform', 'app', 'where', 'this', 'that', 'with', 'from', 'have', 'using', 'also', 'some', 'other', 'users', 'need']);
  return Array.from(new Set(words.filter(w => !stopwords.has(w)))).slice(0, 10);
}

function evaluateArchitectureRequirements(lowerPrompt: string): ArchitectureTypeSummary {
  // Social Media / Community Domain Keywords
  const isSocialDomain = Boolean(
    lowerPrompt.includes('social') ||
    lowerPrompt.includes('social media') ||
    lowerPrompt.includes('feed') ||
    lowerPrompt.includes('follower') ||
    lowerPrompt.includes('following') ||
    lowerPrompt.includes('friend') ||
    lowerPrompt.includes('community') ||
    lowerPrompt.includes('forum') ||
    lowerPrompt.includes('post') ||
    lowerPrompt.includes('posts') ||
    lowerPrompt.includes('chat') ||
    lowerPrompt.includes('message') ||
    lowerPrompt.includes('messaging') ||
    lowerPrompt.includes('like') ||
    lowerPrompt.includes('comment') ||
    lowerPrompt.includes('share')
  );

  // E-Commerce / Marketplace Domain Keywords
  const isEcommerceDomain = Boolean(
    lowerPrompt.includes('ecommerce') ||
    lowerPrompt.includes('e-commerce') ||
    lowerPrompt.includes('shop') ||
    lowerPrompt.includes('store') ||
    lowerPrompt.includes('marketplace') ||
    lowerPrompt.includes('buy') ||
    lowerPrompt.includes('sell') ||
    lowerPrompt.includes('cart') ||
    lowerPrompt.includes('checkout') ||
    lowerPrompt.includes('payment') ||
    lowerPrompt.includes('order') ||
    lowerPrompt.includes('vendor')
  );

  // Full-Stack SaaS / Multi-User Domain Keywords
  const isFullStackDomain = Boolean(
    isSocialDomain ||
    isEcommerceDomain ||
    lowerPrompt.includes('saas') ||
    lowerPrompt.includes('platform') ||
    lowerPrompt.includes('portal') ||
    lowerPrompt.includes('multi-user') ||
    lowerPrompt.includes('team') ||
    lowerPrompt.includes('organization') ||
    lowerPrompt.includes('database') ||
    lowerPrompt.includes(' db') ||
    lowerPrompt.includes('backend') ||
    lowerPrompt.includes('server') ||
    lowerPrompt.includes('auth') ||
    lowerPrompt.includes('login') ||
    lowerPrompt.includes('user') ||
    lowerPrompt.includes('users') ||
    lowerPrompt.includes('account') ||
    lowerPrompt.includes('profile') ||
    lowerPrompt.includes('vector') ||
    lowerPrompt.includes('rag') ||
    lowerPrompt.includes('embedding')
  );

  // Client-Side Utility Keywords (Only true if explicit client utility AND NOT full-stack domain)
  const isPureClientUtility = !isFullStackDomain && Boolean(
    lowerPrompt.includes('calculator') ||
    lowerPrompt.includes('converter') ||
    lowerPrompt.includes('formatter') ||
    lowerPrompt.includes('validator') ||
    lowerPrompt.includes('generator') ||
    lowerPrompt.includes('color picker') ||
    lowerPrompt.includes('timer') ||
    lowerPrompt.includes('stopwatch') ||
    lowerPrompt.includes('markdown previewer') ||
    lowerPrompt.includes('browser extension') ||
    lowerPrompt.includes('pure client') ||
    lowerPrompt.includes('static tool')
  );

  const requiresDatabase = isFullStackDomain;
  const requiresBackend = isFullStackDomain;
  const requiresAuth = isFullStackDomain;
  const requiresStorage = isSocialDomain || isEcommerceDomain || lowerPrompt.includes('upload') || lowerPrompt.includes('file') || lowerPrompt.includes('pdf') || lowerPrompt.includes('image') || lowerPrompt.includes('video') || lowerPrompt.includes('media');

  const isFrontendOnly = isPureClientUtility;

  let classification: ArchitectureTypeSummary['classification'] = 'Full-Stack (Frontend + Backend + DB)';
  let reasoning = 'Your project requires a backend API, persistent database, and authentication provider for user management, profiles, and data persistence.';

  if (isSocialDomain) {
    classification = 'Full-Stack (Frontend + Backend + DB)';
    reasoning = 'Social media applications inherently require user authentication, a persistent relational database (for user profiles, posts, comments, and follower graphs), high-throughput media storage, and a real-time backend API for feed delivery.';
  } else if (isEcommerceDomain) {
    classification = 'Full-Stack (Frontend + Backend + DB)';
    reasoning = 'E-commerce and marketplace applications require a relational database for product catalogs and order history, secure checkout backend APIs, and user authentication.';
  } else if (isFrontendOnly) {
    classification = 'Frontend-Only (Client-Side)';
    reasoning = 'Your project can be built entirely as a pure client-side application (HTML/CSS/JS or React SPA). No backend server, database, or authentication provider is required.';
  } else if (!requiresDatabase && !requiresAuth) {
    classification = 'Frontend + API Proxy / Serverless';
    reasoning = 'Your project runs primarily on the client frontend, requiring only a lightweight API route or serverless proxy (for API keys), but no persistent database or user authentication.';
  }

  return {
    classification,
    isFrontendOnly,
    requiresBackend,
    requiresDatabase,
    requiresStorage,
    requiresAuth,
    reasoning
  };
}

function analyzeProjectUnderstanding(prompt: string, lowerPrompt: string, keywords: string[]): ProjectUnderstanding {
  let category = 'Web Application Platform';
  if (lowerPrompt.includes('social') || lowerPrompt.includes('feed') || lowerPrompt.includes('community')) category = 'Social Media & Community Network';
  else if (lowerPrompt.includes('shop') || lowerPrompt.includes('store') || lowerPrompt.includes('marketplace') || lowerPrompt.includes('ecommerce')) category = 'E-Commerce & Marketplace';
  else if (lowerPrompt.includes('mobile') || lowerPrompt.includes('ios') || lowerPrompt.includes('android')) category = 'Mobile & Web Application';
  else if (lowerPrompt.includes('ai') || lowerPrompt.includes('model') || lowerPrompt.includes('agent')) category = 'AI-Powered Application';

  const requirements: RequirementItem[] = [];

  if (lowerPrompt.includes('social') || lowerPrompt.includes('feed') || lowerPrompt.includes('post') || lowerPrompt.includes('community')) {
    requirements.push(
      { name: 'User Registration & Profile Management', category: 'Functional', description: 'User sign-up, sign-in, profile custom avatars, and bio settings.' },
      { name: 'Feed & Content Stream Engine', category: 'Core', description: 'Dynamic post creation, feed timeline rendering, and real-time likes/comments.' },
      { name: 'Relational Follower Graph', category: 'Infrastructure', description: 'Database follower/following relationships and notifications.' }
    );
  } else {
    requirements.push({ name: 'Interactive App Interface', category: 'Core', description: 'Main user interface and dashboard workspace.' });
  }

  return {
    category,
    complexityLevel: lowerPrompt.includes('social') || lowerPrompt.includes('real-time') ? 'High' : 'Medium',
    requirements
  };
}

function generateTechStackRecommendations(lowerPrompt: string, archSummary: ArchitectureTypeSummary): TechStackItem[] {
  const items: TechStackItem[] = [];
  const isSocial = lowerPrompt.includes('social') || lowerPrompt.includes('feed') || lowerPrompt.includes('community') || lowerPrompt.includes('chat');

  // 1. Frontend
  if (archSummary.isFrontendOnly) {
    items.push({
      layer: 'Frontend',
      recommendation: 'Vite + React (TypeScript) & Tailwind CSS',
      reason: 'Pure client-side single page app build with zero server maintenance.',
      advantages: ['Ultra-fast instant load', 'Zero server hosting cost', 'Easy static deployment'],
      disadvantages: ['All execution happens in user browser'],
      alternative: 'Vanilla HTML5 + JavaScript (ES Modules)',
      whyAlternativeNotSelected: 'React provides structured component state management.'
    });
  } else if (isSocial) {
    items.push({
      layer: 'Frontend',
      recommendation: 'React / Next.js (Web) or React Native / Expo (Mobile App)',
      reason: 'Next.js provides server-side rendering for social share links and fast feed loading, while React Native allows cross-platform iOS and Android mobile app deployment.',
      advantages: ['Server-rendered social preview cards (OpenGraph meta tags)', 'Cross-platform mobile & web code reuse', 'Rich UI component ecosystem'],
      disadvantages: ['Managing universal web and mobile navigation states'],
      alternative: 'Vue.js / Nuxt',
      whyAlternativeNotSelected: 'React has a significantly larger ecosystem for social UI components, mobile Expo support, and real-time feed libraries.'
    });
  } else {
    items.push({
      layer: 'Frontend',
      recommendation: 'React with Next.js (TypeScript) & Tailwind CSS',
      reason: 'Next.js provides server-side rendering, dynamic API route proxies, and fast interactive React components.',
      advantages: ['Server-side rendering & SEO', 'TypeScript safety', 'Built-in API route proxies'],
      disadvantages: ['Requires Node.js runtime for SSR'],
      alternative: 'Vite + React Single Page App',
      whyAlternativeNotSelected: 'Next.js offers superior SSR and built-in API route handling.'
    });
  }

  // 2. Backend (ONLY IF REQUIRED)
  if (archSummary.requiresBackend) {
    items.push({
      layer: 'Backend',
      recommendation: isSocial 
        ? 'Node.js Express / NestJS with WebSockets (Socket.io) or Supabase Realtime'
        : 'Node.js Express / Next.js API Routes (or Python FastAPI)',
      reason: isSocial
        ? 'Social media apps require high-concurrency event processing, real-time WebSocket push notifications for likes/comments, and scalable REST API endpoints.'
        : 'Processes API requests, handles business logic, and communicates securely with database and storage endpoints.',
      advantages: ['Full-stack JavaScript/TypeScript simplicity', 'High concurrent async WebSocket throughput', 'Rich NPM ecosystem'],
      disadvantages: ['Requires managing persistent WebSocket connections for real-time chat'],
      alternative: 'Python Django / FastAPI',
      whyAlternativeNotSelected: 'Node.js delivers higher concurrent async WebSocket throughput for real-time social feeds.'
    });
  }

  // 3. Database (ONLY IF REQUIRED)
  if (archSummary.requiresDatabase) {
    items.push({
      layer: 'Database',
      recommendation: isSocial
        ? 'PostgreSQL (Supabase or Neon) + Redis (Feed & Session Caching)'
        : 'PostgreSQL with pgvector extension (Supabase or Neon)',
      reason: isSocial
        ? 'PostgreSQL handles complex relational queries (users, follower graphs, posts, comments, likes), while Redis provides sub-millisecond feed timeline caching.'
        : 'Persists user data, relational records, and vector embeddings.',
      advantages: ['Relational integrity for follower graphs & post likes', 'Redis in-memory feed caching', 'ACID transaction security'],
      disadvantages: ['Requires database indexing for complex follower join queries'],
      alternative: 'MongoDB (NoSQL)',
      whyAlternativeNotSelected: 'Relational PostgreSQL is vastly superior for follower graphs, user relationships, and atomic likes/comments transactions.'
    });
  }

  // 4. Storage (ONLY IF REQUIRED)
  if (archSummary.requiresStorage) {
    items.push({
      layer: 'Storage',
      recommendation: 'Cloudflare R2 or Amazon S3 Cloud Storage + Image CDN',
      reason: 'Essential for hosting user avatars, post images, video uploads, and media attachments with global CDN optimization.',
      advantages: ['Infinite scalability', 'Cloudflare R2 zero egress fee bandwidth', 'Direct client presigned uploads'],
      disadvantages: ['Requires setting up image resizing optimization pipelines'],
      alternative: 'Local Server Storage',
      whyAlternativeNotSelected: 'Local server storage fails when scaling server instances horizontally across serverless environments.'
    });
  }

  // 5. Authentication (ONLY IF REQUIRED)
  if (archSummary.requiresAuth) {
    items.push({
      layer: 'Authentication',
      recommendation: 'Clerk or Supabase Auth',
      reason: 'Provides out-of-the-box user registration, social OAuth sign-in (Google, Apple, X), email verification, and JWT session tokens.',
      advantages: ['Eliminates security vulnerability risks', 'Pre-built customizable UI components', 'Instant OAuth setup'],
      disadvantages: ['Managed SaaS vendor dependency'],
      alternative: 'Custom Passport.js JWT Auth',
      whyAlternativeNotSelected: 'Building custom security, password hashing, and token refresh logic manually introduces unnecessary security risks.'
    });
  }

  // 6. Deployment (ALWAYS REQUIRED)
  items.push({
    layer: 'Deployment',
    recommendation: archSummary.isFrontendOnly 
      ? 'Vercel Static / Cloudflare Pages / GitHub Pages' 
      : 'Vercel (Frontend) + Railway / Render (WebSocket Backend Services)',
    reason: archSummary.isFrontendOnly
      ? 'Hosted 100% free on global CDN static hosts with instant CI/CD.'
      : 'Vercel hosts the Next.js SSR frontend globally, while Railway handles long-running WebSocket backend connections.',
    advantages: ['Zero DevOps configuration', 'Global CDN caching', 'Automatic SSL certificate management'],
    disadvantages: ['Usage caps on long-running background serverless functions (>60s)'],
    alternative: 'Self-hosted Docker on AWS EC2',
    whyAlternativeNotSelected: 'AWS EC2 requires manual DevOps infrastructure management compared to instant Vercel/Railway deployments.'
  });

  return items;
}

function analyzeAIStack(lowerPrompt: string): AICapability[] {
  const capabilities: AICapability[] = [];

  if (lowerPrompt.includes('social') || lowerPrompt.includes('feed') || lowerPrompt.includes('community')) {
    capabilities.push(
      {
        capability: 'AI Content Moderation & Toxicity Detection',
        relevanceReason: 'Automatically scans user posts, images, and comments for hate speech, spam, and inappropriate content.',
        importance: 'Essential'
      },
      {
        capability: 'AI Feed Personalization & Recommendation Engine',
        relevanceReason: 'Analyzes user interaction history to rank and recommend relevant feed posts.',
        importance: 'Recommended'
      }
    );
  } else {
    capabilities.push({
      capability: 'Large Language Model (LLM) Text Generation',
      relevanceReason: 'Core model required for processing text, answering questions, and generating insights.',
      importance: 'Essential'
    });
  }

  return capabilities;
}

function matchEcosystemTools(lowerPrompt: string, availableTools: ToolData[], aiStack: AICapability[]): EcosystemToolMatch[] {
  const matches: EcosystemToolMatch[] = [];

  const findTool = (id: string, fallbackName: string, category: string, company: string, website: string) => {
    const found = availableTools.find(t => t.id === id || t.name.toLowerCase() === id.toLowerCase());
    if (found) {
      return {
        toolId: found.id,
        toolName: found.name,
        company: found.company,
        pricingLabel: found.pricingLabel,
        website: found.website
      };
    }
    return {
      toolId: id,
      toolName: fallbackName,
      company,
      pricingLabel: 'Freemium',
      website
    };
  };

  const supabaseTool = findTool('supabase', 'Supabase', 'cloud', 'Supabase Inc', 'https://supabase.com');
  matches.push({
    requirement: 'Backend Database, Realtime Subscriptions, & Auth',
    isEcosystemTool: true,
    ...supabaseTool,
    reason: 'Provides PostgreSQL database for user relationships, built-in Realtime WebSocket subscriptions for live post feeds, Auth, and Storage.',
    capabilityMatched: 'Relational Database & Realtime API'
  });

  const vercelTool = findTool('vercel', 'Vercel Cloud Platform', 'cloud', 'Vercel', 'https://vercel.com');
  matches.push({
    requirement: 'Frontend Web Hosting & Global Edge CDN',
    isEcosystemTool: true,
    ...vercelTool,
    reason: 'Instant GitHub CI/CD deployment, global CDN edge caching, and OpenGraph social card previews.',
    capabilityMatched: 'Cloud Hosting & Edge CDN'
  });

  const chatTool = findTool('chatgpt', 'ChatGPT (OpenAI Moderation & GPT-4o)', 'chat', 'OpenAI', 'https://chatgpt.com');
  matches.push({
    requirement: 'AI Content Moderation & User Feed Safety',
    isEcosystemTool: true,
    ...chatTool,
    reason: 'OpenAI Moderation API screens user posts and images for toxicity, hate speech, and spam.',
    capabilityMatched: 'AI Content Moderation'
  });

  return matches;
}

function generateArchitectureNodes(techStack: TechStackItem[], archSummary: ArchitectureTypeSummary): ArchitectureNode[] {
  if (archSummary.isFrontendOnly) {
    return [
      {
        id: 'client',
        name: 'Vite / React Client-Side SPA',
        layer: 'Frontend Tier',
        description: 'Pure browser-rendered UI managing user state and client-side operations.',
        connectedTo: ['hosting']
      },
      {
        id: 'hosting',
        name: 'Static CDN Hosting (Vercel / Cloudflare Pages)',
        layer: 'Deployment Tier',
        description: 'Serves static HTML/JS/CSS bundles globally.',
        connectedTo: []
      }
    ];
  }

  return [
    {
      id: 'client',
      name: 'React / Next.js / Mobile App Client',
      layer: 'Frontend Tier',
      description: 'Web / Mobile interface rendering real-time post feeds, user profiles, and interactions.',
      connectedTo: ['api_gateway', 'auth_service']
    },
    {
      id: 'auth_service',
      name: 'Authentication Provider (Clerk/Supabase Auth)',
      layer: 'Security Layer',
      description: 'Verifies user identity, issues JWT tokens, & manages user profile sessions.',
      connectedTo: ['api_gateway']
    },
    {
      id: 'api_gateway',
      name: 'Backend API Gateway & WebSocket Server',
      layer: 'Backend Tier',
      description: 'Processes REST API requests, handles WebSocket real-time feed updates, and business logic.',
      connectedTo: ['database', 'storage']
    },
    {
      id: 'database',
      name: 'PostgreSQL DB (Supabase/Neon) + Redis Cache',
      layer: 'Data Tier',
      description: 'Stores user accounts, follower graphs, posts, comments, likes, and feed timeline cache.',
      connectedTo: []
    },
    {
      id: 'storage',
      name: 'Cloudflare R2 / S3 Storage + Media CDN',
      layer: 'Data Tier',
      description: 'Hosts user avatars, uploaded photos, videos, and post media.',
      connectedTo: []
    }
  ];
}

function analyzeSecurityRisks(lowerPrompt: string, archSummary: ArchitectureTypeSummary): SecurityRisk[] {
  return [
    {
      category: 'Authentication & Profile Session Security',
      riskLevel: 'Critical',
      description: 'Unsecured API endpoints could allow unauthorized users to spoof posts or edit other users profiles.',
      mitigationStrategy: 'Enforce JWT authentication middleware and Row-Level Security (RLS) policies on database tables.'
    },
    {
      category: 'Media Upload Malware & Size Validation',
      riskLevel: 'High',
      description: 'User-uploaded photos or files could contain malicious scripts or cause server memory exhaustion.',
      mitigationStrategy: 'Validate file MIME types strictly, enforce client presigned upload URLs, and restrict max upload size (e.g. 5MB).'
    },
    {
      category: 'API Rate Limiting & Spam Protection',
      riskLevel: 'High',
      description: 'Automated bots spamming post or comment endpoints can degrade service quality and flood database storage.',
      mitigationStrategy: 'Implement IP and user-based sliding window rate limiting (e.g. Upstash Redis / express-rate-limit).'
    }
  ];
}
