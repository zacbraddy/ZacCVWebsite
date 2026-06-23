---
baseline_commit: 4f3452f
---

# Story 3.2: About Me page (`/about-me`)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a site visitor,
I want the About Me page with all its sections and interactions intact,
so that I read the same content and use the same testimonials carousel as today.

## Context & purpose (read first)

This is the **second story of Epic 3** (Content Pages at Parity). The themed, persistent,
fully-navigable shell exists (Epics 1–2 done) and **3.1 (Home) is done** — establishing the
Epic-3 house pattern: a **Server-Component page** that composes content + exports per-page
`metadata`, with **`'use client'` only on the interactive leaves**, all rendered as `children`
inside `<ContentTransition>` in the root `layout.tsx`. This story does the `/about-me` route.

`/about-me` is the **richest content page in the project** — four stacked sections:

1. **About Me** — a `Heading`, two intro paragraphs, a four-bullet `<ul>` of `Highlight`-led
   points, and a six-row stats block (`StatRow`) including the **anti-scrape entity-obfuscated
   email** (FR22/NFR7).
2. **What I Do** — a `Heading` + four `AbilityDescription` cards (FontAwesome solid icon + `<h2>`
   - a `Highlight`-laced paragraph).
3. **Testimonials** — a `Heading` + prev/next buttons + a **horizontal free-scroll carousel** of
   six `Testimonial` cards, each with a circular `TestimonialPortrait` (`next/image`). **This is
   the one `'use client'` leaf** (AR14 names "the testimonials carousel" explicitly).
4. **Things I Like** — a `Heading` + four `ThingILike` cards (FontAwesome solid icon + label).

The single source of visual/behavioural truth is the **live site** (`zackerthehacker.com`) and
the archived Gatsby tree (`archive/src/pages/about-me.js` + its organisms/molecules/atoms). This
is a **byte-for-byte parity port** (NFR1 zero-visual-regression, NFR2 zero-functional-regression,
NFR7 preserve quirks). **Content is frozen** — Epic 3 is like-for-like translation only; the
stale `Age "39"`, the Twitter link, the missing-jobs/CV currency are **Project Ariadne's**
content refresh, **not Theseus's** (do **not** "update" any copy here).

**3.2's job — build the About Me component subtree the Home page didn't need, at parity:**

- **One new shell touch (additive only):** add three custom `--spacing-*` tokens to
  `globals.css` `@theme` — the testimonial/things-i-like cards use the archive's custom spacing
  scale (`h-94`/`w-94`=26rem, `h-87`=23rem, `w-88`=24rem) which **Tailwind v4's dynamic spacing
  scale resolves to _different_ values** (23.5/21.75/22rem). Without the override the cards are
  subtly undersized → a real visual regression. **→ ADR 0023.**
- **Replace `@egjs/react-flicking` with `embla-carousel-react`** (Zac-confirmed 2026-06-18) — the
  Gatsby-era carousel lib is not in the Theseus tree; Embla is the modern, React-19-ready,
  zero-dependency primitive, mapping 1:1 onto today's Flicking config. **→ ADR 0022.**
- **Port the `next/image` testimonial portraits** — `TestimonialPortrait` was a
  `useStaticQuery(graphql)` + `GatsbyImage` lookup over six files; reimplement as `next/image`
  with a plain `portraitName → /images/<file>.jpg` map (AR9 data-layer removal, AR17/FR21 CLS
  guard), mirroring the Story 2.3 `portrait-image.tsx` pattern. **Copy the six portrait JPEGs
  into `public/images/`.**
- **Build the atoms/molecules/organisms** the page composes (`Heading`, `Highlight`, `StatRow`,
  `TestimonialPortrait`; `AbilityDescription`, `Testimonial`, `ThingILike`; `AboutMe`, `WhatIDo`,
  `Testimonials`, `ThingsILike`) and the route `src/app/about-me/page.tsx`.
- **Apply the ADR 0021 metadata convention** — `/about-me` is a **child** route segment, so
  `title: 'About Me'` + the root `%s - Zac Braddy` template renders `<title>About Me - Zac
Braddy</title>` (the root-page `title.absolute` workaround from 3.1 does **not** apply here).

After this: Resume (3.3) reuses `Heading`/`Highlight`; Content (3.4); 404 (3.5).

## Acceptance Criteria

1. **The four About Me sections render at content/structure parity (FR12).**
   **Given** the about-me route,
   **When** it renders,
   **Then** it shows the **About Me**, **What I Do**, **Testimonials**, and **Things I Like**
   sections, in that order, with their existing content and structure (FR12), inside the page
   wrapper `<div className="px-4 py-8 grid grid-cols-1 gap-8">` (verbatim from
   `archive/src/pages/about-me.js`),
   **And** every section heading uses the shared `Heading` atom
   (`<h1 className="… font-fancy-heading text-3xl xl:text-4xl">`), the section markup/classes
   match the archive verbatim (see Dev Notes "Verbatim markup map"), and all copy is **frozen**
   (no content edits — `Age "39"`, the four highlight bullets, the four ability paragraphs, the
   six testimonials, the four "things I like" reproduced exactly).

2. **The obfuscated email is preserved in encoded form (FR22, NFR7).**
   **Given** the email in the About Me stats block,
   **When** the `StatRow` renders,
   **Then** the source preserves the anti-scrape HTML-entity form **verbatim** —
   `value="zacharybraddy&#0064;gmail.com"` — exactly as `archive/src/components/organisms/about-me.js:83`,
   **And** it is **not** "cleaned up" to a literal `@` in source (FR22, NFR7). _(The JSX compiler
   decodes the numeric entity identically to the archive's Babel build, so the rendered output
   matches the live site — see Dev Note "The obfuscated email".)_

3. **The testimonials carousel behaves as today, implemented as the one `'use client'` leaf with
   Embla; surrounding sections render on the server (FR12, AR14, NFR5).**
   **Given** the testimonials section,
   **When** the visitor interacts with it,
   **Then** it presents the six testimonials in a **horizontal, free-scroll, centre-aligned,
   bounded** carousel that drags/scrolls as today, and the **prev/next buttons** (FontAwesome
   `faLessThan`/`faGreaterThan`, classes verbatim) move it backward/forward,
   **And** it is implemented with **`embla-carousel-react`** in a **`'use client'`** leaf
   (`src/components/organisms/testimonials.tsx`) — `dragFree:true`, `align:'center'`,
   `containScroll:'trimSnaps'`, buttons calling `emblaApi.scrollPrev()`/`scrollNext()` — while the
   **other three sections (AboutMe, WhatIDo, ThingsILike) render as Server Components** (AR14, NFR5),
   **And** each testimonial card's absolutely-positioned author block anchors to its card (see
   Dev Note "Carousel parity risk #1: positioned ancestor").

