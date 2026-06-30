# Roadmap ↔ PRD Reconciliation — Project Ariadne

**Date:** 2026-06-23
**Source input:** `scratch/ariadne-planning-roadmap.md`
**PRD:** `_bmad-output/planning-artifacts/prds/prd-project-ariadne-2026-06-23/prd.md`

## Scope of this reconciliation

The roadmap is Zac's cross-session BMAD-sequencing tracker. The bulk of it (steps 1–7,
phase ordering, the "technical research? NO / architecture? YES" judgment calls, the
"delta vs Theseus" notes) governs **downstream workflow sequencing** — UX, architecture,
epics, sprint planning. That is deliberately **out of scope for the PRD**, and the PRD
correctly defers those (markdown pipeline → architecture §11.1; backroom IA → UX §11.2).
None of that is flagged as a PRD gap.

This reconciliation checks only the roadmap's **scope/intent statements about WHAT Ariadne
is and its guardrails**, and confirms the PRD faithfully reflects them.

## Intent items checked

### 1. The two workstreams — REFLECTED ✅

Roadmap: "(A) Content refresh … pure content, non-technical" and "(B) Backroom + docs +
easter egg — the actual feature work."
PRD §4 opens with "Two workstreams: a deliberately **thin** content refresh (4.1) and the
**substantive** backroom work (4.2–4.4)." Both are fully decomposed (FR-1–5 content;
FR-6–11 backroom). Faithful.

### 2. "Content = thin epic / backroom = the meat" framing — REFLECTED ✅

Roadmap: content "keep as a **thin epic** — do not gold-plate"; epics step says
"Content = thin epic; backroom = the meat."
PRD repeatedly and explicitly enforces the thin/substantive split: §4 header ("deliberately
thin" vs "substantive"), §4.1 ("This epic must stay thin — it is the classic place to
gold-plate, and must not"), and the counter-metric SM-C1. Faithful, and arguably stronger
than the roadmap.

### 3. Anti-gold-plating / time-boxed guardrail — REFLECTED ✅ (strengthened)

Roadmap guardrail: "time-boxed supporting infrastructure, not the product. Over-investment /
gold-plating (backroom + easter-egg rabbit holes included) is itself a failure. Deliver to a
high standard, efficiently, then back to contract-hunting."
PRD carries this in §1 Vision ("time-boxed supporting infrastructure, not the product …
Over-investment — backroom and easter-egg rabbit holes especially — is itself the failure
mode"), §8 Constraints & Guardrails (whole section), and SM-C1/SM-C2. Faithful and well
amplified.

### 4. Backroom component breakdown — REFLECTED ✅

- Curated public `docs/` derived from the trail, **one-way** (process docs = source,
  `docs/` = the edit, not a mirror) → PRD §3 Glossary "Derivation (one-way)", FR-6, §5
  Non-Goals ("Not a sync system"). Faithful.
- Backroom = opt-in section rendering docs to HTML via a Next markdown pipeline → FR-7,
  §4.3. Faithful.
- Unshowy "More interested in how this site is built?" entry link → FR-10, verbatim.
- Console ASCII-art easter egg with clickable links to backroom + GitHub repo → FR-11,
  verbatim intent. Faithful.

### 5. Theseus decision trail as raw source material — REFLECTED ✅

Roadmap "Key input": `_bmad-output/archive/project-theseus/...` is Ariadne's raw source for
the public docs. PRD §3 ("Decision trail") and FR-6 anchor on exactly that path and model.
Faithful.

## Drift / observations

No **material** scope or guardrail drift. The PRD is a faithful, and in several places
stronger, expression of the roadmap's intent. Minor, non-blocking observations:

- **(LOW) PRD adds net-new scope not named in the roadmap.** FR-5 (prune Twitter link,
  "The Reactionary", dead `@zackerthehacker` handle) and FR-4's positioning rewrite are
  genuine content-refresh work the roadmap never enumerated. This is _expansion_, not a
  dropped item — it sits inside workstream (A) and is consistent with "restore the site as
  canonical, current CV home." It does mean the "thin epic" now carries 5 FRs; worth a
  sanity check at epic time that this stays thin, but it is not roadmap drift.

- **(LOW) Roadmap's "escape hatch" spike is a downstream/architecture concern, not a PRD
  gap.** The roadmap's targeted-spike fallback (if two pipeline options look equal) lives in
  the architecture step. The PRD correctly defers the pipeline choice (§11.1) without
  pre-committing, which is the right altitude — no action needed.

- **(INFO) Roadmap's BMAD sequencing (UX/arch/epics/sprint, research-skip) is intentionally
  absent from the PRD** and should stay absent — it is workflow plumbing, not product scope.

## Verdict

Nothing material is missing. Every roadmap scope/intent statement and the anti-gold-plating
guardrail is present in the PRD, faithfully and in several places amplified. The only deltas
are PRD-side _additions_ within workstream (A), which expand rather than contradict intent.
