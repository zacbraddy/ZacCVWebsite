---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments:
  - '_bmad-output/planning-artifacts/briefs/brief-zacs-cv-website-2026-06-10/brief.md'
  - '_bmad-output/planning-artifacts/briefs/brief-zacs-cv-website-2026-06-10/addendum.md'
  - '_bmad-output/project-context.md'
workflowType: 'research'
lastStep: 6
research_type: 'technical'
research_topic: 'Project Theseus — Gatsby to Next.js + TypeScript Migration'
research_goals: 'Surface the current-best technical approach for migrating Zac''s CV website from Gatsby 5 to Next.js + TypeScript with zero visual/functional regression, resolving the open architecture questions the product brief parked: rendering strategy, the styled-components + CSS-variable theming migration, Tailwind version, the image pipeline, routing, the markdown/MDX pipeline (forward-looking for Project Ariadne), and hosting/analytics.'
user_name: 'Zac'
date: '2026-06-10'
web_research_enabled: true
source_verification: true
project_codenames:
  project_1: 'Theseus (Modernisation)'
  project_2: 'Ariadne (Content & Showcase / backroom)'
---

# Research Report: Project Theseus — Gatsby → Next.js + TypeScript Migration

**Date:** 2026-06-10
**Author:** Zac
**Research Type:** technical

---

## Research Overview

Technical research to support **Project Theseus** — the modernisation migration of Zac's
CV website (`zackerthehacker.com`) from Gatsby 5 to Next.js + TypeScript, with **zero
visual or functional regression**. The framework decision (Next.js + TS over staying on
Gatsby or moving to Astro) is **already closed** in the product brief addendum and is not
re-opened here. This research instead resolves the open, "revisit at architecture stage"
questions and de-risks the migration mechanics.

### Hard constraints (set by Zac, not open for trade-off)

- **Hosting stays on Netlify.** The site is hosted on Netlify today, with CI/CD wired
  directly to the GitHub `main` branch (deploy-on-commit). This is simple, reliable, and
  valued as-is. A host move requires an extraordinarily strong justification; the default
  is **keep Netlify and keep the deploy-on-commit flow intact.** Research confirms Netlify
  remains sound and checks *how* Next.js runs best on it — it does not shop for a new host.
- **Stay out of Project Ariadne's scope.** The markdown/MDX pipeline (the backroom's
  rendering) is Ariadne's decision to make later. This research treats it **risk-only** —
  ensuring Theseus doesn't foreclose Ariadne's options — and deliberately makes **no**
  pipeline selection, comparison, or recommendation now.

---

## Project Codenames (decision record)

| Codename | Project | Rationale |
|---|---|---|
| **Theseus** | Project 1 — Modernisation (this research) | The Ship of Theseus: every plank/dependency and the framework itself is replaced, yet it remains *the same ship*. That is literally the acceptance criterion — **zero visual or functional regression**. Every part swapped, identity preserved. |
| **Ariadne** | Project 2 — Content & Showcase / the backroom | Ariadne's thread guided Theseus through the labyrinth. Project 2 is the curated docs/ADRs/backroom — the thread handed to a technical visitor so they can navigate *how the thing was built*. Theseus builds; Ariadne makes it legible. |

_Pairing chosen deliberately: thematically locked, meaningful, memorable, and explicitly **not** "Phoenix"._

---

## Technical Research Scope Confirmation

**Research Topic:** Project Theseus — Gatsby 5 → Next.js + TypeScript migration of Zac's CV website.
**Research Goals:** Resolve the open "revisit at architecture stage" questions from the brief addendum and de-risk migration mechanics, to a "decision-ready" standard — without re-opening the closed framework choice and without doing Ariadne's work.

