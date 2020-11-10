import React from 'react';

export default ({ className = '', children }) => (
  <h1 className={`${className} font-fancy-heading text-3xl xl:text-4xl`}>
    {children}
  </h1>
);
