# AGENTS.md

## Project overview

Sudir Logs is a Docusaurus 3 site of structured, 0 to hero learning notes, organized as one **track** per tech stack (Express + PostgreSQL now, Next.js next). The owner uses it to learn a new stack, to recap before interviews, and to refresh after time away. Pages are MDX. Lessons are built from a small React component library, and the site deploys to GitHub Pages at https://sudirkrishnaars.github.io/sudir-logs-new/.

## Setup and build commands

```bash
npm install
npm start                    # dev server with hot reload: http://localhost:3000/sudir-logs-new/
npm run build                # production build + search index + broken-link check
npm run serve                # serve the production build
node scripts/check-mdx.mjs   # fast lint of every .mdx (or pass file paths)
npx tsc --noEmit             # type-check components
```

Node 20 or later (CI uses 22).

## Project structure

```
docs/<track>/index.mdx          Track overview (slug /<track>): mission, path table, whole-track study aids
docs/<track>/lessons/NN-*.mdx   One lesson per file; doc id drops the number (<track>/lessons/<slug>)
docs/<track>/cheatsheets/*.mdx  Compact quick-reference page per lesson
docs/<track>/resources.mdx      Cited sources: Knowledge / Video / Wisdom
docs/<track>/glossary.mdx       Track glossary (created when first needed)
learn/<track>/                  Private teaching state (MISSION.md, NOTES.md, learning-records/), not published
src/components/lesson/          Lesson components + lesson.module.css
src/theme/MDXComponents.tsx     Makes every lesson component global in MDX (export *)
src/components/FocusMode/       Focus mode (F / Esc): store and controller
src/components/NavbarTools/     Navbar "Learning Paths" menu, Pomodoro chip and "Reading options" menu (focus, text size, timer length)
src/components/Progress/        Mark complete, progress bars, "continue where you left off"
src/lib/                        Browser-only state (store.ts helper, progress, prefs, pomodoro) and tracks.ts
src/theme/Root.tsx              Mounts site-wide behaviour (focus mode, timer, text size)
src/theme/NavbarItem/ComponentTypes.tsx  Custom navbar item types ('custom-pomodoro', 'custom-readingOptions')
src/theme/DocItem/Footer/       Adds the completion card + visit tracking to lesson pages
src/theme/DocSidebarItem/Link/  Adds the completed check mark to sidebar links
src/theme/DocSidebarItems/      Puts the course progress card at the top of the sidebar (desktop and mobile drawer)
src/css/custom.css              Theme tokens for light and dark mode (--sl-*), typography, focus mode rules
src/pages/index.tsx             Home page; PATHS lists the tracks
sidebars.ts                     One sidebar per track, in teaching order
scripts/check-mdx.mjs           MDX lint: compiles, known components, relative links, no em/en dashes
.claude/skills/teach/           The teach skill (mattpocock/skills), pinned in skills-lock.json
```

## House rules

- **Never commit or push.** Leave changes in the working tree for the owner to review. A push to `main` deploys the site.
- **No em dashes (U+2014) or en dashes (U+2013)** anywhere: pages, notes, code comments, chat. Use a hyphen ( - ).
- **Placement rule:** study aids specific to one topic (its quiz, interview Q&A, key terms) go inside that lesson. Track-wide aids (Recap in 30 min, Interview Q&A, Quiz bank, Glossary) live on the track's overview page or are linked from it.
- **No PII in any file.** The repo is public, including `learn/`. Never write the owner's full name, email, employer, handle, location, local file paths or other identifying details into notes, lessons, learning records or code comments. Refer to them as "the owner" or "the learner". Keep background to what teaching needs (e.g. "strong in React"). The GitHub handle appears only where deployment requires it (`docusaurus.config.ts`, `Readme.md`, this file's site URL).
- **Light and dark mode must both work.** Style with the `--sl-*` tokens in `src/css/custom.css`, never hard-coded colors.
- **Docusaurus CSS lives in cascade layers** (the `future.v4` flag), so its `!important` rules beat any `!important` in `custom.css`. Override with a different property instead (for example `min-width` against a capped `max-width`), or style a neighbouring element.

## Content style

