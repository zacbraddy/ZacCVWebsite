---
baseline_commit: 68a157af4dfaaf7aec3804b30726b7cf8c8d9394
---

# Story 2.6: Add the front-of-house Entry link

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a technical evaluator lingering past the flash,
I want an understated link offering a way into the Backroom,
So that I can choose to look closer — without it ever pulling a 2-second recruiter toward it (UJ-2, FR-10).

## Story context

This is the **first of the two entry-point stories** (2.6 Entry link, 2.7 console egg) that finish Epic 2. Everything the Entry link points _at_ is already built and live: the Backroom Overview (`/backroom`), the Velite + Shiki pipeline (2.3), the two-pane reading room and sectioned nav (2.4), and the 11 Decisions docs (2.5). This story adds **the front door** — a single quiet link from front-of-house into `/backroom`.

It is a **small, contained, mostly-CSS story**: one new atom (`entry-link`) plus two mount points (the `(site)` desktop page chrome, and the existing FoH vaul drawer for mobile). **No** pipeline, routing, data, or Backroom change. **No** new dependencies.

The whole design tension is **restraint**: the link must be _discoverable but never attention-grabbing_ — it sits out on the page gradient in the periphery, bookending the top-left theme toggle, and must never compete with the front-of-house flash (the 2-second recruiter must be able to ignore it entirely). See EXPERIENCE.md's "Climax (a non-event by design)" — the primary persona never even notices it. That is the success condition, not a bug.

**Hard scope guard:** the console easter egg (2.7) is **out of scope** here. Do not touch the root layout, the Backroom, or any Backroom component. If you find yourself editing `src/app/layout.tsx`, `src/app/backroom/**`, or any `backroom-*` component, you have left scope.

## Acceptance Criteria

**AC1 — `entry-link` atom mounted in the `(site)` page chrome, desktop bottom-left (FR-10, AR-14, UX-DR9).**
**Given** the `entry-link` atom and the `(site)` shell (`src/components/organisms/site-shell.tsx`, rendered by `src/app/(site)/layout.tsx`)
**When** the Entry link is mounted in the `(site)` shell so it appears on **every** front-of-house page (home, about-me, resume, content)
**Then** at `lg+` it is **pinned bottom-left of the page chrome on the gradient** — fixed-positioned, **mirroring the top-left `ThemeToggle`** (which is `fixed top-0 left-0 px-8 py-8`), so the two bookend the page furniture (top-left toggle / bottom-left "how this is built")
**And** it reads exactly **`More interested in how this site is built? →`** (the `→` arrow included), is understated — **dotted underline + subtle text-shadow, ~0.82 opacity, `text-primary`** — and never competes with the flash
**And** it navigates to the Backroom Overview **`/backroom`** and is **never** shown inside the Backroom (which has the `◀ back to the site` link instead — guaranteed by mounting only in `(site)`/FoH chrome, never in `backroom/layout.tsx` or the root layout).

**AC2 — Mobile relocation into the FoH vaul drawer (UX-DR3, EXPERIENCE.md responsive matrix).**
**Given** that below `lg` the page chrome is near-zero (the FoH content card has only `p-2` padding — no gradient margin to host a bottom-left link)
**When** the viewport is below `lg`
**Then** the fixed desktop Entry link is hidden and the link instead appears as a **quiet item inside the existing FoH vaul hamburger drawer** (`src/components/molecules/mobile-menu.tsx`), **set apart from the primary nav** (`NavLinks`) so it reads as a secondary "and also…" affordance, mirroring the FoH mobile pattern
**And** tapping it navigates to `/backroom` **and closes the drawer** (`onClick={() => setMenuOpen(false)}`, the same pattern `NavLinks` uses), so there is no double-rendered/visible duplicate link at any breakpoint.

