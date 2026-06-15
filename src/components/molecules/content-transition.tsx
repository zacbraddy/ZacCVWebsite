'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import AnimateOnChange from '@/components/atoms/animate-on-change';

const ContentTransition = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  return (
    <AnimateOnChange
      className="h-full w-full"
      animationIn="fadeInUp"
      animationOut="bounceOut"
      durationIn={100}
      durationOut={100}
    >
      <div key={pathname} className="h-full">
        {children}
      </div>
    </AnimateOnChange>
  );
};

export default ContentTransition;
