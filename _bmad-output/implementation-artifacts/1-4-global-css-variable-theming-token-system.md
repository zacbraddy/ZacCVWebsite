---
baseline_commit: 0847d86207d84b1bb7aa371f5c73188fe4e6b98b
---

# Story 1.4: Global CSS-variable theming token system

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a site visitor,
I want the site's colours to render exactly as they do today,
so that the migrated site is visually indistinguishable from the original in both palettes.

## Acceptance Criteria

1. **Both palettes expressed as `--color-*` CSS custom properties, values matching the archive exactly (FR9).**
   **Given** Tailwind v4 and global CSS in place,
   **When** the theming tokens are defined,
   **Then** both the dark and light palettes are expressed as `--color-*` CSS custom properties whose values **exactly** match the current `darkThemeValues` / `lightThemeValues` in `archive/src/components/theme-styles.js` (including the verbatim, possibly-quirky values — see AC7),
   **And** the dark palette is defined as the default and the light palette under a theme selector that Story 1.5's `next-themes` will toggle.

2. **The v3 Tailwind token utilities map onto those vars with their per-family values preserved (FR9).**
   **Given** the palette vars,
   **When** the Tailwind token utilities are wired,
   **Then** the exact v3 token class names compile and apply: `bg-primary-200`, `bg-primary-400`, `bg-secondary`, `bg-tertiary`, `text-primary`, `text-secondary`, `text-tertiary`, `text-icon-primary`, `text-icon-secondary`, `border-secondary`, `border-inverse`,
   **And** each resolves to its **own** family var (so `text-secondary`, `bg-secondary`, and `border-secondary` can hold **different** colours, as they do in the light palette — `#49629c` vs `#3058b5` vs `#3058b5`), not a single shared token,
   **And** every such utility continues to work with variants (responsive `xs:`/`md:`, state, etc.) exactly as a normal Tailwind utility.

