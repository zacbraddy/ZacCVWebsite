'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { CustomScroll } from 'react-custom-scroll';
import AnimateOnChange from '@/components/atoms/animate-on-change';
import FrozenRouter from '@/components/atoms/frozen-router';
import './content-transition.module.css';

const ContentTransition = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const scrollRef = useRef<CustomScroll>(null);

  useEffect(() => {
    scrollRef.current?.getScrolledElement()?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <AnimateOnChange
      className="h-full w-full"
      animationIn="fadeInUp"
      animationOut="bounceOut"
      durationIn={100}
      durationOut={100}
      changeKey={pathname}
    >
      <CustomScroll
        ref={scrollRef}
        heightRelativeToParent="calc(100% - 20px)"
        addScrolledClass
      >
        <div key={pathname} className="h-full">
          <FrozenRouter>{children}</FrozenRouter>
        </div>
      </CustomScroll>
    </AnimateOnChange>
  );
};

export default ContentTransition;
