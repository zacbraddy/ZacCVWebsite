# Deferred Work

## Deferred from: code review of 2-2-split-the-layout-into-two-rooms (2026-06-29)

- **`NotFoundContent` vertical centering breaks inside `BackroomLayout`** [`src/components/organisms/not-found-content.tsx`] — its root uses `h-full ... justify-center`, which only resolves inside `SiteShell`'s unbroken `h-full` chain. `BackroomLayout` has no height ancestor (`min-h-screen` → `max-w-screen-md` → `pt-8`), so the 404 would collapse to content height and hug the top. Only matters if/when the backroom 404 actually renders; backroom-404 styling is a later (2.4) story.
- **Duplicated 404 metadata across two files** [`src/app/not-found.tsx` + `src/app/backroom/not-found.tsx`] — identical `title: { absolute: '404: Not found - Zac Braddy' }` hand-copied into both not-found files; the body was extracted to `NotFoundContent` but the metadata was not. Two sources of truth that can drift. Contingent on the backroom-not-found keep/remove decision.
