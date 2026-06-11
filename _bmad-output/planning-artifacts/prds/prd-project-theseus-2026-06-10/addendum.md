# Addendum — PRD: Project Theseus

Depth that belongs downstream (architecture / solution design) rather than in the PRD's
capability narrative: the decided technical-how, the Gatsby→Next mapping, risks, and the
preserve-verbatim list. The PRD states **what** must hold; this records the **how** that is
already decided, so architecture/dev work doesn't re-derive it.

The authoritative source for all of this is the technical research report:
`_bmad-output/planning-artifacts/research/technical-project-theseus-nextjs-typescript-migration-research-2026-06-10.md`.
This addendum is a decision-ready summary, not a replacement.

## Decided technical stack (closed — not re-opened by this PRD)

| Concern              | Decision                                                                                                                                                                                     | Confidence |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Framework / runtime  | Next.js 16 + React 19.2 + TypeScript 5.x (`strict: true`), App Router                                                                                                                        | High       |
| Rendering            | SSG, fully static (`output: 'export'`)                                                                                                                                                       | High       |
| Hosting / deploy     | Netlify, **Path A**: pure static export + small custom `loaderFile` → Netlify Image CDN (`/.netlify/images?url=…&w=…&q=…`). Deploy-on-commit from `main` preserved. No serverless functions. | High       |
| styled-components    | **Removed entirely** → global CSS vars + `next-themes` + CSS Modules                                                                                                                         | High       |
| Theme persistence    | **On** (`next-themes` default; flicker-free via pre-hydration script)                                                                                                                        | Decided    |
| Tailwind             | **v4** (CSS-first `@theme`, Oxide engine), with the border/ring/divide regression guard                                                                                                      | Med-High   |
| TS conversion        | **Big-bang** (small codebase; mixed-mode not worth it; TS-on-display is a goal)                                                                                                              | High       |
| Migration approach   | Clean parallel rebuild, ported **tier-by-tier** (atoms → molecules → organisms → pages), visually diffing each tier vs live                                                                  | Med-High   |
| Backroom MD pipeline | **No decision** — deferred to Ariadne; Theseus forecloses nothing                                                                                                                            | High       |

## Gatsby → Next.js (App Router) mapping

| Concern                | Gatsby (current)                                            | Next.js (target)                                                                                        |
| ---------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Routing                | `src/pages/*.js`, `@reach/router`                           | `src/app/**/page.tsx` (App Router)                                                                      |
| Location / nav         | `useLocation` (`@reach/router`)                             | `usePathname` / `useRouter` (`next/navigation`), client only                                            |
| Build-time data        | `useStaticQuery(graphql)`, `siteMetadata`                   | Plain TS module imports / `src/config`. **GraphQL data layer disappears.**                              |
| Images                 | `gatsby-plugin-image` + `sharp`, `<GatsbyImage>`            | `next/image` `<Image>` (explicit `width`/`height`/`alt`) + Netlify Image CDN loader                     |
| Static assets          | `static/`                                                   | `public/` (rename; URL refs unchanged). CV PDF + `/images/*` move here.                                 |
| SEO                    | `react-helmet` via `<Seo>`                                  | Next **Metadata API** (`export const metadata` / `generateMetadata`) in layouts/pages                   |
| Global styles / theme  | styled-components `createGlobalStyle`                       | Global CSS + CSS vars + `next-themes`                                                                   |
| Analytics              | `gatsby-plugin-google-gtag`                                 | `@next/third-parties` `<GoogleAnalytics gaId="G-F98QXJC4S0" />` in root layout                          |
| Cross-cutting UI state | `MenuOpenContext` in `layout.js`                            | Same Context, inside a `'use client'` provider                                                          |
| Fonts                  | `gatsby-plugin-google-fonts` (Permanent Marker, Roboto:400) | `next/font` (Google) — idiomatic, self-hosted, no layout shift                                          |
| Layout wrapping        | `wrapPageElement` in `gatsby-browser.js`/`gatsby-ssr.js`    | Root `layout.tsx`                                                                                       |
| Tooling                | Prettier + Husky, no ESLint, no tests                       | Keep Prettier + Husky; Next's own TS/build checks. `npm test` is a stub — do **not** fabricate a suite. |

