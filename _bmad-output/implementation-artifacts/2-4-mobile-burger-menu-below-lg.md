---
baseline_commit: 1ac60959c4855283131a5aefec8e620ac8ed9395
---

# Story 2.4: Mobile burger menu (`below lg`)

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a mobile visitor,
I want the slide-in burger menu to behave exactly as it does today,
so that navigating on a small screen is unchanged.

## Context & purpose (read first)

This is the **fourth story of Epic 2** (Persistent App Shell & Navigation). It builds the
**only piece of mobile chrome still missing** from the shell. After Stories 2.1–2.3 the
desktop experience is complete (`lg`+ sidebar with portrait/identity/socials/nav), but
**below `lg` the only shell element is the portrait header** — there is currently **no way to
navigate on mobile**. This story adds it.

- **Story 2.1** built the structural frame in `src/app/layout.tsx` (content pane + animated
  container + the `${styles.hero}` sidebar container) and the `ContentTransition` client
  wrapper around `{children}`.
- **Story 2.2** built the shared `<NavLinks />` molecule — already designed to take an
  **`onClick` prop** precisely so the mobile menu can pass a "close on select" handler
  (`src/components/molecules/nav-links.tsx`). It is the single shared nav; this story
  **composes it**, it does not redefine it.
- **Story 2.3** mounted `<NavLinks />` into the desktop sidebar `<nav>` (`hidden lg:flex`)
  and added the identity grid. It explicitly **deferred the burger menu / `MenuOpenContext`
  to this story**.

**The drawer-mechanism decision is RESOLVED — read "Decision: the drawer is built on `vaul`"
below.** The archive built this with **`react-burger-menu`**. Theseus does **not** re-add it,
and does **not** hand-roll the drawer from scratch either. It uses **`vaul`** (a modern,
React-19-native drawer built on `@radix-ui/react-dialog`), which provides the hard,
easy-to-get-wrong mechanics — **focus trap, body-scroll-lock, `Esc`-to-close, ARIA, and the
portal** — for free, while we style it to match the archive. This was Zac's call on
2026-06-16 (decision trail at the end of this story), captured in ADR **0018**.

**2.4's job — four things:**

1. **Add `vaul`** and build the slide-in drawer with it (`Drawer.Root direction="right"`),
   visible **only below `lg`**, styled to the archive's `.bm-*` look.
2. **Add the `MenuOpenContext` provider** (`'use client'`) that owns the open/close state and
   wraps **both the drawer and `{children}`** — so the **Story 3.1 Home "Take a look around"
   CTA** (which opens the menu, FR11) can consume it later. The drawer is **controlled** by
   this context (`open` / `onOpenChange`).
3. **Compose the shared `<NavLinks />`** inside the drawer with `onClick={close}` so selecting
   an item **navigates _and_ closes** (FR3).
4. **Keep `src/app/layout.tsx` a Server Component** — it gains only the provider wrapper, the
   drawer mount, and imports; the `vaul`/context client surfaces live in the leaves (AR14).

**The single source of visual/behavioural truth is the live site** (`zackerthehacker.com`,
viewed below `lg`) and the archived Gatsby implementation. This is a **parity port** (NFR1/NFR2)
— with **one deliberate, recorded delta**: `vaul`/Radix make the drawer a **modal** (focus
trap + scroll lock + spring motion) where the archive's `react-burger-menu` slide was not.
That is an accessibility/UX _improvement_, treated as a conscious parity exception flagged for
the Story 4.1 visual-diff gate (see Dev Note "The one parity delta"). Everything else —
burger placement, right-side slide, themed panel, overlay, open→select→navigate-and-close —
matches today.

## Acceptance Criteria

1. **Below `lg`, the nav is collapsed behind the burger trigger, same trigger and placement
   as today (FR3).**
   **Given** a viewport below `lg`,
   **When** the page renders,
   **Then** the primary navigation is **not** shown inline; instead a **burger trigger** (the
   `faBars` icon) is fixed in the **top-right** corner — matching the archive's
   `.bm-burger-button` geometry verbatim (`position: fixed; width: 36px; height: 30px;
right: 2rem; top: 2rem`) and the archive icon styling (`className="text-gray-100"`,
   `style={{ width: 'auto' }}`),
   **And** the burger trigger **and the portalled drawer/overlay** are gated `lg:hidden` so
   nothing from this story renders at `lg`+ (where the Story 2.3 sidebar nav is the
   navigation) — see Dev Note "Gotcha: the portal escapes `lg:hidden`".

