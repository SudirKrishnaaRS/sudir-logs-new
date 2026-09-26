/*
 * The learning paths shown on the home page and used for progress labels.
 * Add an entry here when a new track starts (see AGENTS.md "Starting a new track").
 */

export type Track = {
  id: string; // folder under docs/, e.g. "express"
  title: string;
  blurb: string;
  to?: string; // overview route; omit while the track is only planned
};

export const TRACKS: Track[] = [
  {
    id: 'express',
    title: 'Express + PostgreSQL',
    blurb: 'Routing, middleware, Postgres, auth, validation. React dev to backend dev in 14 short lessons.',
    to: '/express',
  },
  {
    id: 'nextjs',
    title: 'Next.js',
    blurb: 'Routing, Server vs Client Components, API routes, Server Actions, caching, auth. React dev to Next.js dev, one visual lesson a day.',
    to: '/nextjs',
  },
];

export const trackTitle = (id: string) => TRACKS.find((t) => t.id === id)?.title ?? id;
