# Reconcile — user-supplied inputs

How each thing Zac supplied during Discovery was honoured in the spines/mocks. Nothing dropped.

## `imports/linkedin-job-list-reference.png` — LinkedIn job-list screenshot

- **Use:** the model for the Backroom **nav row** ("not cards but elements" — a tile + title + quiet
  metadata, subtle separators, one row gently selected).
- **Honoured in:** DESIGN.md → `components.nav-row` / `number-tile`; EXPERIENCE.md → Component
  Patterns (Nav row). Translated into the site palette (cyan tile, `text-dim` teaser, cyan-tint
  selected) rather than LinkedIn's blue/white.
- **Deliberately not carried over:** the dismiss (✕), "Promoted/Easy Apply" chips, company logos,
  multi-line status metadata — those would add furniture against the "calmer, content-first" brief.
  Each row is intentionally reduced to **tile + heading + one teaser**.

## `imports/entry-link-placement-reference.png` — front-of-house screenshot w/ arrow

- **Use:** pinpointed where the **Entry link** goes — bottom-left of the page chrome, on the gradient,
  outside the dark content shell, mirroring the top-left theme toggle.
- **Honoured in:** DESIGN.md → `components.entry-link` + Layout & Spacing (48px frame sized to host
  the chrome); EXPERIENCE.md → IA + Component Patterns + Responsive (mobile relocation into the
  drawer). Lives in `layout.tsx` → present on every page.
- **Surfaced constraint:** the gradient background means the link needs deliberate contrast handling
  in both themes (dotted underline + subtle text-shadow) — captured in DESIGN.md Colors + EXPERIENCE
  Accessibility.

## Zac-supplied ASCII wizard ("mrf" art)

- **Use:** the Console easter-egg figure, straight-swapped into `console-egg-mock.html`.
- **Honoured in:** DESIGN.md → `components.console-egg`; EXPERIENCE.md → Component Patterns + Voice.
  Rendered cyan; `mrf` artist signature preserved (attribution). Copy is locked in _structure_
  (wizard + bubble + 2 links + wink), wording deferred to implementation per Zac.
