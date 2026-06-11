---
stepsCompleted:
  [
    'step-01-validate-prerequisites',
    'step-02-design-epics',
    'step-03-create-stories',
    'step-04-final-validation',
  ]
inputDocuments:
  [
    '_bmad-output/planning-artifacts/prds/prd-project-theseus-2026-06-10/prd.md',
    '_bmad-output/planning-artifacts/prds/prd-project-theseus-2026-06-10/addendum.md',
    '_bmad-output/planning-artifacts/research/technical-project-theseus-nextjs-typescript-migration-research-2026-06-10.md',
  ]
---

# Project Theseus — Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for **Project Theseus**
(Gatsby 5 / JavaScript → Next.js 16 + React 19.2 + TypeScript migration of
`zackerthehacker.com`), decomposing the requirements from the PRD and the decided technical
"how" (PRD addendum + technical research report) into implementable stories.

There is **no UX Design specification** for this project — and that is by design. Theseus is
a **zero-visual-regression parity migration**: the existing live site _is_ the UX spec. The
acceptance bar for every front-of-house behaviour is "identical to the pre-migration live
site", with the single accepted exception of theme persistence (FR10).

## Requirements Inventory

### Functional Requirements

**A. Site shell & navigation (persistent on every route)**

- **FR1** — A persistent layout shell wraps every route: content pane with the established entrance animation, plus the left sidebar on desktop. Identical structure and responsive behaviour to today.
- **FR2** — Primary navigation exposes Home, About Me, Resume, Content I've Created, plus a Download CV action. Labels, icons, order, and destinations unchanged.
- **FR3** — Below `lg`, navigation collapses into a slide-in burger menu; selecting an item navigates and closes the menu. Same trigger, animation, and behaviour as today.
- **FR4** — At `lg`+, the left sidebar shows portrait, name, job title, social links, and the nav. Same layout and breakpoints.
- **FR5** — The content pane uses a custom scrollbar, and scroll position resets to top on every route change. (Intentional — preserve.)
- **FR6** — A loading spinner displays until the page is ready, then is removed.
- **FR7** — Page entrance and route-change transition animations are preserved (initial fade-up-in and per-page transition).

**B. Theming**

- **FR8** — A theme toggle (moon/sun, fixed top-left) switches dark/light. Dark is the default. Both palettes and the themed body gradient render identically to today.
- **FR9** — Colours are driven by a CSS-custom-property token system (`--color-*`), not hardcoded. Both palettes reproduce current values exactly, including the body `:before` gradient.
- **FR10** — **[ACCEPTED CHANGE vs today]** The selected theme persists across reloads (`next-themes`, flicker-free). First-visit default remains dark (no `prefers-color-scheme` auto-adoption). The only intended functional change in the project.

**C. Content pages (content byte-for-byte preserved — no copy edits)**

- **FR11** — **Home (`/`)**: name, the rotating job-title animation (existing list + interval), and the mobile-only "Take a look around" CTA that opens the menu.
- **FR12** — **About Me (`/about-me`)**: About Me, What I Do, Testimonials (incl. carousel), and Things I Like sections — existing content and interactions.
- **FR13** — **Resume (`/resume`)**: Experience timeline, Certifications, and Other Skills/Knowledge — same content and structure.
- **FR14** — **Content (`/content`)**: gallery of content items (Tabs & Spaces podcast, Manning course, conference talks, Medium blog, podcast-guest appearances, YouTube, former community creator), each with thumbnail, copy, alternating layout, external link.
- **FR15** — **404**: the existing not-found page renders for unknown routes.
- **FR16** — The downloadable CV PDF remains available at its current path via the Download CV action (same file, same download behaviour).

**D. Identity, SEO & analytics**

- **FR17** — Per-page SEO metadata preserved: title (`%s - Zac Braddy` template), description, Open Graph, Twitter summary-large-image card, wizard-hat favicon. Realised via the Next Metadata API, not `react-helmet`.
- **FR18** — Social profile links (Twitter, LinkedIn, GitHub) point to current URLs and open in a new tab.
- **FR19** — Google Analytics (`gtag` `G-F98QXJC4S0`) keeps firing on the live site, wired via `@next/third-parties`.
- **FR20** — The web fonts in use today (Permanent Marker for fancy headings, Roboto for body) render identically.
- **FR21** — Portrait and content images are served optimised and responsive (correct intrinsic dimensions, no layout shift), via `next/image`.
- **FR22** — Any intentional anti-scrape email entity-obfuscation present today is preserved in encoded form — not "cleaned up".

**E. Modernisation outcomes (the migration itself)**

