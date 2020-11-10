import React, { useRef } from 'react';
import Flicking from '@egjs/react-flicking';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGreaterThan, faLessThan } from '@fortawesome/free-solid-svg-icons';

import Heading from '../atoms/heading';
import Testimonial from '../molecules/testimonial';

export default () => {
  const flickingRef = useRef();

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading>Testimonials</Heading>
        <div className="grid gap-2 grid-cols-2 mt-2">
          <button
            className="border bg-primary-200 rounded p-2 sm:py-2 sm:px-4 focus:outline-none"
            onClick={() => flickingRef.current.prev()}
          >
            <FontAwesomeIcon icon={faLessThan} />
          </button>
          <button
            className="border bg-primary-200 rounded p-2 sm:py-2 sm:px-4 focus:outline-none"
            onClick={() => flickingRef.current.next()}
          >
            <FontAwesomeIcon icon={faGreaterThan} />
          </button>
        </div>
      </div>
      <Flicking
        bound={true}
        freeScroll={true}
        hanger="50%"
        anchor="50%"
        gap={20}
        autoResize={true}
        ref={flickingRef}
      >
        <Testimonial
          portraitName="AllenUnderwood"
          author="Allen Underwood"
          jobTitle="Principal Software Engineer"
          company="Coding Blocks"
        >
          Zac Braddy is the type of developer that companies drool over. He has
          established himself in the industry as a published author and as the
          co-host of a software podcast. But what makes him stand apart from
          others in the industry is that he is a developer who learns quickly,
          is an excellent communicator, stays involved with the community and
          has the ability to lead.
        </Testimonial>
        <Testimonial
          portraitName="GeorgiaShaw"
          author="Georgia Shaw"
          jobTitle="Software Developer"
          company="Digital Theatre"
        >
          Over my first year as a developer, Zac’s mentorship and support has
          been invaluable. Whether he’s encouraging me to persevere through any
          topic I might be struggling with, or celebrating my successes, he
          approaches every issue with kindness and empathy. He’s a fantastic
          communicator and I feel extremely lucky to have him as a mentor.
        </Testimonial>
        <Testimonial
          portraitName="JayMiller"
          author="Jay Miller"
          jobTitle="Developer Advocate"
          company="Elastic"
        >
          Zac's focus on teaching and mentorship has guided me several times in
          my career. His longevity in the industry can prove he has the ability
          to code, but I think the key to his successes is the ability to
          magically make everyone around him better.
        </Testimonial>
        <Testimonial
          portraitName="JoeZack"
          author="Joe Zack"
          jobTitle="Principal Software Engineer"
          company="Broadcom Inc."
        >
          Count yourself lucky to work with Zac Braddy. He is incredibly bright
          and dedicated, and he puts his heart into everything he does. Even
          better, Zac amplifies the productivity of everyone around him through
          clear, concise communication. He doesn't just do amazing work, he
          improves the work of everyone else around him.
        </Testimonial>
        <Testimonial
          portraitName="JennyYang"
          author="Jenny Yang"
          jobTitle="Graduate Developer"
        >
          Zac is passionate, friendly and experienced software developer.
          Delighted to have worked with him and would love to again.
        </Testimonial>
        <Testimonial
          portraitName="JamieTaylor"
          author="Jamie Taylor"
          jobTitle="Lead Contractor"
          company="RJJ Software"
        >
          Having worked with Zac on some informal projects, I can say that he's
          be an asset to any team if he brings as much enthusiasm and drive to
          those projects as he does to your team. He is constantly keeping me up
          to date with the latest developments in both the technologies he uses,
          and the systems he uses to support them. On top of that, Zac is one of
          the best positive motivators I have ever met.
        </Testimonial>
      </Flicking>
    </>
  );
};
