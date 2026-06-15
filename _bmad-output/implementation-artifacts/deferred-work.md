# Deferred Work

## Deferred from: code review of story-1.1 (2026-06-11)

- `next start` script is dead under `output: 'export'` (no server to start) — `package.json`. Low-priority footgun; revisit only if static export is ever dropped.
- ~~`prepare: "husky"` fails under `npm ci --omit=dev` (prod/CI-only install, husky is a devDependency) — `package.json`. Deferred to Story 1.7 (Netlify deploy config), where the build/install command is defined.~~ **RESOLVED 2026-06-15 (Story 1.7)** — `HUSKY = "0"` set in `netlify.toml [build.environment]` neutralises the prepare hook during the Netlify install step without touching the `prepare` script (local hooks keep working). See ADR 0014.
- Geist fonts are fetched from Google Fonts at build time (`next/font/google`), so offline/air-gapped builds fail — `src/app/layout.tsx`. Reproducibility dependency; deferred to Story 1.7 (deploy/build environment).

## Deferred from: code review of story-1.2 (2026-06-11)

- ~~Prettier pinned `^2.8.7` alongside modern `eslint-config-prettier ^10` — `package.json`. Not a functional conflict (`eslint-config-prettier` is version-agnostic), but a currency smell carried over from the Story 1.1 scaffold; revisit when next touching the formatter.~~ **RESOLVED 2026-06-11** — Prettier bumped to `^3.8.4`, `pretty-quick` to `^4.2.2`; see ADR 0007.
- `npm run lint` only warns, never fails (no `--max-warnings 0` / CI gate), so genuine a11y/Next issues pass green — `eslint.config.mjs`. Already recorded as an open follow-up in ADR 0007; decide on a commit/CI gate later.

## Deferred from: code review of story-1.4 (2026-06-12)

- ~~No `.dark` class hook — dark is defined on `:root` only; the cascade can add `.light` but never re-assert dark on a subtree — `src/app/globals.css`. Latent; resolve in Story 1.5 (next-themes `attribute="class"`). Correct today (no class → dark).~~ **RESOLVED 2026-06-12 (Story 1.5)** — `next-themes` wired with `attribute="class"` now writes `class="dark"`/`class="light"` on `<html>`; the `.dark` class is present and re-asserts dark on any subtree. See ADR 0011.
- ~~No FOUC / pre-hydration guard — static export ships no theme class, so a future localStorage-backed `.light` toggle will flash dark-then-light on load (the full-viewport `body::before` gradient makes it visible) — `src/app/globals.css`. The pre-hydration blocking script is Story 1.5 scope (AC8); flag so 1.5 doesn't forget it.~~ **RESOLVED 2026-06-12 (Story 1.5)** — `next-themes`' blocking pre-hydration `<script>` (verified in `out/index.html`) sets the `<html>` class before first paint, plus `suppressHydrationWarning` on `<html>`. No palette flash. See ADR 0011.
- Unlayered `body`/`html`/`*`/`a` rules sit outside any `@layer`, so they outrank the `@utility` token classes (utilities layer) — `src/app/globals.css`. A `bg-*`/`text-*` utility applied to `body` or `html` would silently lose to the hand-written rule. Matches archive behaviour; revisit only if a tier port needs to theme `body`/`html` via a utility.

## Deferred from: code review of story-1.5 (2026-06-12)

- ~~Static `aria-label="Dark mode switch"` does not reflect the toggle's current/target state — a screen-reader user in light mode still hears "Dark mode switch", and the accessible name never updates — `src/components/atoms/theme-toggle.tsx`. Genuine latent a11y issue, but carried over verbatim from `archive/src/components/theme.js` and mandated character-for-character by Story 1.5 AC5 as the parity contract; changing it now would break parity. Revisit in the Ariadne a11y/polish pass (e.g. a state-aware label like "Switch to light mode" / "Switch to dark mode").~~ **RESOLVED 2026-06-12 (during review, Zac's call)** — label is now state-aware: `resolvedTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'`, keyed on `=== 'light'` so the `undefined`→dark-default first render stays stable (AC4 hydration property preserved; verified `out/index.html` emits "Switch to light mode" with the moon). A deliberate, conscious step off strict AC5 parity — screen-reader-only, invisible to the Story 4.1 visual-diff gate, consistent with the idiomatic-Next protocol.

## Deferred from: code review of story-1.6 (2026-06-15)

- Analytics has no environment gating or cookie-consent mechanism — `src/app/layout.tsx` renders `<GoogleAnalytics gaId="G-F98QXJC4S0" />` unconditionally, so GA fires in dev/preview/prod alike with no `process.env` gate and no PECR/GDPR consent layer before cookies/network calls. Not a regression (archive `gatsby-plugin-google-gtag` behaved identically), but a real consideration for a UK-facing business site. Revisit as a dedicated story (env-gate + consent), independent of the parity work.
- Roboto loaded single-weight `400` → browser faux-bold (algorithmic synthesis) for any `<strong>`/`<b>`/`font-weight:700` text — `src/app/layout.tsx`. Parity-faithful: the archive `gatsby-plugin-google-fonts` also loaded only `Roboto:400`, so adding `700` would exceed Story 1.6's AC8 scope. Revisit at the Epic 3 typography work / Story 4.1 per-tier visual-diff gate if real bold cuts are desired.
- `metadataBase` and `openGraph.url` hardcode the production host `https://zackerthehacker.com` — `src/app/layout.tsx`. Correct (and spec-mandated verbatim) for production parity, but the Story 1.7 Netlify preview will emit production OG/Twitter absolute image URLs. Consider env-derivation (e.g. `NEXT_PUBLIC_SITE_URL`) if preview-deploy social-card correctness ever matters.
