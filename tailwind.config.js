const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: { mode: 'layers', content: ['./src/**/*.js'] },
  theme: {
    fontFamily: {
      ...defaultTheme.fontFamily,
      sans: ['Roboto', ...defaultTheme.fontFamily.sans],
    },
    screens: {
      xs: '410px',
      ...defaultTheme.screens,
    },
    extend: {
      backgroundColor: {
        primary: {
          200: 'var(--color-bg-primary-200)',
          400: 'var(--color-bg-primary-400)',
        },
        secondary: 'var(--color-bg-secondary)',
        tertiary: 'var(--color-bg-tertiary)',
      },
      textColor: {
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        tertiary: 'var(--color-text-tertiary)',
        icon: {
          primary: 'var(--color-i-primary)',
          secondary: 'var(--color-i-secondary)',
        },
      },
      borderColor: {
        secondary: 'var(--color-border-secondary)',
        inverse: 'var(--color-border-inverse)',
      },
      spacing: {
        68: '17rem',
        72: '18rem',
      },
      fontFamily: {
        'fancy-heading': [
          `'Permanent Marker'`,
          ...defaultTheme.fontFamily.sans,
        ],
      },
      gridTemplateRows: {
        7: 'repeat(7, minmax(0, 1fr))',
      },
    },
  },
};
