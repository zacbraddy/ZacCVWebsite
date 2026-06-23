---
title: 'Reconciliation: Addendum → Project Ariadne PRD'
status: review
created: 2026-06-23
---

# Reconciliation — Addendum vs Ariadne PRD

**Source input:** `_bmad-output/planning-artifacts/briefs/brief-zacs-cv-website-2026-06-10/addendum.md`
**Downstream PRD:** `_bmad-output/planning-artifacts/prds/prd-project-ariadne-2026-06-23/prd.md`

Scope of this pass: the Ariadne-relevant addendum sections — "Documentation Strategy — Two Homes,
One-Way Flow", "Backroom — UX Detail (Project 2)", the markdown-pipeline note in the framework
section, and the "Parked" section. Goal: catch anything silently dropped, especially the qualitative
ideas (tone, voice, mechanism, rationale) a flat FR list tends to lose. Deliberate deferrals are
_not_ counted as gaps.

## Headline

The PRD is a faithful and, in most respects, richer expansion of the addendum. Every concrete
mechanism (two homes, one-way derivation, the two entry doors, the console easter egg, the
delivery-first pragmatism call as documented content) is carried through and in several places
strengthened (e.g. the FR-11 console-retention mechanism is far more rigorous than the addendum's
one-liner). **No high-severity omissions.** What follows is a handful of low/medium qualitative
nuances that have thinned in translation — worth a glance, none blocking.

## Deliberate deferrals (correctly NOT gaps)

- **Markdown-pipeline library choice** (MDX / `next-mdx-remote` / `react-markdown`). Addendum flags
  it "to revisit at architecture stage"; PRD defers to `bmad-create-architecture` (§3 Glossary, §11
  Q1, §9). Intentional. ✔
- **Backroom IA & visual design** — index/nav layout, Entry-link placement/styling. PRD §11 Q2
  defers to `bmad-ux`. Intentional. ✔
- **Easter-egg ASCII art + copy** — PRD §11 Q4 defers to UX / the easter-egg story. Intentional. ✔
- **Next.js rendering strategy / hosting** from the framework note — Theseus-era concerns, already
  resolved; out of Ariadne frame. ✔

## Qualitative nuances that thinned (low/med)

### N-1 (LOW) — "Captured to a useful-for-the-active-work + solid base standard _only_"

Addendum draws a deliberate quality contrast: the raw `_bmad-output/` artefacts were captured to a
modest "useful + solid base" bar **only**, _because_ the polish was consciously deferred to Project 2.
The PRD carries the phrase into the Glossary ("Decision trail … captured to a 'useful-for-the-work +
solid base' standard, not polished") but loses the _causal link_ — that the modest capture standard
was itself the delivery-first trade-off, the flip side of the deferred-polish pragmatism call. Minor:
the deferred-polish call is captured (§8, FR-6); only the framing that these are two ends of one
decision has gone. No action strictly needed.

### N-2 (LOW) — Console easter egg as a _tradition_ with named precedent

Addendum frames the console egg explicitly as participating in a "tech-recruiting Easter-egg
tradition, à la GitHub / Stripe." PRD preserves this well (§4.4, §10, UJ-2). Fully carried. Noting
only to confirm it survived — it did.

### N-3 (LOW) — "Front-of-house stays recruiter-_flashy_; backroom is a deliberate side-door"

Addendum's exact opt-in framing ("not an audience merger … a deliberate side-door technical
evaluators _choose_ to enter. Recruiters never _have to_ encounter it.") is fully present and arguably
amplified across the PRD (Vision, §2.1, UJ-1, §10). No loss. ✔

### N-4 (MED) — "Permanent work-in-progress _by design_" (the Parked section's core idea)

The addendum's "Parked — Far-Future Ambitions" section makes one load-bearing qualitative point: the
site is **permanent WIP by design**, and far-future ambitions are _deliberately_ not planned so they
aren't mistaken for omissions. The PRD captures the _frictionless-extension_ half of this strongly
(UJ-3, §2.1 maintainer JTBD: "living, low-friction shop-window he can extend over time"). But the
explicit "by design / intentionally not planned, so don't read these absences as gaps" stance is not
stated anywhere as such. Consequence: a future reader (or a downstream agent doing its own
reconciliation) could mistake the unplanned far-future ambitions for scope that Ariadne dropped. Low
risk, but a one-line nod in §5 Non-Goals or §6.2 ("further skill demonstrations / ever-richer backroom
are intentional future WIP, not omissions") would close it cleanly. **Most actionable item here.**

### N-5 (LOW) — `docs/` "fits the repo grain" rationale

Addendum justifies the `docs/` home partly by noting `project-context.md` already designates `docs/`
as the project-knowledge folder. PRD carries this as an `[ASSUMPTION]` under FR-6 / §12 rather than as
settled rationale. Slight downgrade in confidence (rationale → assumption), but defensible given the
PRD's assumption-tagging discipline. No action needed.

## Distortions

None found. No addendum claim is contradicted or misstated in the PRD. Where the PRD adds detail
beyond the addendum (FR-11 console mechanism, GA coverage of Backroom routes, NFRs), it does so
consistently with the addendum's intent.

## Verdict

Reconciliation clean. One medium and several low qualitative nuances; the only one worth a deliberate
decision is **N-4** (make the "permanent-WIP-by-design / unplanned ≠ omitted" stance explicit so the
Parked section's intent isn't lost downstream). Everything else is either fully carried, harmlessly
thinned, or a correct deliberate deferral.