- **FR23** — The site runs on Next.js 16 (App Router) + React 19.2 + TypeScript 5.x (`strict: true`), on current, non-deprecated dependencies. No Gatsby, no `@reach/router`, no GraphQL data layer.
- **FR24** — styled-components removed entirely. Theming, entrance animation, and timeline divider reimplemented with global CSS vars, `next-themes`, and CSS Modules. No CSS-in-JS runtime remains.
- **FR25** — The site is statically generated/exported and deployed to Netlify with deploy-on-commit from `main` preserved; the modern build is promoted to production (cutover) and the Gatsby build retired.
- **FR26** — Raw decision/process data (ADRs, retained research, reasoning, pragmatism calls) is captured as a byproduct, to a base-usable standard. No public-facing polish (that is Ariadne).

### NonFunctional Requirements

- **NFR1 — Zero visual regression.** No perceptible visual difference from the pre-migration live site, in both themes, across the responsive range (including the custom `xs: 410px` breakpoint), verified by per-tier side-by-side diffing.
- **NFR2 — Zero functional regression.** Every behaviour is identical to today, with the single accepted exception of theme persistence (FR10).
- **NFR3 — Performance parity or better.** Static delivery, optimised responsive images, controlled CLS; no regression in load or interactivity at CV-site scale.
- **NFR4 — Deploy continuity.** GitHub `main` → Netlify deploy-on-commit flow preserved end-to-end; a preview deploy verified before cutover. No host migration.
- **NFR5 — Idiomatic Next.** Built Next-native (App Router, Server/Client boundaries, Metadata API, `next/image`, `next-themes`, Tailwind v4 CSS-first config), not a 1:1 Gatsby port. Server Components by default; interactivity pushed to `'use client'` leaves.
- **NFR6 — Efficiency / anti-gold-plating.** Work stays inside the Theseus box. Ariadne-scoped work, redesigns, and speculative improvements are out. Scope discipline is a first-class quality attribute.
- **NFR7 — Preserve intentional quirks verbatim.** Deliberate look-like-bug behaviours kept exactly: route-change scroll reset (FR5), email entity-obfuscation (FR22), rotating job titles (FR11). Do not "fix" them.

### Additional Requirements

Technical implementation requirements from the PRD addendum and technical research report
(the decided "how"). These shape sequencing and individual stories.

**Project setup / starter template**

- **AR1 — Greenfield Next.js scaffold (clean parallel rebuild).** Theseus is built as a fresh Next.js 16 App Router + TypeScript project (`create-next-app` idiom), _not_ an in-place mutation of the Gatsby tree. The Gatsby build runs untouched until cutover. **This drives Epic 1, Story 1.**
- **AR2 — TypeScript big-bang, `strict: true`.** Small codebase; mixed-mode JS/TS not worth it; TS-on-display is a goal. No `.js` source components remain.
- **AR3 — Tailwind v4 (CSS-first `@theme`, Oxide engine).** Replaces the v3 `tailwind.config.js` token mapping. Carries a mandatory **border/ring/divide regression guard** (v4 defaults these to `currentColor`; v3 used `gray-200`) — set an explicit base border colour and audit every `border`/`ring`/`divide` usage.

**Rendering, hosting & deploy**

- **AR4 — SSG, fully static (`output: 'export'`).** No SSR, no serverless functions.
- **AR5 — Netlify deploy Path A.** Pure static export + a small custom `next/image` `loaderFile` pointing at the Netlify Image CDN (`/.netlify/images?url=…&w=…&q=…`). Deploy-on-commit from `main` preserved.
- **AR6 — Preview-deploy-then-cutover.** A Netlify preview deploy is verified green before promoting the modern build to production and retiring the Gatsby build.

**Migration mechanics (Gatsby → Next App Router)**

- **AR7 — Tier-by-tier port with per-tier visual diffing.** Port atoms → molecules → organisms → pages, visually diffing each tier against the live site in both themes, desktop + mobile.
- **AR8 — Routing.** `src/pages/*.js` + `@reach/router` → `src/app/**/page.tsx`; `useLocation` → `usePathname`/`useRouter` from `next/navigation` (client only).
- **AR9 — Data layer removal.** `useStaticQuery(graphql)` + `siteMetadata` → plain TS module imports / `src/config`. The GraphQL data layer disappears.
- **AR10 — Static assets relocate.** `static/` → `public/` (CV PDF + `/images/*`); URL references unchanged.
- **AR11 — Fonts via `next/font`.** Permanent Marker + Roboto:400 self-hosted via `next/font` (Google), no layout shift — replacing `gatsby-plugin-google-fonts`.
- **AR12 — Layout wrapping.** `wrapPageElement` (`gatsby-browser.js`/`gatsby-ssr.js`) → root `src/app/layout.tsx`.
- **AR13 — Tooling.** Keep Prettier + Husky; rely on Next's own TS/build checks. `npm test` is a stub — do not fabricate a suite.

**Server/Client boundary (NFR5 realised)**

- **AR14 — Server Components by default; `'use client'` leaves only for:** the theme toggle, the mobile menu (`MenuOpenContext` provider), the custom scrollbar (incl. route-change reset), the entrance-animation wrapper, and the rotating job-title animation. Content organisms render on the server.

