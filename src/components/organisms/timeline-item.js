import React from 'react';

import SkillsList from '../molecules/skills-list';
import Divider from '../atoms/timeline-divider';
import TimelineTimeCompany from '../atoms/timeline-time-company';

export default ({
  startDate,
  endDate,
  companyName,
  jobTitle,
  skills = [],
  children,
}) => (
  <div className="flex py-8">
    <TimelineTimeCompany
      startDate={startDate}
      endDate={endDate}
      companyName={companyName}
      inline={false}
    />
    <Divider className="static py-4 top-0 bottom-0 bg-tertiary" />
    <div className="grid grid-cols-1 gap-4 ml-8">
      <TimelineTimeCompany
        startDate={startDate}
        endDate={endDate}
        companyName={companyName}
        inline={true}
      />
      <div className="font-bold">{jobTitle}</div>
      <div className="grid grid-cols-1 gap-4 ml-4">
        {children}
        <SkillsList skills={skills} />
      </div>
    </div>
  </div>
);
