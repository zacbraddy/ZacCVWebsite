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
  },
  iconColor: {
    secondary: '#04b4e0',
  },
  textColor: {
    primary: '#fafafa',
  },
};

export const lightThemeValues = {
  backgroundColor: {
    primary: '#fafafa',
    secondary: '#04b4e0',
    tertiary: '#e0b404',
  },
  iconColor: {
    secondary: '#fafafa',
  },
  textColor: {
    primary: '#333',
  },
};

const populateVars = theme => `
  --color-bg-primary-200: ${theme.backgroundColor.primary['200']};
  --color-bg-primary-400: ${theme.backgroundColor.primary['400']};
  --color-bg-secondary: ${theme.backgroundColor.secondary};
  --color-bg-tertiary: ${theme.backgroundColor.tertiary};

  --color-i-secondary: ${theme.iconColor.secondary};

  --color-text-primary: ${theme.textColor.primary};
`;

export default createGlobalStyle`
  body {
    ${({ theme }) =>
      populateVars(theme === LIGHT ? lightThemeValues : darkThemeValues)}

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
    background: linear-gradient(to bottom, var(--color-bg-secondary), var(--color-bg-tertiary)) ;
  }
`;
