---
baseline_commit: 4f3452f
---

# Story 3.3: Resume page (`/resume`)

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a site visitor,
I want the Resume page with the experience timeline, certifications, and skills,
so that I see Zac's career history exactly as presented today.

## Context & purpose (read first)

This is the **third story of Epic 3** (Content Pages at Parity). The themed, persistent,
fully-navigable shell exists (Epics 1–2 done) and **3.1 (Home) and 3.2 (About Me) are done** —
establishing the Epic-3 house pattern: a **Server-Component page** that composes content +
exports per-page `metadata`, with **`'use client'` only on interactive leaves**, all rendered
as `children` inside `<ContentTransition>` in the root `layout.tsx`. This story does the
`/resume` route.

`/resume` is the **simplest Epic-3 page in interaction terms — there is no interactivity at
all**, so **every component on this page is a Server Component** (no `'use client'` anywhere,
unlike the 3.1 rotating titles and the 3.2 testimonials carousel). It has three stacked
content blocks inside the standard page wrapper:

1. **Experience** — a `Heading`, then `<Experience>`: an `overflow-hidden` column of **seven
   `TimelineItem`s** (Beyonk, Odondo, Zarosoft, LMS, Koodoo, RightIndem, Various), each with
   start/end dates, company, job title, 1–2 prose `<p>`s, and a sorted `SkillsList` of `Pill`s.
2. **Certifications** (left column at `md`+) — a `Heading` + `<Certifications>`: **seven
   `TimelineItem`s** (La Trobe degree + six Microsoft/MongoDB certs) with **no jobTitle and no
   skills** (the same `TimelineItem` rendered in its bare form).
3. **Other Skills/Knowledge** (right column at `md`+) — a `Heading` (with an inline
   `text-secondary` span) + a single `SkillsList` of sixteen methodology/architecture `Pill`s.

The single source of visual/behavioural truth is the **live site** (`zackerthehacker.com`) and
the archived Gatsby tree (`archive/src/pages/resume.js` + its organisms/molecules/atoms). This
is a **byte-for-byte parity port** (NFR1 zero-visual-regression, NFR2 zero-functional-regression,
NFR7 preserve quirks). **Content is frozen** — Epic 3 is like-for-like translation only; the
stale job dates (Beyonk "Present", overlapping Zarosoft/Odondo dates), the bachelor-degree
typos (`MonogoDB`, `MSCD`, `Programatic`), and the casual prose voice are **Project Ariadne's**
content refresh, **not Theseus's** (do **not** "update", "correct", or "tidy" any copy here).

**3.3's job — build the Resume component subtree at parity, completing the styled-components
removal:**

- **The headline move (FR24 / AR15 / ADR 0004):** port `atoms/timeline-divider.js`, the
  **last `styled.div` in the codebase**, from styled-components to a **CSS Module** —
  visually identical, no CSS-in-JS runtime remaining. After this story, the
  styled-components removal decided in **ADR 0004** is fully executed (theming → Epic 1,
  `AnimatedContainer` → Story 2.1, divider → here). **This is a decided direction — no new
  ADR is required** (it executes ADR 0004), **unless** a genuinely non-obvious reconciliation
  call surfaces (see Dev Note "Divider parity risk: the `padding-top` cascade").
- **Build the new atoms/molecules/organisms** the page composes: `Pill` (**NEW** — not yet in
  the Theseus tree), `TimelineDivider` (SC→module), `TimelineTimeCompany` (+ its module),
  `SkillsList`, `TimelineItem`, `Experience`, `Certifications`, and the route
  `src/app/resume/page.tsx`. **Reuse the existing `Heading` atom** (built in 3.2) — do not
  re-create it.
- **Apply the ADR 0021 metadata convention** — `/resume` is a **child** route segment, so
  `title: 'Resume'` + the root `%s - Zac Braddy` template renders
  `<title>Resume - Zac Braddy</title>` (the root-page `title.absolute` workaround from 3.1
  does **not** apply here; identical to how 3.2 handled `/about-me`).
- **Scope is notably tight vs 3.2:** **no `globals.css` change** (resume uses only standard
  Tailwind spacing + already-defined themed utilities — there is **no** custom-spacing token to
  re-declare), **no new dependency** (Pill/SkillsList/timeline are plain Tailwind + one CSS
  module — the divider port _removes_ CSS-in-JS, it adds nothing), and **no new images**.

After this: Content (3.4) reuses `Heading`; 404 (3.5).

## Acceptance Criteria

1. **The three Resume blocks render at content/structure parity (FR13).**
   **Given** the resume route,
   **When** it renders,
   **Then** it shows the **Experience** timeline, **Certifications**, and the **Other
   Skills/Knowledge** list — in that order/layout — with their existing content and structure
   (FR13), inside the page wrapper `<div className="px-4 py-8 grid grid-cols-1 gap-8">`
   (verbatim from `archive/src/pages/resume.js`), with the `md:grid md:grid-cols-2 gap-4`
   two-column block holding Certifications (left) and Other Skills/Knowledge (right),
   **And** every heading uses the shared **existing** `Heading` atom (built in 3.2; reused, not
   re-created) — including the top `<Heading className="text-secondary">Resume</Heading>`, the
   `<Heading>Experience</Heading>`, `<Heading>Certifications</Heading>`, and the
   `Other Skills/<span className="text-secondary">Knowledge</span>` heading — verbatim,
   **And** all copy is **frozen**: the **seven Experience `TimelineItem`s** (companies, dates,
   job titles, prose paragraphs, skills arrays) and the **seven Certifications `TimelineItem`s**
   (institutions, dates, qualifications) and the **sixteen Other-Skills pills** are reproduced
   **exactly** as the archive — including the typos (`MonogoDB`, `MSCD`, `Programatic
Programming Principles`) and the casual prose, which are **Ariadne's** to fix, not Theseus's
   (NFR7).

