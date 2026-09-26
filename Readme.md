# Sudir Logs

Personal learning site: structured, 0 to hero notes for each tech stack (Express + PostgreSQL first, Next.js next), with lessons, cheatsheets, quizzes and interview prep. Built with [Docusaurus](https://docusaurus.io/).

Live (after first deploy): https://sudirkrishnaars.github.io/sudir-logs-new/

## Run locally

```bash
npm install
npm start          # dev server with hot reload
npm run build      # production build (also builds the search index)
npm run serve      # serve the production build
node scripts/check-mdx.mjs   # fast MDX check: compile, known components, links, no em dashes
```

## Layout

```
AGENTS.md                     Instructions for coding agents (lesson format, /teach workflow, house rules)
CLAUDE.md                     One line, @AGENTS.md, so every Claude Code version loads it
learn/<track>/                Private teaching state for /teach: MISSION, NOTES, learning-records
docs/<track>/index.mdx        Learning path landing page (mission, path, whole-track study aids)
docs/<track>/lessons/*.mdx    One lesson per file (quiz, interview angle, key terms inside)
docs/<track>/cheatsheets/     Compact quick-reference page per lesson
docs/<track>/resources.mdx    Trusted docs, videos and communities for the track
src/components/lesson/        Lesson building blocks: LessonHeader, Callout, Flow/Step, Quiz, Note, AskBox,
                              Terms/Term, CheatGrid/CheatCard, JoinVenn, UrlAnatomy, LoopDiagram,
                              FileTree, Checklist/Check, Badge
src/theme/MDXComponents.tsx   Makes those components available in every .mdx without imports
src/css/custom.css            Theme tokens (light + dark), palette based on aihero.dev
sidebars.ts                   One sidebar per learning path
scripts/check-mdx.mjs         Pre-build lint for lesson MDX
.claude/skills/teach/         The /teach skill (mattpocock/skills), pinned in skills-lock.json
```

## Deploy

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`. One-time setup: in the repo's **Settings → Pages**, set the source to **GitHub Actions**.
