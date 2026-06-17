---
baseline_commit: 7f0108f3b16c869f2c2a353772c9c867cc7db122
---

# Story 2.5: Custom scrollbar with route-change scroll reset

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a site visitor,
I want the custom scrollbar and the scroll-to-top-on-navigation behaviour preserved,
so that scrolling and page changes feel exactly as they do today.

## Context & purpose (read first)

This is the **fifth story of Epic 2** (Persistent App Shell & Navigation). After Stories
2.1–2.4 the shell is structurally complete: the animated content pane (2.1), the shared nav +
Download CV (2.2), the desktop sidebar (2.3), and the mobile burger drawer (2.4). Two shell
pieces remain — **this story (custom scrollbar + route-change scroll reset)** and the
**loading spinner (2.6)**.

Today the content pane scrolls inside a **custom scrollbar** and, **on every route change,
resets its scroll position to the top**. Both behaviours are preserved verbatim (FR5, NFR7).
The scroll-reset is one of the project's three explicitly-named **intentional quirks** —
driven today by `setCurrentScrollPos(Math.random())` — that must be **reimplemented
faithfully, not removed or "fixed" as dead/random code** (NFR7, and project-context.md's
"`setCurrentScrollPos(Math.random())` is intentional" gotcha).

**The scrollbar mechanism decision is RESOLVED — read "Decision: the scrollbar is built on
`react-custom-scroll@7.2.0`" below.** The archive used `react-custom-scroll` (the `Scrollbar`
component). Stories 2.3/2.4 carried a "react-burger-menu/react-custom-scroll never coming
back" note — **but** that referred to the _stale_ archive-era versions. The live npm package
`react-custom-scroll` shipped **v7.2.0** (a modern, React-19-**tested** release). On a
**zero-visual-regression parity migration** (NFR1), re-adding the archive's _own now-modern_
library is the call that yields **byte-identical** scrollbar visuals and lets the archive's
CSS handle-override port **verbatim**. This was Zac's call on 2026-06-17 (decision trail at the
end of this story), to be captured in ADR **0019**.

**2.5's job — four things:**

1. **Add `react-custom-scroll@^7.2.0`** and wrap the content-pane children in its
   `<CustomScroll>` with `heightRelativeToParent="calc(100% - 20px)"` — visible whenever
   content overflows, styled to the archive's `.rcs-*` look.
2. **Reimplement the route-change scroll reset** faithfully: drive `CustomScroll`'s `scrollTo`
   from a value that changes on every `usePathname()` change (the modern equivalent of the
   archive's `setCurrentScrollPos(Math.random())` on `[pathname]`), inside the existing
   `'use client'` content-transition wrapper (AR14) — **not** removed or "tidied away" (NFR7).
3. **Port the archive's themed handle override** (`.rcs-inner-handle` →
   `background: var(--color-bg-secondary); opacity: 0.8;`) into a co-located CSS Module via
   `:global(...)`, and import the library's own `customScroll.css`.
4. **Keep `src/app/layout.tsx` untouched** — all work lands inside
   `src/components/molecules/content-transition.tsx` (already the content-pane `'use client'`
   wrapper with `usePathname`), its CSS, and `package.json`. The scrollbar is the named
   `'use client'` leaf AR14 anticipates.

**The single source of visual/behavioural truth is the live site** (`zackerthehacker.com`)
and the archived Gatsby implementation. This is a **parity port** (NFR1/NFR2) — re-adding the
archive's own library means there is **no intended visual delta** here (unlike the 2.4 `vaul`
modal-semantics delta). Everything — handle colour/width, appears-on-hover fade, the
scroll-shadow gradient, the 20px height offset, and scroll-to-top on navigation — matches
today.

## Acceptance Criteria

1. **The content pane shows the custom scrollbar when content overflows, behaving as today,
   inside a `'use client'` boundary (FR5, AR14).**
   **Given** the content pane,
   **When** its content overflows the available height,
   **Then** the **custom scrollbar** renders and behaves as today — a thin handle on the right,
   themed to `var(--color-bg-secondary)` at `0.8` opacity, with the archive's
   `heightRelativeToParent="calc(100% - 20px)"` height offset (FR5),
   **And** it is implemented via **`react-custom-scroll@^7.2.0`**'s `<CustomScroll>` inside the
   existing `'use client'` content-transition wrapper (AR14) — `src/app/layout.tsx` **stays a
   Server Component** and is **not edited** by this story.

