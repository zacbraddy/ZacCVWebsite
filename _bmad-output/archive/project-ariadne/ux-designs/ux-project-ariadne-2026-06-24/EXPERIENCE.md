---
name: Ariadne Backroom
description: How the Backroom and its entry points behave — IA, microcopy, component behaviour, states, accessibility, and journeys. Visual identity lives in DESIGN.md.
status: final
created: 2026-06-24
updated: 2026-06-24
sources:
  - prd-project-ariadne-2026-06-23/prd.md
  - _bmad-output/project-context.md
---

# Ariadne Backroom — Experience Spine

> Front-of-house behaviour is **frozen** (zero regression — UJ-1). This spine covers only what
> Ariadne adds: the Backroom, the Entry link, and the Console easter egg. Visual specs live in
> `DESIGN.md`; this spine specifies the behavioural delta. Both spines win over any mock on conflict.

## Foundation

A statically-exported Next.js 16 App-Router site (`output: 'export'` → `out/`), React 19 Server
Components by default, theming via CSS variables + `next-themes`, atomic-design tiers, no test
framework. There is **no UI library** — the "system" the Backroom inherits is the site's own existing
components, theme tokens, and patterns (the vaul mobile drawer, the custom scroll/route-transition
shell, `next/image`). The Backroom must render **fully at build time** — the Markdown pipeline runs
at build, every Backroom route is `○ (Static)`, no server runtime. The Markdown pipeline library
choice (MDX / next-mdx-remote / react-markdown + a highlighter) is **deferred to architecture**; this
spine constrains its _behaviour_, not its implementation.

## Information Architecture

| Surface                                          | Reached from                        | Purpose                                                                              |
| ------------------------------------------------ | ----------------------------------- | ------------------------------------------------------------------------------------ |
| Front-of-house (Home, About-me, Resume, Content) | CV links, LinkedIn                  | **Unchanged.** The recruiter credibility gate + CV download (UJ-1).                  |
| Entry link                                       | Bottom-left page chrome, every page | The understated door into the Backroom (FR-10).                                      |
| Console easter egg                               | Browser dev-tools console           | The second, playful door — links to Backroom + repo (FR-11).                         |
| **Backroom — Overview**                          | Entry link / egg / `back`-then-in   | Landing page: what the Backroom is + the sales-pitch framing (the "Start here" doc). |
| **Backroom — doc page**                          | Overview / nav row                  | A single Public doc rendered to themed HTML (FR-7).                                  |
| Back to the site                                 | Top of Backroom nav                 | The single exit affordance back to front-of-house.                                   |

**Backroom nav structure (sectioned, FR-8):**

```
◀ back to the site
OVERVIEW                ★  Start here
DECISIONS               04 Framework decision · 09 … (numbered ADRs)
PRAGMATISM & PROCESS    ◆  Deferring the polish · ◆ Building with AI & BMAD
```

The Overview is the default/landing surface. Every doc in `docs/` produces one static Backroom route.
Nav rows carry: tile (number ★/◆) + heading + one teaser line. **No search/filter in v1** (NON-GOAL;
the set is small) — revisit only if the set grows unwieldy.

**Surface closure:** UJ-1 → front-of-house (unchanged). UJ-2 → Entry link/egg → Overview → doc pages.
UJ-3 → `docs/`-as-source means a new markdown file _is_ a new nav row + route on next deploy, no
plumbing. Every stated need has a surface; every surface has a journey that lands there.

→ Composition reference: `mockups/backroom-mock.html` (desktop two-pane), `mockups/console-egg-mock.html`
(console egg). Spine wins on conflict.

## Voice and Tone

Microcopy. Brand voice lives in `DESIGN.md.Brand & Style`. British spelling throughout. The Backroom
voice is **competent and candid** — plain, judgement-forward, never bragging.

