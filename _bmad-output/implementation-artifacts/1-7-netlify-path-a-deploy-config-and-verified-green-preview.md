---
baseline_commit: 9cf0771
---

# Story 1.7: Netlify Path A deploy config and verified green preview

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As the engineer migrating the site,
I want the static-export Netlify deploy configured and a green preview of the skeleton verified,
so that the highest-risk foundation (stack, theming, deploy shape) is proven live before any UI is built — and deploy-on-commit is preserved.

## Context & purpose (read first)

This is the **final story of Epic 1** and the **pre-UI checkpoint**. Everything that makes the
foundation risky — Next 16 + React 19.2 + TS-strict, Tailwind v4, the CSS-variable theming, the
`next-themes` toggle + persistence, `next/font`, the Metadata API, GA — has been built across
Stories 1.1–1.6 and verified _locally_ (build + static-HTML/CSS inspection). Story 1.7 closes the
loop by **proving it green on a real Netlify preview deploy**, and by wiring the two deploy-shape
pieces that only matter at deploy time: the **static-export Netlify config** and the **custom
`next/image` loader** for the Netlify Image CDN (Path A, per ADR
[0003](../../docs/decisions/0003-netlify-deploy-path-a-static-export.md) / AR5).

**The production cutover is explicitly NOT done here.** This story proves the deploy shape on a
**preview** (branch deploy / PR deploy-preview) only. Promoting the modern build to production and
retiring Gatsby is Epic 4 (Stories 4.2). See AC5.

This story splits into two halves with different ownership:

- **Config + local verification (dev agent owns, fully verifiable on this machine):** `next.config`
  loader wiring, `src/image-loader.ts`, `netlify.toml`, the husky-in-CI guard, a green local
  `next build`, and `out/` inspection (pure static, no functions, loader URLs present).
- **The Netlify preview deploy (human-in-the-loop — Zac):** pushing the `project-theseus` branch /
  opening a PR and confirming the Netlify preview builds green and renders correctly. The dev agent
  **cannot** trigger or inspect a Netlify dashboard deploy; it prepares everything so that push →
  green preview is the only remaining manual step, and documents exactly what "green" must show.

## Acceptance Criteria

1. **Static-export Next config with the Netlify Image CDN loader (AR4, AR5; ADR 0003).**
   **Given** Netlify deploy Path A,
   **When** `next.config.ts` is configured for static export (`output: 'export'`, already present)
   **and** a custom `next/image` loader is wired via `images: { loader: 'custom', loaderFile: './src/image-loader.ts' }`,
   **Then** a local production build (`next build`) produces a **pure static bundle** in `out/` with
   **no serverless/Netlify functions** (no `out/_next/server`, no functions output),
   **And** `next/image` no longer errors under `output: 'export'` (the custom loader replaces the
   default optimiser; no `images.unoptimized` flag is needed),
   **And** the emitted markup routes images through the loader — image `src`/`srcset` values point at
   `/.netlify/images?url=…&w=…&q=…` (verifiable in `out/index.html`).

2. **The image loader emits the exact Netlify Image CDN URL shape.**
   **Given** the custom loader file at `src/image-loader.ts`,
   **When** it is called with `{ src, width, quality }`,
   **Then** it returns `/.netlify/images?url=<src>&w=<width>&q=<quality||75>`,
   **And** the `url` value is URL-encoded (so site-relative paths like `/images/zac-portrait.jpg`
   survive query-string encoding),
   **And** it is a TypeScript file with a typed default export, `strict`-clean (no `any`, no lint
   errors), consistent with the rest of the codebase (no `.js` source files — AR2).

3. **`netlify.toml` configures the static-export build deterministically (NFR4).**
   **Given** the repo root,
   **When** `netlify.toml` is added,
   **Then** it sets `[build] command = "next build"` and `publish = "out"`,
   **And** it does **not** force the framework to "static" or otherwise disable Next detection —
   Netlify's Next runtime is allowed to auto-detect the project; under `output: 'export'` the runtime
   emits a static-only deploy with **zero functions**, so auto-detection (AC4) and "no functions"
   (AC1) are **not** in conflict,
   **And** the husky `prepare` script is neutralised in the CI/build environment so the Netlify
   install step cannot fail on it (`[build.environment] HUSKY = "0"`) — this **resolves the Story 1.1
   deferred item** ("`prepare: "husky"` fails under prod/CI install").

