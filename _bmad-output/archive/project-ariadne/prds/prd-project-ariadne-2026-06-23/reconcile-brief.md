---
title: 'Reconciliation: Brief → PRD (Project Ariadne)'
source: brief-zacs-cv-website-2026-06-10/brief.md
target: prd-project-ariadne-2026-06-23/prd.md
scope: Project 2 / Ariadne only (Project 1 / Theseus is complete, out of scope)
created: 2026-06-23
---

# Reconciliation: Brief → PRD (Project Ariadne)

Purpose: catch anything in the brief that pertains to Ariadne but is **missing, weakened, or
distorted** in the PRD — with a bias toward qualitative intent (tone, voice, positioning,
strategic feel) that a flat FR structure tends to lose. Project-1-only material is ignored.

## Overall assessment

The PRD is a strong, faithful translation. It preserves the headline qualitative pillars well:
the time-boxed "infrastructure, not the product" discipline (§1, §8, SM-C1/C2), zero
front-of-house regression, the "judgement not output" differentiator (§1, SM-3), the
delivery-first pragmatism guardrail, the one-way `docs/` derivation, the low-key entry doors, and
the positioning gradient in FR-4. Most of what follows is **shading and emphasis**, not outright
loss. There are a small number of genuine gaps worth flagging before UX / architecture / epics
run.

## Gaps and distortions

### G1 — "The artefact and the sales demo are the same object" is softened to a maintainer convenience [severity: med]

The brief's sharpest strategic claim is repeated twice and stated as identity: _"the artefact and
the sales demo are the same object"_ and _"The proof and the product are one artefact."_ This is
not just "the site documents itself" — it is that **the site is a live demo Zac actively points
prospects at during a sales conversation**, demonstrating the AI/BMAD delivery workflow he sells.

The PRD keeps "the proof and the product are one artefact" (§1) and mentions "a demo object he can
point a prospect at" only in passing, buried in the _maintainer_ JTBD (§2.1, the Zac persona). The
**active sales-demo function** — the site as a thing wheeled into a pitch to show _how he works_ —
is the strongest revenue rationale in the brief and is demoted to a parenthetical about
maintenance. No FR, success metric, or aesthetic note carries it. Risk: UX/architecture optimise
the Backroom purely for the passive "Dana lingers and reads" journey and miss the "Zac drives a
prospect through it live" use, which has different implications for narrative flow and framing.

### G2 — The AI-augmented / BMAD workflow as _visible content_ is under-specified [severity: med]

The brief makes the AI-era workflow a first-class subject, twice flagging that _"the AI-era
workflow he now sells isn't represented at all"_ (a named problem) and that the whole job
_"doubles as a live demonstration of Zac's AI-augmented (BMAD) delivery workflow."_ The brief's
differentiator is explicitly that the site is _"built with the very AI/BMAD workflow Zac sells."_

In the PRD this survives only as a vision-level aside ("built with the very AI/BMAD workflow Zac
sells," §1). Nothing in the Public-docs curation requirement (FR-6) or the Representative-first-cut
definition says the curated docs should _make the AI/BMAD-augmented way of working visible_ to a
reader. The candidate doc list (framework decision, top ADRs, pragmatism calls) is all
_architectural_ judgement; the **"how I work, AI-augmented" story** — which the brief calls out as
currently absent and a reason for the project — has no explicit hook in FR-6 or §10. Risk: the
first cut ships pure tech-decision docs and the "AI-augmented builder" narrative the brief wanted
foregrounded is silently dropped again.

### G3 — Positioning gradient is applied to FR-4 only, not to the Backroom voice [severity: low]

FR-4 captures the Builder → Modernisation → Strategy gradient precisely for the About-me summary —
excellent. But the brief frames the _entire_ showcase, including the Backroom, as evidence for the
**System Modernisation service line** specifically ("documented proof of Zac's System Modernisation
service line," "precisely the question a client buying System Modernisation is trying to answer").
The PRD's §10 Backroom tone ("competent and candid," "judgement not bragging") is right but
positioning-neutral; it doesn't say the Backroom voice should _read as a System Modernisation
specialist's reasoning_. Minor, because SM-3 and §1 gesture at the buying question, but the
positioning-gradient discipline that's so carefully applied to FR-4 isn't carried into the
content-authoring voice where it equally applies.

### G4 — "Always a short hop behind the latest tech and Zac's latest thinking" loses its industry/AI cadence [severity: low]

The brief's Vision is specific about the WIP cadence: the site stays current _"as contracts are won
and as the industry shifts (AI especially)"_ and accumulates _"further demonstrations of his
skills and an ever-richer backroom."_ The PRD's UJ-3 and §1 keep "a short hop behind his latest
thinking" and the frictionless-extension mechanism (the real, testable part), which is the right
priority. But the _flavour_ — that updates are pegged to **won contracts and industry/AI shifts**,
and that the backroom grows richer over time as a deliberate accumulation — is flattened to generic
"extend over time." Low severity (it's vision, not v1 scope), but it's the connective tissue that
ties the site back to revenue, and it's worth a line so the extension model isn't read as aimless
tinkering (which would itself violate the anti-gold-plating guardrail).

## Things checked and found faithfully carried (no action)

- Time-boxed "supporting infrastructure, not the product"; over-investment as the named failure
  mode — strongly preserved (§1, §8, SM-C1/C2). This is the brief's central discipline and the PRD
  arguably strengthens it.
- Zero visual/functional regression; flash preserved and untouched in feel — preserved (UJ-1, SM-2,
  §9, §10).
- "Process and judgement, not just output" as _the_ differentiator and the buying question —
  preserved (§1, SM-3).
- Backroom as opt-in side-door, low-key entry link + console easter egg, recruiters never pushed
  toward it — preserved (§4.4, FR-10/11, §10).
- One-way `docs/` derivation, Representative first cut (not the whole trail) — preserved (Glossary,
  FR-6, §5).
- `gtag` kept alive, explicitly _not_ a KPI; no hard analytics/traffic/conversion targets —
  preserved and carefully handled (§5, §6.2, §7, §9).
- "Why not Astro" framework decision and the "defer polish to protect velocity" pragmatism call as
  exemplar content — preserved (UJ-2, FR-6, §8).
- Hand-built end-to-end ethos — present implicitly via the self-documenting framing; not lost.

## Recommendation

Worth a light PRD touch-up before downstream workflows, focused on G1 and G2 (both med):

1. Add a line to §1 (or a dedicated JTBD) elevating the **active sales-demo** function — the site
   as a thing Zac drives a prospect through to show _how he works_ — out of the maintainer aside.
2. Add an explicit hook in FR-6 / the Representative-first-cut definition so the curated docs
   **make the AI-augmented / BMAD way of working visible**, not just the architectural decisions —
   closing the brief's named "the AI-era workflow isn't represented at all" gap.

G3 and G4 are low-severity polish — fold a positioning/voice note into §10 and a cadence clause
into the Vision/UJ-3 if convenient, but they don't block.
