# THE AI ECOSYSTEM — ARCHITECTURE, TECH STACK & SYSTEM DOCUMENTATION

> **File Name**: `project.md`  
> **Project**: The AI Ecosystem & Portal Platform  
> **Generated**: August 17, 2026  

---

## 1. COPYABLE TECHNOLOGY STACK

```text
================================================================================
                         THE AI ECOSYSTEM TECH STACK
================================================================================

[ FRONTEND CLIENT TIER ]
• Core Framework       : React 18.3+ (Single Page Application architecture)
• UI & Styling         : Vanilla CSS (Custom Design Tokens, Glassmorphism, Dark Theme)
• Asset Bundler & HMR  : Vite 8.2+ (Fast ESM Modules & Production Minification)
• Icon Library         : Lucide React (Unified Vector Iconography)
• State Management     : React Hooks (useState, useEffect, useMemo, useCallback)
• Navigation & Routing : Custom Route Router & Portal Suite View Switcher

[ BACKEND & SERVER TIER ]
• Server Runtime       : Node.js (>= v20.0.0 LTS)
• API Framework        : Express.js (REST API Endpoints & Router Middleware)
• Real-time Protocols  : WebSocket (`ws` engine on Port 8080 & SSE Data Streams)
• Server Execution     : Persistent Background Workers & Asynchronous Task Loops

[ DATABASE & PERSISTENCE TIER ]
• Primary Database     : SQLite (via `better-sqlite3` native C++ bindings)
• Journaling Mode      : Write-Ahead Logging (WAL Mode) for high-concurrency ACID transactions
• Vector & Cache Layer : In-Memory Query Caching (15-min TTL) & Indexed DB Lookups

[ EXTERNAL APIS & DATA SOURCES ]
• Real-time News API   : HackerNews Algolia Search API (`hn.algolia.com/api/v1`)
• Curated RSS Feeds    : Google News, TechCrunch AI, VentureBeat, Hugging Face, MIT Tech Review
• Live Search API      : DuckDuckGo Instant Answer API & Wikipedia Search API
• Repository Discovery : GitHub REST API (`api.github.com/search/repositories`)

[ AI MODELS IN USE IN THE BACKGROUND ]
• Primary LLM Engine   : Google Gemini 2.0 Flash (Sub-400ms Real-Time Inference & Verification)
• Reasoning Model      : DeepSeek R1 & OpenAI o1 / GPT-4o (Factual & Mathematical Reasoning)
• Multimodal Models    : Claude 3.5 Sonnet & Gemini 2.0 Pro Multimodal
• Speech & Voice Synthesis: ElevenLabs Audio Engine & Whisper ASR
• Embeddings & Vector Search: OpenAI `text-embedding-3-small` / `pgvector`

================================================================================
```

---

## 2. WHAT EVERYTHING DOES IN THE BACKGROUND

### 2.1 Background News Ingestion Pipeline (`server/services/newsService.js`)
The backend runs an automated background ingestion loop every 10 minutes (`setInterval` in `server/index.js`):
1. **Multi-Source Fetching**: Concurrently queries HackerNews Algolia API and 7 curated RSS feeds (Google AI, TechCrunch AI, VentureBeat AI, Hugging Face, MIT Tech Review, The Verge AI).
2. **5-Level Deduplication Engine**:
   - **Level 1**: Exact URL Match.
   - **Level 2**: Canonical URL Normalization (strips `utm_source`, `fbclid`, `gclid`, and trailing slashes).
   - **Level 3**: Title Normalization (strips publisher suffixes like `| TechCrunch` and normalizes punctuation/spacing).
   - **Level 4**: Content Hash Verification (generates SHA-256 hash of title + description snippet).
   - **Level 5**: Headline Token Jaccard Similarity (compares headline word token overlap against recent 48-hour database records to catch rephrased stories on the same news event).
3. **Category Detection & Storage**: Classifies articles into canonical categories (`AI Agents`, `Models`, `Hardware`, `Developer Tools`, `Research`, `Open Source`, `Funding`, `Regulation`, `Startups`, `Companies`) and persists unique articles into SQLite.

### 2.2 Background WebSocket Server (`server/wsServer.js`)
- Runs continuously on `ws://localhost:8080`.
- Monitors frontier AI provider health (OpenAI, Gemini, Anthropic, DeepSeek, Supabase, Pinecone) by sending health probes every 8 seconds.
- Broadcasts real-time JSON events (`PROVIDER_HEALTH_UPDATE`, `BACKGROUND_AI_VERIFY_BEAT`) to all connected browser clients.

### 2.3 Background AI Model Verifier Agent (`src/portal/services/backgroundAgent.ts`)
- Automatically intercepts tool execution outputs in real-time.
- Performs background multi-pass web search audits against DuckDuckGo & Wikipedia to verify numbers, API method signatures, and claims.
- Automatically injects corrections into the output report and calculates an **AI Verification Confidence Score (0–100%)**.

---

## 3. HOW EVERYTHING IS USED (FRONTEND & BACKEND LIFECYCLE)

