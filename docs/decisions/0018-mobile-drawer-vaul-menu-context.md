# 0018 — Mobile burger drawer on `vaul`, `MenuOpenContext` provider & the modal-semantics parity delta

- **Status:** Accepted
- **Date:** 2026-06-16
- **Decider:** Zac (We Right Code)
- **Tags:** theseus, navigation, mobile, dependencies

## Context

Story 2.4 ports the archive's mobile burger menu — the last missing piece of mobile chrome in
the Epic 2 shell. Below `lg` there was no way to navigate; the archive built this with
`react-burger-menu` (`import { slide as Menu } from 'react-burger-menu'`,
`archive/src/components/layout.js`). Four non-obvious calls had to be made: which drawer
mechanism replaces `react-burger-menu`; how to own the open/close state without turning the
Server-Component root layout into a client component; the accessibility additions the new
mechanism needs; and how to record the behavioural difference the new mechanism introduces on a
zero-regression migration.

## Decision

**(a) Drawer mechanism: `vaul` (`^1.1.2`), over re-adding `react-burger-menu` and over
hand-rolling native.**
Three options were weighed on 2026-06-16:

- **Re-add `react-burger-menu`** — verified it _would_ run on React 19 (latest 3.1.0, Nov 2024;
  source has no `findDOMNode`/`UNSAFE_` lifecycles), but it is a stale class-component/`prop-types`
  library that drags `snap.svg`/`eve` into the bundle for an icon-morph the archive bypassed via
  `customBurgerIcon`.
- **Hand-roll native** — more than the trivial CSS it first appears: true parity needs a focus
  trap, body-scroll-lock, `Esc`, and ARIA — i.e. quietly rebuilding a library, with real
  regression risk on a parity migration.
- **`vaul` (CHOSEN)** — a modern drawer (`^1.1.2`, Dec 2024) whose peer range explicitly includes
  React 19, built on `@radix-ui/react-dialog`. It provides the hard, easy-to-get-wrong mechanics
  (focus trap, scroll lock, `Esc`, ARIA, portal) for free, has a first-class `direction="right"`,
  and is unstyled — so we dress it in the archive's `.bm-*` look. `vaul` is the **only** new
  direct dependency (its `@radix-ui/react-dialog` transitive is modern and acceptable);
  `react-custom-scroll` is **not** re-added. The drawer's box/colour/geometry is a CSS Module
  (`mobile-menu.module.css`) ported byte-for-byte from `archive/src/components/layout.css`
  (`.bm-burger-button`, `.bm-menu`, `.bm-overlay`, `.bm-cross-button`, `.bm-item-list`); `vaul`
  owns the enter/exit transform and overlay fade — no competing `translateX` transition is
  hand-written.

This **consciously reverses** Story 2.3's "react-burger-menu/react-custom-scroll never coming
back" note — but only in the sense of "we're not hand-rolling either". The _old_ libraries still
do not return; the reversal is scoped to adopting `vaul`.

**(b) The modal-semantics + spring-motion parity delta — a deliberate, recorded exception.**
`vaul`/Radix render the drawer as a **modal dialog**: it traps focus, locks body scroll, sets
`aria-modal`, makes the background inert, and animates with a spring (plus optional
drag-to-dismiss). The archive's `react-burger-menu` slide was **non-modal** with an `ease` slide.
So `vaul` is **more** accessible/correct but **behaviourally different** from today. On a
zero-regression migration that is a conscious a11y/UX improvement, not a defect — consistent in
spirit with the project's other accepted intentional change (theme persistence, FR10). It is
**flagged for the Story 4.1 visual-diff gate**, where the live site arbitrates whether the motion
difference is "perceptible" (NFR1). Drag-to-dismiss is kept at `vaul`'s default (additive bonus,
not a regression); the `Drawer.Handle` bottom-sheet affordance is deliberately **not** added (this
is a right-side nav drawer, not a sheet).

