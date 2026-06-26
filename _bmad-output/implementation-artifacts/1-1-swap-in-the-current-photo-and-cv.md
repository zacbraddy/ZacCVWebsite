# Story 1.1: Swap in the current photo and CV

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Zac, the maintainer,
I want the site to serve my current portrait photo and current downloadable CV,
so that a recruiter clearing the credibility gate sees the real, current me and grabs an up-to-date CV (UJ-1).

## Acceptance Criteria

1. **Portrait swap (FR-1).** The new portrait `scratch/avatar pic zac.jpg` is published **by overwriting the existing file at `public/images/zac-portrait.jpg`** (same path, same filename). The new image then renders everywhere the old one did — the home/about-me portrait via `next/image` in `atoms/portrait-image.tsx` (not a raw `<img>`), and the OG/Twitter `images: ['/images/zac-portrait.jpg']` references across `layout.tsx`, `page.tsx`, `about-me/page.tsx`, `resume/page.tsx`, `content/page.tsx` — **with no code edits to those files** (the path is unchanged). No stale/old portrait file is left orphaned in `public/` (the staged `scratch/` copy is not committed into `public/`).

2. **CV swap (FR-2).** The current CV `scratch/Zac-Braddy-20260522.pdf` is published **by overwriting the existing file at `public/pdfs/zac-braddy.pdf`** (same path, same filename). The download link `nav-links.tsx:30 → href="/pdfs/zac-braddy.pdf"` therefore resolves to the current (2026-05-22) document **with no code edit to `nav-links.tsx`**. The previous CV PDF is not left orphaned in the bundle (it is overwritten, not added alongside).

3. **Clean build & lint.** `npm run build` is a clean static export (every route `○ (Static)`, no `.func`) and `npm run lint` is clean.

4. **Visual verification.** The new portrait renders correctly through the Netlify image CDN in a deploy preview (note: the dev image-loader returns the raw `src`, so the portrait renders locally too; CDN resizing only applies in production). Eyeball the portrait in the circular `object-cover` frame to confirm the crop/orientation looks right.

## Tasks / Subtasks

