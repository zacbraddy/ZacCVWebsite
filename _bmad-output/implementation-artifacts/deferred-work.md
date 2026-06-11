# Deferred Work

## Deferred from: code review of story-1.1 (2026-06-11)

- `next start` script is dead under `output: 'export'` (no server to start) — `package.json`. Low-priority footgun; revisit only if static export is ever dropped.
- `prepare: "husky"` fails under `npm ci --omit=dev` (prod/CI-only install, husky is a devDependency) — `package.json`. Deferred to Story 1.7 (Netlify deploy config), where the build/install command is defined.
- Geist fonts are fetched from Google Fonts at build time (`next/font/google`), so offline/air-gapped builds fail — `src/app/layout.tsx`. Reproducibility dependency; deferred to Story 1.7 (deploy/build environment).