4. **Deploy-on-commit + Next auto-detection preserved; no host migration (NFR4, AR6).**
   **Given** the existing GitHub `main` → Netlify deploy-on-commit integration,
   **When** the Netlify project picks up this config,
   **Then** Next.js is auto-detected and the deploy-on-commit hook is preserved end-to-end — the same
   GitHub→Netlify pipeline, **no host migration, no new Netlify project** (the existing site that
   serves the Gatsby build is reused),
   **And** `.node-version` (`v24.16.0`, ADR [0008](../../docs/decisions/0008-build-against-latest-lts-node.md))
   is the single source of truth Netlify uses for the build Node version — confirm Netlify resolves
   Node 24 from it (do **not** duplicate the version into `netlify.toml` unless Netlify fails to read
   `.node-version`).

5. **A green Netlify _preview_ deploy renders the skeleton (the checkpoint).**
   **Given** a push to the `project-theseus` branch / an open PR,
   **When** Netlify builds it as a branch deploy or deploy preview,
   **Then** the preview URL renders the skeleton **with no build or runtime errors**, showing:
   - the page **themed** (dark default; toggling to light works and both palettes render as in local
     dev — the body gradient included),
   - the **correct fonts** (Permanent Marker / Roboto via `next/font`, no FOUT/CLS),
   - the **moon/sun toggle working with persistence** across reload (`next-themes`),
   - **GA firing** — `gtag/js?id=G-F98QXJC4S0` requests observable in the network tab on the live
     preview (this is the deploy-time verification of Story 1.6 AC6, which was explicitly deferred to
     here),
     **And** the Netlify deploy log shows a static publish of `out/` with **no functions bundled**.
     _(This AC requires a real Netlify deploy and is the human-in-the-loop step — see Task 5.)_

6. **Cutover is explicitly NOT performed (scope guard; Epic 4).**
   **Given** this is the pre-UI checkpoint,
   **When** the preview is verified,
   **Then** the production site (`zackerthehacker.com`, served from `main`) is **left on the existing
   Gatsby build** — `main` is not merged into, production build settings are not switched, Gatsby in
   `archive/` is not retired. All of that is Epic 4 (Story 4.2).

