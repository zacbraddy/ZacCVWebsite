import React from 'react';
import styled from 'styled-components';

import Heading from '../components/atoms/heading';

const Divider = styled.div`
  width: 1px;

  &:before {
    content: '';
    display: block;
    position: absolute;
    margin-top: 0.25rem;
    width: 1rem;
    height: 1rem;
    margin-left: -0.5rem;
    border-radius: 1rem;
    background-color: var(--color-bg-secondary);
    opacity: 0.25;
  }

  &:after {
    content: '';
    display: block;
    position: absolute;
    margin-top: 0.44rem;
    width: 0.63rem;
    height: 0.63rem;
    margin-left: -0.31rem;
    background-color: var(--color-bg-primary-400);
    border: 2px solid;
    border-color: var(--color-border-secondary);
    border-radius: 0.5rem;
    z-index: 10;
  }
`;

const ResumePage = () => {
  return (
    <div className="px-4 py-8 grid grid-cols-1 gap-8">
      <Heading className="text-secondary">Resume</Heading>
      <Heading>Experience</Heading>
      <div className="flex">
        <div className="mr-8">
          <div>Jun 2018 - Present</div>
          <div>Koodoo Mortgage Limited</div>
        </div>
        <Divider className="static top-0 bottom-0 bg-tertiary" />
        <div className="ml-8">Lorem ipsum</div>
      </div>
    </div>
  );
};

export default ResumePage;
