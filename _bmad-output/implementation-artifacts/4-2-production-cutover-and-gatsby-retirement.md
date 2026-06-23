---
baseline_commit: 3b3ffa5b420869eab1540146305448c6dbfcbd0d
---

# Story 4.2: Production cutover and Gatsby retirement

Status: in-progress

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As the site owner,
I want the modern Next.js build promoted to production and the Gatsby build retired,
so that `zackerthehacker.com` is served by Next.js with deploy-on-commit and analytics intact.

## Context & purpose (read first)

This is **the irreversible switch** — the moment `zackerthehacker.com` stops being served by
Gatsby and starts being served by the Next.js 16 build. Everything in Epics 1–3 was a parallel
rebuild that never touched production; Story 4.1 was the hard gate that proved zero regression.
**That gate is GREEN — Zac signed off the full per-tier visual + behavioural pass on 2026-06-23**
(see `4-1-...md` Completion Notes). Story 4.2 is now unblocked and is the only story that mutates
what the public actually sees.

**This is a runbook + repo-cleanup + decision-capture story, NOT a feature build.** There is no UI
to write. The work is: (1) a final pre-flight, (2) the merge-and-deploy that flips production,
(3) a human-in-the-loop production verification, (4) retiring the Gatsby tree, and (5) capturing the
cutover in the decision log. Do not add features, refactors, or Ariadne-scoped work (NFR6).

**The honesty bar carries over from 4.1 — escalated, because this is production.** The irreversible
push to `main` and the live-production verification are **Zac's actions** (`[ZAC]`-marked tasks): the
dev agent runs headless and **cannot** push to `main`, cannot load `zackerthehacker.com`, cannot read
the Netlify UI, and cannot watch a GA network request. **Do not fabricate a "production is live and
green" confirmation.** The agent prepares everything and runs every check it legitimately can
(local build/export/lint, repo greps, archive removal, ADR); Zac executes the irreversible steps and
confirms the live result. Record honestly what was and was not done — exactly as 4.1 did.

### How the cutover actually works (the mechanism)

- The existing production pipeline is **GitHub `main` → Netlify deploy-on-commit**, serving a static
  bundle (ADR 0003). Today `main` still holds the **Gatsby** app and has **no `netlify.toml`** — so
  production currently builds Gatsby via Netlify's UI build settings (`gatsby build` → `public/`).
- `project-theseus` is **45 commits ahead of `main`, 0 behind** — a clean fast-forward. Merging it to
  `main` lands the Next app **and** its `netlify.toml` (`command = "next build"`, `publish = "out"`).
- **`netlify.toml` `[build]` settings override the Netlify UI build settings.** The instant the merged
  `netlify.toml` is on `main`, the next production build runs `next build` and publishes `out/` — the
  cutover. Under `output: 'export'` this is a pure static deploy, zero functions (ADR 0014).
- So the cutover **is** the merge-and-push to `main`. No Netlify dashboard reconfiguration is required
  for the build itself — but Zac should sanity-check the production site's settings first (below).

### What "irreversible" means here (and the rollback path)

Irreversible **in intent** — we are retiring Gatsby and will not maintain it. Technically there is a
recovery window:

- **Fast rollback:** Netlify → "Publish deploy" on the previous (Gatsby) production deploy, or
  `git revert` the merge and push. Either restores the Gatsby site in minutes. **The live Gatsby
  production deploy stays serving until a new Next build goes green**, so the republish path needs
  nothing in the working tree.