2. **Scroll position resets to the top on every route change — the intentional quirk,
   reimplemented faithfully (FR5, NFR7).**
   **Given** the visitor has scrolled down a page,
   **When** they navigate to another route,
   **Then** the content pane's scroll position **resets to the top** (FR5),
   **And** this is reimplemented faithfully as a `scrollTo` value that **changes on every
   `usePathname()` change** (the modern equivalent of the archive's
   `setCurrentScrollPos(Math.random())` on `[pathname]`) — it is **not** removed, **not**
   "fixed" as dead/random code, and **not** replaced by browser-default scroll restoration
   (NFR7).

3. **Byte-identical appearance via the archive's own (now-modern) library — themed handle
   ported verbatim (NFR1, FR9).**
   **Given** the archive styled the handle with
   `.rcs-custom-scroll .rcs-inner-handle { background: var(--color-bg-secondary); opacity: 0.8; }`
   (`archive/src/components/layout.css`),
   **When** the scrollbar is built,
   **Then** that override is ported **verbatim** (selector adjusted only if v7's installed
   class names differ — verify against the installed `customScroll.css`, see Dev Note) into a
   **co-located CSS Module** using `:global(...)`, and the library's own `customScroll.css` is
   imported so the base scrollbar styles (track, handle geometry, hover-fade, scroll-shadow)
   render as today,
   **And** the scrollbar appearance is verified against the live site in **both themes**
   (handle colour follows the theme via the `--color-bg-secondary` token).

4. **One justified dependency — the archive's own library, modern release; no hand-rolling, no
   alternative lib (NFR5, NFR6, AR14).**
   **Given** the idiomatic-Next, modern-stack posture and the zero-regression bar,
   **When** the scrollbar is implemented,
   **Then** it uses **`react-custom-scroll` pinned `^7.2.0`** (React-19-tested) as the **only**
   new direct dependency — **not** a hand-rolled native-CSS scrollbar, **not** SimpleBar /
   OverlayScrollbars / `react-custom-scrollbars`, **not** `react-burger-menu` or any other
   package,
   **And** this **consciously, narrowly reverses** the 2.3/2.4 "react-custom-scroll never
   coming back" note — for the **modern v7 only**; the stale archive-era version still does not
   return (record in ADR 0019).

5. **Idiomatic-Next boundaries held; minimal surface (NFR5, NFR6, AR14).**
   **Given** the Server/Client boundary discipline,
   **When** the component is built,
   **Then** the scrollbar lives in the **already-`'use client'`** content-transition leaf
   (which already owns `usePathname` for the route-transition animation) — **no new client
   boundary is introduced**, `src/app/layout.tsx` keeps its `metadata` export and is not
   touched, and the only files changed are the content-transition component, its CSS Module,
   `package.json`/`package-lock.json`, and the ADR/index + sprint/story tracking.

6. **Build green; static export intact; parity verified; scope held (NFR1/NFR2/NFR6).**
   **Given** the change,
   **When** `npm run build` and `npm run lint` are run,
   **Then** both are green (TS strict, **no `any`**, no lint errors) and the build stays a
   **pure static export** (routes `○ (Static)`, no serverless functions),
   **And** in **both themes** the custom scrollbar (themed handle, hover behaviour, 20px
   offset) and scroll-to-top-on-navigation are verified against the live site,
   **And** none of the remaining shell pieces are built — **no** loading spinner (2.6) — and no
   unrelated files (sidebar, mobile menu, nav, theming, fonts, analytics) are touched.

7. **Decision capture as-you-go (FR26 / AR19).**
   **Given** the cross-cutting decision-capture DoD,
   **When** the non-obvious calls in this story are made,
   **Then** they are recorded in a new ADR (next free number **0019**), indexed in
   `docs/decisions/README.md`: (a) **the scrollbar mechanism — `react-custom-scroll@7.2.0`
   over native-CSS and over SimpleBar/OverlayScrollbars** (rationale: byte-identical parity,
   the archive CSS ports verbatim, the lib is now React-19-tested; the conscious narrow
   reversal of the 2.3/2.4 "never coming back" note, scoped to v7 only); (b) **the
   route-change scroll-reset reimplementation** (`scrollTo` bumped on `usePathname` change as
   the faithful modern equivalent of `Math.random()` — quirk preserved, NFR7); (c) any
   pragmatism call surfaced during build (e.g. an ambient type declaration if v7 ships no
   types, or an SSR/static-export guard if one proves necessary).

