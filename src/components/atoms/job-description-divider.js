import styled from 'styled-components';

export default styled.div`
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