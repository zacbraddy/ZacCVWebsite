# Deferred Work

## Deferred from: code review of 2-4-build-the-two-pane-reading-room-and-sectioned-navigation (2026-06-30)

- **Adr-less `Decisions` doc degrades silently** [`src/components/organisms/backroom-nav.tsx`, `src/components/molecules/backroom-nav-row.tsx`] — `velite.config.ts` makes `adr` `optional()` independent of `section`, so a `Decisions` doc that omits `adr` (a) sorts via `(a.adr ?? 0)` to position 0, tying any genuine `adr: 0` and falling to the slug tiebreak (can't distinguish "ADR 0" from "no ADR"), and (b) hits the tile ternary `section === 'Decisions' && adr !== undefined ? NumberTile : … : GlyphTile◆`, falling through to the `◆` diamond — visually identical to a Pragmatism row, despite sitting under the Decisions header. Graceful, not a crash, but almost certainly unintended. Latent today (the one Decisions doc has `adr: 4`); becomes live risk when Story 2.5 adds ~10 Decisions docs. Fix options: enforce `adr` on Decisions by convention/schema, or guard the glyph/sort in the nav.

## Deferred from: code review of 2-2-split-the-layout-into-two-rooms (2026-06-29)

- **`NotFoundContent` vertical centering breaks inside `BackroomLayout`** [`src/components/organisms/not-found-content.tsx`] — its root uses `h-full ... justify-center`, which only resolves inside `SiteShell`'s unbroken `h-full` chain. `BackroomLayout` has no height ancestor (`min-h-screen` → `max-w-screen-md` → `pt-8`), so the 404 would collapse to content height and hug the top. Only matters if/when the backroom 404 actually renders; backroom-404 styling is a later (2.4) story.
- **Duplicated 404 metadata across two files** [`src/app/not-found.tsx` + `src/app/backroom/not-found.tsx`] — identical `title: { absolute: '404: Not found - Zac Braddy' }` hand-copied into both not-found files; the body was extracted to `NotFoundContent` but the metadata was not. Two sources of truth that can drift. Contingent on the backroom-not-found keep/remove decision.

## Deferred from: code review of story-2.3 (2026-06-29)

- **Lint/typecheck before build fails on a fresh checkout** — `next.config.mjs` only runs Velite for `dev`/`build` argv, so the `@velite` import is unresolved until a build has generated `.velite/`. Netlify's `next build` runs Velite first so production is fine; this is a latent fresh-checkout / CI ordering trap. Deferred: low value.
- **Author-content trust edges in the Velite pipeline are unhardened** — a second `section: 'Overview'` doc would be wholly unreachable (excluded from `[slug]` params, `dynamicParams=false`); zero Overview docs would silently 404 `/backroom`; duplicate basenames under `public/**/*.md` would collide on the derived slug. All latent today (four hand-authored flat docs). Deferred: content is author-controlled and hardening borders on gold-plating for a personal CV site.
