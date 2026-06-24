# Math Explainers

A small site of interactive math concept explainers. One page per concept.

## Run locally

```
npm install
npm run dev
```

## Add a new explainer

1. Create `src/explainers/YourConcept.jsx`.
2. Register it in `src/explainers/registry.js` (slug, title, description, component).

It will automatically get a route (`/your-slug`) and an entry on the index page.

## Stack

Vite + React, deployed on Vercel. `vercel.json` handles client-side routing rewrites.

## Fonts

Self-hosted [Redaction](https://www.redaction.us/) (grade 10) in `public/fonts`, loaded via `@font-face` in `src/index.css`. Free for personal/commercial use under OFL — see `public/fonts/Redaction-OFL.txt`.
