# THE AI ECOSYSTEM — SIMPLE COMPONENT GUIDE

> Every file, page, and piece of this project explained in plain words.
> Updated: August 2026

---

## WHAT THIS PROJECT IS

A website that lists and helps you discover AI tools. It also has a feature where you describe a project idea and it tells you what tools, tech stack, and architecture you'd need to build it.

---

## HOW THE PROJECT IS SPLIT

```
TheAIEcosystem/
├── src/              ← Everything the user sees in the browser (frontend)
├── backend/          ← The newer smarter backend (project analysis engine)
├── server/           ← The older backend (news, tool data, WebSocket)
├── api/              ← Vercel serverless API routes (for production)
└── public/           ← Static files (logo, favicon)
```

---

## 1. FRONTEND PAGES (`src/main.tsx`)

All the pages live in one big file: `src/main.tsx`. Each function is a page or UI section.

---

### `Intro`
**What it does:** The cinematic loading screen you see when you first visit the site.
Shows a spinning logo, a loading bar, and a "Enter" button. Once you click it, it disappears and shows the real app.
Only shown once per visit — it saves a flag in `localStorage` so it doesn't show again.

---

### `Shell`
**What it does:** The outer wrapper that holds the entire app together.
It contains the top header bar, the sidebar on desktop, the bottom navigation bar on mobile, and decides which page to show based on the URL.
Think of it as the "frame" around everything else.

---

### `Dashboard` (Homepage — `/`)
**What it does:** The main home page.
Shows:
- A greeting based on your current time (morning/afternoon/evening)
- Stats: total number of tools, free tools, open-source tools, tools with APIs
- A "Trending Tech" scrolling bar with popular AI topics
- The top-rated tools in a grid
- A live AI news feed section
- A link to the full directory

---

### `LatestAIUpdates`
**What it does:** The live news section on the homepage.
Fetches real AI news articles from the backend every 5 minutes. Shows category filter buttons (All, Models, Agents, Research, etc.). If new articles arrive while you're reading, it shows a "X new articles" banner you can click to load them in.

---

### `Browse` (`/browse`)
**What it does:** The full directory/search page.
Shows all 100+ AI tools in a grid. Has:
- A search box (searches by name, company, tags, description)
- Dropdowns to filter by category, pricing, and sort order
- Toggle buttons for "Free only", "Open source only", "Has API"
- Resets all filters with a "Clear" button

---

### `Categories` (`/categories`)
**What it does:** Shows all tool categories as clickable cards.
Each card shows the category name, description, and how many tools are in it. Clicking one takes you to the Browse page with that category pre-filtered.

---

### `Detail` (`/tool/:id`)
**What it does:** The individual tool detail page.
Shows everything about one specific tool:
- Logo, name, pricing badge, description
- What it's best for, key features, tags
- Links to the website and Play Store (if available)
- Similar tools you might also like
- A "Compare" button to add it to the comparison list
- A "Save" button to add it to your favorites

---

### `Compare` (`/compare`)
**What it does:** Side-by-side comparison table for up to 3 tools.
You pick tools to compare and it shows their features, pricing, open source status, API availability, and rating in a table. Has a dropdown to add more tools.

---

### `Favorites` (`/favorites`)
**What it does:** Shows tools you've saved/hearted.
Saves your favorites list in your browser's `localStorage` so it persists between visits. If you have nothing saved, it shows an empty state with a link to browse.

---

### `Maker` (`/maker`)
**What it does:** A profile page for the creator of the ecosystem.
Shows the founder's name, bio, social links (GitHub, LinkedIn), and the story behind building the project. Static content.

---

### `ProjectAnalysisPage` (`/project-analysis`)
**What it does:** The AI-powered project analysis tool.
You type in a project idea, click Analyze, and it sends your idea to the backend. The backend runs a 9-step engine and returns a full technical report. This component manages the three states: the form, the loading screen, and the results.

---

## 2. UI COMPONENTS (`src/main.tsx`)

Small reusable pieces used inside the pages above.

---

### `ToolCard`
**What it does:** One card in the tool grid.
Shows the tool's logo, name, category, pricing badge, short description, tags, rating, and two icon buttons — one to save (heart) and one to compare. Used everywhere a tool is listed.

---

### `ToolLogo`
**What it does:** Renders the logo for a tool.
First tries to find a branded icon from the icon map. If none exists, falls back to the tool's first letter styled as a colored badge.

---

### `TrendingTechBar`
**What it does:** The horizontal scrolling strip of trending AI topics on the homepage.
Shows labels like "GPT-5", "Vision Models", "AI Agents" etc. Purely visual, no click actions.

