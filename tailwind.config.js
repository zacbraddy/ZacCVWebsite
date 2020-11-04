const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: { mode: 'layers', content: ['./src/**/*.js'] },
  theme: {
    screens: {
      ...defaultTheme.screens,
      md: '769px',
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
      },
      iconColor: {
        secondary: 'var(--color-i-secondary)',
      },
    },
  },
};
