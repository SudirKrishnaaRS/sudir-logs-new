import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Sudir Logs',
  tagline: 'Structured 0 to hero notes, one tech stack at a time',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  // GitHub Pages: https://sudirkrishnaars.github.io/sudir-logs-new/
  url: 'https://sudirkrishnaars.github.io',
  baseUrl: '/sudir-logs-new/',
  organizationName: 'SudirKrishnaaRS',
  projectName: 'sudir-logs-new',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  stylesheets: [
    // DM Sans for text, Geist Mono for code and labels, Caveat for the handwritten wordmark
    'https://fonts.googleapis.com/css2?family=Caveat:wght@500..700&family=DM+Sans:opsz,wght@9..40,400..700&family=Geist+Mono:wght@400..700&display=swap',
  ],

  markdown: {
    mermaid: true,
  },
  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        docsRouteBasePath: '/',
        indexBlog: false,
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          // Learning paths live at the site root: /express, /nextjs, ...
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          showLastUpdateTime: false,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    navbar: {
      title: 'Sudir Logs',
      logo: {
        alt: 'Sudir Logs',
        src: 'img/logo.svg',
        srcDark: 'img/logo-dark.svg',
      },
      items: [
        {
          type: 'dropdown',
          label: 'Learning Paths',
          position: 'left',
          items: [
            {type: 'docSidebar', sidebarId: 'express', label: 'Express + PostgreSQL'},
          ],
        },
        {type: 'custom-focusToggle', position: 'right'},
        {
          href: 'https://github.com/SudirKrishnaaRS/sudir-logs-new',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      copyright: `Sudir Logs · personal learning notes · built with Docusaurus`,
    },
    prism: {
      // Same dark editor look in both modes, matching the original lessons.
      theme: prismThemes.vsDark,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ['bash', 'sql', 'json'],
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
