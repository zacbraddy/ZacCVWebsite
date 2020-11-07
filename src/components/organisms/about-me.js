import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import StatRow from '../atoms/stat-row';
import Highlight from '../atoms/highlight';
import Heading from '../atoms/heading';

export default () => (
  <>
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
  </>
);
