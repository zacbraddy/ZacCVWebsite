---
baseline_commit: 475bb1bbd56abb3ca28fdfeb54a5257626ab37fe
---

# Story 1.6: Root layout wiring — fonts, SEO metadata defaults, analytics

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a site visitor and search/social crawler,
I want the correct fonts, baseline page metadata, and analytics active on every route,
so that the site looks, indexes, and measures exactly as it does today.

## Acceptance Criteria

1. **Self-hosted fonts at parity, no layout shift (FR20, AR11).**
   **Given** `next/font/google`,
   **When** fonts are configured in the root layout,
   **Then** **Permanent Marker** (fancy headings) and **Roboto `400`** (body) are self-hosted via `next/font` (no external Google Fonts `<link>`, replacing the old `gatsby-plugin-google-fonts`),
   **And** each is registered as a CSS-variable font (`variable: '--font-...'`) and the variable classes are applied to `<html>`,
   **And** the auto-generated `size-adjust` fallback metrics mean no Cumulative Layout Shift on first paint,
   **And** the leftover `create-next-app` `Geist` / `Geist_Mono` fonts are removed entirely (no dead font imports remain — NFR6).

2. **Body renders in Roboto; the fancy-heading token renders in Permanent Marker (FR20, parity).**
   **Given** the Tailwind v4 CSS-first config,
   **When** the font tokens are registered,
   **Then** `--font-sans` resolves to the Roboto variable (so the default body font is Roboto, matching the archive's `fontFamily.sans = ['Roboto', …]`),
   **And** a `--font-fancy-heading` theme token resolves to the Permanent Marker variable (generating the `font-fancy-heading` utility the archive `heading.js` uses, matching `fontFamily['fancy-heading'] = ["'Permanent Marker'", …]`),
   **And** the current placeholder `body { font-family: Arial, Helvetica, sans-serif; }` rule in `globals.css` is updated to the Roboto stack,
   **And** both font stacks retain the archive's default sans fallbacks after the primary face.

3. **Metadata API root defaults, no `react-helmet` (FR17 defaults).**
   **Given** the Next Metadata API in the root `layout.tsx`,
   **When** the site-wide defaults are set via the exported `metadata` object,
   **Then** the title uses `{ default: 'Zac Braddy - CV website', template: '%s - Zac Braddy' }`,
   **And** the default `description` is the archive string verbatim ("This guy codes. Like really! Also he's friendly, a solid architect and mentor to boot. Why not see what else he can do on his CV website?"),
   **And** `metadataBase` is set to `https://zackerthehacker.com` so relative asset URLs resolve absolute (parity with the archive's `${siteUrl}${image}` construction),
   **And** **no** `react-helmet` (or `<Helmet>`) is used anywhere (FR17, FR23).

4. **Open Graph + Twitter card defaults at parity (FR17 defaults).**
   **Given** the metadata defaults,
   **When** Open Graph and Twitter tags are emitted,
   **Then** Open Graph defaults are set — `og:title`, `og:description`, `og:url` (`https://zackerthehacker.com`), `og:image` (`/images/zac-portrait.jpg`), and `og:type` `website`,
   **And** the Twitter card is `summary_large_image` with `twitter:creator` `@zackerthehacker`, `twitter:title`, `twitter:description`, and `twitter:image` (`/images/zac-portrait.jpg`),
   **And** these mirror the archive `seo.js` defaults (the per-page title/description/image **overrides** are Epic 3, not this story).

5. **Wizard-hat favicon via the App Router `icon` file convention (FR17).**
   **Given** the App Router icon file convention,
   **When** the favicon is wired,
   **Then** the archive `hat-wizard-solid.svg` is placed at `src/app/icon.svg`, and Next auto-emits the `<link rel="icon" …>` (visible favicon identical to today),
   **And** the leftover `create-next-app` placeholder `src/app/favicon.ico` (the Next.js-logo icon) is **deleted** so the wizard hat is the only favicon,
   **And** the OG/Twitter default image asset `zac-portrait.jpg` is copied to `public/images/zac-portrait.jpg` so the `/images/zac-portrait.jpg` reference in AC4 resolves (decision recorded with Zac, 2026-06-15).

6. **Analytics wired via `@next/third-parties` (FR19).**
   **Given** `@next/third-parties`,
   **When** analytics is wired in the root layout,
   **Then** `<GoogleAnalytics gaId="G-F98QXJC4S0" />` (from `@next/third-parties/google`) is rendered inside `<body>` and present in the emitted static HTML,
   **And** it is the **same** `gtag` measurement ID as today (`G-F98QXJC4S0`, from `archive/gatsby-config.js`), replacing `gatsby-plugin-google-gtag`,
   **And** under `output: 'export'` it injects its client-side script with no serverless functions added (the live-firing confirmation on the deployed preview is Story 1.7 / FR19).

7. **Layout stays a Server Component; surgical edits only (NFR5, AR12, AR14).**
   **Given** the idiomatic-Next boundary discipline,
   **When** the layout is wired,
   **Then** `src/app/layout.tsx` remains a Server Component (no `'use client'` at module level), and the Story 1.5 client boundaries (`<Providers>` wrap, `<ThemeToggle/>`, `suppressHydrationWarning` on `<html>`, the FontAwesome `config.autoAddCss = false` + `styles.css` import) are **preserved unchanged**,
   **And** the only `<html>` `className` change is swapping the two Geist font variables for the two new font variables,
   **And** `@next/third-parties`' `GoogleAnalytics` is a Server-Component-friendly import (no extra `'use client'` boundary is introduced).

8. **Scope discipline (NFR6) — fonts + metadata defaults + analytics only.**
   **Given** the anti-gold-plating guardrail,
   **When** this story is delivered,
   **Then** the work is limited to: the two `next/font` faces + their Tailwind v4 tokens + the body-font line, the root `metadata` defaults (title template, description, OG, Twitter, favicon), the favicon `icon.svg` + the one OG image asset, and the `@next/third-parties` analytics tag. It does **NOT**: add **per-page** metadata/titles (**Epic 3**), configure the `next/image` loader or relocate the bulk `static/` assets — the CV PDF, content images, the rendered sidebar portrait (**Story 1.7 loader; Epic 2-3 assets/`next/image`**), build any layout shell / sidebar / nav / page (**Epic 2-3**), or change the theming/`globals.css` colour tokens (**done in 1.4/1.5**),
   **And** it adds exactly **one** new dependency: `@next/third-parties` (`next/font` ships with Next; no install). No other dependency is introduced.

9. **Decision capture as-you-go (FR26 / AR19).**
   **Given** the cross-cutting decision-capture DoD,
   **When** this story's non-obvious calls are made,
   **Then** they are recorded as **ADR 0013** before the story is done: fonts via `next/font` (Permanent Marker + Roboto:400) replacing `gatsby-plugin-google-fonts`; the Metadata-API root defaults replacing `react-helmet`/`gatsby-plugin-react-helmet`; the favicon `icon.svg` file-convention call (vs the archive's exact `/images/…` URL); bringing `zac-portrait.jpg` in now for the OG default; analytics via `@next/third-parties` replacing `gatsby-plugin-google-gtag`; and the idiomatic-Next `title.default` behaviour note (AC see Dev Notes → "Title default — an idiomatic-Next nuance"),
   **And** the `docs/decisions/README.md` index table is updated, base-usable standard, no public polish (that is Ariadne).

## Tasks / Subtasks

- [ ] **Task 1 — Read the parity sources of truth before editing (AC: 1, 2, 3, 4, 5, 6)**

  - [ ] Read `archive/gatsby-config.js` end to end — the **authoritative metadata + fonts + analytics reference**. Note verbatim: `siteMetadata` (`title`, `titleTemplate: '%s - Zac Braddy'`, `description`, `url: 'https://zackerthehacker.com'`, `image: '/images/zac-portrait.jpg'`, `twitterUsername: '@zackerthehacker'`, `author`); `gatsby-plugin-google-fonts` fonts `['Permanent Marker', 'Roboto:400']`; `gatsby-plugin-google-gtag` trackingId `G-F98QXJC4S0`.
  - [ ] Read `archive/src/components/seo.js` — the **authoritative head/tag reference**: `description`, `image` (absolute via `${siteUrl}${image}`), `og:url/type/title/description/image`, `twitter:card=summary_large_image`, `twitter:creator/title/description/image`, and `<link rel="icon" type="image/svg" href="/images/hat-wizard-solid.svg" />`. (The per-page `title`/`description`/`image` props are Epic 3 overrides — this story only ports the **defaults**.)
  - [ ] Read `archive/tailwind.config.js` — confirm the font mapping to reproduce: `fontFamily.sans = ['Roboto', ...defaultTheme.fontFamily.sans]` and `fontFamily['fancy-heading'] = ["'Permanent Marker'", ...defaultTheme.fontFamily.sans]`. The `font-fancy-heading` utility is used by `archive/src/components/atoms/heading.js`.
  - [ ] Re-read the current `src/app/layout.tsx` (post Story 1.5): a Server Component importing `Geist`/`Geist_Mono`, exporting a minimal `metadata`, with `suppressHydrationWarning` on `<html>`, the `<Providers>` wrap, `<ThemeToggle/>`, and the FontAwesome `config.autoAddCss = false` + `import '@fortawesome/fontawesome-svg-core/styles.css'`. **You replace the fonts and expand `metadata`; you leave the 1.5 boundaries intact** (AC7).
  - [ ] Re-read the current `src/app/globals.css` — note `@theme { --breakpoint-xs: 410px; }` (where you add the font tokens) and the unlayered `body { … font-family: Arial, Helvetica, sans-serif; … }` rule (the line you update). Do **not** touch the colour `--color-*` tokens or the border guard `@layer base { … var(--color-gray-200, currentColor) }` (1.4/ADR 0009 — see Dev Notes → "Tailwind v4 guard — don't disturb it").
  - [ ] Confirm the assets exist to copy: `archive/static/images/hat-wizard-solid.svg` and `archive/static/images/zac-portrait.jpg`. `archive/` is **read-only** parity reference (ADR 0006) — **copy** from it, never edit/build it.

- [ ] **Task 2 — Install the analytics dependency (AC: 6, 8)**

  - [ ] `npm install @next/third-parties` (match the Next `16.2.9` line — `@next/third-parties` is versioned in lockstep with `next`). This is the decided analytics mechanism (FR19 / AR-research: "`@next/third-parties`"), not a casual add.
  - [ ] Confirm it lands in `dependencies` (runtime), and that **no** other dependency is added (`next/font` is part of `next`; fonts need no install) (AC8).

- [ ] **Task 3 — Wire the two self-hosted fonts (AC: 1, 2, 7)**

  - [ ] In `src/app/layout.tsx`, replace the `Geist`/`Geist_Mono` imports with `import { Permanent_Marker, Roboto } from 'next/font/google';`.
  - [ ] Create the two font instances at module scope:
    - `const roboto = Roboto({ weight: '400', subsets: ['latin'], variable: '--font-roboto', display: 'swap' });`
    - `const permanentMarker = Permanent_Marker({ weight: '400', subsets: ['latin'], variable: '--font-permanent-marker', display: 'swap' });`
    - (Both faces are single-weight `400` to match `Roboto:400` + Permanent Marker — `next/font` requires an explicit `weight` for non-variable Google faces. `display: 'swap'` is `next/font`'s default; stating it is fine.)
  - [ ] Update the `<html>` `className` to apply **both** new variables — `className={`${roboto.variable} ${permanentMarker.variable}`}` — replacing the two Geist variables (AC7: this is the only `className` change).
  - [ ] Remove every trace of `Geist`/`Geist_Mono` (imports + instances + the `--font-geist-*` variables) — no dead font code (AC1, NFR6).

- [ ] **Task 4 — Register the Tailwind v4 font tokens + the body font (AC: 2)**

  - [ ] In `src/app/globals.css`, inside the existing `@theme { … }` block (next to `--breakpoint-xs`), add:
    - `--font-sans: var(--font-roboto), ui-sans-serif, system-ui, sans-serif;` (or the archive default-sans tail — keep a sensible system fallback after Roboto). This makes Roboto the default body/`font-sans` face (Tailwind v4 preflight maps `--default-font-family` → `--font-sans`).
    - `--font-fancy-heading: var(--font-permanent-marker), ui-sans-serif, system-ui, sans-serif;` (generates the `font-fancy-heading` utility for the archive `heading.js` port in Epic 3).
  - [ ] Update the unlayered `body` rule: change `font-family: Arial, Helvetica, sans-serif;` → `font-family: var(--font-sans);` (this unlayered rule outranks utilities, so set it explicitly for parity — see the Story 1.4 deferred note about unlayered `body`/`html` rules).
  - [ ] Do **not** add/remove/alter any `--color-*` token, `@utility` colour class, or the `@layer base` border guard (1.4/ADR 0009 territory) (AC8).

- [ ] **Task 5 — Set the Metadata API root defaults (AC: 3, 4, 5)**

  - [ ] In `src/app/layout.tsx`, expand the exported `metadata: Metadata` to the site-wide defaults (values verbatim from `archive/gatsby-config.js` + `seo.js`):
    - `metadataBase: new URL('https://zackerthehacker.com')`
    - `title: { default: 'Zac Braddy - CV website', template: '%s - Zac Braddy' }`
    - `description: "This guy codes. Like really! Also he's friendly, a solid architect and mentor to boot. Why not see what else he can do on his CV website?"`
    - `openGraph: { title: 'Zac Braddy - CV website', description: <same>, url: 'https://zackerthehacker.com', images: ['/images/zac-portrait.jpg'], type: 'website' }`
    - `twitter: { card: 'summary_large_image', creator: '@zackerthehacker', title: 'Zac Braddy - CV website', description: <same>, images: ['/images/zac-portrait.jpg'] }`
  - [ ] Do **not** set per-page titles/descriptions/images here (Epic 3, AC8). Do **not** introduce `react-helmet` (AC3).
  - [ ] Leave the favicon to the file convention (Task 6) — do **not** also add `metadata.icons` for it (avoid a duplicate/competing `<link>`); the archive's lone icon was the wizard hat.

- [ ] **Task 6 — Bring the favicon + OG image assets across (AC: 5)**

  - [ ] Copy `archive/static/images/hat-wizard-solid.svg` → `src/app/icon.svg` (App Router icon convention — Next emits the `<link rel="icon">` automatically). Decision confirmed with Zac (2026-06-15): idiomatic `icon.svg`, not the archive's exact `/images/hat-wizard-solid.svg` URL.
  - [ ] **Delete** the placeholder `src/app/favicon.ico` (the `create-next-app` Next-logo icon) so the wizard hat is the only favicon (AC5).
  - [ ] Copy `archive/static/images/zac-portrait.jpg` → `public/images/zac-portrait.jpg` so the OG/Twitter default image (AC4) resolves at `/images/zac-portrait.jpg`. Decision confirmed with Zac (2026-06-15): bring this one asset in now for full FR17 default parity; the **rendered** portrait (sidebar, via `next/image`) and the bulk asset relocation remain Epic 2 / AR10.

- [ ] **Task 7 — Wire analytics (AC: 6, 7)**

  - [ ] In `src/app/layout.tsx`, `import { GoogleAnalytics } from '@next/third-parties/google';` and render `<GoogleAnalytics gaId="G-F98QXJC4S0" />` inside `<body>` (e.g. as the last child of `<body>`, sibling to the `<Providers>` tree). It does not need to sit inside `<Providers>`.
  - [ ] Keep `layout.tsx` a Server Component — `@next/third-parties`' `GoogleAnalytics` is import-safe from a Server Component and adds no `'use client'` boundary (AC7).

- [ ] **Task 8 — Verify (AC: all)**

  - [ ] `npm run build` — green; static export to `out/` intact (no `out/_next/server`; still pure `output: 'export'`). Confirm in the emitted `out/index.html`:
    - the self-hosted font CSS is bundled (no `fonts.googleapis.com` `<link>`), and `<html>` carries both font-variable classes (AC1);
    - `<title>Zac Braddy - CV website</title>`, the `description`, OG (`og:title/description/url/image/type`), and Twitter (`twitter:card=summary_large_image`, `creator`, `title`, `description`, `image`) meta tags are present with the archive values (AC3, AC4);
    - `<link rel="icon" href="/icon.svg…">` is present and **no** `favicon.ico` Next-logo link remains (AC5);
    - the GA script for `G-F98QXJC4S0` is present (AC6).
  - [ ] `npm run dev` and manually verify against the parity bar: body text renders in **Roboto**; a `font-fancy-heading`-classed element renders in **Permanent Marker** (spot-check by temporarily applying the class in `page.tsx`, then revert — do not leave scaffolding); the wizard-hat favicon shows in the browser tab; no font flash / layout shift on load; no console errors and (preserved from 1.5) no hydration-mismatch warning. _(Boundary note: GA "fires on the deployed site" is verified on the Netlify preview in Story 1.7 / FR19; here it is verified **present in the emitted HTML**. The full per-tier side-by-side visual/typography diff is the Story 4.1 gate.)_
  - [ ] `npm run lint` — clean (no new warnings/errors). `npm run format` (or let the Husky `pretty-quick --staged` hook format on commit). Do not hand-format around Prettier.
  - [ ] **No fabricated tests** — `npm test` is an honest stub (AR13). Verification is build + static-HTML inspection + dev-server parity check. [Source: project-context.md#Testing-Rules]

- [ ] **Task 9 — Capture the as-you-go decision as an ADR (AC: 9 / FR26 / AR19)**

  - [ ] Create `docs/decisions/0013-root-layout-fonts-metadata-analytics.md` from `docs/decisions/_template.md` (Status **Accepted**, Date **2026-06-15**, Decider **Zac (We Right Code)**, Tags `theseus, fonts, seo, analytics`). Record: fonts via `next/font` (Permanent Marker + Roboto:400, self-hosted, CSS-var + Tailwind v4 `@theme` tokens) replacing `gatsby-plugin-google-fonts`; Metadata-API root defaults replacing `react-helmet`/`gatsby-plugin-react-helmet` (incl. `metadataBase`); the favicon `icon.svg` file-convention call (vs the archive's exact `/images/hat-wizard-solid.svg` URL) and deletion of the placeholder `favicon.ico`; bringing `zac-portrait.jpg` in now for the OG default (one-asset anticipation of AR10); analytics via `@next/third-parties` (`G-F98QXJC4S0`) replacing `gatsby-plugin-google-gtag`; and the idiomatic-Next `title.default` nuance (Next does not re-apply the template to the default title, unlike react-helmet — see Dev Notes). Cross-reference ADR 0003 (static export — analytics/fonts stay client-side under Path A) and ADR 0004 (SC removal — this completes the head/identity port off the Gatsby plugin stack).
  - [ ] Add the new ADR row to the `docs/decisions/README.md` index table. Keep everything base-usable, no public polish. [Source: docs/decisions/README.md#Capture-convention]

## Dev Notes

### What this story is — and is NOT

This story finishes the **root-layout identity** layer: the right typefaces on every route, the
site-wide SEO/OG/Twitter/favicon **defaults**, and analytics — all the things that used to live
across `gatsby-config.js` (`siteMetadata`, the fonts plugin, the gtag plugin) and `seo.js`
(`react-helmet`). It is the last "foundation wiring" story before Story 1.7 proves the skeleton
green on a Netlify preview. Everything here is **parity** (FR17/FR19/FR20) — there is no accepted
functional change in this story (the one project-wide accepted change, theme persistence, landed
in 1.5).

**Hard scope guards (NFR6):**

- **No per-page metadata** — only the root `metadata` **defaults**. Per-page `title`/`description`/`image`
  overrides arrive with each page in **Epic 3** (Stories 3.1–3.5 each have an FR17 metadata AC). [Source: epics.md#Epic-3]
- **No `next/image` loader and no bulk asset relocation** — the loader is **Story 1.7**; the CV PDF,
  content images, and the **rendered** sidebar portrait (via `next/image`) move with their consumers
  (**Epic 2-3**, AR10/FR21). The _only_ assets this story moves are the favicon and the one OG default
  image. [Source: epics.md#Story-1.7, #Story-2.2, #Story-2.3]
- **No `globals.css` colour changes** — 1.4 finished the `--color-*` token/palette layer and the
  border guard; this story only **adds font tokens** and updates the **body `font-family` line**. Do
  not touch colours or the guard. [Source: 1-4…md, docs/decisions/0009-…md]
- **No new layout shell / sidebar / nav / page** — Epic 2-3. This story renders no new UI; it wires
  config into the existing root layout. [Source: epics.md#Epic-2]
- **British spelling in prose/comments**; canonical identifiers stay (`color`, `font-family`). No code
  comments unless genuinely non-obvious. [Source: project-context.md#Language-Specific-Rules, #Code-Quality]

### Parity reference values (copy verbatim — from `gatsby-config.js` + `seo.js`)

| Field                              | Value                                                                                                                                       | Source                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Default title                      | `Zac Braddy - CV website`                                                                                                                   | `gatsby-config.js` `siteMetadata.title`             |
| Title template                     | `%s - Zac Braddy`                                                                                                                           | `siteMetadata.titleTemplate`                        |
| Description                        | `This guy codes. Like really! Also he's friendly, a solid architect and mentor to boot. Why not see what else he can do on his CV website?` | `siteMetadata.description`                          |
| Site URL (`metadataBase`/`og:url`) | `https://zackerthehacker.com`                                                                                                               | `siteMetadata.url`                                  |
| Default OG/Twitter image           | `/images/zac-portrait.jpg` (absolute via `metadataBase`)                                                                                    | `siteMetadata.image`, `seo.js` `${siteUrl}${image}` |
| Twitter card                       | `summary_large_image`                                                                                                                       | `seo.js`                                            |
| Twitter creator                    | `@zackerthehacker`                                                                                                                          | `siteMetadata.twitterUsername`                      |
| Favicon                            | `hat-wizard-solid.svg` (→ `src/app/icon.svg`)                                                                                               | `seo.js` `<link rel="icon">`                        |
| Fonts                              | `Permanent Marker`, `Roboto:400`                                                                                                            | `gatsby-plugin-google-fonts`                        |
| GA tracking ID                     | `G-F98QXJC4S0`                                                                                                                              | `gatsby-plugin-google-gtag`                         |

### Fonts — the `next/font` → Tailwind v4 wiring (grounds AC1/AC2)

The archive loaded fonts with `gatsby-plugin-google-fonts` (a render-blocking external `<link>`) and
mapped them in `tailwind.config.js`: `sans = ['Roboto', …]` and a `fancy-heading = ["'Permanent Marker'", …]`
extension. The idiomatic-Next replacement is `next/font/google`, which **self-hosts** the faces at build
time and emits a `size-adjust` fallback so there is no CLS (AR11 / the AC1 "no layout shift" bar — this is
automatic, not something you hand-tune).

The bridge between `next/font` and Tailwind v4's CSS-first config is the **CSS variable**: each font
instance exposes a `variable` (`--font-roboto`, `--font-permanent-marker`); you apply those variable
classes to `<html>` (in `layout.tsx`) and then point Tailwind's `@theme` font tokens at them (in
`globals.css`). `--font-sans` → Roboto makes it the default body face (Tailwind v4 preflight uses
`--font-sans` for `--default-font-family`); `--font-fancy-heading` → Permanent Marker generates the
`font-fancy-heading` utility the archive `heading.js` consumes (ported in Epic 3). The unlayered
`body { font-family: … }` rule in `globals.css` currently hardcodes `Arial` — repoint it at
`var(--font-sans)` so the explicit (utility-outranking) rule also says Roboto.

```ts
// layout.tsx (module scope)
import { Permanent_Marker, Roboto } from 'next/font/google';
const roboto = Roboto({ weight: '400', subsets: ['latin'], variable: '--font-roboto', display: 'swap' });
const permanentMarker = Permanent_Marker({ weight: '400', subsets: ['latin'], variable: '--font-permanent-marker', display: 'swap' });
// …
<html lang="en" className={`${roboto.variable} ${permanentMarker.variable}`} suppressHydrationWarning>
```

```css
/* globals.css — inside the existing @theme block */
@theme {
  --breakpoint-xs: 410px;
  --font-sans: var(--font-roboto), ui-sans-serif, system-ui, sans-serif;
  --font-fancy-heading:
    var(--font-permanent-marker), ui-sans-serif, system-ui, sans-serif;
}
/* …and the body rule: */
body {
  /* … */
  font-family: var(--font-sans); /* … */
}
```

Both faces are single-weight `400` (Roboto:400 parity; Permanent Marker is a single-weight display
face) — `next/font` requires an explicit `weight` for non-variable Google faces, so omitting it errors.

### Tailwind v4 guard — don't disturb it (NFR1 / ADR 0009)

Story 1.3/1.4 set a deliberate base-border guard (`@layer base { *,… { border-color: var(--color-gray-200, currentColor) } }`)
to defend against Tailwind v4 defaulting `border`/`ring`/`divide` to `currentColor`. Adding **font**
tokens to `@theme` does not touch colour tokens and is safe — but do **not** add a `@theme { --color-*: initial }`
reset or otherwise wipe the default palette (that is the exact regression 1.4's DoD forbids). Stay in the
font lane. [Source: docs/decisions/0009-…md, 0010-…md, 1-4…md]

### Title default — an idiomatic-Next nuance (grounds the AC3 note + ADR 0013)

`react-helmet`'s `titleTemplate="%s - Zac Braddy"` is applied to **every** title, including the default —
so an archive page with no explicit title would literally render `Zac Braddy - CV website - Zac Braddy`.
Next's Metadata API is cleaner: `title.template` is applied to **child** (per-page) titles only, while
`title.default` is emitted **as-is** for routes that set no title. So the home/default title becomes the
intended `Zac Braddy - CV website` (not the doubled string). This is an idiomatic-Next improvement that
matches the **intent** of the archive config, not its literal doubled output — call it out in ADR 0013
(consistent with the Theseus protocol of building Next-native rather than reproducing Gatsby quirks that
were not deliberate). The exact per-page titles are set in Epic 3 and diffed at Story 4.1. [Source: memory: theseus-idiomatic-next-principle]

### Analytics under static export (grounds AC6)

`@next/third-parties`' `<GoogleAnalytics gaId>` injects the `gtag` script client-side, so it works under
`output: 'export'` with no serverless functions — same delivery shape as the archive's
`gatsby-plugin-google-gtag`. Render it inside `<body>` in the root layout; it is import-safe from a Server
Component (no `'use client'` needed). "Fires on the deployed site" (FR19) is confirmed on the Netlify
**preview** in Story 1.7 and again in production at Story 4.2; this story's bar is "present in the emitted
HTML, correct ID". `@next/third-parties` versions in lockstep with `next`, so install the `16.x` line.
[Source: epics.md#FR19, #Story-1.7, #Story-4.2; docs/decisions/0003-…md (static export)]

### Favicon + OG image — the two assets that cross now (grounds AC5, decisions 2026-06-15)

- **Favicon:** copy `hat-wizard-solid.svg` → `src/app/icon.svg` (App Router file convention; Next emits the
  `<link>`), and **delete** the placeholder `src/app/favicon.ico` (the Next-logo icon `create-next-app`
  shipped) so the wizard hat is the sole favicon. This is the idiomatic-Next call (vs the archive's exact
  `/images/hat-wizard-solid.svg` URL) — the **visible** favicon is identical; only the URL differs, which
  is invisible to the NFR1 visual-diff bar. (Zac, 2026-06-15.)
- **OG default image:** copy `zac-portrait.jpg` → `public/images/zac-portrait.jpg` so the OG/Twitter
  default image resolves now, giving full FR17 default parity for social shares from this story on. This is
  a **one-asset** anticipation of AR10's bulk `static/` → `public/` relocation; the **rendered** portrait
  (sidebar, `next/image`, FR21/AR17) and every other static asset still move with their consumers in
  Epic 2-3. (Zac, 2026-06-15.) [Source: memory: theseus-coexistence-archive-model — `archive/` is copy-from-only, read-only]

### Previous Story Intelligence (Stories 1.1–1.5, all done)

- **1.5 left `layout.tsx` ready for this story.** It is a Server Component with the `next-themes`
  `<Providers>` wrap, `<ThemeToggle/>`, `suppressHydrationWarning` on `<html>`, and the FontAwesome
  App-Router config (`config.autoAddCss = false` + `styles.css` import). **Preserve all of it** — your
  edits are: swap the two Geist vars for two new font vars, expand `metadata`, add the GA tag. 1.5
  explicitly fenced fonts/metadata/analytics to **this** story. [Source: 1-5…md#Downstream-consumers, #File-List]
- **1.4 owns `globals.css` colours.** `:root`=dark, `.light`=light, all `--color-*` verbatim (incl. the
  `border-inverse` no-`#` quirk), the border guard `@layer base`. You only add **font** tokens + the body
  `font-family` line. Do not touch colours. The Story-1.4 review noted unlayered `body`/`html` rules
  outrank utilities — which is exactly why the body `font-family` must be set explicitly here. [Source: 1-4…md, deferred-work.md]
- **FontAwesome is already in (ADR 0012).** Do not re-add or reconfigure it; only `faMoon`/`faSun` are
  imported so far (more icons arrive with Epic 2 consumers). [Source: 1-5…md, docs/decisions/0012-…md]
- **Repo shape:** root-Next, `src/app/` + `src/components/atoms/` (one component so far), `next.config.ts`
  (`output: 'export'`), `.node-version v24.16.0`, Husky v9 hook **verified firing**, Prettier `^3.8.4`,
  the `format` glob covers `ts,tsx,css,md,json`. ESLint only warns (no `--max-warnings 0` gate) — known
  deferred follow-up; keep lint clean anyway. [Source: 1-1…md, 1-3…md, 1-5…md, package.json, deferred-work.md]
- **`archive/` is read-only parity reference** (ADR 0006) — copy assets from it; never edit or build it. [Source: docs/decisions/0006-…md; memory: theseus-coexistence-archive-model]
- **No test framework, none added, none fabricated** (AR13). [Source: 1-5…md#Testing-Standards]
- **Deferred items that touch this area (do NOT silently absorb):** `deferred-work.md` (Story 1.1) flags
  that `next/font/google` fetches from Google Fonts **at build time**, so offline/air-gapped builds fail —
  explicitly **deferred to Story 1.7** (build/deploy environment). This story keeps `next/font/google`
  (the decided AR11 approach); do not switch to `next/font/local` to "fix" it — that is 1.7's call if it
  ever matters. [Source: deferred-work.md#Deferred-from-story-1.1]

### Downstream consumers to be aware of (not this story's work)

- **Story 1.7** (Netlify Path A) verifies fonts + analytics actually render/fire on the **preview** deploy,
  and owns the `next/image` loader + the offline-fonts deferral. Keep your wiring clean so 1.7 just deploys it.
- **Epic 3** pages each add their **per-page** `metadata` (title/description/OG image) on top of these
  defaults, and port `heading.js` (the `font-fancy-heading` consumer).
- **Epic 2** relocates the bulk `static/` assets and renders the portrait via `next/image` (the OG copy you
  add here is independent of that rendered copy).

### Testing Standards

- **No test framework exists and none is added** (AR13). `npm test` is an honest stub — do **not** fabricate
  a run or claim tests pass. [Source: project-context.md#Testing-Rules; epics.md#AR13]
- **Verification = `npm run build` (green, static export intact) + emitted-HTML inspection + `npm run dev`
  manual parity check** (Roboto body, Permanent-Marker `font-fancy-heading`, wizard-hat favicon, the
  metadata/OG/Twitter tags, the GA script, no console/hydration warnings, no font CLS). GA live-firing is
  the Story 1.7 preview check; the per-tier side-by-side typography diff is the Story 4.1 gate. [Source: epics.md#Story-1.7, #Story-4.1; project-context.md#Manual-verification]

### Project Structure Notes

- **New:** `src/app/icon.svg` (wizard-hat favicon, file convention); `public/images/zac-portrait.jpg` (OG
  default image); `docs/decisions/0013-root-layout-fonts-metadata-analytics.md`.
- **Modified:** `src/app/layout.tsx` (fonts swap, `metadata` expansion, GA tag); `src/app/globals.css`
  (font `@theme` tokens + body `font-family` line); `package.json` / `package-lock.json` (`@next/third-parties`);
  `docs/decisions/README.md` (one index row).
- **Deleted:** `src/app/favicon.ico` (the `create-next-app` placeholder).
- **No conflict** with the atomic-design structure — all changes are App-Router root-layout infra under
  `src/app/` plus a `public/` asset; no new component tier is introduced. [Source: project-context.md#Atomic-Design]

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-1.6] — story statement + the three base ACs (fonts, metadata defaults, analytics).
- [Source: _bmad-output/planning-artifacts/epics.md#Requirements-Inventory] — FR17 (per-page SEO preserved; root title-template + OG/favicon defaults established in Epic 1), FR19 (GA `G-F98QXJC4S0` via `@next/third-parties`), FR20 (web fonts identical), FR23/FR24 (no react-helmet / no Gatsby plugins), NFR1/NFR2 (parity), NFR5 (Server/Client boundary), NFR6 (anti-gold-plating).
- [Source: _bmad-output/planning-artifacts/epics.md#Additional-Requirements] — AR11 (`next/font` self-hosted, no shift), AR12 (root `layout.tsx` is the `wrapPageElement` replacement), AR9 (`siteMetadata` → plain TS / metadata), AR10 (static assets → `public/`, scoped here to the two identity assets), AR13 (no fabricated tests), AR14 (Server-by-default).
- [Source: archive/gatsby-config.js] — **authoritative** `siteMetadata` (title/template/description/url/image/twitterUsername), fonts plugin (`Permanent Marker`, `Roboto:400`), gtag plugin (`G-F98QXJC4S0`).
- [Source: archive/src/components/seo.js] — **authoritative** head tags: description, OG (`url/type/title/description/image`), Twitter (`summary_large_image`, creator/title/description/image), and the `hat-wizard-solid.svg` favicon link. (Per-page `title`/`description`/`image` props are Epic 3 overrides.)
- [Source: archive/tailwind.config.js] — `fontFamily.sans = ['Roboto', …]` and `fontFamily['fancy-heading'] = ["'Permanent Marker'", …]` — the mapping to reproduce as Tailwind v4 `@theme` tokens.
- [Source: src/app/layout.tsx] — current Server-Component root layout (Geist fonts to replace, minimal `metadata` to expand; preserve the 1.5 `<Providers>`/`<ThemeToggle>`/`suppressHydrationWarning`/FA config).
- [Source: src/app/globals.css] — `@theme { --breakpoint-xs }` (where font tokens go) and the unlayered `body { font-family: Arial… }` line (to repoint at `var(--font-sans)`); colours/guard untouched.
- [Source: docs/decisions/0003-netlify-deploy-path-a-static-export.md] — static export shape (analytics/fonts stay client-side under Path A).
- [Source: docs/decisions/0009-…, 0010-…] — the Tailwind v4 border guard + colour token system this story must not disturb.
- [Source: _bmad-output/implementation-artifacts/deferred-work.md] — the Story-1.1 deferral that `next/font/google` build-time fetch (offline builds) is Story 1.7's concern, not this story's.
- [Source: _bmad-output/planning-artifacts/prds/prd-project-theseus-2026-06-10/addendum.md] — decided stack: `next/font`, Metadata API, `@next/third-parties`, SSG/static.
- [Source: _bmad-output/planning-artifacts/research/technical-…-research-2026-06-10.md] — `next/font` self-hosting + CLS, Metadata API replacing react-helmet, `@next/third-parties` for GA.
- [Source: nextjs.org/docs — Metadata API (`metadataBase`, `title.template/default`, `openGraph`, `twitter`); `next/font/google`; App Router `icon` file convention; `@next/third-parties/google` `GoogleAnalytics`] — verified against Next 16.2.9.
- [Source: _bmad-output/project-context.md] — atomic-design tiers, theming-via-CSS-vars, no test suite, dependency restraint, British-spelling prose, no-comments default. _(NB: documents the **legacy Gatsby** stack; treat its React/Gatsby specifics as the source being migrated **from** — the target is Next 16 + TS per the PRD addendum.)_

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

## Decisions resolved with Zac (2026-06-15 — recorded before dev)

Both open scoping calls were settled when the story was drafted, so the tasks above are
unconditional. Captured here (and to be reflected in ADR 0013) so the trail is complete:

1. **Favicon → idiomatic `src/app/icon.svg` file convention** (not the archive's exact
   `/images/hat-wizard-solid.svg` URL); delete the `create-next-app` placeholder `favicon.ico`. The
   visible favicon is identical; only the URL differs (invisible to the NFR1 visual-diff bar), and the
   file convention is the Next-native approach per the Theseus idiomatic-Next protocol. (AC5, Task 6.)
2. **OG default image → bring `zac-portrait.jpg` into `public/images/` now** so the OG/Twitter default
   card image resolves and FR17 defaults are fully real from this story onward. A deliberate one-asset
   anticipation of AR10's bulk `static/` → `public/` relocation; the rendered sidebar portrait (`next/image`)
   and all other assets still move with their consumers in Epic 2-3. (AC4/AC5, Task 6.)

## Change Log

| Date       | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-06-15 | Story drafted — root-layout identity wiring: `next/font` (Permanent Marker + Roboto:400) replacing `gatsby-plugin-google-fonts`; Metadata-API root defaults (title template, description, OG, Twitter `summary_large_image`, wizard-hat favicon) replacing `react-helmet`; `@next/third-parties` GA (`G-F98QXJC4S0`) replacing `gatsby-plugin-google-gtag`. Two asset scoping calls resolved with Zac (favicon `icon.svg` convention; bring OG portrait in now) — tasks unconditional. ADR plan: 0013. Status → ready-for-dev. |
