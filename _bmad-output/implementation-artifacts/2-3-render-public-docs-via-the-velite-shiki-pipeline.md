---
baseline_commit: 9b92894
---

# Story 2.3: Render Public docs via the Velite + Shiki pipeline

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a technical evaluator,
I want each Public doc rendered as a themed, syntax-highlighted HTML page at build time,
so that I can read the decisions in the site's own visual language with legible code, with no server runtime (UJ-2).

## Acceptance Criteria

1. **Velite pipeline installed + configured (AR-2/AR-3/AR-10, ADR 0027).** `velite` (devDependency) and `@shikijs/rehype` + `shiki` (deps) are installed (pinned: `velite@0.4.0`, `@shikijs/rehype@4.3.0`); `velite.config.ts` defines a collection over `docs/public/**/*.md` whose **Zod schema** enforces the AR-4 frontmatter (`title`, `section` enum, `order`, `teaser`, optional `adr`) — **invalid/missing frontmatter fails `npm run build` with a clear error**; the body renders to an HTML string with **Shiki** highlighting via `@shikijs/rehype` + `createCssVariablesTheme()`; typed data is emitted to `.velite/`; `.velite/` is gitignored **and** added to the ESLint ignore list; `next.config.ts` runs Velite's `build()` **to completion before Next compiles** (the Turbopack-safe Next-config hook — not the legacy webpack plugin; **no `netlify.toml` change**).

2. **New theme tokens + rendered-HTML styling discipline (UX-DR1, AR-12, UX-DR10/11/12/16).** In `globals.css`: `--color-text-dim` and `--color-code-surface` are added to **both** `:root` and `.light` (`code-surface` identical in both — constant near-black) with matching `@utility` blocks (`text-dim`, `bg-code-surface`); the `--shiki-*` variables are defined in `@layer base` mapped to theme tokens. The injected doc body (rendered via `dangerouslySetInnerHTML`, first-party trusted content) is styled by a **single scoped `doc-content.module.css`** prose block targeting `h1/h2/p/ul/ol/li/a/blockquote/code/pre/table/th/td` using **theme tokens only** (no hex, no raw Tailwind palette), capped to the **64ch** reading measure, with **blockquotes** rendering as the gold pragmatism call-out (left gold bar + faint gold wash, `radius 0 8px 8px 0`) and **code blocks** on the `code-surface` plane (8px radius, hair-thin light border).

3. **Routing contract (AR-5).** `/backroom` (Overview — renders `start-here.md`) and `/backroom/[slug]` (one doc) are implemented; `[slug]`'s `generateStaticParams` maps over Velite's generated `docs` array (excluding the Overview doc, which lives at `/backroom`, to avoid a duplicate route) with `export const dynamicParams = false`; every doc produces a statically-exported route (`○ (Static)`, no `.func`); a `doc-content` **organism** renders the doc HTML. Markdown features (headings, lists, links, **tables**, code) render correctly; syntax highlighting is present **in the prerendered HTML** (zero client JS for docs); render + highlighting respond correctly to the dark/light toggle (UX-DR19).

4. **Internal links + no dead-ends (AR-13, UX-DR8).** A doc linking to another via an absolute `/backroom/<slug>` path resolves within the static export; a **missing link target does NOT break the build** (verify with a temporary bad link, then remove); a **`back-link` atom** (`◀ back to the site`, `text-dim`, cyan on hover — UX-DR8) is created and used in the Backroom layout so no rendered doc is a dead-end.

5. **ADR 0027 discipline + scope (AR-11, NFR-7).** The implementation follows ADR 0027 (`docs/decisions/0027-markdown-pipeline-velite-shiki.md`, already authored + indexed); the ADR is **updated only if the as-built pipeline diverges** from it (e.g. final integration shape, exact Shiki variable set). `npm run build` + `npm run lint` are green, and the **only** new dependencies are `velite`, `@shikijs/rehype`, `shiki` (NFR-7). The two-pane reading room, sectioned nav, tiles, Entry link, and console egg are **out of scope** (Stories 2.4–2.6).

## Tasks / Subtasks