2. **Activating the burger slides the drawer in from the right; state lives in
   `MenuOpenContext` inside a `'use client'` boundary (FR3, AR14).**
   **Given** the burger trigger,
   **When** it is activated,
   **Then** a `vaul` drawer (`Drawer.Root direction="right"`) slides in from the right over the
   page with a dimmed overlay, the panel styled to the archive `.bm-menu`
   (`background: var(--color-bg-primary-200); padding: 2.5em 1.5em 0; font-size: 1.15em`) and
   the overlay to `.bm-overlay` (`background: rgba(0, 0, 0, 0.3)`) — values ported verbatim from
   `archive/src/components/layout.css`,
   **And** the drawer is **controlled** by a **`MenuOpenContext` provider** rendered in a
   `'use client'` component (`Drawer.Root open={menuOpen} onOpenChange={setMenuOpen}`, AR14) —
   **not** in `src/app/layout.tsx`, which **stays a Server Component** (keeps its `metadata`
   export),
   **And** the provider wraps **both** the drawer and the content-pane `{children}`, so a later
   page (Story 3.1's Home CTA) can `setMenuOpen(true)` from page content with no re-wiring here.

3. **Open menu → select an item → navigates _and_ closes (FR3).**
   **Given** the menu is open,
   **When** the visitor selects a navigation item,
   **Then** the app navigates to that destination **and** the drawer closes — implemented by
   composing the **existing shared `<NavLinks />`** (Story 2.2) with `onClick={() =>
setMenuOpen(false)}`, exactly as the archive passed `<NavLinks onClick={() =>
setMenuOpen(false)} />`,
   **And** the drawer also closes via the **overlay click**, the **`Esc` key**, and a **close
   (✕) control** (`Drawer.Close`) — reproducing the archive's `.bm-overlay` click-to-close and
   `.bm-cross-button` affordances (overlay/`Esc` come free from `vaul`/Radix); the **Download
   CV** item keeps its archive behaviour — **no** `onClick`, opens the PDF in a new tab, does
   not close the menu (correct parity).

4. **Composes the shared nav — does NOT redefine it (anti-reinvention, FR2/FR3).**
   **Given** the navigation built in Story 2.2 and mounted in the sidebar in Story 2.3,
   **When** the drawer is built,
   **Then** it renders the **same `<NavLinks />`** component (same labels, icons, order,
   destinations, and the Download CV action) — **no** second nav definition; the only
   difference from the 2.3 desktop mount is the `onClick={close}` handler.

5. **Drawer mechanics via `vaul`; one justified new dependency (NFR5, NFR6, AR14).**
   **Given** the idiomatic-Next, modern-stack posture,
   **When** the drawer is implemented,
   **Then** it uses **`vaul`** (`^1.1.2`, React-19-native, built on `@radix-ui/react-dialog`)
   for the drawer + focus-trap + scroll-lock + `Esc` + ARIA + portal — **not**
   `react-burger-menu`, **not** a hand-rolled drawer — and **`vaul` is the only new direct
   dependency** added to `package.json` (its `@radix-ui/react-dialog` transitive is acceptable
   and modern); **no** `react-burger-menu`, **no** `react-custom-scroll`,
   **And** the drawer's box + colours are a **CSS Module** ported from the archive `.bm-*`
   values, while **`vaul` owns the enter/exit motion and overlay fade** — do **not** hand-write
   a competing `translateX` transition (see Dev Note "Let `vaul` own the motion").

6. **Idiomatic-Next boundaries held (NFR5, AR14).**
   **Given** the Server/Client boundary discipline,
   **When** the components are built,
   **Then** the new client surfaces are confined to the **drawer leaf and its provider** (the
   `MenuOpenContext` provider and the `MobileMenu` component carry `'use client'`); `<NavLinks />`
   is unchanged; and **`src/app/layout.tsx` remains a Server Component** with its `metadata`
   export intact — it gains only the `<MenuProvider>` wrapper, the `<MobileMenu />` mount, and
   two imports.

7. **Build green; parity verified; scope held (NFR1/NFR2/NFR6).**
   **Given** the change,
   **When** `npm run build` and `npm run lint` are run,
   **Then** both are green (TS strict, no `any`, no lint errors) and the build stays a **pure
   static export** (routes `○ (Static)`, no serverless functions),
   **And** below `lg`, in **both themes**, the burger (top-right), the right-slide drawer
   (themed `bg-primary-200`, the four nav items + Download CV), the overlay, open → select →
   navigate-and-close, and close-via-overlay/`Esc`/✕ are verified against the live site (the
   modal-semantics/motion delta from Dev Note "The one parity delta" noted for 4.1, not treated
   as a bug),
   **And** at `lg`+ the burger/drawer/overlay are confirmed **absent** and the 2.3 sidebar nav
   is unchanged,
   **And** none of the remaining shell pieces are built — **no** custom scrollbar /
   scroll-reset (2.5), **no** loading spinner (2.6).

8. **Decision capture as-you-go (FR26 / AR19).**
   **Given** the cross-cutting decision-capture DoD,
   **When** the non-obvious calls in this story are made,
   **Then** they are recorded in a new ADR (next free number **0018**), indexed in
   `docs/decisions/README.md`: (a) **the drawer mechanism — `vaul` over both re-adding
   `react-burger-menu` and hand-rolling native** (rationale: modern/React-19-native, free
   focus-trap/scroll-lock/`Esc`/ARIA — the hard bits; consequence: `vaul` + `@radix-ui/react-dialog`
   deps; consciously **reverses** Story 2.3's "react-burger-menu/react-custom-scroll never
   coming back" note for `vaul`, not for re-adding the old libs); (b) **the modal-semantics +
   spring-motion parity delta** vs the archive's non-modal slide — a deliberate a11y/UX
   improvement flagged for the Story 4.1 visual-diff gate; (c) **`MenuOpenContext` in a client
   `MenuProvider`** wrapping the drawer **and** `{children}` (so `layout.tsx` stays a Server
   Component and the 3.1 Home CTA can consume it); (d) the **✕ glyph choice** and any conscious
   **a11y additions** (`aria-label`s; the required Radix `Drawer.Title`).

## Tasks / Subtasks

- [ ] **Task 1 — Add the `vaul` dependency** (AC: #5, #8)
  - [ ] Install `vaul` pinned to `^1.1.2` (React-19-native; pulls `@radix-ui/react-dialog`).
        Confirm it lands in `package.json` `dependencies` (not dev) and `package-lock.json`
        updates. This is the **only** new direct dependency in this story.
  - [ ] Do **not** add `react-burger-menu`, `react-custom-scroll`, or any other package.

- [ ] **Task 2 — Add the `MenuOpenContext` provider (client)** (AC: #2, #6, #8)
  - [ ] Create `src/context/menu-open-context.tsx` as a `'use client'` module that:
    - Creates `MenuOpenContext` with the archive shape
      `{ menuOpen: boolean; setMenuOpen: (open: boolean) => void }` (default
      `{ menuOpen: false, setMenuOpen: () => {} }`), mirroring `archive/src/components/layout.js:36–39`.
    - Exports a `MenuProvider` holding `const [menuOpen, setMenuOpen] = useState(false)`,
      providing `{ menuOpen, setMenuOpen }` to `children`.
    - Exports a `useMenuOpen()` hook (thin `useContext` wrapper) returning `{ menuOpen,
setMenuOpen }` — consumed by `MobileMenu` here and the Story 3.1 Home CTA later.
  - [ ] Keep it minimal — no reducer, no extra state, no new dependency.

- [ ] **Task 3 — Port the drawer styling into a CSS Module (box + colours only)** (AC: #1, #2, #5)
  - [ ] Create `src/components/molecules/mobile-menu.module.css` porting the archive `.bm-*`
        rules from `archive/src/components/layout.css` to module-scoped classes, **values
        byte-for-byte**, but **only the box/colour/geometry — not the motion** (vaul owns motion):
    - **Burger button** (`.burgerButton`): `position: fixed; width: 36px; height: 30px;
right: 2rem; top: 2rem;` (from `.bm-burger-button`).
    - **Panel** (`.panel`, the `Drawer.Content`): `position: fixed; top: 0; right: 0;
height: 100%;` a fixed width (target **300px** — see Dev Note), `background:
var(--color-bg-primary-200); padding: 2.5em 1.5em 0; font-size: 1.15em;` (from `.bm-menu`).
      **Do NOT** set a `transform`/`translateX` transition here.
    - **Overlay** (`.overlay`, the `Drawer.Overlay`): `position: fixed; inset: 0;
background: rgba(0, 0, 0, 0.3);` (from `.bm-overlay`). Let vaul fade it.
    - **Item list** (`.itemList`): `display: flex; flex-direction: column;` (from `.bm-item-list`).
    - **Close control** (`.closeButton`): target `.bm-cross-button` size (`height: 24px;
width: 24px;`) and `.bm-cross` colour (`var(--color-text-primary)`).
  - [ ] Do **not** port the `.rcs-custom-scroll .rcs-inner-handle` rule — that is the **custom
        scrollbar (Story 2.5)**, not this story.

- [ ] **Task 4 — Build the `MobileMenu` client component with `vaul`** (AC: #1, #2, #3, #4, #6)
  - [ ] Create `src/components/molecules/mobile-menu.tsx` with `'use client'`:
    - `import { Drawer } from 'vaul';` read `{ menuOpen, setMenuOpen } = useMenuOpen();`
    - `<Drawer.Root direction="right" open={menuOpen} onOpenChange={setMenuOpen}>` (controlled).
    - **Trigger:** `<Drawer.Trigger asChild>` wrapping a `<button aria-label="Open menu"
className={styles.burgerButton}>` containing `<FontAwesomeIcon icon={faBars}
className="text-gray-100" style={{ width: 'auto' }} />` (verbatim archive icon). Wrap the
      trigger in a `lg:hidden` element so the burger never shows at `lg`+.
    - **Portal content:** `<Drawer.Portal>` →
      `<Drawer.Overlay className={`${styles.overlay} lg:hidden`} />` and
      `<Drawer.Content className={`${styles.panel} lg:hidden`}>` (the `lg:hidden` on **both** is
      required — see "Gotcha: the portal escapes `lg:hidden`"), containing:
      - `<Drawer.Title className="sr-only">Navigation menu</Drawer.Title>` — **required** by
        Radix Dialog or it warns/violates a11y (see Dev Note "Radix needs a Title").
      - `<Drawer.Close asChild>` wrapping a `<button aria-label="Close menu"
className={styles.closeButton}>` with `<FontAwesomeIcon icon={faXmark} className="text-primary" />`.
      - `<div className={styles.itemList}><NavLinks onClick={() => setMenuOpen(false)} /></div>`.
    - Import `faBars` and `faXmark` from `@fortawesome/free-solid-svg-icons` (both already
      installed — **no new icon package**).
  - [ ] **Compose `<NavLinks />`** — do not re-list links. The only delta from the 2.3 mount is
        the `onClick` handler.
  - [ ] Let **vaul own the open/close animation and overlay fade** — do not add your own
        `translateX` transition (it fights vaul's transform).

- [ ] **Task 5 — Wire the provider + drawer into the root layout (keep it a Server Component)**
      (AC: #2, #6)
  - [ ] In `src/app/layout.tsx`, wrap the existing subtree in `<MenuProvider>` so **both** the
        `<MobileMenu />` and the content-pane `{children}` sit inside it (the 3.1 Home CTA must
        consume the context). Cleanest placement: inside the existing `<Providers>` (next-themes),
        wrap from `<MobileMenu />` through `</main>` in `<MenuProvider>…</MenuProvider>`. Render
        `<MobileMenu />` as the first child inside the provider (the burger is `position: fixed`,
        so DOM order is cosmetic; placing it before `<main>` mirrors archive `layout.js:70–85`).
  - [ ] Add imports: `MenuProvider` (`@/context/menu-open-context`), `MobileMenu`
        (`@/components/molecules/mobile-menu`).
  - [ ] **Do NOT** add `'use client'` to `layout.tsx` — it keeps its `metadata` export. Do
        **not** touch the sidebar (`${styles.hero}` block / 2.3 identity grid / `<nav>` /
        `NavLinks`), `ContentTransition`, `ThemeToggle`, `Providers`, `globals.css`, fonts, or
        analytics. Only the `<MenuProvider>` wrapper, the `<MobileMenu />` mount, and two imports.

- [ ] **Task 6 — Verify (build, lint, in-shell parity below `lg`, both themes; absent at `lg`+)**
      (AC: #7)
  - [ ] `npm run build` → green, **pure static export** (routes `○ (Static)`, no functions).
        `npm run lint` → clean. `npm run format`. Record exact outputs in the Dev Agent Record.
  - [ ] `npm run dev`, load `/` at **mobile width (below `lg`)** in **both themes**, compare to
        the live site at the same width: (a) burger fixed top-right; (b) tap → drawer slides in
        from the right with the dimmed overlay, themed `bg-primary-200`; (c) the four nav items +
        Download CV present, in order; (d) tap a nav item → navigates **and** closes; (e) overlay
        click, `Esc`, and ✕ each close. **Note** the `vaul` modal/spring feel vs the live site's
        `react-burger-menu` slide for the 4.1 gate — do not treat the motion difference as a bug
        (it is the recorded delta), but flag if the _box/colours_ differ.
  - [ ] At **`lg`+**: confirm **no** burger, **no** drawer, **no** overlay render, and the 2.3
        sidebar nav is unchanged. Specifically check that opening the drawer logic cannot leak a
        visible panel at `lg`+ (the `lg:hidden` on `Drawer.Content`/`Drawer.Overlay` is what
        guards the portalled nodes).
  - [ ] Confirm in `out/index.html` the burger markup is present and (since vaul portals at
        runtime, the panel may be hydration-mounted) the shared nav `href`s resolve (Home `/`,
        About `/about-me`, Resume `/resume`, Content `/content`, Download CV `/pdfs/zac-braddy.pdf`).
  - [ ] Do **not** run `npm test` (stub `exit 1` — AR13).

- [ ] **Task 7 — Decision capture** (AC: #8)
  - [ ] Create `docs/decisions/0018-<short-title>.md` from `docs/decisions/_template.md`
        (Status: Accepted; Tags: `theseus, navigation`/`mobile`/`dependencies`) capturing the
        calls in AC #8: (a) **`vaul` for the drawer** over re-adding `react-burger-menu` /
        hand-rolling (with the conscious reversal of the 2.3 "never coming back" note, scoped to
        `vaul` only); (b) **the modal-semantics + spring-motion parity delta** flagged for 4.1;
        (c) **`MenuOpenContext` in a client `MenuProvider`** wrapping drawer + children; (d) the
        **✕ glyph + `aria-label`/`Drawer.Title` a11y** additions.
  - [ ] Add the 0018 row to the ADR index table in `docs/decisions/README.md`.
  - [ ] If genuinely-deferrable hardening surfaces (e.g. reduced-motion handling, drag-to-dismiss
        tuning), log it in `_bmad-output/implementation-artifacts/deferred-work.md` — do **not**
        gold-plate it in.

## Dev Notes

### What this story changes (small surface)

- **New:** `src/context/menu-open-context.tsx` (client — `MenuOpenContext` + `MenuProvider` +
  `useMenuOpen`), `src/components/molecules/mobile-menu.tsx` (client — `vaul` drawer composing
  `<NavLinks onClick={close} />`), `src/components/molecules/mobile-menu.module.css` (ported
  `.bm-*` box/colour values), `docs/decisions/0018-…md`.
- **Modified:** `src/app/layout.tsx` (wrap subtree in `<MenuProvider>`, mount `<MobileMenu />`,
  two imports — **stays a Server Component**), `package.json` + `package-lock.json` (add `vaul`),
  `docs/decisions/README.md` (index 0018), `_bmad-output/implementation-artifacts/sprint-status.yaml`,
  this story file.
- **Not touched:** the 2.3 sidebar (`${styles.hero}` block, identity grid, `<nav>`,
  `NavLinks`/`NavLink`), `ContentTransition`, `ThemeToggle`, `Providers` (next-themes),
  `globals.css`, theming/tokens, fonts/metadata/GA (1.6), the 2.1 animation files. **Do not
  re-open earlier work.** `NavLinks` already exposes the `onClick` prop — do not modify it.

### Decision: the drawer is built on `vaul` (ADR 0018) — and why

The archive used `react-burger-menu` (`import { slide as Menu } from 'react-burger-menu'`,
`archive/src/components/layout.js:3,70–85`). Three options were weighed on 2026-06-16:

- **Re-add `react-burger-menu`** — verified it _would_ run on React 19 (source has no
  `findDOMNode`/`UNSAFE_` lifecycles; latest 3.1.0 published Nov 2024), so it works — but it is
  a stale class-component/`prop-types` lib that drags `snap.svg`/`eve` into the bundle for an
  icon-morph the archive bypassed via `customBurgerIcon`.
- **Hand-roll native** — more than the trivial CSS it first appears: true parity needs focus
  trap, body-scroll-lock, `Esc`, and ARIA, i.e. quietly rebuilding a library. Real regression
  risk on a parity migration.
- **`vaul` (CHOSEN)** — a modern drawer (`^1.1.2`, published Dec 2024) whose peer range
  **explicitly includes React 19**, built on `@radix-ui/react-dialog`. It provides the
  hard, easy-to-get-wrong mechanics (focus trap, scroll lock, `Esc`, ARIA, portal) for free,
  supports a first-class `direction="right"`, and is unstyled — so we dress it in the archive's
  `.bm-*` look. Net: no stale dep, no hand-rolled a11y, idiomatic modern stack.

This **consciously reverses** Story 2.3's "react-burger-menu/react-custom-scroll never coming
back from Gatsby" note — but only in the sense of "we're not hand-rolling either"; the _old_
libs still don't come back. Record the reversal explicitly in ADR 0018 (decision-capture DoD).

### The one parity delta — modal semantics + motion (flag, don't treat as a bug)

`vaul`/Radix render the drawer as a **modal dialog**: it **traps focus**, **locks body scroll**,
sets `aria-modal`, makes the background inert, and animates with a **spring** (plus optional
drag-to-dismiss). The archive's `react-burger-menu` slide was **non-modal** with an `ease`
slide. So `vaul` is **more** accessible/correct but **behaviourally different** from today. On a
zero-regression migration that is a **deliberate, recorded exception** — an a11y/UX improvement,
not a defect:

- Record it in ADR 0018 and **flag it for the Story 4.1 visual-diff gate**, where the live site
  is the arbiter of whether the motion difference is "perceptible" (NFR1).
- It is consistent in spirit with the project's other accepted intentional change (theme
  persistence, FR10) and its pattern of conscious a11y improvements (state-aware toggle label,
  `alt="Zac Braddy"`).
- Drag-to-dismiss is additive (a bonus gesture), not a regression — keep `vaul`'s default; do
  **not** add the `Drawer.Handle` bottom-sheet affordance (this is a right nav drawer, not a
  sheet). If anything about the drag feels wrong against the live site, log it to deferred-work,
  don't gold-plate a fix.

### Let `vaul` own the motion (CSS Module is box + colour only)

`vaul` drives the enter/exit **transform** and the overlay **opacity** itself (via data-state +
inline transforms; it also tracks drag). So the CSS Module styles the **static box** only —
`Drawer.Content`: `position: fixed; top: 0; right: 0; height: 100%; width: 300px;` + the themed
`bg-primary-200`, padding `2.5em 1.5em 0`, `font-size: 1.15em`; `Drawer.Overlay`: `fixed;
inset: 0; background: rgba(0,0,0,0.3)`. **Do not** add a competing `transition: transform …` /
`translateX` — it will fight vaul and produce janky motion. The **300px** width and exact
overlay alpha are the archive's parity targets; the live site arbitrates final feel at 4.1.

### Gotcha: the portal escapes `lg:hidden`

`Drawer.Portal` renders the `Overlay` and `Content` at `document.body`, **outside** any
`lg:hidden` wrapper you put around `<Drawer.Root>`. So gating only the wrapper hides the burger
but **not** the portalled panel. Put `lg:hidden` **directly on `Drawer.Overlay` and
`Drawer.Content`** (in addition to the trigger's wrapper). Belt-and-braces: the drawer also
shouldn't be openable at `lg`+ anyway (the trigger is hidden and the only other opener — the
3.1 Home CTA — is itself mobile-only), but the `lg:hidden` on the portalled nodes is the real
guard. Verify at `lg`+ that no panel/overlay can paint.

### Radix needs a `Title` (avoid the a11y warning)

`@radix-ui/react-dialog` (under `vaul`) **requires an accessible title** or it logs a dev
warning and ships an a11y violation. Include a visually-hidden `<Drawer.Title className="sr-only">
Navigation menu</Drawer.Title>` inside `Drawer.Content` (Tailwind v4 provides `sr-only`). This
is invisible to the visual-diff gate. Record it as a conscious a11y addition in ADR 0018.

### `MenuOpenContext` — shape, placement, and why a separate provider

The archive created `MenuOpenContext` in `layout.js` and wrapped `{children}` with its provider
(`layout.js:36–39, 123–131`). Two consumers need the state: **this drawer** (open/close), and
**Story 3.1's Home "Take a look around" CTA**, which calls `setMenuOpen(true)` from inside page
content (`{children}`). So the provider must wrap `{children}`.

Because **`src/app/layout.tsx` is (and must stay) a Server Component** (it owns `metadata`),
context + `useState` cannot live there — put them in a **client** `MenuProvider`
(`src/context/menu-open-context.tsx`) and wrap the subtree from inside the server layout. Same
pattern as the existing `Providers` (next-themes) wrapper. Provide the archive's exact value
shape `{ menuOpen, setMenuOpen }` so 3.1 reads it the same way. The `vaul` `Drawer.Root` is
**controlled** by this context (`open={menuOpen} onOpenChange={setMenuOpen}`), so `Esc`/overlay
closes flow back through `onOpenChange(false)` → `setMenuOpen(false)`, and the 3.1 CTA opening
flows through `setMenuOpen(true)`.

`src/context/` is a new, idiomatic directory (the codebase already separates `src/config`,
`src/components/atoms|molecules`). If you co-locate the context elsewhere, **state the final
import path in the Dev Agent Record** so Story 3.1 references the right one (this story assumes
`@/context/menu-open-context`).

### The close control (✕) and burger icon — port verbatim where it's visible

- **Burger:** `<FontAwesomeIcon icon={faBars} className="text-gray-100" style={{ width: 'auto' }} />`
  — **port both verbatim.** `text-gray-100` is a **Tailwind default-palette** colour, not a
  `--color-*` token; normally project-context says "themed colours only", but this is a
  byte-for-byte parity port and Tailwind v4 generates `text-gray-100` out of the box (Story 1.4
  deliberately kept the default palette — the border-guard depends on `--color-gray-200`). If
  the near-white burger looks low-contrast on the light gradient, that is a **pre-existing
  archive characteristic** — flag for 4.1, do not "fix" (NFR7).
- **Close ✕:** the archive's `.bm-cross` is a two-bar cross coloured `var(--color-text-primary)`.
  Use `faXmark` (already in `@fortawesome/free-solid-svg-icons` — **no new icon package**) at
  `text-primary`, ~24px, in a `Drawer.Close` button. Near-identical glyph; treat the exact cross
  shape as a 4.1 parity detail. Record the choice in ADR 0018.

### A11y (mostly free from Radix; add labels)

`vaul`/Radix give focus-trap, `Esc`, `aria-modal`, and focus return for free. You add: the
required `Drawer.Title` (above), `aria-label="Open menu"` on the burger, and `aria-label="Close
menu"` on the ✕. `Drawer.Trigger`/`Drawer.Close` wire `aria-expanded`/`aria-controls` for you.
This is the conscious-but-minimal a11y posture the project has used (state-aware toggle label in
1.5; `alt="Zac Braddy"` in 2.3) — record in ADR 0018. Anything deeper (reduced-motion media
query, etc.) → deferred-work, not built speculatively (NFR6).

### Server/Client boundary (NFR5, AR14)

- `src/context/menu-open-context.tsx` — **client** (`'use client'`; `useState`/`createContext`).
- `src/components/molecules/mobile-menu.tsx` — **client** (`'use client'`; `vaul`, the context,
  the `NavLink` leaves). This is the menu leaf AR14 anticipates.
- `src/components/molecules/nav-links.tsx` — **unchanged**; renders fine inside the client drawer.
- `src/app/layout.tsx` — **stays a Server Component**, composing the client `MenuProvider` +
  `MobileMenu` as children (same as it already does with `Providers`, `ThemeToggle`,
  `ContentTransition`). No directive added; keeps `metadata`.

### Static export compatibility (AR4)

`vaul`/Radix are client-only and portal at runtime — fully compatible with `output: 'export'`
(everything happens client-side after hydration; nothing needs a server). The build stays a pure
static export; verify routes remain `○ (Static)` with no functions.

### Composing the shared `<NavLinks />` (FR2/FR3, anti-reinvention)

`src/components/molecules/nav-links.tsx` already takes `onClick?: () => void` and threads it to
each `NavLink`. The 2.3 desktop mount passes no `onClick`; the drawer passes `onClick={() =>
setMenuOpen(false)}`. `NavLink` already runs the consumer `onClick` alongside the `next/link`
navigation, so **select → navigate + close** falls out for free. The **Download CV** anchor
intentionally takes **no** `onClick` (archive parity) — opens the PDF in a new tab, leaves the
menu state alone; do not add a close handler to it.

### Project structure & conventions (from project-context.md — note the Theseus divergence)

- **Atomic design:** the drawer is a **molecule** (`src/components/molecules/mobile-menu.tsx`) —
  composes the `NavLinks` molecule + `FontAwesomeIcon` atoms; the cross-cutting state is a
  context module under `src/context/`. Filenames **kebab-case**, components **PascalCase**.
- **TypeScript strict, no `.js` source** (AR2) — new files are `.tsx`; type the context value
  and provider/hook; no `any`. Use TS types, not `PropTypes` (project-context.md's
  PropTypes/Gatsby rules describe the **archive** stack — follow the Theseus artifacts where they
  diverge, as 1.7/2.1/2.2/2.3 established).
- **Prettier is law** (`^3.8.4`): single quotes, `arrowParens: avoid`. Run `npm run format`;
  Husky `pretty-quick --staged` on commit. No new visible copy has apostrophes (the "Content
  I've Created" apostrophe lives, escaped, inside untouched `NavLinks`); `aria-label`/`Drawer.Title`
  strings are the only new text.
- **No code comments by default**; don't leave "removed code" comments.
- **British spelling** in user-facing copy; this story adds no visible body copy (reuses
  `NavLinks` labels). Keep CSS/JS identifiers canonical.
- **Themed colours only / no interpolated class names** — panel/overlay/✕ use `--color-*` tokens
  via the CSS Module; the only default-palette class is the verbatim-ported `text-gray-100` on
  the burger (justified above). All class strings are static literals (PurgeCSS/v4 scan safety).

### Scope seams — do NOT build now (NFR6)

Out of scope for 2.4: the **custom scrollbar** + `Math.random()` scroll-reset (2.5 — do **not**
port the `.rcs-custom-scroll` CSS line); the **loading spinner** (2.6); the **Home "Take a look
around" CTA** that _opens_ the menu (Story 3.1 — this story only provides the `MenuOpenContext`
it will consume; do not add the CTA or any page content). Do **not** add `react-burger-menu` or
`react-custom-scroll`. Do **not** touch the 2.3 sidebar, `ContentTransition`, `ThemeToggle`,
`Providers`, or `globals.css`. You **do** edit `layout.tsx` — only the `<MenuProvider>` wrapper,
the `<MobileMenu />` mount, and two imports.

### Testing standards (AR13 — no suite to fabricate)

No test framework exists; `npm test` is a stub that exits 1 — **do not** run it as a test or
invent a suite. Verification: `npm run build` green + pure static export, `npm run lint` clean,
and **manual behavioural parity** below `lg` in **both themes** (burger placement, right-slide
drawer, overlay, open → select → navigate-and-close, overlay/`Esc`/✕ close), plus confirming
**absence** at `lg`+. Unlike the 2.3 portrait there is **no Netlify-loader caveat** — it all
renders under `next dev`. The only items reasonably deferred to the 4.1 gate are the
modal-semantics/spring-motion delta and the ✕ glyph shape. Record real command outputs; do not
claim parity you have not seen.

### Project Structure Notes

- New files align with the Theseus tree and archive originals: the drawer is a molecule
  (`mobile-menu.tsx` + `.module.css`), the shared open/close state is a context module
  (`src/context/menu-open-context.tsx`). `src/context/` is a new, idiomatic directory.
- `MenuOpenContext`'s value shape mirrors the archive (`{ menuOpen, setMenuOpen }`) so the 3.1
  Home CTA consumes it exactly as the archive page code did.
- Reuses `public/pdfs/zac-braddy.pdf` (Download CV) and the `NavLinks` destinations unchanged
  (AR10 — static assets relocated, URLs unchanged).

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.4] — the three Given/When/Then ACs
  (collapsed-behind-burger below `lg`; slide-in via `MenuOpenContext` in a client boundary;
  select → navigate + close).
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 2] — shell decomposition; 2.4 = burger
  menu, 2.5 = scrollbar/scroll-reset, 2.6 = spinner (the seams not to build).
- [Source: _bmad-output/planning-artifacts/epics.md#Additional Requirements] — AR14 (Server/Client
  boundary: the mobile menu / `MenuOpenContext` provider is a named `'use client'` leaf), AR8
  (`usePathname`/`next/navigation`, already in `NavLink`), AR4 (static export — `vaul` is
  client-only, compatible), AR13 (no fabricated suite).
- [Source: _bmad-output/planning-artifacts/epics.md#Functional/NonFunctional Requirements] — FR3
  (burger collapse + select-navigates-and-closes), FR2 (shared nav), FR11 (the 3.1 Home CTA that
  _opens_ the menu — why `MenuOpenContext` must wrap `{children}`), NFR1/NFR2 (parity bar + the
  recorded modal/motion delta), NFR5 (idiomatic/modern Next), NFR6 (anti-gold-plating), NFR7
  (preserve quirks — the verbatim burger icon).
- [Source: archive/src/components/layout.js:3,36–39,41–85,123–131] — the `react-burger-menu`
  usage, the `customBurgerIcon` (`faBars`, `text-gray-100`, `width:'auto'`), the `<NavLinks
onClick={() => setMenuOpen(false)} />` composition, the `MenuOpenContext` creation + provider
  around `{children}`, and the `lg:hidden` wrapper — the behaviour this story reproduces on `vaul`.
- [Source: archive/src/components/layout.css] — the **authoritative `.bm-*` styling spec**
  (`.bm-burger-button` geometry, `.bm-menu` bg/padding/font-size, `.bm-overlay` alpha,
  `.bm-cross-button`/`.bm-cross`, `.bm-item-list`) to port into the CSS Module (box/colour only;
  vaul owns motion). **Skip** the `.rcs-custom-scroll` rule (Story 2.5).
- [Source: archive/src/components/molecules/nav-links.js + src/components/molecules/nav-links.tsx]
  — the shared nav with its `onClick` prop and the Download CV anchor (no `onClick`); reused verbatim.
- [Source: src/app/layout.tsx] — current root layout (Server Component, `metadata`); the
  `<Providers>` wrapper is the precedent for nesting the client `<MenuProvider>`; the `<MobileMenu />`
  mounts inside it; the 2.3 sidebar block stays untouched.
- [Source: src/components/atoms/nav-link.tsx] — runs the consumer `onClick` alongside `next/link`,
  so select → navigate + close needs no change here.
- [Source: src/app/globals.css] — `--color-bg-primary-200` / `--color-text-primary` tokens the
  panel/overlay/✕ use; the `@layer base` reset; `text-gray-100` is a Tailwind default (palette
  not wiped — `--color-gray-200` border-guard reference); `sr-only` is available (Tailwind v4).
- [Source: vaul (npm, ^1.1.2) — `@radix-ui/react-dialog` ^1.1.1] — `import { Drawer } from 'vaul'`;
  composition `Drawer.Root` (`direction`, controlled `open`/`onOpenChange`) → `Drawer.Trigger`,
  `Drawer.Portal`, `Drawer.Overlay`, `Drawer.Content`, `Drawer.Close`, `Drawer.Title`; React-19
  peer support; modal semantics (focus-trap/scroll-lock/`Esc`/ARIA) inherited from Radix Dialog;
  the required accessible `Title`.
- [Source: _bmad-output/implementation-artifacts/2-3-desktop-sidebar-lg-and-above.md] — prior
  story: the deferred burger/`MenuOpenContext` seam, the "react-burger-menu/react-custom-scroll
  never coming back" note (consciously reversed here only for `vaul`), the verification-honesty
  bar, the Theseus-vs-archive divergence note, ADR discipline (0017 → 0018), the
  Server-Component-layout invariant.
- [Source: _bmad-output/implementation-artifacts/2-2-primary-navigation-and-the-download-cv-action.md]
  — the shared `NavLinks` design (the `onClick` prop exists _for_ this story).
- [Source: _bmad-output/implementation-artifacts/deferred-work.md] — open items; this story adds
  any drawer hardening (reduced-motion, drag tuning) here if it surfaces.
- [Source: docs/decisions/_template.md + README.md] — ADR format + index for the 0018 capture;
  0017 is the highest existing number. ADR 0015 (animations) and 0016 (shared nav port) are the
  nearest precedents.
- [Source: _bmad-output/project-context.md] — JS/TS rules, Prettier law, atomic structure,
  themed-colour + no-interpolated-classnames + `MenuOpenContext`-via-Context guidance (describes
  the **archive** stack; follow the Theseus artifacts where they diverge).

## Decision trail (resolved 2026-06-16)

Drawer mechanism was an open call at story creation. The path: I first leaned native (idiomatic
Next), then — on Zac's challenge that re-implementing focus-trap/scroll-lock/`Esc`/ARIA is far
more than the trivial CSS it looks like, and that `react-burger-menu` still works — verified
`react-burger-menu`'s source is React-19-safe (no `findDOMNode`/legacy lifecycles) and conceded
that re-adding it (or a modern equivalent) beats hand-rolling. **Zac chose `vaul`** (modern,
React-19-native, Radix-Dialog-based) as the best balance: no stale dep, no hand-rolled a11y, the
hard mechanics for free. The trade accepted with eyes open: `vaul` + `@radix-ui/react-dialog`
deps, and a **modal-semantics + spring-motion delta** vs the archive's non-modal slide — a
deliberate a11y/UX improvement, recorded in ADR 0018 and flagged for the Story 4.1 visual-diff
gate. The old `react-burger-menu`/`react-custom-scroll` libs still do not return.

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

| Date       | Change                                                                         |
| ---------- | ------------------------------------------------------------------------------ |
| 2026-06-16 | Story created (ready-for-dev); drawer mechanism resolved to `vaul` (ADR 0018). |