- **`archive/` is removed on `project-theseus` BEFORE the merge** (Zac's call, 2026-06-23) so the
  Gatsby tree never lands as a live file on `main`. It remains in **git history** — the Gatsby source
  is recoverable indefinitely (`git revert` the merge, or `git checkout <pre-removal-sha> -- archive/`).
  Git is the Gatsby rollback; we do not keep the tree around for it.

## Acceptance Criteria

1. **(FR25) Next.js is live in production.** After the cutover, `zackerthehacker.com` is served by the
   Next.js 16 + TypeScript build via Netlify from `main` (static export, `out/`), **not** the Gatsby
   build. Confirmed live by Zac: the site renders correctly, view-source shows Next markers
   (`/_next/...`, Netlify-Image-CDN `/.netlify/images?...` image `src`/`srcSet`), and all routes
   (`/`, `/about-me`, `/resume`, `/content`), the custom 404, and the CV PDF (`/pdfs/zac-braddy.pdf`)
   resolve.
2. **(NFR4) Deploy-on-commit is preserved end-to-end.** A commit to `main` triggers a Netlify
   **production** deploy that completes green, exactly as before — verified by Zac with one real commit
   to `main` post-cutover.
3. **(FR19) Analytics is firing in production.** Google Analytics `gtag` `G-F98QXJC4S0` fires on the
   **live** site — verified by Zac (a `gtag/js?id=G-F98QXJC4S0` request / GA realtime hit on
   `zackerthehacker.com`).
4. **(FR23, FR25) Gatsby is retired.** The old Gatsby build/config no longer serves production, the
   `archive/` Gatsby tree is removed from the repo (ADR 0006), and **no Gatsby, `@reach/router`, or
   GraphQL dependency remains in the deployed app** — verified by grep over the deployed source
   (`package.json` dependencies + `src/`) returning none. (Decision-log/`_bmad-output` files may still
   reference Gatsby as _history_ — that is expected and not a violation.)
5. **(FR26, AR19) The cutover is captured in the decision trail.** A base-usable ADR records the cutover
   execution and Gatsby retirement (date, mechanism, verification outcome, rollback path), indexed in
   `docs/decisions/README.md`. No public-facing polish (that is Ariadne — collation/sweep is Story 4.3).
6. **(NFR6 + honesty bar) Scope discipline + honest sign-off.** Only cutover/retirement/capture work is
   done — no features, redesigns, or Ariadne-scoped work. The production verification (ACs 1–3) is
   **performed by Zac**, not fabricated by the agent, and the rollback path is known before the switch.

## Tasks / Subtasks

**Order matters: all repo cleanup + capture happens on `project-theseus` BEFORE the merge (Tasks 1–3),
so `archive/` never lands as a live file on `main`. The merge (Task 5) is then the cutover.**

- [x] **Task 1 — Final pre-flight on `project-theseus` (agent can do) (AC: #1)**
  - [x] Confirm Story 4.1 gate is GREEN in `sprint-status.yaml` (`4-1-...: done`) — cutover is unblocked.
  - [x] Confirm the working tree is clean and you are on `project-theseus` (`git status`).
  - [x] `npm run build` → **green + pure static export**: every route `○ (Static)`, **no `.func`/serverless**, `out/` exists with `index.html`, `about-me.html`, `resume.html`, `content.html`, `404.html`.
  - [x] Spot-check `out/index.html` emits Next markers: `/_next/...` assets and `/.netlify/images?url=...&w=...&q=...` image `src`/`srcSet` (confirms Path A / ADR 0014 will serve correctly in prod).
  - [x] `npm run lint` → clean (exit 0). `npm test` is the stub `exit 1` — **do not run it** (AR13).
- [x] **Task 2 — Retire Gatsby + update docs, committed on `project-theseus` (agent can do) (AC: #4)**
  - [x] `git rm -r archive/` — removed the frozen Gatsby tree (71 tracked files). Note: `git rm` left the gitignored/untracked `archive/.cache`, `archive/node_modules`, `archive/public` (~1.3G) on disk, which broke `npm run lint` once the eslint `archive/**` ignore was dropped; completed the ADR 0006 "clean `rm -rf archive/`" by removing the whole directory from disk. Tracked source recoverable from git history; the rest was disposable build output.
  - [x] Dropped the now-dead `.gitignore` `archive/.cache/` + `archive/public/` carve-outs (incl. their comment), the `.prettierignore` `archive` entry, and the now-dead `archive/**` entry in `eslint.config.mjs` `globalIgnores` (same dead carve-out for the removed tree).
  - [x] **FR23 verification:** grep of the **deployed** source (`package.json` + `src/`) for `gatsby` / `@reach/router` / `useStaticQuery` / `graphql` → **none** (clean before and after removal). The stale `LICENSE` (`Copyright (c) 2020 Gatsby Inc.`, 0BSD from the Gatsby starter) was relicensed at Zac's request to a standard MIT licence, `Copyright (c) 2026 We Right Code Ltd`. Remaining Gatsby mentions are history in `docs/decisions/**` / `_bmad-output/**` (expected, not a violation).
  - [x] **Updated `README.md`** — replaced the Gatsby-starter blurb with a short, accurate Next.js description.
  - [x] **Rewrote `_bmad-output/project-context.md` to the Next.js reality** — stack/versions, Server/Client split, atomic design, CSS-variable theming via Tailwind-v4 `@utility` (no `tailwind.config.js`), `next/navigation` routing, styling order (no styled-components), TS-import/`src/config` data layer, `next/image` + Netlify CDN loader, ESLint 9 + Prettier 3 + Husky tooling + `npm test` stub, gotchas (border/ring/divide guard ADR 0009, `@layer base`, FrozenRouter ADR 0025, hydration/SSG, static export). Per Zac's mid-story feedback, kept it forward-looking only — no "migrated from Gatsby" framing (that history lives in the ADRs); scrubbed gratuitous dead-stack references.
  - [ ] **Optional (Zac's discretion, deferred to Zac):** delete stale remote branches + close open Gatsby dependabot PRs. Tidiness only — not required for AC#4 (NFR6). **Left for Zac** (remote GitHub ops).
- [ ] **Task 3 — Capture the cutover in the decision log, on `project-theseus` (agent can do) (AC: #5)**
  - [x] Wrote **ADR `0026-production-cutover-and-gatsby-retirement.md`** (Status Accepted, dated 2026-06-23, decider Zac) per `_template.md`: context (GREEN 4.1 gate + cutover mechanism), decision (FF-merge flips prod via `netlify.toml` override; `archive/` removed pre-merge; FR23/docs done on `project-theseus`), consequences (prod on Next; Gatsby retired; rollback path; carried-forward ADR-0025 FrozenRouter internal-API risk), and a **PENDING verification-outcome** block for Zac's Task 6/7. Base-usable, no polish.
  - [x] Added the ADR 0026 row to the `docs/decisions/README.md` index table.
  - [ ] Commit Tasks 2–3 (+ the border-inverse defect fix) on `project-theseus` (`feat:`/`chore:` prefix) — **awaiting Zac's go-ahead** (per the standing "commit only when asked"). **Do not push to `main` — that is Zac's Task 5.**
- [ ] **Task 4 — Netlify production pre-flight (`[ZAC]`) (AC: #1, #2)**
  - [ ] Confirmed (Zac, 2026-06-23): production is **this same repo + Netlify site**, UI-configured to deploy-on-commit from **`main`** — so merging to `main` flips prod, no separate prod-wiring step.
  - [ ] Sanity-check the Netlify UI for a stale **base directory** or pinned **publish dir** that could fight the merged `netlify.toml` (`next build` → `out`). `netlify.toml [build]` overrides the UI build command/publish, but a base-directory override is worth a glance.
  - [ ] Confirm the build Node version resolves to **`.node-version` `v24.16.0`** (ADR 0008/0014); `NODE_VERSION` is intentionally not duplicated into `netlify.toml` unless Netlify ignores `.node-version`.
  - [ ] Confirm `HUSKY = "0"` (in `netlify.toml [build.environment]`) is present so the install step doesn't trip on the `prepare: husky` hook (ADR 0014).
- [ ] **Task 5 — Cutover: merge `project-theseus` → `main` and deploy (`[ZAC]`, irreversible) (AC: #1)**
  - [ ] `git checkout main && git merge --ff-only project-theseus` (clean fast-forward — `--ff-only` guarantees no surprise merge commit; the Task 2–3 commit keeps `project-theseus` ahead of `main`).
  - [ ] `git push origin main` → **this triggers the production deploy and IS the cutover.** Watch the Netlify production build to green.
  - [ ] If the build fails or the live site is wrong: **roll back immediately** — Netlify "Publish deploy" on the previous Gatsby deploy (still live until this build succeeds), or `git revert` the merge + push — then diagnose before retrying.
- [ ] **Task 6 — Verify production GREEN (`[ZAC]`, human-in-the-loop) (AC: #1, #2, #3)**
  - [ ] **Next is serving (AC#1):** load `zackerthehacker.com` — themed render correct, theme toggle + **persistence across reload** (FR10) works, fonts correct (Permanent Marker headings, Roboto body); view-source shows `/_next/` + `/.netlify/images?...`.
  - [ ] **All routes + 404 + assets (AC#1):** `/`, `/about-me`, `/resume`, `/content` all render; an unknown route serves the **custom** 404; the **CV PDF** downloads from `/pdfs/zac-braddy.pdf`.
  - [ ] **Images via Netlify Image CDN (AC#1):** portrait + content thumbnails render correctly through `/.netlify/images?...` — the CDN-served image check **explicitly deferred from 4.1** (4.1 verified locally only). Confirm no broken images / no layout shift.
  - [ ] **Analytics (AC#3):** confirm `gtag/js?id=G-F98QXJC4S0` fires on the live site (network tab or GA realtime).
  - [ ] **Deploy-on-commit (AC#2):** confirm the Task 5 push triggered a green Netlify **production** deploy end-to-end (and/or one further trivial commit to `main`).
  - [ ] Record the outcome honestly in Completion Notes (what Zac confirmed, at what threshold). **Do not sign off any item the agent could not itself verify.**
- [ ] **Task 7 — Finalise capture + sign-off (`[ZAC]` confirms; agent records) (AC: #5, #6)**
  - [ ] Complete the ADR 0026 **verification-outcome** line with the Task 6 result; commit to `main`.
  - [ ] Zac confirms production is live, green, and stable on Next; analytics firing; deploy-on-commit working; Gatsby retired.
  - [ ] Capture the sign-off in Completion Notes; mark the story done. Story 4.3 (collate + sign off the decision trail) becomes the only remaining work.

## Dev Notes

### This is the irreversible switch — sequence + rollback (read first)

The order is deliberate: **all repo cleanup and decision capture (Tasks 2–3) is committed on
`project-theseus` BEFORE the merge**, so `archive/` and the stale docs never land as live files on
`main` (Zac's call). The merge-and-push (Task 5) is then the single irreversible act. Deleting the
Gatsby tree doesn't affect the running Next build either way, and rollback never needs the tree in the
working copy: **the live Gatsby production deploy keeps serving until the new Next build goes green**,
so the recovery path is Netlify "Publish deploy" on that previous deploy, or `git revert` the merge.
Git history holds the Gatsby source for any deeper restore. Know this path **before** Task 5's push,
not during an incident.

### The cutover mechanism in one paragraph (do not over-think it)

There is no special Netlify "switch". Production builds from `main`. Today `main` = Gatsby (no
`netlify.toml`, built via UI settings). `project-theseus` is a clean fast-forward over `main` and
carries `netlify.toml` (`next build` → `out`). The moment that file is on `main`, Netlify's next
production build runs Next and publishes the static `out/` export — `netlify.toml [build]` overrides
the UI's Gatsby settings. So **merge + push = cutover.** Everything else is verification and cleanup.

### Honesty bar (escalated — production, irreversible)

Same rule as 4.1, higher stakes. The dev agent **cannot**: push to `main`, load `zackerthehacker.com`,
read the Netlify dashboard, or observe a GA hit. Those are `[ZAC]` tasks. The agent **can and must**:
run the final local build/export/lint pre-flight, perform the `git rm` of `archive/`, run the FR23
greps, update `README.md`, write ADR 0026, and prepare the exact commands for Zac. **Never assert that
production is live/green from inference** — only Zac's confirmation closes ACs 1–3. Record exactly what
was and wasn't verified, as 4.1 did.

### What is NOT in this story (scope guard — NFR6)

- **No feature/UI work, no refactors, no redesigns.** Parity was settled in 4.1.
- **No collation / completeness sweep of the decision trail** — that is **Story 4.3** (FR26). 4.2 only
  _adds_ the one cutover ADR; it does not review or tidy the whole set.
- **No fix to the ADR-0025 FrozenRouter `next/dist/...` internal-API import.** It is a documented,
  accepted residual risk (an upgrade-checklist item), not a cutover blocker. Note it in ADR 0026; do
  not touch it.
- **No Ariadne-scoped work** (content/copy refresh, public backroom narrative, a11y backlog).

### Pre-flight expectations (what "green" looks like locally)

From the 4.1 programmatic gate (already proven, re-confirm before merge): `npm run build` green, **pure
static export** — `/`, `/about-me`, `/resume`, `/content`, `/_not-found`, `/icon.svg` all `○ (Static)`,
no `.func`; `npm run lint` clean. `out/*.html` carries the templated SEO titles and the restored
social-card metadata (FR17 fix from 4.1) and the Netlify-Image-CDN `src`/`srcSet`.

### The FR23 grep — what counts and what doesn't

FR23 governs the **deployed app**, not the repo's history. After `git rm -r archive/`:

- **Must be clean:** `package.json` dependencies (already Gatsby/`@reach`/GraphQL-free — see root
  `package.json`) and everything under `src/` (already clean — verified: no `gatsby`/`@reach/router`/
  `useStaticQuery`/`graphql` hits).
- **Expected to still mention Gatsby (NOT a violation):** `docs/decisions/**` (ADRs narrate the Gatsby→
  Next migration), `_bmad-output/**` (planning/stories/deferred-work), and the new ADR 0026 itself.
  These are the decision/process record Ariadne will curate — Gatsby-as-history is the point.

### Decision capture (FR26 / AR19) — ADR 0026

The as-you-go convention requires the cutover's material call to be recorded at the moment it's made.
The _decisions_ (Path A static export, `archive/` model, image loader) are already ADRs 0003/0006/0014;
0026 records the **execution + outcome**: cutover performed on `<date>`, mechanism (FF merge to `main`
→ `netlify.toml` override → Next prod build), production verified green (Next serving, deploy-on-commit,
GA firing, images via CDN), Gatsby retired (`archive/` removed), rollback path, and the carried-forward
ADR-0025 internal-API note. Base-usable standard only — **Story 4.3** does the completeness sweep.

### Project structure & conventions (note the Theseus divergence)

- **`project-context.md` describes the OLD Gatsby stack and is stale post-cutover — rewriting it to the
  Next reality is Task 2 (confirmed in scope).** Until then, do not follow its
  Gatsby/styled-components/`@reach/router`/Tailwind-v3 rules as current truth. The live stack is the one
  in root `package.json`: Next 16 (App Router) + React 19.2 + TypeScript 5/strict + Tailwind v4 +
  `next-themes` + `next/image` (Netlify CDN loader). See the ADRs for the authoritative "how".
- Repo layout today: Next app at root (`src/app`, `src/components`, `src/config`, `src/context`,
  `src/image-loader.ts`), Gatsby in `archive/` (to be removed), decision log in `docs/decisions/`.
- Commit style: `feat:`/`chore:` conventional-ish prefix, capitalised imperative subject (matches recent
  history). Commit only what this story authorises; push to `main` is Zac's irreversible action.

### Testing standards (AR13 — no suite to fabricate)

`npm test` is the stub `exit 1` — there is no automated suite; **do not run it or claim tests pass.**
Verification is: local `npm run build` + static-export inspection + `npm run lint` (agent), then the
human-in-the-loop production checks (Zac). Same honest posture as every prior story.

### Project Structure Notes

- No new app code. Files touched: **removed** `archive/**` (git rm); **updated** `README.md`,
  `docs/decisions/README.md`, and (pending Q1) `_bmad-output/project-context.md`; **new**
  `docs/decisions/0026-production-cutover-and-gatsby-retirement.md`; plus `sprint-status.yaml` and this
  story file. `netlify.toml`, `next.config.ts`, `package.json` are **unchanged** — they are already
  cutover-ready; merging them to `main` is the whole point.
- Potential variance to watch: Netlify UI build settings on the **production** site (Gatsby-era) vs the
  merged `netlify.toml`. `netlify.toml` wins, but Zac should eyeball the UI for a stale base-directory or
  publish-dir override (Task 2).

### References

- [Source: epics.md#Epic-4-Story-4.2] — story statement + ACs (FR25, NFR4, FR19, FR23).
- [Source: epics.md#Requirements-Inventory] — FR19, FR23, FR24, FR25, FR26; NFR4, NFR6; AR4/AR5/AR6.
- [Source: docs/decisions/0003-netlify-deploy-path-a-static-export.md] — Path A static export; "cutover is a content swap, not a pipeline rebuild"; loader in Story 1.7.
- [Source: docs/decisions/0006-archive-at-root-coexistence-model.md] — `archive/`-at-root; **delete `archive/` at Story 4.2**; "clean `rm -rf archive/` plus git removal".
- [Source: docs/decisions/0014-netlify-deploy-config-and-image-loader.md] — `netlify.toml` shape, `HUSKY=0`, `.node-version` as single source of truth, "promoting this to production is the Epic 4 cutover (Story 4.2)", auto-detect Next + zero functions.
- [Source: docs/decisions/0025-route-transition-frozen-router-and-pathname-trigger.md] — FrozenRouter leans on a Next internal API; residual upgrade-checklist risk to note (not fix) in ADR 0026.
- [Source: _bmad-output/implementation-artifacts/4-1-...md#Completion-Notes] — gate GREEN (Zac 2026-06-23); CDN-served image rendering + Netlify/prod correctness explicitly deferred to **Story 4.2**; FR17 social-card fix; FR7/ADR-0025 fix.
- [Source: netlify.toml; next.config.ts; package.json] — current cutover-ready config (`next build`→`out`, `output:'export'`, custom image loader, Gatsby-free deps).
- [Source: project-context.md] — **stale Gatsby-era stack rules**; do not treat as current; rewrite to the Next reality is in scope (Task 2).

## Dev Agent Record

### Agent Model Used

claude-opus-4-8 (Claude Opus 4.8)

### Debug Log References

- Pre-flight build: green, pure static export — `/`, `/_not-found`, `/about-me`, `/content`, `/icon.svg`, `/resume` all `○ (Static)`, no `.func`. `out/` carries `/_next/...` + `/.netlify/images?url=...` markers. `npm run lint` exit 0. `npm test` not run (stub `exit 1`, AR13).
- Gatsby removal gotcha: `git rm -r archive/` removed the 71 tracked files but left ~1.3G of untracked, gitignored build artifacts (`archive/.cache`, `archive/node_modules`, `archive/public`) on disk; with the eslint `archive/**` ignore dropped, `eslint .` then linted that minified Gatsby output (3911 problems). Resolved by completing ADR 0006's `rm -rf archive/` (whole directory off disk). Re-ran lint → exit 0.
- Final verification after all edits + the border-inverse fix: build green + pure static export, lint exit 0. Compiled CSS confirmed `--color-border-inverse:#fafafa` (dark) and `:#5a5a5a` (light).

### Completion Notes List

**Agent-completed (Tasks 1–3, on `project-theseus`):**

- **Task 1 — Pre-flight:** build green + pure static export, lint clean, Next/Netlify-CDN markers present in `out/`. Confirmed 4.1 gate `done` and clean tree on `project-theseus`.
- **Task 2 — Gatsby retired + doc hygiene:** removed `archive/` (git rm of 71 tracked files + `rm -rf` of the ~1.3G untracked build artifacts, completing ADR 0006); dropped the dead `archive/**` carve-outs from `.gitignore`, `.prettierignore`, and `eslint.config.mjs`; FR23 grep over `package.json` + `src/` clean (no `gatsby`/`@reach/router`/`useStaticQuery`/`graphql`); rewrote `README.md` and `_bmad-output/project-context.md` to the Next.js reality.
- **Task 3 — Decision capture:** wrote ADR 0026 (verification-outcome left PENDING for Zac) and indexed it in `docs/decisions/README.md`.

**Mid-story course corrections (Zac, 2026-06-23) — all applied:**

1. **No dead-stack framing in `project-context.md`.** Per Zac, removed the "migrated from Gatsby" banner and scrubbed gratuitous backward-pointing references (`@reach/router`, `react-helmet`, "X removed") — the doc is the live source-of-truth read fresh by every future agent, and Gatsby history belongs in the ADRs. Kept it forward-looking; the one retained "Tailwind v3 default" mention is genuine rationale for the border guard, not dead-stack noise.
2. **`--color-border-inverse` malformed-value bug — fixed, not documented.** Investigation (git history of `archive/src/components/theme-styles.js`) showed both dark `'fafafa'` and light `'5a5a5a'` were written without the leading `#` in the original Gatsby theme — a typo, not "intentional/by design" as the inherited comment claimed. The light value had already been corrected to `#5a5a5a` during the port; the dark value remained malformed (`fafafa`), resolving via `currentColor` (= dark `text-primary` `#fafafa`) at all three usage sites (portrait, testimonial-portrait, content-item — verified no ancestor overrides `color`). Per Zac's direction (overriding the NFR6 no-styling-change guard), fixed dark to the literal `#fafafa` — **provably render-identical** to the `currentColor` resolution, zero visual change vs the 4.1-approved baseline — and removed the now-false "verbatim archive quirk" comments from `globals.css` and the gotcha entry from `project-context.md`.
3. **Full codebase audit for the same bug:** no other missing-`#` colour values exist anywhere — all `--color-*` defs valid, all consumers use `var()`/`rgba()`/`inherit`, no bare-hex in CSS, no colour literals in TS/TSX inline styles (the only `#...` TSX hit is the `&#0064;` email-obfuscation entity, FR22 — expected).

- **`LICENSE` relicensed (Zac, 2026-06-23):** replaced the Gatsby-starter 0BSD `Copyright (c) 2020 Gatsby Inc.` with a standard MIT licence, `Copyright (c) 2026 We Right Code Ltd`.

**Honesty bar — NOT done by the agent (`[ZAC]`, irreversible/human-in-the-loop):** Task 4 (Netlify production pre-flight), Task 5 (FF-merge `project-theseus`→`main` + push = the cutover), Task 6 (live production verification — Next serving, routes/404/CV-PDF, Netlify-CDN images, GA firing, deploy-on-commit), Task 7 (complete ADR 0026 verification-outcome + sign-off). The agent runs headless and cannot push to `main`, load the live site, read the Netlify dashboard, or observe a GA hit. **No production-green confirmation is fabricated.** Also left for Zac (his discretion, needs GitHub access — `gh` not installed in this environment): the optional stale-branch/dependabot cleanup (4 Gatsby-era `dependabot/npm_and_yarn/*` branches + `feature/overhaul-to-nextjs`).

### File List

- `_bmad-output/implementation-artifacts/4-2-production-cutover-and-gatsby-retirement.md` — story frontmatter `baseline_commit`, status, task checkboxes, Dev Agent Record (modified)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — story → in-progress (modified)
- `_bmad-output/project-context.md` — rewritten to the Next.js reality (modified)
- `README.md` — rewritten to a Next.js description (modified)
- `docs/decisions/0026-production-cutover-and-gatsby-retirement.md` — cutover ADR (new)
- `docs/decisions/README.md` — ADR 0026 index row (modified)
- `src/app/globals.css` — dark `--color-border-inverse` `fafafa`→`#fafafa` defect fix + removed stale "quirk" comments (modified)
- `LICENSE` — Gatsby-starter 0BSD → MIT, `Copyright (c) 2026 We Right Code Ltd` (modified)
- `.gitignore` — dropped dead `archive/.cache/` + `archive/public/` carve-outs (modified)
- `.prettierignore` — dropped dead `archive` entry (modified)
- `eslint.config.mjs` — dropped dead `archive/**` globalIgnore (modified)
- `archive/**` — entire Gatsby tree removed (71 tracked files via `git rm`; untracked build artifacts via `rm -rf`) (deleted)

## Decisions confirmed with Zac (2026-06-23 — settled, do NOT re-raise)

1. **`_bmad-output/project-context.md` is rewritten to the Next.js reality as part of this story** (Task 2).
   It is the AI source-of-truth `CLAUDE.md` points at and is comprehensively wrong once Gatsby retires —
   corrective doc hygiene, in scope, not an Ariadne content refresh.
2. **`archive/` is removed on `project-theseus` BEFORE the merge**, so the Gatsby tree never lands as a
   live file on `main`. Git history is the Gatsby rollback (`git revert` the merge / checkout the
   pre-removal SHA); we do not keep the working-tree copy.
3. **Production topology confirmed:** the live site is served by **this same repo + Netlify site**,
   UI-configured to deploy-on-commit from `main`. Merging to `main` flips production via the
   `netlify.toml` override — no separate prod-wiring step.
4. **Stale-branch / dependabot cleanup is optional** (Task 2, Zac's discretion) — tidiness only, can be
   deferred; not required for any AC.

## Change Log

| Date       | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-06-23 | Story 4.2 created (ready-for-dev): production cutover + Gatsby retirement — the irreversible switch, unblocked by the GREEN 4.1 gate. Runbook/cleanup/capture story, not a build. Cutover mechanism: FF-merge `project-theseus`→`main` (45 ahead/0 behind) lands `netlify.toml` (`next build`→`out`) which overrides Netlify's Gatsby UI build → Next serves prod. ACs: FR25 Next live in prod, NFR4 deploy-on-commit, FR19 GA firing live, FR23/0006 Gatsby retired (`git rm -r archive/`, deps/`src` Gatsby-free), FR26 cutover ADR 0026, NFR6+honesty-bar scope/sign-off. `[ZAC]`-marked irreversible/human-in-the-loop steps (push to `main`, live verification) — agent must not fabricate a production-green confirmation. CDN-served image rendering carried in from 4.1's deferral.                                                                                                                                                      |
| 2026-06-23 | Refined after Zac review (same day): (1) `project-context.md` rewrite to the Next stack **confirmed in scope** (Task 2). (2) `archive/` removed on `project-theseus` **pre-merge** (not merge-then-delete) so the Gatsby tree never lands on `main`; git history is the rollback — tasks reordered so all cleanup+capture (Tasks 2–3) commit on `project-theseus` before the merge (Task 5). (3) Prod topology confirmed = same repo + Netlify site, UI deploy-on-commit from `main`, so the merge alone flips prod (no separate wiring). Open-questions section replaced with the four settled decisions.                                                                                                                                                                                                                                                                                                                                       |
| 2026-06-23 | Dev (bmad-dev-story, agent Tasks 1–3 on `project-theseus`): pre-flight green (build + pure static export + lint); `archive/` retired (`git rm` 71 files + `rm -rf` ~1.3G artifacts, ADR 0006); dead `archive/**` carve-outs dropped from `.gitignore`/`.prettierignore`/`eslint.config.mjs`; FR23 clean; `README.md` + `project-context.md` rewritten to the Next reality; ADR 0026 written + indexed. Mid-story Zac corrections applied: removed dead-Gatsby framing from `project-context.md`; **fixed** the dark `--color-border-inverse` malformed value (`fafafa`→`#fafafa`, render-identical via currentColor) rather than documenting it, removed the false "quirk" comments, and audited the whole codebase for other missing-`#` colour values (none). `[ZAC]` Tasks 4–7 (Netlify pre-flight, merge+push cutover, live prod verification, sign-off) NOT done by agent — no production-green fabricated. Commit awaiting Zac's go-ahead. |
