import React from 'react';

const StatRow = ({ subject, value }) => (
  <div className="flex justify-between w-full">
    <div className="text-secondary font-bold">{subject}</div>
    <div className="text-right">{value}</div>
  </div>
);
export default StatRow;
