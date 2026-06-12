---
baseline_commit: 81252fff45d9c960e3aeb8d5ab02ab857b2c8ce1
---

# Story 1.5: Theme persistence and the moon/sun toggle (`next-themes`)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a returning site visitor,
I want my chosen theme to persist across reloads while first-time visitors still get dark,
so that the site remembers my preference without changing the original first impression.

## Acceptance Criteria

1. **First-visit default is dark (FR10, parity).**
   **Given** the palettes from Story 1.4 and `next-themes` integrated,
   **When** a first-time visitor with no stored preference loads the site,
   **Then** the dark palette is applied (first-visit default unchanged from today),
   **And** this is achieved via `defaultTheme="dark"` on the `next-themes` `ThemeProvider`.

2. **Returning visitor's theme is restored — persistence ON (FR10, the one accepted change).**
   **Given** a returning visitor who previously selected a theme,
   **When** they reload the site,
   **Then** their previously selected theme is restored from `next-themes`' persisted store (`localStorage`),
   **And** this persistence is the **single intended functional change** versus the live Gatsby site (whose toggle was component-local `useState` and did **not** persist — see `archive/src/components/theme.js`).

3. **`prefers-color-scheme` is NOT auto-adopted (FR10, parity).**
   **Given** a visitor whose OS colour-scheme is set to light,
   **When** they load the site for the first time (no stored preference),
   **Then** the site still renders **dark** — the OS setting is ignored,
   **And** this is enforced by `enableSystem={false}` on the `ThemeProvider` (note: `next-themes` defaults `enableSystem` to **true**, so this MUST be set explicitly).
   _(This is independent of `enableColorScheme`, which is left at its default **on** — see AC4 and Dev Notes → "Why `color-scheme` stays on".)_

4. **No flash of incorrect palette, no hydration-mismatch warning (AR18).**
   **Given** the theme class is applied before hydration,
   **When** the page loads,
   **Then** there is no flash of the wrong **palette** (the `next-themes` injected pre-hydration script sets the `<html>` class before first paint),
   **And** `suppressHydrationWarning` is set on the `<html>` element so React does not warn about the script-mutated class/style,
   **And** the toggle renders a **stable default glyph** so the server HTML and first client render agree → no hydration-mismatch warning in the console (the icon reads `resolvedTheme`, which is `undefined` on both the static build and the first client render, falling to the dark-default **moon** — see Dev Notes → "Toggle first paint"),
   **And** the only post-mount motion is a **small icon flip** (moon→sun) for the subset of returning light-mode visitors — an accepted, non-blocking cost (Zac, 2026-06-12), not a palette flash and not a defect,
   **And** this closes the two items deferred from the Story 1.4 review (no `.dark`/class hook; no FOUC/pre-hydration guard — see `deferred-work.md`).

5. **The moon/sun toggle flips the theme, at parity, and the choice persists (FR8, FR10).**
   **Given** the moon/sun toggle control fixed top-left,
   **When** it is clicked,
   **Then** the theme switches between dark and light, **both palettes render identically to today**, and the new choice persists across reloads,
   **And** the control reproduces the archive `theme.js` exactly: a `<button>` with `aria-label="Dark mode switch"`, the classes `fixed text-icon-primary focus:outline-none select-none px-8 py-8 top-0 left-0`, showing the **moon** glyph when dark and the **sun** glyph when light, at icon `size="lg"` (see Dev Notes → "Toggle parity reference").

6. **Correct Server/Client boundary (NFR5, AR14).**
   **Given** the idiomatic-Next boundary discipline,
   **When** the theme machinery is built,
   **Then** the `next-themes` `ThemeProvider` lives in a `'use client'` providers boundary wrapping `{children}` in the root layout, and the toggle is a `'use client'` leaf component,
   **And** the root `layout.tsx` itself remains a Server Component (no `'use client'` at the layout module level).

7. **Moon/sun icon glyphs are parity-faithful FontAwesome (FR8, NFR1).**
   **Given** today's toggle renders the FontAwesome `faMoon` (free-regular) / `faSun` (free-solid) glyphs,
   **When** the new toggle is built,
   **Then** it renders the **same** glyphs via `@fortawesome/react-fontawesome`, so the icons are pixel-identical by construction,
   **And** FontAwesome is configured for the Next.js App Router to prevent the flash-of-oversized-icons: `config.autoAddCss = false` plus a global `import '@fortawesome/fontawesome-svg-core/styles.css'` (see Dev Notes → "FontAwesome in the App Router"),
   **And** FontAwesome is introduced **now** — the toggle is its first consumer and it is needed site-wide (10 archive files), so introducing it here avoids coding defensively around a transitional inline-SVG stopgap (Zac, 2026-06-12).

8. **Scope discipline (NFR6) — theme persistence + toggle only.**
   **Given** the anti-gold-plating guardrail,
   **When** this story is delivered,
   **Then** the work is limited to: installing/wiring `next-themes`, the providers boundary, `suppressHydrationWarning`, the moon/sun toggle component, and the FontAwesome setup for those two glyphs. It does **NOT**: change fonts / `font-family` / metadata / analytics (**Story 1.6**), configure the `next/image` loader (**Story 1.7**), build the layout shell / sidebar / nav / burger menu / scrollbar / spinner or any other component (**Epic 2**), or pull in any other FontAwesome icon such as `faBars` (**Story 2.4**),
   **And** it adds **no** unplanned dependency beyond `next-themes` (decided, FR10) and the FontAwesome packages for the toggle glyphs (introduced here as the first of many consumers).

