---
baseline_commit: a4f7833
---

# Story 2.4: Build the two-pane reading room and sectioned navigation

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a technical evaluator,
I want a calm two-pane reading room with a sectioned, scannable navigation of the docs,
so that I can see the shape of the decision set at a glance and move between docs easily, on desktop or mobile (UJ-2).

## Acceptance Criteria

1. **Two-pane reading room at `lg+` (UX-DR2, AR-7/D4).** `src/app/backroom/layout.tsx` is upgraded from the current single centred column to a **near-full-bleed two-pane shell inside a 48px gradient frame on all sides**: a **320px** left nav panel (`bg-primary-200`) that **scrolls independently**, and a flexible content pane (`bg-primary-400`) with **56px** horizontal padding whose reading column is capped at **64ch**, left-aligned (the 64ch cap is already enforced by the existing `doc-content.module.css` — do **not** add a second cap in the layout). Depth is **flat/tonal**: the one-step `bg-primary-200`↔`bg-primary-400` difference plus at most a **single soft drop-shadow** to lift the shell off the gradient — no heavy borders, no glows. No hardcoded colours; the theme toggle works across both panes (UX-DR19). Working radius `rounded.md` (8px).

2. **Sectioned nav built from the Velite typed `docs` array (FR-8, AR-14, UX-DR4/5/6/7/15).** A `backroom-nav` **organism** (Server Component) imports `docs` from `@velite`, groups rows under section labels in the fixed order **OVERVIEW → DECISIONS → PRAGMATISM & PROCESS**, and **omits any empty section**. Within DECISIONS, rows sort by `adr` ascending; within other sections by `order` ascending; **`order`/`adr` collisions fall back to a stable secondary sort by `slug` (filename)**. Each row is a `backroom-nav-row` **molecule**: the **whole row is one `<Link>`** to its doc route (Overview → `/backroom`; every other doc → `/backroom/<slug>`), rendering a **40px tile + nav-row title + one `text-dim` teaser line**, with a hover wash, a `selected` state (cyan-tint background + left cyan accent bar + inverted tile fill) and **`aria-current="page"`** on the row whose route matches the current path. Tiles are atoms: `number-tile` (cyan, the zero-padded `adr` number — e.g. `04`), `glyph-tile` (gold ◆ for _Pragmatism & process_, gold ★ for _Overview_); `section-label` is a tracked dim-caps atom. A **new `docs/public/*.md` slots into its section on the next build with no manual nav edit** (UJ-3) — the nav is a pure function of `docs`.

3. **Responsive collapse below `lg` (UX-DR3) + accessibility floor (UX-DR18, NFR-5).** Below `lg` the layout is a **single full-width column**, the desktop nav panel is hidden, and the **entire nav (back link + section labels + rows) moves into a hamburger drawer** mirroring the front-of-house vaul mobile pattern; the content runs full-width. The Backroom uses **semantic HTML** — the nav is a **labelled landmark**, content is a `<main>`, headings stay in order (from `doc-content`), lists/`<a>` are real elements — **tab order matches reading order**, **focus is visible**, the active row carries `aria-current="page"`, and the drawer is **keyboard-operable** (Esc-close, focus trap — inherited from vaul). The `xs: 410px` custom breakpoint applies as elsewhere.

4. **Conditional route-transition gate (AR-8 / G4) + verification (AR-15).** The new Backroom layout is authored taking the **path of least resistance** — no special work to add _or_ remove a route transition. The expected (and recommended) outcome is **no inter-doc transition** (the layout simply does not import `ContentTransition`/`FrozenRouter`, exactly as the current minimal layout already omits them). **If** the least-resistance result somehow leaves the Backroom **with** transitions, surface it for Zac (approve-with-transitions or require removal); **if none**, ship as-is — do **not** re-introduce a transition without that review. `npm run build` is green with **every Backroom route static** (`/backroom`, `/backroom/framework-decision`, `/backroom/deferring-the-polish`, `/backroom/building-with-ai-and-bmad` — no `.func`), the **front-of-house shows zero regression** (NFR-2 — this story touches **no** `(site)`/`SiteShell` files under the recommended approach), `npm run lint` is clean, and no test runs are fabricated.

## Tasks / Subtasks

