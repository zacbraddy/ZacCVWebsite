'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-regular-svg-icons';
import { faSun } from '@fortawesome/free-solid-svg-icons';

const subscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const isLight = mounted && resolvedTheme === 'light';

  return (
    <button
      className="fixed text-icon-primary focus:outline-none select-none px-8 py-8 top-0 left-0"
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      {mounted && <FontAwesomeIcon icon={isLight ? faSun : faMoon} size="lg" />}
    </button>
  );
}
