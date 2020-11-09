import React from 'react';

import Heading from '../components/atoms/heading';
import JobDescription from '../components/organisms/job-description';

const ResumePage = () => {
  return (
    <div className="px-4 py-8 grid grid-cols-1 gap-8">
      <Heading className="text-secondary">Resume</Heading>
      <Heading>Experience</Heading>
      <JobDescription
        startDate="Jun 2018"
        endDate="Present"
        companyName="Koodoo Mortgages Limited"
        jobTitle="Lead Software Engineer"
        skills={['Javascript', 'Node JS']}
      >
        <p>
          I joined Koodoo as one of the first four development hires and played
          the role of Lead Software Engineer. During my time there, I worked
          with the team to develop a state of the art microservices system. This
          system allowed Koodoo to take full advantage of their pedigree in the
          mortgage market having pivoted out of other mortgage-related ventures
          shortly after I joined their former company Dynamo.
        </p>
        <p>
          I spent my time at Koodoo creating and cultivating the software
          architecture as well as playing a lead role in implementing it. At the
          same time, the team and I worked to collective improve our knowledge
          and skill as we gradually improved the software. The result of was a
          system the was "dressed to impress" when it hit the board rooms of our
          potential customers. We moved quickly at Koodoo, but we took steps to
          secure our future while we did it.
        </p>
      </JobDescription>
    </div>
  );
};

export default ResumePage;
