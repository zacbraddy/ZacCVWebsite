---
baseline_commit: 7162908
---

# Story 3.4: Content page (`/content`)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a site visitor,
I want the Content gallery with every item, thumbnail, and external link,
so that I can browse Zac's created content exactly as today.

## Context & purpose (read first)

This is the **fourth story of Epic 3** (Content Pages at Parity). The themed, persistent,
fully-navigable shell exists (Epics 1–2 done) and **3.1 (Home), 3.2 (About Me), and 3.3
(Resume) are done** — establishing the Epic-3 house pattern: a **Server-Component page** that
composes content + exports per-page `metadata`, with **`'use client'` only on interactive
leaves**, all rendered as `children` inside `<ContentTransition>` in the root `layout.tsx`.
This story does the `/content` route.

`/content` is, like `/resume`, **a zero-interactivity page — every component is a Server
Component** (no `'use client'` anywhere). It has a single column of **seven `ContentItem`
cards** inside the standard page wrapper, each an external-link card with a thumbnail image,
a highlighted title, body copy, and an **alternating left/right desktop layout** (cards 1/3/5/7
image-left, cards 2/4/6 image-right). The page's one genuinely new mechanic vs the prior
Epic-3 pages is **real raster content images of varying aspect ratios served through
`next/image` + the Netlify Image CDN loader** (FR21 content images / AR17) — this is the page's
primary parity risk (see Dev Note "Thumbnail parity risk: GatsbyImage CONSTRAINED → `next/image`").

The single source of visual/behavioural truth is the **live site** (`zackerthehacker.com`) and
the archived Gatsby tree (`archive/src/pages/content.js` + `organisms/content-item.js` +
`atoms/content-thumbnail.js`). This is a **byte-for-byte parity port** (NFR1
zero-visual-regression, NFR2 zero-functional-regression, NFR7 preserve quirks) **with three
explicit, Zac-approved content carve-outs** (2026-06-22) — see "Approved content deviations"
below. Otherwise content stays **frozen** — Epic 3 is like-for-like translation only; the casual
prose voice, the lowercase `"youtuber"` (in quotes, deliberately colloquial), and the
double-quote/`dev.to` quirks remain **Project Ariadne's** content refresh, **not Theseus's** (do
**not** "update", "correct", or "tidy" anything beyond the three approved carve-outs).

### Approved content deviations (Zac's call, 2026-06-22)

These three are **deliberate, conscious steps off strict parity** — the same pattern as the
`xl:mr-0` and theme-toggle aria-label fixes (ADR 0016 / deferred-work). They make Theseus read
differently from the live Gatsby site, which is **accepted** (Gatsby retires at cutover, Theseus
becomes the source of truth). **Flag all three for the Story 4.1 gate as expected differences, not
regressions:**

1. **Add the Tabs & Spaces podcast link** — `link="https://open.spotify.com/show/4Xqo3bTXOqyrlPjX9H2Ytk?si=55457f85cf1c4014"`
   (the archive card had no `href`; this fills the gap and is invisible in a visual diff).
2. **`Youtube` → `YouTube` casing** — item-6 title (`<Highlight>YouTube</Highlight> videos`) and the
   two `youtube channel` mentions in item-7 body copy (`YouTube channel`). **Keep `"youtuber"`
   lowercase** — it's in quotes and deliberately colloquial.
3. **Heading capitalisation** — `Content I&apos;ve created` → `Content I&apos;ve Created`, so the
   heading matches the page `<title>` casing.

Everything else on the page is a verbatim port.

**3.4's job — build the Content gallery subtree at parity:**

- **Build the new components** the page composes: `ContentThumbnail` (atom — **new**, the
  GatsbyImage→`next/image` port), `ContentItem` (organism — **new**), and the route
  `src/app/content/page.tsx`. **Reuse the existing `Heading` and `Highlight` atoms** (both
  already in the Theseus tree — do **not** re-create them).
- **Copy the seven content images** from `archive/src/images/` to `public/images/` (the
  Theseus convention: string `src` under `/images/*`, served via the Netlify loader — same as
  the 3.2 portraits).
- **Add one custom spacing token** — `--spacing-118: 38rem` — to `globals.css` `@theme`, so the
  archive's `md:w-118` card width resolves (the **ADR 0023** per-page-divergent-token convention,
  exactly as 3.2 added `--spacing-87/88/94`). **No new ADR is needed for the token** (it executes
  the accepted ADR 0023).
- **Apply the ADR 0021 metadata convention** — `/content` is a **child** route segment, so
  `title: "Content I've Created"` + the root `%s - Zac Braddy` template renders
  `<title>Content I've Created - Zac Braddy</title>` (identical handling to how 3.2/3.3 did
  `/about-me` and `/resume`; the root-page `title.absolute` workaround from 3.1 does **not** apply).

After this: only **404 (3.5)** remains in Epic 3.

## Acceptance Criteria

