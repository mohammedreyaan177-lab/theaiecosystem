# AIEcosystem

> A fast, polished, and comprehensive directory for discovering, comparing, and saving the world's best AI models, developer tools, and productivity applications.

AIEcosystem turns a modular JSON data system into a complete AI discovery platform. Browse 100+ curated tools across 17 categories, search by intent or capability tags, filter by pricing or open-source status, compare candidates side-by-side in an interactive comparison matrix, and jump directly to official websites or Android apps.

---

## Key Features

- **17 Curated Categories**: Covers Conversational AI, Open-Source Models & Frontier Weights, AI Coding, Development Tools, Workflow Automation, Image & Video Generation, Voice & Music, Research, Cloud Databases, VPS Servers, and Productivity.
- **Developer Certified Badge**: Top-tier, community-verified tools (e.g. ChatGPT, Claude, Gemini, DeepSeek, Cursor, v0, Supabase, Neon, LangChain, LangGraph, NVIDIA Nemotron, Nous Hermes, OpenCode, Vercel, Docker) feature a verified `Dev Certified` badge and are prioritized at the top of all listings.
- **Intent Tag Search**: Every tool is indexed with 5–10 capability tags (e.g., `image generation`, `educate`, `reasoning`, `vector db`, `open weights`, `rag`, `agents`, `tts`, `vps`, `code generation`), enabling instant search matches.
- **Multi-Tier Logo Resolution Engine**: Automated 5-stage logo loader (SimpleIcons Vector SVG → Clearbit Logo API → Google Favicon 128px → IconHorse → Monogram Avatar) ensures 100% logo coverage.
- **Interactive Side-by-Side Comparison**: Compare up to four tools side-by-side across 10 detailed attributes, with an in-place `+ Add tool to compare...` slot dropdown selector.
- **Live Saved & Compare Count Badges**: Real-time counter badges on topbar navigation and mobile bottom nav.
- **Sunlight Theme System**: Clean, high-contrast Sunlight light theme with warm gold/yellow accent tokens.
- **Command Palette Search**: Press <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd> to launch global search from anywhere in the application.
- **Maker Spotlight**: Dedicated creator page highlighting Mohammed Reyaan (GitHub & LinkedIn profiles).

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite |
| **Routing** | React Router DOM (v7) |
| **Animations** | Framer Motion |
| **Icons** | Lucide React + SimpleIcons SVG CDN |
| **Styling** | Vanilla CSS Design System with CSS Tokens |
| **Data Engine** | Modular Eager JSON Modules (`src/data/*.json`) |
| **Deployment** | Vercel SPA Rewrite (`vercel.json`) |

---

## Getting Started

### Local Development

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Launch the dev server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser.

### Building for Production

```bash
npm run build
npm run preview
```

---

## Data Schema & Adding New Tools

Every tool record is defined in its respective category file inside `src/data/*.json`. Adding a new tool requires no component edits:

```json
{
  "id": "opencode",
  "name": "OpenCode",
  "category": "models",
  "pricing": { "free": true, "paid": false },
  "website": "https://opencode.ai",
  "playstore": "",
  "rating": 4.8,
  "openSource": true,
  "apiAvailable": true,
  "tags": ["models", "opencode", "coding model", "open source", "code generation", "developer tool", "llm"],
  "developerCertified": true
}
```

### Schema Properties

| Property | Type | Description |
| --- | --- | --- |
| `id` | `string` | Unique identifier (kebab-case). |
| `name` | `string` | Display name. |
| `category` | `string` | Primary category ID (e.g. `chat`, `models`, `coding`, `automation`, `cloud`). |
| `pricing` | `object` | `{ "free": boolean, "paid": boolean }` |
| `website` | `string` | Official website URL. |
| `playstore` | `string` | Optional Google Play Store link. |
| `rating` | `number` | Community score (e.g. `4.8`). |
| `openSource` | `boolean` | Whether the tool/model is open-source or open-weights. |
| `apiAvailable` | `boolean` | Whether API/SDK access is provided. |
| `tags` | `string[]` | 5–10 descriptive search tags. |
| `developerCertified` | `boolean` | `true` if widely verified and trusted by the developer community. |

---

## Deployment on Vercel

1. Push your repository to GitHub.
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. The included `vercel.json` provides SPA rewrites so direct links (e.g., `/tools/cursor` or `/compare`) reload seamlessly.

---

## Project Structure

```text
THEAIECOSYSTEM/
├── src/
│   ├── assets/       # Brand assets & logos
│   ├── data/         # Source-of-truth JSON files by category
│   │   ├── automation.json
│   │   ├── chat.json
│   │   ├── cloud.json
│   │   ├── coding.json
│   │   ├── collaboration.json
│   │   ├── deployment.json
│   │   ├── design.json
│   │   ├── devtools.json
│   │   ├── image.json
│   │   ├── learning.json
│   │   ├── management.json
│   │   ├── models.json
│   │   ├── music.json
│   │   ├── productivity.json
│   │   ├── research.json
│   │   ├── video.json
│   │   ├── voice.json
│   │   ├── vps.json
│   │   └── writing.json
│   ├── main.tsx      # Routing, state, search, and page views
│   └── style.css     # Sunlight design system & responsive layout
├── index.html        # Entry HTML
├── vercel.json       # SPA routing rewrites
└── README.md
```

---

Crafted by **Mohammed Reyaan** for developers, researchers, and creators finding the right AI tools for what's next.
