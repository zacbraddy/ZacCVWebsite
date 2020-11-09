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
        skills={[
          'Javascript',
          'Node JS',
          'Microservices',
          'Moleculer JS',
          'Ramda',
          'Jest',
          'Docker',
          'Kubernetes',
          'GCP',
          'React',
          'Svelte',
          'Tailwind CSS',
          'Joi',
          'Express JS',
          'MacOS',
          'Linux',
          'GNU Make',
          'Storybook',
          'CircleCI',
          'Kustomize',
          'ESLint',
          'Prettier',
        ]}
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
      <JobDescription
        startDate="Apr 2017"
        endDate="Jun 2018"
        companyName="RightIndem"
        jobTitle="Principle Developer"
        skills={[
          'C#/.NET',
          'Javascript',
          'Node JS',
          'Jest',
          'Azure',
          'React',
          'Styled Components',
          'SignalR',
          'Windows',
          'Redux',
          'Storybook',
          'CQRS',
          'NUnit',
          'Flow',
          'Prettier',
          'Stylecop',
          'ESLint',
        ]}
      >
        <p>
          I was brought into RightIndem as a Senior Developer after impressing
          them with my React-based blog "The Reactionary". Shortly before I
          completed my probation, RightIndem saw fit to promote me to Principal
          Developer. In this role, I lead a team of 5 developers who were
          heading up a project whose aim was to greenfield an application using
          leading-edge technology and it needed to be extensible, maintainable,
          robust and delivered on time. We chose to build an Event-driven CQRS
          based system to allow for a sleek and performant system allowing our
          UX experts to design the best possible experience for the user.
        </p>
        <p>
          On top of making decisions around the architecture of the system and
          ensuring the project got delivered on time my role also included
          several aspects of management including hiring new staff, mentoring
          and developing current staff and trying to keep team morale and
          productivity high.
        </p>
      </JobDescription>
    </div>
  );
};

export default ResumePage;