**AC3 — Accessibility + the gradient-contrast caveat (UX-DR9, UX-DR18, NFR-5).**
**Given** the link sits on the page **gradient** (dark: cyan `#04b4e0` → gold `#e0b404`; light: blue `#3058b5` → terracotta `#e6593d`), not a flat surface
**When** the link is tested
**Then** it is a **real keyboard-accessible `<a>`/`<Link>` with discernible text** (reachable by Tab, discoverable by screen-reader users despite being visually understated — no `aria-hidden`, no icon-only), works in the **static export**, and focus is visible (inherits site focus styles)
**And** its treatment **clears AA contrast across the full gradient in BOTH themes** — verify especially against the **gold/terracotta** end where near-white-on-gold is weakest; the **dotted underline + text-shadow is the accepted legibility mechanism** (DESIGN.md "Gradient caveat"), so the shadow/underline must be **theme-aware** (a dark shadow behind light text in dark theme; a light shadow behind dark text in light theme). If, after the text-shadow mitigation, AA genuinely cannot be cleared against the gold end, **flag it to Zac** rather than silently shipping sub-AA or quietly changing the design colour.

**AC4 — Verification (AR-15, NFR-1/2/4, no test suite).**
**Given** verification is build + lint + manual preview (there is **no** test framework — `npm test` is a stub; do **not** fabricate test runs)
**When** the build is run
**Then** `npm run build` is **green** and a **pure static export** — every route still `○ (Static)`, **no `.func`** (the Entry link adds no server surface), and `npm run lint` is **clean** (no unused imports, Prettier-compliant)
**And** **zero front-of-house regression** (NFR-2): the sidebar, portrait, hero, nav, route-transition animations, theme toggle, and mobile drawer all behave exactly as before — the only visible change is the new quiet link
**And** manual preview confirms: the link appears bottom-left on all four FoH pages at `lg+`, relocates into the drawer below `lg`, navigates to `/backroom`, is **absent inside the Backroom**, and is legible in both dark and light themes across the gradient.

## Tasks / Subtasks

- [ ] **Task 1 — Create the `entry-link` atom (AC1, AC2, AC3)**
  - [ ] Create `src/components/atoms/entry-link.tsx` — a `next/link` `<Link href="/backroom">` rendering the copy `More interested in how this site is built? →`. Accept an **optional `onClick?: () => void`** prop (forwarded to `<Link onClick>`, for the drawer-close case) and an **optional `className?: string`** (so consumers can add positioning/spacing without the atom owning fixed placement).
  - [ ] Keep the atom **directive-free** (no `'use client'`) — it only renders a `Link` and forwards props, so it works both in the Server-Component `(site)` shell (no `onClick`) and inside the client `MobileMenu` (with `onClick`). Do **not** add hooks.
  - [ ] Style the understated treatment via a co-located **CSS Module** `entry-link.module.css` (Tailwind cannot express the theme-aware text-shadow cleanly): `text-primary` colour (use the `text-primary` utility/`--color-text-primary` token — do **not** hardcode hex), ~`0.82` opacity, `font-size: 13px`, a **dotted bottom underline**, and a **theme-aware `text-shadow`** for gradient legibility. Mirror the mockup values as the baseline: `text-shadow: 0 1px 2px rgba(0,0,0,0.35)` and `border-bottom: 1px dotted` — but make the underline colour and shadow flip per theme (see Dev Notes → "Theme-aware treatment"). Hover: opacity → 1, underline → solid. The atom owns **no** positioning (`fixed`/`bottom`/`left` belong to the consumer), so it is reusable in both mounts.
  - [ ] British spelling in any comment (there should be none — codebase is comment-free).
- [ ] **Task 2 — Mount the desktop fixed link in the `(site)` shell (AC1)**
  - [ ] In `src/components/organisms/site-shell.tsx`, render `<EntryLink />` inside a wrapper pinned **bottom-left**, visible **only at `lg+`**: e.g. `<div className="hidden lg:block fixed bottom-0 left-0 px-8 py-8 z-10"><EntryLink /></div>`. The `px-8 py-8` mirrors `ThemeToggle`'s padding so the two truly bookend (top-left toggle / bottom-left link) within the 48px-class gradient margin.
  - [ ] Place it as a sibling of `<MobileMenu />`/`<main>` (it is page chrome, not part of the content card). Confirm it does **not** disturb the existing shell layout (it is `fixed`, so it is out of flow).
  - [ ] `z-index`: a modest value (≈ `z-10`) so it sits above the static content card but **below** the burger button (`z-index: 1000`) and drawer (`1100`/`1200`). It must remain clickable on every FoH page.