- [ ] **Task 1 — Publish the portrait (AC: #1, #4)**
  - [ ] Overwrite `public/images/zac-portrait.jpg` with the bytes of `scratch/avatar pic zac.jpg` (keep the destination filename `zac-portrait.jpg` exactly — do NOT introduce `avatar pic zac.jpg` into `public/`; the space in that name and the new path would both break references).
  - [ ] Do NOT edit `portrait-image.tsx` or any of the 5 metadata files — the path `/images/zac-portrait.jpg` is reused, so they pick up the new image automatically.
  - [ ] Confirm no other portrait file remains orphaned in `public/images/` (only `zac-portrait.jpg` is Zac's portrait; the other images are testimonial/content thumbnails — leave them).
- [ ] **Task 2 — Publish the CV (AC: #2)**
  - [ ] Overwrite `public/pdfs/zac-braddy.pdf` with the bytes of `scratch/Zac-Braddy-20260522.pdf` (keep the destination filename `zac-braddy.pdf` exactly).
  - [ ] Do NOT edit `nav-links.tsx` — the href `/pdfs/zac-braddy.pdf` is reused. Do NOT add the dated filename as a second file (that would orphan the old one and break the link).
- [ ] **Task 3 — Verify (AC: #3, #4)**
  - [ ] Run `npm run build`; confirm green, pure static export (every route `○ (Static)`, no serverless `.func`).
  - [ ] Run `npm run lint`; confirm clean.
  - [ ] Run `npm run dev` (or inspect a deploy preview) and visually confirm: the new portrait shows in the circular frame on home + about-me; clicking **Download CV** serves the 2026-05-22 PDF.

## Dev Notes

**This is an asset-only story. Zero source code changes are expected.** Both assets are served from fixed, reused public paths, so overwriting the file contents is the entire implementation. If you find yourself editing `.tsx` files, stop — you've taken a wrong turn (the only reason to edit would be a path change, which this story explicitly avoids).

### Why no code edits (the path-reuse model)

- **Portrait** is referenced by the literal string `/images/zac-portrait.jpg` in 6 places: `atoms/portrait-image.tsx:9` (the `next/image` `src`) and the OG/Twitter `images: [...]` arrays in `layout.tsx` (×2), `page.tsx` (×2), `about-me/page.tsx` (×2), `resume/page.tsx` (×2), `content/page.tsx` (×2). Overwriting the file at that path updates all of them at once. [Source: epics.md#Story-1.1; grep of `zac-portrait` across `src/`]
- **CV** is referenced by exactly one literal: `molecules/nav-links.tsx:30 → href="/pdfs/zac-braddy.pdf"` (the only `.pdf` reference in `src/`). The `resume` page does NOT embed the PDF — the CV is reachable only via the "Download CV" link in the nav. [Source: grep of `.pdf` across `src/`]

### Staged assets (confirmed present)

- `scratch/avatar pic zac.jpg` — 519 KB JPG (new portrait). Destination: `public/images/zac-portrait.jpg` (currently 46 KB).
- `scratch/Zac-Braddy-20260522.pdf` — 209 KB (current CV). Destination: `public/pdfs/zac-braddy.pdf` (currently 861 KB).

### Image rendering pipeline (so you understand what "renders correctly" means)

- The portrait renders via `next/image` with a **custom Netlify loader** (`src/image-loader.ts`): in `NODE_ENV=development` the loader returns the raw `src` (so `npm run dev` shows the real file); in production it rewrites to `/.netlify/images?url=…&w=…&q=75`, and the Netlify Image CDN resizes/optimises on the fly. [Source: project-context.md#Technology-Stack; `src/image-loader.ts`]
- Consequence: the 519 KB source size is **not** a delivery-perf concern — the CDN serves a resized variant (the portrait renders at most 192 px in a `rounded-full` `object-cover` circle). No need to pre-compress the source. Do confirm the crop looks right since `object-cover` will centre-crop a non-square image.
- `portrait-image.tsx` is a Server Component (no `'use client'`) — keep it that way; you aren't touching it.

### CV download behaviour (unchanged)

- The link is `<a href="/pdfs/zac-braddy.pdf" target="_blank" rel="noreferrer" download …>`. The bare `download` attribute means the browser names the saved file from the URL → `zac-braddy.pdf`. Keeping the destination filename preserves this behaviour; no change intended. [Source: `nav-links.tsx:29-37`]

### Scope discipline (Epic 1 ethos)

Epic 1 is **data/config/asset/copy edits only — zero change to structure, design, or flash**; the named failure mode is gold-plating. This story is the thinnest slice: two file overwrites. Do not "improve" the portrait component, the loader, the metadata, the PDF, or anything adjacent. Roles/job-titles (Story 1.2), About-me stats/summary (Story 1.3), and pruning Twitter/The-Reactionary/dead-handle (Story 1.4) are **explicitly out of scope here** — do not start them. [Source: epics.md#Epic-1]

### Project Structure Notes

- Assets live under `public/` and are served from the site root (`public/images/zac-portrait.jpg` → `/images/zac-portrait.jpg`; `public/pdfs/zac-braddy.pdf` → `/pdfs/zac-braddy.pdf`). Standard Next.js static-asset convention; no structure change.
- `scratch/` is a working/staging folder, **not** part of the published bundle — never reference `scratch/...` from source or commit it into `public/`.
- File-naming convention is kebab-case; the existing destination names (`zac-portrait.jpg`, `zac-braddy.pdf`) already comply — preserving them keeps the convention and the references intact.

### Verification standard (no test suite)

There is **no test framework** — `npm test` is a stub (`exit 1`). Do **not** fabricate test runs. Verification for this story is: `npm run build` green + pure static export, `npm run lint` clean, plus the manual visual check (portrait renders in the circle; Download CV serves the new PDF). [Source: project-context.md#Testing-Rules; epics.md#AR-15]

### References

- [Source: epics.md#Story-1.1] — story statement, acceptance criteria, FR-1/FR-2.
- [Source: epics.md#Epic-1] — epic scope, zero-regression / no-gold-plating discipline (NFR-2).
- [Source: project-context.md#Technology-Stack] — `next/image` + custom Netlify loader, static export.
- [Source: project-context.md#Testing-Rules] — no test suite; build + lint + manual preview is the verification bar.
- [Source: src/components/atoms/portrait-image.tsx] — portrait render (`next/image`, `object-cover`, `rounded-full`).
- [Source: src/components/molecules/nav-links.tsx:29-37] — the single CV download link.
- [Source: src/image-loader.ts] — dev returns raw `src`; prod rewrites to Netlify Image CDN.

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
