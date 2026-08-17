import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Capability mappings for known tool categories & explicit tool IDs
const CAPABILITY_MAP = {
  // Image Generation & Creation
  'dall-e-3': ['image_generation', 'text_to_image', 'creative_design'],
  'midjourney': ['image_generation', 'text_to_image', 'creative_design', 'photorealism'],
  'flux-1': ['image_generation', 'text_to_image', 'open_weights'],
  'stable-diffusion': ['image_generation', 'text_to_image', 'open_source'],
  'recraft-v3': ['image_generation', 'vector_art', 'svg_generation', 'design_assets'],
  'ideogram-v2': ['image_generation', 'typography', 'graphic_design', 'logos'],
  
  // Voice, Audio & Speech
  'elevenlabs': ['voice_generation', 'speech_synthesis', 'text_to_speech', 'voice_cloning', 'audio_narration'],
  'elevenlabs-reader': ['text_to_speech', 'audio_narration'],
  'playht': ['voice_generation', 'speech_synthesis', 'text_to_speech', 'voice_cloning'],
  'speechify': ['text_to_speech', 'audio_narration'],
  'suno': ['music_generation', 'song_composition', 'audio_generation'],
  'udio': ['music_generation', 'song_composition', 'audio_generation'],
  
  // Video Generation & Editing
  'runway': ['video_generation', 'video_editing', 'text_to_video', 'image_to_video'],
  'sora': ['video_generation', 'text_to_video'],
  'luma-dream-machine': ['video_generation', '3d_motion'],
  'kling-ai': ['video_generation', 'cinematic_video'],
  'hailuo-ai': ['video_generation', 'motion_graphics'],

  // Automation, Workflow & Agent Orchestration
  'n8n': ['automation', 'workflow_automation', 'api_integration', 'agentic_workflows', 'open_source'],
  'zapier': ['automation', 'workflow_automation', 'api_integration'],
  'make': ['automation', 'workflow_automation', 'visual_workflows'],
  'langchain': ['ai_agent_orchestration', 'llm_framework', 'rag', 'agentic_workflows', 'open_source'],
  'crewai': ['ai_agent_orchestration', 'multi_agent_systems', 'automation', 'open_source'],
  'autogpt': ['ai_agent_orchestration', 'autonomous_agents', 'automation', 'open_source'],
  'browser-use': ['browser_automation', 'web_scraping', 'agentic_workflows', 'open_source'],
  'playwright': ['browser_automation', 'testing_automation', 'open_source'],

  // Analytics & Data Science
  'julius-ai': ['data_analytics', 'data_visualization', 'predictive_modeling'],
  'akkio': ['data_analytics', 'no_code_ml', 'predictive_modeling'],
  
  // 3D & Spatial Design
  'spline': ['3d_generation', 'spatial_design', 'webgl'],
  'meshy': ['3d_generation', 'text_to_3d', '3d_assets'],

  // Coding & Developer Tools
  'cursor': ['coding_assistance', 'code_generation', 'codebase_indexing', 'multi_file_editing', 'developer_tools'],
  'copilot': ['coding_assistance', 'code_generation', 'autocomplete', 'developer_tools'],
  'antigravity': ['coding_assistance', 'code_generation', 'agentic_coding', 'developer_tools'],
  'v0': ['ui_generation', 'react_components', 'frontend_development', 'code_generation'],
  'bolt': ['full_stack_generation', 'web_prototyping', 'code_generation', 'frontend_development'],
  'lovable': ['full_stack_generation', 'web_builder', 'code_generation'],
  'replit': ['cloud_ide', 'code_execution', 'deployment', 'coding_assistance'],
  'opencode': ['coding_assistance', 'code_generation', 'open_source'],
  'coder': ['coding_assistance', 'code_generation'],
  'qwen-coder': ['coding_assistance', 'code_generation', 'open_weights'],

  // Conversational AI & Reasoning Models
  'chatgpt': ['llm_chat', 'text_generation', 'reasoning', 'coding_assistance', 'research'],
  'claude': ['llm_chat', 'text_generation', 'reasoning', 'coding_assistance', 'long_context', 'document_analysis'],
  'gemini': ['llm_chat', 'multimodal_reasoning', 'vision_analysis', 'audio_processing', 'text_generation'],
  'deepseek': ['llm_chat', 'chain_of_thought_reasoning', 'open_weights', 'coding_assistance', 'math_reasoning'],
  'grok': ['llm_chat', 'real_time_search', 'reasoning'],

  // Infrastructure, Database & Vector RAG
  'supabase': ['database', 'relational_database', 'postgres', 'authentication', 'real_time_updates', 'vector_search'],
  'neon': ['database', 'relational_database', 'postgres', 'serverless_db'],
  'pinecone': ['vector_search', 'rag', 'embeddings', 'similarity_search'],
  'qdrant': ['vector_search', 'rag', 'embeddings', 'open_source'],
  'chromadb': ['vector_search', 'rag', 'embeddings', 'open_source'],
  'weaviate': ['vector_search', 'rag', 'embeddings', 'open_source'],
  
  // Search & Research
  'perplexity': ['web_research', 'cited_search', 'information_retrieval'],
  'consensus': ['academic_research', 'scientific_citations', 'paper_synthesis'],
  'elicit': ['academic_research', 'literature_review'],
  'notebooklm': ['document_synthesis', 'audio_overview', 'research_notes']
};

