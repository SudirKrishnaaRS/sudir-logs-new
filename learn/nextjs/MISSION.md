# Mission: Next.js Development

## Why
The learner has several years of React frontend experience and has finished the Express + PostgreSQL track. They want to become a confident Next.js developer: ready to interview for a Next.js role and ready to read, change and debug an existing production Next.js codebase at work. Target: in about 3 weeks, open an unfamiliar App Router codebase and know what every file and directive is doing.

## Success looks like
- Can explain CSR, SSR, SSG and ISR, and say which one a given Next.js page is using and why
- Can explain what runs on the server and what runs in the browser, and place a `"use client"` boundary correctly
- Can build routes with the App Router file conventions: pages, layouts, dynamic segments, loading, error and not-found files
- Can fetch data in Server Components and stream slow parts with Suspense, and say when client-side fetching (React Query) is still the right call
- Can use the client-side tools every codebase has: `useRouter`, `usePathname`, `useSearchParams`, a `providers.tsx` wrapper
- Can diagnose and fix a hydration error
- Can write API endpoints with Route Handlers and say when to use one instead of a Server Action
- Can mutate data with Server Actions and `"use server"`, with validation, pending states and revalidation
- Can explain Next.js caching and revalidation well enough to debug "why is my page stale?"
- Can protect routes with Proxy and cookies-based sessions
- Can recognise Pages Router code (`getServerSideProps`, `pages/api`, `_app.tsx`) in an older codebase and map it to App Router ideas
- Can build and deploy a full-stack Next.js app with Postgres
- Can answer common Next.js interview questions on all of the above without hand-waving

## Constraints
- **Time budget:** about 1 hour a day for about 3 weeks (one short lesson plus a hands-on step each day)
- **Prior knowledge:** strong React (components, hooks, props, state, React Router, fetching) and the Express track (routes, middleware, Postgres, JWT auth, CORS). Teach through these analogies, never re-teach React basics
- **Version:** Next.js 16 (App Router, Turbopack, `proxy.ts`, Cache Components). Default stack: TypeScript, Tailwind, Postgres + Prisma
- **Format:** MDX lessons on the Sudir Logs site, very visual and beginner friendly, low text density, one concept per lesson, a matching cheatsheet each, quizzes and a warm-up recall quiz at the start
- **Stickiness:** one build-along project (Recipe Streak: a recipe box with a daily cooking streak) that gains a visible feature every lesson
- **Fundamentals first:** when a feature depends on an underlying idea (for example `"use server"` depends on understanding server rendering), teach the idea first as a prerequisite

## Out of scope (for now)
- Deep Pages Router coverage (only a recognition primer)
- Automated testing, Docker, self-hosting and CI pipelines (a "what's next" mention only)
- Advanced routing (parallel and intercepting routes get only a "recognise it" note in Capstone 1), i18n, edge runtime tuning, monorepos
