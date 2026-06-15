# 0013 — Root-layout identity: fonts, metadata defaults, analytics

- **Status:** Accepted
- **Date:** 2026-06-15
- **Decider:** Zac (We Right Code)
- **Tags:** theseus, fonts, seo, analytics

## Context

Story 1.6 ports the root-layout "identity" layer off the Gatsby plugin stack: the typefaces,
the site-wide SEO/OG/Twitter/favicon defaults, and analytics. In the archive these lived across
`gatsby-config.js` (`siteMetadata`, `gatsby-plugin-google-fonts`, `gatsby-plugin-google-gtag`)
and `seo.js` (`react-helmet`). The migration is idiomatic-Next, not a literal port (see
[0004](0004-remove-styled-components.md) for the equivalent stance on styling), so each
replacement is a deliberate, recorded call. This is the last foundation-wiring story before the
Netlify preview ([1.7](0003-netlify-deploy-path-a-static-export.md)).

## Decision

- **Fonts → `next/font/google`.** Permanent Marker and Roboto `400` are self-hosted at build time
  (replacing the render-blocking `gatsby-plugin-google-fonts` external `<link>`). Each is registered
  as a CSS-variable font (`--font-roboto`, `--font-permanent-marker`) on `<html>`, then bridged to
  Tailwind v4 via `@theme` tokens in `globals.css`: `--font-sans` → Roboto (default body face) and
  `--font-fancy-heading` → Permanent Marker (generates the `font-fancy-heading` utility the archive
  `heading.js` consumes, ported in Epic 3). The unlayered `body` rule is repointed from `Arial` to
  `var(--font-sans)`. `next/font`'s auto `size-adjust` fallback removes CLS — no hand-tuning.
- **Metadata → Next Metadata API.** Site-wide defaults set via the exported `metadata` object in the
  root `layout.tsx`, replacing `react-helmet` / `gatsby-plugin-react-helmet`: `metadataBase`
  (`https://zackerthehacker.com`, so relative image paths resolve absolute), `title.default` +
  `title.template`, `description`, and the Open Graph + Twitter (`summary_large_image`) defaults — all
  verbatim from the archive. No `react-helmet` anywhere.
- **Favicon → App Router `icon.svg` file convention.** The archive `hat-wizard-solid.svg` is placed at
  `src/app/icon.svg` (Next auto-emits the `<link rel="icon">`); the `create-next-app` placeholder
  `favicon.ico` is deleted so the wizard hat is the sole favicon. Chosen over reproducing the archive's
  exact `/images/hat-wizard-solid.svg` URL — the visible favicon is identical; only the (invisible) URL
  differs.
- **OG default image brought in now.** `zac-portrait.jpg` is copied to `public/images/zac-portrait.jpg`
  so the OG/Twitter default card image resolves from this story onward. A deliberate one-asset
  anticipation of the bulk `static/` → `public/` relocation (AR10); the **rendered** sidebar portrait
  (via `next/image`) and all other assets still move with their consumers in Epic 2-3.
- **Analytics → `@next/third-parties`.** `<GoogleAnalytics gaId="G-F98QXJC4S0" />` (same measurement ID
  as today) rendered inside `<body>`, replacing `gatsby-plugin-google-gtag`. It injects its `gtag`
  script client-side, so it works under `output: 'export'` with no serverless functions, and is
  import-safe from a Server Component.

## Consequences

- The root `layout.tsx` stays a Server Component; the Story 1.5 client boundaries (`<Providers>`,
  `<ThemeToggle/>`, `suppressHydrationWarning`, FontAwesome `config.autoAddCss = false`) are untouched.
  `@next/third-parties` is the only new dependency (versioned in lockstep with `next`); `next/font`
  ships with Next.
- **`title.default` is an idiomatic-Next improvement, not a literal port.** `react-helmet`'s
  `titleTemplate` was applied to _every_ title including the default, so an archive page with no title
  would have rendered the doubled `Zac Braddy - CV website - Zac Braddy`. Next applies `title.template`
  to **child** titles only and emits `title.default` as-is, giving the intended single
  `Zac Braddy - CV website`. We match the archive config's **intent**, not its accidental doubled
  output (consistent with the Theseus build-Next-native protocol).
- **Scope:** root **defaults** only. Per-page metadata/titles are Epic 3; the `next/image` loader and
  bulk asset relocation are Story 1.7 / Epic 2-3. The `next/font/google` build-time fetch (offline/
  air-gapped builds) remains deferred to Story 1.7 — not "fixed" here with `next/font/local`.
- Verification was build + emitted-HTML inspection + compiled-CSS inspection (no test framework exists;
  none fabricated). GA live-firing is confirmed on the 1.7 Netlify preview; the per-tier typography
  visual diff is the Story 4.1 gate.

Cross-references: [0003](0003-netlify-deploy-path-a-static-export.md) (static export — analytics/fonts
stay client-side under Path A), [0004](0004-remove-styled-components.md) (completes the head/identity
port off the Gatsby plugin stack), [0009](0009-tailwind-v4-border-ring-divide-guard.md) /
[0010](0010-css-variable-theming-token-system.md) (the Tailwind v4 guard + colour tokens this story
left untouched — font tokens only).

## Alternatives considered

- **`next/font/local`** — rejected for now; the decided AR11 approach is `next/font/google`, and the
  offline-build concern is Story 1.7's call.
- **Archive's exact `/images/hat-wizard-solid.svg` favicon URL** — rejected for the idiomatic
  `icon.svg` file convention; visible result is identical.
- **`metadata.icons` for the favicon** — not used, to avoid a competing/duplicate `<link>` alongside
  the file-convention emission.
