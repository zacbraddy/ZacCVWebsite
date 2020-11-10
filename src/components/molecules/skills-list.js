import React from 'react';

import Pill from '../atoms/pill';

export default ({ skills }) => (
  <div className="flex flex-flow-col flex-wrap">
    {skills.sort().map((s, i) => (
      <Pill key={i}>{s}</Pill>
    ))}
  </div>
);
