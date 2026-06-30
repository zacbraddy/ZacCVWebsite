---
project_name: "Zac's CV Website"
user_name: 'Zac'
date: '2026-06-30'
sections_completed:
  [
    'technology_stack',
    'language_specific',
    'framework_specific',
    'testing',
    'code_quality',
    'workflow',
    'critical_gotchas',
  ]
existing_patterns_found: 7
status: 'complete'
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- **Next.js `16.2.9`** — App Router, **statically exported** (`output: 'export'` in `next.config.mjs` → `out/`). No server runtime, no API routes, no SSR/ISR/middleware in production. Node `>=24` required (`.node-version` pins `v24.16.0`).
- **React `19.2.7`** — function components + hooks ONLY. No class components. **Server Components by default**; add `'use client'` only where a component needs interactivity, hooks, or browser APIs.
- **TypeScript `^6` (strict).** This is a **TypeScript project** (`allowJs: false` — no `.js`/`.jsx` source). Use real types; the `@/*` path alias maps to `./src/*` (`import x from '@/components/...'`). Prefer typed props/interfaces — there is no PropTypes.
- **Tailwind CSS `v4` (`^4.3.0`)** — primary styling mechanism, configured **CSS-first** in `src/app/globals.css` (`@import 'tailwindcss'`, `@theme`, `@utility`). There is **no `tailwind.config.js`**; PostCSS via `@tailwindcss/postcss`.
- **`next-themes` `^0.4.6`** — dark/light theming, toggles a `class` on `<html>` (`.light`). Replaces the old styled-components theme provider.
- **CSS Modules** (`*.module.css`) — component-scoped CSS Tailwind can't express, co-located next to the component.
- **Do NOT use styled-components** (ADR 0004). Dynamic/animated styling uses CSS Modules, the tokens in `src/components/animations.ts`, and `@keyframes` in `globals.css`.
- **Routing:** Next App Router (file-based, `src/app/**/page.tsx`). Client navigation state via `usePathname` from **`next/navigation`** — NOT `react-router`.
- **SEO:** Next **Metadata API** (`export const metadata` / the `Metadata` type) — set titles/OG/Twitter tags there, not with a helmet-style component.
- **Icons:** FontAwesome `v7` (`@fortawesome/react-fontawesome`); `faConfig.autoAddCss = false` + manual CSS import in `layout.tsx`.
- **Images:** `next/image` with a **custom loader** (`src/image-loader.ts`) backed by the **Netlify Image CDN** (`/.netlify/images?url=…&w=…&q=…`). In dev the loader returns the raw `src`.
- **Content pipeline — Velite `^0.4.0` + Shiki `^4.3.0`.** Markdown in `docs/public/**/*.md` is compiled at build time by Velite into a generated `.velite/` layer (gitignored), imported via the `@velite` path alias (`import { docs } from '@velite'`). Velite runs from a top-of-file `build()` hook in **`next.config.mjs`** (guarded by `VELITE_STARTED`) before Next starts — there is no separate content build step. Code fences are highlighted by **Shiki** via `@shikijs/rehype` using a **CSS-variables theme** (`--shiki-*` vars defined in `velite.config.ts`) so highlighting tracks the site's light/dark theme.
- **Other libs:** `embla-carousel-react` v8 (testimonials carousel, ADR 0022), `vaul` (mobile drawer menu, ADR 0018), `react-custom-scroll` v7 (custom scrollbar + route-change scroll reset, ADR 0019), `react-spinners` (loading splash, ADR 0020), `@next/third-parties` (`GoogleAnalytics`). (Velite/Shiki covered above.)
- **Tooling:** ESLint `9` flat config (`eslint.config.mjs`: `eslint-config-next` core-web-vitals + typescript, `eslint-config-prettier`) + Prettier `3` + Husky pre-commit (`pretty-quick --staged`). **`npm test` is a stub (`exit 1`) — there is no test framework.**

**Version coupling:** Next 16 / React 19 / `eslint-config-next` 16 move together — don't bump the Next major without the matching ESLint config and a check of the FrozenRouter internal-API import (see gotchas).

## Critical Implementation Rules

### Language-Specific Rules (TypeScript / TSX)

