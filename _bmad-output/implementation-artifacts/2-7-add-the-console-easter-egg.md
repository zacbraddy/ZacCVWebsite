# Story 2.7: Add the console easter egg

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a curious developer who opens dev tools on a portfolio,
I want a charming ASCII-art console message with links to the Backroom and the repo,
So that I find the playful second door and can jump straight to the decisions or the source (UJ-2, FR-11).

## Story context

This is the **second and final entry-point story** (2.6 Entry link done; 2.7 console egg) — it **closes Epic 2 and Project Ariadne**. Everything the egg points _at_ is already built and live: the Backroom Overview (`/backroom`, Story 2.3/2.4) and the public GitHub repo. This story adds **the second, playful door**: a single ASCII-art message emitted to the browser console on page load, with two links (Backroom + repo).

It is a **tiny, self-contained story**: one new `'use client'` atom (`console-egg`) mounted **once** in the **root** layout (`src/app/layout.tsx`) so it fires on any page. It emits via `console.*` on mount and **returns `null`** (no DOM). **No** pipeline, routing, data, Backroom, or front-of-house change. **No** new dependencies. **No** new analytics events.

The whole design tension is **restraint and charm-not-cringe**: a single static message (NON-GOAL: any multi-stage/timed/interactive sequence), casual and witty, that a curious engineer stumbles on — never a popup, never DOM, never noise for the 99% who never open dev tools. Per EXPERIENCE.md this is the deliberate _opposite_ of "Congrats, you found the secret! 🎉🎉".

**Hard scope guard:** the only code file you should _create_ is the atom + (optionally) its data; the only file you should _edit_ is `src/app/layout.tsx` (mount the egg). Do **not** touch the Backroom, any `(site)`/front-of-house component, the Velite pipeline, or `docs/public/`. If you find yourself editing anything under `src/app/(site)/**`, `src/app/backroom/**`, or any organism/molecule, you have left scope.

## Acceptance Criteria

**AC1 — `console-egg` atom: client island, root-mounted, emits on load, returns null (FR-11, AR-9, AR-14, UX-DR13).**
**Given** the `console-egg` atom and the **root** layout (`src/app/layout.tsx`)
**When** it is implemented as a `'use client'` component mounted in the **root** layout (so it fires on **any** page, front-of-house _and_ Backroom) that emits the ASCII art via `console.*` **on mount** (`useEffect`, client-only) and **returns `null`** (no DOM node, no visible element)
**Then** the console shows a **cyan ASCII wizard** + **speech bubble** + **two links** (the Backroom route and the public GitHub repo) + a **dim wink line**, in the casual charming-not-cringe voice
**And** the structure is **locked** (wizard + bubble + two links + wink line); exact wording is an implementation-time tweak **but both links must remain** and the voice must stay casual (e.g. _"Ah, I see you're also a tech wizard. Well — while you're here, you may as well come in. The back room's open."_).