**styled-components removal (the headline move — FR24)**

- **AR15 — Replace the tiny SC footprint** (two `styled.div`s + one `createGlobalStyle` + one `keyframes` across three files): `theme-styles.js` `createGlobalStyle` → static global CSS palettes as CSS vars toggled by `next-themes`; `layout.js` `keyframes` + `AnimatedContainer` → CSS `@keyframes` in a CSS Module + a `'use client'` wrapper; `atoms/timeline-divider.js` → CSS Module. Existing plain-CSS animations (`animations.js`, `animate-on-change.css`) port across untouched.

**Risk-driven guards**

- **AR16 — Theme-var parity check.** Verify both palettes render identically (build-time CSS vars vs old runtime SC `theme` prop); the body `:before` gradient is the fiddly bit — port carefully.
- **AR17 — `next/image` CLS guard.** Carry over intrinsic `width`/`height`; check CLS on the portrait + content images.
- **AR18 — Hydration-mismatch guard.** `next-themes` pre-hydration script + `suppressHydrationWarning` on `<html>`.

**Process capture & forward-compatibility**

- **AR19 — Capture raw decision/process data** (ADRs, retained research, reasoning, pragmatism calls) as a byproduct, base-usable standard (FR26) — the input Ariadne curates.
- **AR20 — Do not foreclose Ariadne.** Theseus's static-export + Netlify choices must block none of the mature Next markdown options (MDX, `next-mdx-remote`, `react-markdown` all work under Path A). No pipeline selection is made here.

### UX Design Requirements

**Not applicable.** No UX Design specification exists for Project Theseus, by design. This is
a zero-visual-regression parity migration — the existing live site at `zackerthehacker.com`
is the authoritative UX/visual reference. All visual and interaction requirements are
captured as parity acceptance criteria under the functional requirements (FR1–FR22) and
NFR1/NFR2, verified by per-tier side-by-side visual diffing (AR7).

### FR Coverage Map

- **FR1** → Epic 2 — persistent layout shell
- **FR2** → Epic 2 — primary navigation
- **FR3** → Epic 2 — burger menu below `lg`
- **FR4** → Epic 2 — desktop sidebar
- **FR5** → Epic 2 — custom scrollbar + route-change reset
- **FR6** → Epic 2 — loading spinner
- **FR7** → Epic 2 — entrance + route-transition animations
- **FR8** → Epic 1 — theme toggle + palettes
- **FR9** → Epic 1 — `--color-*` token system + body gradient
- **FR10** → Epic 1 — theme persistence (`next-themes`)
- **FR11** → Epic 3 — Home (rotating titles + mobile CTA)
- **FR12** → Epic 3 — About Me (incl. testimonials carousel)
- **FR13** → Epic 3 — Resume (timeline, certs, skills)
- **FR14** → Epic 3 — Content gallery
- **FR15** → Epic 3 — 404
- **FR16** → Epic 2 — CV PDF download (the Download CV nav action)
- **FR17** → Epic 3 — per-page SEO metadata _(root title-template + OG/favicon defaults established in Epic 1)_
- **FR18** → Epic 2 — social profile links (sidebar)
- **FR19** → Epic 1 — Google Analytics (`@next/third-parties`)
- **FR20** → Epic 1 — web fonts (`next/font`)
- **FR21** → Epic 2 (portrait in sidebar) + Epic 3 (content images) — optimised responsive images (`next/image`)
- **FR22** → Epic 3 — email entity-obfuscation preserved
- **FR23** → Epic 1 — Next 16 + React 19.2 + TS strict foundation _(confirmed end-to-end at Epic 4 cutover)_
- **FR24** → Epic 1 — styled-components removal (theming) _(completed across Epic 2 animations + Epic 3 timeline divider; confirmed Epic 4)_
- **FR25** → Epic 4 — static export + Netlify cutover, Gatsby retired
- **FR26** → Epic 1 (capture mechanism established + seeded) → **cross-cutting** (decisions captured as-you-go on every story) → Epic 4 (collate, completeness sweep, base-usable sign-off)

All 26 functional requirements are mapped. NFR1/NFR2 are verified as parity acceptance
criteria throughout Epics 2–3 and signed off in Epic 4; NFR3–NFR5 are realised in Epic 1's
foundation and upheld throughout; NFR6 (anti-gold-plating) and NFR7 (preserve quirks) are
cross-cutting guardrails on every story.

### Cross-cutting conventions (apply to every story, all epics)

These are standing Definition-of-Done guardrails, not one-off tasks. Each story inherits
them; they are not re-listed per story.

