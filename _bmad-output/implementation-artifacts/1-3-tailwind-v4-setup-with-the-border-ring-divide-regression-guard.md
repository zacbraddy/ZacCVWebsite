---
baseline_commit: 471e9a2b85a25059db14e2cbb2d1b31f2650c4b0
---

# Story 1.3: Tailwind v4 setup with the border/ring/divide regression guard

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As the engineer migrating the site,
I want Tailwind v4 configured CSS-first with an explicit guard against its border default change,
so that the styling engine is ready and the v4 `currentColor` shift cannot silently regress borders against the zero-regression bar.

## Acceptance Criteria

1. **Tailwind v4 installed and configured CSS-first; utilities compile in dev and build.**
   **Given** the scaffolded Next.js 16 project,
   **When** Tailwind v4 is installed and configured CSS-first (`@import "tailwindcss"` + `@tailwindcss/postcss` PostCSS plugin, Oxide engine — no `tailwind.config.js`),
   **Then** Tailwind utility classes compile and apply correctly in **both** `next dev` and `next build` (static export),
   **And** the build completes with no errors and `output: 'export'` still produces a static bundle.

2. **The custom `xs: 410px` breakpoint is preserved.**
   **Given** the current site's custom `xs: 410px` breakpoint (v3 `screens: { xs: '410px', ...defaultTheme.screens }`),
   **When** the v4 theme is configured,
   **Then** `xs` is defined as `410px` via `@theme { --breakpoint-xs: 410px; }`, sorts ahead of `sm` (640px), and the default Tailwind breakpoints (`sm`–`2xl`) all remain available — so an `xs:` variant compiles and triggers at ≥410px exactly as today.

3. **An explicit base border colour restores v3's default (the border/ring/divide guard).**
   **Given** Tailwind v4 defaults `border`/`ring`/`divide` colour to `currentColor` where v3 used `gray-200`,
   **When** the base styles are configured,
   **Then** an explicit base border colour is set via the documented compatibility snippet
   (`@layer base { *, ::after, ::before, ::backdrop, ::file-selector-button { border-color: var(--color-gray-200, currentColor); } }`),
   **And** a bare, un-coloured `border` utility renders the same `#e5e7eb` (gray-200) hairline it did on the live site — verified against the two known at-risk usages (the testimonials carousel prev/next buttons).

4. **The per-tier audit checkpoint is recorded as a durable, findable artefact.**
   **Given** the regression guard,
   **When** the setup is documented,
   **Then** a per-tier audit checkpoint for every `border`/`ring`/`divide` usage is recorded in the decision trail (as a new ADR under `docs/decisions/`, indexed in the README) — capturing the implemented guard, the inventory of at-risk un-coloured borders found in the archived source, and the rule to apply on every Epic 2–3 tier port — so the shift is caught by visual diffing (and the Story 4.1 sign-off) rather than shipped silently. This is the first **technical** exercise of the as-you-go decision-capture convention established in Story 1.2 (FR26 / AR19).

5. **Scope discipline (NFR6) — no token system, no theming, no UI.**
   **Given** the anti-gold-plating guardrail,
   **When** Tailwind is set up,
   **Then** the work is limited to: installing Tailwind v4 + PostCSS plugin, the `@import`, the `@theme` breakpoint, the base border guard, the verification, and the ADR. It does **not** build the `--color-*` theming token system or map tokens like `text-secondary`/`bg-primary-400` (that is **Story 1.4**), wire `next-themes` (**1.5**), touch fonts/metadata/analytics (**1.6**), or configure the Netlify image loader (**1.7**). No content/atomic-design components are created.

## Tasks / Subtasks

- [ ] **Task 1 — Install Tailwind v4 and the PostCSS plugin (AC: 1, 5)**

  - [ ] `npm install -D tailwindcss @tailwindcss/postcss postcss` (latest stable `4.x`). These are the only new dependencies this story adds.
  - [ ] Create `postcss.config.mjs` at the repo root with exactly:

    ```js
    const config = {
      plugins: {
        '@tailwindcss/postcss': {},
      },
    };

    export default config;
    ```

  - [ ] Do **not** create a `tailwind.config.js` — v4 is CSS-first. Do **not** add `autoprefixer` (v4/Oxide handles vendor prefixing; the v3 `autoprefixer` in `archive/postcss.config.js` is not carried over).