- **ES Modules only.** `import`/`export`. Components are default-exported where the existing file does so; shared constants/helpers use named exports.
- **Arrow function components** for presentational pieces; `export default function Name()` is also used (see pages/layout). Match the surrounding file.
- **Prettier is law** (`.prettierrc`): `singleQuote: true`, `arrowParens: "avoid"` — write `arg => …` NOT `(arg) => …`. Never hand-format; pre-commit `pretty-quick --staged` reformats staged files.
- **Types, not PropTypes.** Type props inline or with a `type`/`interface`. `strict` is on — no implicit `any`.
- **British spelling in user-facing copy and comments** (owner preference); keep API/CSS identifiers canonical (`color`, `center`).

### Framework-Specific Rules (Next.js App Router + React)

**Server vs Client Components.** Default to **Server Components** (no directive). Add `'use client'` ONLY when the component uses state/effects, event handlers, context, or browser APIs (e.g. `theme-toggle`, `mobile-menu`, `content-transition`, `rotating-job-title`, contexts, providers). Pages and most organisms are Server Components — keep them so unless interactivity is genuinely required.

**Atomic Design structure (STRICT).** Components live under `src/components/` in tiers:

- `atoms/` — smallest reusable pieces (`pill.tsx`, `heading.tsx`, `nav-link.tsx`).
- `molecules/` — small groups of atoms (`nav-links.tsx`, `socials.tsx`, `testimonial.tsx`).
- `organisms/` — full page sections (`about-me.tsx`, `experience.tsx`, `content-item.tsx`).
- `src/app/**/page.tsx` — App Router file-based routes ONLY. A `page.tsx` = a route. Keep pages thin; they compose organisms.
- Place a new component in the correct tier; never inline a reusable chunk into a page or organism.

**Route groups & shells (post-Ariadne).** The root `src/app/layout.tsx` holds only `<html>`, the `next-themes` providers, and `MenuProvider` — **not** the visible shell. The **FoH (front-of-house) shell** (sidebar, nav, transition wrapper) lives in the `SiteShell` organism, mounted by **`src/app/(site)/layout.tsx`** for the `(site)` route group (`/about-me`, `/resume`, `/content`). The **Backroom** has its own `src/app/backroom/layout.tsx` — a two-pane reading room (320px `BackroomNav` rail + scrollable `<main>`). Route groups don't change URLs; they scope which layout/shell wraps a segment. Put a page in the right segment so it inherits the right shell.

**Backroom content rendering.** Backroom pages read compiled docs from `@velite` and render `doc.content` via `dangerouslySetInnerHTML` — that's pre-rendered, build-time-trusted HTML from your own markdown (Velite/Shiki), **never user input**; don't reach for this pattern with anything untrusted. `backroom/[slug]/page.tsx` uses `generateStaticParams` + `export const dynamicParams = false`, so only known slugs prerender and anything else 404s — required under static export.

**Theming via CSS custom properties — do NOT hardcode colours.**