- **Decision capture as-you-go (FR26 / AR19).** When a story involves a non-obvious decision
  or pragmatism call (a Tailwind v4 guard, a deploy-shape confirmation, a Server/Client
  boundary judgement, a "good-enough vs gold-plating" call), it is recorded in the decision
  log / ADR set at the moment it's made — to the base-usable standard, no public polish. The
  _mechanism_ for this is established as an early story in Epic 1; the _practice_ runs
  through every subsequent story; the _collation + completeness sweep_ is Epic 4. Capture is
  never deferred to the end — Epic 4 collates a trail that already exists, it does not
  reconstruct one.
- **Anti-gold-plating (NFR6).** Stay inside the Theseus box; no redesigns, features, or
  Ariadne-scoped work.
- **Preserve quirks verbatim (NFR7).** Route-change scroll reset (FR5), email obfuscation
  (FR22), rotating job titles (FR11) are reimplemented, never "fixed".
- **Parity is the bar (NFR1/NFR2).** Every front-of-house story is verified by side-by-side
  visual/behavioural diff against the live site, both themes, desktop + mobile.

## Epic List

### Epic 1: Modern Foundation & Theming System

Stand up the greenfield Next.js 16 + React 19.2 + TypeScript (strict) project alongside the
running Gatsby build, with Tailwind v4 (CSS-first config + the border/ring/divide regression
guard), the global CSS-variable theming system via `next-themes` (both palettes, body
gradient, dark-default + persistence, the moon/sun toggle control), self-hosted fonts
(`next/font`), analytics (`@next/third-parties`), and the Metadata API root template/defaults
— all proven on a green Netlify **preview** deploy of the skeleton. Also establishes the
**decision-capture mechanism** (ADR/decision-log location + lightweight format), seeded with
Epic 1's own foundational decisions, so the trail exists from the first call onward (FR26).
Delivers a deployable, themeable foundation with the highest-risk decisions retired before
any UI is built.
**FRs covered:** FR8, FR9, FR10, FR19, FR20, FR23, FR24, FR26 _(mechanism + seed)_

### Epic 2: Persistent App Shell & Navigation

Build the chrome every route shares, inside the root `layout.tsx`: the content pane, the
desktop sidebar (portrait, name, job title, social links, nav), primary navigation, the
slide-in burger menu below `lg`, the custom scrollbar with route-change scroll-reset, the
entrance + route-transition animations, and the loading spinner. Delivers a fully navigable,
responsive shell in both themes — the shared frame, built once.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR16, FR18, FR21 _(portrait)_

### Epic 3: Content Pages at Parity

Fill the shell with the real content, page by page: Home (rotating job titles + mobile
CTA), About Me (incl. testimonials carousel), Resume (timeline + the divider SC→CSS-module
port), the Content gallery, 404, the CV PDF download, `next/image` for the portrait + content
images, the email entity-obfuscation, and per-page SEO metadata. Delivers every route
rendering its real content at byte-for-byte parity.
**FRs covered:** FR11, FR12, FR13, FR14, FR15, FR17, FR21 _(content images)_, FR22

### Epic 4: Production Cutover & Decision Capture

The irreversible switch: full per-tier side-by-side visual diff sign-off (both themes,
desktop + mobile), promote the modern build to production, retire the Gatsby build, confirm
`gtag` + deploy-on-commit are still live, and **collate** the decision/process trail
captured as-you-go throughout — a completeness sweep that confirms the ADR/decision log is
coherent and tidies it to the base-usable standard Project Ariadne will later curate (it
collates an existing trail, it does not reconstruct one). Delivers Theseus live, Gatsby gone,
and the decision trail signed off.
**FRs covered:** FR25, FR26 _(collate + sign-off)_

---

## Epic 1: Modern Foundation & Theming System

Stand up the greenfield Next.js 16 + React 19.2 + TypeScript (strict) project alongside the
running Gatsby build, retire the highest-risk decisions (Tailwind v4 + theming parity) on a
green Netlify preview, and establish the decision-capture trail — all before any UI is built.

### Story 1.1: Scaffold the greenfield Next.js 16 + TypeScript project

As the engineer migrating the site,
I want a clean Next.js 16 App Router + TypeScript project scaffolded alongside the untouched Gatsby build,
So that I have a modern, strict-typed foundation to port onto without disturbing the live site.

**Acceptance Criteria:**

**Given** the existing repository with the Gatsby site present,
**When** the new project is scaffolded,
**Then** a Next.js 16 project using the App Router, React 19.2, and TypeScript exists with `tsconfig.json` set to `strict: true`,
**And** it coexists with the Gatsby tree without altering or breaking the existing `gatsby build`.

**Given** the scaffolded project,
**When** `next build` is run,
**Then** it completes with no errors and is configured for static export (`output: 'export'`),
**And** no Gatsby, `@reach/router`, or GraphQL data-layer dependencies are present.

**Given** the scaffolded project,
**When** the dev server is started,
**Then** a minimal root `src/app/layout.tsx` and a placeholder route render locally without error.

