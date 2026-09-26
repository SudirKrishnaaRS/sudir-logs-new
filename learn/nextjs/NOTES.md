# Notes

## User preferences (from onboarding, 2026-09-26)
- Background: several years of React frontend. Finished the Express + PostgreSQL track on this site, so Express analogies are fair game (Route Handlers = Express routes, Proxy = Express middleware, `req.user` pattern, Prisma from Express Lesson 10).
- Goals (both chosen): **job / interviews** and **an existing codebase at work**. Weight "Interview angle" and "how to recognise this in a real codebase" in every lesson.
- Pace: **~1 hour/day, ~2.5 weeks**. One lesson per day.
- Router: **App Router throughout, plus one Pages Router recognition primer** (older company codebases).
- Build-along project: picked **"Recipe / habit app"**. Interpreted as **Recipe Streak**: a recipe box (browse, detail pages, photos, add your own) with a "cooked it today" daily streak. Recipes give natural dynamic routes, images and metadata; the streak gives mutations and auth. If the learner wants a pure habit tracker instead, swap the theme, not the lesson order.
- Wants: very visual, beginner friendly, no walls of text, "come back tomorrow" pull. Wants fundamentals taught before the feature that depends on them (their example: SSR before `"use server"`). Wants API routes covered.
- Same rules as the Express track: quiz options equal word count, every lesson gets a cheatsheet (capstones excepted), no em or en dashes.

## Lesson format additions for this track (on top of AGENTS.md)
- **Warm-up (2 min):** open each lesson (after the header and cheatsheet note) with 2 quick recall questions from earlier lessons. Spaced retrieval; keeps storage strength, not just fluency. Lessons 00a, 00b and 01 skip it.
- **Today's win:** a `<Callout type="key">` near the top saying what will work in Recipe Streak by the end.
- **Server / Browser badges:** every code block should make clear where it runs. Build a reusable `RunsOn` component (server / client / both) in `src/components/lesson/` when Lesson 00b is written, and add it to `KNOWN` in `scripts/check-mdx.mjs`.
- **Spot it in the wild:** a short section showing what this looks like in a real production codebase (file names, patterns to recognise). Serves the "codebase at work" goal.
- Version: Next.js 16.3 is current (checked 2026-09-26). Middleware is now `proxy.ts`. Always check the docs page before writing a lesson; do not trust memory for APIs that changed in 15 and 16 (async `params`, caching defaults, `"use cache"`).

## Syllabus (roadmap)
Also rendered on `docs/nextjs/index.mdx`. Adjust from learning records; not fixed.

**Prerequisites (fundamentals)**
- 00a Who builds the HTML? CSR vs SSR vs SSG vs ISR ("the kitchen": cook at the table, cook to order, meal prep, meal prep with a refresh timer).
- 00b Server vs browser: where code runs, bundles, hydration. Required before Lesson 04 and Lesson 10.

**Part 1 - Read any Next.js app (the daily 80%)**
1. Why Next.js, `create-next-app`, project tour (`app/`, `public/`, `next.config.ts`, special files).
2. File-based routing: `page.tsx`, `layout.tsx`, nested routes, `<Link>`. vs React Router.
3. Dynamic routes `[slug]`, `params` / `searchParams` (async in 16), route groups `(group)`.
4. Server vs Client Components, `"use client"`, the boundary, passing props across it. The big aha.
5. Data fetching in async Server Components, `loading.tsx`, Suspense streaming.
6. Error handling: `error.tsx`, `not-found.tsx`, `notFound()`, `redirect()`.
7. Styling and built-ins: Tailwind / CSS Modules, `next/image`, `next/font`, metadata.
8. Capstone 1: read-only Recipe Streak + a guided tour of a real open-source Next.js codebase. No new concepts.

**Part 2 - Full-stack Next.js**
9. Route Handlers (API routes): `route.ts`, HTTP methods, `Request`/`Response`, vs Express. When to use vs Server Actions.
10. Database: Postgres + Prisma, env vars, a server-only data layer.
11. Server Actions and `"use server"`: forms that mutate data, `revalidatePath`, `redirect`.
12. Forms UX: `useActionState`, `useFormStatus`, Zod validation, optimistic UI.
13. Caching and revalidation: static vs dynamic, `"use cache"`, tags, "why is my page stale?".

**Part 3 - Ship it**
14. Auth: cookies and sessions, Proxy for optimistic checks, checks in the data layer. Library choice to be confirmed when writing (check the Next.js authentication guide first).
15. Build and deploy: `next build` output, env vars in production, Vercel.
16. Pages Router primer: `pages/`, `getServerSideProps`, `getStaticProps`, `pages/api`, `_app.tsx`, mapped to App Router.
17. Capstone 2: full Recipe Streak (Postgres, auth, streak, deployed) + interview walkthrough. No new concepts.

## Session log
- 2026-09-26: Onboarding. Mission interview via questions (goals, pace, router scope, project). Scaffolded the track: `learn/nextjs/MISSION.md`, this file, `docs/nextjs/index.mdx` (plan), `docs/nextjs/resources.mdx`, sidebar key, `TRACKS` entry. No lessons written yet. Next: Lesson 00a.
