import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTerminal,
  faPencilRuler,
  faChalkboardTeacher,
  faPeopleCarry,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import Flicking from '@egjs/react-flicking';
import AbilityDescription from '../components/molecules/ability-description';
import Heading from '../components/atoms/heading';
import StatRow from '../components/atoms/stat-row';
import TestimonialPortrait from '../components/atoms/testimonial-portrait';

const Highlight = ({ children }) => (
  <span className="text-tertiary font-bold text-lg italic">{children}</span>
);

export default () => (
  <div className="px-4 py-8 grid grid-cols-1 gap-8">
    <Heading>
      About <span className="text-secondary">Me</span>
    </Heading>
    <div className="ml-4 lg:mx-8 grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2">
        <p>
          Hi there! My name is Zac Braddy, and I am a{' '}
          <Highlight>Lead Software Engineer</Highlight> with about eight years
          of experience. I'm super jazzed by great tech and awesome
          architecture. In case you're wondering how much I like doing the
          things I do with computers, well to put it simply;{' '}
          <Highlight>I'm super obsessed by tech</Highlight>. Put this way;
          sometimes, I feel like I might be a mutant code monkey sent back from
          the future.
        </p>
        <br />
        <p>
          But it's not just a good tech stack that excites me, when it comes
          down to it, what really excites me is working with great teams to
          deliver quality software, on time, to people who can use it to shape
          our future—and <Highlight>having fun while doing it!</Highlight>
        </p>
      </div>
      <div>
        <div className="sm:grid sm:grid-cols-2 lg:block">
          <div className="grid grid-rows-6">
            <StatRow subject="Age" value="35" />
            <StatRow subject="Residence" value="Nottingham, UK" />
            <StatRow subject="Nationality" value="Australian" />
            <StatRow
              subject="UK work permit"
              value={<FontAwesomeIcon icon={faCheck} />}
            />
            <StatRow subject="Phone" value="+447450 587 400" />
            <StatRow subject="Email" value="zacharybraddy&#0064;gmail.com" />
          </div>
        </div>
      </div>
    </div>
    <Heading>
      What <span className="text-secondary">I do</span>
    </Heading>
    <div className="grid gap-x-4 gap-y-8 lg:gap-y-16 lg:grid-cols-2">
      <AbilityDescription title="Software Engineering" icon={faTerminal}>
        <p>
          This varied experience has seen me working with a lot of different
          types of tech and engineering software in many different shapes and
          sizes. It's also allowed me to practice{' '}
          <Highlight>pragmatically delivering software</Highlight>, and this has
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
          these people have put into helping me succeed, that I must to pay it
          forward and <Highlight>help the next wave</Highlight> of software
          engineers to achieve their goals. I love to help developers behind me
          in this journey to <Highlight>come along with me.</Highlight>
        </p>
      </AbilityDescription>
      <AbilityDescription title="Leadership" icon={faPeopleCarry}>
        <p>
          Delivering software projects to the right level of quality and on-time
          is vital for any business but in startups like ones I've been{' '}
          <Highlight>helping to succeed</Highlight> this is especially true.
          Through good project management and providing the right level of
          support and encouragement to the teams I've worked with, I've been
          able to help lead them towards the{' '}
          <Highlight>best possible results</Highlight> for both the business and
          individual team members.
        </p>
      </AbilityDescription>
    </div>
    <Heading>Testimonials</Heading>
    <Flicking
      bound={true}
      freeScroll={true}
      hanger="50%"
      anchor="50%"
      autoResize={true}
    >
      <div className="panel w-64 h-94 lg:w-94 lg:h-80">
        <div className="anchor flex flex-col h-full">
          <div className="flex flex-col">
            <TestimonialPortrait portraitName="JamieTaylor" />
            <div className="flex flex-col text-sm italic border-2 border-secondary rounded p-2 pt-16 h-87 lg:h-68">
              Having worked with Zac on some informal projects, I can say that
              he's be an asset to any team if he brings as much enthusiasm and
              drive to those projects as he does to your team. He is constantly
              keeping me up to date with the latest developments in both the
              technologies he uses, and the systems he uses to support them. On
              top of that, Zac is one of the best positive motivators I have
              ever met.
              <div
                class="self-end pt-4 static not-italic font-bold text-secondary"
                style={{ bottom: '1rem' }}
              >
                - Jamie Taylor, Lead Contractor, RJJ Software
              </div>
            </div>
          </div>
        </div>
      </div>
    </Flicking>
  </div>
);