---

### `Stat`
**What it does:** One stat box (icon + number + label).
Used in the homepage stats row. Example: 🤖 `450` Total Tools.

---

### `SectionHead`
**What it does:** A section title with an optional "View all →" link.
Used above tool grids and news feeds on the homepage.

---

### `Logo`
**What it does:** The "AIEcosystem" brand logo in the top-left.
Clicking it takes you home.

---

### `Pricing`
**What it does:** A small colored badge showing "Free", "Freemium", or "Paid".
Used inside ToolCard and the detail page.

---

### `Empty`
**What it does:** A centered empty state message with an icon.
Shown when a search returns no results, or Favorites has nothing in it. Has a "Browse tools" button.

---

### `AddToolDropdown`
**What it does:** A search dropdown inside the Compare page.
Lets you search for and add a tool to the comparison table.

---

### `GithubIcon` / `LinkedinIcon`
**What it does:** Custom SVG icons for GitHub and LinkedIn.
Used on the Maker page social links.

---

## 3. PROJECT ANALYSIS COMPONENTS (`src/project-analysis/components/`)

These are the components specifically for the Project Analysis feature. They are all inside the `/project-analysis` route.

---

### `ProjectAnalysisPage`
**What it does:** The main controller for the whole analysis feature.
Decides which screen to show: the form, the loading animation, or the results. Handles the API call to the backend and catches errors.

---

### `ProjectAnalysisForm`
**What it does:** The text input form you see before running an analysis.
Has a textarea where you describe your project idea, sample prompt buttons you can click to auto-fill, a character counter, and the "Analyze Project Strategy" submit button.

---

### `LoadingAnalysisView`
**What it does:** The animated screen shown while the backend is processing.
Shows a spinning icon and a list of analysis stages (Intent Classification, Tech Stack, Web Discovery, etc.) that light up one by one as they complete.

---

### `AnalysisResultsView`
**What it does:** The results page after analysis is done.
Shows a toolbar with "New Search", "Export JSON", and "Print" buttons. Has a tab bar so you can jump to specific sections. Renders all the section components below based on which tab is active.

---

### `BuildBlueprintSection`
**What it does:** Shows the step-by-step build plan for your project.
Each phase (Phase 1, Phase 2, etc.) is an accordion card you can expand. Shows what to build, what files you'll create, test commands, and links to official documentation guides.

---

### `DifferentiationSection`
**What it does:** Shows how your project compares to existing competitors.
Has a feature comparison table (your project vs existing products), a list of ranked strategic differentiators (what makes your project unique), and links to open-source reference projects.

---

### `ExistingProductsSection`
**What it does:** Shows real products and GitHub repos similar to your idea.
Found by searching the web and GitHub. Each card shows the product name, website, how similar it is (%), and what the major differences are from your idea.

---

### `ToolMatchingSection`
**What it does:** Shows which AI tools from the ecosystem best match your project's needs.
Each card shows the tool name, company, pricing, and why it's a good match for your specific requirements.

---

### `TechStackSection`
**What it does:** Shows the recommended tech stack for your project.
Broken into layers (Frontend, Backend, Database, AI/ML, Deployment). Each layer card shows the recommended tool, the reason for choosing it, pros, cons, and what the alternative would be.

---

### `ArchitectureSection`
**What it does:** Shows the system architecture of your project as a visual node map.
Each node is one part of the system (Web Client, API Server, Database, AI Services) and shows how they connect to each other.

---

### `SecuritySection`
**What it does:** Shows security risks for your project and how to fix them.
Each risk card shows the category (e.g. "Auth & API Security"), how serious it is (Low/Medium/High/Critical), a description, and the mitigation strategy.

---

### `TestingDeploymentSection`
**What it does:** Shows how to test and deploy your project.
Includes test commands to run, what to test, and a deployment plan with steps for each cloud platform (Vercel, Render, Supabase, etc.).

---

### `AIStackSection`
**What it does:** Lists the AI capabilities your project needs.
Each capability card (e.g. "Text Summarization", "Vector Search") shows why it's needed and whether it's Essential or just Recommended.

---

### `OverviewSection`
**What it does:** The summary card at the top of the full report.
Shows the project category, complexity level, key requirements, core features, and target users in a quick-glance grid.

---

### `OriginalitySection`
**What it does:** Shows how original your project idea is.
Gives it an originality score, a uniqueness score, and a brief explanation of what makes it stand out or where it overlaps with existing products.

---

