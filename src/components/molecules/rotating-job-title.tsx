'use client';

import { useEffect, useState } from 'react';
import AnimateOnChange from '@/components/atoms/animate-on-change';
import config from '@/config';

const ROTATION_INTERVAL = 4000;

const RotatingJobTitle = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const rotate = setInterval(() => {
      setIndex(i => (i >= config.JOB_TITLES.length - 1 ? 0 : i + 1));
    }, ROTATION_INTERVAL);

    return () => {
      clearInterval(rotate);
    };
  }, []);

  return (
    <AnimateOnChange durationOut={750} changeKey={index}>
      <div className="text-tertiary sm:text-2xl">
        {config.JOB_TITLES[index]}
      </div>
    </AnimateOnChange>
  );
};

export default RotatingJobTitle;