**AC2 — Both links present, correct, clickable and resolving (FR-11, UX-DR13).**
**Given** the two links in the message (Backroom + public GitHub repo)
**When** the message is emitted and a developer reads it in the console
**Then** the **Backroom link** points at the live Backroom Overview (`https://zackerthehacker.com/backroom`) and the **repo link** points at the correct **public** GitHub repository (`https://github.com/zacbraddy/ZacCVWebsite`), each annotated with its dim descriptor (e.g. `→ The backroom — how this site was actually built`, `→ The source — it's all real, and public`)
**And** both links are **clickable in the browser console** — i.e. printed as **full absolute URLs** so DevTools auto-linkifies them (you **cannot** hyperlink arbitrary anchor text in a real console; the mock's `<a href>` is composition reference only — reconcile to printed URLs, see Dev Notes)
**And** both links actually resolve: `/backroom` exists (Story 2.3/2.4) and the repo URL is public (**verify** the repo is public before shipping; if it is private, flag to Zac rather than shipping a 404 link).

**AC3 — Buffer-retention mechanism; dev-tools-open re-emit is a fallback only (FR-11, AR-9 / G3).**
**Given** the buffer-retention mechanism (browsers retain console messages emitted before dev tools were opened)
**When** a visitor opens dev tools **after** page load
**Then** the on-load `console` emit is **still shown** (no re-emit needed) — **verify across target browsers** (Chromium/Chrome, Firefox, Safari/WebKit) that the pre-open message is retained and visible
**And** **only if** a target browser is found **not** to retain the buffer is a lightweight dev-tools-open re-emit added as a **fallback** (NOT the default) — and even then it must avoid missed/repeated emits. Do **not** build dev-tools-detection speculatively; the on-load emit is the primary mechanism (G3 is evidence-driven).

**AC4 — Single client island, no DOM, no new events, single emit, no multi-stage sequence (NFR-1, NFR-4, NON-GOALs).**
**Given** the constraints (NFR-1 static export, NFR-4 perf/JS budget, the multi-stage NON-GOAL)
**When** the egg is built
**Then** it is the **only** new `'use client'` island this story introduces (everything else stays a Server Component), adds **no DOM** and **no new analytics events**, and a **single emit fires once on mount** — no timed/progressive/interactive multi-stage sequence, no re-fire on re-render (guard the effect so it runs once per mount)
**And** it imposes a negligible client-JS cost (a small string + a `useEffect`), shipping nothing to the client beyond the existing budget (NFR-7).

**AC5 — Verification: build green + pure static export, lint clean, zero regression (AR-15, NFR-1/2, no test suite).**
**Given** verification is build + lint + manual preview (there is **no** test framework — `npm test` is a stub; do **not** fabricate test runs)
**When** the build is run
**Then** `npm run build` is **green** and a **pure static export** — every route still `○ (Static)` / `● (SSG)`, **no `.func`** (the egg adds no server surface), and `npm run lint` is **clean** (no unused imports, Prettier-compliant)
**And** **zero front-of-house and Backroom regression** (NFR-2): the egg renders nothing, so the visible site is byte-identical; the only change is a message in the console on load
**And** manual preview in `npm run dev` confirms: the ASCII wizard + bubble + two links + wink appears in the console **on page load on both a FoH page and a Backroom page**, both links are clickable and resolve, and opening dev tools _after_ load still shows the message (AC3).

## Tasks / Subtasks

- [ ] **Task 1 — Create the `console-egg` atom (AC1, AC2, AC4)**
  - [ ] Create `src/components/atoms/console-egg.tsx` — a `'use client'` component that, in a `useEffect(() => { … }, [])` (client-only, runs once on mount), emits the message via `console.*`, and **returns `null`**. No DOM, no props.
  - [ ] **Guard against double-emit:** the effect must fire **once per mount**. A module-level `let emitted = false` flag (set true inside the effect) is the simplest way to be robust against React 18/19 StrictMode double-invoking effects in dev — so the egg shows once, not twice, in dev. (In production export StrictMode double-invoke does not apply, but the guard is cheap insurance and reads clearly.)
  - [ ] Build the message from the **locked structure**: speech bubble (the `egg_art.txt` bubble) → cyan ASCII wizard (from `console-egg-mock.html`, the `mrf`/`dBBBb` wizard — **keep the `mrf` artist signature**) → two link lines → dim wink line. See Dev Notes → "Exact egg content" for the source art and copy.
  - [ ] **Cyan + dim styling via `%c`:** colour the wizard cyan (`#04b4e0`, the `bg-secondary`/wizard colour from the mock) and the wink line dim, using `console.log('%c…', 'color:#04b4e0')` style directives. Note every `%c` consumes one trailing style arg, in order; and any literal `%` in the art must be escaped as `%%` (the current art has none — but do not introduce any). Keep the art in a `String.raw`/templated constant so backslashes (`\`, `\"`) in the wizard are preserved literally — do **not** hand-escape them wrong.
  - [ ] **Links as printed absolute URLs** (auto-linkified by DevTools): Backroom `https://zackerthehacker.com/backroom`, repo `https://github.com/zacbraddy/ZacCVWebsite`, each with its dim descriptor. A printed URL is the only way to get a clickable link in a real console (you cannot attach an href to arbitrary text). Optionally source these from `src/config/index.ts` if a sensible constant home exists, but a local const is fine (minimum complexity — do not over-engineer a config surface for two strings unless one already fits).
  - [ ] **Single emit:** one logical message on mount. Multiple `console.log` lines that together form the one block are fine (that is _not_ a "multi-stage sequence" — the NON-GOAL is timed/progressive/interactive reveals). Do **not** add `setTimeout`/animation/staged reveals.
  - [ ] No `'use client'` anywhere else; this is the **only** new client island. British spelling in any copy ("the back room's open"); codebase is comment-free, so add no comments.
- [ ] **Task 2 — Mount the egg in the root layout (AC1, AC4)**
  - [ ] In `src/app/layout.tsx`, import `ConsoleEgg` and render it once inside `<body>` (a sibling of `LoadingSpinner`/`Providers` — it returns `null` so placement is immaterial to layout; put it alongside `LoadingSpinner` for readability). It must be in the **root** layout, **not** `(site)/layout.tsx` or `backroom/layout.tsx`, so it fires on **every** page (AR-9: "fires on any page").
  - [ ] Match the existing import style/default-vs-named export convention used by the other atoms in `layout.tsx` (`LoadingSpinner` is a default export; `ThemeToggle` is named — pick whichever your atom exports and import accordingly; default export keeps it consistent with `LoadingSpinner`).
  - [ ] Do **not** otherwise change `layout.tsx` (metadata, fonts, Providers, GA, MenuProvider all unchanged).
- [ ] **Task 3 — Verify (AC2, AC3, AC5)**
  - [ ] `npm run build` → **green**, **pure static export**; confirm every route is `○ (Static)` / `● (SSG)` and there are **no** `.func` (grep the build output / `out/`). The egg is a client island but adds **no** server surface and does not de-opt any route from static.
  - [ ] `npm run lint` → **clean** (no unused imports; Prettier-compliant — `singleQuote`, `arrowParens: avoid`).
  - [ ] `npm run dev`: open the console **before** load and confirm the wizard + bubble + two links + wink appears **on page load** on a **FoH** page (`/`) and on a **Backroom** page (`/backroom`). Confirm the wizard is cyan and the wink is dim.
  - [ ] Click both links: confirm `→ The backroom` opens `/backroom` and `→ The source` opens the public repo. **Verify the repo is public** (open the GitHub URL in a private/incognito window). If private, **flag to Zac** — do not ship a link that 404s for anonymous visitors.
  - [ ] **Buffer-retention check (AC3 / G3):** reload with dev tools **closed**, then open dev tools **after** the page has loaded, and confirm the message is **still shown**. Repeat in **Chromium, Firefox, and WebKit/Safari** if available. Only if a target browser does **not** retain it, add the lightweight dev-tools-open re-emit fallback (and note it) — otherwise ship the on-load emit alone.
  - [ ] Confirm the egg fires **once**, not twice, in dev (StrictMode guard working) and that it adds **no** visible DOM and **no** new GA events.
  - [ ] Do **not** fabricate any test run (there is no suite).

## Dev Notes

### What is already built — consume as-is, do NOT rebuild or touch

- **`/backroom` Overview route** is live (Story 2.3/2.4) — one of the egg's two link targets. Just link to it; do not touch it.
- **Public GitHub repo** — `https://github.com/zacbraddy/ZacCVWebsite` (from `git remote -v`). The egg's second link. Verify it is public before shipping (AC2).
- **`src/app/layout.tsx`** — the **root** layout (global chrome only after the Story 2.2 split: `<html>/<body>`, fonts, `Providers`, `ThemeToggle`, `LoadingSpinner`, `GoogleAnalytics`, `MenuProvider`). Story 2.2 explicitly noted "the root layout becomes the home for the console egg added later in Story 2.7." This is the **only** file you edit — add the `ConsoleEgg` mount, nothing else.
- **`src/components/atoms/loading-spinner.tsx`** — the closest existing pattern: a `'use client'` atom that does client-only work (reads `document`) and conditionally returns `null`. Mirror its `'use client'` directive + default-export shape. (It uses `useSyncExternalStore`; your egg uses a one-shot `useEffect` — different hook, same "client atom that may render nothing" shape.)
- **`ThemeToggle` / `LoadingSpinner` mounts in `layout.tsx`** — the placement reference for adding `<ConsoleEgg />` inside `<body>`.

### Exact egg content (UX-DR13, DESIGN.md `components.console-egg`, EXPERIENCE.md voice table, console-egg-mock.html, egg_art.txt)

The **locked structure** is: **speech bubble → cyan wizard → two links → dim wink line.** Wording is a tweak; structure + both links are non-negotiable. Sources:

- **Speech bubble** (`_bmad-output/planning-artifacts/ux-designs/ux-project-ariadne-2026-06-24/.working/egg_art.txt` and the `.bubble` block in `console-egg-mock.html`):
  ```
   .------------------------------------------.
   | Ah, I see you're also a tech wizard.     |
   | Well — while you're here, you may        |
   | as well come in. The back room's open.   |
   '------------------------------------------'
          \
           \
  ```
- **Cyan ASCII wizard** (the `.wiz` `<pre>` in `console-egg-mock.html` — the `mrf`-signed wizard ending in `(________mrf\____.dBBBb.________)____)`). Copy it **verbatim** including the `mrf` artist signature and the `dBBBb` base. It contains backslashes and an escaped `\"` — keep them literal (use a template literal / `String.raw`, do not mangle the escaping).
- **Two links** (the `.bubble` link block in the mock; reconcile `<a href>` → printed absolute URL):
  - `→ The backroom` → `https://zackerthehacker.com/backroom` — dim descriptor: `how this site was actually built`
  - `→ The source` → `https://github.com/zacbraddy/ZacCVWebsite` — dim descriptor: `it's all real, and public`
- **Dim wink line** (the `.dim` `<pre>` in the mock): `(this whole place — docs and all — was built with Claude Code + BMAD.)`
- **Voice** (EXPERIENCE.md Do/Don't): casual, charming-not-cringe, British spelling, judgement-light. **Do**: "Ah, I see you're also a tech wizard. Well — while you're here, you may as well come in." **Don't**: "Congrats, you found the secret! 🎉🎉".
- **Colours** (DESIGN.md): the wizard is cyan — `console-egg.art-color: {colors.bg-secondary}`, i.e. the site cyan `#04b4e0`. The wink/descriptors are dim/grey. Because this is the **browser console** (not DOM, not themed surface), the theme-token / no-hardcoded-hex rule does **not** apply here — `%c` style strings legitimately use literal colour values (`color:#04b4e0`). This is an accepted exception, exactly as the loading-spinner uses `var()` inline: console styling has no CSS-variable access.

### The clickable-link reconciliation (AC2 — important)

The mock renders the two links as HTML `<a href>` anchors because it is an HTML _mock of_ a console. In a **real** browser console you **cannot** attach an href to arbitrary anchor text — DevTools only auto-linkifies **printed URL strings**. So the implementation prints the **full absolute URLs** (`https://zackerthehacker.com/backroom`, `https://github.com/zacbraddy/ZacCVWebsite`) and DevTools makes them clickable. Use the **absolute** Backroom URL (not the relative `/backroom`) so the console link is clickable/navigable from any page and in the deployed site. Keep the `→ The backroom` / `→ The source` labels as adjacent dim text for charm; the clickable element is the URL itself.

### `%c` console styling — the gotchas that bite

- Each `%c` in the format string consumes **one** trailing style-string argument, applied in order: `console.log('%cWIZARD%c next', 'color:#04b4e0', 'color:#9a9da1')`.
- A literal `%` in the content must be written `%%` or it is read as a format directive. **The current art contains no `%`** — keep it that way.
- Multi-line ASCII art styles fine in one `%c` log call. Mixing many colours in one call gets fiddly — it is cleaner to emit the **wizard** in one styled `console.log` (cyan) and the **links + wink** in another (dim), which still reads as one block on mount. This is **not** a "multi-stage sequence" (the NON-GOAL = timed/interactive reveals), just adjacent log lines.
- Newlines: use real `\n` (template literal) so the art keeps its shape across browsers.

### StrictMode double-emit guard (AC4)

React 18/19 StrictMode intentionally **double-invokes effects in development** to surface impurities. Without a guard the egg would log **twice** in `npm run dev`. Use a **module-scope `let emitted = false`** flag, set to `true` inside the effect on first run, and early-return if already true. This is simpler and more reliable than a `useRef` for a fire-once-per-page-load side effect, and it reads clearly. (Production static export does not run StrictMode double-invoke, but the guard is correct and cheap.)

### Critical project rules that bite here (project-context.md)

- **Atomic design (strict):** `console-egg` is an **atom** (AR-14 lists it explicitly: "console-egg (client, returns null)"). One component per file, kebab-case filename (`console-egg.tsx`), PascalCase identifier (`ConsoleEgg`). **No** CSS Module needed (it renders no DOM) — do not create one.
- **Server vs Client:** this is one of the few components that genuinely **needs** `'use client'` — it uses `useEffect` and the `console` browser API. It must be a client island. It is the **only** new client island in this story (AR-9, AC4); do not convert anything else.
- **Static export only (NFR-1):** the egg adds **no** server surface. A `'use client'` component is still prerendered/exported statically — it does **not** de-opt any route. Every route must stay `○ (Static)` / `● (SSG)`, no `.func`. (The `useEffect` runs client-side after hydration; nothing about it requires a server runtime.)
- **Hydration / SSG safety:** all `console`/browser work lives **inside `useEffect`** (client-only) — never at module top-level or in render, which would run during the static build (no DOM/console-as-expected) and risk a hydration mismatch. Returning `null` is hydration-safe.
- **No new analytics events (NFR-6, EXPERIENCE.md "Banned in v1"):** do not wire any GA event to the egg. GA stays exactly as the root layout already has it.
- **No new dependencies (NFR-7):** `console`, React `useEffect`, and a string constant are all you need. Add nothing.
- **Prettier is law:** `singleQuote`, `arrowParens: avoid`. Pre-commit `pretty-quick` reformats staged files — don't hand-fight it. Watch that Prettier does not reflow the ASCII-art template literal (template-literal contents are preserved by Prettier; keep the art in a backtick template so it is untouched).
- **No code comments by default** — the codebase is comment-free; let the code speak.
- **British spelling** in user-facing copy ("the back room's open", "how this site was actually built").
- **`npm test` is a stub** — verification = build + lint + manual preview. **Do not fabricate test runs.**
- **Don't build Tailwind class names dynamically / no styled-components** — N/A here (no DOM), noted only so you don't reach for them.

### Project Structure Notes

- **New file (1):** `src/components/atoms/console-egg.tsx` (`'use client'`, returns `null`).
- **Edited file (1):** `src/app/layout.tsx` (import + mount `<ConsoleEgg />` once inside `<body>`).
- **Do NOT touch:** anything under `src/app/(site)/**` or `src/app/backroom/**`, any organism/molecule, the Velite pipeline (`velite.config.ts`, `next.config.ts`), `docs/public/**`, `globals.css`, or the Entry link (`entry-link.tsx`, Story 2.6). If you edit any of these, you have left scope — stop and re-read the scope guard.
- No CSS Module, no data, no routing, no dependency, no Backroom, no front-of-house change.

### References

- [Source: epics.md#Story-2.7] — the three AC clusters (client atom in root layout, emits on mount, returns null; buffer-retention with re-emit fallback only; single island/no DOM/no events/single emit), FR-11.
- [Source: _bmad-output/planning-artifacts/architecture.md → AR-9, AR-14] — console-egg mechanism: `'use client'` in the **root** layout (fires on any page), emit ASCII via `console` on mount, returns `null`; on-load emit primary, dev-tools-detection re-emit an evidence-driven fallback only (G3 — verify buffer retention across target browsers); `console-egg` is an atom.
- [Source: ux-designs/.../DESIGN.md `components.console-egg` (L134–136)] — browser-console only (not DOM), cyan ASCII wizard, `art-color: {colors.bg-secondary}` (= site cyan `#04b4e0`).
- [Source: ux-designs/.../EXPERIENCE.md — IA table (L35), Component Patterns "Console easter egg" (L90), State "Egg before dev-tools opened" (L101), Voice Do/Don't (L72,74–76), "Banned in v1" (L114–115)] — emitted via `console.*` on load; ASCII wizard + bubble + two clickable links (Backroom + public repo) + dim wink; single static message, no multi-stage (NON-GOAL); browsers retain pre-open message, dev-tools re-emit only as evidence-driven fallback; casual charming-not-cringe voice; no new analytics events.
- [Source: ux-designs/.../mockups/console-egg-mock.html] — composition reference: the cyan `.wiz` wizard art (the `mrf`/`dBBBb` wizard — copy verbatim), the `.bubble` speech bubble, the two link lines with dim descriptors, the `.dim` wink line; the `<a href>` anchors are mock-only — reconcile to printed absolute URLs (Dev Notes → clickable-link reconciliation).
- [Source: ux-designs/.../.working/egg_art.txt] — the speech-bubble art.
- [Source: src/app/layout.tsx] — the root layout (the egg's mount point); existing `LoadingSpinner`/`ThemeToggle`/`GoogleAnalytics`/`MenuProvider` mounts as the placement reference.
- [Source: src/components/atoms/loading-spinner.tsx] — the existing `'use client'` atom pattern (client-only work, may return `null`, default export).
- [Source: src/components/molecules/socials.tsx (L15)] + `git remote -v` — the public repo URL (`https://github.com/zacbraddy/ZacCVWebsite`).
- [Source: _bmad-output/implementation-artifacts/2-6-add-the-front-of-house-entry-link.md] — the sibling entry-point story (the _other_ door); confirms the entry-points pair and the "this finishes Epic 2" framing; do not re-touch its `entry-link` atom.
- [Source: _bmad-output/project-context.md] — atomic-design tiers, Server/Client rules (`'use client'` only when needed), static-export + hydration-safety constraint, no new analytics/dependencies, Prettier, British spelling, no-test-suite verification.

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
