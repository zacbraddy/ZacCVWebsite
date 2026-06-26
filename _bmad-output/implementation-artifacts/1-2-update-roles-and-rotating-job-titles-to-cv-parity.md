---
baseline_commit: eff8c7c2b72455c932fcadba96a4fc83e44c4d1b
---

# Story 1.2: Update roles and rotating job titles to CV parity

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Zac, the maintainer,
I want the site's roles/experience and rotating job titles to match my current CV,
so that the site is honest and current as my canonical CV home, with no missing recent roles (UJ-1).

## Acceptance Criteria

1. **Rotating job titles → config (FR-3).** `JOB_TITLE` and `JOB_TITLES` are updated in `src/config/index.ts` only — never hardcoded into a component. `JOB_TITLE` stays `'Contract Software Engineer'` (matches the CV header). `JOB_TITLES` is set to the **locked array in Dev Notes** (adds `Technical Co-Founder` + `0-to-1 Builder`, drops `Prolific Content Creator`, keeps the CTO/personality entries). The first element of `JOB_TITLES` must remain `JOB_TITLE` (the rotation starts there).

2. **Missing recent roles added (FR-3, core delta).** The three current roles present on the CV but absent from `src/components/organisms/experience.tsx` are added as new `TimelineItem` entries at the **top** of the timeline, newest-first, matching the CV: **Prolific Academics Ltd** (Senior Software Engineer (Contract), **Mar 2026 – Present**), **Subly** (Senior Software Engineer, Sep 2025 – Feb 2026), **Flocast** (Technical Co-Founder, Nov 2024 – Jun 2025). Each new entry follows the existing `TimelineItem` shape (prose `children` + alphabetised `skills` array), is written in the **existing site voice** (first-person, lightly characterful — not the CV's formal bullet voice), is factually sourced from the CV (see Dev Notes source content), and uses **British spelling**.

3. **Beyonk removed (locked).** The current top entry **Beyonk** (Senior Fullstack Developer, "Jun 2024 – Present") is **not on the CV** and its `endDate="Present"` is inaccurate. **Remove the Beyonk `TimelineItem` entirely** so the on-site experience matches the CV (timeline top becomes Prolific → Subly → Flocast → Odondo). Removing it also moots the lone `optimize` Americanism that lived in its prose.

4. **Odondo aligned to CV.** The existing Odondo entry's role title and dates are brought to CV parity: title → **Chief Technology Officer** (CV), dates → **May 2021 – Apr 2024** (CV `05/2021 – 04/2024`; site currently `Apr 2021 – May 2024`). The site's prose `children` and skills array are **kept as-is** (parity is about the role title/dates, not a prose rewrite). The site's existing `(stack)` title-suffix convention may be preserved if Zac prefers, but the base title must read as CTO, not "Solutions Architect/Lead Engineer".

5. **Existing entries' style preserved (no gold-plating).** The remaining existing entries (Zarosoft, LMS, Koodoo, RightIndem, Various) are **left as-is** apart from the trivial optional `Various` start-year correction (`Approx. 2006` → `2007` per CV) at Zac's discretion. Do **not** strip the site's deliberate `(stack)` title suffixes, restructure the timeline, move experience data into config, or rewrite existing prose — that is out of scope (Epic 1 anti-gold-plating discipline).

6. **Zero front-of-house regression + clean build.** `npm run build` is a clean static export (every route `○ (Static)`, no `.func`) and `npm run lint` is clean (no unused-import or other errors). The rotating-title animation behaves **exactly as before** — same 4 s interval, same fade — since only the data array changed, not `rotating-job-title.tsx`. The Experience timeline renders correctly with the new entries.

## Tasks / Subtasks

- [ ] **Task 1 — Update rotating job titles in config (AC: #1)**
  - [ ] Edit `src/config/index.ts` only. Keep `JOB_TITLE = 'Contract Software Engineer'`.
  - [ ] Set `JOB_TITLES` to the locked array in Dev Notes. Keep `JOB_TITLE` as the first element.
  - [ ] Do NOT touch `rotating-job-title.tsx`, `loading-spinner.tsx`, or `layout.tsx` — they read `config.*` and need no change.
- [ ] **Task 2 — Add the three missing recent roles (AC: #2)**
  - [ ] In `src/components/organisms/experience.tsx`, add three `TimelineItem` entries at the top, newest-first: Prolific Academics Ltd → Subly → Flocast.
  - [ ] Write prose `children` in the existing site voice (first-person, lightly characterful), factually sourced from the CV content in Dev Notes; British spelling.
  - [ ] Provide an alphabetised `skills` array per entry, derived from each role's CV "Key Technologies" line (see Dev Notes recommendations).
  - [ ] Prolific: `startDate="Mar 2026"`, `endDate="Present"`.
- [ ] **Task 3 — Remove Beyonk (AC: #3)**
  - [ ] Delete the Beyonk `TimelineItem` block from `experience.tsx` (timeline top becomes Prolific → Subly → Flocast → Odondo).
- [ ] **Task 4 — Align Odondo to the CV (AC: #4)**
  - [ ] Update the Odondo entry's `jobTitle` to read as Chief Technology Officer and `startDate`/`endDate` to `May 2021` / `Apr 2024`. Leave its prose and skills untouched.
- [ ] **Task 5 — Optional Various year fix (AC: #5)**
  - [ ] If Zac approves: change the `Various` entry `startDate` from `Approx. 2006` to `2007`. Otherwise leave it.
- [ ] **Task 6 — Verify (AC: #6)**
  - [ ] `npm run build` — confirm green, pure static export (every route `○ (Static)`, no `.func`).
  - [ ] `npm run lint` — confirm clean.
  - [ ] `npm run dev` (or deploy preview) — confirm the timeline renders with the new entries in order, and the rotating job title still cycles every 4 s with the fade. Do NOT fabricate test runs (no test suite exists).

## Dev Notes

### What this story is (and is not)

This is a **data/config/copy** story under Epic 1's strict "zero change to structure, design, or flash; do not gold-plate" discipline. Two source files change: `src/config/index.ts` (rotating titles) and `src/components/organisms/experience.tsx` (roles). The **CV is the source of truth**: `scratch/Zac-Braddy-20260522.pdf` (also published at `public/pdfs/zac-braddy.pdf` by Story 1.1). The headline outcome is **no missing recent roles**. Do NOT redesign the timeline, move experience into config, or rewrite existing prose. [Source: epics.md#Epic-1, epics.md#Story-1.2; project-context.md "Data layer"]

### The experience component contract (read before editing)

`src/components/organisms/experience.tsx` is a Server Component (no `'use client'`) — a single `Experience` arrow component returning a `<div className="overflow-hidden">` containing a list of `<TimelineItem>` children, **hardcoded in JSX** (this is the established pattern — keep it; do not extract to config). Each item uses `src/components/organisms/timeline-item.tsx`, whose prop contract is:

```
startDate: string;        // required, e.g. "Jun 2024"
endDate?: string;         // optional, e.g. "Present" / "May 2024"
companyName: string;      // required
jobTitle?: string;        // optional — rendered in a `font-bold` div
skills?: string[];        // optional — rendered via SkillsList; site convention is ALPHABETISED
children: React.ReactNode;// required — one or more <p> prose paragraphs
```

Conventions to match: `skills` arrays are **alphabetically sorted**; titles often append a `(stack)` hint, e.g. `"Lead Software Engineer (Node-React)"` — this is deliberate site voice, **preserve it for new entries** (e.g. give the new roles a parallel `(stack)` suffix where natural). Prose is first-person and lightly characterful. Apostrophes in JSX must be escaped as `&apos;` for `react/no-unescaped-entities` (the existing file uses `we&apos;re`, `couldn&apos;t`, etc.). [Source: src/components/organisms/experience.tsx, src/components/organisms/timeline-item.tsx; memory: theseus-epic3-jsx-apostrophe-escaping]

### British spelling (owner preference + project rule)

User-facing copy uses **British spelling**. The existing file's one Americanism — `optimize` at `experience.tsx:32` — lives in the Beyonk entry, which is being removed (so it's mooted). Write all new prose with British spelling (`optimise`, `modernise`, `prioritise`, `behaviour`). [Source: project-context.md "Language-Specific Rules"; global CLAUDE.md]

### CV roles — source of truth (newest → oldest)

| #   | CV title                                         | Company                | CV dates          | Location         |
| --- | ------------------------------------------------ | ---------------------- | ----------------- | ---------------- |
| 1   | Senior Software Engineer (Contract)              | Prolific Academics Ltd | 2026 (current)    | Remote, UK       |
| 2   | Senior Software Engineer                         | Subly                  | 09/2025 – 02/2026 | Remote, UK       |
| 3   | Technical Co-Founder                             | Flocast                | 11/2024 – 06/2025 | Remote, UK       |
| 4   | Chief Technology Officer                         | Odondo                 | 05/2021 – 04/2024 | Remote, UK       |
| 5   | Senior Frontend Developer                        | LMS                    | 03/2021 – 04/2021 | Remote, UK       |
| 6   | Director/Contract Software Engineer              | Zarosoft Ltd           | 02/2021 – 05/2023 | Remote, UK       |
| 7   | Lead Software Engineer                           | Koodoo                 | 06/2018 – 01/2021 | Nottingham, UK   |
| 8   | Principal Developer                              | RightIndem             | 04/2017 – 06/2018 | Nottingham, UK   |
| 9   | Various Software Engineering and Technical Roles | Many Employers         | 01/2007 – 03/2017 | UK and Australia |

### Current site experience (newest → oldest, from experience.tsx)

| jobTitle                                             | companyName                  | dates                   | CV match?                                            |
| ---------------------------------------------------- | ---------------------------- | ----------------------- | ---------------------------------------------------- |
| Senior Fullstack Developer (Node-Svelte)             | Beyonk                       | Jun 2024 – Present      | **NOT on CV → Q2**                                   |
| CTO/Solutions Architect/Lead Engineer (Python-react) | Odondo Ltd                   | Apr 2021 – May 2024     | title+dates differ → align (AC #4)                   |
| Director/Contract Software Engineer                  | Zarosoft Ltd                 | Feb 2021 – May 2023     | matches — leave                                      |
| Senior Contract Frontend Developer (React)           | Legal and Marketing Services | Mar 2021 – Apr 2021     | matches (site keeps fuller name/suffix) — leave      |
| Lead Software Engineer (Node-React)                  | Koodoo Mortgages Limited     | Jun 2018 – Jan 2021     | matches — leave                                      |
| Principal Developer                                  | RightIndem                   | Apr 2017 – Jun 2018     | matches — leave                                      |
| Various Technical Roles                              | Various                      | Approx. 2006 – Mar 2017 | start year differs (2006 vs 2007) → optional (AC #5) |

### The delta (exactly what changes)

1. **ADD** Prolific Academics Ltd, Subly, Flocast (top of timeline, in that order). — AC #2
2. **REMOVE** Beyonk (absent from CV; "Present" inaccurate) — locked. — AC #3
3. **ALIGN** Odondo: title → CTO, dates → May 2021 – Apr 2024. Prose/skills untouched. — AC #4
4. **OPTIONAL** Various start year 2006 → 2007. — AC #5
5. Everything else stays. Do not strip `(stack)` suffixes, do not reorder existing entries, do not rewrite prose.

### Source content for the three new roles (from the CV — rewrite in site voice, British spelling)

**Prolific Academics Ltd — `jobTitle` e.g. "Senior Software Engineer (Contract)"** — `startDate="Mar 2026"`, `endDate="Present"`:

- Designed and delivered a production observability MVP to support the launch of Prolific's newly modernised Enterprise Payments System.
- Dashboards for proactive observability (the "golden metrics" across all payment flows) plus reactive observability via anomaly alerts.
- Observability instrumentation spanning both the legacy Django monolith and the modernised FastAPI system — clear reporting on performance, errors and throughput.
- Delivered production-ready Terraform deployed via GitHub Actions so dashboards/alerts are version-controlled, not "snowflake" Datadog-UI changes.
- Recommended `skills` (alphabetised): `['AWS', 'Datadog', 'Django', 'Fast API', 'Github Actions', 'Linux', 'Python', 'Terraform']`

**Subly — `jobTitle` e.g. "Senior Software Engineer (Node-AI)"** — `startDate="Sep 2025"`, `endDate="Feb 2026"`:

- Transformed a WCAG video-accessibility analyser from a "best guess" reporting tool into one giving accurate violation detection with descriptions and actionable remediation guidance.
- Delivered a 4× performance improvement to the video-analysis pipeline (from 26× video length down to 6×).
- Re-engineered the GPT-4o and Gemini integrations through better prompt engineering, context management and tool-use patterns, improving accuracy and consistency.
- Rapidly up-skilled in FFmpeg, OpenCV and PaddleOCR to optimise the video/image pipelines.
- Key tech (CV): Node/TypeScript with Express API, AWS, React, AI integration via the Vercel SDK to GPT-4o and Gemini.
- Recommended `skills` (alphabetised): `['AWS', 'Express JS', 'FFmpeg', 'Gemini', 'GPT-4o', 'Javascript', 'Node JS', 'OpenCV', 'PaddleOCR', 'React', 'Typescript', 'Vercel AI SDK']`

**Flocast — `jobTitle` e.g. "Technical Co-Founder (Node-React)"** — `startDate="Nov 2024"`, `endDate="Jun 2025"`:

- Built a complete fintech product from concept to paying customers in 5 months as the sole technical resource (NestJS backend, Refine frontend, hosted on Render + AWS, full CI/CD via GitHub Actions).
- Architected integrations with Xero, QuickBooks and Stripe — the core financial data flows the product was built around.
- Acted as de facto CTO for a non-technical co-founder: translating business ambitions into technical strategy, managing scope, and making pragmatic architecture decisions that prioritised speed to market.
- Deliberately adopted an unfamiliar stack (TypeScript, NestJS, Refine, Render) to pick the best tools for the job — shipping a working proof of concept in the first month that became the production MVP.
- Recommended `skills` (alphabetised): `['AWS', 'Github Actions', 'NestJS', 'Node JS', 'QuickBooks', 'React', 'Refine', 'Render', 'Stripe', 'Typescript', 'Xero']`

> Note: `skills` values are surface labels for `SkillsList`; pick whichever spellings/abbreviations read consistently with the existing arrays (e.g. the file already uses `Fast API`, `Github Actions`, `Node JS`). These lists are recommendations — trim/extend to taste, but keep them alphabetised and CV-grounded (don't invent tech that isn't on the CV).

### Rotating job titles — current vs recommended

Current `JOB_TITLES` (`src/config/index.ts`): `Contract Software Engineer` (= `JOB_TITLE`), `Chief Technology Officer`, `Mutant Code Monkey`, `Principal Software Engineer`, `Prolific Content Creator`, `Code Chameleon`, `Lead Web Developer`, `Music Fanatic`, `Javascript/Python Enthusiast`, `1337 Video Gamer`, `Former .NET Hacker`.

The rotating titles are a personality/flash element, so "CV parity" here is loose — the bar is "current and honest," not "every CV title." Locked changes (confirmed by Zac):

- **Keep** `JOB_TITLE` = `'Contract Software Engineer'` (matches the CV header) as element 0.
- **Add** `'Technical Co-Founder'` and `'0-to-1 Builder'` (the We Right Code positioning — Builder → Modernisation → Strategy gradient, lead with what gets built).
- **Drop** clearly-stale `'Prolific Content Creator'` (The Reactionary is being removed in Story 1.4; not a current activity).
- **Keep** the personality entries (`Mutant Code Monkey`, `Code Chameleon`, `Music Fanatic`, `Javascript/Python Enthusiast`, `1337 Video Gamer`, `Former .NET Hacker`) and the real `Chief Technology Officer`, `Principal Software Engineer`, `Lead Web Developer`.

Locked array:

```ts
JOB_TITLES: [
  JOB_TITLE, // 'Contract Software Engineer'
  'Technical Co-Founder',
  '0-to-1 Builder',
  'Chief Technology Officer',
  'Mutant Code Monkey',
  'Principal Software Engineer',
  'Code Chameleon',
  'Lead Web Developer',
  'Music Fanatic',
  'Javascript/Python Enthusiast',
  '1337 Video Gamer',
  'Former .NET Hacker',
];
```

`rotating-job-title.tsx` cycles by index every 4 s and wraps at `length - 1`, so any array length works — no component change needed. [Source: src/components/molecules/rotating-job-title.tsx, src/config/index.ts]

### Where JOB_TITLE / JOB_TITLES are consumed (so you know nothing else needs editing)

- `src/components/molecules/rotating-job-title.tsx` — cycles `config.JOB_TITLES` (4 s interval, `AnimateOnChange` fade). **Do not edit** — data-only change preserves behaviour (AC #6).
- `src/components/atoms/loading-spinner.tsx:32` and `src/app/layout.tsx:92` — render `config.JOB_TITLE`. Since `JOB_TITLE` stays unchanged, these are unaffected. **Do not edit.**

### Verification standard (no test suite)

`npm test` is a stub (`exit 1`) — there is **no** test framework. Do not fabricate test runs. Verification is: `npm run build` green + pure static export (every route `○ (Static)`, no `.func`), `npm run lint` clean, plus a manual `npm run dev`/preview check that the timeline shows the new entries in order and the rotating title still fades on its 4 s cycle. [Source: project-context.md "Testing Rules"; epics.md#AR-15]

### Previous story intelligence (Story 1.1)

Story 1.1 (done) was asset-only (portrait + CV overwrites, zero code edits) and confirmed the staged CV `scratch/Zac-Braddy-20260522.pdf` is the current 2026-05-22 document now also at `public/pdfs/zac-braddy.pdf`. Same Epic 1 discipline carries here: stay thin, no gold-plating, build + lint + visual is the bar. Story 1.3 (About-me stats 39→41 + summary reposition) and Story 1.4 (prune Twitter / The Reactionary / dead handle) are **out of scope** — do not start them. [Source: 1-1-swap-in-the-current-photo-and-cv.md]

### Project Structure Notes

- Files touched: `src/config/index.ts`, `src/components/organisms/experience.tsx`. Both already exist; in-place edits only. No new files, no new dependencies, no structure change.
- Component tiers unchanged: `Experience` stays an organism, `TimelineItem` stays an organism, `RotatingJobTitle` stays a molecule, config stays the data layer.
- Epic 2 later relocates these front-of-house pages verbatim into `(site)/`; nothing here should anticipate that.

### References

- [Source: epics.md#Story-1.2] — story statement, acceptance criteria, FR-3.
- [Source: epics.md#Epic-1] — data/config/copy-only scope, zero-regression / no-gold-plating discipline.
- [Source: scratch/Zac-Braddy-20260522.pdf] — CV source of truth (roles, dates, key technologies).
- [Source: src/config/index.ts] — `JOB_TITLE` / `JOB_TITLES`.
- [Source: src/components/organisms/experience.tsx] — hardcoded TimelineItem list, prose voice, alphabetised skills.
- [Source: src/components/organisms/timeline-item.tsx] — TimelineItem prop contract.
- [Source: src/components/molecules/rotating-job-title.tsx] — 4 s rotation, wrap behaviour.
- [Source: project-context.md] — data layer in config, British spelling, no test suite, static export.
- [Source: memory theseus-epic3-jsx-apostrophe-escaping] — escape `'` as `&apos;` in JSX prose.

## Decisions Locked (confirmed by Zac, 2026-06-26)

- **Rotating titles** — use the locked `JOB_TITLES` array in Dev Notes (adds `Technical Co-Founder` + `0-to-1 Builder`, drops `Prolific Content Creator`, keeps CTO + personality entries).
- **Beyonk** — **remove** the entry entirely (absent from the CV; "Present" inaccurate).
- **Prolific start month** — `Mar 2026` (`endDate="Present"`).

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
