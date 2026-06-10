---
project_name: "Zac's CV Website"
user_name: 'Zac'
date: '2026-06-10'
sections_completed:
  [
    'technology_stack',
    'language_specific',
    'framework_specific',
    'testing',
    'code_quality',
    'workflow',
    'critical_gotchas',
  ]
existing_patterns_found: 7
status: 'complete'
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- **Gatsby `^5.9.0`** — static site generator. Node `>=18.15.0` required.
- **React `^18.2.0`** — function components + hooks ONLY. No class components.
- **JavaScript / JSX** — this is a **plain JS project. There is NO TypeScript.** Do not add `.ts`/`.tsx` files or type annotations. Use `PropTypes` for prop validation.
- **Tailwind CSS `^3.3.1`** — primary styling mechanism (utility classes).
- **styled-components `^5.3.9`** — used ONLY for dynamic/animated styling and the global theme (`createGlobalStyle`). Not the default choice for static styling.
- **CSS Modules** (`*.module.css`) — used for component-scoped CSS that Tailwind can't express.
- **Routing:** `@reach/router` (bundled with Gatsby) — import `useLocation` from `@reach/router`, NOT `react-router`.
- **SEO:** `react-helmet` `^6.1.0` via the `<Seo>` component.
- **Icons:** FontAwesome `^6.4.0` (`@fortawesome/react-fontawesome`).
- **Images:** `gatsby-plugin-image` + `gatsby-plugin-sharp` for optimised images.
- **Tooling:** Prettier `2.8.7` + Husky pre-commit (`pretty-quick --staged`). **No ESLint, no test framework.**

**Version constraints:** Gatsby 5 / React 18 are coupled to the v5 plugin ecosystem (all `gatsby-plugin-*` and `gatsby-transformer-*` are `^5.x`/`^6.x`). Do not upgrade the Gatsby major version without upgrading the whole plugin set together.

## Critical Implementation Rules

### Language-Specific Rules (JavaScript / JSX)

- **ES Modules only.** `import`/`export`. Every component file ends with a `default export` of the component (`export default Pill;`). Shared constants/helpers use **named exports** (e.g. `export const DARK = 'dark'`).
- **Arrow function components.** Define as `const Name = ({ props }) => (...)`. Prefer implicit return (parenthesised JSX) for presentational components; use a block body with `return` only when hooks/logic are needed.
- **Prettier is law** (`.prettierrc`): single quotes, and `arrowParens: "avoid"` — write `arg => ...` NOT `(arg) => ...`. Single-arg arrows have no parens.
- **Prop validation via `PropTypes`** (no TypeScript). Components with non-trivial props declare `Component.propTypes` and, where relevant, `Component.defaultProps` (see `seo.js`). Destructure props in the function signature with inline defaults for simple cases (e.g. `({ className = '', children })`).
- **Never hand-format.** Let Prettier handle quotes/semicolons/spacing. Pre-commit `pretty-quick --staged` reformats staged files automatically.
- **British spelling in user-facing copy and comments** (project owner preference); keep API/CSS identifiers as their canonical spelling (e.g. `color`, `center`).

### Framework-Specific Rules (Gatsby + React)

**Atomic Design structure (STRICT).** Components live under `src/components/` in tiers:

- `atoms/` — smallest reusable pieces, no business composition (`pill.js`, `heading.js`, `nav-link.js`).
- `molecules/` — small groups of atoms (`nav-links.js`, `socials.js`, `testimonial.js`).
- `organisms/` — full page sections composed of molecules/atoms (`about-me.js`, `experience.js`).
- `pages/` — Gatsby file-based routes ONLY. A file in `src/pages/` = a route. Keep pages thin; they compose organisms.
- Place a new component in the correct tier; never inline a reusable chunk into a page or organism.

**Theming via CSS custom properties — do NOT hardcode colours.**

- Colours come from `theme-styles.js` (`darkThemeValues` / `lightThemeValues`), injected as `--color-*` CSS vars through styled-components `createGlobalStyle`.
- Tailwind's `tailwind.config.js` maps those vars to tokens: use `text-secondary`, `bg-primary-400`, `border-secondary`, `text-icon-primary`, etc. — NEVER raw hex or Tailwind default colours (`text-blue-500`) for themed UI.
- To add a new themed colour: add it to BOTH theme value objects, expose it as a `--color-*` var in `populateVars`, then map it in `tailwind.config.js`.

**Styling decision order:** (1) Tailwind utility classes first → (2) CSS Module for scoped static CSS Tailwind can't express → (3) styled-components only for dynamic/animated/JS-driven styles (`keyframes`, theme globals).

**Gatsby data layer.** Use `useStaticQuery(graphql\`...\`)` for build-time data (see `seo.js`). Read site metadata from `gatsby-config.js` `siteMetadata`, not hardcoded values.

**SEO.** Every page renders `<Seo title="..." />` as its first element. Don't write raw `<Helmet>` in pages.

**Cross-cutting UI state via Context.** Shared state like the mobile menu uses `MenuOpenContext` exported from `layout.js`. Consume with `useContext(MenuOpenContext)`. No Redux/Zustand/global store — keep state local or in existing contexts.

**Config indirection.** Tweakable values (e.g. job title) live in `src/config/index.js` and are imported as `config.JOB_TITLE`. Don't hardcode such values into components.

