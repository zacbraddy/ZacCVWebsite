import React from 'react';

const Heading = ({ className = '', children }) => (
  <h1 className={`${className} font-fancy-heading text-3xl xl:text-4xl`}>
    {children}
  </h1>
);
export default Heading;