- [x] **Task 1 — Build the tile + label atoms (AC: #2)**
  - [x] `src/components/atoms/section-label.tsx` — presentational; renders tracked dim caps. Type scale UX-DR16: 10.5px / 700 / `letter-spacing 0.14em`, uppercase, `text-dim` at ~0.7 opacity. Tailwind: `text-[10.5px] font-bold tracking-[0.14em] uppercase text-dim opacity-70` (or a small CSS module — your call). Takes `children`.
  - [x] `src/components/atoms/number-tile.tsx` — 40px square (`w-10 h-10`), 8px radius (`rounded-md`), grid-centred, `bg-primary-400` fg `text-secondary`, `1px` border `rgba(4,180,224,0.4)`, font 15px/700. Renders the **zero-padded-to-2-digits** `adr` (`String(adr).padStart(2, '0')` → `04`, `09`, `18`, `25` — matches the mock). Prop `{ adr: number; selected: boolean }`. **Selected** → solid cyan fill (`bg-secondary`) with `bg-primary-400` text colour (the mock's `background: var(--secondary); color: var(--bg-primary-400)`), border cyan.
  - [x] `src/components/atoms/glyph-tile.tsx` — same box as `number-tile` but **gold**: fg `text-tertiary`, border `1px rgba(224,180,4,0.45)`, glyph 18px. Prop `{ glyph: string; selected: boolean }` (callers pass `★` U+2605 for Overview, `◆` U+2666 for Pragmatism & process). **Selected** → solid **gold** fill (`bg-tertiary`) with `bg-primary-400` text (see Dev Notes "Flagged decision 2 — selected glyph-tile fill"; recommended gold, flagged for Zac).
  - [x] Use the existing `@utility` theme tokens for solid colours (`bg-secondary`, `text-secondary`, `bg-tertiary`, `text-tertiary`, `bg-primary-400`) so they flip with the theme; use Tailwind **arbitrary-value** classes only for the DESIGN-specified low-alpha **border rgba** (`border-[rgba(4,180,224,0.4)]` / `border-[rgba(224,180,4,0.45)]`). These tiny atoms have **no hooks** — keep them as plain presentational components (they will be bundled client-side because the row that renders them is a client component; that is fine, they are trivial).
- [x] **Task 2 — Build the `backroom-nav-row` molecule (client leaf) (AC: #2, #3)**
  - [x] `src/components/molecules/backroom-nav-row.tsx` — `'use client'` (needs `usePathname`, mirroring `atoms/nav-link.tsx`). Props `{ href: string; title: string; teaser: string; section: Doc['section']; adr?: number }`.
  - [x] Compute `isCurrent = usePathname() === href` (exact match — these are leaf routes; Overview's `href` is `/backroom`, doc rows are `/backroom/<slug>`; no `startsWith`).
  - [x] Whole row is one `<Link href={href}>`. Grid `40px 1fr`, 12px gap, `p-[10px_12px]`, `rounded-md`, `border-l-[3px] border-transparent`. **Hover:** `hover:bg-[rgba(250,250,250,0.06)]`. **Selected (`isCurrent`):** `bg-[rgba(4,180,224,0.14)]` + `border-l-secondary` (left cyan accent bar) + pass `selected` to the tile. Set `aria-current={isCurrent ? 'page' : undefined}` on the `<Link>`.
  - [x] Tile choice: `section === 'Decisions'` (has `adr`) → `<NumberTile adr={adr} selected={isCurrent} />`; `section === 'Overview'` → `<GlyphTile glyph="★" selected={isCurrent} />`; `section === 'Pragmatism & process'` → `<GlyphTile glyph="◆" selected={isCurrent} />`.
  - [x] Text block: `title` (`text-[14px] font-medium leading-[1.25] text-primary`) over `teaser` (`text-[12px] leading-[1.3] text-dim mt-[3px]`).
  - [x] **Close the mobile drawer on navigation:** call `useMenuOpen().setMenuOpen(false)` in the row's `onClick`. This is a no-op on desktop (drawer already closed) and closes the drawer on mobile — one shared row component serves both surfaces (mirrors how `NavLinks` takes an `onClick`). See Dev Notes "Mobile drawer reuse".
- [x] **Task 3 — Build the `backroom-nav` organism (server, data-driven) (AC: #2)**
  - [x] `src/components/organisms/backroom-nav.tsx` — **Server Component** (no `'use client'`). Imports `import { docs, type Doc } from '@velite'`.
  - [x] Group `docs` by `section` into the fixed order `['Overview', 'Decisions', 'Pragmatism & process']`; **skip any section with zero docs**. Sort within a section: Decisions by `adr` asc then `slug`; others by `order` asc then `slug`. (Helper: `[...sectionDocs].sort((a, b) => (a.adr ?? a.order) - (b.adr ?? b.order) || a.slug.localeCompare(b.slug))` — or split the two cases explicitly.)
  - [x] For each section, render a `<SectionLabel>` then the rows. Map each doc to a `<BackroomNavRow href={doc.section === 'Overview' ? '/backroom' : `/backroom/${doc.slug}`} title={doc.title} teaser={doc.teaser} section={doc.section} adr={doc.adr} />`.
  - [x] **Do NOT pass `doc.content`** into the row (or any client component). `backroom-nav` reads only `{ section, order, adr, slug, title, teaser }`. See Dev Notes "RSC payload gotcha (don't ship `doc.content` to the client)".
  - [x] `backroom-nav` renders the **rows + labels only** (no `<nav>` wrapper) — the layout's rail provides the single `<nav aria-label="…">` landmark (Task 4), mirroring how the FoH rail wraps `NavLinks` in a `<nav>`.
- [x] **Task 4 — Upgrade `backroom/layout.tsx` to the two-pane shell + mount the mobile drawer (AC: #1, #3, #4)**
  - [x] Replace the current `<main className="p-2 min-h-screen"><div className="max-w-screen-md …"><BackLink/>…</div></main>` body with the two-pane shell. Recommended structure (Server Component; tune classes to match the mock — see Dev Notes "Two-pane layout — exact spec"):
    - **`lg+`:** root `lg:h-screen lg:overflow-hidden lg:p-12` (48px frame) → shell `lg:grid lg:grid-cols-[320px_1fr] lg:h-[calc(100vh-96px)] rounded-md overflow-hidden lg:shadow-[0_10px_40px_rgba(0,0,0,0.25)]` → left `<nav aria-label="Backroom documentation" className="hidden lg:flex lg:flex-col gap-1.5 bg-primary-200 overflow-y-auto py-[18px]">` holding `<BackLink/>` then `<BackroomNav/>`; right `<main className="bg-primary-400 lg:px-14 lg:py-12 overflow-y-auto">{children}</main>`.
    - **`< lg`:** single full-width column — the `<nav>` rail is `hidden lg:flex` (so it disappears); the `<main>` runs full-width with sensible padding (e.g. `p-4`/`pt-8`); the drawer (next subtask) is the only nav surface.
  - [x] Mount the **mobile drawer** with the same nav content, passed as **server-rendered children** so `doc.content` never enters the client bundle: `<BackroomMobileMenu><BackLink/><BackroomNav/></BackroomMobileMenu>` (the drawer's internals are `lg:hidden`). See Dev Notes "Mobile drawer reuse" for the recommended dedicated-drawer approach.
  - [x] **Do NOT** import `ContentTransition`/`FrozenRouter`/`CustomScroll` (AR-8/G4 — least resistance = no transition; the panes scroll via native `overflow-y-auto`). Front↔back navigation stays a plain navigation.
  - [x] Keep `BackLink` (already exists, `src/components/atoms/back-link.tsx`) — reuse as-is, at the top of the rail and at the top of the drawer (matches the mock).
- [x] **Task 5 — The Backroom mobile drawer (AC: #3)**
  - [x] **Recommended (Option A — zero FoH touch):** create `src/components/molecules/backroom-mobile-menu.tsx` — `'use client'`; a dedicated vaul drawer mirroring `mobile-menu.tsx` (same `Drawer.Root direction="right"` driven by `useMenuOpen()`, same burger `Drawer.Trigger` + `Drawer.Close` + `Drawer.Title sr-only`), **reusing the existing `mobile-menu.module.css`** for `burgerButton`/`overlay`/`panel`/`closeButton`/`itemList`. It renders `{children}` (the back link + nav passed from the server layout) inside `Drawer.Content`. Do **not** import `NavLinks` here. (See Dev Notes for why a dedicated drawer beats parametrising the shared `MobileMenu`.)
  - [x] Confirm the drawer's fixed burger (top-right, `z-index:1000`) does **not** collide with the theme toggle (top-left) and that opening it shows the back link + the full sectioned nav; selecting a row navigates **and** closes the drawer (via the row's `setMenuOpen(false)`); Esc and the close button work (vaul default).
- [x] **Task 6 — Backroom 404 centring in the new pane (folds in the deferred item) (AC: #1)**
  - [x] The two-pane content pane now gives `backroom/not-found.tsx` (which renders `NotFoundContent`) a height ancestor. Verify `NotFoundContent` (`h-full … justify-center`) centres in the content pane; if it still collapses to the top, give the pane / its inner wrapper the `h-full` chain it needs (small, contained fix). This closes the carried `deferred-work.md` item _"NotFoundContent vertical centering breaks inside BackroomLayout … backroom-404 styling is a later (2.4) story."_ The **duplicated-404-metadata** deferred item stays deferred (out of scope unless trivially resolved while here).
- [x] **Task 7 — Build/lint/static-export + zero-regression gates (AC: #4)**
  - [x] `npm run build` → green, **pure static export**: `/backroom` (`○ (Static)`) and the three `/backroom/<slug>` routes (`○ (Static)` or `● (SSG)` — 2.3 emitted the slug routes as `● (SSG)`; both are prerendered, the gate is **no `.func` in `out/`**). FoH routes still static. (Velite runs first via `next.config.mjs`; if `@velite` ever looks unresolved, that is the known fresh-checkout ordering quirk — a build regenerates `.velite/`.)
  - [x] `npm run lint` → clean (watch for unused imports; `usePathname` only in the new client row).
  - [x] **FoH zero-regression (NFR-2):** under Option A this story edits **no** `(site)`/`SiteShell`/`MobileMenu`/`NavLinks` file, so FoH is unchanged by construction — confirm the FoH routes build identically and (Zac, on `npm run dev`/preview) the sidebar/hero/nav/route-transition/mobile drawer behave exactly as before.
  - [x] **Manual (Zac, on `npm run dev`/preview — not headlessly verifiable):** two-pane layout at `lg+` with independent nav/content scroll; **theme toggle** flips both panes and the nav (cyan↔blue, gold↔terracotta, `bg-primary-*`) with code/prose legible; the **selected row** (Overview by default on `/backroom`; the doc's row on `/backroom/<slug>`) shows cyan tint + accent bar + inverted tile and `aria-current="page"`; **below `lg`** the rail is gone, the hamburger opens the full nav, a row navigates + closes the drawer, content is full-width; keyboard tab order + visible focus on rows; the **G4 transition review** (expected: none → ship as-is).

## Dev Notes

### What this story is (and is not)

This is the **visible Backroom** — it turns the minimal isolated room from Story 2.2 (a centred column with a back-link) into the **two-pane reading room** from the mock: a 320px sectioned nav rail beside the `doc-content` pane (Story 2.3), with the whole nav collapsing into the vaul drawer below `lg`. It builds the nav component tree (`backroom-nav` organism → `backroom-nav-row` molecule → `number-tile`/`glyph-tile`/`section-label` atoms) driven entirely by the Velite typed `docs` array, plus a Backroom mobile drawer. It is **not**: the new Decisions content (Story **2.5** adds ~10 MADR docs that this nav will render automatically), the Shiki-fallback patch (Story 2.5), the front-of-house **Entry link** (Story **2.6**), or the **console egg** (Story **2.7**). No pipeline/Velite/`globals.css`-token changes, no new dependencies. Discipline: **calm and content-first over flash** (SM-C1/SM-C2), stay thin. [Source: epics.md#Story-2.4, #Epic-2, #AR-7/8/14; architecture.md#D4; DESIGN.md; EXPERIENCE.md; sprint-change-proposal-2026-06-29.md]

### Current state — what you're building on (READ before editing)

`src/app/backroom/layout.tsx` **today** (the thing Task 4 replaces):

```tsx
import BackLink from '@/components/atoms/back-link';

export default function BackroomLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="p-2 min-h-screen">
      <div className="max-w-screen-md mx-auto pt-8">
        <BackLink />
        <div className="pt-8">{children}</div>
      </div>
    </main>
  );
}
```

- `src/app/backroom/page.tsx` (Overview) selects `docs.find(d => d.section === 'Overview')` → renders `<DocContent doc={doc} />`. `src/app/backroom/[slug]/page.tsx` has `dynamicParams = false` + `generateStaticParams()` over every non-Overview doc. **Both already work and are unchanged by this story** — you only change the _layout_ that wraps them.
- `src/components/atoms/back-link.tsx` exists: `<Link href="/" className="text-dim hover:text-secondary">◀ back to the site</Link>`. Reuse as-is.
- `src/components/organisms/doc-content.tsx` already renders the doc header (eyebrow + Permanent-Marker title + ADR meta) and injects `doc.content` HTML; `doc-content.module.css` **already caps the prose to 64ch**. The layout's content pane only supplies the `bg-primary-400` surface + 56px padding + independent scroll — **don't re-cap to 64ch**.
- `MenuProvider` is mounted **globally** in the root layout (wraps all children incl. `/backroom`), so `useMenuOpen()` is available inside the Backroom tree. `mobile-menu.module.css` (`burgerButton`/`overlay`/`panel`/`closeButton`/`itemList`) is reusable. [Source: codebase map; src/app/backroom/*; src/components/atoms/back-link.tsx; src/components/organisms/doc-content.*; src/context/menu-open-context.tsx]

### The FoH two-pane pattern to mirror (`SiteShell`)

`src/components/organisms/site-shell.tsx` is the existing two-pane reference — mirror its _approach_, not its exact classes:

- **Left rail:** `lg:w-72 lg:bg-primary-200`, with a `<nav className="… hidden lg:flex">` holding `<NavLinks />`. The rail is `hidden`/collapsed below `lg`.
- **Right content pane:** `bg-primary-400 rounded … overflow-hidden`, wraps children.
- **Mobile:** `<MobileMenu />` (vaul drawer) sits _outside_ `<main>`; it is the only nav below `lg`.
- **Mobile vs desktop is pure CSS** (`hidden lg:flex` rail vs `lg:hidden` drawer). **There is no `useMediaQuery`/JS breakpoint hook** in the project (the only `matchMedia` is MobileMenu's auto-close). Build the Backroom responsive split the same way — Tailwind `lg:` utilities, **not** JS. [Source: codebase map; src/components/organisms/site-shell.tsx]

### Two-pane layout — exact spec (from the mock + DESIGN tokens)

`backroom-mock.html` is the composition reference (DESIGN/EXPERIENCE spines win on conflict). Translate its CSS into Tailwind utilities + the site's `@utility` tokens:

| Mock CSS                                                                                                                                                          | Backroom Tailwind                                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `body { padding: 48px }` (gradient frame)                                                                                                                         | `lg:p-12` on the layout root (48px); gradient already comes from the global `body::before`                                     |
| `.shell { display:grid; grid-template-columns:320px 1fr; height:calc(100vh - 96px); border-radius:8px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,.25) }` | `lg:grid lg:grid-cols-[320px_1fr] lg:h-[calc(100vh-96px)] rounded-md overflow-hidden lg:shadow-[0_10px_40px_rgba(0,0,0,0.25)]` |
| `.nav { background:var(--bg-primary-200); overflow-y:auto; padding:18px 0; display:flex; flex-direction:column; gap:6px }`                                        | `bg-primary-200 overflow-y-auto py-[18px] flex flex-col gap-1.5` + `hidden lg:flex`                                            |
| `.content { background:var(--bg-primary-400); padding:48px 56px; overflow-y:auto }`                                                                               | `bg-primary-400 lg:py-12 lg:px-14 overflow-y-auto`                                                                             |
| `.back { margin:0 18px 14px }`                                                                                                                                    | reuse `BackLink`; add the rail's own left padding/margins (`px-[18px]`) so rows + back link align                              |

- **Frame sizing (48px)** is so the page chrome — top-left theme toggle now, bottom-left Entry link in Story 2.6 — has breathing room and never crowds the shell. 48px = `p-12`; 56px pane padding = `px-14`; 320px rail = `grid-cols-[320px_1fr]` (320px is not a default width token). All `lg:`-gated.
- **`lg:h-screen lg:overflow-hidden`** on the layout root so only the panes scroll at `lg+`; below `lg` it's normal document flow (`min-h-screen`).
- **Depth:** the single `lg:shadow-[…]` is the one permitted soft drop-shadow; otherwise flat/tonal (UX-DR2, "Elevation & Depth"). No borders between panes — the `bg-primary-200`↔`bg-primary-400` one-step tonal difference does the separating. [Source: backroom-mock.html; DESIGN.md Layout/Elevation; UX-DR2]

### Nav row + tiles — exact spec (from the mock)

| Element               | Mock CSS                                                                                                        | Tailwind / tokens                                                                                                                      |
| --------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `.row`                | `grid 40px 1fr; gap:12px; padding:10px 12px; border-radius:8px; border-left:3px solid transparent`              | `grid grid-cols-[40px_1fr] gap-3 p-[10px_12px] rounded-md border-l-[3px] border-transparent`                                           |
| `.row:hover`          | `background: rgba(250,250,250,.06)`                                                                             | `hover:bg-[rgba(250,250,250,0.06)]`                                                                                                    |
| `.row.selected`       | `background: rgba(4,180,224,.14); border-left-color: var(--secondary)`                                          | `bg-[rgba(4,180,224,0.14)] border-l-secondary` (apply when `isCurrent`)                                                                |
| `.tile` (number)      | `40×40; radius 8; bg var(--bg-primary-400); color var(--secondary); border 1px rgba(4,180,224,.4); font 15/700` | `w-10 h-10 rounded-md grid place-items-center bg-primary-400 text-secondary border border-[rgba(4,180,224,0.4)] text-[15px] font-bold` |
| `.row.selected .tile` | `background var(--secondary); color var(--bg-primary-400)`                                                      | selected → `bg-secondary text-[var(--color-bg-primary-400)]`                                                                           |
| `.glyph`              | gold: `color var(--tertiary); border-color rgba(224,180,4,.45); font-size 18px`                                 | `text-tertiary border-[rgba(224,180,4,0.45)] text-[18px]`                                                                              |
| `.title`              | `14/500; line-height 1.25`                                                                                      | `text-[14px] font-medium leading-[1.25] text-primary`                                                                                  |
| `.teaser`             | `12; color var(--text-dim); line-height 1.3; margin-top 3px`                                                    | `text-[12px] text-dim leading-[1.3] mt-[3px]`                                                                                          |
| `.section-label`      | `10.5px; letter-spacing .14em; uppercase; color var(--text-dim); opacity .7; font-weight 700`                   | `text-[10.5px] tracking-[0.14em] uppercase text-dim opacity-70 font-bold`                                                              |

**Theme-token discipline:** use the `@utility` tokens (`text-secondary`, `bg-secondary`, `text-tertiary`, `bg-tertiary`, `bg-primary-400`, `text-primary`, `text-dim`) for all **solid** colours so they flip with `.light`. The four low-alpha rgba values (hover wash, selected wash, the two tile borders) are **DESIGN-specified literals** with no token equivalent — express them as static Tailwind arbitrary-value classes. They are **constant across themes** (the selected wash stays cyan-tinted even in light, where the accent token is blue) — this is the same call Story 2.3 made for the gold blockquote call-out and is consistent with DESIGN. Flag for Zac's light-theme eyeball (Flagged decision 3). `globals.css` is **not** edited in this story — all tokens already exist (`bg-primary-200/400`, `text-secondary/tertiary/primary/dim`, all confirmed present, both themes). [Source: backroom-mock.html; DESIGN.md components; UX-DR4/5/6/7/16; codebase map globals.css]

> Styling choice (minor, your call): the nav is **real JSX** (not injected HTML), so Tailwind utilities work directly — unlike `doc-content` which needed a CSS module for injected HTML. The arbitrary-value rgba classes are slightly ugly inline; a small `backroom-nav-row.module.css` (per the Story-2.3 precedent for DESIGN rgba) is equally acceptable. Default to Tailwind utilities to match the FoH nav's utilities-in-JSX style.

### The active-state pattern to mirror (`nav-link.tsx`) — and the `aria-current` upgrade

The FoH `src/components/atoms/nav-link.tsx` is the precedent: `'use client'` + `usePathname()`, active styling applied as a className string. **Two deltas for the Backroom row:**

1. The FoH nav has **no `aria-current`** today (active is visual-only). The Backroom row **adds `aria-current="page"`** (NFR-5/UX-DR18 require it) — net-new, set on the `<Link>` when `isCurrent`.
2. FoH uses `startsWith` for sub-routes; Backroom doc routes are **leaves**, so use **exact** `pathname === href` (otherwise `/backroom` would match every `/backroom/*`). Overview's href is `/backroom`; doc rows are `/backroom/<slug>`. [Source: codebase map; src/components/atoms/nav-link.tsx; UX-DR4/18]

### Mobile drawer reuse — recommended approach (Flagged decision 1)

The nav must appear in the vaul drawer below `lg`. The current `MobileMenu` (`src/components/molecules/mobile-menu.tsx`) **hardcodes `<NavLinks />`** (the FoH nav) and is a frozen FoH client island. Two ways to give the Backroom its drawer nav:

- **(A — RECOMMENDED) A dedicated `backroom-mobile-menu.tsx`.** A second vaul drawer that reuses `useMenuOpen()` + `mobile-menu.module.css`, rendering the Backroom nav (passed as children). **Zero FoH files touched** → the NFR-2/G1 zero-regression gate holds _by construction_. The two drawers are **never mounted at once** (different rooms / route trees), so sharing `useMenuOpen` state is harmless. Cost: ~25 lines of vaul structural JSX duplicated (styles stay DRY via the shared module). This is the pragmatic, low-blast-radius call.
- **(B) Parametrise the shared `MobileMenu`** to accept `children`. DRY in theory, but it cascades into touching **three** frozen FoH files: `MobileMenu` (signature), `SiteShell` (call site), and `NavLinks` (the close-on-select handler currently comes from `MobileMenu`'s scope via the `onClick` prop — passing content from a _Server Component_ parent means the rows must close via `useMenuOpen()` themselves instead). That is real regression surface on the highest-priority gate for little gain (only ever two rooms).

**Default to (A)** and surface the choice for Zac (per memory _don't-assert-secondhand-decisions-as-closed_). Either way: the drawer renders **server-rendered children** (`<BackLink/>` + `<BackroomNav/>`), and rows close the drawer via `useMenuOpen().setMenuOpen(false)`. [Source: codebase map; src/components/molecules/mobile-menu.tsx; architecture.md#D4 ("each room supplies its own MobileMenu contents into the shared vaul drawer"); CLAUDE.md "minimum necessary complexity"; memory]

### RSC payload gotcha — don't ship `doc.content` to the client

`doc.content` is the **full rendered HTML string** of each doc (Shiki baked in). If `backroom-nav` (which imports the `docs` array) ends up **inside the client bundle** — e.g. by being imported _into_ a client component like the drawer — the entire `docs` array, including every `content` string, ships to the browser. That bloats the bundle and breaks the "zero client JS for docs" intent (NFR-4).

**Avoid it with the children pattern:** keep `backroom-nav` a **Server Component**, and pass it as **`children`/props** into the client drawer (`<BackroomMobileMenu><BackroomNav/></BackroomMobileMenu>`). A client component that _accepts_ a server component as children does **not** pull it into the client bundle — the server renders it and streams the result. The only client leaf is `backroom-nav-row` (needs `usePathname`), and it receives just `{ href, title, teaser, section, adr }` — **never `content`**. Don't `import BackroomNav` _inside_ `BackroomMobileMenu`; receive it as `{children}`. [Source: React Server Components composition rules; codebase map; architecture.md#Component-boundary; NFR-4]

### Selected glyph-tile fill (Flagged decision 2)

UX-DR4 says a selected row's tile "inverts to a solid **cyan** fill"; UX-DR5 (number-tile) confirms cyan; UX-DR6 says the glyph-tile is "as number-tile but **gold**." It's ambiguous whether a _selected gold glyph_ tile inverts to **cyan** (literal "selected = cyan") or **gold** (preserving the section's colour identity). This matters immediately: **the Overview ★ row is `selected` by default on `/backroom`**.

- **Recommended:** selected `number-tile` → **cyan** fill; selected `glyph-tile` → **gold** fill (`bg-tertiary` + `bg-primary-400` text). DESIGN.md is emphatic that "cyan = decision/link, gold = judgement — keep that meaning consistent" (a **Do**); inverting the gold tile to cyan on selection breaks that. The cyan **row accent bar + wash** already signal selection regardless of tile colour.
- **Alt (literal spec):** all selected tiles → cyan fill.

Implement the recommended (per-section colour) version and **flag it for Zac** to confirm on visual QA. [Source: UX-DR4/5/6; DESIGN.md Do/Don'ts; EXPERIENCE.md State Patterns "Default entry → Overview … nav row selected"]

### Route transitions / scroll (AR-8 / G4)

Path of least resistance = **omit** `ContentTransition`/`FrozenRouter`/`CustomScroll` (all FoH-only client islands, wired into `SiteShell`). The current minimal Backroom layout already omits them, so the natural two-pane layout has **no inter-doc transition** — which is the recommended G4 outcome ("if none, ship as-is"). The independent nav/content scroll is plain `overflow-y-auto` on each pane (no `CustomScroll`). **Don't** add a transition; surface the G4 review for Zac after the build (expected: confirm none). [Source: architecture.md#D4/AR-8, #G4; codebase map content-transition/frozen-router]

### Component placement (atomic tiers) + file inventory

| File                                                   | Change             | Tier / notes                                                     |
| ------------------------------------------------------ | ------------------ | ---------------------------------------------------------------- |
| `src/components/atoms/section-label.tsx`               | **NEW**            | atom; tracked dim caps                                           |
| `src/components/atoms/number-tile.tsx`                 | **NEW**            | atom; cyan, zero-pad-2 `adr`                                     |
| `src/components/atoms/glyph-tile.tsx`                  | **NEW**            | atom; gold ★/◆                                                   |
| `src/components/molecules/backroom-nav-row.tsx`        | **NEW**            | molecule; `'use client'`; whole row one `<Link>`, `aria-current` |
| `src/components/molecules/backroom-mobile-menu.tsx`    | **NEW**            | molecule; `'use client'`; dedicated vaul drawer (Option A)       |
| `src/components/organisms/backroom-nav.tsx`            | **NEW**            | organism; server; groups/sorts `docs`, omits empty sections      |
| `src/app/backroom/layout.tsx`                          | **EDIT**           | two-pane shell + rail (`<nav>`) + mounted drawer                 |
| `src/components/molecules/backroom-nav-row.module.css` | **NEW (optional)** | only if you prefer a module over arbitrary-value classes         |

Reused unchanged: `back-link.tsx`, `doc-content.*`, `not-found-content.tsx` (verify centring, Task 6), `mobile-menu.module.css` (shared styles), `menu-open-context.tsx`. **No edits** to any `(site)`/`SiteShell`/`MobileMenu`/`NavLinks`/`globals.css`/`velite.config.ts`/`package.json` under the recommended approach. `'use client'` is confined to `backroom-nav-row` + `backroom-mobile-menu`; everything else (layout, `backroom-nav`, tiles, label) stays a Server Component. [Source: architecture.md#Component-Placement, #Project-Structure tree (lines 413–428); AR-14; project-context.md#Server-vs-Client]

### Verification standard (no test suite)

`npm test` is a stub (`exit 1`) — **no** test framework; do not fabricate test runs (AR-15). Verification is:

1. **Build:** `npm run build` green; `/backroom` + the three `/backroom/<slug>` routes prerendered (no `.func`); FoH routes unchanged. (Cold `rm -rf .velite && npm run build` if you touched anything build-adjacent — you shouldn't have.)
2. **Lint:** `npm run lint` clean.
3. **FoH zero-regression (NFR-2):** no `(site)`/SiteShell files edited → confirm FoH output is unchanged.
4. **Manual (Zac, `npm run dev`/preview — not headlessly verifiable):** two-pane layout + independent scroll at `lg+`; theme toggle flips both panes/nav; selected row (cyan tint + accent bar + inverted tile + `aria-current`); `< lg` rail-gone + hamburger nav + close-on-select + full-width content; keyboard tab order + visible focus; G4 transition review (expected none). [Source: project-context.md#Testing-Rules; epics.md#AR-15; architecture.md#G1/G4]

### Previous-story intelligence (2.1 / 2.2 / 2.3)

- **2.3 (done)** stood up the pipeline + `/backroom` (Overview) + `/backroom/[slug]` routes + `doc-content` (which **already caps 64ch** and owns the eyebrow/title/meta) + the `back-link` atom + `text-dim`/`code-surface`/`--shiki-*` tokens. **This story consumes that as-is** — no pipeline/token change. The four current docs: `start-here` (Overview), `framework-decision` (Decisions, adr 4), `deferring-the-polish` + `building-with-ai-and-bmad` (Pragmatism & process) → all three sections are populated, so you can see grouping/sort/omit working today; the Decisions group fills out in **2.5**. A flagged 2.3 follow-up (none of the docs ship a code block) is **2.5's** concern, not this story's.
- **2.2 (done)** created the plain `src/app/backroom/` folder (not a route group), the minimal layout this story upgrades, and `backroom/not-found.tsx` (renders inside the Backroom shell — Task 6 verifies its centring in the new pane). `MenuProvider` stays global.
- **Discipline carry-over.** Every prior story held a hard "stay thin, scope the diff, don't gold-plate" line and **surfaced flagged decisions for Zac** rather than baking them. Same here — surface the three flagged decisions (drawer approach, glyph-tile selected fill, constant rgba washes) and the G4 transition review. [Source: 2-1/2-2/2-3 stories; memory "don't-assert-secondhand-decisions-as-closed", "dont-be-dogmatic-about-purity-principles"]

### Git intelligence

Commits follow `feat: Project Ariadne story 2-N created` → `… code complete`, one focused diff per story (`a4f7833` = Story 2.3 code complete, the baseline here). Keep this diff scoped to the new Backroom nav/tile components + the layout upgrade + the dedicated drawer. **No** drive-by edits to FoH components, `globals.css`, the Velite config, or `package.json`. [Source: git log]

### Project Structure Notes

- New components land in their declared tiers (atoms: tiles/label; molecule: nav-row + mobile-menu; organism: backroom-nav) per the architecture tree (lines 413–428). [Source: architecture.md#Project-Structure]
- Tailwind-v4 discipline: utilities in JSX (no `tailwind.config.js`); the `xs:410px` + default `lg:1024px` breakpoints exist; theme tokens are `@utility` blocks; **don't** add tokens or `@layer base` CSS here (none needed). [Source: project-context.md#Tailwind; codebase map globals.css]
- Static-export law: no server APIs; the nav is a pure build-time function of `docs`; every route prerenders. [Source: project-context.md#Static-export; architecture.md#Build-time-vs-runtime]

### References

- [Source: epics.md#Story-2.4] — story statement + the four Given/When/Then AC groups (two-pane layout, sectioned nav + tiles, responsive + a11y, G4 gate + verification).
- [Source: epics.md#Epic-2, #AR-7, #AR-8, #AR-14, #AR-15, #NFR-2, #NFR-4, #NFR-5, #UX-DR2..7, #UX-DR15..19] — route-group rooms, MobileMenu-per-room, transition gate, component placement, verification, zero-regression, perf budget, a11y floor, the two-pane/nav/tile/responsive/typography/a11y/theme UX requirements.
- [Source: architecture.md#D4 (layout restructure, transitions least-resistance), #AR-14 (atomic tiers), #G1/#G4, #Project-Structure tree (lines 406–428), #Component-boundary] — the room split, the conditional transition gate, the target component tree, the RSC boundary.
- [Source: DESIGN.md] — colours/tokens (incl. `text-dim`), typography scale, Layout & Spacing (320px nav / 56px pad / 48px frame / 64ch), Elevation (flat/tonal, one soft shadow), the nav-row/number-tile/glyph-tile/section-label/back-link component specs, the Do/Don'ts (Permanent Marker once; accent points-not-fills; no hardcoded hex; don't grow FoH flash).
- [Source: EXPERIENCE.md] — IA + the sectioned-nav structure diagram, voice/microcopy (`◀ back to the site`, section labels, teasers), component behaviours (nav row / sectioned nav / back link / drawer), State Patterns (default→Overview selected; reading→aria-current; mobile→drawer; theme toggle), Interaction Primitives (link-based nav, keyboard, independent scroll), Accessibility Floor, Responsive table, Flow 2 (the side-door journey).
- [Source: backroom-mock.html] — the desktop two-pane composition (grid 320/1fr, 48px frame, `calc(100vh-96px)`, the nav/row/tile/selected CSS) — composition reference; spines win on conflict.
- [Source: src/app/backroom/layout.tsx, /page.tsx, /[slug]/page.tsx, /not-found.tsx] — the room this story upgrades; the routes/pages it leaves unchanged.
- [Source: src/components/organisms/site-shell.tsx, doc-content.*, not-found-content.tsx] — the FoH two-pane pattern to mirror; the doc renderer (already 64ch-capped); the 404 organism (Task 6 centring).
- [Source: src/components/molecules/mobile-menu.tsx (+ .module.css), nav-links.tsx; src/components/atoms/nav-link.tsx; src/context/menu-open-context.tsx] — the vaul drawer + shared CSS to reuse, the active-state/usePathname pattern to mirror, the global menu context.
- [Source: velite.config.ts; .velite typed `docs`/`Doc`] — the typed array shape the nav consumes (`title`, `section`, `order`, `teaser`, `adr?`, `slug`, `content`).
- [Source: deferred-work.md] — the carried backroom-404 centring item (Task 6) + the still-deferred 404-metadata-dup item.
- [Source: sprint-change-proposal-2026-06-29.md] — confirms 2.4 is unchanged/built first; 2.5 (Decisions content) slots into this nav on the next build.
- [Source: project-context.md] — Server-Components-by-default, atomic tiers, Tailwind-v4 CSS-first + tokens, static export, no test suite, British spelling, no comments, dependency restraint.

## Dev Agent Record

### Agent Model Used

Opus 4.8 (1M context) — `claude-opus-4-8[1m]`

### Debug Log References

- `npm run lint` → clean.
- `npm run build` → green. Velite built first (4 docs), Next compiled, 11/11 static pages generated. Route table: `/backroom` `○ (Static)`, `/backroom/[slug]` `● (SSG)` with all three slug routes prerendered (`building-with-ai-and-bmad`, `deferring-the-polish`, `framework-decision`). All FoH routes still `○ (Static)`.
- Static-export gate: `find out -name "*.func"` → none. Pure static export confirmed.
- `aria-current="page"` present once in `out/backroom.html` (Overview row selected by default) and once in `out/backroom/framework-decision.html` (that doc's row) — exact-match active state working.
- Nav landmark `aria-label="Backroom documentation"` and all four doc titles render into the prerendered HTML (nav is a pure build-time function of the Velite `docs` array).
- Tailwind-v4 purge check: every arbitrary-value class emitted CSS — `grid-template-columns:320px 1fr` & `40px 1fr`, `letter-spacing:.14em`, `box-shadow:0 10px 40px …`, `calc(100vh - 96px)`, `border-left-width:3px`. The rgba washes/borders were normalised by Tailwind v4 to hex-with-alpha: selected wash `#04b4e024`, hover wash `#fafafa0f`, tile borders `#04b4e0…`/`#e0b404…`. No silent purge.

### Completion Notes List

- Built the full nav tree driven entirely by the Velite typed `docs` array: `backroom-nav` organism (Server Component) → `backroom-nav-row` molecule (`'use client'`, the only `usePathname` leaf) → `number-tile`/`glyph-tile`/`section-label` atoms. A new `docs/public/*.md` slots into its section on the next build with no manual nav edit (UJ-3).
- Upgraded `backroom/layout.tsx` from the single centred column to the two-pane shell: 48px gradient frame (`lg:p-12`), 320px `bg-primary-200` rail that scrolls independently, flexible `bg-primary-400` content pane (56px padding, single soft drop-shadow, flat/tonal). The 64ch cap stays owned by `doc-content.module.css` — not re-capped in the layout.
- **Option A (recommended) for the mobile drawer:** added a dedicated `backroom-mobile-menu.tsx` vaul drawer reusing the shared `mobile-menu.module.css`. **Zero FoH files touched** → the NFR-2 zero-regression gate holds by construction (the diff is new Backroom components + `layout.tsx` only). The server-rendered nav is passed as `children` into the client drawer, so `doc.content` never crosses the client boundary (NFR-4) — rows receive only `{ href, title, teaser, section, adr }`.
- **Task 6 (folds in the deferred backroom-404 item):** the lg+ reading room already gives `<main>` a definite height (the grid's `calc(100vh-96px)`), so `NotFoundContent`'s `h-full` chain resolves and centres. Below `lg` the pane previously had no height context (the original deferred bug); fixed minimally by giving `main` `h-screen lg:h-full` so the chain resolves in both layouts — **without** editing the shared `NotFoundContent` organism (the FoH global 404 depends on its `h-full`). The duplicated-404-metadata deferred item stays deferred (out of scope).
- **G4 transition review (AR-8):** least-resistance path taken — the layout does **not** import `ContentTransition`/`FrozenRouter`/`CustomScroll`, so there is **no inter-doc transition** (the recommended outcome). Panes scroll via native `overflow-y-auto`. Shipped as-is; flagged below for Zac to confirm.

**Flagged decisions for Zac (surfaced, not baked):**

1. **Mobile drawer = Option A** (dedicated `backroom-mobile-menu.tsx`, ~25 lines of vaul structural JSX duplicated; styles stay DRY via the shared module). Chosen over Option B (parametrising the shared `MobileMenu`) because B cascades into three frozen FoH files — real regression surface on the highest-priority gate for little gain (only ever two rooms).
2. **Selected glyph-tile fill = gold** (`bg-tertiary` + `bg-primary-400` text), preserving the section's colour identity, rather than the literal "selected = cyan". DESIGN.md is emphatic that gold = judgement / cyan = decision should stay consistent; the cyan row accent bar + wash already signal selection. This is visible immediately (Overview ★ row is selected by default on `/backroom`).
3. **Constant low-alpha washes/borders across themes.** The four DESIGN-specified rgba literals (two washes, two tile borders) have no theme token, so they're constant in both light and dark (same call Story 2.3 made for the gold blockquote). Worth Zac's light-theme eyeball.

**Manual QA remaining (not headlessly verifiable — `npm run dev`/preview):** two-pane layout + independent nav/content scroll at `lg+`; theme toggle flips both panes/nav (cyan↔blue, gold↔terracotta); selected-row visuals (cyan tint + accent bar + inverted tile); below `lg` the rail is gone, the hamburger opens the full sectioned nav, a row navigates **and** closes the drawer, content is full-width; keyboard tab order + visible focus; confirm the G4 "no transition" outcome is acceptable.

### File List

- `src/components/atoms/section-label.tsx` — NEW (tracked dim-caps section label)
- `src/components/atoms/number-tile.tsx` — NEW (cyan 40px tile, zero-padded-2 `adr`)
- `src/components/atoms/glyph-tile.tsx` — NEW (gold 40px ★/◆ tile)
- `src/components/molecules/backroom-nav-row.tsx` — NEW (`'use client'`; whole-row `<Link>`, `aria-current`, closes drawer on nav)
- `src/components/molecules/backroom-mobile-menu.tsx` — NEW (`'use client'`; dedicated vaul drawer, Option A)
- `src/components/molecules/backroom-mobile-menu.module.css` — NEW (drawer panel/close/item-list styles: reduced L/R padding, more top room for close, scrollable item list)
- `src/components/organisms/backroom-nav.tsx` — NEW (Server Component; groups/sorts `docs`, omits empty sections)
- `src/app/backroom/layout.tsx` — EDIT (two-pane shell + `<nav>` rail + mounted mobile drawer; 404 height chain)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — EDIT (status tracking: 2.4 → in-progress → review)

### Change Log

- 2026-06-30 — Story 2.4 implemented: two-pane Backroom reading room + Velite-driven sectioned nav (organism → row molecule → tile/label atoms) + dedicated mobile drawer (Option A) + 404 height-chain fix. Build green, pure static export, lint clean, zero FoH regression. Status → review. Three flagged decisions + G4 transition outcome surfaced for Zac.
- 2026-06-30 — Review feedback (Zac) layout polish, all mirroring front-room mechanics: (1) desktop frame `lg:p-12` → `lg:p-14` so the fixed top-left theme toggle no longer overlaps the shell; (2) mobile root now `h-screen overflow-hidden` with `px-2 pb-2` gutters (mirrors front-room `p-2`) + `pt-20` top band so the burger + toggle have a gutter to live in, and the content pane scrolls internally (`overflow-y-auto`) instead of the whole page scrolling (front-room scroll model); 404 still centres (main `h-full` now has a definite-height ancestor in both breakpoints, so the `h-screen lg:h-full` hack was dropped); (3) Backroom mobile drawer given a dedicated `backroom-mobile-menu.module.css` (the shared `mobile-menu.module.css` stays untouched — front-room safe, and the layered-CSS gotcha blocks Tailwind overrides of it): reduced L/R padding `1.5em` → `0.75em` for more item room, top padding `2.5em` → `3em` for the close button, and a `flex-1 min-h-0 overflow-y-auto` item list so the (soon-to-be-many) decision rows scroll. Build green, static export, lint clean.

### Review Findings

_Code review 2026-06-30 — 3-layer adversarial pass (Blind Hunter / Edge Case Hunter / Acceptance Auditor). Outcome: 2 decision-needed, 2 patch, 1 deferred, 8 dismissed as noise or already-tracked. The MAJOR finding (cyan accent bar) was independently confirmed against `globals.css` and the compiled CSS._

**Decision needed (resolved)**

- [x] [Review][Decision] Unstaged out-of-scope edit to `docs/public/deferring-the-polish.md` (`stuf`→`stuff`) — **Resolved (Zac): fold into this commit.** Change is accepted as-is and will be staged with the 2.4 work; no code action.
- [x] [Review][Decision] Mobile drawer has no labelled `<nav>` landmark — **Resolved (Zac): add the labelled `<nav>`.** Converted to a patch below (wrap the drawer's nav children in `<nav aria-label>` for a11y parity with desktop).

**Patch**

- [x] [Review][Patch] Selected nav-row cyan accent bar uses undefined `--color-secondary` → computes to `currentColor` (near-white), not cyan; AC#2's "left cyan accent bar" is broken on every selected row. **Fixed:** `--color-border-secondary`; confirmed `border-left-color:var(--color-border-secondary)` emits in compiled CSS. [src/components/molecules/backroom-nav-row.tsx — `isCurrent` branch]
- [x] [Review][Patch] Selected glyph-tile border uses undefined `--color-tertiary` → computes to `currentColor` (near-invisible dark), not gold. **Fixed:** `--color-bg-tertiary`. (`number-tile` correctly uses the real `border-secondary` utility — only the glyph tile was wrong.) [src/components/atoms/glyph-tile.tsx — selected branch]
- [x] [Review][Patch] Mobile drawer nav has no labelled landmark — **Fixed:** wrapped the drawer's nav children in `<nav aria-label="Backroom documentation">` so below-`lg` screen-reader users get the same landmark as desktop (AC#3). [src/app/backroom/layout.tsx — `BackroomMobileMenu` children]

_Post-patch verification (2026-06-30): `npm run lint` clean; `npm run build` green; pure static export (no `.func` in `out/`); all four Backroom routes prerendered; both undefined-token references gone from the compiled bundle. **Manual visual QA still outstanding for Zac** (theme toggle across both panes, selected-row look at `lg+` and in the mobile drawer) — not headlessly verifiable._

**Deferred**

- [x] [Review][Defer] Adr-less `Decisions` doc degrades silently — `velite.config.ts` makes `adr` optional independent of `section`, so a `Decisions` doc with no `adr` sorts to position 0 (ties any genuine `adr:0`) and the tile ternary falls through to the `◆` glyph (visually identical to a Pragmatism row) under the Decisions header. No crash, but wrong. Relevant because Story 2.5 adds ~10 Decisions docs. Deferred, latent. [src/components/organisms/backroom-nav.tsx, src/components/molecules/backroom-nav-row.tsx]
