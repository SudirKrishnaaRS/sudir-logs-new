# Sudir Logs

Personal learning site: structured, 0 to hero notes for each tech stack (Express + PostgreSQL first, Next.js next), with lessons, cheatsheets, quizzes and interview prep. Built with [Docusaurus](https://docusaurus.io/).

Live (after first deploy): https://sudirkrishnaars.github.io/sudir-logs-new/

## Run locally

```bash
npm install
npm start          # dev server with hot reload
npm run build      # production build (also builds the search index)
npm run serve      # serve the production build
```

## Layout

```
docs/<track>/index.mdx        Learning path landing page (mission, path, whole-track study aids)
docs/<track>/lessons/*.mdx    One lesson per file
src/components/lesson/        Lesson building blocks: LessonHeader, Callout, Flow/Step, Quiz, Note, AskBox, Terms/Term
src/theme/MDXComponents.tsx   Makes those components available in every .mdx without imports
src/css/custom.css            Theme tokens (light + dark), palette based on aihero.dev
sidebars.ts                   One sidebar per learning path
.claude/skills/teach/         The /teach skill (mattpocock/skills), pinned in skills-lock.json
```

## Deploy

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`. One-time setup: in the repo's **Settings → Pages**, set the source to **GitHub Actions**.