| Do                                                                                                                | Don't                                              |
| ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| "More interested in how this site is built? →"                                                                    | "Check out my awesome engineering blog!"           |
| "◀ back to the site"                                                                                              | "Return to homepage"                               |
| "Why Next.js — and why not Astro" (teaser)                                                                        | "An exploration of modern framework choices"       |
| Overview: "Here's how the decisions were actually made — trade-offs and all."                                     | "Welcome to my portfolio of technical excellence." |
| Call-out: "The pragmatism call: the right tool is the one a sole maintainer can still reason about in 18 months." | "Best practices were followed."                    |
| Egg: "Ah, I see you're also a tech wizard. Well — while you're here, you may as well come in."                    | "Congrats, you found the secret! 🎉🎉"             |

**Section labels:** `OVERVIEW`, `DECISIONS`, `PRAGMATISM & PROCESS`. **Egg copy:** casual,
charming-not-cringe; structure (wizard + bubble + two links + wink) is locked, exact wording is an
implementation-time tweak — must stay casual and keep both links.

## Component Patterns

Behavioural. Visual specs live in `DESIGN.md.Components`.

| Component              | Behavioural rules                                                                                                                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nav row**            | Whole row is one link to its doc route. Hover: faint wash. Current doc = `selected` (cyan tint + accent bar + inverted tile) and `aria-current="page"`. Keyboard-focusable; Enter/click navigates.                        |
| **Sectioned nav**      | Static grouping (Overview / Decisions / Pragmatism & process). Order: Overview first, then ADRs by number, then process docs. New `docs/` file slots into its section on next build — no manual nav edit.                 |
| **Back link**          | `◀ back to the site` returns to front-of-house (home or last front-of-house route — default home). Always present at top of nav.                                                                                          |
| **Entry link**         | Front-of-house only, every page (in `layout.tsx`). Real `<a>`/`<Link>`, keyboard-accessible, works in static export. Navigates to the Backroom Overview. Never shown inside the Backroom (you have `back` there instead). |
| **Doc renderer**       | Renders one `docs/` markdown file: headings, lists, links, tables, code. Internal doc-to-doc links resolve within the static export. GA page-view fires on navigation (existing setup, no new wiring).                    |
| **Code block**         | Fenced code renders syntax-highlighted, highlighting present in the **prerendered HTML** (no reliance on client JS where feasible), theme-consistent.                                                                     |
| **Console easter egg** | Emitted via `console.*` on page load. ASCII wizard + speech bubble + two clickable links (Backroom route, public GitHub repo) + a dim wink line. Single static message — no multi-stage sequence (NON-GOAL).              |

## State Patterns

