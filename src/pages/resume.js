import React from 'react';

import Heading from '../components/atoms/heading';
import Experience from '../components/organisms/experience';
import Certifications from '../components/organisms/certifications';
import SkillsList from '../components/molecules/skills-list';

const ResumePage = () => {
  return (
    <div className="px-4 py-8 grid grid-cols-1 gap-8">
      <Heading className="text-secondary">Resume</Heading>
      <Heading>Experience</Heading>
      <Experience />
      <div className="md:grid md:grid-cols-2 gap-4">
        <div className="grid grid-cols-1 gap-4">
          <Heading>Certifications</Heading>
          <Certifications />
        </div>
        <div>
          <Heading>
            Other Skills/<span className="text-secondary">Knowledge</span>
          </Heading>
          <div className="pt-4">
            <SkillsList
              skills={[
                'Agile',
                'Shape up',
                'TDD',
                'BDD',
                'DDD',
                'Evolutionary Architecture',
                'Fitness functions',
                'SOLID',
                'Programatic Programming Principles',
                'Public Speaking',
                'Leadership',
                'Time management',
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