- [ ] **Task 2 — Wire Tailwind into the global stylesheet, CSS-first (AC: 1, 2, 3)**

  - [ ] At the **top** of `src/app/globals.css`, add `@import 'tailwindcss';` as the first line (before the existing `:root`/`body` rules, which stay).
  - [ ] Add the custom breakpoint:
    ```css
    @theme {
      --breakpoint-xs: 410px;
    }
    ```
  - [ ] Add the border/ring/divide compatibility guard (AC3):
    ```css
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
  - [ ] Leave the existing create-next-app boilerplate in `globals.css` as-is for now (the `prefers-color-scheme` block is a **Story 1.5** concern — do not remove or rework it here; full theming is **1.4**).

- [ ] **Task 3 — Verify utilities, breakpoint, and the border guard (AC: 1, 2, 3)**

  - [ ] `npm run dev` — temporarily add a throwaway probe to the placeholder `src/app/page.tsx`, e.g.
        `<div className="border p-4 text-sm xs:text-lg">tw probe</div>`, and confirm in the browser: (a) padding/text utilities apply, (b) the `border` renders a gray-200 (`#e5e7eb`) hairline — **not** the text colour, (c) the text grows at the `xs` (410px) breakpoint via devtools responsive mode. **Remove the probe before completing** (no boilerplate/probe code left behind — there is no real UI yet; that is Epics 2–3).
  - [ ] `npm run build` — confirm it completes with no errors, still emits a static export to `out/`, and Tailwind's compiled CSS is present in the output.
  - [ ] `npm run lint` — confirm clean (the ESLint flat config from Story 1.2 ignores `archive/**`; Tailwind setup should not introduce lint errors).
  - [ ] Cross-check the guard against the real regression target: the archived `archive/src/components/organisms/testimonials.js:18` and `:24` carousel buttons use a bare `border` (no colour token) and relied on v3's gray-200 default. The guard must make those render identically when ported in Epic 3.

- [ ] **Task 4 — Record the per-tier border/ring/divide audit checkpoint as an ADR (AC: 4)**

  - [ ] Create `docs/decisions/0009-tailwind-v4-border-ring-divide-guard.md` using `docs/decisions/_template.md` (MADR-lite: Status, Date, Decider, Tags, Context, Decision, Consequences, optional Alternatives). Status **Accepted**, Date **2026-06-12**, Decider **Zac (We Right Code)**, Tags `theseus, styling, tailwind`.
  - [ ] Content must capture: (a) the implemented guard (the `@layer base` snippet + `--breakpoint-xs`), (b) the **at-risk inventory** found in the archived source — bare `border` on `testimonials.js:18/:24`; all other `border-N`/`border-2`/`border-4` usages already pair with the explicit `border-secondary` token (`nav-links.js:31`, `pages/index.js:52`, `testimonial.js:9`); **no `ring` and no `divide` usage exists** anywhere in the archived `src` — and (c) the **per-tier audit rule**: during each Epic 2–3 tier port, every `border`/`ring`/`divide` added must either specify an explicit colour token or be a deliberate gray-200 default, verified by the side-by-side visual diff; Story 4.1 exercises this checkpoint as a hard gate before cutover.
  - [ ] Note in the ADR that this guard depends on Tailwind v4 shipping the default `--color-gray-200` variable; **Story 1.4 must not wipe the default colour palette** (e.g. via `--color-*: initial`) without re-pointing this guard, or bare borders silently fall back to `currentColor`.
  - [ ] Add the `0009` row to the index table in `docs/decisions/README.md`.
  - [ ] Cross-reference: this realises the "Story 1.3 implements the guard" forward-pointer in [`docs/decisions/0002-tailwind-v4-over-v3.md`](../../docs/decisions/0002-tailwind-v4-over-v3.md). Optionally add a one-line "implemented in 0009" note to 0002's Consequences (do not re-open 0002).