2. **The timeline divider is reimplemented as a CSS Module — visually identical, no CSS-in-JS
   runtime remaining (AR15, FR24, ADR 0004).**
   **Given** the timeline divider (today an `atoms/timeline-divider.js` static-CSS
   `styled.div`),
   **When** the timeline renders,
   **Then** the divider is reimplemented as **`src/components/atoms/timeline-divider.tsx` +
   `timeline-divider.module.css`** with the SC body ported **value-for-value** (the
   `width: 1px; margin-top: -4rem; padding-top: 4rem; margin-left: 0.5rem` line, plus the two
   `::before` / `::after` dot pseudo-elements with their exact dimensions, colours
   (`var(--color-bg-secondary)` @ `opacity:0.25`; `var(--color-bg-primary-400)` +
   `border-color: var(--color-border-secondary)`), radii, margins, and `z-index:10`),
   **And** the component still accepts and applies its `className` prop — the consumer passes
   `className="static py-4 top-0 bottom-0 bg-tertiary"`, so the rendered element carries
   **both** the module class **and** those utilities (merge them:
   `className={`${styles.timelineDivider} ${className}`}`),
   **And** **no `styled-components` import or any CSS-in-JS runtime remains** anywhere — this
   completes the ADR-0004 removal (theming was Epic 1, `AnimatedContainer` was Story 2.1, the
   divider is the last footprint); confirm `package.json` contains no `styled-components` (it
   does not) and no source file imports it,
   **And** the divider is **visually identical** to today (both dots, the connector line
   colour `bg-tertiary`, the vertical positioning) — verified against the live site at the
   browser check and the Story 4.1 gate (see Dev Note "Divider parity risk").

3. **Every Resume component is a Server Component — no `'use client'` is introduced (AR14,
   NFR5).**
   **Given** the resume page has **no interactivity** (no hooks, no event handlers, no
   client-only APIs),
   **When** the subtree is built,
   **Then** the page and **all** of its components (`ResumePage`, `Experience`,
   `Certifications`, `TimelineItem`, `TimelineTimeCompany`, `TimelineDivider`, `SkillsList`,
   `Pill`) render as **Server Components** — **no `'use client'` directive is added to any of
   them** (AR14: content organisms render on the server; NFR5 server-by-default posture),
   **And** the route `/resume` is statically generated (`○ (Static)` in the build output).

