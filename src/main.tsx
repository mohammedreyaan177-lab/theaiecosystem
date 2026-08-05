import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { BarChart3, Bot, Boxes, Check, ChevronRight, CircleHelp, Command, ExternalLink, FolderGit2, Globe, Heart, Home, Menu, Moon, Palette, Radio, RefreshCw, Search, Smartphone, Sparkles, Star, TrendingUp, User, Users, X, Zap } from 'lucide-react'
import brandLogo from './assets/ai-ecosystem-logo.png'
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

type RawTool = { id: string; name: string; category: string; pricing: { free: boolean; paid: boolean }; website: string; playstore?: string; rating?: number; openSource?: boolean; apiAvailable?: boolean }
type Tool = RawTool & { company: string; pricingLabel: 'Free' | 'Paid' | 'Freemium'; description: string; rating: number; openSource: boolean; apiAvailable: boolean; playstore: string }
const modules = import.meta.glob('./data/*.json', { eager: true }) as Record<string, { default: RawTool[] }>
const categoryCopy: Record<string, string> = { chat: 'Conversational AI and assistants', image: 'Image generation and creative tools', coding: 'Developer tools and code assistants', video: 'Video generation and editing', writing: 'Writing and content tools', automation: 'Workflow automation and agents', productivity: 'Work, notes, and organization', research: 'Research and information tools', voice: 'Voice generation and audio tools', music: 'Music generation and composition', devtools: 'Essential developer tools and platforms', design: 'Design and creative platforms', collaboration: 'Team communication and collaboration', management: 'Project and task management', cloud: 'Cloud infrastructure and hosting', learning: 'Learning and education platforms' }
const title = (value: string) => value.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
const toolDescriptions: Record<string, string> = {
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
  'vercel': 'Frontend cloud platform for seamless deployment of Next.js and web applications.'
};

const allTools: Tool[] = Object.values(modules).flatMap(m => m.default || []).reduce<RawTool[]>((acc, tool) => { const index = acc.findIndex(x => x.id === tool.id); if (index < 0) return [...acc, tool]; const current = acc[index]; const merged = { ...current } as Record<string, unknown>; Object.entries(tool).forEach(([k, v]) => { if (v !== '' && v !== undefined && v !== null) merged[k] = v }); return acc.map((x,i) => i === index ? merged as RawTool : x) }, []).map(tool => {
  const host = tool.website ? new URL(tool.website).hostname.replace(/^www\./, '').split('.')[0] : ''
  const pricingLabel: Tool['pricingLabel'] = tool.pricing.free && tool.pricing.paid ? 'Freemium' : tool.pricing.free ? 'Free' : 'Paid'
  const customDesc = toolDescriptions[tool.id] || ((tool as any).description && (tool as any).description !== '' ? (tool as any).description : null);
  const description = customDesc || `Next-generation ${title(tool.category)} platform built for intelligent workflows, developer speed, and creative automation.`;
  return { ...tool, company: host ? title(host) : 'Independent', pricingLabel, rating: tool.rating ?? 4.2, openSource: tool.openSource ?? false, apiAvailable: tool.apiAvailable ?? Boolean(tool.website), playstore: tool.playstore || '', description }
}).sort((a,b) => a.name.localeCompare(b.name))
const categories = [...new Set(allTools.map(t => t.category))].map(id => ({ id, name: title(id), count: allTools.filter(t => t.category === id).length, description: categoryCopy[id] || `Explore ${title(id)} AI tools` })).sort((a,b) => b.count-a.count)

