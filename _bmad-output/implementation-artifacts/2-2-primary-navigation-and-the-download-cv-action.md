---
baseline_commit: 096bc12a257922f9b360ebd5891f5577262f7b28
---

# Story 2.2: Primary navigation and the Download CV action

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a site visitor,
I want the same navigation options and a CV download exactly where they are today,
so that I can move around the site and grab Zac's CV without any change to the experience.

## Context & purpose (read first)

This is the **second story of Epic 2** (Persistent App Shell & Navigation). Story 2.1 built the
structural frame inside `src/app/layout.tsx` — the `<main>` → centred frame → **empty** sidebar
container + content pane (`AnimateOnChange` wrapping `{children}`). This story builds **the single
shared navigation component** and **wires it into the desktop sidebar** so it ships visible and
verifiable: the four nav items (Home, About Me, Resume, Content I've Created) **plus** the Download
CV action.

**This story builds the component AND mounts it** in the desktop sidebar's `<nav>` (the archive's
real mount point, `archive/src/components/layout.js:104–105`). The two remaining seams stay with
their dedicated stories:

| Consumer / seam                                        | Story   | Status in 2.2                                                                                |
| ------------------------------------------------------ | ------- | -------------------------------------------------------------------------------------------- |
| **Shared nav component**                               | **2.2** | Built here                                                                                   |
| **Desktop sidebar `<nav>` mount** (`lg`+)              | **2.2** | **Mounted here** — `<nav>…<NavLinks /></nav>` added to the sidebar container                 |
| **Sidebar identity** (portrait/name/job-title/socials) | **2.3** | **Not built** — the grid above the `<nav>` stays an empty seam                               |
| **Mobile burger menu** (`< lg`)                        | **2.4** | **Not built** — nav renders inside the slide-in `Menu` with an `onClick` close handler later |

So 2.2's job is: port `archive/src/components/molecules/nav-links.js` + `archive/src/components/atoms/nav-link.js`
to a single shared, reusable TypeScript component pair (swapping Gatsby's `<Link>`/`getProps`
active-detection for `usePathname`, AR8); relocate the CV PDF from `archive/static/pdfs/` to
`public/pdfs/` (AR10) so the Download CV action resolves at its **current URL** (`/pdfs/zac-braddy.pdf`);
and **mount the nav** in the sidebar container's `<nav>` element (archive markup verbatim), rendered
**only at `lg`+** (the `<nav>` is `hidden lg:flex` — below `lg` the nav lives in the 2.4 burger menu,
so the intermediate state correctly shows the nav on desktop and nothing on mobile until 2.4).

**Scope fence:** mount **only** the `<nav>` + `NavLinks`. Do **not** build the portrait/name/job-title/
socials grid that sits above it in the archive (`layout.js:94–103`) — that is 2.3's coherent unit
(NFR6 anti-gold-plating). The shared component keeps its optional `onClick` so 2.4 composes it for the
mobile menu without re-implementing it.

**The single source of visual/behavioural truth is the live site** (`zackerthehacker.com`) and the
archived Gatsby implementation. This is a zero-regression parity port (NFR1/NFR2): labels, icons,
order, destinations, the active-state styling, and the Download CV behaviour must match today.

## Acceptance Criteria

1. **Shared nav with identical items (FR2).**
   **Given** the navigation,
   **When** it renders,
   **Then** it exposes **Home**, **About Me**, **Resume**, and **Content I've Created** with **identical
   labels, icons, order, and destinations** to today (FR2) — i.e. ported verbatim from
   `archive/src/components/molecules/nav-links.js`: `/` + `faHome` → "Home"; `/about-me` +
   `faUserAstronaut` → "About Me"; `/resume` + `faStickyNote` → "Resume"; `/content` + `faPaintBrush`
   → "Content I've Created" (note the apostrophe in "Created"),
   **And** each item's wrapper classes match the archive `nav-link.js` verbatim
   (`flex my-2 xl:mt-0 xl:mb-8 text-lg`, the icon in a `mr-4` div, the link as `w-full flex`).

2. **Active route via `usePathname` (FR2, AR8).**
   **Given** the current route,
   **When** a nav item matches it,
   **Then** the active item reflects the current path using `usePathname` from `next/navigation`
   (client only, AR8) — **not** Gatsby `<Link getProps>`/`useState`,
   **And** the active-match rule is preserved **verbatim** from the archive: an item is active when
   `(to === '/' && pathname === to) || (to !== '/' && pathname.startsWith(to))` (home matches exactly;
   the others match by `startsWith`),
   **And** when active the wrapper gets the exact archive active classes `text-secondary font-bold`
   (a static literal string — never interpolated), matching today's highlight.

