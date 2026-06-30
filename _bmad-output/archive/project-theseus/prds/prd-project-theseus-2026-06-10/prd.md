---
title: 'PRD: Project Theseus — Gatsby → Next.js + TypeScript Migration'
status: final
created: 2026-06-10
updated: 2026-06-10
codename: Theseus
project: "Zac's CV Website (Project 1 — Modernisation)"
---

# PRD: Project Theseus — Gatsby → Next.js + TypeScript Migration

## Overview

Project Theseus rebuilds Zac's CV website (`zackerthehacker.com`) on a modern stack —
**Next.js 16 + React 19.2 + TypeScript** — replacing the ageing Gatsby 5 / JavaScript
foundation, with **zero visual or functional regression**. Every dependency and the
framework itself is swapped out; the site the visitor sees is unchanged. That is the
acceptance bar and the namesake: the Ship of Theseus — every plank replaced, the same
ship.

The migration is supporting infrastructure, not the product. Its payoff is twofold:
it removes a quiet credibility liability (a real-deal engineer running their own site on
an abandoned framework) and it puts two shortlist-grade skills — **TypeScript** and a
current, in-demand framework — on display in the work itself. As a byproduct, the project
captures the raw decision/process data (ADRs, research, reasoning, pragmatism calls) that
**Project Ariadne** will later curate into a public "backroom" case study. The artefact and
the future sales demo are the same object.

This PRD specifies **Project 1 (Theseus) only**. Content refresh, the backroom, the "how
this is built" link, and the console easter-egg are **Project Ariadne** and are explicitly
out of scope here.

**Guiding principle (set by Zac):** build it the **idiomatic Next.js way**. The point of
the migration is to prove Next.js fluency, so every choice reaches for the current-best,
framework-native pattern (App Router conventions, Server/Client boundaries, Metadata API,
`next/image`, `next-themes`, Tailwind v4 CSS-first config) rather than porting Gatsby
idioms one-to-one. "Zero visual regression" governs **the output the visitor sees** — not
the preservation of internal Gatsby-isms. Where a Gatsby pattern and the idiomatic Next
pattern diverge, the idiomatic Next pattern wins.

## Goals & Non-Goals

**Goals**

- Ship the site on Next.js 16 + React 19.2 + TypeScript (strict), current dependencies,
  live in production on Netlify with deploy-on-commit intact.
- Preserve the existing front-of-house experience exactly — visual and functional parity,
  still flashy, still flawless on mobile.
- Put TypeScript and a modern framework on display as real, demonstrated skills.
- Capture raw decision/process data as a byproduct, to a base-usable standard that lets
  Ariadne build the public docs later without archaeology.

**Non-Goals**

- Content changes of any kind (copy, roles, photo, CV currency) — that is Ariadne.
- The backroom, the "how this is built" link, the console easter-egg — Ariadne.
- Public-facing documentation polish — deferred to Ariadne by design, to protect Theseus's
  delivery velocity.
- A separate We Right Code B2B / product site — a future, separate build.
- Hard analytics/conversion instrumentation beyond keeping the existing `gtag` alive.
- Any feature addition, redesign, or "while we're in here" improvement. Over-investment and
  gold-plating are a **failure mode**, not a stretch goal.

## Success Criteria

Deliberately light — this is infrastructure, not a growth product, and there is no
marketing push to make hard metrics meaningful.

- **Headline:** the migration is delivered to a high standard, **efficiently**, and live in
  production — without becoming a distraction from contract-hunting.
- **Quality bar:** modern stack live (Next.js 16 + TS, current deps); **zero visual or
  functional regression**; flash preserved; deploy-on-commit preserved; raw decision data
  captured well enough for Ariadne to proceed.
- **Counter-metric (explicit):** scope creep / gold-plating is a failure. If Theseus grows
  features, redesigns, or polishes docs, it has failed its own brief — regardless of how
  nice the result is.
- **Analytics:** existing `gtag` (`G-F98QXJC4S0`) keeps firing. Not a KPI; an occasional
  glance only.
- **Explicitly not tracked:** traffic, engagement, conversion — signals too weak to be
  worth the effort.

## Definition of Done

Theseus is done when **all** of the following hold:

1. The Next.js + TypeScript build is the **live production site** at `zackerthehacker.com`,
   served via Netlify deploy-on-commit from `main`; the Gatsby build is retired.
