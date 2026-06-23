---
baseline_commit: 3bb27b515d2ee4e43ad6ef0b059e05289b6f08f0
---

# Story 1.1: Scaffold the greenfield Next.js 16 + TypeScript project

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As the engineer migrating the site,
I want a clean Next.js 16 App Router + TypeScript project scaffolded at the repo root, with the existing Gatsby project relocated wholesale into `archive/` and still buildable,
so that I have a modern, strict-typed foundation to port onto, without disturbing the live site.

## Acceptance Criteria

1. **Gatsby relocated, untouched, still builds.**
   **Given** the existing repository with the Gatsby site at the root,
   **When** the Gatsby project is relocated, every Gatsby file (source, config, tooling, lockfile) is moved **as-is** into a new root-level `archive/` directory with no content changes,
   **Then** `gatsby build` still completes successfully from inside `archive/`, and the live site continues to deploy unchanged from `main` (the relocation lands on `project-theseus` only).

2. **Modern stack scaffolded at root.**
   **Given** a cleared repo root,
   **When** the new project is scaffolded with the `create-next-app` idiom,
   **Then** a Next.js 16 project using the App Router, React 19.2, and TypeScript exists at the repo root with `tsconfig.json` set to `strict: true`,
   **And** no Gatsby, `@reach/router`, or GraphQL data-layer dependencies are present in the root `package.json`.

3. **Static-export build is green.**
   **Given** the scaffolded project,
   **When** `next build` is run,
   **Then** it completes with no errors and is configured for static export (`output: 'export'`).

4. **Dev server renders a placeholder.**
   **Given** the scaffolded project,
   **When** the dev server is started,
   **Then** a minimal root `src/app/layout.tsx` and a placeholder route render locally without error.

5. **Tooling carried over and actually active.**
   **Given** the repository tooling,
   **When** the project is committed,
   **Then** Prettier (`2.8.7` config: `singleQuote`, `arrowParens: "avoid"`) and a Husky `pretty-quick --staged` pre-commit hook are carried over and **verified active** on the new project,
   **And** no ESLint config is introduced and `npm test` remains an honest stub (no fabricated suite).

## Tasks / Subtasks

- [x] **Task 1 — Relocate the Gatsby project into `archive/` (AC: 1)**

  - [x] Create `archive/` at the repo root.
  - [x] `git mv` all **tracked** Gatsby files into `archive/`: `gatsby-config.js`, `gatsby-browser.js`, `gatsby-ssr.js`, `package.json`, `package-lock.json`, `tailwind.config.js`, `postcss.config.js`, `src/`, `static/`. (Preserves history.)
  - [x] `mv` the **untracked/ignored** build artifacts that exist into `archive/` so the build works without a reinstall: `node_modules/`, `.cache/`, `public/`.
  - [x] Do **not** move shared/repo-level files: `.git/`, `.gitignore`, `.idea/`, `.claude/`, `_bmad/`, `_bmad-output/`, `docs/`, `CLAUDE.md`, `LICENSE`, `README.md`, `.prettierrc`, `.prettierignore` all stay at root (Prettier config is reused by the new project — see Task 4).
  - [x] Verify: `cd archive && npm run build` (or `npx gatsby build`) completes successfully. If `node_modules` was not moved, run `npm install` inside `archive/` first.