## styled-components removal (the headline technical move)

Actual footprint is tiny — **two `styled.div`s + one `createGlobalStyle` + one
`keyframes`** across three files. Paying the App-Router SSR-registry / `'use client'`
contamination / React-19 type-risk tax for that is not worth it. Replacements:

- `theme-styles.js` `createGlobalStyle` → static global CSS defining both palettes as CSS
  vars; `next-themes` toggles the class/attribute on `<html>`. Body gradient becomes
  `linear-gradient(var(--color-bg-secondary), var(--color-bg-tertiary))`.
- `layout.js` `keyframes` + `AnimatedContainer` → plain CSS `@keyframes` in a CSS Module +
  a `'use client'` wrapper.
- `atoms/timeline-divider.js` (pure static CSS in a `styled.div`) → CSS Module. Mechanical.

The existing plain-CSS animations (`animations.js`, `animate-on-change.css`) are **not**
styled-components and port across untouched.

## Server/Client boundary

Layouts/pages are Server Components. Push interactivity to `'use client'` leaves: the theme
toggle, the mobile menu (`MenuOpenContext` provider), the custom scrollbar (incl. the
route-change reset), the entrance-animation wrapper, and the rotating job-title animation.
Content organisms render on the server.

## Risk register (migration-specific)

| Risk                                                                                                         | Severity                                       | Mitigation                                                                                                 |
| ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Tailwind v4 `border`/`ring`/`divide` default → `currentColor` (was `gray-200` in v3) silently shifts borders | Medium — hits the zero-regression bar directly | Set an explicit base border colour; audit every `border`/`ring`/`divide` usage; per-component visual diff. |
| Theme-var injection differs (build-time CSS vs runtime SC `theme` prop)                                      | Medium                                         | Verify both palettes render identically; the body `:before` gradient is the fiddly bit — port carefully.   |
| `next/image` needs explicit `width`/`height`; mismatch → layout shift                                        | Low-Med                                        | Carry over intrinsic dimensions; check CLS on the portrait + content images.                               |
| SSR hydration mismatch from theme class                                                                      | Low                                            | `next-themes` pre-hydration script + `suppressHydrationWarning` on `<html>`.                               |
| Intentional quirks "cleaned up" during port                                                                  | Low                                            | Preserve verbatim — see below.                                                                             |
| Netlify deploy config drift (losing deploy-on-commit)                                                        | Low                                            | Netlify auto-detects Next; keep the GitHub→`main` hook; verify a preview deploy before cutover.            |

## Preserve-verbatim list (intentional, look-like-bugs)

- **Route-change scroll reset** via `setCurrentScrollPos(Math.random())` — forces the custom
  scrollbar to top on navigation. Reimplement the behaviour; do not delete it as "random".
- **Email entity-obfuscation** (`…&#0064;…`) — anti-scrape; keep the encoded form.
- **Rotating job titles** on Home — the cycling list + interval is intentional flair.
- The `next-themes` migration **does** change one thing on purpose: theme persistence (see
  PRD FR10 / OQ1). Everything else is parity.

## Behaviour-change flag (carried into the PRD as FR10 / OQ1)

Today's toggle is component-local `useState`, defaults to dark, and does **not** persist
across reloads. `next-themes` persists by default and can detect system preference. The
accepted change is **persistence on**; the **dark first-visit default** is retained and
system-preference auto-adoption is **not** enabled. (Resolved 2026-06-10 — PRD OQ1.)

## Forward-looking (Ariadne disaster-avoidance only)

The backroom's markdown→HTML rendering is Ariadne's call and is **not** decided here. The
only Theseus-side obligation is not to foreclose it: MDX, `next-mdx-remote`, and
`react-markdown` all work under static export (Path A). Theseus's choices block none of
them. No selection, comparison, or recommendation is made.