/**
 * Loads and builds the structured tool registry from src/data/*.json
 */
export function getToolRegistry() {
  const dataDir = path.join(__dirname, '..', '..', 'src', 'data');
  const registry = [];

  // 1. Add explicitly mapped automation & specialized tools first
  const explicitTools = [
    {
      id: 'n8n',
      name: 'n8n Workflow Automation',
      provider: 'n8n.io',
      category: 'automation',
      capabilities: ['automation', 'workflow_automation', 'api_integration', 'agentic_workflows', 'open_source'],
      inputTypes: ['json', 'webhook', 'event'],
      outputTypes: ['json', 'webhook', 'action'],
      useCases: ['Workflow Automation', 'API Webhooks', 'Agentic Triggers'],
      officialUrl: 'https://n8n.io',
      pricingLabel: 'Freemium',
      description: 'Fair-code workflow automation tool supporting self-hosting and AI agent nodes.'
    },
    {
      id: 'zapier',
      name: 'Zapier Central & AI Actions',
      provider: 'zapier.com',
      category: 'automation',
      capabilities: ['automation', 'workflow_automation', 'api_integration'],
      inputTypes: ['event', 'webhook'],
      outputTypes: ['action', 'email', 'crm'],
      useCases: ['App Automation', 'No-code Integration'],
      officialUrl: 'https://zapier.com',
      pricingLabel: 'Freemium',
      description: 'Leading app integration platform connecting 6,000+ business applications with AI actions.'
    },
    {
      id: 'make',
      name: 'Make.com Visual Automation',
      provider: 'make.com',
      category: 'automation',
      capabilities: ['automation', 'workflow_automation', 'visual_workflows'],
      inputTypes: ['event', 'webhook'],
      outputTypes: ['action', 'data'],
      useCases: ['Visual Workflows', 'Multi-step Automation'],
      officialUrl: 'https://make.com',
      pricingLabel: 'Freemium',
      description: 'Visual automation platform for designing, building, and automating complex workflows.'
    },
    {
      id: 'crewai',
      name: 'CrewAI Multi-Agent Framework',
      provider: 'crewai.com',
      category: 'agents',
      capabilities: ['ai_agent_orchestration', 'multi_agent_systems', 'automation', 'open_source'],
      inputTypes: ['prompt', 'task'],
      outputTypes: ['text', 'report', 'code'],
      useCases: ['Autonomous Teams', 'Role-based Agents', 'Automation'],
      officialUrl: 'https://crewai.com',
      pricingLabel: 'Free / Open Source',
      description: 'Framework for orchestrating role-playing, autonomous AI agents for collaborative workflows.'
    },
    {
      id: 'julius-ai',
      name: 'Julius AI Analytics',
      provider: 'julius.ai',
      category: 'analytics',
      capabilities: ['data_analytics', 'data_visualization', 'predictive_modeling'],
      inputTypes: ['csv', 'excel', 'sql'],
      outputTypes: ['chart', 'insights', 'python'],
      useCases: ['Data Analysis', 'Automated Visualization', 'Statistics'],
      officialUrl: 'https://julius.ai',
      pricingLabel: 'Freemium',
      description: 'AI data scientist that analyzes datasets, creates charts, and performs statistical modeling.'
    },
    {
      id: 'cursor',
      name: 'Cursor AI Code Editor',
      provider: 'cursor.com',
      category: 'coding',
      capabilities: ['coding_assistance', 'code_generation', 'codebase_indexing', 'multi_file_editing', 'developer_tools'],
      inputTypes: ['code', 'prompt'],
      outputTypes: ['code', 'diff'],
      useCases: ['AI Pair Programming', 'Codebase Search'],
      officialUrl: 'https://cursor.com',
      pricingLabel: 'Freemium',
      description: 'AI-first code editor with background codebase indexing and intelligent prompt chaining.'
    },
    {
      id: 'chatgpt',
      name: 'ChatGPT & OpenAI GPT-4o',
      provider: 'openai.com',
      category: 'chat',
      capabilities: ['llm_chat', 'text_generation', 'reasoning', 'coding_assistance', 'research'],
      inputTypes: ['prompt', 'image', 'file'],
      outputTypes: ['text', 'json', 'code'],
      useCases: ['Conversational AI', 'Text Generation', 'Reasoning'],
      officialUrl: 'https://chatgpt.com',
      pricingLabel: 'Freemium',
      description: 'Frontier AI conversational assistant powered by OpenAI GPT-4o & o3 reasoning models.'
    },
    {
      id: 'claude',
      name: 'Claude 3.5 Sonnet',
      provider: 'anthropic.com',
      category: 'chat',
      capabilities: ['llm_chat', 'text_generation', 'reasoning', 'coding_assistance', 'long_context', 'document_analysis'],
      inputTypes: ['prompt', 'document', 'code'],
      outputTypes: ['text', 'code'],
      useCases: ['Deep Reasoning', 'Long Context Analysis', 'Coding'],
      officialUrl: 'https://claude.ai',
      pricingLabel: 'Freemium',
      description: 'Advanced reasoning AI assistant by Anthropic with 200k context & hybrid thinking architecture.'
    },
    {
      id: 'gemini',
      name: 'Google Gemini 2.0',
      provider: 'google.com',
      category: 'chat',
      capabilities: ['llm_chat', 'multimodal_reasoning', 'vision_analysis', 'audio_processing', 'text_generation'],
      inputTypes: ['prompt', 'audio', 'video', 'code'],
      outputTypes: ['text', 'json'],
      useCases: ['Multimodal Reasoning', 'Vision & Audio Processing'],
      officialUrl: 'https://gemini.google.com',
      pricingLabel: 'Freemium',
      description: 'Multimodal AI model suite by Google DeepMind for text, vision, audio & code intelligence.'
    },
    {
      id: 'deepseek',
      name: 'DeepSeek R1',
      provider: 'deepseek.com',
      category: 'chat',
      capabilities: ['llm_chat', 'chain_of_thought_reasoning', 'open_weights', 'coding_assistance', 'math_reasoning'],
      inputTypes: ['prompt', 'code'],
      outputTypes: ['text', 'reasoning'],
      useCases: ['Chain of Thought Reasoning', 'Open Weights', 'Math & Code'],
      officialUrl: 'https://deepseek.com',
      pricingLabel: 'Free / Open Source',
      description: 'Open-weights reasoning AI model with high efficiency and deep chain-of-thought capabilities.'
    },
    {
      id: 'elevenlabs',
      name: 'ElevenLabs Voice AI',
      provider: 'elevenlabs.io',
      category: 'voice',
      capabilities: ['voice_generation', 'speech_synthesis', 'text_to_speech', 'voice_cloning', 'audio_narration'],
      inputTypes: ['text', 'audio'],
      outputTypes: ['audio'],
      useCases: ['Text to Speech', 'Voice Cloning', 'Audio Narration'],
      officialUrl: 'https://elevenlabs.io',
      pricingLabel: 'Freemium',
      description: 'Lifelike AI speech synthesis, text-to-speech, and voice cloning platform.'
    },
    {
      id: 'dall-e-3',
      name: 'DALL-E 3',
      provider: 'openai.com',
      category: 'image',
      capabilities: ['image_generation', 'text_to_image', 'creative_design'],
      inputTypes: ['prompt'],
      outputTypes: ['image'],
      useCases: ['Image Synthesis', 'Creative Graphics'],
      officialUrl: 'https://openai.com/dall-e-3',
      pricingLabel: 'Paid',
      description: 'Generative AI text-to-image synthesis engine with prompt adherence.'
    },
    {
      id: 'midjourney',
      name: 'Midjourney v6',
      provider: 'midjourney.com',
      category: 'image',
      capabilities: ['image_generation', 'text_to_image', 'creative_design', 'photorealism'],
      inputTypes: ['prompt', 'image'],
      outputTypes: ['image'],
      useCases: ['Photorealistic Artwork', 'Visual Design Assets'],
      officialUrl: 'https://midjourney.com',
      pricingLabel: 'Paid',
      description: 'Premier generative text-to-image engine for photorealistic artwork & asset creation.'
    },
    {
      id: 'supabase',
      name: 'Supabase Postgres & Vectors',
      provider: 'supabase.com',
      category: 'cloud',
      capabilities: ['database', 'relational_database', 'postgres', 'authentication', 'real_time_updates', 'vector_search'],
      inputTypes: ['sql', 'json'],
      outputTypes: ['json', 'event'],
      useCases: ['Relational Database', 'User Auth', 'Vector RAG'],
      officialUrl: 'https://supabase.com',
      pricingLabel: 'Freemium',
      description: 'Open-source Firebase alternative with AI vector embeddings and real-time database.'
    },
    {
      id: 'neon',
      name: 'Neon Serverless Postgres',
      provider: 'neon.tech',
      category: 'cloud',
      capabilities: ['database', 'relational_database', 'postgres', 'serverless_db'],
      inputTypes: ['sql'],
      outputTypes: ['json'],
      useCases: ['Serverless Postgres', 'DB Branching'],
      officialUrl: 'https://neon.tech',
      pricingLabel: 'Freemium',
      description: 'Serverless Postgres database with instant branching built for modern cloud apps.'
    }
  ];

  for (const t of explicitTools) {
    registry.push(t);
  }

  // 2. Load ecosystem JSON files
  if (fs.existsSync(dataDir)) {
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && f !== 'all_models.json');
    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
        const rawTools = JSON.parse(content);
        
        if (Array.isArray(rawTools)) {
          for (const tool of rawTools) {
            if (!tool.id || !tool.name) continue;

            const categoryKey = (tool.category || '').toLowerCase();
            const explicitCapabilities = CAPABILITY_MAP[tool.id] || [];
            const derivedCapabilities = new Set(explicitCapabilities);

            if (categoryKey === 'image') {
              derivedCapabilities.add('image_generation');
              derivedCapabilities.add('text_to_image');
            } else if (categoryKey === 'voice') {
              derivedCapabilities.add('voice_generation');
              derivedCapabilities.add('speech_synthesis');
              derivedCapabilities.add('text_to_speech');
            } else if (categoryKey === 'music') {
              derivedCapabilities.add('music_generation');
              derivedCapabilities.add('audio_generation');
            } else if (categoryKey === 'video') {
              derivedCapabilities.add('video_generation');
              derivedCapabilities.add('text_to_video');
            } else if (categoryKey === 'coding' || categoryKey === 'devtools') {
              derivedCapabilities.add('coding_assistance');
              derivedCapabilities.add('code_generation');
              derivedCapabilities.add('developer_tools');
            } else if (categoryKey === 'chat') {
              derivedCapabilities.add('llm_chat');
              derivedCapabilities.add('text_generation');
              derivedCapabilities.add('reasoning');
            } else if (categoryKey === 'cloud') {
              derivedCapabilities.add('cloud_hosting');
              derivedCapabilities.add('database');
            } else if (categoryKey === 'research') {
              derivedCapabilities.add('web_research');
              derivedCapabilities.add('information_retrieval');
            } else if (categoryKey === 'automation' || categoryKey === 'agent') {
              derivedCapabilities.add('automation');
              derivedCapabilities.add('workflow_automation');
              derivedCapabilities.add('agentic_workflows');
            }

            if (tool.openSource) derivedCapabilities.add('open_source');
            if (tool.apiAvailable) derivedCapabilities.add('api_access');

            registry.push({
              id: tool.id,
              name: tool.name,
              provider: tool.website ? new URL(tool.website).hostname.replace(/^www\./, '') : 'Independent',
              category: tool.category || 'general',
              capabilities: Array.from(derivedCapabilities),
              inputTypes: tool.inputTypes || ['text'],
              outputTypes: tool.outputTypes || ['text'],
              useCases: tool.tags || [tool.category],
              officialUrl: tool.website || '',
              pricingLabel: tool.pricing ? (tool.pricing.free && tool.pricing.paid ? 'Freemium' : tool.pricing.free ? 'Free' : 'Paid') : 'Freemium',
              description: tool.description || `${tool.name} AI tool`
            });
          }
        }
      } catch {
        // Ignore invalid files
      }
    }
  }

  // Deduplicate registry by tool ID
  const uniqueMap = new Map();
  for (const item of registry) {
    if (!uniqueMap.has(item.id)) {
      uniqueMap.set(item.id, item);
    }
  }

  return Array.from(uniqueMap.values());
}
