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
        className="fixed text-gray-100 focus:outline-none select-none px-6 py-4 top-0 right-0"
        onClick={() => setTheme(theme === DARK ? LIGHT : DARK)}
      >
        <FontAwesomeIcon icon={theme === DARK ? faMoon : faSun} />
      </button>
    </>
  );
};