### `RoadmapVerdictSection`
**What it does:** Shows the development timeline and a final verdict.
The roadmap is a list of phases (MVP, Core Features, Polish, Launch) with time estimates. The Final Verdict gives a feasibility score out of 100 and a plain-English recommendation.

---

### `FinancialSection`
**What it does:** Shows the estimated pricing model and cost structure.
Suggests Free/Pro/Enterprise pricing tiers, monthly infrastructure cost estimates, and notes on customer acquisition.

---

### `ComplianceSection`
**What it does:** Shows legal/regulatory requirements for your project.
Lists regulations like GDPR, CCPA, HIPAA that may apply — what they require and what actions you need to take.

---

### `PromptArchitectureSection`
**What it does:** Shows a recommended AI prompt template for your project.
Gives you a ready-to-use system prompt, the role definition, input format, and example prompt guard rails to copy into your app.

---

### `APIIntegrationsSection`
**What it does:** Lists third-party APIs your project should integrate.
Each API card shows what it does, how hard it is to integrate (Easy/Moderate/Complex), and why your project needs it.

---

### `UserJourneySection`
**What it does:** Shows the user journey through your product step by step.
Each step (e.g. Sign Up → Onboarding → Core Feature → Return Visit) shows what the user does, what the system does, and where AI is involved.

---

## 4. FRONTEND SERVICES (`src/services/`)

These are helper files the frontend uses to talk to the backend.

---

### `newsApi.ts`
**What it does:** All the functions for fetching news from the backend.
- `fetchNewsArticles()` — gets articles by category, page, or "after" timestamp for polling
- `triggerNewsIngestion()` — tells the backend to go fetch new articles right now
- Has types for `NewsArticle` objects

---

### `projectAnalysisApi.ts`
**What it does:** The function that sends your project idea to the backend and gets back the analysis report.
- `requestIntelligentAnalysis(prompt)` — sends your text to `/api/project-analysis`, returns the full report
- Has a timeout and error handling built in

---

### `utils/greeting.ts`
**What it does:** A small hook that returns a greeting based on the current time in IST (India Standard Time).
Returns "Good morning", "Good afternoon", or "Good evening" depending on the hour. Used in the Dashboard header.

---

## 5. BACKEND SERVICES — Project Analysis (`backend/services/`)

These files run on the Node.js backend and power the Project Analysis feature.

---

### `projectAnalysisEngine.js`
**What it does:** The brain of the entire analysis feature. Runs all 9 stages in sequence.
1. Classifies your input (is this a specific project or a generic idea?)
2. Extracts what capabilities your project needs
3. Figures out the architecture (frontend-only, or full-stack?)
4. Recommends a tech stack
5. Matches tools from the ecosystem to your needs
6. Searches GitHub and the web for similar existing projects
7. Generates a phased build blueprint
8. Analyses what makes your project different
9. Builds test and deployment plans

---

### `blueprintEngine.js`
**What it does:** Generates the step-by-step build plan (Build Blueprint).
Takes the project requirements and creates ordered phases, each with tasks, files to create, test commands, and dependency notes.

---

### `differentiationEngine.js`
**What it does:** Figures out what makes your project unique vs competitors.
Builds a feature comparison matrix, ranks your strategic differentiators, and creates an anti-copying policy with open-source reference guidance.

---

### `guideDiscoveryEngine.js`
**What it does:** Finds real documentation links and guides for each build phase.
Searches DuckDuckGo and curated sources to find official docs, tutorials, and Stack Overflow answers relevant to each task in your blueprint.

---

### `toolRegistry.js`
**What it does:** A database of all the AI tools in the ecosystem with their capabilities.
Used by the analysis engine to match your project's requirements to the right tools. Each tool entry has its name, capabilities it covers, pricing, website, and relevance tags.

---

### `toolExecutionEngine.js`
**What it does:** Handles actually calling external APIs (GitHub, DuckDuckGo, Wikipedia) during an analysis.
Runs web searches and GitHub repo searches, processes the results, and returns structured data to the analysis engine.

---

### `newsService.js` (backend copy)
**What it does:** Same news fetching logic as the server version but used in the backend context.
Fetches from HackerNews API and RSS feeds, deduplicates articles, and saves them to SQLite.

---

## 6. SERVER SERVICES — News & WebSocket (`server/services/`)

These files run on the older Node.js server that handles news and live data.

---