2. Every functional requirement below is verified at **parity** against the pre-migration
   live site (the one accepted deviation: theme persistence — FR10).
3. A side-by-side **visual diff** per component tier (atoms → molecules → organisms →
   pages) shows no perceptible regression in either theme, desktop and mobile.
4. A **preview deploy** has been verified green before the production cutover.
5. Raw decision/process data is captured to the base-usable standard (FR26).

## Requirements

Functional requirements are grouped by capability. IDs are globally numbered and stable.
The bulk of these are **parity requirements** — they describe behaviour that exists today
and must survive the migration unchanged. Group E captures the migration's own outcomes.

### A. Site shell & navigation (persistent on every route)

- **FR1** — A persistent layout shell wraps every route: a content pane with the
  established entrance animation, and (on desktop) the left sidebar. Identical structure
  and responsive behaviour to today.
- **FR2** — Primary navigation exposes: **Home**, **About Me**, **Resume**, **Content I've
  Created**, plus a **Download CV** action. Labels, icons, order, and destinations
  unchanged.
- **FR3** — Below the `lg` breakpoint, navigation collapses into a slide-in burger menu;
  selecting an item navigates and closes the menu. Same trigger, animation, and behaviour
  as today.
- **FR4** — At `lg` and above, the left sidebar shows the portrait, name, job title,
  social links, and the nav. Same layout and breakpoints.
- **FR5** — The content pane uses a custom scrollbar, and scroll position **resets to top
  on every route change**. (This reset is intentional — preserve the behaviour.)
- **FR6** — A loading spinner displays until the page is ready, then is removed.
- **FR7** — Page entrance and route-change transition animations are preserved (the
  initial fade-up-in and the per-page transition).

### B. Theming

- **FR8** — A theme toggle (moon/sun control, fixed top-left) switches between **dark** and
  **light**. **Dark is the default.** Both palettes and the themed body gradient render
  identically to today.
- **FR9** — Colours are driven by a CSS-custom-property token system (the `--color-*`
  variables), not hardcoded values. Both the dark and light palettes reproduce the current
  values exactly, including the body `:before` gradient.
- **FR10** — **[ACCEPTED CHANGE vs today]** The selected theme **persists across reloads**.
  Today's toggle is session-local and resets to dark on reload; the migration adopts
  persistent, flicker-free theming (`next-themes`). This is a deliberate UX improvement and
  the **only** intended functional change in the project. **First-visit default remains
  dark** (no `prefers-color-scheme` auto-adoption); persistence applies to returning
  visitors.

### C. Content pages (content is byte-for-byte preserved — no copy edits)

- **FR11** — **Home (`/`)**: name, the **rotating job-title animation** (cycles the
  existing title list on the existing interval), and the mobile-only "Take a look around"
  call-to-action that opens the menu.
- **FR12** — **About Me (`/about-me`)**: the About Me, What I Do, Testimonials, and Things
  I Like sections, with their existing content and interactions (incl. the testimonials
  carousel).
- **FR13** — **Resume (`/resume`)**: the Experience timeline, Certifications, and Other
  Skills/Knowledge list — same content and structure.
- **FR14** — **Content (`/content`)**: the gallery of content items (Tabs & Spaces podcast,
  Manning course, conference talks, Medium blog, podcast-guest appearances, YouTube, former
  community creator), each with its thumbnail, copy, alternating layout, and external link.
- **FR15** — **404**: the existing not-found page renders for unknown routes.
- **FR16** — The **downloadable CV PDF** remains available at its current path via the
  Download CV action (same file, same download behaviour).

### D. Identity, SEO & analytics

- **FR17** — Per-page SEO metadata is preserved: title (with the `%s - Zac Braddy`
  template), description, Open Graph tags, Twitter summary-large-image card, and the
  wizard-hat favicon. Realised via the idiomatic Next **Metadata API** rather than
  `react-helmet`.
- **FR18** — Social profile links (Twitter, LinkedIn, GitHub) point to the current URLs and
  open in a new tab.
- **FR19** — Google Analytics (`gtag` `G-F98QXJC4S0`) keeps firing on the live site,
  wired the idiomatic Next way (`@next/third-parties`).
- **FR20** — The web fonts in use today (Permanent Marker for fancy headings, Roboto for
  body) render identically.
