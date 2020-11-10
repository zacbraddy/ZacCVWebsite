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
        36: '9rem',
        68: '17rem',
        72: '18rem',
        80: '20rem',
        87: '23rem',
        88: '24rem',
        94: '26rem',
        102: '30rem',
        110: '34rem',
        118: '38rem',
        126: '42rem',
        134: '46rem',
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