- Colours are defined as `--color-*` CSS variables in `src/app/globals.css` under `:root` (dark, the default) and `.light`. `next-themes` toggles the `.light` class on `<html>`.
- Tailwind v4 maps those vars to utilities via **`@utility` blocks in `globals.css`** (e.g. `text-secondary`, `bg-primary-400`, `border-secondary`, `text-icon-primary`). Use those tokens — NEVER raw hex or Tailwind default colours (`text-blue-500`) for themed UI.
- To add a new themed colour: add the `--color-*` var to BOTH `:root` and `.light`, then add a matching `@utility` block in `globals.css`. (There is no `tailwind.config.js` to edit.)
- **Shiki syntax highlighting is part of the same system** — code-block colours come from `--shiki-*` CSS variables (Shiki's `css-variables` theme), so highlighting follows light/dark automatically. Add/tune highlight colours via those vars; never hardcode token colours into rendered markup.

**Styling decision order:** (1) Tailwind utility classes first → (2) CSS Module for scoped static CSS Tailwind can't express → (3) `animations.ts` tokens + `@keyframes` in `globals.css` for animation. styled-components is not an option.

**Tailwind v4 layered-CSS gotcha:** hand-written global CSS (the base reset, `a`, `body`, the border guard) lives inside `@layer base` in `globals.css`. Keep new global base styles in `@layer base` — unlayered global CSS outranks Tailwind utilities and will silently override them.

**Data layer.** No GraphQL. Build-time data is plain TypeScript: tweakable values live in `src/config/index.ts` (`config.JOB_TITLE`, `config.JOB_TITLES`) and are imported as `config.*`. Don't hardcode such values into components.

**SEO / Metadata.** The root `src/app/layout.tsx` exports `metadata` with `metadataBase`, the title `template: '%s - Zac Braddy'`, description, and OG/Twitter defaults. Pages export their own `metadata`:

- Child-segment pages (`/about-me`, `/resume`, `/content`) set `title: '<Page>'` and rely on the root template → single-suffix `<title>` (ADR 0021).
- The **home page** (`app/page.tsx`, same segment as the root layout, where the template does NOT apply) sets `title: { absolute: 'Home - Zac Braddy' }`.
- Per-page `openGraph.title`/`twitter.title` are the full `'<Page> - Zac Braddy'` string; description/image/card are inherited from root defaults.

**Cross-cutting UI state via Context.** Shared state like the mobile menu uses `MenuOpenContext`/`useMenuOpen` from `src/context/menu-open-context.tsx` (a `'use client'` provider mounted in `layout.tsx`). No Redux/Zustand/global store — keep state local or in existing contexts.

**Images.** Put images under `public/images/` and render via `next/image` (the custom Netlify loader handles them), NOT raw `<img>`. The loader returns the raw `src` in dev, so locally-served `out/` images 404 off-Netlify but render correctly via the CDN in production.

### Testing Rules

- **No test framework is configured.** `npm test` is a stub (`echo "No test suite" && exit 1`). It does NOT run tests. Do not assume Jest/Vitest/RTL exist (AR13).
- **Do not fabricate test runs or claim tests pass.** There is no suite to run.
- **Verification is:** `npm run build` (must be green + a pure static export — every route `○ (Static)`, no serverless `.func`), inspection of `out/*.html`, `npm run lint` clean, plus manual visual checks (`npm run dev` / a Netlify deploy preview).
- If asked to ADD testing, propose the setup explicitly before introducing a framework; don't add one silently.

### Code Quality & Style Rules

**Naming conventions:**

- **Files:** `kebab-case` for everything — components, modules, CSS (`about-me.tsx`, `content-thumbnail.tsx`, `portrait-image.module.css`). NOT PascalCase filenames.
- **Components:** `PascalCase` identifiers (`AboutMe`, `PortraitImage`).
- **Constants:** `SCREAMING_SNAKE_CASE` for module-level constants (`JOB_TITLE`, `JOB_TITLES`).
- **CSS Module classes:** import named bindings (`import styles from './layout.module.css'` then `styles.container`, or `import { container } from …`) and interpolate into `className`.

**Formatting:** Prettier `3` + ESLint `9` flat config. Run `npm run lint` (and `npm run lint:fix`) / `npm run format`. Don't add ad-hoc `// eslint-disable` directives without cause.

**No code comments by default.** The codebase is essentially comment-free; let the code speak. Only comment genuinely non-obvious logic (e.g. the documented theming/animation quirks).

**File/folder structure:**

- One component per file, matching the filename. Co-locate a component's CSS Module next to it (`timeline-time-company.tsx` + `timeline-time-company.module.css`).
- Animations/easing live in `src/components/animations.ts`; reuse those tokens rather than redefining curves. `@keyframes` that must exist in the prerendered HTML go in `globals.css`.

**Tailwind class ordering:** follow existing patterns (layout → spacing → colour → state/responsive). Responsive prefixes use the custom `xs: 410px` breakpoint (defined via `--breakpoint-xs` in `@theme`) plus Tailwind defaults.

### Development Workflow Rules

- **Default branch:** `main`. Netlify deploys `main` on commit (deploy-on-commit, static `out/`).
- **Commit messages:** loosely Conventional-Commits (`feat:`, `fix:`, `chore:`) with a capitalised, imperative subject.
- **Pre-commit hook:** Husky runs `pretty-quick --staged` — staged files auto-format on commit. Don't fight it. (`HUSKY=0` is set in `netlify.toml` so CI install doesn't trip on the `prepare: husky` hook.)
- **Commit/push only when asked.** Don't commit automatically after edits.
- **Local dev:** `npm run dev` (Next dev server, hot reload). **Production build:** `npm run build` → static export in `out/`. Preview the build with a static server or a Netlify preview.
- **Site:** deploys as a static bundle to `https://zackerthehacker.com` via Netlify (config in `netlify.toml`: `command = "next build"`, `publish = "out"`). Google Analytics `gtag` `G-F98QXJC4S0` is wired via `@next/third-parties` `GoogleAnalytics` in `layout.tsx`.

