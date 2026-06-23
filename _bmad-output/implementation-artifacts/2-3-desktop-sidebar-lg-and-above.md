---
baseline_commit: 7350c441c9f85be6ad3a503fd6a9359488841e8e
---

# Story 2.3: Desktop sidebar (`lg` and above)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a desktop visitor,
I want the left sidebar with Zac's portrait, identity, socials, and navigation,
so that the desktop layout is identical to the current site.

## Context & purpose (read first)

This is the **third story of Epic 2** (Persistent App Shell & Navigation). It fills the
**identity seam** that Stories 2.1 and 2.2 deliberately left empty.

- **Story 2.1** built the structural frame in `src/app/layout.tsx`: `<main>` → centred
  animated container → the `${styles.hero}` **sidebar container** (a `lg:grid lg:grid-rows-2`
  two-row grid) + the content pane.
- **Story 2.2** mounted the shared `<NavLinks />` into the sidebar container's `<nav>` —
  which occupies **row 2** of that grid — rendered `hidden lg:flex` (desktop only). It
  **explicitly deferred** the identity grid (portrait/name/job-title/socials) to **this story**
  and told you _"leave that seam empty; just add the `<nav>`"_, with the identity grid slotting
  **above** the `<nav>` (archive order: identity grid first, then `<nav>`).

**2.3's job:** build **row 1** of the sidebar grid — the identity block — by porting three
archive pieces and mounting them above the existing `<nav>`:

| Piece                                   | Archive source                                                     | Theseus target (new)                                        |
| --------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------- |
| Portrait (`next/image`)                 | `archive/src/components/atoms/portrait-image.js` (+ `.module.css`) | `src/components/atoms/portrait-image.tsx` (+ `.module.css`) |
| Socials (Twitter/LinkedIn/GitHub)       | `archive/src/components/molecules/socials.js`                      | `src/components/molecules/socials.tsx`                      |
| Job-title config value                  | `archive/src/config/index.js` (`JOB_TITLE`)                        | `src/config/index.ts`                                       |
| Identity grid markup (name + the above) | `archive/src/components/layout.js:94–103`                          | inserted into `src/app/layout.tsx`                          |

And it **composes the existing shared nav** from 2.2 — it does **not** redefine it (the nav is
already mounted in row 2; you are adding row 1 above it).

**Two things this story is the _first_ to do — read the Dev Notes on each:**

1. **It adds one new runtime dependency** — `@fortawesome/free-brands-svg-icons` (the
   Twitter/LinkedIn/GitHub _brand_ marks are **not** in the already-installed `free-solid`/
   `free-regular` packages). This is a justified, version-aligned addition — see Dev Notes
   "New dependency" and capture it in ADR **0017**.
2. **It renders the first real raster image through `next/image` + the Netlify custom loader.**
   That brings a real **local-dev rendering caveat** and makes the **`border-inverse` token**
   visible for the first time — both flagged below. Do not skip those Dev Notes.

**The single source of visual/behavioural truth is the live site** (`zackerthehacker.com`) and
the archived Gatsby implementation. This is a **zero-regression parity port** (NFR1/NFR2):
layout, breakpoints, portrait, social links, and the desktop-only visibility must match today.

## Acceptance Criteria

1. **Desktop sidebar shows the full identity block + nav at `lg`+ (FR4).**
   **Given** a viewport at `lg` and above,
   **When** the page renders,
   **Then** the left sidebar shows, in archive order, **the portrait**, **"Zac Braddy"**, **the
   job title** (`config.JOB_TITLE` = "Contract Software Engineer"), **the social links**, and
   **the navigation** (the 2.2 `<NavLinks />`, already mounted) — with the **same layout and
   breakpoints as today** (FR4),
   **And** the identity grid is mounted as **row 1** of the `lg:grid lg:grid-rows-2` sidebar
   container in `src/app/layout.tsx`, **above** the existing `<nav>` (row 2), porting the archive
   markup `archive/src/components/layout.js:94–103` verbatim:
   `<div className="grid grid-rows-2 gap-8 lg:mt-16 xl:mt-0">` wrapping
   `<div className="w-68 flex justify-center"><PortraitImage /></div>` and
   `<div className="hidden text-lg w-68 flex-col items-center lg:flex"><div>Zac Braddy</div><div>{config.JOB_TITLE}</div><Socials /></div>`,
   **And** the **name/job-title/socials** block keeps its archive `hidden … lg:flex` visibility
   (desktop only), while the **portrait** is **not** `lg`-gated — it is visible at all widths
   (it is also the mobile header today; see Dev Notes "Mobile portrait is intentional").

2. **Portrait via `next/image`, no layout shift (FR21 portrait, AR17).**
   **Given** the portrait image,
   **When** it renders,
   **Then** it is served via **`next/image`** (not a raw `<img>`, not `GatsbyImage`), sourced
   from **`/images/zac-portrait.jpg`** (already present in `public/images/`, 400×400),
   **And** it sits inside the verbatim archive container
   `${container} w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-inverse shadow-xl`
   (the `container` class is the ported negative-margin CSS Module), producing the circular,
   bordered, shadowed portrait identical to today,
   **And** there is **no layout shift** (CLS): the fixed-size container reserves the box, so the
   image cannot reflow on load (AR17). Use `fill` + an explicit `sizes` so the loader fetches an
   appropriately-sized image — see Dev Notes "Portrait: GatsbyImage → next/image".

3. **Portrait negative-margin offsets ported verbatim (NFR1).**
   **Given** the archive `portrait-image.module.css`,
   **When** the portrait renders,
   **Then** its container's responsive negative `margin-bottom` is ported **byte-for-byte**
   (`-7rem` base, `-9.7rem` at `≥768px`, `0` at `≥1024px`) so the mobile overlap and the desktop
   reset match today exactly. Do not "tidy" or recompute these values.

