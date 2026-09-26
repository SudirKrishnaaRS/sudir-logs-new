<div align="center">

# Sudir Logs

**Structured, 0-to-hero learning notes, one tech stack at a time.**

Lessons, cheatsheets, quizzes and interview prep for a track like Express + PostgreSQL, built to recap before an interview or refresh a stack you have not touched in months.

[![Deploy](https://github.com/SudirKrishnaaRS/sudir-logs-new/actions/workflows/deploy.yml/badge.svg)](https://github.com/SudirKrishnaaRS/sudir-logs-new/actions/workflows/deploy.yml)
[![Site](https://img.shields.io/website?url=https%3A%2F%2Fsudirkrishnaars.github.io%2Fsudir-logs-new%2F&label=site)](https://sudirkrishnaars.github.io/sudir-logs-new/)
![Visitors](https://visitor-badge.laobi.icu/badge?page_id=SudirKrishnaaRS.sudir-logs-new)
[![Docusaurus](https://img.shields.io/badge/docusaurus-3.10-1a1a1a?logo=docusaurus&logoColor=25c2a0)](https://docusaurus.io/)
[![Node](https://img.shields.io/badge/node-%3E%3D20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
![License](https://img.shields.io/badge/license-unlicensed-lightgrey)

[**Read the site →**](https://sudirkrishnaars.github.io/sudir-logs-new/)

</div>

---

## What this is

Sudir Logs is a personal learning site, not a course platform for other people. Every lesson is written to teach one owner: it leans on what they already know (React), stays short (about 15 minutes), and ends with retrieval practice instead of a wall of prose. The content is built with a `/teach` workflow for a coding agent (see [AGENTS.md](AGENTS.md)), so lessons stay structured and consistent as new tracks are added.

## Features

- **Track-based curriculum** - one learning path per stack, taught in order via a sidebar, not a flat list of articles.
- **Lesson components, not prose blocks** - `Quiz`, `Callout`, `Flow`/`Step`, `Terms`, `CheatGrid`, `UrlAnatomy`, `LoopDiagram`, `FileTree`, `Checklist` and more, shared across every lesson (`src/components/lesson/`).
- **Retrieval practice built in** - every lesson closes with a quick check, an interview-angle Q&A and key terms, so reading is not the same as knowing.
- **Cheatsheets** - a compact, quiz-free quick-reference page per lesson for pre-interview recall.
- **Progress tracking** - mark-complete state, per-track progress bars and "continue where you left off," all client-side.
- **Focus mode** - a distraction-free reading mode (`F` / `Esc`) with adjustable text size and a Pomodoro-style reading timer.
- **Full-text search** - local search index built at compile time, no external service.
- **Light and dark mode** - every surface themed through CSS custom properties, no hard-coded colors.
- **Mermaid diagrams** - branching flows render straight from fenced ` ```mermaid ` blocks in MDX.

## Learning paths

| Track | Status | Focus |
|---|---|---|
| [Express + PostgreSQL](https://sudirkrishnaars.github.io/sudir-logs-new/express) | In progress | Node backends, routing, middleware, raw SQL, Prisma, auth, validation |
| [Next.js](https://sudirkrishnaars.github.io/sudir-logs-new/nextjs) | Just started | Rendering models, server vs. client, the App Router |

## Run locally

```bash
git clone https://github.com/SudirKrishnaaRS/sudir-logs-new.git
cd sudir-logs-new
npm install
npm start
```

The dev server runs at `http://localhost:3000/sudir-logs-new/` with hot reload.

```bash
npm run build                 # production build + search index + broken-link check
npm run serve                 # serve the production build locally
node scripts/check-mdx.mjs    # lint every lesson: compiles, known components, links, no em/en dashes
npx tsc --noEmit               # type-check components
```

Requires Node 20+ (CI runs on 22).

## Project structure

```
AGENTS.md                      Instructions for coding agents: lesson format, house rules, the /teach workflow
CLAUDE.md                      One line, @AGENTS.md, so every Claude Code version loads it
learn/<track>/                 Private teaching state: MISSION, NOTES, learning-records (not published)
docs/<track>/index.mdx         Track overview: mission, path table, whole-track study aids
docs/<track>/lessons/*.mdx     One lesson per file, each closing with a quiz, interview Q&A and key terms
docs/<track>/cheatsheets/*.mdx Compact quick-reference page per lesson
docs/<track>/resources.mdx     Cited sources: knowledge, video, wisdom
src/components/lesson/         The lesson component library (LessonHeader, Quiz, Callout, Flow/Step, ...)
src/theme/MDXComponents.tsx    Makes every lesson component global in MDX, no imports needed
src/components/FocusMode/      Focus mode store and controller
src/components/NavbarTools/    Navbar "Learning Paths" menu, Pomodoro chip and reading-options menu
src/components/Progress/       Mark complete, progress bars, "continue where you left off"
src/css/custom.css             Theme tokens for light and dark mode, typography, focus mode rules
sidebars.ts                    One sidebar per track, in teaching order
scripts/check-mdx.mjs          Pre-build MDX lint
.claude/skills/teach/          The /teach skill (mattpocock/skills), pinned in skills-lock.json
```

## How lessons get written

New lessons are authored with a coding agent through the `/teach` workflow described in [AGENTS.md](AGENTS.md): pick a track, read its private mission and notes in `learn/<track>/`, teach the next concept from cited sources, and write it out as an MDX lesson plus cheatsheet, wired into `sidebars.ts` and the track overview. The workflow enforces retrieval practice, a primary source per lesson and a consistent house style across every track.

## Deploy

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds the site and publishes it to GitHub Pages on every push to `main`. One-time setup: in the repo's **Settings → Pages**, set the source to **GitHub Actions**.

Live site: **https://sudirkrishnaars.github.io/sudir-logs-new/**

## Status

This is a personal learning log, built and maintained for one learner rather than as a community project, so it is not open for external contributions or issues. Feel free to fork it as a template for your own learning notes.
