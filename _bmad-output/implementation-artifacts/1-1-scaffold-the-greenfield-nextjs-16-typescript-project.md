# Story 1.1: Scaffold the greenfield Next.js 16 + TypeScript project

Status: ready-for-dev

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

- [ ] **Task 1 — Relocate the Gatsby project into `archive/` (AC: 1)**
  - [ ] Create `archive/` at the repo root.
  - [ ] `git mv` all **tracked** Gatsby files into `archive/`: `gatsby-config.js`, `gatsby-browser.js`, `gatsby-ssr.js`, `package.json`, `package-lock.json`, `tailwind.config.js`, `postcss.config.js`, `src/`, `static/`. (Preserves history.)
  - [ ] `mv` the **untracked/ignored** build artifacts that exist into `archive/` so the build works without a reinstall: `node_modules/`, `.cache/`, `public/`.
  - [ ] Do **not** move shared/repo-level files: `.git/`, `.gitignore`, `.idea/`, `.claude/`, `_bmad/`, `_bmad-output/`, `docs/`, `CLAUDE.md`, `LICENSE`, `README.md`, `.prettierrc`, `.prettierignore` all stay at root (Prettier config is reused by the new project — see Task 4).
  - [ ] Verify: `cd archive && npm run build` (or `npx gatsby build`) completes successfully. If `node_modules` was not moved, run `npm install` inside `archive/` first.

- [ ] **Task 2 — Scaffold Next.js 16 at the repo root via a temp dir (AC: 2, 3, 4)**
  - [ ] **Do not run `create-next-app .` in the repo root — it will abort** (the root still holds `_bmad/`, `_bmad-output/`, `.claude/`, `CLAUDE.md`, `.prettierrc`, `.prettierignore`, `archive/`, none of which are in create-next-app's allowlist). Instead scaffold into a temporary directory and move the generated files to root.
  - [ ] Run `create-next-app` into a temp dir (e.g. `npx create-next-app@latest theseus-scaffold`) with these answers: **TypeScript = yes**, **ESLint = no**, **Tailwind = no** (Tailwind v4 is Story 1.3's job — keep this scaffold minimal), **`src/` directory = yes**, **App Router = yes**, **Turbopack = yes** (Next 16 default), import alias `@/*` = default/yes.
  - [ ] Move the generated project files from the temp dir into the repo root (`package.json`, `tsconfig.json`, `next.config.ts`, `next-env.d.ts`, `src/app/`, `public/`, etc.). Delete the now-empty temp dir.
  - [ ] Confirm `tsconfig.json` has `"strict": true` (create-next-app default — verify, don't assume).
  - [ ] Set `output: 'export'` in `next.config.ts`. (The Netlify Image CDN `loaderFile` is **not** part of this story — that's Story 1.7. No `next/image` usage exists yet, so a default-loader build is fine.)
  - [ ] **Pin the Node toolchain to the latest LTS.** Use fnm to install/use the latest LTS — currently **Node 24 "Krypton"** (`fnm install 24 && fnm use 24`; latest LTS release at build time is `v24.16.0`). Write the resolved exact version to a root `.node-version` file (fnm reads it automatically; it also honours `.nvmrc`). Set the root `package.json` `engines.node` to `>=24.0.0`. (Note: `fnm` may alias `lts-latest` to the older 22 "Jod" line if its alias cache is stale — target 24 explicitly, do not rely on the alias.)
  - [ ] Run `next build` → must be green and emit `out/`. Run `next dev` → placeholder route + `src/app/layout.tsx` render with no errors.

- [ ] **Task 3 — Reconcile `.gitignore` for Next + archived Gatsby (AC: 1, 3)**
  - [ ] Add Next artifacts: `/.next/`, `/out/`, `next-env.d.ts` (per create-next-app's generated ignore).
  - [ ] **Critical:** the existing root `.gitignore` ignores `public` (Gatsby's *output*) and `.cache/`. In a Next project `public/` is committed **source** — re-scope the Gatsby ignores to the archive so root `public/` is tracked: change `public` → `archive/public/` and `.cache/` → `archive/.cache/`. Keep `node_modules/` ignored (applies to both root and `archive/`).
  - [ ] Verify `git status` shows the new root `public/` as tracked and does **not** show `archive/public` or either `node_modules`.

- [ ] **Task 4 — Carry over Prettier + wire Husky correctly (AC: 5)**
  - [ ] Keep the root `.prettierrc` (`{ "singleQuote": true, "arrowParens": "avoid" }`) and `.prettierignore` — they already apply to the new `.ts`/`.tsx` tree.
  - [ ] Add `prettier@2.8.7`, `husky`, and `pretty-quick` as devDependencies of the **root** `package.json`. (The existing Husky setup is the **legacy v4 style** — a `husky.hooks` block in the old `package.json` with no `.husky/` dir and no `prepare` script — so it was effectively inert. Wire it the modern way instead.)
  - [ ] Initialise Husky (`npx husky init` or equivalent for the installed major) so a `prepare` script and a `.husky/pre-commit` file exist; set the hook to `pretty-quick --staged`.
  - [ ] **Verify the hook actually fires:** stage a deliberately mis-formatted `.tsx` file and commit — confirm `pretty-quick` reformats it. (AC5 says "verified active", not just "configured".)
  - [ ] Keep a `format` script (`prettier --write "**/*.{js,jsx,ts,tsx,json,md}"`).
  - [ ] Set the `test` script to an honest stub (e.g. `echo "No test suite" && exit 1`) — do **not** add Jest/Vitest/RTL (AR13). No ESLint config of any kind.

- [ ] **Task 5 — Capture the foundational decisions (cross-cutting FR26 / AR19)**
  - [ ] The decision-capture *mechanism* is formally Story 1.2, but two decisions are made **in this story** and must not be lost: (a) the `archive/`-at-root coexistence model (Gatsby relocated, Next at root, `archive/` deleted at Epic 4 cutover), and (b) declining ESLint + Tailwind in the scaffold (deferred to 1.3). Note these in your Completion Notes so Story 1.2 can fold them into the decision log. Do not build the ADR system here.

## Dev Notes

### Coexistence model — the spine of the whole migration (read first)

**Decision (Zac, 2026-06-11):** invert the usual transitional-subdir approach. The **new Next.js app is built at the repo root**; the **entire Gatsby project is relocated wholesale into `archive/`** and kept buildable until cutover. At Epic 4 cutover (Story 4.2), `archive/` is simply deleted.

Why this over a `theseus/` subdir:
- The end state is an **idiomatic root-level Next repo from day one** (the guiding principle: build Next-native, see [[theseus-idiomatic-next-principle]]) — no promotion/move at the riskiest moment.
- Cutover is `rm -rf archive/` + remove from git, not a large file relocation.
- Gatsby's `gatsby-config.js` references `${__dirname}/src/images` (relative to its own root), so moving the whole tree intact keeps `gatsby build` working from `archive/`.

Why a single shared root was **not** an option (forced constraint): one root `package.json` cannot hold React 18 (Gatsby) *and* React 19 (Next), nor Tailwind v3 *and* v4; and `public/` is a hard collision — Gatsby *outputs* to `public/`, Next uses `public/` as static *source*. The two builds need separate dependency roots. [Source: planning-artifacts/epics.md#AR1; technical research #What-the-existing-codebase-uses]

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

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
