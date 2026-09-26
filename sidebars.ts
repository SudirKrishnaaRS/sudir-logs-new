import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// One sidebar per learning path. Add a new key here when a new track starts.
const lesson = (id: string) => `express/lessons/${id}`;
const sheet = (id: string) => `express/cheatsheets/${id}`;

const sidebars: SidebarsConfig = {
  express: [
    'express/index',
    {
      type: 'category',
      label: 'Prerequisites',
      collapsed: false,
      items: [lesson('event-loop-and-libuv'), lesson('00b-postgres-basics')],
    },
    {
      type: 'category',
      label: 'Week 1 · REST API',
      collapsed: false,
      items: [
        lesson('what-is-a-backend'),
        lesson('routing'),
        lesson('middleware'),
        lesson('project-structure'),
        lesson('request-data-crud'),
        lesson('error-handling'),
        lesson('capstone-todo-api'),
      ],
    },
    {
      type: 'category',
      label: 'Week 2 · Real backend',
      collapsed: false,
      items: [
        lesson('postgresql-connection'),
        lesson('real-crud-sql-injection'),
        lesson('orm-prisma'),
        lesson('auth-bcrypt-jwt'),
        lesson('auth-middleware'),
        lesson('validation-cors'),
        lesson('capstone-full-api'),
      ],
    },
    {
      type: 'category',
      label: 'Cheatsheets',
      collapsed: true,
      items: [
        sheet('event-loop'),
        sheet('postgres-basics'),
        sheet('request-response'),
        sheet('routing'),
        sheet('middleware'),
        sheet('project-structure'),
        sheet('crud'),
        sheet('error-handling'),
        sheet('postgresql'),
        sheet('real-crud'),
        sheet('prisma'),
        sheet('auth-tokens'),
        sheet('auth-middleware'),
        sheet('validation-cors'),
      ],
    },
    'express/resources',
  ],
  // Lessons and cheatsheets are added here as they're written (see learn/nextjs/NOTES.md for the syllabus).
  nextjs: ['nextjs/index', 'nextjs/resources'],
};

export default sidebars;
