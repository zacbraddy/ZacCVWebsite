import React from 'react';
import styled, { keyframes } from 'styled-components';

import PortraitImage from '../atoms/portrait-image';
import { container, hero } from './container.module.css';

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
  <div className="h-full lg:flex lg:items-center font-sans xl:max-w-screen-xl xl:mx-auto">
    <AnimatedContainer
      className={`${container} transition h-full pt-4 lg:pt-0 lg:flex lg:flex-grow lg:mx-auto`}
    >
      <div
        className={`${hero} flex flex-col justify-start items-center lg:flex-grow-0 lg:w-72 lg:pt-12 lg:bg-primary-200 rounded-l lg:overflow-hidden`}
      >
        <PortraitImage />
        <div className="hidden text-lg flex-col items-center lg:flex lg:mt-8">
          <div>Zac Braddy</div>
          <div>Lead Software Engineer</div>
        </div>
      </div>
      <div className="pt-32 mb-4 bg-primary-400 rounded h-full xs:pt-20 sm:flex sm:items-center sm:justify-center sm:mb-2 md:pt-24 lg:flex-grow">
        {children}
      </div>
    </AnimatedContainer>
  </div>
);