**(c) `MenuOpenContext` lives in a client `MenuProvider`, wrapping the drawer **and**
`{children}`.**
Two consumers need the open/close state: this drawer, and Story 3.1's Home "Take a look around"
CTA, which calls `setMenuOpen(true)` from inside page content (`{children}`, FR11). Because
`src/app/layout.tsx` is — and must stay — a Server Component (it owns `metadata`), the
`createContext`/`useState` pair cannot live there. They live in a `'use client'` module
(`src/context/menu-open-context.tsx`) exporting `MenuOpenContext`, a `MenuProvider`, and a
`useMenuOpen()` hook, mirroring the same composition pattern as the existing `Providers`
(next-themes) wrapper. The value shape is the archive's exact `{ menuOpen, setMenuOpen }` so 3.1
reads it unchanged. The `vaul` `Drawer.Root` is **controlled** by this context
(`open={menuOpen} onOpenChange={setMenuOpen}`), so `Esc`/overlay closes flow back through
`onOpenChange(false)` and the 3.1 CTA opens through `setMenuOpen(true)`. `src/context/` is a new,
idiomatic directory; the canonical import path is `@/context/menu-open-context`.

**(d) The ✕ glyph and the minimal a11y additions.**
Radix gives focus-trap, `Esc`, `aria-modal`, and focus return for free. Added on top: the
**required** visually-hidden `<Drawer.Title className="sr-only">Navigation menu</Drawer.Title>`
(Radix Dialog warns and ships an a11y violation without an accessible title);
`aria-label="Open menu"` on the burger; and `aria-label="Close menu"` on the close control. The
close glyph is `faXmark` (already in `@fortawesome/free-solid-svg-icons` — no new icon package) at
`text-primary` (`var(--color-text-primary)`), ~24px, inside a `Drawer.Close` button — a
near-identical glyph to the archive's two-bar `.bm-cross`; the exact cross shape is a Story 4.1
parity detail. The burger icon is ported verbatim
(`<FontAwesomeIcon icon={faBars} className="text-gray-100" style={{ width: 'auto' }} />`);
`text-gray-100` is a Tailwind default-palette colour (not a `--color-*` token) kept for byte-for-byte
parity, generated out of the box by Tailwind v4.

## Consequences

- One new direct dependency: `vaul ^1.1.2` (transitively `@radix-ui/react-dialog ^1.1.17`). No
  `react-burger-menu`, no `react-custom-scroll`, no new icon package.
- `src/app/layout.tsx` stays a Server Component (keeps `metadata`); it gains only the
  `<MenuProvider>` wrapper, the `<MobileMenu />` mount, and two imports. The new client surfaces
  are confined to the `MenuProvider` and `MobileMenu` leaves; `<NavLinks />` is unchanged and
  composes inside the client drawer with `onClick={() => setMenuOpen(false)}`.
- The build stays a pure static export (`output: 'export'`; routes `○ (Static)`, no functions) —
  `vaul`/Radix are client-only and portal at runtime, fully compatible with SSG.
- The behavioural delta (modal semantics + spring motion + optional drag-to-dismiss) vs the
  archive's non-modal `ease` slide is the one accepted exception to strict parity, flagged for the
  Story 4.1 visual-diff gate.
- `MenuOpenContext` at `@/context/menu-open-context` is ready for Story 3.1's Home CTA to consume
  with no re-wiring.

## Alternatives considered

- **Re-add `react-burger-menu`** — rejected: works on React 19 but is a stale class-component lib
  pulling `snap.svg`/`eve`; against the idiomatic-modern-stack posture (NFR5).
- **Hand-roll the drawer natively** — rejected: focus-trap/scroll-lock/`Esc`/ARIA is a library in
  disguise; real regression risk on a parity migration.
- **Put context/`useState` in `layout.tsx`** — rejected: would force `'use client'` on the root
  layout and forfeit its `metadata` export; the boundary belongs in a client provider leaf (AR14).
- **Add `Drawer.Handle` / bottom-sheet drag affordance** — rejected: this is a right-side nav
  drawer, not a sheet; gold-plating beyond parity (NFR6).
