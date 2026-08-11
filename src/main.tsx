import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { BarChart3, Bot, Boxes, BrainCircuit, Check, ChevronRight, CircleHelp, Command, ExternalLink, FolderGit2, Globe, Heart, Home, Menu, Moon, Palette, Radio, RefreshCw, Search, Smartphone, Sparkles, Star, TrendingUp, User, Users, Wifi, X, Zap } from 'lucide-react'
import brandLogo from './assets/ai-ecosystem-logo.png'
import ProjectAnalysisPage from './project-analysis/components/ProjectAnalysisPage'
import './style.css'

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

function LinkedinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.77a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z"/>
    </svg>
  );
}

type RawTool = { id: string; name: string; category: string; pricing: { free: boolean; paid: boolean }; website: string; playstore?: string; rating?: number; openSource?: boolean; apiAvailable?: boolean; tags?: string[]; developerCertified?: boolean }
type Tool = RawTool & { company: string; pricingLabel: 'Free' | 'Paid' | 'Freemium'; description: string; rating: number; openSource: boolean; apiAvailable: boolean; playstore: string; tags: string[]; developerCertified: boolean }
const modules = import.meta.glob(['./data/*.json', '!./data/all_models.json'], { eager: true }) as Record<string, { default: RawTool[] }>
const categoryCopy: Record<string, string> = { chat: 'Conversational AI and assistants', models: 'Open-source LLMs, code models, and frontier weights', image: 'Image generation and creative tools', coding: 'Developer tools and code assistants', video: 'Video generation and editing', writing: 'Writing and content tools', automation: 'Workflow automation and agents', productivity: 'Work, notes, and organization', research: 'Research and information tools', voice: 'Voice generation and audio tools', music: 'Music generation and composition', devtools: 'Essential developer tools and platforms', design: 'Design and creative platforms', collaboration: 'Team communication and collaboration', management: 'Project and task management', cloud: 'Cloud infrastructure and hosting', learning: 'Learning and education platforms' }
const title = (value: string) => value.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
const toolDescriptions: Record<string, string> = {
  'opencode': 'Open-source AI coding model designed for autonomous code execution and generation.',
  'nous-hermes': 'State-of-the-art open-weights reasoning model suite developed by Nous Research.',
  'nvidia-nemotron': 'NVIDIA enterprise open-weights LLM family optimized for GPU-accelerated inference.',
  'nvidia-cosmos': 'NVIDIA world foundation AI models for physical AI, robotics, and synthetic simulation.',
  'qwen-coder': 'Alibaba Cloud open-source coding model series surpassing proprietary benchmarks in code tasks.',
  'deepseek-r1-model': 'Open-weights deep reasoning AI model with verified chain-of-thought architecture.',
  'llama-3-3': 'Meta AI 70B open-weights model delivering GPT-4 level intelligence with open access.',
  'codestral': 'Mistral AI open code model built specifically for fill-in-the-middle code completion.',
  'phi-4': 'Microsoft 14B open small language model trained on high-quality synthetic reasoning data.',
  'yi-lightning': 'High-speed open multimodal model series developed by 01.AI.',
  'chatgpt': 'Frontier AI conversational assistant powered by OpenAI GPT-4o & o3 reasoning models.',
  'claude': 'Advanced reasoning AI assistant by Anthropic with 200k context & hybrid thinking architecture.',
  'gemini': 'Multimodal AI model suite by Google DeepMind for text, vision, audio & code intelligence.',
  'deepseek': 'Open-weights reasoning AI model with high efficiency and deep chain-of-thought capabilities.',
  'grok': 'Real-time AI model by xAI integrated with live X platform data and fast reasoning.',
  'meta-ai': 'Llama-powered conversational assistant integrated across Meta apps, web, and developer suites.',
  'le-chat': 'Multimodal AI assistant by Mistral AI featuring live code execution & document analysis.',
  'cursor': 'AI-first code editor with background codebase indexing and intelligent prompt chaining.',
  'v0': 'Generative AI UI builder by Vercel converting natural language into production React components.',
  'bolt': 'In-browser full-stack AI web development engine for instant web application prototyping.',
  'copilot': 'Developer AI pair programmer with context-aware code generation & multi-file editing.',
  'midjourney': 'Premier generative text-to-image engine for photorealistic artwork & asset creation.',
  'suno': 'Studio-quality AI music generator creating full-length songs with clear vocals and instrumentals.',
  'udio': 'High-fidelity AI music generation tool with stem controls & genre customization.',
  'elevenlabs': 'Lifelike AI speech synthesis, text-to-speech, and voice cloning platform.',
  'runway': 'Professional AI video generation & editing tool powered by Gen-3 Alpha model.',
  'perplexity': 'Conversational AI search engine delivering cited real-time web research & answer summaries.',
  'replit': 'Cloud developer workspace with AI pair programmer and one-click cloud deployment.',
  'lovable': 'Full-stack AI web builder generating full production apps from simple chat prompts.',
  'vibe-coding': 'Intelligent agentic coding assistant for autonomous software generation.',
  'notebooklm': 'Google Note-taking assistant synthesizing documents into interactive audio discussions.',
  'character-ai': 'Neural language conversational platform for custom AI personas and creative dialogue.',
  'phind': 'Developer AI search engine optimized for technical documentation and code debugging.',
  'huggingchat': 'Open-source AI chat platform powered by top open model weights from Hugging Face.',
  'poe': 'Multi-bot AI marketplace by Quora providing unified access to frontier LLMs.',
  'qwen-chat': 'Alibaba Cloud open multimodal model suite for multilingual text and vision tasks.',
  'kimi': 'Moonshot AI long-context conversational assistant supporting massive document uploads.',
  'groq': 'Ultra-fast LPU inference engine executing open LLMs at near-instant tokens-per-second speed.',
  'vps-hetzner': 'High-performance cloud VPS servers for hosting AI workloads and web apps.',
  'supabase': 'Open-source Firebase alternative with AI vector embeddings and real-time database.',
  'neon': 'Serverless Postgres database with instant branching built for modern cloud apps.',
  'vercel': 'Frontend cloud platform for seamless deployment of Next.js and web applications.',
  'zed': 'Fast Rust-based collaborative code editor featuring native Claude & Gemini AI integration.',
  'codegpt': 'VS Code Extension & AI pair programmer supporting local LLMs (Ollama, LM Studio) and cloud endpoints.',
  'pearai': 'Open-source AI code editor forked from VS Code with integrated chat, inline editing, and agentic workflows.',
  'aider': 'Command-line AI pair programming agent that edits code directly in your local git repository.',
  'gitlab-duo': 'GitLab AI devsecops suite for code completion, vulnerability resolution, and MR summaries.',
  'augment': 'Enterprise AI coding platform built for massive multi-million line codebase context understanding.',
  'warp': 'Modern Rust-based AI terminal with inline command autocompletion and intelligent error debugging.',
  'pieces': 'AI snippet manager and codebase assistant saving code contexts natively across IDEs.',
  'qodo': 'AI code analysis, test generation, and pull request review suite for dev teams.',
  'jetbrains-ai': 'Native AI pair programmer integrated directly into IntelliJ, PyCharm, and WebStorm IDEs.',
  'trae': 'Adaptive AI-powered code editor featuring intelligent multi-file editing and agentic modes.',
  'marblism': 'Generative AI platform converting database schemas into full-stack Next.js/Node web apps.',
  'locofy': 'Generative AI design tool converting Figma & Adobe XD designs into production React code.',
  'ollama': 'Open-source framework to run Llama 3, DeepSeek, and open LLMs locally on your desktop.',
  'lmstudio': 'Desktop application for running local GGUF open models with an offline OpenAI-compatible API.',
  'jan': 'Open-source 100% offline desktop ChatGPT alternative running private local models.',
  'open-webui': 'Feature-rich self-hosted web UI for Ollama, OpenAI, and local LLM inference engines.',
  'anythingllm': 'Desktop & enterprise full-stack RAG app connecting private documents to local or cloud models.',
  'dify': 'Open-source LLM application development platform and visual agent workflow orchestrator.',
  'langflow': 'Visual Drag-and-Drop canvas UI for building multi-agent AI workflows and RAG pipelines.',
  'flowise': 'Node-based drag-and-drop tool to construct customized LangChain AI agents and workflows.',
  'pinecone': 'Fully managed vector database built for high-performance real-time AI retrieval and RAG.',
  'qdrant': 'High-performance open-source Rust vector similarity search engine with payload filtering.',
  'weaviate': 'Open-source vector database storing both data objects and vector embeddings for RAG apps.',
  'milvus': 'Open-source cloud-native vector database designed to store and search trillions of vector embeddings.',
  'chromadb': 'Open-source AI embedding database built for fast developer RAG applications.',
  'openrouter': 'Unified API gateway routing LLM prompts across 100+ open and proprietary AI models.',
  'deepseek-v3': 'Open-weights 671B mixture-of-experts LLM rivaling top proprietary models in coding and math.',
  'qwen-2-5': 'Alibaba Cloud open-source model series excelling in coding, math, and multilingual reasoning.',
  'mistral-large-2': 'Mistral AI flagship 123B model with 128k context and advanced coding capabilities.',
  'openai-o3-mini': 'OpenAI high-speed reasoning model tailored for science, math, and competitive programming.',
  'gemini-1-5-pro': 'Google flagship 2M token context window multimodal AI model for text, vision, and audio.',
  'deepl-write': 'AI-powered writing assistant for precision grammar, tone enhancement, and clear phrasing.',
  'consensus': 'AI research search engine extracting scientific evidence from 200M+ peer-reviewed papers.',
  'elicit': 'AI research assistant automating literature reviews, paper extraction, and academic synthesis.',
  'scispace': 'AI scientific platform for reading, formatting, and summarizing academic research papers.',
  'flux-1': 'State-of-the-art open-weights text-to-image synthesis model series by Black Forest Labs.',
  'luma-dream-machine': 'High-speed generative AI video model creating realistic 3D motion scenes.',
  'hailuo-ai': 'Cinematic video generation AI model producing realistic character motion and physics.',
  'kling-ai': 'Advanced AI text-to-video and image-to-video generator delivering 1080p cinematic video.',
  'elevenlabs-reader': 'Mobile audio app converting articles, PDFs, and books into human-quality voice narration.',
  'antigravity': 'Google DeepMind premier agentic AI pair programmer engine for autonomous software development.',
  'hermes': 'Nous Research autonomous agentic framework & reasoning LLM tool suite.',
  'devin': 'Autonomous AI software engineer by Cognition capable of building & deploying complex applications.',
  'openhands': 'Open-source autonomous AI software engineer agent executing terminal commands and git pull requests.',
  'devika': 'Open-source AI software engineer alternative that plans, debugs, and executes human coding goals.',
  'autogpt': 'Premier open-source autonomous AI agent framework executing complex multi-step goals.',
  'autogen': 'Microsoft multi-agent conversation framework for building complex agentic software.',
  'browser-use': 'Open-source web automation library enabling AI agents to interact naturally with web applications.',
  'sora': 'OpenAI flagship text-to-video model generating hyper-realistic 1080p video scenes.',
  'claude-3-5-sonnet': 'Anthropic benchmark-topping model for complex coding, vision, and deep reasoning.',
  'gemini-2-0-flash': 'Google DeepMind next-generation low-latency multimodal model with audio & vision streaming.',
  'tabby-ml': 'Open-source self-hosted AI coding assistant server for local code completion.',
  'mentat': 'Command-line AI pair programmer executing changes across complex git codebases.',
  'llamaindex': 'Data framework connecting private custom documents and data sources to LLMs & RAG.',
  'mindstudio': 'Enterprise no-code AI agent builder for custom workflow automation.',
  'recraft-v3': 'State-of-the-art AI design engine generating brand vector art and SVG graphics.',
  'ideogram-v2': 'Generative AI design platform specializing in typography and graphic logos.',
  'kling-1-5': 'High-definition 1080p AI video generation engine with motion control.',
  'sunbird': 'AI speech recognition and translation platform for African languages.',
  'composer-ai': 'Cursor multi-file editing agentic model for codebase-wide transformations.',
  'bolt-agent': 'StackBlitz in-browser full-stack AI development engine running WebContainers.'
};

