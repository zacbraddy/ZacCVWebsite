import React from 'react';

import SkillsList from '../molecules/skills-list';
import Divider from '../atoms/job-description-divider';

export default ({
  startDate,
  endDate,
  companyName,
  jobTitle,
  skills,
  children,
}) => (
  <div className="flex">
    <div className="mr-4 italic flex flex-col items-end text-sm hidden w-134 lg:block">
      <div className="font-bold">{`${startDate} - ${endDate}`}</div>
      <div>{companyName}</div>
    </div>
    <Divider className="static top-0 bottom-0 bg-tertiary" />
    <div className="grid grid-cols-1 gap-4 ml-8">
      <div className="italic flex flex-col items-start text-sm block lg:hidden">
        <div className="font-bold">{`${startDate} - ${endDate}`}</div>
        <div>{companyName}</div>
      </div>
      <div className="font-bold">{jobTitle}</div>
      <div className="grid grid-cols-1 gap-4 ml-4">
        {children}
        <SkillsList skills={skills} />
      </div>
    </div>
  </div>
);