4. **Per-page SEO metadata matches today via the Metadata API + the child-segment template
   (FR17, ADR 0021).**
   **Given** the Next Metadata API and the ADR-0021 convention,
   **When** `/resume` is served,
   **Then** `src/app/resume/page.tsx` exports `metadata` with **`title: 'Resume'`**, which —
   because `/resume` is a **child** route segment — the root `%s - Zac Braddy` template renders
   as **`<title>Resume - Zac Braddy</title>`** (the root-page `title.absolute` workaround from
   3.1 does **not** apply to child segments; identical to 3.2's `/about-me`),
   **And** `openGraph.title` and `twitter.title` are set to **`'Resume - Zac Braddy'`** (matching
   the archive `Seo title="Resume - Zac Braddy"`),
   **And** description, OG image, Twitter `summary_large_image` card, and favicon **inherit**
   the root-layout defaults (Story 1.6) — **not** re-declared,
   **And** no `react-helmet` is used (FR17).

5. **Build green; static export intact; parity verified; scope held — and notably tight
   (NFR1/NFR2/NFR5/NFR6).**
   **Given** the change,
   **When** `npm run build` and `npm run lint` are run,
   **Then** both are green (TypeScript `strict`, **no `any`**, no lint errors) and the build
   stays a **pure static export** (route `/resume` shows as `○ (Static)`, no serverless
   functions),
   **And** the page (the seven experience items with dates/company/title/prose/skills, the
   seven certifications, the sixteen skill pills, the timeline dividers with both dots and the
   connector line, the responsive `md:` two-column split, the desktop-vs-mobile
   `TimelineTimeCompany` swap) is verified in a browser in **both themes**, desktop **and**
   mobile, against the live site,
   **And** the change is confined to: the new `resume` route + the Resume component subtree
   (one reused `Heading`, the new `Pill`/`TimelineDivider`(+module)/`TimelineTimeCompany`(+module)/
   `SkillsList`/`TimelineItem`/`Experience`/`Certifications`) + sprint/story tracking —
   **with NO `globals.css` change, NO new dependency, and NO new image** (see Dev Note "Why
   the scope is tighter than 3.2") — and **no** edits to any Epic 1–2 shell behaviour and **no**
   other Epic 3 page.

6. **Decision capture as-you-go (FR26 / AR19) — no new ADR expected.**
   **Given** the cross-cutting decision-capture DoD,
   **When** the divider SC→CSS-Module port is performed,
   **Then** it is recognised as **execution of the already-accepted [ADR
   0004](../../docs/decisions/0004-remove-styled-components.md)** ("`timeline-divider` → CSS
   Module" is named in its Consequences), so **no new ADR is required** for the planned work,
   **And** an ADR (next free number **0024**) is written **only if** a genuinely non-obvious
   reconciliation call is actually made during the port — specifically if the
   `padding-top: 4rem` (module) vs `py-4` (passed utility) cascade has to be resolved in a way
   that deviates from a verbatim port (see Dev Note "Divider parity risk"); otherwise nothing
   new is captured (do not manufacture an ADR to tick a box — NFR6),
   **And** if a genuinely-deferrable item surfaces, it is logged in `deferred-work.md`
   (story-3.3) rather than gold-plated (NFR6).

## Tasks / Subtasks

- [ ] **Task 1 — Build the `Pill` atom (NEW — Server Component)** (AC: #1, #3)
  - [ ] `src/components/atoms/pill.tsx` — port `archive/src/components/atoms/pill.js` verbatim
        (`{ children: React.ReactNode }`):
    ```tsx
    const Pill = ({ children }: { children: React.ReactNode }) => (
      <div className="border border-secondary text-secondary p-2 rounded mt-2 mr-2">
        {children}
      </div>
    );
    export default Pill;
    ```
    `Pill` is **not yet in the Theseus tree** (the prior Epic-3 pages didn't need it) — this is a
    genuinely new atom. `border-secondary`/`text-secondary` are defined `@utility` themed
    classes (verified in `globals.css`); `border` (bare width/style) resolves its colour from
    `border-secondary`, so the Tailwind-v4 border guard (ADR 0009) is not in play here. All class
    strings stay **static literals** (Tailwind v4 scan safety).

- [ ] **Task 2 — Port the timeline divider from styled-components to a CSS Module** (AC: #2, #3)
  - [ ] `src/components/atoms/timeline-divider.module.css` — port the SC body
        **value-for-value** to `.timelineDivider` + its pseudo-elements:

    ```css
    .timelineDivider {
      width: 1px;
      margin-top: -4rem;
      padding-top: 4rem;
      margin-left: 0.5rem;
    }

    .timelineDivider::before {
      content: '';
      display: block;
      margin-top: 0.25rem;
      width: 1rem;
      height: 1rem;
      margin-left: -0.5rem;
      border-radius: 1rem;
      background-color: var(--color-bg-secondary);
      opacity: 0.25;
    }

    .timelineDivider::after {
      content: '';
      display: block;
      margin-top: -0.84rem;
      width: 0.63rem;
      height: 0.63rem;
      margin-left: -0.31rem;
      background-color: var(--color-bg-primary-400);
      border: 2px solid;
      border-color: var(--color-border-secondary);
      border-radius: 0.5rem;
      z-index: 10;
    }
    ```

  - [ ] `src/components/atoms/timeline-divider.tsx` — a **Server Component** that merges the
        module class with the passed `className` (mirroring the `import styles from './x.module.css'`
        idiom used by `testimonial-portrait.tsx`):

    ```tsx
    import styles from './timeline-divider.module.css';

    const TimelineDivider = ({ className = '' }: { className?: string }) => (
      <div className={`${styles.timelineDivider} ${className}`} />
    );
    export default TimelineDivider;
    ```

  - [ ] **Do not** add `'use client'` — it is a pure static element. **Do not** import
        `styled-components` (it is not a dependency; keep it that way — AC #2). The CSS vars
        (`--color-bg-secondary`, `--color-bg-primary-400`, `--color-border-secondary`) are global
        (`:root`/`.light` in `globals.css`) and resolve in a CSS Module unchanged.
  - [ ] Read Dev Note **"Divider parity risk: the `padding-top` cascade"** before finishing — the
        consumer also passes `py-4`, which overlaps the module's `padding-top: 4rem`. Port both
        faithfully and verify the dot/line vertical placement against the live site.

- [ ] **Task 3 — Build `TimelineTimeCompany` (+ its module) (NEW — Server Component)** (AC: #1, #3)
  - [ ] `src/components/atoms/timeline-time-company.module.css` — port verbatim:
    ```css
    .notInlineContainer {
      min-width: 11rem;
    }
    ```
  - [ ] `src/components/atoms/timeline-time-company.tsx` — port
        `archive/.../atoms/timeline-time-company.js` verbatim, switching the archive's **named**
        module import (`import { notInlineContainer } from './…'`) to the Theseus **default**-import
        idiom (`import styles from './…'`; reference `styles.notInlineContainer`):

    ```tsx
    import styles from './timeline-time-company.module.css';

    const TimelineTimeCompany = ({
      startDate,
      endDate,
      companyName,
      inline,
    }: {
      startDate: string;
      endDate?: string;
      companyName: string;
      inline: boolean;
    }) => (
      <div
        className={`mr-4 italic flex flex-col text-sm ${
          inline
            ? 'items-start block lg:hidden'
            : `${styles.notInlineContainer} items-end hidden lg:block`
        }`}
      >
        <div className="font-bold">{`${startDate}${
          endDate ? ` - ${endDate}` : ''
        }`}</div>
        <div>{companyName}</div>
      </div>
    );
    export default TimelineTimeCompany;
    ```

    Keep the dual inline/not-inline render (the same time/company shown left-aligned-inline below
    `lg`, right-aligned in its own column at `lg`+) — this is the responsive timeline layout,
    port verbatim. The template-literal className is **dynamic only via the static
    `styles.notInlineContainer` hash and fixed string branches** — no interpolated Tailwind token
    names, so Tailwind v4 scanning is safe.

- [ ] **Task 4 — Build the `SkillsList` molecule (NEW — Server Component)** (AC: #1, #3)
  - [ ] `src/components/molecules/skills-list.tsx` — port `archive/.../molecules/skills-list.js`,
        composing the new `Pill`:

    ```tsx
    import Pill from '@/components/atoms/pill';

    const SkillsList = ({ skills }: { skills: string[] }) => (
      <div className="flex flex-flow-col flex-wrap">
        {[...skills].sort().map((s, i) => (
          <Pill key={i}>{s}</Pill>
        ))}
      </div>
    );
    export default SkillsList;
    ```

  - [ ] **`flex-flow-col` is a harmless no-op** — it is **not** a real Tailwind utility (only
        `flex` and `flex-wrap` are), exactly like the `panel`/`anchor`/`text-md` no-op classes
        ported verbatim in 3.1/3.2. Keep it byte-faithful; it attaches no CSS and changes nothing.
  - [ ] **`[...skills].sort()` not `skills.sort()`** — the archive called `skills.sort()`, which
        mutates the prop array in place. The arrays here are always fresh literals so the rendered
        (alphabetically-sorted) output is **identical** either way; copying first (`[...skills]`)
        avoids mutating a prop and is the safe equivalent — output parity is preserved. (Same
        "fix the obvious smell, keep the output byte-identical" principle as the 3.2 `class=` →
        `className=` fix; if you prefer strict verbatim, `skills.sort()` is acceptable — the sort
        order is the same.) Keep the index `key={i}` verbatim.

- [ ] **Task 5 — Build `TimelineItem` (NEW — Server Component, in `organisms/`)** (AC: #1, #3)
  - [ ] `src/components/organisms/timeline-item.tsx` — port `archive/.../organisms/timeline-item.js`
        verbatim (the archive places this composite in `organisms/`; keep that tier so the
        `Experience`/`Certifications` imports match and the parity map is 1:1). Composes
        `TimelineTimeCompany` (×2, inline + not-inline), `TimelineDivider`, and `SkillsList`:

    ```tsx
    import SkillsList from '@/components/molecules/skills-list';
    import TimelineDivider from '@/components/atoms/timeline-divider';
    import TimelineTimeCompany from '@/components/atoms/timeline-time-company';

    const TimelineItem = ({
      startDate,
      endDate,
      companyName,
      jobTitle,
      skills = [],
      children,
    }: {
      startDate: string;
      endDate?: string;
      companyName: string;
      jobTitle?: string;
      skills?: string[];
      children: React.ReactNode;
    }) => (
      <div className="flex py-8">
        <TimelineTimeCompany
          startDate={startDate}
          endDate={endDate}
          companyName={companyName}
          inline={false}
        />
        <TimelineDivider className="static py-4 top-0 bottom-0 bg-tertiary" />
        <div className="grid grid-cols-1 gap-4 ml-8">
          <TimelineTimeCompany
            startDate={startDate}
            endDate={endDate}
            companyName={companyName}
            inline={true}
          />
          <div className="font-bold">{jobTitle}</div>
          <div className="grid grid-cols-1 gap-4 ml-4">
            {children}
            <SkillsList skills={skills} />
          </div>
        </div>
      </div>
    );
    export default TimelineItem;
    ```

  - [ ] **`jobTitle` and `skills` are optional** — Certifications pass **neither** (the
        `<div className="font-bold">{jobTitle}</div>` renders empty and `SkillsList` renders an
        empty wrapper). Port this verbatim — the empty `font-bold` div and empty skills wrapper
        are how certs render today (NFR7). The archive's JS default `skills = []` becomes the
        TS optional `skills?: string[]` with the same `= []` default in the destructure.
  - [ ] The passed divider `className="static py-4 top-0 bottom-0 bg-tertiary"` is the **only**
        place `TimelineDivider` is used — keep the string verbatim (see Dev Note "Divider parity
        risk").

- [ ] **Task 6 — Build the `Experience` organism (NEW — Server Component)** (AC: #1, #3)
  - [ ] `src/components/organisms/experience.tsx` — port `archive/.../organisms/experience.js`
        **verbatim**: `<div className="overflow-hidden">` wrapping **seven `TimelineItem`s**, in
        order: **Beyonk** (Jun 2024–Present), **Odondo Ltd** (Apr 2021–May 2024), **Zarosoft Ltd**
        (Feb 2021–May 2023), **Legal and Marketing Services** (Mar 2021–Apr 2021), **Koodoo
        Mortgages Limited** (Jun 2018–Jan 2021), **RightIndem** (Apr 2017–Jun 2018), **Various**
        (Approx. 2006–Mar 2017). Copy each `startDate`/`endDate`/`companyName`/`jobTitle`, the
        full `skills={[…]}` array, and the 1–2 `<p>` prose blocks **exactly** from
        `archive/src/components/organisms/experience.js` — these are long; reproduce byte-for-byte,
        **including** the overlapping/odd dates and the casual voice (frozen content, Ariadne's
        job — NFR7). The "Various" item passes **no `skills`** (omit the prop).
  - [ ] Watch JSX entity escaping: straight apostrophes in the prose (`we're`, `I've`, `you're`,
        `Let's`, `I'm`) trip `react/no-unescaped-entities` (the lint rule that bit 3.2). Write
        them as `&apos;` (renders identically — parity preserved), per
        [[theseus-epic3-jsx-apostrophe-escaping]]; any curly `’` already in the source stays
        literal (it does not trip the rule).

- [ ] **Task 7 — Build the `Certifications` organism (NEW — Server Component)** (AC: #1, #3)
  - [ ] `src/components/organisms/certifications.tsx` — port `archive/.../organisms/certifications.js`
        **verbatim**: `<div className="overflow-hidden">` wrapping **seven `TimelineItem`s** with
        **no jobTitle / no skills**, in order: **La Trobe University** (2003–2007) "Bachelor of
        Business(Accounting)/Bachelor of Computing(Software Engineering)"; **MonogoDB** (2015)
        "MongoDB for .NET Developers"; then five **Microsoft** (2016–2018) entries — "MSCD: Web
        Applications", "MCSP: Microsoft Certified Professional", "Developing Microsoft Azure Web
        Services", "MS: Developing ASP.NET MVC Applications", "MS: Programming in C#".
  - [ ] **Frozen typos stay:** `MonogoDB` (the company-name typo), `MSCD` (sic), and the
        bracket-spacing of the La Trobe line are **reproduced exactly** — they are Ariadne's
        content fixes, not Theseus's (NFR7). The MongoDB item passes only `startDate` (no
        `endDate`) — port that asymmetry verbatim.

- [ ] **Task 8 — Create the route page (Server Component + metadata)** (AC: #1, #4)
  - [ ] Create `src/app/resume/page.tsx` as a **Server Component** (no `'use client'`), reusing
        the **existing** `Heading` atom and composing `Experience` + `Certifications` +
        `SkillsList`:

    ```tsx
    import type { Metadata } from 'next';
    import Heading from '@/components/atoms/heading';
    import Experience from '@/components/organisms/experience';
    import Certifications from '@/components/organisms/certifications';
    import SkillsList from '@/components/molecules/skills-list';

    export const metadata: Metadata = {
      title: 'Resume',
      openGraph: { title: 'Resume - Zac Braddy' },
      twitter: { title: 'Resume - Zac Braddy' },
    };

    export default function ResumePage() {
      return (
        <div className="px-4 py-8 grid grid-cols-1 gap-8">
          <Heading className="text-secondary">Resume</Heading>
          <Heading>Experience</Heading>
          <Experience />
          <div className="md:grid md:grid-cols-2 gap-4">
            <div className="grid grid-cols-1 gap-4">
              <Heading>Certifications</Heading>
              <Certifications />
            </div>
            <div>
              <Heading>
                Other Skills/<span className="text-secondary">Knowledge</span>
              </Heading>
              <div className="pt-4">
                <SkillsList
                  skills={[
                    'Agile',
                    'Shape up',
                    'TDD',
                    'BDD',
                    'DDD',
                    'Evolutionary Architecture',
                    'Fitness functions',
                    'SOLID',
                    'Programatic Programming Principles',
                    'Public Speaking',
                    'Leadership',
                    'Time management',
                    'C4 modelling',
                    'Microservices architecture',
                    'Event driven systems',
                    'Monolithic architecture',
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
    ```

  - [ ] The sixteen-skill array is **frozen content** — reproduce verbatim, including
        `Programatic Programming Principles` (sic). `SkillsList` sorts them alphabetically for
        render (as today). `title: 'Resume'` (plain, **not** `title.absolute`) — `/resume` is a
        child segment so the root template applies (the 3.1 root-page exception does not). Do
        **not** re-declare description/OG-image/card/favicon — they inherit the Story-1.6 defaults.
  - [ ] The page renders as `children` inside `<ContentTransition>` in `layout.tsx` — supply only
        the inner section markup, no shell chrome, no extra height wrappers.

- [ ] **Task 9 — Verify (build, lint, static export, in-browser parity)** (AC: #2, #3, #5)
  - [ ] `npm run build` → green, **pure static export** (`/resume` listed as `○ (Static)`, no
        `.func`). Confirm `out/resume/index.html` contains the four+ headings, all seven company
        names (Beyonk … Various), the seven certification lines, the sixteen skill pills, and
        `<title>Resume - Zac Braddy</title>`.
  - [ ] `npm run lint` → clean (TS strict, **no `any`**, no lint errors; watch the apostrophe
        escaping from Task 6).
  - [ ] Confirm the divider in the generated CSS: the `.timelineDivider` rule + its
        `::before`/`::after` pseudo-elements are emitted from the **CSS Module** (not injected by a
        styled-components runtime), and **no `styled-components` appears** in `package.json` or any
        import (AC #2).
  - [ ] `npm run dev`, load `/resume` in a browser and compare to the live site, in **both
        themes**, **desktop and mobile**: (a) the seven experience items — dates, company, job
        title, prose, sorted skill pills; (b) the **timeline divider** — the faded large dot
        (`::before`), the ringed small dot (`::after`), the `bg-tertiary` connector line, and the
        vertical positioning of dots relative to each item (the **`padding-top` cascade** —
        Divider parity risk); (c) the **`md:` two-column split** (Certifications left, Skills
        right) collapsing to one column below `md`; (d) the **`TimelineTimeCompany` swap** — the
        right-aligned date/company column at `lg`+ vs the inline block below `lg`; (e) the
        sixteen skill pills sorted alphabetically. Record honestly what was observed; route the
        final all-tier visual sign-off to the **Story 4.1 gate**.
  - [ ] `npm run format`. Confirm `git diff` is confined to the AC #5 surface — in particular
        that **`globals.css` is unchanged**, **`package.json`/`package-lock.json` are unchanged**
        (no new dep), **no new image** was added, **no other Epic 1–2 shell behaviour** was
        reopened, and **no other Epic 3 page** was added.
  - [ ] Do **not** run `npm test` (stub `exit 1`, AR13).

- [ ] **Task 10 — Decision capture** (AC: #6)
  - [ ] **Expect to write no new ADR.** The divider SC→CSS-Module port executes the
        already-accepted [ADR 0004](../../docs/decisions/0004-remove-styled-components.md) (it
        names "`timeline-divider` → CSS Module" in its Consequences) — record nothing new for the
        planned work; do not manufacture an ADR to tick a box (NFR6).
  - [ ] **Only if** the `padding-top: 4rem` vs `py-4` cascade (Divider parity risk) forces a
        non-verbatim reconciliation call, capture it as `docs/decisions/0024-<short-title>.md` from
        `_template.md` (Status: Accepted; Date: 2026-06-22; Decider: Zac; Tags: `theseus`,
        `styling`, `parity`) and add its row to the `docs/decisions/README.md` index. **0023 is the
        highest existing number; 0024 is next.** Note in the ADR that it completes the ADR-0004
        styled-components removal.
  - [ ] If a genuinely-deferrable item surfaces (e.g. a timeline a11y nicety beyond parity), log
        it in `deferred-work.md` (story-3.3) — do **not** gold-plate (NFR6).

## Dev Notes

### Verbatim markup map (the parity contract)

Port each file from `archive/src/components/...` to `src/components/...` (`.js` → `.tsx`), keeping
all Tailwind class strings **byte-identical** (no bug fixes are needed on this page beyond the
mechanical JS→TS typing and the divider SC→module change). `Heading` already exists — **reuse it,
do not re-create**. Source files:

| Theseus file (new unless noted)                              | Archive source                                      | Server/Client |
| ------------------------------------------------------------ | --------------------------------------------------- | ------------- |
| `app/resume/page.tsx`                                        | `pages/resume.js`                                   | **Server**    |
| `components/organisms/experience.tsx`                        | `organisms/experience.js`                           | **Server**    |
| `components/organisms/certifications.tsx`                    | `organisms/certifications.js`                       | **Server**    |
| `components/organisms/timeline-item.tsx`                     | `organisms/timeline-item.js`                        | **Server**    |
| `components/molecules/skills-list.tsx`                       | `molecules/skills-list.js`                          | **Server**    |
| `components/atoms/pill.tsx`                                  | `atoms/pill.js`                                     | **Server**    |
| `components/atoms/timeline-divider.tsx` + `.module.css`      | `atoms/timeline-divider.js` (`styled.div` → module) | **Server**    |
| `components/atoms/timeline-time-company.tsx` + `.module.css` | `atoms/timeline-time-company.js` + `.module.css`    | **Server**    |
| `components/atoms/heading.tsx`                               | _(already built in 3.2 — reuse, no change)_         | **Server**    |

Note the archive keeps `timeline-item.js` in **`organisms/`** even though it composes
atoms/molecules — keep it in `organisms/` so the import graph and parity map stay 1:1 (the same
"mirror the archive tier placement" choice 3.2 made).

### Why every component is a Server Component (AR14, NFR5)

Unlike 3.1 (rotating job titles → `'use client'` leaf) and 3.2 (testimonials carousel →
`'use client'` leaf), **the Resume page has zero interactivity** — no hooks, no `onClick`, no
Embla, no `next/image` even. So **nothing here needs a client boundary**; the entire subtree
renders on the server, which is exactly the AR14/NFR5 default. Do **not** add `'use client'`
anywhere "to be safe" — it would regress the server-by-default posture for no reason. (`next/image`
isn't used on this page at all — Resume has no images; don't introduce one.)

### The styled-components removal is completed here (FR24 / AR15 / ADR 0004)

[ADR 0004](../../docs/decisions/0004-remove-styled-components.md) decided full
styled-components removal, executed **incrementally across Epics 2–3**. Its three footprints:

1. `createGlobalStyle` theming → global CSS-var palettes (Epic 1, ADR 0010). ✅
2. `AnimatedContainer` + `keyframes` → CSS Module + thin `'use client'` wrapper (Story 2.1, ADR
   0015). ✅
3. **`atoms/timeline-divider.js` `styled.div` → CSS Module (this story).** ⬅️ the last one.

After 3.3, **no `styled.div`, no `createGlobalStyle`, no CSS-in-JS runtime remains** — FR24 is
fully realised (and `package.json` already carries no `styled-components` dependency, since the
Theseus tree was a greenfield rebuild). Because the _direction_ is already an accepted ADR, the
port itself is **not a new decision** — AC #6 only opens a new ADR if the cascade reconciliation
forces a non-obvious call.

### Divider parity risk: the `padding-top` cascade (read before AC #2)

The SC `TimelineDivider` had `padding-top: 4rem` in its body **and** was rendered with
`<Divider className="… py-4 …" />`. So two padding rules target the same element: the SC-generated
class (`padding-top: 4rem`) and Tailwind's `py-4` (`padding-top: 1rem; padding-bottom: 1rem`).
Both are single-class selectors → **equal specificity → source order in the final stylesheet
decides the winner.** In the archive (styled-components injecting into `<head>` + Tailwind v3 +
PurgeCSS) the live site resolves this some particular way — **that rendered result is the source
of truth.**

Porting to a **CSS Module + Tailwind v4** changes how the two rules are ordered in the emitted
CSS, so the winner _could_ differ. The divider is a `width: 1px` vertical connector whose
`margin-top: -4rem; padding-top: 4rem` trick positions where the line and the `::before` dot
begin relative to each timeline row — so a `padding-top` flip would shift the dots/line vertically
(a visible regression).

**Approach:** port **both** faithfully (module body verbatim **and** the passed
`className="static py-4 top-0 bottom-0 bg-tertiary"` merged on), then **verify the dot/line
vertical placement against the live site** at the browser check and the Story 4.1 gate. If it
matches, you're done — no decision, no ADR. If `padding-top` resolves differently and the dots sit
wrong, make the **module rule win** (it carries the intended `4rem`) — e.g. keep `padding-top` in
the module and drop the redundant `py` contribution, or raise the module selector's precedence —
and **then** capture that reconciliation as ADR 0024 (AC #6). This is the one genuine parity
judgement on this page; everything else is a literal port. (`static`, `top-0`, `bottom-0` are
inert on a statically-positioned element — port them verbatim; they cost nothing and preserve the
byte-faithful className.)

### CSS Module idiom (match the existing tree)

Use the Theseus default-import form `import styles from './x.module.css'` and reference
`styles.timelineDivider` / `styles.notInlineContainer` — **not** the archive's _named_ import
(`import { notInlineContainer } from './…'`). This matches `testimonial-portrait.tsx` (3.2) and the
shell's `content-transition`/`layout` modules. Pseudo-elements (`::before`/`::after`) and `:global`
both work in CSS Modules here (the shell already uses `:global(.rcs-custom-scroll …)` in
`content-transition.module.css`); the divider needs only plain `.timelineDivider::before/::after`,
no `:global`.

### Frozen content — port verbatim, do NOT "fix" (NFR7, [[theseus-content-frozen-ariadne-owns-refresh]])

Epic 3 is like-for-like translation. On this page that specifically means **leaving alone**:

- **Stale/odd job data:** Beyonk "Present"; the overlapping Zarosoft (Feb 2021–May 2023) vs Odondo
  (Apr 2021–May 2024) vs LMS (Mar–Apr 2021) date ranges; "Various / Approx. 2006".
- **Certification typos:** `MonogoDB` (company-name field), `MSCD: Web Applications`, the La Trobe
  line's bracket spacing.
- **Skills typo:** `Programatic Programming Principles` (sic) in the Other-Skills list.
- **The casual prose voice** ("boy, did I deliver!", "grab a coffee and nerd out").

All of these are **Project Ariadne's** content refresh, **not Theseus's**. Reproduce them exactly.
The only intentional code changes are the mechanical JS→TS typing, the `[...skills].sort()`
prop-mutation safety equivalent (identical output), and the divider SC→module move — none of which
alter rendered content.

### Why the scope is tighter than 3.2 (NFR6)

3.2 needed three additive `--spacing-*` tokens, a new `embla-carousel-react` dependency, and six
images. **3.3 needs none of those.** Concretely:

- **No `globals.css` change.** Every spacing utility the resume subtree uses is on the **standard**
  Tailwind scale (`px-4 py-8 gap-8 gap-4 pt-4 ml-8 ml-4 mr-4 mt-2 mr-2 p-2`) — none is a divergent
  custom token like 3.2's `h-94`/`w-88`, so there is nothing to re-declare in `@theme` (the ADR
  0023 "per-page divergent tokens" convention simply yields _zero_ tokens this page). The one
  non-standard size, `min-width: 11rem` on the date/company column, is handled by the existing
  `timeline-time-company.module.css`, not a spacing token.
- **No new dependency.** `Pill`/`SkillsList`/`TimelineItem` are plain Tailwind; the divider port
  _removes_ CSS-in-JS rather than adding a lib. Do **not** add anything to `package.json`.
- **No new image.** Resume has no images at all.

If you find yourself editing `globals.css`, adding a dependency, or copying an image, **stop** —
something has gone outside the parity port.

### All themed utilities used already exist

`text-secondary`, `bg-tertiary`, `border-secondary` are defined `@utility` classes in
`globals.css` (verified). The divider's pseudo-elements reference the global CSS vars
`--color-bg-secondary`, `--color-bg-primary-400`, `--color-border-secondary` (all defined in
`:root` and `.light`). No raw hex, no new token. All className strings are **static literals**
(Tailwind v4 scan safety) — the only template-literal className (`TimelineTimeCompany`) interpolates
just the static module hash and fixed string branches, never a constructed Tailwind token.

### Project structure & conventions (from project-context.md — note the Theseus divergence)

- **Atomic design:** atoms (`pill`, `timeline-divider`, `timeline-time-company`; reused `heading`),
  molecules (`skills-list`), organisms (`timeline-item`, `experience`, `certifications`), page
  (`app/resume/page.tsx`). Filenames **kebab-case**, component identifiers **PascalCase**,
  **default export** — matching the existing tree.
- **TypeScript strict, no `.js` source** (AR2) — new files are `.tsx`; **no `any`** (use
  `React.ReactNode`, `string`/`string[]`, optional `?:` props); TS types not `PropTypes`.
  (project-context's PropTypes/Gatsby/`styled-components` rules describe the **archive** stack —
  follow the Theseus artifacts where they diverge, as 1.7–3.2 established.)
- **Prettier is law** (`^3.x`): single quotes, `arrowParens: avoid`. Run `npm run format`.
- **No code comments by default** — none warranted.
- **British spelling** in user-facing copy — none added; all copy is frozen archive content.
- **Themed colours only** — `text-secondary`/`bg-tertiary`/`border-secondary` utilities + the
  `--color-*` vars in the divider module drive colour; **no raw hex**.

### Scope seams — do NOT build now (NFR6)

Out of scope: **any other Epic 3 page** (Content / 404 = 3.4–3.5). Do **not** refactor the Epic 2
shell or any 3.1/3.2 component. Do **not** touch `globals.css`, `package.json`, or `public/`. Do
**not** "update" frozen content (dates, typos, prose — **Ariadne**). Do **not** "fix" the
multiple-`<h1>` a11y quirk (the page renders several `Heading`/`<h1>`s, as today — an Ariadne a11y
item, NFR7), the `flex-flow-col` no-op class, the empty `font-bold` job-title div on certs, or add
timeline ARIA/semantics beyond the verbatim port. The full all-tier visual sign-off is the **Story
4.1 gate**.

### Testing standards (AR13 — no suite to fabricate)

No test framework exists; `npm test` is a stub that exits 1 — **do not** run it or invent a suite.
Verification = `npm run build` green + pure static export, `npm run lint` clean, and **manual
behavioural parity** in a browser (both themes, desktop + mobile). Record honestly what was
observed; the all-tier visual sign-off is the Story 4.1 gate.

### Project Structure Notes

- Resume decomposes into a Server-Component page + two Server organisms (`Experience`,
  `Certifications`) that share the `TimelineItem` organism, the `SkillsList` molecule, and the
  `Pill`/`TimelineDivider`/`TimelineTimeCompany` atoms — the AR14/NFR5 server-by-default shape.
  **No client boundary anywhere.**
- `Heading` is **reused** from 3.2 (built clean there precisely so Resume/Content could reuse it).
- `Pill` (new here) is the first pill in the Theseus tree; **Content (3.4) does not currently need
  it** — build it for Resume only, don't speculatively generalise (NFR6).
- `page.tsx` renders as `children` inside `ContentTransition` (Story 2.5) within the `bg-primary-400`
  content pane — supply only inner markup.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.3] — the three ACs: Experience
  timeline + Certifications + Other Skills/Knowledge at content/structure parity (FR13); the
  timeline divider reimplemented as a CSS Module, visually identical, no CSS-in-JS runtime (AR15,
  FR24); per-page SEO via the Metadata API (FR17).
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 3] — fill the shell page-by-page at
  byte-for-byte parity; content organisms server-side, interactive bits `'use client'` (none here).
- [Source: _bmad-output/planning-artifacts/epics.md#FR13, #FR17, #FR24] — Resume sections; per-page
  SEO; styled-components removal. [#AR14] server-by-default / named client leaves; [#AR15] the
  `timeline-divider → CSS Module` move named explicitly; [#AR13] no fabricated suite; [#AR19]
  decision-capture DoD; [#NFR5] idiomatic-Next server-by-default; [#NFR7] preserve quirks.
- [Source: archive/src/pages/resume.js] — the page wrapper (`px-4 py-8 grid grid-cols-1 gap-8`),
  the `text-secondary` "Resume" heading, the Experience block, the `md:grid md:grid-cols-2 gap-4`
  Certifications/Skills two-column, the sixteen-skill list, `Seo title="Resume - Zac Braddy"`.
- [Source: archive/src/components/organisms/experience.js] — the seven `TimelineItem`s
  (companies/dates/titles/skills arrays/prose) to reproduce verbatim, in order.
- [Source: archive/src/components/organisms/certifications.js] — the seven cert `TimelineItem`s
  (no jobTitle/skills), incl. the `MonogoDB`/`MSCD` frozen typos; the MongoDB item has only a
  `startDate`.
- [Source: archive/src/components/organisms/timeline-item.js] — the `TimelineItem` composition
  (two `TimelineTimeCompany`s inline+not, the `Divider` with its passed className, jobTitle,
  children, `SkillsList`); `skills = []` default.
- [Source: archive/src/components/molecules/skills-list.js] — `skills.sort().map(Pill)` with the
  `flex flex-flow-col flex-wrap` wrapper (note `flex-flow-col` no-op; `.sort()` prop-mutation).
- [Source: archive/src/components/atoms/pill.js] — the `Pill` atom (`border border-secondary
text-secondary p-2 rounded mt-2 mr-2`) — **new** to the Theseus tree.
- [Source: archive/src/components/atoms/timeline-divider.js] — the `styled.div` body to port
  value-for-value to a CSS Module: the `width:1px`/`margin-top:-4rem`/`padding-top:4rem`/
  `margin-left:0.5rem` line + the `::before` (faded dot) and `::after` (ringed dot) pseudo-elements
  with their CSS-var colours; accepts a `className` to merge.
- [Source: archive/src/components/atoms/timeline-time-company.js + .module.css] — the inline/not-inline
  date+company atom; the `notInlineContainer { min-width: 11rem }` module (switch the archive's
  named import to the Theseus default-import idiom).
- [Source: src/components/atoms/heading.tsx] — the **existing** `Heading` atom to reuse
  (`{ className?: string; children }` → `<h1 className="{className} font-fancy-heading text-3xl
xl:text-4xl">`); no change.
- [Source: src/components/atoms/testimonial-portrait.tsx + .module.css] — the established
  CSS-Module default-import idiom (`import styles from './x.module.css'`) to mirror for
  `timeline-divider`/`timeline-time-company`.
- [Source: src/components/molecules/content-transition.module.css] — precedent that CSS Modules in
  this tree carry pseudo/`:global` rules and resolve the global `--color-*` vars.
- [Source: src/app/about-me/page.tsx] — the 3.2 child-segment metadata pattern to mirror
  (`title: 'About Me'` + `openGraph.title`/`twitter.title` = `'About Me - Zac Braddy'`); the
  `px-4 py-8 grid grid-cols-1 gap-8` page wrapper.
- [Source: src/app/layout.tsx:101] — the `<ContentTransition>{children}</ContentTransition>` content
  pane the page renders into; the `%s - Zac Braddy` root title template + metadata defaults inherited.
- [Source: src/app/globals.css] — the themed `@utility` classes (`text-secondary`, `bg-tertiary`,
  `border-secondary`) and the `--color-bg-secondary`/`--color-bg-primary-400`/`--color-border-secondary`
  vars the divider uses (all present); confirms **no spacing token needs adding** for this page.
- [Source: docs/decisions/0004-remove-styled-components.md] — the accepted decision this story
  **executes** (its Consequences name "`timeline-divider` → CSS Module"); **no new ADR for the
  planned work.** [0021-…md] — the child-segment metadata convention this page follows.
- [Source: docs/decisions/_template.md + README.md] — ADR format + index, only if a 0024 cascade
  reconciliation ADR becomes necessary; **0023 is the highest existing number, 0024 is next.**
- [Source: _bmad-output/implementation-artifacts/3-2-about-me-page.md] — the Epic-3 house pattern:
  Server-Component page + `metadata`; the CSS-Module default-import idiom; ADR-0021 child-segment
  metadata; the `react/no-unescaped-entities` apostrophe-escaping learning; verification-honesty
  bar; "project-context describes the archive stack — follow Theseus artifacts where they diverge".
- [Source: _bmad-output/implementation-artifacts/3-1-home-page.md] — the Epic-3 house pattern origin
  (Server page + named client leaves); ADR-0021 metadata; the `title.absolute` root-page exception
  that does **not** apply to child segments.
- [Source: _bmad-output/implementation-artifacts/deferred-work.md] — story-2.2 nav list-semantics +
  story-2.6 reduced-motion + the multiple-`<h1>` class of Ariadne a11y deferral (the timeline's own
  multiple-`<h1>` / semantics fall in the same bucket — defer, don't fix here).
- [Source: _bmad-output/project-context.md] — atomic structure, kebab-case/PascalCase, Prettier law,
  no-comments default, themed-colour rule, no-interpolated-classnames; describes the **archive**
  stack — follow the Theseus artifacts where they diverge.

## Decision trail

1. **Timeline divider: styled-components → CSS Module (settled — executes [ADR
   0004](../../docs/decisions/0004-remove-styled-components.md), AR15/FR24).** This is the **last**
   styled-components footprint; porting it completes the accepted full-removal decision. **Not a
   new decision** — no new ADR unless the `padding-top` cascade forces a non-verbatim
   reconciliation (then → ADR 0024). See Dev Note "Divider parity risk".
2. **Every component is a Server Component (settled — AR14/NFR5).** Resume has zero interactivity,
   so no `'use client'` boundary exists anywhere on the page — the cleanest expression of the
   server-by-default posture. No `next/image` is used (the page has no images).
3. **Scope is tighter than 3.2 (settled — NFR6).** No `globals.css` change (all spacing is on the
   standard Tailwind scale; the ADR-0023 per-page-divergent-token convention yields zero tokens
   here), no new dependency, no new image. Editing any of those is a scope-exit signal.
4. **`timeline-item` stays in `organisms/` (settled — parity).** Mirror the archive tier placement
   so the import graph and parity map are 1:1, as 3.2 did.
5. **Content frozen (settled — [[theseus-content-frozen-ariadne-owns-refresh]]).** The stale dates,
   `MonogoDB`/`MSCD`/`Programatic` typos, and casual prose are **Ariadne's** refresh — port all
   copy verbatim.
6. **Metadata: child-segment template (settled — ADR 0021).** `/resume` is a child segment, so
   `title: 'Resume'` + the root `%s - Zac Braddy` template → `<title>Resume - Zac Braddy</title>`
   (no `title.absolute` workaround — that was the root-page-only 3.1 exception).
7. **`[...skills].sort()` over `skills.sort()` (settled — safe equivalent, identical output).**
   Avoids mutating a prop; the alphabetical render order is unchanged. Verbatim `skills.sort()` is
   also acceptable — the rendered output is byte-identical either way.

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

| Date       | Change                                                                                                                                                                                                                                                                        |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-06-22 | Story 3.3 created (ready-for-dev): `/resume` route at parity — Experience timeline, Certifications, Other Skills/Knowledge; the `timeline-divider` styled-components → CSS Module port completing ADR 0004; child-segment metadata; no `globals.css`/dependency/image change. |
