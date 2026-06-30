# PRD Quality Review — Project Ariadne

## Overall verdict

This is a genuinely good lean PRD: it has a clear thesis (restore the canonical CV home + open a "backroom" that sells _how Zac thinks_), the features serve that thesis, and almost every FR carries testable consequences an engineer could turn into a story. Crucially, it has the self-awareness to name over-investment as its own failure mode and backs that with counter-metrics and a delivery-first guardrail — the leanness here is deliberate and earned, not lazy. What's at risk is minor: a couple of glossary terms used before/around their definition without much consequence, one or two FR consequences that lean qualitative ("discoverable but not attention-grabbing"), and a few cross-references that are correct today but brittle (the "all five files" enumeration). None of these block the green light.

## Decision-readiness — strong

Decisions are stated as decisions, not smuggled in as considerations. The framework-and-positioning thesis is committed (§1, §4.4 FR-11), trade-offs are named with what's given up (§4.4 "dev-tools detection is heuristic and unreliable… kept as a fallback, not the default" — a real trade-off surfaced, not smoothed), and Open Questions 6 and 7 are honestly closed with dates rather than left rhetorically open. The §8 guardrail is the strongest signal: it commits to _deferring_ rather than heroically solving complexity, and names the exemplar pragmatism call. The `[NOTE FOR PM]` callouts sit at real tensions (the FR-3 copy-delta deferral, the FR-4 "rest of About-me is largely fine" boundary, the search/filter revisit trigger) rather than at safe checkpoints.

### Findings

- **low** FR-10 acceptance leans qualitative (§4.4) — "discoverable but not attention-grabbing… does not compete with the flash" is a judgement call, not a testable condition. Acceptable for this stakes level and partly handed to `bmad-ux` (OQ-2), but flag it so the UX/story step pins down a concrete placement/style rather than re-litigating "understated". _Fix:_ note in the story that "understated" is signed off by Zac's eyeball at preview, not a rubric.

## Substance over theater — strong

No furniture. The four JTBD entries (§2.1) each map to a real served-or-not-served decision (recruiter = front-of-house, evaluator/client = backroom, maintainer = `docs/`-as-source model), and the Non-Users section (§2.2) does real scoping work rather than padding. The Vision (§1) could not swap into another PRD — "the proof and the product are one artefact: the site documents its own modernisation, built with the very AI/BMAD workflow Zac sells" is specific to this project. NFRs (§9) carry product-specific bounds (`output: 'export'`, the named GA ID `G-F98QXJC4S0`, atomic-design tiers, CSS-variable tokens) rather than boilerplate "must be scalable/secure". The differentiator claim (the backroom showing reasoning) is genuinely the discovery insight, not template-driven novelty.

### Findings

- _None._ The leanness is appropriate and the substance bar is met.

## Strategic coherence — strong

There is a clear thesis and the features follow it. The two-workstream split (thin content refresh 4.1; substantive backroom 4.2–4.4) is justified by the thesis, not by ease — and the PRD is explicit that the _thin_ one (4.1) is "the classic place to gold-plate, and must not," which is prioritization logic in service of the bet rather than a backlog dump. Success metrics validate the thesis (SM-3 = "reads as judgement, not output", which is the buying question) rather than measuring activity, and the explicit "Not a KPI: traffic/engagement/conversion" plus the SM-C1/SM-C2 counter-metrics directly counterbalance the named failure mode. MVP scope kind is coherent (experience/credibility infrastructure) and the scope logic matches.

### Findings

- _None material._

## Done-ness clarity — adequate (strong for the functional FRs)

Most FRs are well-specified: FR-1, FR-2, FR-5, FR-7 have crisp, verifiable consequences (e.g. FR-7 "`○ (Static)` in the build; no serverless `.func`", "responds to the dark/light toggle — no hardcoded colours"). FR-5 is exemplary — it enumerates the exact files, imports, and metadata keys to change. The build/lint-green gate recurs as a consistent acceptance signal, appropriate given the project has no test framework (honestly disclosed in §5).

Where it softens is the inherently qualitative work — FR-6 ("reads as public-facing prose"), FR-10 ("not attention-grabbing"), SM-3. These can't be made fully testable without betraying the project's nature, so this is the right amount of looseness, but it's worth the reviewer naming that the content-quality FRs are signed off by Zac's judgement at preview, not by an automated gate.

### Findings

- **medium** FR-6 consequences are self-referential on quality (§4.2) — "polished markdown files (not raw copies)", "reads as public-facing prose" — the only hard, testable line is "includes at minimum the framework decision and the headline pragmatism call(s)". That minimum-set line is doing the real done-ness work; make sure the derivation story treats it as the acceptance floor. _Fix:_ in the story, restate "at minimum: framework decision + ≥1 headline pragmatism call" as the explicit acceptance criterion so "done" isn't purely editorial taste.
- **low** FR-9 "where feasible" hedge (§4.3) — "works without client JS where feasible" is a soft bound. Fine as written (the architecture step picks the highlighter), but the story should resolve it to a yes/no for the chosen library rather than carrying the hedge into implementation. _Fix:_ architecture decision (OQ-1) should state whether highlighting is build-time or client-side, removing the hedge.

