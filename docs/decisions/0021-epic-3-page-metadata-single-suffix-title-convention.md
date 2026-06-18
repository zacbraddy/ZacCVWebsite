# 0021 — Epic 3 per-page metadata convention (single-suffix title)

- **Status:** Accepted
- **Date:** 2026-06-17
- **Decider:** Zac (We Right Code)
- **Tags:** theseus, metadata, seo

## Context

Epic 3 ports the content pages to byte-for-byte parity with the live Gatsby site. The archive
`Seo` component (`archive/src/components/seo.js`) renders
`<Helmet title={seo.title} titleTemplate="%s - Zac Braddy">`, and **every page passed the
already-suffixed full string** as its title (home: `"Home - Zac Braddy"`). react-helmet then
applies the template to that, so the live `<title>` is **`Home - Zac Braddy - Zac Braddy`** — a
doubled suffix on every page. The Theseus root layout (Story 1.6) already defines
`title.template = '%s - Zac Braddy'`, so a per-page convention is needed for how Epic 3 pages
set their titles and social tags.

## Decision

Epic 3 pages export `title: '<Page>'` and rely on the root `%s - Zac Braddy` template, producing
a **single**-suffix `<title>` (e.g. `<title>About - Zac Braddy</title>`). We consciously do **not**
reproduce the archive's doubled `<title>` — it is an obvious, unintended bug, so we ship the
clearly-intended single suffix, per the standing "fix obvious bugs, don't port verbatim"
principle.

**Root-page exception (Next.js 16 behaviour).** `title.template` applies to **child** route
segments, **not** the segment where it is defined. The home page (`app/page.tsx`) is in the
**same** root segment as the root layout (`app/layout.tsx`), so the template does **not** apply to
it — `title: 'Home'` would render as a bare `<title>Home</title>`. To still ship the intended
single-suffix title, the home page sets the absolute title directly:
`title: { absolute: 'Home - Zac Braddy' }`. Pages 3.2–3.5 live at their own child segments
(`/about`, `/resume`, …) where the template **does** apply, so they keep the
`title: '<Page>'`-plus-template form. Net effect is identical (`<Page> - Zac Braddy`), single
suffix, on every page.

For social tags, per-page `openGraph.title` and `twitter.title` are set to the full
`'<Page> - Zac Braddy'`, matching the archive's per-page `og:title`/`twitter:title` (react-helmet
does **not** apply the title template to meta tags, so the archive emitted the raw page string
there). Description, OG image, the `summary_large_image` Twitter card, and the favicon are
**inherited** from the already-correct root-layout defaults (Story 1.6) — they are not
re-declared per page.

Additionally, the home page's job-title list moves from inline-in-`index.js` to
`config.JOB_TITLES` in `src/config/index.ts` (config indirection), with the first entry
referencing the existing `JOB_TITLE` to avoid duplication.

## Consequences

- All Epic 3 pages (3.2 About Me, 3.3 Resume, 3.4 Content, 3.5 404) follow the same shape:
  `title: '<Page>'` (or `{ absolute: '<Page> - Zac Braddy' }` for any further same-segment-as-root
  page), `openGraph.title`/`twitter.title` = `'<Page> - Zac Braddy'`, inherit the
  rest from root defaults. The decision is captured once here rather than per page.
- The shipped `<title>` deliberately differs from the live site's doubled suffix — a narrow,
  intentional step off strict-verbatim parity, recorded so the Story 4.1 visual sign-off and the
  Story 4.3 collation find it documented rather than as an unexplained delta.

## Alternatives considered

- **Reproduce the doubled suffix for literal parity** — rejected: the parity bar is the site's
  _intended_ appearance, and a doubled `<title>` is plainly an accident, not a design choice.
