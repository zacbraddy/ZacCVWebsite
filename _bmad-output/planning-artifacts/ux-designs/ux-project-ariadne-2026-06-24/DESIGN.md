---
name: Ariadne Backroom
description: Visual identity for the Backroom and its entry points on Zac Braddy's CV site — a calmer, content-first reading room that inherits the frozen front-of-house theme.
status: final
created: 2026-06-24
updated: 2026-06-24
sources:
  - prd-project-ariadne-2026-06-23/prd.md
  - _bmad-output/project-context.md
colors:
  # Inherited from the site's CSS custom properties in src/app/globals.css.
  # Dark is the default theme; -light is the `.light` class override.
  # NEVER hardcode these hex values in code — use the existing @utility tokens
  # (bg-primary-400, text-secondary, …) which map to these CSS vars.
  bg-primary-200: '#555555' # nav panel / hero panel surface (dark)
  bg-primary-200-light: '#dddddd'
  bg-primary-400: '#333333' # content card surface (dark)
  bg-primary-400-light: '#eeeeee'
  bg-secondary: '#04b4e0' # cyan — primary accent (dark)
  bg-secondary-light: '#3058b5' # blue — primary accent (light)
  bg-tertiary: '#e0b404' # gold — spark accent (dark)
  bg-tertiary-light: '#e6593d' # terracotta — spark accent (light)
  bg-inverse: '#fafafa'
  bg-inverse-light: '#333333'
  text-primary: '#fafafa' # body text (dark)
  text-primary-light: '#333333'
  text-secondary: '#04b4e0' # cyan link/accent text (dark)
  text-secondary-light: '#49629c'
  text-tertiary: '#e0b404' # gold accent text (dark)
  text-tertiary-light: '#cc715f'
  text-dim: '#b9bcc0' # NEW (Ariadne) — quiet supporting text in nav rows / teasers (dark)
  border-secondary: '#04b4e0'
  border-secondary-light: '#3058b5'
  code-surface: '#1e1e1e' # NEW (Ariadne) — code-block background, both themes
typography:
  fancy-heading:
    fontFamily: Permanent Marker
    note: 'Front-of-house display font (--font-fancy-heading). Used for Backroom doc titles and the Overview headline only — sparingly.'
  body:
    fontFamily: Roboto
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.7'
  doc-title:
    fontFamily: Permanent Marker
    fontSize: 38px
    fontWeight: '400'
    lineHeight: '1.1'
  doc-h2:
    fontFamily: Roboto
    fontSize: 19px
    fontWeight: '500'
    lineHeight: '1.3'
  eyebrow:
    fontFamily: Roboto
    fontSize: 13px
    fontWeight: '600'
    letterSpacing: 0.04em
  nav-row-title:
    fontFamily: Roboto
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.25'
  nav-row-teaser:
    fontFamily: Roboto
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.3'
  section-label:
    fontFamily: Roboto
    fontSize: 10.5px
    fontWeight: '700'
    letterSpacing: 0.14em
  number-tile:
    fontFamily: Roboto
    fontSize: 15px
    fontWeight: '700'
  code:
    fontFamily: ui-monospace
    fontSize: 12.5px
    lineHeight: '1.6'
rounded:
  DEFAULT: 0.25rem # site default (rounded) — content card, etc.
  md: 0.5rem # 8px — nav rows, number tiles, code blocks, callouts
  full: 9999px # chips/pills
spacing:
  unit: 8px
  backroom-frame: 48px # gradient margin around the Backroom shell, all sides
  nav-width: 320px # left nav panel width at lg+
  reading-measure: 64ch # max width of the doc reading column
  doc-pad: 56px # content-pane horizontal padding at lg+
  row-gap: 12px # tile-to-text gap inside a nav row
components:
  nav-row:
    layout: '40px tile + flexible text, two-line (title + teaser)'
    radius: '{rounded.md}'
    text-title: '{colors.text-primary}'
    text-teaser: '{colors.text-dim}'
    hover-bg: 'rgba(250,250,250,0.06)'
    selected-bg: 'rgba(4,180,224,0.14)'
    selected-accent: '{colors.bg-secondary}' # left border + tile fill when selected
  number-tile:
    size: '40px'
    radius: '{rounded.md}'
    bg: '{colors.bg-primary-400}'
    fg: '{colors.text-secondary}'
    border: '1px solid rgba(4,180,224,0.4)'
    selected-bg: '{colors.bg-secondary}'
    selected-fg: '{colors.bg-primary-400}'
  glyph-tile:
    note: 'Same as number-tile but gold — for non-ADR (Pragmatism & process) docs. Glyph ◆ instead of a number.'
    fg: '{colors.text-tertiary}'
    border: '1px solid rgba(224,180,4,0.45)'
  section-label:
    color: '{colors.text-dim}'
    opacity: '0.7'
  back-link:
    color: '{colors.text-dim}'
    hover-color: '{colors.text-secondary}'
  entry-link:
    note: 'Front-of-house only. Bottom-left page chrome, on the gradient. Mirrors the top-left theme toggle.'
    color: '{colors.text-primary}'
    opacity: '0.82'
    treatment: 'dotted underline + subtle text-shadow for legibility over the gradient'
  doc-callout:
    note: 'Pragmatism call-out inside doc content.'
    accent: '{colors.bg-tertiary}'
    bg: 'rgba(224,180,4,0.08)'
    radius: '0 {rounded.md} {rounded.md} 0'
  code-block:
    bg: '{colors.code-surface}'
    radius: '{rounded.md}'
    border: '1px solid rgba(255,255,255,0.06)'
  console-egg:
    note: 'Browser-console only — not DOM. ASCII wizard in cyan, gold sparkle optional. See EXPERIENCE.md.'
    art-color: '{colors.bg-secondary}'
