# Recipe Streak: build-along project spec

The single source of truth for the project the Next.js track builds, so every lesson extends the same code. Update this file whenever a lesson changes the project.

## Setup assumptions (Part 1)

- Created with `npx create-next-app@latest recipe-streak --yes` (Next.js 16.3 defaults: TypeScript, Tailwind CSS, ESLint, App Router, Turbopack, import alias `@/*`, `AGENTS.md`). No `src/` folder: `app/` sits at the project root.
- **Cache Components is off** in Part 1 (`cacheComponents` is opt-in and not in the default template). Part 1 uses the default rendering model. Cache Components and `"use cache"` arrive in Lesson 14.
- Node.js 20.9 or later.
- Part 1 has no database: data lives in `lib/recipes.ts`. Lesson 11 swaps it for Postgres + Prisma.

## Folder layout (end of Part 1)

```
recipe-streak/
  app/
    layout.tsx              root layout: <html>, <body>, <Nav />, fonts (08), metadata (08), <Providers> (06)
    page.tsx                home: hero, today's greeting, link to recipes
    globals.css             Tailwind import
    providers.tsx           "use client": QueryClientProvider (06)
    error.tsx               "use client": root error boundary (07)
    not-found.tsx           site-wide 404 (07)
    about/page.tsx          static about page (02)
    recipes/
      page.tsx              recipe list, reads searchParams (?tag=, ?q=) (02, 03, 05, 06)
      loading.tsx           skeleton list (05)
      [slug]/
        page.tsx            recipe detail, generateStaticParams (03), generateMetadata (08)
        not-found.tsx       "recipe not found" (07)
  components/
    Nav.tsx                 server: site nav using NavLink (02, 06)
    NavLink.tsx             "use client": usePathname active link (06)
    RecipeCard.tsx          server: card with next/image (02, 08)
    FavouriteButton.tsx     "use client": useState heart toggle (04)
    SearchBox.tsx           "use client": useRouter + useSearchParams, updates ?q= (06)
    SurpriseMe.tsx          "use client": React Query, fetches a random meal (06)
    CookingTimer.tsx        "use client": loaded with next/dynamic (08)
  lib/
    recipes.ts              data + getRecipes / getRecipe
  public/
    recipes/*.jpg           one photo per recipe (any food photos work)
  next.config.ts            images.remotePatterns for www.themealdb.com (08)
```

## Data (`lib/recipes.ts`)

```ts
export type Recipe = {
  slug: string;
  title: string;
  minutes: number;
  tags: string[];          // from: 'veg', 'quick', 'breakfast', 'dinner'
  image: string;           // '/recipes/<slug>.jpg'
  ingredients: string[];
  steps: string[];
};

export const recipes: Recipe[] = [
  { slug: 'masala-omelette', title: 'Masala Omelette', minutes: 10, tags: ['veg', 'quick', 'breakfast'], ... },
  { slug: 'lemon-garlic-pasta', title: 'Lemon Garlic Pasta', minutes: 20, tags: ['veg', 'dinner'], ... },
  { slug: 'veg-fried-rice', title: 'Veg Fried Rice', minutes: 25, tags: ['veg', 'dinner'], ... },
  { slug: 'banana-pancakes', title: 'Banana Pancakes', minutes: 15, tags: ['veg', 'quick', 'breakfast'], ... },
];

// Lessons 02-04: plain synchronous helpers
export function getRecipes(tag?: string) { ... }
export function getRecipe(slug: string) { ... }   // returns Recipe | undefined

// Lesson 05 makes both async with a fake 1s delay, to show loading.tsx and streaming:
// export async function getRecipes(tag?: string) { await new Promise((r) => setTimeout(r, 1000)); ... }
```

## Lesson-by-lesson deliverables (Part 1)

| Lesson | What the learner adds | Visible win |
|---|---|---|
| 00a, 00b | No code (concepts; 00b has a small "view source" experiment on any site) | - |
| 01 | Create the app, run `npm run dev`, edit `app/page.tsx` to a Recipe Streak hero | Their own page on localhost:3000 |
| 02 | `app/about/page.tsx`, `app/recipes/page.tsx`, `components/Nav.tsx` in `app/layout.tsx` with `<Link>`, `lib/recipes.ts`, `components/RecipeCard.tsx` (plain `<img>` for now) | Three pages and a nav that doesn't reload the page |
| 03 | `app/recipes/[slug]/page.tsx` (async `params`), tag filter via `searchParams` (`/recipes?tag=veg`), `generateStaticParams` | A page per recipe, tag filter links, pages pre-built at build time |
| 04 | `components/FavouriteButton.tsx` (`"use client"`, `useState`) on the detail page; a deliberate hydration error (rendering `new Date().toLocaleTimeString()` in a greeting) and its fix | A working heart button; the learner has seen and fixed a hydration error |
| 05 | Make `getRecipes`/`getRecipe` async with a delay; `app/recipes/loading.tsx` skeleton; a `<Suspense>` around a slow "chef's tip" section on the detail page | Skeletons while data loads; the page shell appears first |
| 06 | `components/NavLink.tsx` (`usePathname`), `components/SearchBox.tsx` (`useRouter`, `useSearchParams`, writes `?q=`), `app/providers.tsx` with TanStack Query, `components/SurpriseMe.tsx` fetching `https://www.themealdb.com/api/json/v1/1/random.php` (free test key `1`, CORS open) | Active nav link, live search in the URL, a "Surprise me" random recipe |
| 07 | `notFound()` in the detail page when `getRecipe` returns undefined, `app/recipes/[slug]/not-found.tsx`, `app/error.tsx` with a retry button, `redirect()` for an old URL (for example `/recipe/:slug` to `/recipes/:slug`) | A friendly 404 and error screen |
| 08 | Tailwind styling pass, swap `<img>` for `next/image`, `next/font` in the root layout, static `metadata` + `generateMetadata` for recipe pages, `next.config.ts` `images.remotePatterns` for TheMealDB, `CookingTimer` loaded with `next/dynamic` | A polished app with photos, fonts and link previews |
| 09 | Capstone: finish and review, no new concepts | A complete read-only recipe browser |

## Conventions for code in lessons

- TypeScript, function components, `export default function Page()` for route files.
- Import with the `@/` alias: `import { getRecipes } from '@/lib/recipes'`.
- Next.js 16 APIs: `params` and `searchParams` are Promises (`const { slug } = await params`). Verify every API against the current docs page before writing.
- Use `RunsOn` before code blocks: server for Server Components, route files and `lib/`; client for `"use client"` files; both for Client Components that are also prerendered (explain once in Lesson 04); build for `generateStaticParams`.
