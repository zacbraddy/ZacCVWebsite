import React from 'react';
import styled, { keyframes } from 'styled-components';

import PortraitImage from '../atoms/portrait-image';
import { container } from './container.module.css';

const fadeUpIn = keyframes`
  from {
    transform: translateY(1rem);
    opacity: 0;
  }

  to {
    transform: none;
    opacity: 1
  }
`;

const AnimatedContainer = styled.div`
  animation: ${fadeUpIn} 0.5s linear 1;
`;

export default ({ children }) => (
  <div className="h-full md:flex md:items-center">
    <AnimatedContainer
      className={`${container} transition h-full pt-4 md:pt-0 md:flex md:flex-grow md:mx-auto md:bg-primary-200`}
    >
      <div className="flex flex-col justify-start item-center md:flex-grow-0 md:w-64 md:mt-4">
        <PortraitImage />
        <div>Zac Braddy</div>
      </div>
      <div className="pt-32 bg-primary-400 rounded h-full md:flex-grow">
        {children}
      </div>
    </AnimatedContainer>
  </div>
);
