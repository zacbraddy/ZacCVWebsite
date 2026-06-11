import { createGlobalStyle } from 'styled-components';

export const DARK = 'dark';
export const LIGHT = 'light';

export const darkThemeValues = {
  backgroundColor: {
    primary: {
      200: '#555',
      400: '#333',
    },
    secondary: '#04b4e0',
    tertiary: '#e0b404',
    inverse: '#fafafa',
  },
  borderColor: {
    inverse: 'fafafa',
    secondary: '#04b4e0',
  },
  iconColor: {
    primary: '#fafafa',
    secondary: '#04b4e0',
  },
  textColor: {
    primary: '#fafafa',
    secondary: '#04b4e0',
    tertiary: '#e0b404',
  },
};

export const lightThemeValues = {
  backgroundColor: {
    primary: {
      200: '#ddd',
      400: '#eee',
    },
    secondary: '#3058b5',
    tertiary: '#e6593d',
    inverse: '#333',
  },
  iconColor: {
    primary: '#fafafa',
    secondary: '#3058b5',
  },
  borderColor: {
    inverse: '5a5a5a',
    secondary: '#3058b5',
  },
  textColor: {
    primary: '#333',
    secondary: '#49629c',
    tertiary: '#cc715f',
  },
};

const populateVars = theme => `
  --color-bg-primary-200: ${theme.backgroundColor.primary['200']};
  --color-bg-primary-400: ${theme.backgroundColor.primary['400']};
  --color-bg-secondary: ${theme.backgroundColor.secondary};
  --color-bg-tertiary: ${theme.backgroundColor.tertiary};
  --color-bg-inverse: ${theme.backgroundColor.inverse};

  --color-i-primary: ${theme.iconColor.primary};
  --color-i-secondary: ${theme.iconColor.secondary};

  --color-text-primary: ${theme.textColor.primary};
  --color-text-secondary: ${theme.textColor.secondary};
  --color-text-tertiary: ${theme.textColor.tertiary};

  --color-border-inverse: ${theme.borderColor.inverse};
  --color-border-secondary: ${theme.borderColor.secondary};
`;

const getThemeValues = theme =>
  theme === LIGHT ? lightThemeValues : darkThemeValues;

export default createGlobalStyle`
  body {
    ${({ theme }) => populateVars(getThemeValues(theme))}

    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
  }

  body:before {
    content:"";
    position:fixed;
    left:0;
    top:0;
    right:0;
    bottom:0;
    z-index:-1;
    background:var(--color-bg-secondary);
    background: linear-gradient(to bottom, ${({ theme }) =>
      getThemeValues(theme).backgroundColor.secondary},  ${({ theme }) =>
  getThemeValues(theme).backgroundColor.tertiary}) ;
  }
`;
