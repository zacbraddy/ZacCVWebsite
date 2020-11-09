import React from 'react';

import SkillsList from '../molecules/skills-list';
import Divider from '../atoms/job-description-divider';
import JobDescriptionTimeCompany from '../atoms/job-description-time-company';

export default ({
  startDate,
  endDate,
  companyName,
  jobTitle,
  skills,
  children,
}) => (
  <div className="flex">
    <JobDescriptionTimeCompany
      startDate={startDate}
      endDate={endDate}
      companyName={companyName}
      inline={false}
    />
    <Divider className="static top-0 bottom-0 bg-tertiary" />
    <div className="grid grid-cols-1 gap-4 ml-8">
      <JobDescriptionTimeCompany
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
