import React from 'react';

import Pill from '../atoms/pill';

export default ({ skills }) => (
  <div className="flex flex-flow-col flex-wrap">
    {skills.map((s, i) => (
      <Pill key={i}>{s}</Pill>
    ))}
  </div>
);
