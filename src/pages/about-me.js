import React from 'react';
import {
  faTerminal,
  faPencilRuler,
  faChalkboardTeacher,
  faPeopleCarry,
} from '@fortawesome/free-solid-svg-icons';
import AbilityDescription from '../components/molecules/ability-description';
import Heading from '../components/atoms/heading';

const Highlight = ({ children }) => (
  <span className="text-tertiary font-bold text-lg italic">{children}</span>
);

export default () => (
  <div className="px-4 py-8 grid grid-cols-1 gap-8">
    <Heading>
      About <span className="text-secondary">Me</span>
    </Heading>
    <div className="ml-4 lg:ml-8">
      <p>
        Hi there! My name is Zac Braddy, and I am a{' '}
        <Highlight>Lead Software Engineer</Highlight> with about eight years of
        experience. I'm super jazzed by great tech and awesome architecture. In
        case you're wondering how much I like doing the things I do with
        computers, well to put it simply;{' '}
        <Highlight>I'm super obsessed by tech</Highlight>. Put this way;
        sometimes, I feel like I might be a mutant code monkey sent back from
        the future.
      </p>
      <br />
      <p>
        But it's not just a good tech stack that excites me, when it comes down
        to it, what really excites me is working with great teams to deliver
        quality software, on time, to people who can use it to shape our
        future—and <Highlight>having fun while doing it!</Highlight>
      </p>
    </div>
    <div className="ml-4 lg:ml-8 grid grid-cols-3">
      <div className="text-secondary font-bold">
        <div>Age</div>
        <div>Residence</div>
        <div>Phone</div>
        <div>Email</div>
      </div>
      <div className="grid-col-span-2 whitespace-no-wrap">
        <div>35</div>
        <div>Nottingham, UK</div>
        <div className="w-full">+447450 587 400</div>
        <div>zacharybraddy&#0064;gmail.com</div>
      </div>
    </div>
    <Heading>
      What <span className="text-secondary">I do</span>
    </Heading>
    <AbilityDescription title="Software Engineering" icon={faTerminal}>
      <p>
        I started my career as a full-stack .NET developer I did this for about
        five years before making the jump to being full-stack javascript
        developer.
      </p>
      <p>
        This varied experience has seen me working with a lot of different types
        of tech and engineering software in many different shapes and sizes.
        It's also allowed me to practice{' '}
        <Highlight>pragmatically delivering software</Highlight>, and this has
        unlocked my ability to produce software at a high quality and in a
        timely fashion.
      </p>
    </AbilityDescription>
    <AbilityDescription title="Software Architecture" icon={faPencilRuler}>
      <p>
        I've spent the last eight years collecting a fair amount of practices
        and techniques for building{' '}
        <Highlight> highly scalable, maintainable and extensible</Highlight>{' '}
        software architecture that adheres to SOLID and DDD principles as well
        as others. I've tried my hand at creating everything from Monolithic,
        Microservices based, Event-driven and other types of architecture. Like
        a lot of people, it took me a long time to realise that Software
      </p>
      <p>
        I've also learned that architecture is more than just stringing together
        boxes on a diagram in the right order. The integrity of the
        architecture, once implemented, is also essential. Questions like "How
        will I know if the server goes down at 3 am?" and "How will I know if
        latency spikes suddenly?" are on my mind when creating a new solution
        architecture.
      </p>
    </AbilityDescription>
    <AbilityDescription title="Mentorship" icon={faChalkboardTeacher}>
      <p>
        I owe a great deal of my success to the people who've invested their
        time and knowledge in me. I feel strongly that to honour the effort
        these people have put into helping me succeed, that I must to pay it
        forward and <Highlight>help the next wave</Highlight> of software
        engineers to achieve their goals.
      </p>
      <p>
        I relish the opportunity to share what I know and learn new things from
        the people I mentor in kind. I do this in the roles I take at
        workplaces, as well as volunteering my time outside of work. Regardless
        of where it happens, I love to help developers behind me in this journey
        to <Highlight>come along with me.</Highlight>
      </p>
    </AbilityDescription>
    <AbilityDescription title="Leadership" icon={faPeopleCarry}>
      <p>
        Delivering software projects to the right level of quality and on-time
        is vital for any business but none more so than in startups like ones
        I've been <Highlight>helping to succeed</Highlight> for the last four
        years. In these environments, I believe that the key to success if
        hiring the right people and giving them the things they need to succeed
        and grow in their career.
      </p>
      <p>
        Through good project management and providing the right level of support
        and encouragement to the teams I've worked with, I've been able to help
        lead them towards the <Highlight>best possible results</Highlight> for
        both the business and more personally for the team members.
      </p>
    </AbilityDescription>
  </div>
);