### `newsService.js` (server copy)
**What it does:** The automated news ingestion pipeline. Runs every 10 minutes.
- Fetches from HackerNews Algolia API and 7 RSS feeds (Google News, TechCrunch, VentureBeat, Hugging Face, MIT, The Verge)
- Deduplicates articles using 5 methods: exact URL, normalized URL, title comparison, content hash, and word similarity
- Classifies each article into a category (Models, Agents, Research, Funding, etc.)
- Saves new articles to SQLite

---

### `wsServer.js`
**What it does:** A WebSocket server running on port 8080.
Stays open permanently. Every 8 seconds it checks if major AI providers (OpenAI, Gemini, Anthropic, DeepSeek) are online. Sends live status updates to any browser that's connected. The little status dots in the UI get their data from here.

---

## 7. SERVER ENTRY POINTS

---

### `server/index.js`
**What it does:** Starts the older Express server (port 5000).
Sets up REST API routes for news (`/api/news`), triggers the news ingestion loop every 10 minutes, and starts the WebSocket server.

---

### `backend/index.js`
**What it does:** Starts the newer Express server for project analysis.
Sets up the `/api/project-analysis` endpoint. When your idea comes in, it calls the 9-stage engine and streams back the results.

---

### `server/db.js` / `backend/db.js`
**What it does:** Sets up the SQLite database connection.
Creates the `articles` table if it doesn't exist. Uses WAL mode so multiple reads/writes don't block each other.

---

## 8. API ROUTES (Vercel — `api/`)

These are serverless functions used when the app is deployed on Vercel. They do the same thing as the Express routes but run as individual Vercel functions.

---

### `api/news.js`
**What it does:** Handles `/api/news` requests in production.
Returns paginated news articles from SQLite, filtered by category and date.

---

### `api/project-analysis.js`
**What it does:** Handles `/api/project-analysis` requests in production.
Calls the analysis engine and returns the full technical report as JSON.

---

## 9. DATA FILES (`src/data/`)

**What they do:** JSON files, one per tool category (e.g. `chat.json`, `coding.json`, `image.json`).
Each file is an array of tool objects. The app loads all of them at startup and merges them into one big list. This is how the 100+ tools are stored — no database needed for the directory itself.

---

## 10. STYLES (`src/style.css`, `src/project-analysis/styles/projectAnalysis.css`)

---

### `style.css`
**What it does:** All the global styles for the entire app.
Includes:
- Color theme tokens (light, dark, violet, maroon)
- Topbar, sidebar, bottom nav bar styles
- Tool card, filter bar, stat boxes, page headings
- Mobile responsive rules for all screen sizes

---

### `projectAnalysis.css`
**What it does:** All the styles specifically for the Project Analysis feature.
Covers the form card, loading screen, results toolbar, tab bar, and all the section cards (tech stack, architecture, blueprint, etc.).
Has responsive rules for tablets (768px), phones (480px), and small Android phones (360px).

---

## QUICK SUMMARY TABLE

| Component | What it does in one line |
|---|---|
| `Shell` | The app frame — header, sidebar, routing |
| `Dashboard` | Homepage with stats, trending tools, news |
| `LatestAIUpdates` | Live news feed with polling |
| `Browse` | Search and filter all 100+ tools |
| `Categories` | Browse tools by topic |
| `Detail` | Full page for one specific tool |
| `Compare` | Side-by-side tool comparison table |
| `Favorites` | Your saved tools list |
| `Maker` | About/founder page |
| `ProjectAnalysisPage` | Controller for the analysis feature |
| `ProjectAnalysisForm` | Text form to describe your project idea |
| `LoadingAnalysisView` | Animated loading screen during analysis |
| `AnalysisResultsView` | Full results with tabs and sections |
| `BuildBlueprintSection` | Phase-by-phase build plan |
| `DifferentiationSection` | How your idea differs from competitors |
| `ExistingProductsSection` | Real similar projects found online |
| `ToolMatchingSection` | Which ecosystem tools fit your project |
| `TechStackSection` | Recommended tech stack per layer |
| `ArchitectureSection` | System diagram of your app |
| `SecuritySection` | Security risks and fixes |
| `TestingDeploymentSection` | How to test and deploy |
| `projectAnalysisEngine.js` | The 9-stage analysis brain |
| `blueprintEngine.js` | Generates the build plan |
| `differentiationEngine.js` | Finds what makes your idea unique |
| `guideDiscoveryEngine.js` | Finds real docs and guides |
| `toolRegistry.js` | List of all tools with capabilities |
| `newsService.js` | Fetches and saves AI news every 10 min |
| `wsServer.js` | Live AI provider status via WebSocket |
| `style.css` | All global visual styles |
| `projectAnalysis.css` | Styles for the analysis feature |