## Tasks / Subtasks

- [ ] **Task 1 — Add the `react-custom-scroll` dependency** (AC: #4, #7)
  - [ ] Install `react-custom-scroll` pinned `^7.2.0`. Confirm it lands in `package.json`
        `dependencies` (not dev) and `package-lock.json` updates. This is the **only** new
        direct dependency in this story.
  - [ ] **Verify React 19 peer compatibility installs cleanly** (no peer-dep error; v7 is
        React-18+/19-tested). Do **not** add `--legacy-peer-deps` to mask a real conflict — if
        one appears, stop and flag it.
  - [ ] Do **not** add SimpleBar, OverlayScrollbars, `react-custom-scrollbars`,
        `react-burger-menu`, or any other package.
  - [ ] **Confirm the installed type situation**: check whether v7 ships its own `.d.ts`
        (import resolves under `strict` with no implicit-`any`). If types are **missing**, add a
        minimal ambient declaration `src/types/react-custom-scroll.d.ts` typing only the props
        used (`children`, `heightRelativeToParent?: string`, `scrollTo?: number`,
        `addScrolledClass?: boolean`, `onScroll?`) — **no `any`** in app code. Record this in the
        Dev Agent Record and ADR 0019(c). (Prefer bundled types; only declare if absent.)

- [ ] **Task 2 — Confirm the v7 CSS import path and class names** (AC: #1, #3)
  - [ ] After install, inspect `node_modules/react-custom-scroll/dist/` to confirm the exact
        **CSS filename/path** (archive used `react-custom-scroll/dist/customScroll.css`) and the
        **handle class name** the override must target.
  - [ ] The archive bundled `.rcs-custom-scroll .rcs-inner-handle` (themed via `layout.css`).
        **Verify v7 still emits `rcs-`-prefixed classes** (esp. the inner handle). If v7 renamed
        them, adjust the `:global(...)` override selector to match the installed names — the
        themed handle **must** actually apply (parity-critical). Record the confirmed
        selector in the Dev Agent Record.

- [ ] **Task 3 — Port the themed handle override into a co-located CSS Module** (AC: #3)
  - [ ] Add the handle override to a **co-located CSS Module** (e.g.
        `src/components/molecules/content-transition.module.css`) using `:global(...)` because
        `rcs-*` are **library-global** class names (CSS Modules scope by default):
        `css
    :global(.rcs-custom-scroll .rcs-inner-handle) {
      background: var(--color-bg-secondary);
      opacity: 0.8;
    }
    `
        Values **byte-for-byte** from `archive/src/components/layout.css` (selector adjusted only
        per Task 2 if v7 differs).
  - [ ] Do **not** restyle the rest of the scrollbar — the library's `customScroll.css` provides
        track/handle geometry, the hover opacity-fade, and the scroll-shadow gradient. Only the
        handle **colour/opacity** is overridden (the single archive override).
  - [ ] Use **`--color-bg-secondary`** (the themed token) so the handle colour tracks dark/light
        automatically — do **not** hardcode `#04b4e0`/`#3058b5` (project-context themed-colour
        rule).

- [ ] **Task 4 — Wrap the content in `<CustomScroll>` + reimplement the scroll reset** (AC: #1, #2, #5)
  - [ ] In `src/components/molecules/content-transition.tsx` (already `'use client'`, already
        imports `usePathname`), add at the top:
        `import CustomScroll from 'react-custom-scroll';`,
        `import 'react-custom-scroll/dist/customScroll.css';` (path per Task 2), and
        `import styles from './content-transition.module.css';` (the override).
  - [ ] **Mirror the archive nesting** (`archive/src/components/layout.js:113–129`): place
        `<CustomScroll>` **inside** `<AnimateOnChange>`, wrapping the children:
        `tsx
    <AnimateOnChange ...>
      <CustomScroll
        heightRelativeToParent="calc(100% - 20px)"
        scrollTo={scrollPos}
        addScrolledClass
      >
        <div key={pathname} className="h-full">
          {children}
        </div>
      </CustomScroll>
    </AnimateOnChange>
    `
        Keep the existing `AnimateOnChange` props (`animationIn="fadeInUp"`,
        `animationOut="bounceOut"`, `durationIn={100}`, `durationOut={100}`, `className="h-full w-full"`)
        and the `key={pathname}` inner div — both unchanged.
  - [ ] **Reimplement the scroll reset faithfully** (the `Math.random()` quirk): add a
        client-only state + effect keyed on `pathname` that bumps `scrollTo` on every route
        change so `<CustomScroll>` scrolls back to the top:
        `tsx
    const [scrollPos, setScrollPos] = useState(0);
    useEffect(() => {
      setScrollPos(Math.random());
    }, [pathname]);
    `
        This is the **direct port** of `archive/src/components/layout.js:44,57–59` — a sub-1
        `scrollTo` value (≈ top) that **changes each navigation** so the prop-change re-fires the
        scroll. Keep `Math.random()` **inside the effect** (client-only, post-mount) so there is
        **no SSR/hydration mismatch**. Do **not** "improve" it to a static `0` (the prop would
        never change → reset stops firing on repeat navigations) and do **not** swap in browser
        scroll restoration. See Dev Note "Why `Math.random()` is the faithful port".
  - [ ] **Decide `addScrolledClass` by parity, not by guess:** the archive's bundled rcs
        rendered the top inner-shadow gradient (`.rcs-content-scrolled:after`); in **v7 this is
        opt-in via `addScrolledClass`**. Check the **live site** — if scrolling the content pane
        shows a subtle top shadow, pass `addScrolledClass` (parity-faithful default); if it does
        not, omit it. Record the call in the Dev Agent Record / ADR 0019.

- [ ] **Task 5 — Verify (build, lint, static export, in-shell parity, both themes)** (AC: #6)
  - [ ] `npm run build` → green, **pure static export** (routes `○ (Static)`, no functions).
        `npm run lint` → clean (TS strict, no `any`). `npm run format`. Record exact outputs in
        the Dev Agent Record. **Watch specifically for an SSR/SSG error** from `<CustomScroll>`
        during the static export (it renders during server prerender of the client component): if
        the build throws on `window`/`document` at render time, apply the **minimal** guard (a
        `mounted` gate or `next/dynamic` `ssr: false` import of the scroll wrapper) and record it
        in ADR 0019(c) — but only if the build actually fails; do **not** pre-emptively add it
        (the archive SSR'd this fine under Gatsby).
  - [ ] `npm run dev`, load `/` (and, once Epic 3 adds routes, navigate between them) in **both
        themes**, compare to the live site: (a) when content overflows, the thin themed handle
        appears on the right with the hover-fade; (b) the handle colour matches
        `--color-bg-secondary` in each theme; (c) the `calc(100% - 20px)` height offset matches;
        (d) **scroll down, then navigate → the new page starts at the top**. Note: at this point
        only `/` exists, so the scroll-reset is best exercised by temporarily adding overflow
        content or deferring the full multi-route check to the Story 4.1 gate — **do not add
        page content** to test it (scope). State honestly in the Dev Agent Record what was and
        was not observable pre-Epic-3.
  - [ ] Confirm `src/app/layout.tsx` is **unchanged** (git diff shows no layout edits) and the
        2.3 sidebar / 2.4 mobile menu / nav / theming / fonts / analytics are untouched.
  - [ ] Do **not** run `npm test` (stub `exit 1` — AR13).

- [ ] **Task 6 — Decision capture** (AC: #7)
  - [ ] Create `docs/decisions/0019-<short-title>.md` from `docs/decisions/_template.md`
        (Status: Accepted; Date: 2026-06-17; Decider: Zac; Tags: `theseus, scrollbar`/`dependencies`)
        capturing: (a) **`react-custom-scroll@7.2.0`** over native-CSS and over
        SimpleBar/OverlayScrollbars (rationale: byte-identical parity + verbatim CSS port + lib
        now React-19-tested; the **conscious narrow reversal** of the 2.3/2.4 "never coming back"
        note, scoped to v7 only — the stale version still doesn't return); (b) **the scroll-reset
        reimplementation** (`scrollTo` bumped on `usePathname` change = faithful modern port of
        `Math.random()`, quirk preserved per NFR7); (c) any build-time pragmatism call (ambient
        type decl and/or SSR guard, if needed).
  - [ ] Add the 0019 row to the ADR index table in `docs/decisions/README.md`.
  - [ ] If genuinely-deferrable hardening surfaces, log it in
        `_bmad-output/implementation-artifacts/deferred-work.md` — do **not** gold-plate it in
        (NFR6).

## Dev Notes

### What this story changes (small surface)

- **New:** `src/components/molecules/content-transition.module.css` (the `:global` handle
  override), `docs/decisions/0019-…md`, and **conditionally**
  `src/types/react-custom-scroll.d.ts` (only if v7 ships no types).
- **Modified:** `src/components/molecules/content-transition.tsx` (add `<CustomScroll>` wrap +
  `scrollTo` state/effect + three imports — **stays `'use client'`**), `package.json` +
  `package-lock.json` (add `react-custom-scroll`), `docs/decisions/README.md` (index 0019),
  `_bmad-output/implementation-artifacts/sprint-status.yaml`, this story file.
- **Not touched:** **`src/app/layout.tsx`** (no layout edit at all — the scrollbar lives one
  level down in `ContentTransition`), the 2.3 sidebar (`${styles.hero}` block, identity grid,
  `<nav>`, `NavLinks`/`NavLink`), the 2.4 mobile menu (`mobile-menu.*`, `menu-open-context.tsx`),
  `ThemeToggle`, `Providers`, `globals.css`, theming/tokens, fonts/metadata/GA (1.6),
  `animate-on-change.*`, `animations.ts`. **Do not re-open earlier work.** `AnimateOnChange`
  is reused **unchanged** — `<CustomScroll>` nests inside it.

### Decision: the scrollbar is built on `react-custom-scroll@7.2.0` (ADR 0019) — and why

The archive used `react-custom-scroll` (`import Scrollbar from 'react-custom-scroll'`,
`archive/src/components/layout.js:6,113`). Three options were weighed on 2026-06-17:

- **Native CSS** (`scrollbar-width`/`scrollbar-color` + `::-webkit-scrollbar`) — now Baseline
  (Safari 26.2, Dec 2024), zero deps, most idiomatic; but a **cosmetic near-parity** (native
  gutter vs overlay, no appears-on-hover fade nuance, no scroll-shadow gradient). A scrollbar is
  purely cosmetic and native scroll is already accessible, so there are **no a11y mechanics to
  rebuild** (unlike the 2.4 drawer) — which is what made native CSS a real contender.
- **SimpleBar / OverlayScrollbars (a "modern primitive")** — rejected: more work than re-adding
  the archive lib (bespoke theming, lose the scroll-shadow) for **less** parity, and their
  **React wrappers carry the same maintenance yellow-flag** (OverlayScrollbars' wrapper ~1–2y
  quiet; `simplebar-react` "partially maintained", React-19 unconfirmed). Worst of both worlds:
  still a dep, not exact parity, not better-maintained.
- **`react-custom-scroll@7.2.0` (CHOSEN)** — the archive's **own** library, now a **modern,
  React-19-tested** release. Yields **byte-identical** visuals, the archive's `.rcs-inner-handle`
  override ports **verbatim**, and it is the only JS option **explicitly tested against React
  19**. On a zero-visual-regression migration (NFR1) that parity is decisive.

This **consciously, narrowly reverses** the 2.3/2.4 "react-custom-scroll never coming back"
note — **only** for the modern v7. The _stale_ archive-era version still does not return.
Record the reversal explicitly in ADR 0019 (decision-capture DoD).

**No parity delta is expected here** (contrast 2.4's `vaul` modal-semantics delta): re-adding
the archive's own library reproduces today's behaviour exactly. The only "watch" items are
verification details (v7 class names, the `addScrolledClass` opt-in, types/SSR under static
export), not intended behavioural changes.

### Why `Math.random()` is the faithful port (NFR7 — preserve the quirk)

The archive's scroll-reset (`archive/src/components/layout.js:44,57–59,120`):

```js
const [currentScrollPos, setCurrentScrollPos] = useState(0);
useEffect(() => { setCurrentScrollPos(Math.random()); }, [pathname]);
// ...
<Scrollbar scrollTo={currentScrollPos}>
```

This works because `react-custom-scroll`'s `scrollTo` scrolls to the given pixel offset **when
the prop value changes**. `Math.random()` returns a value in `[0, 1)` — **sub-one pixel ≈ the
top** — and, critically, a **different value on every navigation**, which is what makes the
prop change and re-fires the scroll. A static `scrollTo={0}` would scroll to top **once**, then
never again (the prop wouldn't change on the next navigation). That is precisely why the archive
used `Math.random()`, and why project-context.md flags it as **intentional, not dead/random
code**. Reimplement it as-is (state bumped to `Math.random()` in a `[pathname]` effect). Keep
`Math.random()` **inside the effect** (runs client-only after mount) so it never executes during
SSR/prerender — no hydration mismatch. NFR7: preserve the quirk, do not "fix" it.

### Nesting + interaction with `AnimateOnChange` (reuse, don't modify)

Mirror the archive: `<CustomScroll>` sits **inside** `<AnimateOnChange>`, wrapping the
`key={pathname}` children div. On navigation, `ContentTransition` re-renders → `scrollPos`
updates (effect) and the children change → `AnimateOnChange` runs its out/in transition and the
new `<CustomScroll>` content starts at the top. This is byte-faithful to the archive ordering
(`AnimateOnChange` → `Scrollbar` → children).

**Known, pre-existing fragility (do not fix here):** the Story 2.1 code-review logged that
`AnimateOnChange`'s out→in handshake can mis-time under rapid burst navigation
(`deferred-work.md`, story-2.1). That is byte-identical archive logic, only reachable once Epic
3 adds multiple routes, and is **already deferred** — do **not** rework `AnimateOnChange` in
this story. If wrapping it with `CustomScroll` interacts oddly during the Story 4.1 gate, that's
the place to revisit, not here (NFR6).

### v7 API specifics (verify on install)

- **Import:** `import CustomScroll from 'react-custom-scroll';` (default export; use PascalCase
  `<CustomScroll>` in JSX).
- **CSS:** `import 'react-custom-scroll/dist/customScroll.css';` — **confirm the exact path**
  in `node_modules/react-custom-scroll/dist/` after install (Task 2). Third-party (node_modules)
  CSS may be imported in a component in the App Router — it does **not** have to go in
  `layout.tsx` (only your _own_ global CSS is layout-only). The archive imported it via a
  relative `node_modules` path; use the package-relative import here.
- **Props used:** `heightRelativeToParent="calc(100% - 20px)"` (string, the archive value),
  `scrollTo={scrollPos}` (number), and **`addScrolledClass`** (boolean, **v7 opt-in** for the
  top scroll-shadow — set per the live-site parity check in Task 4). Other props (`onScroll`,
  etc.) are not needed.
- **Class names:** archive bundled `rcs-`-prefixed classes (`.rcs-custom-scroll`,
  `.rcs-inner-handle`, `.rcs-content-scrolled`). Confirm v7 keeps them; if renamed, update the
  `:global(...)` override selector accordingly (Task 2) — the themed handle must apply.

### Static-export / SSR compatibility (AR4)

`react-custom-scroll` is a client component used inside the already-`'use client'`
`ContentTransition`. Next still **prerenders** client components on the server for the initial
HTML under `output: 'export'`, so if v7 touches `window`/`document` **during render** (not in an
effect) the static build could throw. The archive SSR'd this component under Gatsby without
issue, so it is **likely** fine — **verify the build is green** (Task 5) and only if it actually
fails apply the minimal guard (a `mounted` state gate, or `next/dynamic(..., { ssr: false })`
for the scroll wrapper), recording it in ADR 0019(c). Do **not** add the guard speculatively
(NFR6 — minimum necessary complexity).

### Project structure & conventions (from project-context.md — note the Theseus divergence)

- **Atomic design:** the change lives in the **molecule** `content-transition.tsx` (it composes
  the `AnimateOnChange` atom + the library). No new component tier is needed — folding the
  scrollbar into the existing content-pane wrapper is the minimum-complexity, AR14-faithful
  placement (the scrollbar is the named `'use client'` leaf). Filenames **kebab-case**,
  components **PascalCase**.
- **TypeScript strict, no `.js` source** (AR2) — new/edited files are `.tsx`/`.ts`/`.css`; type
  the `scrollTo` state as `number`; **no `any`** (incl. the ambient decl, if added — type the
  props used). Use TS types, not `PropTypes` (project-context.md's PropTypes/Gatsby rules
  describe the **archive** stack; follow the Theseus artifacts where they diverge, as
  1.7/2.1–2.4 established).
- **Prettier is law** (`^3.8.4`): single quotes, `arrowParens: avoid`. Run `npm run format`;
  Husky `pretty-quick --staged` on commit. This story adds **no new visible body copy**.
- **No code comments by default**; don't leave "removed code" comments. The one place a short
  comment is warranted is the `Math.random()` scroll-reset, to mark it as the intentional quirk
  (project-context.md keeps a comment on this exact line in `globals.css` precedent) — a single
  terse line is fine; not required.
- **British spelling** in user-facing copy; none added here. Keep CSS/JS identifiers canonical
  (`color`, `background`).
- **Themed colours only / no interpolated class names** — the handle uses the
  `--color-bg-secondary` token via the CSS Module; all selectors are static literals (PurgeCSS /
  Tailwind v4 scan safety). The only non-token CSS is the library's own `customScroll.css`
  (vendored, ported verbatim by import).

### Scope seams — do NOT build now (NFR6)

Out of scope for 2.5: the **loading spinner** (2.6 — `archive` `LoadingSpinner` + the
`readyState` effect; do **not** port it here). Do **not** add any page content to "test" the
scroll-reset (Epic 3). Do **not** touch `src/app/layout.tsx`, the 2.3 sidebar, the 2.4 mobile
menu/context, `ThemeToggle`, `Providers`, `globals.css`, fonts/metadata/analytics, or rework
`AnimateOnChange`/`animations.ts`. Do **not** add SimpleBar/OverlayScrollbars or re-add
`react-burger-menu`.

### Testing standards (AR13 — no suite to fabricate)

No test framework exists; `npm test` is a stub that exits 1 — **do not** run it as a test or
invent a suite. Verification: `npm run build` green + pure static export, `npm run lint` clean,
and **manual behavioural parity** in **both themes** (themed handle on overflow, hover-fade,
the `calc(100% - 20px)` offset, and scroll-down-then-navigate → top). Be honest that the
**multi-route** scroll-reset cannot be fully exercised until Epic 3 adds routes — observe what
you can on `/` (and via the dev server) and flag the rest for the Story 4.1 visual/behavioural
gate. Record real command outputs; do not claim parity you have not seen.

### Project Structure Notes

- The scrollbar folds into the existing content-pane wrapper (`content-transition.tsx`) rather
  than a new component — it is the AR14 "custom scrollbar (incl. route-change reset)" client
  leaf, and that wrapper already owns `usePathname`. The handle override is a co-located CSS
  Module (`content-transition.module.css`), matching the 2.4 `mobile-menu.module.css` pattern
  for component-scoped CSS that needs `:global(...)` for library classes.
- Mirrors the archive's `layout.js` co-location of animation + scrollbar + scroll-reset, minus
  the `MenuOpenContext.Provider` (already lifted to the 2.4 `MenuProvider` at layout level) and
  minus styled-components (gone since Epic 1).

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.5] — the two Given/When/Then ACs
  (custom scrollbar on overflow in a `'use client'` boundary; scroll-resets-to-top on
  navigation, the `Math.random()` quirk reimplemented faithfully, not "fixed").
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 2] — shell decomposition; 2.5 =
  scrollbar/scroll-reset, 2.6 = spinner (the seam not to build).
- [Source: _bmad-output/planning-artifacts/epics.md#Additional Requirements] — AR14 (the custom
  scrollbar incl. route-change reset is a named `'use client'` leaf), AR4 (static export), AR13
  (no fabricated suite), AR8 (`usePathname` from `next/navigation`, already in
  `content-transition.tsx`).
- [Source: _bmad-output/planning-artifacts/epics.md#Functional/NonFunctional Requirements] —
  FR5 (custom scrollbar + route-change scroll reset), FR9 (themed `--color-*` tokens — handle
  colour), NFR1/NFR2 (parity bar — no intended delta here), NFR5 (idiomatic/modern Next), NFR6
  (anti-gold-plating), NFR7 (preserve the scroll-reset quirk verbatim).
- [Source: archive/src/components/layout.js:6,8,44,57–59,113–129] — the `react-custom-scroll`
  import + CSS import, the `currentScrollPos`/`Math.random()`-on-`[pathname]` scroll-reset, and
  the `<Scrollbar heightRelativeToParent="calc(100% - 20px)" scrollTo={currentScrollPos}>`
  nesting inside `AnimateOnChange` — the exact behaviour this story reproduces on v7.
- [Source: archive/src/components/layout.css:38–41] — the **authoritative handle override**
  `.rcs-custom-scroll .rcs-inner-handle { background: var(--color-bg-secondary); opacity: 0.8; }`
  to port verbatim into the CSS Module via `:global(...)`.
- [Source: src/components/molecules/content-transition.tsx] — the current `'use client'`
  content-pane wrapper (already imports `usePathname`, already wraps children in
  `AnimateOnChange` with the `key={pathname}` div) — where `<CustomScroll>` + the `scrollTo`
  state/effect land.
- [Source: src/components/atoms/animate-on-change.tsx] — the ported route-transition atom,
  **reused unchanged**; `<CustomScroll>` nests inside it (and inherits the 2.1-deferred
  burst-navigation handshake caveat — not fixed here).
- [Source: src/app/layout.tsx] — the content-pane `<div ... bg-primary-400 ... overflow-hidden>`
  wrapping `<ContentTransition>{children}</ContentTransition>`; **unchanged by this story**
  (the scrollbar lives inside `ContentTransition`).
- [Source: src/app/globals.css] — `--color-bg-secondary` token (dark `#04b4e0` / light
  `#3058b5`) the handle override references; the `@layer base` discipline (the CSS Module's
  `:global` handle rule targets a library class with no competing Tailwind utility, so it is
  safe outside `@layer`).
- [Source: react-custom-scroll (npm, ^7.2.0; nirgit/rommguy) — README] — `import CustomScroll
from 'react-custom-scroll'`; props `heightRelativeToParent` (string), `scrollTo` (number),
  `addScrolledClass` (boolean, opt-in for the `content-scrolled` shadow), `onScroll`; React 18+
  /19-tested; ship `customScroll.css` from `dist/`.
- [Source: _bmad-output/implementation-artifacts/2-4-mobile-burger-menu-below-lg.md] — prior
  story: the deferred scrollbar/`react-custom-scroll` seam (explicitly "Story 2.5"), the
  `.rcs-custom-scroll` CSS line **not** ported in 2.4 (ported here), the "never coming back"
  note (consciously, narrowly reversed here for v7 only), the verification-honesty bar, the
  Theseus-vs-archive divergence note, ADR discipline (0018 → 0019), the Server-Component-layout
  invariant, the CSS-Module-`:global` pattern.
- [Source: \_bmad-output/implementation-artifacts/2-1-persistent-layout-shell-content-pane-and-animations.md
  - deferred-work.md (story-2.1)] — the `AnimateOnChange` out→in handshake fragility (pre-existing,
    deferred) that `<CustomScroll>` nests inside; do not rework here.
- [Source: docs/decisions/_template.md + README.md] — ADR format + index for the 0019 capture;
  0018 is the highest existing number. ADR 0015 (animations) and 0018 (the `vaul` lib-choice
  precedent + conscious-reversal pattern) are the nearest precedents.
- [Source: _bmad-output/project-context.md] — JS/TS rules, Prettier law, atomic structure,
  themed-colour + no-interpolated-classnames rules, and the **`setCurrentScrollPos(Math.random())`
  is intentional — do not "fix"** gotcha (describes the **archive** stack; follow the Theseus
  artifacts where they diverge).

## Decision trail (resolved 2026-06-17)

Scrollbar mechanism was an open call at story creation. The path: I first leaned **native CSS**
(zero deps; `scrollbar-width`/`scrollbar-color` now Baseline; a scrollbar is cosmetic so there
are no a11y mechanics to rebuild — unlike the 2.4 drawer). Research then surfaced that (a) the
archive's own `react-custom-scroll` shipped a **modern, React-19-tested v7.2.0** (the "stale"
objection is gone), and (b) the "modern primitive" alternatives I floated — **OverlayScrollbars**
and **SimpleBar** — are _worse_ here: their React wrappers carry maintenance yellow-flags and
they cost **more** bespoke theming work for **less** parity (no verbatim CSS port, no
scroll-shadow). Pricing SimpleBar's migration confirmed it offered no concrete advantage. On a
**zero-visual-regression** migration (NFR1), **Zac chose `react-custom-scroll@7.2.0`** — the
archive's own now-modern library — for byte-identical parity, the verbatim handle-CSS port, and
React-19 support, accepting one focused dependency (mirroring the 2.4 `vaul` precedent). This
**narrowly reverses** the 2.3/2.4 "never coming back" note for the modern v7 only; the stale
version still does not return. Recorded in ADR 0019.

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

## Change Log

| Date       | Change                                                                                                          |
| ---------- | --------------------------------------------------------------------------------------------------------------- |
| 2026-06-17 | Story created (ready-for-dev); scrollbar mechanism resolved to `react-custom-scroll@7.2.0` (ADR 0019, pending). |