- [ ] **Task 3 — Mount the mobile drawer item in `MobileMenu` (AC2)**
  - [ ] In `src/components/molecules/mobile-menu.tsx`, inside the `Drawer.Content` `itemList`, render `<EntryLink onClick={() => setMenuOpen(false)} />` **below `<NavLinks />`**, visually **set apart** from the primary nav (e.g. a top margin / a faint divider) so it reads as a quiet secondary item, not a fifth nav link.
  - [ ] It inherits the atom's understated treatment; inside the drawer it sits on `bg-primary-200` (not the gradient), so the text-shadow is harmless but unnecessary — no special-casing needed.
  - [ ] Do **not** also add it to `NavLinks` (that molecule is shared and the link is a chrome item, not a nav destination) and do **not** add it to `BackroomMobileMenu` (Backroom must never show it).
- [ ] **Task 4 — Verify (AC4)**
  - [ ] `npm run build` → green, pure static export; confirm every route is `○ (Static)` and there are **no** `.func` (grep the build output / `out/`).
  - [ ] `npm run lint` → clean.
  - [ ] `npm run dev`: on **each** of `/`, `/about-me`, `/resume`, `/content`, confirm the link appears **bottom-left** at `lg+`, navigates to `/backroom`, and is **absent** at `/backroom` and `/backroom/<slug>`.
  - [ ] Resize below `lg` (and on a real/emulated mobile): confirm the fixed link disappears and the **drawer** item appears, set apart from the nav, and that tapping it navigates **and closes the drawer**. Confirm there is never a visible duplicate at any width.
  - [ ] Toggle **dark/light** and eyeball legibility across the gradient on at least the home page, **especially against the gold/terracotta lower end**. If AA can't be cleared even with the text-shadow, **flag to Zac** (AC3).
  - [ ] Keyboard: Tab through a FoH page and confirm the Entry link is reachable with a visible focus ring.
  - [ ] Do **not** fabricate any test run.

## Dev Notes

### What is already built — consume as-is, do NOT rebuild or touch

- **`/backroom` Overview route** is live (Story 2.3/2.4) — the Entry link target. Just link to it; do not touch it.
- **`ThemeToggle`** (`src/components/atoms/theme-toggle.tsx`) — `fixed text-icon-primary px-8 py-8 top-0 left-0`. This is the **mirror reference** for the Entry link's placement (same gradient margin, opposite corner). Do not modify it.
- **`MobileMenu`** (`src/components/molecules/mobile-menu.tsx`) — the **FoH** vaul drawer (`'use client'`, `lg:hidden`), already hosting `<NavLinks onClick={() => setMenuOpen(false)} />`. This is where the mobile Entry link goes. (`BackroomMobileMenu` is the **Backroom** drawer — do **not** touch it; the Entry link must never appear there.)
- **`SiteShell`** (`src/components/organisms/site-shell.tsx`) — the extracted `(site)` FoH shell (Server Component) rendered by `src/app/(site)/layout.tsx`. Mounting the desktop fixed link here == mounting it "in `layout.tsx`" per AR-7/EXPERIENCE.md; it is `(site)`-scoped, so it is automatically FoH-only and never leaks into the Backroom (which uses `backroom/layout.tsx`).
- **`useMenuOpen`** (`src/context/menu-open-context.tsx`) — `{ menuOpen, setMenuOpen }`. Already imported in `MobileMenu`; reuse `setMenuOpen(false)` for the drawer-close onClick.

### The exact Entry-link spec (UX-DR9, DESIGN.md `components.entry-link`, backroom-mock.html)