### Critical Don't-Miss Rules (Gotchas)

- **Tailwind v4 border/ring/divide guard (ADR 0009).** v4 defaults `border`/`ring`/`divide` colour to `currentColor` (v3 used `gray-200`). `globals.css` `@layer base` pins `border-color: var(--color-gray-200, currentColor)` to restore the old hairline. **Do NOT wipe the default Tailwind colour palette** (e.g. `--color-*: initial` in `@theme`) without re-pointing this guard, or bare borders silently regress to the text colour. Any new `border`/`ring`/`divide` must use an explicit colour token or be a deliberate gray-200 default.
- **Keep global base CSS in `@layer base`** (see above) — unlayered global rules override Tailwind utilities.
- **FrozenRouter uses a Next internal API (ADR 0025).** `src/components/atoms/frozen-router.tsx` imports `LayoutRouterContext` from `next/dist/shared/lib/app-router-context.shared-runtime` to enable App Router exit animations (route-transition parity, FR7). This is a documented, **accepted residual risk** and an upgrade-checklist item — it can break on a Next major upgrade. Do not "fix" or remove it casually; if a Next upgrade changes the import, FrozenRouter is the single point to update.
- **Hydration / SSG safety.** `<html>` has `suppressHydrationWarning` for `next-themes`. Code touching `window`/`document` must run inside `useEffect` or be guarded — the static export build (`next build`) has no DOM and will fail otherwise. Be aware of the `next-themes` post-hydration re-render (it motivated the `changeKey`-based animation trigger in ADR 0025).
- **Static export only.** `output: 'export'` means no server features: no API routes, no Route Handlers at runtime, no SSR/ISR/middleware, no `next/headers`/`cookies` dynamic APIs. Everything is prerendered to `out/`.
- **`next.config` is `.mjs`, not `.ts` (Velite hook).** The config `await import('velite')` and builds the content layer at the top of the module, before Next. If `@velite` data is stale or missing, that hook (and the `VELITE_STARTED` guard that stops a double-build) is where to look — don't add a competing content build step or a `package.json` script for it.
- **`.velite/` is generated — never hand-edit.** Edit the source markdown under `docs/public/`; the `@velite` import reflects it on the next build/dev. Velite runs `strict: true`, so frontmatter that breaks the schema **fails the build**: `title`/`section`/`order`/`teaser` are required, `adr` is optional, and `section` must be one of `Overview` / `Decisions` / `Pragmatism & process`.
- **Section-scoped `not-found.tsx` (ADR 0028).** A route-group `not-found` ignores its group layout, so each section has its own (root + `backroom`); the global 404 still wears the FoH shell via `SiteShell`. Keep these boundaries — they're deliberate guardrails, not duplication to "clean up".
- **Don't build Tailwind class names dynamically.** Write complete, static class strings (e.g. not `` `text-${color}` ``); Tailwind only emits classes it can statically see.
- **`react-spinners` keyframes are duplicated in `globals.css`** so the prerendered splash animates from first paint (react-spinners normally injects them client-side). Keep them if you touch the spinner.
- **Email is intentionally entity-obfuscated** to deter scrapers — preserve the HTML-entity form; don't "clean it up" to a plain `@`.
- **Don't introduce new top-level dependencies casually** — this is a deliberately small, static CV site. Prefer existing libraries over adding new ones; flag (don't silently add) anything new.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code in this project.
- Follow ALL rules exactly as documented; when in doubt, prefer the more restrictive option.
- Flag (don't silently break) any rule that conflicts with a requested change.
- For the _why_ behind a rule, see the ADRs in `docs/decisions/` (indexed in its `README.md`).

**For Humans:**

- Keep this file lean and focused on what agents would otherwise get wrong.
- Update it when the stack, theming system, or atomic structure changes.
- Remove rules that become obvious or obsolete over time.

Last Updated: 2026-06-30