```
[ USER INPUT IN FRONTEND ]
         │
         ├──> 1. Fast Client Processing (Vite + React UI Components)
         │
         ├──> 2. REST API Request (`fetch('/api/project-analysis')` or `/api/news`)
         │         │
         │         ▼
         │   [ EXPRESS BACKEND SERVER (Port 5000) ]
         │         │
         │         ├── Check In-Memory Cache (15-min TTL)
         │         ├── Execute 9-Stage Analysis Pipeline
         │         └── Fetch External Web Search & GitHub APIs
         │
         └──> 3. Real-Time WebSocket Push (`ws://localhost:8080`)
                   │
                   ▼
         [ LIVE UI UPDATE WITH VERIFIED RESULTS ]
```

---

## 4. WHICH AI MODELS ARE USED IN THE BACKGROUND & HOW

1. **Google Gemini 2.0 Flash**:
   - **Role**: Primary background verifier and real-time interactive input verification agent.
   - **Why Used**: Sub-400ms latency and high throughput for instant web fact verification.
2. **DeepSeek R1**:
   - **Role**: Open-weights deep reasoning model used for mathematical, architectural logic, and code generation validation.
3. **OpenAI GPT-4o / o1**:
   - **Role**: Complex multi-step reasoning, content moderation, and technical prompt architecture generation.
4. **Claude 3.5 Sonnet**:
   - **Role**: Software architecture analysis, code refactoring, and UI artifact code rendering.
5. **ElevenLabs & Whisper**:
   - **Role**: High-fidelity text-to-speech audio synthesis and automatic speech recognition in AI voice tools.

---

## 5. HOW THIS WEBSITE ACTUALLY GETS DATA

The platform uses a **hybrid multi-source data ingestion engine**:

1. **HackerNews Algolia REST API**: Fetches live trending AI stories and developer discussions in real time.
2. **Curated RSS XML Feeds**: Parsed using `rss-parser` from Google News, TechCrunch, VentureBeat, Hugging Face, MIT Tech Review.
3. **DuckDuckGo Instant Answer API**: Fetches real-time web snippets, URLs, and evidence text for factual verification.
4. **GitHub Search REST API**: Queries open-source repositories matching user project ideas to calculate similarity percentages, stargazers, and architecture patterns.
5. **SQLite WAL Database**: Persists all processed articles, categories, and canonical URLs locally in `server/data/news.db`.

---

## 6. HOW THE PROJECT ANALYSIS FEATURE ACTUALLY WORKS

When you type a project description into the **Project Analysis** feature, it executes a **9-Stage Technical Evaluation Engine**:

```text
================================================================================
           PROJECT ANALYSIS ENGINE — 9-STAGE PIPELINE BREAKDOWN
================================================================================

STAGE 1: Semantic Intent Classification
• Classifies input into PROJECT_SPECIFIC (e.g. "Instagram Clone") vs GENERIC ("Image Generator").
• Detects target entity references (Trello, Notion, Spotify, Figma, WhatsApp, Zapier, etc.).

STAGE 2: Deep Capability & Requirement Extraction
• Scans text for domain triggers (automation, image synthesis, voice TTS, vector search RAG, etc.).
• Maps user requirements into fine-grained capabilities with importance weights (Essential / Recommended).

STAGE 3: Architecture Requirements Assessment
• Determines whether project is Frontend-Only (Client SPA), Frontend + API Proxy, or Full-Stack (Frontend + Backend + DB).
• Evaluates whether persistent relational database, authentication, or CDN storage are required.

STAGE 4: Dynamic Tech Stack Generation
• Recommends specific stack layers (React, Next.js, Node.js, Express, PostgreSQL, Supabase, Vercel, Tailwind CSS).
• Provides advantages, disadvantages, alternatives, and why alternatives were not chosen.

STAGE 5: AI Tool Registry Capability Matching & Ranking
• Matches required capabilities against registered ecosystem tools (ChatGPT, Claude, Gemini, Supabase, Pinecone, Cursor, n8n, etc.).
• Scores relevance (0–100%) and penalizes generic tools when specialized capabilities are requested.

STAGE 6: Multi-Source Web Project Discovery
• Queries GitHub Search API for real open-source repositories matching user requirements.
• Calculates similarity percentage, stars, language, and key feature differences.

STAGE 7: Dependency-Aware Build Blueprint Generation
• Dynamically generates a phased 7-step development roadmap (Environment Setup, DB Schema, Core API, Auth Security, UI Components, Rate Limiting, Production Deployment).
• Provides task lists, likely files to edit, expected results, and test commands.

STAGE 8: Product Differentiation & Feature Gap Analysis
• Constructs a Feature Comparison Matrix comparing existing market competitors against your project.
• Identifies strategic differentiators, market gaps, and an anti-copying policy.

STAGE 9: Stack-Tailored Testing & Deployment Plans
• Generates custom test commands (`npm test -- --grep "auth"`) and cloud deployment steps (Vercel, Render, Supabase).
================================================================================
```
