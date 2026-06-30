---
title: "PRD: Project Ariadne — Zac's CV Website Content & Showcase"
status: final
created: 2026-06-23
updated: 2026-06-23
---

# PRD: Project Ariadne — Zac's CV Website Content & Showcase

## 0. Document Purpose

This PRD is for Zac (sole operator, owner, and the only implementer) and for the downstream
BMAD workflows that follow it — `bmad-ux`, `bmad-create-architecture`, and
`bmad-create-epics-and-stories`. It scopes **Project Ariadne**, the content-&-showcase project
that follows the now-complete **Theseus** migration (site live on Next.js, Gatsby retired). It is
the second of the two projects in the shared brief `brief-zacs-cv-website-2026-06-10` ("Project 2 —
Content & showcase"); read that brief and its addendum for the surrounding rationale — this PRD
builds on them and does not duplicate them. Vocabulary is anchored in §3 Glossary; features are
grouped with globally-numbered FRs nested under them; inferred decisions are tagged `[ASSUMPTION]`
inline and indexed in §9. Tech-stack rules this PRD assumes throughout live in
`_bmad-output/project-context.md`.

## 1. Vision

The CV website already does its headline job — a slick front-of-house that makes a recruiter say
"this person's the real deal," plus a downloadable CV. Theseus rebuilt the foundation underneath
(Next.js + TypeScript, current dependencies) with zero visual regression. **Ariadne makes the site
honest and complete again.** It does two things: it restores the site as Zac's _canonical, current
CV home_ — current photo, current roles, a current downloadable CV — so it stops being a stale
fallback behind LinkedIn and direct sends; and it opens a **backroom**: an opt-in section where a
technical evaluator can read _how the modernisation decisions were actually made_ — the trade-offs,
where pragmatism won and why.

That backroom is the differentiator. Most developer portfolios show _what_ was built; this one shows
_how the thinking went_ — which is precisely the question a client buying System Modernisation is
trying to answer before they hire. The proof and the product are one artefact: the site documents
its own modernisation, built with the very AI/BMAD workflow Zac sells — and because of that, the
live site doubles as a **sales demo Zac can walk a prospect through**, showing not just what he built
but how he works. That makes the AI-augmented way of working — today absent from the site entirely —
something a visitor can actually _see_, which is itself one of the jobs this project exists to fix.

Critically, Ariadne is **time-boxed supporting infrastructure, not the product.** The front-of-house
flash stays the star and stays untouched in feel; the backroom is a side-door, not a second front
door. Success is delivering both workstreams to a high standard, efficiently, and getting back to
the work that pays — hunting contracts. Over-investment — backroom and easter-egg rabbit holes
especially — is itself the failure mode this PRD is built to prevent.

## 2. Target User

### 2.1 Jobs To Be Done

- **Agency recruiter (primary):** in ~2 seconds, decide "is this person credible?" and grab a
  current CV. Won by visual flash; cannot perceive — and need never encounter — the backroom.
- **Technical evaluator / hiring manager / lead (secondary):** linger past the flash and answer
  "how does this person actually _think_?" — judgement, trade-offs, pragmatism — before recommending
  or hiring. Served by the backroom.
- **Forward-looking contract client:** weigh Zac's System Modernisation credibility; the documented
  case study is the asset.
- **Zac, the builder (maintainer & seller):** keep the site as a living, low-friction shop-window he
  can extend over time without it becoming a chore — and as a **live demo he actively drives a
  prospect through** to show how he works (the artefact and the sales demo being one object).

### 2.2 Non-Users (v1)

- **We Right Code B2B / product-marketing buyers** — served by a separate, future site. Explicitly
  out of frame here.
- **The general public / SEO traffic** — this is a credibility gate reached via CV sends and
  LinkedIn, not a destination optimised for discovery.

### 2.3 Key User Journeys

- **UJ-1. Sam the recruiter clears the credibility gate in two seconds.**
  Sam, an agency recruiter screening a shortlist, opens the site from a CV link on mobile. The
  front-of-house loads with its flash intact — rotating job title, slick animations, clean mobile
  layout. He skims, thinks "real deal," taps to download the current CV, and moves on. He never
  sees, and never needs to see, the backroom. **This journey must be preserved with zero regression
  from the live site.**

- **UJ-2. Dana the tech lead goes through the side door.**
  Dana, a hiring manager evaluating Zac for a modernisation engagement, lingers past the flash. She
  either notices the unshowy _"More interested in how this site is built?"_ link, or — being the
  sort who opens dev tools on a portfolio — finds a **console easter egg** with clickable links to
  the backroom and the GitHub repo. She enters the backroom and reads the framework decision
  (Gatsby → Next.js, and why _not_ Astro) and a documented pragmatism call. She comes away thinking
  "this person reasons about trade-offs and keeps delivery first" — exactly the buying question. She
  follows the repo link to see the code is real.

- **UJ-3. Zac extends the backroom later.**
  Months on, Zac finishes a new piece of work, curates a fresh doc from his process notes into
  `docs/`, and it appears in the backroom on the next deploy — no plumbing, no sync chore, because
  the pipeline renders `docs/` as-is. The site stays a short hop behind his latest thinking.

## 3. Glossary

- **Front-of-house** — the existing public-facing CV site (home, about-me, resume, content pages):
  the flashy, recruiter-facing surface. Unchanged in feel by Ariadne.
- **Backroom** — the new opt-in section that renders Public docs to themed HTML for technical
  evaluators. Reached only via the Entry link or the Console easter egg.
- **Decision trail** — the raw process/audit artefacts from Theseus in
  `_bmad-output/archive/project-theseus/` (ADRs, research, reasoning, pragmatism calls). The
  _source_ material; captured to a "useful-for-the-work + solid base" standard, not polished.
- **Public docs** — the curated, polished documentation under `docs/`, _derived_ from the Decision
  trail. What the Markdown pipeline renders into the Backroom.
- **Derivation (one-way)** — Public docs are an _edit_ of the Decision trail, free to deviate in
  depth and emphasis; the trail is the source, `docs/` is the product. One-way street — `docs/` is
  never synced back, and is not a mirror of the trail.
- **Representative first cut** — the bounded, high-impact subset of the Decision trail curated into
  Public docs for v1 (e.g. the framework decision, a handful of the strongest ADRs, the headline
  pragmatism calls). Not the whole trail.
- **Markdown pipeline** — the build-time mechanism that turns `docs/` markdown into static HTML in
  the Backroom. Specific library choice (MDX / `next-mdx-remote` / `react-markdown`) is deferred to
  architecture.
- **Entry link** — the unshowy _"More interested in how this site is built?"_ link from
  Front-of-house into the Backroom.
- **Console easter egg** — ASCII-art message printed to the browser console with clickable links to
  the Backroom and the GitHub repo.
- **CV parity** — on-site content (roles, experience, about-me copy, downloadable CV, photo) matches
  Zac's current CV (the staged `scratch/Zac-Braddy-20260522.pdf`).
- **Canonical CV home** — the site being current enough to be the authoritative place Zac points
  people to for his CV, rather than a stale fallback behind LinkedIn / direct sends.

## 4. Features

Two workstreams: a deliberately **thin** content refresh (4.1) and the **substantive** backroom
work (4.2–4.4). FRs are numbered globally.

### 4.1 Content Refresh — restore Canonical CV home

**Description:** Bring the Front-of-house to CV parity using assets already staged in `scratch/`,
with **zero change to the site's structure, design, or flash** — this is data, copy, and asset
swaps, not redesign. Realises UJ-1 (the gate still works, now with current content). The staged
inputs are `scratch/avatar pic zac.jpg` (new portrait) and `scratch/Zac-Braddy-20260522.pdf`
(current CV). On-site copy is brought into line with that CV. This epic must stay thin — it is the
classic place to gold-plate, and must not.
[ASSUMPTION: the staged scratch/ assets are final and approved for publishing as-is.]
[ASSUMPTION: parity is achievable via data/config/asset/copy edits only — no new front-of-house
sections or layout changes are required.]

**Functional Requirements:**

#### FR-1: Update the portrait photo

Zac can replace the site's portrait with the new staged image, served through the existing
`next/image` + Netlify-loader path. Realises UJ-1.

**Consequences (testable):**

- The new portrait appears wherever the old one rendered (home / about-me), via `next/image`, not a
  raw `<img>`.
- `npm run build` produces a clean static export; the image renders correctly via the Netlify CDN in
  a deploy preview.

#### FR-2: Replace the downloadable CV

Zac can replace the downloadable CV asset with `Zac-Braddy-20260522.pdf` so the site serves the
current document. Realises UJ-1.

**Consequences (testable):**

- The CV download link resolves to the new PDF; the old PDF is removed (not orphaned in the bundle).
- The download works from the live/preview build.

#### FR-3: Bring roles/experience and job titles to CV parity

Zac can update the site's roles/experience and the rotating job titles in `src/config/index.ts` so
the site reflects the current CV. Realises UJ-1, and the Canonical CV home job.

**Consequences (testable):**

- Tweakable values (job title/titles) are changed in `src/config/index.ts`, not hardcoded into
  components.
- The experience/roles shown on-site match the roles in the staged CV (no missing recent roles).
- British spelling preserved.

#### FR-4: Refresh the About-me stats and summary

Zac can update the About-me page (`src/components/organisms/about-me.tsx`) so the stat row and the
summary copy reflect who he is and what he offers _now_. The stats need factual correction (Age is
"39", should be 41); the summary currently reads as the **old** positioning ("technology leader… as
a CTO… strategic vision") and must be rewritten to the current We Right Code positioning. Realises
UJ-1.

**Consequences (testable):**

- The Age stat is corrected (39 → 41); other stats reviewed for currency.
- The summary leads with what Zac **builds** — 0-to-1 Builder & System Modernisation Specialist —
  not "strategic technical leadership". The positioning gradient is Builder → Modernisation →
  Strategy; strategy reads as a _quality of how he builds_, never a standalone service. "Builds with
  strategy in mind" is right; "provides strategic technical leadership" is wrong.
- Copy reads as an accurate, current reflection of his offer; British spelling preserved.

**Notes:** [NOTE FOR PM] The rest of the About-me page (testimonials, what-I-do, things-I-like) is
"largely fine" per Zac — only the stats and the lead summary are in scope here, not a full rewrite.

#### FR-5: Prune stale entries

Zac can remove on-site entries that have aged out of relevance. Realises the Canonical CV home job
(keeps the site honest and current).

**Consequences (testable):**

- The **Twitter** social link is removed from `src/components/molecules/socials.tsx` and its now-unused
  `faTwitter` import is dropped (LinkedIn + GitHub remain).
- The **"The Reactionary"** content item is removed from `src/app/content/page.tsx`, and the now-dead
  `theReactionary` thumbnail mapping is cleaned up (no orphaned asset references).
- The dead-account **`creator: '@zackerthehacker'`** handle is removed from the `twitter:` card
  metadata everywhere it appears (at time of writing: `layout.tsx`, `page.tsx`, `about-me/page.tsx`,
  `resume/page.tsx`, `content/page.tsx` — the story should **re-grep for `@zackerthehacker` /
  `creator:`** rather than trust this list, which may drift). The rest of each `twitter:` card block
  (`card`, `title`, `images`) is **kept** so shared links still preview richly on X — only the
  abandoned-account pointer goes.
- `npm run build` + `npm run lint` stay green after removal (no unused-import errors).

**Out of Scope:**

- Any redesign, new section, or layout change to Front-of-house (that is non-regression territory,
  not a content task).

**Notes:** [NOTE FOR PM] The exact copy delta for FR-3 (what on-site text differs from the new CV) is
enumerated during the content story by reading `scratch/Zac-Braddy-20260522.pdf` — not pre-listed
here.

### 4.2 Public Docs Derivation — curate the Representative first cut

**Description:** Zac curates a bounded, high-impact subset of the Theseus Decision trail into
polished **Public docs** under `docs/`. This is content authoring, not site code: select the
strongest material (the framework decision and why _not_ Astro; the best ADRs; the headline
pragmatism calls including the "defer public-doc polishing to keep delivery velocity" call itself),
and edit it to put Zac's best foot forward — candid about trade-offs, showing judgement, not
bragging. Derivation is **one-way**: the trail is source, `docs/` is the edit; `docs/` is never
synced back and is not a mirror. Realises UJ-2 (this is the substance Dana reads) and UJ-3 (the
`docs/`-as-source model is what makes later extension frictionless).
[ASSUMPTION: `docs/` lives at the repo root and is the single published source the Backroom renders,
consistent with project-context designating `docs/` as the project-knowledge folder.]

**Functional Requirements:**

#### FR-6: Curate Public docs from the Decision trail

Zac can produce a set of polished markdown Public docs in `docs/`, derived from the Theseus Decision
trail, covering the Representative first cut. Realises UJ-2.

**Consequences (testable):**

- `docs/` contains polished markdown files (not raw copies of trail artefacts).
- The set includes, at minimum, the framework decision and the headline pragmatism call(s); content
  is curated/edited, deviating in depth from the source where that serves the story.
- At least part of the set makes Zac's **AI-augmented / BMAD way of working visible** — the docs show
  not just _what_ was decided but that they were produced _with_ the agentic workflow Zac sells
  (directly addressing the brief's "the AI-era workflow isn't represented at all" problem).
- Each doc reads as public-facing prose (British spelling, no internal-only audit noise).

**Out of Scope:**

- Comprehensive curation of the _entire_ trail. v1 is the Representative first cut only; the rest is
  ongoing WIP, not Ariadne scope.

**Notes:** [NOTE FOR PM] The precise doc list for the first cut is selected during this story from
the trail; the bar is "representative and strong," not "complete."

### 4.3 The Backroom — render Public docs

**Description:** A new **Backroom** section renders the Public docs in `docs/` to themed,
statically-exported HTML, reachable only via the Entry link (FR-10) and the Console easter egg
(FR-11). It inherits the site's theming (CSS-variable tokens, dark/light via `next-themes`) and
atomic-design structure, and preserves Front-of-house flash entirely — the Backroom is calmer and
content-first by design, not a second showcase. v1 is **lean: render + in-Backroom navigation +
syntax-highlighted code blocks.** Realises UJ-2, UJ-3.
[ASSUMPTION: the Backroom is fully pre-rendered at build time to `out/`, consistent with
`output: 'export'` (no server runtime / API routes).]

**Functional Requirements:**

#### FR-7: Render Public docs to themed HTML

A visitor can read each Public doc as a themed HTML page in the Backroom, generated at build time
from `docs/` markdown via the Markdown pipeline. Realises UJ-2.

**Consequences (testable):**

- Every doc in `docs/` produces a statically-exported Backroom route (`○ (Static)` in the build; no
  serverless `.func`).
- Rendered pages use the site's CSS-variable theme tokens and respond to the dark/light toggle — no
  hardcoded colours.
- Markdown features in the docs (headings, lists, links, tables, code) render correctly.
- Backroom routes are covered by the existing GA setup (page-views fire on navigation to them, like
  the rest of the site) — no new analytics wiring.

#### FR-8: Navigate between Public docs

A visitor can move between docs inside the Backroom via a simple index / navigation. Realises UJ-2.

**Consequences (testable):**

- The Backroom presents a list/index of available docs and lets the visitor open any of them.
- Navigation works within the static export (no server routing).

#### FR-9: Syntax-highlight code blocks

Code blocks in Public docs render with syntax highlighting. Realises UJ-2.

**Consequences (testable):**

- Fenced code blocks are highlighted in rendered Backroom pages.
- Highlighting is present in the prerendered HTML (works without client JS where feasible) and is
  theme-consistent.

**Out of Scope (v1):**

- [NON-GOAL for MVP] Search/filter across docs.
- [NON-GOAL for MVP] Diagrams, interactive widgets, or bespoke per-doc animations.

### 4.4 Entry Points — Entry link & Console easter egg

**Description:** Two opt-in doors into the Backroom, both deliberately low-key so recruiters are
never pushed toward it. An unshowy text link from Front-of-house, and a console ASCII-art easter egg
in the tech-recruiting tradition (à la GitHub / Stripe) that hands a curious developer clickable
links. Realises UJ-2.

**Functional Requirements:**

#### FR-10: Entry link from Front-of-house

A visitor can reach the Backroom via a _"More interested in how this site is built?"_ link that is
present but visually understated. Realises UJ-2.

**Consequences (testable):**

- The link exists on Front-of-house, navigates to the Backroom, and is styled to be discoverable but
  not attention-grabbing (does not compete with the flash).
- Keyboard-accessible and works in the static export.

#### FR-11: Console easter egg

When a visitor opens the browser console, an ASCII-art message is present with clickable links to
the Backroom and the GitHub repo. Realises UJ-2.

**Consequences (testable):**

- The console shows the ASCII-art message with working links to the Backroom and the repo.
- The message is present in the console **whenever a visitor opens dev tools** — including when they
  open them _after_ page load.
- The links resolve (Backroom route exists; repo URL is correct — the repo is public).

**Approach (mechanism — refine at architecture/story):** Emit the ASCII art via `console` on page
load. Browsers **retain** console messages logged before dev tools were opened and display them
retroactively when the console is opened, so the on-load emit is the robust primary mechanism and
satisfies "visible when they open dev tools." Verify this retention holds across target browsers
during the story; **only if** a target browser is found not to retain the buffer, add a lightweight
dev-tools-open detection that re-emits — kept as a fallback, not the default, because dev-tools
detection is heuristic and unreliable (risking missed or repeated emits). This is a deliberate
delivery-first call per §8: simplest robust path first, complexity added only on evidence it's needed.

**Out of Scope (v1):**

- [NON-GOAL for MVP] Multi-stage / interactive console sequences beyond the single ASCII-art message
  with links.

## 5. Non-Goals (Explicit)

- **Not** a We Right Code B2B / product-marketing site (separate, future build).
- **Not** a comprehensive write-up of the entire Decision trail — Representative first cut only.
- **Not** a Front-of-house redesign — zero visual or functional regression; the flash is preserved
  and untouched in feel.
- **Not** a backroom with search, diagrams, or interactive extras in v1.
- **Not** a sync system — `docs/` derivation is one-way; the Backroom never writes back to the trail.
- **Not** an analytics/KPI exercise, and **not** a new analytics system or a re-architecture of how
  GA is wired — keep the existing `gtag`/`@next/third-parties` setup as-is. New Backroom pages should
  nonetheless be **covered** by that existing setup (page-views flow through automatically) so traffic
  data is _available_ post-delivery; collecting it ≠ making it a KPI (see FR-7, §7, §9).
- **Not** introducing a test framework — the project has none (`npm test` is a stub); verification is
  `npm run build` + lint + manual/preview checks, and Ariadne does not change that.

## 6. MVP Scope

### 6.1 In Scope

- Content refresh to CV parity using the staged `scratch/` assets: new photo, current CV download,
  roles/job-titles updated, About-me stats + summary refreshed to current positioning, and stale
  entries pruned (Twitter link, "The Reactionary") — FR-1–FR-5.
- Representative first cut of Public docs curated into `docs/` (FR-6).
- Lean Backroom: render Public docs to themed static HTML, in-Backroom navigation, syntax-highlighted
  code (FR-7–FR-9).
- Entry link (FR-10) and Console easter egg (FR-11).
- Keep `gtag` analytics working, and ensure new Backroom pages are covered by it (page-views tracked
  seamlessly through the existing GA setup).

### 6.2 Out of Scope for MVP

- Comprehensive trail curation — _ongoing WIP; v1 ships the representative cut._
- Backroom search/filter — _doc set starts small; not worth the build yet._ [NOTE FOR PM] revisit if
  the doc set grows enough that navigation alone gets unwieldy.
- Diagrams / interactive / bespoke animations in the Backroom — _flash belongs front-of-house._
- Any new Front-of-house sections or redesign.
- Far-future ambitions (more skill demonstrations, an ever-richer backroom, updates as contracts are
  won and the industry/AI shifts) — the site is **permanent work-in-progress by design**, so these
  are intentionally _unplanned_, not dropped. Captured so they're not mistaken for omissions.
- **Bespoke** analytics/conversion instrumentation — custom events, funnels, dashboards, or any
  change to how GA is wired. (Basic page-view coverage of the new Backroom pages via the _existing_
  setup is in scope — see §6.1 — this excludes building anything beyond that.)

## 7. Success Metrics

Deliberately qualitative — per the brief and Zac's explicit steer, there is no marketing push to make
hard metrics meaningful, and **no time/effort target is a KPI.** Success is a quality bar, not a
number.

**Primary**

- **SM-1 — Both workstreams shipped to a high standard.** Site is at CV parity and is the canonical
  CV home again (current photo, current CV, current copy); the Backroom is live with the
  Representative first cut, navigation, syntax highlighting, the Entry link, and the Console easter
  egg. Validates FR-1–FR-11.
- **SM-2 — Zero Front-of-house regression.** No visual or functional regression versus the live site;
  flash preserved; flawless on mobile; clean static export (`npm run build` green, all routes
  `○ (Static)`). Validates FR-1–FR-5 and the §9 non-regression NFRs.

**Secondary**

- **SM-3 — The Backroom reads as judgement, not output.** A technical evaluator can, unaided, find an
  entry point, reach a curated doc, and come away with a clear sense of _how Zac reasons about
  trade-offs_ (the buying question). Validates FR-6–FR-11, UJ-2.

**Counter-metrics (do not optimise)**

- **SM-C1 — Curation/polish depth.** Do **not** optimise the Backroom toward completeness or
  ever-finer polish. Representative-and-strong beats comprehensive; effort spent past that is the
  named failure mode. Counterbalances SM-1/SM-3.
- **SM-C2 — Backroom flash.** Do **not** let the Backroom grow features/animation that compete with
  Front-of-house. Calm and content-first is the target. Counterbalances SM-3.

_Not a KPI: traffic, engagement, conversion are not success targets and are not optimised for. The
data is still **collected** — new Backroom pages flow into the existing GA — so it's available to
glance at post-delivery and to inform future decisions; it is simply not a measure of success here._

## 8. Constraints & Guardrails

**Delivery-first pragmatism (the defining discipline of this project).** Ariadne is supporting
infrastructure, and the work must behave like it:

- Simple fixes get simple solutions; complex problems that threaten to derail delivery are **deferred
  or worked around** wherever possible, not solved heroically in-line.
- Bugs and quirks encountered along the way **do** get fixed — pragmatism is not an excuse to ship
  broken things — but the project does not go looking for things to perfect.
- No naval-gazing on project structure, abstractions, or tooling. Minimum necessary complexity; no
  speculative abstractions or backwards-compat shims without a concrete reason (per the repo's own
  code guidelines).
- This guardrail is itself documented content: "deferring polish to protect delivery velocity" is an
  exemplar pragmatism call destined for the Backroom.

There is **no estimate or deadline** — the project finishes regardless. The guardrail governs _how
much_ is done, not _how fast_.

## 9. Cross-Cutting NFRs

- **Static-export compatibility (hard constraint).** The Backroom and Markdown pipeline must render
  fully at build time to `out/`. No server runtime, API routes, SSR/ISR, or middleware
  (`output: 'export'`). Markdown → HTML happens at build time.
- **Zero Front-of-house regression.** Visual and functional parity with the live site; flash intact;
  mobile flawless; route-transition animations preserved.
- **Theming & structure.** Backroom uses the CSS-variable theme tokens (dark default + `.light`),
  supports the toggle, and follows the atomic-design tiers — no hardcoded colours, no styled-
  components, components placed in the correct tier.
- **Performance.** No material Lighthouse/perf regression; the Backroom keeps a modest client-JS
  budget (favour build-time rendering and static highlighting).
- **Accessibility.** Backroom pages use semantic HTML and are readable/keyboard-navigable; the Entry
  link is keyboard-accessible.
- **Analytics continuity & coverage.** The existing GA (`G-F98QXJC4S0` via `@next/third-parties`
  `GoogleAnalytics` in `layout.tsx`) keeps working, and new Backroom pages are covered by it without
  any change to how it's wired — because the Backroom routes live under the same root layout, GA's
  automatic App-Router page-view tracking should fire for them. Verify page-views are recorded for
  Backroom routes (e.g. in GA real-time) during the story. No custom events, no re-architecture.
- **Dependency restraint.** This is a deliberately small static site — prefer existing libraries; any
  new top-level dependency (e.g. the markdown/highlighting libs) is flagged and justified, not added
  casually. The pipeline choice is the one expected new dependency and is decided at architecture.

## 10. Aesthetic & Tone

- **Front-of-house:** unchanged. Flashy, confident, the star. Ariadne must not dull it.
- **Backroom:** calmer, content-first, "competent and candid." It shows judgement and pragmatism —
  honest about trade-offs and where pragmatism won and why — without bragging. The whole showcase
  reads as **System Modernisation proof**, carrying the Builder → Modernisation → Strategy gradient:
  lead with what was built and how it was decided; strategy shows up as a quality of the work, never
  as a claim. Readable typography over spectacle. British spelling throughout.
- **Console easter egg:** playful, in the tech-recruiting easter-egg tradition (GitHub / Stripe) —
  charming, not cringe.

## 11. Open Questions

1. **Markdown pipeline choice** — MDX vs `next-mdx-remote` vs `react-markdown` (+ a syntax-highlight
   approach). _Deferred to `bmad-create-architecture`; this is a decision, not an investigation._
2. **Backroom IA & visual design** — index/navigation layout, how the Backroom frames itself, the
   Entry link placement and styling. _Deferred to `bmad-ux`._
3. **Representative first-cut doc list** — which specific trail artefacts make v1. _Selected during
   the Public-docs-derivation story; candidate set: framework decision, top ADRs, headline pragmatism
   calls._
4. **Easter-egg ASCII art** — the actual art and copy. _Designed in UX / the easter-egg story._
   (Emit mechanism resolved in FR-11: on-load `console` emit primary, dev-tools-detection re-emit
   only as an evidence-driven fallback.)
5. **On-site copy delta** — the exact difference between current site copy and the new CV.
   _Enumerated during the content story by reading the staged PDF._
6. ~~**GitHub repo visibility**~~ — **Resolved (2026-06-23):** the repo is public and will remain
   public; the Backroom/easter-egg repo link resolves for visitors.
7. ~~**Twitter/X card metadata**~~ — **Resolved (2026-06-23):** remove the dead-account
   `creator: '@zackerthehacker'` handle from the `twitter:` blocks in all five files; **keep** the
   rest of each card (`card`/`title`/`images`) so shared links still preview richly on X. Folded into
   FR-5.

## 12. Assumptions Index

- §4.1 — The staged `scratch/` assets (photo + CV PDF) are final and approved for publishing as-is.
- §4.1 — CV parity is achievable via data/config/asset/copy edits only; no new sections or layout
  changes required.
- §4.2 — `docs/` lives at repo root and is the single published source the Backroom renders.
- §4.3 — The Backroom is fully pre-rendered at build time to `out/` (consistent with
  `output: 'export'`).
- §4.4 (FR-11) — The on-load `console` emit is retained by target browsers and shown when dev tools
  are opened later (to be verified during the story; dev-tools-detection re-emit is the fallback).
