---
name: cv-refresh
description: Bring the CV website into line with a new version of Zac's CV PDF. Publishes the PDF as the Download CV file, then updates the experience timeline, rotating job titles and About Me content to match. Use when Zac says he has a new or updated CV, asks to "refresh/update the site from my CV", "add my new role/contract to the site", or runs /cv-refresh.
---

# CV refresh

The CV PDF is the source of truth for facts: roles, titles, dates and positioning. The site is its web home and must agree with it on those facts, but it uses its own voice and curated detail. Your job is to work out what changed in the CV, propose matching site edits, get Zac's sign-off, apply the edits and verify the build.

Before editing code, read `_bmad-output/project-context.md`. CLAUDE.md requires it.

## 1. Find the new CV and a baseline

**New CV.** Look in this order:

1. A path Zac gave you.
2. The newest `*.pdf` by mtime (`ls -t`) in the `scratch/` folder of the checkout you're running in: `"$(git rev-parse --show-toplevel)/scratch"`. In an Orca worktree that's the worktree's own `scratch/`, not the main checkout's. It's gitignored, so each checkout has its own, and it may contain stale copies of older CVs.
3. A working-tree change to `public/pdfs/zac-braddy.pdf` (check `git status`). If there is one, that file is the new CV.

**Baseline** (the last published CV): `git show origin/main:public/pdfs/zac-braddy.pdf`. Run `git fetch` first if `origin/main` might be stale.

Compare hashes (`cmp`) between the candidate and the baseline. If they're identical, the candidate is a stale copy: tell Zac and ask which file he means. Confirm the chosen file with Zac in one line before you go on.

Also look in `scratch/` for a site-voice draft Zac wrote himself, e.g. `*-entry-content.md`. If he wrote one, step 4 uses it.

## 2. Diff the old CV against the new one

Diff the CV against the CV, not the CV against the site's prose. Use the session scratchpad directory if one is listed, otherwise `mktemp -d`.

```bash
git show origin/main:public/pdfs/zac-braddy.pdf > "$D/old.pdf"
pdftotext "$D/old.pdf" "$D/old.txt"
pdftotext "<new.pdf>" "$D/new.txt"
diff -w "$D/old.txt" "$D/new.txt"
```

Don't use `-layout` for the diff, because it splits bullets across lines. `pdftotext -layout` is fine for reading the header block.

**The diff drives the edits.** Read `new.txt` in full for context. If you notice the site disagreeing with the CV on things the diff didn't touch, list them under "noticed drift" in your proposal. Don't fix them unasked.

## 3. Map the delta to site surfaces

| CV content                                           | Site location                                                                   | Notes                                                                                                                                                                                              |
| ---------------------------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The PDF itself                                       | `public/pdfs/zac-braddy.pdf`                                                    | Overwrite it and keep this exact filename. The Download CV link points here.                                                                                                                       |
| Roles: company, title, dates                         | `src/components/organisms/experience.tsx`                                       | One `<TimelineItem>` per role.                                                                                                                                                                     |
| A role's "Key Technologies"                          | `skills={[...]}` on that `TimelineItem`                                         | See the skills rule below.                                                                                                                                                                         |
| Header title / positioning                           | `src/config/index.ts` `JOB_TITLE`, `JOB_TITLES`                                 | `JOB_TITLE` must match the CV header and stay the first element of `JOB_TITLES`. It also renders in the sidebar and the loading splash. Keep the personality entries (`Mutant Code Monkey`, etc.). |
| Summary paragraph (years of experience, positioning) | Lead `<p>` in `src/components/organisms/about-me.tsx`                           | The years ("13 years… the last 8") live in this prose, not in a stat.                                                                                                                              |
| Headline achievements naming roles                   | `<Highlight>` bullets in `about-me.tsx`                                         | Check them when a cited role (Flocast, Odondo…) changes.                                                                                                                                           |
| Residence, phone, email                              | `StatRow`s in `about-me.tsx`                                                    | The phone format differs from the CV on purpose, so it isn't drift. Keep the email entity-obfuscated (`&#0064;`).                                                                                  |
| Links in the CV header (GitHub, LinkedIn)            | `src/components/molecules/socials.tsx`                                          | Check only.                                                                                                                                                                                        |
| Broad positioning shift                              | `src/app/layout.tsx` meta description, `src/components/organisms/what-i-do.tsx` | Check only. Propose a change only if the CV's positioning clearly changed.                                                                                                                         |

