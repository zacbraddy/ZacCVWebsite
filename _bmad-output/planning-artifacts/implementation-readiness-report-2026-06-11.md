---
stepsCompleted:
  [
    'step-01-document-discovery',
    'step-02-prd-analysis',
    'step-03-epic-coverage-validation',
    'step-04-ux-alignment',
    'step-05-epic-quality-review',
    'step-06-final-assessment',
  ]
readinessStatus: 'READY'
documentsIncluded:
  - 'prds/prd-project-theseus-2026-06-10/prd.md'
  - 'prds/prd-project-theseus-2026-06-10/addendum.md'
  - 'epics.md'
  - 'research/technical-project-theseus-nextjs-typescript-migration-research-2026-06-10.md'
  - 'briefs/brief-zacs-cv-website-2026-06-10/brief.md (context)'
documentsMissing:
  - 'Architecture document'
  - 'UX design document'
  - 'Dedicated story files'
---

# Implementation Readiness Assessment Report

**Date:** 2026-06-11
**Project:** Zac's CV Website — Project Theseus (Next.js + TypeScript migration)

---

## Step 1: Document Inventory

### PRD Documents

**Sharded/foldered:**

- `prds/prd-project-theseus-2026-06-10/prd.md` (13,607 bytes, 2026-06-10)
- `prds/prd-project-theseus-2026-06-10/addendum.md` (7,102 bytes, 2026-06-10)
- `prds/prd-project-theseus-2026-06-10/.decision-log.md`

### Epics & Stories Documents

**Whole:**

- `epics.md` (41,231 bytes, 2026-06-11) — newest artifact, staged in git

### Architecture Documents

- ⚠️ **NONE FOUND**

### UX Design Documents

- ⚠️ **NONE FOUND**

### Supporting Context

- `research/technical-project-theseus-nextjs-typescript-migration-research-2026-06-10.md` (23,395 bytes)
- `briefs/brief-zacs-cv-website-2026-06-10/brief.md` (7,800 bytes) + addendum

### Duplicates

- None detected. PRD exists only as foldered version; epics only as whole file.

### Missing-Document Disposition (confirmed with Zac)

- **Architecture doc absence — ACCEPTED.** Conscious decision. The technical research doc carries the migration's architectural decisions; re-stating them in a separate architecture artifact would be redundant. Not scored as a gap.
- **UX doc absence — ACCEPTED.** Theseus is a like-for-like platform migration with no meaningful UX surface to (re)design. Not scored as a gap.
- Assessment baseline = PRD + addendum + epics.md + technical research (architecture proxy), with brief as background context.

---

## Step 2: PRD Analysis

### Functional Requirements (26 total)

**A. Site shell & navigation**

- **FR1** — Persistent layout shell on every route (content pane w/ entrance animation + desktop left sidebar); identical structure & responsive behaviour to today.
- **FR2** — Primary nav exposes Home, About Me, Resume, Content I've Created + Download CV action; labels, icons, order, destinations unchanged.
- **FR3** — Below `lg`, nav collapses to slide-in burger menu; selecting an item navigates + closes menu; same trigger/animation/behaviour.
- **FR4** — At `lg`+, left sidebar shows portrait, name, job title, social links, nav; same layout & breakpoints.
- **FR5** — Content pane uses custom scrollbar; scroll resets to top on every route change (intentional — preserve).
- **FR6** — Loading spinner displays until page ready, then removed.
- **FR7** — Page entrance + route-change transition animations preserved (initial fade-up-in + per-page transition).

**B. Theming**

- **FR8** — Theme toggle (moon/sun, fixed top-left) switches dark/light; dark is default; palettes + themed body gradient identical to today.
- **FR9** — Colours driven by `--color-*` CSS custom-property tokens, not hardcoded; both palettes reproduce current values exactly incl. body `:before` gradient.
- **FR10** — **[ACCEPTED CHANGE]** Selected theme persists across reloads (`next-themes`); first-visit default remains dark; no `prefers-color-scheme` auto-adoption. The only intended functional change.

**C. Content pages (byte-for-byte content, no copy edits)**

