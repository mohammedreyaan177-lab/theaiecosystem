# AIEcosystem

A JSON-driven AI tool directory built with React, TypeScript, Vite, React Router and Tailwind-compatible CSS.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Vercel deployment

Import this repository into Vercel. The included `vercel.json` rewrites every route to the Vite SPA entry point, so direct URLs such as `/tools/n8n` resolve correctly. Vercel will run `npm run build` and publish `dist` automatically.

Tool records are loaded from every file in `src/data/*.json`. Add an object to the relevant JSON file; no component changes are needed.