3. **The body `:before` gradient renders from the vars, visually identical to today (FR9).**
   **Given** the themed body,
   **When** the page renders,
   **Then** the body `:before` fixed full-viewport layer renders `linear-gradient(var(--color-bg-secondary), var(--color-bg-tertiary))` (default direction `to bottom`, matching the archive's explicit `to bottom`) and is visually identical to today,
   **And** `body` sets `background: var(--color-bg-secondary)` and `color: var(--color-text-primary)` as the archive does.

4. **Dark renders by default with no theme switching wired.**
   **Given** no theme switching is wired yet (`next-themes` is Story 1.5),
   **When** the app loads,
   **Then** the dark palette renders by default with no JavaScript and no flash.

5. **Styled-components-free — global CSS variables only (FR24).**
   **Given** the styled-components-free foundation,
   **When** theming is delivered,
   **Then** it uses **only** global CSS in `src/app/globals.css` — no `createGlobalStyle`, no `styled-components` import, no CSS-in-JS runtime anywhere in the new `src/` tree.

6. **[HARD DoD — do not regress the Story 1.3 border guard] The default Tailwind colour palette is NOT wiped.**
   **Given** the Story 1.3 border/ring/divide guard depends on Tailwind v4's default `--color-gray-200` variable ([ADR 0009](../../docs/decisions/0009-tailwind-v4-border-ring-divide-guard.md)),
   **When** the token system is defined,
   **Then** this story **MUST NOT** wipe or `initial` the default Tailwind colour palette (e.g. `@theme { --color-*: initial; }` or any blanket palette reset) **without** simultaneously re-pointing the `globals.css` border guard at an explicit value,
   **And** the existing guard block (`border-color: var(--color-gray-200, currentColor)`) is left intact and still resolves to `#e5e7eb` after this story's changes (verified in the compiled CSS).

7. **[HARD parity check — NFR7] Quirky archive values ported verbatim, not "fixed".**
   **Given** the archive `borderColor.inverse` values are `'fafafa'` (dark) and `'5a5a5a'` (light) — **with no leading `#`** (a latent quirk that makes the `border-inverse` colour resolve as invalid, so those borders fall back to `currentColor` on the live site),
   **When** the `--color-border-inverse` var is defined,
   **Then** it is ported **verbatim including the missing `#`** (`--color-border-inverse: fafafa;` dark / `5a5a5a;` light), so the five `border-inverse` usages render **identically to today** — they are **not** "corrected" to a valid colour (that would introduce a visible border where today there is none = a visual regression, NFR1/NFR7).

8. **Scope discipline (NFR6) — tokens only; no `next-themes`, no toggle, no UI.**
   **Given** the anti-gold-plating guardrail,
   **When** the token system is delivered,
   **Then** the work is limited to the palette vars, the token utilities, the body gradient/background, and replacing the create-next-app colour boilerplate in `globals.css`. It does **not** install or wire `next-themes`, build the moon/sun toggle, add the pre-hydration script (all **Story 1.5**), touch fonts/`font-family`/metadata/analytics (**Story 1.6**), configure the image loader (**1.7**), or create any atomic-design component (Epics 2–3).

## Tasks / Subtasks

- [ ] **Task 1 — Read the source of truth before editing (AC: 1, 7)**

  - [ ] Read `archive/src/components/theme-styles.js` end to end. It is the **authoritative palette source** — every `--color-*` value in this story is copied from `darkThemeValues` / `lightThemeValues` and `populateVars` there. Do not invent or "tidy" values.
  - [ ] Read the current `src/app/globals.css` (post Story 1.3): it has the create-next-app boilerplate (`:root { --background; --foreground }`, two `@media (prefers-color-scheme: …)` blocks, body resets), the Story 1.3 `@import 'tailwindcss';`, `@theme { --breakpoint-xs: 410px; }`, and the `@layer base` border guard. You **extend** this file; you do not rewrite the parts that must stay (see Dev Notes → "Target `globals.css`").
  - [ ] Note the at-risk consumers you must not break: the Story 1.3 border guard (`--color-gray-200`), the `xs` breakpoint, and the five `border-inverse` usages in the archive (`atoms/portrait-image.js`, `atoms/testimonial-portrait.js`, `organisms/content-item.js`).

- [ ] **Task 2 — Define both palettes as `--color-*` custom properties (AC: 1, 4, 7)**

  - [ ] In `globals.css`, define the **dark** palette on `:root` (the default) and the **light** palette on a theme selector (`.light`) that comes **after** `:root` in the file. Use the exact var names from `populateVars` and the exact values below (copied verbatim from `theme-styles.js`):

    | Var                        | Dark (`:root`)              | Light (`.light`)            |
    | -------------------------- | --------------------------- | --------------------------- |
    | `--color-bg-primary-200`   | `#555`                      | `#ddd`                      |
    | `--color-bg-primary-400`   | `#333`                      | `#eee`                      |
    | `--color-bg-secondary`     | `#04b4e0`                   | `#3058b5`                   |
    | `--color-bg-tertiary`      | `#e0b404`                   | `#e6593d`                   |
    | `--color-bg-inverse`       | `#fafafa`                   | `#333`                      |
    | `--color-i-primary`        | `#fafafa`                   | `#fafafa`                   |
    | `--color-i-secondary`      | `#04b4e0`                   | `#3058b5`                   |
    | `--color-text-primary`     | `#fafafa`                   | `#333`                      |
    | `--color-text-secondary`   | `#04b4e0`                   | `#49629c`                   |
    | `--color-text-tertiary`    | `#e0b404`                   | `#cc715f`                   |
    | `--color-border-secondary` | `#04b4e0`                   | `#3058b5`                   |
    | `--color-border-inverse`   | `fafafa` ← **no `#` (AC7)** | `5a5a5a` ← **no `#` (AC7)** |

  - [ ] **AC7 is non-negotiable:** `--color-border-inverse` is `fafafa` / `5a5a5a` with **no `#`**. This is deliberate parity with the archive's quirk. Do not add `#`. (If unsure, see Dev Notes → "The `border-inverse` parity trap".)
  - [ ] **Do not** reintroduce a runtime theme prop or any JS — these are static CSS vars (AC5).

- [ ] **Task 3 — Map the v3 token utilities via `@utility` (AC: 2, 6)**

  - [ ] For each v3 token class, define a custom utility with `@utility` (top-level, v4-idiomatic), each referencing its own family var:

    ```css
    @utility bg-primary-200 {
      background-color: var(--color-bg-primary-200);
    }
    @utility bg-primary-400 {
      background-color: var(--color-bg-primary-400);
    }
    @utility bg-secondary {
      background-color: var(--color-bg-secondary);
    }
    @utility bg-tertiary {
      background-color: var(--color-bg-tertiary);
    }
    @utility text-primary {
      color: var(--color-text-primary);
    }
    @utility text-secondary {
      color: var(--color-text-secondary);
    }
    @utility text-tertiary {
      color: var(--color-text-tertiary);
    }
    @utility text-icon-primary {
      color: var(--color-i-primary);
    }
    @utility text-icon-secondary {
      color: var(--color-i-secondary);
    }
    @utility border-secondary {
      border-color: var(--color-border-secondary);
    }
    @utility border-inverse {
      border-color: var(--color-border-inverse);
    }
    ```

  - [ ] **Why `@utility`, not `@theme`:** a flat `@theme { --color-secondary: … }` would make `bg-secondary`, `text-secondary`, and `border-secondary` all resolve to the **same** token — but in the light palette they are **three different colours**. `@utility` keeps the exact v3 class names while letting each map to its own family var. See Dev Notes → "Why not a flat `@theme` palette". (Custom `@utility` classes support all variants — `xs:`, `md:`, hover, etc. — so ported components using e.g. `md:text-secondary` keep working.)
  - [ ] **AC6 guard:** Do **NOT** add `--color-*: initial`, `@theme { --color-*: initial }`, or any blanket reset of Tailwind's default palette. Leave the default palette (and `--color-gray-200`) shipped so the Story 1.3 border guard keeps resolving. Adding custom `@utility` classes and plain `--color-*` vars does not require touching the default palette — do not.

- [ ] **Task 4 — Theme the body + gradient; replace the create-next-app colour boilerplate (AC: 3, 4, 5, 8)**

  - [ ] Set `body { background: var(--color-bg-secondary); color: var(--color-text-primary); }` (matching `theme-styles.js`). **Leave `font-family` alone** — the placeholder `Arial, Helvetica, sans-serif` is a **Story 1.6** (fonts) concern, not this story.
  - [ ] Add the fixed gradient layer, porting the archive's `body:before` exactly:

    ```css
    body::before {
      content: '';
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      background: var(--color-bg-secondary);
      background: linear-gradient(
        var(--color-bg-secondary),
        var(--color-bg-tertiary)
      );
    }
    ```

    (The two `background` lines mirror the archive: the solid fallback then the gradient override. Default gradient direction is `to bottom`, identical to the archive's explicit `to bottom`.)

  - [ ] **Remove the now-dead create-next-app colour boilerplate**: the placeholder `:root { --background; --foreground }`, the `@media (prefers-color-scheme: dark) { :root { … } }` block, and the `@media (prefers-color-scheme: dark) { html { color-scheme: dark } }` block. Rationale: (a) once `body` reads `--color-*`, `--background`/`--foreground` are unreferenced dead vars; (b) a lingering `prefers-color-scheme` rule contradicts the project's "no system-preference auto-adoption" stance (FR10) and the archive set **no** `color-scheme` at all, so introducing/keeping one would deviate from parity. **Keep** the structural resets (`html { height }`, `html, body { max-width/overflow }`, `* { box-sizing/padding/margin }`, `a { color: inherit; text-decoration: none }`) and the `body { display: flex; flex-direction: column; min-height; font-smoothing }` rules — those are layout, not the create-next-app colour theme. See Dev Notes → "Target `globals.css`" for the exact intended end state. **(Flag: this removal touches the `prefers-color-scheme` boilerplate Story 1.3 punted forward — see Questions for Zac #1; the recommended call is to remove it now.)**

- [ ] **Task 5 — Verify parity by build + compiled-CSS inspection, then format (AC: all)**

  - [ ] `npm run build` — green, static export to `out/` intact. In the compiled CSS (`out/_next/static/**/*.css`) confirm:
    - the dark `--color-*` vars are emitted on `:root` and the light set on `.light`, with the exact values from Task 2 (including `--color-border-inverse: fafafa` / `5a5a5a`, no `#`);
    - each token utility exists and references its own var (e.g. `.text-secondary{color:var(--color-text-secondary)}`, `.bg-secondary{background-color:var(--color-bg-secondary)}`, `.border-inverse{border-color:var(--color-border-inverse)}` — confirm they are **distinct**);
    - the Story 1.3 guard line `border-color:var(--color-gray-200,currentColor)` is still present and `--color-gray-200:#e5e7eb` is still shipped (AC6);
    - the `xs` breakpoint media query (`min-width:410px`) is still present (AC unchanged from 1.3).
  - [ ] `npm run dev` — load the placeholder page; confirm the dark palette renders by default (cyan `#04b4e0`→amber `#e0b404` body gradient, light text), no flash, no console errors. (There is no toggle yet — to spot-check the light palette, temporarily add `class="light"` to `<html>` via devtools and confirm it flips to the blue/orange light palette; remove it — do **not** commit any `class="light"`.)
  - [ ] `npm run lint` — clean (no new warnings/errors).
  - [ ] `npm run format` (the glob now includes `css`) or let the Husky `pretty-quick --staged` hook format `globals.css` on commit. Do not hand-format around Prettier.

- [ ] **Task 6 — Capture the as-you-go decisions as an ADR (FR26 / AR19)**

  - [ ] This story makes ≥3 non-obvious calls that must be recorded **now** (not reconstructed in Epic 4): (a) **custom `@utility` over flat `@theme`** to preserve per-family divergent token values while keeping v3 class names; (b) **`:root` (dark default) + `.light` selector** scoping, ready for `next-themes` (`attribute="class"`) in 1.5; (c) **the `border-inverse` no-`#` quirk preserved verbatim** for parity (NFR7). Optionally also note the create-next-app `prefers-color-scheme` boilerplate removal.
  - [ ] Create `docs/decisions/0010-css-variable-theming-token-system.md` from `docs/decisions/_template.md` (MADR-lite: Status **Accepted**, Date **2026-06-12**, Decider **Zac (We Right Code)**, Tags `theseus, styling, theming, tailwind`). Add the `0010` row to `docs/decisions/README.md`'s index table. Cross-reference ADR 0009 (the guard this story must not break, AC6) and ADR 0004 (styled-components removal — this realises the theming half).
  - [ ] Keep it base-usable, no public polish (that is Ariadne). [Source: docs/decisions/README.md#Capture-convention]

## Dev Notes

### What this story is — and is NOT

This is **the theming token system** story: lift the dark/light palettes out of the archived styled-components `createGlobalStyle` and re-express them as **static global CSS variables** plus **Tailwind v4 custom utilities**, with the body gradient, so every later component (Epics 2–3) can use `text-secondary`, `bg-primary-400`, `border-secondary`, etc. and get pixel-identical colours. **Dark renders by default; nothing switches themes yet.**

**Hard scope guards (NFR6):**

- **No `next-themes`, no toggle, no pre-hydration script.** That is **Story 1.5**. You only lay out the palette so 1.5 can toggle it. [Source: epics.md#Story-1.5]
- **No fonts / `font-family` / metadata / analytics.** **Story 1.6**. Leave `body { font-family: Arial… }` untouched. [Source: epics.md#Story-1.6]
- **No image loader.** **Story 1.7**.
- **No atomic-design components / routes / UI.** Epics 2–3. The only file you meaningfully change is `src/app/globals.css` (+ the ADR). [Source: epics.md#Story-2, #Story-3]
- **Only existing deps.** This story adds **no** npm dependencies. [Source: project-context.md#Don't-introduce-new-top-level-dependencies-casually]
- **British spelling in prose/comments**; canonical CSS identifiers stay (`color`, `gray-200`, `background`). [Source: project-context.md#Language-Specific-Rules]
- **No code comments** in `globals.css` unless genuinely non-obvious (the `border-inverse` no-`#` line is the one place a short comment is justified — and helps the Epic 4 reviewer). [Source: project-context.md#Code-Quality]

### Why not a flat `@theme` palette (the core technical decision)

Tailwind v4's `@theme` generates utilities from a **flat `--color-*` namespace**: a single token `--color-secondary` produces `bg-secondary`, `text-secondary`, **and** `border-secondary`, all resolving to the **same** value. That is fine in the **dark** palette (where `bg`/`text`/`border` secondary are all `#04b4e0`) but **wrong** in the **light** palette, where they diverge:

| token "secondary"  | dark      | light         |
| ------------------ | --------- | ------------- |
| `bg-secondary`     | `#04b4e0` | `#3058b5`     |
| `text-secondary`   | `#04b4e0` | **`#49629c`** |
| `border-secondary` | `#04b4e0` | `#3058b5`     |

`tertiary` diverges too (`text-tertiary #cc715f` vs `bg-tertiary #e6593d` in light). A flat token cannot represent this. The v4-idiomatic fix that **keeps the exact v3 class names** is a custom `@utility` per token, each pointing at its own family var (Task 3). `@theme inline` does **not** solve this either — it still shares one token across `bg/text/border`. [Source: archive/src/components/theme-styles.js (lightThemeValues); tailwindcss.com/docs/functions-and-directives (`@utility`), /docs/theme (`@theme inline`)]

### The `border-inverse` parity trap (grounds AC7 — do not "fix" it)

`archive/src/components/theme-styles.js` defines `borderColor.inverse` as the string `'fafafa'` (dark) / `'5a5a5a'` (light) — **without a leading `#`**. So `populateVars` emits `--color-border-inverse: fafafa;`, an **invalid CSS colour**. On the live site, the five `border-inverse` consumers (`border-4 border-inverse`, `border border-inverse`, `border-b border-inverse`) therefore get a `border-color` that is invalid-at-computed-value-time and falls back to `currentColor` — i.e. the borders take the element's text colour, **not** a near-white/grey line.

Porting this **verbatim (no `#`)** reproduces that exact rendering by construction: `border-color: var(--color-border-inverse)` → `fafafa` → invalid → `currentColor`. The custom `@utility border-inverse` sits in the utilities layer and overrides the Story 1.3 base guard, so the guard's gray-200 does **not** leak in — matching today.

If a dev "cleans it up" to `#fafafa` / `#5a5a5a`, those borders would suddenly render a visible near-white (dark) / grey (light) line where today there is none → **visual regression**, violating NFR1 and NFR7. **Keep the missing `#`.** A one-line comment next to the var (e.g. `/* verbatim archive quirk — invalid colour by design, do not add # (NFR7) */`) is the one justified comment here. The five consumers are ported in Epics 2–3 (Story 2.3 portrait, Story 3.4 content gallery) and verified by the Story 4.1 parity gate. [Source: archive grep — `atoms/portrait-image.js:21`, `atoms/testimonial-portrait.js:51`, `organisms/content-item.js:7,20`; theme-styles.js:17,47]

### Var scoping for `next-themes` (Story 1.5 forward-coupling)

Define dark on `:root` (so it is the default with no JS — AC4) and light on `.light`, placed **after** `:root` (equal specificity → source order decides, so `.light` must come later). At runtime in 1.5, `next-themes` with `attribute="class"` sets `class="dark"` or `class="light"` on `<html>`: `class="dark"` → only `:root` matches → dark ✓; `class="light"` → `:root` + `.light` match, `.light` wins → light ✓; no class (this story / no-JS) → `:root` → dark ✓. **This couples 1.4 to 1.5 picking `attribute="class"`** — the recommended, Tailwind-idiomatic default. Record it in ADR 0010 so 1.5 aligns (or, if 1.5 chooses `data-theme`, it adjusts the `.light` selector to `[data-theme='light']`). [Source: research report #styled-components-removal table ("under `:root` (dark) and a theme selector (`.light` / `[data-theme='light']`)"); epics.md#AR15]

### Target `globals.css` (intended end state — read before editing)

After this story, `src/app/globals.css` should read approximately (Tailwind import + breakpoint + guard **unchanged from 1.3**; the create-next-app `--background`/`--foreground` + `prefers-color-scheme` blocks **removed**; palette + utilities + body gradient **added**):

```css
@import 'tailwindcss';

@theme {
  --breakpoint-xs: 410px;
}

:root {
  --color-bg-primary-200: #555;
  --color-bg-primary-400: #333;
  --color-bg-secondary: #04b4e0;
  --color-bg-tertiary: #e0b404;
  --color-bg-inverse: #fafafa;
  --color-i-primary: #fafafa;
  --color-i-secondary: #04b4e0;
  --color-text-primary: #fafafa;
  --color-text-secondary: #04b4e0;
  --color-text-tertiary: #e0b404;
  --color-border-secondary: #04b4e0;
  --color-border-inverse: fafafa; /* verbatim archive quirk — invalid by design, do not add # (NFR7) */
}

.light {
  --color-bg-primary-200: #ddd;
  --color-bg-primary-400: #eee;
  --color-bg-secondary: #3058b5;
  --color-bg-tertiary: #e6593d;
  --color-bg-inverse: #333;
  --color-i-primary: #fafafa;
  --color-i-secondary: #3058b5;
  --color-text-primary: #333;
  --color-text-secondary: #49629c;
  --color-text-tertiary: #cc715f;
  --color-border-secondary: #3058b5;
  --color-border-inverse: 5a5a5a; /* verbatim archive quirk — see above */
}

@utility bg-primary-200 {
  background-color: var(--color-bg-primary-200);
}
/* … the other 10 @utility blocks from Task 3 … */

html {
  height: 100%;
}
html,
body {
  max-width: 100vw;
  overflow-x: hidden;
}
body {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
  font-family:
    Arial, Helvetica, sans-serif; /* Story 1.6 replaces with Roboto */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body::before {
  content: '';
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background: var(--color-bg-secondary);
  background: linear-gradient(
    var(--color-bg-secondary),
    var(--color-bg-tertiary)
  );
}
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
a {
  color: inherit;
  text-decoration: none;
}

@layer base {
  *,
  ::after,
  ::before,
  ::backdrop,
  ::file-selector-button {
    border-color: var(--color-gray-200, currentColor);
  }
}
```

(Exact ordering/Prettier formatting is owned by Prettier — the above is the intended content, not a hand-formatting spec. The `@utility` blocks may sit anywhere top-level; grouping them after the palette reads best.)

### Previous Story Intelligence (Stories 1.1–1.3, all done)

- Repo is idiomatic root-Next: root `package.json`, `src/app/`, `next.config.ts` (`output: 'export'`), `.node-version` `v24.16.0`, Husky v9 hook **verified firing** (committing formats staged files). [Source: 1-1…md, 1-3…md#Previous-Story-Intelligence]
- **Tailwind v4 is live, CSS-first** (`@import 'tailwindcss'` + `@tailwindcss/postcss`, Oxide, no `tailwind.config.js`). The `xs: 410px` breakpoint and the `@layer base` border guard are in `globals.css` — **preserve both** (AC6). [Source: 1-3…md]
- The `npm run format` glob **now includes `css`** (the Story 1.3 review patch was applied), so `globals.css` is covered by both `npm run format` and the commit hook. [Source: package.json:6]
- The Gatsby tree under `archive/` is **read-only** parity reference (ADR 0006); never edit or build it. It is excluded from `eslint`/`prettier`. [Source: ADR 0006; memory: theseus-coexistence-archive-model]
- `docs/decisions/` holds ADRs `0001`–`0009`; next free number is **`0010`**. MADR-lite `_template.md` + README index. The as-you-go capture convention is a cross-cutting DoD item — Task 6 is not optional. [Source: docs/decisions/README.md]
- **`ESLint` only warns** (no `--max-warnings 0` gate) — a known deferred follow-up, not this story's concern. [Source: deferred-work.md]

### Downstream consumers to be aware of (not this story's work)

- `archive/src/components/atoms/loading-spinner.js` imports `darkThemeValues` **as a JS object** (not via CSS vars). That is a **Story 2.6** porting concern — the spinner will need its colours sourced differently (e.g. read the vars or inline them). Out of scope here; flagged so 2.6 doesn't get surprised. [Source: archive grep — loading-spinner.js:2]
- `archive/src/components/theme.js` consumes the `createGlobalStyle` + passes a `theme` prop — that whole styled-components mechanism is replaced by `next-themes` in **Story 1.5**. [Source: archive grep — theme.js:5,12]

### Testing Standards

- **No test framework exists and none is added** (AR13). `npm test` is an honest stub — do **not** fabricate a run or claim tests pass. [Source: project-context.md#Testing-Rules; epics.md#AR13]
- **Verification is build + compiled-CSS inspection + dev-server visual check** (Task 5): palette vars emitted with exact values (incl. the no-`#` `border-inverse`), each token utility distinct and var-backed, the 1.3 guard + `gray-200` intact, dark renders by default. Per-tier visual diffing against the live site is exercised in Epics 2–4 once components consume these tokens. [Source: project-context.md#Manual-verification; epics.md#Story-4.1]

### Project Structure Notes

- **Modified:** `src/app/globals.css` (palette vars + `@utility` token map + body gradient/background; create-next-app colour boilerplate removed).
- **New:** `docs/decisions/0010-css-variable-theming-token-system.md`; **Modified:** `docs/decisions/README.md` (index row), optionally `docs/decisions/0004-…md` (one-line "theming half realised in 0010" note — do not re-open 0004).
- **No conflict** with the atomic-design structure: this is global styling infra, orthogonal to the tiers (Epics 2–3). No route, no component. [Source: project-context.md#Atomic-Design]

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-1.4] — story statement + acceptance criteria (incl. the AC6 palette-wipe DoD).
- [Source: _bmad-output/planning-artifacts/epics.md#Additional-Requirements] — AR3 (Tailwind v4), AR15 (SC removal: `createGlobalStyle` → static CSS vars toggled by `next-themes`; body gradient), AR16 (theme-var parity check, the gradient is the fiddly bit), AR13 (no fabricated test suite).
- [Source: _bmad-output/planning-artifacts/epics.md#Requirements-Inventory] — FR8, FR9 (the token system + gradient), FR10 (persistence is 1.5), FR24 (no CSS-in-JS runtime), NFR1/NFR2 (parity), NFR6 (anti-gold-plating), NFR7 (preserve quirks).
- [Source: archive/src/components/theme-styles.js] — **authoritative palette values**, `populateVars` var names, the `body` + `body:before` gradient, and the `borderColor.inverse` no-`#` quirk (lines 17, 47).
- [Source: archive/tailwind.config.js] — the v3 token map this story reproduces (`backgroundColor`/`textColor`/`borderColor` families, `text.icon.*`, `xs` screen).
- [Source: archive/src/components/atoms/portrait-image.js:21, atoms/testimonial-portrait.js:51, organisms/content-item.js:7,20] — the five `border-inverse` consumers grounding AC7.
- [Source: docs/decisions/0009-tailwind-v4-border-ring-divide-guard.md] — the guard AC6 must not regress; the Story 1.4 palette-wipe caveat originates here.
- [Source: docs/decisions/0004-remove-styled-components.md, docs/decisions/README.md] — SC-removal rationale + the as-you-go capture convention (Task 6).
- [Source: _bmad-output/planning-artifacts/research/technical-…-research-2026-06-10.md#styled-components-removal] — "`:root` (dark) + `.light`/`[data-theme]` selector, `next-themes` toggles the class; gradient → `linear-gradient(var(--color-bg-secondary), var(--color-bg-tertiary))`".
- [Source: tailwindcss.com/docs/functions-and-directives] — `@utility` (custom utilities, variant support); /docs/theme — `@theme` vs `@theme inline` (verified June 2026).
- [Source: _bmad-output/project-context.md] — theming-via-CSS-vars rule, no-hardcoded-colours, no test suite, dependency restraint, British-spelling prose, no-comments default.

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

## Questions for Zac (resolve before/at dev time — none block the core token work)

1. **`prefers-color-scheme` boilerplate removal (1.4 vs 1.5 seam).** Story 1.3 punted the create-next-app `@media (prefers-color-scheme: …)` blocks forward ("a 1.5 question … full theming is 1.4"). This story **recommends removing them now** (Task 4): they only toggle now-dead `--background`/`--foreground` vars, and keeping a system-preference rule contradicts FR10's no-auto-adopt stance. The archive set no `color-scheme` at all, so removal is the parity-faithful call. **Confirm:** remove now (recommended), or leave them inert for Story 1.5 to delete? _(If you'd rather 1.5 owns all `prefers-color-scheme`, the dev leaves the blocks and just adds the palette — slightly messier interim CSS but a cleaner story boundary.)_
2. **`next-themes` attribute coupling.** The recommended `:root` (dark) + `.light` scoping assumes Story 1.5 configures `next-themes` with `attribute="class"` (its default). ADR 0010 will record this so 1.5 aligns. **Confirm** you're happy to pin `attribute="class"` now, or prefer `data-theme` (then the dev uses `[data-theme='light']` here instead). Either works; just flagging the forward-coupling so it's an explicit choice, not an accident.

## Change Log

| Date       | Change                                                                                                                                                                                                                                                                                                                              |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-06-12 | Story drafted — global CSS-variable theming token system: both palettes as `--color-*` vars (verbatim archive values incl. the `border-inverse` no-`#` quirk), v3 token utilities via `@utility` (per-family divergence preserved), body `:before` gradient, dark default, Story 1.3 guard protected (AC6). Status → ready-for-dev. |