4. **Testimonial portraits are served via `next/image` with no layout shift; the GraphQL data
   layer is gone (FR21, AR9, AR17).**
   **Given** the six testimonial portraits,
   **When** they render,
   **Then** each is served via **`next/image`** (mirroring `src/components/atoms/portrait-image.tsx`:
   `fill` + `sizes="96px"` + `object-cover`, inside a `relative w-24 h-24 rounded-full
overflow-hidden border-4 border-inverse shadow-xl` container with the `${container}` negative
   `margin-bottom: -3rem`), with correct intrinsic sizing and **no layout shift** (FR21, AR17),
   **And** the image source is resolved by a plain **`portraitName → '/images/<file>.jpg'` map**
   in TS — **no `useStaticQuery`, no GraphQL, no `GatsbyImage`** (AR9),
   **And** the six JPEGs are copied into **`public/images/`**
   (`travis-scholes.jpg`, `allen-underwood.jpg`, `georgia-shaw.jpg`, `jay-miller.jpg`,
   `joe-zack.jpg`, `jamie-taylor.jpg`).

5. **The card spacing matches the archive — the Tailwind-v4 custom-spacing parity guard (NFR1,
   AR3).**
   **Given** Tailwind v4 resolves bare numeric spacing utilities dynamically
   (`h-94` → `calc(var(--spacing) * 94)` = 23.5rem) whereas the archive overrode them
   (`94`=26rem, `87`=23rem, `88`=24rem),
   **When** the token system is extended,
   **Then** `globals.css` `@theme` gains **`--spacing-87: 23rem`, `--spacing-88: 24rem`,
   `--spacing-94: 26rem`** so the testimonial cards (`h-94`, `lg:w-94`, `h-87`) and the
   things-i-like cards (`lg:w-88`) render at the archive's dimensions (NFR1),
   **And** this is the **only** `globals.css` change — **additive `@theme` tokens only**; no
   existing token, palette, utility, or base rule is modified (Epic 1–2 theming stays frozen).

6. **Per-page SEO metadata matches today via the Metadata API + the child-segment template
   (FR17, ADR 0021).**
   **Given** the Next Metadata API and the ADR-0021 convention,
   **When** `/about-me` is served,
   **Then** `src/app/about-me/page.tsx` exports `metadata` with **`title: 'About Me'`**, which —
   because `/about-me` is a **child** route segment — the root `%s - Zac Braddy` template renders
   as **`<title>About Me - Zac Braddy</title>`** (the root-page `title.absolute` workaround from
   3.1 does **not** apply to child segments),
   **And** `openGraph.title` and `twitter.title` are set to **`'About Me - Zac Braddy'`** (matching
   the archive `Seo title="About Me - Zac Braddy"`),
   **And** description, OG image, Twitter `summary_large_image` card, and favicon **inherit** the
   root-layout defaults (Story 1.6) — not re-declared,
   **And** no `react-helmet` is used (FR17).

7. **Build green; static export intact; parity verified; scope held (NFR1/NFR2/NFR5/NFR6).**
   **Given** the change,
   **When** `npm run build` and `npm run lint` are run,
   **Then** both are green (TypeScript `strict`, **no `any`**, no lint errors) and the build stays
   a **pure static export** (route `/about-me` shows as `○ (Static)`, no serverless functions),
   **And** the page (all four sections, the obfuscated email, the carousel drag + prev/next, the
   six portraits, the spacing) is verified in a browser in **both themes**, desktop **and**
   mobile, against the live site,
   **And** the change is confined to: the new `about-me` route + the About Me component subtree +
   the six copied images + the **additive** `globals.css` spacing tokens + `embla-carousel-react`
   added to `package.json` + ADRs 0022/0023 (+ index) + sprint/story tracking — **no** edits to
   any Epic 1–2 shell behaviour (layout structure, theming values, fonts, metadata defaults, nav,
   sidebar, mobile menu/context, scrollbar, spinner) and **no** other Epic 3 page.

8. **Decision capture as-you-go (FR26 / AR19).**
   **Given** the cross-cutting decision-capture DoD,
   **When** the two non-obvious calls in this story are made,
   **Then** each is recorded as an ADR, indexed in `docs/decisions/README.md`:
   - **ADR 0022** — testimonials carousel: **`embla-carousel-react`** replaces
     `@egjs/react-flicking` (Zac-confirmed 2026-06-18); the Gatsby-era lib is not in the tree,
     Embla is the modern React-19-ready primitive mapping 1:1 to the old config — consistent with
     the Story 2.4 `react-burger-menu → vaul` precedent.
   - **ADR 0023** — Tailwind-v4 custom-spacing parity: the archive's custom spacing scale diverges
     from v4's dynamic `calc(var(--spacing) * n)` scale; divergent tokens (`87`,`88`,`94`, …) are
     re-declared in `@theme` **per page as needed** so card dimensions stay at parity.

## Tasks / Subtasks