- [x] **Task 2 — Scaffold Next.js 16 at the repo root via a temp dir (AC: 2, 3, 4)**

  - [x] **Do not run `create-next-app .` in the repo root — it will abort** (the root still holds `_bmad/`, `_bmad-output/`, `.claude/`, `CLAUDE.md`, `.prettierrc`, `.prettierignore`, `archive/`, none of which are in create-next-app's allowlist). Instead scaffold into a temporary directory and move the generated files to root.
  - [x] Run `create-next-app` into a temp dir (e.g. `npx create-next-app@latest theseus-scaffold`) with these answers: **TypeScript = yes**, **ESLint = no**, **Tailwind = no** (Tailwind v4 is Story 1.3's job — keep this scaffold minimal), **`src/` directory = yes**, **App Router = yes**, **Turbopack = yes** (Next 16 default), import alias `@/*` = default/yes.
  - [x] Move the generated project files from the temp dir into the repo root (`package.json`, `tsconfig.json`, `next.config.ts`, `next-env.d.ts`, `src/app/`, `public/`, etc.). Delete the now-empty temp dir.
  - [x] Confirm `tsconfig.json` has `"strict": true` (create-next-app default — verify, don't assume).
  - [x] Set `output: 'export'` in `next.config.ts`. (The Netlify Image CDN `loaderFile` is **not** part of this story — that's Story 1.7. No `next/image` usage exists yet, so a default-loader build is fine.)
  - [x] **Pin the Node toolchain to the latest LTS.** Use fnm to install/use the latest LTS — currently **Node 24 "Krypton"** (`fnm install 24 && fnm use 24`; latest LTS release at build time is `v24.16.0`). Write the resolved exact version to a root `.node-version` file (fnm reads it automatically; it also honours `.nvmrc`). Set the root `package.json` `engines.node` to `>=24.0.0`. (Note: `fnm` may alias `lts-latest` to the older 22 "Jod" line if its alias cache is stale — target 24 explicitly, do not rely on the alias.)
  - [x] Run `next build` → must be green and emit `out/`. Run `next dev` → placeholder route + `src/app/layout.tsx` render with no errors.

- [x] **Task 3 — Reconcile `.gitignore` for Next + archived Gatsby (AC: 1, 3)**

  - [x] Add Next artifacts: `/.next/`, `/out/`, `next-env.d.ts` (per create-next-app's generated ignore).
  - [x] **Critical:** the existing root `.gitignore` ignores `public` (Gatsby's _output_) and `.cache/`. In a Next project `public/` is committed **source** — re-scope the Gatsby ignores to the archive so root `public/` is tracked: change `public` → `archive/public/` and `.cache/` → `archive/.cache/`. Keep `node_modules/` ignored (applies to both root and `archive/`).
  - [x] Verify `git status` shows the new root `public/` as tracked and does **not** show `archive/public` or either `node_modules`.

- [x] **Task 4 — Carry over Prettier + wire Husky correctly (AC: 5)**

  - [x] Keep the root `.prettierrc` (`{ "singleQuote": true, "arrowParens": "avoid" }`) and `.prettierignore` — they already apply to the new `.ts`/`.tsx` tree.
  - [x] Add `prettier@2.8.7`, `husky`, and `pretty-quick` as devDependencies of the **root** `package.json`. (The existing Husky setup is the **legacy v4 style** — a `husky.hooks` block in the old `package.json` with no `.husky/` dir and no `prepare` script — so it was effectively inert. Wire it the modern way instead.)
  - [x] Initialise Husky (`npx husky init` or equivalent for the installed major) so a `prepare` script and a `.husky/pre-commit` file exist; set the hook to `pretty-quick --staged`.
  - [x] **Verify the hook actually fires:** stage a deliberately mis-formatted `.tsx` file and commit — confirm `pretty-quick` reformats it. (AC5 says "verified active", not just "configured".)
  - [x] Keep a `format` script (`prettier --write "**/*.{js,jsx,ts,tsx,json,md}"`).
  - [x] Set the `test` script to an honest stub (e.g. `echo "No test suite" && exit 1`) — do **not** add Jest/Vitest/RTL (AR13). No ESLint config of any kind.

- [x] **Task 5 — Capture the foundational decisions (cross-cutting FR26 / AR19)**
  - [x] The decision-capture _mechanism_ is formally Story 1.2, but two decisions are made **in this story** and must not be lost: (a) the `archive/`-at-root coexistence model (Gatsby relocated, Next at root, `archive/` deleted at Epic 4 cutover), and (b) declining ESLint + Tailwind in the scaffold (deferred to 1.3). Note these in your Completion Notes so Story 1.2 can fold them into the decision log. Do not build the ADR system here.

### Review Findings

_Code review 2026-06-11 (3 layers: Blind Hunter, Edge Case Hunter, Acceptance Auditor). All 5 ACs verified satisfied against a real `next build` (green, `out/` emitted). Headline "Blocker" — `output: 'export'` + `next/image` default loader — was empirically refuted: Next 16 no longer fires the legacy static-export image guard._

- [x] [Review][Decision→Patch] Placeholder page resolved (Zac, option 3): `metadata.title`/`description` updated to the canonical site values (`'Zac Braddy - CV website'` + the archived Gatsby description) for a minimal credibility fix; the create-next-app marketing body in `src/app/page.tsx` is intentionally kept and will be replaced by Epics 2–3. Full Metadata API (OpenGraph/Twitter/etc.) remains Story 1.6's scope. [src/app/layout.tsx:15]
- [x] [Review][Patch→Rejected] tsconfig `exclude` `archive/` — declined (Zac): editor/`tsc` noise only (Next build type-check is already scoped, so AC3 unaffected), and `archive/` is a deliberate temporary reference for porting that is deleted at Epic 4 cutover. Not wanted. [tsconfig.json]
- [x] [Review][Patch] Applied — added `next-env.d.ts` to `.prettierignore` so `prettier --check` / `npm run format` no longer touch the generated file [.prettierignore:5]
- [x] [Review][Defer] `next start` script is dead under `output: 'export'` (no server to start) [package.json] — deferred, low-priority footgun; revisit only if static export is ever dropped
- [x] [Review][Defer] `prepare: "husky"` fails under `npm ci --omit=dev` (prod/CI-only install, husky is a devDep) [package.json] — deferred to Story 1.7 (Netlify deploy config)
- [x] [Review][Defer] Geist fonts fetched from Google at build time → offline/air-gapped builds fail; reproducibility dependency [src/app/layout.tsx] — deferred to Story 1.7 (deploy/build env)

## Dev Notes

### Coexistence model — the spine of the whole migration (read first)

**Decision (Zac, 2026-06-11):** invert the usual transitional-subdir approach. The **new Next.js app is built at the repo root**; the **entire Gatsby project is relocated wholesale into `archive/`** and kept buildable until cutover. At Epic 4 cutover (Story 4.2), `archive/` is simply deleted.

Why this over a `theseus/` subdir:

- The end state is an **idiomatic root-level Next repo from day one** (the guiding principle: build Next-native, see [[theseus-idiomatic-next-principle]]) — no promotion/move at the riskiest moment.
- Cutover is `rm -rf archive/` + remove from git, not a large file relocation.
- Gatsby's `gatsby-config.js` references `${__dirname}/src/images` (relative to its own root), so moving the whole tree intact keeps `gatsby build` working from `archive/`.

Why a single shared root was **not** an option (forced constraint): one root `package.json` cannot hold React 18 (Gatsby) _and_ React 19 (Next), nor Tailwind v3 _and_ v4; and `public/` is a hard collision — Gatsby _outputs_ to `public/`, Next uses `public/` as static _source_. The two builds need separate dependency roots. [Source: planning-artifacts/epics.md#AR1; technical research #What-the-existing-codebase-uses]

"Untouched gatsby build" (Story 1.1 AC / AR1) is honoured in spirit: Gatsby code/config is **moved, not modified**, and the live site keeps deploying from `main`, which this branch does not alter.

### Exact target versions (do not drift) [Source: addendum.md#Decided-technical-stack; technical research #Target-Versions]

- **Next.js 16** (App Router; Turbopack is the default bundler for `dev` and `build`).
- **React 19.2** — the App Router pins its own validated React build; don't hand-manage it.
- **TypeScript 5.x**, `strict: true` (big-bang TS — no `allowJs`, no `.js` source components; AR2).
- **Node: latest LTS — Node 24 "Krypton"** (`v24.16.0` is the newest LTS release as of 2026-06; Node 16 requires Node 20.9+, so 24 LTS comfortably clears it). Build against latest LTS, not the bare minimum (Zac, 2026-06-11). Managed via **fnm** — pin the exact resolved version in a root `.node-version` file and set `engines.node: ">=24.0.0"`. The old Gatsby `package.json` said `>=18.15.0`. ⚠️ fnm's `lts-latest`/`default` alias on this machine is stale (points at 22.19) — install/use 24 explicitly.

### What this story deliberately does NOT do (scope guard — NFR6)

- **No Tailwind** in the scaffold → Story 1.3 (Tailwind v4 CSS-first + the border/ring/divide guard).
- **No theming / `next-themes` / CSS vars** → Stories 1.4–1.5.
- **No fonts / Metadata API / analytics** → Story 1.6.
- **No Netlify config or `next/image` `loaderFile`** → Story 1.7. This story only sets `output: 'export'`.
- **No UI port** (atoms/molecules/organisms/pages) → Epics 2–3.
- Keep `src/app/` to the create-next-app default layout + one placeholder route. Resist gold-plating.

### create-next-app gotchas (will bite if ignored)

- **`create-next-app .` aborts in this repo root.** Verified: root retains `_bmad/`, `_bmad-output/`, `.claude/`, `CLAUDE.md`, `.prettierrc`, `.prettierignore`, `archive/` — none in create-next-app's `validFiles` allowlist. Scaffold into a temp dir, then move files to root (Task 2).
- **Answer ESLint = no, Tailwind = no.** create-next-app defaults can pull both in. AC5 forbids ESLint; Tailwind belongs to Story 1.3.
- Choose **`src/` directory = yes** and **App Router = yes** to match the AC's `src/app/layout.tsx` path.

### Tooling carry-over specifics [Source: project-context.md#Tooling; addendum.md#Gatsby→Next mapping (Tooling row)]

- **Prettier 2.8.7 is law:** `singleQuote: true`, `arrowParens: "avoid"` → write `arg => …`, not `(arg) => …`. Keep the existing root `.prettierrc`/`.prettierignore`.
- **Husky was inert** (v4-style `husky.hooks` block in the old `package.json`, no `.husky/` dir, no `prepare`). Wire modern Husky (`prepare` + `.husky/pre-commit` → `pretty-quick --staged`) and **prove it fires** with a mis-formatted commit. AC5 demands active, not just present.
- **`npm test` stays an honest stub** (`exit 1`); there is no suite — do not fabricate one and do not claim tests pass (AR13).
- **No ESLint** anywhere — no config, no `// eslint-disable` directives.

### Files moved vs. kept (quick reference)

- **Into `archive/`:** `gatsby-config.js`, `gatsby-browser.js`, `gatsby-ssr.js`, `package.json`, `package-lock.json`, `tailwind.config.js`, `postcss.config.js`, `src/`, `static/`, plus ignored artifacts `node_modules/`, `.cache/`, `public/`.
- **Stay at root:** `.git/`, `.gitignore` (reconciled), `.idea/`, `.claude/`, `_bmad/`, `_bmad-output/`, `docs/`, `CLAUDE.md`, `LICENSE`, `README.md`, `.prettierrc`, `.prettierignore`.
- **Created at root by scaffold:** `package.json` (Next), `tsconfig.json`, `next.config.ts`, `next-env.d.ts`, `src/app/`, `public/`, `.node-version` (pins Node 24 LTS for fnm), `.husky/pre-commit`.

### Verification checklist before marking done

1. `cd archive && npm run build` → green (Gatsby still builds). [AC1]
2. Root `next build` → green, emits `out/`, `output: 'export'` set. [AC3]
3. Root `next dev` → placeholder route + `src/app/layout.tsx` render, no console/runtime errors. [AC4]
4. Root `package.json`: React 19.2, Next 16, TS present; **zero** `gatsby*`, `@reach/router`, `graphql` deps. [AC2]
5. `tsconfig.json` `strict: true`; `.node-version` pins Node 24 LTS and `node --version` (via fnm) matches. [AC2]
6. Mis-formatted `.tsx` commit gets auto-formatted by the Husky hook. [AC5]
7. `git status`: root `public/` tracked; `archive/public`, `archive/.cache`, both `node_modules` ignored. [AC3, AC1]

### Project Structure Notes

- Target end-state is a standard root-level Next.js App Router layout (`src/app/**/page.tsx`, `public/`, `next.config.ts`) — matches AR8/AR10/AR12 and the idiomatic-Next guiding principle. The `archive/` directory is a temporary coexistence device deleted at Story 4.2.
- The atomic-design tiers (`atoms/molecules/organisms`) and page routes are **not** created here; they arrive in Epics 2–3. This story stops at a buildable, deployable-shaped skeleton.
- No conflict with the unified structure: the only variance is the temporary `archive/`, which is intentional and documented above.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-1.1] — story statement + acceptance criteria.
- [Source: _bmad-output/planning-artifacts/epics.md#Additional-Requirements] — AR1 (greenfield scaffold), AR2 (big-bang TS), AR4 (`output: 'export'`), AR13 (tooling: Prettier+Husky, no ESLint, test stub).
- [Source: _bmad-output/planning-artifacts/prds/prd-project-theseus-2026-06-10/addendum.md#Decided-technical-stack] — versions, rendering, tooling row.
- [Source: _bmad-output/planning-artifacts/research/technical-project-theseus-nextjs-typescript-migration-research-2026-06-10.md#Technology-Stack-Analysis] — Next 16 / React 19.2 / TS strict / Turbopack; #Guiding-principle (idiomatic Next).
- [Source: _bmad-output/project-context.md#Tooling] — Prettier 2.8.7 config, Husky `pretty-quick --staged`, no ESLint, `npm test` stub; current Gatsby stack being archived.

## Dev Agent Record

### Agent Model Used

Claude Opus 4.8 (1M context) — `claude-opus-4-8[1m]` (BMad dev-story workflow, agent: Amelia)

### Debug Log References

- `cd archive && npm run build` → exit 0, "Done building in 8.66 sec", 6/6 static HTML pages, `archive/public/index.html` emitted (12M). Gatsby still builds from `archive/` with its moved `node_modules` (no reinstall needed). [AC1]
- Root `next build` (Node 24 via fnm) → exit 0, "Compiled successfully", TypeScript pass, 4/4 static pages, emits `out/` with `out/index.html`. `output: 'export'` confirmed. [AC3]
- Root `next dev` → HTTP 200 at `http://localhost:3000`, `<title>Create Next App</title>` (from `src/app/layout.tsx`), "Ready in 294ms", zero errors in log. [AC4]
- Husky hook proof: committed a deliberately mis-formatted `src/app/husky-check.tsx` (double quotes, `(name)` arrow parens, 4-space indent). `pretty-quick --staged` reformatted it on commit to `name =>`, `'hello '`, 2-space indent + semicolons. Verification commit was then soft-reset (HEAD back to baseline `3bb27b5`) and the throwaway file removed, so the hook fires for real but no test artifact remains. [AC5]
- `npm test` → prints "No test suite" and exits 1 (honest stub; no Jest/Vitest/RTL introduced — AR13).
- `git check-ignore`: `archive/public`, `archive/.cache`, `archive/node_modules`, root `node_modules`, `.next`, `out`, `next-env.d.ts` all IGNORED; root `public/` NOT ignored (tracked as Next source, shows `?? public/`). [AC1, AC3]

### Completion Notes List

- **AC1 — Gatsby relocated, untouched, still builds:** Entire Gatsby project `git mv`'d into `archive/` (71 files moved as pure renames at 100% similarity → content unmodified). Ignored build artifacts (`node_modules/`, `.cache/`, `public/`) moved with `mv`. `gatsby build` green from `archive/`. Live site keeps deploying from `main`; relocation lands on `project-theseus` only.
- **AC2 — Modern stack at root:** Next.js 16.2.9 (App Router) + React 19.2.4 + react-dom 19.2.4 + TypeScript ^5, `tsconfig.json` `strict: true` (and `allowJs: false` to honour AR2 big-bang TS). Zero `gatsby*` / `@reach/router` / `graphql` deps in root `package.json`. Scaffolded via `create-next-app` into a temp dir then moved to root (the `.` form aborts in this populated root). Node pinned to latest LTS **v24.16.0 "Krypton"** via `.node-version` + `engines.node: ">=24.0.0"` (fnm `lts-latest` alias is stale at v22 — installed 24 explicitly).
- **AC3 — Static export green:** `output: 'export'` in `next.config.ts`; `next build` emits `out/`. Netlify Image CDN `loaderFile` deliberately NOT added (Story 1.7).
- **AC4 — Dev placeholder:** create-next-app default `src/app/layout.tsx` + `src/app/page.tsx` placeholder route render at HTTP 200, no errors. Kept the scaffold default (incl. Geist fonts) — fonts/Metadata API/analytics are Story 1.6's scope, not added here.
- **AC5 — Tooling carried over & active:** Root `.prettierrc` (`singleQuote`, `arrowParens: "avoid"`) and `.prettierignore` reused (extended to ignore `archive`, `.next`, `out` so `npm run format` cannot rewrite archived Gatsby source). Legacy inert Husky v4 `husky.hooks` block (in the now-archived `package.json`) replaced with modern Husky v9: `prepare: "husky"` script + `.husky/pre-commit` → `pretty-quick --staged`, **proven firing**. No ESLint config anywhere; `test` is an honest `exit 1` stub.
- **Task 5 — Foundational decisions to fold into the Story 1.2 decision log (FR26/AR19):**
  1. **`archive/`-at-root coexistence model** (Zac, 2026-06-11): new Next app built at repo root; entire Gatsby tree relocated into `archive/` and kept buildable until Epic 4 cutover (Story 4.2), where `archive/` is simply deleted (`rm -rf archive/` + remove from git). Chosen over a `theseus/` subdir so the end state is an idiomatic root-level Next repo from day one, with no risky promotion/move at cutover. Forced constraint: one root `package.json` cannot hold React 18+Tailwind v3 (Gatsby) and React 19+Tailwind v4 (Next), and `public/` collides (Gatsby output vs Next source) — so separate dependency roots are required.
  2. **Declined ESLint + Tailwind in the scaffold:** ESLint permanently excluded (AR13 — Prettier-only tooling). Tailwind deferred to Story 1.3 (Tailwind v4 CSS-first + border/ring/divide regression guard) to keep this scaffold minimal.
  3. **Build against latest LTS, not the floor:** Node pinned to v24.16.0 "Krypton" (latest LTS at build time) rather than the old Gatsby `>=18.15.0` floor (Zac, 2026-06-11).
- **Note on Prettier pin:** Initially pinned `prettier` to exact `2.8.7`; reverted to caret `^2.8.7` per Zac's instruction mid-implementation (lockfile holds the exact resolved version).
- **Discarded scaffold extras:** create-next-app's generated `AGENTS.md`, stub `CLAUDE.md`, `README.md`, and `.gitignore` were NOT moved to root — the root already has its own `CLAUDE.md`/`README.md`, and `.gitignore` was reconciled by hand (Task 3).

### File List

**Created at repo root (new Next.js project):**

- `package.json` — Next 16 / React 19.2 / TS project manifest; `engines.node: ">=24.0.0"`; scripts: `dev`, `build`, `start`, `format`, `prepare`, `test` (stub).
- `package-lock.json`
- `tsconfig.json` — `strict: true`, `allowJs: false`, `@/*` path alias.
- `next.config.ts` — `output: 'export'`.
- `next-env.d.ts` (gitignored, generated).
- `.node-version` — `v24.16.0`.
- `.husky/pre-commit` — `pretty-quick --staged` (plus Husky v9 `.husky/_` internals).
- `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/app/page.module.css`, `src/app/favicon.ico` — create-next-app default layout + placeholder route (formatted to house style).
- `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg` — Next static source.

**Modified at repo root:**

- `.gitignore` — re-scoped Gatsby ignores to `archive/.cache/` + `archive/public/`; added Next artifacts (`/.next/`, `/out/`, `next-env.d.ts`, `*.tsbuildinfo`); root `public/` now tracked.
- `.prettierignore` — added `archive`, `node_modules`, `.next`, `out` (kept `package.json`, `package-lock.json`, `public`).

**Relocated into `archive/` (Gatsby project, moved unmodified — `git mv`, 100% rename similarity):**

- Tracked: `gatsby-config.js`, `gatsby-browser.js`, `gatsby-ssr.js`, `package.json`, `package-lock.json`, `tailwind.config.js`, `postcss.config.js`, `src/**`, `static/**`.
- Ignored build artifacts (plain `mv`, not tracked): `node_modules/`, `.cache/`, `public/`.

**Story-tracking files modified:**

- `_bmad-output/implementation-artifacts/1-1-scaffold-the-greenfield-nextjs-16-typescript-project.md` — frontmatter `baseline_commit`, task checkboxes, Dev Agent Record, File List, Change Log, Status.
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — story status `ready-for-dev → in-progress → review`.

## Change Log

| Date       | Change                                                                                                                                                                                                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-06-11 | Relocated Gatsby project wholesale into `archive/` (still builds); scaffolded Next.js 16 + React 19.2 + strict TS at root with `output: 'export'`; pinned Node 24 LTS; reconciled `.gitignore`; wired modern Husky v9 + Prettier (hook verified firing). Story 1.1 implemented; status → review. |
