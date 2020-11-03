import { createGlobalStyle } from 'styled-components';

export const DARK = 'dark';
export const LIGHT = 'light';

export const darkThemeValues = {
  backgroundColor: {
    primary: '#333',
    secondary: '#04b4e0',
    tertiary: '#e0b404',
  },
  iconColor: {
    secondary: '#04b4e0',
  },
  textColor: {
    primary: '#fff',
  },
};

export const lightThemeValues = {
  backgroundColor: {
    primary: '#dadada',
    secondary: '#04b4e0',
  },
  iconColor: {
    secondary: '#dadada',
  },
  textColor: {
    primary: '#ddd',
  },
};

const populateVars = theme => `
  --color-bg-primary: ${theme.backgroundColor.primary};
  --color-bg-secondary: ${theme.backgroundColor.secondary};
  --color-bg-tertiary: ${theme.backgroundColor.tertiary};

  --color-i-secondary: ${theme.iconColor.secondary};

  --color-text-primary: ${theme.textColor.primary};
`;

export default createGlobalStyle`
  body {
    ${({ theme }) =>
      populateVars(theme === LIGHT ? lightThemeValues : darkThemeValues)}
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