**Given** the repository tooling,
**When** the project is committed,
**Then** Prettier (`2.8.7` config) and the Husky `pretty-quick --staged` pre-commit hook are carried over and active,
**And** no ESLint config is introduced and `npm test` remains an honest stub (no fabricated suite).

### Story 1.2: Establish the decision-capture mechanism

As the engineer (and future Ariadne curator),
I want a lightweight decision-capture mechanism in place and seeded with the decisions already made,
So that the rationale trail exists from the first decision onward and Epic 4 can collate rather than reconstruct it.

**Acceptance Criteria:**

**Given** the scaffolded repository,
**When** the decision-capture mechanism is established,
**Then** a dedicated location and a lightweight ADR/decision-log format exist, to a base-usable standard with no public-facing polish (that is Ariadne's job).

**Given** the mechanism,
**When** it is seeded,
**Then** the already-made foundational decisions are recorded with their rationale: the Next.js 16 + React 19.2 + TS-strict stack, Tailwind v4 over v3, Netlify deploy Path A, full styled-components removal, and the big-bang TS conversion.

**Given** the capture convention,
**When** documented,
**Then** it states that subsequent non-obvious decisions are recorded as-you-go (a cross-cutting Definition-of-Done item across all epics), and that Epic 4 collates the trail rather than reconstructing it.

### Story 1.3: Tailwind v4 setup with the border/ring/divide regression guard

As the engineer migrating the site,
I want Tailwind v4 configured CSS-first with an explicit guard against its border default change,
So that the styling engine is ready and the v4 `currentColor` shift cannot silently regress borders against the zero-regression bar.

**Acceptance Criteria:**

**Given** the scaffolded project,
**When** Tailwind v4 is installed and configured CSS-first (`@theme`, Oxide engine),
**Then** utility classes compile correctly in both `next dev` and `next build`,
**And** the custom `xs: 410px` breakpoint from the current site is preserved.

**Given** Tailwind v4 defaults `border`/`ring`/`divide` colour to `currentColor` (v3 used `gray-200`),
**When** the base styles are configured,
**Then** an explicit base border colour is set so default borders, rings, and dividers match the current site's appearance.

**Given** the regression guard,
**When** the setup is documented,
**Then** a per-tier audit checkpoint for every `border`/`ring`/`divide` usage is recorded (to be exercised during the Epic 2–3 tier ports), so the shift is caught by visual diffing rather than shipped.

### Story 1.4: Global CSS-variable theming token system

As a site visitor,
I want the site's colours to render exactly as they do today,
So that the migrated site is visually indistinguishable from the original in both palettes.

**Acceptance Criteria:**

**Given** Tailwind v4 and global CSS in place,
**When** the theming tokens are defined,
**Then** both the dark and light palettes are expressed as `--color-*` CSS custom properties whose values exactly match the current `darkThemeValues` / `lightThemeValues` (FR9),
**And** the Tailwind tokens (`text-secondary`, `bg-primary-400`, `border-secondary`, `text-icon-primary`, etc.) map onto those vars (FR9).

**Given** the themed body,
**When** the page renders,
**Then** the body `:before` gradient renders as `linear-gradient(var(--color-bg-secondary), var(--color-bg-tertiary))` and is visually identical to today (FR9).

**Given** no theme switching is wired yet,
**When** the app loads,
**Then** the dark palette renders by default.

**Given** the styled-components-free foundation (FR24),
**When** theming is delivered,
**Then** it uses only global CSS variables — no `createGlobalStyle`, no CSS-in-JS runtime.

### Story 1.5: Theme persistence and the moon/sun toggle (`next-themes`)

As a returning site visitor,
I want my chosen theme to persist across reloads while first-time visitors still get dark,
So that the site remembers my preference without changing the original first impression.

**Acceptance Criteria:**

**Given** the palettes from Story 1.4 and `next-themes` integrated,
**When** a first-time visitor with no stored preference loads the site,
**Then** the dark theme is applied (first-visit default unchanged from today).

**Given** a returning visitor who previously selected a theme,
**When** they reload the site,
**Then** their previously selected theme is restored (persistence on — the one accepted change, FR10).

**Given** the visitor's OS colour-scheme setting,
**When** the site loads,
**Then** `prefers-color-scheme` is **not** auto-adopted.

**Given** the theme class is applied before hydration,
**When** the page loads,
**Then** there is no flash of incorrect theme and no hydration mismatch (pre-hydration script + `suppressHydrationWarning` on `<html>`, AR18).

**Given** the moon/sun toggle control fixed top-left,
**When** it is clicked,
**Then** the theme switches between dark and light, both palettes render identically to today, and the new choice persists across reloads (FR8, FR10).

### Story 1.6: Root layout wiring — fonts, SEO metadata defaults, analytics

As a site visitor and search/social crawler,
I want the correct fonts, baseline page metadata, and analytics active on every route,
So that the site looks, indexes, and measures exactly as it does today.

**Acceptance Criteria:**

**Given** `next/font`,
**When** fonts are configured in the root layout,
**Then** Permanent Marker (fancy headings) and Roboto `400` (body) are self-hosted and applied with no layout shift, rendering identically to today (FR20).

**Given** the Next Metadata API in the root layout,
**When** defaults are set,
**Then** the title template is `%s - Zac Braddy` and default description, Open Graph tags, a Twitter summary-large-image card, and the wizard-hat favicon are wired as site-wide defaults (FR17 defaults; per-page overrides come in Epic 3),
**And** no `react-helmet` is used.

**Given** `@next/third-parties`,
**When** analytics is wired in the root layout,
**Then** `<GoogleAnalytics gaId="G-F98QXJC4S0" />` is present and fires on the deployed site (verified on the preview, FR19).

### Story 1.7: Netlify Path A deploy config and verified green preview

As the engineer migrating the site,
I want the static-export Netlify deploy configured and a green preview of the skeleton verified,
So that the highest-risk foundation (stack, theming, deploy shape) is proven live before any UI is built — and deploy-on-commit is preserved.

**Acceptance Criteria:**

**Given** Netlify deploy Path A,
**When** `next.config` is configured for static export with a custom `next/image` `loaderFile` targeting the Netlify Image CDN (`/.netlify/images?url=…&w=…&q=…`),
**Then** the build produces a static bundle with no serverless functions, and images resolve via the CDN loader.

**Given** the existing GitHub `main` → Netlify integration,
**When** the Netlify project is configured,
**Then** Next.js is auto-detected and the deploy-on-commit hook is preserved (NFR4); no host migration occurs.

**Given** a push to a branch / PR,
**When** Netlify builds it,
**Then** a green **preview** deploy renders the skeleton — themed (both palettes), correct fonts, working toggle with persistence, analytics firing — with no build or runtime errors.

**Given** this is the pre-UI checkpoint,
**When** the preview is verified,
**Then** the production cutover is explicitly **not** performed here (that is Epic 4).

---

## Epic 2: Persistent App Shell & Navigation

Build the chrome every route shares, inside the root `layout.tsx`: the content pane, the
desktop sidebar, primary navigation, the mobile burger menu, the custom scrollbar with
route-change reset, the entrance/transition animations, and the loading spinner — a fully
navigable, responsive shell in both themes, built once.

### Story 2.1: Persistent layout shell, content pane, and animations

As a site visitor,
I want the same animated content frame to wrap every page,
So that navigating the site feels exactly as polished and consistent as it does today.

**Acceptance Criteria:**

**Given** the foundation from Epic 1,
**When** the root `src/app/layout.tsx` is built,
**Then** it wraps every route with the established structure — a content pane (and, at `lg`+, space for the left sidebar) — matching today's layout and responsive behaviour (FR1).

**Given** a page loads,
**When** it first renders,
**Then** the initial fade-up-in entrance animation plays exactly as today (FR7).

**Given** the visitor navigates between routes,
**When** the route changes,
**Then** the per-page transition animation plays as today (FR7),
**And** the animation is implemented as plain CSS `@keyframes` in a CSS Module behind a `'use client'` wrapper (porting the old styled-components `AnimatedContainer`, AR15) — no CSS-in-JS runtime,
**And** the existing plain-CSS animation tokens (`animations.js`, `animate-on-change.css`) are reused, not redefined.

### Story 2.2: Primary navigation and the Download CV action

As a site visitor,
I want the same navigation options and a CV download exactly where they are today,
So that I can move around the site and grab Zac's CV without any change to the experience.

**Acceptance Criteria:**

**Given** the navigation,
**When** it renders,
**Then** it exposes Home, About Me, Resume, and Content I've Created with identical labels, icons, order, and destinations to today (FR2),
**And** the active route is reflected using `usePathname` from `next/navigation` (client only, AR8).

**Given** the Download CV action,
**When** it renders,
**Then** it appears with its current label/icon and the CV PDF is available at its current path, served from `public/` (AR10),
**And** activating it downloads the same PDF with the same behaviour as today (FR16).

**Given** the nav is consumed by both the desktop sidebar and the mobile menu,
**When** it is built,
**Then** it is a single shared component (no duplicate nav definitions), so later stories compose it rather than re-implement it.

### Story 2.3: Desktop sidebar (`lg` and above)

As a desktop visitor,
I want the left sidebar with Zac's portrait, identity, socials, and navigation,
So that the desktop layout is identical to the current site.

**Acceptance Criteria:**

**Given** a viewport at `lg` and above,
**When** the page renders,
**Then** the left sidebar shows the portrait, name, job title, social links, and the navigation, with the same layout and breakpoints as today (FR4).

**Given** the portrait image,
**When** it renders,
**Then** it is served via `next/image` with correct intrinsic `width`/`height` (no layout shift, FR21 portrait, AR17).

**Given** the social profile links (Twitter, LinkedIn, GitHub),
**When** they render,
**Then** they point to the current URLs and open in a new tab (FR18).

**Given** the navigation from Story 2.2,
**When** the sidebar is built,
**Then** it composes that shared nav component rather than redefining it.

### Story 2.4: Mobile burger menu (`below lg`)

As a mobile visitor,
I want the slide-in burger menu to behave exactly as it does today,
So that navigating on a small screen is unchanged.

**Acceptance Criteria:**

**Given** a viewport below `lg`,
**When** the page renders,
**Then** the navigation is collapsed behind the burger trigger, with the same trigger and placement as today (FR3).

**Given** the burger trigger,
**When** it is activated,
**Then** the menu slides in with the same animation as today,
**And** menu open/close state is managed via the `MenuOpenContext` provider inside a `'use client'` boundary (AR14).

**Given** the menu is open,
**When** the visitor selects an item,
**Then** the app navigates to that destination **and** the menu closes (FR3).

### Story 2.5: Custom scrollbar with route-change scroll reset

As a site visitor,
I want the custom scrollbar and the scroll-to-top-on-navigation behaviour preserved,
So that scrolling and page changes feel exactly as they do today.

**Acceptance Criteria:**

**Given** the content pane,
**When** content overflows,
**Then** the custom scrollbar renders and behaves as today (FR5),
**And** it is implemented in a `'use client'` boundary (AR14).

**Given** the visitor has scrolled down a page,
**When** they navigate to another route,
**Then** the scroll position resets to the top (FR5),
**And** this intentional reset behaviour (today driven by `setCurrentScrollPos(Math.random())`) is reimplemented faithfully — not removed or "fixed" as dead/random code (NFR7).

### Story 2.6: Loading spinner

As a site visitor,
I want a loading indicator until the page is ready,
So that the perceived loading experience matches today.

**Acceptance Criteria:**

**Given** a page is not yet ready,
**When** the visitor is waiting,
**Then** the loading spinner displays as it does today (FR6).

**Given** the page becomes ready,
**When** rendering completes,
**Then** the spinner is removed.

---

## Epic 3: Content Pages at Parity

Fill the shell with the real content, one route at a time, at byte-for-byte parity: Home,
About Me, Resume, Content, and the 404 page. Content organisms render as Server Components;
only the interactive bits (rotating titles, testimonials carousel) are `'use client'`.

### Story 3.1: Home page (`/`)

As a site visitor,
I want the home page with Zac's name, the cycling job titles, and the mobile call-to-action,
So that the landing experience is identical to today.

**Acceptance Criteria:**

**Given** the home route,
**When** it renders,
**Then** it shows Zac's name and the rotating job-title animation, cycling the existing title list (from `src/config`) on the existing interval (FR11),
**And** the rotation is implemented in a `'use client'` leaf (AR14), reusing the existing config values — the cycling is intentional flair, preserved verbatim (NFR7).

**Given** a viewport below `lg`,
**When** the home page renders,
**Then** the "Take a look around" call-to-action appears and, when activated, opens the menu (FR11).

**Given** a viewport at `lg`+,
**When** the home page renders,
**Then** the mobile-only CTA is not shown, matching today.

**Given** the page metadata,
**When** the route is served,
**Then** its title (via the `%s - Zac Braddy` template), description, and Open Graph/Twitter tags match today's home page (FR17).

### Story 3.2: About Me page (`/about-me`)

As a site visitor,
I want the About Me page with all its sections and interactions intact,
So that I read the same content and use the same testimonials carousel as today.

**Acceptance Criteria:**

**Given** the about-me route,
**When** it renders,
**Then** it shows the About Me, What I Do, Testimonials, and Things I Like sections with their existing content and structure (FR12).

**Given** the email shown in the About Me section,
**When** it renders,
**Then** it preserves the anti-scrape HTML-entity obfuscation (e.g. `…&#0064;…`) exactly — not "cleaned up" to a plain address (FR22, NFR7).

**Given** the testimonials carousel,
**When** the visitor interacts with it,
**Then** it behaves exactly as today,
**And** it is implemented as a `'use client'` leaf while the surrounding content renders on the server (AR14).

**Given** the page metadata,
**When** the route is served,
**Then** its title, description, and OG/Twitter tags match today's about-me page (FR17).

### Story 3.3: Resume page (`/resume`)

As a site visitor,
I want the Resume page with the experience timeline, certifications, and skills,
So that I see Zac's career history exactly as presented today.

**Acceptance Criteria:**

**Given** the resume route,
**When** it renders,
**Then** it shows the Experience timeline, Certifications, and the Other Skills/Knowledge list with the same content and structure as today (FR13).

**Given** the timeline divider (today a static-CSS styled-components `styled.div`),
**When** the timeline renders,
**Then** the divider is reimplemented as a CSS Module and is visually identical, with no CSS-in-JS runtime remaining (AR15, FR24).

**Given** the page metadata,
**When** the route is served,
**Then** its title, description, and OG/Twitter tags match today's resume page (FR17).

### Story 3.4: Content page (`/content`)

As a site visitor,
I want the Content gallery with every item, thumbnail, and external link,
So that I can browse Zac's created content exactly as today.

**Acceptance Criteria:**

**Given** the content route,
**When** it renders,
**Then** it shows the gallery of content items — Tabs & Spaces podcast, the Manning course, conference talks, the Medium blog, podcast-guest appearances, YouTube, and the former community-creator item — each with its thumbnail, copy, and alternating layout, in the same order as today (FR14).

**Given** each content item's thumbnail,
**When** it renders,
**Then** it is served via `next/image` with correct intrinsic `width`/`height` and no layout shift (FR21 content images, AR17).

**Given** each content item's external link,
**When** the visitor activates it,
**Then** it opens the correct destination in a new tab, as today.

**Given** the page metadata,
**When** the route is served,
**Then** its title, description, and OG/Twitter tags match today's content page (FR17).

### Story 3.5: 404 page

As a site visitor who hits an unknown URL,
I want the existing not-found page,
So that a wrong link behaves exactly as it does today.

**Acceptance Criteria:**

**Given** a request for an unknown route,
**When** the app resolves it,
**Then** the existing not-found page renders with the same content and layout as today (FR15), via the App Router `not-found` convention.

**Given** the 404 page metadata,
**When** the page is served,
**Then** its title follows the `%s - Zac Braddy` template, matching today's behaviour (FR17).

---

## Epic 4: Production Cutover & Decision Capture

Verify parity tier-by-tier, flip production from the Gatsby build to the modern build,
retire Gatsby, and sign off the decision trail captured throughout — the irreversible switch
and the project close-out.

### Story 4.1: Full per-tier visual and behavioural parity sign-off

As the engineer migrating the site,
I want a complete tier-by-tier parity verification against the live site before cutover,
So that I can prove zero visual and functional regression before the irreversible production switch.

**Acceptance Criteria:**

**Given** the completed migration on a preview deploy,
**When** parity is verified,
**Then** a side-by-side comparison per component tier (atoms → molecules → organisms → pages) shows no perceptible visual regression in **both** themes, on **desktop and mobile** across the responsive range (including the custom `xs: 410px` breakpoint) (NFR1, AR7).

**Given** the Tailwind v4 border/ring/divide regression guard from Story 1.3,
**When** the audit checkpoint is exercised,
**Then** every `border`/`ring`/`divide` usage is confirmed to match the current site (no silent `currentColor` shift) (AR3).

**Given** every functional behaviour from the FRs,
**When** each is exercised on the preview,
**Then** it is verified identical to today, with the single accepted exception of theme persistence (FR10) (NFR2).

**Given** a parity defect is found,
**When** sign-off is attempted,
**Then** cutover is blocked until the defect is resolved — this story is a hard gate before Story 4.2.

### Story 4.2: Production cutover and Gatsby retirement

As the site owner,
I want the modern build promoted to production and the Gatsby build retired,
So that `zackerthehacker.com` is served by Next.js with deploy-on-commit and analytics intact.

**Acceptance Criteria:**

**Given** a green parity sign-off from Story 4.1,
**When** the cutover is performed,
**Then** the Next.js + TypeScript build is the live production site at `zackerthehacker.com`, served via Netlify from `main` (FR25).

**Given** production is live on the modern build,
**When** deploy-on-commit is checked,
**Then** a commit to `main` triggers a Netlify production deploy end-to-end, exactly as before (NFR4).

**Given** production is live,
**When** analytics is checked,
**Then** Google Analytics (`gtag` `G-F98QXJC4S0`) is firing on the live site (FR19 confirmed in production).

**Given** the cutover is complete and verified,
**When** the Gatsby build is retired,
**Then** the old Gatsby build/config no longer serves production and no Gatsby, `@reach/router`, or GraphQL dependency remains in the deployed app (FR23, FR25).

### Story 4.3: Collate and sign off the decision/process trail

As the future Ariadne curator,
I want the as-you-go decision trail collated and confirmed coherent,
So that Ariadne can build the public "backroom" case study later without archaeology.

**Acceptance Criteria:**

**Given** the decision-capture mechanism (Story 1.2) and the as-you-go capture convention,
**When** the trail is reviewed at project close,
**Then** a completeness sweep confirms the ADRs/decision log cover the project's material decisions and pragmatism calls, with their rationale (FR26).

**Given** the collated trail,
**When** it is finalised,
**Then** it is coherent and to a base-usable standard for Ariadne — collated and tidied, **not** reconstructed, and with no public-facing polish (that is Ariadne's scope) (FR26, AR19).

**Given** the project's scope discipline,
**When** the trail is signed off,
**Then** it confirms no Ariadne-scoped work, redesigns, or speculative improvements were introduced during Theseus (NFR6).