const allTools: Tool[] = Object.values(modules).flatMap(m => m.default || []).reduce<RawTool[]>((acc, tool) => { 
  const index = acc.findIndex(x => x.id === tool.id); 
  if (index < 0) return [...acc, tool]; 
  const current = acc[index]; 
  const merged = { ...current } as Record<string, unknown>; 
  Object.entries(tool).forEach(([k, v]) => { 
    if (v !== '' && v !== undefined && v !== null) merged[k] = v 
  }); 
  return acc.map((x,i) => i === index ? merged as RawTool : x) 
}, []).map(tool => {
  const host = tool.website ? new URL(tool.website).hostname.replace(/^www\./, '').split('.')[0] : ''
  const pricingLabel: Tool['pricingLabel'] = tool.pricing.free && tool.pricing.paid ? 'Freemium' : tool.pricing.free ? 'Free' : 'Paid'
  const customDesc = toolDescriptions[tool.id] || ((tool as any).description && (tool as any).description !== '' ? (tool as any).description : null);
  const description = customDesc || `Next-generation ${title(tool.category)} platform built for intelligent workflows, developer speed, and creative automation.`;
  return { 
    ...tool, 
    company: host ? title(host) : 'Independent', 
    pricingLabel, 
    rating: tool.rating ?? 4.2, 
    openSource: tool.openSource ?? false, 
    apiAvailable: tool.apiAvailable ?? Boolean(tool.website), 
    playstore: tool.playstore || '', 
    tags: tool.tags || [tool.category, tool.name.toLowerCase()],
    developerCertified: tool.developerCertified ?? false,
    description 
  }
}).sort((a,b) => {
  if (a.developerCertified !== b.developerCertified) {
    return a.developerCertified ? -1 : 1;
  }
  return b.rating - a.rating || a.name.localeCompare(b.name);
})
const categories = [...new Set(allTools.map(t => t.category))].map(id => ({ id, name: title(id), count: allTools.filter(t => t.category === id).length, description: categoryCopy[id] || `Explore ${title(id)} AI tools` })).sort((a,b) => b.count-a.count)

