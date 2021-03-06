import React from 'react';
import {
  faTerminal,
  faPencilRuler,
  faChalkboardTeacher,
  faPeopleCarry,
} from '@fortawesome/free-solid-svg-icons';
import AbilityDescription from '../molecules/ability-description';
import Highlight from '../atoms/highlight';
import Heading from '../atoms/heading';

const WhatIDo = () => (
  <>
    <Heading>
      What <span className="text-secondary">I do</span>
    </Heading>
    <div className="grid gap-x-4 gap-y-8 lg:gap-y-16 lg:grid-cols-2">
      <AbilityDescription title="Software Engineering" icon={faTerminal}>
        <p>
          My varied experience has seen me using lots of different types of tech
          to engineer software of many different shapes and sizes. It's also
          allowed me to practice{' '}
          <Highlight>pragmatically delivering software,</Highlight> and this has
          unlocked my ability to produce software at a high quality and in a
          timely fashion.
        </p>
      </AbilityDescription>
      <AbilityDescription title="Software Architecture" icon={faPencilRuler}>
        <p>
          I've spent a fair amount of time collecting practices and techniques
          for building{' '}
          <Highlight> highly scalable, maintainable and extensible</Highlight>{' '}
          software architecture that adheres to SOLID and DDD principles as well
          as others. I've also learned from experience that architecture is more
          than just stringing together boxes on a whiteboard in the right order.
        </p>
      </AbilityDescription>
      <AbilityDescription title="Mentorship" icon={faChalkboardTeacher}>
        <p>
          I owe a great deal of my success to the people who've invested their
          time and knowledge in me. I feel strongly that to honour the effort
          these people have put in, that I must pay it forward and{' '}
          <Highlight>help the next wave</Highlight> of software engineers to
          achieve their goals. I love to help developers behind me in this
          journey <Highlight>come along with me.</Highlight>
        </p>
      </AbilityDescription>
      <AbilityDescription title="Leadership" icon={faPeopleCarry}>
        <p>
          Delivering software projects to the right level of quality and on-time
          is vital for any business but in startups like the ones I've been{' '}
          <Highlight>helping to succeed</Highlight> this is especially true.
          Through good project management and providing the right level of
          support and encouragement to the teams I've worked with, I've been
          able to help lead them towards the{' '}
          <Highlight>best possible results</Highlight> for both the business and
          individual team members.
        </p>
      </AbilityDescription>
    </div>
  </>
);
export default WhatIDo;