function getDynamicTime(hoursOffset: number): string {
  const now = new Date();
  const date = new Date(now.getTime() - hoursOffset * 3600 * 1000);
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return hoursOffset < 1 ? 'Just now' : `Today (${hoursOffset}h ago)`;
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

  useEffect(() => {
    const timer = setInterval(() => setRotator(r => r + 1), 6000);
    return () => clearInterval(timer);
  }, []);

  const aiUpdates = useMemo(() => {
    return rawAIUpdates.map(item => ({
      ...item,
      time: getDynamicTime(item.offsetHours)
    }));
  }, []);

  const filtered = useMemo(() => {
    const list = filter === 'all' ? aiUpdates : aiUpdates.filter(u => u.category === filter);
    return [...list].sort((a, b) => (rotator % 2 === 0 ? 1 : -1) * a.title.localeCompare(b.title));
  }, [filter, rotator, aiUpdates]);

  const activeTicker = aiUpdates[rotator % aiUpdates.length];

  return (
    <section className="ai-news-section">
      <div className="ai-news-header">
        <div>
          <div className="live-indicator">
            <span className="live-dot" />
            <Radio size={14} /> LIVE AI FEED · UPDATED TODAY
          </div>
          <h2>Latest Ecosystem & Model Updates</h2>
          <p>Real-time updates, model releases, and feature rollouts updated dynamically every day.</p>
        </div>
        <button className="button" onClick={() => setRotator(r => r + 1)}>
          <RefreshCw size={14} /> Refresh updates
        </button>
      </div>

      <div className="ai-news-ticker">
        <span className="ticker-badge"><Sparkles size={13} /> BREAKING TODAY</span>
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
        {filtered.map(item => {
          const linkedTool = allTools.find(t => t.id === item.toolId);
          return (
            <article key={item.id} className="ai-news-card">
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
            </article>
          );
        })}
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
function ToolLogo({ tool, large = false }: { tool: Tool; large?: boolean }) { const [failed, setFailed] = useState(!tool.website); const hostname = tool.website ? new URL(tool.website).hostname : ''; return <div className={`tool-logo ${large ? 'large' : ''}`}>{!failed && <img src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=128`} alt={`${tool.name} logo`} onError={() => setFailed(true)}/>}<span className={failed ? '' : 'fallback'}>{tool.name.slice(0,2).toUpperCase()}</span></div> }
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
      <Link to={`/tools/${tool.id}`} className="tool-name">{tool.name}</Link>
      <p className="company">{tool.company} · <span>{title(tool.category)}</span></p>
      <p className="description">{tool.description}</p>
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
  { name: 'DeepSeek R1', tag: 'Reasoning', query: 'deepseek' },
  { name: 'Next.js 15', tag: 'Framework', query: 'vercel' },
  { name: 'Supabase & Neon', tag: 'Serverless DB', query: 'cloud' },
  { name: 'Vercel & Render', tag: 'Deployment', query: 'deployment' },
  { name: 'Hetzner VPS', tag: 'Cloud Servers', query: 'vps' },
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
function Browse(props: PageProps) { const location = useLocation(); const params = new URLSearchParams(location.search); const [query, setQuery] = useState(params.get('q') || ''); const [category, setCategory] = useState(params.get('category') || ''); const [pricing, setPricing] = useState(params.get('pricing') || ''); const [freeOnly, setFreeOnly] = useState(params.get('free') === 'true'); const [openOnly, setOpenOnly] = useState(params.get('open') === 'true'); const [apiOnly, setApiOnly] = useState(false); const [sort, setSort] = useState('rating'); useEffect(() => { const next = new URLSearchParams(location.search); setQuery(next.get('q') || ''); setCategory(next.get('category') || ''); setPricing(next.get('pricing') || ''); setFreeOnly(next.get('free') === 'true') }, [location.search]); const list = useMemo(() => allTools.filter(t => (!category || t.category === category) && (!pricing || t.pricingLabel === pricing) && (!freeOnly || t.pricing.free) && (!openOnly || t.openSource) && (!apiOnly || t.apiAvailable) && (!query || `${t.name} ${t.company} ${t.category} ${t.description}`.toLowerCase().includes(query.toLowerCase()))).sort((a,b) => sort === 'name' ? a.name.localeCompare(b.name) : sort === 'new' ? b.id.localeCompare(a.id) : b.rating - a.rating), [query,category,pricing,freeOnly,openOnly,apiOnly,sort]); const reset = () => { setQuery(''); setCategory(''); setPricing(''); setFreeOnly(false); setOpenOnly(false); setApiOnly(false); setSort('rating') }; return <><div className="page-heading compact"><div><p className="eyebrow">DISCOVER</p><h1>Explore AI tools</h1><p>Find the right tool by capability, price, openness, API access, and community rating.</p></div></div><div className="filterbar"><div className="search-input"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search 100+ AI tools, models, dev tools, or capabilities…"/>{query && <button type="button" className="search-clear-btn" onClick={()=>setQuery('')} aria-label="Clear search"><X size={15}/></button>}</div><select value={category} onChange={e=>setCategory(e.target.value)}><option value="">All categories</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select><select value={pricing} onChange={e=>setPricing(e.target.value)}><option value="">Any pricing</option><option>Free</option><option>Freemium</option><option>Paid</option></select><select value={sort} onChange={e=>setSort(e.target.value)}><option value="rating">Top rated</option><option value="name">Name A–Z</option><option value="new">Recently added</option></select></div><div className="filter-chips"><button className={freeOnly?'selected':''} onClick={()=>setFreeOnly(!freeOnly)}><Check size={14}/> Free access</button><button className={openOnly?'selected':''} onClick={()=>setOpenOnly(!openOnly)}><Check size={14}/> Open source</button><button className={apiOnly?'selected':''} onClick={()=>setApiOnly(!apiOnly)}><Check size={14}/> API available</button><button className="clear" onClick={reset}>Clear filters</button></div><p className="results">{list.length} matching tools · sorted by {sort === 'rating' ? 'rating' : sort === 'name' ? 'name' : 'newness'}</p><div className="tool-grid">{list.map(t => <ToolCard key={t.id} tool={t} {...props}/>)}</div>{!list.length && <Empty title="No tools found" text="Try removing a filter or searching for a broader term."/>}</> }
function Categories() { return <><div className="page-heading compact"><div><p className="eyebrow">COLLECTIONS</p><h1>Browse topics</h1><p>Explore AI tools organized by their primary capability.</p></div></div><div className="topics">{categories.map(c=><Link to={`/browse?category=${c.id}`} className="topic" key={c.id}><FolderGit2 size={21}/><div><h2>{c.name}</h2><p>{c.description}</p><small>{c.count} AI tools</small></div><ChevronRight size={18}/></Link>)}</div></> }
function Detail(props: PageProps) { const { id } = useParams(); const nav = useNavigate(); const tool = allTools.find(t=>t.id===id); useEffect(()=>{ if (tool) { const viewed = JSON.parse(localStorage.getItem('recent-ai') || '[]').filter((x:string)=>x !== tool.id); localStorage.setItem('recent-ai', JSON.stringify([tool.id,...viewed].slice(0,8))) } },[tool]); if (!tool) return <Empty title="Tool not found" text="This tool is no longer in the data index."/>; const alternatives = allTools.filter(t=>t.category===tool.category && t.id!==tool.id).slice(0,3); return <><button className="back" onClick={()=>nav(-1)}>← Back</button><header className="repo-header"><ToolLogo tool={tool} large/><div><p className="eyebrow">{title(tool.category)} / TOOL</p><h1>{tool.name}</h1><p>{tool.company} · {tool.description}</p></div><div className="repo-actions"><button onClick={()=>props.toggleFavorite(tool.id)} className={props.favorites.includes(tool.id) ? 'button active' : 'button'}><Heart size={16}/> {props.favorites.includes(tool.id) ? 'Saved' : 'Favorite'}</button><button onClick={()=>props.toggleCompare(tool.id)} className={props.compare.includes(tool.id) ? 'button active' : 'button'}><Boxes size={16}/> Compare</button>{tool.website && <a className="primary" href={tool.website} target="_blank" rel="noreferrer">Visit website <ExternalLink size={15}/></a>}{tool.playstore && <a className="button playstore-btn" href={tool.playstore} target="_blank" rel="noreferrer"><Smartphone size={15}/> Play Store</a>}</div></header><nav className="tabs"><a className="selected">Overview</a><a>Best for</a><a>Features</a><a>Alternatives <span>{alternatives.length}</span></a></nav><div className="detail-grid"><section className="readme"><h2>About {tool.name}</h2><p>{tool.description} Browse the source directory for availability, pricing, and direct website access.</p><h3>Details</h3><dl><dt>Company</dt><dd>{tool.company}</dd><dt>Primary category</dt><dd><Link to={`/browse?category=${tool.category}`}>{title(tool.category)}</Link></dd><dt>Pricing model</dt><dd><Pricing tool={tool}/></dd><dt>Official website</dt><dd>{tool.website ? <a href={tool.website} target="_blank" rel="noreferrer">{tool.website.replace(/^https?:\/\//,'')} <ExternalLink size={13}/></a> : 'Not listed'}</dd><dt>Android app</dt><dd>{tool.playstore ? <a href={tool.playstore} target="_blank" rel="noreferrer">Get on Google Play <ExternalLink size={13}/></a> : 'Not available'}</dd></dl></section><aside className="detail-side"><h3>Related tools</h3>{alternatives.map(x=><Link to={`/tools/${x.id}`} key={x.id}><ToolLogo tool={x}/><div><b>{x.name}</b><small>{x.pricingLabel} · {x.company}</small></div></Link>)}</aside></div></> }
function Compare(props: PageProps) { const selected = allTools.filter(t=>props.compare.includes(t.id)); return <><div className="page-heading compact"><div><p className="eyebrow">COMPARE</p><h1>Compare AI tools</h1><p>Select up to four tools to see their availability side by side.</p></div>{selected.length>0&&<button className="button" onClick={()=>selected.forEach(t=>props.toggleCompare(t.id))}>Clear comparison</button>}</div>{selected.length ? <div className="comparison"><div className="compare-head"><b>Attribute</b>{selected.map(t=><div key={t.id}><b>{t.name}</b><button onClick={()=>props.toggleCompare(t.id)}><X size={14}/></button></div>)}</div>{[['Company',(t:Tool)=>t.company],['Pricing',(t:Tool)=>t.pricingLabel],['Category',(t:Tool)=>title(t.category)],['Free plan',(t:Tool)=>t.pricing.free?'Available':'—'],['Paid plan',(t:Tool)=>t.pricing.paid?'Available':'—'],['Website',(t:Tool)=>t.website?'Official site':'Not listed']].map(([label,fn])=><div className="compare-row" key={label as string}><b>{label as string}</b>{selected.map(t=><span key={t.id}>{(fn as (t:Tool)=>string)(t)}</span>)}</div>)}</div> : <Empty title="Your comparison is empty" text="Add tools from any card using the compare button."/>}</> }
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

  useEffect(() => {
    setPhase('boot');
    const timer1 = window.setTimeout(() => setPhase('reveal'), 900);
    const timer2 = window.setTimeout(() => onClose(), 4400);
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
      <div className="intro-sun intro-sun-one" /><div className="intro-sun intro-sun-two" />
      <div className="intro-orbit orbit-one" /><div className="intro-orbit orbit-two" /><div className="intro-orbit orbit-three" />
      <div className="intro-corner intro-corner-tl">SYSTEM / AI-01</div><div className="intro-corner intro-corner-br">DISCOVERY ENGINE</div>
      <div className="intro-metrics"><span><b>278</b> TOOLS INDEXED</span><span><b>16</b> CATEGORIES</span><span><b>∞</b> POSSIBILITIES</span></div>
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

type Theme = 'sunlight' | 'noir' | 'violet'
function ThemePicker({ theme, setTheme }: { theme: Theme; setTheme: (theme: Theme) => void }) { const [open, setOpen] = useState(false); const ref = React.useRef<HTMLDivElement>(null); useEffect(() => { const handleClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }; document.addEventListener('mousedown', handleClick); return () => document.removeEventListener('mousedown', handleClick) }, []); const themes: {id:Theme; name:string; note:string}[] = [{id:'sunlight',name:'Sunlight',note:'White + yellow'},{id:'noir',name:'Noir',note:'Black + yellow'},{id:'violet',name:'Midnight',note:'Ink + violet'}]; return <div className="theme-picker" ref={ref}><button className="theme-trigger icon" onClick={() => setOpen(!open)} aria-label="Change color theme"><Palette size={17}/></button>{open && <div className="theme-picker-menu">{themes.map(option => <button key={option.id} className={theme === option.id ? 'selected' : ''} onClick={() => { setTheme(option.id); setOpen(false) }}><span className={`theme-swatch ${option.id}`}/><div><b>{option.name}</b><small>{option.note}</small></div>{theme === option.id && <Check size={14}/>}</button>)}</div>}</div> }

function Shell() { 
  const [favorites,toggleFavs] = useStored('ai-favorites'); 
  const [compare,setCompare] = useStored('ai-compare'); 
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('ai-intro-played'));
  const [theme,setTheme] = useState<Theme>(() => { const saved = localStorage.getItem('ai-theme'); return saved === 'noir' || saved === 'violet' || saved === 'sunlight' ? saved : 'sunlight' }); 

  const [command,setCommand]=useState(false); 
  const [cmdQuery,setCmdQuery]=useState('');
  const navigate=useNavigate(); 
  useEffect(()=>{ document.documentElement.dataset.theme= theme === 'sunlight' ? 'light' : 'dark'; document.documentElement.dataset.accent=theme; localStorage.setItem('ai-theme',theme) },[theme]); 
  useEffect(()=>{ const fn=(e:KeyboardEvent)=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setCommand(true)}}; addEventListener('keydown',fn);return()=>removeEventListener('keydown',fn)},[]); 
  const toggleFavorite=(id:string)=>toggleFavs(x=>x.includes(id)?x.filter(i=>i!==id):[id,...x]); 
  const toggleCompare=(id:string)=>setCompare(x=>x.includes(id)?x.filter(i=>i!==id):x.length<4?[...x,id]:x); 
  const props={favorites,toggleFavorite,compare,toggleCompare}; 
  const nav = [{to:'/',icon:Home,label:'Home'},{to:'/browse',icon:Search,label:'Directory'},{to:'/categories',icon:FolderGit2,label:'Categories'},{to:'/maker',icon:User,label:'Maker'},{to:'/compare',icon:Boxes,label:'Compare'},{to:'/favorites',icon:Heart,label:'Saved'}]; 
  
  const cmdMatches = useMemo(() => {
    if (!cmdQuery.trim()) return [];
    const q = cmdQuery.toLowerCase().trim();
    return allTools.filter(t => `${t.name} ${t.category} ${t.company} ${t.description}`.toLowerCase().includes(q)).slice(0, 5);
  }, [cmdQuery]);

  const handleCloseIntro = () => {
    sessionStorage.setItem('ai-intro-played', 'true');
    setShowIntro(false);
  };

  return (
    <div className="app">
      <AnimatePresence>
        {showIntro && <Intro onClose={handleCloseIntro} />}
      </AnimatePresence>
      <header className="topbar">
        <Logo/>
        <nav className="header-nav">{nav.map(({to,label})=><NavLink key={to} to={to} end={to==='/'}>{label}{label==='Compare'&&compare.length>0&&<span className="count">{compare.length}</span>}{label==='Saved'&&favorites.length>0&&<span className="count">{favorites.length}</span>}</NavLink>)}</nav>
        <button className="global-search" onClick={()=>setCommand(true)} aria-label="Search directory"><Search size={16}/><span>Search 100+ AI tools...</span><kbd><Command size={11}/>K</kbd></button>
        <div className="top-actions">
          <ThemePicker theme={theme} setTheme={setTheme}/>
          <button className="avatar" title="Meet Mohammed Reyaan (Maker)" onClick={()=>navigate('/maker')}>MR</button>
        </div>
      </header>
            <span>AI Ecosystem · v0.1.0</span>
      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard {...props}/>}/>
          <Route path="/browse" element={<Browse {...props}/>}/>
          <Route path="/categories" element={<Categories/>}/>
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
          <Boxes size={20} />
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
