# Deferred Work

## Deferred from: code review of story-1.1 (2026-06-11)

- `next start` script is dead under `output: 'export'` (no server to start) — `package.json`. Low-priority footgun; revisit only if static export is ever dropped.
- `prepare: "husky"` fails under `npm ci --omit=dev` (prod/CI-only install, husky is a devDependency) — `package.json`. Deferred to Story 1.7 (Netlify deploy config), where the build/install command is defined.
- Geist fonts are fetched from Google Fonts at build time (`next/font/google`), so offline/air-gapped builds fail — `src/app/layout.tsx`. Reproducibility dependency; deferred to Story 1.7 (deploy/build environment).

## Deferred from: code review of story-1.2 (2026-06-11)

- ~~Prettier pinned `^2.8.7` alongside modern `eslint-config-prettier ^10` — `package.json`. Not a functional conflict (`eslint-config-prettier` is version-agnostic), but a currency smell carried over from the Story 1.1 scaffold; revisit when next touching the formatter.~~ **RESOLVED 2026-06-11** — Prettier bumped to `^3.8.4`, `pretty-quick` to `^4.2.2`; see ADR 0007.
- `npm run lint` only warns, never fails (no `--max-warnings 0` / CI gate), so genuine a11y/Next issues pass green — `eslint.config.mjs`. Already recorded as an open follow-up in ADR 0007; decide on a commit/CI gate later.
