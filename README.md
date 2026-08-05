# AIEcosystem

> A fast, polished directory for discovering, comparing, and saving the AI tools that matter.

AIEcosystem turns a simple collection of JSON files into a complete AI discovery experience. Browse hundreds of tools, sort by rating, focus on free or open-source options, compare candidates side by side, and jump directly to official websites or Android apps where available.

## What’s inside

- Data-driven directory — every tool is loaded from `src/data/*.json`.
- Smart discovery — instant search plus category, pricing, free-access, open-source, API, and rating filters.
- Tool profiles — official site, Android Play Store redirect (when available), pricing, related tools, and quick actions.
- Compare workspace — save up to four tools and review the important differences.
- Local collections — favorites, comparisons, recently viewed tools, and theme preference persist in the browser.
- Responsive navigation — desktop sidebar, compact mobile drawer, and mobile bottom navigation.
- Command palette — press <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd> to search from anywhere.
- Three themes — Sunlight (white + yellow), Noir (black + yellow), and Midnight (ink + violet).
- Vercel-ready SPA routing — deep links such as `/tools/chatgpt` work after deployment and refresh.

## Tech stack

| Layer | Technology |
| --- | --- |
| UI | React 19 + TypeScript |
| Build | Vite |
| Routing | React Router |
| Motion | Framer Motion |
| Icons | Lucide React |
| Data | Local JSON files |
| Hosting | Vercel |

## Run locally

```bash
npm install
npm run dev
```

Create an optimized production build:

```bash
npm run build
npm run preview
```

## Add a tool

Add one JSON object to the appropriate file in `src/data/`. No component edits are required.

```json
{
  "id": "example-ai",
  "name": "Example AI",
  "category": "automation",
  "pricing": { "free": true, "paid": true },
  "website": "https://example.com",
  "playstore": "https://play.google.com/store/apps/details?id=com.example.app",
  "rating": 4.6,
  "openSource": false,
  "apiAvailable": true
}
```

`playstore` is optional. When omitted, the interface correctly labels the Android app as unavailable instead of showing an unreliable redirect.

## Deploy to Vercel

1. Push the project to GitHub.
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. Keep the detected Vite settings and deploy.

The included `vercel.json` defines the build command, `dist` output folder, and an SPA rewrite, so direct URLs and browser refreshes resolve correctly.

## Environment variables

Copy `.env.example` to `.env.local` for local overrides. Only public build-time values belong in `VITE_*` variables—never place secrets there.

## Project structure

```text
src/
├── assets/       # Brand assets
├── data/         # Source-of-truth tool records
├── main.tsx      # App routes, pages, interactions
└── style.css     # Responsive visual system and themes
```

---

Built for curious people who want to find the right AI tool before the next workflow begins.