- **FR11** — Home (`/`): name, rotating job-title animation (existing list/interval), mobile-only "Take a look around" CTA opening menu.
- **FR12** — About Me (`/about-me`): About Me, What I Do, Testimonials (incl. carousel), Things I Like — existing content/interactions.
- **FR13** — Resume (`/resume`): Experience timeline, Certifications, Other Skills/Knowledge — same content/structure.
- **FR14** — Content (`/content`): gallery of content items, each w/ thumbnail, copy, alternating layout, external link.
- **FR15** — 404: existing not-found page renders for unknown routes.
- **FR16** — Downloadable CV PDF available at current path via Download CV action (same file, same behaviour).

**D. Identity, SEO & analytics**

- **FR17** — Per-page SEO metadata preserved (title `%s - Zac Braddy` template, description, OG tags, Twitter summary-large-image, wizard-hat favicon) via Next Metadata API (not react-helmet).
- **FR18** — Social profile links (Twitter, LinkedIn, GitHub) → current URLs, open in new tab.
- **FR19** — Google Analytics (`gtag G-F98QXJC4S0`) keeps firing, via `@next/third-parties`.
- **FR20** — Web fonts (Permanent Marker headings, Roboto body) render identically.
- **FR21** — Portrait + content images served optimised & responsive (correct intrinsic dims, no layout shift) via `next/image`.
- **FR22** — Anti-scrape email entity-obfuscation preserved in encoded form (not cleaned to plain address).

**E. Modernisation outcomes**

