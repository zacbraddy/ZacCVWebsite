import { defineConfig, s } from 'velite';
import rehypeShiki from '@shikijs/rehype';
import { createCssVariablesTheme } from 'shiki';

const shikiTheme = createCssVariablesTheme({
  name: 'css-variables',
  variablePrefix: '--shiki-',
  fontStyle: true,
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
