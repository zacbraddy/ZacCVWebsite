import React, { useEffect, useState, useRef } from 'react';
import { animations } from '../animations.js';
import './animate-on-change.css';

const AnimateOnChange = ({
  animation: animationBaseName,
  animationIn = `${animationBaseName}In`,
  animationOut = `${animationBaseName}Out`,
  children,
  className,
  durationOut,
  style,
}) => {
  const [animation, setAnimation] = useState('');
  const [displayContent, setDisplayContent] = useState(children);
  const firstUpdate = useRef(true);

  useEffect(() => {
    // Don't run the effect the first time through
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    setAnimation('out');
  }, [children]);

  const showDisplayContent = () => {
    if (animation === 'out') {
      setAnimation('in');
      setDisplayContent(children);
    }
  };

  const styles = {
    display: 'inline-block',
    transition: !className && `opacity ${durationOut}ms ease-out`,
    opacity: !className && animation === 'out' ? 0 : 1,
    animationDuration: durationOut + 'ms',
    ...style,
  };

  switch (animation) {
    case 'in':
      styles.animation = animations[animationIn] || animationIn;
      break;
    case 'out':
      styles.animation = animations[animationOut] || animationOut;
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

AnimateOnChange.defaultProps = {
  durationOut: 200,
};

AnimateOnChange.displayName = 'AnimateOnChange';

export default AnimateOnChange;