3. **Download CV action at its current path (FR16, AR10).**
   **Given** the Download CV action,
   **When** it renders,
   **Then** it appears with its current label ("Download CV") and styling, ported verbatim from the
   archive `<a>` (`mt-4 font-bold text-lg border-4 rounded-full py-2 px-4 border-secondary self-center`,
   `target="_blank" rel="noreferrer" download`),
   **And** the CV PDF is relocated from `archive/static/pdfs/zac-braddy.pdf` to
   `public/pdfs/zac-braddy.pdf` (AR10 static-asset relocation), so the **URL is unchanged**
   (`href="/pdfs/zac-braddy.pdf"`),
   **And** activating it downloads the **same PDF** with the **same behaviour** as today (FR16) — it
   stays a plain `<a download>`, **not** a `next/link`.

4. **Single shared component, mounted in the desktop sidebar, composed not duplicated (FR2 / anti-reinvention).**
   **Given** the nav is consumed by **both** the desktop sidebar (here) and the mobile menu (2.4),
   **When** it is built,
   **Then** it is a **single shared component** (no duplicate nav definitions) that accepts an optional
   `onClick` handler (the mobile menu will pass a close-on-selection handler in 2.4, exactly as the
   archive's `onClick={() => setMenuOpen(false)}` does; the desktop mount passes none),
   **And** it is **mounted into the desktop sidebar** by adding the archive `<nav>` wrapper
   (`layout.js:104` markup, `hidden lg:flex` so it shows only at `lg`+) inside the existing empty sidebar
   container in `src/app/layout.tsx`, rendering `<NavLinks />` (no `onClick`),
   **And** the sidebar's portrait/name/job-title/socials grid is **not** added here (2.3's seam stays empty).

5. **Idiomatic-Next boundaries, no new dependencies (NFR5, NFR6).**
   **Given** the Server/Client boundary discipline,
   **When** the component is built,
   **Then** the nav-item leaf that reads `usePathname` is a `'use client'` component, and the
   nav-list wrapper stays directive-free so it composes cleanly into **either** a Server Component
   parent (the `layout.tsx` sidebar `<nav>` mounted here; 2.3 later extends it) **or** a Client
   Component parent (the 2.4 menu) — i.e. `layout.tsx` stays a Server Component,
   **And** **no new runtime dependency is added** — links use the built-in `next/link`, icons use the
   already-present `@fortawesome/*` packages; no `gatsby`, no `@reach/router`.

6. **Build green; parity verified locally; scope held (NFR1/NFR2/NFR6).**
   **Given** the change,
   **When** `npm run build` and `npm run lint` are run,
   **Then** both are green (TS strict, no `any`, no lint errors) and the build stays a pure static
   export,
   **And** the nav (labels, icons, order, active highlight) and the Download CV action are verified
   visually **in the mounted desktop sidebar** against the live site in **both themes** (dark + light)
   at `lg`+ — Home shows active on `/`; the `startsWith` active state across other routes is spot-checked
   via a throwaway route if convenient, otherwise lands once Epic 3 adds routes / at the Story 4.1 gate
   (see Tasks),
   **And** none of the deferred shell pieces are built — no sidebar identity grid (portrait/name/socials,
   2.3), no burger menu / `MenuOpenContext` (2.4), no scrollbar (2.5), no spinner (2.6).

7. **Decision capture as-you-go (FR26 / AR19).**
   **Given** the cross-cutting decision-capture DoD,
   **When** the non-obvious calls in this story are made,
   **Then** they are recorded in a new ADR (next free number **0016**), indexed in
   `docs/decisions/README.md`: specifically (a) the active-link detection port — Gatsby
   `<Link getProps>` + local `useState` → a `usePathname`-derived boolean in a `'use client'` nav-item
   leaf (AR8), with the active-match rule preserved verbatim; (b) mounting the shared nav in the
   desktop sidebar `<nav>` now (pulled forward so 2.2 ships something visible) while the sidebar
   identity grid (2.3) and the mobile burger menu (2.4) stay deferred — the optional `onClick` is the
   seam that keeps it a single shared component; (c) the CV-PDF relocation `archive/static/` →
   `public/` keeping the URL unchanged (AR10).

## Tasks / Subtasks