| State                       | Surface           | Treatment                                                                                                                                                           |
| --------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Default entry               | Backroom          | Lands on **Overview** ("Start here"), nav row selected.                                                                                                             |
| Reading a doc               | Backroom doc page | That doc's nav row is `selected` / `aria-current`; content pane scrolls independently of nav.                                                                       |
| Single / few docs           | Backroom          | Nav shows whatever exists; sections with no docs are omitted (don't render an empty `DECISIONS` group). v1 set is the Representative first cut, deliberately small. |
| Mobile                      | Backroom `< lg`   | Nav hidden in portal; full nav (back + sections + rows) lives in the vaul hamburger drawer; content full-width.                                                     |
| Theme toggle                | Backroom          | Dark/light toggle works exactly as front-of-house; all Backroom surfaces respond, no hardcoded colours.                                                             |
| Egg before dev-tools opened | Console           | Message emitted on load; browsers retain it and show it when the console is opened later. Dev-tools-open re-emit only as an evidence-driven fallback (per FR-11).   |
| Broken internal doc link    | Backroom          | Should not occur (build-time render); if a referenced doc is absent, the link must not 404 the build — verify during the story.                                     |

## Interaction Primitives

- **Navigation is link-based**, not app-state — every doc is a real static route; browser back/forward
  and deep-links work.
- **Keyboard:** Tab reaches the Entry link, the `back` link, and every nav row in reading order;
  Enter activates. The mobile drawer is keyboard-operable (inherits the existing `MobileMenu`).
- **Scroll:** nav panel and content pane scroll independently at `lg+`; route change resets scroll
  (existing `react-custom-scroll` behaviour).
- **Theme toggle** remains in its top-left chrome position site-wide, including the Backroom.

**Banned in v1:** search/filter, diagrams, interactive widgets, bespoke per-doc animation, multi-stage
console sequences, any new analytics events. (All explicit NON-GOALs / counter-metrics.)

## Accessibility Floor

Behavioural. Visual contrast lives in `DESIGN.md`.

- Backroom pages use **semantic HTML** (headings in order, `nav`, `main`, lists, `<a>`), readable and
  keyboard-navigable end to end.
- The **Entry link** is a real, keyboard-accessible link with discernible text — discoverable by
  screen-reader users even though it's visually understated.
- The current doc's nav row carries `aria-current="page"`; the nav is a labelled landmark.
- Code blocks remain readable as text (highlighting is presentational, not the only signal).
- **Contrast:** the Entry link sits on the page gradient — its treatment must clear AA against the
  full gradient in **both** themes (verify against the gold/terracotta end). All other Backroom text
  inherits the site's themed tokens.
- Tab order matches reading order; focus is visible (inherits site focus styles).

## Responsive & Platform

| Breakpoint       | Behaviour                                                                                                                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `≥ lg` (1024px+) | Backroom two-pane: {nav 320px} + content. Entry link in bottom-left page chrome. Theme toggle top-left.                                                                                                                   |
| `< lg`           | Single column. Backroom nav hidden in portal → moves into the vaul hamburger drawer (back link + sections + rows). Entry link relocates into that drawer as a quiet item (no page chrome to host it). Content full-width. |

Mirrors the front-of-house mobile pattern (the site's nav is already `lg:`-only + vaul drawer). The
`xs: 410px` custom breakpoint applies as elsewhere. This is a web site, not a native app.

## Key Flows

### Flow 1 — Sam clears the gate (recruiter, mobile, 2 seconds) — UNCHANGED

1. Sam opens the site from a CV link on his phone.
2. Front-of-house loads with full flash — rotating job title, animations, clean mobile layout.
3. He skims, thinks "real deal," taps **Download CV**, gets the current PDF, leaves.
4. **Climax (a non-event by design):** he never sees the Entry link, never opens a console, never
   suspects a Backroom exists. The gate is intact and **zero-regression** — that is the success
   condition for this flow.

### Flow 2 — Dana goes through the side door (tech lead evaluating a modernisation hire) — UJ-2

1. Dana lingers past the flash, reading the About-me copy properly.
2. Bottom-left, on the gradient, she notices the quiet line: _"More interested in how this site is
   built? →"_. (Or — being the sort who opens dev-tools on a portfolio — she trips the **console
   wizard** instead, and clicks through from there.)
3. She clicks in. The front-of-house sidebar gives way to the **Backroom**: a calm two-pane reading
   room, `◀ back to the site` top-left, a sectioned nav of decision rows on the left, the **Overview**
   open on the right explaining what this is and what it's meant to show.
4. She scans the **DECISIONS** rows — the cyan number tiles, the teasers — and opens **04 Framework
   decision**. She reads why Gatsby → Next.js, and crucially why _not_ Astro; a gold pragmatism
   call-out names the trade-off in one sentence. She opens **Deferring the polish** and sees the same
   honesty about protecting delivery.
5. **Climax:** she comes away with the answer to the buying question — _this person reasons about
   trade-offs and keeps delivery first_ — not from a claim, but from reading the decisions themselves.
   She follows **→ The source** to the public repo, confirms the code is real, and closes the tab
   convinced.

Failure: she opens the Backroom on mobile → the nav isn't a second column; she taps the hamburger,
the same sectioned nav is there, she reads full-width. No dead end.

### Flow 3 — Zac extends the Backroom later (maintainer) — UJ-3

1. Months on, Zac finishes a new piece of work and curates one fresh markdown doc into `docs/`.
2. On next deploy, the build renders it to a new static Backroom route and it appears as a new nav
   row in its section.
3. **Climax:** no plumbing, no nav edit, no sync chore — `docs/` is the source, the pipeline renders
   it as-is. The site stays a short hop behind his latest thinking, which is exactly what keeps it a
   low-friction shop-window he'll actually maintain.
