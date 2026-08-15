/**
 * Product Differentiation & Feature Gap Analysis Engine
 * Compares user project against discovered web/GitHub projects.
 */

export function generateDifferentiationAnalysis(userPrompt, classification, capabilities, discoveredProjects) {
  const lower = userPrompt.toLowerCase();

  const isSocial = classification.targetEntity === 'Instagram' || lower.includes('social') || lower.includes('feed');
  const isImage = capabilities.some(c => c.capability === 'image_generation');
  const isVoice = capabilities.some(c => c.capability === 'voice_generation');
  const isAuto = capabilities.some(c => c.capability === 'automation');
  const isAnalytics = capabilities.some(c => c.capability === 'data_analytics');

  // 1. Generate Feature Comparison Matrix
  const matrix = [];

  // Standard Baseline Features
  if (isSocial) {
    matrix.push(
      { feature: 'User Auth & Profiles', existingProjectsHas: true, userProjectHas: true, status: 'Baseline Feature' },
      { feature: 'Media Post Feed', existingProjectsHas: true, userProjectHas: true, status: 'Baseline Feature' },
      { feature: 'Likes & Comments', existingProjectsHas: true, userProjectHas: true, status: 'Baseline Feature' },
      { feature: 'AI Personalized Feed', existingProjectsHas: false, userProjectHas: true, status: '🔥 Key Differentiator' },
      { feature: 'AI Content Creation Assistant', existingProjectsHas: false, userProjectHas: true, status: '🔥 Key Differentiator' },
      { feature: 'Privacy-First Recommendation Graph', existingProjectsHas: false, userProjectHas: true, status: '🔥 Key Differentiator' }
    );
  } else if (isImage) {
    matrix.push(
      { feature: 'Text-to-Image Generation', existingProjectsHas: true, userProjectHas: true, status: 'Baseline Feature' },
      { feature: 'Image Preview & Download', existingProjectsHas: true, userProjectHas: true, status: 'Baseline Feature' },
      { feature: 'AI Style Memory & Persona Preset', existingProjectsHas: false, userProjectHas: true, status: '🔥 Key Differentiator' },
      { feature: 'Smart Prompt Auto-Enhancer', existingProjectsHas: false, userProjectHas: true, status: '🔥 Key Differentiator' },
      { feature: 'Side-by-Side Generation Comparison', existingProjectsHas: false, userProjectHas: true, status: '🔥 Key Differentiator' }
    );
  } else if (isAuto) {
    matrix.push(
      { feature: 'Webhook Event Triggers', existingProjectsHas: true, userProjectHas: true, status: 'Baseline Feature' },
      { feature: 'API Action Execution', existingProjectsHas: true, userProjectHas: true, status: 'Baseline Feature' },
      { feature: 'Visual Workflow Builder', existingProjectsHas: true, userProjectHas: true, status: 'Baseline Feature' },
      { feature: 'Autonomous AI Agent Nodes', existingProjectsHas: false, userProjectHas: true, status: '🔥 Key Differentiator' },
      { feature: 'Self-Healing Retry Loops', existingProjectsHas: false, userProjectHas: true, status: '🔥 Key Differentiator' }
    );
  } else {
    matrix.push(
      { feature: 'Core Interactive Dashboard', existingProjectsHas: true, userProjectHas: true, status: 'Baseline Feature' },
      { feature: 'Standard Data Export', existingProjectsHas: true, userProjectHas: true, status: 'Baseline Feature' },
      { feature: 'Contextual AI Copilot Advisor', existingProjectsHas: false, userProjectHas: true, status: '🔥 Key Differentiator' },
      { feature: 'Automated Insight Alerts', existingProjectsHas: false, userProjectHas: true, status: '🔥 Key Differentiator' }
    );
  }

  // 2. Formulate Ranked Differentiators
  const differentiators = [];

  if (isSocial) {
    differentiators.push({
      rank: 1,
      title: 'AI-Powered Personal Feed & Smart Curation',
      impactLevel: 'HIGH IMPACT',
      whyValue: 'Most open-source social clones rely on simple chronological sorting. An AI-curated feed based on user intent creates massive retention.',
      implementationComplexity: 'Medium',
      relevantCapabilities: ['llm_chat', 'vector_search']
    }, {
      rank: 2,
      title: 'Built-in AI Creator Assistant',
      impactLevel: 'HIGH IMPACT',
      whyValue: 'Allows creators to draft captions, suggest hashtag clusters, and enhance post media directly inside the platform.',
      implementationComplexity: 'Low',
      relevantCapabilities: ['llm_chat', 'image_generation']
    }, {
      rank: 3,
      title: 'Privacy-First Recommendation Controls',
      impactLevel: 'MEDIUM IMPACT',
      whyValue: 'Gives users transparent sliders to adjust algorithm parameters (e.g. more news vs more visuals) without opaque ad profiling.',
      implementationComplexity: 'Medium',
      relevantCapabilities: ['user_authentication', 'responsive_ui']
    });
  } else if (isImage) {
    differentiators.push({
      rank: 1,
      title: 'Smart Prompt Auto-Enhancement Engine',
      impactLevel: 'HIGH IMPACT',
      whyValue: 'Solves the "blank prompt box" problem by expanding short user prompts into rich, detailed diffusion prompts.',
      implementationComplexity: 'Low',
      relevantCapabilities: ['llm_chat', 'text_to_image']
    }, {
      rank: 2,
      title: 'AI Style Memory & Custom Preset Profiles',
      impactLevel: 'HIGH IMPACT',
      whyValue: 'Allows users to save custom aesthetic personas (e.g. Cyberpunk, Watercolor) and apply them across multiple generations.',
      implementationComplexity: 'Medium',
      relevantCapabilities: ['database', 'image_generation']
    }, {
      rank: 3,
      title: 'Side-by-Side Model Comparison Matrix',
      impactLevel: 'MEDIUM IMPACT',
      whyValue: 'Enables users to run the same prompt across 2 different models (e.g. Flux vs SDXL) simultaneously to evaluate quality.',
      implementationComplexity: 'Medium',
      relevantCapabilities: ['text_to_image', 'responsive_ui']
    });
  } else if (isAuto) {
    differentiators.push({
      rank: 1,
      title: 'Autonomous Multi-Agent Workflow Nodes',
      impactLevel: 'HIGH IMPACT',
      whyValue: 'Traditional tools execute static IF-THEN rules. AI Agent nodes allow LLMs to dynamically decide next action steps based on context.',
      implementationComplexity: 'High',
      relevantCapabilities: ['automation', 'agentic_workflows']
    }, {
      rank: 2,
      title: 'Self-Healing API Error Recovery',
      impactLevel: 'HIGH IMPACT',
      whyValue: 'Automatically analyzes API error responses (e.g. rate limit, schema change) and rewrites payload parameters on the fly.',
      implementationComplexity: 'Medium',
      relevantCapabilities: ['automation', 'workflow_automation']
    });
  } else {
    differentiators.push({
      rank: 1,
      title: 'Contextual AI Copilot & Interactive Assistant',
      impactLevel: 'HIGH IMPACT',
      whyValue: 'Transforms a passive dashboard into an active pair programmer / strategic advisor that proactively highlights opportunities.',
      implementationComplexity: 'Medium',
      relevantCapabilities: ['llm_chat', 'responsive_ui']
    });
  }

  // 3. Formulate Reference Architecture Guidance & Fair Usage Policy
  const referenceGuidance = discoveredProjects.map((p, idx) => ({
    projectName: p.name,
    repositoryUrl: p.repositoryUrl,
    stars: p.stars || 0,
    architectureUtility: idx === 0
      ? 'Primary reference for overall project folder structure and API route layout.'
      : idx === 1
      ? 'Useful reference for data models, database schema migrations, and authentication flows.'
      : 'Useful reference for frontend UI component layout and state binding.',
    ethicalNote: 'Use strictly as an open-source reference for architecture patterns. Do NOT copy proprietary source code, branding, or assets directly.'
  }));

  return {
    matrix,
    differentiators,
    referenceGuidance,
    antiCopyingPolicy: 'Discovered web projects are intended solely for architectural learning, feature gap analysis, and market comparison. Always respect open-source licensing (MIT/Apache 2.0/GPL) and never copy proprietary code or brand assets.'
  };
}
