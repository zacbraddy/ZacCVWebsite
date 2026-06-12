'use client';

import { useTheme } from 'next-themes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-regular-svg-icons';
import { faSun } from '@fortawesome/free-solid-svg-icons';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      className="fixed text-icon-primary focus:outline-none select-none px-8 py-8 top-0 left-0"
      aria-label={
        resolvedTheme === 'light'
          ? 'Switch to dark mode'
          : 'Switch to light mode'
      }
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <FontAwesomeIcon
        icon={resolvedTheme === 'light' ? faSun : faMoon}
        size="lg"
      />
    </button>
  );
}