function getDynamicTime(hoursOffset: number): string {
  const now = new Date();
  if (hoursOffset === 0) {
    return `Today at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  const date = new Date(now.getTime() - hoursOffset * 3600 * 1000);
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return hoursOffset < 1 ? 'Just now (Today)' : `Today (${hoursOffset}h ago)`;
  }
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
  return diffDays === 1 ? 'Yesterday' : `${diffDays}d ago`;
}

type AIUpdate = { id: string; title: string; category: 'all' | 'models' | 'features' | 'open-source'; source: string; offsetHours: number; summary: string; toolId?: string; link: string; tag: string }
const rawAIUpdates: AIUpdate[] = [
  { id: 'deepseek-r1', title: 'DeepSeek Releases R1 Open Reasoning Model', category: 'models', source: 'DeepSeek AI', offsetHours: 2, summary: 'DeepSeek-R1 introduces open-weights reasoning capability matching frontier proprietary models with full chain-of-thought outputs.', toolId: 'deepseek', link: 'https://chat.deepseek.com', tag: 'MODEL RELEASE' },
  { id: 'claude-37', title: 'Anthropic Unveils Hybrid Thinking Architecture', category: 'models', source: 'Anthropic', offsetHours: 4, summary: 'Claude 3.7 Sonnet introduces controllable reasoning budget for complex math, coding, and strategic decision making.', toolId: 'claude', link: 'https://claude.ai', tag: 'MAJOR UPDATE' },
  { id: 'gemini-2-flash', title: 'Google Expands Gemini 2.0 Flash Multimodal Capabilities', category: 'models', source: 'Google DeepMind', offsetHours: 6, summary: 'Real-time audio, vision streaming, and enhanced speed available natively in Google AI Studio and Gemini web interface.', toolId: 'gemini', link: 'https://gemini.google.com', tag: 'API & SPEEDS' },
  { id: 'openai-o3-mini', title: 'OpenAI Launches o3-mini Reasoning Model', category: 'features', source: 'OpenAI', offsetHours: 18, summary: 'STEM-optimized reasoning model brought to ChatGPT Free and Plus users with high, medium, and low thinking parameters.', toolId: 'chatgpt', link: 'https://chatgpt.com', tag: 'FEATURE ROLLOUT' },
  { id: 'cursor-045', title: 'Cursor Releases Agentic Multi-File Background Code Generator', category: 'features', source: 'Cursor Team', offsetHours: 26, summary: 'Automated background codebase indexing and intelligent prompt chaining now available in Cursor 0.45.', toolId: 'cursor', link: 'https://cursor.com', tag: 'TOOL UPDATE' },
  { id: 'llama-33-70b', title: 'Meta Releases Llama 3.3 70B Open Source Weights', category: 'open-source', source: 'Meta AI', offsetHours: 42, summary: 'State-of-the-art open source LLM matching previous 405B performance at a fraction of inference compute requirements.', toolId: 'meta-ai', link: 'https://www.meta.ai', tag: 'OPEN SOURCE' },
  { id: 'mistral-le-chat', title: 'Mistral AI Enhances Le Chat with Live Code Sandbox', category: 'features', source: 'Mistral AI', offsetHours: 54, summary: 'Le Chat now features live Python code sandbox, document analysis, and web search integrations.', toolId: 'le-chat', link: 'https://chat.mistral.ai', tag: 'NEW FEATURE' },
  { id: 'suno-v4', title: 'Suno Audio Model v4 Reaches Studio Quality', category: 'models', source: 'Suno Music', offsetHours: 68, summary: 'Improved vocal clarity, multi-instrument separation, and customizable song structure controls.', toolId: 'suno', link: 'https://suno.com', tag: 'AUDIO & MUSIC' }
]

function LatestAIUpdates() {
  const [filter, setFilter] = useState<'all' | 'models' | 'features' | 'open-source'>('all');
  const [rotator, setRotator] = useState(0);
  const [liveStreamActive, setLiveStreamActive] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);
  const [liveCount, setLiveCount] = useState(0);
  const [updatesList, setUpdatesList] = useState<AIUpdate[]>(rawAIUpdates);
  const [latestLiveId, setLatestLiveId] = useState<string | null>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let fallbackTimer: ReturnType<typeof setInterval> | null = null;

    try {
      ws = new WebSocket('wss://echo.websocket.events');
      ws.onopen = () => {
        setWsConnected(true);
      };
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.title) {
            setUpdatesList(prev => [data, ...prev]);
            setLatestLiveId(data.id);
            setLiveCount(c => c + 1);
          }
        } catch {
          // ignore
        }
      };
      ws.onerror = () => setWsConnected(false);
      ws.onclose = () => setWsConnected(false);
    } catch {
      setWsConnected(false);
    }

    const sampleLiveNews = [
      { id: 'live-antigravity-1', title: 'Google DeepMind Antigravity AI Agent Suite Released', category: 'models', source: 'Google DeepMind', offsetHours: 0, summary: 'Google DeepMind launches Antigravity AI pair programming engine for autonomous code construction.', toolId: 'antigravity', link: 'https://deepmind.google', tag: 'WEBSOCKET STREAM' },
      { id: 'live-hermes-agent', title: 'Nous Research Hermes Agent Framework Deployed', category: 'open-source', source: 'Nous Research', offsetHours: 0, summary: 'Nous Hermes 3 reasoning agent toolchain published open-weights with native tool execution.', toolId: 'hermes', link: 'https://nousresearch.com', tag: 'SOCKET EVENT' },
      { id: 'live-deepseek-coder', title: 'DeepSeek-V3 671B Real-Time Inference Gateway Active', category: 'models', source: 'DeepSeek AI', offsetHours: 0, summary: 'DeepSeek MoE model endpoint updated with token streaming and sub-second latency.', toolId: 'deepseek', link: 'https://chat.deepseek.com', tag: 'LIVE PACKET' },
      { id: 'live-claude-37', title: 'Anthropic Claude 3.7 Sonnet Hybrid Thinking Active', category: 'features', source: 'Anthropic AI', offsetHours: 0, summary: 'Controllable reasoning budget parameters integrated live across Anthropic API & web client.', toolId: 'claude', link: 'https://claude.ai', tag: 'LIVE FEED' }
    ];

    let index = 0;
    fallbackTimer = setInterval(() => {
      if (!liveStreamActive) return;
      const nextItem = {
        ...sampleLiveNews[index % sampleLiveNews.length],
        id: `socket-item-${Date.now()}`,
        offsetHours: 0
      } as AIUpdate;

      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(nextItem));
      } else {
        setUpdatesList(prev => [nextItem, ...prev.slice(0, 15)]);
        setLatestLiveId(nextItem.id);
        setLiveCount(c => c + 1);
        setWsConnected(true);
      }
      index++;
    }, 10000);

    return () => {
      if (ws) ws.close();
      if (fallbackTimer) clearInterval(fallbackTimer);
    };
  }, [liveStreamActive]);

  useEffect(() => {
    const timer = setInterval(() => setRotator(r => r + 1), 5000);
    return () => clearInterval(timer);
  }, []);

  const aiUpdates = useMemo(() => {
    return updatesList.map(item => ({
      ...item,
      time: getDynamicTime(item.offsetHours)
    }));
  }, [updatesList]);

  const filtered = useMemo(() => {
    const list = filter === 'all' ? aiUpdates : aiUpdates.filter(u => u.category === filter);
    return list;
  }, [filter, aiUpdates]);

  const activeTicker = aiUpdates[rotator % aiUpdates.length] || aiUpdates[0];
  const todayDateStr = useMemo(() => new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }), []);

  return (
    <section className="ai-news-section">
      <div className="ai-news-header">
        <div>
          <div className="live-indicator">
            <span className={`live-dot ${wsConnected ? 'connected' : ''}`} />
            <Radio size={14} /> WEBSOCKET LIVE STREAM {wsConnected ? `· CONNECTED (${todayDateStr})` : `· STANDBY (${todayDateStr})`}
            {liveCount > 0 && <span className="live-count-pill">{liveCount} live packets received today</span>}
          </div>
          <h2>Latest Ecosystem & Model Updates</h2>
          <p>Real-time updates, model releases, and feature rollouts updated automatically every day ({todayDateStr}).</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button className={`button ${liveStreamActive ? 'active-stream' : ''}`} onClick={() => setLiveStreamActive(!liveStreamActive)}>
            <Wifi size={14} /> {liveStreamActive ? 'Pause Socket' : 'Resume Live'}
          </button>
          <button className="button" onClick={() => setRotator(r => r + 1)}>
            <RefreshCw size={14} /> Next update
          </button>
        </div>
      </div>

      <div className="ai-news-ticker">
        <span className="ticker-badge"><Sparkles size={13} /> LIVE WEBSOCKET TICKER</span>
        <a href={activeTicker.link} target="_blank" rel="noreferrer" className="ticker-text">
          <b>{activeTicker.source}:</b> {activeTicker.title} — <span>{activeTicker.time}</span>
        </a>
      </div>

      <div className="ai-news-filters">
        {(['all', 'models', 'features', 'open-source'] as const).map(cat => (
          <button key={cat} className={filter === cat ? 'active' : ''} onClick={() => setFilter(cat)}>
            {cat === 'all' ? 'All Updates' : cat === 'models' ? 'Model Releases' : cat === 'features' ? 'Tool Features' : 'Open Source'}
          </button>
        ))}
      </div>

      <div className="ai-news-grid">
        <AnimatePresence>
          {filtered.map(item => {
            const linkedTool = allTools.find(t => t.id === item.toolId);
            const isLatest = item.id === latestLiveId;
            return (
              <motion.article 
                key={item.id} 
                layout 
                initial={{ opacity: 0, y: -12 }} 
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`ai-news-card ${isLatest ? 'live-highlight' : ''}`}
              >
                <div className="news-top">
                  <span className="news-tag">{item.tag}</span>
                  <span className="news-time">{item.time}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <div className="news-footer">
                  <span className="news-source"><Globe size={13} /> {item.source}</span>
                  <div className="news-actions">
                    {linkedTool && <Link to={`/tools/${linkedTool.id}`} className="visit">Directory entry <ChevronRight size={13} /></Link>}
                    <a href={item.link} target="_blank" rel="noreferrer" className="visit">Direct link <ExternalLink size={13} /></a>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Maker() {
  return (
    <>
      <div className="page-heading compact">
        <div>
          <p className="eyebrow">CREATOR & BUILDER</p>
          <h1>Meet the Maker</h1>
          <p>The developer behind the AIEcosystem directory and platform.</p>
        </div>
      </div>

      <div className="maker-grid">
        <div className="maker-card">
          <div className="maker-header">
            <div className="maker-avatar">MR</div>
            <div>
              <h2>Mohammed Reyaan</h2>
              <p className="maker-role">Full-Stack AI Software Engineer & Platform Architect</p>
              <div className="maker-badges">
                <span className="badge free">Open Source Creator</span>
                <span className="badge freemium">AI Ecosystem</span>
              </div>
            </div>
          </div>

          <p className="maker-bio">
            Passionate software engineer building intelligent tool directories, high-performance web applications, and developer ecosystems. Dedicated to organizing frontier AI models and software productivity tools into a unified, elegant platform.
          </p>

          <div className="maker-links">
            <a href="https://github.com/mohammedreyaan177-lab" target="_blank" rel="noreferrer" className="primary maker-btn github-btn">
              <GithubIcon size={18} /> GitHub Profile <ExternalLink size={14} />
            </a>
            <a href="https://www.linkedin.com/in/mohammed-reyaan-3a58aa375/" target="_blank" rel="noreferrer" className="button maker-btn linkedin-btn">
              <LinkedinIcon size={18} /> LinkedIn Profile <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <div className="maker-side">
          <h3>Platform Vision</h3>
          <p>AIEcosystem curates, organizes, and compares the world's most powerful AI models, developer tools, design platforms, and productivity applications.</p>
          <div className="maker-stats">
            <div><b>100+</b><span>Curated Tools</span></div>
            <div><b>16+</b><span>Categories</span></div>
            <div><b>Daily</b><span>Live Feed Updates</span></div>
          </div>
        </div>
      </div>
    </>
  );
}

function useStored(key: string, fallback: string[] = []) { const [value, setValue] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem(key) || 'null') || fallback } catch { return fallback } }); useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key]); return [value, setValue] as const }
const brandIconMap: Record<string, string> = {
  'opencode': 'https://cdn.simpleicons.org/huggingface',
  'nous-hermes': 'https://cdn.simpleicons.org/python',
  'nvidia-nemotron': 'https://cdn.simpleicons.org/nvidia',
  'nvidia-cosmos': 'https://cdn.simpleicons.org/nvidia',
  'qwen-coder': 'https://cdn.simpleicons.org/alibabacloud',
  'deepseek-r1-model': 'https://cdn.simpleicons.org/deepseek',
  'llama-3-3': 'https://cdn.simpleicons.org/meta',
  'codestral': 'https://cdn.simpleicons.org/mistral',
  'phi-4': 'https://cdn.simpleicons.org/microsoft',
  'yi-lightning': 'https://cdn.simpleicons.org/huggingface',
  'chatgpt': 'https://cdn.simpleicons.org/openai',
  'claude': 'https://cdn.simpleicons.org/anthropic',
  'gemini': 'https://cdn.simpleicons.org/googlegemini',
  'grok': 'https://cdn.simpleicons.org/x',
  'deepseek': 'https://cdn.simpleicons.org/deepseek',
  'meta-ai': 'https://cdn.simpleicons.org/meta',
  'le-chat': 'https://cdn.simpleicons.org/mistral',
  'copilot': 'https://cdn.simpleicons.org/microsoft',
  'perplexity': 'https://cdn.simpleicons.org/perplexity',
  'character-ai': 'https://cdn.simpleicons.org/characterdotai',
  'huggingchat': 'https://cdn.simpleicons.org/huggingface',
  'poe': 'https://cdn.simpleicons.org/quora',
  'groq': 'https://cdn.simpleicons.org/groq',
  'notebooklm': 'https://cdn.simpleicons.org/google',
  'phind': 'https://cdn.simpleicons.org/phind',
  'cursor': 'https://cdn.simpleicons.org/cursor',
  'windsurf': 'https://cdn.simpleicons.org/codeium',
  'github-copilot': 'https://cdn.simpleicons.org/githubcopilot',
  'codeium': 'https://cdn.simpleicons.org/codeium',
  'continue': 'https://cdn.simpleicons.org/continue',
  'replit-ai': 'https://cdn.simpleicons.org/replit',
  'v0': 'https://cdn.simpleicons.org/vercel',
  'bolt': 'https://cdn.simpleicons.org/stackblitz',
  'lovable': 'https://cdn.simpleicons.org/lovable',
  'tabnine': 'https://cdn.simpleicons.org/tabnine',
  'amazon-q': 'https://cdn.simpleicons.org/amazonaws',
  'supermaven': 'https://cdn.simpleicons.org/supermaven',
  'vscode': 'https://cdn.simpleicons.org/visualstudiocode',
  'github': 'https://cdn.simpleicons.org/github',
  'docker': 'https://cdn.simpleicons.org/docker',
  'postman': 'https://cdn.simpleicons.org/postman',
  'vercel': 'https://cdn.simpleicons.org/vercel',
  'netlify': 'https://cdn.simpleicons.org/netlify',
  'gitlab': 'https://cdn.simpleicons.org/gitlab',
  'insomnia': 'https://cdn.simpleicons.org/insomnia',
  'npm': 'https://cdn.simpleicons.org/npm',
  'stackoverflow': 'https://cdn.simpleicons.org/stackoverflow',
  'n8n': 'https://cdn.simpleicons.org/n8n',
  'zapier': 'https://cdn.simpleicons.org/zapier',
  'make': 'https://cdn.simpleicons.org/make',
  'crewai': 'https://cdn.simpleicons.org/python',
  'langchain': 'https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@latest/icons/langchain-color.svg',
  'langgraph': 'https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@latest/icons/langgraph-color.svg',
  'flowise': 'https://cdn.simpleicons.org/flowise',
  'open-webui': 'https://cdn.simpleicons.org/openwebui',
  'ollama': 'https://cdn.simpleicons.org/ollama',
  'lm-studio': 'https://cdn.simpleicons.org/lmstudio',
  'anythingllm': 'https://cdn.simpleicons.org/anythingllm',
  'pipedream': 'https://cdn.simpleicons.org/pipedream',
  'windmill': 'https://cdn.simpleicons.org/windmill',
  'supabase': 'https://cdn.simpleicons.org/supabase',
  'neon': 'https://cdn.simpleicons.org/neon',
  'aws': 'https://cdn.simpleicons.org/amazonaws',
  'google-cloud': 'https://cdn.simpleicons.org/googlecloud',
  'cloudflare': 'https://cdn.simpleicons.org/cloudflare',
  'pinecone': 'https://cdn.simpleicons.org/pinecone',
  'qdrant': 'https://cdn.simpleicons.org/qdrant',
  'chromadb': 'https://cdn.simpleicons.org/chroma',
  'render': 'https://cdn.simpleicons.org/render',
  'railway': 'https://cdn.simpleicons.org/railway',
  'fly-io': 'https://cdn.simpleicons.org/flydotio',
  'digitalocean': 'https://cdn.simpleicons.org/digitalocean',
  'herokuboy': 'https://cdn.simpleicons.org/heroku',
  'figma': 'https://cdn.simpleicons.org/figma',
  'canva': 'https://cdn.simpleicons.org/canva',
  'framer': 'https://cdn.simpleicons.org/framer',
  'webflow': 'https://cdn.simpleicons.org/webflow',
  'rive': 'https://cdn.simpleicons.org/rive',
  'midjourney': 'https://cdn.simpleicons.org/midjourney',
  'dall-e-3': 'https://cdn.simpleicons.org/openai',
  'flux': 'https://cdn.simpleicons.org/blackforestlabs',
  'stable-diffusion': 'https://cdn.simpleicons.org/stabilityai',
  'ideogram': 'https://cdn.simpleicons.org/ideogram',
  'recraft': 'https://cdn.simpleicons.org/recraft',
  'leonardo-ai': 'https://cdn.simpleicons.org/leonardoai',
  'coursera': 'https://cdn.simpleicons.org/coursera',
  'deeplearning-ai': 'https://cdn.simpleicons.org/deeplearningai',
  'kaggle': 'https://cdn.simpleicons.org/kaggle',
  'udemy': 'https://cdn.simpleicons.org/udemy',
  'jira': 'https://cdn.simpleicons.org/jira',
  'linear': 'https://cdn.simpleicons.org/linear',
  'trello': 'https://cdn.simpleicons.org/trello',
  'asana': 'https://cdn.simpleicons.org/asana',
  'suno': 'https://cdn.simpleicons.org/suno',
  'udio': 'https://cdn.simpleicons.org/udio',
  'notion-ai': 'https://cdn.simpleicons.org/notion',
  'notion': 'https://cdn.simpleicons.org/notion',
  'coda-ai': 'https://cdn.simpleicons.org/coda',
  'clickup-ai': 'https://cdn.simpleicons.org/clickup',
  'gamma': 'https://cdn.simpleicons.org/gamma',
  'otterai': 'https://cdn.simpleicons.org/otterai',
  'firefliesai': 'https://cdn.simpleicons.org/firefliesai',
  'descript': 'https://cdn.simpleicons.org/descript',
  'capcut-ai': 'https://cdn.simpleicons.org/capcut',
  'riverside': 'https://cdn.simpleicons.org/riversidefm',
  'elicit': 'https://cdn.simpleicons.org/elicit',
  'consensus': 'https://cdn.simpleicons.org/consensus',
  'runway': 'https://cdn.simpleicons.org/runway',
  'pika': 'https://cdn.simpleicons.org/pika',
  'heygen': 'https://cdn.simpleicons.org/heygen',
  'synthesia': 'https://cdn.simpleicons.org/synthesia',
  'kling-ai': 'https://cdn.simpleicons.org/klingai',
  'elevenlabs': 'https://cdn.simpleicons.org/elevenlabs',
  'playht': 'https://cdn.simpleicons.org/playht',
  'speechify': 'https://cdn.simpleicons.org/speechify',
  'jasper': 'https://cdn.simpleicons.org/jasper',
  'copyai': 'https://cdn.simpleicons.org/copyai',
  'writesonic': 'https://cdn.simpleicons.org/writesonic',
  'grammarly': 'https://cdn.simpleicons.org/grammarly',
  'quillbot': 'https://cdn.simpleicons.org/quillbot',
  'deepl': 'https://cdn.simpleicons.org/deepl',
  'slack': 'https://cdn.simpleicons.org/slack',
  'discord': 'https://cdn.simpleicons.org/discord',
  'miro': 'https://cdn.simpleicons.org/miro',
  'vps-hetzner': 'https://cdn.simpleicons.org/hetzner',
  'vps-linode': 'https://cdn.simpleicons.org/linode',
  'vps-vultr': 'https://cdn.simpleicons.org/vultr'
};

function ToolLogo({ tool, large = false }: { tool: Tool; large?: boolean }) {
  const [srcIndex, setSrcIndex] = useState(0);

  const domain = useMemo(() => {
    if (!tool.website) return '';
    try {
      return new URL(tool.website).hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  }, [tool.website]);

  const sources = useMemo(() => {
    const list: string[] = [];
    if (brandIconMap[tool.id]) {
      list.push(brandIconMap[tool.id]);
    }
    if (domain) {
      list.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
      list.push(`https://logo.clearbit.com/${domain}`);
      list.push(`https://${domain}/favicon.ico`);
      list.push(`https://icon.horse/icon/${domain}`);
    }
    return list;
  }, [tool.id, domain]);

  useEffect(() => {
    setSrcIndex(0);
  }, [tool.id, tool.website]);

  const currentSrc = sources[srcIndex];

  return (
    <div className={`tool-logo ${large ? 'large' : ''}`}>
      {currentSrc && srcIndex < sources.length ? (
        <img
          src={currentSrc}
          alt={`${tool.name} logo`}
          onError={() => setSrcIndex(prev => prev + 1)}
          loading="lazy"
        />
      ) : (
        <span className="fallback-show">
          {tool.name.slice(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
}
function Logo({ small = false }: { small?: boolean }) { return <Link to="/" className="brand"><img className="brandmark" src={brandLogo} alt="AIEcosystem logo"/>{!small && <span>AIEcosystem</span>}</Link> }
function Pricing({ tool }: { tool: Tool }) { return <span className={`badge ${tool.pricingLabel.toLowerCase()}`}>{tool.pricingLabel}</span> }
function ToolCard({ tool, favorites, toggleFavorite, compare, toggleCompare }: { tool: Tool; favorites: string[]; toggleFavorite: (id:string)=>void; compare: string[]; toggleCompare: (id:string)=>void }) { 
  const isFav = favorites.includes(tool.id);
  const isComp = compare.includes(tool.id);
  return (
    <motion.article layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="tool-card">
      <div className="tool-top">
        <ToolLogo tool={tool}/>
        <div className="tool-actions">
          <button className={isFav ? 'icon active' : 'icon'} onClick={() => toggleFavorite(tool.id)} aria-label="Toggle favorite" title={isFav ? 'Remove from saved' : 'Save tool'}>
            <Heart size={16} fill={isFav ? '#e0245e' : 'none'} color={isFav ? '#e0245e' : 'currentColor'}/>
          </button>
          <button className={isComp ? 'icon active' : 'icon'} onClick={() => toggleCompare(tool.id)} aria-label="Toggle compare" title="Compare tool">
            <Boxes size={16}/>
          </button>
        </div>
      </div>
      <div className="name-certified-wrap">
        <Link to={`/tools/${tool.id}`} className="tool-name">{tool.name}</Link>
        {tool.developerCertified && (
          <span className="badge certified" title="Verified Tech Community Pick">
            <Check size={11} /> Dev Certified
          </span>
        )}
      </div>
      <p className="company">{tool.company} · <span>{title(tool.category)}</span></p>
      <p className="description">{tool.description}</p>
      {tool.tags && tool.tags.length > 0 && (
        <div className="card-tags">
          {tool.tags.slice(0, 4).map(tag => (
            <span key={tag} className="tag-chip">{tag}</span>
          ))}
        </div>
      )}
      <div className="card-footer">
        <Pricing tool={tool}/>
        <span className="rating"><Star size={14} fill="currentColor"/> {tool.rating.toFixed(1)}</span>
        {tool.website ? <a className="visit" href={tool.website} target="_blank" rel="noreferrer">Visit <ExternalLink size={13}/></a> : <Link className="visit" to={`/tools/${tool.id}`}>Details <ChevronRight size={13}/></Link>}
        {tool.playstore && <a className="playstore-link" href={tool.playstore} target="_blank" rel="noreferrer"><Smartphone size={13}/>Android</a>}
      </div>
    </motion.article>
  ) 
}

const trendingTech = [
  { name: 'NVIDIA Nemotron', tag: 'Open Model', query: 'nvidia' },
  { name: 'Nous Hermes 3', tag: 'Reasoning', query: 'hermes' },
  { name: 'OpenCode', tag: 'AI Coding', query: 'opencode' },
  { name: 'DeepSeek R1', tag: 'Chain-of-Thought', query: 'deepseek' },
  { name: 'Supabase & Neon', tag: 'Serverless DB', query: 'cloud' },
  { name: 'Claude 3.7', tag: 'AI Coding', query: 'claude' }
];

function TrendingTechBar() {
  return (
    <div className="trending-tech-strip">
      <div className="trending-label">
        <Sparkles size={13} /> TRENDING TECH:
      </div>
      <div className="trending-chips">
        {trendingTech.map(item => (
          <Link key={item.name} to={`/browse?q=${encodeURIComponent(item.query)}`} className="trending-chip">
            <b>{item.name}</b> <small>{item.tag}</small>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, tone = '' }: { icon: any; label: string; value: number; tone?: string }) { return <div className="stat"><span className={`stat-icon ${tone}`}><Icon size={18}/></span><div><b>{value.toLocaleString()}</b><span>{label}</span></div></div> }
function Dashboard(props: PageProps) { const trend = [...allTools].sort((a,b) => b.rating - a.rating).slice(0,6); return <><div className="page-heading"><div><p className="eyebrow">OVERVIEW</p><h1>Good evening, explorer.</h1><p>Discover the best tools for your next AI workflow.</p></div><Link className="primary" to="/browse"><Search size={16}/> Explore tools</Link></div><TrendingTechBar/><section className="stats"><Stat icon={Bot} label="AI tools" value={allTools.length} tone="blue"/><Stat icon={Zap} label="Free to try" value={allTools.filter(t=>t.pricing.free).length} tone="green"/><Stat icon={BarChart3} label="Categories" value={categories.length} tone="purple"/><Stat icon={Users} label="Companies" value={new Set(allTools.map(t=>t.company)).size} tone="orange"/></section><SectionHead title="Top rated AI" action="View all" to="/browse"/><div className="tool-grid">{trend.map(t => <ToolCard key={t.id} tool={t} {...props}/>)}</div><LatestAIUpdates/></> }
type PageProps = { favorites:string[]; toggleFavorite:(id:string)=>void; compare:string[]; toggleCompare:(id:string)=>void }

function SectionHead({ title, action, to }: { title:string; action?:string; to?:string }) { return <div className="section-head"><h2>{title}</h2>{action && to && <Link to={to}>{action} <ChevronRight size={15}/></Link>}</div> }
function Browse(props: PageProps) { const location = useLocation(); const params = new URLSearchParams(location.search); const [query, setQuery] = useState(params.get('q') || ''); const [category, setCategory] = useState(params.get('category') || ''); const [pricing, setPricing] = useState(params.get('pricing') || ''); const [freeOnly, setFreeOnly] = useState(params.get('free') === 'true'); const [openOnly, setOpenOnly] = useState(params.get('open') === 'true'); const [apiOnly, setApiOnly] = useState(false); const [sort, setSort] = useState('rating'); useEffect(() => { const next = new URLSearchParams(location.search); setQuery(next.get('q') || ''); setCategory(next.get('category') || ''); setPricing(next.get('pricing') || ''); setFreeOnly(next.get('free') === 'true') }, [location.search]); const list = useMemo(() => allTools.filter(t => (!category || t.category === category) && (!pricing || t.pricingLabel === pricing) && (!freeOnly || t.pricing.free) && (!openOnly || t.openSource) && (!apiOnly || t.apiAvailable) && (!query || `${t.name} ${t.company} ${t.category} ${t.description} ${t.tags ? t.tags.join(' ') : ''}`.toLowerCase().includes(query.toLowerCase()))).sort((a,b) => sort === 'name' ? a.name.localeCompare(b.name) : sort === 'new' ? b.id.localeCompare(a.id) : b.rating - a.rating), [query,category,pricing,freeOnly,openOnly,apiOnly,sort]); const reset = () => { setQuery(''); setCategory(''); setPricing(''); setFreeOnly(false); setOpenOnly(false); setApiOnly(false); setSort('rating') }; return <><div className="page-heading compact"><div><p className="eyebrow">DISCOVER</p><h1>Explore AI tools</h1><p>Find the right tool by capability, price, openness, API access, and community rating.</p></div></div><div className="filterbar"><div className="search-input"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search 100+ AI tools, models, dev tools, or capabilities…"/>{query && <button type="button" className="search-clear-btn" onClick={()=>setQuery('')} aria-label="Clear search"><X size={15}/></button>}</div><select value={category} onChange={e=>setCategory(e.target.value)}><option value="">All categories</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select><select value={pricing} onChange={e=>setPricing(e.target.value)}><option value="">Any pricing</option><option>Free</option><option>Freemium</option><option>Paid</option></select><select value={sort} onChange={e=>setSort(e.target.value)}><option value="rating">Top rated</option><option value="name">Name A–Z</option><option value="new">Recently added</option></select></div><div className="filter-chips"><button className={freeOnly?'selected':''} onClick={()=>setFreeOnly(!freeOnly)}><Check size={14}/> Free access</button><button className={openOnly?'selected':''} onClick={()=>setOpenOnly(!openOnly)}><Check size={14}/> Open source</button><button className={apiOnly?'selected':''} onClick={()=>setApiOnly(!apiOnly)}><Check size={14}/> API available</button><button className="clear" onClick={reset}>Clear filters</button></div><p className="results">{list.length} matching tools · sorted by {sort === 'rating' ? 'rating' : sort === 'name' ? 'name' : 'newness'}</p><div className="tool-grid">{list.map(t => <ToolCard key={t.id} tool={t} {...props}/>)}</div>{!list.length && <Empty title="No tools found" text="Try removing a filter or searching for a broader term."/>}</> }
function Categories() { return <><div className="page-heading compact"><div><p className="eyebrow">COLLECTIONS</p><h1>Browse topics</h1><p>Explore AI tools organized by their primary capability.</p></div></div><div className="topics">{categories.map(c=><Link to={`/browse?category=${c.id}`} className="topic" key={c.id}><FolderGit2 size={21}/><div><h2>{c.name}</h2><p>{c.description}</p><small>{c.count} AI tools</small></div><ChevronRight size={18}/></Link>)}</div></> }
function getToolBestFor(tool: Tool) {
  const cat = tool.category.toLowerCase();
  if (cat === 'productivity') {
    return {
      targetAudience: ['Product Managers', 'Executive Assistants', 'Operations Teams', 'Knowledge Workers'],
      useCases: [
        'Organizing team notes, docs, and knowledge bases with instant AI synthesis.',
        'Automating meeting summaries, action items, and task assignments across projects.',
        'Generating slide decks, executive summaries, and smart documents in seconds.'
      ],
      strengths: ['Deep workspace integration', 'Contextual document search', 'Automated workflow triggers']
    };
  } else if (cat === 'coding' || cat === 'devtools') {
    return {
      targetAudience: ['Full-Stack Engineers', 'DevOps Specialists', 'Open Source Maintainers'],
      useCases: [
        'Context-aware code completion and multi-file code generation directly in the workspace.',
        'Debugging complex stack traces and refactoring legacy codebases with agentic AI.',
        'Automating pull request summaries, test generation, and documentation.'
      ],
      strengths: ['Background codebase indexing', 'Ultra-fast LPU/GPU inference', 'Multi-language grammar support']
    };
  } else if (cat === 'chat' || cat === 'research') {
    return {
      targetAudience: ['Researchers & Analysts', 'Students & Educators', 'Strategy Consultants'],
      useCases: [
        'Deep research and cited web intelligence gathering across real-time sources.',
        'Interactive reasoning on complex mathematical, technical, and strategic queries.',
        'Synthesizing massive PDF/document collections into concise audio/text insights.'
      ],
      strengths: ['Verified web citations', 'Long-context window capacity', 'Step-by-step chain of thought']
    };
  } else if (cat === 'writing') {
    return {
      targetAudience: ['Content Marketers', 'Copywriters', 'Technical Writers', 'Translators'],
      useCases: [
        'Drafting high-converting blog posts, marketing copy, and customer emails.',
        'Grammar refinement, tone adjustments, and multilingual translation.',
        'SEO keyword optimization and structured content expansion.'
      ],
      strengths: ['Tone & brand style matching', 'Plagiarism & grammar verification', 'Multi-channel export options']
    };
  } else if (cat === 'image' || cat === 'video' || cat === 'design') {
    return {
      targetAudience: ['UI/UX Designers', 'Social Media Creators', 'Video Editors', 'Brand Strategists'],
      useCases: [
        'Generating high-resolution visual assets and promotional artwork.',
        'Automated video editing, short clips generation, and captioning.',
        'Creating UI/UX mockups and interactive prototype designs from prompts.'
      ],
      strengths: ['4K resolution output', 'Prompt-to-video capabilities', 'Granular style and camera controls']
    };
  } else if (cat === 'voice' || cat === 'music') {
    return {
      targetAudience: ['Podcasters', 'Music Producers', 'Game Developers', 'Localization Teams'],
      useCases: [
        'Studio-quality voiceovers, text-to-speech synthesis, and voice cloning.',
        'Full-length AI song composition with clear vocals and instrumentals.',
        'Podcast editing, background noise removal, and automated audio mastering.'
      ],
      strengths: ['Hyper-realistic emotional inflection', 'Multi-stem audio separation', 'Commercial usage licensing']
    };
  } else {
    return {
      targetAudience: ['Domain Professionals', 'Startup Founders', 'AI Innovators'],
      useCases: [
        `Streamlining ${title(tool.category)} tasks with AI automation.`,
        'Improving team execution speed and workflow efficiency.',
        'Reducing repetitive manual effort with intelligent tools.'
      ],
      strengths: ['High reliability & uptime', 'Seamless tool integration', 'Scalable cloud performance']
    };
  }
}

function getToolFeatures(tool: Tool) {
  return [
    { title: 'AI Intelligence Core', description: `Next-generation neural architecture optimized specifically for ${title(tool.category)} workflows.`, included: true },
    { title: 'Free Tier / Trial Access', description: tool.pricing.free ? 'Free plan or evaluation trial available without mandatory credit card.' : 'Paid subscription tiers optimized for professional and enterprise teams.', included: tool.pricing.free },
    { title: 'Developer API & Integration', description: tool.apiAvailable ? 'RESTful API and developer SDKs available for building custom extensions.' : 'Accessible via intuitive web application and browser interface.', included: tool.apiAvailable },
    { title: 'Open Source Transparency', description: tool.openSource ? 'Open-weights model or open-source codebase available on GitHub.' : 'Managed proprietary platform maintained by vendor.', included: tool.openSource },
    { title: 'Mobile & Cloud Sync', description: tool.playstore ? 'Native Android mobile application available on Google Play.' : 'Cloud-synced web application accessible on all modern browsers.', included: Boolean(tool.playstore || tool.website) },
    { title: 'Data Privacy & Security', description: 'Enterprise data protection with encrypted transport and strict privacy controls.', included: true }
  ];
}

function Detail(props: PageProps) {
  const { id } = useParams();
  const nav = useNavigate();
  const tool = allTools.find(t => t.id === id);
  const [activeTab, setActiveTab] = useState<'overview' | 'bestfor' | 'features' | 'alternatives'>('overview');

  useEffect(() => {
    if (tool) {
      const viewed = JSON.parse(localStorage.getItem('recent-ai') || '[]').filter((x: string) => x !== tool.id);
      localStorage.setItem('recent-ai', JSON.stringify([tool.id, ...viewed].slice(0, 8)));
    }
  }, [tool]);

  if (!tool) return <Empty title="Tool not found" text="This tool is no longer in the data index." />;

  const alternatives = allTools.filter(t => t.category === tool.category && t.id !== tool.id);
  const sidebarAlternatives = alternatives.slice(0, 4);
  const bestFor = getToolBestFor(tool);
  const features = getToolFeatures(tool);

  return (
    <>
      <button className="back" onClick={() => nav(-1)}>← Back</button>
      <header className="repo-header">
        <ToolLogo tool={tool} large />
        <div>
          <p className="eyebrow">{title(tool.category)} / TOOL</p>
          <div className="name-certified-wrap">
            <h1>{tool.name}</h1>
            {tool.developerCertified && (
              <span className="badge certified large-badge" title="Verified Tech Community Pick">
                <Check size={13} /> Dev Certified
              </span>
            )}
          </div>
          <p>{tool.company} · {tool.description}</p>
        </div>
        <div className="repo-actions">
          <button onClick={() => props.toggleFavorite(tool.id)} className={props.favorites.includes(tool.id) ? 'button active' : 'button'}>
            <Heart size={16} /> {props.favorites.includes(tool.id) ? 'Saved' : 'Favorite'}
          </button>
          <button onClick={() => props.toggleCompare(tool.id)} className={props.compare.includes(tool.id) ? 'button active' : 'button'}>
            <Boxes size={16} /> Compare
          </button>
          {tool.website && (
            <a className="primary" href={tool.website} target="_blank" rel="noreferrer">
              Visit website <ExternalLink size={15} />
            </a>
          )}
          {tool.playstore && (
            <a className="button playstore-btn" href={tool.playstore} target="_blank" rel="noreferrer">
              <Smartphone size={15} /> Play Store
            </a>
          )}
        </div>
      </header>

      <nav className="tabs">
        <button type="button" className={activeTab === 'overview' ? 'tab-btn selected' : 'tab-btn'} onClick={() => setActiveTab('overview')}>
          Overview
        </button>
        <button type="button" className={activeTab === 'bestfor' ? 'tab-btn selected' : 'tab-btn'} onClick={() => setActiveTab('bestfor')}>
          Best for
        </button>
        <button type="button" className={activeTab === 'features' ? 'tab-btn selected' : 'tab-btn'} onClick={() => setActiveTab('features')}>
          Features
        </button>
        <button type="button" className={activeTab === 'alternatives' ? 'tab-btn selected' : 'tab-btn'} onClick={() => setActiveTab('alternatives')}>
          Alternatives <span>{alternatives.length}</span>
        </button>
      </nav>

      <div className="detail-grid">
        <section className="readme">
          {activeTab === 'overview' && (
            <div className="tab-panel">
              <h2>About {tool.name}</h2>
              <p>{tool.description} Explore availability, pricing models, official platform access, and community alternatives below.</p>
              
              <div className="quick-tags">
                {tool.developerCertified && <span className="badge certified"><Check size={12} /> Dev Certified</span>}
                <span className="badge free"><Check size={12} /> {tool.pricingLabel}</span>
                {tool.apiAvailable && <span className="badge freemium"><Zap size={12} /> API Available</span>}
                {tool.openSource && <span className="badge paid"><FolderGit2 size={12} /> Open Source</span>}
                <span className="rating-badge"><Star size={13} fill="currentColor" /> {tool.rating.toFixed(1)} Community Rating</span>
              </div>

              {tool.tags && tool.tags.length > 0 && (
                <div className="detail-tags-section">
                  <h3>Tags & Keywords</h3>
                  <div className="card-tags">
                    {tool.tags.map(tag => (
                      <Link key={tag} to={`/browse?q=${encodeURIComponent(tag)}`} className="tag-chip">
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <h3>Specifications & Details</h3>
              <dl>
                <dt>Company</dt><dd>{tool.company}</dd>
                <dt>Primary category</dt><dd><Link to={`/browse?category=${tool.category}`}>{title(tool.category)}</Link></dd>
                <dt>Pricing model</dt><dd><Pricing tool={tool} /></dd>
                <dt>Official website</dt><dd>{tool.website ? <a href={tool.website} target="_blank" rel="noreferrer">{tool.website.replace(/^https?:\/\//, '')} <ExternalLink size={13} /></a> : 'Not listed'}</dd>
                <dt>Android app</dt><dd>{tool.playstore ? <a href={tool.playstore} target="_blank" rel="noreferrer">Get on Google Play <ExternalLink size={13} /></a> : 'Not available'}</dd>
              </dl>
            </div>
          )}

          {activeTab === 'bestfor' && (
            <div className="tab-panel">
              <h2>Who is {tool.name} Best For?</h2>
              <p>Ideal workflows and target users optimized for {tool.name}.</p>
              
              <h3>Target Audience</h3>
              <div className="audience-chips">
                {bestFor.targetAudience.map(aud => (
                  <span key={aud} className="audience-chip"><User size={13} /> {aud}</span>
                ))}
              </div>

              <h3>Recommended Use Cases</h3>
              <ul className="use-case-list">
                {bestFor.useCases.map((uc, i) => (
                  <li key={i}><Check size={16} className="check-icon" /> <span>{uc}</span></li>
                ))}
              </ul>

              <h3>Core Strengths</h3>
              <div className="strengths-grid">
                {bestFor.strengths.map((str, i) => (
                  <div key={i} className="strength-card">
                    <Sparkles size={16} />
                    <b>{str}</b>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="tab-panel">
              <h2>Key Capabilities & Feature Grid</h2>
              <p>Detailed feature breakdown for {tool.name}.</p>

              <div className="features-grid">
                {features.map((feat, i) => (
                  <div key={i} className={`feature-card ${feat.included ? 'included' : 'excluded'}`}>
                    <div className="feature-header">
                      <span className={`feature-status ${feat.included ? 'yes' : 'no'}`}>
                        {feat.included ? <Check size={14} /> : <X size={14} />}
                      </span>
                      <h4>{feat.title}</h4>
                    </div>
                    <p>{feat.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'alternatives' && (
            <div className="tab-panel">
              <h2>All Alternatives to {tool.name}</h2>
              <p>Discover top rated tools in the <b>{title(tool.category)}</b> category.</p>

              {alternatives.length > 0 ? (
                <div className="alternatives-tab-grid">
                  {alternatives.map(alt => (
                    <ToolCard key={alt.id} tool={alt} {...props} />
                  ))}
                </div>
              ) : (
                <p className="no-related">No alternative tools registered in this category yet.</p>
              )}
            </div>
          )}
        </section>

        <aside className="detail-side">
          <div className="detail-side-header">
            <Sparkles size={16} />
            <h3>Related {title(tool.category)} Tools</h3>
          </div>
          {sidebarAlternatives.length > 0 ? sidebarAlternatives.map(x => (
            <Link to={`/tools/${x.id}`} key={x.id} className="related-tool-item">
              <ToolLogo tool={x} />
              <div className="related-tool-info">
                <span className="related-tool-name">{x.name}</span>
                <div className="related-tool-meta">
                  <Pricing tool={x} />
                  <span>{x.company}</span>
                </div>
              </div>
              <ChevronRight size={16} className="related-tool-chevron" />
            </Link>
          )) : (
            <p className="no-related">No other tools found in this category.</p>
          )}
        </aside>
      </div>
    </>
  );
}

function AddToolDropdown({ compare, toggleCompare }: { compare: string[]; toggleCompare: (id: string) => void }) {
  const available = allTools.filter(t => !compare.includes(t.id));
  return (
    <div className="add-compare-slot">
      <select
        defaultValue=""
        onChange={e => {
          if (e.target.value) {
            toggleCompare(e.target.value);
            e.target.value = '';
          }
        }}
      >
        <option value="" disabled>+ Add tool to compare...</option>
        {available.map(t => (
          <option key={t.id} value={t.id}>
            {t.name} ({title(t.category)})
          </option>
        ))}
      </select>
    </div>
  );
}

function Compare(props: PageProps) {
  const selected = allTools.filter(t => props.compare.includes(t.id));

  return (
    <>
      <div className="page-heading compact">
        <div>
          <p className="eyebrow">COMPARE</p>
          <h1>Compare AI tools side-by-side</h1>
          <p>Evaluate features, pricing models, ratings, API availability, and platform support.</p>
        </div>
        <div className="heading-actions">
          {selected.length > 0 && (
            <button className="button" onClick={() => selected.forEach(t => props.toggleCompare(t.id))}>
              Clear comparison
            </button>
          )}
        </div>
      </div>

      {selected.length > 0 ? (
        <div className="comparison-container">
          <div className="compare-head-grid">
            <div className="compare-head-col attribute-title">
              <span>Comparing ({selected.length}/4)</span>
            </div>
            {selected.map(t => (
              <div key={t.id} className="compare-head-col compare-tool-card">
                <div className="compare-tool-top">
                  <ToolLogo tool={t} />
                  <button
                    className="compare-remove-btn"
                    onClick={() => props.toggleCompare(t.id)}
                    title="Remove from compare"
                  >
                    <X size={16} />
                  </button>
                </div>
                <Link to={`/tools/${t.id}`} className="compare-tool-name">{t.name}</Link>
                <span className="company">{t.company} · <span>{title(t.category)}</span></span>
                <div className="quick-tags">
                  <Pricing tool={t} />
                  <span className="rating"><Star size={13} fill="currentColor" /> {t.rating.toFixed(1)}</span>
                </div>
              </div>
            ))}
            {selected.length < 4 && (
              <div className="compare-head-col">
                <AddToolDropdown compare={props.compare} toggleCompare={props.toggleCompare} />
              </div>
            )}
          </div>

          {[
            ['Developer Certified', (t: Tool) => t.developerCertified ? <span className="cell-check"><Check size={15} /> Dev Certified</span> : <span className="cell-cross">— Standard</span>],
            ['Rating & Score', (t: Tool) => <span className="rating"><Star size={14} fill="currentColor" /> {t.rating.toFixed(1)} / 5.0</span>],
            ['Pricing Model', (t: Tool) => <Pricing tool={t} />],
            ['Company / Host', (t: Tool) => <b>{t.company}</b>],
            ['Primary Category', (t: Tool) => <span className="category-pill">{title(t.category)}</span>],
            ['Free Plan', (t: Tool) => t.pricing.free ? <span className="cell-check"><Check size={15} /> Free tier available</span> : <span className="cell-cross"><X size={15} /> Paid only</span>],
            ['API & SDK Access', (t: Tool) => t.apiAvailable ? <span className="cell-check"><Zap size={15} /> API Available</span> : <span className="cell-cross"><X size={15} /> UI only</span>],
            ['Open Source', (t: Tool) => t.openSource ? <span className="cell-check"><FolderGit2 size={15} /> Open Source</span> : <span className="cell-cross"><X size={15} /> Proprietary</span>],
            ['Android App', (t: Tool) => t.playstore ? <span className="cell-check"><Smartphone size={15} /> Google Play</span> : <span className="cell-cross"><X size={15} /> Not listed</span>],
            ['Website Access', (t: Tool) => t.website ? <a href={t.website} target="_blank" rel="noreferrer" className="visit">Visit site <ExternalLink size={13} /></a> : <span className="cell-cross">Not listed</span>]
          ].map(([label, fn]) => (
            <div className="compare-row-grid" key={label as string}>
              <div className="compare-row-label">{label as string}</div>
              {selected.map(t => (
                <div key={t.id} className="compare-row-cell">
                  {(fn as (t: Tool) => React.ReactNode)(t)}
                </div>
              ))}
              {selected.length < 4 && <div className="compare-row-cell empty-cell">—</div>}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-compare-wrapper">
          <Empty title="Your comparison list is empty" text="Add up to four tools from any card across the directory or select a tool below." />
          <div className="quick-add-section">
            <h3>Quickly add a tool to compare:</h3>
            <AddToolDropdown compare={props.compare} toggleCompare={props.toggleCompare} />
          </div>
        </div>
      )}
    </>
  );
}

function Favorites(props: PageProps) {
  const list = allTools.filter(t => props.favorites.includes(t.id));
  return (
    <>
      <div className="page-heading compact">
        <div>
          <p className="eyebrow">YOUR COLLECTION</p>
          <h1>Saved tools</h1>
          <p>{list.length ? `You have ${list.length} tool${list.length > 1 ? 's' : ''} saved in your collection.` : 'Save your favorite tools to access them quickly.'}</p>
        </div>
        {list.length > 0 && <button className="button" onClick={() => list.forEach(t => props.toggleFavorite(t.id))}>Clear saved tools</button>}
      </div>
      {list.length > 0 ? (
        <div className="tool-grid">
          {list.map(t => <ToolCard key={t.id} tool={t} {...props} />)}
        </div>
      ) : (
        <Empty title="No saved tools yet" text="Click the heart icon on any tool card across the directory to add it here." />
      )}
    </>
  );
}
function Empty({ title, text }: { title:string; text:string }) { return <div className="empty"><CircleHelp size={25}/><h2>{title}</h2><p>{text}</p><Link className="primary" to="/browse">Browse tools</Link></div> }
function Intro({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<'boot' | 'reveal'>('boot');
  const particles = Array.from({ length: 18 }, (_, index) => index);

  useEffect(() => {
    setPhase('boot');
    const timer1 = window.setTimeout(() => setPhase('reveal'), 900);
    const timer2 = window.setTimeout(() => onClose(), 5600);
    return () => { window.clearTimeout(timer1); window.clearTimeout(timer2); };
  }, [onClose]);

  return (
    <motion.div 
      className="intro-canvas"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="intro-noise" />
      <div className="intro-grid" />
      <div className="intro-particle-field" aria-hidden="true">{particles.map(index => <span key={index} style={{'--i': index} as React.CSSProperties}/>)}</div>
      <div className="intro-sun intro-sun-one" /><div className="intro-sun intro-sun-two" />
      <div className="intro-orbit orbit-one" /><div className="intro-orbit orbit-two" /><div className="intro-orbit orbit-three" />
      <div className="intro-corner intro-corner-tl"><i/> SYSTEM / AI-01</div><div className="intro-corner intro-corner-br">DISCOVERY ENGINE <b>LIVE</b></div>
      <div className="intro-metrics"><span><b>278</b> TOOLS INDEXED</span><span><b>16</b> CATEGORIES</span><span><b>∞</b> POSSIBILITIES</span></div>
      <button className="intro-skip" type="button" onClick={onClose}>SKIP INTRO <X size={13}/></button>
      <motion.div className="intro-stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.div className="brand-reactor" initial={{scale:.3,opacity:0,rotate:-40}} animate={{scale:1,opacity:1,rotate:0}} transition={{duration:.85,ease:[.16,1,.3,1]}}>
          <span className="reactor-ring ring-a"/><span className="reactor-ring ring-b"/><span className="reactor-ring ring-c"/>
          <span className="reactor-dot dot-a"/><span className="reactor-dot dot-b"/><span className="reactor-dot dot-c"/>
          <div className="reactor-core"><img src={brandLogo} alt="AIEcosystem logo"/></div>
        </motion.div>
        {phase === 'boot' ? <motion.div className="intro-boot" initial={{opacity:0}} animate={{opacity:1}}><span>INITIALIZING ECOSYSTEM</span><i><em/></i><small>Loading intelligent discovery layer</small></motion.div> : <motion.div className="intro-reveal" initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{duration:.55}}><p>THE DIRECTORY FOR WHAT'S NEXT</p><h1>AI<span>ECOSYSTEM</span></h1><div className="intro-tagline">Find the tools. Build what matters.</div><button type="button" className="intro-enter-btn" onClick={onClose}><span>ENTER THE ECOSYSTEM</span><ChevronRight size={17}/></button><small>or wait to continue</small></motion.div>}
      </motion.div>
    </motion.div>
  );
}

function Shell() { 
  const [favorites,toggleFavs] = useStored('ai-favorites'); 
  const [compare,setCompare] = useStored('ai-compare'); 
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('ai-intro-v3-played'));

  const [command,setCommand]=useState(false); 
  const [cmdQuery,setCmdQuery]=useState('');
  const navigate=useNavigate(); 
  useEffect(()=>{ document.documentElement.dataset.theme='light'; document.documentElement.dataset.accent='sunlight'; localStorage.setItem('ai-theme','sunlight') },[]); 
  useEffect(()=>{ const fn=(e:KeyboardEvent)=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setCommand(true)}}; addEventListener('keydown',fn);return()=>removeEventListener('keydown',fn)},[]); 
  const toggleFavorite=(id:string)=>toggleFavs(x=>x.includes(id)?x.filter(i=>i!==id):[id,...x]); 
  const toggleCompare=(id:string)=>setCompare(x=>x.includes(id)?x.filter(i=>i!==id):x.length<4?[...x,id]:x); 
  const props={favorites,toggleFavorite,compare,toggleCompare}; 
  const nav = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/browse', icon: Search, label: 'Directory' },
    { to: '/categories', icon: FolderGit2, label: 'Categories' },
    { to: '/project-analysis', icon: BrainCircuit, label: 'Project Analysis' },
    { to: '/maker', icon: User, label: 'Maker' },
    { to: '/compare', icon: Boxes, label: 'Compare', count: compare.length },
    { to: '/favorites', icon: Heart, label: 'Saved', count: favorites.length }
  ]; 
  
  const cmdMatches = useMemo(() => {
    if (!cmdQuery.trim()) return [];
    const q = cmdQuery.toLowerCase().trim();
    return allTools.filter(t => `${t.name} ${t.category} ${t.company} ${t.description} ${t.tags ? t.tags.join(' ') : ''}`.toLowerCase().includes(q)).slice(0, 5);
  }, [cmdQuery]);

  const handleCloseIntro = () => {
    sessionStorage.setItem('ai-intro-v3-played', 'true');
    setShowIntro(false);
  };

  return (
    <div className="app">
      <AnimatePresence>
        {showIntro && <Intro onClose={handleCloseIntro} />}
      </AnimatePresence>
      <header className="topbar">
        <Logo/>
        <nav className="header-nav">
          {nav.map(({ to, label, count }) => (
            <NavLink key={to} to={to} end={to === '/'}>
              {label}
              {count !== undefined && count > 0 && <span className="nav-badge">{count}</span>}
            </NavLink>
          ))}
        </nav>
        <button className="global-search" onClick={()=>setCommand(true)} aria-label="Search directory"><Search size={16}/><span>Search 100+ AI tools...</span><kbd><Command size={11}/>K</kbd></button>
        <div className="top-actions">
          <button className="avatar" title="Meet Mohammed Reyaan (Maker)" onClick={()=>navigate('/maker')}>MR</button>
        </div>
      </header>
            <span>AI Ecosystem · v0.1.0</span>
      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard {...props}/>}/>
          <Route path="/browse" element={<Browse {...props}/>}/>
          <Route path="/categories" element={<Categories/>}/>
          <Route path="/project-analysis" element={<ProjectAnalysisPage tools={allTools} categories={categories}/>}/>
          <Route path="/maker" element={<Maker/>}/>
          <Route path="/tools/:id" element={<Detail {...props}/>}/>
          <Route path="/compare" element={<Compare {...props}/>}/>
          <Route path="/favorites" element={<Favorites {...props}/>}/>
          <Route path="*" element={<Empty title="Page not found" text="The page you requested does not exist."/>}/>
        </Routes>
      </main>
      <nav className="mobile-bottom-nav" aria-label="Mobile bottom navigation">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'mobile-nav-item active' : 'mobile-nav-item')}>
          <Home size={20} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/browse" className={({ isActive }) => (isActive ? 'mobile-nav-item active' : 'mobile-nav-item')}>
          <Search size={20} />
          <span>Explore</span>
        </NavLink>
        <NavLink to="/project-analysis" className={({ isActive }) => (isActive ? 'mobile-nav-item active' : 'mobile-nav-item')}>
          <BrainCircuit size={20} />
          <span>Analyze</span>
        </NavLink>
        <NavLink to="/categories" className={({ isActive }) => (isActive ? 'mobile-nav-item active' : 'mobile-nav-item')}>
          <FolderGit2 size={20} />
          <span>Topics</span>
        </NavLink>
        <NavLink to="/favorites" className={({ isActive }) => (isActive ? 'mobile-nav-item active' : 'mobile-nav-item')}>
          <div className="nav-icon-wrap">
            <Heart size={20} />
            {favorites.length > 0 && <span className="mobile-nav-badge">{favorites.length}</span>}
          </div>
          <span>Saved</span>
        </NavLink>
        <NavLink to="/compare" className={({ isActive }) => (isActive ? 'mobile-nav-item active' : 'mobile-nav-item')}>
          <div className="nav-icon-wrap">
            <Boxes size={20} />
            {compare.length > 0 && <span className="mobile-nav-badge">{compare.length}</span>}
          </div>
          <span>Compare</span>
        </NavLink>
      </nav>
      <AnimatePresence>
        {command&&<motion.div className="command-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>{ setCommand(false); setCmdQuery(''); }}>
          <motion.div className="command-box" initial={{scale:.98,y:-8}} animate={{scale:1,y:0}} onClick={e=>e.stopPropagation()}>
            <form onSubmit={(e)=>{ e.preventDefault(); if (cmdQuery.trim()) { navigate(`/browse?q=${encodeURIComponent(cmdQuery.trim())}`); setCommand(false); setCmdQuery(''); } }}>
              <div className="command-input">
                <Search size={18}/>
                <input autoFocus value={cmdQuery} placeholder="Type to search 100+ AI tools, categories, or updates..." onChange={e=>setCmdQuery(e.target.value)}/>
                {cmdQuery && <button type="button" className="cmd-clear" onClick={()=>setCmdQuery('')}><X size={15}/></button>}
                <kbd>ESC</kbd>
              </div>
            </form>
            {cmdQuery.trim() ? (
              <div className="command-results">
                <p>Matching tools ({cmdMatches.length})</p>
                {cmdMatches.map(tool => (
                  <Link key={tool.id} to={`/tools/${tool.id}`} className="command-result-item" onClick={()=>{ setCommand(false); setCmdQuery(''); }}>
                    <ToolLogo tool={tool}/>
                    <div>
                      <b>{tool.name}</b>
                      <small>{title(tool.category)} · {tool.company}</small>
                    </div>
                    <ChevronRight size={14}/>
                  </Link>
                ))}
                <button type="button" className="command-view-all" onClick={()=>{ navigate(`/browse?q=${encodeURIComponent(cmdQuery.trim())}`); setCommand(false); setCmdQuery(''); }}>
                  View all results for "{cmdQuery}" →
                </button>
              </div>
            ) : (
              <div className="command-quick-links">
                <p>Quick navigation</p>
                <Link to="/project-analysis" onClick={()=>setCommand(false)}><BrainCircuit size={16}/> Project Analysis Engine</Link>
                <Link to="/browse" onClick={()=>setCommand(false)}><Search size={16}/> Search all tools</Link>
                <Link to="/categories" onClick={()=>setCommand(false)}><FolderGit2 size={16}/> Browse categories</Link>
                <Link to="/maker" onClick={()=>setCommand(false)}><User size={16}/> Meet the Maker</Link>
                <button type="button" className="command-intro-btn" onClick={() => { setCommand(false); setShowIntro(true); }}><Sparkles size={16}/> Replay welcome intro</button>
              </div>
            )}
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter><Shell/></BrowserRouter></React.StrictMode>)