- **FR23** — Site runs on Next.js 16 (App Router) + React 19.2 + TS 5.x `strict: true`, current deps; no Gatsby, no `@reach/router`, no GraphQL.
- **FR24** — styled-components removed entirely; theming/entrance animation/timeline divider reimplemented w/ global CSS vars, `next-themes`, CSS Modules; no CSS-in-JS runtime remains.
- **FR25** — Statically generated/exported, deployed to Netlify w/ deploy-on-commit from `main`; modern build promoted to production (cutover); Gatsby retired.
- **FR26** — Raw decision/process data (ADRs, research, reasoning, pragmatism calls) captured as byproduct to base-usable standard; no public polish (Ariadne's job).

### Non-Functional Requirements (7 total)

- **NFR1** — Zero visual regression (both themes, full responsive range incl. `xs: 410px`), verified by per-tier side-by-side diffing.
- **NFR2** — Zero functional regression (every behaviour identical, sole exception FR10).
- **NFR3** — Performance parity or better (static delivery, optimised responsive images, controlled CLS).
- **NFR4** — Deploy continuity (GitHub `main` → Netlify deploy-on-commit preserved; preview verified before cutover; no host migration).
- **NFR5** — Idiomatic Next (App Router, Server/Client boundaries, Metadata API, `next/image`, `next-themes`, Tailwind v4 CSS-first; Server Components default, interactivity at `'use client'` leaves).
- **NFR6** — Efficiency / anti-gold-plating (stay in the Theseus box; scope discipline is a first-class quality attribute).
- **NFR7** — Preserve intentional quirks verbatim (route-change scroll reset FR5, email obfuscation FR22, rotating job titles FR11).

### Additional Requirements / Constraints

- **Hard constraint:** Hosting stays on Netlify; deploy-on-commit preserved; no host shopping.
- **Constraint:** Theseus must not foreclose Ariadne (no backroom MD pipeline selection made).
- **Decided stack (addendum/research, closed):** Path A pure static export (`output: 'export'`) + Netlify Image CDN `loaderFile`; Tailwind v4 w/ border/ring/divide `currentColor` regression guard; big-bang TS conversion; clean parallel rebuild ported tier-by-tier with visual diffing.
- **Definition of Done:** 5 conditions — live prod cutover, all FRs verified at parity, per-tier visual diff clean in both themes/viewports, green preview deploy pre-cutover, decision data captured.

### PRD Completeness Assessment

- **Strong.** Requirements are numbered, stable, testable, and explicitly framed as parity requirements with one flagged accepted change (FR10). Open questions closed (OQ1 resolved). DoD is concrete and verifiable. Architecture decisions are externalised to the research doc but explicitly referenced and closed. The PRD is well-suited to traceability validation against epics.
- **Watch-items to test in epic coverage:** (a) FR26 "decision data capture" is process-y and easy to drop from epics; (b) NFR1's per-tier visual-diff method needs to appear as actual story acceptance criteria, not just a principle; (c) the Tailwind v4 border regression guard is a named risk that should surface as explicit story work.

---

## Step 3: Epic Coverage Validation

**Method:** I did not take the epics doc's own "FR Coverage Map" at face value. For each FR I traced the claim down to a concrete story with acceptance criteria that actually implements/verifies it.

### Coverage Matrix (FR → real story)

| FR   | Requirement (short)                             | Story coverage                                                 | Status     |
| ---- | ----------------------------------------------- | -------------------------------------------------------------- | ---------- |
| FR1  | Persistent layout shell                         | Story 2.1                                                      | ✅ Covered |
| FR2  | Primary navigation                              | Story 2.2                                                      | ✅ Covered |
| FR3  | Mobile burger menu                              | Story 2.4                                                      | ✅ Covered |
| FR4  | Desktop sidebar                                 | Story 2.3                                                      | ✅ Covered |
| FR5  | Custom scrollbar + route-change reset           | Story 2.5                                                      | ✅ Covered |
| FR6  | Loading spinner                                 | Story 2.6                                                      | ✅ Covered |
| FR7  | Entrance + transition animations                | Story 2.1                                                      | ✅ Covered |
| FR8  | Theme toggle + palettes                         | Story 1.4 + 1.5                                                | ✅ Covered |
| FR9  | `--color-*` token system + body gradient        | Story 1.4                                                      | ✅ Covered |
| FR10 | Theme persistence (accepted change)             | Story 1.5                                                      | ✅ Covered |
| FR11 | Home: rotating titles + mobile CTA              | Story 3.1                                                      | ✅ Covered |
| FR12 | About Me incl. testimonials carousel            | Story 3.2                                                      | ✅ Covered |
| FR13 | Resume: timeline, certs, skills                 | Story 3.3                                                      | ✅ Covered |
| FR14 | Content gallery                                 | Story 3.4                                                      | ✅ Covered |
| FR15 | 404 page                                        | Story 3.5                                                      | ✅ Covered |
| FR16 | CV PDF download                                 | Story 2.2                                                      | ✅ Covered |
| FR17 | Per-page SEO metadata                           | Story 1.6 (defaults) + 3.1–3.5 (per-page)                      | ✅ Covered |
| FR18 | Social profile links                            | Story 2.3                                                      | ✅ Covered |
| FR19 | Google Analytics                                | Story 1.6 + confirmed 4.2                                      | ✅ Covered |
| FR20 | Web fonts                                       | Story 1.6                                                      | ✅ Covered |
| FR21 | Optimised responsive images                     | Story 2.3 (portrait) + 3.4 (content)                           | ✅ Covered |
| FR22 | Email entity-obfuscation preserved              | Story 3.2                                                      | ✅ Covered |
| FR23 | Next 16 + React 19.2 + TS strict foundation     | Story 1.1 + confirmed 4.2                                      | ✅ Covered |
| FR24 | styled-components removed entirely              | Story 1.4 (theming) + 2.1 (animation) + 3.3 (divider)          | ✅ Covered |
| FR25 | Static export + Netlify cutover, Gatsby retired | Story 4.2                                                      | ✅ Covered |
| FR26 | Decision/process data capture                   | Story 1.2 (mechanism) + cross-cutting + 4.3 (collate/sign-off) | ✅ Covered |

### NFR coverage

- **NFR1 (zero visual regression)** → realised as explicit acceptance criteria in Story 4.1 (per-tier side-by-side diff, both themes, desktop+mobile incl. `xs:410px`) and as a cross-cutting DoD guardrail on every front-of-house story. ✅
- **NFR2 (zero functional regression)** → Story 4.1 functional parity gate + per-story parity criteria. ✅
- **NFR3 (performance parity)** → realised via AR4/AR5 static delivery + AR17 CLS guards (Stories 1.7, 2.3, 3.4). ⚠️ _No story carries an explicit perf/CLS acceptance check as a named gate_ — see findings.
- **NFR4 (deploy continuity)** → Story 1.7 (preview) + Story 4.2 (production deploy-on-commit confirmed). ✅
- **NFR5 (idiomatic Next)** → structurally enforced across stories (Server/Client boundaries in AR14, Metadata API, `next/image`, `next-themes`, Tailwind v4). ✅
- **NFR6 (anti-gold-plating)** → cross-cutting guardrail + Story 4.3 sign-off. ✅
- **NFR7 (preserve quirks)** → Stories 2.5 (scroll reset), 3.1 (rotating titles), 3.2 (email obfuscation) + cross-cutting. ✅

### Missing Requirements

- **None.** Every FR1–FR26 traces to at least one story with concrete, Given/When/Then acceptance criteria. No FR is "map-only".
- **No phantom requirements** — every FR in the epics exists in the PRD; the Requirements Inventory is a faithful copy. No scope drift.

### Coverage Statistics

- Total PRD FRs: **26**
- FRs covered in epics (story-level verified): **26**
- Coverage percentage: **100%**
- NFRs: 7/7 addressed; **6 with explicit acceptance gates, NFR3 (perf/CLS) addressed only via implementation guards** (minor — flagged for Step 4/5).

---

## Step 4: UX Alignment Assessment

### UX Document Status

**Not Found — and correctly so (confirmed with Zac).** Theseus is a zero-visual-regression parity migration: the live site at `zackerthehacker.com` **is** the UX/visual specification. The epics doc states this explicitly and routes all visual/interaction requirements through parity acceptance criteria (FR1–FR22, NFR1/NFR2) verified by per-tier visual diffing (AR7, Story 4.1). This is the right call — a separate UX artifact would be redundant re-description of an existing, observable reference.

### Alignment Check (does the "live site = UX spec" approach actually hold?)

- ✅ **The reference is operationalised, not hand-waved.** AR7 + Story 4.1 define a concrete verification method (side-by-side per-tier diff, both themes, desktop+mobile, incl. `xs:410px`), and Story 4.1 is a **hard gate before cutover** (Story 4.2). The visual spec is therefore checked while the Gatsby reference still exists — correct sequencing.
- ✅ **The one intentional UX change (FR10 theme persistence) is explicitly carved out** of the parity bar everywhere it appears (PRD, addendum, Story 1.5, Story 4.1). No ambiguity about what "parity" excludes.
- ✅ **Architecture supports the UX needs:** Server/Client boundary (AR14) correctly keeps interactive UX leaves (toggle, menu, scrollbar, carousel, rotating titles) as `'use client'` while content renders server-side — no UX behaviour is stranded by the rendering model.

### Warnings

- ✅ **Baseline volatility — RESOLVED (confirmed with Zac).** Theseus is built on a branch; the comparison reference is the **`main` branch run from a second checkout of the repo**, available on demand throughout the migration and at 4.1 sign-off. This is actually a stronger reference than static screenshots — it allows live, interactive, any-viewport comparison rather than fixed snapshots. No volatile-baseline risk. (The only residual nuance: cut over only after a clean diff, since retiring the Gatsby build removes the _deployed_ reference — but the branch/checkout remains the reference regardless.)

---

## Step 5: Epic Quality Review

Validated against create-epics-and-stories standards: user value, epic independence, forward dependencies, story sizing, AC quality, and migration-appropriate sequencing. Every inter-story dependency was traced.

### A. Epic Structure & User Value

| Epic | Title                                 | Verdict                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Modern Foundation & Theming System    | ⚠️→✅ Reads as a "technical foundation" epic by the strict greenfield heuristic, **but appropriate and well-bounded for a migration whose product _is_ the modernisation (FR23–26)**. Crucially it does **not** end as invisible plumbing — it terminates on a _green Netlify preview of a themed, font-correct, analytics-firing skeleton_ (Story 1.7): an observable, demonstrable artifact. Retires the highest-risk decisions first. Correct shape. |
| 2    | Persistent App Shell & Navigation     | ✅ Clear user-facing outcome (a navigable, responsive, themed shell).                                                                                                                                                                                                                                                                                                                                                                                   |
| 3    | Content Pages at Parity               | ✅ Clear user value (every route renders real content).                                                                                                                                                                                                                                                                                                                                                                                                 |
| 4    | Production Cutover & Decision Capture | ✅ Delivers the actual goal — the live modern site + signed-off decision trail.                                                                                                                                                                                                                                                                                                                                                                         |

**No technical-milestone epics that lack a demonstrable outcome.** Each epic ends on something observable.

### B. Epic Independence — ✅ PASS

- Epic 1 stands alone (deployable foundation, green preview).
- Epic 2 consumes only Epic 1 (Story 2.1: "Given the foundation from Epic 1").
- Epic 3 fills the Epic 1+2 shell.
- Epic 4 verifies/cuts over 1–3.
- **No epic requires a later epic.** The FR-map's cross-epic notes (FR17 defaults→Epic 1 / per-page→Epic 3; FR23/24 "confirmed at Epic 4") are all **backward** dependencies (later confirms earlier) — not forward references. ✅

### C. Story-Level Dependency & Sequencing — ✅ PASS (no forward dependencies found)

- **Epic 1:** 1.1 scaffold (standalone) → 1.2 capture, 1.3 Tailwind, 1.6 layout (each needs only 1.1) → 1.4 tokens (needs 1.3) → 1.5 toggle/persistence (needs 1.4) → 1.7 preview (needs all prior). Clean bottom-up; every dependency points backward.
- **Epic 2:** 2.1 shell first → **2.2 builds the nav as a single shared component**, and 2.3 (sidebar) + 2.4 (menu) explicitly _compose_ it rather than redefine — a deliberate anti-duplication ordering. 2.5/2.6 independent. ✅
- **Epic 3:** 3.1–3.5 are independent page stories, each depending only on the Epic 1+2 shell. No inter-page coupling. ✅
- **Epic 4:** 4.1 parity sign-off is an **explicit hard gate** before 4.2 cutover ("cutover is blocked until the defect is resolved"); 4.3 collates. Irreversible step correctly gated. ✅

### D. Starter Template / Greenfield-Brownfield Handling — ✅ PASS

- Architecture (AR1) specifies a greenfield `create-next-app`-style scaffold; **Story 1.1 is exactly that, placed first**, and includes strict-TS config, `output: 'export'`, and Prettier/Husky carryover. ✅
- Greenfield hygiene present: initial setup story, deploy/preview wired early (1.7), honest `npm test` stub preserved. ✅
- Brownfield/migration concerns handled: Gatsby coexistence until cutover (1.1 AC), tier-by-tier port (Epics 2–3), explicit cutover + Gatsby retirement + dependency-removal verification (4.2). ✅

### E. Acceptance Criteria Quality — ✅ Strong

- Consistent Given/When/Then BDD throughout; ACs are specific, testable, and cross-reference FR/AR/NFR IDs (excellent traceability).
- Intentional quirks pinned as explicit ACs (scroll reset 2.5, rotating titles 3.1, email obfuscation 3.2) rather than left to memory — directly mitigates the NFR7 "cleaned up by accident" risk.
- FR26 (decision capture) — the requirement most likely to be dropped — is handled unusually well: a mechanism story (1.2), a cross-cutting "capture as-you-go" DoD convention, and a collation story (4.3) that explicitly "collates an existing trail, does not reconstruct one." This is a genuine strength.

### Findings by Severity

#### 🔴 Critical Violations

- **None.**

#### 🟠 Major Issues

- **None.**

#### 🟡 Minor Concerns

1. **NFR3 (performance / CLS) has no explicit acceptance gate.** It's addressed only via embedded AR17 CLS guards in Stories 1.7/2.3/3.4. Story 4.1's sign-off covers _visual_ and _functional_ parity but names no perf/CLS check. **Recommendation:** add a lightweight "CLS + load parity vs live site (Lighthouse or manual)" acceptance criterion to Story 4.1 so NFR3 has a real gate, not just implementation intent.
2. **Visual-parity verification is back-loaded into Story 4.1** while _also_ asserted per-story via the cross-cutting "every front-of-house story is verified by side-by-side diff" convention. Slight ambiguity about where the true gate lives. AR7's intent is _incremental_ per-tier diffing during Epics 2–3; if that's deferred to 4.1, regressions surface late and expensively. **Recommendation:** make the per-tier diff an actual checkbox within each Epic 2/3 story's DoD, with 4.1 as the final consolidation sweep — not the first time diffing happens.
3. **Story 1.6 bundles three concerns** (fonts + SEO defaults + analytics). Cohesive under "root layout wiring" and each has clear ACs, so acceptable — but splitting would give cleaner per-concern tracking. Very minor; optional.

_(A prior "volatile visual baseline" concern was raised and **resolved** — Zac compares against the `main` branch run from a second checkout, a live on-demand reference. See Step 4.)_

### Best-Practices Compliance Checklist

- [x] Epics deliver demonstrable value (migration-appropriate)
- [x] Epics function independently (no forward epic deps)
- [x] Stories appropriately sized (none epic-sized, none trivial)
- [x] No forward story dependencies
- [x] "Create when needed" respected (no upfront over-provisioning; decision-capture mechanism stood up exactly when first needed, in 1.2)
- [x] Clear, testable acceptance criteria
- [x] Full FR traceability maintained (100%)

---

## Summary and Recommendations

### Overall Readiness Status

## ✅ READY FOR IMPLEMENTATION

Project Theseus is one of the cleanest planning packages I've assessed. Every functional requirement traces to a real story with concrete acceptance criteria, the epic sequencing is genuinely dependency-correct (no forward references at either epic or story level), the irreversible cutover is properly gated behind a parity sign-off, and the two deliberate documentation omissions (architecture, UX) are justified and don't leave implementation gaps. There are **no critical or major issues** — only three minor, optional polish items.

### Scorecard

| Dimension                        | Result                                |
| -------------------------------- | ------------------------------------- |
| FR coverage                      | 26/26 (100%), story-level verified    |
| Phantom/scope-drift requirements | 0                                     |
| NFR coverage                     | 7/7 addressed (6 gated, 1 guard-only) |
| Critical violations              | 0                                     |
| Major issues                     | 0                                     |
| Minor concerns                   | 3                                     |
| Epic independence                | Pass                                  |
| Forward dependencies             | None found                            |
| Starter-template handling        | Correct (Story 1.1)                   |
| Cutover gating                   | Correct (4.1 hard-gates 4.2)          |

### Critical Issues Requiring Immediate Action

- **None.** Nothing blocks the start of implementation.

### Recommended Next Steps (all optional polish — do them or proceed as-is)

1. **Add an explicit NFR3 gate.** Put a "CLS + load parity vs the `main`-branch reference" acceptance criterion on Story 4.1 so performance parity is verified, not just implied by AR17 guards. _(Highest-value of the three.)_
2. **Make per-tier visual diffing incremental.** Add the side-by-side diff (vs the `main` checkout) as a DoD checkbox inside each Epic 2/3 story, with Story 4.1 as the final consolidation sweep — so regressions surface as you port, not all at once at the gate.
3. **Optionally split Story 1.6** (fonts / SEO defaults / analytics) into separate stories for cleaner tracking. Cosmetic.

### Strengths Worth Preserving

- **FR26 (decision capture) handled exceptionally** — mechanism story (1.2) + cross-cutting as-you-go convention + collation story (4.3) that collates rather than reconstructs. This is the requirement most projects drop; here it's airtight and directly de-risks Project Ariadne.
- **Intentional quirks pinned as explicit ACs** (scroll reset, rotating titles, email obfuscation) — kills the "helpfully cleaned it up" failure mode.
- **Anti-gold-plating (NFR6) is a first-class, traceable guardrail**, not just a sentiment — well-suited to keeping this from eating contract-hunting time.

### Final Note

This assessment identified **3 issues across 1 category** (all minor, all in Epic Quality), and **zero critical or major issues**. None block implementation. The recommendations are quality polish you can apply now or skip. **Project Theseus is ready for Phase 4 implementation.**

---

**Assessment date:** 2026-06-11
**Assessor:** Implementation Readiness workflow (BMad) — facilitated for Zac
**Verdict:** READY ✅