7. **Scope discipline + decision capture (NFR6, FR26 / AR19).**
   **Given** the anti-gold-plating guardrail,
   **When** the story is implemented,
   **Then** no new runtime dependencies are added (the loader is hand-written; no Netlify plugin
   package is installed — the Next runtime is provided by Netlify's build image, not a repo dep),
   no UI is built, no assets are bulk-relocated, and the throwaway `create-next-app` skeleton page is
   left as-is (it is the thing being deployed to prove the shape),
   **And** the non-obvious deploy-implementation calls are captured **as-you-go** in a new ADR
   (next free number **0014**), indexed in `docs/decisions/README.md`.

## Tasks / Subtasks

- [ ] **Task 1 — Write the Netlify Image CDN loader** (AC: #1, #2)
  - [ ] Create `src/image-loader.ts` exporting a typed default function
        `({ src, width, quality }) => string` that returns
        `` `/.netlify/images?url=${encodeURIComponent(src)}&w=${width}&q=${quality ?? 75}` `` (build the
        query with `URLSearchParams` so encoding is correct and unambiguous).
  - [ ] Type the argument explicitly (e.g. a local `type ImageLoaderArgs = { src: string; width: number; quality?: number }`); no `any`. Follow Prettier rules (`arrowParens: avoid` does not apply to a named function; single quotes; `npm run format` after).
- [ ] **Task 2 — Wire the loader into `next.config.ts`** (AC: #1)
  - [ ] Add `images: { loader: 'custom', loaderFile: './src/image-loader.ts' }` to the existing
        `nextConfig` (keep `output: 'export'`). Do **not** add `images.unoptimized` — a custom loader
        makes it unnecessary, and adding both is contradictory.
  - [ ] Keep the file a typed `NextConfig` export; no other config changes.
- [ ] **Task 3 — Add `netlify.toml`** (AC: #3, #4)
  - [ ] At repo root, create `netlify.toml` with `[build] command = "next build"`, `publish = "out"`,
        and `[build.environment] HUSKY = "0"`.
  - [ ] Do **not** set `[build] framework = "#static"` or otherwise suppress Next detection (AC4 wants
        auto-detection; export mode already yields zero functions).
  - [ ] Confirm `.node-version` (`v24.16.0`) is present and is what Netlify will read; do not duplicate
        `NODE_VERSION` into `netlify.toml` unless a preview build proves Netlify ignores `.node-version`.
- [ ] **Task 4 — Local verification (dev agent owns; do not fabricate)** (AC: #1, #2)
  - [ ] Run `npm run build`; confirm green and that `out/` exists with static HTML and **no**
        `out/_next/server` / functions output.
  - [ ] Inspect `out/index.html`: confirm `next/image` `src`/`srcset` values point at
        `/.netlify/images?url=…&w=…&q=…` (the skeleton page's `next.svg`/`vercel.svg` images exercise
        the loader — note SVGs are a wiring smoke-test only; raster optimisation gets its real workout
        on the portrait/content images in Epic 2–3).
  - [ ] Run `npm run lint` (clean) and `npm run format`.
  - [ ] Record the exact verification commands/outputs in the Dev Agent Record → Debug Log References.
- [ ] **Task 5 — Netlify preview deploy (human-in-the-loop: Zac)** (AC: #4, #5)
  - [ ] Prepare a short, copy-pasteable handoff for Zac: push `project-theseus` (or open a PR), then
        in the Netlify dashboard confirm (a) branch deploys / deploy previews are enabled for the repo,
        (b) the deploy uses `netlify.toml` (`next build` → publish `out`), (c) the build log shows Next
        auto-detected, Node 24 resolved, **no functions bundled**, (d) the preview URL renders per AC5
        (theme + toggle + persistence + fonts), and (e) the live preview's network tab shows
        `gtag/js?id=G-F98QXJC4S0` firing (Story 1.6 AC6 deploy-time check).
  - [ ] On confirmation, paste the preview URL + a one-line "green" confirmation into the Dev Agent
        Record → Completion Notes. If the preview is **not** green, capture the build-log error and
        iterate on config (this is the whole point of the checkpoint — surface deploy-shape problems
        now, not at cutover).
  - [ ] **Do not** merge to `main` / switch production settings (AC6).
- [ ] **Task 6 — Decision capture (AC: #7)**
  - [ ] Create `docs/decisions/0014-netlify-deploy-config-and-image-loader.md` (use `_template.md`)
        capturing the implementation-level calls that ADR 0003 left open: the hand-written loader
        (no plugin dependency) and its exact URL shape; relying on Netlify's Next runtime auto-detection
        because `output: 'export'` yields zero functions (so AC1/AC4 don't conflict); `HUSKY=0` in the
        build env (resolving the Story 1.1 deferred item); `publish = out`; `.node-version` as the build
        Node source of truth. Status: Accepted.
  - [ ] Add the 0014 row to the "Seeded ADRs" table in `docs/decisions/README.md`.
  - [ ] Update `_bmad-output/implementation-artifacts/deferred-work.md`: mark the Story 1.1 husky item
        **RESOLVED** (with a pointer to ADR 0014 / this story). Leave the Story 1.6 `metadataBase`
        preview-OG item as a known, accepted limitation for the preview (see Dev Notes); do not "fix" it.

## Dev Notes

### What this story actually changes (small, deploy-shaped surface)

The codebase is already build-green and locally verified end-to-end through Story 1.6. This story adds
**three small files/edits** plus a deploy verification and an ADR:

- **New:** `src/image-loader.ts`, `netlify.toml`, `docs/decisions/0014-…md`.
- **Modified:** `next.config.ts` (add `images` block), `docs/decisions/README.md` (index 0014),
  `_bmad-output/implementation-artifacts/deferred-work.md` (close the husky item).

No UI, no dependencies, no asset moves, no theming/token changes. Stay inside that box (NFR6).

### Current state of the files being touched (read before editing)

- **`next.config.ts`** (current — `next.config.ts:1`):
  ```ts
  import type { NextConfig } from 'next';
  const nextConfig: NextConfig = {
    output: 'export',
  };
  export default nextConfig;
  ```
  Add only the `images` block. `output: 'export'` is already correct (AR4) and must stay.
- **`package.json`** — `"prepare": "husky"`, `engines.node >= 24.0.0`, `"build": "next build"`. The
  `HUSKY=0` build-env var is the chosen fix for the prepare-in-CI footgun rather than editing the
  `prepare` script, so local developer hooks keep working untouched. (`"start": "next start"` remains
  a dead script under `output: 'export'` — that's a separately-deferred 1.1 item, **not** in scope here.)
- **`.node-version`** = `v24.16.0` (ADR 0008). Netlify reads this for the build image's Node version.
- **`src/app/page.tsx`** (`src/app/page.tsx:1`) — still the `create-next-app` skeleton, using
  `next/image` for `/next.svg` and `/vercel.svg`. These are the only images in the build today, so they
  are what verifies the loader wiring. They are SVGs (the Next optimiser passes SVGs through), so the
  meaningful raster-optimisation behaviour of the Netlify Image CDN is only truly exercised once the
  portrait/content images land (Epic 2–3). For 1.7, confirming the **loader URL shape** in emitted
  markup is the bar.

### Why "auto-detect Next" and "no functions" are not contradictory

AC1 demands a pure static bundle (no serverless functions); AC4 demands Next auto-detection. These
coexist because Netlify's Next runtime **detects `output: 'export'` and produces a static-only deploy
with zero functions** — it does not generate the image/SSR functions it would for a server-rendered
Next app. So we deliberately **do not** suppress framework detection (some guides suggest forcing a
"static" framework to dodge the runtime — that's the wrong move for AC4). We let Netlify detect Next,
publish `out/`, and rely on export mode to keep it function-free. Capture this reasoning in ADR 0014.

### The image loader — exact contract

`next/image` calls the `loaderFile` default export with `{ src, width, quality }` for each rendered
image, building the `srcset`. Target output (Netlify Image CDN, available to any Netlify site, AR5):

```
/.netlify/images?url=<encoded-src>&w=<width>&q=<quality||75>
```

- `loaderFile` path in `next.config.ts` is **relative to the project root** → `./src/image-loader.ts`.
- A custom loader **replaces** the default optimiser, which is what makes `next/image` legal under
  `output: 'export'` — so **no `images.unoptimized`**.
- Local/site-relative `src` values (e.g. `/images/zac-portrait.jpg`) need no Netlify `remote_images`
  allow-list (that's only for remote origins). URL-encode `src` anyway for correctness.

### Preview ≠ production (deploy-shape, not host migration)

The whole Theseus build lives on the `project-theseus` branch; `main` still carries the live Gatsby
site (Gatsby now lives in `archive/`, per ADR
[0006](../../docs/decisions/0006-archive-at-root-coexistence-model.md)). `netlify.toml` committed on
`project-theseus` governs **branch/PR-preview** builds, giving us a green Next preview while production
stays on Gatsby. When `netlify.toml` eventually reaches `main`, it becomes the production config — and
**that merge is the Epic 4 cutover**, deliberately out of scope here (AC6). There is currently **no
`netlify.toml` on `main`** (production build settings live in the Netlify UI), so nothing on this
branch changes production until a merge.

### Known, accepted limitation on the preview (do not "fix")

Story 1.6 hardcoded `metadataBase` / `openGraph.url` to the production host
`https://zackerthehacker.com` (spec-mandated for production parity). Consequently the **preview** emits
production-host absolute OG/Twitter image URLs. This is a **known, accepted** limitation for 1.7 — the
preview checkpoint does not require correct social-card URLs (no AC covers it), and changing it would
break the production-parity contract. Leave it in the deferred log; revisit only if preview social-card
correctness ever matters (e.g. via `NEXT_PUBLIC_SITE_URL` env-derivation). (Story 1.6 deferred item.)

### Deferred items this story closes / touches

- **Closes (Story 1.1):** "`prepare: "husky"` fails under prod/CI install" → resolved via
  `HUSKY=0` in `netlify.toml [build.environment]`. Mark RESOLVED in `deferred-work.md` (Task 6).
- **Moot/noted (Story 1.1):** "Geist fonts fetched from Google at build → offline builds fail" — Geist
  was already removed in Story 1.6 (now Permanent Marker + Roboto via `next/font/google`, still fetched
  at build). **Not a Netlify-deploy blocker** (Netlify builds are networked). No action; note only.
- **Leaves deferred (Story 1.6):** the `metadataBase` preview-OG item above — accepted limitation.

### Testing standards (AR13 — no suite to fabricate)

There is **no test framework** (`npm test` is a stub that exits 1 — do not run it as if it tests
anything, do not invent a suite). Verification for this story is:

1. **Local:** `npm run build` green; `out/` is static with no functions; `out/index.html` shows
   `/.netlify/images?...` loader URLs; `npm run lint` clean; `npm run format` applied.
2. **Deploy (human-in-the-loop):** the Netlify preview is green and renders per AC5, with `gtag` firing
   on the live preview and no functions in the deploy log.

Record real command outputs in the Dev Agent Record. Do not claim the preview is green until Zac
confirms an actual Netlify deploy (AC5 is the one AC the dev agent cannot self-certify).

### Project Structure Notes

- `src/image-loader.ts` sits at `src/` root (not under `components/`) — it is build/config glue
  consumed by `next.config.ts`, not a component; this matches Next's own convention for `loaderFile`.
  No conflict with the atomic-design tiers (those are under `src/components/`).
- `netlify.toml` at repo root is the canonical location; it is tracked (the root is the Next source —
  see `.gitignore` note at `.gitignore:57`, only the archived Gatsby outputs and `/.next`, `/out` are
  ignored).
- All source stays TypeScript (`strict`) — the loader is `.ts`, not `.js` (AR2, ADR 0005).

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.7] — ACs, the four Given/When/Then blocks.
- [Source: _bmad-output/planning-artifacts/epics.md#Additional Requirements] — AR4 (SSG export), AR5
  (Path A + Netlify Image CDN loader), AR6 (preview-then-cutover), AR13 (tooling/no fabricated tests).
- [Source: docs/decisions/0003-netlify-deploy-path-a-static-export.md] — Path A decision; "loader
  implemented in Story 1.7"; no functions, no host migration.
- [Source: docs/decisions/0008-build-against-latest-lts-node.md] + `.node-version` — build Node version.
- [Source: _bmad-output/planning-artifacts/prds/prd-project-theseus-2026-06-10/addendum.md#hosting]
  — hosting row (Path A, deploy-on-commit preserved, no functions); risk row "Netlify deploy config
  drift" → mitigation = auto-detect Next, keep GitHub→`main` hook, verify a preview before cutover.
- [Source: _bmad-output/implementation-artifacts/1-6-…analytics.md#Completion Notes] — GA live-firing
  "verified on the Story 1.7 Netlify preview"; `metadataBase` is absolute (preview-OG caveat).
- [Source: _bmad-output/implementation-artifacts/deferred-work.md] — Story 1.1 husky item (closed
  here); Story 1.6 `metadataBase` preview-OG item (left deferred).
- [Source: _bmad-output/project-context.md] — JS/TS rules, Prettier law, no-comments default, static
  deploy context (note: that file still describes the **archive** Gatsby stack; this story is part of
  the Next.js replacement — follow the Theseus artifacts above where they diverge).

### Latest tech information (web-researched, June 2026)

- **Static export + custom loader is the canonical Path-A combo.** `output: 'export'` disables the
  built-in optimiser; the documented fix is a third-party/custom loader via
  `images: { loader: 'custom', loaderFile: './…' }`. The loaderFile must default-export
  `({ src, width, quality }) => string`. ([Next.js Static Exports guide](https://nextjs.org/docs/pages/guides/static-exports), [next.config images](https://nextjs.org/docs/pages/api-reference/config/next-config-js/images))
- **Netlify Image CDN endpoint** is `/.netlify/images?url=…&w=…&q=…`, available to any Netlify site —
  this is exactly the URL the loader must emit (AR5). On Netlify, `next/image` is otherwise auto-wired
  to the Image CDN; for pure static export we emit the URL ourselves via the custom loader. ([Netlify Image CDN](https://docs.netlify.com/image-cdn/overview/))
- **Netlify + `output: 'export'`** → Netlify treats the app as fully static; set `publish = "out"` and
  let the Next runtime auto-detect (it emits no functions in export mode). ([Netlify Next.js docs](https://docs.netlify.com/frameworks/next-js/overview/))
- **husky in CI:** `HUSKY=0` disables hook installation during the build install step — the recommended
  way to stop `prepare: "husky"` from interfering on CI/build images. ([husky how-to](https://typicode.github.io/husky/how-to.html))

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