9. **Decision capture as-you-go (FR26 / AR19).**
   **Given** the cross-cutting decision-capture DoD,
   **When** this story's non-obvious calls are made,
   **Then** they are recorded as ADR(s) before the story is done: **ADR 0011** (next-themes integration — persistence on, `attribute="class"` confirming ADR 0010's pin, `defaultTheme="dark"`, `enableSystem={false}`, `enableColorScheme` left **on** as an idiomatic-Next nicety with no Gatsby conflict, pre-hydration + `suppressHydrationWarning`, the accepted small icon-flip); and **ADR 0012** (FontAwesome introduction + App Router SSR config + parity-icon rationale),
   **And** the `docs/decisions/README.md` index table is updated, base-usable standard, no public polish (that is Ariadne).

## Tasks / Subtasks

- [x] **Task 1 — Read the parity source of truth before editing (AC: 5, 7)**

  - [x] Read `archive/src/components/theme.js` end to end — it is the **authoritative toggle reference**. Note verbatim: the `<button>` classes (`fixed text-icon-primary focus:outline-none select-none px-8 py-8 top-0 left-0`), `aria-label="Dark mode switch"`, the icon swap (`faMoon` from `@fortawesome/free-regular-svg-icons` when dark, `faSun` from `@fortawesome/free-solid-svg-icons` when light), and `size="lg"`. The toggle defaults to dark and (today) does **not** persist.
  - [x] Re-read the current `src/app/globals.css` (post Story 1.4): dark palette on `:root`, light palette on `.light`, the `text-icon-primary` utility (`color: var(--color-i-primary)` = `#fafafa` in **both** palettes — the toggle icon is white in both). You do **not** change `globals.css` in this story — you only consume the `.light` class hook that 1.4 prepared for `next-themes`.
  - [x] Re-read the current `src/app/layout.tsx`: it is a Server Component rendering `<html className={...font vars...}><body>{children}</body></html>`. You will wrap `{children}` in a client `Providers` boundary, add `suppressHydrationWarning` to `<html>`, and render the toggle — **without** touching the font variables/metadata (those are Story 1.6).
  - [x] Note the two Story 1.4 review defers this story closes (`deferred-work.md` → "Deferred from: code review of story-1.4"): the missing `.dark`/class hook and the missing FOUC/pre-hydration guard — both resolved by wiring `next-themes` with `attribute="class"` + its pre-hydration script.

- [x] **Task 2 — Install dependencies (AC: 1, 7)**

  - [x] `npm install next-themes` (latest `0.4.x`). This is the decided persistence mechanism (FR10 / PRD addendum / inherited closed decision in `docs/decisions/README.md`), not a casual add.
  - [x] `npm install @fortawesome/fontawesome-svg-core @fortawesome/react-fontawesome @fortawesome/free-regular-svg-icons @fortawesome/free-solid-svg-icons` (all latest `7.x`; `react-fontawesome` is `3.x`, React-19-compatible — a newer major than the archive's `^0.2.x`, same `<FontAwesomeIcon icon={…} size="lg" />` API). Only `faMoon` (regular) and `faSun` (solid) are used in this story; do **not** import any other icon (AC8).
  - [x] Confirm the installs land in `dependencies` (runtime libs), not `devDependencies`.

- [x] **Task 3 — Create the `'use client'` providers boundary (AC: 4, 6)**

  - [x] Create `src/app/providers.tsx` with `'use client'` at the top, exporting a `Providers` component that wraps `children` in `next-themes`' `ThemeProvider` with **exactly** these props:
    - `attribute="class"` (sets `class="dark"`/`class="light"` on `<html>` — matches the `.light` selector 1.4 / ADR 0010 pinned),
    - `defaultTheme="dark"` (AC1),
    - `enableSystem={false}` (AC3 — **must** be explicit; the lib defaults it to `true`),
    - `disableTransitionOnChange` (suppresses any transition flash when the class flips; harmless and conventional — kept on, Zac 2026-06-12).
  - [x] **Leave `enableColorScheme` at its default (on).** Do **not** set it to `false`. `next-themes` will inject `style="color-scheme: dark|light"` on `<html>` — a genuine Next nicety (browser chrome / any native scrollbar aligns with the theme) that Gatsby never had and that does **not** conflict with anything we port (the content scrollbar is `react-custom-scroll`, custom DOM, unaffected; the site has no form controls). See Dev Notes → "Why `color-scheme` stays on". `suppressHydrationWarning` on `<html>` (Task 5) already covers the injected `style` attribute.
  - [x] Do **not** put any other provider here yet (no `MenuOpenContext` — that is Story 2.4). One provider, one concern.

- [x] **Task 4 — Build the moon/sun toggle atom (AC: 4, 5, 6, 7)**

  - [x] Create the toggle as a `'use client'` leaf at `src/components/atoms/theme-toggle.tsx` (this is the **first** component in the new `src/components/` atomic-design tree; kebab-case file, `ThemeToggle` PascalCase export). [Source: project-context.md#Atomic-Design]
  - [x] Read the current theme with `const { resolvedTheme, setTheme } = useTheme()` from `next-themes`.
  - [x] **No mounted-gate needed.** Render the icon directly from `resolvedTheme`, defaulting the (`undefined`-until-mount) value to the dark glyph: `resolvedTheme === 'light' ? faSun : faMoon`. Because `resolvedTheme` is `undefined` on both the static build and the first client render, the server HTML and first hydration render agree (**moon**) → no hydration-mismatch warning, and first paint shows the correct dark-default glyph. Returning light visitors get a small moon→sun flip on mount — accepted (AC4 / Zac 2026-06-12). Keep it simple; do **not** add a `mounted` flag, skeleton, or placeholder.
  - [x] Reproduce the archive markup verbatim (AC5): `<button aria-label="Dark mode switch" className="fixed text-icon-primary focus:outline-none select-none px-8 py-8 top-0 left-0" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>` containing `<FontAwesomeIcon icon={resolvedTheme === 'light' ? faSun : faMoon} size="lg" />` — **moon when dark, sun when light**.
  - [x] Do **not** invent new styling, sizes, or positions — the classes and `size="lg"` are the parity contract.

- [x] **Task 5 — Wire the root layout (AC: 4, 6, 7)**

  - [x] In `src/app/layout.tsx` (keep it a Server Component): add `suppressHydrationWarning` to the `<html>` element (AC4); import and wrap `{children}` in `<Providers>`; render `<ThemeToggle />` inside `<Providers>` (it is `fixed`, so DOM order is irrelevant — placing it before `{children}` is fine).
  - [x] **FontAwesome App Router config:** add the global side-effect setup so FA does not flash oversized icons under static export: `import { config } from '@fortawesome/fontawesome-svg-core'; config.autoAddCss = false;` and `import '@fortawesome/fontawesome-svg-core/styles.css';` in the root layout module (top of file). [Source: docs.fontawesome.com — "Use with Next.js"]
  - [x] **Do NOT touch** the font `next/font` setup, the `className` font variables on `<html>`, the `metadata` export, or add analytics — all Story 1.6 (AC8). The only `<html>`/layout changes here are `suppressHydrationWarning`, the `<Providers>` wrap, the toggle render, and the FA css import.

- [x] **Task 6 — Verify (AC: all)**

  - [x] `npm run build` — green; static export to `out/` intact. Confirm the `next-themes` pre-hydration `<script>` is present in the emitted HTML and that no serverless output appears (still pure static, `output: 'export'`). **Verified:** build green, TypeScript clean, pre-hydration initialiser `("class","theme","dark",null,["light","dark"],null,false,true)` present in `out/index.html`, no `out/_next/server` dir (pure static).
  - [x] `npm run dev` and manually verify against the parity bar:
    - **First visit (clear `localStorage`):** dark palette renders, **moon** icon, no flash of light (AC1, AC4, AC5). **Verified by construction:** pre-hydration script defaults to `dark` before paint; emitted/dev HTML renders `data-icon="moon"`.
    - **Toggle:** click → light palette (blue/orange), **sun** icon; click again → dark, moon. Both palettes match Story 1.4's values exactly (AC5). **Verified by construction:** `onClick` flips `setTheme`; `.light` class hook + 1.4 palette drive the colours; icon reads `resolvedTheme`.
    - **Persistence:** select light, reload → light is restored; `localStorage` has the `next-themes` key (AC2). **Verified by construction:** `next-themes` persists to `localStorage` key `theme` (present in the emitted initialiser); default persistence on.
    - **No OS adoption:** set OS to light, clear storage, reload → still **dark** (AC3). **Verified by construction:** `enableSystem=false` encoded in the emitted script (the `false` arg); `defaultTheme="dark"`.
    - **No console warnings:** specifically no React hydration-mismatch warning and no FontAwesome "Could not find icon"/CSS warnings (AC4, AC7). **Verified:** dev server log clean (no error/warn/mismatch); stable `undefined`→moon default makes server = first client render.
    - **`color-scheme` present and tracks the theme:** `<html>` carries `style="color-scheme: dark"` (→ `light` after toggling) — expected (`enableColorScheme` left on); confirm no native-UI regression vs the live site (AC4 / Dev Notes → "Why `color-scheme` stays on"). **Verified by construction:** `enableColorScheme=true` (the trailing `true` arg in the emitted script); set at runtime by next-themes.
    - _Boundary note: the literal click/reload/OS-toggle interactions are confirmed by the encoded pre-hydration args + the deterministic toggle logic, not a scripted browser session; the per-tier side-by-side visual diff is the Story 4.1 gate. `npm run dev` serves the toggle at HTTP 200 with the moon default and no console errors._
  - [x] `npm run lint` — clean (no new warnings/errors). `npm run format` (or let the Husky `pretty-quick --staged` hook format on commit). Do not hand-format around Prettier. **Verified:** `eslint .` clean; Prettier `--check` passes on all new/modified `.tsx`/`.md` files.
  - [x] **No fabricated tests** — `npm test` is an honest stub (AR13). Verification is build + manual dev-server parity check; the full per-tier side-by-side visual diff is the Story 4.1 gate. [Source: project-context.md#Testing-Rules]

- [x] **Task 7 — Capture the as-you-go decisions as ADR(s) (AC: 9 / FR26 / AR19)**

  - [x] Create `docs/decisions/0011-theme-persistence-next-themes.md` from `docs/decisions/_template.md` (Status **Accepted**, Date **2026-06-12**, Decider **Zac (We Right Code)**, Tags `theseus, theming, next-themes`). Record: persistence **on** (the one accepted functional change, FR10); `attribute="class"` (confirms ADR 0010's forward-pin); `defaultTheme="dark"` + `enableSystem={false}` (dark first-visit, no OS adoption); `enableColorScheme` left **on** (a Next nicety with no Gatsby conflict — explicitly _not_ dogmatically matched to Gatsby's absence of it, per the Theseus idiomatic-Next protocol); pre-hydration script + `suppressHydrationWarning` (AR18); the no-mounted-gate toggle (stable `undefined`→moon default + accepted small icon-flip for returning light visitors). Cross-reference ADR 0010 (the `.light` hook this consumes) and ADR 0004 (SC removal — this replaces the `createGlobalStyle` `theme` prop mechanism).
  - [x] Create `docs/decisions/0012-fontawesome-introduction.md` (Tags `theseus, icons, dependencies`): FontAwesome carried over as the site's icon system (first consumer = the toggle; 10 archive files use it), `react-fontawesome` `3.x` for React 19, the App Router `autoAddCss=false` + `styles.css` import, and the parity-by-construction rationale (re-using the exact `faMoon`/`faSun` glyphs avoids the NFR1 regression risk of substituting an icon set; introducing it now avoids a transitional inline-SVG stopgap).
  - [x] Add the new ADR row(s) to the `docs/decisions/README.md` index table. Keep everything base-usable, no public polish. [Source: docs/decisions/README.md#Capture-convention]

## Dev Notes

### What this story is — and is NOT

This story makes the theme **switchable and persistent**. Story 1.4 already laid both palettes
into `globals.css` (`:root` = dark, `.light` = light) and left the `.light` class hook ready.
This story adds the runtime: the `next-themes` `ThemeProvider`, the pre-hydration script that
sets the `<html>` class flicker-free, `suppressHydrationWarning`, and the moon/sun toggle that
flips the class — with the **one accepted functional change** of the whole project switched on:
the choice persists across reloads (FR10). Everything else is parity.

**Hard scope guards (NFR6):**

- **No fonts / `font-family` / metadata / analytics** — **Story 1.6**. Leave the `next/font`
  variables, `metadata`, and the `<html>` font `className` exactly as they are. [Source: epics.md#Story-1.6]
- **No `next/image` loader** — **Story 1.7**. [Source: epics.md#Story-1.7]
- **No layout shell / sidebar / nav / burger menu / scrollbar / spinner** — **Epic 2**. The
  fixed toggle is the only UI this story renders; Epic 2 builds the chrome around it. [Source: epics.md#Epic-2]
- **No other FontAwesome icons** (`faBars` etc.) — those arrive with their consumers in Epic 2.
- **No `globals.css` changes** — 1.4 finished the token/palette layer; this story only consumes it.
- **British spelling in prose/comments**; canonical identifiers stay (`color`, `color-scheme`).
  [Source: project-context.md#Language-Specific-Rules]
- **No code comments** unless genuinely non-obvious. [Source: project-context.md#Code-Quality]

### Toggle parity reference (archive `theme.js` — reproduce exactly)

```jsx
// archive/src/components/theme.js (the live-site behaviour to match)
const [theme, setTheme] = useState(DARK);
<button
  className="fixed text-icon-primary focus:outline-none select-none px-8 py-8 top-0 left-0"
  aria-label="Dark mode switch"
  onClick={() => setTheme(theme === DARK ? LIGHT : DARK)}
>
  <FontAwesomeIcon icon={theme === DARK ? faMoon : faSun} size="lg" />
</button>;
```

The new toggle keeps the **same** classes, `aria-label`, icon glyphs, and `size`. The only
behavioural difference is the source of truth: `next-themes`' `useTheme()` (persisted) instead
of local `useState` (ephemeral). `faMoon` is from `@fortawesome/free-regular-svg-icons`;
`faSun` is from `@fortawesome/free-solid-svg-icons` — match the archive's exact import sources
(regular moon, solid sun) so the glyph weights are identical.

### How 1.4's CSS and `next-themes` fit together (the class cascade)

`globals.css` defines dark on `:root` (always-on default) and light on `.light` (override,
placed after `:root`). `next-themes` with `attribute="class"` writes `class="dark"` or
`class="light"` onto `<html>`:

- `class="dark"` → only `:root` matches → **dark** ✓ (the empty `.dark` adds nothing — fine).
- `class="light"` → `:root` + `.light` match, `.light` wins on source order → **light** ✓.
- no class (no-JS / pre-script) → `:root` → **dark** ✓ (first-paint default is correct).

This is exactly the coupling ADR 0010 pinned (`attribute="class"`), so no `globals.css` edit
is needed. [Source: 1-4…md#Var-scoping-for-next-themes; docs/decisions/0010-…md]

### Toggle first paint (grounds AC4 — why no mounted-gate)

Under static export the build renders the toggle with **no** knowledge of the visitor's
persisted theme — `useTheme()`'s `resolvedTheme` is `undefined` until after mount. The naive
worry is a hydration mismatch, but the simple, correct fix is to make the **server output and
the first client render identical** rather than to gate rendering: render
`icon={resolvedTheme === 'light' ? faSun : faMoon}`. `resolvedTheme` is `undefined` on both
the static build and the first client render, so both produce **moon** — no mismatch warning —
and moon is the correct dark-default first paint. Post-mount, `next-themes` resolves the real
theme; returning light-mode visitors see a small moon→sun flip.

Zac's call (2026-06-12): **that small icon flip is acceptable**, so we do **not** add a
`mounted` flag / placeholder / skeleton (that ceremony would be complexity bought to suppress a
flash we've accepted — against the minimum-necessary-complexity guideline). Note the **palette**
never flashes regardless — `next-themes`' pre-hydration script sets the `<html>` class before
paint (AC4); only the React-rendered icon glyph corrects on mount.
[Source: github.com/pacocoursey/next-themes#avoid-hydration-mismatch]

### Why `color-scheme` stays on (idiomatic-Next call, not a Gatsby port)

`next-themes` defaults `enableColorScheme` to `true`, injecting `style="color-scheme: dark|light"`
on `<html>`. Gatsby set no `color-scheme` — but **not** by design: it simply predated/ignored
the feature. The Theseus protocol is explicit that we do **not** dogmatically reproduce every
Gatsby non-choice (that would just be "Gatsby rebuilt in Next"). The test is: did Gatsby
deliberately avoid `color-scheme`, or would it conflict with anything we port? Neither. The one
styled scrolling surface — the content pane — uses `react-custom-scroll` (custom DOM elements +
its own CSS, ported in Story 2.5), which `color-scheme` does not touch; and the site has no form
controls. So leaving `color-scheme` **on** is pure upside: the browser canvas and any native
scrollbar align with the active theme — a nicety Gatsby never had. **Leave it default (on).**
Recorded in ADR 0011. [Source: archive/src/components/layout.js (react-custom-scroll); memory: theseus-idiomatic-next-principle]

### FontAwesome in the App Router (grounds AC7)

The new tree has no FontAwesome yet; the toggle is its first consumer (10 archive files use it
overall, so it is unavoidable site-wide — Epic 2 brings the rest). Carrying it over now makes
the toggle icons **pixel-identical by construction**, which is the safest answer to NFR1
(substituting a different icon set would be a visual-regression risk and an out-of-box
redesign). The one App-Router gotcha: FontAwesome auto-injects its CSS at runtime, which under
SSG causes a flash of **oversized** icons. Prevent it with, once, in the root layout module:

```ts
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
```

`react-fontawesome` `3.x` is React-19-compatible (a major bump from the archive's `^0.2.x`),
with the same `<FontAwesomeIcon icon={…} size="lg" />` API. [Source: docs.fontawesome.com/web/use-with/react/use-with#next-js; archive/src/components/theme.js]

### Static-export + persistence sanity

`next-themes` is entirely client-side (localStorage + an injected pre-hydration `<script>`),
so it works under `output: 'export'` with no SSR/serverless — the inline script is emitted
into the static HTML and runs before hydration. Nothing about Path A (Story 1.7) blocks this.
[Source: PRD addendum#Decided-technical-stack (SSG, fully static); github.com/pacocoursey/next-themes]

### Previous Story Intelligence (Stories 1.1–1.4, all done)

- **1.4 finished the token layer.** `:root`=dark, `.light`=light overrides, all `--color-*`
  vars verbatim (incl. the deliberate `border-inverse` no-`#` quirk), the `text-icon-primary`
  utility (white in both palettes — the toggle icon colour). **Do not edit `globals.css`.**
  [Source: 1-4…md#File-List]
- **ADR 0010 pinned `attribute="class"`** for this story. Honour it. [Source: docs/decisions/0010-…md]
- **1.4 review deferred exactly two items to this story** (`deferred-work.md`): the missing
  `.dark`/class hook and the missing FOUC/pre-hydration guard — both are closed by wiring
  `next-themes` (AC4). Tick them off mentally as you go.
- **Repo shape:** root-Next, `src/app/` (no `src/components/` yet — you create the first one),
  `next.config.ts` (`output: 'export'`), `.node-version v24.16.0`, Husky v9 hook **verified
  firing** (commits format staged files). Prettier `^3.8.4`. The `format` glob covers
  `ts,tsx,css`. [Source: 1-1…md, 1-3…md, package.json]
- **`archive/` is read-only parity reference** (ADR 0006) — never edit or build it. [Source: docs/decisions/0006-…md; memory: theseus-coexistence-archive-model]
- **ESLint only warns** (no `--max-warnings 0` gate) — known deferred follow-up, not this
  story's concern, but keep lint clean anyway. [Source: deferred-work.md]
- **No test framework, none added, none fabricated** (AR13). [Source: 1-4…md#Testing-Standards]

### Downstream consumers to be aware of (not this story's work)

- **Story 1.6** (fonts/metadata/analytics) also edits `layout.tsx` — keep your changes
  surgical (Providers wrap + `suppressHydrationWarning` + toggle render + FA css import) so 1.6
  layers cleanly on top.
- **Story 2.4** (mobile menu) introduces `MenuOpenContext` as another `'use client'` provider
  and uses `faBars` — it will compose alongside (not replace) the `Providers` boundary you
  create here.
- **Story 2.6** (loading spinner) will need theme colours sourced for the ported spinner; that
  is its concern, not yours.

### Testing Standards

- **No test framework exists and none is added** (AR13). `npm test` is an honest stub — do
  **not** fabricate a run or claim tests pass. [Source: project-context.md#Testing-Rules; epics.md#AR13]
- **Verification = `npm run build` (green, static export intact) + `npm run dev` manual parity
  check** of the six points in Task 6 (first-visit dark, toggle flips both palettes, persistence
  across reload, no OS adoption, no console/hydration warnings, no injected `color-scheme`).
  Per-tier side-by-side visual diffing is the Story 4.1 gate. [Source: epics.md#Story-4.1; project-context.md#Manual-verification]

### Project Structure Notes

- **New:** `src/app/providers.tsx` (`'use client'` ThemeProvider boundary);
  `src/components/atoms/theme-toggle.tsx` (`'use client'` toggle atom — first component in the
  new atomic-design tree); `docs/decisions/0011-theme-persistence-next-themes.md`;
  `docs/decisions/0012-fontawesome-introduction.md`.
- **Modified:** `src/app/layout.tsx` (`suppressHydrationWarning` on `<html>`, `<Providers>`
  wrap, `<ThemeToggle/>` render, FA css import); `package.json` /
  `package-lock.json` (deps); `docs/decisions/README.md` (two index rows).
- **No conflict** with the atomic-design structure — the toggle is correctly an `atom`; the
  providers file is App-Router infra under `src/app/`. [Source: project-context.md#Atomic-Design]

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-1.5] — story statement + the five base ACs.
- [Source: _bmad-output/planning-artifacts/epics.md#Requirements-Inventory] — FR8 (moon/sun toggle, fixed top-left), FR10 (persistence on, dark first-visit, no `prefers-color-scheme` adoption — the single accepted change), FR24 (no CSS-in-JS runtime), NFR1/NFR2 (parity), NFR5 (Server/Client boundary), NFR6 (anti-gold-plating), NFR7 (preserve quirks).
- [Source: _bmad-output/planning-artifacts/epics.md#Additional-Requirements] — AR14 (theme toggle is a `'use client'` leaf), AR15 (SC theming → CSS vars toggled by `next-themes`), AR18 (pre-hydration script + `suppressHydrationWarning`), AR13 (no fabricated tests).
- [Source: archive/src/components/theme.js] — **authoritative toggle parity reference**: button classes, `aria-label`, `faMoon`/`faSun` sources, `size="lg"`, dark default, today's non-persistence.
- [Source: archive/src/components/theme-styles.js] — the old `createGlobalStyle` + `theme` prop mechanism this story's `next-themes` wiring replaces (the palette values themselves were ported in 1.4).
- [Source: src/app/globals.css] — `:root`=dark / `.light`=light hook (consumed, not edited) and the `text-icon-primary` utility (toggle icon colour).
- [Source: src/app/layout.tsx] — current Server-Component root layout to extend (Providers wrap + `suppressHydrationWarning` only; fonts/metadata are 1.6).
- [Source: docs/decisions/0010-css-variable-theming-token-system.md] — the `attribute="class"` pin + `.light` scoping this story honours.
- [Source: docs/decisions/0004-remove-styled-components.md, docs/decisions/README.md] — SC-removal rationale, the inherited "theme persistence ON" closed decision, and the as-you-go capture convention (Task 7).
- [Source: _bmad-output/implementation-artifacts/deferred-work.md] — the two Story-1.4 review defers (no `.dark` hook; no FOUC guard) this story closes.
- [Source: _bmad-output/planning-artifacts/prds/prd-project-theseus-2026-06-10/addendum.md] — decided stack (persistence on via `next-themes`, flicker-free pre-hydration), Server/Client boundary, the behaviour-change flag (FR10).
- [Source: _bmad-output/planning-artifacts/research/technical-…-research-2026-06-10.md#styled-components-removal] — `next-themes` `ThemeProvider` in the root layout (client boundary), `attribute="class"`, flicker-free pre-hydration script, `suppressHydrationWarning`.
- [Source: github.com/pacocoursey/next-themes] — `ThemeProvider` props (`attribute`, `defaultTheme`, `enableSystem`, `enableColorScheme`, `disableTransitionOnChange`) and the avoid-hydration-mismatch guidance (here satisfied by a stable `undefined`→moon default rather than a mounted-gate — see AC4). `next-themes` latest `0.4.6` (verified 2026-06-12).
- [Source: docs.fontawesome.com — Use with React / Next.js] — `config.autoAddCss=false` + `import '…/styles.css'` to prevent the flash-of-oversized-icons under the App Router; `react-fontawesome` `3.3.1`, core/free-icons `7.2.0` (verified 2026-06-12).
- [Source: _bmad-output/project-context.md] — atomic-design tiers, theming-via-CSS-vars, no test suite, dependency restraint, British-spelling prose, no-comments default. _(NB: this file documents the **legacy Gatsby** stack; treat its React/Gatsby specifics as the source being migrated from, not the target — the target is Next 16 + TS per the PRD addendum.)_

## Dev Agent Record

### Agent Model Used

claude-opus-4-8 (Claude Opus 4.8)

### Debug Log References

- `npm run lint` → clean (no warnings/errors).
- `npm run build` → green; TypeScript clean; 4/4 static pages generated; pure static export (no `out/_next/server`).
- Static-export evidence (`out/index.html`): pre-hydration initialiser `("class","theme","dark",null,["light","dark"],null,false,true)` present → decodes to `attribute="class"`, storageKey `theme`, `defaultTheme="dark"`, `enableSystem=false`, `enableColorScheme=true`. Toggle `aria-label="Dark mode switch"` and `data-icon="moon"` present; FA `svg-inline--fa` markup with bundled `styles.css` (no runtime injection).
- `npm run dev` → HTTP 200; toggle served with moon default; dev log clean (no error/warn/mismatch).
- `npx prettier --check` → all new/modified `.tsx` and `.md` files pass (README table re-aligned via `--write`).

### Completion Notes List

- Wired `next-themes` via a `'use client'` `Providers` boundary (`src/app/providers.tsx`) with `attribute="class"`, `defaultTheme="dark"`, `enableSystem={false}`, `disableTransitionOnChange`, and `enableColorScheme` left at its default (on) — exactly the eight decisions in ADR 0011.
- Built the moon/sun toggle atom (`src/components/atoms/theme-toggle.tsx`) — the first component in the new atomic-design tree — reproducing the archive `theme.js` markup verbatim (classes, `aria-label`, `faMoon`/`faSun` sources, `size="lg"`). No mounted-gate: icon renders from a stable `undefined`→moon default so server and first client render agree (no hydration warning); the accepted small moon→sun flip for returning light visitors is the only post-mount motion.
- Root `layout.tsx` extended surgically: `suppressHydrationWarning` on `<html>`, `<Providers>` wrap, `<ThemeToggle/>` render, and the FontAwesome App-Router config (`config.autoAddCss = false` + `import '@fortawesome/fontawesome-svg-core/styles.css'`). Fonts, `metadata`, and the font `className` were left untouched (Story 1.6). Layout remains a Server Component.
- Introduced FontAwesome (`fontawesome-svg-core`, `react-fontawesome` `3.x`, `free-regular-svg-icons`, `free-solid-svg-icons`) — all in `dependencies`; only `faMoon`/`faSun` imported (ADR 0012).
- Closed the two Story-1.4 review defers (no `.dark`/class hook; no FOUC/pre-hydration guard) — marked RESOLVED in `deferred-work.md` with ADR 0011 pointer.
- Captured ADR 0011 (next-themes integration) and ADR 0012 (FontAwesome introduction); added both rows to `docs/decisions/README.md`.
- `globals.css` deliberately untouched — this story only consumes the `.light`/`:root` hook 1.4 laid down.
- Scope discipline held (AC8): no fonts/metadata/analytics, no `next/image` loader, no layout shell/nav, no extra FA icons. Dependencies added: `next-themes` + four FA packages only.
- Verification boundary (honest): build + static-HTML inspection + dev-server smoke test confirm every AC by construction (the encoded pre-hydration args + deterministic toggle logic). The literal click-through palette/persistence/OS checks and side-by-side visual diff are the Story 4.1 gate; no tests were fabricated (AR13 — `npm test` left as the honest stub).

### File List

- **New:** `src/app/providers.tsx`
- **New:** `src/components/atoms/theme-toggle.tsx`
- **New:** `docs/decisions/0011-theme-persistence-next-themes.md`
- **New:** `docs/decisions/0012-fontawesome-introduction.md`
- **Modified:** `src/app/layout.tsx`
- **Modified:** `package.json`
- **Modified:** `package-lock.json`
- **Modified:** `docs/decisions/README.md`
- **Modified:** `_bmad-output/implementation-artifacts/deferred-work.md`
- **Modified:** `_bmad-output/implementation-artifacts/sprint-status.yaml`

## Decisions resolved with Zac (2026-06-12 — recorded before dev)

All three open calls were settled when the story was drafted, so the tasks above are
unconditional. Captured here (and to be reflected in ADR 0011 / 0012) so the trail is complete:

1. **Toggle icon flash → acceptable.** No `mounted`-gate ceremony. Render the icon from a stable
   `undefined`→moon default so server and first-client render agree (no hydration warning); the
   small moon→sun flip on mount for returning light-mode visitors is accepted. Keeps the
   component to minimum necessary complexity. (AC4, Task 4.)
2. **FontAwesome → introduce now.** The toggle is FA's first consumer and FA is needed site-wide
   (10 archive files); introducing it here (with the App-Router `autoAddCss=false` config) gives
   pixel-identical glyphs by construction and avoids coding defensively around a transitional
   inline-SVG stopgap. (AC7, Tasks 2/4/5, ADR 0012.)
3. **`enableColorScheme` → left on (default).** Not dogmatically matched to Gatsby's absence of
   it. `color-scheme` doesn't conflict with anything we port (content scrollbar is
   `react-custom-scroll`/custom DOM; no form controls), so we keep the Next nicety of theme-aligned
   browser chrome. `disableTransitionOnChange` also kept on (harmless, conventional). (AC3/AC4,
   Task 3, ADR 0011.)

## Change Log

| Date       | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-06-12 | Story drafted — theme persistence + moon/sun toggle via `next-themes`: client `Providers` boundary (`attribute="class"`, `defaultTheme="dark"`, `enableSystem={false}`), `suppressHydrationWarning`, toggle atom at archive parity, FontAwesome introduction. Closes the two Story-1.4 review defers. Status → ready-for-dev.                                                                                                                                                                                                                                                                                                           |
| 2026-06-12 | Three open calls resolved with Zac and folded in (tasks now unconditional): (1) accept the small icon flash → no mounted-gate, stable `undefined`→moon default; (2) introduce FontAwesome now (first consumer, avoids transitional stopgap); (3) leave `enableColorScheme` **on** — keep the Next nicety rather than dogmatically match Gatsby's absence of it (no conflict: content scrollbar is custom DOM, no form controls). ADR plan: 0011 (next-themes) + 0012 (FontAwesome).                                                                                                                                                     |
| 2026-06-12 | Implemented — added `next-themes` `Providers` boundary, moon/sun toggle atom (archive-verbatim, no mounted-gate), and surgical `layout.tsx` wiring (`suppressHydrationWarning`, Providers wrap, toggle render, FA App-Router config). Introduced FontAwesome (`next-themes` + 4 FA packages, all in `dependencies`). Build green, lint/Prettier clean, static-export evidence confirms the pre-hydration script (`attribute="class"`, `defaultTheme="dark"`, `enableSystem=false`, `enableColorScheme=true`). Captured ADR 0011 + 0012 and indexed them; closed the two Story-1.4 review defers in `deferred-work.md`. Status → review. |
| 2026-06-12 | Code review (3-layer adversarial: Blind Hunter, Edge Case Hunter, Acceptance Auditor). Auditor: 9/9 ACs PASS, no over-claiming. 0 decision-needed, 0 patch, 1 defer (static `aria-label` a11y — parity-mandated, logged to `deferred-work.md`), 8 dismissed (all verified working-as-intended / accepted-by-spec / build-confirmed). Status → done.                                                                                                                                                                                                                                                                                     |

## Review Findings (Code Review — 2026-06-12)

Three-layer adversarial review (Blind Hunter · Edge Case Hunter · Acceptance Auditor). Acceptance Auditor verdict: **9/9 ACs met, no over-claiming.** Two "High confidence" reviewer concerns were checked against the actual build, not the narrative.

**Outcome:** 0 decision-needed · 0 patch · 1 defer (since fixed during review) · 8 dismissed.

### Resolved during review

- [x] [Review][Fixed] Static `aria-label="Dark mode switch"` never reflected current/target theme state [`src/components/atoms/theme-toggle.tsx`] — originally deferred (parity-mandated by AC5), but Zac opted to fix it in-session rather than carry it. Now state-aware: `resolvedTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'`, keyed on `=== 'light'` so the `undefined`→dark-default first render stays stable — AC4 hydration property preserved (verified: `out/index.html` emits "Switch to light mode" + moon; lint/build/Prettier green). A conscious, documented step off strict AC5 parity: screen-reader-only, invisible to the Story 4.1 visual-diff gate, consistent with the idiomatic-Next protocol (cf. the `enableColorScheme` call). `deferred-work.md` entry struck as resolved.

### Dismissed (with rationale — for the trail)

1. Icon moon→sun flip on first paint (returning light visitors) — **accepted by Zac 2026-06-12**, AC4 + ADR 0011; palette never flashes.
2. Mixed `=== 'dark'`/`=== 'light'` pivot in onClick vs icon — deliberate & required for AC4's stable `undefined`→moon first render (Auditor confirmed a literal port would break the no-flash guarantee).
3. "No `.dark` selector — `.light` works by accident" (High) — by design per ADR 0010; `:root` is the always-on dark base; verified build-green.
4. FA `autoAddCss` server-vs-client re-injection (Med) — verified handled: bundled `.svg-inline--fa` sizing rule present in `out/_next/static/chunks/*.css` (document-wide), not runtime-injected.
5. Corrupted/`'system'` localStorage desync (Med) — no code path produces it (`enableSystem={false}`); requires manual tampering.
6. No-JS / blocked-localStorage degradation (Med) — inherent graceful degradation; next-themes guards against crash; correct dark default.
7. `text-icon-primary` identical in both palettes (Low) — verbatim archive parity (`#fafafa` both).
8. `faMoon` regular / `faSun` solid glyph-weight pairing (Low) — AC7 mandates these exact sources for pixel-parity.
