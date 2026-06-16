# 0017 — Desktop sidebar identity block: portrait, socials, job-title config

- **Status:** Accepted
- **Date:** 2026-06-16
- **Decider:** Zac (We Right Code)
- **Tags:** theseus, sidebar, images, dependencies

## Context

Story 2.3 builds row 1 of the sidebar grid — the identity block (portrait, name, job
title, socials) — above the shared `<nav>` mounted in 2.2. Porting it forced several
non-obvious calls: a new runtime dependency for the brand marks, the substantive
`GatsbyImage` → `next/image` swap through the Netlify loader, recreating the archive's
`config.JOB_TITLE` call surface, and the first real render of the `border-inverse` token —
which surfaced a light-theme parity discrepancy. An unanticipated import-name collision in
`layout.tsx` also had to be resolved.

## Decision

1. **Add `@fortawesome/free-brands-svg-icons` (`^7.2.0`).** The Twitter/LinkedIn/GitHub
   marks are _brand_ icons and live only in this package — they are absent from the
   already-installed `free-solid`/`free-regular` suites (verified in `node_modules`). It is
   the canonical, non-substitutable FA source and is pinned to `^7.2.0` to stay aligned with
   the rest of the FA suite (ADR 0012). This is the first justified new runtime dependency
   since the FA introduction.

2. **Portrait: `GatsbyImage` + `useStaticQuery` → `next/image`.** The archive built the
   image at GraphQL build time (`gatsbyImageData(width: 300, layout: CONSTRAINED)`). The
   idiomatic-Next replacement sources `/images/zac-portrait.jpg` directly from `public/`
   (no data layer — AR9) and uses `next/image` with `fill` + `object-cover` +
   `sizes="(min-width: 768px) 192px, 128px"`. `fill`+`object-cover` reproduces
   CONSTRAINED+fill-the-circle; `sizes` tells the Netlify loader the real rendered widths
   (128/192px) so it does not over-fetch. CLS (AR17) is controlled by the fixed-size
   container (`w-32 h-32 md:w-48 md:h-48`), which reserves the box before load.
   **Local-dev caveat:** the custom Netlify loader (ADR 0014) emits
   `/.netlify/images?url=…` URLs; that CDN endpoint does not exist under `next dev` or a
   locally-served `out/`, so the photo renders broken locally while box/border/circle/
   shadow/reserved-space are correct. The actual photo pixels verify on a Netlify preview or
   at the Story 4.1 gate.

3. **`src/config/index.ts` with `JOB_TITLE`.** Ports `archive/src/config/index.js` (the
   config-indirection deferred from 2.2, AR9) as a default-export object (`as const` for
   literal narrowing) so the consumer reads `config.JOB_TITLE` exactly as the archive call
   site did. Kept minimal — only `JOB_TITLE`; the Home-page rotating-title list is Story
   3.1's concern.

4. **`border-inverse` light-theme parity discrepancy — flagged, not silently fixed.** This
   story is the first place `border-inverse` renders. Dark (`:root`) is `fafafa` (no `#`,
   intentionally invalid → falls back to `currentColor` ≈ near-white) — a verbatim archive
   quirk recorded in ADR 0010, correct as-is. Light (`.light`) is `#5a5a5a` (valid, set in
   Story 1.4) and so renders solid `#5a5a5a`, whereas the **archive** light value is
   `'5a5a5a'` (no `#`, invalid → `currentColor` ≈ `#333`). So the archive light portrait
   border is ≈`#333` while Theseus renders `#5a5a5a` — a subtle but real difference
   introduced when 1.4 added a `#` to the light value but not the dark one. **Not changed
   here** (that re-opens 1.4's token work); recorded as a known parity question for the
   Story 4.1 visual-diff gate, where the live site is the arbiter. The clean fix _if_
   elevated is to make light match the archive's `currentColor` outcome (drop the `#`, or
   set `#333`) — a conscious parity call, not a port detail.

5. **`alt="Zac Braddy"` on the portrait.** `next/image` requires `alt`; the archive
   `<GatsbyImage>` passed none (effectively `alt=""`). The photo is content, not decoration,
   so `alt="Zac Braddy"` is the better call — a conscious, visual-diff-invisible a11y
   addition consistent with the state-aware aria-label call in Story 1.5.

6. **Resolved an import-name collision in `layout.tsx`.** `layout.tsx` (from 1.6) already
   imports `config` from `@fortawesome/fontawesome-svg-core` for `config.autoAddCss = false`.
   Adding `import config from '@/config'` collided (build error: "the name `config` is
   defined multiple times"). Resolved by aliasing the FA import to `faConfig`
   (`import { config as faConfig }` → `faConfig.autoAddCss = false`), which preserves the
   archive's `config.JOB_TITLE` call surface verbatim in the identity markup. The FA
   `config` is a Theseus-only addition with no parity content, so renaming it has zero
   parity impact.

7. **Env-aware image loader so the portrait renders under `next dev`.** This is the first real
   raster routed through the custom Netlify loader (ADR 0014), which surfaced that the loader's
   `/.netlify/images?…` URLs 404 locally (the Netlify Image CDN only exists on Netlify), so the
   photo showed broken under `next dev`. `src/image-loader.ts` now short-circuits in development —
   `if (process.env.NODE_ENV === 'development') return src;` — returning the plain `public/`
   path, which `next dev` serves directly. `next build` (local or on Netlify) is `NODE_ENV=production`,
   so it still emits the Netlify CDN URLs verbatim — **production output is unchanged and
   parity-safe** (verified: `out/index.html` still emits `/.netlify/images?…`, no raw `/images/`
   `src` leaks into the export). The only local trade-off is that the dev image is the
   unoptimised original — irrelevant for a 46KB asset in dev only. This amends ADR 0014's
   "URL builder" loader with a dev branch; it does **not** address the 1.7 deferred robustness
   gaps (remote/pre-encoded/out-of-range inputs), which remain open and still don't apply here.

## Consequences

- `PortraitImage` and `Socials` are Server Components (no interactivity); `layout.tsx` stays
  a Server Component and keeps its `metadata` export. Client surfaces remain at the leaves
  (theme toggle, nav item) per AR14.
- Mobile now gains a visible portrait header (the portrait is not `lg`-gated in the archive;
  the negative-margin CSS module pulls the content pane up to overlap it). This is correct
  parity, not a scope leak; the mobile burger trigger is the only mobile chrome still missing
  (Story 2.4).
- `w-68` resolves to `17rem` under Tailwind v4's dynamic spacing
  (`calc(var(--spacing) * 68)`, default `--spacing: 0.25rem`) — identical to the archive's
  custom token, so no `@theme` spacing token was added. Caveat for later tiers: the archive's
  custom scale was non-linear in places (e.g. `87: '23rem'` vs v4's `21.75rem`), so Epic 3
  ports may need explicit tokens — none affect this story.
- The Story 4.1 visual-diff gate carries two deferred pixel checks: the portrait photo
  (Netlify-loader local caveat) and the `border-inverse` light-theme border (item 4).

## Alternatives considered

- **`alt=""` for strict parity** — defensible, but the photo is content not decoration, so
  the descriptive alt is the better a11y call.
- **Rename the site `config` import instead of the FA one** — rejected: the archive call site
  is `config.JOB_TITLE`, so aliasing the parity-irrelevant FA import keeps the documented
  markup verbatim.
- **Silently correct the light `border-inverse` value** — rejected: re-opens Story 1.4's
  token work and pre-empts the 4.1 visual-diff arbiter; flagged instead.
