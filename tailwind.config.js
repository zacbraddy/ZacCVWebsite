module.exports = {
  purge: { mode: 'layers', content: ['./src/**/*.js'] },
  theme: {
    extend: {
      backgroundColor: {
        primary: 'var(--color-bg-primary)',
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
