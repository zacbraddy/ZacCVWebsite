'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode, SyntheticEvent } from 'react';
import { animations } from '../animations';
import './animate-on-change.css';

type Phase = '' | 'out' | 'in';

type AnimateOnChangeProps = {
  children: ReactNode;
  animation?: string;
  animationIn?: string;
  animationOut?: string;
  changeKey?: unknown;
  className?: string;
  durationIn?: number;
  durationOut?: number;
  style?: CSSProperties;
};

const AnimateOnChange = ({
  animation: animationBaseName,
  animationIn = `${animationBaseName}In`,
  animationOut = `${animationBaseName}Out`,
  changeKey,
  children,
  className,
  durationOut = 200,
  style,
}: AnimateOnChangeProps) => {
  const [animation, setAnimation] = useState<Phase>('');
  const [displayContent, setDisplayContent] = useState<ReactNode>(children);
  const trigger = changeKey ?? children;
  const previousTrigger = useRef(trigger);

  useEffect(() => {
    if (previousTrigger.current === trigger) return;
    previousTrigger.current = trigger;
    setAnimation('out');
  }, [trigger]);

  const showDisplayContent = (event: SyntheticEvent) => {
    if (event.target !== event.currentTarget) return;
    if (animation === 'out') {
      setAnimation('in');
      setDisplayContent(children);
    }
  };

  const styles: CSSProperties = {
    display: 'inline-block',
    transition: className ? undefined : `opacity ${durationOut}ms ease-out`,
    opacity: !className && animation === 'out' ? 0 : 1,
    animationDuration: `${durationOut}ms`,
    ...style,
  };

  switch (animation) {
    case 'in':
      styles.animation = animations[animationIn] || animationIn;
      break;
    case 'out':
      styles.animation = animations[animationOut] || animationOut;
      break;
    default:
      styles.animation = animations[animationIn] || animationIn;
      break;
  }

  const baseClassName = className || 'animate-on-change';
  return (
    <div
      onTransitionEnd={showDisplayContent}
      onAnimationEnd={showDisplayContent}
      className={`${baseClassName} ${baseClassName}-${animation}`}
      style={styles}
    >
      {displayContent}
    </div>
  );
};

export default AnimateOnChange;
