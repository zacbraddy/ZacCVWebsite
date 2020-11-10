import React from 'react';

export default ({ subject, value }) => (
  <div className="flex justify-between w-full">
    <div className="text-secondary font-bold">{subject}</div>
    <div className="text-right">{value}</div>
  </div>
);