- [x] **Task 1 — Install + configure the Velite/Shiki pipeline (AC: #1)**
  - [x] `npm install -D velite@0.4.0` and `npm install @shikijs/rehype@4.3.0 shiki` (Shiki provides `createCssVariablesTheme`; pin to a `shiki` version compatible with `@shikijs/rehype@4.3.0` — install lets npm resolve the peer, then confirm in lockfile). Confirm these are the **only** new entries in `package.json` (NFR-7).
  - [x] Create **`velite.config.ts`** at repo root: `root: 'docs'`, a `docs` collection with `pattern: 'public/**/*.md'`, the Zod schema (Task 2), `content: s.markdown()` for the body, and global `markdown.rehypePlugins: [[rehypeShiki, { theme: createCssVariablesTheme({ name: 'css-variables', variablePrefix: '--shiki-', fontStyle: true }) }]]`. See **Dev Notes → "velite.config.ts (reference shape)"**.
  - [x] Wire the Next config so Velite's `build()` **completes before Next compiles** (await), guarded against double-invocation (`VELITE_STARTED`) and dev/build-aware (`watch` in dev, `clean` on build). **Used `next.config.mjs`** — Next 16 rejected top-level `await` in `next.config.ts` (`ERR_REQUIRE_ASYNC_MODULE`), exactly the documented fallback. Cold-build gate is green.
  - [x] `.gitignore`: add `.velite/`. `eslint.config.mjs`: add `.velite/**` to `globalIgnores([...])` so ESLint does not lint the generated data layer.
  - [x] Add a typed-import alias so Server Components can import Velite output cleanly: add `"@velite": ["./.velite"]` to `tsconfig.json` `paths` (the existing `@/*` maps to `./src/*`, so `@/.velite` would wrongly resolve to `src/.velite` — do **not** reuse it). Import as `import { docs } from '@velite'`.
- [x] **Task 2 — Frontmatter Zod schema + slug derivation (AC: #1)**
  - [x] Schema fields (AR-4): `title: s.string()`, `section: s.enum(['Overview', 'Decisions', 'Pragmatism & process'])`, `order: s.number()`, `teaser: s.string()`, `adr: s.number().optional()`. **No `slug` field, no glyph field** (both derived).
  - [x] Derive `slug` from the filename via `s.path()` + a transform; used `path.replace(/^.*\//, '')` (always-string, unlike `.pop()` which types `string | undefined` and breaks `generateStaticParams` under strict TS). Route is `/backroom/<slug>`. Did not use `s.slug()`.
  - [x] Verified self-validation: breaking `section` to an invalid enum makes the programmatic `build({ strict: true })` **throw "Schema validation failed."** → `npm run build` fails with a clear Velite/Zod error → restored. (Note: default `build()` only _logs_ issues; `strict: true` is what makes it fail — Zac directed it stays on always, dev included.)
- [x] **Task 3 — Theme tokens + `--shiki-*` mappings in `globals.css` (AC: #2)**
  - [x] Added `--color-text-dim` to `:root` (`#b9bcc0`) and `.light` (`#5f6368` — a dimmed counterpart of the light theme's `#333` primary, following the front-of-house token pattern per Zac's steer). Added `--color-code-surface: #1e1e1e` to **both** `:root` and `.light` (identical).
  - [x] Added `@utility text-dim` and `@utility bg-code-surface` alongside the existing `@utility` blocks (top level, not in `@layer base`).
  - [x] Defined the `--shiki-*` variables in `@layer base` (`:root`). Code-surface is a **constant near-black plane in both themes**, so kept the Shiki colours constant (light-on-dark) — **no `.light` override** (rationale noted in the ADR). Defined the full css-variables set (verified the emitted names from `out/*.html`) so nothing falls back unstyled.
- [x] **Task 4 — `doc-content` organism + scoped prose module (AC: #2, #3)**
  - [x] `src/components/organisms/doc-content.tsx` (Server Component): takes a `doc`, renders the **header** (eyebrow = section name in cyan 13px/600; Permanent-Marker doc title from `doc.title`, 38px, **once per page**; `ADR 0004`-style meta line when `doc.adr` is set) and the body via `dangerouslySetInnerHTML`.
  - [x] `src/components/organisms/doc-content.module.css`: single scoped prose block (element selectors under `.docContent`) using theme-token `var(--color-*)` only; column capped to `64ch`; blockquote → gold pragmatism call-out; `pre`/code → `code-surface` plane; UX-DR16 type scale (body 16px/1.7, `h2` 19px/500, code 12.5px/1.6). Table borders use `var(--color-text-dim)`; the call-out wash / code border use the DESIGN-specified rgba values only.
  - [x] **Duplicate-title seam resolved per Zac's decision:** dropped the leading `# Title` line from all four Story-2.1 docs so frontmatter `title` is the single source; the organism owns eyebrow + PM title + meta.
- [x] **Task 5 — Routes: Overview + `[slug]` (AC: #3, #4)**
  - [x] Replaced the placeholder `src/app/backroom/page.tsx` (Overview): imports `docs` from `@velite`, selects the `section === 'Overview'` doc, renders `<DocContent />`; `notFound()` guard; metadata title `The Backroom`.
  - [x] Created `src/app/backroom/[slug]/page.tsx`: `dynamicParams = false`; `generateStaticParams()` returns `{ slug }` for every doc **except** Overview (no duplicate `/backroom/start-here`); finds doc by `slug`, `notFound()` if absent (now the real caller for Story 2.2's `backroom/not-found.tsx`), renders `<DocContent />`; `generateMetadata` returns `{ title: doc.title }`.
  - [x] Created `src/components/atoms/back-link.tsx` (`◀ back to the site`, `Link href="/"`, `text-dim` + `hover:text-secondary`) and swapped it into `src/app/backroom/layout.tsx`; layout otherwise unchanged (two-pane shell is Story 2.4).
  - [x] Verified markdown features in `out/*.html`: headings/lists/inline cyan links/blockquote-callout render; **GFM tables render to real `<table>`** (remark-gfm on by default — no explicit plugin needed); a fenced code block emits inline `style="...var(--shiki-token-*)"` colour **in the prerendered HTML** (verified with a temporary block + table, then removed — none of the four curated docs currently ship code/tables; see Completion Notes flag).
- [x] **Task 6 — AR-13 missing-target + dead-end verification (AC: #4)**
  - [x] Temp internal link to a non-existent slug (`/backroom/does-not-exist`) → `npm run build` **green**; it renders as a plain `<a>` (no build-time coupling). Removed.
  - [x] Every rendered doc shows the `back-link` (via the Backroom layout — no dead-ends); the in-prose links in `start-here.md` resolve to the three real `/backroom/<slug>` routes.
- [x] **Task 7 — Build/lint/cold-build gates + ADR reconciliation (AC: #1, #3, #5)**
  - [x] **Cold-build gate (G2):** `rm -rf .velite && npm run build` → green; `/backroom` is `○ (Static)` and `/backroom/[slug]` (framework-decision, deferring-the-polish, building-with-ai-and-bmad) are `● (SSG)` prerendered to static HTML — **no `.func` in `out/`**; FoH routes still `○ (Static)` (no regression).
  - [x] `npm run lint` clean (ran a build first so `@velite` resolves; `.velite/**` is ESLint-ignored).
  - [x] Theme toggle: the toggle is in the root layout and renders on `/backroom`; prose uses theme tokens that flip with `.light`, so rendering responds structurally. Visual legibility in both themes is Zac's to eyeball on `npm run dev`/preview (not headlessly verifiable).
  - [x] As-built diverged from ADR 0027 → updated it: `next.config.mjs` (not `.ts`, TLA rejected), `strict: true`, and the constant Shiki plane with **no `.light` override**. AR-15: no fabricated test runs (none exist).

## Review Findings

_Code review 2026-06-29 (Blind Hunter + Edge Case Hunter + Acceptance Auditor). 3 decision-needed → all resolved, 2 patch → carried as low action items, 2 deferred, 8 dismissed as noise. Story signed off by Zac after visual QA._

- [x] [Review][Decision → resolved] No code block or GFM table ships in any of the four docs (AC3 capability vs shipped artefact). **Resolved:** Zac visually verified the capability with temporary snippet+table in `framework-decision.md` (since removed) — Shiki highlighting + GFM tables render correctly in both themes. The richer Decisions content (7–10 salient MADRs in MADR structure) is moved to a **new content story** added to Epic 2 via correct-course (positioned around Story 2.4). 2.3 ships the pipeline; content depth is its own story. [auditor]
- [x] [Review][Decision → dismissed] Light-theme code highlighting — the three `var(--color-*)`-referencing Shiki tokens flip under `.light` onto the constant code plane. **Resolved (dismissed):** Zac eyeballed the temp code block in both themes on `npm run dev` — legibility is fine in both; no change wanted. [edge+blind+auditor]
- [x] [Review][Decision → dismissed] Light-theme blockquote "gold" call-out shows a terracotta bar over a gold wash. **Resolved (dismissed):** visually confirmed acceptable; per-spec, left as-is. [edge+auditor]
- [ ] [Review][Patch — low, carried] Shiki `createCssVariablesTheme` passes no `variableDefaults`, and `--shiki-token-inserted/-deleted/-changed` + 16 `--shiki-ansi-*` are undefined → a ` ```diff `/ANSI block would render unstyled. **Best handled alongside the new Decisions-content story** (that is when code blocks actually start shipping); fold the fallback set in then. [edge] [velite.config.ts:5 / src/app/globals.css @layer base]
- [ ] [Review][Patch — low, carried] Deps use caret ranges, not the exact pins AC1 names. Lockfile pins resolved versions; trivial to tighten to exact `velite@0.4.0` / `@shikijs/rehype@4.3.0` if "pinned" is meant literally. Optional — repo mixes exact (next/react) and caret (others). [auditor] [package.json]
- [x] [Review][Defer] Lint/typecheck before a build fails on a fresh checkout — `next.config.mjs` only runs Velite for `dev`/`build` argv, so `@velite` is unresolved until a build generates `.velite/`. Netlify's `next build` is fine; latent fresh-checkout/CI DX trap. — deferred, low value [next.config.mjs]
- [x] [Review][Defer] Author-content trust edges in the pipeline are unhardened: a second `section: 'Overview'` doc becomes wholly unreachable; zero Overview docs silently 404s `/backroom`; duplicate basenames under `public/**` collide on slug. All latent (4 hand-authored flat docs today); hardening borders on gold-plating for this site. — deferred, content-controlled [velite.config.ts / src/app/backroom/page.tsx] [edge]

### What this story is (and is not)

This is the **substantive architectural story** of Project Ariadne: stand up the Velite + Shiki build-time markdown pipeline, the theme tokens it needs, the scoped prose styling for injected HTML, and the two Backroom routes (`/backroom` Overview + `/backroom/[slug]`) that render the curated `docs/public/*.md` (authored in Story 2.1) as themed, syntax-highlighted, statically-exported pages. It implements **per ADR 0027** (already authored). It is **not** the two-pane reading room, the sectioned nav (`backroom-nav`, `backroom-nav-row`), the tiles (`number-tile`, `glyph-tile`, `section-label`), the mobile-drawer nav, the Entry link, or the console egg — those are Stories 2.4–2.6. The only nav-ish atom in scope is `back-link` (so docs aren't dead-ends). Discipline: representative-and-strong, stay thin, follow the locked stack. [Source: epics.md#Story-2.3, #Epic-2, #AR-2/3/10/11/12/13; architecture.md#D1/D3, #G2; ADR 0027]

### Files touched (exhaustive)

| File                                              | Change                 | Notes                                                                                                                   |
| ------------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `package.json`                                    | **EDIT**               | add devDep `velite@0.4.0`; deps `@shikijs/rehype@4.3.0`, `shiki`. Nothing else (NFR-7).                                 |
| `velite.config.ts`                                | **NEW**                | collection over `docs/public/**/*.md` + Zod schema + `s.markdown()` + Shiki rehype.                                     |
| `next.config.ts`                                  | **EDIT**               | run Velite `build()` to completion before Next compiles (guarded). May become `.mjs` if TLA is rejected.                |
| `.gitignore`                                      | **EDIT**               | add `.velite/`.                                                                                                         |
| `eslint.config.mjs`                               | **EDIT**               | add `.velite/**` to `globalIgnores`.                                                                                    |
| `tsconfig.json`                                   | **EDIT**               | add `"@velite": ["./.velite"]` to `paths`.                                                                              |
| `src/app/globals.css`                             | **EDIT**               | `--color-text-dim`, `--color-code-surface` (both `:root` + `.light`) + `@utility` blocks; `--shiki-*` in `@layer base`. |
| `src/app/backroom/page.tsx`                       | **EDIT**               | replace placeholder Overview → render `start-here.md` via `DocContent`.                                                 |
| `src/app/backroom/[slug]/page.tsx`                | **NEW**                | `generateStaticParams` (excl. Overview) + `dynamicParams=false` + `notFound()` + `DocContent`.                          |
| `src/app/backroom/layout.tsx`                     | **EDIT**               | swap inline back-link for the `back-link` atom; otherwise unchanged (two-pane shell is 2.4).                            |
| `src/components/atoms/back-link.tsx`              | **NEW**                | `◀ back to the site`, `text-dim` + cyan hover.                                                                          |
| `src/components/organisms/doc-content.tsx`        | **NEW**                | header (eyebrow + PM title + meta) + injected body via `dangerouslySetInnerHTML`.                                       |
| `src/components/organisms/doc-content.module.css` | **NEW**                | single scoped prose block, theme tokens only, 64ch cap, callout + code-surface.                                         |
| `docs/public/*.md` (×4)                           | **EDIT (conditional)** | only if the recommended "drop leading `# Title`" duplicate-title resolution is chosen (Task 4).                         |
| `docs/decisions/0027-*.md`                        | **EDIT (conditional)** | only if the as-built pipeline diverges from the ADR (AR-11).                                                            |

Everything else is unchanged. **Server Components throughout** — there is **no** `'use client'` in this story (the lone Epic-2 client island, `console-egg`, is Story 2.6). [Source: architecture.md#Project-Structure tree (lines 366–432), #Component-Placement; project-context.md#Server-vs-Client]

### `velite.config.ts` (reference shape)

```ts
import { defineConfig, s } from 'velite';
import rehypeShiki from '@shikijs/rehype';
import { createCssVariablesTheme } from 'shiki';

const shikiTheme = createCssVariablesTheme({
  name: 'css-variables',
  variablePrefix: '--shiki-',
  fontStyle: true,
});

export default defineConfig({
  root: 'docs',
  collections: {
    docs: {
      name: 'Doc',
      pattern: 'public/**/*.md',
      schema: s
        .object({
          title: s.string(),
          section: s.enum(['Overview', 'Decisions', 'Pragmatism & process']),
          order: s.number(),
          teaser: s.string(),
          adr: s.number().optional(),
          path: s.path(),
          content: s.markdown(),
        })
        .transform(data => ({ ...data, slug: data.path.split('/').pop() })),
    },
  },
  markdown: {
    rehypePlugins: [[rehypeShiki, { theme: shikiTheme }]],
  },
});
```

Notes: collection key `docs` is the generated export name (`import { docs } from '@velite'`). `s.path()` returns the path relative to `root` without extension (e.g. `public/start-here`) → `.pop()` gives the kebab-case slug. `@shikijs/rehype`'s `theme` option accepts the `createCssVariablesTheme()` object; with the css-variables theme, Shiki emits inline `style="color:var(--shiki-token-…)"` so colour is **baked into the build-time HTML** (zero client JS). If TS complains about the rehype plugin tuple type, the documented workaround is `[[rehypeShiki as never, …]]` — prefer a precise type if it resolves cleanly. [Source: ADR 0027; velite.js.org/guide/code-highlighting; velite.js.org/reference/config]

### `next.config.ts` integration (the #1 risk — G2)

The legacy Velite **webpack plugin breaks under Turbopack**, which is the default compiler in Next 16. The supported path is calling Velite's programmatic `build()` from the Next config. ADR 0027 specifies awaiting it **before Next compiles** — for `output: 'export'` this matters: `[slug]`'s `generateStaticParams` imports the `docs` array from `.velite/`, so that data **must already exist** when Next collects routes, or a cold build throws "cannot find module '.velite'".

Reference (await, guarded, dev/build-aware):

```ts
import type { NextConfig } from 'next';

const isDev = process.argv.includes('dev');
const isBuild = process.argv.includes('build');
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = '1';
  const { build } = await import('velite');
  await build({ watch: isDev, clean: !isDev });
}

const nextConfig: NextConfig = {
  output: 'export',
  images: { loader: 'custom', loaderFile: './src/image-loader.ts' },
};

export default nextConfig;
```

- **Keep the existing `output: 'export'` + custom image loader** — do not drop them.
- The `VELITE_STARTED` guard stops a double build across Next's multiple config loads.
- **Top-level `await` requires the config module to be ESM.** If `next.config.ts` rejects TLA under Next 16, the documented Velite pattern is `next.config.mjs` (drop the `: NextConfig` annotation or keep it via a JSDoc `/** @type {import('next').NextConfig} */`). The acceptance test is the **cold-build gate** (Task 7), not the file extension — whichever form makes `rm -rf .velite && npm run build` green and every route `○ (Static)` is correct.
- The Velite docs also show a non-blocking `import('velite').then(...)` (no await). That can **race** a static-export cold build; only use it if the cold-build gate passes with it. Default to awaiting (matches ADR 0027). [Source: ADR 0027; velite.js.org/guide/with-nextjs; nextjs.org/blog/next-16-2-turbopack]

### Theme tokens + `--shiki-*` (globals.css)

Add to the existing token blocks (do not disturb the others). `text-dim` dark value is from DESIGN.md (`#b9bcc0`); the **light value is not specified by DESIGN** — choose a legible mid-grey against the light surfaces (`bg-primary-200 #ddd` / `bg-primary-400 #eee`), e.g. `#5f6368`, and flag it as a chosen value for Zac. `code-surface` is constant.

```css
:root {
  /* …existing… */
  --color-text-dim: #b9bcc0;
  --color-code-surface: #1e1e1e;
}
.light {
  /* …existing… */
  --color-text-dim: #5f6368; /* chosen — DESIGN only gives the dark value; confirm with Zac */
  --color-code-surface: #1e1e1e; /* constant — code plane is the same in both themes */
}

@utility text-dim {
  color: var(--color-text-dim);
}
@utility bg-code-surface {
  background-color: var(--color-code-surface);
}
```

`--shiki-*` in `@layer base` (`:root`). The css-variables theme references a small set of tokens; define at least foreground/background + the common token kinds, mapped to the site palette for theme-consistency. Because the code plane is a **constant** near-black, keep these light-on-dark in both themes (no `.light` override unless contrast testing demands one):

```css
@layer base {
  :root {
    --shiki-foreground: #e6e6e6;
    --shiki-background: var(--color-code-surface);
    --shiki-token-comment: #7a7f87;
    --shiki-token-keyword: var(--color-text-secondary); /* cyan */
    --shiki-token-string: #c3e88d;
    --shiki-token-constant: var(--color-text-tertiary); /* gold */
    --shiki-token-function: #82aaff;
    --shiki-token-parameter: #e6e6e6;
    --shiki-token-string-expression: #c3e88d;
    --shiki-token-punctuation: #b9bcc0;
    --shiki-token-link: var(--color-text-secondary);
  }
}
```

Confirm the **exact** variable names Shiki's css-variables theme emits by inspecting `out/*.html` after the first build (grep `--shiki-`); add any missing token vars so nothing falls back to an unstyled default. The mapping above is a starting palette — adjust to taste while keeping theme tokens for the cyan/gold accents. [Source: UX-DR1/12; DESIGN.md colors; ADR 0027 Shiki section; project-context.md#Theming]

### Rendered-HTML styling (`doc-content.module.css`) — the injected-HTML constraint

The body is an **HTML string** injected via `dangerouslySetInnerHTML`, so **Tailwind utilities cannot hang on its elements** (AR-12) — you must style it with a scoped CSS Module using **element selectors under the wrapper class**. CSS Modules only transform class/id names, not element selectors, so `.docContent h2 { … }` compiles to `.docContent_hash h2` — exactly the prose pattern. Use `var(--color-*)` theme tokens only (never hex except the Shiki/border rgba values DESIGN explicitly specifies). Apply the UX-DR16 scale:

- column: `max-width: 64ch` (the reading measure), left-aligned.
- `p`/`li`: `var(--color-text-primary)`, 16px, line-height 1.7.
- `h2`: 19px/500, slightly emphasised; `a`: `var(--color-text-secondary)` (cyan), underline-on-hover.
- `blockquote` → **pragmatism call-out**: left `4px` solid `var(--color-bg-tertiary)` (gold) bar + `background: rgba(224,180,4,0.08)` + `border-radius: 0 8px 8px 0` + padding (UX-DR11).
- `pre` → **code block**: `background: var(--color-code-surface)` + `border: 1px solid rgba(255,255,255,0.06)` + `border-radius: 8px` + padding; `code` inside: monospace 12.5px/1.6. Inline `code` (not in `pre`): a subtle treatment, your call, theme-token based.
- `table`/`th`/`td`: simple themed borders (use a theme token, not a raw hex), readable.

The `doc-content` **organism** renders, above the injected body: an **eyebrow** (the `section` name, cyan, 13px/600 tracked) and the **Permanent-Marker doc title** (`doc.title`, `font-fancy-heading`, 38px — the single fancy-face moment per page, UX-DR10/DESIGN "Don't"). An optional light **meta line** (e.g. `ADR 0004` for Decisions) is fine but keep it minimal; omit if it adds nothing. [Source: AR-12, UX-DR10/11/12/16; DESIGN.md typography/components; architecture.md#Velite-Output-&-Rendered-HTML-Styling]

### Duplicate-title decision (surface for Zac — Task 4)

Each `docs/public/*.md` body opens with a `# Title` h1 (e.g. `# Framework decision`) **and** the renderer shows the frontmatter `title` in Permanent Marker. Rendering both → the title twice. Resolve one way, explicitly:

- **(Recommended) Drop the leading `# Title` line from the four docs.** Frontmatter `title` becomes the single source; the organism owns eyebrow + PM title + meta; the prose below starts at the first paragraph. Tiny content edit to Story-2.1 files, justified, no plugin. Future authoring convention: title lives in frontmatter, not as a body h1.
- **(Alt, zero doc edits) Keep the body h1**; the organism renders only the eyebrow/meta header, and `doc-content.module.css` styles the **body `h1`** as the Permanent-Marker doc-title. Permanent Marker still appears once (one h1 per doc). Downside: the title is inside the injected HTML, so eyebrow/meta placement around it is less clean.

Per memory "don't-assert-secondhand-decisions-as-closed", **flag the choice for Zac** rather than baking it. Default to the recommended option if Zac doesn't weigh in. [Source: docs/public/*.md; UX-DR10; memory]

### Overview vs `[slug]` — avoid the duplicate route

`/backroom` renders the Overview doc (`start-here.md`). If `[slug]`'s `generateStaticParams` also emitted `start-here`, you'd get **both** `/backroom` and `/backroom/start-here` rendering the same content (two routes, duplicate content). Exclude the Overview doc from `[slug]` params (filter `section !== 'Overview'`, or `slug !== 'start-here'`). With `dynamicParams = false`, `/backroom/start-here` then 404s — intended. The `start-here.md` in-prose links already point at `/backroom/framework-decision` etc. (real `[slug]` routes) — correct, leave them. [Source: AR-5; architecture.md#D3; docs/public/start-here.md]

### Markdown features + GFM tables

ACs require tables to render. Velite's `s.markdown()` runs remark with **GFM enabled by default** (tables, strikethrough, task lists). Verify a table renders to real `<table>` HTML; if it comes through as raw `| … |` text, add `remarkGfm` explicitly to `markdown.remarkPlugins` in `velite.config.ts`. The current four docs have no tables — add one to a doc (or a scratch doc) to verify, then keep or remove per the duplicate-title/content decisions. [Source: epics.md#Story-2.3 AC3; velite.js.org/reference/config]

### Velite typed import + ESLint/TS resolution order

- Velite emits `.velite/index.js` + `.velite/index.d.ts`. The `@velite` tsconfig path lets you `import { docs } from '@velite'` from Server Components. **`@/.velite` will NOT work** — `@/*` maps to `./src/*`, so it'd resolve to `src/.velite`.
- `.velite/` is **generated**, so on a fresh checkout the import is unresolved until a build runs. The flow here always builds (cold-build gate, and Netlify's `next build` runs Velite first), so lint/typecheck after a build resolve fine. `.velite/**` is in `globalIgnores` so ESLint doesn't try to lint the generated files; that does not affect import resolution from your source.
- Do **not** commit `.velite/` (gitignored). [Source: ADR 0027; tsconfig.json; eslint.config.mjs]

### `dangerouslySetInnerHTML` is deliberate (first-party trusted content)

The doc body is Zac's own markdown rendered at build time — injecting it via `dangerouslySetInnerHTML` is the intended pattern (ADR 0027, architecture#Authentication-&-Security). If ESLint flags it (`react/no-danger` is **off** in the Next/React presets, so it likely won't), it's an accepted exception for trusted content — don't restructure to avoid it, and don't add a sanitiser (no XSS surface; no user input). [Source: ADR 0027; architecture.md#D3]

### Verification standard (no test suite)

`npm test` is a stub (`exit 1`) — there is **no** test framework; do not fabricate test runs (AR-15). Verification is:

1. **Cold build (G2):** `rm -rf .velite && npm run build` → green; `/backroom`, `/backroom/framework-decision`, `/backroom/deferring-the-polish`, `/backroom/building-with-ai-and-bmad` all `○ (Static)`; no `.func` in `out/`. Front-of-house routes still `○ (Static)` (no regression).
2. **Self-validation:** breaking a doc's frontmatter fails the build with a clear error (then restore).
3. **Shiki baked in:** grep `out/backroom/framework-decision.html` for `--shiki-` inline styles (highlighting in the prerendered HTML, zero client JS).
4. **AR-13:** a temp bad internal link keeps the build green; removed after.
5. `npm run lint` clean.
6. **Theme toggle (Zac, on `npm run dev`/preview):** prose + code colours respond to dark/light and code stays legible in both. Note what's not headlessly verifiable.

[Source: project-context.md#Testing-Rules; epics.md#AR-15; architecture.md#Development/Build/Deploy, #G2]

### Previous story intelligence (Stories 2.1 + 2.2)

- **Story 2.1** (done) authored the four `docs/public/*.md` (`start-here`, `framework-decision` [adr 4], `deferring-the-polish`, `building-with-ai-and-bmad`) with valid frontmatter and absolute `/backroom/<slug>` in-prose links — they are the input this pipeline consumes. **This story is the first to actually read them.** Their frontmatter must satisfy the Zod schema as-authored; if any field is off, fix the doc (it's the source of truth), don't loosen the schema. Note the leading-`# Title` duplicate-title seam (Task 4). [Source: 2-1 story; docs/public/*.md]
- **Story 2.2** (done) split the layout: root = global chrome only; `(site)/` = FoH shell; **plain `src/app/backroom/`** folder (not a route group) with `backroom/layout.tsx` (minimal, has the inline back-link this story replaces), `backroom/page.tsx` (placeholder Overview this story replaces), and **`backroom/not-found.tsx`** (renders inside the Backroom shell on `notFound()`). The `[slug]` page's `notFound()` for an unknown slug is exactly the case that boundary was built (forward-looking) to guard — it now has a real caller. GA is inherited from the root layout (no new wiring). [Source: 2-2 story; ADR 0028]
- **Discipline carry-over.** Every prior story held a hard "stay thin, scope the diff, don't gold-plate" line and surfaced flagged decisions for Zac rather than baking them. Same here: the diff is the pipeline + tokens + renderer + two routes + back-link, nothing more; the two-pane shell/nav/tiles/Entry-link/console-egg are later stories. Surface the duplicate-title and `text-dim` light-value choices. [Source: 1-2/1-3/1-4/2-2 dev notes; memory "don't-assert-secondhand-decisions-as-closed"]

### Git intelligence

Recent commits follow `feat: Project Ariadne story 2-N created` → `… code complete`, one focused diff per story (`9b92894` = Story 2.2 code complete, the baseline for this story). Keep this diff scoped to the pipeline config (`velite.config.ts`, `next.config.ts`, `.gitignore`, `eslint.config.mjs`, `tsconfig.json`), `globals.css` tokens, the `doc-content` organism + module, the `back-link` atom, and the two Backroom routes. No drive-by edits to FoH components or unrelated config. [Source: git log]

### Project Structure Notes

- Atomic tiers: `back-link` → **atom**; `doc-content` → **organism** (renders the `s.markdown()` HTML). No molecules in this story (nav-row is 2.4). [Source: architecture.md#Component-Placement, #AR-14]
- The Backroom layout stays the **minimal** Story-2.2 shell (just gains the `back-link` atom); the two-pane `bg-primary-200`/`bg-primary-400` reading room, 48px frame, and sectioned nav are **Story 2.4**. Don't build them here. [Source: architecture.md#D4; epics.md#Story-2.4; UX-DR2]
- Route transitions: the minimal Backroom layout omits `ContentTransition` (path of least resistance → likely no inter-doc transition). Don't add one; the conditional G4 review is Story 2.4. [Source: architecture.md#AR-8/G4]
- Theme tokens, `@utility` blocks, and the Tailwind-v4 `@layer base` discipline are project-context law — new global base CSS (the `--shiki-*` vars) goes in `@layer base`; `@utility` blocks go at top level (not in a layer). [Source: project-context.md#Tailwind-v4-gotcha; memory "theseus-tailwind-v4-layered-utilities-gotcha"]

### References

- [Source: epics.md#Story-2.3] — story statement + the five Given/When/Then AC groups (pipeline, tokens/styling, routing, internal links/back-link, ADR discipline).
- [Source: epics.md#Epic-2, #AR-2, #AR-3, #AR-4, #AR-5, #AR-6, #AR-10, #AR-11, #AR-12, #AR-13, #AR-14, #AR-15, #NFR-1, #NFR-4, #NFR-7] — Velite/Shiki, frontmatter contract, routing/data, build integration, deps, ADR 0027, theme-token discipline, link resolution, component placement, verification, static-export/perf/dependency-restraint constraints.
- [Source: epics.md#UX-DR1, #UX-DR8, #UX-DR10, #UX-DR11, #UX-DR12, #UX-DR16, #UX-DR19] — new tokens, back-link, doc renderer, pragmatism call-out, code-block styling, type scale, theme-toggle continuity.
- [Source: architecture.md#D1 (Velite), #D3 (routing/build integration), #Velite-Output-&-Rendered-HTML-Styling, #Authoring-Conventions, #File/Route-Layout, #Project-Structure tree (lines 366–432), #G2] — the pipeline decision, the `next.config.ts` Turbopack-safe hook, the injected-HTML styling rule, the FR→structure map, the G2 wiring gate.
- [Source: docs/decisions/0027-markdown-pipeline-velite-shiki.md] — the authored ADR this story implements (decision, consequences, rejected alternatives, decision trail); update only on divergence (AR-11).
- [Source: DESIGN.md] — colours (incl. `text-dim`/`code-surface`), typography scale, components (doc renderer, callout, code block, back-link), Do/Don't (Permanent Marker once per doc; no hardcoded hex).
- [Source: docs/public/*.md] — the four curated docs this pipeline renders (frontmatter + absolute links + the leading-`# Title` seam).
- [Source: src/app/backroom/layout.tsx, /page.tsx, /not-found.tsx] — the minimal Story-2.2 Backroom room this story renders into.
- [Source: src/app/globals.css] — the token + `@utility` + `@layer base` system to extend (not disturb).
- [Source: next.config.ts, tsconfig.json, eslint.config.mjs, .gitignore, package.json] — the config surfaces this story edits.
- [Source: velite.js.org/guide/with-nextjs, /guide/code-highlighting, /reference/config] — official Velite Next integration + `@shikijs/rehype` + config reference (researched for current Next 16 / Turbopack guidance).
- [Source: project-context.md] — Server-Components-by-default, atomic tiers, Tailwind-v4 CSS-first + `@layer base` gotcha, static export, no test suite, SEO/Metadata template (ADR 0021), British spelling, no comments, dependency restraint.

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m] (Opus 4.8, 1M context)

### Debug Log References

- Smoke build with `next.config.ts` + top-level await → `ERR_REQUIRE_ASYNC_MODULE` ("require() cannot be used on an ESM graph with top-level await"). Resolved by switching to `next.config.mjs` (documented fallback).
- TS type error on the rehype tuple (`Plugin<...>` not assignable — duplicate `unified` type instances) → resolved with the documented `[[rehypeShiki as never, …]]` cast.
- `velite build` (default) exits 0 on validation errors; `--strict` / programmatic `build({ strict: true })` exits 1 / throws. Wired `strict: true` so bad frontmatter fails `npm run build`.

### Completion Notes List

- **Pipeline stands up end-to-end.** Velite reads `docs/public/*.md`, validates frontmatter against the Zod schema, renders the body to HTML with Shiki highlighting baked into the static output (inline `var(--shiki-*)` colours, zero client JS), and emits a typed `.velite/` layer imported via `@velite`. `next.config.mjs` awaits `build()` before Next compiles, so the cold-build gate (`rm -rf .velite && npm run build`) is green and every Backroom route is statically exported (no `.func`).
- **Two flagged decisions, both settled with Zac up front:** (1) dropped the leading `# Title` from the four docs so frontmatter `title` is the single source; (2) `--color-text-dim` light value `#5f6368`, derived as a dimmed `#333` following the front-of-house token pattern.
- **`strict: true` is on in all modes** (Zac's call) — a malformed doc fails locally before check-in, including dev watch.
- **Honest divergences from ADR 0027 (ADR updated):** `next.config.mjs` not `.ts` (TLA); `strict: true` added; `--shiki-*` kept constant across themes (no `.light` override) because the code plane is a constant near-black — contrast is fine in both, and a `.light` override remains the documented escape hatch.
- **⚠️ Content flag for Zac (not a blocker):** none of the four curated docs currently contains a fenced code block or a GFM table, so the _shipped_ `out/` HTML has no Shiki output. The pipeline's highlighting + table rendering are verified working (temporary block/table → real `<table>` + inline `var(--shiki-token-*)` in `out/backroom/framework-decision.html`, then removed). If you'd like the Backroom to actually _show_ a highlighted snippet (it's a natural fit for `framework-decision` — the doc already discusses the config), that's a small content add in your voice; I didn't fabricate code into your prose. Recommendation: add one short, real snippet to `framework-decision.md`.
- **Theme toggle** works in the Backroom (toggle is in the root layout; prose uses theme tokens that flip with `.light`). Visual legibility in both themes is yours to eyeball on `npm run dev`/preview — not headlessly verifiable.
- **No test suite** (AR-15) — verification is the cold build, lint, schema self-validation, AR-13 link check, and `out/*.html` inspection, all green/passing. No test runs fabricated.

### File List

**New**

- `velite.config.ts`
- `next.config.mjs`
- `src/app/backroom/[slug]/page.tsx`
- `src/components/atoms/back-link.tsx`
- `src/components/organisms/doc-content.tsx`
- `src/components/organisms/doc-content.module.css`

**Modified**

- `package.json` (+ `velite` devDep; `@shikijs/rehype`, `shiki` deps)
- `package-lock.json`
- `tsconfig.json` (`@velite` path alias)
- `eslint.config.mjs` (`.velite/**` ignore)
- `.gitignore` (`.velite/`)
- `src/app/globals.css` (`--color-text-dim`, `--color-code-surface`, `text-dim`/`bg-code-surface` utilities, `--shiki-*` in `@layer base`)
- `src/app/backroom/page.tsx` (Overview → `DocContent`)
- `src/app/backroom/layout.tsx` (inline link → `BackLink` atom)
- `docs/public/start-here.md`, `docs/public/framework-decision.md`, `docs/public/deferring-the-polish.md`, `docs/public/building-with-ai-and-bmad.md` (dropped leading `# Title`)
- `docs/decisions/0027-markdown-pipeline-velite-shiki.md` (reconciled to as-built)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (status → in-progress → review)

**Deleted**

- `next.config.ts` (replaced by `next.config.mjs`)

## Change Log

- 2026-06-29 — Story 2.3 implemented: Velite + Shiki build-time markdown pipeline (`velite.config.ts`, `next.config.mjs` hook with `strict: true`), `--color-text-dim`/`--color-code-surface` theme tokens + `--shiki-*` mappings, `doc-content` organism + scoped prose module, `back-link` atom, and the `/backroom` (Overview) + `/backroom/[slug]` routes rendering the curated Public docs as themed, syntax-highlighted, statically-exported pages. Two flagged decisions settled with Zac (dropped leading `# Title` from docs; `text-dim` light value). ADR 0027 reconciled to as-built. Build + lint green; status → review.