- **Copy:** `More interested in how this site is built? →` (British spelling; the `→` is the arrow — the mock wraps it in a `.arrow` span coloured `var(--text)`, i.e. same as the text; a plain inline `→` is fine).
- **Colour:** `text-primary` token (`--color-text-primary`: `#fafafa` dark / `#333` light). **Never hardcode** — use the `text-primary` utility or the CSS var.
- **Opacity:** `0.82` (→ `1` on hover).
- **Treatment:** dotted underline + subtle text-shadow "for legibility over the gradient" — this is the **named AA mechanism**, not decoration.
- **Mockup baseline values** (backroom-mock.html `.entry-link`): `position: fixed; left: 20px; bottom: 16px; z-index: 5; font-size: 13px; text-shadow: 0 1px 2px rgba(0,0,0,0.35); border-bottom: 1px dotted rgba(250,250,250,0.5); padding-bottom: 1px;` and `:hover { opacity: 1; color: #fff; border-bottom-color: var(--text); }`.
  - **Reconcile the position with the bookend intent:** the mock used `left:20px/bottom:16px`; the spec says "mirrors the top-left theme toggle," and the toggle uses `px-8 py-8` (32px) at `top-0 left-0`. **Recommendation: mirror the toggle** (`fixed bottom-0 left-0 px-8 py-8`) for a true bookend within the 48px gradient frame — the 20/16px mock figures predate the 48px-frame decision (`.decision-log.md`, 2026-06-24). Either reads as "understated bottom-left"; prefer the toggle mirror for symmetry, and Zac can nudge the exact offset live (he did the same with the 2.5 `h2` underline).

### Theme-aware treatment (the AA-contrast crux — AC3)

The mock's literal values are **dark-theme only** and will fail in light:

- `border-bottom: 1px dotted rgba(250,250,250,0.5)` (near-white dots) is invisible on the **light** gradient (blue→terracotta) under dark `#333` text.
- `text-shadow: 0 1px 2px rgba(0,0,0,0.35)` (dark shadow) behind **light** `#fafafa` text aids legibility in dark theme, but behind **dark** `#333` text in light theme a dark shadow does nothing — you want a **light** shadow there.

**Approach (CSS Module, `.light` is on `<html>` so the established `:global(.light) .x { … }` pattern works):**