## Scope honesty — strong

Omissions are explicit and load-bearing. §5 Non-Goals and §6.2 Out-of-Scope both do real work and are mutually consistent; `[NON-GOAL for MVP]` tags appear where silent assumption was a risk (search/filter, diagrams, multi-stage console). The analytics boundary is handled with unusual care — the PRD repeatedly distinguishes "collected (in scope) ≠ a KPI (out of scope)" across §5, §6.1/6.2, §7, and §9, which pre-empts the obvious misread. `[ASSUMPTION]` tags sit on genuine inferences (assets are final/approved, parity achievable via edits only, `docs/` at repo root, full build-time prerender) and all five round-trip to §12. Open-items density is low and entirely appropriate for green-light-to-build: five live Open Questions, all explicitly deferred to a named downstream step (architecture/UX/story), none blocking.

### Findings

- _None._

## Downstream usability — strong

This is a chain-top PRD (§0 names `bmad-ux`, `bmad-create-architecture`, `bmad-create-epics-and-stories` as consumers), so this dimension matters — and it holds. Glossary (§3) is present and the domain nouns (Front-of-house, Backroom, Decision trail, Public docs, Representative first cut, Entry link, Console easter egg, CV parity) are used consistently across FRs/UJs/SMs. FR-1–FR-11 are contiguous and unique; UJ-1/2/3 and SM-1/2/3/C1/C2 are clean. Cross-references resolve (FR-10/FR-11 referenced from §4.3; UJ realisations tagged on each FR; §9 NFRs referenced from SM-2). Each section reads standalone via glossary terms rather than "see above".

### Findings

- **medium** Brittle enumeration in FR-5 / OQ-7 (§4.1, §11) — "all five files (`layout.tsx`, `page.tsx`, `about-me/page.tsx`, `resume/page.tsx`, `content/page.tsx`)" hardcodes a count and list that will silently rot if a route is added/removed before the story runs. It's accurate today, but the story executor should re-grep for `@zackerthehacker` / `creator:` rather than trust the count. _Fix:_ add a one-line note that the file list is the snapshot at PRD time; the story verifies by search, not by the list.

## Shape fit — strong

The PRD correctly reads its own stakes. It's a single-operator, brownfield, chain-top project, and the shape matches: it leans on UJs with named protagonists (load-bearing because the whole thesis is about distinct audiences — recruiter vs. evaluator — getting different surfaces), keeps SMs qualitative because there is no marketing push to make numbers meaningful (§7, honestly stated), and carries accurate existing-code references throughout (`src/config/index.ts`, `src/components/organisms/about-me.tsx`, `src/components/molecules/socials.tsx`, `next-themes`, `@next/third-parties`). It is neither over-formalized (no invented personas, no KPI theatre, no risk register) nor under-formalized (the audience-split UJs that the thesis genuinely needs are present). The repeated "supporting infrastructure, not the product" framing is exactly the right calibration signal for a solo CV-site project.

### Findings

- _None._

## Mechanical notes

- **Glossary drift:** none material. "Public docs" / "`docs/`" are used interchangeably but the glossary defines the relationship, so it's not ambiguous. "Decision trail" vs "the trail" used as shorthand — defined, fine.
- **Term-before-definition:** "Backroom", "Entry link", and "Console easter egg" appear in §1–§2 (Vision/UJs) before the §3 Glossary. Harmless for a human reader and the UJ-2 prose self-explains them, but a strict source-extractor hits the term before its definition. Low impact given the glossary follows immediately.
- **ID continuity:** FR-1→FR-11 contiguous/unique; UJ-1/2/3, SM-1/2/3 + SM-C1/C2 clean; Assumptions Index (§12) round-trips all five inline `[ASSUMPTION]` tags (§4.1 ×2, §4.2, §4.3, §4.4-FR-11). No gaps or duplicates.
- **Cross-refs:** all resolve — FR-7's GA point ↔ §5/§7/§9; FR-10/FR-11 ↔ §4.3 reachability; SM-2 ↔ §9 NFRs; OQ-6/OQ-7 ↔ FR-5/FR-11. OQ-7 correctly folds into FR-5.
- **Required sections:** all present for the stakes (Vision, Users/JTBD, Glossary, Features+FRs, Non-Goals, MVP Scope, Success Metrics + counter-metrics, Constraints, NFRs, Open Questions, Assumptions Index). No missing section that this stakes level warrants.
