---
baseline_commit: 760289671e1d20a028ecf9ce9a09264fa207773b
---

# Story 4.3: Collate and sign off the decision/process trail

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As the future Ariadne curator,
I want the as-you-go decision trail collated and confirmed coherent,
so that Ariadne can build the public "backroom" case study later without archaeology.

## Context & purpose (read first)

This is **the final story of Project Theseus** — the project close-out. Production is already
live on Next.js and Gatsby is retired (Story 4.2, cutover signed off GREEN 2026-06-23, PR #12).
Nothing here touches the running site, the build, or the app code. **This is a documentation
collation + completeness sweep + sign-off story — NOT a feature build, NOT a code review, NOT a
content/narrative pass.**

The whole point of the FR26 "capture as-you-go" convention was that decisions were recorded **at
the moment they were made**, on every story, so that this step **collates a complete record
rather than reconstructing one**. Your job is to **verify that promise held**: sweep the existing
trail, confirm it covers the project's material decisions and pragmatism calls with their
rationale, tidy it to a coherent base-usable standard, and confirm Theseus stayed inside its box
(no Ariadne-scoped work crept in). Then Zac signs it off and the project — and Epic 4 — closes.

**Critical anti-gold-plating guard (NFR6 — this story is the literal embodiment of it).** The
trail is deliberately **base-usable, not polished**. Turning it into a public-facing narrative,
case study, or "how this was built" docs is **Ariadne's** job and is explicitly out of scope.
**Do not reconstruct, do not gold-plate, do not write prose.** If you find a genuine gap, capture
it to the same lightweight base-usable standard the rest of the trail uses — do not invent history
to fill it, and do not polish what's already there. The most likely failure mode of this story is
an LLM "helpfully" rewriting the trail into a polished narrative. Resist that completely.

**The honesty bar carries over (from 4.1 / 4.2).** The mechanical sweep — enumerating decisions,
cross-checking coverage, verifying index integrity, normalising stale routing, flagging gaps — is
agent-doable and you should do it thoroughly. But the final **judgement** ("this trail is coherent
and base-usable for Ariadne, and Theseus stayed in scope") is **Zac's sign-off** (`[ZAC]`-marked),
exactly as the 4.1/4.2 gates were. **Do not fabricate the sign-off.** Present the sweep findings
honestly — including any gaps or ambiguities — and let Zac confirm.

### Where the decision trail lives (the surface area to sweep)

The trail is spread across five artefact families. A complete sweep must look at all five:

1. **`docs/decisions/`** — the ADR set, the project's primary decision record.
   - **26 ADRs**, `0001`–`0026`, one per material decision (MADR-lite shape via `_template.md`).
   - **`README.md`** — the index table, the Status vocabulary, the **as-you-go capture convention**,
     and the **"Inherited closed decisions"** section (decisions closed in planning, recorded by
     pointer so the sweep finds no gap: SSG-static, FR10 theme-persistence, parallel tier-by-tier
     rebuild, backroom-MDX-deferred).
   - **`_template.md`** — the ADR format.
2. **`_bmad-output/implementation-artifacts/deferred-work.md`** — the **as-you-go pragmatism-call
   and deferral log**, organised by story. Records conscious parity deviations, RESOLVED items
   (struck through with their resolution), and open items routed to Ariadne (and, historically, to
   "the Story 4.1 gate" — now closed). This is where most non-ADR pragmatism calls and the proof of
   scope discipline (deferred-not-done) live.
3. **Planning-phase decision logs** (mirror the same as-you-go convention upstream):
   - `_bmad-output/planning-artifacts/briefs/brief-zacs-cv-website-2026-06-10/.decision-log.md` (+ `addendum.md`)
   - `_bmad-output/planning-artifacts/prds/prd-project-theseus-2026-06-10/.decision-log.md` (+ `addendum.md`)
4. **Retained research** — `_bmad-output/planning-artifacts/research/technical-project-theseus-nextjs-typescript-migration-research-2026-06-10.md` (the technical-research decision table several ADRs and inherited-closed pointers cite as source).
5. **Per-story records** — each `_bmad-output/implementation-artifacts/N-M-*.md` story file's
   **Completion Notes**, **"Decisions confirmed with Zac"**, and **Change Log** sections capture
   per-story pragmatism calls and Zac's mid-story course corrections (these are the source for many
   deferred-work / ADR entries and a cross-check that nothing material went unrecorded).

## Acceptance Criteria

1. **(FR26) Completeness sweep — the trail covers the material decisions + pragmatism calls, with
   rationale.** A sweep across the five artefact families (above) confirms that every **material
   decision** and **pragmatism call / conscious parity deviation** made during Theseus has a home in
   the trail with its rationale — either as an ADR, an inherited-closed pointer, or a logged
   deferred-work / per-story entry. The ADR index (`docs/decisions/README.md`) is verified
   internally consistent: all 26 ADRs (0001–0026) are present, indexed, correctly numbered, and
   carry a valid Status; any cross-references (ADR↔ADR, ADR↔README, deferred-work↔ADR) resolve. Any
   genuine gap is either captured base-usable (not reconstructed) or explicitly flagged for Zac.
2. **(FR26, AR19) The trail is coherent and base-usable for Ariadne — collated and tidied, NOT
   reconstructed, NO public polish.** The trail reads as a coherent set a curator can pick up
   without archaeology: stale as-you-go routing is normalised (e.g. items that pointed at "the
   Story 4.1 gate" — now closed — are re-routed to their final disposition: resolved, or deferred to
   Ariadne), and the README reflects that the Story 4.3 collation is complete. No narrative,
   case-study prose, or public-facing polish is added (that is Ariadne's scope). No rationale is
   invented to "improve" an existing entry.
3. **(NFR6) Scope discipline is confirmed — no Ariadne-scoped work, redesigns, or speculative
   improvements were introduced during Theseus.** The sweep confirms that the conscious deviations
   that _did_ happen are each a **logged, Zac-approved, deliberate call** (not silent scope creep),
   and that everything Ariadne-scoped (content/copy refresh, the a11y backlog, the backroom
   narrative, speculative hardening) was **deferred, not done**. The open deferred-work items stand
   as the evidence that Theseus stayed in its box.
4. **(NFR6 + honesty bar) Honest sign-off.** The mechanical sweep is performed by the agent and its
   findings recorded honestly (gaps included). The final coherence/scope sign-off is **Zac's**, not
   fabricated by the agent. On sign-off, the story and Epic 4 close.

## Tasks / Subtasks

**This is a doc-only story. Expected edits are limited to the decision-trail artefacts themselves
(`docs/decisions/README.md`, `deferred-work.md`, this story file, `sprint-status.yaml`) — light
tidying, not rewriting. No app code, no build, no dependency change. If you find yourself editing
anything under `src/`, stop — you are out of scope.**

- [x] **Task 1 — Inventory the trail (agent) (AC: #1)**
  - [x] Read all five artefact families listed in "Where the decision trail lives" above. Build a
        working inventory of every material decision and pragmatism call you can find, and where it
        is recorded.
  - [x] Enumerate the 26 ADRs and reconcile them against the `README.md` index table: every ADR
        file `0001`–`0026` has exactly one index row, numbering is gapless, titles match, Status is
        valid (Accepted/Superseded/Proposed). Flag any mismatch.
  - [x] Confirm the **"Inherited closed decisions"** pointers (SSG-static, FR10, parallel rebuild,
        backroom-MDX-deferred) still resolve to their cited sources (research table / PRD addendum /
        epics) and that none has since been given a contradicting ADR.
- [x] **Task 2 — Completeness check: material decisions + pragmatism calls (agent) (AC: #1)**
  - [x] Cross-check the **conscious parity deviations** (the calls that stepped off strict verbatim
        parity) each have a recorded rationale. Known set to verify coverage for (non-exhaustive —
        sweep for others): `xl:mr-0` typo fix (ADR 0016); theme-toggle state-aware `aria-label`
        (Story 1.5 + deferred-work); the dark `--color-border-inverse` `fafafa`→`#fafafa`
        render-identical fix (Story 4.2 Completion Notes); the three `/content` carve-outs — Spotify
        link, YouTube casing, capital-C heading (Story 3.4); `/404` `text-center` (Story 3.5); the
        `404` title-vs-heading casing preserved verbatim (Story 3.5, frozen content); `LICENSE`
        relicense 0BSD→MIT (Story 4.2); the `react-custom-scroll` styled-components-internally
        maintained-primitive call (Story 3.3). Each must be a deliberate, logged call — confirm, don't re-litigate.
  - [x] Confirm the **forced reconciliations** that warranted their own ADR are captured: ADR 0023
        (custom-spacing parity), ADR 0024 (GatsbyImage→`next/image` thumbnail), ADR 0025 (FrozenRouter + pathname trigger). Confirm the ADR-0025 FrozenRouter Next-internal-API import is recorded as
        an **accepted residual upgrade-checklist risk** (it is referenced from ADR 0026 and
        `project-context.md`) — note, do not "fix".
  - [x] If a material decision or pragmatism call has **no home anywhere** in the trail, capture it
        now to the base-usable standard (`_template.md` for an ADR; a dated bullet in `deferred-work.md`
        for a smaller call) — **collate, do not reconstruct elaborate history**. If you cannot
        establish the rationale from the existing record, **flag it for Zac rather than inventing one**.
- [x] **Task 3 — Tidy to coherent base-usable standard (agent) (AC: #2)**
  - [x] Normalise **stale as-you-go routing**: items in `deferred-work.md` (and any ADR notes) that
        point at "the Story 4.1 gate" / "the Story 4.1 visual-diff gate" now resolve to a final
        disposition — the gate is **closed (4.1 done, signed off)**. Re-tag each such open item to its
        true destination: **resolved** (verified at the 4.1/4.2 gate) or **deferred to Ariadne** (a11y
        backlog, content refresh, speculative hardening). Do this as a light edit/annotation — **do
        not delete the history or rewrite the entries into prose.**
  - [x] Update `docs/decisions/README.md` to reflect that the **Story 4.3 collation + sign-off is
        complete** (the README currently says "Epic 4 / Story 4.3 collates this existing trail and
        signs it off" in the present/future tense). Keep it base-usable — a short status line / brief
        "trail status at project close" note, **not** a narrative. (See "Decision capture for _this_
        story" in Dev Notes for the recommended lightweight mechanism and the one open question for Zac.)
  - [x] Verify coherence: cross-references resolve, no contradictions between ADRs, no orphaned
        "TBD"/"to be exercised in Epic 2–3"-style forward references left dangling now the project is
        complete (e.g. Story 1.3's "audit checkpoint to be exercised during the tier ports" — confirm
        it reads as discharged, not pending).
- [x] **Task 4 — Scope-discipline confirmation (agent) (AC: #3)**
  - [x] Confirm every conscious deviation from Task 2 is **logged + Zac-approved + deliberate** — none
        is silent scope creep, and none is an Ariadne-scoped content/redesign change _beyond_ the
        explicitly-approved carve-outs.
  - [x] Confirm the **deferred-to-Ariadne** items (a11y backlog: multiple-`<h1>`, carousel-control
        names/focus ring, nav list semantics, decorative `aria-hidden`, `prefers-reduced-motion`;
        analytics consent/env-gate; Roboto faux-bold; image-loader hardening; `AnimateOnChange` timing
        fragilities; Twitter-link removal; certification-acronym verification; thumbnail visual nuances)
        are **deferred, not done** — they stand as the evidence Theseus stayed in scope (NFR6). Do not
        action any of them.
  - [x] Produce a short, honest **scope-discipline summary** for the sign-off: "conscious in-scope
        deviations (all logged + approved): N; Ariadne-deferred items: M; speculative work done: 0".
- [x] **Task 5 — Present findings + sign-off (`[ZAC]` confirms; agent records) (AC: #1, #2, #3, #4)**
  - [x] Summarise the sweep for Zac: ADR-index integrity result, completeness result (any gaps
        captured or flagged), the tidy edits made, and the scope-discipline summary. Be explicit about
        anything you could **not** resolve or that needs his judgement.
  - [x] `[ZAC]` — Zac confirms the trail is **coherent and base-usable for Ariadne** and that
        **Theseus stayed in scope** (no Ariadne work / redesigns / speculative improvements). Record his
        sign-off in Completion Notes. **Do not assert this sign-off on his behalf.**
  - [x] On sign-off: mark this story `done`, update `sprint-status.yaml`, and note that **Epic 4 — and
        Project Theseus — is complete** (only the optional `epic-4-retrospective` remains).

## Dev Notes

### Read these first (the spec for "what good looks like")

- **`docs/decisions/README.md`** — defines the trail's intent ("deliberately base-usable, not
  polished … turning this into a public-facing narrative is **Ariadne's** job … Do not gold-plate
  it"), the as-you-go convention, the Status vocabulary, and the inherited-closed pointers. It
  literally tells you the bar for this story. The lines "**Epic 4 / Story 4.3 collates** this
  existing trail and signs it off — it does **not** reconstruct one" are this story's contract.
- **The two prior Epic-4 stories** (`4-1-*.md`, `4-2-*.md`) — both were verification/sign-off
  stories with the same honesty-bar posture (`[ZAC]` does the human judgement; the agent does the
  mechanical work and must not fabricate the sign-off). Both consciously **waived a separate
  `bmad-code-review`** because the human sign-off _was_ the adversarial gate. The same is expected
  here: 4.3 is a doc collation + sign-off, not a coding task, so a separate code review is not
  meaningful — the completeness sweep + Zac's sign-off is the gate. (Confirm with Zac, don't assume.)

### What "material decision" and "pragmatism call" mean (the sweep's yardstick)

- **Material decision** — a non-obvious technical fork that shaped the build and would cost a future
  reader real archaeology to reconstruct: a library/framework choice, an architectural pattern, a
  parity-vs-idiom trade-off. These get **ADRs** (0001–0026) or **inherited-closed pointers**.
- **Pragmatism call / conscious parity deviation** — a deliberate, smaller step off strict
  verbatim parity or a conscious "defer this" / "fix this typo rather than port the bug" judgement.
  These live in **`deferred-work.md`** and per-story **Completion Notes**, sometimes cross-referenced
  from an ADR. The Theseus convention (see memory: _fix-bugs-don't-port-verbatim_, _Tailwind-v4
  layered-utilities gotcha_, _don't-be-dogmatic-about-purity-principles_) produced a steady stream of
  these — the sweep confirms each was captured with its reasoning.
- A decision does **not** need its own ADR to be "covered" — a logged deferred-work bullet or a
  per-story Completion Note with rationale is sufficient at the base-usable standard. The sweep
  checks **coverage + rationale**, not ADR-ification of everything.

### The "Inherited closed decisions" pattern (do not re-argue, do not duplicate)

Some calls were closed in planning/research and are recorded in the README **by pointer only**,
intentionally **without** their own ADR, "so Epic 4's completeness sweep finds no gap." Treat these
as **covered** — do not manufacture ADRs for them and do not re-open them. They are: SSG/static
export (related to ADR 0003); theme-persistence FR10 (the single accepted functional change, Story
1.5/ADR 0011); clean parallel tier-by-tier rebuild; backroom markdown pipeline deferred to Ariadne
(AR20). This pattern is itself the answer to "why isn't decision X an ADR?" during the sweep.

### Decision capture for _this_ story (FR26 / AR19) — keep it light, one question for Zac

The as-you-go convention says material calls get recorded. The collation + sign-off is more a
**project-close confirmation** than a new technical decision, so the recommended, NFR6-respecting
mechanism is the **lightest that records the outcome**: a short "trail status / completeness
sign-off at project close" note in `docs/decisions/README.md` + this story's Completion Notes.
**An open question for Zac (Task 5):** does he want the project-close formalised as its own ADR
(e.g. `0027-decision-trail-collation-and-project-closeout.md`, mirroring how 0026 captured the
cutover _execution_), or is the README note + story record enough? **Default to the lighter
README-note option** unless Zac wants the ADR — writing a closeout ADR risks tipping into the
narrative/polish that is exactly Ariadne's scope (NFR6). Surface it; let him choose.

### What is NOT in this story (scope guard — NFR6, and this story _is_ the NFR6 gate)

- **No public-facing narrative, case study, "backroom" content, or "how this was built" prose.**
  That is **Ariadne**. This is the single biggest trap here — the trail is _input_ to Ariadne, not
  Ariadne itself.
- **No reconstruction.** If the as-you-go capture worked, you are collating a complete record. If
  you find a real gap, capture it base-usable or flag it — never invent rationale or backfill
  elaborate history.
- **No gold-plating / no "improving" existing entries into polished prose.** Tidy stale routing and
  fix index inconsistencies; do not rewrite for style.
- **No actioning of deferred items.** The a11y backlog, content refresh, analytics consent,
  speculative hardening, Twitter-link removal, etc. stay **deferred** — touching them would be the
  exact scope creep AC3 exists to forbid.
- **No app-code, build, dependency, or `src/` change.** If a change there seems necessary, you've
  misread the story — stop and flag it.
- **No re-litigating settled parity deviations.** The conscious deviations were Zac-approved at the
  time; the sweep confirms they're _logged_, it does not re-debate them.

### Honesty bar (carried from 4.1 / 4.2)

The agent **can and must**: read all five artefact families, build the decision inventory,
reconcile the ADR index, cross-check coverage, normalise stale routing, fix index/cross-reference
inconsistencies, and produce the scope-discipline summary. The agent **cannot** unilaterally
declare the trail "coherent and base-usable" or that "Theseus stayed in scope" — that judgement is
**Zac's sign-off** (`[ZAC]`, Task 5). Record exactly what was swept, what was tidied, what (if
anything) was flagged unresolved. **Never fabricate the sign-off.**

### Testing standards (AR13 — nothing to run)

`npm test` is the stub `exit 1` — do not run it or claim tests pass. There is also **no build/lint
verification needed** here: this is a doc-only story that doesn't touch `src/`, `package.json`,
`next.config.ts`, or `globals.css`. "Verification" is the completeness sweep itself + Zac's
sign-off. (If, unexpectedly, a tidy edit touches a built file, re-confirm `npm run build` green +
pure static export per the standing project rule — but that is not expected.)

### Project Structure Notes

- **Expected files touched (doc-only):** `docs/decisions/README.md` (status/collation note + any
  index fixes), `_bmad-output/implementation-artifacts/deferred-work.md` (stale-routing
  normalisation), this story file, `sprint-status.yaml`. **Possibly** a new lightweight
  `docs/decisions/0027-*.md` — _only_ if Zac chooses the ADR option (Task 5 question); default is no
  new ADR.
- **The post-cutover repo (current `main`):** Next app at root (`src/app`, `src/components`,
  `src/config`, `src/context`, `src/image-loader.ts`); decision log in `docs/decisions/`; Gatsby
  retired (`archive/` removed in 4.2). `project-context.md` was rewritten to the Next reality in 4.2
  and is current — read it for stack facts, but note **it is not part of the decision trail to sweep**
  (it's the live AI source-of-truth, not a decision record).
- Commit style: `feat:`/`chore:` conventional-ish, capitalised imperative subject. Commit only what
  this story authorises, and only when Zac asks.

### References

- [Source: epics.md#Epic-4-Story-4.3] — story statement + the three ACs (FR26 completeness sweep; FR26/AR19 coherent base-usable, collated-not-reconstructed; NFR6 scope discipline).
- [Source: epics.md#Story-1.2] — the decision-capture mechanism + the as-you-go convention this story collates and signs off ("Epic 4 collates the trail rather than reconstructing it").
- [Source: epics.md#Requirements-Inventory] — FR26 (raw decision/process data, base-usable, no public polish — input Ariadne curates), AR19 (capture as byproduct), AR20 (don't foreclose Ariadne), NFR6 (anti-gold-plating, scope discipline as a first-class quality attribute).
- [Source: docs/decisions/README.md] — the trail's intent + bar ("base-usable, not polished … Ariadne's job … do not gold-plate"), the Status vocabulary, the as-you-go convention, the "Inherited closed decisions" pointer section, and the explicit "Story 4.3 collates … does not reconstruct" contract.
- [Source: docs/decisions/_template.md] — the MADR-lite ADR shape (Status, Date, Decider, Tags, Context, Decision, Consequences, optional Alternatives) — use if Task 2 surfaces a genuine uncaptured material decision, or for the optional 0027 closeout.
- [Source: _bmad-output/implementation-artifacts/deferred-work.md] — the as-you-go pragmatism-call + deferral log to sweep and tidy (stale "→ Story 4.1 gate" routing to normalise; open Ariadne-deferred items = scope-discipline evidence).
- [Source: _bmad-output/implementation-artifacts/4-1-...md, 4-2-...md] — the Epic-4 verification/sign-off pattern: `[ZAC]` human sign-off as the gate, honesty bar, consciously-waived separate code review.
- [Source: _bmad-output/planning-artifacts/prds/prd-project-theseus-2026-06-10/.decision-log.md; briefs/.../.decision-log.md] — planning-phase decision logs (same convention upstream) to include in the sweep.
- [Source: _bmad-output/planning-artifacts/research/technical-...-research-2026-06-10.md] — retained research; the decision table several ADRs and inherited-closed pointers cite.

## Dev Agent Record

### Agent Model Used

claude-opus-4-8 (bmad-dev-story)

### Debug Log References

- Mechanical sweep, doc-only — no build/lint/test run (AR13; story touches no `src/`, `package.json`,
  `next.config.ts`, or `globals.css`). "Verification" = the completeness sweep itself + Zac's sign-off.
- ADR-index integrity + ADR↔ADR cross-reference resolution: read of all 26 ADRs in `docs/decisions/`
  (`0001`–`0026`) reconciled against the `README.md` index table.
- Planning-log + research coverage check + inherited-closed-pointer resolution: read of the brief/PRD
  `.decision-log.md` + `addendum.md` and the retained technical-research decision table.
- Conscious-deviation coverage cross-check against per-story Completion Notes (notably Story 4.2 for the
  dark `border-inverse` `#`-fix and the `LICENSE` relicense).

### Completion Notes List

**STATUS: DONE — ZAC SIGNED OFF (2026-06-23). PROJECT THESEUS COMPLETE.**

This was the final, doc-only Theseus story: collate + completeness-sweep + sign-off the as-you-go
decision trail. No app code, build, dependency, or `src/` change. The agent performed the mechanical
sweep; the coherence/scope **judgement was Zac's `[ZAC]` sign-off** (honesty bar carried from 4.1/4.2)
— it was **not** fabricated.

**Sweep result — the FR26 "capture as-you-go" promise held; a complete record was collated, not
reconstructed. No genuine gaps.**

- **ADR index integrity (AC#1) — CLEAN.** All 26 ADRs (`0001`–`0026`) present, gapless, exactly one
  index row each, titles match files, every Status `Accepted` (no superseded-without-link). Every
  ADR↔ADR cross-reference resolves (0001→0005/0007, 0002→0004/0009, 0005→0001, 0009→0002,
  0011→0004/0010/0012, 0012→0011, 0013→0003/0004/0009/0010, 0014→0003/0008/0017, 0022→0018).
- **Completeness (AC#1) — CLEAN.** The four "Inherited closed decisions" pointers (SSG-static, FR10,
  parallel tier-by-tier rebuild, backroom-MDX-deferred/AR20) all resolve to real planning sources
  (technical-research decision table / PRD addendum); none has a contradicting ADR. No material
  planning decision is left homeless. Every named conscious parity deviation has a home **with
  rationale**: `xl:mr-0` (ADR 0016), theme-toggle state-aware aria-label (1.5 + deferred-work), dark
  `--color-border-inverse` `fafafa`→`#fafafa` render-identical fix (4.2 Completion Notes), the three
  `/content` carve-outs (3.4), `/404` `text-center` (3.5), `404` title-vs-heading casing (3.5),
  `LICENSE` 0BSD→MIT relicense (4.2), react-custom-scroll styled-components-internally
  maintained-primitive (3.3). Forced-reconciliation ADRs 0023 / 0024 / 0025 all present + Accepted;
  the ADR-0025 FrozenRouter Next-internal-API import is recorded as an accepted residual
  upgrade-checklist risk (cross-referenced from ADR 0026 + `project-context.md`). No uncaptured
  material decision surfaced → nothing had to be reconstructed or backfilled.
- **Coherent + base-usable, stale routing normalised (AC#2) — DONE.** The Story 4.1 visual/behavioural
  gate and the Story 4.2 cutover are both closed/signed-off, so every "→ Story 4.1 gate" reference is
  stale. Normalised as a **light edit, not a rewrite**: (a) `deferred-work.md` gained a **disposition
  key** header + **20 terse per-item `→ [project close: …]` tags** routing each open item to its final
  outcome — _resolved at the 4.1 gate_ (List-B visual checks all passed at Zac's "imperceptible = pass"
  threshold; the one defect, FR7 route-transition, fixed under ADR 0025) or _deferred to Ariadne_
  (a11y/content/enhancement, confirmed not-a-regression at 4.1). No entry deleted or rewritten into
  prose. (b) `docs/decisions/README.md` gained a base-usable **"Trail status at project close"**
  section marking the collation complete and stating that ADR bodies still reading "flagged for the
  Story 4.1 gate" are point-in-time records to be **read as discharged**. The Story 1.3 / ADR 0009
  per-tier audit checkpoint reads as discharged (the audit ran + PASSED at 4.1), not pending.
- **Scope discipline (AC#3) — CONFIRMED.** Scope-discipline summary: **conscious in-scope deviations
  (all logged + Zac-approved + deliberate): ~8 parity deviations** + FR10 (the single accepted
  functional change) + 2 accepted residual-risk / maintained-primitive calls (FrozenRouter internal
  API, react-custom-scroll) — none silent scope creep. **Ariadne-deferred items: ~20+** (a11y backlog,
  content refresh, analytics consent/env-gate, image-loader hardening, AnimateOnChange timing, Twitter
  removal, cert-acronym verification, inert-class cleanup, `prefers-reduced-motion`, etc.) — every one
  **deferred, not done**. **Speculative work done during Theseus: 0.** The open `deferred-work.md`
  items are the evidence Theseus stayed in its box (NFR6).

**Two light-touch decisions Zac made at sign-off (Task 5 questions):**

1. **Project-close mechanism → README note only (no 0027 ADR).** The lightweight "Trail status at
   project close" note in `README.md` + this story record is sufficient; a closeout ADR was
   consciously declined as risking the narrative/polish that is Ariadne's scope (NFR6).
2. **The 8 ADR bodies with stale "flagged for the Story 4.1 gate" language (0009, 0016, 0017, 0018,
   0020, 0022, 0024, + a pointer in 0021) → left as historical point-in-time records**, covered
   centrally by the README note, **not** surgically re-tensed. Keeps clear of the NFR6 rewrite trap and
   the Expected-files-touched boundary (the 26 ADR files were deliberately not edited).

**Honesty bar (AC#4) — UPHELD.** The agent did the mechanical sweep + tidy and recorded findings
honestly (clean sweep, no gaps, one judgement call surfaced rather than decided unilaterally).
**Zac performed the coherence/scope judgement and signed off** (2026-06-23): the trail is coherent and
base-usable for Ariadne, and Theseus stayed in scope (no Ariadne work / redesigns / speculative
improvements introduced). The sign-off was not fabricated.

**Separate `bmad-code-review` consciously WAIVED** — consistent with 4.1 and 4.2: this is a doc
collation + sign-off, not a coding task, so a separate code review is not meaningful; the completeness
sweep + Zac's sign-off **was** the gate.

**On sign-off: Story 4.3 → done; Epic 4 → done; Project Theseus is COMPLETE.** Only the optional
`epic-4-retrospective` remains.

### File List

- `_bmad-output/implementation-artifacts/deferred-work.md` — added the "Trail status at project close"
  disposition-key header + 20 per-item `→ [project close: …]` tags normalising the stale "Story 4.1
  gate" routing (history left verbatim) (modified)
- `docs/decisions/README.md` — added the "Trail status at project close (Story 4.3)" base-usable
  status section; collation marked complete (modified)
- `_bmad-output/implementation-artifacts/4-3-collate-and-sign-off-the-decision-process-trail.md` —
  status, task checkboxes, Dev Agent Record, Change Log (this file) (modified)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — story 4.3 in-progress→done; epic-4→done
  (modified)

## Change Log

| Date       | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-06-23 | **Status → done — ZAC SIGNED OFF; PROJECT THESEUS COMPLETE (bmad-dev-story).** Mechanical sweep across the five artefact families came back clean: ADR index 26/26 present + gapless + all `Accepted` + every ADR↔ADR cross-ref resolves; four inherited-closed pointers all resolve; every conscious deviation has a home with rationale; no uncaptured material decision (the FR26 as-you-go promise held — collated, not reconstructed). Tidy (light, not a rewrite): `deferred-work.md` gained a disposition-key header + 20 per-item `→ [project close: …]` tags normalising the stale "Story 4.1 gate" routing; `README.md` gained a base-usable "Trail status at project close" section marking collation complete. Scope-discipline summary: ~8 conscious in-scope deviations (all logged + Zac-approved) + FR10 + 2 accepted residual-risk calls; ~20+ Ariadne-deferred items (deferred, not done); **speculative work = 0**. Two Zac decisions at sign-off: README note only (no 0027 ADR); 8 stale-routing ADR bodies left as historical records (README covers them centrally), not re-tensed. Honesty bar upheld — agent did the sweep, `[ZAC]` did the coherence/scope sign-off (not fabricated). Separate `bmad-code-review` consciously waived (mirrors 4.1/4.2 — the sweep + sign-off IS the gate). Epic 4 → done; only optional `epic-4-retrospective` remains. |
| 2026-06-23 | Story 4.3 created (ready-for-dev): the final Theseus story — collate + completeness-sweep + sign-off the as-you-go decision trail. Doc-only; no app code/build. Trail surface = five artefact families (26 ADRs + README/`_template`; `deferred-work.md`; brief/PRD `.decision-log.md` + addenda; retained research; per-story Completion Notes). ACs: FR26 completeness sweep (every material decision + pragmatism call has a home with rationale; ADR index integrity), FR26/AR19 coherent base-usable collated-not-reconstructed + no public polish (normalise stale "→ Story 4.1 gate" routing; mark collation complete in README), NFR6 scope discipline (conscious deviations all logged+Zac-approved; Ariadne items deferred-not-done). Honesty bar: agent does the mechanical sweep + tidy, `[ZAC]` does the coherence/scope sign-off — not fabricated. One open question for Zac: lightweight README note (default) vs an optional `0027` closeout ADR. On sign-off, Epic 4 + Project Theseus close.                                                                                                                                                                                                                                                                                                                                                                    |
