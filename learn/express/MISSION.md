# Mission: Express.js Backend Development

## Why
The learner has a strong React background and is learning backend development for full-stack work, including being ready for full-stack technical interviews. They need to go from zero backend experience to confidently reading, writing, and debugging a production-grade Express + PostgreSQL API within 2 weeks.

## Success looks like
- Can explain the request/response lifecycle and where Express fits, without hand-waving
- Can build a REST API from scratch: routing, middleware, params/query/body, centralized error handling
- Can structure an Express project the way production codebases are structured (routes/controllers/models separation)
- Can connect Express to a real PostgreSQL database and perform CRUD with parameterized queries
- Can implement authentication: password hashing (bcrypt) + JWT issuing and verification via middleware
- Can validate incoming requests and correctly configure CORS so a React frontend can call the API
- Can look at an unfamiliar Express codebase and identify what each piece does within the first read

## Constraints
- **Time budget:** ~1 hour/day, for 2 weeks (roughly 12-14 short lessons, light pace, must not overwhelm)
- **Database:** PostgreSQL (not MongoDB) - examples, schemas, and queries should be Postgres-flavored throughout
- **Prior knowledge:** Strong in JavaScript/React (functional components, hooks, fetch/axios calls, JSX, routing, state) - teaching should lean on these as analogies wherever possible, not re-teach JS basics
- **Lesson format:** MDX pages on the Sudir Logs site (`docs/express/lessons/`), one concept per lesson, cheatsheet-style, low text density, quizzes/flowcharts built in, each with a matching cheatsheet in `docs/express/cheatsheets/`.
- Learner explicitly wants: pictographic/visual explanations, flowcharts, React-relatable examples, interactive quizzes, low overwhelm, strong "want to do the next lesson" pull.

## Out of scope (for now)
- MongoDB / Mongoose
- Full automated test suites (unit/integration testing frameworks) - may be touched briefly as a "what's next" pointer, not a core lesson
- Docker / CI-CD / cloud deployment pipelines - may get a light "what's next" mention in the capstone lesson only