- Underline: prefer **`currentColor`**-based dots (`border-bottom: 1px dotted` with the element's `color` = `text-primary`, optionally at reduced alpha) so it auto-flips with the theme — simplest and always theme-consistent. (If you keep an explicit colour, define a dark-theme value and a `:global(.light)` override.)
- Text-shadow: dark theme → `0 1px 2px rgba(0,0,0,0.35)`; `:global(.light)` override → a light halo, e.g. `0 1px 2px rgba(255,255,255,0.5)`. The point is shadow contrasts **against the text**, lifting it off the mid-gradient.
- This mirrors how other CSS Modules in the repo theme themselves; keep all colours token- or `currentColor`-driven (no raw hex for the themed text; the shadow rgba constants are acceptable as they are halo effects, not themed UI surface colour).

> The gradient caveat is a genuine known risk, not a formality: `#fafafa` on gold `#e0b404` is a weak ratio. The design's deliberate answer is the shadow+underline, not a colour change. Build it, then **eyeball against the gold/terracotta end in both themes** (AC4). If it still fails AA, that's a flagged decision for Zac — don't silently ship sub-AA and don't unilaterally repaint the link.

### Mount strategy — one atom, two consumers (no duplicate visible)

- Desktop wrapper in `SiteShell`: `hidden lg:block fixed bottom-0 left-0 …` → visible only `≥ lg`.
- Drawer item in `MobileMenu`: the whole drawer is `lg:hidden` → visible only `< lg`.
- The two breakpoints are mutually exclusive, so the link renders in exactly one place at any width. No `usePathname` gymnastics, no JS breakpoint logic needed — pure CSS responsive, consistent with the FoH/Backroom mobile pattern.
- The atom stays **positionless**; both consumers supply placement. This keeps the atom reusable and the fixed-vs-inline concern at the call site (same separation `BackLink` uses — the atom is just the styled link, the layout wraps it).

### Critical project rules that bite here (project-context.md)

- **Atomic design (strict):** `entry-link` is an **atom** (AR-14 lists it explicitly). One component per file, kebab-case filename (`entry-link.tsx`), PascalCase identifier (`EntryLink`), co-located CSS Module (`entry-link.module.css`).
- **Server vs Client:** add `'use client'` **only** if a component needs interactivity/hooks. The atom needs neither → **no directive**. `MobileMenu` is already a client component; `SiteShell` stays a Server Component.
- **Theming via CSS vars — no hardcoded colours** for themed UI. Use `text-primary`/`--color-text-primary`; theme-flip via `.light`. The shadow rgba halos are an accepted exception (effect, not surface).
- **Tailwind v4:** prefer utilities; drop to the CSS Module only for what Tailwind can't express (the theme-aware text-shadow + dotted underline). Keep any global base CSS out of this — it's component-scoped. Write **complete static class strings** (no dynamic `text-${x}`).
- **Static export only:** the link adds no server surface. Every route must stay `○ (Static)`, no `.func`.
- **Prettier is law:** `singleQuote`, `arrowParens: avoid` (`onClick={() => setMenuOpen(false)}`). Pre-commit `pretty-quick` will reformat — don't hand-fight it.
- **No new dependencies** — `next/link` + CSS Modules + vaul are all already in.
- **British spelling** in user-facing copy ("how this site is built").
- **`npm test` is a stub** — verification = build + lint + manual preview. **Do not fabricate test runs.**

### Project Structure Notes

- **New files (2):** `src/components/atoms/entry-link.tsx`, `src/components/atoms/entry-link.module.css`.
- **Edited files (2):** `src/components/organisms/site-shell.tsx` (mount desktop fixed link), `src/components/molecules/mobile-menu.tsx` (mount drawer item).
- **Do NOT touch:** `src/app/layout.tsx` (root — that's 2.7's console-egg home), anything under `src/app/backroom/**`, `backroom-mobile-menu.tsx`, `back-link.tsx`, `nav-links.tsx`, `theme-toggle.tsx`, the Velite pipeline, or any `docs/public/` content. If you edit any of these, you have left scope — stop and re-read the scope guard.
- No data, routing, dependency, or Backroom changes.

### References

- [Source: epics.md#Story-2.6] — the three ACs (atom + `(site)` mount + bottom-left chrome; a11y + gradient AA caveat; mobile drawer relocation), FR-10.
- [Source: _bmad-output/planning-artifacts/architecture.md → AR-7, AR-14] — Entry link lives in `(site)` layout (FoH-only, never Backroom); `entry-link` is an atom.
- [Source: ux-designs/.../DESIGN.md `components.entry-link` (L120–124) + "Gradient caveat" (L184–186)] — colour `text-primary`, opacity 0.82, dotted underline + text-shadow as the AA mechanism, bottom-left page chrome mirroring the toggle.
- [Source: ux-designs/.../EXPERIENCE.md] — "Entry link" rows in the affordance + responsive (`≥lg` page chrome / `<lg` into the vaul drawer) + a11y (real keyboard-accessible `<a>`, AA on the gradient) tables; "non-event by design" persona note.
- [Source: ux-designs/.../mockups/backroom-mock.html `.entry-link` (L42–62)] — concrete CSS baseline (fixed, 13px, text-shadow, dotted border, hover).
- [Source: ux-designs/.../.decision-log.md (2026-06-24)] — bottom-left page-chrome placement decision; mobile-into-drawer reconciliation; the 48px-frame raise (supersedes the mock's 20/16px offsets).
- [Source: src/components/atoms/theme-toggle.tsx] — the mirror placement reference (`fixed top-0 left-0 px-8 py-8`).
- [Source: src/components/organisms/site-shell.tsx, src/components/molecules/mobile-menu.tsx, src/components/molecules/nav-links.tsx, src/context/menu-open-context.tsx] — the two mount points + the `setMenuOpen(false)` drawer-close pattern.
- [Source: src/app/globals.css] — `--color-text-primary` (`#fafafa`/`#333`), the body gradient (`bg-secondary`→`bg-tertiary`, both themes), `.light` override pattern, `text-primary` utility.
- [Source: _bmad-output/project-context.md] — atomic-design tiers, Server/Client rules, theming-token discipline, static-export constraint, Prettier, dependency restraint, British spelling, no-test-suite verification.

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