- [x] **Task 1 — Relocate the CV PDF to `public/` (AR10)** (AC: #3)
  - [x] Copy `archive/static/pdfs/zac-braddy.pdf` → `public/pdfs/zac-braddy.pdf` (create `public/pdfs/`).
        Keep the filename and the public URL identical (`/pdfs/zac-braddy.pdf`). Do **not** move/delete the
        archive copy (the Gatsby build runs untouched until Epic 4 cutover — AR1).
  - [x] Confirm it serves: after a build, `public/pdfs/zac-braddy.pdf` is included in the static export and
        resolves at `/pdfs/zac-braddy.pdf`.
- [x] **Task 2 — Port the nav-item atom as a `'use client'` leaf** (AC: #1, #2, #5)
  - [x] Create `src/components/atoms/nav-link.tsx` with `'use client'` at the top (it needs `usePathname`).
        Port `archive/src/components/atoms/nav-link.js` faithfully but replace the Gatsby active mechanism:
    - Use `<Link>` from **`next/link`** (not `gatsby`), `href={to}` (Next uses `href`, not `to`).
    - Replace the `getProps`/`useState` `isActive` callback with a derived boolean:
      `const pathname = usePathname();` then
      `const isCurrent = (to === '/' && pathname === to) || (to !== '/' && pathname.startsWith(to));`
      — **no `useState`/`useEffect`** (derive on render; the client component re-renders on navigation).
    - Preserve the wrapper markup + classes verbatim: outer `div` =
      `` `flex my-2 xl:mt-0 xl:mb-8 text-lg ${isCurrent ? 'text-secondary font-bold' : ''}` `` (keep the
      active string a **static literal**, never interpolated — PurgeCSS/Tailwind-scan parity), the icon in
      `<div className="mr-4"><FontAwesomeIcon icon={icon} /></div>`, and the `<Link className="w-full flex" href={to} onClick={onClick}>{children}</Link>`.
  - [x] Type the props in TS, no `any`:
        `{ to: string; onClick?: () => void; icon: IconDefinition; children: React.ReactNode }` — import
        `IconDefinition` from `@fortawesome/fontawesome-svg-core`. Follow the existing FontAwesome usage
        pattern in `src/components/atoms/theme-toggle.tsx`.
- [x] **Task 3 — Port the shared nav-list molecule** (AC: #1, #3, #4, #5)
  - [x] Create `src/components/molecules/nav-links.tsx` porting `archive/src/components/molecules/nav-links.js`.
        Keep it **directive-free** (no `'use client'`) so it composes into a server (2.3) or client (2.4)
        parent — the only client surface is the `NavLink` leaf.
  - [x] Render the four `NavLink`s in the exact archive order with the exact icons/labels/destinations
        (Task/AC #1), importing `faHome, faUserAstronaut, faStickyNote, faPaintBrush` from
        `@fortawesome/free-solid-svg-icons`. Pass `onClick` through to each `NavLink`.
  - [x] Render the Download CV `<a>` verbatim from the archive (AC #3): `href="/pdfs/zac-braddy.pdf"`,
        `target="_blank"`, `rel="noreferrer"`, `download`,
        `className="mt-4 font-bold text-lg border-4 rounded-full py-2 px-4 border-secondary self-center"`,
        text "Download CV". Keep it a plain `<a download>` (a PDF download, not in-app navigation — do not
        convert to `next/link`).
  - [x] Type the props: `{ onClick?: () => void }`. Wrap the children in a fragment `<>…</>` as the archive does.
- [x] **Task 4 — Mount the nav in the desktop sidebar `<nav>`** (AC: #4)
  - [x] In `src/app/layout.tsx`, inside the existing **empty** sidebar container div (the
        `${styles.hero} … lg:w-72 lg:bg-primary-200 …` div, currently self-closing), add the archive `<nav>`
        wrapper from `archive/src/components/layout.js:104` and render `<NavLinks />` (no `onClick`):
        `<nav className="pt-8 mr-3.5 xl: mr-0 lg:pt-0 justify-start flex-col h-full items-center hidden lg:flex"><NavLinks /></nav>`.
        **Port the className verbatim, including the archive's `xl: mr-0` space oddity** (see Dev Notes
        "Archive `xl: mr-0` quirk") — do not "tidy" it to `xl:mr-0`, and do not silently fix it; it is a
        live-site parity question to settle at the Story 4.1 visual gate, flagged in the ADR if you touch it.
  - [x] Keep `layout.tsx` a **Server Component** — it imports `NavLinks` (directive-free) which renders the
        `NavLink` client leaves; no `'use client'` is added to `layout.tsx` (it still exports `metadata`).
        Place the `<nav>` so the portrait/name/socials grid (2.3) can later slot **above** it inside the same
        sidebar container (the archive order is: identity grid, then `<nav>`); leaving the grid seam empty for
        now is correct.
  - [x] Do **not** touch the content pane, the `ContentTransition` wrapper, or the `ThemeToggle`.
- [x] **Task 5 — Verify (build, lint, in-shell visual parity)** (AC: #2, #6)
  - [x] `npm run build` → green, pure static export (no functions). `npm run lint` → clean. `npm run format`.
        Confirm `/pdfs/zac-braddy.pdf` is in the export. Record exact outputs in the Dev Agent Record → Debug Log.
  - [x] `npm run dev`, load `/` at a **desktop width (`lg`+)**, and confirm against the live site in **both
        themes**:
    - The sidebar `<nav>` shows all four items with correct labels (incl. the "Content I've Created"
      apostrophe), icons, and order, and the Download CV pill below them.
    - **Home** is highlighted (`text-secondary` + bold) on `/`; the other items are not.
    - **Download CV** renders with its pill/border styling and, when clicked, downloads/opens
      `/pdfs/zac-braddy.pdf` (same file as `archive/static/pdfs/zac-braddy.pdf`).
    - Below `lg`, the nav is correctly **hidden** (it lives in the 2.4 burger menu) — no nav leaks into the
      mobile layout.
  - [x] **`startsWith` active state** (non-home routes) only fully verifies once routes exist. Optionally add a
        **throwaway** route (`src/app/nav-check/page.tsx` — **not** `_`-prefixed; Next treats `_…` as
        private/non-routable, per 2.1's debug log) to click to and confirm that item activates, then **remove
        it** before finishing (do not commit it) and re-run lint + build green. Otherwise note that full
        active-state parity lands with Epic 3 routes / the Story 4.1 gate.
  - [x] Do **not** run `npm test` (stub — AR13).
- [x] **Task 6 — Decision capture** (AC: #7)
  - [x] Create `docs/decisions/0016-<short-title>.md` from `docs/decisions/_template.md` (Status: Accepted,
        Tags: `theseus, navigation`/`routing`) capturing the three calls in AC #7: (a) `usePathname`-derived
        active state (AR8) with the verbatim match rule + no `useState`; (b) shared nav mounted in the desktop
        sidebar `<nav>` now (pulled forward for a visible deliverable) with the identity grid (2.3) + mobile
        menu (2.4) deferred, the optional `onClick` keeping it a single shared component; (c) CV-PDF
        `archive/static/` → `public/` relocation, URL unchanged (AR10). If the `xl: mr-0` archive quirk is
        addressed rather than ported verbatim, record that call here too.
  - [x] Add the 0016 row to the ADR index table in `docs/decisions/README.md`.
  - [x] If any genuinely-deferrable hardening surfaces, log it in
        `_bmad-output/implementation-artifacts/deferred-work.md` (do not gold-plate it in).

## Review Findings

_Code review 2026-06-15 (bmad-code-review, 3-layer adversarial). Outcome: 0 decision-needed, 1 patch (fixed), 2 defer, 9 dismissed. Headline "usePathname can be null → crash" (raised by 2 layers) verified **false** — `usePathname(): string` in Next 16.2.9 under `strict`, so the port is type-safe and the green build is consistent._

- [x] [Review][Patch] Malformed Tailwind class `xl: mr-0` → `xl:mr-0` (stray space made `xl:` a no-op and `mr-0` unconditional) [src/app/layout.tsx:77] — **fixed during review (Zac's call)**: typo corrected rather than ported verbatim; carrying archive bugs into the Theseus build is the anti-pattern the migration avoids. Conscious step off strict parity, recorded in ADR-0016; expected `xl`+ margin delta vs the (bugged) live site noted for the Story 4.1 gate.
- [x] [Review][Defer] Active-link rule over-matches via `startsWith` (prefix collision, e.g. a future `/content` vs `/contents-x`) [src/components/atoms/nav-link.tsx:16-17] — deferred, pre-existing. Inherited verbatim from the archive and explicitly pinned by AC2 ("match rule preserved verbatim"); cannot fire today (only `/` exists). Revisit when prefix-sharing sibling routes land (Epic 3) or at the Story 4.1 gate. Cheap segment-safe form if elevated: `pathname === to || pathname.startsWith(to + '/')`.
- [x] [Review][Defer] Primary nav has no `<ul>/<li>` list semantics — flat run of links/anchor inside `<nav>` [src/components/molecules/nav-links.tsx] — deferred, pre-existing. Archive structure ported verbatim; an a11y enhancement beyond the parity scope (NFR6). Candidate for a holistic Ariadne a11y pass.

## Dev Notes

### What this story changes (small surface)

- **New:** `src/components/atoms/nav-link.tsx`, `src/components/molecules/nav-links.tsx`,
  `public/pdfs/zac-braddy.pdf` (copied from archive), `docs/decisions/0016-…md`.
- **Modified:** `src/app/layout.tsx` (add the `<nav>` wrapper + `<NavLinks />` into the empty sidebar
  container — stays a Server Component), `docs/decisions/README.md` (index 0016),
  `_bmad-output/implementation-artifacts/sprint-status.yaml` (story status),
  this story file (Dev Agent Record / checkboxes / status).
- **Not touched:** the sidebar **identity grid** (portrait/name/job-title/socials — 2.3), the content pane /
  `ContentTransition` / `ThemeToggle`, `globals.css`, theming/tokens, fonts/metadata/GA, the 2.1 animation
  files. Do **not** re-open earlier work.

### The two consumers — what is mounted here vs deferred (read this)

In the archive, `nav-links.js` is rendered in **two** places (`archive/src/components/layout.js`):

- **Desktop sidebar** (`:104–105`): `<nav …><NavLinks /></nav>` — no `onClick`. **2.2 mounts this now.**
- **Mobile menu** (`:83`): `<NavLinks onClick={() => setMenuOpen(false)} />` — inside the slide-in `Menu`.
  **Deferred to 2.4** (the `Menu` + `MenuOpenContext` are 2.4's unit).

The optional `onClick` prop is the single seam that lets the same component serve both: the desktop mount
passes nothing; the mobile menu passes a close-handler in 2.4. So this story ships a **single shared
component, visibly mounted on desktop**, while 2.4 composes the same component for mobile without
re-implementing it. The sidebar **identity grid** (portrait/name/job-title/socials, `layout.js:94–103`)
sits **above** the `<nav>` in the archive and is **2.3's** job — leave that seam empty; just add the `<nav>`.

### Archive `xl: mr-0` quirk — port verbatim, do not silently "fix" (NFR1/NFR7)

The archive sidebar `<nav>` className is `pt-8 mr-3.5 xl: mr-0 lg:pt-0 …` — note the **space** in
`xl: mr-0`, which makes `xl:` a dangling no-op prefix and `mr-0` an unconditional class (almost certainly
an unintended typo, not an intentional quirk). The zero-regression bar (NFR1) is "match the **rendered**
live site", so the safest move is to **port the className verbatim, space included**, and flag it for the
Story 4.1 visual-diff gate rather than pre-emptively normalising it to `xl:mr-0` (which would _change_
rendered margins at `xl`). Do not silently rewrite it; if a parity defect shows up at 4.1, fix it then and
record it. If you do decide to correct it now, that is a conscious parity call — capture it in ADR 0016.

### Active-link detection: Gatsby `getProps` → `usePathname` (AR8) — the substantive port

The archive uses Gatsby's `<Link getProps={isActive}>` callback that pushes the active result into local
`useState`:

```js
const isActive = ({ href, location: { pathname } }) =>
  (href === '/' && pathname === href) ||
  (href !== '/' && pathname.startsWith(href))
    ? setIsCurrent(true)
    : setIsCurrent(false);
const [isCurrent, setIsCurrent] = useState(false);
```

The idiomatic-Next replacement is **`usePathname()` derived state** — no `useState`, no effect, no
callback. The client component re-renders on navigation, so deriving `isCurrent` on each render is
correct and simpler:

```tsx
const pathname = usePathname();
const isCurrent =
  (to === '/' && pathname === to) || (to !== '/' && pathname.startsWith(to));
```

**Preserve the match rule verbatim** — home matches by exact equality (so it isn't highlighted on every
route, since every path `startsWith('/')`), the others by `startsWith` (so `/resume` stays active on any
`/resume/...` sub-path). This is the same logic, just sourced from `usePathname` instead of Gatsby's
location prop. Capture in ADR 0016.

**Static-export pathname note:** `next.config` uses `output: 'export'`; `usePathname()` returns the
path **without** a trailing slash (e.g. `/about-me`), matching the archive's `startsWith` expectations.
No trailing-slash handling needed.

### `next/link` vs `gatsby` Link — the API differences to get right

- Import `Link` from **`next/link`** (built-in; no dependency to add).
- The prop is **`href`**, not Gatsby's `to`. Keep your component's own prop named `to` if you like (it
  mirrors the archive), but pass it as `href={to}` to `next/link`.
- `onClick` passes straight through to `next/link` and fires on click (used by the 2.4 menu to close).
- Keep the `<Link className="w-full flex" …>` wrapper classes verbatim.

### Download CV stays a plain `<a download>` (FR16, AR10)

The CV link is a **file download**, not in-app navigation — keep it as a native
`<a href="/pdfs/zac-braddy.pdf" target="_blank" rel="noreferrer" download>`. Do **not** route it through
`next/link`. AR10 ("static assets relocate `static/` → `public/`; URL references unchanged") is satisfied
by copying the PDF into `public/pdfs/` so `/pdfs/zac-braddy.pdf` resolves identically to today. The Gatsby
`static/` copy stays in place until the Epic 4 cutover (AR1 — the Gatsby build runs untouched).

### Server/Client boundary (NFR5, AR14)

- `nav-link.tsx` — **`'use client'` leaf** (reads `usePathname`). This is the only client surface 2.2 adds.
- `nav-links.tsx` — **directive-free.** It renders client `NavLink` leaves + a static `<a>`. Because it has
  no client hooks, it composes into a Server Component parent (2.3 sidebar) **or** a Client Component parent
  (2.4 menu). Note: a function `onClick` can only be passed parent→child when the parent is a Client
  Component; the desktop sidebar (server) passes no `onClick`, the mobile menu (client) passes the
  close-handler — both legal. Do **not** slap `'use client'` on `nav-links.tsx` "just in case"; keep the
  client boundary at the leaf (NFR5: interactivity pushed to leaves).
- `FontAwesomeIcon` works inside client components (see `theme-toggle.tsx`). `layout.tsx` already sets
  `config.autoAddCss = false` + imports the FA CSS globally, so icons render without per-component CSS setup.

### Project structure & conventions (from project-context.md — note the Theseus divergence)

- **Atomic design:** the nav-item is an **atom** (`src/components/atoms/nav-link.tsx`); the nav-list is a
  **molecule** (`src/components/molecules/nav-links.tsx`) — matching both the archive tiering and the 2.1
  layout (`atoms/animate-on-change.tsx`, `molecules/content-transition.tsx`). Filenames **kebab-case**,
  component identifiers **PascalCase**.
- **TypeScript strict, no `.js` source** (AR2) — all new files are `.tsx`. Use TS prop types, **not**
  `PropTypes` (project-context.md's PropTypes guidance describes the **archive** JS stack; the Theseus
  rebuild is TS — follow the Theseus artifacts where they diverge, as Stories 1.7 and 2.1 established).
- **Prettier is law** (`^3.8.4`): single quotes, `arrowParens: avoid` (`arg => …`). Run `npm run format`.
  Husky `pretty-quick --staged` runs on commit.
- **No code comments by default** (and the global rule: don't leave "removed code" comments).
- **British spelling** in any user-facing copy (the labels are fixed parity strings — port verbatim,
  including "Content I've Created"); keep CSS/JS identifiers canonical.
- **Themed colours only** — `text-secondary` and `border-secondary` are already mapped to `--color-*`
  tokens in `src/app/globals.css` (`@utility text-secondary` / `@utility border-secondary`; verified
  present). Do **not** hardcode hex; do **not** build class names by interpolation — write static class
  strings (the active class is the literal `'text-secondary font-bold'`).

### Scope seams — do NOT build now (NFR6)

Out of scope for 2.2, do not stub or pre-build: the desktop sidebar **identity grid** — portrait, name,
`config.JOB_TITLE`, socials (2.3); the burger `Menu` + `MenuOpenContext` provider (2.4); the custom
scrollbar + `Math.random()` scroll reset (2.5); the loading spinner (2.6). Do **not** create
`src/config` here — `JOB_TITLE` is a 2.3 concern. Do **not** add `react-burger-menu` / `react-custom-scroll`.
You **do** edit `layout.tsx` in this story — but **only** to add the `<nav>` + `<NavLinks />` into the
sidebar container; do not touch the identity-grid seam, the content pane, or anything else.

### Testing standards (AR13 — no suite to fabricate)

No test framework exists; `npm test` is a stub that exits 1 — **do not run it as a test, do not invent a
suite**. Verification is: `npm run build` green + pure static export, `npm run lint` clean, and **manual
visual parity in the mounted desktop sidebar** (labels/icons/order/Home-active/Download CV, both themes, at
`lg`+; nav correctly hidden below `lg`). Record real command outputs in the Dev Agent Record; do not claim
parity you haven't visually checked. Full `startsWith` active-state parity across multiple routes (and the
mobile menu) lands once Epic 3 adds routes / with 2.4 and the Story 4.1 parity gate — an optional throwaway
route can spot-check it now (remove before finishing).

### Project Structure Notes

- New files align with the established Theseus tree: `src/components/atoms/nav-link.tsx`,
  `src/components/molecules/nav-links.tsx` (same tiers as the archive originals and the 2.1 ports).
- `public/pdfs/zac-braddy.pdf` mirrors the archive `static/pdfs/zac-braddy.pdf` path one-for-one so the
  URL is unchanged (AR10).
- No conflicts with the unified structure. The only naming nuance: the component keeps the archive prop
  name `to` for the destination while passing it to `next/link` as `href` — an intentional, minimal
  echo of the archive surface.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.2] — the three Given/When/Then ACs (nav items;
  Download CV; single shared component).
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 2] — shell decomposition (2.1–2.6 split; 2.2 = the
  shared nav, 2.3 = sidebar, 2.4 = burger menu).
- [Source: _bmad-output/planning-artifacts/epics.md#Additional Requirements] — AR8 (`useLocation`/`getProps`
  → `usePathname`/`useRouter` from `next/navigation`, client only), AR10 (static assets `static/` → `public/`,
  URLs unchanged), AR14 (Server/Client boundary — interactivity at leaves), AR13 (tooling / no fabricated suite).
- [Source: archive/src/components/molecules/nav-links.js] — the four items (labels/icons/order/destinations)
  - the Download CV `<a>` (classes, `target`/`rel`/`download`, `/pdfs/zac-braddy.pdf`) to port verbatim.
- [Source: archive/src/components/atoms/nav-link.js] — the nav-item wrapper classes + the `isActive`
  match rule (home-exact / others-`startsWith`) to preserve, with the Gatsby `getProps`/`useState` mechanism
  replaced by `usePathname`.
- [Source: archive/src/components/layout.js:83,104–105] — the two consumers (mobile menu with `onClick`
  close-handler; desktop sidebar `<nav>` with no `onClick`) — confirms the optional-`onClick` shared design.
- [Source: archive/static/pdfs/zac-braddy.pdf] — the CV file to relocate to `public/pdfs/` (AR10).
- [Source: src/app/layout.tsx] — current root layout; the empty sidebar container (`styles.hero` div, line
  73–75) is where the `<nav>` + `<NavLinks />` mount in this story (the identity grid above it stays a 2.3
  seam). Keep the file a Server Component.
- [Source: src/components/atoms/theme-toggle.tsx] — the established Theseus FontAwesome usage pattern
  (`FontAwesomeIcon` + `@fortawesome/free-solid-svg-icons`) in a `'use client'` component.
- [Source: src/app/globals.css] — the `@utility text-secondary` / `border-secondary` tokens the nav classes
  resolve against (verified present); do not modify here.
- [Source: _bmad-output/implementation-artifacts/2-1-persistent-layout-shell-content-pane-and-animations.md]
  — prior story: quality/format bar, the throwaway-harness verification pattern (and the `_`-prefix-route
  404 gotcha), Theseus-vs-archive divergence note, decision-capture discipline, the 2.1–2.6 seam table.
- [Source: docs/decisions/_template.md + README.md] — ADR format + index for the 0016 capture (Task 5);
  0015 is the highest existing number.
- [Source: _bmad-output/project-context.md] — JS/TS rules, Prettier law, atomic structure, themed-colour +
  no-interpolated-classnames rules (describes the **archive** stack; follow Theseus artifacts where they diverge).

## Dev Agent Record

### Agent Model Used

claude-opus-4-8 (BMad dev-story workflow).

### Debug Log References

- `npm run format` → all files clean (new files reported `unchanged` — already
  Prettier-conformant on write; ADR 0016 + README reflowed by Prettier).
- `npm run lint` → clean, zero errors (`eslint .`, flat config `next/core-web-vitals` +
  `next/typescript` + prettier). The "Content I've Created" apostrophe is written as `&apos;`
  to satisfy `react/no-unescaped-entities` (rendered output identical to a literal apostrophe).
- `npm run build` → green, Next.js 16.2.9, TypeScript strict passed, **pure static export** —
  routes `○ (Static)`: `/`, `/_not-found`, `/icon.svg`. No functions.
- Static-export checks against `out/`:
  - `out/pdfs/zac-braddy.pdf` present and **byte-identical** (`cmp`) to
    `archive/static/pdfs/zac-braddy.pdf`; resolves at `/pdfs/zac-braddy.pdf`.
  - `out/index.html` contains all four labels (Home, About Me, Resume, Content I&#x27;ve
    Created) + "Download CV" with `href="/pdfs/zac-braddy.pdf"`.
  - Active-state on `/`: only the **Home** item carries `text-secondary font-bold`; the other
    three carry the base class only.
- `startsWith` branch spot-checked with a **throwaway** `src/app/resume/page.tsx`: on
  `/resume` only the **Resume** item was active and **Home was not** (confirms home's exact-match
  vs others' `startsWith`). Throwaway route **removed**; rebuild returned to the clean 3-route
  export and lint stayed green. Not committed.
- `npm test` intentionally **not** run (stub `exit 1` — AR13).

### Completion Notes List

- Ported `archive/.../nav-link.js` → `src/components/atoms/nav-link.tsx` as the single
  `'use client'` leaf; Gatsby `<Link getProps>` + `useState` replaced by a `usePathname()`-derived
  `isCurrent` (no `useState`/`useEffect`), match rule preserved verbatim, active class kept a
  static literal. Props typed (`IconDefinition`, no `any`).
- Ported `archive/.../nav-links.js` → `src/components/molecules/nav-links.tsx`, **directive-free**
  (client boundary stays at the leaf), four `NavLink`s in archive order with verbatim icons/labels/
  destinations, Download CV as a plain `<a download>` (not `next/link`), `onClick` passed through.
- Mounted `<nav>…<NavLinks /></nav>` into the previously-empty sidebar container in `layout.tsx`
  (`hidden lg:flex`), className ported **verbatim including the archive `xl: mr-0` space quirk**
  (flagged for the Story 4.1 visual gate, recorded in ADR 0016). `layout.tsx` stays a Server
  Component and keeps its `metadata` export; content pane / `ContentTransition` / `ThemeToggle`
  untouched.
- Relocated the CV PDF to `public/pdfs/zac-braddy.pdf` (URL unchanged, AR10); archive copy left in
  place (AR1 — Gatsby build runs until Epic 4 cutover).
- Decision capture: ADR `0016` written and indexed in `docs/decisions/README.md`.
- **Scope held (NFR6):** no sidebar identity grid (2.3), no burger menu / `MenuOpenContext` (2.4),
  no scrollbar (2.5), no spinner (2.6), no `src/config`. No new runtime dependency.
- **Verification honesty:** parity was verified by inspecting the rendered static-export HTML
  (labels/icons/order/active-state/`hidden lg:flex`) and confirming the themed tokens
  (`text-secondary`/`border-secondary`) are present and mapped in `globals.css` — themed colours
  therefore resolve identically across dark/light. A final live both-theme glance at `npm run dev`
  (and the below-`lg` hidden check) is recommended at Zac's side; full multi-route + mobile active
  parity lands with Epic 3 routes / the Story 4.1 visual-diff gate.

### File List

- `public/pdfs/zac-braddy.pdf` (new — copied from `archive/static/pdfs/`)
- `src/components/atoms/nav-link.tsx` (new)
- `src/components/molecules/nav-links.tsx` (new)
- `src/app/layout.tsx` (modified — `NavLinks` import + `<nav>` mount in the sidebar container)
- `docs/decisions/0016-shared-nav-active-link-port-and-sidebar-mount.md` (new)
- `docs/decisions/README.md` (modified — 0016 index row)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified — story status)
- `_bmad-output/implementation-artifacts/2-2-primary-navigation-and-the-download-cv-action.md`
  (modified — frontmatter/baseline, checkboxes, Dev Agent Record, status)

## Change Log

| Date       | Change                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------- |
| 2026-06-15 | Story created (ready-for-dev).                                                                                |
| 2026-06-15 | Implemented: shared nav (atom+molecule), desktop-sidebar mount, CV-PDF relocation, ADR 0016. Status → review. |