---

# Ariadne Backroom — Visual Identity

> The front-of-house CV site already has a complete, **frozen** visual identity (cyan-on-charcoal,
> Permanent-Marker display type, the gradient page chrome). Ariadne does **not** restyle it. This
> document inherits that identity by reference (the CSS-variable theme in `src/app/globals.css`) and
> specifies only the **Backroom + entry-point deltas**. Where a token below restates a site value it
> is for reference only — in code, always use the existing `@utility` tokens, never raw hex.

## Brand & Style

Two rooms, one house. **Front-of-house** is the flash — confident, animated, the star; it stays
exactly as it is. The **Backroom** is its deliberate opposite: **calm, content-first, competent and
candid.** It is a reading room for a technical evaluator who has chosen to look closer, where the
writing is the spectacle and the chrome gets out of the way.

The posture is **"considered, not showy."** The Backroom inherits the same palette and type, but
spends them differently: the cyan accent that energises the front-of-house here just quietly marks
the thing you're reading; the Permanent-Marker display face appears once per page (the doc title) and
nowhere else. Where front-of-house is a contained, centred card floating in gradient, the Backroom
**opens up** — it fills the viewport behind a thin 48px gradient frame, signalling "you've stepped
into a different, larger space with room to think."

The whole showcase reads as **System Modernisation proof**, carrying the Builder → Modernisation →
Strategy gradient: lead with what was built and how it was decided; strategy shows up as a _quality
of the work_, never a claim. British spelling throughout.

## Colors

The Backroom uses the **same theme tokens as the site** — dark is default, `.light` is the override,
`next-themes` toggles the class, and the toggle must work in the Backroom too. No hardcoded colours;
no styled-components.

- **Charcoal surfaces** ({colors.bg-primary-400} content, {colors.bg-primary-200} nav) carry the
  calm. The content pane is the darker, quieter plane; the nav panel is one step lighter so the two
  read as distinct columns without a hard border.
- **Cyan** ({colors.bg-secondary}) is the **accent of attention** — the selected nav row, the number
  tiles, inline links, the eyebrow, the ASCII wizard. Used to _point_, never to fill large areas.
- **Gold** ({colors.bg-tertiary}) is the **spark of judgement** — the Overview ★ tile, the
  Pragmatism-&-process ◆ glyph tiles, and the pragmatism call-out accent. Gold = "this is a human
  judgement call," distinct from cyan = "this is a decision/link."
- **`text-dim`** ({colors.text-dim}) is new to Ariadne: the quiet grey for nav-row teasers, section
  labels, the `back to the site` link, and console annotations. It is the colour of supporting voice.
- **`code-surface`** ({colors.code-surface}) is a near-black code plane, consistent in both themes so
  syntax highlighting stays legible regardless of toggle.

**Gradient caveat:** the Entry link sits on the page **gradient** (dark: cyan→gold; light differs),
not a flat surface. Its colour must stay legible across the whole gradient in **both** themes — hence
the subtle text-shadow + dotted underline rather than a flat link colour.

## Typography

Inherited: **Roboto** (`--font-sans`) for everything functional, **Permanent Marker**
(`--font-fancy-heading`) for display. The Backroom's discipline is **restraint with the fancy face**:

- **Doc title** ({typography.doc-title}) — Permanent Marker, once at the top of each doc (and the
  Overview headline). This is the single moment of front-of-house personality per page.
- **Eyebrow** ({typography.eyebrow}) — cyan, uppercase-ish, sits above the title to name the section
  ("DECISIONS").
- **Body** ({typography.body}) — Roboto at a **generous 1.7 line-height**, capped to a
  {spacing.reading-measure} measure. Readability over density; this is prose meant to be read.
- **Nav-row title / teaser** ({typography.nav-row-title} / {typography.nav-row-teaser}) — the title
  is medium-weight primary text; the teaser is one quiet `text-dim` line.
- **Section label** ({typography.section-label}) — tiny, heavily tracked, dim. Structural, not loud.
- **Code** ({typography.code}) — monospace inside the code plane.