- [ ] **Task 5 — Format (AC: all)**
  - [ ] Run `npm run format` (or let the Husky `pretty-quick --staged` hook fire on commit) so the new `.mjs`, `.css`, and `.md` files are Prettier-formatted. `postcss.config.mjs` is covered by the format glob (`{js,jsx,mjs,cjs,ts,tsx,json,md}`) and `globals.css` and `docs/**` are not in `.prettierignore` — let Prettier own formatting; do not hand-format around it.

## Dev Notes

### What this story is — and what it is NOT

This is the **styling-engine foundation** story: stand up Tailwind v4 (CSS-first, Oxide engine) so later stories have a working utility layer, and install the one mandatory **border/ring/divide regression guard** that v4's `currentColor` default demands. It is **not** the theming story.

**Hard scope guards (NFR6 — anti-gold-plating is first-class here):**

- **No theming token system.** The `--color-*` custom properties (dark/light palettes, body `:before` gradient, `text-secondary`/`bg-primary-400`/`border-secondary`/`text-icon-primary` token mapping) are **Story 1.4**. Do not pre-build them. [Source: epics.md#Story-1.4]
- **No `next-themes`, no toggle.** That is **Story 1.5**. [Source: epics.md#Story-1.5]
- **No fonts / metadata / analytics / image loader.** Stories **1.6** and **1.7**. Leave `layout.tsx`'s current Geist fonts + placeholder metadata untouched. [Source: epics.md#Story-1.6, #Story-1.7]
- **No UI / no atomic-design components.** No atoms/molecules/organisms/pages content — Epics 2–3. The only file you add a class to is a throwaway probe you then delete.
- **Only new deps:** `tailwindcss`, `@tailwindcss/postcss`, `postcss`. Nothing else (no `autoprefixer`, no Tailwind plugins). [Source: project-context.md#Don't-introduce-new-top-level-dependencies-casually]
- **British spelling in prose/comments**; canonical identifiers stay (`color`, `gray-200`, `border-color`). [Source: project-context.md#Language-Specific-Rules]

### Current state of the files you'll touch (read before editing)

- **`src/app/globals.css`** — currently create-next-app boilerplate: `:root { --background; --foreground }`, a `@media (prefers-color-scheme: dark)` block, `html/body` resets, a universal `* { box-sizing }` reset, and an `a { color: inherit }` rule. **Preserve all of it.** You are _prepending_ `@import 'tailwindcss';` and _appending_ the `@theme` breakpoint + the `@layer base` guard. The `prefers-color-scheme` block is **not** your concern (it's a 1.5 question about first-visit default; do not touch it here).
- **`src/app/layout.tsx`** — imports `./globals.css`, sets up Geist fonts + placeholder metadata. **Do not modify** (fonts/metadata are 1.6).
- **`src/app/page.tsx`** — create-next-app placeholder using `page.module.css`. Only touch it for the throwaway verification probe in Task 3, then revert.
- **`next.config.ts`** — `{ output: 'export' }` only. **Do not modify** — Tailwind v4 needs no Next config changes; the PostCSS plugin is picked up automatically and works under Next 16's default Turbopack.
- **`package.json`** — already has `format`/`lint`/`lint:fix` scripts, Prettier 3.x, ESLint flat config, Husky v9. You add three devDeps; you do **not** add a Tailwind-specific script.
- **`.prettierignore`** — ignores `archive`, `node_modules`, `.next`, `out`, `next-env.d.ts`, `package.json`, `package-lock.json`, `public`. It does **not** ignore `globals.css`, `postcss.config.mjs`, or `docs/` — Prettier formats those.

### Latest tech specifics (verified against current Tailwind v4 + Next 16 docs)

- **Install shape (v4):** `tailwindcss` + `@tailwindcss/postcss` + `postcss`. The PostCSS plugin moved to its own package in v4 (it is **not** `tailwindcss` itself as in v3). `postcss.config.mjs` lists only `'@tailwindcss/postcss': {}`. [Source: tailwindcss.com/docs/installation/using-postcss, /docs/guides/nextjs]
- **CSS-first, no JS config:** v4 replaces `tailwind.config.js` with `@import 'tailwindcss';` plus an optional `@theme { … }` block in the CSS itself. There is no `content: [...]` array to maintain — v4 auto-detects template sources. [Source: tailwindcss.com/blog/tailwindcss-v4]
- **Custom breakpoint:** `@theme { --breakpoint-xs: 410px; }` _adds_ `xs` to the default scale (it is sorted by value, so `xs` < `sm`), mirroring the v3 `{ xs: '410px', ...defaultTheme.screens }` exactly. Do **not** use `--breakpoint-*: initial` (that would wipe the defaults). [Source: tailwindcss.com/docs/responsive-design, /blog/tailwindcss-v4]
- **The border default change (the whole reason this guard exists):** v3 `border`/`divide` defaulted to `gray-200`; v4 defaults to `currentColor` to match native CSS. Tailwind's own upgrade guide gives the exact compatibility snippet used in AC3/Task 2. The vars are "supported for compatibility… not idiomatic v4" — that's fine; faithful parity is the bar here (NFR1), and ADR 0002 already accepted this trade-off. `var(--color-gray-200, currentColor)` resolves because v4 ships its default colour palette as CSS vars. [Source: tailwindcss.com/docs/upgrade-guide#border-color, ADR 0002]
- **`ring` note:** v4 also changed the default `ring` _width_ (3px→1px) and colour (`blue-500`→`currentColor`). The archived site uses **no `ring` utilities at all**, so no ring-specific guard is needed — but record this in the ADR so the Epic 2–3 audit stays alert if a `ring` is introduced during a port.

### The regression target, concretely (grounds AC3/AC4 — don't hand-wave it)

An audit of the archived Gatsby source (`archive/src/**/*.js`) found:

- **At risk (bare, un-coloured `border` → relied on v3 gray-200 default):**
  - `archive/src/components/organisms/testimonials.js:18` — `className="border bg-primary-200 rounded p-2 …"`
  - `archive/src/components/organisms/testimonials.js:24` — same (the carousel prev/next buttons).
- **Not at risk (width paired with an explicit `border-secondary` colour token):**
  - `archive/src/components/molecules/nav-links.js:31` — `border-4 … border-secondary`
  - `archive/src/pages/index.js:52` — `border-4 … border-secondary`
  - `archive/src/components/molecules/testimonial.js:9` — `border-2 border-secondary`
- **`ring`:** none. **`divide`:** none.

So the guard's job is narrow but real: keep the two testimonials buttons (ported in Epic 3, Story 3.2) rendering their gray-200 hairline. The `border-secondary`/`border-inverse` tokens those other elements use are wired in **Story 1.4** (they map to `--color-border-secondary` / `--color-border-inverse`). [Source: archive grep; archive/src/components/theme-styles.js]

### Decision capture (FR26 / AR19) — why Task 4 is an ADR, not a loose note

Story 1.2 built the decision-capture mechanism (`docs/decisions/`, MADR-lite template, README index, as-you-go convention). Its README states non-obvious decisions are recorded **at the moment they're made**, and Story 4.1's acceptance criteria explicitly reference _"the Tailwind v4 border/ring/divide regression guard **from Story 1.3**"_ — so the checkpoint must live somewhere Epic 4's collation sweep will find it. The decision log is that home. ADR `0009` (the "how + audit checklist") complements ADR `0002` (the "why"); keep 0002 as the rationale and don't re-litigate it. This is the first **technical** as-you-go capture (1.2's ESLint reversal was the first _tooling_ one). [Source: 1-2-…md#Task-2, #Dev-Notes; epics.md#Story-4.1; epics.md#Cross-cutting-conventions]

### Previous Story Intelligence (Stories 1.1 & 1.2 — both done)

- The repo is at the idiomatic root-Next layout: root `package.json`, `src/app/`, `next.config.ts` (`output: 'export'`), `.node-version` = `v24.16.0`, Husky v9 hook **verified firing**. Committing your files triggers `pretty-quick --staged` formatting. [Source: 1-1-…md, 1-2-…md#Previous-Story-Intelligence]
- ESLint flat config (`eslint.config.mjs`) is live and ignores `archive/**`; `npm run lint` exits 0 but only **warns** (no `--max-warnings 0` gate — a known deferred follow-up, not your concern here). [Source: 1-2-…md#Review-Findings; deferred-work.md]
- The Gatsby tree lives untouched under `archive/` (the coexistence model, ADR 0006) and is your **read-only reference** for parity — never edit it, never build against it. `.prettierignore` and `eslint.config.mjs` both exclude `archive`. [Source: ADR 0006; memory: theseus-coexistence-archive-model]
- `docs/decisions/` currently holds `_template.md`, `README.md`, and ADRs `0001`–`0008`. Next number is `0009`. [Source: docs/decisions/README.md]

### Project Structure Notes

- **New files:** `postcss.config.mjs` (root), `docs/decisions/0009-tailwind-v4-border-ring-divide-guard.md`.
- **Modified files:** `src/app/globals.css` (Tailwind import + `@theme` + guard), `package.json` + `package-lock.json` (three devDeps), `docs/decisions/README.md` (index row), optionally `docs/decisions/0002-…md` (one-line "implemented in 0009" note).
- **No conflict** with the unified structure: this is infra/config, orthogonal to the atomic-design tiers (those are Epics 2–3). No route, no component.

### Testing Standards

- **No test framework exists and none is added** (AR13 / project-context). `npm test` is an honest stub (`echo "No test suite" && exit 1`) — do **not** fabricate a run or claim tests pass. [Source: project-context.md#Testing-Rules]
- **Verification is by build + dev-server inspection** (Task 3): `npm run build` green with static export intact; `npm run dev` confirms a utility class applies, the `xs` breakpoint fires at 410px, and a bare `border` renders gray-200 — then the probe is removed. `npm run lint` clean. [Source: project-context.md#Manual-verification]

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-1.3] — story statement + acceptance criteria.
- [Source: _bmad-output/planning-artifacts/epics.md#Additional-Requirements] — AR3 (Tailwind v4 + border guard), AR13 (tooling / no fabricated test suite).
- [Source: _bmad-output/planning-artifacts/epics.md#Story-4.1] — the parity sign-off that _exercises_ this story's audit checkpoint (AR3 line).
- [Source: _bmad-output/planning-artifacts/epics.md#Cross-cutting-conventions] — decision-capture as-you-go (FR26/AR19); parity is the bar (NFR1/NFR2); anti-gold-plating (NFR6).
- [Source: docs/decisions/0002-tailwind-v4-over-v3.md] — the accepted "why" of Tailwind v4 + why this guard exists.
- [Source: _bmad-output/implementation-artifacts/1-2-establish-the-decision-capture-mechanism.md] — the decision-capture mechanism this story exercises.
- [Source: archive/tailwind.config.js] — v3 source of truth: `screens.xs = '410px'`, the token map, no default `borderColor` override (so bare `border` = gray-200).
- [Source: archive/src/components/theme-styles.js] — the `--color-*` palette values + `border-secondary`/`inverse` (wired in Story 1.4, not here).
- [Source: archive/src/components/organisms/testimonials.js:18,24] — the concrete bare-`border` regression target.
- [Source: _bmad-output/project-context.md#Tailwind, #Testing-Rules, #Don't-introduce-new-top-level-dependencies-casually, #Language-Specific-Rules] — theming/PurgeCSS context, no test suite, dependency restraint, British-spelling prose.
- [Source: tailwindcss.com/docs/upgrade-guide] — the border-color compatibility snippet (verified June 2026).
- [Source: tailwindcss.com/docs/installation/using-postcss + /docs/guides/nextjs] — v4 install shape (`@tailwindcss/postcss`, `@import 'tailwindcss'`).

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