**Images.** Add images under `src/images/` (sourced by `gatsby-source-filesystem`) and render via `gatsby-plugin-image`, not raw `<img>` (except static `/images/*` assets referenced by URL).

### Testing Rules

- **No test framework is currently configured.** The `npm test` script is the default Gatsby placeholder stub (`exit 1`) — it does NOT run tests. Do not assume Jest/Vitest/RTL exist.
- **Do not fabricate test runs or claim tests pass.** There is no suite to run.
- If asked to ADD testing, the Gatsby-idiomatic choice is **Jest + React Testing Library** (requires Jest config via `babel-jest` + a `jest-preprocess` transform and a `gatsby` module mock — follow the official Gatsby unit-testing guide). Propose this setup explicitly before writing tests; don't silently introduce a framework.
- **Manual verification:** validate changes with `npm run develop` (dev server) or `npm run build && npm run serve` (production build) and visual inspection.

### Code Quality & Style Rules

**Naming conventions:**

- **Files:** `kebab-case` for everything — components, modules, CSS (`about-me.js`, `theme-styles.js`, `portrait-image.module.css`). NOT PascalCase filenames.
- **Components:** `PascalCase` identifiers (`AboutMe`, `PortraitImage`).
- **Constants:** `SCREAMING_SNAKE_CASE` for module-level constants (`JOB_TITLE`, `JOBTITLES`, `DARK`, `LIGHT`).
- **CSS Module classes:** import named bindings (`import { container, hero } from './layout.module.css'`) and interpolate into `className`.

**Formatting:** Prettier 2.8.7 only. No ESLint config exists — do not add lint directives (`// eslint-disable`) or assume lint rules. Run `npm run format` to format the whole tree.

**No code comments by default.** The codebase is essentially comment-free; let the code speak. Only comment genuinely non-obvious logic.

**File/folder structure:**

- One component per file, matching the filename. Co-locate a component's CSS Module / plain CSS next to it (`timeline-time-company.js` + `timeline-time-company.module.css`).
- Animations/easing live in `src/components/animations.js`; reuse those tokens rather than redefining cubic-bezier curves.

**Tailwind class ordering:** follow existing patterns (layout → spacing → colour → state/responsive). Responsive prefixes use the custom `xs: 410px` breakpoint plus Tailwind defaults.

### Development Workflow Rules

- **Default branch:** `main`. Work happens directly on `main` for this solo project; branch only when explicitly asked. Don't open PRs unless requested.
- **Commit messages:** loosely Conventional-Commits-flavoured (`feat: ...`) but inconsistent historically. When committing, prefer a `type: Subject` prefix (`feat:`, `fix:`, `chore:`) with a capitalised, imperative subject.
- **Pre-commit hook:** Husky runs `pretty-quick --staged` — staged files are auto-formatted on commit. Don't fight it; if a commit reformats files, that's expected.
- **Commit/push only when asked.** Don't commit automatically after edits.
- **Local dev:** `npm run develop` (hot-reload dev server). `npm run clean` clears Gatsby's `.cache`/`public` when the build behaves oddly (stale GraphQL/cache is a common Gatsby gotcha).
- **Production build:** `npm run build` → output in `public/`. Preview with `npm run serve`.
- **Site:** deploys as a static bundle to `https://zackerthehacker.com` (Google Analytics gtag `G-F98QXJC4S0` is wired via `gatsby-plugin-google-gtag`).

### Critical Don't-Miss Rules (Gotchas)

- **PurgeCSS will delete dynamically-built class names.** `gatsby-plugin-purgecss` (with `tailwind: true`) strips unused classes in production. NEVER construct Tailwind class names by string concatenation/interpolation (e.g. `` `text-${color}` ``) — the class won't exist at scan time and gets purged. Always write complete, static class strings.
- **Tailwind only scans `./src/**/*.js`** (`tailwind.config.js` `content`). Classes used in non-`.js` files won't be detected. Keep className usage in `.js` files.
- **Themed colours only.** Never use raw hex or Tailwind default palette colours for UI — use the `--color-*`-backed tokens (`text-secondary`, `bg-primary-400`, …). See theming rules above.
- **`setCurrentScrollPos(Math.random())` in `layout.js` is intentional** — it forces the custom scrollbar to reset to top on route change by always producing a new value. Do not "fix" or remove it as dead/random code.
- **Email is intentionally entity-obfuscated** (`zacharybraddy&#0064;gmail.com`) to deter scrapers. Preserve the HTML-entity form; don't "clean it up" to a plain `@`.
- **Theme toggle state is component-local** (`useState` in `theme.js`) and does NOT persist across reloads. That's current behaviour — only add persistence if explicitly asked.
- **Gatsby SSR safety:** code touching `window`/`document` must run inside `useEffect` or guard for the build (SSR) environment, or `gatsby build` will fail (it has no DOM).
- **Don't introduce new top-level dependencies casually** — this is a deliberately small, static CV site. Prefer existing libraries (FontAwesome, styled-components, Tailwind) over adding new ones.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code in this project.
- Follow ALL rules exactly as documented; when in doubt, prefer the more restrictive option.
- Flag (don't silently break) any rule that conflicts with a requested change.

**For Humans:**

- Keep this file lean and focused on what agents would otherwise get wrong.
- Update it when the technology stack, theming system, or atomic structure changes.
- Remove rules that become obvious or obsolete over time.

Last Updated: 2026-06-10