- **Model lessons on `docs/express/lessons/03-middleware.mdx`.** Frontmatter is `title` (renders as the h1, so don't repeat it as `#`), `sidebar_label` (`'NN · Short Name'`), `slug`, `description`.
- **Open a lesson with the header**, then a `<Note>` linking its cheatsheet:
  `<LessonHeader kicker="<Track> · Lesson NN of M" minutes={15} subtitle={<>...</>} />`
- **Close a lesson with these sections, in order:** `## Quick check` (2-3 `<Quiz>`), `## Interview angle` (2-3 `<details>` Q&As), `## Key terms` (`<Terms>`, 3-5 terms; skip for capstones), `## Primary source` (`<Note>`), then `<AskBox>`.
- **Keep lessons short.** One concept each, about 15 minutes, light on text, visual. Lean on analogies from what the owner already knows (React).
- **Cheatsheets have no quizzes and no narrative**, just cards, tables, diagrams and snippets. Header: `kicker="<Track> · Cheatsheet"`, then `<Note>Full lesson: [...](../lessons/NN-slug.mdx)</Note>`.
- **Components are global, so never write an `import`.** See `src/components/lesson/index.tsx` for the API:
  `Callout` (react / warn / info / key), `Flow` + `Step`, `Quiz`, `Note`, `AskBox`, `Terms` + `Term`, `CheatGrid` + `CheatCard`, `JoinVenn`, `UrlAnatomy` + `UrlLegend`, `LoopDiagram`, `FileTree` + `FileNote`, `Checklist` + `Check`, `Badge`. Use a ```` ```mermaid ```` block for branching diagrams.
- **Reuse before inventing.** A new reusable visual goes into `src/components/lesson/`. `export *` picks it up automatically. Also add its name to `KNOWN` in `scripts/check-mdx.mjs`.
- **Quizzes:** every option has the same word count, so the format doesn't give the answer away. `answer` is the 0-based index. Options shuffle at runtime.
- **Code blocks** are fenced with a language (`js`, `ts`, `tsx`, `bash`, `sql`, `json`). Add `title="file.js"` when the prose names the file.
- **Links between pages** use relative file paths with `.mdx`: `./02-routing.mdx`, `../cheatsheets/routing.mdx`, `../index.mdx`. Back claims with inline links to trusted external sources.
- **MDX gotchas:**
  - `{ } < >` in prose must be in backticks or escaped.
  - Leave a blank line inside components that wrap block content.
  - Write `<br />`, not `<br>`.

## Testing instructions

Run both before calling any content change done. The build fails on broken links.

```bash
node scripts/check-mdx.mjs
npm run build
```

After a component or CSS change, also run `npx tsc --noEmit`, then view the affected pages in light mode, dark mode and at phone width (375px) with no horizontal scroll.

## Commit and PR guidelines

Do not commit, push or open PRs; the owner does this. When a task needs a deploy to count as done, say so and stop.

## Teaching workflow (the `teach` skill)

The `teach` skill (`.claude/skills/teach/SKILL.md`, invoked as `/teach` in Claude Code) is written for a single-topic workspace that outputs standalone HTML. In this repo it runs **per track** and writes **MDX into the site**. Everything in the skill still applies:

- mission first, and the zone of proximal development
- knowledge from cited, high-trust sources
- retrieval practice
- a primary source per lesson
- a reminder to ask follow-up questions

The file locations and formats below override the skill.

### Pick the track first

Work out which track the request belongs to (`express`, `nextjs`, ...). If it is ambiguous, ask. For a new track, run the skill's mission interview, then scaffold it (see "Starting a new track"). Before teaching, read `learn/<track>/` and the track's existing lessons to choose the next lesson.

### Where the skill's files live

| Skill concept | In this repo | Published? |
|---|---|---|
| `MISSION.md` | `learn/<track>/MISSION.md` | No |
| `NOTES.md` | `learn/<track>/NOTES.md` (preferences, syllabus, dated session log) | No |
| `learning-records/` | `learn/<track>/learning-records/0001-slug.md` (created when first needed) | No |
| `RESOURCES.md` | `docs/<track>/resources.mdx` | Yes |
| `GLOSSARY.md` | `docs/<track>/glossary.mdx` (skill's glossary rules apply) | Yes |
| `lessons/*.html` | `docs/<track>/lessons/NN-slug.mdx` (`NN` continues the track's numbering) | Yes |
| `reference/*.html` | `docs/<track>/cheatsheets/slug.mdx` (one per lesson; capstones excepted) | Yes |
| `assets/*` | `src/components/lesson/` | - |

### After writing a lesson

1. `sidebars.ts`: add the lesson and its cheatsheet to the track's sidebar in teaching order.
2. `docs/<track>/index.mdx`: add a row to the path table.
3. `learn/<track>/NOTES.md`: add a dated session-log entry. Add a learning record only when the skill's criteria are met.
4. Run the testing instructions above.
5. Point the owner at `npm start` to read the lesson. This replaces the skill's "open the HTML file" step.

### Starting a new track

1. Write `learn/<track>/MISSION.md` (from the mission interview) and `learn/<track>/NOTES.md`.
2. Create `docs/<track>/index.mdx` with `slug: /<track>`, following the structure of `docs/express/index.mdx`.
3. Create `docs/<track>/resources.mdx`.
4. Register the track:
   - a sidebar key in `sidebars.ts`
   - an entry in `TRACKS` in `src/lib/tracks.ts` (navbar "Learning Paths" menu, home page card and progress labels)
   - `<TrackProgress track="<track>" />` under the overview's header