- **FR21** — The portrait and content images are served **optimised and responsive**
  (correct intrinsic dimensions, no layout shift), via `next/image`.
- **FR22** — Any intentional anti-scrape email entity-obfuscation present today is preserved
  in its encoded form — not "cleaned up" to a plain address.

### E. Modernisation outcomes (the migration itself)

- **FR23** — The site runs on **Next.js 16 (App Router) + React 19.2 + TypeScript 5.x with
  `strict: true`**, on current, non-deprecated dependencies. No Gatsby, no `@reach/router`,
  no GraphQL data layer.
- **FR24** — **styled-components is removed entirely.** Theming, the entrance animation, and
  the timeline divider are reimplemented with global CSS variables, `next-themes`, and CSS
  Modules. No CSS-in-JS runtime remains.
- **FR25** — The site is **statically generated/exported** and deployed to **Netlify with
  deploy-on-commit from `main`** preserved; the modern build is promoted to production
  (cutover) and the Gatsby build retired.
- **FR26** — Raw decision/process data (ADRs, retained research, reasoning, pragmatism
  calls) is captured **as a byproduct of doing the work properly**, to a base-usable
  standard. No public-facing polish (that is Ariadne). This is the input Ariadne curates.

## Non-Functional Requirements

- **NFR1 — Zero visual regression.** No perceptible visual difference from the pre-migration
  live site, in **both** themes, across the responsive range (including the custom `xs:
410px` breakpoint), verified by per-tier side-by-side diffing.
- **NFR2 — Zero functional regression.** Every behaviour above is identical to today, with
  the single accepted exception of theme persistence (FR10).
- **NFR3 — Performance parity or better.** Static delivery, optimised responsive images,
  controlled CLS; no regression in load or interactivity at CV-site scale.
- **NFR4 — Deploy continuity.** The GitHub `main` → Netlify deploy-on-commit flow is
  preserved end-to-end; a preview deploy is verified before cutover. No host migration.
- **NFR5 — Idiomatic Next.** Built Next-native (App Router, Server/Client boundaries,
  Metadata API, `next/image`, `next-themes`, Tailwind v4 CSS-first config), not a 1:1 port
  of Gatsby idioms. Server Components by default; interactivity pushed to `'use client'`
  leaves.
- **NFR6 — Efficiency / anti-gold-plating.** The work stays inside the Theseus box.
  Ariadne-scoped work, redesigns, and speculative improvements are out. Scope discipline is
  a first-class quality attribute here.
- **NFR7 — Preserve intentional quirks verbatim.** Behaviours that look like bugs but are
  deliberate are kept exactly: the route-change scroll reset (FR5), the email
  entity-obfuscation (FR22), the rotating job titles (FR11). Do not "fix" them.

## Out of Scope

- All of Project Ariadne: content refresh to CV parity, restoring the site as canonical CV
  home, the curated public docs, the backroom feature, the "how this is built" link, the
  console ASCII-art easter-egg.
- Public-facing documentation polishing during Theseus.
- A separate We Right Code B2B / product-marketing site.
- Hard success/analytics instrumentation beyond keeping `gtag` alive.
- Any redesign, new feature, content edit, or speculative enhancement.

## Open Questions

None outstanding. The one prior open item is resolved:

- **OQ1 — Theme default on first visit — RESOLVED (2026-06-10).** First-time visitors (no
  stored preference) load **dark**, preserving today's first impression. Theme persistence
  is **on** for returning visitors. OS `prefers-color-scheme` auto-adoption is **not**
  enabled. This is the minimal, faithful change — see FR8 / FR10.

## Dependencies & Constraints

- **Hosting stays on Netlify** (hard constraint). Deploy-on-commit from `main` is preserved;
  no host shopping.
- **Theseus must not foreclose Ariadne.** The future backroom markdown/MDX pipeline is
  Ariadne's decision; Theseus's static-export + Netlify choices block none of the mature
  Next markdown options. No pipeline selection is made here.
- The detailed technical decisions, rationale, and migration mechanics live in the
  **technical research report** (`_bmad-output/archive/project-theseus/research/technical-project-theseus-nextjs-typescript-migration-research-2026-06-10.md`)
  and are summarised in this PRD's `addendum.md`. They are inputs to this PRD, not re-opened
  by it.
