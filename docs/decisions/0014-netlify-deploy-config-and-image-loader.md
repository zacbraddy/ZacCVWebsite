# 0014 — Netlify deploy config and custom `next/image` loader

- **Status:** Accepted
- **Date:** 2026-06-15
- **Decider:** Zac (We Right Code)
- **Tags:** theseus, deploy, netlify, images, build

## Context

ADR [0003](0003-netlify-deploy-path-a-static-export.md) chose Netlify deploy Path A (static
export, no functions, no host migration) but deliberately left the implementation-level calls
open — "loader implemented in Story 1.7". Story 1.7 is the pre-UI deploy checkpoint: it wires
the few pieces that only matter at deploy time and proves them on a Netlify preview before any
UI exists. Static export (`output: 'export'`) disables Next's built-in image optimiser, which
forces the central question: do we add a backend to our deploy just to serve optimised images, or
keep the deploy purely static and let managed infrastructure do the optimisation? Netlify's build
install step also trips over the `husky` prepare hook; and the build's Node version and publish
directory must be pinned deterministically.

## Decision

- **No image backend in our deploy — point at Netlify's managed Image CDN with a URL.** The image
  optimisation still happens; it just runs on **Netlify's managed Image CDN** (request-time resize /
  optimise / cache), not in any compute we own, deploy, or maintain. Our `src/image-loader.ts` is
  therefore not an optimiser but a **URL builder**: a typed `({ src, width, quality }) => string`
  default export that emits `/.netlify/images?url=<encoded-src>&w=<width>&q=<quality||75>`, built with
  `URLSearchParams` for unambiguous encoding, and wired via
  `images: { loader: 'custom', loaderFile: './src/image-loader.ts' }` in `next.config.ts`. The
  alternative — Next's normal image optimisation via the Netlify Next runtime — would bundle an
  **image function** into our deploy, i.e. a backend we own purely to serve images, which directly
  violates Path A's zero-functions contract. A custom loader also **replaces** the default optimiser,
  which is what makes `next/image` legal under `output: 'export'` (so **no `images.unoptimized`
  flag**). The fact that it's ~5 lines of stable glue (no plugin package, no maintained dependency) is
  a welcome consequence, not the primary reason — the primary reason is keeping the deploy purely
  static with no backend of our own.
- **Let Netlify auto-detect Next; rely on export mode for zero functions.** `netlify.toml` sets
  `[build] command = "next build"`, `publish = "out"`, and does **not** force a "static" framework
  or otherwise suppress Next detection. Under `output: 'export'` the Next runtime emits a
  static-only deploy with zero functions, so "auto-detect Next" and "no functions" are not in
  conflict — suppressing detection (as some guides suggest) would be the wrong move.
- **`HUSKY = "0"` in `[build.environment]`** neutralises the `prepare: "husky"` hook during the
  Netlify install step, instead of editing the `prepare` script — local developer hooks keep
  working untouched. This resolves the Story 1.1 deferred husky item.
- **`.node-version` (`v24.16.0`, ADR [0008](0008-build-against-latest-lts-node.md)) is the single
  source of truth** for the build Node version. `NODE_VERSION` is **not** duplicated into
  `netlify.toml` unless a preview build proves Netlify ignores `.node-version`.
- **Preview, not production.** This config lives on the `project-theseus` branch and governs
  branch/PR-preview builds only. `main` stays on the live Gatsby build; promoting this to
  production is the Epic 4 cutover (Story 4.2).

## Consequences

- `next/image` works under static export with images routed through the Netlify Image CDN;
  verified locally — `out/` is pure static (no `out/_next/server`, no functions) and
  `out/index.html` emits `/.netlify/images?url=…&w=…&q=…` `src`/`srcSet` values.
- The skeleton's only images are SVGs (passed through by the optimiser), so this is a
  loader-**wiring** smoke test; the Image CDN's raster optimisation gets its real workout on the
  portrait/content images in Epics 2–3.
- A green Netlify preview deploy (the human-in-the-loop checkpoint) is the remaining
  verification — confirming Next auto-detection, Node 24 resolution, no bundled functions, themed
  render + toggle + persistence + fonts, and GA firing live.
- Known accepted limitation carried into the preview: `metadataBase` hardcodes the production
  host (Story 1.6), so the preview emits production-host OG image URLs. Left deferred; no AC
  covers preview social-card correctness.
- **Amended by ADR [0017](0017-desktop-sidebar-identity-portrait-socials-config.md) §7
  (2026-06-16):** the loader now short-circuits under `NODE_ENV=development` to return the plain
  `public/` path so real rasters (the Story 2.3 portrait) render under `next dev`; production
  builds are unchanged (still emit `/.netlify/images?…`).

## Alternatives considered

- **`images.unoptimized: true`** — rejected: it ships unoptimised images and forfeits the Netlify
  Image CDN; a custom loader is the canonical Path-A combo and makes `unoptimized` redundant
  (the two together are contradictory).
- **Next's built-in optimisation via the Netlify Next runtime (`@netlify/plugin-nextjs`)** — rejected:
  it serves images by bundling an **image function** into the deploy — a backend we'd own just to load
  images — which reintroduces exactly the functions Path A exists to avoid (AC1). It is not a
  like-for-like dependency we declined to save maintenance; it is architecturally incompatible with a
  zero-functions static export. (That it would also add a dependency is secondary.)
- **Forcing `framework = "#static"` in `netlify.toml`** — rejected: it would suppress Next
  auto-detection (violating the AC4 intent); export mode already yields zero functions.
- **Editing the `prepare` script / removing husky** — rejected: it would disable local
  developer hooks; `HUSKY=0` scopes the fix to the build environment only.
