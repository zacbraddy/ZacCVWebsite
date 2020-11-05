import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-regular-svg-icons';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import ThemeStyles, { DARK, LIGHT } from './theme-styles';

export default () => {
  const [theme, setTheme] = useState(DARK);

  return (
    <>
      <ThemeStyles theme={theme} />
      <button
        className="fixed text-icon-primary focus:outline-none select-none px-8 py-8 top-0 left-0"
        onClick={() => setTheme(theme === DARK ? LIGHT : DARK)}
      >
        <FontAwesomeIcon icon={theme === DARK ? faMoon : faSun} size="lg" />
      </button>
    </>
  );
};
