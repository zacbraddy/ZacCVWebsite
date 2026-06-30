import { defineConfig, s } from 'velite';
import rehypeShiki from '@shikijs/rehype';
import { createCssVariablesTheme } from 'shiki';

const shikiTheme = createCssVariablesTheme({
  name: 'css-variables',
  variablePrefix: '--shiki-',
  fontStyle: true,
  variableDefaults: {
    'token-inserted': '#c3e88d',
    'token-deleted': '#f07178',
    'token-changed': '#e0b404',
    'ansi-black': '#1e1e1e',
    'ansi-red': '#f07178',
    'ansi-green': '#c3e88d',
    'ansi-yellow': '#e0b404',
    'ansi-blue': '#82aaff',
    'ansi-magenta': '#c792ea',
    'ansi-cyan': '#04b4e0',
    'ansi-white': '#e6e6e6',
    'ansi-bright-black': '#7a7f87',
    'ansi-bright-red': '#f07178',
    'ansi-bright-green': '#c3e88d',
    'ansi-bright-yellow': '#e0b404',
    'ansi-bright-blue': '#82aaff',
    'ansi-bright-magenta': '#c792ea',
    'ansi-bright-cyan': '#04b4e0',
    'ansi-bright-white': '#ffffff',
  },
});

export default defineConfig({
  root: 'docs',
  collections: {
    docs: {
      name: 'Doc',
      pattern: 'public/**/*.md',
      schema: s
        .object({
          title: s.string(),
          section: s.enum(['Overview', 'Decisions', 'Pragmatism & process']),
          order: s.number(),
          teaser: s.string(),
          adr: s.number().optional(),
          path: s.path(),
          content: s.markdown(),
        })
        .transform(data => ({ ...data, slug: data.path.replace(/^.*\//, '') })),
    },
  },
  markdown: {
    rehypePlugins: [[rehypeShiki as never, { theme: shikiTheme }]],
  },
});