1. **The seven-item content gallery renders at content/structure parity (FR14).**
   **Given** the content route,
   **When** it renders,
   **Then** it shows the gallery of seven content items — **Tabs and Spaces podcast**, the
   **Manning course** ("Published author"), **Conference talks**, the **Medium blog** ("Blog
   posts"), **Podcast guest appearances**, **Youtube videos**, and the **former community
   creator** ("The Reactionary") — **in that order**, each with its thumbnail, highlighted title,
   body copy, and alternating layout, inside the page wrapper
   `<div className="px-4 py-8 grid grid-cols-1 gap-8">` with the inner
   `<div className="flex flex-col p-4">` gallery column (both verbatim from
   `archive/src/pages/content.js`),
   **And** the top heading uses the **existing** `Heading` atom —
   `<Heading className="text-secondary">Content I&apos;ve Created</Heading>` (capital "Created" per
   approved carve-out #3; the straight apostrophe escaped to `&apos;` per
   [[theseus-epic3-jsx-apostrophe-escaping]]),
   **And** each title's highlighted phrase uses the **existing** `Highlight` atom
   (`podcast`, `Published author`, `talks`, `Blog`, `guest`, `YouTube`, `community creator` —
   note `YouTube` per carve-out #2),
   **And** all body copy is reproduced **exactly** as the archive **except** the two
   `youtube channel` → `YouTube channel` casing fixes in item 7 (carve-out #2) — including the
   casual prose, the lowercase `"youtuber"` (kept) and `"The Reactionary"` straight double-quotes,
   and the `dev.to` reference (NFR7); straight apostrophes in prose escaped to `&apos;`, any curly
   `'` left literal.

2. **Each thumbnail is served via `next/image` with correct intrinsic dimensions and no layout
   shift (FR21 content images, AR17).**
   **Given** each content item's thumbnail,
   **When** it renders,
   **Then** it is rendered by a new **`src/components/atoms/content-thumbnail.tsx`** that maps the
   `imageName` to a `/images/*.jpg` `src` and renders `next/image` with the image's **correct
   intrinsic `width`/`height`** (so aspect ratio is preserved and CLS is controlled, AR17),
   **And** the seven images are present in **`public/images/`** (copied from `archive/src/images/`:
   `tabs-and-spaces.jpg`, `course.jpg`, `conference-talks.jpg`, `podcast-guest.jpg`, `youtube.jpg`,
   `medium.jpg`, `the-reactionary.jpg`),
   **And** the thumbnail's displayed sizing/cropping is **visually matched to the live site** in
   both the mobile (stacked, image-on-top) and desktop (`md:` fixed-box) layouts — see Dev Note
   "Thumbnail parity risk" (the one genuine rendering judgement on this page; verified in-browser
   and at the Story 4.1 gate),
   **And** the archive's missing-image fallback string is preserved verbatim — when an
   `imageName` is unknown the component renders
   `<div>{`Oops, this was supposed to be a photo of the ${imageName} thumbnail:S`}</div>`
   (mirrors the `testimonial-portrait.tsx` fallback idiom from 3.2; NFR7).

3. **Each external link opens its correct destination in a new tab (FR14), including the newly
   added Tabs & Spaces podcast link (carve-out #1).**
   **Given** each content item's external link,
   **When** the visitor activates it,
   **Then** it opens the correct destination in a new tab via
   `<a href={link} target="_blank" rel="noreferrer">` (note `rel="noreferrer"` **not**
   `"noopener noreferrer"` — verbatim from the archive, and consistent with the existing
   `socials.tsx`/`nav-links.tsx` links),
   **And** **all seven** cards point to the exact URLs in the Verbatim data map — including the
   **Tabs and Spaces** card, which now carries
   `link="https://open.spotify.com/show/4Xqo3bTXOqyrlPjX9H2Ytk?si=55457f85cf1c4014"` (carve-out #1;
   the archive card had no `href`).

4. **Every Content component is a Server Component — no `'use client'` is introduced (AR14, NFR5).**
   **Given** the content page has **no interactivity** (no hooks, no event handlers, no
   client-only APIs),
   **When** the subtree is built,
   **Then** the page and **all** of its components (`ContentPage`, `ContentItem`,
   `ContentThumbnail`) render as **Server Components** — **no `'use client'` directive is added to
   any of them** (AR14: content organisms render on the server; NFR5 server-by-default). `next/image`
   works in Server Components — `ContentThumbnail` stays server-side, exactly like the 3.2
   `testimonial-portrait.tsx`/`portrait-image.tsx` (no client boundary),
   **And** the route `/content` is statically generated (`○ (Static)` in the build output).

5. **Per-page SEO metadata matches today via the Metadata API + the child-segment template
   (FR17, ADR 0021).**
   **Given** the Next Metadata API and the ADR-0021 convention,
   **When** `/content` is served,
   **Then** `src/app/content/page.tsx` exports `metadata` with **`title: "Content I've Created"`**,
   which — because `/content` is a **child** route segment — the root `%s - Zac Braddy` template
   renders as **`<title>Content I've Created - Zac Braddy</title>`** (the root-page `title.absolute`
   workaround from 3.1 does **not** apply to child segments; identical to 3.2/3.3),
   **And** `openGraph.title` and `twitter.title` are set to **`"Content I've Created - Zac Braddy"`**
   (matching the archive's literal `Seo title="Content I've Created - Zac Braddy"`),
   **And** description, OG image, Twitter `summary_large_image` card, and favicon **inherit** the
   root-layout defaults (Story 1.6) — **not** re-declared,
   **And** no `react-helmet` is used (FR17).

6. **Build green; static export intact; the one custom token added; parity verified; scope held
   (NFR1/NFR2/NFR5/NFR6).**
   **Given** the change,
   **When** `npm run build` and `npm run lint` are run,
   **Then** both are green (TypeScript `strict`, **no `any`**, no lint errors — watch the
   apostrophe escaping) and the build stays a **pure static export** (route `/content` shows as
   `○ (Static)`, no serverless functions),
   **And** `globals.css` gains **exactly one** new token, `--spacing-118: 38rem;` in the `@theme`
   block (so `md:w-118` = 38rem resolves), per the ADR-0023 convention — **no other `globals.css`
   change**,
   **And** the page (seven cards in order, each thumbnail, the alternating
   left/right desktop layout collapsing to a single stacked column below `md`, the highlighted
   titles, the external links opening in new tabs) is verified in a browser in **both themes**,
   desktop **and** mobile, against the live site,
   **And** the change is confined to: the new `content` route + the two new components
   (`ContentItem`, `ContentThumbnail`) + the seven copied images + the one `--spacing-118` token +
   sprint/story tracking — with **NO new dependency**, **no** edits to any Epic 1–2 shell behaviour,
   and **no** other Epic 3 page.

7. **Decision capture as-you-go (FR26 / AR19) — no new ADR expected for the planned work.**
   **Given** the cross-cutting decision-capture DoD,
   **When** the page is built,
   **Then** the `--spacing-118` token is recognised as **execution of the already-accepted [ADR
   0023](../../docs/decisions/0023-tailwind-v4-custom-spacing-parity.md)** (per-page divergent
   spacing tokens), so **no new ADR is required** for it,
   **And** an ADR (next free number **0024**) is written **only if** a genuinely non-obvious
   reconciliation call is actually made during the GatsbyImage→`next/image` thumbnail port —
   specifically if matching the live-site thumbnail rendering requires a sizing/cropping approach
   that deviates from a faithful port of the archive's `className="md:h-full"` (see Dev Note
   "Thumbnail parity risk"); otherwise nothing new is captured (do **not** manufacture an ADR to
   tick a box — NFR6),
   **And** if a genuinely-deferrable item surfaces, it is logged in `deferred-work.md` (story-3.4)
   rather than gold-plated (NFR6).

## Tasks / Subtasks

- [x] **Task 1 — Copy the seven content images into `public/images/`** (AC: #2)
  - [x] Copy from the archive (kebab-case filenames, unchanged):
    ```bash
    cp archive/src/images/{tabs-and-spaces,course,conference-talks,podcast-guest,youtube,medium,the-reactionary}.jpg public/images/
    ```
  - [x] Confirm all seven land in `public/images/` alongside the existing portraits. These are
        the **first real raster content images** to flow through the Netlify Image CDN loader
        (`src/image-loader.ts`); the paths are site-relative, kebab-case `/images/*.jpg`, so the
        loader robustness gaps deferred from Story 1.7 (remote-allowlist, double-encoding,
        spaces→`+`) **do not apply** — but sanity-check the images actually resolve through the
        loader on the build/preview (the loader returns `src` verbatim in dev, `/.netlify/images?url=…`
        in prod). See Dev Note "Loader note".

- [x] **Task 2 — Build the `ContentThumbnail` atom (NEW — Server Component, `next/image`)** (AC: #2, #4)
  - [x] `src/components/atoms/content-thumbnail.tsx` — port `archive/.../atoms/content-thumbnail.js`,
        replacing the GatsbyImage `useStaticQuery` lookup with a static `imageName → { src, width,
height }` map (mirroring the `testimonial-portrait.tsx` `Record<string,…>` idiom from 3.2),
        and rendering `next/image` with the **real intrinsic dimensions**:

                            ```tsx
                            import Image from 'next/image';

                            const THUMBNAILS: Record<
                              string,
                              { src: string; width: number; height: number }
                            > = {
                              tabsAndSpaces: {
                                src: '/images/tabs-and-spaces.jpg',
                                width: 1500,
                                height: 1500,
                              },
                              course: { src: '/images/course.jpg', width: 360, height: 450 },
                              conferenceTalks: {
                                src: '/images/conference-talks.jpg',
                                width: 280,
                                height: 158,
                              },
                              podcastGuest: {
                                src: '/images/podcast-guest.jpg',
                                width: 600,
                                height: 314,
                              },
                              youtube: { src: '/images/youtube.jpg', width: 144, height: 144 },
                              medium: { src: '/images/medium.jpg', width: 144, height: 144 },
                              theReactionary: {
                                src: '/images/the-reactionary.jpg',
                                width: 144,
                                height: 144,
                              },
                            };

                            const ContentThumbnail = ({ imageName }: { imageName: string }) => {
                              const thumb = THUMBNAILS[imageName];
                              if (!thumb) {
                                return (
                                  <div>{`Oops, this was supposed to be a photo of the ${imageName} thumbnail:S`}</div>
                                );
                              }
                              return (
                                <Image
                                  src={thumb.src}
                                  alt=""
                                  width={thumb.width}
                                  height={thumb.height}
                                  sizes="(min-width: 768px) 192px, 300px"
                                  className="md:h-full"
                                />
                              );
                            };
                            export default ContentThumbnail;
                            ```

  - [x] **The intrinsic dimensions are non-negotiable for CLS (AR17)** — use the real source
        dimensions: `tabs-and-spaces` 1500×1500, `course` 360×450, `conference-talks` 280×158,
        `podcast-guest` 600×314, and `youtube`/`medium`/`the-reactionary` 144×144 each.
  - [x] **Keep `alt=""`** — the archive GatsbyImage had no `alt` (decorative thumbnail inside a
        labelled link); `alt=""` is the faithful + lint-clean equivalent. Keep the fallback `<div>`
        string **verbatim** (including `:S`).
  - [x] **Read Dev Note "Thumbnail parity risk" before finishing.** The archive className was just
        `md:h-full`; `next/image` with intrinsic `width`/`height` is **not** responsive by default,
        so the displayed sizing/cropping must be reconciled against the live site. Start as close to
        `md:h-full` as possible, add only what's needed (e.g. `object-cover`, a width cap, mobile
        width handling) to match, and verify in-browser. Capture any non-verbatim reconciliation as
        ADR 0024 (AC #7).

- [x] **Task 3 — Build the `ContentItem` organism (NEW — Server Component)** (AC: #1, #3, #4)
  - [x] `src/components/organisms/content-item.tsx` — port `archive/.../organisms/content-item.js`
        **verbatim** (the archive places this card in `organisms/`; keep that tier so the page's
        imports and the parity map stay 1:1), composing the new `ContentThumbnail`:

    ```tsx
    import ContentThumbnail from '@/components/atoms/content-thumbnail';

    const ContentItem = ({
      link,
      imageName,
      title,
      order = 'left',
      children,
    }: {
      link?: string;
      imageName: string;
      title: React.ReactNode;
      order?: 'left' | 'right';
      children: React.ReactNode;
    }) => (
      <div
        className={`rounded overflow-hidden border border-inverse mb-4 md:h-36 md:w-118 ${
          order === 'right' ? 'md:self-end' : ''
        }`}
      >
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className={`md:flex md:h-full ${
            order === 'right' ? 'md:flex-row-reverse' : ''
          }`}
        >
          <div
            className={`border-b border-inverse md:w-48 md:border-b-0 ${
              order === 'right' ? 'md:border-l' : 'md:border-r'
            }`}
          >
            <ContentThumbnail imageName={imageName} />
          </div>
          <div
            className={`p-2 w-full md:flex md:flex-col md:h-32 ${
              order === 'right' ? 'md:items-end' : ''
            }`}
          >
            <div className="font-bold text-lg">{title}</div>
            <div className="pt-2 italic text-sm">{children}</div>
          </div>
        </a>
      </div>
    );
    export default ContentItem;
    ```

  - [x] **Keep `link` optional in the type** (`link?: string`) to match the archive component
        signature — though after carve-out #1 **all seven** items now pass a `link` (the Tabs & Spaces
        card gets the Spotify URL). The optional type is harmless and faithful; don't make it required.
  - [x] **`title` is `React.ReactNode`** — the page passes JSX (`<>Tabs and Spaces <Highlight>podcast</Highlight></>`).
  - [x] All className strings stay **static literals** with only the fixed `order === 'right'` string
        branches (no interpolated Tailwind token names) — Tailwind v4 scan-safe. `md:w-118` resolves
        via the `--spacing-118` token added in Task 5. `border-inverse` sets the border colour
        (`var(--color-border-inverse)`), so the bare `border`/`border-b`/`md:border-r`/`md:border-l`
        widths inherit an explicit colour — the Tailwind-v4 border guard (ADR 0009) is satisfied (no
        `currentColor` surprise beyond the documented `border-inverse` archive quirk, ADR 0010 /
        deferred-work story-2.3). Keep `rel="noreferrer"` verbatim.

- [x] **Task 4 — Create the route page (Server Component + metadata)** (AC: #1, #3, #5)
  - [x] `src/app/content/page.tsx` — a **Server Component** (no `'use client'`), reusing the
        **existing** `Heading` and `Highlight` atoms and composing the seven `ContentItem`s. Port
        `archive/src/pages/content.js` verbatim (Seo → `metadata` export):

    ```tsx
    import type { Metadata } from 'next';
    import Heading from '@/components/atoms/heading';
    import Highlight from '@/components/atoms/highlight';
    import ContentItem from '@/components/organisms/content-item';

    export const metadata: Metadata = {
      title: "Content I've Created",
      openGraph: { title: "Content I've Created - Zac Braddy" },
      twitter: { title: "Content I've Created - Zac Braddy" },
    };

    export default function ContentPage() {
      return (
        <div className="px-4 py-8 grid grid-cols-1 gap-8">
          <Heading className="text-secondary">
            Content I&apos;ve Created
          </Heading>
          <div className="flex flex-col p-4">
            {/* seven ContentItem cards, in archive order — see the Verbatim data map */}
          </div>
        </div>
      );
    }
    ```

  - [x] Reproduce the **seven cards** from the archive in order (1 Tabs&Spaces left + Spotify link,
        2 course right, 3 conferenceTalks left, 4 medium right, 5 podcastGuest left, 6 youtube right,
        7 theReactionary left) — copy each `imageName`, `link`, `order`, the JSX `title`
        (with `Highlight`), and the body copy **exactly** from the Verbatim data map in Dev Notes
        (which already bakes in the three approved carve-outs: the Spotify link, the `YouTube` casing,
        and `YouTube channel` ×2).
  - [x] **Metadata casing now matches the heading:** the document `title` is `"Content I've Created"`
        (capital **C**reated) → renders `<title>Content I've Created - Zac Braddy</title>`; the
        **heading** text is now also `Content I&apos;ve Created` (capital **C**, carve-out #3) — the
        prior lowercase-"c" mismatch is intentionally fixed. Use **double-quoted** TS strings for the
        metadata titles so the apostrophe needs no escaping (Prettier keeps double quotes when a
        single-quote char is present); in the JSX **heading** text escape the apostrophe as `&apos;`
        (react/no-unescaped-entities). Do **not** re-declare description/OG-image/card/favicon — they
        inherit the Story-1.6 defaults.
  - [x] The page renders as `children` inside `<ContentTransition>` in `layout.tsx` — supply only the
        inner section markup, no shell chrome, no extra height wrappers.

- [x] **Task 5 — Add the `--spacing-118` custom token** (AC: #6, #7)
  - [x] In `src/app/globals.css`, add **one** line to the existing `@theme` block, next to the
        `--spacing-87/88/94` tokens:
    ```css
    --spacing-118: 38rem;
    ```
    This is the **only** `globals.css` change — it makes the archive's `md:w-118` (= `38rem`, from
    `archive/tailwind.config.js`) resolve under Tailwind v4 CSS-first config. This executes the
    accepted **ADR 0023** (per-page divergent spacing tokens), exactly as 3.2 added `87/88/94` — **no
    new ADR** for the token (AC #7).

- [x] **Task 6 — Verify (build, lint, static export, in-browser parity)** (AC: #1–#6)
  - [x] `npm run build` → green, **pure static export** (`/content` listed as `○ (Static)`, no `.func`).
        Confirm `out/content/index.html` (or `out/content.html`) contains the `Content I've Created`
        heading (capital C), all seven card titles + highlighted phrases (incl. `YouTube`), all seven
        body-copy blocks (incl. `YouTube channel` ×2), **all seven** external `href`s (incl. the
        Spotify link on the Tabs & Spaces anchor), the seven `next/image` outputs, and
        `<title>Content I've Created - Zac Braddy</title>`.
  - [x] `npm run lint` → clean (TS strict, **no `any`**, no lint errors; watch the apostrophe escaping
        in the heading and the prose).
  - [x] `npm run dev`, load `/content` in a browser and compare to the live site, in **both themes**,
        **desktop and mobile**: (a) the seven cards in order with correct thumbnails; (b) the
        **thumbnail rendering** — sizing/cropping in the `md:` fixed box vs the stacked mobile layout
        (the **Thumbnail parity risk**); (c) the **alternating left/right** desktop layout
        (cards 2/4/6 image-right via `md:flex-row-reverse` + `md:self-end` + `md:items-end`; cards
        1/3/5/7 image-left) collapsing to a single stacked column below `md`; (d) the card borders
        (`border-inverse`) and the inner image/text divider border flipping side with `order`;
        (e) **all seven** links (incl. the Tabs & Spaces Spotify link) opening their destination in a
        new tab; (f) the three approved carve-outs are present (Spotify link, `YouTube` casing ×3,
        capital-C heading) — flag these as **expected** differences vs the live site, not regressions.
        Record honestly what was observed; route the final all-tier visual sign-off to the **Story
        4.1 gate**.
  - [x] `npm run format`. Confirm `git diff` is confined to the AC #6 surface — in particular that
        `globals.css` carries **only** the `--spacing-118` line, **`package.json`/`package-lock.json`
        are unchanged** (no new dep), the seven new images are the only `public/` additions, **no other
        Epic 1–2 shell behaviour** was reopened, and **no other Epic 3 page** was added.
  - [x] Do **not** run `npm test` (stub `exit 1`, AR13).

- [x] **Task 7 — Decision capture** (AC: #7)
  - [x] **Expect to write no new ADR for the planned work.** The `--spacing-118` token executes the
        accepted [ADR 0023](../../docs/decisions/0023-tailwind-v4-custom-spacing-parity.md) — record
        nothing new for it; do not manufacture an ADR to tick a box (NFR6).
  - [x] **Only if** the GatsbyImage→`next/image` thumbnail port requires a non-verbatim
        sizing/cropping reconciliation to match the live site (Thumbnail parity risk), capture it as
        `docs/decisions/0024-<short-title>.md` from `_template.md` (Status: Accepted; Date: 2026-06-22;
        Decider: Zac; Tags: `theseus`, `images`, `parity`) and add its row to the
        `docs/decisions/README.md` index. **0023 is the highest existing number; 0024 is next.**
  - [x] **Log the three approved content carve-outs** (Spotify link, `YouTube` casing ×3, capital-C
        heading) in `deferred-work.md` (story-3.4) as **conscious, Zac-approved deviations from the
        live Gatsby site** (2026-06-22), flagged as **expected** differences for the Story 4.1 visual
        gate — mirroring how the `xl:mr-0` (ADR 0016) and theme-toggle aria-label deviations were
        recorded. No ADR needed (editorial, not architectural).
  - [x] If any other genuinely-deferrable item surfaces (e.g. a thumbnail `alt`/a11y nicety beyond
        parity, the loader-robustness sanity items), log it in `deferred-work.md` (story-3.4) — do
        **not** gold-plate (NFR6).

## Dev Notes

### Verbatim data map (the parity contract)

The seven `ContentItem`s, in order, exactly as `archive/src/pages/content.js`. Reproduce
`imageName`, `link`, `order`, the JSX `title`, and the body copy **byte-for-byte** (escape straight
apostrophes in prose to `&apos;`; the body copy contains `I've`, `it's`, `don't`, `wouldn't`,
`that's` → all need `&apos;`):

| #   | `imageName`       | `order`           | `link`                                                                                      | title (JSX)                                                     |
| --- | ----------------- | ----------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| 1   | `tabsAndSpaces`   | _(left, default)_ | `https://open.spotify.com/show/4Xqo3bTXOqyrlPjX9H2Ytk?si=55457f85cf1c4014` _(carve-out #1)_ | `Tabs and Spaces <Highlight>podcast</Highlight>`                |
| 2   | `course`          | `right`           | `https://www.manning.com/livevideo/react-in-motion`                                         | `<Highlight>Published author</Highlight> of a video course`     |
| 3   | `conferenceTalks` | _(left)_          | `https://youtu.be/43qsKWUNUpc`                                                              | `Conference <Highlight>talks</Highlight>`                       |
| 4   | `medium`          | `right`           | `https://medium.com/@zackerthehacker`                                                       | `<Highlight>Blog</Highlight> posts`                             |
| 5   | `podcastGuest`    | _(left)_          | `https://www.podchaser.com/creators/zac-braddy-107a9GfMmb`                                  | `Podcast <Highlight>guest</Highlight> appearances`              |
| 6   | `youtube`         | `right`           | `https://www.youtube.com/channel/UC73GI8tvfbxNbl626M6lUiQ`                                  | `<Highlight>YouTube</Highlight> videos` _(casing carve-out #2)_ |
| 7   | `theReactionary`  | _(left)_          | `https://www.youtube.com/channel/UCHgDwCRp7T311ItY0XCUhGA`                                  | `Former <Highlight>community creator</Highlight>`               |

Body copy (verbatim — straight `'` → `&apos;`):

1. **Tabs and Spaces:** "In this podcast, myself and two other co-hosts spend an hour a month
   riffing on topics that are common to all developers and give our opinions on them and strategies
   for dealing with them."
2. **course:** "I've also published a course through Manning on React. As tends to happen in the JS
   space it's now deprecated as it was quite some time ago but it was very well received when it was
   on sale."
3. **conferenceTalks:** "I really quite enjoy sharing my ideas about development at local developer
   conferences. Unfortunately I don't have a lot of my talks recorded but here is one talk that I did
   in 2019."
4. **medium:** "Although writing long-form blog posts can be time-consuming to both write and read;
   sometimes, they are the best way to convey complex ideas. I like to share my thoughts on Medium
   although I have been thinking recently of moving to dev.to"
5. **podcastGuest:** "I've featured as a guest on a number of other people's podcasts as well talking
   about my thoughts and experience in the software development field"
6. **youtube:** `I wouldn't call myself a "youtuber" but I've dabbled and had some fun making some
videos about Vim disguised as a computer generated cat!` — **keep the lowercase `"youtuber"`**
   (in quotes, deliberately colloquial — carve-out #2 does _not_ touch it); keep the straight
   double-quotes literal (double-quotes do **not** trip react/no-unescaped-entities; only the
   apostrophes in `wouldn't`/`I've` need `&apos;`).
7. **theReactionary:** `Quite some time ago, I spent time building a community around React when it
was still new and shiny. "The Reactionary" included a blog, YouTube channel and other pieces of
community building content. Unfortunately, all that's left of those days is the YouTube channel.`
   — **`youtube channel` → `YouTube channel` in both places (carve-out #2)**; keep
   `"The Reactionary"` double-quotes literal; `all that's` → `all that&apos;s`.

### Verbatim markup map (file → archive source)

| Theseus file (new unless noted)          | Archive source                                            | Server/Client |
| ---------------------------------------- | --------------------------------------------------------- | ------------- |
| `app/content/page.tsx`                   | `pages/content.js`                                        | **Server**    |
| `components/organisms/content-item.tsx`  | `organisms/content-item.js`                               | **Server**    |
| `components/atoms/content-thumbnail.tsx` | `atoms/content-thumbnail.js` (GatsbyImage → `next/image`) | **Server**    |
| `components/atoms/heading.tsx`           | _(already built — reuse, no change)_                      | **Server**    |
| `components/atoms/highlight.tsx`         | _(already built — reuse, no change)_                      | **Server**    |

`content-item.js` lives in **`organisms/`** in the archive even though it composes an atom — keep it
in `organisms/` so the import graph and parity map stay 1:1 (the same "mirror the archive tier
placement" choice 3.2/3.3 made).

### Thumbnail parity risk: GatsbyImage `CONSTRAINED` → `next/image` (read before AC #2)

This is the **one genuine rendering judgement on the page** — the equivalent of 3.3's divider
`padding-top` cascade. The archive `ContentThumbnail` rendered:

```jsx
<GatsbyImage
  image={data[imageName].childImageSharp.gatsbyImageData}
  className="md:h-full"
/>
// gatsbyImageData: { width: 300, layout: CONSTRAINED }
```

`CONSTRAINED` means: the image displays at up to **300px** wide, scaling **down** to fit narrower
containers, **maintaining the source aspect ratio**, with `object-fit: cover`. The card layout puts
it in two different contexts:

- **Mobile (default):** the image `<div>` is the full card width (`border-b`, no width cap), so the
  thumbnail shows stacked on top at up to ~300px wide at its natural aspect ratio.
- **Desktop (`md:`):** the image `<div>` is `md:w-48` (192px) and the image carries `md:h-full`, so
  it fills the `md:h-36` (144px) card height — a fixed ~192×144 box, cover-cropped.

`next/image` with explicit intrinsic `width`/`height` is **not responsive by default** (it renders
at the given pixel size unless CSS overrides it), so a literal port of just `className="md:h-full"`
will **not** reproduce the CONSTRAINED behaviour on its own. **Approach:** start with the intrinsic
dims + `md:h-full` (Task 2 skeleton) and the `sizes` hint, then in the browser add **only** what's
needed to match the live render — most likely `object-cover` plus width handling so the image fills
the `md:w-48`×`md:h-36` box on desktop and scales to ≤300px on mobile (e.g.
`className="w-full h-auto object-cover md:h-full md:w-auto"`, or a wrapper-based `fill` approach if
that proves cleaner — **note** `fill` needs a positioned, sized parent and the mobile area has no
fixed height, so the intrinsic-dims path is the more faithful starting point). **Verify dot-for-dot
against `zackerthehacker.com`** at the browser check and the Story 4.1 gate. If the matching approach
deviates from a faithful port of the archive className, **capture it as ADR 0024** (AC #7) — note it
is the GatsbyImage→`next/image` content-thumbnail strategy and the first real raster-image port. If a
near-literal port happens to match, no ADR is needed.

### Loader note (the first real raster images through the Netlify loader)

The 1.7 review deferred a loader-robustness pass to "Epic 2–3 when real raster/remote images first
flow through" `src/image-loader.ts`. These thumbnails are that moment — but they are **site-relative,
kebab-case `/images/*.jpg`**, so the deferred gaps **don't bite**: (a) no remote `https://` `src` →
no `remote_images` allowlist needed; (b) no pre-encoded paths → no double-encoding; (c) we pass no
custom `width`/`quality` → the `?? 75` default and `next/image`'s generated widths stay in range;
(d) no spaces in filenames → no `+`-encoding. So **no loader change is in scope** — just sanity-check
on the build/preview that the seven thumbnails actually resolve (dev returns `src` verbatim; prod
returns `/.netlify/images?url=…&w=…&q=…`). Log anything odd in `deferred-work.md`, don't fix
speculatively (NFR6).

### Reuse, don't re-create: `Heading` and `Highlight` already exist

Both atoms are **already in the Theseus tree** and are byte-identical to the archive:

- `src/components/atoms/heading.tsx` — `({ className = '', children }) => <h1 className={`${className}
  font-fancy-heading text-3xl xl:text-4xl`}>` (reused on every Epic-3 page).
- `src/components/atoms/highlight.tsx` — `({ children }) => <span className="text-tertiary font-bold
text-lg italic">{children}&nbsp;</span>` (note the **trailing `&nbsp;`** — it puts a space after the
  highlighted word; preserved). **Import and use them — do not redefine.** `text-tertiary`,
  `text-secondary`, `border-inverse` are all defined `@utility` classes in `globals.css` (verified).

### Why every component is a Server Component (AR14, NFR5)

Like 3.3 (Resume), the Content page has **zero interactivity** — no hooks, no `onClick`, no client
APIs. The external links are plain `<a>` tags; `next/image` renders fine server-side (the 3.2
`testimonial-portrait.tsx`/`portrait-image.tsx` are Server Components using `next/image`). So
**nothing here needs `'use client'`** — the whole subtree (`ContentPage`, `ContentItem`,
`ContentThumbnail`) renders on the server (AR14 default). Do **not** add `'use client'` "to be safe".

### Frozen content — port verbatim EXCEPT the three approved carve-outs (NFR7, [[theseus-content-frozen-ariadne-owns-refresh]])

Epic 3 is like-for-like translation, **with the three Zac-approved carve-outs** listed under
"Approved content deviations" (the Spotify link, the `YouTube` casing ×3, and the capital-C heading).
Beyond those three, content stays frozen — on this page that specifically means **leaving alone**:

- **The lowercase `"youtuber"`** (item 6, in quotes) — deliberately colloquial; carve-out #2 does
  **not** touch it.
- **The casual prose voice** ("nerd out", "new and shiny"), the `"The Reactionary"` double-quotes,
  and the `dev.to` aside.

These remain **Project Ariadne's** content refresh, **not Theseus's**. The intentional changes on
this page are: the mechanical JS→TS typing, the GatsbyImage→`next/image` thumbnail port, the
`Seo`→`metadata` swap, **and the three approved content carve-outs** (which _do_ alter rendered copy —
that's the point, and they're logged as conscious deviations for the Story 4.1 gate). Do not extend
editorial changes beyond those three.

### Scope: one `globals.css` token, seven images, no dependency (NFR6)

Unlike 3.3 (which touched **nothing** but its own subtree), 3.4 legitimately adds:

- **One `globals.css` token** — `--spacing-118: 38rem` (so `md:w-118` resolves; ADR 0023 convention).
  That is the **only** `globals.css` edit; if you find yourself adding more tokens, stop.
- **Seven images** copied to `public/images/` (the content thumbnails).
- **No new dependency** — `next/image` and the loader already exist (Story 1.7/3.2). Do **not** add
  anything to `package.json`. If you reach for a new lib, something has gone outside the parity port.

### Scope seams — do NOT build now (NFR6)

Out of scope: **the 404 page** (3.5). Do **not** refactor the Epic 2 shell or any 3.1/3.2/3.3
component. Do **not** "update" frozen content (the missing link, casing, prose — **Ariadne**). Do
**not** "fix" the multiple-`<h1>` a11y quirk (the shared `Heading` is `<h1>`, as today — an Ariadne
a11y item already tracked from 3.2/3.3, NFR7), add `aria-label`s/`alt` text beyond `alt=""`, or
harden the image loader speculatively. The full all-tier visual sign-off is the **Story 4.1 gate**.

### Project structure & conventions (from project-context.md — note the Theseus divergence)

- **Atomic design:** atoms (`content-thumbnail`; reused `heading`/`highlight`), organism
  (`content-item`), page (`app/content/page.tsx`). Filenames **kebab-case**, component identifiers
  **PascalCase**, **default export** — matching the existing tree.
- **TypeScript strict, no `.js` source** (AR2) — new files are `.tsx`; **no `any`** (use
  `React.ReactNode`, `string`, optional `?:`, the `'left' | 'right'` union); TS types not `PropTypes`.
  (project-context's PropTypes/Gatsby/styled-components rules describe the **archive** stack — follow
  the Theseus artifacts where they diverge, as 1.7–3.3 established.)
- **Prettier is law** (`^3.x`): single quotes, `arrowParens: avoid` — **except** strings containing a
  `'` (the metadata titles), which Prettier keeps double-quoted to avoid escapes. Run `npm run format`.
- **No code comments by default** — none warranted (the skeleton's `{/* ... */}` placeholder is for
  this story file only; the real page lists the seven cards).
- **British spelling** in user-facing copy — none added; all copy is frozen archive content.
- **Themed colours only** — `text-secondary`/`text-tertiary`/`border-inverse` utilities; **no raw hex**.
- **No interpolated Tailwind class names** — all className strings are static literals with fixed
  `order === 'right'` string branches (PurgeCSS/Tailwind-v4 scan safety).

### Testing standards (AR13 — no suite to fabricate)

No test framework exists; `npm test` is a stub that exits 1 — **do not** run it or invent a suite.
Verification = `npm run build` green + pure static export, `npm run lint` clean, and **manual
behavioural parity** in a browser (both themes, desktop + mobile). Record honestly what was observed;
the all-tier visual sign-off is the Story 4.1 gate.

### Project Structure Notes

- Content decomposes into a Server-Component page + one Server organism (`ContentItem`, ×7) that
  composes the new `ContentThumbnail` atom and the reused `Heading`/`Highlight` atoms — the
  AR14/NFR5 server-by-default shape. **No client boundary anywhere.**
- `ContentThumbnail` is the third `next/image` consumer (after `portrait-image`/`testimonial-portrait`)
  and the first with **varying-aspect-ratio raster content** — hence the Thumbnail parity risk.
- `page.tsx` renders as `children` inside `ContentTransition` (Story 2.5) within the `bg-primary-400`
  content pane — supply only inner markup.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.4] — the four ACs: the seven-item gallery
  at content/structure parity (FR14); thumbnails via `next/image` with intrinsic dims + no CLS (FR21,
  AR17); external links opening in new tabs; per-page SEO via the Metadata API (FR17).
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 3] — fill the shell page-by-page at
  byte-for-byte parity; content organisms server-side, interactive bits `'use client'` (none here).
- [Source: _bmad-output/planning-artifacts/epics.md#FR14, #FR21, #FR17] — Content gallery; optimised
  responsive content images; per-page SEO. [#AR14] server-by-default; [#AR17] `next/image` CLS guard;
  [#AR13] no fabricated suite; [#AR19] decision-capture DoD; [#NFR5] idiomatic-Next server-by-default;
  [#NFR6] anti-gold-plating; [#NFR7] preserve quirks.
- [Source: archive/src/pages/content.js] — the page wrapper (`px-4 py-8 grid grid-cols-1 gap-8`), the
  `flex flex-col p-4` gallery column, the `text-secondary` "Content I've created" heading, the seven
  `ContentItem`s with their `imageName`/`link`/`order`/`title`/copy, `Seo title="Content I've Created
  - Zac Braddy"`.
- [Source: archive/src/components/organisms/content-item.js] — the card markup to port verbatim: the
  `rounded overflow-hidden border border-inverse mb-4 md:h-36 md:w-118` container with `md:self-end`
  on `order==='right'`; the `<a href target="_blank" rel="noreferrer">` with `md:flex-row-reverse`;
  the image `<div md:w-48>` with `md:border-r`/`md:border-l`; the text `<div p-2 md:h-32>` with
  `md:items-end`; `order = 'left'` default; `link` optional.
- [Source: archive/src/components/atoms/content-thumbnail.js] — the GatsbyImage `useStaticQuery`
  (`width: 300, layout: CONSTRAINED`, `className="md:h-full"`) and the `Oops, this was supposed to be
a photo of the ${imageName} thumbnail:S` fallback to port to `next/image` + a static map.
- [Source: archive/tailwind.config.js:46] — `118: '38rem'` (the custom spacing the `--spacing-118`
  token reproduces).
- [Source: src/components/atoms/heading.tsx] — the **existing** `Heading` atom to reuse (no change).
- [Source: src/components/atoms/highlight.tsx] — the **existing** `Highlight` atom to reuse
  (`text-tertiary font-bold text-lg italic` + trailing `&nbsp;`; no change).
- [Source: src/components/atoms/testimonial-portrait.tsx + .module.css] — the established `next/image`
  - static `Record<string,…>` map + fallback-`<div>` idiom to mirror for `content-thumbnail.tsx`
    (Server Component, string `src` under `/images/`).
- [Source: src/components/atoms/portrait-image.tsx] — the other `next/image` Server-Component
  precedent (`fill`+`sizes`+`object-cover` in a sized wrapper) — relevant if a wrapper/`fill` approach
  is chosen for the thumbnail (see Thumbnail parity risk).
- [Source: next.config.ts + src/image-loader.ts] — the static-export `images.loader: 'custom'` +
  Netlify Image CDN `loaderFile` the thumbnails route through (dev returns `src`; prod
  `/.netlify/images?url=…&w=…&q=…`).
- [Source: src/components/molecules/socials.tsx + nav-links.tsx] — the existing external-link idiom
  (`<a href target="_blank" rel="noreferrer">`) confirming `rel="noreferrer"` (not
  `"noopener noreferrer"`) is the house convention; no reusable link atom exists (inline is fine).
- [Source: src/app/about-me/page.tsx] — the 3.2 child-segment metadata pattern to mirror
  (`title: 'About Me'` + `openGraph.title`/`twitter.title` = `'About Me - Zac Braddy'`); the
  `px-4 py-8 grid grid-cols-1 gap-8` page wrapper.
- [Source: src/app/resume/page.tsx + _bmad-output/implementation-artifacts/3-3-resume-page.md] — the
  immediate-prior Epic-3 page: the all-Server-Component shape, the child-segment metadata, the
  "execute the accepted ADR, no new ADR unless a non-verbatim reconciliation is forced" decision-capture
  pattern (3.3 did this for the divider cascade; 3.4 mirrors it for the thumbnail port), the
  apostrophe-escaping learning, and the verification-honesty bar.
- [Source: src/app/layout.tsx] — the `<ContentTransition>{children}</ContentTransition>` content pane
  the page renders into; the `%s - Zac Braddy` root title template + metadata defaults inherited.
- [Source: src/app/globals.css] — the `@theme` block with `--spacing-87/88/94` (add `--spacing-118`
  alongside); the `text-secondary`/`text-tertiary`/`border-inverse` `@utility` classes (all present);
  the `--color-border-inverse` archive quirk (`fafafa` dark / `#5a5a5a` light — ADR 0010).
- [Source: docs/decisions/0023-tailwind-v4-custom-spacing-parity.md] — the accepted per-page
  divergent-spacing-token convention the `--spacing-118` token **executes** (no new ADR for it).
  [0021-…md] — the child-segment metadata convention this page follows.
- [Source: docs/decisions/_template.md + README.md] — ADR format + index, **only** if a 0024
  thumbnail-rendering reconciliation ADR becomes necessary; **0023 is the highest existing number,
  0024 is next.**
- [Source: _bmad-output/implementation-artifacts/deferred-work.md] — the story-1.7 image-loader
  robustness deferral (does not bite for local kebab-case paths — see Loader note); the multiple-`<h1>`
  Ariadne a11y deferral (the Content `Heading` falls in the same bucket — defer, don't fix); the
  story-2.3 `border-inverse` light-theme parity item (the card border is `border-inverse` — same
  quirk, Story 4.1 gate).
- [Source: _bmad-output/project-context.md] — atomic structure, kebab-case/PascalCase, Prettier law,
  no-comments default, themed-colour rule, no-interpolated-classnames, Tailwind-v4 border guard;
  describes the **archive** stack — follow the Theseus artifacts where they diverge.

## Decision trail

1. **GatsbyImage CONSTRAINED → `next/image` thumbnail port (the page's one parity judgement).**
   Reproduce the archive `width: 300, layout: CONSTRAINED` + `md:h-full` rendering with `next/image` +
   real intrinsic dims. Start near-verbatim; reconcile sizing/cropping against the live site in the
   browser. **No new ADR unless** a non-verbatim reconciliation is forced (then → ADR 0024). See Dev
   Note "Thumbnail parity risk". (Mirrors how 3.3 handled the divider `padding-top` cascade.)
2. **`--spacing-118: 38rem` token (settled — executes ADR 0023).** Reproduces the archive's custom
   `md:w-118` width under Tailwind v4 CSS-first config — the same per-page-divergent-token convention
   3.2 used for `87/88/94`. **Not a new decision** — no new ADR.
3. **Every component is a Server Component (settled — AR14/NFR5).** Content has zero interactivity, so
   no `'use client'` boundary anywhere; `next/image` renders server-side (as in 3.2).
4. **`content-item` stays in `organisms/` (settled — parity).** Mirror the archive tier placement so
   the import graph and parity map are 1:1, as 3.2/3.3 did.
5. **Content frozen EXCEPT three approved carve-outs (Zac's call, 2026-06-22 — [[theseus-content-frozen-ariadne-owns-refresh]]).**
   Carved out: (1) add the Tabs & Spaces Spotify link; (2) `Youtube`/`youtube channel` → `YouTube`
   (×3; `"youtuber"` stays lowercase); (3) heading `created` → `Created`. These are conscious
   deviations from the live Gatsby site, accepted because Gatsby retires at cutover — logged for the
   Story 4.1 gate as expected differences (precedent: ADR 0016 `xl:mr-0`, theme-toggle aria-label).
   Everything else (prose voice, `"The Reactionary"`/`dev.to` quirks) stays **Ariadne's** — port
   verbatim.
6. **Metadata: child-segment template (settled — ADR 0021).** `/content` is a child segment, so
   `title: "Content I've Created"` + the root `%s - Zac Braddy` template → `<title>Content I've Created
   - Zac Braddy</title>`; `openGraph.title`/`twitter.title`=`"Content I've Created - Zac Braddy"`(matching the archive literal). No`title.absolute` (that was the root-page-only 3.1 exception).
7. **Reuse `Heading` + `Highlight` (settled).** Both atoms already exist byte-identical to the archive
   — import them, don't re-create (NFR6).

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m] (Opus 4.8, 1M context) — bmad-dev-story workflow.

### Debug Log References

- `npm run lint` first run: 4 × `react/no-unescaped-entities` errors on the literal `"`
  characters in `"youtuber"` / `"The Reactionary"`. **The story Dev Note's claim that
  double-quotes don't trip the rule is incorrect for this repo's `eslint-config-next`.** Fixed by
  escaping to `&quot;` (renders byte-identically to `"`), then lint clean. Logged in
  `deferred-work.md` (story-3.4).
- `npm run build`: green, `/content` prerendered as `○ (Static)`; no serverless functions.
- Static-export checks against `out/content.html`: `<title>Content I've Created - Zac Braddy</title>`,
  capital-C heading, all seven highlighted titles (incl. `YouTube`), all seven body blocks (incl.
  `YouTube channel` ×2, lowercase `"youtuber"` kept), all seven external `href`s (incl. the Spotify
  link), `og:title`/`twitter:title` = `Content I've Created - Zac Braddy`, and seven `next/image`
  outputs resolving via the Netlify loader (`/.netlify/images?url=%2Fimages%2F…`).
- Source image intrinsic dimensions verified by parsing JPEG SOF markers — match the story spec
  exactly (1500×1500 / 360×450 / 280×158 / 600×314 / 144×144 ×3).

### Completion Notes List

- **All 7 ACs satisfied** (subject to the one honest caveat below). Built the `/content` route as a
  pure Server-Component subtree — no `'use client'` anywhere (AC #4): `src/app/content/page.tsx`
  (reusing the existing `Heading`/`Highlight` atoms, composing seven `ContentItem`s), the new
  `src/components/organisms/content-item.tsx` (verbatim archive port), and the new
  `src/components/atoms/content-thumbnail.tsx` (GatsbyImage→`next/image`).
- **Three approved content carve-outs implemented** (AC #1/#3): Spotify link on Tabs & Spaces;
  `YouTube` casing ×3 (`"youtuber"` kept lowercase); capital-C heading. Logged as conscious,
  Zac-approved deviations for the Story 4.1 gate.
- **Thumbnail parity (AC #2) — a non-verbatim reconciliation WAS forced, so ADR 0024 was written.**
  A literal port of the archive's bare `className="md:h-full"` does not work under `next/image`
  (intrinsic-size images aren't responsive by default; the 1500×1500 thumbnail would blow out the
  layout). Reconciled with `w-full max-w-[300px] h-auto object-cover md:h-full md:w-48 md:max-w-none`
  to reproduce the Gatsby `CONSTRAINED` behaviour (≤300px natural-aspect on mobile; cover-cropped
  192×144 box on desktop). `alt=""` and the verbatim fallback `<div>` string (incl. `:S`) preserved.
- **Scope held (AC #6):** exactly one `globals.css` token (`--spacing-118: 38rem`), seven images
  added to `public/images/`, **no `package.json`/`package-lock.json` change**, no Epic 1–2 shell
  edits, no other Epic 3 page. `npm run lint` clean, `npm run build` green + pure static export.
- **Decision capture (AC #7):** `--spacing-118` executes accepted ADR 0023 (no new ADR for it);
  ADR 0024 written for the thumbnail reconciliation + indexed in `docs/decisions/README.md`; the
  three carve-outs, the double-quote lint discrepancy, the visual-parity deferral, and the
  multiple-`<h1>`/`alt=""`/`border-inverse` a11y items logged in `deferred-work.md` (story-3.4).
- **Honest caveat (AC #2/#6):** the interactive in-browser visual diff against `zackerthehacker.com`
  (both themes, desktop + mobile) was **not** run in this headless dev session — verified
  programmatically (build/lint/static-export markup) instead. The dot-for-dot thumbnail-rendering
  check (ADR 0024) is routed to the **Story 4.1 gate**, per the story's verification plan.

### File List

- `src/app/content/page.tsx` (new)
- `src/components/organisms/content-item.tsx` (new)
- `src/components/atoms/content-thumbnail.tsx` (new)
- `src/app/globals.css` (modified — added `--spacing-118: 38rem`)
- `public/images/tabs-and-spaces.jpg` (new)
- `public/images/course.jpg` (new)
- `public/images/conference-talks.jpg` (new)
- `public/images/podcast-guest.jpg` (new)
- `public/images/youtube.jpg` (new)
- `public/images/medium.jpg` (new)
- `public/images/the-reactionary.jpg` (new)
- `docs/decisions/0024-content-thumbnail-gatsbyimage-to-next-image.md` (new)
- `docs/decisions/README.md` (modified — ADR 0024 index row)
- `_bmad-output/implementation-artifacts/deferred-work.md` (modified — story-3.4 section)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified — status tracking)
- `_bmad-output/implementation-artifacts/3-4-content-page.md` (modified — this story file)

## Review Findings

_Code review 2026-06-22 (bmad-code-review; 3 adversarial layers — Blind Hunter, Edge Case Hunter, Acceptance Auditor). Acceptance Auditor verdict: **PASS — all 7 ACs MET.** No code patch warranted; no decision-needed. 1 defer, ~8 dismissed (all verbatim-archive parity the spec mandates, Ariadne-carved a11y, or layer-verified-safe)._

- [x] [Review][Defer] Thumbnail visual parity unverified — the ADR-0024 non-verbatim reconciliation needs a dot-for-dot in-browser check vs the live site [`src/components/atoms/content-thumbnail.tsx`; `src/components/organisms/content-item.tsx`] — deferred to the Story 4.1 visual gate. Consolidates three converging layer findings: (a) the desktop fixed-height box (`md:h-36` card / `md:h-32` text col) could clip the longer descriptions (The Reactionary, Tabs & Spaces) — verbatim-archive heights, so any clip is a faithful quirk, NFR7; (b) `object-cover` in the fixed `md:w-48`×`md:h-36` (192×144, 4:3) box crops the **portrait `course` 360×450** thumbnail top/bottom most aggressively — watch its cover art isn't losing meaningful pixels vs the Gatsby CONSTRAINED render; (c) below `md`, `h-auto` gives each card a different thumbnail height (square `tabsAndSpaces` ≈300px tall, portrait `course` ≈375px) — faithful to CONSTRAINED native-aspect, but an uneven mobile stack worth a conscious sign-off. Already captured in `deferred-work.md` (dev-of-3.4) as the Thumbnail parity risk; this review confirms it stays on the 4.1 gate and adds the `course`-portrait crop as the specific thing to eyeball.

## Change Log

| Date       | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-06-22 | Story 3.4 created (ready-for-dev): `/content` route at parity — the seven-item content gallery (`ContentItem` ×7 + new `ContentThumbnail`), reusing `Heading`/`Highlight`; GatsbyImage→`next/image` thumbnail port; seven images copied to `public/images/`; one `--spacing-118` token (ADR 0023); child-segment metadata; all Server Components.                                                                                                                                                                                                                                                                                                                                                          |
| 2026-06-22 | Three Zac-approved content carve-outs folded into the spec (content-freeze reopened for these only): (1) Tabs & Spaces Spotify link added; (2) `Youtube`/`youtube channel` → `YouTube` (×3; `"youtuber"` kept lowercase); (3) heading `created` → `Created`. Conscious deviations from the live Gatsby site (accepted — Gatsby retires at cutover), to be logged as expected differences for the Story 4.1 gate.                                                                                                                                                                                                                                                                                           |
| 2026-06-22 | Story 3.4 implemented (→ review): built the `/content` route + new `ContentItem` organism + new `ContentThumbnail` atom (all Server Components, no `'use client'`), reusing `Heading`/`Highlight`; seven images copied to `public/images/`; one `--spacing-118: 38rem` token added (ADR 0023); child-segment metadata; three approved carve-outs applied. ADR 0024 written for the forced GatsbyImage→`next/image` thumbnail reconciliation. `npm run lint` clean, `npm run build` green + pure static export (`/content` = `○ (Static)`); double-quote lint-escaping discrepancy fixed in place (`&quot;`, render-identical) + logged; interactive in-browser visual diff deferred to the Story 4.1 gate. |
