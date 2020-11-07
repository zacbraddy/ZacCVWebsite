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
