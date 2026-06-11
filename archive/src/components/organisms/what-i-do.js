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
          With experience across various technologies and project sizes, I've
          honed my ability to pragmatically{' '}
          <Highlight>
            deliver high-quality software in a timely manner
          </Highlight>
          .
        </p>
      </AbilityDescription>
      <AbilityDescription title="Software Architecture" icon={faPencilRuler}>
        <p>
          I've developed expertise in building{' '}
          <Highlight>
            scalable, maintainable, and extensible software architectures
          </Highlight>{' '}
          that adhere to SOLID and DDD principles. I've learned from experience
          that architecture is often more than just stringing together boxes on
          a whiteboard.
        </p>
      </AbilityDescription>
      <AbilityDescription title="Mentorship" icon={faChalkboardTeacher}>
        <p>
          I owe a great deal of my success to the people who've invested their
          time and knowledge in me. I'm passionate about{' '}
          <Highlight>paying this forward</Highlight> by helping other software
          engineers achieve their goals and develop their skills.
        </p>
      </AbilityDescription>
      <AbilityDescription title="Leadership" icon={faPeopleCarry}>
        <p>
          Delivering software projects to the right level of quality and on-time
          is vital for any business but in startups, like the ones I've been
          helping to succeed, this is especially true. I've led successful
          software projects in startups through{' '}
          <Highlight>
            effective project management, support, and encouragement of team
            members
          </Highlight>
          .
        </p>
      </AbilityDescription>
    </div>
  </>
);
export default WhatIDo;