**Site-only content.** These aren't on the CV, so never infer a removal from their absence:

- `certifications.tsx` (education and certifications)
- the `SkillsList` in `src/app/(site)/resume/page.tsx`
- the Age, Nationality and Citizenship stats

**Ask Zac on every run whether Age needs bumping.** It goes stale over time, independently of the CV.

### Timeline rules

- **Order.** Entries are ordered by end date descending, with `Present` first. Insert new entries in that position and don't reorder existing ones.
- **New role.** Copy the shape of its neighbours: `<p>` paragraphs as children, then `skills`.
- **Previous "Present" role now has an end date.** Update its `endDate`.
- **Title or dates changed on an existing role.** Change only those props.
- **Role dropped from the CV.** Propose removing it. Don't do it silently.
- **Dates.** Convert the CV's `MM/YYYY` to `Mon YYYY` (`07/2026` becomes `Jul 2026`). A current role takes `endDate="Present"` explicitly; omitting `endDate` shows the start date only. Year-only dates (`2007`) are allowed.
- **Company names.** For existing roles, keep the site's spelling ("Odondo Ltd", "Softwire" even if the CV says "Softwire Ltd"). For a new role, use the CV name without a `Ltd` suffix unless it's needed.
- **Title suffixes.** These are free-form and set per role: a stack suffix like `(Python-React)`, `(Contract)`, or none. Keep each existing role's suffix. For a new role, follow the newest neighbour's pattern (currently `(Contract)` for contracts) and confirm with Zac.

### Skills rule

`skills` is a list Zac curates, seeded from the CV's Key Technologies line. It can include tooling the CV omits (e.g. ESLint, Jest, Vite) and leave out minor items. For a **new** role:

1. Seed the list from the CV line, splitting compound phrases ("Node/Typescript with NestJS backend" becomes `Node JS`, `Typescript`, `NestJS`).
2. Reuse the spellings already on the site: `Typescript`, `Node JS`, `Azure Devops`, `Fast API`, `Github Actions`.
3. Sort alphabetically.
4. Ask Zac if he wants anything added.

Don't touch the skills of roles the diff didn't change.

## 4. Prose for new roles

**If Zac supplied a draft, use it.** Only fix spelling and grammar and wrap it into `<p>`s. Don't rewrite his wording.

**Otherwise, draft it yourself.** Work from the CV bullets but write in the **site voice**, not the CV's formal bullet voice. Read two or three existing entries first and match their tone:

- first person
- a bit of personality, with the occasional `!`
- focused on outcomes
- two or three short paragraphs

Copy rules (this is Zac's voice):

- Use British spelling (modernise, optimise, behaviour).
- **Never use em-dashes or en-dashes.** Restructure the sentence instead. If an existing paragraph in a file you're touching has one, flag it to Zac rather than fixing it unasked.
- In JSX text, escape a straight `'` as `&apos;` (lint rule `react/no-unescaped-entities`). Leave a curly `’` as it is.
- Don't invent facts or metrics that aren't on the CV.

## 5. Propose, then stop

Show Zac all of the following before editing anything:

- which CV file you used and the baseline you compared against, with a one-paragraph summary of the delta
- the edits for each file, with exact prop values and the full prose of any new entry
- open questions: Age, the title suffix for a new role, skills additions, any proposed removals, ambiguous dates
- "noticed drift", if there is any

**HALT and wait for approval or tweaks.** Copy in Zac's voice always needs his sign-off.

## 6. Apply

- Copy the new PDF over `public/pdfs/zac-braddy.pdf`.
- Make only the approved edits.
- Don't redesign the timeline, move experience data into config, rewrite prose on unchanged entries, or add dependencies.

## 7. Verify

There is no test suite, so never claim that tests passed.

```bash
[ -d node_modules ] || npm ci            # fresh Orca worktrees have no node_modules
npm run lint
npx prettier --check <touched files>
npm run build                            # must succeed; no route marked ƒ (Dynamic). ○ and ● are both fine
grep -c "<new company or changed text>" out/resume.html   # out/about-me.html for About Me changes
cmp "<new.pdf>" out/pdfs/zac-braddy.pdf
```

Offer to run `npm run dev` so Zac can check `/resume` and `/about-me` himself.

## 8. Hand off

Report the files you changed and the verification results. **Don't commit unless Zac asks.** If he does, use a message like `chore: Updating cv and resume to <short delta>`, for example `… to include Acme contract entry`.
