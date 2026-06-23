'use client';

import { useSyncExternalStore } from 'react';
import { PacmanLoader } from 'react-spinners';
import config from '@/config';

const subscribe = (onChange: () => void) => {
  document.addEventListener('readystatechange', onChange);
  return () => document.removeEventListener('readystatechange', onChange);
};

const getSnapshot = () => document.readyState === 'complete';

const getServerSnapshot = () => false;

const LoadingSpinner = () => {
  const ready = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (ready) return null;

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center"
      style={{ background: 'var(--color-bg-inverse)' }}
    >
      <div className="grid grid-rows-2 h-24">
        <div className="flex items-center justify-center mr-8">
          <PacmanLoader size={25} color="var(--color-text-tertiary)" />
        </div>
        <div className="mt-12 text-secondary font-bold text-lg flex flex-col items-center justify-center">
          <div>Zac Braddy</div>
          <div>{config.JOB_TITLE}</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
