# Zac Braddy's CV website

[![Netlify Status](https://api.netlify.com/api/v1/badges/d88a9956-dbc5-4b07-ad1a-1168b7de36ab/deploy-status)](https://app.netlify.com/projects/naughty-carson-0d9ff5/deploys)

The personal CV site served at [zackerthehacker.com](https://zackerthehacker.com). Built with
**Next.js 16** (App Router) + **React 19** + **TypeScript**, styled with **Tailwind CSS v4**, and
deployed as a fully static export to **Netlify** (deploy-on-commit from `main`).

## Stack

- **Next.js 16** (App Router), statically exported (`output: 'export'` → `out/`).
- **React 19** + **TypeScript** (strict).
- **Tailwind CSS v4** (CSS-first config) with a CSS-variable theming system and `next-themes`
  for the dark/light toggle.
- **`next/image`** with a custom loader backed by the Netlify Image CDN.
- **FontAwesome**, **Embla** (carousel), **vaul** (mobile drawer), **react-custom-scroll**.

## Local development

```bash
npm install
npm run dev      # dev server at http://localhost:3000
npm run build    # production build → static export in out/
npm run lint     # ESLint
npm run format   # Prettier
```

Node is pinned via `.node-version` (see `engines` in `package.json`).

## Project conventions

AI agents and contributors should read [`_bmad-output/project-context.md`](_bmad-output/project-context.md)
before changing code — it documents the stack rules, atomic-design structure, the CSS-variable
theming system, and the project's known gotchas. Architectural decisions are recorded as ADRs under
[`docs/decisions/`](docs/decisions/README.md).