4. **Social links → current URLs, open in a new tab (FR18).**
   **Given** the social profile links,
   **When** they render,
   **Then** **Twitter**, **LinkedIn**, and **GitHub** are present in archive order with their
   **current URLs verbatim** (including the LinkedIn URL's literal unicorn emoji characters),
   each with `target="_blank"` and `rel="noreferrer"`, an `aria-label` ("Twitter"/"LinkedIn"/
   "Github"), and the `FontAwesomeIcon size="lg"` brand mark (`faTwitter`/`faLinkedin`/`faGithub`
   from `@fortawesome/free-brands-svg-icons`), inside the wrapper
   `<div className="grid grid-cols-3 gap-4 mt-4">` — all ported verbatim from
   `archive/src/components/molecules/socials.js`.

5. **Composes the shared nav — does NOT redefine it (anti-reinvention, FR4).**
   **Given** the navigation built and mounted in Story 2.2,
   **When** the sidebar identity block is added,
   **Then** the existing `<nav><NavLinks /></nav>` in `layout.tsx` is **left exactly as-is**
   (row 2); this story only **adds row 1 above it** — no second nav, no re-import shuffle, no
   change to `NavLinks`/`NavLink`.

6. **Idiomatic-Next boundaries; one justified new dependency (NFR5, NFR6).**
   **Given** the Server/Client boundary discipline,
   **When** the components are built,
   **Then** `PortraitImage` and `Socials` are **Server Components** (no `'use client'` — they
   have zero interactivity; `next/image` and `FontAwesomeIcon` render server-side fine), and
   `src/app/layout.tsx` **stays a Server Component** (keeps its `metadata` export),
   **And** exactly **one** new runtime dependency is added — `@fortawesome/free-brands-svg-icons`
   at the FA-suite-aligned version (`^7.2.0`) — and **no other** (no `gatsby`, no `@reach/router`,
   no `gatsby-plugin-image`); the portrait uses the **already-configured** Netlify image loader.

7. **Build green; parity verified; scope held (NFR1/NFR2/NFR6).**
   **Given** the change,
   **When** `npm run build` and `npm run lint` are run,
   **Then** both are green (TS strict, no `any`, no lint errors) and the build stays a **pure
   static export**,
   **And** the desktop sidebar (portrait, "Zac Braddy", "Contract Software Engineer", socials,
   nav) is verified against the live site at `lg`+ in **both themes** — with the portrait's
   `border-inverse` border and the **light-theme border discrepancy** in Dev Notes checked (see
   "`border-inverse`: first render"); the **mobile** portrait header (below `lg`) is verified to
   appear with the correct negative-margin overlap,
   **And** none of the later shell pieces are built — no burger menu / `MenuOpenContext` (2.4),
   no custom scrollbar / scroll-reset (2.5), no loading spinner (2.6).

8. **Decision capture as-you-go (FR26 / AR19).**
   **Given** the cross-cutting decision-capture DoD,
   **When** the non-obvious calls in this story are made,
   **Then** they are recorded in a new ADR (next free number **0017**), indexed in
   `docs/decisions/README.md`: specifically (a) **adding `@fortawesome/free-brands-svg-icons`**
   (brand marks absent from solid/regular; canonical FA package; version-aligned with the FA
   suite introduced in ADR 0012); (b) the **portrait port** — `GatsbyImage` + `useStaticQuery`
   → `next/image` with `fill`/`sizes` through the Netlify loader, CLS controlled by the fixed
   container (AR17, AR9 data-layer removal), with the local-dev rendering caveat noted; (c)
   creating **`src/config/index.ts`** with `JOB_TITLE` (the config-indirection port deferred from
   2.2, AR9); (d) the **`border-inverse` light-theme parity discrepancy** (recorded as a known
   parity question for the Story 4.1 gate, not silently changed); and (e) the **`alt="Zac Braddy"`**
   choice (next/image requires `alt`; archive had none — a conscious, visual-diff-invisible a11y
   addition, consistent with the 1.5 aria-label call).

## Tasks / Subtasks

- [x] **Task 1 — Add the brand-icons dependency** (AC: #4, #6, #8)
  - [x] Install `@fortawesome/free-brands-svg-icons` pinned to the FA-suite version `^7.2.0`
        (matches `@fortawesome/free-solid-svg-icons` / `free-regular` / `fontawesome-svg-core`,
        all `^7.2.0`). Confirm it lands in `package.json` `dependencies` (not dev) and
        `package-lock.json` updates. This is the only new dependency in this story.
  - [x] Do **not** add any other package (no `gatsby-plugin-image`, no `react-burger-menu`,
        no `react-custom-scroll` — those are 2.4/2.5 and are never coming back from Gatsby).

- [x] **Task 2 — Create `src/config/index.ts`** (AC: #1, #6)
  - [x] Port `archive/src/config/index.js` to TypeScript: a single `JOB_TITLE: 'Contract Software
Engineer'` value. Mirror the archive's **default-export object** shape so the consumer
        reads `import config from '@/config'` → `config.JOB_TITLE` (the `@/` alias is already
        configured — see `tsconfig.json` `paths`, used throughout `layout.tsx`).
  - [x] Keep it minimal — **only** `JOB_TITLE`. Do **not** add the Home-page rotating-title list
        here (that is Story 3.1's concern; 3.1 will extend this file).

- [x] **Task 3 — Port the portrait atom** (AC: #2, #3, #6)
  - [x] Create `src/components/atoms/portrait-image.module.css` porting
        `archive/src/components/atoms/portrait-image.module.css` **byte-for-byte** (the
        `.container` negative `margin-bottom`: `-7rem`; `-9.7rem` at `@media (min-width: 768px)`;
        `0` at `@media (min-width: 1024px)`).
  - [x] Create `src/components/atoms/portrait-image.tsx` as a **Server Component** (no `'use
 client'`). Replace the Gatsby `useStaticQuery(graphql\`…\`)`+`GatsbyImage`with
`next/image`:
    - Import `Image from 'next/image'` and the CSS Module
      (`import styles from './portrait-image.module.css'`).
    - Container `div`: keep the archive classes verbatim and **add `relative`** (required by
      `next/image` `fill`): `` `${styles.container} relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-inverse shadow-xl` ``.
    - Image: `<Image src="/images/zac-portrait.jpg" alt="Zac Braddy" fill sizes="(min-width: 768px) 192px, 128px" className="object-cover" />`      —`fill`+`object-cover`reproduces GatsbyImage's CONSTRAINED fill-the-circle behaviour;
     `sizes` keeps the Netlify loader from over-fetching (display max is 192px). See Dev Notes.
  - [x] Drop the archive's `if (!data?...) return <div>Oops…</div>` fallback — it was a
        GraphQL-null guard with no `next/image` equivalent (AR9 removes the data layer).

- [x] **Task 4 — Port the socials molecule** (AC: #4, #6)
  - [x] Create `src/components/molecules/socials.tsx` as a **Server Component** porting
        `archive/src/components/molecules/socials.js` **verbatim**: the
        `<div className="grid grid-cols-3 gap-4 mt-4">` wrapper and the three `<a>`s
        (Twitter → `https://twitter.com/ZackerTheHacker`; LinkedIn →
        `https://www.linkedin.com/in/🦄-zac-braddy-🦄-17a81b22` **with the literal unicorn
        emoji preserved**; GitHub → `https://github.com/zacbraddy`), each `rel="noreferrer"
target="_blank"` with its `aria-label` and `<FontAwesomeIcon icon={…} size="lg" />`.
  - [x] Import `faTwitter, faLinkedin, faGithub` from `@fortawesome/free-brands-svg-icons`.
        Follow the FA usage already established in the repo (`theme-toggle.tsx`, `nav-link.tsx`).
        No `'use client'`, no color class (archive applies none — icons inherit `currentColor`).

- [x] **Task 5 — Mount the identity grid in the sidebar (row 1, above the `<nav>`)** (AC: #1, #5)
  - [x] In `src/app/layout.tsx`, **inside the `${styles.hero}` sidebar container**, insert the
      identity grid as the **first child**, immediately **before** the existing
      `<nav className="pt-8 …">` (which stays untouched as row 2). Port
      `archive/src/components/layout.js:94–103` verbatim:
      `tsx
  <div className="grid grid-rows-2 gap-8 lg:mt-16 xl:mt-0">
    <div className="w-68 flex justify-center">
      <PortraitImage />
    </div>
    <div className="hidden text-lg w-68 flex-col items-center lg:flex">
      <div>Zac Braddy</div>
      <div>{config.JOB_TITLE}</div>
      <Socials />
    </div>
  </div>
  `
  - [x] Add the imports: `PortraitImage` (`@/components/atoms/portrait-image`), `Socials`
        (`@/components/molecules/socials`), `config` (`@/config`). Leave the existing `NavLinks`
        import and `<nav>` exactly as they are.
  - [x] **Do not** add `'use client'` — `layout.tsx` stays a Server Component and keeps its
        `metadata` export. **Do not** touch the content pane, `ContentTransition`, `ThemeToggle`,
        `globals.css`, or the nav.

- [x] **Task 6 — Verify (build, lint, in-shell visual parity, both themes + mobile)** (AC: #7)
  - [x] `npm run build` → green, **pure static export** (routes `○ (Static)`, no functions).
        `npm run lint` → clean (no `any`, no unescaped-entity errors). `npm run format`. Record
        exact outputs in the Dev Agent Record → Debug Log.
  - [x] Confirm the **portrait markup** in `out/index.html`: an `<img>` whose `src`/`srcset`
        point at the Netlify loader (`/.netlify/images?url=%2Fimages%2Fzac-portrait.jpg&w=…&q=75`),
        with the `sizes` attribute present, inside the `rounded-full … border-4 border-inverse`
        container. Confirm **"Zac Braddy"**, **"Contract Software Engineer"**, and the three social
        `href`s (incl. the unicorn LinkedIn URL) are present.
  - [x] `npm run dev`, load `/` at **desktop width (`lg`+)** in **both themes** and compare to the
        live site: portrait (circular, bordered, shadowed) above name + job title + socials, with
        the nav below — same layout/order/breakpoints. **Read "`border-inverse`: first render"**
        in Dev Notes and check the portrait border in **both** themes, flagging the light-theme
        discrepancy if visible.
  - [x] **Local-dev image caveat:** the portrait `src` resolves to `/.netlify/images?…`, which
        **404s under `next dev`/`serve` locally** (the Netlify Image CDN only exists on Netlify) —
        so the photo itself may show broken locally while the **box, border, circle, shadow, and
        reserved space (no CLS)** are all verifiable. Verify the **layout/sizing** locally;
        confirm the **actual photo** on a Netlify preview or defer that pixel check to the Story
        4.1 gate. Do **not** claim the photo renders if you only saw the loader URL — say what you
        verified.
  - [x] At **mobile width (below `lg`)**: confirm the **portrait appears** as the top header with
        the negative-margin overlap (per Task 3 CSS), and that **name/title/socials and the nav
        stay hidden** (they are `lg`-gated / `hidden lg:flex`). There is **no** burger trigger yet
        (that is 2.4) — its absence below `lg` is the correct intermediate state.
  - [x] Do **not** run `npm test` (stub `exit 1` — AR13).

- [x] **Task 7 — Decision capture** (AC: #8)
  - [x] Create `docs/decisions/0017-<short-title>.md` from `docs/decisions/_template.md`
        (Status: Accepted; Tags: `theseus, sidebar`/`images`/`dependencies`) capturing the five
        calls in AC #8: (a) the `free-brands-svg-icons` dependency; (b) the portrait
        `GatsbyImage` → `next/image` `fill`/`sizes` port through the Netlify loader (AR17, AR9) + the local-dev caveat; (c) `src/config/index.ts` `JOB_TITLE` (AR9, deferred from 2.2);
        (d) the `border-inverse` light-theme parity discrepancy (flagged for Story 4.1, not
        silently changed); (e) `alt="Zac Braddy"`.
  - [x] Add the 0017 row to the ADR index table in `docs/decisions/README.md`.
  - [x] If any genuinely-deferrable hardening surfaces (e.g. an image-loader robustness item now
        that a real raster flows through it), log it in
        `_bmad-output/implementation-artifacts/deferred-work.md` — do **not** gold-plate it in.

### Review Findings

_Code review 2026-06-16 (Blind Hunter + Edge Case Hunter + Acceptance Auditor). All 8 ACs passed; the Edge Case Hunter empirically verified (rebuild, `node_modules`, filesystem, `out/`) that every Blind-Hunter alarm was already handled. 13 findings dismissed as noise/false-positives._

- [x] [Review][Decision] Image-loader dev short-circuit expands scope beyond the story's "Not touched" list — `src/image-loader.ts:12-14` added `if (process.env.NODE_ENV === 'development') return src;`. **RESOLVED 2026-06-16 (Zac's call): accepted in-story.** Zac explicitly requested local-dev rendering during implementation and has since passed the visual check; production export verified parity-safe (still emits `/.netlify/images?…`). Documented ADR 0017 §7 + amended ADR 0014. No code change.
- [x] [Review][Patch] GitHub social link `aria-label` casing — "Github" → "GitHub" [src/components/molecules/socials.tsx:30] — APPLIED 2026-06-16.
- [x] [Review][Defer] `border-inverse` light-theme parity discrepancy (Theseus light `#5a5a5a` vs archive invalid→`currentColor`≈`#333`) [src/components/atoms/portrait-image.tsx:6] — deferred, pre-existing (root in Story 1.4; already flagged ADR 0017 §4 for the Story 4.1 visual-diff gate).
- [x] [Review][Defer] Twitter social link to be removed (Zac no longer uses Twitter) — `faTwitter` + `aria-label="Twitter"` currently ported verbatim [src/components/molecules/socials.tsx:11] — deferred to the content-update epic; remove from this component and the live site together there. Renders fine as-is until then.

## Dev Notes

### What this story changes (small surface)

- **New:** `src/components/atoms/portrait-image.tsx`, `src/components/atoms/portrait-image.module.css`,
  `src/components/molecules/socials.tsx`, `src/config/index.ts`, `docs/decisions/0017-…md`.
- **Modified:** `src/app/layout.tsx` (insert the identity grid as row 1 of the sidebar container,
  above the existing `<nav>`; add three imports — stays a Server Component), `package.json` +
  `package-lock.json` (add `@fortawesome/free-brands-svg-icons`), `docs/decisions/README.md`
  (index 0017), `_bmad-output/implementation-artifacts/sprint-status.yaml` (story status), this
  story file (Dev Agent Record / checkboxes / status).
- **Not touched:** the `<nav>` + `NavLinks`/`NavLink` (2.2), the content pane / `ContentTransition`
  / `ThemeToggle`, `globals.css`, theming/tokens, fonts/metadata/GA (1.6), the 2.1 animation
  files. **Do not re-open earlier work.** The `public/images/zac-portrait.jpg` asset already
  exists (added in Story 1.6 for the OG/Twitter card) — reuse it; do not re-copy or move it.

### The sidebar grid — where row 1 slots in (read this)

`src/app/layout.tsx` already has the sidebar container (ported in 2.1, nav added in 2.2):

```tsx
<div
  className={`${styles.hero} flex flex-col items-center rounded-l lg:grid lg:grid-rows-2 lg:pt-16 lg:gap-0 lg:flex-grow-0 lg:w-72 lg:bg-primary-200 lg:overflow-hidden`}
>
  {/* ↑ ROW 1 — identity grid goes HERE (this story) */}
  <nav className="pt-8 mr-3.5 xl:mr-0 lg:pt-0 justify-start flex-col h-full items-center hidden lg:flex">
    <NavLinks /> {/* ROW 2 — already mounted in 2.2, leave untouched */}
  </nav>
</div>
```

The container is a `lg:grid lg:grid-rows-2`. The `<nav>` is row 2. This story adds the
identity grid as **row 1, immediately above the `<nav>`** — matching the archive child order
(`archive/src/components/layout.js`: identity grid `:94–103`, then `<nav>` `:104–106`). Below
`lg` the container is a plain `flex flex-col items-center` column; the portrait shows, the
`hidden … lg:flex` name/title/socials block does not, and the `hidden lg:flex` nav does not.

> Note: 2.2 already corrected the archive's `xl: mr-0` typo to `xl:mr-0` on the `<nav>`
> (recorded in ADR 0016 / deferred-work). **Leave that line as-is** — it is not yours to revisit.

### Mobile portrait is intentional (NFR1) — not a scope leak

In the archive the **portrait is not `lg`-gated** (`<div className="w-68 flex justify-center">` —
no `hidden`), so it shows on **mobile too**, acting as the top header; the
`portrait-image.module.css` negative `margin-bottom` (`-7rem`/`-9.7rem`) pulls the content pane
up to overlap it. Only the **name/title/socials** block is desktop-only (`hidden … lg:flex`).
So after this story, **mobile gains a visible portrait header** (today's intermediate state has
an empty hero). That is **correct parity**, not gold-plating — the mobile burger trigger is the
only mobile chrome still missing, and that is Story 2.4.

### Portrait: GatsbyImage → next/image (AR9, AR17, FR21) — the substantive port

Archive (`portrait-image.js`) builds the image at GraphQL build time
(`gatsbyImageData(width: 300, layout: CONSTRAINED)`) and renders `<GatsbyImage>` filling a fixed
circular container. The idiomatic-Next replacement:

- **Source:** `/images/zac-portrait.jpg` — already in `public/images/` (400×400, square). No
  `useStaticQuery`, no `gatsby-plugin-image` (AR9 — the GraphQL data layer is gone).
- **`fill` + `sizes` + `object-cover`** reproduces CONSTRAINED+fill: the image absolutely fills
  the relatively-positioned, fixed-size, `overflow-hidden rounded-full` container, clipped to a
  circle. The source is square and the container is square, so `object-cover` crops nothing.
- **`sizes="(min-width: 768px) 192px, 128px"`** — the display is `w-32` (128px) below `md` and
  `w-48` (192px) at `md`+, so this tells the Netlify loader the real rendered widths and stops it
  over-fetching (without `sizes`, `fill` defaults to `100vw`). `q` defaults to 75 via the loader.
- **CLS (AR17):** controlled by the **fixed-size container** (`w-32 h-32 md:w-48 md:h-48`), which
  reserves the box before the image loads — so the image cannot reflow content. (With `fill` you
  do not pass `width`/`height` props; the container is the size source. This satisfies "no layout
  shift" — the parity bar — without intrinsic attrs.)
- **`alt`:** `next/image` **requires** `alt`. The archive `<GatsbyImage>` passed none (effectively
  `alt=""`). Use `alt="Zac Braddy"` — a conscious, visual-diff-invisible a11y improvement,
  consistent with the state-aware aria-label call in Story 1.5 (deferred-work / ADR). Record in
  ADR 0017. (If you prefer strict parity, `alt=""` is defensible — but the photo is content, not
  decoration, so `alt="Zac Braddy"` is the better call; pick one and note it.)

**Local-dev rendering caveat (verification honesty):** `next.config.ts` sets a **custom loader**
(`./src/image-loader.ts`) targeting the Netlify Image CDN (`/.netlify/images?url=…&w=…&q=…`).
`next dev` and a locally-served `out/` will emit that URL but the CDN endpoint **does not exist
locally**, so the portrait renders as a **broken image locally** while the **box/border/circle/
shadow/reserved-space** are all correct. Verify layout/sizing/CLS locally; verify the **actual
photo** on a **Netlify preview deploy** (or defer that pixel check to the Story 4.1 gate). State
exactly what you checked — do not infer the photo rendered from the markup alone.

**Image-loader is now exercised for real:** this is the first raster image through
`src/image-loader.ts` (Story 1.7 deferred a robustness pass for "when real images flow through").
For `/images/zac-portrait.jpg` none of the deferred edge cases apply — it is a **site-relative**
`src` (no remote allowlist needed), **not pre-encoded** (no double-encoding), **kebab-case** (no
space→`+`), and widths/`q` come from `next/image`'s own integer scale (in range). So **no loader
change is needed** here; if you spot a real gap, log it to deferred-work rather than fixing
speculatively.

### `border-inverse`: first render — and a real light-theme parity discrepancy (flag, don't silently fix)

The portrait container uses `border-4 border-inverse` — and **this story is the first place
`border-inverse` actually renders**, so its quirks surface now:

- **Dark theme (`:root`):** `globals.css` has `--color-border-inverse: fafafa;` — **deliberately
  invalid** (no `#`), a verbatim archive quirk preserved with an explicit comment + recorded in
  ADR 0010. An invalid `border-color` falls back to **`currentColor`**, which in dark is
  `--color-text-primary` (`#fafafa`, near-white). So the portrait gets a near-white 4px ring.
  **This matches the archive's rendered behaviour** (archive dark `borderColor.inverse: 'fafafa'`
  is equally invalid → `currentColor`). ✅ Correct — do not "fix" it.
- **Light theme (`.light`):** here Theseus and the archive **diverge**. `globals.css` `.light`
  has `--color-border-inverse: #5a5a5a;` (**valid** — note the `#`), so the border renders a
  solid `#5a5a5a` mid-grey. But the **archive** light value is `'5a5a5a'` (**no `#`** — see
  `archive/src/components/theme-styles.js:46`), i.e. **invalid → `currentColor`**, which in light
  is `--color-text-primary` (`#333`). So the **archive light portrait border is ≈`#333`**, while
  **Theseus renders `#5a5a5a`** — a subtle but real difference (both dark greys; `#5a5a5a` is
  lighter) introduced when Story 1.4 added a `#` to the light value but not the dark one.

**What to do:** **do not silently change `globals.css`** — that re-opens Story 1.4's token work,
and the dark-side invalid value is an intentional, ADR-recorded quirk. Instead **record this
light-theme discrepancy in ADR 0017** as a known parity question and **flag it for the Story 4.1
visual-diff gate** (where the live site is the arbiter). If you can see the light portrait border
clearly differs from the live site at the in-shell check, raise it to Zac as a decision rather
than guessing. The clean fix, _if_ Zac elevates it, is to make light match the archive's
`currentColor` outcome (drop the `#`, or set it to `#333`) — but that is a conscious parity call,
not a port detail.

### `w-68` resolves to 17rem under Tailwind v4 — no custom token needed (verify)

The identity grid inner divs use `w-68`. In the archive (Tailwind v3) `68` was a **custom**
spacing value (`tailwind.config.js`: `68: '17rem'`). Theseus's `globals.css` `@theme` defines
**no** custom spacing — but **Tailwind v4 generates `w-<n>` dynamically** as
`calc(var(--spacing) * n)` with the default `--spacing: 0.25rem`, so **`w-68` = `0.25rem × 68` =
`17rem`** — **identical** to the archive's custom value. So `w-68` works out of the box; **do not
add a custom spacing token** for it. (Quick sanity-check the compiled width is `17rem` after
build.) ⚠️ Caveat for later tiers: the archive's custom scale was **non-linear** in places
(e.g. `87: '23rem'`, but v4 dynamic gives `87×0.25 = 21.75rem`), so **Epic 3** ports may hit
archive spacing classes that v4 does **not** reproduce and will need explicit `@theme` tokens —
but **none of those affect this story** (only `w-68` is used here, and it is linear).

### Server/Client boundary (NFR5, AR14)

- `portrait-image.tsx` — **Server Component.** `next/image` renders fine server-side; there is no
  interactivity. No `'use client'`.
- `socials.tsx` — **Server Component.** Static `<a>`s + `FontAwesomeIcon` (a stateless SVG
  component — renders server-side; `theme-toggle.tsx` only needs `'use client'` because of its
  state, not because of FA). No `'use client'`.
- `layout.tsx` — **stays a Server Component** (exports `metadata`). It now renders two more server
  children (`PortraitImage`, `Socials`) alongside the existing client `NavLink` leaves inside
  `NavLinks`. No directive is added. (AR14 keeps the only client surfaces at the leaves — the
  theme toggle and the nav-item; the sidebar identity is entirely server.)
- `config.autoAddCss = false` + the global FA CSS import are already set in `layout.tsx` (1.6),
  so brand icons render without per-component CSS setup.

### New dependency: `@fortawesome/free-brands-svg-icons` (ADR 0017)

The Twitter/LinkedIn/GitHub marks are **brand** icons — they live **only** in
`@fortawesome/free-brands-svg-icons`, **not** in the installed `free-solid`/`free-regular`
packages (verified: `node_modules/@fortawesome/` has `free-solid`, `free-regular`,
`fontawesome-svg-core`, `react-fontawesome` — **no** `free-brands`). So this is a **genuine,
non-substitutable** need, not gold-plating: the archive used the same package, and it is the
canonical FA source for brand marks. Pin it to **`^7.2.0`** to stay aligned with the rest of the
FA suite (all `^7.2.0`). This is the project's first justified new runtime dependency since the
FA introduction (ADR 0012) — record the rationale in ADR 0017. (The cross-cutting "no new
dependencies casually" guardrail is satisfied: it is necessary, canonical, and version-aligned.)

### Project structure & conventions (from project-context.md — note the Theseus divergence)

- **Atomic design:** portrait is an **atom** (`src/components/atoms/portrait-image.tsx`), socials a
  **molecule** (`src/components/molecules/socials.tsx`), `config` under `src/config/` — matching
  the archive tiering and the 2.1/2.2 ports. Filenames **kebab-case**, components **PascalCase**.
- **TypeScript strict, no `.js` source** (AR2) — all new files are `.tsx`/`.ts`. Use TS types,
  **not** `PropTypes` (project-context.md's PropTypes/Gatsby rules describe the **archive** stack;
  the Theseus rebuild is TS — follow the Theseus artifacts where they diverge, as 1.7/2.1/2.2
  established). Neither `PortraitImage` nor `Socials` takes props, so there is little to type;
  `config` can be `as const` for literal-narrowed `JOB_TITLE`.
- **Prettier is law** (`^3.8.4`): single quotes, `arrowParens: avoid` (`arg => …`). Run
  `npm run format`; Husky `pretty-quick --staged` runs on commit. Note `react/no-unescaped-entities`
  may flag literal apostrophes — none here (no apostrophes in "Zac Braddy"/"Contract Software
  Engineer"/the labels), but the unicorn-emoji LinkedIn URL is inside an `href` string and is fine.
- **No code comments by default** (and the global rule: don't leave "removed code" comments — e.g.
  when dropping the archive's GraphQL-null fallback, just remove it).
- **British spelling** in user-facing copy; the displayed strings ("Zac Braddy", "Contract
  Software Engineer") are **fixed parity content — port verbatim**. Do **not** "update" the job
  title to Zac's current positioning — this is a byte-for-byte parity migration; content edits are
  out of scope (Ariadne/separate). Keep CSS/JS identifiers canonical.
- **Themed colours only** — `border-inverse` (and `bg-primary-200` on the sidebar) are already
  mapped to `--color-*` tokens in `globals.css`. Do **not** hardcode hex; do **not** build class
  names by interpolation — all the classes here are static literals from the archive.

### Scope seams — do NOT build now (NFR6)

Out of scope for 2.3, do not stub or pre-build: the **burger `Menu` + `MenuOpenContext` provider**
and the mobile mount of `NavLinks` with the close-handler (2.4); the **custom scrollbar** +
`Math.random()` scroll-reset (2.5); the **loading spinner** (2.6). Do **not** add `react-burger-menu`
or `react-custom-scroll`. Do **not** touch the content pane, `ContentTransition`, `ThemeToggle`,
`globals.css`, or the `<nav>`/`NavLinks` from 2.2. You **do** edit `layout.tsx` — but **only** to
insert the identity grid row above the existing `<nav>` and add its three imports.

### Testing standards (AR13 — no suite to fabricate)

No test framework exists; `npm test` is a stub that exits 1 — **do not run it as a test, do not
invent a suite**. Verification is: `npm run build` green + pure static export, `npm run lint`
clean, and **manual visual parity** of the desktop sidebar (portrait/name/title/socials/nav, both
themes, `lg`+) **and** the mobile portrait header (below `lg`), against the live site. Because of
the **Netlify-loader local-dev caveat** above, the **photo pixels** verify on a preview / at the
Story 4.1 gate, not necessarily in `next dev`. Record real command outputs in the Dev Agent
Record; do not claim parity you have not actually seen.

### Project Structure Notes

- New files align with the established Theseus tree and the archive originals one-for-one:
  `src/components/atoms/portrait-image.tsx` (+ `.module.css`), `src/components/molecules/socials.tsx`,
  `src/config/index.ts`. No conflicts with the unified structure.
- `src/config/index.ts` mirrors the archive's default-export object so the `import config from
'@/config'` / `config.JOB_TITLE` surface matches the archive call site verbatim.
- The portrait reuses the existing `public/images/zac-portrait.jpg` (placed in 1.6) — the URL is
  unchanged from the archive's `static/images/` → `public/images/` relocation (AR10).

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.3] — the four Given/When/Then ACs
  (full sidebar at `lg`+; portrait via `next/image` no-CLS; socials new-tab URLs; composes the
  shared nav).
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 2] — shell decomposition (2.1–2.6 split;
  2.3 = the sidebar identity, 2.4 = burger menu).
- [Source: _bmad-output/planning-artifacts/epics.md#Additional Requirements] — AR9 (data-layer
  removal: `useStaticQuery(graphql)`/`siteMetadata` → TS module imports / `src/config`), AR10
  (static assets `static/` → `public/`, URLs unchanged), AR14 (Server/Client boundary —
  interactivity at leaves), AR17 (`next/image` CLS guard — carry intrinsic dimensions / reserve
  space), AR13 (tooling / no fabricated suite).
- [Source: archive/src/components/layout.js:94–106] — the identity grid markup (rows + classes)
  and the `<nav>` ordering to mirror; `config.JOB_TITLE` usage.
- [Source: archive/src/components/atoms/portrait-image.js + .module.css] — the portrait container
  classes (`w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-inverse
shadow-xl`) and the negative-margin CSS Module to port verbatim; the GatsbyImage→next/image swap.
- [Source: archive/src/components/molecules/socials.js] — the three social `<a>`s (URLs incl. the
  unicorn LinkedIn URL, `aria-label`s, `target`/`rel`, `size="lg"` brand icons) to port verbatim.
- [Source: archive/src/config/index.js] — `JOB_TITLE: 'Contract Software Engineer'` to port.
- [Source: archive/tailwind.config.js] — the archive custom spacing scale (`68: '17rem'`, …) that
  v4's dynamic spacing reproduces for `w-68` (17rem) but **not** for the non-linear entries.
- [Source: src/app/layout.tsx] — current root layout; the `${styles.hero}` sidebar container with
  the 2.2 `<nav>` is where the identity grid mounts (row 1, above the `<nav>`). Stays a Server
  Component; keep `metadata`.
- [Source: src/app/globals.css:22-23,38-39,72-74] — the `border-inverse` token: dark invalid
  (`fafafa`, intentional quirk) vs light valid (`#5a5a5a`) — the parity discrepancy to flag; the
  `@utility border-inverse` mapping.
- [Source: src/image-loader.ts + next.config.ts] — the Netlify custom image loader the portrait
  routes through (and the local-dev rendering caveat); Story 1.7's deferred loader-robustness note.
- [Source: src/components/atoms/theme-toggle.tsx, src/components/atoms/nav-link.tsx] — the
  established FontAwesome usage pattern in the Theseus codebase.
- [Source: _bmad-output/implementation-artifacts/2-2-primary-navigation-and-the-download-cv-action.md]
  — prior story: the deferred identity-grid seam, the empty-sidebar mount point, the `xl: mr-0`
  fix (do not revisit), the verification-honesty bar, Theseus-vs-archive divergence note, ADR
  discipline (0016 created there → 0017 here).
- [Source: _bmad-output/implementation-artifacts/deferred-work.md] — open items touching this
  story: the image-loader robustness pass (1.7), Roboto single-weight (1.6), and the prior
  border/layer findings.
- [Source: docs/decisions/_template.md + README.md] — ADR format + index for the 0017 capture;
  0016 is the highest existing number. ADR 0010 (theming tokens, the `border-inverse` quirk) and
  ADR 0012 (FontAwesome introduction) are the relevant precedents for this story's captures.
- [Source: _bmad-output/project-context.md] — JS/TS rules, Prettier law, atomic structure,
  themed-colour + no-interpolated-classnames rules (describes the **archive** stack; follow the
  Theseus artifacts where they diverge).

## Dev Agent Record

### Agent Model Used

Opus 4.8 (1M context) — `claude-opus-4-8[1m]`

### Debug Log References

- `npm install @fortawesome/free-brands-svg-icons@^7.2.0` → "added 1 package"; resolves to
  `7.2.0`; lands in `package.json` `dependencies`; `package-lock.json` updated.
- `npm run format` → new/modified source files reported `(unchanged)` (already
  Prettier-conformant).
- `npm run lint` → clean (no output / no errors; TS strict, no `any`, no unescaped-entity
  errors).
- `npm run build` → **failed first run**: `the name 'config' is defined multiple times`
  in `layout.tsx:13` — collision between the existing FA-core `import { config }` (1.6) and
  the new `import config from '@/config'`. Resolved by aliasing the FA import to `faConfig`
  (`import { config as faConfig }` → `faConfig.autoAddCss = false`), preserving the archive's
  `config.JOB_TITLE` call surface verbatim (recorded in ADR 0017 §6).
- `npm run build` → **green** after the fix: `✓ Compiled successfully`, `Finished TypeScript`,
  4/4 static pages generated. Routes: `/`, `/_not-found`, `/icon.svg` all `○ (Static)` —
  pure static export, no functions.
- `out/index.html` checks: portrait `<img>` with `data-nimg="fill"`, `alt="Zac Braddy"`,
  `class="object-cover"`, `sizes="(min-width: 768px) 192px, 128px"`, and a `srcSet`/`src` of
  `/.netlify/images?url=%2Fimages%2Fzac-portrait.jpg&w=…&q=75`, inside the
  `…rounded-full overflow-hidden border-4 border-inverse shadow-xl` container; "Zac Braddy" and
  "Contract Software Engineer" present; all three social `href`s present incl. the literal
  unicorn LinkedIn URL.
- Compiled CSS checks: `.w-68{width:calc(var(--spacing) * 68)}` (= 17rem at default
  `--spacing: 0.25rem`, matching the archive's custom token — no `@theme` token added); ported
  portrait container shows `margin-bottom` `-7rem` / `-9.7rem` / `0` byte-for-byte.

### Completion Notes List

- **Implemented:** brand-icons dependency (`free-brands-svg-icons@^7.2.0`); `src/config/index.ts`
  (`JOB_TITLE`, `as const`, default export); `portrait-image.tsx` (Server Component, `next/image`
  `fill`+`sizes`+`object-cover`, `alt="Zac Braddy"`) + byte-for-byte `portrait-image.module.css`;
  `socials.tsx` (Server Component, three brand-icon links, unicorn LinkedIn URL preserved);
  identity grid mounted as row 1 of the `${styles.hero}` sidebar container in `layout.tsx`, above
  the untouched 2.2 `<nav>`. `layout.tsx` stays a Server Component (keeps `metadata`).
- **Non-obvious call (ADR 0017 §6):** the FA-core `config` import (from 1.6) collided with the
  new site-`config` import; aliased FA to `faConfig` rather than renaming the site config, to keep
  the archive's `config.JOB_TITLE` markup verbatim. Zero parity impact (FA config is Theseus-only).
- **Verification honesty (AC #7 / AR13):** build + lint + static-export + built-markup + compiled-CSS
  all verified programmatically. Zac confirmed the desktop layout looks good in `next dev`. Initially
  the **portrait photo did not render locally** (the Netlify Image CDN `/.netlify/images?…` 404s under
  `next dev` — only exists on Netlify); resolved post-review by making `src/image-loader.ts`
  env-aware (returns the plain `public/` path under `NODE_ENV=development`, Netlify CDN URLs in
  production) — see ADR 0017 §7. **Production output verified unchanged** (`out/index.html` still
  emits `/.netlify/images?…`; no raw `/images/` `src` leaks). The **both-theme `border-inverse`
  border visual diff** against the live site is still deferred to a Netlify preview / the Story 4.1
  visual-diff gate. No visual parity is claimed beyond what was structurally verified + Zac's
  in-dev layout confirmation.
- **`border-inverse` light-theme parity discrepancy** confirmed by static inspection of `globals.css`
  (dark `fafafa` invalid → `currentColor`, correct archive quirk; light `#5a5a5a` valid vs archive's
  invalid `'5a5a5a'` → `currentColor` ≈ `#333`). Flagged in ADR 0017 §4 for the 4.1 gate; **not**
  silently changed (would re-open Story 1.4).
- **Scope held:** no burger menu / `MenuOpenContext` (2.4), no custom scrollbar / scroll-reset (2.5),
  no loading spinner (2.6). Content pane, `ContentTransition`, `ThemeToggle`, `globals.css`, and the
  2.2 `<nav>`/`NavLinks` untouched. One new dependency only. `deferred-work.md` left unchanged — the
  image-loader edge cases the 1.7 note flagged do not apply to this kebab-case, site-relative,
  in-range image.

### File List

- `package.json` (modified — add `@fortawesome/free-brands-svg-icons` dependency)
- `package-lock.json` (modified — lockfile update)
- `src/config/index.ts` (new)
- `src/components/atoms/portrait-image.tsx` (new)
- `src/components/atoms/portrait-image.module.css` (new)
- `src/components/molecules/socials.tsx` (new)
- `src/app/layout.tsx` (modified — identity grid row 1 + three imports; FA `config` aliased to `faConfig`)
- `src/image-loader.ts` (modified — env-aware dev branch so the portrait renders under `next dev`; ADR 0017 §7)
- `docs/decisions/0017-desktop-sidebar-identity-portrait-socials-config.md` (new)
- `docs/decisions/0014-netlify-deploy-config-and-image-loader.md` (modified — amendment pointer to 0017 §7)
- `docs/decisions/README.md` (modified — 0017 index row)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified — story status)
- `_bmad-output/implementation-artifacts/2-3-desktop-sidebar-lg-and-above.md` (modified — this record)

## Change Log

| Date       | Change                                                                                                                              |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 2026-06-16 | Story created (ready-for-dev).                                                                                                      |
| 2026-06-16 | Implemented sidebar identity block (portrait/socials/config); build + lint green; ADR 0017; status → review.                        |
| 2026-06-16 | Post-review: env-aware image loader so the portrait renders under `next dev` (prod output unchanged); ADR 0017 §7 + 0014 amendment. |