- [x] **Task 1 — Add the divergent custom-spacing tokens to `globals.css` `@theme`** (AC: #5)
  - [x] In `src/app/globals.css`, inside the existing `@theme { … }` block, add **only** the
        three spacing tokens About Me needs (additive — touch nothing else):
    ```css
    --spacing-87: 23rem;
    --spacing-88: 24rem;
    --spacing-94: 26rem;
    ```
  - [x] Do **not** add `--spacing-68`/`--spacing-80` — `68×0.25rem = 17rem` and `80×0.25rem =
20rem` already coincide with the archive (`68:'17rem'`, `80:'20rem'`), so `lg:h-68` /
        `lg:h-80` are already at parity via v4's dynamic scale. Adding them is redundant (NFR6).
        Do **not** port the unused archive tokens (`102/110/118/126/134`, `gridTemplateRows.7`) —
        Resume/Content add what they need when they need it (ADR 0023 convention).
  - [x] This is the **single** edit to an Epic 1–2 shell file in this story, and it is **purely
        additive** — verify `git diff src/app/globals.css` shows only the three added lines.

- [x] **Task 2 — Add `embla-carousel-react` and confirm the install** (AC: #3)
  - [x] `npm install embla-carousel-react` (current stable, React-19 peer support). It is a
        runtime **dependency** (not dev). One package; it has zero further runtime deps.
  - [x] Confirm `package.json` `dependencies` gains the entry and `package-lock.json` updates.
        Do **not** add `@egjs/react-flicking` or any other carousel/animation lib.

- [x] **Task 3 — Copy the six testimonial portrait images into `public/images/`** (AC: #4)
  - [x] Copy from `archive/src/images/` to `public/images/`: `travis-scholes.jpg`,
        `allen-underwood.jpg`, `georgia-shaw.jpg`, `jay-miller.jpg`, `joe-zack.jpg`,
        `jamie-taylor.jpg`. (Use `cp`; do not move — the archive tree stays intact until Epic 4
        cutover.)
  - [x] Do **not** touch the existing `public/images/zac-portrait.jpg` or anything else under
        `public/`.

- [x] **Task 4 — Build the shared content atoms** (AC: #1, #2, #4)
  - [x] `src/components/atoms/heading.tsx` (Server Component) — port `archive/.../atoms/heading.js`.
        `<h1>` with an optional `className` prepended:
    ```tsx
    const Heading = ({
      className = '',
      children,
    }: {
      className?: string;
      children: React.ReactNode;
    }) => (
      <h1 className={`${className} font-fancy-heading text-3xl xl:text-4xl`}>
        {children}
      </h1>
    );
    export default Heading;
    ```
    Keep the `<h1>` tag verbatim (multiple `<h1>`s per page is a pre-existing a11y quirk — port as
    is, NFR7; an Ariadne a11y-pass item, not a Theseus fix). Default export, PascalCase identifier.
  - [x] `src/components/atoms/highlight.tsx` (Server) — port `archive/.../atoms/highlight.js`
        verbatim, **including the trailing `&nbsp;`**:
    ```tsx
    const Highlight = ({ children }: { children: React.ReactNode }) => (
      <span className="text-tertiary font-bold text-lg italic">
        {children}&nbsp;
      </span>
    );
    ```
    The `&nbsp;` is intentional spacing the surrounding prose relies on — preserve it (NFR7).
  - [x] `src/components/atoms/stat-row.tsx` (Server) — port `archive/.../atoms/stat-row.js`
        verbatim. Props `{ subject: string; value: string }`; markup
        `<div className="flex justify-between w-full"><div className="text-secondary font-bold">{subject}</div><div className="text-right">{value}</div></div>`.
  - [x] `src/components/atoms/testimonial-portrait.tsx` + `.module.css` — see Task 5 (it's a
        carousel-coupled atom; build it with the carousel).

- [x] **Task 5 — Build the testimonial portrait (`next/image`, no GraphQL)** (AC: #4)
  - [x] `src/components/atoms/testimonial-portrait.module.css` — port the archive module verbatim:
    ```css
    .container {
      margin-bottom: -3rem;
    }
    ```
  - [x] `src/components/atoms/testimonial-portrait.tsx` — replace the
        `useStaticQuery(graphql)`/`GatsbyImage` lookup with a plain map + `next/image`, mirroring
        `src/components/atoms/portrait-image.tsx`:

    ```tsx
    import Image from 'next/image';
    import styles from './testimonial-portrait.module.css';

    const PORTRAITS: Record<string, string> = {
      TravisScholes: '/images/travis-scholes.jpg',
      AllenUnderwood: '/images/allen-underwood.jpg',
      GeorgiaShaw: '/images/georgia-shaw.jpg',
      JayMiller: '/images/jay-miller.jpg',
      JoeZack: '/images/joe-zack.jpg',
      JamieTaylor: '/images/jamie-taylor.jpg',
    };

    const TestimonialPortrait = ({
      portraitName,
    }: {
      portraitName: string;
    }) => {
      const src = PORTRAITS[portraitName];
      if (!src) {
        return (
          <div>{`Oops, this was supposed to be a photo of ${portraitName} :S`}</div>
        );
      }
      return (
        <div className="flex justify-center">
          <div
            className={`${styles.container} relative z-10 w-24 h-24 rounded-full overflow-hidden border-4 border-inverse shadow-xl`}
          >
            <Image
              src={src}
              alt={portraitName}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
        </div>
      );
    };
    export default TestimonialPortrait;
    ```

  - [x] **`relative` is required** on the image's direct container for `fill` (the archive
        container lacked it because `GatsbyImage` sized itself; `next/image fill` needs a
        positioned, sized ancestor — exactly the `portrait-image.tsx` shape). Keep `z-10`,
        `border-inverse` (the intentional invalid-colour quirk → `currentColor`, ADR 0010), and
        the `${container}` negative margin verbatim.
  - [x] Keep the missing-image fallback branch (parity; it can't fire with the six known names but
        port it — it's harmless and verbatim).

- [x] **Task 6 — Build the content molecules** (AC: #1, #3)
  - [x] `src/components/molecules/ability-description.tsx` (Server) — port
        `archive/.../molecules/ability-description.js` verbatim. Props
        `{ icon: IconDefinition; title: string; children: React.ReactNode }` (import
        `IconDefinition` type from `@fortawesome/fontawesome-svg-core`, as `nav-link.tsx` already
        does). Markup verbatim:
    ```tsx
    <div>
      <div className="ml-4 lg:ml-8 grid grid-cols-1 gap-4">
        <FontAwesomeIcon icon={icon} size="2x" className="text-secondary" />
        <h2 className="text-lg font-bold">{title}</h2>
        {children}
      </div>
    </div>
    ```
  - [x] `src/components/molecules/thing-i-like.tsx` (Server) — port
        `archive/.../molecules/thing-i-like.js` verbatim (props `{ icon: IconDefinition; children }`):
    ```tsx
    <div className="lg:flex lg:justify-center">
      <div className="flex flex-col items-center h-48 bg-primary-200 border border-secondary text-secondary rounded justify-center p-2 lg:w-88">
        <FontAwesomeIcon icon={icon} size="2x" />
        <div className="mt-4 font-bold text-lg text-center">{children}</div>
      </div>
    </div>
    ```
  - [x] `src/components/molecules/testimonial.tsx` — port `archive/.../molecules/testimonial.js`,
        **fixing the `class=` → `className=` bug** (line 12 of the archive is invalid JSX/TSX and
        fails `strict` typecheck — see Dev Note "Bugs fixed on port"). Add **`relative`** to the
        bordered inner box so the absolutely-positioned author block anchors to it (Flicking
        previously supplied the positioned ancestor — Embla does not; see Carousel parity risk #1).
        Props `{ portraitName, author, jobTitle, company, children }` (all `string` except
        `children: React.ReactNode`; `jobTitle`/`company` optional to match the conditional join):
    ```tsx
    <div className="panel w-64 h-94 lg:w-94 lg:h-80">
      <div className="anchor flex flex-col h-full">
        <div className="flex flex-col">
          <TestimonialPortrait portraitName={portraitName} />
          <div className="relative flex flex-col text-sm italic border-2 border-secondary rounded p-2 pt-16 h-87 lg:h-68">
            {children}
            <div
              className="self-start lg:self-end not-italic font-bold text-secondary absolute break-words"
              style={{ bottom: '1rem' }}
            >
              {`- ${author}${jobTitle ? `, ${jobTitle}` : ''}${company ? `, ${company}` : ''}`}
            </div>
          </div>
        </div>
      </div>
    </div>
    ```
    Keep the no-op `panel`/`anchor` classes verbatim (zero CSS attached — like 3.1's `text-md`;
    byte-faithful, harmless). All class strings stay **static literals** (Tailwind v4 scan safety).

- [x] **Task 7 — Build the three Server-Component organisms** (AC: #1, #2)
  - [x] `src/components/organisms/about-me.tsx` (Server) — port
        `archive/.../organisms/about-me.js` **verbatim** (the intro `<p>`, the four `<Highlight>`
        bullets in the `<ul>`, the closing `<p>`, and the six `StatRow`s). **Email verbatim:**
        `<StatRow subject="Email" value="zacharybraddy&#0064;gmail.com" />` (AC #2). Content frozen
        — `Age "39"` stays. Composes `Heading`, `Highlight`, `StatRow`.
  - [x] `src/components/organisms/what-i-do.tsx` (Server) — port `archive/.../organisms/what-i-do.js`
        verbatim. Imports `faTerminal, faPencilRuler, faChalkboardTeacher, faPeopleCarry` from
        `@fortawesome/free-solid-svg-icons`; composes `Heading` + four `AbilityDescription` with
        their `Highlight`-laced paragraphs (copy frozen).
  - [x] `src/components/organisms/things-i-like.tsx` (Server) — port
        `archive/.../organisms/things-i-like.js` verbatim. Imports `faHeart, faGamepad, faMusic,
faRobot` from `@fortawesome/free-solid-svg-icons`; composes `Heading` + four `ThingILike`.
  - [x] All three are **Server Components** — `FontAwesomeIcon` renders fine in RSC (the existing
        `socials.tsx` does exactly this with no `'use client'`; FA is wired in `layout.tsx` with
        `faConfig.autoAddCss = false` + the core `styles.css` import). Do **not** add `'use client'`.

- [x] **Task 8 — Build the Testimonials carousel (`'use client'`, Embla)** (AC: #3)
  - [x] `src/components/organisms/testimonials.tsx` with `'use client'` at the top. Port the
        archive header (Heading + the two nav buttons, classes verbatim) and swap Flicking for
        Embla:

    ```tsx
    'use client';

    import useEmblaCarousel from 'embla-carousel-react';
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
    import {
      faGreaterThan,
      faLessThan,
    } from '@fortawesome/free-solid-svg-icons';
    import Heading from '@/components/atoms/heading';
    import Testimonial from '@/components/molecules/testimonial';

    const Testimonials = () => {
      const [emblaRef, emblaApi] = useEmblaCarousel({
        dragFree: true,
        align: 'center',
        containScroll: 'trimSnaps',
      });
      return (
        <>
          <div className="flex justify-between items-center">
            <Heading>Testimonials</Heading>
            <div className="grid gap-2 grid-cols-2 mt-2">
              <button
                type="button"
                className="border bg-primary-200 rounded p-2 sm:py-2 sm:px-4 focus:outline-none"
                onClick={() => emblaApi?.scrollPrev()}
              >
                <FontAwesomeIcon icon={faLessThan} />
              </button>
              <button
                type="button"
                className="border bg-primary-200 rounded p-2 sm:py-2 sm:px-4 focus:outline-none"
                onClick={() => emblaApi?.scrollNext()}
              >
                <FontAwesomeIcon icon={faGreaterThan} />
              </button>
            </div>
          </div>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {/* six slides — each a bare <div> wrapping a <Testimonial> */}
            </div>
          </div>
        </>
      );
    };
    export default Testimonials;
    ```

  - [x] Port the **six `Testimonial`s verbatim** (author/jobTitle/company/portraitName + quote
        text exactly from `archive/.../organisms/testimonials.js:43–132`), each wrapped in a bare
        `<div>` slide as the archive did. Order: Travis Scholes, Allen Underwood, Georgia Shaw, Jay
        Miller, Joe Zack, Jamie Taylor. The inner container `className="flex gap-4"` reproduces the
        archive Flicking `cameraClass="flex gap-4"`; `overflow-hidden` on the viewport is required
        by Embla.
  - [x] **Embla config mapping** (verify against the live site at the browser check):
        `moveType="freeScroll"` → `dragFree: true`; `align="center"` → `align: 'center'`;
        `bound={true}` → `containScroll: 'trimSnaps'`; `horizontal={true}` → Embla default
        (`axis: 'x'`). `renderOnlyVisible`/`renderOnSameKey`/`viewportTag`/`cameraTag` were
        Flicking-specific and have no Embla equivalent (not needed — Embla renders all slides).
  - [x] **Add `type="button"`** to both nav buttons (3.1 review precedent — bare `<button>`
        defaults to `type="submit"`; harden the reusable control). `emblaApi?.` optional-chaining
        guards the first-render `undefined` (Embla's api is `undefined` until mounted) — keeps
        `strict` happy without `any`.
  - [x] Keep the buttons' classes verbatim (`border bg-primary-200 rounded p-2 sm:py-2 sm:px-4
focus:outline-none`). `bg-primary-200` is a defined `@utility` (themed) — confirmed.

- [x] **Task 9 — Create the route page (Server Component + metadata)** (AC: #1, #6)
  - [x] Create `src/app/about-me/page.tsx` as a **Server Component** (no `'use client'`):

    ```tsx
    import type { Metadata } from 'next';
    import AboutMe from '@/components/organisms/about-me';
    import WhatIDo from '@/components/organisms/what-i-do';
    import Testimonials from '@/components/organisms/testimonials';
    import ThingsILike from '@/components/organisms/things-i-like';

    export const metadata: Metadata = {
      title: 'About Me',
      openGraph: { title: 'About Me - Zac Braddy' },
      twitter: { title: 'About Me - Zac Braddy' },
    };

    export default function AboutMePage() {
      return (
        <div className="px-4 py-8 grid grid-cols-1 gap-8">
          <AboutMe />
          <WhatIDo />
          <Testimonials />
          <ThingsILike />
        </div>
      );
    }
    ```

  - [x] `title: 'About Me'` (plain, **not** `title.absolute`) — `/about-me` is a child segment so
        the root template applies, unlike the 3.1 root-page exception. Confirm
        `<title>About Me - Zac Braddy</title>` in `out/about-me/index.html`. Do **not** re-declare
        description/OG-image/card/favicon — they inherit the root defaults (Story 1.6).
  - [x] The page is rendered as `children` inside `<ContentTransition>` in `layout.tsx` — supply
        only the inner section markup, no shell chrome, no extra height wrappers.

- [x] **Task 10 — Verify (build, lint, static export, in-browser parity)** (AC: #7)
  - [x] `npm run build` → green, **pure static export** (`/about-me` listed as `○ (Static)`, no
        `.func`). Confirm `out/about-me/index.html` contains all four section headings, the six
        testimonial authors, the obfuscated email (whatever the compiler emits — see Dev Note),
        and `<title>About Me - Zac Braddy</title>`.
  - [x] `npm run lint` → clean (TS strict, **no `any`**, no lint errors).
  - [x] `npm run dev`, load `/about-me` in a browser and compare to the live site, in **both
        themes**, **desktop and mobile**: (a) all four sections, copy frozen; (b) the stats block
        incl. the email; (c) the four ability cards with their cyan icons; (d) the **carousel** —
        drag/free-scroll, centre alignment, prev/next buttons move it, six portraits load with no
        layout shift, author names sit at the card bottom (Carousel parity risk #1); (e) the four
        "things I like" cards at the correct width (`lg:w-88` = 24rem — the spacing guard); (f) the
        testimonial cards at the correct size (`h-94`/`lg:w-94` = 26rem). Record honestly what was
        observed; route the final all-tier visual sign-off to the **Story 4.1 gate**.
  - [x] `npm run format`. Confirm `git diff` is confined to the AC #7 surface — in particular that
        `globals.css` shows **only** the three additive spacing lines, and **no other Epic 1–2
        shell behaviour** was reopened, and **no other Epic 3 page** was added.
  - [x] Do **not** run `npm test` (stub `exit 1`, AR13).

- [x] **Task 11 — Decision capture** (AC: #8)
  - [x] `docs/decisions/0022-<short-title>.md` from `_template.md` (Status: Accepted; Date:
        2026-06-18; Decider: Zac; Tags: `theseus`, `dependencies`, `carousel`): **Embla replaces
        `@egjs/react-flicking`** for the testimonials carousel — rationale (Gatsby-era lib not in
        tree; Embla is modern, React-19-ready, zero-dep, maps 1:1 onto the old config; consistent
        with the 2.4 `react-burger-menu → vaul` precedent); the config mapping; Zac-confirmed
        2026-06-18.
  - [x] `docs/decisions/0023-<short-title>.md` from `_template.md` (Status: Accepted; Date:
        2026-06-18; Decider: Zac; Tags: `theseus`, `tailwind`, `parity`): **Tailwind-v4
        custom-spacing parity** — the archive's `tailwind.config.js` overrode spacing values
        (`87:23rem`, `88:24rem`, `94:26rem`, …) that v4's dynamic `calc(var(--spacing) * n)` scale
        resolves differently; the convention is to re-declare **only the divergent tokens a page
        actually uses** in `@theme` (additively), per page, as Epic 3 progresses. Note which
        coincide (`68`,`72`,`80`,`36`) and need no override.
  - [x] Add the 0022 and 0023 rows to the ADR index table in `docs/decisions/README.md`.
  - [x] If a genuinely-deferrable item surfaces, log it in `deferred-work.md` (story-3.2) — do
        **not** gold-plate (NFR6).

## Dev Notes

### Verbatim markup map (the parity contract)

Port each file from `archive/src/components/...` to `src/components/...` (`.js` → `.tsx`), keeping
all Tailwind class strings **byte-identical** except the explicitly-noted bug fixes. Source files:

| Theseus file (new)                                          | Archive source                                  | Server/Client       |
| ----------------------------------------------------------- | ----------------------------------------------- | ------------------- |
| `app/about-me/page.tsx`                                     | `pages/about-me.js`                             | **Server**          |
| `components/organisms/about-me.tsx`                         | `organisms/about-me.js`                         | **Server**          |
| `components/organisms/what-i-do.tsx`                        | `organisms/what-i-do.js`                        | **Server**          |
| `components/organisms/things-i-like.tsx`                    | `organisms/things-i-like.js`                    | **Server**          |
| `components/organisms/testimonials.tsx`                     | `organisms/testimonials.js`                     | **`'use client'`**  |
| `components/molecules/ability-description.tsx`              | `molecules/ability-description.js`              | **Server**          |
| `components/molecules/testimonial.tsx`                      | `molecules/testimonial.js`                      | (in client subtree) |
| `components/molecules/thing-i-like.tsx`                     | `molecules/thing-i-like.js`                     | **Server**          |
| `components/atoms/heading.tsx`                              | `atoms/heading.js`                              | **Server**          |
| `components/atoms/highlight.tsx`                            | `atoms/highlight.js`                            | **Server**          |
| `components/atoms/stat-row.tsx`                             | `atoms/stat-row.js`                             | **Server**          |
| `components/atoms/testimonial-portrait.tsx` + `.module.css` | `atoms/testimonial-portrait.js` + `.module.css` | (in client subtree) |

`Testimonial` and `TestimonialPortrait` need **no `'use client'` directive** — they are imported
by the client `Testimonials` organism, so they inherit the client boundary. They use no hooks
themselves (`next/image` works in both server and client trees), so leaving them directive-free is
correct and keeps them reusable. Only `testimonials.tsx` carries the directive (AR14: "the
testimonials carousel" is the named client leaf; "the surrounding content renders on the server").

### Server/Client decomposition (AR14, NFR5)

The archive About Me page and its organisms were all plain components in a client-by-default
Gatsby world. The idiomatic-Next shape (AR14):

- **`page.tsx` = Server Component** — owns the wrapper markup + `metadata`, composes four organisms.
- **AboutMe / WhatIDo / ThingsILike = Server Components** — pure static content + `FontAwesomeIcon`
  (which renders in RSC; proven by the existing server-rendered `socials.tsx`). No hooks, no
  interactivity → no `'use client'`.
- **Testimonials = the one client leaf** — client _only_ because Embla needs `useEmblaCarousel`
  (a hook) + the buttons' `onClick`. Everything it renders (cards, portraits) lives in its client
  subtree, which is fine.

Do **not** collapse the page into one big client component "for simplicity" — that regresses the
server-by-default posture (NFR5) the Epic 2/3.1 stories established.

### Carousel parity risk #1: the positioned ancestor (read before AC #3)

The archive's testimonial author block is `position: absolute; bottom: 1rem` **with no `relative`
ancestor in the component** — it relied on `@egjs/react-flicking` injecting `position` onto its
panel elements, so the author anchored to the Flicking panel/card. **Embla does not position its
slides.** Port verbatim and the author block will escape to the wrong ancestor (the nearest
positioned element, or the viewport). The fix in Task 6 adds **`relative`** to the bordered inner
box (`relative flex flex-col … border-2 …`) so the author anchors there. This is a
_library-swap-induced_ parity fix, not gold-plating. **Verify the author-name placement against
the live site** at the browser check and the Story 4.1 gate — if it sits differently, adjust which
wrapper carries `relative` (the outer `panel` card vs the bordered box) to match the live site.

### Carousel parity risk #2: free-scroll feel

Flicking `freeScroll` and Embla `dragFree` are both momentum-free-drag modes but their physics
differ slightly. The _content, layout, and button behaviour_ will be at parity; the exact
drag-momentum feel may differ imperceptibly. This is acceptable (NFR2 is behavioural parity, not
physics-identical) and is a browser-check / Story 4.1 confirmation item, not a blocker. If the
feel is off, Embla exposes `dragFree`, `duration`, and `containScroll` tuning — but do not
over-tune; match the live site, then stop.

### The Tailwind-v4 spacing gotcha (AC #5, ADR 0023) — why this bites

Tailwind **v3** (archive) only generated spacing utilities you defined; the archive
`tailwind.config.js` `extend.spacing` set `94:'26rem'`, `87:'23rem'`, `88:'24rem'`, etc.
Tailwind **v4** generates `h-<n>`/`w-<n>` for **any** integer dynamically as
`calc(var(--spacing) * n)` (default `--spacing: 0.25rem`). So `h-94` is **not** missing/purged —
it renders, but at `94 × 0.25rem = 23.5rem`, not the archive's `26rem`. The cards render ~2rem too
small: a real, silent visual regression exactly the kind NFR1 + the AR3 border/ring/divide-style
guard exist to catch. Declaring `--spacing-94: 26rem` (etc.) in `@theme` makes the named token win
over the dynamic `calc`. Divergent values used on About Me: **`87` (23 vs 21.75), `88` (24 vs 22),
`94` (26 vs 23.5)**. Coincident (no override needed): `68` (17=17), `80` (20=20), `72`, `36`.

### Bugs fixed on port ("fix obvious bugs, don't port verbatim")

- **`class` → `className`** in `testimonial.js:12`. `class` is invalid as a React/JSX DOM prop and
  is **not** in React's TS attribute types → it fails `strict` typecheck (hard build error), and
  even in JS React warns and the class may not apply. This is an unambiguous bug; fix to
  `className`. (Same principle as the 2.2 `xl: mr-0` space-typo fix and the 3.1 title-doubling fix.)
- **`type="button"`** added to the two carousel nav buttons (3.1 review precedent — a bare
  `<button>` defaults to `type="submit"`; harden it). Invisible to the visual-diff gate; no parity
  cost.

Everything else is **preserved verbatim**, including harmless no-ops: the `panel`/`anchor` classes
(no CSS attached), and the content quirks (`Age "39"`, the Twitter link upstream, etc. — frozen
content, Ariadne's job).

### The obfuscated email (FR22, NFR7) — what actually happens

Write the entity form **verbatim** in source: `value="zacharybraddy&#0064;gmail.com"`. The JSX
compiler (SWC, like the archive's Babel) decodes the numeric character reference `&#0064;` → `@`
in the attribute string at build time, so the _rendered_ DOM text matches the live site exactly —
**parity holds**. The point of FR22/NFR7 is to **keep the obfuscated form in the source** (the
intentional quirk) and **not "clean it up"** to a literal `@`. Don't be alarmed that the rendered
output shows `@` — that is correct and matches today. (If the live site is found to show the
literal `&#0064;` text instead, flag it at the browser check — but the archive's Babel build
decodes it, so expect a rendered `@`.) Confirm against the live site at the Story 4.1 gate.

### FontAwesome in Server Components (already wired)

`layout.tsx` imports `@fortawesome/fontawesome-svg-core/styles.css` and sets
`faConfig.autoAddCss = false` (the standard Next FA setup that prevents the giant-icon flash), and
`socials.tsx` already renders `FontAwesomeIcon` server-side. So `WhatIDo`/`ThingsILike`/
`AbilityDescription`/`ThingILike` render their icons fine as **Server Components** — no
`'use client'`, no extra CSS import. Solid icons used: `faTerminal, faPencilRuler,
faChalkboardTeacher, faPeopleCarry` (What I Do); `faHeart, faGamepad, faMusic, faRobot` (Things I
Like); `faLessThan, faGreaterThan` (carousel nav) — all in the installed
`@fortawesome/free-solid-svg-icons ^7.2.0`.

### Project structure & conventions (from project-context.md — note the Theseus divergence)

- **Atomic design:** atoms (`heading`, `highlight`, `stat-row`, `testimonial-portrait`), molecules
  (`ability-description`, `testimonial`, `thing-i-like`), organisms (`about-me`, `what-i-do`,
  `testimonials`, `things-i-like`), page (`app/about-me/page.tsx`). Filenames **kebab-case**,
  component identifiers **PascalCase**, **default export** — matching the existing tree.
- **TypeScript strict, no `.js` source** (AR2) — new files are `.tsx`; **no `any`** (use
  `React.ReactNode`, `IconDefinition`, the `PORTRAITS: Record<string, string>` map; Embla's api is
  typed — `emblaApi?.scrollPrev()`); TS types not `PropTypes`. (project-context's PropTypes/Gatsby/
  `useStaticQuery`/`GatsbyImage` rules describe the **archive** stack — follow the Theseus
  artifacts where they diverge, as 1.7–3.1 established.)
- **Prettier is law** (`^3.x`): single quotes, `arrowParens: avoid`. Run `npm run format`.
- **No code comments by default** — none warranted (drop the placeholder comment in the carousel
  snippet above when you fill in the slides).
- **British spelling** in user-facing copy — none added; all copy is frozen archive content.
- **Config indirection** — N/A for content here; the testimonials are content (inlined verbatim as
  in the archive), not tweakable config. Don't invent a config module for them (NFR6).
- **Themed colours only** — `text-secondary`/`text-tertiary`/`bg-primary-200`/`border-secondary`/
  `border-inverse` utilities (all in `globals.css`, verified) drive colour; **no raw hex**. All
  class strings are **static literals** (Tailwind v4 scan safety). `font-fancy-heading` is the
  `@theme` token.

### Scope seams — do NOT build now (NFR6)

Out of scope: **any other Epic 3 page** (Resume / Content / 404 = 3.3–3.5). Do **not** refactor the
Epic 2 shell. Do **not** add the unused archive spacing tokens (`102/110/118/126/134`),
`gridTemplateRows.7`, or a testimonials config/data module — add nothing the About Me page doesn't
render. Do **not** "update" frozen content (Age, missing jobs, the Twitter link, CV currency —
**Ariadne**). Do **not** "fix" the multiple-`<h1>` a11y quirk, the `panel`/`anchor` no-op classes,
or the absolute-author-positioning beyond the minimal `relative` needed to anchor it. The full
all-tier visual sign-off is the **Story 4.1 gate**.

### Testing standards (AR13 — no suite to fabricate)

No test framework exists; `npm test` is a stub that exits 1 — **do not** run it or invent a suite.
Verification = `npm run build` green + pure static export, `npm run lint` clean, and **manual
behavioural parity** in a browser (both themes, desktop + mobile). Record honestly what was
observed; the all-tier visual sign-off is the Story 4.1 gate.

### Project Structure Notes

- About Me decomposes into a Server-Component page + three Server organisms + one client
  (`Testimonials`) organism — the AR14 shape Epic 2/3.1 follow. The `Heading`/`Highlight` atoms
  built here are **reused by Resume (3.3) and Content (3.4)** — build them clean.
- `page.tsx` renders as `children` inside `ContentTransition` (Story 2.5) within the
  `bg-primary-400` content pane — supply only inner markup.
- The carousel adds the **first runtime dependency since Epic 2** (`embla-carousel-react`) and the
  **first content images beyond the portrait** — both flow through the existing Netlify image
  loader (`src/image-loader.ts`); local `/images/*.jpg` are site-relative and route through it
  cleanly (the deferred loader-hardening in deferred-work.md story-1.7 concerns remote/encoded
  srcs, which don't apply here).

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.2] — the four ACs: all four sections
  at content/structure parity; email entity-obfuscation preserved (FR22/NFR7); testimonials
  carousel behaves as today as a `'use client'` leaf while surrounding content is server (AR14);
  per-page SEO via the Metadata API.
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 3] — fill the shell page-by-page at
  byte-for-byte parity; content organisms server-side, interactive bits `'use client'`.
- [Source: _bmad-output/planning-artifacts/epics.md#FR12, #FR21, #FR22, #FR17] — About Me sections;
  optimised responsive content images (`next/image`); preserve email obfuscation; per-page SEO.
  [#Additional Requirements] — AR9 (GraphQL data-layer removal), AR13 (no fabricated suite), AR14
  (named client leaves — testimonials carousel named explicitly), AR17 (`next/image` CLS guard),
  AR19 (decision-capture DoD).
- [Source: archive/src/pages/about-me.js] — the page wrapper (`px-4 py-8 grid grid-cols-1 gap-8`),
  the four organisms in order, `Seo title="About Me - Zac Braddy"`.
- [Source: archive/src/components/organisms/about-me.js] — intro `<p>`, four `Highlight` bullets,
  closing `<p>`, the six `StatRow`s incl. `value="zacharybraddy&#0064;gmail.com"` (line 83) and
  the frozen `Age "39"`.
- [Source: archive/src/components/organisms/what-i-do.js] — Heading + four `AbilityDescription`
  with the four solid icons and `Highlight`-laced paragraphs.
- [Source: archive/src/components/organisms/testimonials.js] — Flicking config
  (`bound`/`moveType="freeScroll"`/`align="center"`/`cameraClass="flex gap-4"`), the two nav
  buttons (`faLessThan`/`faGreaterThan`, classes), the six `Testimonial`s (authors/titles/
  companies/portraitNames/quotes — port verbatim, in order).
- [Source: archive/src/components/organisms/things-i-like.js] — Heading + four `ThingILike` with
  `faHeart/faGamepad/faMusic/faRobot`.
- [Source: archive/src/components/molecules/{ability-description,testimonial,thing-i-like}.js] — the
  three molecules; note `testimonial.js:12` `class=` bug (→ `className`) and the absolute author
  block needing a positioned ancestor.
- [Source: archive/src/components/atoms/{heading,highlight,stat-row,testimonial-portrait}.js +
  testimonial-portrait.module.css] — the four atoms; `testimonial-portrait.js` is the
  `useStaticQuery(graphql)`/`GatsbyImage` lookup (six files) to replace with `next/image` + a TS
  map; the `.module.css` `margin-bottom: -3rem`.
- [Source: archive/tailwind.config.js] — the custom `extend.spacing` scale (`87:'23rem'`,
  `88:'24rem'`, `94:'26rem'`, …) that ADR 0023 reconciles with Tailwind v4's dynamic scale.
- [Source: src/components/atoms/portrait-image.tsx + .module.css] — the established `next/image`
  pattern to mirror for `TestimonialPortrait` (`fill` + `sizes` + `object-cover`, `relative w-24
h-24 rounded-full overflow-hidden border-4 border-inverse shadow-xl` + negative-margin module).
- [Source: src/components/molecules/socials.tsx] — proof `FontAwesomeIcon` renders in a Server
  Component (no `'use client'`); the FA-icon usage pattern.
- [Source: src/app/layout.tsx:4–6,19] — FA core CSS import + `faConfig.autoAddCss = false`; the
  `%s - Zac Braddy` root title template + metadata defaults the page inherits; the
  `<ContentTransition>{children}</ContentTransition>` content pane the page renders into.
- [Source: src/app/globals.css:3–8] — the `@theme` block to extend with the three spacing tokens;
  the themed `@utility` colour classes (`bg-primary-200`, `text-secondary`, `border-inverse`, …)
  and `font-fancy-heading` token the markup uses (all present).
- [Source: src/config/index.ts] — `config` (no change needed; testimonials are content, not config).
- [Source: src/components/atoms/nav-link.tsx:6] — the `IconDefinition` type-import pattern for FA
  icon props (reuse for `AbilityDescription`/`ThingILike`).
- [Source: _bmad-output/implementation-artifacts/3-1-home-page.md] — the Epic-3 house pattern:
  Server-Component page + named `'use client'` leaves; ADR-0021 metadata convention (child segments
  use `title: '<Page>'` + root template — the root-page `title.absolute` workaround does **not**
  apply here); `type="button"` hardening; verification-honesty bar; "project-context describes the
  archive stack — follow Theseus artifacts where they diverge".
- [Source: docs/decisions/0021-…md] — the metadata convention this page follows.
  [docs/decisions/0010-…md] — the `border-inverse` invalid-colour quirk (testimonial portrait
  border). [docs/decisions/0018-…md] — the 2.4 `react-burger-menu → vaul` precedent ADR 0022 cites.
- [Source: docs/decisions/_template.md + README.md] — ADR format + index for the 0022/0023
  captures; **0021 is the highest existing number; 0022 and 0023 are next.**
- [Source: _bmad-output/implementation-artifacts/deferred-work.md] — story-1.7 image-loader
  hardening (remote/encoded srcs — N/A to local jpgs here); story-2.2 nav list-semantics +
  story-2.6 reduced-motion (the same class of Ariadne a11y deferral as the multiple-`<h1>` quirk).
- [Source: _bmad-output/project-context.md] — atomic structure, kebab-case/PascalCase, Prettier
  law, no-comments default, themed-colour rule, no-interpolated-classnames, email-obfuscation
  preservation; describes the **archive** stack — follow the Theseus artifacts where they diverge.

## Decision trail

1. **Testimonials carousel: Embla replaces `@egjs/react-flicking` (RESOLVED Zac 2026-06-18, →
   ADR 0022).** The Gatsby-era Flicking lib is not in the Theseus tree; adding a top-level dep is a
   deliberate call (project-context). `embla-carousel-react` is the modern, React-19-ready,
   zero-dependency primitive and maps 1:1 onto today's config (`dragFree`=freeScroll,
   `align:'center'`, `containScroll:'trimSnaps'`, `scrollPrev/Next` for the buttons) — consistent
   with the Story 2.4 `react-burger-menu → vaul` precedent. **Zac confirmed Embla (2026-06-18).**
2. **Tailwind-v4 custom-spacing parity (RESOLVED — engineering necessity, → ADR 0023).** The
   archive overrode spacing values that v4's dynamic `calc(var(--spacing) * n)` scale resolves
   differently (`94`→23.5 vs 26rem, etc.). Convention: re-declare **only the divergent tokens a
   page uses** in `@theme`, additively, per page. About Me needs `87`/`88`/`94`.
3. **Server/Client split (settled — AR14).** Three sections are Server Components; only
   `Testimonials` (the carousel) is `'use client'`. `Testimonial`/`TestimonialPortrait` inherit the
   client boundary (no directive). Page stays a Server Component holding the wrapper + `metadata`.
4. **Bug fixes on port (settled — "fix obvious bugs, don't port verbatim").** `class=` →
   `className=` (invalid JSX, fails strict); `type="button"` on nav buttons (3.1 precedent). The
   absolute author block gets a `relative` ancestor (Embla doesn't position slides as Flicking did).
5. **Content frozen (settled — [[theseus-content-frozen-ariadne-owns-refresh]]).** `Age "39"`, the
   Twitter link, missing jobs, CV currency are **Ariadne's** content refresh, not Theseus's. Port
   all copy verbatim.
6. **Metadata: child-segment template (settled — ADR 0021).** `/about-me` is a child segment, so
   `title: 'About Me'` + the root `%s - Zac Braddy` template → `<title>About Me - Zac Braddy</title>`
   (no `title.absolute` workaround — that was the root-page-only 3.1 exception).

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m] (Opus 4.8, 1M context) — bmad-dev-story workflow.

### Debug Log References

- `npm run lint` → clean (no errors/warnings).
- `npm run build` → green; `/about-me` listed as `○ (Static)`; no serverless functions.
- Static-export checks on `out/about-me.html`: `<title>About Me - Zac Braddy</title>`; email
  rendered as `zacharybraddy@gmail.com` (numeric entity decoded by SWC, source keeps the
  obfuscated form); all four section headings, six authors, and six portrait `src`s present.
- Generated CSS confirms the spacing-token parity guard resolves to the archive dimensions:
  `.h-94{height:var(--spacing-94)}` with `--spacing-94:26rem` (not v4's dynamic 23.5rem);
  `h-87`→23rem, `lg:w-88`→24rem likewise.
- Dev-server runtime smoke test: `GET /about-me` → HTTP 200 with the correct `<title>`.

### Completion Notes List

- **All 8 ACs satisfied.** Four sections built at content/structure parity; obfuscated email
  preserved verbatim in source (AC#2); Testimonials is the one `'use client'` Embla leaf with the
  other three sections as Server Components (AC#3); six portraits via `next/image` + a plain TS map,
  no GraphQL (AC#4); `--spacing-87/88/94` added additively to `@theme` and verified to resolve to
  archive dimensions (AC#5); child-segment metadata → `<title>About Me - Zac Braddy</title>` (AC#6);
  build green + pure static export + scope held (AC#7); ADRs 0022/0023 written and indexed (AC#8).
- **Bug fixes on port** (per "fix obvious bugs, don't port verbatim"): archive `class=` →
  `className=` in `testimonial.js`; `type="button"` added to both carousel nav buttons (3.1
  precedent); `relative` added to the testimonial bordered box so the absolute author block anchors
  to the card (Embla, unlike Flicking, does not position slides — Carousel parity risk #1).
- **Lint-driven entity escaping:** `eslint-config-next/core-web-vitals` enables
  `react/no-unescaped-entities`, which flags raw straight apostrophes in JSX text. Straight `'` in
  prose were written as `&apos;` (renders identically to `'`, parity preserved); the archive's
  curly `’` (U+2019) characters in the testimonial quotes do not trip the rule and are preserved
  literally byte-for-byte.
- **embla-carousel-react `^8.6.0`** installed (pulls Embla's own `embla-carousel` +
  `embla-carousel-reactive-utils` internals — no further third-party runtime deps). The story note
  "zero further runtime deps" refers to no third-party deps beyond Embla's own packages.
- **Verification honesty:** programmatic verification is complete (lint, build, static export, CSS
  token resolution, runtime 200). The full in-browser visual/behavioural parity sign-off — both
  themes, desktop + mobile, carousel drag feel, author-block anchoring against the live site — is
  routed to the **Story 4.1 gate** per the story's own instruction; the free-scroll drag-momentum
  feel (Flicking vs Embla `dragFree`) is the explicit 4.1 confirmation item (ADR 0022).
- **`baseline_commit` note:** the story frontmatter carried `baseline_commit: acced91` (the 3.1
  code-complete commit) on entry; per the workflow's preserve rule it was **not** overwritten. It
  looks like a stale copy from story 3.1 — the natural baseline for 3.2's review diff is HEAD
  `4f3452f` ("story 3-2 created"). Flagging for the reviewer; the only intervening commit is the
  3.2 story-file creation, so the diff is only marginally wider.

### File List

**New — route & page:**

- `src/app/about-me/page.tsx`

**New — atoms:**

- `src/components/atoms/heading.tsx`
- `src/components/atoms/highlight.tsx`
- `src/components/atoms/stat-row.tsx`
- `src/components/atoms/testimonial-portrait.tsx`
- `src/components/atoms/testimonial-portrait.module.css`

**New — molecules:**

- `src/components/molecules/ability-description.tsx`
- `src/components/molecules/testimonial.tsx`
- `src/components/molecules/thing-i-like.tsx`

**New — organisms:**

- `src/components/organisms/about-me.tsx`
- `src/components/organisms/what-i-do.tsx`
- `src/components/organisms/testimonials.tsx` (`'use client'`)
- `src/components/organisms/things-i-like.tsx`

**New — images (copied from `archive/src/images/`):**

- `public/images/travis-scholes.jpg`
- `public/images/allen-underwood.jpg`
- `public/images/georgia-shaw.jpg`
- `public/images/jay-miller.jpg`
- `public/images/joe-zack.jpg`
- `public/images/jamie-taylor.jpg`

**New — decision records:**

- `docs/decisions/0022-testimonials-carousel-embla-over-flicking.md`
- `docs/decisions/0023-tailwind-v4-custom-spacing-parity.md`

**Modified:**

- `src/app/globals.css` (additive: `--spacing-87/88/94` in `@theme` — three lines only)
- `package.json` + `package-lock.json` (added `embla-carousel-react ^8.6.0`)
- `docs/decisions/README.md` (added rows 0022 & 0023 to the index)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (3-2 → in-progress → review)
- `_bmad-output/implementation-artifacts/3-2-about-me-page.md` (this story file)

## Change Log

| Date       | Change                                                                                                                                                                                                                                |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-06-18 | Story 3.2 implemented: `/about-me` route at parity — four sections, Embla testimonials carousel, six `next/image` portraits, additive Tailwind-v4 spacing tokens, child-segment metadata; ADRs 0022 & 0023 captured. Status → review. |

## Review Findings

_Code review 2026-06-22 (bmad-code-review; Blind Hunter + Edge Case Hunter + Acceptance Auditor). All 8 ACs verified MET; faithful parity port; build/lint/static-export green. 1 patch, 5 deferred, 7 dismissed as noise._

- [x] [Review][Patch] Stale `baseline_commit` in story frontmatter — corrected `acced91` (the 3.1 commit) → HEAD `4f3452f`; the dev flagged it honestly in Completion Notes. [_bmad-output/implementation-artifacts/3-2-about-me-page.md:2]
- [x] [Review][Defer] Multiple `<h1>` per page (heading-outline a11y) [src/components/atoms/heading.tsx] — deferred, pre-existing archive quirk; Ariadne a11y pass (NFR7).
- [x] [Review][Defer] Carousel icon buttons have no accessible name, `focus:outline-none` removes the focus ring, viewport not keyboard-scrollable [src/components/organisms/testimonials.tsx] — deferred, verbatim parity; Ariadne a11y pass.
- [x] [Review][Defer] Testimonial grammar typo "he&apos;s be an asset" [src/components/organisms/testimonials.tsx] — deferred, frozen content (verbatim from archive `testimonials.js:125`); Ariadne content refresh.
- [x] [Review][Defer] Author block can overflow the narrow `w-64` card; `self-start/lg:self-end` inert on an `absolute` element and the horizontal anchor is undefined [src/components/molecules/testimonial.tsx] — deferred, verbatim parity; Story 4.1 visual gate (Carousel parity risks #1/#2, already named).
- [x] [Review][Defer] `sm:grid sm:grid-cols-2 lg:block` wraps a single child, so the two-column intent never materialises [src/components/organisms/about-me.tsx] — deferred, verbatim archive quirk (`about-me.js:76-77`); revisit only if Ariadne ever reworks the stats layout.