**In scope (the open questions):**
1. Target versions (Next.js / React / TypeScript / Tailwind).
2. Rendering strategy (static export vs SSG-on-runtime vs hybrid).
3. The styled-components + CSS-variable theming migration — **the principal technical risk**.
4. Tailwind v3 → v4 decision and its zero-regression implications.
5. Image pipeline (`gatsby-plugin-image`/`sharp` → `next/image`).
6. Routing, SEO, analytics, and the Server/Client component boundary.
7. Hosting on Netlify (confirmation only — host stays) and how Next.js runs best on it.

**Out of scope:** framework re-evaluation (closed); Ariadne's MDX/backroom tooling decision (risk-only note only); hard analytics instrumentation.

**Methodology:** current (2026) web sources with citations + direct inspection of the existing codebase to ground every recommendation. Confidence levels stated where the ecosystem is moving.

**Scope Confirmed:** 2026-06-10

---

## Technology Stack Analysis — Target Versions

### Framework & runtime (Confidence: High)

- **Next.js 16** is the current stable line (16.2.x as of mid-2026). Turbopack is the **default** bundler for both `next dev` and `next build`. The App Router is the recommended, production-ready default. ([Next.js 16 blog](https://nextjs.org/blog/next-16), [App Router in 2026 readiness](https://meisteritsystems.com/news/next-js-app-router-in-2026-is-it-ready-for-production/))
- **React 19.2** ships with the App Router (View Transitions, `useEffectEvent`, Activity component). The App Router pins its own validated React build, so you don't hand-manage the React version. ([Next.js 16 blog](https://nextjs.org/blog/next-16))
- **TypeScript 5.x**, `strict: true`. Given the codebase is small (atoms/molecules/organisms, no business logic of note), a **big-bang TS conversion is preferable** to incremental `allowJs` — less long-lived mixed-mode mess, and TS-on-display is itself a stated goal of the project.
- **Target decision:** Next.js 16 + React 19.2 + TypeScript 5.x, App Router. _Note: Next.js 16 has its own upgrade considerations vs 15 (async request APIs, caching defaults); for a greenfield rebuild this is moot since we start clean on 16._ ([Upgrading: Version 16](https://nextjs.org/docs/app/guides/upgrading/version-16))

### Tailwind: v3 → v4 (Confidence: Medium-High — a genuine choice point)

Tailwind **v4** is the current standard (Rust/Oxide engine, 2–5× faster builds, CSS-first `@theme` config, OKLCH colours, container queries). The PostCSS plugin and the separate PurgeCSS step are **gone** — Tailwind handles its own content scanning. ([Tailwind upgrade guide](https://tailwindcss.com/docs/upgrade-guide), [v4 migration 2026](https://dev.to/pockit_tools/tailwind-css-v4-migration-guide-everything-that-changed-and-how-to-upgrade-2026-5d4))

- **Why v4 fits Theseus:** it's the marketable, current skill; and its **CSS-first `@theme` directive is a natural home for the CSS-variable theming** this migration is moving to anyway (synergy, not extra work). The `@tailwindcss/upgrade` codemod handles ~90% of mechanical changes.
- **⚠️ Zero-regression trap:** in v4, `border-*`, `divide-*`, and `ring` utilities **default to `currentColor`** (v3 defaulted to `gray-200`), and default ring width changed. On a "zero visual regression" project this is the one thing that will silently shift borders. **Mitigation:** set an explicit base border colour and audit every `border`/`ring`/`divide` usage during the port.
- **Conservative alternative:** stay on **Tailwind v3.4** (latest v3) to minimise regression surface, accepting it's now the legacy line. _Recommendation: go v4 with the border-colour guard — the marketability + theming synergy outweighs a contained, well-understood migration risk._

### What the existing codebase actually uses (ground truth from inspection)

- **styled-components is barely load-bearing.** Only **three** files import it, totalling **two** `styled.div`s plus one `createGlobalStyle` and one `keyframes`:
  - `theme-styles.js` — `createGlobalStyle` injecting `--color-*` vars from a `theme` prop (dark/light) + a themed body gradient.
  - `layout.js` — one `keyframes` (`fadeUpIn`) + one `styled.div` (`AnimatedContainer`) entrance animation.
  - `atoms/timeline-divider.js` — one `styled.div` of **pure static CSS** (pseudo-elements, references `--color-*` vars).
- **Animations are already plain CSS** (`animations.js` exports CSS strings/easings; `animate-on-change.css` holds keyframes) — they are **not** styled-components and port across untouched.
- This is the single most important finding: the styled-components footprint is small enough to **remove entirely** at low cost (see Architecture below).

---

## Integration & Migration Mapping (Gatsby → Next.js App Router)

Confidence: High across the table; these are well-trodden mappings. ([Next.js: Migrating from Gatsby](https://nextjs.org/docs/migrating/from-gatsby), [Makers' Den guide](https://makersden.io/blog/migrating-gatsby-to-nextjs-guide))

| Concern | Gatsby (current) | Next.js (target) | Notes |
|---|---|---|---|
| Routing | `src/pages/*.js` file routes, `@reach/router` | `src/app/**/page.tsx` (App Router) | File-system routing maps cleanly. |
| Location/navigation | `useLocation` from `@reach/router` | `usePathname` / `useRouter` from `next/navigation` | Client components only. |
| Build-time data | `useStaticQuery(graphql\`…\`)`, `siteMetadata` | Plain TS module imports / `src/config` | The GraphQL data layer **disappears** — site data is static config; just import it. Big simplification. |
| Images | `gatsby-plugin-image` + `gatsby-plugin-sharp`, `<GatsbyImage>` | `next/image` `<Image>` | Needs explicit `width`/`height`/`alt`. Optimisation path depends on hosting choice (below). |
| Static assets | `static/` | `public/` | Rename folder; URL-referenced assets unchanged. |
| SEO | `react-helmet` via `<Seo>` component | Next **Metadata API** (`export const metadata` / `generateMetadata`) | Replaces the `<Seo>` first-element pattern; metadata lives in layouts/pages. |
| Global styles / theme | styled-components `createGlobalStyle` | Global CSS + CSS vars + `next-themes` | See Architecture. |
| Analytics | `gatsby-plugin-google-gtag` (`G-F98QXJC4S0`) | `@next/third-parties` `<GoogleAnalytics gaId="G-F98QXJC4S0" />` | One component in root layout. ([Next third-party libs](https://nextjs.org/docs/app/guides/third-party-libraries)) |
| Cross-cutting UI state | `MenuOpenContext` in `layout.js` | Same Context, but in a `'use client'` provider | Theme toggle, menu, scrollbar reset all become client leaves. |
| Tooling | Prettier + Husky, no ESLint, no tests | Keep Prettier + Husky; Next ships its own TS/build checks | `npm test` is still a stub — don't fabricate a suite. |

---

## Architectural Decisions

### A. Rendering strategy → **SSG (fully static)**. Confidence: High.

The site is 100% static content with no per-request data. Every route should be **statically generated at build**. No SSR, no ISR, no server-rendered data fetching is warranted. This matches the current Gatsby static-bundle behaviour exactly and is the lowest-risk, most reliable posture.

### B. Hosting on Netlify → **stays**, with two viable deploy shapes. Confidence: High on both being viable; the pick is Zac's.

Netlify in 2026 remains a first-class Next.js host and **actively maintains** its Next.js runtime (OpenNext-based) for every Next version from 13.5 up, auto-selected on build — so deploy-on-commit from `main` is **preserved either way**. ([Next.js on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/), [OpenNext / Netlify](https://opennext.js.org/netlify))

- **Path A — Pure static export (`output: 'export'`) + Netlify Image CDN loader. ⭐ Recommended for Zac's stated priorities.**
  Produces a pure static bundle (no Next.js serverless functions at all) — the closest possible match to today's Gatsby deploy: simple, cheap, nothing server-side to break, exactly the "reliable, don't overcomplicate" property you called out. `next/image` optimisation, which static export otherwise disables, is restored by a **small custom `loaderFile`** pointing at Netlify's Image CDN (`/.netlify/images?url=…&w=…&q=…`), available to any Netlify site. So you keep pure-static hosting **and** responsive optimised images. ([Static Exports](https://nextjs.org/docs/pages/guides/static-exports), [export image API](https://nextjs.org/docs/messages/export-image-api))
  _Cost: one small loader file to write/maintain._

- **Path B — Default Next on the Netlify Next.js runtime.**
  Zero image config — `next/image` "just works" via Netlify Image CDN automatically — and leaves the door open to any future Next feature (SSR/ISR/route handlers). _Cost:_ introduces serverless functions; `next/image` requests route through a function (latency + function-quota), which is **negligible at CV-site traffic** but is "more moving parts" than Path A. ([Netlify new Next.js runtime](https://www.netlify.com/blog/introducing-the-new-next-js-runtime/))

**Recommendation:** **Path A.** It most faithfully preserves the static-bundle reliability you prize, keeps deploy-on-commit, and still gives optimised images. Choose Path B only if you'd rather trade a function dependency for zero image-loader config.

### C. Styling & theming → **remove styled-components entirely.** ⭐ Confidence: High — the headline recommendation.

styled-components *can* run on the App Router (v6.3+ has RSC support; SWC plugin built-in via `compiler.styledComponents: true`), **but** every component that uses it must be a `'use client'` component and you must wire a style registry with `useServerInsertedHTML` for SSR. There are also live React 19 friction points (`defaultProps` removed; `CSSPropertiesWithVars` vs React 19 `CSSProperties` type clashes, fixed only in v6.4+), and the maintainer's v7 is still pending. ([Next.js CSS-in-JS guide](https://nextjs.org/docs/app/guides/css-in-js), [styled-components RSC discussion](https://github.com/vercel/next.js/discussions/50473), [React 19 type issue #5652](https://github.com/styled-components/styled-components/issues/5652))

Given the **actual footprint is two `styled.div`s + one `createGlobalStyle` + one `keyframes`**, paying that SSR-registry/`'use client'`/type-risk tax is not worth it. Remove it:

| Current styled-components use | Replacement | Effort |
|---|---|---|
| `theme-styles.js` `createGlobalStyle` injecting `--color-*` vars per theme | **Static global CSS**: define both palettes as CSS vars under `:root` (dark) and a theme selector (`.light` / `[data-theme='light']`); toggle via **`next-themes`** setting the class/attribute on `<html>`. Themed body gradient becomes `linear-gradient(var(--color-bg-secondary), var(--color-bg-tertiary))`. | Low |
| `layout.js` `keyframes` + `AnimatedContainer` | Plain CSS `@keyframes` in a CSS Module + a `'use client'` wrapper div | Low |
| `atoms/timeline-divider.js` (`styled.div`, pure static CSS) | CSS Module (`timeline-divider.module.css`) — mechanical | Trivial |

**Payoff:** no SSR style registry, no `'use client'` contamination from styling, no React-19 SC type risk, one fewer runtime dependency, no dependence on SC's v7/RSC roadmap. This is the cleanest path to the "still flashy, still flawless" bar.

**`next-themes`** is the idiomatic toggle: `ThemeProvider` in the root layout (a client boundary), `attribute="class"`, flicker-free via its injected pre-hydration script, system-preference aware. ([next-themes](https://github.com/pacocoursey/next-themes))

> ⚠️ **Behaviour-change flag (Zac's call):** the current toggle is component-local `useState` and **does not persist** across reloads (documented current behaviour). `next-themes` **persists by default** (localStorage/cookie) and adds system-preference detection. This is a strict UX *improvement* but a *functional change* vs today. Per the brief's "only add persistence if explicitly asked," I'm **flagging not deciding** it: keep persistence (recommended, idiomatic, flicker-free) or configure `next-themes` to behave session-only for exact parity.

### D. Server/Client boundary. Confidence: High.

Keep layouts/pages as Server Components; push interactivity to `'use client'` leaves: the theme toggle, the mobile menu (`MenuOpenContext` provider), the custom scrollbar (incl. the intentional `setCurrentScrollPos(Math.random())` scroll-reset hack — **preserve it**, don't "fix" it), and the entrance-animation wrapper. Everything else (the content organisms) can render on the server.

---

## Implementation Notes, Risks & Sequencing

### Recommended approach: clean parallel rebuild, ported tier-by-tier. Confidence: Medium-High.

The site is small and the bar is *zero visual regression*, so the cleanest route is a **fresh Next.js 16 App Router skeleton in the repo (or a branch), porting components bottom-up — atoms → molecules → organisms → pages — visually diffing each tier against the live Gatsby site.** Avoid the incremental `gatsby-plugin-next` bridge: it keeps Gatsby alive (the opposite of the goal) and adds dual-framework complexity for a site this size. ([gatsby-plugin-next](https://www.gatsbyjs.com/plugins/gatsby-plugin-next/))

### Risk register

| Risk | Severity | Mitigation |
|---|---|---|
| Tailwind v4 `border`/`ring`/`divide` default → `currentColor` shifts visuals | Medium (hits zero-regression bar directly) | Set explicit base border colour; audit all border/ring usages; side-by-side visual diff per component. |
| Theme-var injection differs (build-time CSS vs runtime SC `theme` prop) | Medium | Verify both palettes render identically; the body `:before` gradient is the fiddly bit — port it carefully. |
| `next/image` requires explicit `width`/`height`; layout shift if mismatched | Low-Medium | Carry over intrinsic dimensions; check CLS on the portrait + any project images. |
| SSR hydration mismatch from theme class | Low | `next-themes` handles this with its pre-hydration script + `suppressHydrationWarning` on `<html>`. |
| PurgeCSS gotcha muscle-memory | Low | The `gatsby-plugin-purgecss` step is gone, but the **"no dynamically-constructed class names"** rule still applies (Tailwind's own content scanner has the same blind spot). Keep class strings static. |
| Email entity-obfuscation / `Math.random()` scroll hack "cleaned up" during port | Low | Both are intentional (per project-context) — preserve verbatim. |
| Netlify deploy config drift (losing deploy-on-commit) | Low | Netlify auto-detects Next; keep the GitHub→`main` build hook; verify a preview deploy before cutover. |

### Forward-looking note — Ariadne disaster-avoidance only (no decision made)

The backroom's markdown→HTML rendering is **Ariadne's decision** and is *not* made here. The only Theseus-side concern is not foreclosing it: the Next ecosystem has several mature, **build-time-compatible** markdown pipelines (MDX, `next-mdx-remote`, `react-markdown`), all of which work under **static export (Path A)** as well as the runtime. **Conclusion: Theseus's rendering/hosting choices block none of them.** No tooling selection, comparison, or recommendation is made — revisit in Ariadne. ([Next.js: Migrating from Gatsby — addendum context](https://nextjs.org/docs/migrating/from-gatsby))

---

## Synthesis & Recommendations

### Decision table

| # | Question | Recommendation | Confidence | Zac's call? |
|---|---|---|---|---|
| 1 | Framework/runtime | Next.js 16 + React 19.2 + TS 5.x (strict), App Router | High | Closed |
| 2 | Rendering | SSG (fully static) | High | Closed |
| 3 | Hosting/deploy | **Netlify, Path A: `output: 'export'` + Netlify Image CDN loader** | High | ✅ **Decided: Path A** (no backend) |
| 4 | styled-components | **Remove entirely** → global CSS vars + `next-themes` + CSS Modules | High | ✅ Decided: remove |
| 5 | Theme persistence | Keep `next-themes` persistence (improvement) | Med | ✅ **Decided: persistence on** |
| 6 | Tailwind | **v4** with border-colour regression guard | Med-High | ✅ **Decided: v4** |
| 7 | Images | `next/image`, loader per hosting choice | High | Follows #3 |
| 8 | Routing/SEO/analytics | App Router + Metadata API + `@next/third-parties` GA | High | Recommended |
| 9 | TS conversion | Big-bang (small codebase) | High | Recommended |
| 10 | Migration approach | Clean parallel rebuild, ported tier-by-tier with visual diffing | Med-High | Recommended |
| 11 | Backroom MD pipeline | **No decision** — confirmed Theseus forecloses nothing | High | Deferred to Ariadne |

### Choice points — all resolved (2026-06-10)
1. **Hosting → Path A** (pure static export + Netlify Image CDN loader). No backend; keep it simple and reliable.
2. **Tailwind → v4** (with the `border → currentColor` regression guard).
3. **Theme persistence → on** (`next-themes` default).

All open questions are now closed. The research is decision-complete.

### Guiding principle for Theseus (set by Zac)

**Build it the idiomatic Next.js way — do not foist Gatsby patterns into a Next.js
codebase.** The point of the migration is to *prove fluency with Next.js*, so every
choice should reach for the current-best, framework-native approach (App Router
conventions, Server/Client boundaries, Metadata API, `next/image`, `next-themes`,
Tailwind v4 CSS-first config) rather than porting Gatsby idioms one-to-one. "Zero visual
regression" is about the *output the visitor sees*, **not** about preserving internal
Gatsby-isms. Where a Gatsby pattern and the idiomatic Next pattern diverge, the idiomatic
Next pattern wins.

---

## Sources

- [Next.js 16 — release blog](https://nextjs.org/blog/next-16)
- [Next.js — Upgrading: Version 16](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Next.js App Router in 2026: production readiness](https://meisteritsystems.com/news/next-js-app-router-in-2026-is-it-ready-for-production/)
- [Next.js — CSS-in-JS guide (styled-components registry)](https://nextjs.org/docs/app/guides/css-in-js)
- [vercel/next.js Discussion #50473 — styled-components feasibility on App Router](https://github.com/vercel/next.js/discussions/50473)
- [styled-components Issue #5652 — React 19 CSSProperties incompatibility](https://github.com/styled-components/styled-components/issues/5652)
- [pacocoursey/next-themes](https://github.com/pacocoursey/next-themes)
- [Tailwind CSS — Upgrade guide (v3 → v4)](https://tailwindcss.com/docs/upgrade-guide)
- [Tailwind CSS v4 Migration Guide (2026)](https://dev.to/pockit_tools/tailwind-css-v4-migration-guide-everything-that-changed-and-how-to-upgrade-2026-5d4)
- [Next.js on Netlify — Netlify Docs](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/)
- [Next.js on Netlify — OpenNext](https://opennext.js.org/netlify)
- [Netlify — Introducing the new Next.js Runtime](https://www.netlify.com/blog/introducing-the-new-next-js-runtime/)
- [Next.js — Static Exports guide](https://nextjs.org/docs/pages/guides/static-exports)
- [Next.js — Export with Image Optimization API](https://nextjs.org/docs/messages/export-image-api)
- [Next.js — Third Party Libraries (Google Analytics)](https://nextjs.org/docs/app/guides/third-party-libraries)
- [Next.js — Migrating from Gatsby](https://nextjs.org/docs/migrating/from-gatsby)
- [Makers' Den — Migrating Gatsby to Next.js guide](https://makersden.io/blog/migrating-gatsby-to-nextjs-guide)
- [gatsby-plugin-next](https://www.gatsbyjs.com/plugins/gatsby-plugin-next/)