## Layout & Spacing

**Front-of-house:** unchanged — a contained, centred `max-w-screen-lg/xl` card.

**Backroom (lg+):** a **near-full-bleed two-pane shell** inside a {spacing.backroom-frame} gradient
frame on all sides. The frame is sized so the page chrome — the top-left theme toggle and the
bottom-left Entry link — has breathing room and never crowds the shell edge.

- **Left nav panel:** {spacing.nav-width} wide, `bg-primary-200`, scrolls independently.
- **Content pane:** flexible width, `bg-primary-400`, {spacing.doc-pad} horizontal padding, the
  reading column itself capped at {spacing.reading-measure} and left-aligned (don't let prose run the
  full width of a wide pane).
- **Nav row internals:** a 40px tile + text, {spacing.row-gap} gap, grouped under section labels.

**Below `lg`:** single column. The nav panel is **hidden in the portal** and its entire contents move
into the existing vaul hamburger drawer (`MobileMenu`); content runs full-width. This mirrors the
front-of-house mobile pattern exactly. The custom `xs: 410px` breakpoint and Tailwind defaults apply
as elsewhere.

## Elevation & Depth

Flat and tonal, like the rest of the site. Depth comes from the **one-step tonal difference** between
nav (`bg-primary-200`) and content (`bg-primary-400`), not borders or heavy shadow. The shell may
carry a single soft drop shadow to lift it off the gradient. The selected nav row uses a **left
accent bar + faint cyan tint**, not elevation. Code blocks sit on their own near-black plane with a
hair-thin light border. No glows, no layered cards — calm is the brief.

## Shapes

Inherit the site's restrained rounding. **{rounded.md} (8px)** is the Backroom's working radius —
nav rows, number/glyph tiles, code blocks, and the (left-open) pragmatism call-out. Chips/pills use
`{rounded.full}`. Nothing sharp, nothing pill-shaped except actual pills. Tiles are square-ish with
8px corners so the number reads like a small badge, echoing the "logo slot" of the reference list.

## Components

- **Nav row** — the signature element ("a LinkedIn job-row, in our colours"). A `{components.number-tile}`
  on the left, `{typography.nav-row-title}` heading, one `{typography.nav-row-teaser}` line beneath.
  Hover: faint light wash. **Selected:** cyan-tint background + left cyan accent bar + the tile
  inverts to a solid cyan fill. Two-ish lines tall.
- **Number tile / glyph tile** — cyan-bordered square holding the ADR number (Decisions), or a gold
  ◆ glyph (Pragmatism & process), or a gold ★ (Overview). The tile is what distinguishes the three
  nav sections at a glance.
- **Section label** — tiny tracked dim caps: `OVERVIEW` / `DECISIONS` / `PRAGMATISM & PROCESS`.
- **Back link** — `◀ back to the site`, dim, top of the nav; the only exit affordance inside the
  Backroom. Cyan on hover.
- **Entry link** _(front-of-house)_ — `More interested in how this site is built? →`, pinned
  bottom-left of the page chrome on the gradient, understated (dotted underline, subtle shadow,
  ~0.82 opacity). Mirrors the top-left moon toggle. Present on every page via `layout.tsx`.
- **Doc renderer** — eyebrow + Permanent-Marker title + meta line, then Roboto prose at the reading
  measure, `h2` subheads, inline cyan links, gold pragmatism call-outs, and syntax-highlighted code
  blocks (highlighting present in the prerendered HTML).
- **Pragmatism call-out** — left gold bar + faint gold wash, for the "where pragmatism won and why"
  beats.
- **Console easter egg** _(browser console, not DOM)_ — cyan ASCII wizard + speech bubble + two
  links + a dim wink line. Visual concept locked; see EXPERIENCE.md for copy/behaviour.

## Do's and Don'ts

**Do**

- Inherit the site theme via the existing `@utility` tokens; support the dark/light toggle in the
  Backroom.
- Keep the Backroom calmer than front-of-house — accent colour _points_, it doesn't fill.
- Use Permanent Marker exactly once per doc (the title); Roboto everywhere else.
- Cap prose to the reading measure even when the pane is wide.
- Use cyan for decisions/links, gold for judgement/pragmatism — keep that meaning consistent.

**Don't**

- Don't restyle, re-flash, or regress front-of-house — zero visual regression is a hard success
  metric.
- Don't hardcode hex or use raw Tailwind palette colours (`text-blue-500`) for themed UI; don't add
  styled-components.
- Don't let the Backroom grow front-of-house flash — no spectacle animations, no decorative motion,
  no diagrams/widgets in v1 (counter-metric SM-C2).
- Don't add visual furniture per nav row beyond tile + title + teaser; restraint is the look.
- Don't push the Entry link toward prominence — discoverable, never attention-grabbing; it must
  never pull a 2-second recruiter toward it.
